import { NextRequest, NextResponse } from 'next/server';
import { goffDb } from '@/lib/goff-portal/db';

// Onboarding employee records. Created by the recruiting handoff when a
// candidate reaches "Schedule first day"; read by the employee portal's admin
// ops board so the queue is real across devices.

export async function GET() {
  const sql = goffDb();
  if (!sql) return NextResponse.json({ error: 'Database not configured.' }, { status: 503 });
  const rows = await sql`
    SELECT id, created_at, first_name, last_name, email, phone, role, supervisor, start_date, status, source
    FROM goff_employees ORDER BY created_at DESC LIMIT 200`;
  return NextResponse.json({ employees: rows });
}

export async function POST(request: NextRequest) {
  const sql = goffDb();
  if (!sql) return NextResponse.json({ error: 'Database not configured.' }, { status: 503 });
  try {
    const body = await request.json().catch(() => null);
    const first = String(body?.first || '').trim().slice(0, 80);
    const last = String(body?.last || '').trim().slice(0, 80);
    const email = String(body?.email || '').trim().slice(0, 200) || null;
    const phone = String(body?.phone || '').trim().slice(0, 60);
    const role = String(body?.role || '').trim().slice(0, 160);
    const supervisor = String(body?.supervisor || '').trim().slice(0, 120);
    const startDateRaw = String(body?.startDate || '').trim();
    const startDate = /^\d{4}-\d{2}-\d{2}$/.test(startDateRaw) ? startDateRaw : null;
    if (!first) return NextResponse.json({ error: 'Missing first name.' }, { status: 400 });

    // Upsert by email when present (repeat handoffs update, not duplicate).
    if (email) {
      const existing = await sql`SELECT id FROM goff_employees WHERE lower(email) = ${email.toLowerCase()} LIMIT 1`;
      if (existing.length) {
        await sql`
          UPDATE goff_employees SET first_name=${first}, last_name=${last}, phone=${phone},
            role=${role}, supervisor=${supervisor}, start_date=${startDate}, source=${'recruiting-handoff'}
          WHERE id = ${existing[0].id}`;
        return NextResponse.json({ ok: true, id: existing[0].id, updated: true });
      }
    }
    const rows = await sql`
      INSERT INTO goff_employees (first_name, last_name, email, phone, role, supervisor, start_date, status, source)
      VALUES (${first}, ${last}, ${email}, ${phone}, ${role}, ${supervisor}, ${startDate}, ${'onboarding'}, ${'recruiting-handoff'})
      RETURNING id`;
    return NextResponse.json({ ok: true, id: rows[0].id });
  } catch (err) {
    console.error('[goff-employees] upsert failed:', err);
    return NextResponse.json({ error: 'Could not save employee.' }, { status: 500 });
  }
}
