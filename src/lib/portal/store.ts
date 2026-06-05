import { promises as fs } from 'fs';
import os from 'os';
import path from 'path';
import { get, put } from '@vercel/blob';

export type PortalMessageStatus = 'new' | 'seen' | 'replied' | 'converted' | 'closed';
export type PortalActivityType = 'client-update' | 'blaze-reply' | 'status-change' | 'progress-note';

export type PortalMessage = {
  id: string;
  clientId: string;
  clientName: string;
  kind: 'reply' | 'new-item';
  cardId?: string;
  cardTitle?: string;
  message: string;
  status: PortalMessageStatus;
  createdAt: string;
  updatedAt: string;
  blazeReply?: string;
  progressNote?: string;
};

export type PortalActivity = {
  id: string;
  clientId: string;
  cardId?: string;
  cardTitle?: string;
  type: PortalActivityType;
  text: string;
  createdAt: string;
  visibleToClient: boolean;
};

type PortalStore = {
  messages: PortalMessage[];
  activity: PortalActivity[];
};

const STORE_PATH = process.env.PORTAL_STORE_PATH || path.join(os.tmpdir(), 'stoke-portal-store.json');
const BLOB_STORE_PATH = 'portal-store/store.json';

function useBlobStore() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID || process.env.VERCEL_OIDC_TOKEN);
}

function emptyStore(): PortalStore {
  return { messages: [], activity: [] };
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

function now() {
  return new Date().toISOString();
}

function makeId(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
}

async function readStore(): Promise<PortalStore> {
  if (useBlobStore()) {
    const blob = await get(BLOB_STORE_PATH, { access: 'private', useCache: false });
    if (!blob?.stream) return emptyStore();

    const raw = await streamToText(blob.stream);
    const parsed = JSON.parse(raw) as Partial<PortalStore>;
    return {
      messages: Array.isArray(parsed.messages) ? parsed.messages : [],
      activity: Array.isArray(parsed.activity) ? parsed.activity : [],
    };
  }

  try {
    const raw = await fs.readFile(STORE_PATH, 'utf8');
    const parsed = JSON.parse(raw) as Partial<PortalStore>;
    return {
      messages: Array.isArray(parsed.messages) ? parsed.messages : [],
      activity: Array.isArray(parsed.activity) ? parsed.activity : [],
    };
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code === 'ENOENT') return emptyStore();
    throw error;
  }
}

async function writeStore(store: PortalStore) {
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

export async function createPortalMessage(input: {
  clientId: string;
  clientName: string;
  kind: 'reply' | 'new-item';
  cardId?: string;
  cardTitle?: string;
  message: string;
}) {
  const store = await readStore();
  const timestamp = now();
  const message: PortalMessage = {
    id: makeId('msg'),
    clientId: input.clientId,
    clientName: input.clientName,
    kind: input.kind,
    cardId: input.cardId,
    cardTitle: input.cardTitle,
    message: input.message,
    status: 'new',
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  const activity: PortalActivity = {
    id: makeId('act'),
    clientId: input.clientId,
    cardId: input.cardId,
    cardTitle: input.cardTitle,
    type: 'client-update',
    text: input.message,
    createdAt: timestamp,
    visibleToClient: true,
  };

  store.messages.push(message);
  store.activity.push(activity);
  await writeStore(store);
  return message;
}

export async function listPortalMessages(clientId?: string) {
  const store = await readStore();
  const messages = clientId ? store.messages.filter((message) => message.clientId === clientId) : store.messages;
  return messages.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function listPortalActivity(clientId: string, cardId?: string) {
  const store = await readStore();
  return store.activity
    .filter((item) => item.clientId === clientId && item.visibleToClient)
    .filter((item) => !cardId || item.cardId === cardId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getLatestPortalMessage(clientId: string, cardId?: string) {
  const messages = await listPortalMessages(clientId);
  return messages.find((message) => (cardId ? message.cardId === cardId : !message.cardId)) ?? null;
}

export async function updatePortalMessage(
  id: string,
  updates: {
    status?: PortalMessageStatus;
    blazeReply?: string;
    progressNote?: string;
  },
) {
  const store = await readStore();
  const message = store.messages.find((item) => item.id === id);
  if (!message) return null;

  const timestamp = now();
  const previousStatus = message.status;
  message.status = updates.status ?? message.status;
  message.blazeReply = updates.blazeReply?.trim() || message.blazeReply;
  message.progressNote = updates.progressNote?.trim() || message.progressNote;
  message.updatedAt = timestamp;

  if (updates.blazeReply?.trim()) {
    store.activity.push({
      id: makeId('act'),
      clientId: message.clientId,
      cardId: message.cardId,
      cardTitle: message.cardTitle,
      type: 'blaze-reply',
      text: updates.blazeReply.trim(),
      createdAt: timestamp,
      visibleToClient: true,
    });
    message.status = 'replied';
  }

  if (updates.progressNote?.trim()) {
    store.activity.push({
      id: makeId('act'),
      clientId: message.clientId,
      cardId: message.cardId,
      cardTitle: message.cardTitle,
      type: 'progress-note',
      text: updates.progressNote.trim(),
      createdAt: timestamp,
      visibleToClient: true,
    });
  }

  if (updates.status && updates.status !== previousStatus) {
    store.activity.push({
      id: makeId('act'),
      clientId: message.clientId,
      cardId: message.cardId,
      cardTitle: message.cardTitle,
      type: 'status-change',
      text: `Blaze marked this ${message.status}.`,
      createdAt: timestamp,
      visibleToClient: true,
    });
  }

  await writeStore(store);
  return message;
}
