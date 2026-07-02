import { NextRequest, NextResponse } from 'next/server';
import { goffDb } from '@/lib/goff-portal/db';
import { sendGoffEmail, escapeHtml } from '@/lib/goff-portal/notify';

// In-portal form submissions. Routing (who receives which form) is pending
// Austin's confirmation — until then every submission stores in Neon and
// emails the default recipient. Swapping recipients later is configuration.

const ALLOWED_FORMS: Record<string, string> = {
  damage: 'Company Damage Report',
  incident: 'Incident Report',
  nearmiss: 'Near-Miss Report',
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const formId = String(body?.formId || '').trim();
    const title = ALLOWED_FORMS[formId];
    if (!title) return NextResponse.json({ error: 'Unknown form.' }, { status: 400 });

    const fieldsRaw = body?.fields;
    if (!fieldsRaw || typeof fieldsRaw !== 'object' || Array.isArray(fieldsRaw)) {
      return NextResponse.json({ error: 'Missing fields.' }, { status: 400 });
    }
    // Sanitize: strings only, bounded sizes, max 40 keys.
    const fields: Record<string, string> = {};
    for (const [k, v] of Object.entries(fieldsRaw).slice(0, 40)) {
      fields[String(k).slice(0, 80)] = String(v ?? '').slice(0, 4000);
    }
    const submittedName = String(body?.submittedName || '').trim().slice(0, 120);

    const hasContent = Object.values(fields).some((v) => v.trim().length > 0);
    if (!hasContent) return NextResponse.json({ error: 'Form is empty.' }, { status: 400 });

    const sql = goffDb();
    if (!sql) return NextResponse.json({ error: 'Database not configured.' }, { status: 503 });
    const rows = await sql`
      INSERT INTO goff_form_submissions (form_id, submitted_name, fields)
      VALUES (${formId}, ${submittedName}, ${sql.json(fields)})
      RETURNING id, created_at`;
    const id = Number(rows[0].id);

    const fieldRows = Object.entries(fields)
      .filter(([, v]) => v.trim())
      .map(([k, v]) => `<tr><td style="padding:6px 12px 6px 0;color:#666;vertical-align:top;white-space:nowrap"><b>${escapeHtml(k)}</b></td><td style="padding:6px 0">${escapeHtml(v).replace(/\n/g, '<br>')}</td></tr>`)
      .join('');
    const html = [
      `<h2 style="margin:0 0 4px">🚨 ${escapeHtml(title)} — submission #${id}</h2>`,
      `<p style="margin:0 0 16px;color:#666">Submitted by: <b>${escapeHtml(submittedName || 'Anonymous')}</b></p>`,
      `<table style="border-collapse:collapse">${fieldRows}</table>`,
      `<p style="margin-top:16px;color:#999;font-size:12px">Routing note: recipients pending Goff confirmation — this went to the default recipient.</p>`,
    ].join('\n');
    // Awaited: Vercel freezes the function after the response, so unawaited
    // notifications silently never send.
    const notified = await sendGoffEmail(`Goff ${title}${submittedName ? ` — ${submittedName}` : ' — Anonymous'}`, html).catch((err) => {
      console.error('[goff-forms] email notify failed:', err);
      return false;
    });

    return NextResponse.json({ ok: true, id, notified });
  } catch (err) {
    console.error('[goff-forms] save failed:', err);
    return NextResponse.json({ error: 'Could not submit. Try again or tell your supervisor directly.' }, { status: 500 });
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
    SELECT id, created_at, form_id, submitted_name, fields, status
    FROM goff_form_submissions ORDER BY created_at DESC LIMIT 200`;
  return NextResponse.json({ submissions: rows });
}
