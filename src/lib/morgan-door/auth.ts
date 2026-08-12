import { createHmac, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';

const COOKIE = 'md_review_session';
const MAX_AGE = 60 * 60 * 24 * 14;

function secret() {
  const value = process.env.PORTAL_SESSION_SECRET;
  if (!value) throw new Error('PORTAL_SESSION_SECRET is required.');
  return value;
}
function safeEqual(a: string, b: string) {
  const x = Buffer.from(a); const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}
function sign(value: string) { return createHmac('sha256', secret()).update(value).digest('hex'); }
export function verifyReviewLogin(username: string, code: string) {
  const expected = process.env.MORGAN_DOOR_REVIEW_CODE;
  return Boolean(expected && safeEqual(username.trim().toLowerCase(), 'braxton') && safeEqual(code, expected));
}
export function isSameOrigin(request:Request){const origin=request.headers.get('origin');if(!origin)return false;try{return new URL(origin).origin===new URL(request.url).origin;}catch{return false;}}
export async function setReviewSession() {
  const issued = Date.now().toString();
  const payload = `braxton.${issued}`;
  (await cookies()).set(COOKIE, `${payload}.${sign(payload)}`, { httpOnly:true, secure:process.env.NODE_ENV==='production', sameSite:'lax', path:'/', maxAge:MAX_AGE });
}
export async function clearReviewSession() {
  (await cookies()).set(COOKIE, '', { httpOnly:true, secure:process.env.NODE_ENV==='production', sameSite:'lax', path:'/', maxAge:0 });
}
export async function isReviewAuthenticated() {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return false;
  const [actor, issued, signature, ...extra] = token.split('.');
  if (extra.length || actor !== 'braxton' || !issued || !signature) return false;
  const payload = `${actor}.${issued}`;
  if (!safeEqual(signature, sign(payload))) return false;
  const age = (Date.now() - Number(issued)) / 1000;
  return Number.isFinite(age) && age >= 0 && age <= MAX_AGE;
}
