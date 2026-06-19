/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const { get } = require('@vercel/blob');
const postgres = require('postgres');

function loadEnvFile(path) {
  if (!fs.existsSync(path)) return;
  for (const line of fs.readFileSync(path, 'utf8').split(/\r?\n/)) {
    if (!line || line.trimStart().startsWith('#') || !line.includes('=')) continue;
    const [key, ...valueParts] = line.split('=');
    if (!key || process.env[key]) continue;
    let value = valueParts.join('=');
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
}

loadEnvFile('.env.production.local');

const BLOB_STORE_PATH = 'portal-store/store.json';
const databaseUrl = process.env.DATABASE_URL || process.env.Database_url;

function normalizeStore(parsed) {
  return {
    messages: Array.isArray(parsed?.messages) ? parsed.messages : [],
    activity: Array.isArray(parsed?.activity) ? parsed.activity : [],
    boards: parsed?.boards && typeof parsed.boards === 'object' && !Array.isArray(parsed.boards) ? parsed.boards : {},
    notifications: Array.isArray(parsed?.notifications) ? parsed.notifications : [],
  };
}

async function streamToText(stream) {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let text = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    text += decoder.decode(value, { stream: true });
  }
  text += decoder.decode();
  return text;
}

async function ensureSchema(sql) {
  await sql`
    create table if not exists portal_messages (
      id text primary key,
      client_id text not null,
      client_name text not null,
      sender_name text,
      kind text not null,
      card_id text,
      card_title text,
      message text not null,
      status text not null,
      blaze_reply text,
      progress_note text,
      created_at timestamptz not null,
      updated_at timestamptz not null
    )
  `;
  await sql`create index if not exists portal_messages_client_created_idx on portal_messages (client_id, created_at desc)`;
  await sql`
    create table if not exists portal_activity (
      id text primary key,
      client_id text not null,
      card_id text,
      card_title text,
      type text not null,
      text text not null,
      visible_to_client boolean not null,
      created_at timestamptz not null
    )
  `;
  await sql`create index if not exists portal_activity_client_created_idx on portal_activity (client_id, created_at desc)`;
  await sql`
    create table if not exists portal_boards (
      client_id text primary key,
      stages jsonb not null,
      updated_at timestamptz not null
    )
  `;
  await sql`
    create table if not exists portal_notifications (
      id text primary key,
      client_id text not null,
      client_name text not null,
      type text not null,
      status text not null,
      subject text not null,
      preview text not null,
      portal_url text not null,
      action_required boolean not null,
      message_id text,
      card_id text,
      card_title text,
      recipients jsonb not null,
      created_at timestamptz not null,
      sent_at timestamptz,
      error text
    )
  `;
  await sql`create index if not exists portal_notifications_client_created_idx on portal_notifications (client_id, created_at desc)`;
}

async function main() {
  if (!databaseUrl) throw new Error('DATABASE_URL is required.');
  const blob = await get(BLOB_STORE_PATH, { access: 'private', useCache: false });
  const store = blob?.stream ? normalizeStore(JSON.parse(await streamToText(blob.stream))) : normalizeStore({});
  const sql = postgres(databaseUrl, { max: 3, ssl: 'require' });
  await ensureSchema(sql);

  await sql.begin(async (tx) => {
    for (const message of store.messages) {
      await tx`
        insert into portal_messages (
          id, client_id, client_name, sender_name, kind, card_id, card_title, message,
          status, blaze_reply, progress_note, created_at, updated_at
        ) values (
          ${message.id}, ${message.clientId}, ${message.clientName}, ${message.senderName ?? null}, ${message.kind}, ${message.cardId ?? null},
          ${message.cardTitle ?? null}, ${message.message}, ${message.status}, ${message.blazeReply ?? null}, ${message.progressNote ?? null},
          ${message.createdAt}, ${message.updatedAt}
        ) on conflict (id) do nothing
      `;
    }

    for (const activity of store.activity) {
      await tx`
        insert into portal_activity (id, client_id, card_id, card_title, type, text, visible_to_client, created_at)
        values (${activity.id}, ${activity.clientId}, ${activity.cardId ?? null}, ${activity.cardTitle ?? null}, ${activity.type}, ${activity.text}, ${Boolean(activity.visibleToClient)}, ${activity.createdAt})
        on conflict (id) do nothing
      `;
    }

    for (const board of Object.values(store.boards)) {
      await tx`
        insert into portal_boards (client_id, stages, updated_at)
        values (${board.clientId}, ${tx.json(board.stages)}, ${board.updatedAt})
        on conflict (client_id) do update set stages = excluded.stages, updated_at = excluded.updated_at
      `;
    }

    for (const notification of store.notifications) {
      await tx`
        insert into portal_notifications (
          id, client_id, client_name, type, status, subject, preview, portal_url, action_required,
          message_id, card_id, card_title, recipients, created_at, sent_at, error
        ) values (
          ${notification.id}, ${notification.clientId}, ${notification.clientName}, ${notification.type}, ${notification.status}, ${notification.subject},
          ${notification.preview}, ${notification.portalUrl}, ${Boolean(notification.actionRequired)}, ${notification.messageId ?? null}, ${notification.cardId ?? null},
          ${notification.cardTitle ?? null}, ${tx.json(notification.recipients || [])}, ${notification.createdAt}, ${notification.sentAt ?? null}, ${notification.error ?? null}
        ) on conflict (id) do nothing
      `;
    }
  });

  const [messageCount] = await sql`select count(*)::int as count from portal_messages`;
  const [activityCount] = await sql`select count(*)::int as count from portal_activity`;
  const [boardCount] = await sql`select count(*)::int as count from portal_boards`;
  const [notificationCount] = await sql`select count(*)::int as count from portal_notifications`;
  await sql.end();
  console.log(JSON.stringify({
    importedFromBlob: {
      messages: store.messages.length,
      activity: store.activity.length,
      boards: Object.keys(store.boards).length,
      notifications: store.notifications.length,
    },
    databaseTotals: {
      messages: messageCount.count,
      activity: activityCount.count,
      boards: boardCount.count,
      notifications: notificationCount.count,
    },
  }, null, 2));
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
