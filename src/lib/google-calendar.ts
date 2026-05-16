import { bookingConfig } from './booking/config';
import type { BusyBlock } from './booking/slots';

async function getAccessToken() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Google Calendar production credentials are not configured');
  }

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });

  if (!response.ok) throw new Error(`Google token refresh failed: ${response.status}`);
  const data = await response.json();
  return data.access_token as string;
}

export async function listBusyBlocks(timeMin: string, timeMax: string): Promise<BusyBlock[]> {
  const accessToken = await getAccessToken();
  const response = await fetch('https://www.googleapis.com/calendar/v3/freeBusy', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      timeMin,
      timeMax,
      timeZone: bookingConfig.timezone,
      items: [{ id: bookingConfig.calendarId }],
    }),
  });

  if (!response.ok) throw new Error(`Google freeBusy failed: ${response.status}`);
  const data = await response.json();
  return data.calendars?.[bookingConfig.calendarId]?.busy || [];
}

export interface CreateBookingInput {
  slotStart: string;
  slotEnd: string;
  name: string;
  business: string;
  email: string;
  phone: string;
  meetingPreference: string;
  workflows: string;
  tools?: string;
}

export async function createCalendarBooking(input: CreateBookingInput) {
  const accessToken = await getAccessToken();
  const summary = `Free 90-Minute AI Audit — ${input.business} / ${input.name}`;
  const description = `Free 90-Minute AI Audit booked from stoke-ai.com/book\n\nName: ${input.name}\nBusiness: ${input.business}\nEmail: ${input.email}\nPhone: ${input.phone}\nMeeting preference: ${input.meetingPreference}\n\nManual workflows they want to improve:\n${input.workflows}\n\nCurrent tools/systems:\n${input.tools || 'Not provided'}\n\nBooking source: Stoke AI custom booking page`;

  const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(bookingConfig.calendarId)}/events?sendUpdates=all&conferenceDataVersion=1`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      summary,
      location: 'Google Meet / web conference',
      description,
      start: { dateTime: input.slotStart, timeZone: bookingConfig.timezone },
      end: { dateTime: input.slotEnd, timeZone: bookingConfig.timezone },
      attendees: [{ email: input.email, displayName: input.name }],
      conferenceData: {
        createRequest: {
          requestId: `stoke-ai-audit-${Date.now()}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      },
    }),
  });

  if (!response.ok) throw new Error(`Google event create failed: ${response.status}`);
  return response.json();
}
