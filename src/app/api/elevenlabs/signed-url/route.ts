import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const agentId = process.env.ELEVENLABS_AGENT_ID;
    const apiKey = process.env.XI_API_KEY;

    if (!agentId || !apiKey) {
      console.error('Missing ELEVENLABS_AGENT_ID or XI_API_KEY');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // Get lead context to pass as overrides
    let overrides: Record<string, unknown> = {};
    try {
      const body = await request.json();
      const { name, business, painPoint, email, phone } = body;
      if (name) {
        // Build dynamic context for the agent's first message and prompt
        let contextNote = `\n\nLEAD CONTEXT (from their inquiry form):\n- Name: ${name}`;
        if (business) contextNote += `\n- Business: ${business}`;
        if (painPoint) contextNote += `\n- Biggest pain point: ${painPoint}`;
        if (email) contextNote += `\n- Email: ${email}`;
        if (phone) contextNote += `\n- Phone: ${phone}`;
        contextNote += `\n\nSince you already know their name and business, DO NOT ask for these again. Start by greeting them by name and referencing what they told you.`;

        overrides = {
          agent: {
            prompt: {
              prompt: contextNote,
            },
            first_message: `Hey ${name.split(' ')[0]}! This is Spark from Stoke-AI. Thanks for booking your Operating Assessment. ${business ? `I see you run a ${business} business` : 'I saw you filled out the form'}${painPoint ? ` and that ${painPoint.toLowerCase()} has been eating your time` : ''}. The whole idea here is pretty simple — I'm going to ask about how your business runs day-to-day, and we'll map out where your time is actually going. Sound good?`,
          },
        };
      }
    } catch {
      // No body or invalid JSON, proceed without overrides
    }

    // Get signed URL from ElevenLabs
    const url = new URL('https://api.elevenlabs.io/v1/convai/conversation/get_signed_url');
    url.searchParams.set('agent_id', agentId);

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'xi-api-key': apiKey,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs signed URL error:', response.status, errorText);
      return NextResponse.json({ error: 'Failed to get conversation URL' }, { status: 500 });
    }

    const data = await response.json();
    return NextResponse.json({ 
      signedUrl: data.signed_url,
      overrides,
    });
  } catch (error) {
    console.error('Signed URL API error:', error);
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
  }
}
