import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const CHAT_FILE = path.join(process.cwd(), 'data', 'chat-messages.json');

interface ChatMessage {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  responded: boolean;
}

async function getMessages(): Promise<ChatMessage[]> {
  try {
    const data = await fs.readFile(CHAT_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveMessages(messages: ChatMessage[]): Promise<void> {
  const dir = path.dirname(CHAT_FILE);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(CHAT_FILE, JSON.stringify(messages, null, 2));
}

// Quick responses for common questions (instant, no AI needed)
function getQuickResponse(message: string): string | null {
  const lower = message.toLowerCase();
  
  if (lower.includes('price') || lower.includes('cost') || lower.includes('how much')) {
    return "Pricing depends on what we're building together — every business is different. The initial conversation is always free, and I'll give you a clear quote before any work starts. No surprises. Want to set up a quick call?";
  }
  
  if (lower.includes('who') && (lower.includes('jeff') || lower.includes('you'))) {
    return "Jeff Stoker runs Stoke-AI — he's a local guy from the Magic Valley who helps small businesses actually use AI (not just talk about it). I'm Spark, his AI assistant. Together we handle everything from strategy to implementation.";
  }
  
  if (lower.includes('how long') || lower.includes('timeline')) {
    return "Depends on the project! Simple automations can be up and running in a day or two. More complex systems might take a few weeks. Either way, you'll see progress fast — no 6-month enterprise timelines here.";
  }
  
  if (lower.includes('what can') || lower.includes('what do you')) {
    return "I help small businesses automate the boring stuff — emails, scheduling, follow-ups, data entry, customer communications. Basically anything repetitive that's eating up your time. What's taking up too much of your day right now?";
  }
  
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
    return "Hey there! 👋 What brings you to Stoke-AI today? Curious about something specific, or just exploring what AI could do for your business?";
  }

  if (lower.includes('appointment') || lower.includes('schedule') || lower.includes('call') || lower.includes('meet')) {
    return "Absolutely! Fill out the quick form above with your details and Jeff will reach out within 24 hours to set something up. Or just tell me a bit about your business and I can give you some quick insights right now.";
  }
  
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const { message, sessionId } = await request.json();
    
    if (!message) {
      return NextResponse.json({ error: 'Message required' }, { status: 400 });
    }

    const session = sessionId || `session_${Date.now()}`;
    
    // Save user message
    const messages = await getMessages();
    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      sessionId: session,
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
      responded: false,
    };
    messages.push(userMsg);
    
    // Try quick response first
    const quickResponse = getQuickResponse(message);
    
    if (quickResponse) {
      const assistantMsg: ChatMessage = {
        id: `msg_${Date.now() + 1}`,
        sessionId: session,
        role: 'assistant',
        content: quickResponse,
        timestamp: new Date().toISOString(),
        responded: true,
      };
      messages.push(assistantMsg);
      userMsg.responded = true;
      await saveMessages(messages);
      
      return NextResponse.json({ 
        response: quickResponse,
        sessionId: session,
      });
    }
    
    // For complex questions, save and let OpenClaw handle it
    // Return a holding response
    await saveMessages(messages);
    
    // Write trigger for OpenClaw
    const triggerFile = path.join(process.cwd(), 'data', 'chat-trigger.json');
    await fs.writeFile(triggerFile, JSON.stringify(userMsg, null, 2));
    
    return NextResponse.json({ 
      response: "Great question! Let me think about that for a sec... Actually, this one's worth a real conversation. Drop your email in the form above and Jeff will get back to you with a detailed answer within 24 hours!",
      sessionId: session,
      needsFollowup: true,
    });
    
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json({ error: 'Chat failed' }, { status: 500 });
  }
}

export async function GET() {
  const messages = await getMessages();
  const unresponded = messages.filter(m => m.role === 'user' && !m.responded);
  return NextResponse.json({ 
    total: messages.length,
    unresponded: unresponded.length,
    messages: messages.slice(-50), // Last 50 messages
  });
}
