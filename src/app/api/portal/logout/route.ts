import { NextResponse } from 'next/server';
import { clearPortalSession } from '@/lib/portal/auth';

async function logout(request: Request) {
  await clearPortalSession();
  return NextResponse.redirect(new URL('/portal', request.url), { status: 303 });
}

export async function POST(request: Request) {
  return logout(request);
}

export async function GET(request: Request) {
  return logout(request);
}
