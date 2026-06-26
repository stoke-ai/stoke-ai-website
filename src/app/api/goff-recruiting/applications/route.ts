import { NextRequest, NextResponse } from 'next/server';
import { addApplication, type GoffApplication } from '@/lib/goff-recruiting/store';

// Goff-specific Telegram credentials with a portal fall-back. Either set of
// env vars works; Goff-specific wins when both are present.
const TELEGRAM_BOT_TOKEN = process.env.GOFF_RECRUITING_TELEGRAM_BOT_TOKEN || process.env.PORTAL_TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.GOFF_RECRUITING_TELEGRAM_CHAT_ID || process.env.PORTAL_TELEGRAM_CHAT_ID;
const TELEGRAM_THREAD_ID = process.env.GOFF_RECRUITING_TELEGRAM_THREAD_ID;

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function notifyGoffIntake(application: GoffApplication) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.log('[goff-recruiting] application saved (no telegram configured):', {
      id: application.id,
      name: `${application.first} ${application.last}`,
      role: application.role,
    });
    return;
  }

  const text = [
    '🔔 <b>New Goff applicant</b>',
    '',
    `<b>Name:</b> ${escapeHtml(`${application.first} ${application.last}`)}`,
    `<b>Role:</b> ${escapeHtml(application.role)}`,
    `<b>Source:</b> ${escapeHtml(application.source)}`,
    `<b>Email:</b> ${escapeHtml(application.email)}`,
    application.phone ? `<b>Phone:</b> ${escapeHtml(application.phone)}` : '',
    '',
    application.notes ? escapeHtml(application.notes.slice(0, 800)) : '<i>No notes provided.</i>',
  ]
    .filter(Boolean)
    .join('\n');

  const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      message_thread_id: TELEGRAM_THREAD_ID ? Number(TELEGRAM_THREAD_ID) : undefined,
      text,
      parse_mode: 'HTML',
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    console.error('[goff-recruiting] Telegram notify failed:', { status: response.status, body: body.slice(0, 400) });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const first = String(body?.first || '').trim().slice(0, 80);
    const last = String(body?.last || '').trim().slice(0, 80);
    const email = String(body?.email || '').trim().slice(0, 200);
    const phone = String(body?.phone || '').trim().slice(0, 60);
    const role = String(body?.role || '').trim().slice(0, 160);
    const source = String(body?.source || 'Goff website').trim().slice(0, 80);
    const notes = String(body?.notes || '').trim().slice(0, 4000);

    if (!first || !email || !role) {
      return NextResponse.json({ error: 'Missing required fields (first name, email, role).' }, { status: 400 });
    }

    const saved = await addApplication({ first, last, email, phone, role, source, notes });

    // Fire-and-forget Telegram fan-out so the apply-form response stays fast.
    // Any failure logs but does not bubble to the applicant.
    notifyGoffIntake(saved).catch((err) =>
      console.error('[goff-recruiting] Telegram fan-out crashed:', err),
    );

    return NextResponse.json({ ok: true, id: saved.id });
  } catch (err) {
    console.error('[goff-recruiting] application save failed:', err);
    return NextResponse.json({ error: 'Could not save application. Try again.' }, { status: 500 });
  }
}
