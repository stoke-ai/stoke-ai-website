// Twilio voice webhook - returns TwiML for welcome call
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // Get the lead name from query params (passed when making the call)
  const url = new URL(request.url);
  const name = url.searchParams.get('name') || 'there';
  
  // TwiML response with friendly message
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Matthew">
    Hey ${name}! This is Spark, Jeff's AI assistant at Stoke AI.
  </Say>
  <Pause length="1"/>
  <Say voice="Polly.Matthew">
    Thanks for reaching out about your business. Jeff got your message and will be in touch soon. 
    In the meantime, check your email for some ideas we put together just for you.
  </Say>
  <Pause length="1"/>
  <Say voice="Polly.Matthew">
    Talk soon! Bye for now.
  </Say>
</Response>`;

  return new NextResponse(twiml, {
    headers: {
      'Content-Type': 'text/xml',
    },
  });
}

// Also handle GET for testing
export async function GET(request: NextRequest) {
  return POST(request);
}
