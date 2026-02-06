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

async function sendEmail(to: string, name: string, business: string, painPoint: string) {
  if (!RESEND_API_KEY) {
    console.error('Missing RESEND_API_KEY');
    return false;
  }

  const firstName = name.split(' ')[0] || 'there';
  
  // Build response based on their AI experience level
  let aiExperienceResponse = '';
  if (painPoint) {
    const level = painPoint.toLowerCase();
    if (level.includes("haven't started")) {
      aiExperienceResponse = `<p>You mentioned you <strong>haven't started with AI yet</strong> — perfect timing. Most businesses I work with start with one simple win: automating the task that eats the most time. Could be follow-ups, scheduling, answering the same questions... Once you see AI handle that automatically, everything clicks.</p>
      <p>Here's what that first win usually looks like: imagine every lead getting a personalized response within 60 seconds, 24/7. Or every appointment confirmed and reminded automatically. That's not futuristic — that's what I set up for businesses right now.</p>`;
    } else if (level.includes('chatgpt') || level.includes('writing')) {
      aiExperienceResponse = `<p>You mentioned you're <strong>using ChatGPT for writing and ideas</strong> — that's where everyone starts, and it's a great foundation. But here's what most people don't realize: ChatGPT is just the tip of the iceberg.</p>
      <p>The real magic happens when AI <em>runs things for you</em> — not just helps you write. Imagine leads getting instant personalized responses. Follow-ups happening automatically. Your calendar managing itself. That's what "AI for business" actually looks like when it's set up right.</p>`;
    } else if (level.includes('tried') || level.includes('nothing stuck')) {
      aiExperienceResponse = `<p>You mentioned you've <strong>tried some tools but nothing stuck</strong> — I hear this constantly. Here's the thing: the problem usually isn't the tools. It's that nobody showed you how to connect them to YOUR specific workflow.</p>
      <p>Most AI tools are powerful but generic. What works is building something tailored to how YOU actually run your business. That's what I help with — finding the right pieces and making them work together seamlessly.</p>`;
    } else if (level.includes('automations running')) {
      aiExperienceResponse = `<p>You mentioned you <strong>already have some automations running</strong> — nice! You're ahead of most. The question now is: what's the next level?</p>
      <p>Usually it's about connecting the pieces — making your automations smarter, adding AI decision-making, or finding the gaps where manual work is still slowing you down. I'd love to hear what you've got running and brainstorm what's next.</p>`;
    } else if (level.includes("not sure what's possible")) {
      aiExperienceResponse = `<p>You said you're <strong>not sure what's possible</strong> — that's exactly why I do this. Let me give you a taste:</p>
      <ul style="margin: 10px 0; padding-left: 20px;">
        <li>An AI assistant that answers customer questions 24/7 (in YOUR voice)</li>
        <li>Leads getting personalized follow-ups automatically — for weeks if needed</li>
        <li>Your calendar, reminders, and scheduling running on autopilot</li>
        <li>Review responses drafted and ready to post</li>
        <li>Data entry and reporting that used to take hours — done in seconds</li>
      </ul>
      <p>And that's just the common stuff. The real fun is figuring out what's unique to YOUR business.</p>`;
    } else {
      aiExperienceResponse = `<p>You mentioned: <strong>"${painPoint}"</strong> — I'd love to dig into this more and see how AI might help with your specific situation.</p>`;
    }
  }
  
  const html = `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
  <p>Hey ${firstName}!</p>
  
  <p>Thanks for reaching out about AI for ${business || 'your business'}. I'm Jeff from Stoke-AI, and I help local businesses in the Magic Valley actually <em>use</em> AI to save time and grow.</p>
  
  ${aiExperienceResponse}
  
  <p>Most businesses I work with find <strong>10-15 hours/week</strong> of tasks that AI can handle. The key is finding the right starting point for YOUR business.</p>
  
  <p>Want to hop on a quick 15-minute call this week? I can share some specific ideas tailored to what you're dealing with.</p>
  
  <p>Just reply to this email or text me back at the number that just reached out.</p>
  
  <p>Talk soon,<br>
  <strong>Jeff Stoker</strong></p>
  
  <p style="margin-top: 10px;">
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
  painPoint: string,
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
*AI Experience:* ${painPoint || 'Not specified'}
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
    
    const { name, email, phone, business, website, painPoint, message } = data;
    
    console.log('New lead:', { name, email, phone, business, painPoint });
    
    let emailOk = false;
    let smsOk = false;
    let callOk = false;
    
    // Send personalized email first
    if (email) {
      emailOk = await sendEmail(email, name || 'there', business || '', painPoint || '');
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
      painPoint || '',
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
