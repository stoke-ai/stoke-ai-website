import { NextRequest, NextResponse } from 'next/server';
import { goffDb } from '@/lib/goff-portal/db';
import { getPortalSessionClientId } from '@/lib/portal/auth';

// Candidate persistence for the Goff recruiting pipeline (Neon).
// GET  -> full candidate list (the dashboard's source of truth)
// POST -> { candidates: [...] } bulk upsert (the app posts its list on save)
//
// Auth mirrors the middleware: open while GOFF_RECRUITING_REQUIRE_AUTH is not
// "true" (demo mode); once flipped, requires the goff-admin portal session.

const CORE_KEYS = ['first', 'last', 'role', 'source', 'path', 'stage', 'owner', 'priority', 'email', 'phone', 'location'] as const;

async function authorized(): Promise<boolean> {
  if (process.env.GOFF_RECRUITING_REQUIRE_AUTH !== 'true') return true;
  const clientId = await getPortalSessionClientId().catch(() => null);
  return clientId === 'goff-admin';
}

function rowToCandidate(r: Record<string, unknown>) {
  const data = (r.data && typeof r.data === 'object' ? r.data : {}) as Record<string, unknown>;
  return {
    id: Number(r.id),
    first: r.first_name,
    last: r.last_name,
    role: r.role,
    source: r.source,
    path: r.path,
    stage: r.stage,
    owner: r.owner,
    priority: r.priority,
    email: r.email,
    phone: r.phone,
    location: r.location,
    pinned: Boolean(r.pinned),
    stageUpdatedAt: r.stage_updated_at instanceof Date ? r.stage_updated_at.toISOString() : String(r.stage_updated_at || ''),
    ...data,
  };
}

export async function GET() {
  if (!(await authorized())) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  const sql = goffDb();
  if (!sql) return NextResponse.json({ error: 'Database not configured.' }, { status: 503 });
  const rows = await sql`SELECT * FROM goff_candidates ORDER BY stage_updated_at DESC`;
  return NextResponse.json({ candidates: rows.map(rowToCandidate) });
}

export async function POST(request: NextRequest) {
  if (!(await authorized())) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  const sql = goffDb();
  if (!sql) return NextResponse.json({ error: 'Database not configured.' }, { status: 503 });
  try {
    const body = await request.json().catch(() => null);
    const list = Array.isArray(body?.candidates) ? body.candidates : [];
    if (!list.length || list.length > 2000) {
      return NextResponse.json({ error: 'Send { candidates: [1..2000] }.' }, { status: 400 });
    }
    let upserts = 0;
    for (const raw of list) {
      const id = Number(raw?.id);
      if (!Number.isFinite(id) || id <= 0) continue;
      const core: Record<string, string> = {};
      for (const k of CORE_KEYS) core[k] = String(raw?.[k] ?? '').slice(0, 300);
      const pinned = raw?.pinned === true;
      const stageUpdatedAt = raw?.stageUpdatedAt && !Number.isNaN(Date.parse(raw.stageUpdatedAt)) ? new Date(raw.stageUpdatedAt) : new Date();
      // Everything non-core rides in data (summary, concerns, evidence,
      // clearance, offer, timeline, notes, due) so the app schema can evolve
      // without migrations.
      const data: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(raw || {})) {
        if (k === 'id' || k === 'pinned' || k === 'stageUpdatedAt' || (CORE_KEYS as readonly string[]).includes(k)) continue;
        data[k] = v;
      }
      await sql`
        INSERT INTO goff_candidates (id, first_name, last_name, role, source, path, stage, owner, priority, email, phone, location, pinned, stage_updated_at, data, updated_at)
        VALUES (${id}, ${core.first}, ${core.last}, ${core.role}, ${core.source}, ${core.path}, ${core.stage}, ${core.owner}, ${core.priority}, ${core.email}, ${core.phone}, ${core.location}, ${pinned}, ${stageUpdatedAt}, ${sql.json(data as never)}, now())
        ON CONFLICT (id) DO UPDATE SET
          first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, role = EXCLUDED.role,
          source = EXCLUDED.source, path = EXCLUDED.path, stage = EXCLUDED.stage, owner = EXCLUDED.owner,
          priority = EXCLUDED.priority, email = EXCLUDED.email, phone = EXCLUDED.phone, location = EXCLUDED.location,
          pinned = EXCLUDED.pinned, stage_updated_at = EXCLUDED.stage_updated_at, data = EXCLUDED.data, updated_at = now()`;
      upserts++;
    }
    return NextResponse.json({ ok: true, upserts });
  } catch (err) {
    console.error('[goff-candidates] upsert failed:', err);
    return NextResponse.json({ error: 'Could not save candidates.' }, { status: 500 });
  }
}
