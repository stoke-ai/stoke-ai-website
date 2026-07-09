import { NextRequest, NextResponse } from 'next/server';
import { goffDb } from '@/lib/goff-portal/db';
import { getPortalSessionClientId } from '@/lib/portal/auth';

// Employee reviews (Austin's forms, 7/6 email): kind '30day' = the 30-Day
// Employee Review checklist (one per employee, upserted as it's filled in on
// the hire page); kind 'staff' = the recurring Staff Review Form (later
// build). HR data — both directions are gated by the portal session.

async function authorized(): Promise<boolean> {
  if (process.env.GOFF_RECRUITING_REQUIRE_AUTH !== 'true') return true;
  const clientId = await getPortalSessionClientId().catch(() => null);
  return clientId === 'goff-admin';
}

export async function GET(request: NextRequest) {
  if (!(await authorized())) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  const sql = goffDb();
  if (!sql) return NextResponse.json({ error: 'Database not configured.' }, { status: 503 });
  const employee = String(request.nextUrl.searchParams.get('employee') || '').trim();
  if (!employee) return NextResponse.json({ error: 'employee required.' }, { status: 400 });
  const rows = await sql`SELECT kind, status, data, updated_at FROM goff_reviews WHERE employee_id = ${employee}`;
  return NextResponse.json({ reviews: rows });
}

export async function POST(request: NextRequest) {
  if (!(await authorized())) return NextResponse.json({ error: 'Sign in to the portal first (same login as recruiting).' }, { status: 401 });
  const sql = goffDb();
  if (!sql) return NextResponse.json({ error: 'Database not configured.' }, { status: 503 });
  try {
    const body = await request.json().catch(() => null);
    const employeeId = String(body?.employeeId || '').trim();
    const kind = String(body?.kind || '').trim();
    const status = body?.status === 'complete' ? 'complete' : 'draft';
    const data = body?.data && typeof body.data === 'object' ? body.data : {};
    if (!employeeId || !['30day', 'staff'].includes(kind)) {
      return NextResponse.json({ error: 'Send { employeeId, kind, data, status }.' }, { status: 400 });
    }
    if (JSON.stringify(data).length > 60000) return NextResponse.json({ error: 'Review too large.' }, { status: 400 });

    // One 30-day review per employee: update in place; insert if new.
    const existing = await sql`SELECT id FROM goff_reviews WHERE employee_id = ${employeeId} AND kind = ${kind} ORDER BY id DESC LIMIT 1`;
    if (existing.length) {
      await sql`UPDATE goff_reviews SET data = ${sql.json(data as never)}, status = ${status}, updated_at = now() WHERE id = ${existing[0].id}`;
    } else {
      await sql`INSERT INTO goff_reviews (employee_id, kind, status, data) VALUES (${employeeId}, ${kind}, ${status}, ${sql.json(data as never)})`;
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[goff-reviews] save failed:', err);
    return NextResponse.json({ error: 'Could not save the review.' }, { status: 500 });
  }
}
