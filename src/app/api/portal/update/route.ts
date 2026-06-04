import { NextRequest, NextResponse } from 'next/server';
import { getPortalSessionClientId } from '@/lib/portal/auth';
import { portalClients } from '@/lib/portal/data';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '7448321777';

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
}: {
  clientName: string;
  kind: string;
  cardTitle?: string;
  message: string;
}) {
  const text = [
    '🔥 <b>Portal update</b>',
    '',
    `<b>Client:</b> ${escapeHtml(clientName)}`,
    `<b>Type:</b> ${kind === 'new-item' ? 'New item' : 'Reply/update'}`,
    cardTitle ? `<b>Item:</b> ${escapeHtml(cardTitle)}` : '',
    '',
    escapeHtml(message),
  ]
    .filter(Boolean)
    .join('\n');

  if (!TELEGRAM_BOT_TOKEN) {
    console.log('Portal update received:', { clientName, kind, cardTitle, message });
    return;
  }

  const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text, parse_mode: 'HTML' }),
  });

  if (!response.ok) {
    const body = await response.text();
    console.error('Telegram portal notification failed:', body);
    throw new Error('Notification failed');
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

    const body = await request.json().catch(() => null);
    const kind = body?.kind === 'new-item' ? 'new-item' : 'reply';
    const message = String(body?.message || '').trim();
    const cardTitle = body?.cardTitle ? String(body.cardTitle).trim().slice(0, 160) : undefined;

    if (message.length < 3) {
      return NextResponse.json({ error: 'Add a little more detail before sending.' }, { status: 400 });
    }

    if (message.length > 5000) {
      return NextResponse.json({ error: 'That is too long. Send a shorter update.' }, { status: 400 });
    }

    await notifyBlaze({ clientName: client.name, kind, cardTitle, message });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Portal update error:', error);
    return NextResponse.json({ error: 'Could not send that update. Try again.' }, { status: 500 });
  }
}
