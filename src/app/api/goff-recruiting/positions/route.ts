import { NextRequest, NextResponse } from 'next/server';
import { goffDb } from '@/lib/goff-portal/db';
import { getPortalSessionClientId } from '@/lib/portal/auth';

// Admin-managed job listings. GET is PUBLIC (the careers page has no login and
// must show live open roles); POST requires the goff-admin session and replaces
// the whole set (handles add/edit/delete/reorder for this small managed list).

const CORE = ['title', 'type', 'path', 'summary', 'payRange', 'schedule', 'location', 'certifications', 'roleFit'] as const;

type StoredPosition = {
  id: string;
  status: 'open' | 'closed';
  sort_order: number;
  data: Record<string, unknown>;
};

async function authorized(): Promise<boolean> {
  if (process.env.GOFF_RECRUITING_REQUIRE_AUTH !== 'true') return true;
  const clientId = await getPortalSessionClientId().catch(() => null);
  return clientId === 'goff-admin';
}

function rowToPosition(r: Record<string, unknown>) {
  const data = (r.data && typeof r.data === 'object' ? r.data : {}) as Record<string, unknown>;
  return { id: String(r.id), status: String(r.status || 'open'), ...data };
}

export async function GET() {
  const sql = goffDb();
  if (!sql) return NextResponse.json({ positions: [] });
  const rows = await sql`SELECT id, status, data FROM goff_positions ORDER BY sort_order ASC, id ASC`;
  return NextResponse.json({ positions: rows.map(rowToPosition) });
}

export async function POST(request: NextRequest) {
  if (!(await authorized())) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  const sql = goffDb();
  if (!sql) return NextResponse.json({ error: 'Database not configured.' }, { status: 503 });
  try {
    const body = await request.json().catch(() => null);
    const list = Array.isArray(body?.positions) ? body.positions : null;
    if (!list || list.length > 200) {
      return NextResponse.json({ error: 'Send { positions: [0..200] }.' }, { status: 400 });
    }
    // Normalize + validate before writing.
    const clean = list
      .map((raw: Record<string, unknown>, i: number): StoredPosition => {
        const id = String(raw?.id ?? '').trim().slice(0, 80) || `role-${Date.now()}-${i}`;
        const status = raw?.status === 'closed' ? 'closed' : 'open';
        const data: Record<string, unknown> = {};
        for (const k of CORE) data[k] = String(raw?.[k] ?? '').slice(0, 4000);
        data.perks = Array.isArray(raw?.perks) ? (raw.perks as unknown[]).slice(0, 20).map((p) => String(p).slice(0, 300)) : [];
        return { id, status, sort_order: i, data };
      })
      .filter((p: StoredPosition) => p.data.title);

    // Full replace in one transaction so deletes and reorders apply cleanly.
    await sql.begin(async (tx) => {
      await tx`DELETE FROM goff_positions`;
      for (const p of clean) {
        await tx`INSERT INTO goff_positions (id, sort_order, status, data)
          VALUES (${p.id}, ${p.sort_order}, ${p.status}, ${tx.json(p.data as never)})
          ON CONFLICT (id) DO UPDATE SET sort_order = EXCLUDED.sort_order, status = EXCLUDED.status, data = EXCLUDED.data, updated_at = now()`;
      }
    });
    return NextResponse.json({ ok: true, count: clean.length });
  } catch (err) {
    console.error('[goff-positions] save failed:', err);
    return NextResponse.json({ error: 'Could not save positions.' }, { status: 500 });
  }
}
