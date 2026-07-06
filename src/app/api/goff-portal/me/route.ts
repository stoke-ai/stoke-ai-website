import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { parseUserToken, getUserById, GOFF_USER_COOKIE } from '@/lib/goff-portal/users';

// Who is logged in? Returns the current user's identity from the session cookie,
// or { user: null } when on the shared login (or not signed in).
export async function GET() {
  const jar = await cookies();
  const userId = parseUserToken(jar.get(GOFF_USER_COOKIE)?.value);
  if (!userId) return NextResponse.json({ user: null });
  const user = await getUserById(userId).catch(() => null);
  if (!user) return NextResponse.json({ user: null });
  return NextResponse.json({ user: { name: user.name, roles: user.roles, supervisor: user.supervisor } });
}
