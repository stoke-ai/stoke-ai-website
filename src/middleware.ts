import { NextRequest, NextResponse } from 'next/server';

const LEGACY_GOFF_HOSTS = new Set([
  'goff.stoke-ai.com',
  'goff-stoke-ai.vercel.app',
]);

function redirectTo(request: NextRequest, origin: string, pathname: string) {
  const destination = new URL(origin);
  destination.pathname = pathname;
  destination.search = request.nextUrl.search;
  return NextResponse.redirect(destination, 308);
}

export function middleware(request: NextRequest) {
  const host = request.headers.get('host')?.split(':')[0]?.toLowerCase() ?? '';
  const { pathname, searchParams } = request.nextUrl;

  // The former Goff vanity host was always public-facing. Keep every existing
  // bookmark working while making careers.goffwelding.com the canonical home.
  if (LEGACY_GOFF_HOSTS.has(host)) {
    return redirectTo(request, 'https://careers.goffwelding.com', pathname);
  }

  // Preserve old Stoke AI links after the Goff application was moved into its
  // own GitHub repository and Vercel project.
  if (pathname === '/goff-employee' || pathname.startsWith('/goff-employee/')) {
    const suffix = pathname.slice('/goff-employee'.length) || '/';
    return redirectTo(request, 'https://employees.goffwelding.com', suffix);
  }

  if (pathname === '/goff-careers' || pathname.startsWith('/goff-careers/')) {
    const suffix = pathname.slice('/goff-careers'.length) || '/';
    return redirectTo(request, 'https://careers.goffwelding.com', suffix);
  }

  if (pathname === '/goff-recruiting' || pathname.startsWith('/goff-recruiting/')) {
    const view = searchParams.get('view');
    if (view === 'career' || view === 'apply' || view === 'thanks') {
      return redirectTo(request, 'https://careers.goffwelding.com', '/');
    }

    const destinationPath = pathname === '/goff-recruiting' ? '/' : pathname;
    return redirectTo(request, 'https://portal.goffwelding.com', destinationPath);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
