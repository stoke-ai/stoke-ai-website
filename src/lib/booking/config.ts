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
    { day: 1, start: '09:00', end: '16:00' },
    { day: 2, start: '09:00', end: '16:00' },
    { day: 3, start: '09:00', end: '16:00' },
    { day: 4, start: '09:00', end: '16:00' },
  ],
};

export type BookingWindow = (typeof bookingConfig.windows)[number];
