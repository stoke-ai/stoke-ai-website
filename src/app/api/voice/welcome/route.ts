// Twilio voice webhook - returns TwiML for welcome call
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // TwiML response - plays our pre-generated Spark voice message
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Play>https://stoke-ai.com/welcome-voice.mp3</Play>
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
