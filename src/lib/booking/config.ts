export const bookingConfig = {
  calendarId: process.env.GOOGLE_CALENDAR_ID || 'automate@stoke-ai.com',
  timezone: 'America/Boise',
  durationMinutes: 90,
  bufferBeforeMinutes: 30,
  bufferAfterMinutes: 30,
  minNoticeHours: 24,
  maxDaysOut: 30,
  slotStepMinutes: 30,
  windows: [
    // Monday: no in-person audits before 11 AM; done by 5 PM.
    { day: 1, start: '11:00', end: '17:00' },
    // Tuesday: start as early as 9 AM; done by 1 PM.
    { day: 2, start: '09:00', end: '13:00' },
    // Wednesday/Thursday: start as early as 9 AM; done by 5 PM.
    { day: 3, start: '09:00', end: '17:00' },
    { day: 4, start: '09:00', end: '17:00' },
    // Friday: no in-person audits.
  ],
};

export type BookingWindow = (typeof bookingConfig.windows)[number];
