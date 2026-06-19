import { NextResponse } from 'next/server';
import { setPortalAdminSession, verifyPortalAdminLogin } from '@/lib/portal/auth';

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { username?: string; password?: string } | null;
  const username = body?.username?.trim();
  const password = body?.password?.trim();

  if (!username || !password) {
    return NextResponse.json({ error: 'Enter your admin username and password.' }, { status: 400 });
  }

  if (!verifyPortalAdminLogin(username, password)) {
    return NextResponse.json({ error: 'Admin username or password is incorrect.' }, { status: 401 });
  }

  await setPortalAdminSession();
  return NextResponse.json({ ok: true });
}
