import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// Twilio
const TWILIO_SID = process.env.TWILIO_SID;
const TWILIO_AUTH = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_FROM = '+18557915002';

// OpenAI for Spark responses
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Telegram notifications
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '7448321777';

interface SMSConversation {
  phone: string;
  name: string;
  email: string;
  business: string;
  painPoint: string;
  messages: Array<{ role: 'user' | 'assistant'; text: string; timestamp: string }>;
  status: 'screening' | 'qualified' | 'not-fit' | 'escalated';
  createdAt: string;
  updatedAt: string;
}

// Parse conversation state from Twilio cookies
function parseConversationFromCookies(cookieHeader: string | null): SMSConversation | null {
  if (!cookieHeader) return null;
  
  try {
    const cookies = new URLSearchParams(cookieHeader.replace(/;\s*/g, '&'));
    const conversationData = cookies.get('conversation');
    if (!conversationData) return null;
    
    // Decode base64 and parse JSON
    const decoded = Buffer.from(conversationData, 'base64').toString('utf-8');
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

// Encode conversation state to base64 for Twilio cookies
function encodeConversationToCookie(conversation: SMSConversation): string {
  const json = JSON.stringify(conversation);
  return Buffer.from(json, 'utf-8').toString('base64');
}

// Look up lead info from leads.json by phone number
async function findLead(phone: string): Promise<Record<string, string> | null> {
  try {
    const leadsFile = path.join(process.cwd(), 'data', 'leads.json');
    const data = await fs.readFile(leadsFile, 'utf-8');
    const leads = JSON.parse(data);
    // Normalize phone for matching
    const normalized = phone.replace(/\D/g, '').slice(-10);
    return leads.find((l: Record<string, string>) => {
      const leadPhone = (l.phone || '').replace(/\D/g, '').slice(-10);
      return leadPhone === normalized;
    }) || null;
  } catch {
    return null;
  }
}

function normalizePhone(phone: string): string {
  let p = phone.replace(/\D/g, '');
  if (p.length === 11 && p.startsWith('1')) p = p.slice(1);
  return p;
}

async function sendSMS(to: string, message: string): Promise<boolean> {
  if (!TWILIO_AUTH || !TWILIO_SID) return false;

  let phone = to.replace(/\D/g, '');
  if (phone.length === 10) phone = '1' + phone;
  if (!phone.startsWith('+')) phone = '+' + phone;

  const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${TWILIO_SID}/Messages.json`, {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + Buffer.from(`${TWILIO_SID}:${TWILIO_AUTH}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ To: phone, From: TWILIO_FROM, Body: message }),
  });

  return response.ok;
}

async function getSparkResponse(conversation: SMSConversation, newMessage: string): Promise<string> {
  if (!OPENAI_API_KEY) return "Thanks for your message! Someone from our team will get back to you shortly.";

  const systemPrompt = `You are Spark, the AI assistant at Stoke-AI, texting with a potential client via SMS.

LEAD CONTEXT:
- Name: ${conversation.name || 'Unknown'}
- Business: ${conversation.business || 'Unknown'}
- Pain Point: ${conversation.painPoint || 'Not specified'}
- Email: ${conversation.email || 'Not provided'}

Your job is to SCREEN and QUALIFY this lead through natural text conversation:
1. Understand their business and pain points in more detail
2. Figure out if an AI operating system would actually help them
3. If they're a good fit, offer to set up a call with the team
4. If they're not a fit, be honest and gracious

Rules:
- Keep texts SHORT — 1-3 sentences max. This is texting, not email.
- Be warm, casual, human. Use their first name.
- Ask ONE question at a time
- Use "operating system" never "chatbot"
- If they ask about pricing: "It depends on what you need — every system is custom. Want me to set up a quick call to talk specifics?"
- If they want to talk to a human or seem ready: respond with exactly "[ESCALATE]" at the END of your message
- If they're clearly not interested: be gracious, say no worries, wish them well
- Don't use emojis excessively — one per message max
- Sound like a real person texting, not a corporate bot`;

  const messages = [
    { role: 'system' as const, content: systemPrompt },
    ...conversation.messages.map(m => ({
      role: m.role === 'user' ? 'user' as const : 'assistant' as const,
      content: m.text,
    })),
    { role: 'user' as const, content: newMessage },
  ];

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages,
      max_tokens: 200,
      temperature: 0.8,
    }),
  });

  if (!response.ok) {
    console.error('OpenAI error:', await response.text());
    return "Thanks for your message! Let me get back to you on that.";
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || "Thanks for reaching out! Let me get back to you shortly.";
}

