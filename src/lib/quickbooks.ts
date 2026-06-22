import { get, put } from '@vercel/blob';
import crypto from 'crypto';

export type QuickBooksTokenSet = {
  realmId: string;
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: string;
  refreshTokenExpiresAt?: string;
  connectedAt: string;
  updatedAt: string;
};

type IntuitTokenResponse = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  x_refresh_token_expires_in?: number;
  token_type: string;
};

type EncryptedTokenEnvelope = {
  version: 1;
  algorithm: 'aes-256-gcm';
  iv: string;
  tag: string;
  ciphertext: string;
  updatedAt: string;
};

const TOKEN_BLOB_PATH = 'quickbooks/token.json';
const AUTH_BASE_URL = 'https://appcenter.intuit.com/connect/oauth2';
const TOKEN_URL = 'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer';
const API_BASE_URL = 'https://quickbooks.api.intuit.com';
const SCOPES = ['com.intuit.quickbooks.accounting', 'openid', 'profile', 'email'];

export function getQuickBooksConfig() {
  const clientId = process.env.QUICKBOOKS_CLIENT_ID || process.env.QBO_CLIENT_ID;
  const clientSecret = process.env.QUICKBOOKS_CLIENT_SECRET || process.env.QBO_CLIENT_SECRET;
  const redirectUri = process.env.QUICKBOOKS_REDIRECT_URI || process.env.QBO_REDIRECT_URI;
  const setupSecret = process.env.QUICKBOOKS_SETUP_SECRET || process.env.QBO_SETUP_SECRET;
  const encryptionKey = process.env.QUICKBOOKS_TOKEN_ENCRYPTION_KEY || process.env.QBO_TOKEN_ENCRYPTION_KEY;

  return { clientId, clientSecret, redirectUri, setupSecret, encryptionKey };
}

type QuickBooksConfig = {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  setupSecret: string;
  encryptionKey: string;
};

export function requireQuickBooksConfig(): QuickBooksConfig {
  const config = getQuickBooksConfig();
  const missing = Object.entries(config)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(`Missing QuickBooks environment variables: ${missing.join(', ')}`);
  }

  return config as QuickBooksConfig;
}

export function isAuthorizedSetupRequest(request: Request) {
  const configuredSecret = getQuickBooksConfig().setupSecret;
  if (!configuredSecret) return false;

  const url = new URL(request.url);
  const providedSecret = url.searchParams.get('key') || request.headers.get('x-quickbooks-setup-secret') || '';
  return safeEqual(providedSecret, configuredSecret);
}

export function buildAuthorizationUrl(request: Request) {
  const { clientId, redirectUri, setupSecret } = requireQuickBooksConfig();
  const state = signState({ issuedAt: Date.now(), nonce: crypto.randomUUID() }, setupSecret);
  const url = new URL(AUTH_BASE_URL);

  url.searchParams.set('client_id', clientId);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('scope', SCOPES.join(' '));
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('state', state);

  // Preserve the public origin for a simple post-connect link, without trusting it for OAuth validation.
  const origin = new URL(request.url).origin;
  url.searchParams.set('claims', JSON.stringify({ id_token: { email: null } }));

  return { authorizationUrl: url.toString(), state, origin };
}

export function verifyState(state: string) {
  const { setupSecret } = requireQuickBooksConfig();
  const decoded = verifySignedState(state, setupSecret);
  const maxAgeMs = 15 * 60 * 1000;

  if (Date.now() - decoded.issuedAt > maxAgeMs) {
    throw new Error('QuickBooks authorization state has expired. Start the connection again.');
  }

  return decoded;
}

export async function exchangeAuthorizationCode(code: string, realmId: string) {
  const { clientId, clientSecret, redirectUri } = requireQuickBooksConfig();
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri,
  });

  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`QuickBooks token exchange failed (${response.status}): ${redact(text)}`);
  }

  const tokenResponse = (await response.json()) as IntuitTokenResponse;
  const now = new Date();
  const tokenSet: QuickBooksTokenSet = {
    realmId,
    accessToken: tokenResponse.access_token,
    refreshToken: tokenResponse.refresh_token,
    accessTokenExpiresAt: new Date(now.getTime() + tokenResponse.expires_in * 1000).toISOString(),
    refreshTokenExpiresAt: tokenResponse.x_refresh_token_expires_in
      ? new Date(now.getTime() + tokenResponse.x_refresh_token_expires_in * 1000).toISOString()
      : undefined,
    connectedAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };

  await saveTokenSet(tokenSet);
  return tokenSet;
}

export async function getConnectionStatus() {
  const tokenSet = await loadTokenSet();
  if (!tokenSet) return { connected: false as const };

  return {
    connected: true as const,
    realmId: tokenSet.realmId,
    connectedAt: tokenSet.connectedAt,
    updatedAt: tokenSet.updatedAt,
    accessTokenExpiresAt: tokenSet.accessTokenExpiresAt,
    refreshTokenExpiresAt: tokenSet.refreshTokenExpiresAt,
  };
}

export async function quickBooksApiFetch(path: string, init: RequestInit = {}) {
  const tokenSet = await getFreshTokenSet();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      Accept: 'application/json',
      ...(init.headers || {}),
      Authorization: `Bearer ${tokenSet.accessToken}`,
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`QuickBooks API request failed (${response.status}): ${redact(text)}`);
  }

  return response;
}

