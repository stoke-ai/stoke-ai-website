import { NextRequest, NextResponse } from 'next/server';
import { goffDb } from '@/lib/goff-portal/db';
import { sendGoffEmail, escapeHtml } from '@/lib/goff-portal/notify';

// Review feedback from inside the Goff portal (Austin's red pen).
// POST: save a comment -> Neon + email notification.
// GET (?key=PORTAL_ADMIN_PASSWORD): list comments, newest first.

async function notifyFeedback(f: { author: string; section: string; context: string; comment: string; url: string }) {
  const html = [
    `<h2 style="margin:0 0 12px">📝 Goff portal review comment</h2>`,
    `<p><b>From:</b> ${escapeHtml(f.author)}</p>`,
    `<p><b>Where:</b> ${escapeHtml(f.section)}${f.context ? ` — ${escapeHtml(f.context)}` : ''}</p>`,
    f.url ? `<p><b>Page:</b> <a href="${escapeHtml(f.url)}">${escapeHtml(f.url)}</a></p>` : '',
    `<blockquote style="border-left:4px solid #c0182b;margin:16px 0;padding:8px 14px;background:#f7f7f7">${escapeHtml(f.comment.slice(0, 3000)).replace(/\n/g, '<br>')}</blockquote>`,
  ].filter(Boolean).join('\n');
  return sendGoffEmail(`Goff review: ${f.section}${f.context ? ` (${f.context})` : ''} — ${f.author}`, html);
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
      console.warn('[goff-feedback] GOFF_DATABASE_URL not set — comment not stored.');
    }

    const notified = await notifyFeedback({ author, section, context, comment, url }).catch((err) => {
      console.error('[goff-feedback] email notify crashed:', err);
      return false;
    });

    return NextResponse.json({ ok: true, id, stored: Boolean(sql), notified });
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
