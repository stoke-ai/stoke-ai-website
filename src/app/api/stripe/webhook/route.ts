import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '7448321777';

function verifyStripeSignature(payload: string, signatureHeader: string, secret: string) {
  const parts = signatureHeader.split(',').reduce<Record<string, string[]>>((acc, part) => {
    const [key, value] = part.split('=');
    if (!key || !value) return acc;
    acc[key] = [...(acc[key] || []), value];
    return acc;
  }, {});

  const timestamp = parts.t?.[0];
  const signatures = parts.v1 || [];
  if (!timestamp || signatures.length === 0) return false;

  const signedPayload = `${timestamp}.${payload}`;
  const expected = crypto.createHmac('sha256', secret).update(signedPayload).digest('hex');

  return signatures.some((sig) => {
    const a = Buffer.from(sig, 'hex');
    const b = Buffer.from(expected, 'hex');
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  });
}

async function notifyPaid(session: any) {
  if (!TELEGRAM_BOT_TOKEN) return;
  const meta = session.metadata || {};
  const amount = typeof session.amount_total === 'number' ? `$${(session.amount_total / 100).toFixed(2)}` : 'Unknown';

  const text = `✅ *AI Impact Audit Paid*\n\n*Amount:* ${amount}\n*Name:* ${meta.name || 'Unknown'}\n*Email:* ${meta.email || session.customer_details?.email || 'Not provided'}\n*Phone:* ${meta.phone || 'Not provided'}\n*Business:* ${meta.business || 'Not specified'}\n*Pain Point:* ${meta.painPoint || 'Not specified'}\n${meta.website ? `*Website:* ${meta.website}\n` : ''}\nNext step: prospect should book calendar time from the success page.`;

  await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text, parse_mode: 'Markdown' }),
  }).catch(() => {});
}

export async function POST(request: NextRequest) {
  const payload = await request.text();
  const signature = request.headers.get('stripe-signature') || '';

  if (!STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing STRIPE_WEBHOOK_SECRET' }, { status: 503 });
  }

  if (!verifyStripeSignature(payload, signature, STRIPE_WEBHOOK_SECRET)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const event = JSON.parse(payload);
  if (event.type === 'checkout.session.completed') {
    await notifyPaid(event.data.object);
  }

  return NextResponse.json({ received: true });
}
