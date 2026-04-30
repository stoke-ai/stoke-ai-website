import { NextRequest, NextResponse } from 'next/server';

// This endpoint is called by OpenClaw to get deeper website analysis
// The actual AI analysis happens in OpenClaw, this just structures the request

export async function POST(request: NextRequest) {
  try {
    const { website, business } = await request.json();
    
    if (!website && !business) {
      return NextResponse.json({ error: 'Need website or business' }, { status: 400 });
    }

    // Return structured data for OpenClaw to process
    return NextResponse.json({
      needsAnalysis: true,
      website: website || null,
      business: business || null,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
