import { createHmac, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';
import { getPortalClientByUsername, portalClients } from './data';

const COOKIE_NAME = 'stoke_portal_session';
const ADMIN_COOKIE_NAME = 'stoke_portal_admin_session';
const MAX_AGE_SECONDS = 60 * 60 * 24 * 14;

type PortalCodeMap = Record<string, string>;

function getSessionSecret() {
  const secret = process.env.PORTAL_SESSION_SECRET || process.env.NEXTAUTH_SECRET;
  if (secret) return secret;

  if (process.env.NODE_ENV !== 'production') {
    return 'local-dev-portal-session-secret';
  }

  throw new Error('PORTAL_SESSION_SECRET is required in production.');
}

function parsePortalAccessCodes(): PortalCodeMap {
  const raw = process.env.PORTAL_ACCESS_CODES;

  if (!raw && process.env.NODE_ENV !== 'production') {
    return {
      'austin-kevin': 'austin-preview',
      'goff-welding': 'goff-preview',
      'rachel-hansen': 'rachel-preview',
      'handy-truck-lines': 'htl-preview',
      'stoke-ai': 'stoke-preview',
    };
  }

  if (!raw) return {};

  try {
    return JSON.parse(raw) as PortalCodeMap;
  } catch {
    return raw.split(',').reduce<PortalCodeMap>((codes, pair) => {
      const [clientId, code] = pair.split(':').map((part) => part?.trim());
      if (clientId && code) codes[clientId] = code;
      return codes;
    }, {});
  }
}

function safeCompare(a: string, b: string) {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);
  if (aBuffer.length !== bBuffer.length) return false;
  return timingSafeEqual(aBuffer, bBuffer);
}

function sign(value: string) {
  return createHmac('sha256', getSessionSecret()).update(value).digest('hex');
}

export function verifyPortalCode(clientId: string, code: string) {
  if (!portalClients.some((client) => client.id === clientId)) return false;

  const expectedCode = parsePortalAccessCodes()[clientId];
  if (!expectedCode) return false;

  return safeCompare(code, expectedCode);
}

export function verifyPortalLogin(username: string, password: string) {
  const client = getPortalClientByUsername(username);
  if (!client) return null;

  return verifyPortalCode(client.id, password) ? client.id : null;
}

export function createPortalToken(clientId: string) {
  const issuedAt = Date.now().toString();
  const payload = `${clientId}.${issuedAt}`;
  return `${payload}.${sign(payload)}`;
}

export function parsePortalToken(token: string | undefined) {
  if (!token) return null;

  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [clientId, issuedAt, signature] = parts;
  const payload = `${clientId}.${issuedAt}`;

  if (!safeCompare(signature, sign(payload))) return null;

  const issuedTime = Number(issuedAt);
  if (!Number.isFinite(issuedTime)) return null;

  const ageSeconds = (Date.now() - issuedTime) / 1000;
  if (ageSeconds > MAX_AGE_SECONDS) return null;

  if (!portalClients.some((client) => client.id === clientId)) return null;

  return clientId;
}

export async function getPortalSessionClientId() {
  const cookieStore = await cookies();
  return parsePortalToken(cookieStore.get(COOKIE_NAME)?.value);
}

export async function getPortalAdminSessionClientId() {
  const cookieStore = await cookies();
  const adminClientId = parsePortalToken(cookieStore.get(ADMIN_COOKIE_NAME)?.value);
  if (adminClientId === 'stoke-ai') return adminClientId;

  const clientId = parsePortalToken(cookieStore.get(COOKIE_NAME)?.value);
  return clientId === 'stoke-ai' ? clientId : null;
}

export async function setPortalSession(clientId: string) {
  const cookieStore = await cookies();
  const cookieOptions = {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: MAX_AGE_SECONDS,
    path: '/',
  } as const;

  cookieStore.set(COOKIE_NAME, createPortalToken(clientId), cookieOptions);

  if (clientId === 'stoke-ai') {
    cookieStore.set(ADMIN_COOKIE_NAME, createPortalToken(clientId), cookieOptions);
  }
}

export async function clearPortalSession() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, '', { maxAge: 0, path: '/' });
  cookieStore.set(COOKIE_NAME, '', { maxAge: 0, path: '/portal' });
  cookieStore.set(ADMIN_COOKIE_NAME, '', { maxAge: 0, path: '/' });
  cookieStore.set(ADMIN_COOKIE_NAME, '', { maxAge: 0, path: '/admin' });
}
