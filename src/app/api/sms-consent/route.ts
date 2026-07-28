import { NextRequest, NextResponse } from 'next/server';
import { saveSmsPreference, type SmsPreferenceInput } from '@/lib/sms-consent/store';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  let body: SmsPreferenceInput | null;
  try {
    body = await request.json() as SmsPreferenceInput | null;
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  try {
    const result = await saveSmsPreference(body, {
      ipAddress: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || null,
      userAgent: request.headers.get('user-agent'),
      sourceUrl: 'https://stoke-ai.com/sms-consent',
    });
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
    if ('ignored' in result) return NextResponse.json({ success: true });
    return NextResponse.json({
      success: true,
      preferenceId: result.id,
      preference: result.preference,
      optedIn: result.optedIn,
      recordedAt: result.recordedAt,
    });
  } catch (error) {
    console.error('SMS preference submission failed', error);
    return NextResponse.json({ error: 'Unable to save your SMS preference right now.' }, { status: 500 });
  }
}
