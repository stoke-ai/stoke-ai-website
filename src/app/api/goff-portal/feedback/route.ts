import { NextRequest, NextResponse } from 'next/server';
import { goffDb } from '@/lib/goff-portal/db';

// Review feedback from inside the Goff portal (Austin's red pen).
// POST: save a comment -> Neon + Telegram ping to Jeff.
// GET (?key=PORTAL_ADMIN_PASSWORD): list comments, newest first.

const TELEGRAM_BOT_TOKEN = process.env.GOFF_RECRUITING_TELEGRAM_BOT_TOKEN || process.env.PORTAL_TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.GOFF_RECRUITING_TELEGRAM_CHAT_ID || process.env.PORTAL_TELEGRAM_CHAT_ID;
const TELEGRAM_THREAD_ID = process.env.GOFF_RECRUITING_TELEGRAM_THREAD_ID;

function escapeHtml(value: string) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

async function notifyFeedback(f: { author: string; section: string; context: string; comment: string; url: string }) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.log('[goff-feedback] saved (no telegram configured):', f.section, f.comment.slice(0, 120));
    return;
  }
  const text = [
    '📝 <b>Goff portal review comment</b>',
    '',
    `<b>From:</b> ${escapeHtml(f.author)}`,
    `<b>Where:</b> ${escapeHtml(f.section)}${f.context ? ` — ${escapeHtml(f.context)}` : ''}`,
    f.url ? `<b>URL:</b> ${escapeHtml(f.url)}` : '',
    '',
    escapeHtml(f.comment.slice(0, 1500)),
  ].filter(Boolean).join('\n');

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
    console.error('[goff-feedback] Telegram notify failed:', { status: response.status, body: body.slice(0, 400) });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const author = String(body?.author || 'Goff reviewer').trim().slice(0, 120) || 'Goff reviewer';
    const section = String(body?.section || '').trim().slice(0, 120);
    const context = String(body?.context || '').trim().slice(0, 300);
    const comment = String(body?.comment || '').trim().slice(0, 4000);
    const url = String(body?.url || '').trim().slice(0, 500);
    const userAgent = String(request.headers.get('user-agent') || '').slice(0, 300);

    if (!comment || !section) {
      return NextResponse.json({ error: 'Missing comment or section.' }, { status: 400 });
    }

    const sql = goffDb();
    let id: number | null = null;
    if (sql) {
      const rows = await sql`
        INSERT INTO goff_feedback (author, section, context, comment, url, user_agent)
        VALUES (${author}, ${section}, ${context}, ${comment}, ${url}, ${userAgent})
        RETURNING id`;
      id = Number(rows[0]?.id ?? null);
    } else {
      console.warn('[goff-feedback] GOFF_DATABASE_URL not set — comment only sent to Telegram.');
    }

    notifyFeedback({ author, section, context, comment, url }).catch((err) =>
      console.error('[goff-feedback] Telegram fan-out crashed:', err),
    );

    return NextResponse.json({ ok: true, id, stored: Boolean(sql) });
  } catch (err) {
    console.error('[goff-feedback] save failed:', err);
    return NextResponse.json({ error: 'Could not save feedback. Try again.' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const key = request.nextUrl.searchParams.get('key') || '';
  const expected = process.env.PORTAL_ADMIN_PASSWORD || '';
  if (!expected || key !== expected) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }
  const sql = goffDb();
  if (!sql) return NextResponse.json({ error: 'Database not configured.' }, { status: 503 });
  const rows = await sql`
    SELECT id, created_at, author, section, context, comment, url, resolved
    FROM goff_feedback ORDER BY created_at DESC LIMIT 200`;
  return NextResponse.json({ feedback: rows });
}
