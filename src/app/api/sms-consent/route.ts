import { NextRequest, NextResponse } from 'next/server';
import { saveSmsConsent, type SmsConsentInput } from '@/lib/sms-consent/store';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as SmsConsentInput;
    const forwardedFor = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
    const result = await saveSmsConsent(body, {
      ipAddress: forwardedFor || request.headers.get('x-real-ip') || undefined,
      userAgent: request.headers.get('user-agent') || undefined,
      sourceUrl: request.headers.get('referer') || 'https://stoke-ai.com/sms-consent',
    });

    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
    return NextResponse.json({ success: true, consentId: result.id, consentedAt: result.consentedAt });
  } catch (error) {
    console.error('SMS consent submission failed:', error);
    return NextResponse.json({ error: 'We could not save your consent. Please try again.' }, { status: 500 });
  }
}
