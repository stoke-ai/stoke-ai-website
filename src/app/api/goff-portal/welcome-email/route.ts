import { NextRequest, NextResponse } from 'next/server';
import { goffDb } from '@/lib/goff-portal/db';
import { sendGoffEmailTo, escapeHtml } from '@/lib/goff-portal/notify';
import { getPortalSessionClientId } from '@/lib/portal/auth';

// Sends the new hire their welcome email (portal link + first-day details)
// straight from the ops board — no copy/paste into Gmail. Gated by the same
// goff-admin session as the rest of the internal tools (the cookie is
// origin-wide, so being logged into the recruiting portal covers this).

const REPLY_TO = process.env.GOFF_OFFER_REPLY_TO || 'careers@goffwelding.com';

async function authorized(): Promise<boolean> {
  if (process.env.GOFF_RECRUITING_REQUIRE_AUTH !== 'true') return true;
  const clientId = await getPortalSessionClientId().catch(() => null);
  return clientId === 'goff-admin';
}

export async function POST(request: NextRequest) {
  if (!(await authorized())) return NextResponse.json({ error: 'Sign in to the portal first (same login as recruiting).' }, { status: 401 });
  const sql = goffDb();
  if (!sql) return NextResponse.json({ error: 'Database not configured.' }, { status: 503 });
  try {
    const body = await request.json().catch(() => null);
    const id = String(body?.id || '').trim();
    const message = String(body?.message || '').trim().slice(0, 8000);
    if (!id || !message) return NextResponse.json({ error: 'Send { id, message }.' }, { status: 400 });

    const rows = await sql`SELECT id, first_name, last_name, email FROM goff_employees WHERE id = ${id} LIMIT 1`;
    if (!rows.length) return NextResponse.json({ error: 'Employee not found.' }, { status: 404 });
    const emp = rows[0];
    const to = String(emp.email || '');
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(to)) return NextResponse.json({ error: 'No valid email on this employee record.' }, { status: 400 });

    // The editable message may start with "Subject: ..." — honor it.
    const m = message.match(/^Subject:\s*(.+?)\n+([\s\S]*)$/);
    const subject = m ? m[1].trim().slice(0, 200) : 'Welcome to Goff Welding — Start Here';
    const bodyText = m ? m[2] : message;
    const html = escapeHtml(bodyText)
      .replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1">$1</a>')
      .replace(/\n/g, '<br>');

    // Await the send (Vercel freeze rule), then stamp the welcome milestone —
    // sending the welcome IS the milestone.
    const ok = await sendGoffEmailTo(to, subject, html, { replyTo: REPLY_TO });
    if (!ok) return NextResponse.json({ error: 'Email service unavailable — copy the message and send it from Gmail instead.' }, { status: 502 });
    await sql`UPDATE goff_employees
      SET milestones = COALESCE(milestones, '{}'::jsonb) || jsonb_build_object('welcome', now()::text)
      WHERE id = ${id}`;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[goff-welcome-email] send failed:', err);
    return NextResponse.json({ error: 'Could not send the welcome email.' }, { status: 500 });
  }
}
