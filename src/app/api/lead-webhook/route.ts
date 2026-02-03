import { NextRequest, NextResponse } from 'next/server';

// This endpoint receives form submissions and notifies via Telegram
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '7448321777';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { name, email, business, website, message } = data;

    // Send Telegram notification
    if (TELEGRAM_BOT_TOKEN) {
      const text = `🔥 *New Lead from Stoke-AI!*

*Name:* ${name}
*Email:* ${email}
*Business:* ${business}
${website ? `*Website:* ${website}` : ''}
${message ? `*Message:* ${message}` : ''}

_Reply to this to have Spark send a personalized email._`;

      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text,
          parse_mode: 'Markdown',
        }),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: 'Lead webhook active' });
}
