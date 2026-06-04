import { NextResponse } from 'next/server';
import { setPortalSession, verifyPortalCode, verifyPortalLogin } from '@/lib/portal/auth';

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { clientId?: string; accessCode?: string; username?: string; password?: string } | null;
  const username = body?.username?.trim();
  const password = body?.password?.trim();
  const clientId = body?.clientId?.trim();
  const accessCode = body?.accessCode?.trim();

  if (username || password) {
    if (!username || !password) {
      return NextResponse.json({ error: 'Enter your username and password.' }, { status: 400 });
    }

    const verifiedClientId = verifyPortalLogin(username, password);
    if (!verifiedClientId) {
      return NextResponse.json({ error: 'Username or password is incorrect.' }, { status: 401 });
    }

    await setPortalSession(verifiedClientId);
    return NextResponse.json({ ok: true });
  }

  if (!clientId || !accessCode) {
    return NextResponse.json({ error: 'Enter your username and password.' }, { status: 400 });
  }

  if (!verifyPortalCode(clientId, accessCode)) {
    return NextResponse.json({ error: 'Username or password is incorrect.' }, { status: 401 });
  }

  await setPortalSession(clientId);
  return NextResponse.json({ ok: true });
}
