import { NextRequest, NextResponse } from 'next/server';

// Twilio credentials (for signature validation if needed later)
const TWILIO_SID = process.env.TWILIO_SID;

// Telegram — OpenClaw bot
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN_OPENCLAW || process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_GROUP_ID = '-1003873786581';

// Routing: phone numbers → Telegram topic IDs
// Topic 11 = Rachel Hansen operations
// Topic 0 (general) = fallback
const PHONE_ROUTING: Record<string, { topic: number; label: string }> = {
  // Add known client numbers here as they come in
  // '2085551234': { topic: 11, label: 'Rachel - Client Name' },
};

// Default: send to Jeff's DM and Rachel's topic
const DEFAULT_TOPIC = 11; // Rachel's operations channel

function normalizePhone(phone: string): string {
  let p = phone.replace(/\D/g, '');
  if (p.length === 11 && p.startsWith('1')) p = p.slice(1);
  return p;
}

function formatPhone(phone: string): string {
  const p = normalizePhone(phone);
  if (p.length === 10) {
    return `(${p.slice(0, 3)}) ${p.slice(3, 6)}-${p.slice(6)}`;
  }
  return phone;
}

async function sendTelegram(chatId: string, text: string, topicId?: number): Promise<boolean> {
  if (!TELEGRAM_BOT_TOKEN) {
    console.error('No Telegram bot token configured');
    return false;
  }

  const body: Record<string, unknown> = {
    chat_id: chatId,
    text,
    parse_mode: 'HTML',
  };

  if (topicId && topicId > 0) {
    body.message_thread_id = topicId;
  }

  const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.text();
    console.error('Telegram send failed:', err);
    return false;
  }

  return true;
}

// Twilio sends inbound SMS as form-encoded POST
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const from = formData.get('From') as string || '';
    const body = formData.get('Body') as string || '';
    const numMedia = parseInt(formData.get('NumMedia') as string || '0', 10);
    const normalizedPhone = normalizePhone(from);
    const prettyPhone = formatPhone(from);

    console.log('📨 Inbound SMS:', { from: normalizedPhone, body, numMedia });

    // Look up routing
    const route = PHONE_ROUTING[normalizedPhone];
    const topicId = route?.topic ?? DEFAULT_TOPIC;
    const label = route?.label ?? prettyPhone;

    // Build Telegram notification
    let message = `📱 <b>Inbound SMS</b>\n`;
    message += `<b>From:</b> ${label}\n`;
    if (route?.label) {
      message += `<b>Phone:</b> ${prettyPhone}\n`;
    }
    message += `\n${escapeHtml(body)}`;

    if (numMedia > 0) {
      message += `\n\n📎 <i>${numMedia} attachment(s) — check Twilio console</i>`;
    }

    message += `\n\n<i>Reply via: send-sms.sh ${from} "your message"</i>`;

    // Send to the appropriate Telegram topic
    await sendTelegram(TELEGRAM_GROUP_ID, message, topicId);

    // Also notify Jeff's DM for visibility (if not already going to his DM)
    // Uncomment if you want DM copies:
    // await sendTelegram('7448321777', message);

    // Return empty TwiML — no auto-reply to the sender
    return new NextResponse(
      '<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
      { headers: { 'Content-Type': 'text/xml' } }
    );
  } catch (error) {
    console.error('Inbound SMS error:', error);
    return new NextResponse(
      '<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
      { headers: { 'Content-Type': 'text/xml' } }
    );
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Health check
export async function GET() {
  return NextResponse.json({
    status: 'SMS gateway active',
    mode: 'forward-to-telegram',
    autoReply: false,
  });
}
