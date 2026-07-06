import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyUserLogin, createUserToken, GOFF_USER_COOKIE } from '@/lib/goff-portal/users';
import { setPortalSession, verifyPortalLogin } from '@/lib/portal/auth';

// Goff recruiting login. Tries per-person accounts (goff_users) first, then
// falls back to the shared goffadmin code so nobody is ever locked out mid-
// rollout. On success it sets the portal authorization session (so the
// existing middleware gate passes unchanged) plus, for real users, an identity
// cookie the app reads to personalize and attribute actions.
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { username?: string; password?: string } | null;
  const username = body?.username?.trim();
  const password = body?.password?.trim();
  if (!username || !password) {
    return NextResponse.json({ error: 'Enter your username and password.' }, { status: 400 });
  }

  // 1) Personal account
  const user = await verifyUserLogin(username, password).catch(() => null);
  if (user) {
    await setPortalSession('goff-admin'); // authorization for the recruiting gate
    const jar = await cookies();
    jar.set(GOFF_USER_COOKIE, createUserToken(user.id), {
      httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 14,
    });
    return NextResponse.json({ ok: true, user: { name: user.name, roles: user.roles } });
  }

  // 2) Shared fallback (goffadmin + code)
  const clientId = verifyPortalLogin(username, password);
  if (clientId === 'goff-admin') {
    await setPortalSession('goff-admin');
    return NextResponse.json({ ok: true, user: null });
  }

  return NextResponse.json({ error: 'Username or password is incorrect.' }, { status: 401 });
}
