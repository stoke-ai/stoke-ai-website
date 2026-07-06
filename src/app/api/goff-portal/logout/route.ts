import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { GOFF_USER_COOKIE } from '@/lib/goff-portal/users';

// Clears both the identity cookie and the portal authorization session.
export async function POST() {
  const jar = await cookies();
  jar.delete(GOFF_USER_COOKIE);
  jar.delete('stoke_portal_session');
  return NextResponse.json({ ok: true });
}
