import { NextResponse } from 'next/server';
import { setPortalSession, verifyPortalCode } from '@/lib/portal/auth';

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { clientId?: string; accessCode?: string } | null;
  const clientId = body?.clientId?.trim();
  const accessCode = body?.accessCode?.trim();

  if (!clientId || !accessCode) {
    return NextResponse.json({ error: 'Choose a client and enter an access code.' }, { status: 400 });
  }

  if (!verifyPortalCode(clientId, accessCode)) {
    return NextResponse.json({ error: 'That access code did not match this client portal.' }, { status: 401 });
  }

  await setPortalSession(clientId);
  return NextResponse.json({ ok: true });
}
