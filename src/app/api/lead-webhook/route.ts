import { NextRequest, NextResponse } from 'next/server';

// Twilio credentials (from Vercel env vars)
const TWILIO_SID = process.env.TWILIO_SID;
const TWILIO_AUTH = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_FROM = '+18557915002';
const VOICE_WEBHOOK = 'https://stoke-ai.com/api/voice/welcome';

// Resend for emails
const RESEND_API_KEY = process.env.RESEND_API_KEY;

// Telegram for notifications
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '7448321777';

async function sendEmail(to: string, name: string, business: string) {
  if (!RESEND_API_KEY) {
    console.error('Missing RESEND_API_KEY');
    return false;
  }

  const firstName = name.split(' ')[0] || 'there';
  
  const html = `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
  <p>Hey ${firstName}!</p>
  
  <p>Thanks for reaching out about AI for your business. I'm Jeff from Stoke-AI, and I help local businesses in the Magic Valley actually <em>use</em> AI to save time and grow.</p>
  
  <p>I'd love to learn more about ${business || 'your business'} and what you're hoping to accomplish. A few quick questions:</p>
  
  <ol>
    <li><strong>What does your business do?</strong> (I want to make sure my suggestions are relevant)</li>
    <li><strong>What's eating up most of your time right now?</strong></li>
    <li><strong>Have you tried any AI tools yet?</strong> Or is this all new territory?</li>
  </ol>
  
  <p>Most businesses I work with find <strong>10-15 hours/week</strong> of tasks that AI can handle — things like follow-ups, scheduling, answering common questions, etc.</p>
  
  <p>Want to hop on a quick 15-minute call this week? I can share some specific ideas based on what you tell me.</p>
  
  <p>Just reply to this email or text me back at the number that just reached out.</p>
  
  <p>Talk soon,<br>
  <strong>Jeff Stoker</strong><br>
  Stoke-AI<br>
  <em>The Magic Valley's AI Guy</em></p>
  
  <p style="margin-top: 20px;">
    <a href="https://stoke-ai.com" style="text-decoration: none;">
      <img src="https://stoke-ai.com/stoke-ai-logo.jpg" alt="Stoke-AI - Igniting Intelligence" style="max-width: 250px; height: auto;" />
    </a>
  </p>
</div>
  `.trim();

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Jeff from Stoke-AI <jeff@stoke-ai.com>',
      to: [to],
      subject: `${firstName} - let's talk AI for ${business || 'your business'} 🔥`,
      html,
      reply_to: 'jeff@stoke-ai.com',
    }),
  });

  const result = await response.json();
  console.log('Email result:', result.id || result.message);
  return response.ok;
}

async function sendSMS(to: string, name: string) {
  if (!TWILIO_AUTH) {
    console.error('Missing TWILIO_AUTH_TOKEN');
    return false;
  }
  
  const firstName = name.split(' ')[0] || 'there';
  
  // Format phone number
  let phone = to.replace(/\D/g, '');
  if (phone.length === 10) phone = '1' + phone;
  if (!phone.startsWith('+')) phone = '+' + phone;
  
  const message = `Hey ${firstName}! 👋 This is Spark from Stoke-AI. Thanks for reaching out about AI for your business! I just sent you an email with some ideas - check your inbox! Reply here if you have any quick questions. - Jeff's AI assistant`;
  
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

async function notifyTelegram(
  name: string, 
  email: string, 
  phone: string, 
  business: string, 
  website: string, 
  message: string, 
  emailOk: boolean,
  smsOk: boolean, 
  callOk: boolean
) {
  if (!TELEGRAM_BOT_TOKEN) return;
  
  const actions = [];
  actions.push(emailOk ? '✅ Email sent' : '❌ Email failed');
  if (phone) {
    actions.push(smsOk ? '✅ SMS sent' : '❌ SMS failed');
    actions.push(callOk ? '✅ Voice call triggered' : '❌ Call failed');
  } else {
    actions.push('📵 No phone provided (SMS/call skipped)');
  }
  
  const text = `🔥 *New Lead - Fully Automated!*

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
    
    let emailOk = false;
    let smsOk = false;
    let callOk = false;
    
    // Send personalized email first
    if (email) {
      emailOk = await sendEmail(email, name || 'there', business || '');
    }
    
    // If phone provided, send SMS and make call
    if (phone) {
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
      emailOk,
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
  return NextResponse.json({ status: 'Lead webhook active', version: '4.0 - Full automation with Resend' });
}
