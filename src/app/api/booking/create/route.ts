import { NextRequest, NextResponse } from 'next/server';
import { bookingConfig } from '@/lib/booking/config';
import { createCalendarBooking, listBusyBlocks } from '@/lib/google-calendar';
import { generateAvailableSlots } from '@/lib/booking/slots';

const requiredFields = ['slotStart', 'name', 'business', 'email', 'phone', 'workflows'] as const;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    for (const field of requiredFields) {
      if (!body[field] || String(body[field]).trim().length < 2) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    const slotStart = new Date(body.slotStart);
    if (Number.isNaN(slotStart.getTime())) {
      return NextResponse.json({ error: 'Invalid slotStart' }, { status: 400 });
    }

    const timeMax = new Date(slotStart);
    timeMax.setDate(slotStart.getDate() + 1);
    const busy = await listBusyBlocks(slotStart.toISOString(), timeMax.toISOString());
    const slots = generateAvailableSlots(busy, slotStart, 1);
    const selected = slots.find((slot) => slot.start === slotStart.toISOString());

    if (!selected) {
      return NextResponse.json({ error: 'That appointment time is no longer available' }, { status: 409 });
    }

    const event = await createCalendarBooking({
      slotStart: selected.start,
      slotEnd: selected.end,
      name: String(body.name).trim(),
      business: String(body.business).trim(),
      email: String(body.email).trim(),
      phone: String(body.phone).trim(),
      meetingPreference: body.meetingPreference ? String(body.meetingPreference).trim() : 'Web conference call',
      workflows: String(body.workflows).trim(),
      tools: body.tools ? String(body.tools).trim() : undefined,
    });

    return NextResponse.json({
      success: true,
      eventId: event.id,
      htmlLink: event.htmlLink,
      timezone: bookingConfig.timezone,
      slot: selected,
    });
  } catch (error) {
    console.error('Booking create error:', error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}
