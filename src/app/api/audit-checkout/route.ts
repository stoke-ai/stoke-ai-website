import { NextRequest, NextResponse } from 'next/server';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_AUDIT_PRICE_ID = process.env.STRIPE_AUDIT_PRICE_ID;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '7448321777';

const AUDIT_AMOUNT_CENTS = 100_000;
const AUDIT_NAME = 'Stoke AI Impact Audit';

function getBaseUrl(request: NextRequest) {
  const configured = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (configured) return configured.startsWith('http') ? configured : `https://${configured}`;
  return request.nextUrl.origin;
}

async function notifyCheckoutStarted(data: Record<string, string>) {
  if (!TELEGRAM_BOT_TOKEN) return;

  const text = `💳 *AI Impact Audit Checkout Started*\n\n*Name:* ${data.name || 'Unknown'}\n*Email:* ${data.email || 'Not provided'}\n*Phone:* ${data.phone || 'Not provided'}\n*Business:* ${data.business || 'Not specified'}\n*Pain Point:* ${data.painPoint || 'Not specified'}\n${data.website ? `*Website:* ${data.website}\n` : ''}\nWaiting on Stripe payment completion.`;

  await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text, parse_mode: 'Markdown' }),
  }).catch(() => {});
}

export async function POST(request: NextRequest) {
  if (!STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: 'Stripe is not configured yet. Missing STRIPE_SECRET_KEY.' },
      { status: 503 }
    );
  }

  const body = await request.json();
  const name = String(body.name || '').trim();
  const email = String(body.email || '').trim();
  const phone = String(body.phone || '').trim();
  const business = String(body.business || '').trim();
  const website = String(body.website || '').trim();
  const painPoint = String(body.painPoint || '').trim();

  if (!name || !email || !business) {
    return NextResponse.json({ error: 'Name, email, and business are required.' }, { status: 400 });
  }

  const baseUrl = getBaseUrl(request);
  const metadata = { name, email, phone, business, website, painPoint };

  const params = new URLSearchParams({
    mode: 'payment',
    success_url: `${baseUrl}/audit-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/#contact`,
    customer_email: email,
    'client_reference_id': `${Date.now()}_${email}`,
    'metadata[name]': name,
    'metadata[email]': email,
    'metadata[phone]': phone,
    'metadata[business]': business,
    'metadata[website]': website,
    'metadata[painPoint]': painPoint,
    'payment_intent_data[metadata][name]': name,
    'payment_intent_data[metadata][email]': email,
    'payment_intent_data[metadata][phone]': phone,
    'payment_intent_data[metadata][business]': business,
    'payment_intent_data[metadata][website]': website,
    'payment_intent_data[metadata][painPoint]': painPoint,
  });

  if (STRIPE_AUDIT_PRICE_ID) {
    params.set('line_items[0][price]', STRIPE_AUDIT_PRICE_ID);
    params.set('line_items[0][quantity]', '1');
  } else {
    params.set('line_items[0][price_data][currency]', 'usd');
    params.set('line_items[0][price_data][unit_amount]', String(AUDIT_AMOUNT_CENTS));
    params.set('line_items[0][price_data][product_data][name]', AUDIT_NAME);
    params.set('line_items[0][price_data][product_data][description]', '$1,000 flat-fee operational audit. If Stoke AI does not find $5,000+ in annual waste/opportunity, the audit is refunded.');
    params.set('line_items[0][quantity]', '1');
  }

  const stripeRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params,
  });

  const session = await stripeRes.json();
  if (!stripeRes.ok) {
    console.error('Stripe checkout error:', session);
    return NextResponse.json({ error: session.error?.message || 'Stripe checkout failed.' }, { status: 502 });
  }

  await notifyCheckoutStarted(metadata);
  return NextResponse.json({ url: session.url });
}