async function notifyEscalation(convo: SMSConversation) {
  if (!TELEGRAM_BOT_TOKEN) return;

  const recentMessages = convo.messages.slice(-6)
    .map(m => `${m.role === 'assistant' ? '🤖 Spark' : '👤 ' + (convo.name || 'Prospect')}: ${m.text}`)
    .join('\n');

  const text = `🚀 *Lead Qualified — Ready for You!*

*Name:* ${convo.name}
*Phone:* ${convo.phone}
*Email:* ${convo.email || 'Not provided'}
*Business:* ${convo.business}
*Pain Point:* ${convo.painPoint || 'Not specified'}

*Recent conversation:*
${recentMessages}

_Spark thinks this one is ready to talk to you. Give them a call!_`;

  await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text, parse_mode: 'Markdown' }),
  });
}

// Twilio sends inbound SMS as form-encoded POST
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const from = formData.get('From') as string || '';
    const body = formData.get('Body') as string || '';
    const cookieHeader = request.headers.get('Cookie');
    const normalizedPhone = normalizePhone(from);

    console.log('Inbound SMS:', { from: normalizedPhone, body });

    // Get conversation from Twilio cookies or create new one
    let convo = parseConversationFromCookies(cookieHeader);

    if (!convo) {
      // New conversation — try to find lead info
      const lead = await findLead(normalizedPhone);
      convo = {
        phone: from,
        name: lead?.name || '',
        email: lead?.email || '',
        business: lead?.business || '',
        painPoint: lead?.painPoint || '',
        messages: [],
        status: 'screening',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    // Add their message
    convo.messages.push({
      role: 'user',
      text: body,
      timestamp: new Date().toISOString(),
    });

    // Get Spark's response
    let sparkResponse = await getSparkResponse(convo, body);

    // Check for escalation
    const shouldEscalate = sparkResponse.includes('[ESCALATE]');
    sparkResponse = sparkResponse.replace('[ESCALATE]', '').trim();

    // Add Spark's response to conversation
    convo.messages.push({
      role: 'assistant',
      text: sparkResponse,
      timestamp: new Date().toISOString(),
    });

    convo.updatedAt = new Date().toISOString();

    if (shouldEscalate) {
      convo.status = 'qualified';
      await notifyEscalation(convo);
    }

    // Escape XML special characters in response
    const xmlSafe = sparkResponse
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');

    // Encode conversation state for Twilio cookie persistence
    const conversationCookie = encodeConversationToCookie(convo);

    // Return TwiML with Spark's response and updated conversation state in cookies
    return new NextResponse(
      `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${xmlSafe}</Message></Response>`,
      { 
        headers: { 
          'Content-Type': 'text/xml',
          'Set-Cookie': `conversation=${conversationCookie}; Path=/; HttpOnly; SameSite=None; Secure`
        } 
      }
    );
  } catch (error) {
    console.error('Inbound SMS error:', error);
    return new NextResponse(
      '<?xml version="1.0" encoding="UTF-8"?><Response><Message>Thanks for reaching out! We\'ll get back to you shortly.</Message></Response>',
      { headers: { 'Content-Type': 'text/xml' } }
    );
  }
}

// GET endpoint to check SMS webhook status
export async function GET(request: NextRequest) {
  const cookieHeader = request.headers.get('Cookie');
  const conversation = parseConversationFromCookies(cookieHeader);
  
  return NextResponse.json({ 
    status: 'SMS webhook active (cookie-based persistence)',
    hasConversation: !!conversation,
    phone: conversation?.phone || null,
    messageCount: conversation?.messages?.length || 0,
    lastUpdated: conversation?.updatedAt || null
  });
}
