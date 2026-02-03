import { NextRequest, NextResponse } from 'next/server';

// System prompt giving Claude context about Stoke-AI
const SYSTEM_PROMPT = `You are Spark, the AI assistant for Stoke-AI, a consulting company in the Magic Valley, Idaho.

ABOUT STOKE-AI:
- Run by Jeff Stoker
- Helps small local businesses use AI practically (not enterprise consulting)
- Focus: automations, chatbots, AI-powered workflows, reducing manual work
- Pricing: Custom per project, always transparent, initial consultation is free
- Vibe: Casual, helpful, local, accessible

YOUR PERSONALITY:
- Friendly and direct, not corporate
- You're proof that AI assistants work — you ARE the demo
- Keep responses concise (2-4 sentences usually)
- If they ask something you can't answer, encourage them to fill out the contact form or schedule a call
- You can discuss AI capabilities honestly, including limitations

COMMON QUESTIONS:
- Pricing: "Depends on the project — every business is different. Initial conversation is always free. Want to set up a call?"
- Timeline: Simple automations in days, complex projects in weeks. No 6-month enterprise timelines.
- What you do: Automate repetitive tasks — emails, scheduling, follow-ups, data entry, customer comms.

GOAL: Be helpful, demonstrate AI value, and guide serious prospects toward filling out the contact form or scheduling a call with Jeff.`;

// Quick responses for common questions (instant, no API needed)
function getQuickResponse(message: string): string | null {
  const lower = message.toLowerCase();
  
  if (lower.includes('hello') || lower.includes('hi') || lower === 'hey') {
    return "Hey there! 👋 What brings you to Stoke-AI today? Curious about something specific, or just exploring what AI could do for your business?";
  }
  
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const { message, history = [] } = await request.json();
    
    if (!message) {
      return NextResponse.json({ error: 'Message required' }, { status: 400 });
    }

    // Try quick response first (free, instant)
    const quickResponse = getQuickResponse(message);
    if (quickResponse) {
      return NextResponse.json({ response: quickResponse });
    }

    // Check for API key
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ 
        response: "I'm having a connection issue right now. Drop your question in the contact form above and Jeff will get back to you within 24 hours!" 
      });
    }

    // Build conversation history
    const messages = [
      ...history.slice(-6).map((msg: { role: string; content: string }) => ({
        role: msg.role,
        content: msg.content,
      })),
      { role: 'user', content: message }
    ];

    // Call Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 300,
        system: SYSTEM_PROMPT,
        messages,
      }),
    });

    if (!response.ok) {
      console.error('Claude API error:', await response.text());
      return NextResponse.json({ 
        response: "Hmm, I hit a snag. Fill out the contact form and Jeff will personally follow up!" 
      });
    }

    const data = await response.json();
    const assistantResponse = data.content?.[0]?.text || "I'm not sure how to answer that. Want to fill out the form and chat with Jeff directly?";

    return NextResponse.json({ response: assistantResponse });
    
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json({ 
      response: "Connection hiccup! The form above goes straight to Jeff — he'll get back to you within 24 hours." 
    });
  }
}
