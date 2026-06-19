import { NextResponse } from 'next/server';
import { clearPortalAdminSession } from '@/lib/portal/auth';

async function logout(request: Request) {
  await clearPortalAdminSession();
  return NextResponse.redirect(new URL('/admin/portal', request.url));
}

export async function POST(request: Request) {
  return logout(request);
}

export async function GET(request: Request) {
  return logout(request);
}
