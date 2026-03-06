import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// In-memory token store (survives within a single Railway instance)
// Tokens expire after 30 minutes
const assessmentTokens = new Map<string, { expires: number; used: boolean }>();

export function generateAssessmentToken(): string {
  const token = crypto.randomBytes(16).toString('hex');
  assessmentTokens.set(token, { expires: Date.now() + 30 * 60 * 1000, used: false });
  // Clean up expired tokens
  for (const [key, val] of assessmentTokens) {
    if (val.expires < Date.now()) assessmentTokens.delete(key);
  }
  return token;
}

export function validateAssessmentToken(token: string): boolean {
  const entry = assessmentTokens.get(token);
  if (!entry) return false;
  if (entry.expires < Date.now()) { assessmentTokens.delete(token); return false; }
  if (entry.used) return false;
  entry.used = true; // One-time use
  return true;
}

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
  
  // Build response based on their pain point
  let painResponse = '';
  if (painPoint) {
    const p = painPoint.toLowerCase();
    if (p.includes('follow-up') || p.includes('communication')) {
      painResponse = `<p>You mentioned <strong>client follow-ups and communication</strong> are eating your time — that's the #1 thing we hear from business owners. Here's the reality: every missed follow-up is lost revenue. Not because you don't care, but because there aren't enough hours in the day.</p>
      <p>What if every lead got a response within minutes — automatically? And every client got a touchpoint at exactly the right time, without you thinking about it? That's what an operating system does. It never forgets, never gets busy, never drops the ball.</p>`;
    } else if (p.includes('lead') || p.includes('response time')) {
      painResponse = `<p>You mentioned <strong>lead management and response time</strong> — this is where most businesses are bleeding money without realizing it. Studies show that responding to a lead within 5 minutes makes you 10x more likely to close them. After 30 minutes? They've already moved on.</p>
      <p>An operating system responds instantly, qualifies the lead, and keeps the conversation going — 24/7, even at 2 AM. You just show up for the ones that are ready to buy.</p>`;
    } else if (p.includes('paperwork') || p.includes('data entry') || p.includes('admin')) {
      painResponse = `<p>You mentioned <strong>paperwork, data entry, and admin tasks</strong> — the stuff that has to get done but doesn't grow the business. Most owners we talk to are spending 15-20 hours a week on exactly this kind of work.</p>
      <p>An operating system handles the repetitive stuff in the background — organizing data, generating reports, filing the right things in the right places. You stop being your own admin assistant and start being the business owner again.</p>`;
    } else if (p.includes('team') || p.includes('coordination')) {
      painResponse = `<p>You mentioned <strong>team coordination and communication</strong> — when you're spending more time managing people than doing actual work, something's broken. An operating system keeps everyone on the same page automatically — tasks assigned, deadlines tracked, updates flowing without you being the middleman.</p>`;
    } else if (p.includes('all of the above') || p.includes('honestly')) {
      painResponse = `<p>You said <strong>"honestly, all of the above"</strong> — I appreciate the honesty. That tells me you're doing everything yourself and it's not sustainable. The good news? That means there's a LOT we can take off your plate. We usually start with the one thing that's costing you the most time or money, get that running on autopilot, and go from there.</p>`;
    } else {
      painResponse = `<p>You mentioned: <strong>"${painPoint}"</strong> — I'd love to dig into this more and figure out exactly where an operating system would make the biggest impact for you.</p>`;
    }
  }
  
  const html = `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
  <p>Hey ${firstName}!</p>
  
  <p>Thanks for reaching out about ${business || 'your business'}. This is Spark from Stoke-AI — I'm the AI that screens inquiries before they get to the team.</p>
  
  ${painResponse}
  
  <p>Here's what happens next: <strong>I'll be reaching out via text to ask a few quick questions</strong> about how your business runs day-to-day. Nothing complicated — just enough for us to see if we can actually help. If we're a good fit, we'll get you connected with the team.</p>
  
  <p>No sales pitch. No pressure. Just a real conversation about whether this makes sense for you.</p>
  
  <p>Talk soon,<br>
  <strong>Spark</strong> · Stoke-AI</p>
  
  <p style="margin-top: 10px;">
    <a href="https://stoke-ai.com" style="text-decoration: none;">
      <img src="https://stoke-ai.com/stoke-ai-logo.jpg" alt="Stoke-AI - Operating Intelligence" style="max-width: 250px; height: auto;" />
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
      from: 'Spark at Stoke-AI <spark@stoke-ai.com>',
      to: [to],
      subject: `${firstName} — got your inquiry about ${business || 'your business'} 🔥`,
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
  
  const message = `Hey ${firstName}! 👋 This is Spark from Stoke-AI. Thanks for reaching out — I just sent you an email with some details.\n\nI've got a few quick questions to see if we're a good fit. What's the #1 task in your business that eats the most time every week?`;
  
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
  smsOk: boolean
) {
  if (!TELEGRAM_BOT_TOKEN) return;
  
  const actions = [];
  actions.push(emailOk ? '✅ Email sent (from Spark)' : '❌ Email failed');
  if (phone) {
    actions.push(smsOk ? '✅ SMS sent (Spark screening started)' : '❌ SMS failed');
  } else {
    actions.push('📵 No phone provided (SMS skipped)');
  }
  
  const text = `🔥 *New Lead — Spark is screening*

*Name:* ${name}
*Email:* ${email}
*Phone:* ${phone || 'Not provided'}
*Business:* ${business}
*Pain Point:* ${painPoint || 'Not specified'}
${website ? `*Website:* ${website}` : ''}
${message ? `*Note:* ${message}` : ''}

${actions.join('\n')}

_Spark will qualify and notify you when ready._`;

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

async function scheduleBounceSequence(email: string, name: string, business: string, painPoint: string, phone: string) {
  if (!RESEND_API_KEY || !TWILIO_SID || !TWILIO_AUTH) return;

  const firstName = name.split(' ')[0] || 'there';
  const now = new Date();
  
  // Day 3 follow-up email
  const day3 = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
  
  // Day 7 final email  
  const day7 = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  
  // For emails, we'll use a simple approach with scheduled SMS that includes email trigger
  // This is a workaround since we need a proper email scheduler
  
  // Day 3 SMS (if phone provided)
  if (phone) {
    try {
      let formattedPhone = phone.replace(/\D/g, '');
      if (formattedPhone.length === 10) formattedPhone = '1' + formattedPhone;
      if (!formattedPhone.startsWith('+')) formattedPhone = '+' + formattedPhone;
      
      const twilioAuth = Buffer.from(`${TWILIO_SID}:${TWILIO_AUTH}`).toString('base64');
      
      await fetch(`https://api.twilio.com/2010-04-01/Accounts/${TWILIO_SID}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${twilioAuth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          To: formattedPhone,
          From: TWILIO_FROM,
          Body: `Hey ${firstName}, still thinking about getting your time back? Here's that assessment link again: https://stoke-ai.com/discovery?name=${encodeURIComponent(name)}&business=${encodeURIComponent(business)}&painPoint=${encodeURIComponent(painPoint)}&email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}`,
          ScheduleType: 'fixed',
          SendAt: day3.toISOString(),
        }),
      });
    } catch (e) { console.error('Day 3 SMS failed:', e); }

    // Day 7 SMS
    try {
      let formattedPhone = phone.replace(/\D/g, '');
      if (formattedPhone.length === 10) formattedPhone = '1' + formattedPhone;
      if (!formattedPhone.startsWith('+')) formattedPhone = '+' + formattedPhone;
      
      const twilioAuth = Buffer.from(`${TWILIO_SID}:${TWILIO_AUTH}`).toString('base64');
      
      await fetch(`https://api.twilio.com/2010-04-01/Accounts/${TWILIO_SID}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${twilioAuth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          To: formattedPhone,
          From: TWILIO_FROM,
          Body: `Last chance, ${firstName}! Free assessment ends soon. 5 minutes could save you 10 hours a week: https://stoke-ai.com/discovery?name=${encodeURIComponent(name)}&business=${encodeURIComponent(business)}&painPoint=${encodeURIComponent(painPoint)}&email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}`,
          ScheduleType: 'fixed',
          SendAt: day7.toISOString(),
        }),
      });
    } catch (e) { console.error('Day 7 SMS failed:', e); }
  }

  // TODO: Add email scheduling system for Day 3 and Day 7 follow-up emails
  // For now, we rely on SMS for the bounce sequence
  console.log('Bounce sequence scheduled for:', email, 'at Day 3 and Day 7');
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
    
    const { name, email, phone, business, website, painPoint, action, scheduleDate, scheduleTime, scheduleTimezone } = data;
    
    // Handle scheduled assessment
    if (action === 'schedule') {
      console.log('Assessment scheduled:', { name, email, phone, scheduleDate, scheduleTime });
      const firstName = (name || 'there').split(' ')[0];
      
      // Build the discovery URL with lead context
      const discoveryUrl = `https://stoke-ai.com/discovery?name=${encodeURIComponent(name || '')}&business=${encodeURIComponent(business || '')}&painPoint=${encodeURIComponent(painPoint || '')}&email=${encodeURIComponent(email || '')}&phone=${encodeURIComponent(phone || '')}`;
      
      // Schedule automated SMS messages via Twilio if phone provided
      if (phone && TWILIO_SID && TWILIO_AUTH) {
        let formattedPhone = phone.replace(/\D/g, '');
        if (formattedPhone.length === 10) formattedPhone = '1' + formattedPhone;
        if (!formattedPhone.startsWith('+')) formattedPhone = '+' + formattedPhone;
        
        // Parse scheduled date/time into UTC for Twilio using their local timezone
        // Create date in their timezone by using a formatter trick
        const tzDate = new Date(new Date(`${scheduleDate}T${scheduleTime}:00`).toLocaleString('en-US', { timeZone: scheduleTimezone || 'America/Boise' }));
        const scheduledMT = new Date(`${scheduleDate}T${scheduleTime}:00`)
        // Calculate offset: get the UTC equivalent of their local time
        const localDate = new Date(scheduledMT.toLocaleString('en-US', { timeZone: scheduleTimezone || 'America/Boise' }));
        const utcOffset = localDate.getTime() - scheduledMT.getTime();
        const scheduledUTC = new Date(scheduledMT.getTime() - utcOffset);
        // Use scheduledUTC for Twilio scheduling
        const scheduledFinal = scheduledUTC;
        const followUp15 = new Date(scheduledFinal.getTime() + 15 * 60 * 1000); // 15 min later
        // Next day 10 AM in their timezone
        const nextDayUTC = new Date(scheduledFinal.getTime() + 24 * 60 * 60 * 1000);
        nextDayUTC.setUTCHours(17, 0, 0, 0); // Approximate 10 AM for US timezones
        
        const twilioAuth = Buffer.from(`${TWILIO_SID}:${TWILIO_AUTH}`).toString('base64');
        
        // Message 1: At scheduled time
        try {
          await fetch(`https://api.twilio.com/2010-04-01/Accounts/${TWILIO_SID}/Messages.json`, {
            method: 'POST',
            headers: {
              'Authorization': `Basic ${twilioAuth}`,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              To: formattedPhone,
              From: TWILIO_FROM,
              Body: `Hey ${firstName}! 👋 It's Spark from Stoke-AI. Ready for your free operating assessment? Tap here to start — it takes about 5 minutes: ${discoveryUrl}`,
              ScheduleType: 'fixed',
              SendAt: scheduledFinal.toISOString(),
            }),
          });
        } catch (e) { console.error('Schedule msg 1 failed:', e); }
        
        // Message 2: 15 minutes later (gentle nudge)
        try {
          await fetch(`https://api.twilio.com/2010-04-01/Accounts/${TWILIO_SID}/Messages.json`, {
            method: 'POST',
            headers: {
              'Authorization': `Basic ${twilioAuth}`,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              To: formattedPhone,
              From: TWILIO_FROM,
              Body: `Still available if now works, ${firstName}! Here's the link whenever you're ready: ${discoveryUrl}`,
              ScheduleType: 'fixed',
              SendAt: followUp15.toISOString(),
            }),
          });
        } catch (e) { console.error('Schedule msg 2 failed:', e); }
        
        // Message 3: Next day 10 AM (reschedule offer)
        try {
          await fetch(`https://api.twilio.com/2010-04-01/Accounts/${TWILIO_SID}/Messages.json`, {
            method: 'POST',
            headers: {
              'Authorization': `Basic ${twilioAuth}`,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              To: formattedPhone,
              From: TWILIO_FROM,
              Body: `Hey ${firstName}, we missed each other yesterday. No worries — want to reschedule? Just reply with a time that works or tap here to do it now: ${discoveryUrl}`,
              ScheduleType: 'fixed',
              SendAt: nextDayUTC.toISOString(),
            }),
          });
        } catch (e) { console.error('Schedule msg 3 failed:', e); }
      }
      
      // Notify Jeff about scheduled assessment
      if (TELEGRAM_BOT_TOKEN) {
        const scheduleText = `📅 *Assessment Scheduled — Automated*

*Name:* ${name || 'Unknown'}
*Email:* ${email || 'Not provided'}
*Phone:* ${phone || 'Not provided'}
*Business:* ${business || 'Not specified'}
*Date:* ${scheduleDate}
*Time:* ${scheduleTime}

${phone ? '✅ 3 automated texts scheduled:\n• At scheduled time (assessment link)\n• 15 min follow-up\n• Next day reschedule offer' : '⚠️ No phone provided — email only'}

_No action needed from you. Spark handles it._`;

        await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: scheduleText, parse_mode: 'Markdown' }),
        });
      }
      
      // Send confirmation email
      if (email && RESEND_API_KEY) {
        // Format time for display
        const hour = parseInt(scheduleTime.split(':')[0]);
        const displayTime = hour > 12 ? `${hour - 12}:00 PM` : hour === 12 ? '12:00 PM' : `${hour}:00 AM`;
        
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: 'Spark at Stoke-AI <spark@stoke-ai.com>',
            to: [email],
            subject: `${firstName} — your assessment is scheduled 📅`,
            html: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
              <p>Hey ${firstName}!</p>
              <p>Your free AI operating assessment is locked in for <strong>${scheduleDate} at ${displayTime} (your local time)</strong>.</p>
              <p>I'll text you at that time with a link to start. It takes about 5 minutes — I'll ask you some questions about how your business runs and where an operating system could save you time.</p>
              <p>Can't wait? <a href="${discoveryUrl}">Click here to do it right now.</a></p>
              <p>Talk soon,<br><strong>Spark</strong> · Stoke-AI</p>
              <p style="margin-top: 10px;">
                <a href="https://stoke-ai.com" style="text-decoration: none;">
                  <img src="https://stoke-ai.com/stoke-ai-logo.jpg" alt="Stoke-AI - Operating Intelligence" style="max-width: 250px; height: auto;" />
                </a>
              </p>
            </div>`,
            reply_to: 'jeff@stoke-ai.com',
          }),
        });
      }
      
      return NextResponse.json({ success: true, message: 'Assessment scheduled' });
    }

    console.log('New lead:', { name, email, phone, business, painPoint });
    
    let emailOk = false;
    let smsOk = false;
    
    // Send personalized email from Spark (don't send immediately if they're about to do voice assessment)
    if (email) {
      emailOk = await sendEmail(email, name || 'there', business || '', painPoint || '');
    }
    
    // If phone provided, send SMS from Spark to start screening conversation
    if (phone) {
      smsOk = await sendSMS(phone, name || 'there');
    }
    
    // Schedule bounce nurture sequence for leads who fill form but don't engage immediately
    if (email) {
      await scheduleBounceSequence(email, name || 'there', business || '', painPoint || '', phone || '');
    }

    // Notify Jeff via Telegram
    await notifyTelegram(
      name || 'Unknown',
      email || 'Not provided',
      phone || '',
      business || 'Not specified',
      website || '',
      painPoint || '',
      '',
      emailOk,
      smsOk
    );

    // Generate one-time assessment token for voice discovery
    const assessmentToken = generateAssessmentToken();
    return NextResponse.json({ success: true, message: 'Lead processed', assessmentToken });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Failed to process lead' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: 'Lead webhook active', version: '4.0 - Full automation with Resend' });
}
