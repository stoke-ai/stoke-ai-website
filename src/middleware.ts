import { NextRequest, NextResponse } from 'next/server';

const GOFF_HOSTS = new Set([
  'goff.stoke-ai.com',
  'goff-stoke-ai.vercel.app',
  'careers.goffwelding.com',
]);

// The one-portal domain: recruiting admin at the root (auth-gated), public
// careers at /careers and /apply, employee portal at /employee. The apex
// goffwelding.com stays with LinkNow — we only take subdomains.
const GOFF_PORTAL_HOSTS = new Set([
  'portal.goffwelding.com',
]);

const GOFF_EMPLOYEE_HOSTS = new Set([
  'employees.goffwelding.com',
  'employee.goffwelding.com',
]);

const GOFF_RECRUITING_COOKIE = 'goff_recruiting_session';
const GOFF_ADMIN_CLIENT_ID = 'goff-admin';
const MAX_SESSION_AGE_SECONDS = 60 * 60 * 24 * 14;

function getSessionSecret(): string | null {
  return process.env.PORTAL_SESSION_SECRET || process.env.NEXTAUTH_SECRET || (process.env.NODE_ENV !== 'production' ? 'local-dev-portal-session-secret' : null);
}

// Edge-safe HMAC verifier mirroring src/lib/portal/auth.ts.parsePortalToken.
// We can't import that helper here because middleware runs on the Edge
// runtime and it uses Node's crypto module. Web Crypto produces identical
// signatures, so we can validate sessions issued by the existing portal
// login flow without changes there.
async function hmacSha256Hex(secret: string, payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

function timingSafeEqualStr(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function clientIdFromCookie(token: string | undefined): Promise<string | null> {
  if (!token) return null;
  const secret = getSessionSecret();
  if (!secret) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [clientId, issuedAt, signature] = parts;
  const expected = await hmacSha256Hex(secret, `${clientId}.${issuedAt}`);
  if (!timingSafeEqualStr(expected, signature)) return null;
  const issuedMs = Number(issuedAt);
  if (!Number.isFinite(issuedMs)) return null;
  if ((Date.now() - issuedMs) / 1000 > MAX_SESSION_AGE_SECONDS) return null;
  return clientId;
}

// Paths under /goff-recruiting that must stay reachable without auth: the
// login page itself and any same-origin POST it makes to the portal login
// API (handled by the api/ exclusion in the matcher).
function isPublicAdminPath(pathname: string): boolean {
  return pathname.startsWith('/goff-recruiting/login');
}

export async function middleware(request: NextRequest) {
  const host = request.headers.get('host')?.split(':')[0]?.toLowerCase() ?? '';
  const { pathname } = request.nextUrl;

  // Vanity host (goff.stoke-ai.com) → public careers site, served by the
  // recruiting app's career view (single careers codebase; the app hard-locks
  // this host to career/apply views client-side). Stays unauthenticated so
  // applicants can apply directly.
  if (GOFF_HOSTS.has(host)) {
    if (pathname === '/' || pathname === '/apply' || pathname === '/careers' || pathname === '/index.html' || pathname.startsWith('/goff-careers')) {
      return NextResponse.rewrite(new URL('/goff-recruiting/index.html', request.url));
    }
    if (pathname.startsWith('/goff-recruiting/login')) {
      // Not even the login page belongs on the public host.
      return NextResponse.rewrite(new URL('/goff-recruiting/index.html', request.url));
    }
    if (pathname.startsWith('/goff-recruiting')) {
      return NextResponse.next(); // static assets for the SPA
    }
  }

  // Employee vanity host (employees.goffwelding.com) → employee onboarding
  // and resource portal. V1 is a private-link prototype; do not expose the
  // recruiting admin surface here.
  if (GOFF_EMPLOYEE_HOSTS.has(host)) {
    if (pathname === '/' || pathname === '/start' || pathname === '/index.html') {
      return NextResponse.rewrite(new URL('/goff-employee/index.html', request.url));
    }
    if (pathname.startsWith('/goff-employee')) {
      return NextResponse.next();
    }
    if (pathname.startsWith('/goff-recruiting')) {
      return NextResponse.rewrite(new URL('/goff-employee/index.html', request.url));
    }
  }

  // portal.goffwelding.com — the team's front door.
  if (GOFF_PORTAL_HOSTS.has(host)) {
    // Public careers experience on the portal domain (client locks to the
    // career view from the /careers and /apply paths).
    if (pathname === '/careers' || pathname === '/apply' || pathname.startsWith('/goff-careers')) {
      return NextResponse.rewrite(new URL('/goff-recruiting/index.html', request.url));
    }
    // Employee portal under /employee (assets load via /goff-employee/*).
    if (pathname === '/employee' || pathname === '/employee/') {
      return NextResponse.rewrite(new URL('/goff-employee/index.html', request.url));
    }
    // Root (and /admin) → recruiting admin, same session gate as the main
    // domain; /goff-recruiting/* and /goff-employee/* fall through to the
    // shared handling below so assets and the login page work unchanged.
    if (pathname === '/' || pathname === '/index.html' || pathname === '/admin') {
      if (process.env.GOFF_RECRUITING_REQUIRE_AUTH === 'true') {
        const token = request.cookies.get(GOFF_RECRUITING_COOKIE)?.value;
        const clientId = await clientIdFromCookie(token);
        if (clientId !== GOFF_ADMIN_CLIENT_ID) {
          const loginUrl = request.nextUrl.clone();
          loginUrl.pathname = '/goff-recruiting/login';
          loginUrl.search = `?next=${encodeURIComponent('/')}`;
          return NextResponse.redirect(loginUrl);
        }
      }
      return NextResponse.rewrite(new URL('/goff-recruiting/index.html', request.url));
    }
  }

  // Clean static route for the Goff employee portal prototype on the main
  // Stoke domain. The employee vanity host rewrite above handles production
  // domain access.
  if (pathname === '/goff-employee' || pathname === '/goff-employee/') {
    return NextResponse.rewrite(new URL('/goff-employee/index.html', request.url));
  }
  if (pathname === '/goff-recruiting' || pathname === '/goff-recruiting/') {
    const publicViewEarly = ['career', 'apply', 'thanks'].includes(request.nextUrl.searchParams.get('view') || '');
    if (process.env.GOFF_RECRUITING_REQUIRE_AUTH === 'true' && !publicViewEarly) {
      const token = request.cookies.get(GOFF_RECRUITING_COOKIE)?.value;
      const clientId = await clientIdFromCookie(token);
      if (clientId !== GOFF_ADMIN_CLIENT_ID) {
        const loginUrl = request.nextUrl.clone();
        loginUrl.pathname = '/goff-recruiting/login';
        loginUrl.search = `?next=${encodeURIComponent(pathname + request.nextUrl.search)}`;
        return NextResponse.redirect(loginUrl);
      }
    }
    return NextResponse.rewrite(new URL('/goff-recruiting/index.html', request.url));
  }
  // The standalone goff-careers app was removed (duplicate implementation);
  // any old links land on the single careers experience.
  if (pathname.startsWith('/goff-careers')) {
    const url = request.nextUrl.clone();
    url.pathname = '/goff-recruiting/';
    url.search = '?view=career';
    return NextResponse.redirect(url, 308);
  }

  // Gate /goff-recruiting/* on the main domain: require a portal session
  // whose clientId === 'goff-admin'. Login page is exempt.
  //
  // The gate is OFF by default so the demo works without any env setup.
  // To lock it down later, set GOFF_RECRUITING_REQUIRE_AUTH=true in Vercel
  // along with PORTAL_SESSION_SECRET + PORTAL_ACCESS_CODES.
  const authRequired = process.env.GOFF_RECRUITING_REQUIRE_AUTH === 'true';
  // The public careers experience stays reachable when the admin gate is on:
  // ?view=career|apply|thanks loads without a session (candidate data is
  // separately protected by the API's own auth), and static assets must load
  // so the careers SPA can render at all.
  const publicView = ['career', 'apply', 'thanks'].includes(request.nextUrl.searchParams.get('view') || '');
  const isStaticAsset = /\.(js|css|png|jpg|jpeg|svg|ico|webp|woff2?)$/i.test(pathname);
  if (authRequired && pathname.startsWith('/goff-recruiting') && !isPublicAdminPath(pathname) && !publicView && !isStaticAsset) {
    const token = request.cookies.get(GOFF_RECRUITING_COOKIE)?.value;
    const clientId = await clientIdFromCookie(token);
    if (clientId !== GOFF_ADMIN_CLIENT_ID) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = '/goff-recruiting/login';
      loginUrl.search = `?next=${encodeURIComponent(pathname + request.nextUrl.search)}`;
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
