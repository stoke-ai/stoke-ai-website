import { promises as fs } from 'fs';
import os from 'os';
import path from 'path';
import { get, put } from '@vercel/blob';

export type GoffApplication = {
  id: string;
  first: string;
  last: string;
  email: string;
  phone: string;
  role: string;
  source: string;
  notes: string;
  createdAt: string;
};

type ApplicationStore = { applications: GoffApplication[] };

const STORE_PATH = process.env.GOFF_RECRUITING_STORE_PATH || path.join(os.tmpdir(), 'goff-recruiting-applications.json');
const BLOB_STORE_PATH = 'goff-recruiting/applications.json';

function useBlobStore() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID || process.env.VERCEL_OIDC_TOKEN);
}

function emptyStore(): ApplicationStore {
  return { applications: [] };
}

function makeId() {
  return `app_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
}

async function streamToText(stream: ReadableStream<Uint8Array>): Promise<string> {
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

async function readStore(): Promise<ApplicationStore> {
  if (useBlobStore()) {
    try {
      const blob = await get(BLOB_STORE_PATH, { access: 'private', useCache: false });
      if (!blob?.stream) return emptyStore();
      const raw = await streamToText(blob.stream);
      const parsed = JSON.parse(raw) as Partial<ApplicationStore>;
      return { applications: Array.isArray(parsed.applications) ? parsed.applications : [] };
    } catch {
      return emptyStore();
    }
  }
  try {
    const raw = await fs.readFile(STORE_PATH, 'utf8');
    const parsed = JSON.parse(raw) as Partial<ApplicationStore>;
    return { applications: Array.isArray(parsed.applications) ? parsed.applications : [] };
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return emptyStore();
    throw err;
  }
}

async function writeStore(store: ApplicationStore): Promise<void> {
  if (useBlobStore()) {
    await put(BLOB_STORE_PATH, JSON.stringify(store, null, 2), {
      access: 'private',
      allowOverwrite: true,
      contentType: 'application/json',
      cacheControlMaxAge: 60,
    });
    return;
  }
  await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
  await fs.writeFile(STORE_PATH, JSON.stringify(store, null, 2));
}

export async function addApplication(input: Omit<GoffApplication, 'id' | 'createdAt'>): Promise<GoffApplication> {
  const store = await readStore();
  const application: GoffApplication = {
    id: makeId(),
    ...input,
    createdAt: new Date().toISOString(),
  };
  store.applications.unshift(application);
  await writeStore(store);
  return application;
}

export async function listApplications(): Promise<GoffApplication[]> {
  const store = await readStore();
  return store.applications;
}
