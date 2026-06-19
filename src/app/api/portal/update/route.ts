import { createHmac } from 'crypto';
import { after, NextRequest, NextResponse } from 'next/server';
import { getPortalSessionClientId } from '@/lib/portal/auth';
import { portalClients } from '@/lib/portal/data';
import { createPortalMessage, type PortalMessage } from '@/lib/portal/store';

// Portal updates should be handled by the durable portal inbox first.
// Only send an optional backup Telegram ping when portal-specific credentials are configured.
// This avoids routing portal updates through the older site-wide Spark bot token.
const TELEGRAM_BOT_TOKEN = process.env.PORTAL_TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.PORTAL_TELEGRAM_CHAT_ID;
const TELEGRAM_THREAD_ID = process.env.PORTAL_TELEGRAM_THREAD_ID;
const TRIAGE_WEBHOOK_URL = process.env.PORTAL_TRIAGE_WEBHOOK_URL;
const TRIAGE_WEBHOOK_SECRET = process.env.PORTAL_TRIAGE_WEBHOOK_SECRET;

const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000;
const RATE_LIMIT_MAX_UPDATES = 15;
const rateLimitBuckets = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(clientId: string) {
  const nowMs = Date.now();
  const existing = rateLimitBuckets.get(clientId);
  if (!existing || existing.resetAt <= nowMs) {
    rateLimitBuckets.set(clientId, { count: 1, resetAt: nowMs + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (existing.count >= RATE_LIMIT_MAX_UPDATES) {
    return { allowed: false, retryAfterSeconds: Math.ceil((existing.resetAt - nowMs) / 1000) };
  }

  existing.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

function schedulePortalFanout({
  clientName,
  senderName,
  kind,
  cardTitle,
  message,
  savedMessage,
}: {
  clientName: string;
  senderName?: string;
  kind: string;
  cardTitle?: string;
  message: string;
  savedMessage: PortalMessage;
}) {
  after(async () => {
    const notificationResults = await Promise.allSettled([
      notifyBlaze({ clientName, senderName, kind, cardTitle, message }),
      triagePortalMessage(savedMessage),
    ]);

    notificationResults.forEach((result, index) => {
      if (result.status === 'rejected') {
        console.error(index === 0 ? 'Portal Telegram notification crashed:' : 'Portal triage notification crashed:', result.reason);
      }
    });
  });
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function notifyBlaze({
  clientName,
  kind,
  cardTitle,
  message,
  senderName,
}: {
  clientName: string;
  senderName?: string;
  kind: string;
  cardTitle?: string;
  message: string;
}) {
  const text = [
    '🔥 <b>Portal update</b>',
    '',
    `<b>Client:</b> ${escapeHtml(clientName)}`,
    senderName ? `<b>From:</b> ${escapeHtml(senderName)}` : '',
    `<b>Type:</b> ${kind === 'new-item' ? 'New item' : 'Reply/update'}`,
    cardTitle ? `<b>Item:</b> ${escapeHtml(cardTitle)}` : '',
    '',
    escapeHtml(message),
  ]
    .filter(Boolean)
    .join('\n');

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.log('Portal update saved to inbox:', { clientName, kind, cardTitle, message });
    return;
  }

  const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      message_thread_id: TELEGRAM_THREAD_ID ? Number(TELEGRAM_THREAD_ID) : undefined,
      text,
      parse_mode: 'HTML',
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    console.error('Telegram portal notification failed:', body);
  }
}

async function triagePortalMessage(message: PortalMessage) {
  if (!TRIAGE_WEBHOOK_URL || !TRIAGE_WEBHOOK_SECRET) {
    console.log('Portal triage webhook not configured:', { messageId: message.id, clientId: message.clientId });
    return;
  }

  const payload = {
    event_type: 'portal_update',
    messageId: message.id,
    clientId: message.clientId,
    clientName: message.clientName,
    senderName: message.senderName || '',
    kind: message.kind,
    cardId: message.cardId || '',
    cardTitle: message.cardTitle || '',
    message: message.message,
    status: message.status,
    createdAt: message.createdAt,
  };
  const rawBody = JSON.stringify(payload);
  const signature = createHmac('sha256', TRIAGE_WEBHOOK_SECRET).update(rawBody).digest('hex');

  const response = await fetch(TRIAGE_WEBHOOK_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Webhook-Signature': signature,
      'X-Request-ID': message.id,
    },
    body: rawBody,
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    console.error('Portal triage webhook failed:', { status: response.status, body: body.slice(0, 500), messageId: message.id });
  }
}

export async function POST(request: NextRequest) {
  try {
    const clientId = await getPortalSessionClientId();
    if (!clientId) {
      return NextResponse.json({ error: 'Please sign in again.' }, { status: 401 });
    }

    const client = portalClients.find((item) => item.id === clientId);
    if (!client) {
      return NextResponse.json({ error: 'Workspace not found.' }, { status: 404 });
    }

    const rateLimit = checkRateLimit(clientId);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many portal updates. Please wait a few minutes and try again.' },
        { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfterSeconds) } },
      );
    }

    const body = await request.json().catch(() => null);
    const kind = body?.kind === 'new-item' ? 'new-item' : 'reply';
    const senderName = String(body?.senderName || '').trim().slice(0, 120);
    const message = String(body?.message || '').trim();
    const cardTitle = body?.cardTitle ? String(body.cardTitle).trim().slice(0, 160) : undefined;

    if (message.length < 3) {
      return NextResponse.json({ error: 'Add a little more detail before sending.' }, { status: 400 });
    }

    if (senderName.length < 2) {
      return NextResponse.json({ error: 'Add your name before sending.' }, { status: 400 });
    }

    if (message.length > 5000) {
      return NextResponse.json({ error: 'That is too long. Send a shorter update.' }, { status: 400 });
    }

    const savedMessage = await createPortalMessage({
      clientId,
      clientName: client.name,
      senderName,
      kind,
      cardId: body?.cardId ? String(body.cardId).trim().slice(0, 160) : undefined,
      cardTitle,
      message,
    });

    schedulePortalFanout({
      clientName: client.name,
      senderName,
      kind,
      cardTitle,
      message,
      savedMessage,
    });

    return NextResponse.json({ ok: true, message: savedMessage });
  } catch (error) {
    console.error('Portal update error:', error);
    return NextResponse.json({ error: 'Could not send that update. Try again.' }, { status: 500 });
  }
}
