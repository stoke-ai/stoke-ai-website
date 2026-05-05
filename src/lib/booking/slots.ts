import { bookingConfig } from './config';

export interface BusyBlock {
  start: string;
  end: string;
}

export interface BookingSlot {
  start: string;
  end: string;
  label: string;
}

const MINUTE = 60 * 1000;

function parseTime(time: string) {
  const [hour, minute] = time.split(':').map(Number);
  return { hour, minute };
}

function formatInBoise(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: bookingConfig.timezone,
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

function boiseDayOfWeek(date: Date) {
  const part = new Intl.DateTimeFormat('en-US', {
    timeZone: bookingConfig.timezone,
    weekday: 'short',
  }).format(date);
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(part);
}

function makeBoiseWallTime(baseDate: Date, time: string) {
  const datePart = new Intl.DateTimeFormat('en-CA', {
    timeZone: bookingConfig.timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(baseDate);
  const { hour, minute } = parseTime(time);
  const guessedUtc = new Date(`${datePart}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00.000Z`);
  const boiseRendered = new Date(guessedUtc.toLocaleString('en-US', { timeZone: bookingConfig.timezone }));
  const desiredLocal = new Date(`${datePart}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`);
  return new Date(guessedUtc.getTime() + (desiredLocal.getTime() - boiseRendered.getTime()));
}

function overlapsBusy(start: Date, end: Date, busy: BusyBlock[]) {
  const bufferedStart = new Date(start.getTime() - bookingConfig.bufferBeforeMinutes * MINUTE);
  const bufferedEnd = new Date(end.getTime() + bookingConfig.bufferAfterMinutes * MINUTE);
  return busy.some((block) => {
    const busyStart = new Date(block.start);
    const busyEnd = new Date(block.end);
    return bufferedStart < busyEnd && bufferedEnd > busyStart;
  });
}

export function generateAvailableSlots(busy: BusyBlock[], from = new Date(), days = 14): BookingSlot[] {
  const slots: BookingSlot[] = [];
  const earliest = new Date(Date.now() + bookingConfig.minNoticeHours * 60 * MINUTE);
  const cappedDays = Math.min(days, bookingConfig.maxDaysOut);

  for (let offset = 0; offset < cappedDays; offset += 1) {
    const day = new Date(from);
    day.setDate(from.getDate() + offset);
    const window = bookingConfig.windows.find((w) => w.day === boiseDayOfWeek(day));
    if (!window) continue;

    let cursor = makeBoiseWallTime(day, window.start);
    const windowEnd = makeBoiseWallTime(day, window.end);

    while (cursor.getTime() + bookingConfig.durationMinutes * MINUTE <= windowEnd.getTime()) {
      const end = new Date(cursor.getTime() + bookingConfig.durationMinutes * MINUTE);
      if (cursor >= earliest && !overlapsBusy(cursor, end, busy)) {
        slots.push({ start: cursor.toISOString(), end: end.toISOString(), label: formatInBoise(cursor) });
      }
      cursor = new Date(cursor.getTime() + bookingConfig.slotStepMinutes * MINUTE);
    }
  }

  return slots;
}
