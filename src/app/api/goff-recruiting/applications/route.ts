import { NextRequest, NextResponse } from 'next/server';
import { addApplication, type GoffApplication } from '@/lib/goff-recruiting/store';
import { sendGoffEmail, escapeHtml } from '@/lib/goff-portal/notify';
import { goffDb } from '@/lib/goff-portal/db';

// A website application immediately becomes a live pipeline candidate so it
// shows up on Quinton's dashboard without any import step.
async function addPipelineCandidate(application: GoffApplication) {
  const sql = goffDb();
  if (!sql) return;
  const id = Date.now();
  const isWelderPath = /weld|fitter/i.test(application.role);
  const data = {
    due: 'Today',
    summary: application.notes ? `Website application. Notes: ${application.notes.slice(0, 500)}` : 'Website application — queued for review.',
    concerns: '',
    timeline: ['Submitted from Goff careers page'],
    notes: [],
  };
  await sql`
    INSERT INTO goff_candidates (id, first_name, last_name, role, source, path, stage, owner, priority, email, phone, location, data)
    VALUES (${id}, ${application.first}, ${application.last}, ${application.role}, ${'Website'},
      ${isWelderPath ? 'Welder path' : 'Other path'}, ${'Application received'}, ${'Quinton'}, ${'Normal'},
      ${application.email}, ${application.phone}, ${''}, ${sql.json(data as never)})
    ON CONFLICT (id) DO NOTHING`;
}

// Applicant alerts go out by email (Resend). The previous Telegram wiring was
// never set up, so applications were alerting nobody.
async function notifyGoffIntake(application: GoffApplication) {
  const html = [
    `<h2 style="margin:0 0 12px">🔔 New Goff applicant</h2>`,
    `<p><b>Name:</b> ${escapeHtml(`${application.first} ${application.last}`)}</p>`,
    `<p><b>Role:</b> ${escapeHtml(application.role)}</p>`,
    `<p><b>Source:</b> ${escapeHtml(application.source)}</p>`,
    `<p><b>Email:</b> ${escapeHtml(application.email)}</p>`,
    application.phone ? `<p><b>Phone:</b> ${escapeHtml(application.phone)}</p>` : '',
    `<blockquote style="border-left:4px solid #c0182b;margin:16px 0;padding:8px 14px;background:#f7f7f7">${application.notes ? escapeHtml(application.notes.slice(0, 800)) : '<i>No notes provided.</i>'}</blockquote>`,
  ].filter(Boolean).join('\n');
  const ok = await sendGoffEmail(`Goff applicant: ${application.first} ${application.last} — ${application.role}`, html);
  if (!ok) {
    console.log('[goff-recruiting] application saved (email notify unavailable):', {
      id: application.id,
      name: `${application.first} ${application.last}`,
      role: application.role,
    });
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

    // Candidate row + email alert are fire-and-forget so the apply-form
    // response stays fast; failures log but never bubble to the applicant.
    addPipelineCandidate(saved).catch((err) =>
      console.error('[goff-recruiting] pipeline insert crashed:', err),
    );
    notifyGoffIntake(saved).catch((err) =>
      console.error('[goff-recruiting] email fan-out crashed:', err),
    );

    return NextResponse.json({ ok: true, id: saved.id });
  } catch (err) {
    console.error('[goff-recruiting] application save failed:', err);
    return NextResponse.json({ error: 'Could not save application. Try again.' }, { status: 500 });
  }
}
