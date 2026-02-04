// Twilio voice webhook - returns TwiML for welcome call
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // Get the lead name from query params (passed when making the call)
  const url = new URL(request.url);
  const name = url.searchParams.get('name') || 'there';
  
  // TwiML response - matches SMS style
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Matthew">
    Hey ${name}! This is Spark from Stoke AI. Just sent you an email with some ideas for your business. Check your inbox! Talk soon, bye!
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