export async function getFreshTokenSet() {
  const tokenSet = await loadTokenSet();
  if (!tokenSet) throw new Error('QuickBooks is not connected yet.');

  const expiresAt = new Date(tokenSet.accessTokenExpiresAt).getTime();
  const refreshBufferMs = 5 * 60 * 1000;
  if (Date.now() < expiresAt - refreshBufferMs) return tokenSet;

  return refreshAccessToken(tokenSet);
}

async function refreshAccessToken(tokenSet: QuickBooksTokenSet) {
  const { clientId, clientSecret } = requireQuickBooksConfig();
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: tokenSet.refreshToken,
  });

  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`QuickBooks token refresh failed (${response.status}): ${redact(text)}`);
  }

  const tokenResponse = (await response.json()) as IntuitTokenResponse;
  const now = new Date();
  const refreshed: QuickBooksTokenSet = {
    ...tokenSet,
    accessToken: tokenResponse.access_token,
    refreshToken: tokenResponse.refresh_token || tokenSet.refreshToken,
    accessTokenExpiresAt: new Date(now.getTime() + tokenResponse.expires_in * 1000).toISOString(),
    refreshTokenExpiresAt: tokenResponse.x_refresh_token_expires_in
      ? new Date(now.getTime() + tokenResponse.x_refresh_token_expires_in * 1000).toISOString()
      : tokenSet.refreshTokenExpiresAt,
    updatedAt: now.toISOString(),
  };

  await saveTokenSet(refreshed);
  return refreshed;
}

async function saveTokenSet(tokenSet: QuickBooksTokenSet) {
  if (!hasDurableTokenStore()) {
    throw new Error('BLOB_READ_WRITE_TOKEN is required before saving QuickBooks tokens.');
  }

  const encrypted = encryptTokenSet(tokenSet);
  await put(TOKEN_BLOB_PATH, JSON.stringify(encrypted, null, 2), {
    access: 'private',
    contentType: 'application/json',
    allowOverwrite: true,
  });
}

async function loadTokenSet() {
  if (!hasDurableTokenStore() || !getQuickBooksConfig().encryptionKey) return null;

  try {
    const blob = await get(TOKEN_BLOB_PATH, { access: 'private', useCache: false });
    if (!blob?.stream) return null;
    const text = await streamToText(blob.stream);
    return decryptTokenSet(JSON.parse(text) as EncryptedTokenEnvelope);
  } catch (error) {
    if (error instanceof Error && /not found|404/i.test(error.message)) return null;
    return null;
  }
}

function hasDurableTokenStore() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID || process.env.VERCEL_OIDC_TOKEN);
}

function encryptTokenSet(tokenSet: QuickBooksTokenSet): EncryptedTokenEnvelope {
  const key = encryptionKeyBytes();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const plaintext = Buffer.from(JSON.stringify(tokenSet), 'utf8');
  const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const tag = cipher.getAuthTag();

  return {
    version: 1,
    algorithm: 'aes-256-gcm',
    iv: iv.toString('base64'),
    tag: tag.toString('base64'),
    ciphertext: ciphertext.toString('base64'),
    updatedAt: new Date().toISOString(),
  };
}

function decryptTokenSet(envelope: EncryptedTokenEnvelope): QuickBooksTokenSet {
  if (envelope.version !== 1 || envelope.algorithm !== 'aes-256-gcm') {
    throw new Error('Unsupported QuickBooks token envelope.');
  }

  const key = encryptionKeyBytes();
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(envelope.iv, 'base64'));
  decipher.setAuthTag(Buffer.from(envelope.tag, 'base64'));
  const plaintext = Buffer.concat([
    decipher.update(Buffer.from(envelope.ciphertext, 'base64')),
    decipher.final(),
  ]);

  return JSON.parse(plaintext.toString('utf8')) as QuickBooksTokenSet;
}

function encryptionKeyBytes() {
  const configured = requireQuickBooksConfig().encryptionKey;

  if (/^[A-Za-z0-9+/=]{43,88}$/.test(configured)) {
    const decoded = Buffer.from(configured, 'base64');
    if (decoded.length === 32) return decoded;
  }

  return crypto.createHash('sha256').update(configured).digest();
}

function signState(payload: { issuedAt: number; nonce: string }, secret: string) {
  const body = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
  const signature = crypto.createHmac('sha256', secret).update(body).digest('base64url');
  return `${body}.${signature}`;
}

function verifySignedState(state: string, secret: string) {
  const [body, signature] = state.split('.');
  if (!body || !signature) throw new Error('Invalid QuickBooks authorization state.');

  const expected = crypto.createHmac('sha256', secret).update(body).digest('base64url');
  if (!safeEqual(signature, expected)) throw new Error('Invalid QuickBooks authorization state signature.');

  const parsed = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as { issuedAt: number; nonce: string };
  if (!Number.isFinite(parsed.issuedAt) || !parsed.nonce) throw new Error('Invalid QuickBooks authorization state payload.');
  return parsed;
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
}

async function streamToText(stream: ReadableStream<Uint8Array>) {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let text = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    text += decoder.decode(value, { stream: true });
  }

  text += decoder.decode();
  return text;
}

function redact(text: string) {
  return text
    .replace(/access_token[^,}\]]+/gi, 'access_token:<redacted>')
    .replace(/refresh_token[^,}\]]+/gi, 'refresh_token:<redacted>')
    .slice(0, 1000);
}
