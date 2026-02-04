import { NextRequest, NextResponse } from 'next/server';

// Twilio credentials (from Vercel env vars)
const TWILIO_SID = process.env.TWILIO_SID;
const TWILIO_AUTH = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_FROM = '+18557915002';
const VOICE_WEBHOOK = 'https://stoke-ai.com/api/voice/welcome';

// Telegram for notifications
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '7448321777';

async function sendSMS(to: string, name: string) {
  if (!TWILIO_AUTH) {
    console.error('Missing TWILIO_AUTH_TOKEN');
    return false;
  }
  
  // Format phone number
  let phone = to.replace(/\D/g, '');
  if (phone.length === 10) phone = '1' + phone;
  if (!phone.startsWith('+')) phone = '+' + phone;
  
  const message = `Hey ${name}! 👋 This is Spark from Stoke-AI. Thanks for reaching out about AI for your business! I just sent you an email with some ideas - check your inbox! Reply here if you have any quick questions. - Jeff's AI assistant`;
  
  const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${TWILIO_SID}/Messages.json`, {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + Buffer.from(`${TWILIO_SID}:${TWILIO_AUTH}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      To: phone,
      From: TWILIO_FROM,
      Body: message,
    }),
  });
  
  const result = await response.json();
  console.log('SMS result:', result.sid || result.message);
  return response.ok;
}

async function makeCall(to: string, name: string) {
  if (!TWILIO_AUTH) {
    console.error('Missing TWILIO_AUTH_TOKEN');
    return false;
  }
  
  // Format phone number
  let phone = to.replace(/\D/g, '');
  if (phone.length === 10) phone = '1' + phone;
  if (!phone.startsWith('+')) phone = '+' + phone;
  
  const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${TWILIO_SID}/Calls.json`, {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + Buffer.from(`${TWILIO_SID}:${TWILIO_AUTH}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      To: phone,
      From: TWILIO_FROM,
      Url: `${VOICE_WEBHOOK}?name=${encodeURIComponent(name)}`,
    }),
  });
  
  const result = await response.json();
  console.log('Call result:', result.sid || result.message);
  return response.ok;
}

async function notifyTelegram(name: string, email: string, phone: string, business: string, website: string, message: string, smsOk: boolean, callOk: boolean) {
  if (!TELEGRAM_BOT_TOKEN) return;
  
  const actions = [];
  if (phone) {
    actions.push(smsOk ? '✅ SMS sent' : '❌ SMS failed');
    actions.push(callOk ? '✅ Voice call triggered' : '❌ Call failed');
  } else {
    actions.push('📵 No phone provided');
  }
  actions.push('📧 Send personalized email via gog');
  
  const text = `🔥 *New Lead from stoke-ai.com!*

*Name:* ${name}
*Email:* ${email}
*Phone:* ${phone || 'Not provided'}
*Business:* ${business}
${website ? `*Website:* ${website}` : ''}
${message ? `*Message:* ${message}` : ''}

${actions.join('\n')}`;

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

export async function POST(request: NextRequest) {
  try {
    // FormSubmit sends form data, not JSON
    const contentType = request.headers.get('content-type') || '';
    let data: Record<string, string>;
    
    if (contentType.includes('application/json')) {
      data = await request.json();
    } else {
      const formData = await request.formData();
      data = Object.fromEntries(formData.entries()) as Record<string, string>;
    }
    
    const { name, email, phone, business, website, message } = data;
    
    console.log('New lead:', { name, email, phone, business });
    
    let smsOk = false;
    let callOk = false;
    
    // If phone provided, send SMS and make call
    if (phone) {
      // Send SMS immediately
      smsOk = await sendSMS(phone, name || 'there');
      
      // Small delay then call (2 seconds)
      await new Promise(resolve => setTimeout(resolve, 2000));
      callOk = await makeCall(phone, name || 'there');
    }
    
    // Notify Jeff via Telegram
    await notifyTelegram(
      name || 'Unknown',
      email || 'Not provided',
      phone || '',
      business || 'Not specified',
      website || '',
      message || '',
      smsOk,
      callOk
    );

    return NextResponse.json({ success: true, message: 'Lead processed' });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Failed to process lead' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: 'Lead webhook active', version: '2.0' });
}
// v3.0 - Direct form submission, no FormSubmit dependency
