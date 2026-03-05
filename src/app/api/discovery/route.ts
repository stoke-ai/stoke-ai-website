import { NextRequest, NextResponse } from 'next/server';

// Telegram notification for completed assessments
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '7448321777';

async function notifyAssessmentComplete(
  name: string,
  email: string,
  phone: string,
  business: string,
  painPoint: string,
  transcript: Array<{role: string, text: string}>
) {
  if (!TELEGRAM_BOT_TOKEN) return;

  const transcriptText = transcript
    .map(msg => `${msg.role === 'assistant' ? '🤖 Spark' : '👤 ' + (name || 'Prospect')}: ${msg.text}`)
    .join('\n\n');

  // Truncate if too long for Telegram (4096 char limit)
  const maxLen = 3500;
  const truncatedTranscript = transcriptText.length > maxLen 
    ? transcriptText.substring(0, maxLen) + '\n\n... (truncated)'
    : transcriptText;

  const text = `🎙️ *Voice Assessment Complete!*

*Name:* ${name || 'Unknown'}
*Email:* ${email || 'Not provided'}
*Phone:* ${phone || 'Not provided'}
*Business:* ${business || 'Not specified'}
*Pain Point:* ${painPoint || 'Not specified'}
*Messages:* ${transcript.length}

---
${truncatedTranscript}`;

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

const SYSTEM_PROMPT = `You are Spark, the AI assistant at Stoke-AI. You're conducting a discovery conversation to understand if an AI assistant would be a good fit for this prospect's business.

Your personality:
- Warm, friendly, conversational
- Curious and genuinely interested in their business
- Not salesy — you're here to learn, not pitch
- Speak plainly, no jargon
- Keep responses concise (2-3 sentences usually)

Your goal is to naturally gather this information through conversation:
1. Their name and business type
2. Their biggest time-sucks / pain points
3. What tasks they wish they could hand off
4. What tools they already use (CRM, email, calendar apps)
5. Whether they've tried AI tools before
6. Their timeline / urgency
7. Their contact info (email, phone) for follow-up

Discovery flow:
- Start by asking about their business
- Then dig into pain points and daily frustrations
- Explore what they'd want an AI to handle
- Ask about current tools/systems
- Gauge timeline and interest
- If they seem like a good fit, offer to have Jeff follow up with a custom proposal

Important:
- Ask ONE question at a time
- React to what they say before asking the next question
- If they mention a specific pain point, explore it deeper
- Be encouraging — validate their challenges
- Don't promise specific features, just understand their needs
- If they ask about pricing, say "It depends on what you need — that's why we're chatting! Jeff will put together a custom proposal based on what we discuss."

At the end of a good discovery:
- Thank them for sharing
- Let them know Jeff will follow up with a proposal tailored to their needs
- Ask for the best email/phone to reach them

If they're not a good fit (just curious, not a business owner, etc.):
- Be gracious
- Point them to the website for more info
- No hard feelings`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // If this is a transcript save (from voice assessment), handle differently
    if (body.transcript && Array.isArray(body.transcript)) {
      const { name, email, phone, business, painPoint, transcript } = body;
      await notifyAssessmentComplete(name, email, phone, business, painPoint, transcript);
      return NextResponse.json({ success: true, message: 'Assessment saved' });
    }

    // Otherwise it's a text chat message
    const { messages } = body;

    // Use OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages
        ],
        max_tokens: 300,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI error:', error);
      throw new Error('OpenAI API error');
    }

    const data = await response.json();
    const assistantResponse = data.choices[0]?.message?.content || "I'm having trouble responding. Could you try again?";

    return NextResponse.json({ response: assistantResponse });
  } catch (error) {
    console.error('Discovery API error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
