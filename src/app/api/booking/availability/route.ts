import { NextRequest, NextResponse } from 'next/server';
import { bookingConfig } from '@/lib/booking/config';
import { generateAvailableSlots } from '@/lib/booking/slots';
import { listBusyBlocks } from '@/lib/google-calendar';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const days = Number(searchParams.get('days') || '14');
  const from = new Date(searchParams.get('from') || Date.now());
  const timeMax = new Date(from);
  timeMax.setDate(from.getDate() + Math.min(days, bookingConfig.maxDaysOut));

  try {
    const busy = await listBusyBlocks(from.toISOString(), timeMax.toISOString());
    const slots = generateAvailableSlots(busy, from, days);

    return NextResponse.json({
      configured: true,
      timezone: bookingConfig.timezone,
      durationMinutes: bookingConfig.durationMinutes,
      slots,
    });
  } catch (error) {
    console.error('Booking availability error:', error);
    return NextResponse.json({
      configured: false,
      timezone: bookingConfig.timezone,
      durationMinutes: bookingConfig.durationMinutes,
      slots: [],
      fallbackUrl: 'https://calendar.app.google/YeqJLsyJHv1SQeXQ6',
    });
  }
}
