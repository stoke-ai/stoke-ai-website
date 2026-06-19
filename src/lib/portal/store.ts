import { promises as fs } from 'fs';
import os from 'os';
import path from 'path';
import { get, put } from '@vercel/blob';
import postgres from 'postgres';
import type { PortalBoard, PortalCard, PortalStage } from './data';

export type PortalMessageStatus = 'new' | 'seen' | 'replied' | 'converted' | 'closed';
export type PortalActivityType = 'client-update' | 'blaze-reply' | 'status-change' | 'progress-note';
export type PortalNotificationType = 'client-reply' | 'progress-note' | 'action-required' | 'board-update';
export type PortalNotificationStatus = 'paused' | 'ready' | 'sent' | 'failed';

export type PortalMessage = {
  id: string;
  clientId: string;
  clientName: string;
  senderName?: string;
  kind: 'reply' | 'new-item';
  cardId?: string;
  cardTitle?: string;
  message: string;
  status: PortalMessageStatus;
  createdAt: string;
  updatedAt: string;
  blazeReply?: string;
  progressNote?: string;
};

export type PortalActivity = {
  id: string;
  clientId: string;
  cardId?: string;
  cardTitle?: string;
  type: PortalActivityType;
  text: string;
  createdAt: string;
  visibleToClient: boolean;
};

export type PortalStoredBoard = {
  clientId: string;
  stages: PortalStage[];
  updatedAt: string;
};

export type PortalNotification = {
  id: string;
  clientId: string;
  clientName: string;
  type: PortalNotificationType;
  status: PortalNotificationStatus;
  subject: string;
  preview: string;
  portalUrl: string;
  actionRequired: boolean;
  messageId?: string;
  cardId?: string;
  cardTitle?: string;
  recipients: Array<{ name?: string; email?: string; role?: string }>;
  createdAt: string;
  sentAt?: string;
  error?: string;
};

type PortalStore = {
  messages: PortalMessage[];
  activity: PortalActivity[];
  boards: Record<string, PortalStoredBoard>;
  notifications: PortalNotification[];
};

const STORE_PATH = process.env.PORTAL_STORE_PATH || path.join(os.tmpdir(), 'stoke-portal-store.json');
const BLOB_STORE_PATH = 'portal-store/store.json';
const databaseUrl = process.env.DATABASE_URL || process.env.Database_url;

let sqlClient: postgres.Sql | null = null;
let schemaReady: Promise<void> | null = null;

function shouldUseDatabaseStore() {
  if (process.env.PORTAL_STORE_PATH) return false;
  return Boolean(databaseUrl);
}

function shouldUseBlobStore() {
  if (process.env.PORTAL_STORE_PATH || shouldUseDatabaseStore()) return false;
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID || process.env.VERCEL_OIDC_TOKEN);
}

function assertStoreBackendAvailable() {
  if (shouldUseDatabaseStore() || shouldUseBlobStore() || process.env.PORTAL_STORE_PATH || process.env.NODE_ENV !== 'production') return;
  throw new Error('A durable portal store is required in production. Configure DATABASE_URL, Vercel Blob, or PORTAL_STORE_PATH before accepting portal updates.');
}

function db() {
  if (!databaseUrl) throw new Error('DATABASE_URL is required for the portal database store.');
  sqlClient ??= postgres(databaseUrl, { max: 5, ssl: 'require' });
  return sqlClient;
}

async function ensureSchema() {
  if (!shouldUseDatabaseStore()) return;

  schemaReady ??= (async () => {
    const sql = db();
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
  })();

  await schemaReady;
}

function emptyStore(): PortalStore {
  return { messages: [], activity: [], boards: {}, notifications: [] };
}

function normalizeStore(parsed: Partial<PortalStore>): PortalStore {
  return {
    messages: Array.isArray(parsed.messages) ? parsed.messages : [],
    activity: Array.isArray(parsed.activity) ? parsed.activity : [],
    boards: parsed.boards && typeof parsed.boards === 'object' && !Array.isArray(parsed.boards) ? parsed.boards : {},
    notifications: Array.isArray(parsed.notifications) ? parsed.notifications : [],
  };
}

