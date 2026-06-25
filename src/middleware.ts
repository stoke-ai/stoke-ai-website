import { NextRequest, NextResponse } from 'next/server';

const GOFF_HOSTS = new Set([
  'goff.stoke-ai.com',
  'goff-stoke-ai.vercel.app',
]);

export function middleware(request: NextRequest) {
  const host = request.headers.get('host')?.split(':')[0]?.toLowerCase() ?? '';
  const { pathname } = request.nextUrl;

  if (GOFF_HOSTS.has(host) && pathname === '/') {
    return NextResponse.rewrite(new URL('/goff-recruiting/index.html', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
