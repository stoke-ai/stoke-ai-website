import { NextRequest, NextResponse } from 'next/server';

const GOFF_HOSTS = new Set([
  'goff.stoke-ai.com',
  'goff-stoke-ai.vercel.app',
]);

const PORTAL_COOKIE = 'stoke_portal_session';
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

  // Vanity host (goff.stoke-ai.com) → public careers site. This stays
  // unauthenticated so applicants can apply directly.
  if (GOFF_HOSTS.has(host)) {
    if (pathname === '/' || pathname === '/apply' || pathname === '/index.html') {
      return NextResponse.rewrite(new URL('/goff-careers/index.html', request.url));
    }
    if (pathname.startsWith('/goff-careers')) {
      return NextResponse.next();
    }
    // The vanity host should NEVER expose the admin tool.
    if (pathname.startsWith('/goff-recruiting')) {
      return NextResponse.rewrite(new URL('/goff-careers/index.html', request.url));
    }
  }

  // Gate /goff-recruiting/* on the main domain: require a portal session
  // whose clientId === 'goff-admin'. Login page is exempt.
  //
  // The gate is OFF by default so the demo works without any env setup.
  // To lock it down later, set GOFF_RECRUITING_REQUIRE_AUTH=true in Vercel
  // along with PORTAL_SESSION_SECRET + PORTAL_ACCESS_CODES.
  const authRequired = process.env.GOFF_RECRUITING_REQUIRE_AUTH === 'true';
  if (authRequired && pathname.startsWith('/goff-recruiting') && !isPublicAdminPath(pathname)) {
    const token = request.cookies.get(PORTAL_COOKIE)?.value;
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
