# Stoke AI Custom Booking System Plan

## Goal

Replace the raw Google Calendar appointment link with a branded Stoke AI booking flow that feels like a custom AI Strategy Audit intake, while Google Calendar remains the source of truth for Jeff's availability and booked events.

## Recommended user flow

1. Visitor lands on `/book` from the main CTA.
2. Page explains the in-person AI Strategy Audit:
   - 90 minutes
   - Jeff comes to the prospect's office
   - practical workflow/bottleneck review, not a sales demo
3. Visitor enters required intake details before seeing final confirmation:
   - name
   - business name
   - email
   - phone
   - office address
   - one or two manual workflows they want to stop doing
   - current tools/systems they use, optional
4. Visitor selects an available appointment slot.
5. Backend re-checks availability at submit time to avoid double-booking.
6. Backend creates a Google Calendar event on Jeff's calendar.
7. Confirmation page shows:
   - date/time
   - office address
   - what to prepare
8. Notifications:
   - email confirmation to prospect
   - Telegram notification to Jeff
   - optional SMS confirmation/reminders using existing Twilio setup

## Availability rules

Initial defaults to confirm with Jeff:

- Appointment length: 90 minutes
- Timezone: America/Boise
- Booking horizon: 2 to 30 days out
- Buffers: 30 minutes before and after
- Travel/local-only assumption: client office location collected, no automatic distance filtering in v1
- Default available windows: configurable, not hard-coded into UI copy
- Existing Google Calendar busy events block slots

Store availability rules in code first for speed, then graduate to an admin-editable config later if needed.

Suggested v1 rule shape:

```ts
export const bookingConfig = {
  calendarId: 'automate@stoke-ai.com',
  timezone: 'America/Boise',
  durationMinutes: 90,
  bufferBeforeMinutes: 30,
  bufferAfterMinutes: 30,
  minNoticeHours: 24,
  maxDaysOut: 30,
  windows: [
    { day: 1, start: '09:00', end: '16:00' },
    { day: 2, start: '09:00', end: '16:00' },
    { day: 3, start: '09:00', end: '16:00' },
    { day: 4, start: '09:00', end: '16:00' },
  ],
};
```

## Technical architecture

### Website

Current app: Next.js App Router, React 19, Tailwind v4.

Add:

- `src/app/book/page.tsx` — branded booking page and client form
- `src/app/api/booking/availability/route.ts` — returns available slots
- `src/app/api/booking/create/route.ts` — validates intake and creates calendar event
- `src/lib/booking/config.ts` — booking rules
- `src/lib/booking/slots.ts` — slot generation and conflict logic
- `src/lib/google-calendar.ts` — production Google Calendar adapter

### Calendar integration

Important distinction:

- Local OpenClaw has Google Workspace access through `@presto-ai/google-workspace-mcp`; verified calendar list includes `automate@stoke-ai.com`.
- Vercel production cannot rely on Jeff's local mcporter OAuth files.

Production options:

1. **Recommended: Google Calendar API with OAuth refresh token for `automate@stoke-ai.com`.**
   - Store `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN`, `GOOGLE_CALENDAR_ID` in Vercel env.
   - Backend can read busy events and create events directly.
   - Most reliable for Jeff-owned calendar.

2. **Alternative: service account + shared calendar.**
   - Share a booking calendar with the service account.
   - Cleaner machine auth, but less direct if Jeff wants primary-calendar availability.

3. **Local-only bridge via OpenClaw/mcporter.**
   - Fast internal prototype, but not suitable as public website backend unless exposed securely.

Use option 1 for production.

### APIs

`GET /api/booking/availability?from=YYYY-MM-DD&days=14`

Returns:

```json
{
  "timezone": "America/Boise",
  "durationMinutes": 90,
  "slots": [
    { "start": "2026-05-06T15:00:00.000Z", "end": "2026-05-06T16:30:00.000Z", "label": "Wed, May 6 at 9:00 AM" }
  ]
}
```

`POST /api/booking/create`

Input:

```json
{
  "slotStart": "2026-05-06T15:00:00.000Z",
  "name": "Jane Owner",
  "business": "Example Co",
  "email": "jane@example.com",
  "phone": "2085551212",
  "officeAddress": "123 Main St, Burley, ID",
  "workflows": "Renewal prep and follow-up calls",
  "tools": "Google Workspace, AgencyZoom"
}
```

Event summary:

`AI Strategy Audit — Example Co / Jane Owner`

Event location:

`officeAddress`

Event description:

```md
AI Strategy Audit booked from stoke-ai.com/book

Name: Jane Owner
Business: Example Co
Email: jane@example.com
Phone: 2085551212
Office address: 123 Main St, Burley, ID

Manual workflows they want to improve:
Renewal prep and follow-up calls

Current tools/systems:
Google Workspace, AgencyZoom

Booking source: Stoke AI custom booking page
```

## Lead quality advantages over Google appointment links

- The booking form can require office address before booking.
- The site can pre-frame the audit as a valuable working session.
- The intake answers become event context for Jeff.
- The flow can later include AI qualification before showing the calendar.
- We keep the Google link as backup while making Stoke AI the front door.

## Implementation sequence

1. Add the `/book` page UI using static mock slots.
2. Add pure slot-generation logic with tests or a small script gate.
3. Add Google Calendar adapter and env vars.
4. Wire availability API to real calendar busy times.
5. Wire create API to create events + send notifications.
6. Update homepage CTA from `#contact` or add a secondary CTA to `/book`.
7. Deploy Vercel preview and test one booking against Jeff's calendar.
8. Promote to production after confirming event creation and notifications.

## Open questions for Jeff

- Exact weekly windows Jeff wants available for in-person audits.
- Minimum notice: 24 hours or more?
- Max booking horizon: 30 days or 60 days?
- Should these be free strategy audits or paid audits later?
- Should the public CTA say `Book an AI Strategy Audit` or keep `Free Assessment`?
