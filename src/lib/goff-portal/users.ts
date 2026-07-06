import { scryptSync, randomBytes, timingSafeEqual, createHmac } from 'crypto';
import { goffDb } from './db';

// Identity cookie carrying the logged-in user's id, separate from the portal
// authorization session. Format: userId.issuedAt.hmac
export const GOFF_USER_COOKIE = 'goff_user_session';
const USER_SESSION_MAX_AGE = 60 * 60 * 24 * 14; // 14 days

function userSecret(): string {
  return process.env.PORTAL_SESSION_SECRET || process.env.NEXTAUTH_SECRET
    || (process.env.NODE_ENV !== 'production' ? 'local-dev-portal-session-secret' : '');
}

export function createUserToken(userId: string): string {
  const issued = Date.now().toString();
  const sig = createHmac('sha256', userSecret()).update(`${userId}.${issued}`).digest('hex');
  return `${userId}.${issued}.${sig}`;
}

export function parseUserToken(token: string | undefined | null): string | null {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [userId, issued, sig] = parts;
  const expected = createHmac('sha256', userSecret()).update(`${userId}.${issued}`).digest('hex');
  if (expected.length !== sig.length) return null;
  if (!timingSafeEqual(Buffer.from(expected), Buffer.from(sig))) return null;
  if ((Date.now() - Number(issued)) / 1000 > USER_SESSION_MAX_AGE) return null;
  return userId;
}

// Per-person identity for the Goff portal. One table, two login methods:
// office staff use username+password, shop crew use phone+PIN (rollout later).
// Secrets are scrypt-hashed as scrypt$<saltHex>$<hashHex>.

export type GoffUser = {
  id: string;
  name: string;
  username: string | null;
  phone: string | null;
  roles: string[];
  supervisor: string | null;
  status: string;
};

export function hashSecret(secret: string): string {
  const salt = randomBytes(16);
  const hash = scryptSync(secret, salt, 32);
  return `scrypt$${salt.toString('hex')}$${hash.toString('hex')}`;
}

export function verifySecret(secret: string, stored: string | null | undefined): boolean {
  if (!stored) return false;
  const [scheme, saltHex, hashHex] = stored.split('$');
  if (scheme !== 'scrypt' || !saltHex || !hashHex) return false;
  const expected = Buffer.from(hashHex, 'hex');
  const actual = scryptSync(secret, Buffer.from(saltHex, 'hex'), expected.length);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

function rowToUser(r: Record<string, unknown>): GoffUser {
  return {
    id: String(r.id),
    name: String(r.name),
    username: (r.username as string) ?? null,
    phone: (r.phone as string) ?? null,
    roles: Array.isArray(r.roles) ? (r.roles as string[]) : [],
    supervisor: (r.supervisor as string) ?? null,
    status: String(r.status),
  };
}

// Returns the user on a correct username+password, else null. Bumps last_login.
export async function verifyUserLogin(username: string, password: string): Promise<GoffUser | null> {
  const sql = goffDb();
  if (!sql) return null;
  const uname = username.trim().toLowerCase();
  const rows = await sql`SELECT * FROM goff_users WHERE lower(username) = ${uname} AND status = 'active' LIMIT 1`;
  if (!rows.length) return null;
  if (!verifySecret(password, rows[0].secret_hash as string)) return null;
  await sql`UPDATE goff_users SET last_login_at = now() WHERE id = ${rows[0].id}`;
  return rowToUser(rows[0]);
}

export async function getUserById(id: string): Promise<GoffUser | null> {
  const sql = goffDb();
  if (!sql) return null;
  const rows = await sql`SELECT * FROM goff_users WHERE id = ${id} AND status = 'active' LIMIT 1`;
  return rows.length ? rowToUser(rows[0]) : null;
}