function normalizeCard(card: Partial<PortalCard>, fallbackClientName: string): PortalCard {
  return {
    id: String(card.id || makeId('card')),
    client: String(card.client || fallbackClientName),
    title: String(card.title || 'Untitled priority').trim() || 'Untitled priority',
    status: String(card.status || 'Active').trim() || 'Active',
    detail: String(card.detail || 'Add the client-facing detail for this priority.').trim() || 'Add the client-facing detail for this priority.',
    action: card.action?.trim() || undefined,
    updatedAt: card.updatedAt || now(),
  };
}

function normalizeStage(stage: Partial<PortalStage>, fallbackStage: PortalStage, fallbackClientName: string): PortalStage {
  const cards = Array.isArray(stage.cards) ? stage.cards : [];
  return {
    ...fallbackStage,
    title: stage.title || fallbackStage.title,
    tone: stage.tone || fallbackStage.tone,
    cards: cards.map((card) => normalizeCard(card, fallbackClientName)),
  };
}

async function streamToText(stream: ReadableStream<Uint8Array>) {
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

function now() {
  return new Date().toISOString();
}

function makeId(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
}

function toIso(value: Date | string) {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function messageFromRow(row: Record<string, unknown>): PortalMessage {
  return {
    id: String(row.id),
    clientId: String(row.client_id),
    clientName: String(row.client_name),
    senderName: row.sender_name ? String(row.sender_name) : undefined,
    kind: row.kind === 'new-item' ? 'new-item' : 'reply',
    cardId: row.card_id ? String(row.card_id) : undefined,
    cardTitle: row.card_title ? String(row.card_title) : undefined,
    message: String(row.message),
    status: String(row.status) as PortalMessageStatus,
    createdAt: toIso(row.created_at as Date | string),
    updatedAt: toIso(row.updated_at as Date | string),
    blazeReply: row.blaze_reply ? String(row.blaze_reply) : undefined,
    progressNote: row.progress_note ? String(row.progress_note) : undefined,
  };
}

function activityFromRow(row: Record<string, unknown>): PortalActivity {
  return {
    id: String(row.id),
    clientId: String(row.client_id),
    cardId: row.card_id ? String(row.card_id) : undefined,
    cardTitle: row.card_title ? String(row.card_title) : undefined,
    type: String(row.type) as PortalActivityType,
    text: String(row.text),
    createdAt: toIso(row.created_at as Date | string),
    visibleToClient: Boolean(row.visible_to_client),
  };
}

function notificationFromRow(row: Record<string, unknown>): PortalNotification {
  return {
    id: String(row.id),
    clientId: String(row.client_id),
    clientName: String(row.client_name),
    type: String(row.type) as PortalNotificationType,
    status: String(row.status) as PortalNotificationStatus,
    subject: String(row.subject),
    preview: String(row.preview),
    portalUrl: String(row.portal_url),
    actionRequired: Boolean(row.action_required),
    messageId: row.message_id ? String(row.message_id) : undefined,
    cardId: row.card_id ? String(row.card_id) : undefined,
    cardTitle: row.card_title ? String(row.card_title) : undefined,
    recipients: Array.isArray(row.recipients) ? (row.recipients as PortalNotification['recipients']) : [],
    createdAt: toIso(row.created_at as Date | string),
    sentAt: row.sent_at ? toIso(row.sent_at as Date | string) : undefined,
    error: row.error ? String(row.error) : undefined,
  };
}

async function readStore(): Promise<PortalStore> {
  assertStoreBackendAvailable();

  if (shouldUseDatabaseStore()) {
    await ensureSchema();
    const sql = db();
    const [messages, activity, boards, notifications] = await Promise.all([
      sql`select * from portal_messages order by created_at desc`,
      sql`select * from portal_activity order by created_at desc`,
      sql`select * from portal_boards`,
      sql`select * from portal_notifications order by created_at desc`,
    ]);

    return {
      messages: messages.map((row) => messageFromRow(row)),
      activity: activity.map((row) => activityFromRow(row)),
      boards: Object.fromEntries(
        boards.map((row) => [
          String(row.client_id),
          {
            clientId: String(row.client_id),
            stages: row.stages as PortalStage[],
            updatedAt: toIso(row.updated_at as Date | string),
          },
        ]),
      ),
      notifications: notifications.map((row) => notificationFromRow(row)),
    };
  }

  if (shouldUseBlobStore()) {
    const blob = await get(BLOB_STORE_PATH, { access: 'private', useCache: false });
    if (!blob?.stream) return emptyStore();

    const raw = await streamToText(blob.stream);
    const parsed = JSON.parse(raw) as Partial<PortalStore>;
    return normalizeStore(parsed);
  }

  try {
    const raw = await fs.readFile(STORE_PATH, 'utf8');
    const parsed = JSON.parse(raw) as Partial<PortalStore>;
    return normalizeStore(parsed);
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code === 'ENOENT') return emptyStore();
    throw error;
  }
}

async function writeStore(store: PortalStore) {
  assertStoreBackendAvailable();

  if (shouldUseDatabaseStore()) {
    await ensureSchema();
    const sql = db();
    await sql.begin(async (tx) => {
      await tx`delete from portal_notifications`;
      await tx`delete from portal_boards`;
      await tx`delete from portal_activity`;
      await tx`delete from portal_messages`;

      for (const message of store.messages) {
        await tx`
          insert into portal_messages (
            id, client_id, client_name, sender_name, kind, card_id, card_title, message,
            status, blaze_reply, progress_note, created_at, updated_at
          ) values (
            ${message.id}, ${message.clientId}, ${message.clientName}, ${message.senderName ?? null}, ${message.kind}, ${message.cardId ?? null},
            ${message.cardTitle ?? null}, ${message.message}, ${message.status}, ${message.blazeReply ?? null}, ${message.progressNote ?? null},
            ${message.createdAt}, ${message.updatedAt}
          )
        `;
      }

      for (const activity of store.activity) {
        await tx`
          insert into portal_activity (id, client_id, card_id, card_title, type, text, visible_to_client, created_at)
          values (${activity.id}, ${activity.clientId}, ${activity.cardId ?? null}, ${activity.cardTitle ?? null}, ${activity.type}, ${activity.text}, ${activity.visibleToClient}, ${activity.createdAt})
        `;
      }

      for (const board of Object.values(store.boards)) {
        await tx`
          insert into portal_boards (client_id, stages, updated_at)
          values (${board.clientId}, ${tx.json(board.stages)}, ${board.updatedAt})
        `;
      }

      for (const notification of store.notifications) {
        await tx`
          insert into portal_notifications (
            id, client_id, client_name, type, status, subject, preview, portal_url, action_required,
            message_id, card_id, card_title, recipients, created_at, sent_at, error
          ) values (
            ${notification.id}, ${notification.clientId}, ${notification.clientName}, ${notification.type}, ${notification.status}, ${notification.subject},
            ${notification.preview}, ${notification.portalUrl}, ${notification.actionRequired}, ${notification.messageId ?? null}, ${notification.cardId ?? null},
            ${notification.cardTitle ?? null}, ${tx.json(notification.recipients)}, ${notification.createdAt}, ${notification.sentAt ?? null}, ${notification.error ?? null}
          )
        `;
      }
    });
    return;
  }

  if (shouldUseBlobStore()) {
    await put(BLOB_STORE_PATH, JSON.stringify(store, null, 2), {
      access: 'private',
      allowOverwrite: true,
      contentType: 'application/json',
      cacheControlMaxAge: 60,
    });
    return;
  }

  await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
  await fs.writeFile(STORE_PATH, JSON.stringify(store, null, 2));
}

export async function createPortalMessage(input: {
  clientId: string;
  clientName: string;
  senderName?: string;
  kind: 'reply' | 'new-item';
  cardId?: string;
  cardTitle?: string;
  message: string;
}) {
  const timestamp = now();
  const message: PortalMessage = {
    id: makeId('msg'),
    clientId: input.clientId,
    clientName: input.clientName,
    senderName: input.senderName,
    kind: input.kind,
    cardId: input.cardId,
    cardTitle: input.cardTitle,
    message: input.message,
    status: 'new',
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  const activity: PortalActivity = {
    id: makeId('act'),
    clientId: input.clientId,
    cardId: input.cardId,
    cardTitle: input.cardTitle,
    type: 'client-update',
    text: input.message,
    createdAt: timestamp,
    visibleToClient: true,
  };

  if (shouldUseDatabaseStore()) {
    await ensureSchema();
    const sql = db();
    await sql.begin(async (tx) => {
      await tx`
        insert into portal_messages (
          id, client_id, client_name, sender_name, kind, card_id, card_title, message,
          status, created_at, updated_at
        ) values (
          ${message.id}, ${message.clientId}, ${message.clientName}, ${message.senderName ?? null}, ${message.kind},
          ${message.cardId ?? null}, ${message.cardTitle ?? null}, ${message.message}, ${message.status}, ${message.createdAt}, ${message.updatedAt}
        )
      `;
      await tx`
        insert into portal_activity (id, client_id, card_id, card_title, type, text, visible_to_client, created_at)
        values (${activity.id}, ${activity.clientId}, ${activity.cardId ?? null}, ${activity.cardTitle ?? null}, ${activity.type}, ${activity.text}, ${activity.visibleToClient}, ${activity.createdAt})
      `;
    });
    return message;
  }

  const store = await readStore();
  store.messages.push(message);
  store.activity.push(activity);
  await writeStore(store);
  return message;
}

export async function listPortalMessages(clientId?: string) {
  if (shouldUseDatabaseStore()) {
    await ensureSchema();
    const sql = db();
    const rows = clientId
      ? await sql`select * from portal_messages where client_id = ${clientId} order by created_at desc`
      : await sql`select * from portal_messages order by created_at desc`;
    return rows.map((row) => messageFromRow(row));
  }

  const store = await readStore();
  const messages = clientId ? store.messages.filter((message) => message.clientId === clientId) : store.messages;
  return messages.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function listPortalActivity(clientId: string, cardId?: string) {
  if (shouldUseDatabaseStore()) {
    await ensureSchema();
    const sql = db();
    const rows = cardId
      ? await sql`select * from portal_activity where client_id = ${clientId} and card_id = ${cardId} and visible_to_client = true order by created_at desc`
      : await sql`select * from portal_activity where client_id = ${clientId} and visible_to_client = true order by created_at desc`;
    return rows.map((row) => activityFromRow(row));
  }

  const store = await readStore();
  return store.activity
    .filter((item) => item.clientId === clientId && item.visibleToClient)
    .filter((item) => !cardId || item.cardId === cardId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getLatestPortalMessage(clientId: string, cardId?: string) {
  const messages = await listPortalMessages(clientId);
  return messages.find((message) => (cardId ? message.cardId === cardId : !message.cardId)) ?? null;
}

export async function updatePortalMessage(
  id: string,
  updates: {
    status?: PortalMessageStatus;
    blazeReply?: string;
    progressNote?: string;
  },
) {
  if (shouldUseDatabaseStore()) {
    await ensureSchema();
    const sql = db();
    const rows = await sql.begin(async (tx) => {
      const existingRows = await tx`select * from portal_messages where id = ${id} for update`;
      if (!existingRows.length) return [];

      const message = messageFromRow(existingRows[0]);
      const timestamp = now();
      const previousStatus = message.status;
      const nextStatus = updates.status ?? (updates.blazeReply?.trim() ? 'replied' : message.status);
      const nextBlazeReply = updates.blazeReply?.trim() || message.blazeReply || null;
      const nextProgressNote = updates.progressNote?.trim() || message.progressNote || null;

      await tx`
        update portal_messages
        set status = ${nextStatus}, blaze_reply = ${nextBlazeReply}, progress_note = ${nextProgressNote}, updated_at = ${timestamp}
        where id = ${id}
      `;

      if (updates.blazeReply?.trim()) {
        await tx`
          insert into portal_activity (id, client_id, card_id, card_title, type, text, visible_to_client, created_at)
          values (${makeId('act')}, ${message.clientId}, ${message.cardId ?? null}, ${message.cardTitle ?? null}, 'blaze-reply', ${updates.blazeReply.trim()}, true, ${timestamp})
        `;
      }

      if (updates.progressNote?.trim()) {
        await tx`
          insert into portal_activity (id, client_id, card_id, card_title, type, text, visible_to_client, created_at)
          values (${makeId('act')}, ${message.clientId}, ${message.cardId ?? null}, ${message.cardTitle ?? null}, 'progress-note', ${updates.progressNote.trim()}, true, ${timestamp})
        `;
      }

      if (updates.status && updates.status !== previousStatus) {
        await tx`
          insert into portal_activity (id, client_id, card_id, card_title, type, text, visible_to_client, created_at)
          values (${makeId('act')}, ${message.clientId}, ${message.cardId ?? null}, ${message.cardTitle ?? null}, 'status-change', ${`Blaze marked this ${updates.status}.`}, true, ${timestamp})
        `;
      }

      return tx`select * from portal_messages where id = ${id}`;
    });
    return rows.length ? messageFromRow(rows[0] as unknown as Record<string, unknown>) : null;
  }

  const store = await readStore();
  const message = store.messages.find((item) => item.id === id);
  if (!message) return null;

  const timestamp = now();
  const previousStatus = message.status;
  message.status = updates.status ?? message.status;
  message.blazeReply = updates.blazeReply?.trim() || message.blazeReply;
  message.progressNote = updates.progressNote?.trim() || message.progressNote;
  message.updatedAt = timestamp;

  if (updates.blazeReply?.trim()) {
    store.activity.push({
      id: makeId('act'),
      clientId: message.clientId,
      cardId: message.cardId,
      cardTitle: message.cardTitle,
      type: 'blaze-reply',
      text: updates.blazeReply.trim(),
      createdAt: timestamp,
      visibleToClient: true,
    });
    if (!updates.status) message.status = 'replied';
  }

  if (updates.progressNote?.trim()) {
    store.activity.push({
      id: makeId('act'),
      clientId: message.clientId,
      cardId: message.cardId,
      cardTitle: message.cardTitle,
      type: 'progress-note',
      text: updates.progressNote.trim(),
      createdAt: timestamp,
      visibleToClient: true,
    });
  }

  if (updates.status && updates.status !== previousStatus) {
    store.activity.push({
      id: makeId('act'),
      clientId: message.clientId,
      cardId: message.cardId,
      cardTitle: message.cardTitle,
      type: 'status-change',
      text: `Blaze marked this ${message.status}.`,
      createdAt: timestamp,
      visibleToClient: true,
    });
  }

  await writeStore(store);
  return message;
}

export async function createPortalNotification(input: {
  clientId: string;
  clientName: string;
  type: PortalNotificationType;
  status: PortalNotificationStatus;
  subject: string;
  preview: string;
  portalUrl: string;
  actionRequired: boolean;
  recipients: Array<{ name?: string; email?: string; role?: string }>;
  messageId?: string;
  cardId?: string;
  cardTitle?: string;
  error?: string;
}) {
  const timestamp = now();
  const notification: PortalNotification = {
    id: makeId('ntf'),
    clientId: input.clientId,
    clientName: input.clientName,
    type: input.type,
    status: input.status,
    subject: input.subject,
    preview: input.preview,
    portalUrl: input.portalUrl,
    actionRequired: input.actionRequired,
    recipients: input.recipients,
    messageId: input.messageId,
    cardId: input.cardId,
    cardTitle: input.cardTitle,
    createdAt: timestamp,
    sentAt: input.status === 'sent' ? timestamp : undefined,
    error: input.error,
  };

  if (shouldUseDatabaseStore()) {
    await ensureSchema();
    const sql = db();
    await sql`
      insert into portal_notifications (
        id, client_id, client_name, type, status, subject, preview, portal_url, action_required,
        message_id, card_id, card_title, recipients, created_at, sent_at, error
      ) values (
        ${notification.id}, ${notification.clientId}, ${notification.clientName}, ${notification.type}, ${notification.status}, ${notification.subject},
        ${notification.preview}, ${notification.portalUrl}, ${notification.actionRequired}, ${notification.messageId ?? null}, ${notification.cardId ?? null},
        ${notification.cardTitle ?? null}, ${sql.json(notification.recipients)}, ${notification.createdAt}, ${notification.sentAt ?? null}, ${notification.error ?? null}
      )
    `;
    return notification;
  }

  const store = await readStore();
  store.notifications.push(notification);
  await writeStore(store);
  return notification;
}

export async function listPortalNotifications(clientId?: string) {
  if (shouldUseDatabaseStore()) {
    await ensureSchema();
    const sql = db();
    const rows = clientId
      ? await sql`select * from portal_notifications where client_id = ${clientId} order by created_at desc`
      : await sql`select * from portal_notifications order by created_at desc`;
    return rows.map((row) => notificationFromRow(row));
  }

  const store = await readStore();
  const notifications = clientId ? store.notifications.filter((item) => item.clientId === clientId) : store.notifications;
  return notifications.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getEditablePortalBoard(fallbackBoard: PortalBoard): Promise<PortalBoard> {
  if (shouldUseDatabaseStore()) {
    await ensureSchema();
    const sql = db();
    const rows = await sql`select * from portal_boards where client_id = ${fallbackBoard.client.id}`;
    const saved = rows[0];
    if (!saved) return fallbackBoard;

    return {
      ...fallbackBoard,
      source: 'internal',
      lastUpdated: toIso(saved.updated_at as Date | string),
      stages: fallbackBoard.stages.map((fallbackStage) => {
        const savedStage = (saved.stages as PortalStage[]).find((stage) => stage.id === fallbackStage.id);
        return normalizeStage(savedStage || fallbackStage, fallbackStage, fallbackBoard.client.name);
      }),
      activity: [
        `${fallbackBoard.client.name} board is managed from the Stoke AI admin portal.`,
        'Client-visible cards, priorities, and needed inputs can be edited without code changes.',
        ...fallbackBoard.activity.slice(0, 2),
      ],
    };
  }

  const store = await readStore();
  const saved = store.boards[fallbackBoard.client.id];
  if (!saved) return fallbackBoard;

  return {
    ...fallbackBoard,
    source: 'internal',
    lastUpdated: saved.updatedAt,
    stages: fallbackBoard.stages.map((fallbackStage) => {
      const savedStage = saved.stages.find((stage) => stage.id === fallbackStage.id);
      return normalizeStage(savedStage || fallbackStage, fallbackStage, fallbackBoard.client.name);
    }),
    activity: [
      `${fallbackBoard.client.name} board is managed from the Stoke AI admin portal.`,
      'Client-visible cards, priorities, and needed inputs can be edited without code changes.',
      ...fallbackBoard.activity.slice(0, 2),
    ],
  };
}

export async function saveEditablePortalBoard(input: PortalBoard): Promise<PortalBoard> {
  const timestamp = now();
  const stages = input.stages.map((stage) => ({
    ...stage,
    cards: stage.cards.map((card) => ({
      ...normalizeCard(card, input.client.name),
      updatedAt: timestamp,
    })),
  }));

  if (shouldUseDatabaseStore()) {
    await ensureSchema();
    const sql = db();
    await sql.begin(async (tx) => {
      await tx`
        insert into portal_boards (client_id, stages, updated_at)
        values (${input.client.id}, ${tx.json(stages)}, ${timestamp})
        on conflict (client_id) do update set stages = excluded.stages, updated_at = excluded.updated_at
      `;
      await tx`
        insert into portal_activity (id, client_id, type, text, visible_to_client, created_at)
        values (${makeId('act')}, ${input.client.id}, 'progress-note', 'Stoke AI updated the client-visible portal board.', false, ${timestamp})
      `;
    });

    return {
      ...input,
      source: 'internal',
      lastUpdated: timestamp,
      stages,
    };
  }

  const store = await readStore();
  store.boards[input.client.id] = {
    clientId: input.client.id,
    stages,
    updatedAt: timestamp,
  };

  store.activity.push({
    id: makeId('act'),
    clientId: input.client.id,
    type: 'progress-note',
    text: 'Stoke AI updated the client-visible portal board.',
    createdAt: timestamp,
    visibleToClient: false,
  });

  await writeStore(store);

  return {
    ...input,
    source: 'internal',
    lastUpdated: timestamp,
    stages,
  };
}

export async function importPortalStoreSnapshot(store: PortalStore) {
  await writeStore(normalizeStore(store));
}
