import { NextRequest, NextResponse } from 'next/server';
import { goffDb } from '@/lib/goff-portal/db';
import { getPortalSessionClientId } from '@/lib/portal/auth';

// Recruiter-editable email templates. The app ships with the Drive-derived
// defaults baked in; this table stores OVERRIDES only, keyed by template
// name. Deleting an override (body sent as null/empty) restores the default.

async function authorized(): Promise<boolean> {
  if (process.env.GOFF_RECRUITING_REQUIRE_AUTH !== 'true') return true;
  const clientId = await getPortalSessionClientId().catch(() => null);
  return clientId === 'goff-admin';
}

export async function GET() {
  const sql = goffDb();
  if (!sql) return NextResponse.json({ templates: {} });
  const rows = await sql`SELECT key, body FROM goff_templates`;
  const templates: Record<string, string> = {};
  for (const r of rows) templates[String(r.key)] = String(r.body);
  return NextResponse.json({ templates });
}

export async function POST(request: NextRequest) {
  if (!(await authorized())) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  const sql = goffDb();
  if (!sql) return NextResponse.json({ error: 'Database not configured.' }, { status: 503 });
  try {
    const bodyJson = await request.json().catch(() => null);
    const key = String(bodyJson?.key || '').trim().slice(0, 200);
    const body = bodyJson?.body == null ? '' : String(bodyJson.body).slice(0, 20000);
    if (!key) return NextResponse.json({ error: 'Template key required.' }, { status: 400 });
    if (!body.trim()) {
      // Empty body = reset to the built-in default.
      await sql`DELETE FROM goff_templates WHERE key = ${key}`;
      return NextResponse.json({ ok: true, reset: true });
    }
    await sql`INSERT INTO goff_templates (key, body) VALUES (${key}, ${body})
      ON CONFLICT (key) DO UPDATE SET body = EXCLUDED.body, updated_at = now()`;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[goff-templates] save failed:', err);
    return NextResponse.json({ error: 'Could not save the template.' }, { status: 500 });
  }
}
