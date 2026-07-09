import { NextRequest, NextResponse } from 'next/server';
import { goffDb } from '@/lib/goff-portal/db';

// Per-employee training telemetry. The employee portal posts knowledge-check
// attempts, course completions, and acknowledgments as they happen, tagged
// with the employee identity carried by their private link (?emp=<uuid>, or
// resolved by email). Unmatched events still land with device_id only, so a
// hire who opened a bare link can be attached later.
//
// GET ?summary=1 aggregates per employee for the admin ops board / hire page.

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function resolveEmployeeId(sql: ReturnType<typeof goffDb>, emp: string, email: string): Promise<string | null> {
  if (!sql) return null;
  if (UUID_RE.test(emp)) {
    const byId = await sql`SELECT id FROM goff_employees WHERE id = ${emp} LIMIT 1`;
    if (byId.length) return String(byId[0].id);
  }
  if (email && /@/.test(email)) {
    const byEmail = await sql`SELECT id FROM goff_employees WHERE lower(email) = ${email.toLowerCase()} LIMIT 1`;
    if (byEmail.length) return String(byEmail[0].id);
  }
  return null;
}

export async function POST(request: NextRequest) {
  const sql = goffDb();
  if (!sql) return NextResponse.json({ error: 'Database not configured.' }, { status: 503 });
  try {
    const body = await request.json().catch(() => null);
    const emp = String(body?.emp || '').trim();
    const email = String(body?.email || '').trim().slice(0, 200);
    const name = String(body?.name || '').trim().slice(0, 160);
    const deviceId = String(body?.device || '').trim().slice(0, 80);
    const events = Array.isArray(body?.events) ? body.events.slice(0, 50) : [];
    if (!events.length) return NextResponse.json({ error: 'No events.' }, { status: 400 });

    const employeeId = await resolveEmployeeId(sql, emp, email);

    // Vercel freezes on response — await every write.
    for (const ev of events) {
      const type = String(ev?.type || '');
      if (type === 'kc') {
        await sql`INSERT INTO goff_kc_attempts (employee_id, device_id, kc_id, picked, correct, attempt_no)
          VALUES (${employeeId}, ${deviceId}, ${String(ev.kcId || '').slice(0, 80)},
            ${Number(ev.picked) || 0}, ${ev.correct === true}, ${Math.min(Number(ev.attempt) || 1, 99)})`;
      } else if (type === 'course') {
        await sql`INSERT INTO goff_course_completions (employee_id, device_id, course_set, course_id)
          VALUES (${employeeId}, ${deviceId}, ${String(ev.set || '').slice(0, 40)}, ${String(ev.courseId || '').slice(0, 80)})
          ON CONFLICT (employee_id, course_set, course_id) DO NOTHING`;
      } else if (type === 'ack') {
        await sql`INSERT INTO goff_acknowledgments (employee_id, device_id, doc_id, doc_version, signed_name, kind)
          VALUES (${employeeId}, ${deviceId}, ${String(ev.docId || '').slice(0, 80)},
            ${String(ev.version || '').slice(0, 80)}, ${String(ev.signedName || name).slice(0, 160)},
            ${ev.kind === 'acknowledge' ? 'acknowledge' : 'sign'})`;
      }
    }

    // Doing training IS the milestone: first tracked activity auto-ticks the
    // 'training' milestone on the hire's record if the admin hasn't already.
    if (employeeId) {
      await sql`UPDATE goff_employees
        SET milestones = COALESCE(milestones, '{}'::jsonb) || jsonb_build_object('training', now()::text)
        WHERE id = ${employeeId} AND COALESCE(milestones->>'training','') = ''`;
    }
    return NextResponse.json({ ok: true, matched: !!employeeId });
  } catch (err) {
    console.error('[goff-track] ingest failed:', err);
    return NextResponse.json({ error: 'Could not record progress.' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const sql = goffDb();
  if (!sql) return NextResponse.json({ error: 'Database not configured.' }, { status: 503 });
  if (request.nextUrl.searchParams.get('summary') !== '1') {
    return NextResponse.json({ error: 'Use ?summary=1.' }, { status: 400 });
  }
  // Per-employee aggregates. "First-try" = correct with attempt_no 1 on the
  // FIRST correct row per kc; approximated as kcs whose min correct attempt is 1.
  const kc = await sql`
    SELECT employee_id,
      COUNT(DISTINCT kc_id) FILTER (WHERE correct) AS kcs_correct,
      COUNT(DISTINCT kc_id) FILTER (WHERE correct AND attempt_no = 1) AS first_try,
      COUNT(*) AS attempts,
      MAX(created_at) AS last_at
    FROM goff_kc_attempts WHERE employee_id IS NOT NULL GROUP BY employee_id`;
  const courses = await sql`
    SELECT employee_id, course_set, COUNT(DISTINCT course_id) AS done, MAX(completed_at) AS last_at
    FROM goff_course_completions WHERE employee_id IS NOT NULL GROUP BY employee_id, course_set`;
  const acks = await sql`
    SELECT employee_id, COUNT(*) AS total, MAX(signed_at) AS last_at
    FROM goff_acknowledgments WHERE employee_id IS NOT NULL GROUP BY employee_id`;

  const out: Record<string, { kcsCorrect: number; firstTry: number; attempts: number; courses: Record<string, number>; acks: number; lastActivity: string | null }> = {};
  const ensure = (id: string) => (out[id] ||= { kcsCorrect: 0, firstTry: 0, attempts: 0, courses: {}, acks: 0, lastActivity: null });
  const later = (a: string | null, b: unknown) => (!a || (b && String(b) > a)) ? (b ? String(b) : a) : a;
  for (const r of kc) { const o = ensure(String(r.employee_id)); o.kcsCorrect = Number(r.kcs_correct); o.firstTry = Number(r.first_try); o.attempts = Number(r.attempts); o.lastActivity = later(o.lastActivity, r.last_at); }
  for (const r of courses) { const o = ensure(String(r.employee_id)); o.courses[String(r.course_set)] = Number(r.done); o.lastActivity = later(o.lastActivity, r.last_at); }
  for (const r of acks) { const o = ensure(String(r.employee_id)); o.acks = Number(r.total); o.lastActivity = later(o.lastActivity, r.last_at); }
  return NextResponse.json({ training: out });
}
