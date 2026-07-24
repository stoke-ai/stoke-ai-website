#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const dataPath = path.join(root, 'src/lib/command-center/data.json');
const pagePath = path.join(root, 'src/app/command-center/page.tsx');
const authPath = path.join(root, 'src/lib/portal/auth.ts');
const cssPath = path.join(root, 'src/app/command-center/command-center.module.css');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const page = fs.readFileSync(pagePath, 'utf8');
const auth = fs.readFileSync(authPath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');

const failures = [];
const requireValue = (condition, message) => { if (!condition) failures.push(message); };
const freshnessStates = ['verified', 'reported', 'stale'];
const validDate = (value) => typeof value === 'string' && Number.isFinite(Date.parse(value));
const reconciledTime = Date.parse(data.reconciledAt);
const notFuture = (value) => validDate(value) && Date.parse(value) <= reconciledTime;

requireValue(validDate(data.reconciledAt), 'reconciledAt must be a valid ISO date.');
requireValue(!('reconciledLabel' in data), 'Do not separately maintain a reconciledLabel; render it from reconciledAt.');
requireValue(data.clients.length === 4, 'Expected exactly four active client records.');
requireValue(new Set(data.clients.map((client) => client.id)).size === data.clients.length, 'Client IDs must be unique.');
requireValue(['goff', 'handy', 'morgan', 'rachel'].every((id) => data.clients.some((client) => client.id === id)), 'Missing an expected active client.');

for (const client of data.clients) {
  for (const field of ['name', 'outcome', 'lane', 'state', 'nextMilestone', 'nextOwner', 'jeffAction', 'risk', 'decision', 'verifiedAt', 'freshness']) {
    requireValue(Boolean(client[field]), `${client.id} is missing ${field}.`);
  }
  requireValue(['on-track', 'watch'].includes(client.health), `${client.id} has an invalid health state.`);
  requireValue(freshnessStates.includes(client.freshness), `${client.id} has an invalid freshness state.`);
  requireValue(notFuture(client.verifiedAt), `${client.id} has an invalid or future verification date.`);
  requireValue(Array.isArray(client.sources) && client.sources.length > 0, `${client.id} needs source evidence.`);
}

for (const change of data.changes) {
  requireValue(freshnessStates.includes(change.confidence), `${change.client} change has an invalid confidence state.`);
  requireValue(validDate(change.date), `${change.client} change has an invalid date.`);
}

for (const decision of data.decisions) {
  for (const field of ['client', 'type', 'statement', 'freshness', 'verifiedAt', 'source']) {
    requireValue(Boolean(decision[field]), `${decision.client || 'Unknown'} decision is missing ${field}.`);
  }
  requireValue(freshnessStates.includes(decision.freshness), `${decision.client} decision has an invalid freshness state.`);
  requireValue(notFuture(decision.verifiedAt), `${decision.client} decision has an invalid or future verification date.`);
  const client = data.clients.find((candidate) => candidate.name.startsWith(decision.client));
  requireValue(Boolean(client), `${decision.client} decision has no client record.`);
  if (client) {
    requireValue(decision.freshness === client.freshness, `${decision.client} decision freshness must match its client record.`);
    requireValue(decision.verifiedAt === client.verifiedAt, `${decision.client} decision date must match its client record.`);
  }
}

const roomCount = (label) => data.waitingRooms.find((room) => room.label === label)?.count;
requireValue(data.summary.needsJeff === roomCount('Waiting on Jeff'), 'Needs Jeff summary does not match its waiting room.');
requireValue(data.summary.blazeOwned === data.blazeWork.length, 'Blaze-owned summary does not match its work list.');
requireValue(data.summary.waitingOnClient === roomCount('Waiting on client'), 'Waiting-on-client summary does not match its waiting room.');
requireValue(data.summary.needsFreshnessCheck === data.clients.filter((client) => client.freshness === 'stale').length, 'Freshness-check summary does not match stale client records.');
requireValue(data.blazeWork.every((item) => ['clear', 'watch', 'moving'].includes(item.tone)), 'Blaze work contains an invalid tone.');
requireValue(data.waitingRooms.every((room) => ['clear', 'watch', 'moving'].includes(room.tone)), 'Waiting room contains an invalid tone.');

requireValue(page.includes("clientId !== 'stoke-ai'"), 'Owner-only session guard is missing.');
requireValue(page.includes('index: false') && page.includes('follow: false'), 'Noindex/nofollow metadata is missing.');
requireValue(page.includes('getPortalSessionClientId'), 'Portal session authentication is missing.');
requireValue(page.includes('Latest recorded changes') && !page.includes('Latest verified changes'), 'Mixed-confidence change feed needs a neutral heading.');
requireValue(page.includes('decision.freshness') && page.includes('decision.verifiedAt') && page.includes('decision.source'), 'Decision ledger must carry freshness, date, and source evidence.');
requireValue(auth.includes("clientId === 'stoke-ai'") && auth.includes('COMMAND_CENTER_ACCESS_CODE'), 'Dedicated owner credential boundary is missing.');
requireValue(!JSON.stringify(data).match(/password|api[_ -]?key|bearer\s|postgres(?:ql)?:\/\//i), 'Command Center data appears to contain a secret-shaped value.');

const hexLuminance = (hex) => {
  const values = [1, 3, 5].map((index) => Number.parseInt(hex.slice(index, index + 2), 16) / 255)
    .map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return 0.2126 * values[0] + 0.7152 * values[1] + 0.0722 * values[2];
};
const contrast = (foreground, background) => {
  const [high, low] = [hexLuminance(foreground), hexLuminance(background)].sort((a, b) => b - a);
  return (high + 0.05) / (low + 0.05);
};
const selectorColor = (selector) => {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const block = css.match(new RegExp(`${escaped}\\{([^}]*)\\}`))?.[1] || '';
  return block.match(/color:(#[0-9a-f]{6})/i)?.[1];
};
for (const [selector, background] of [['.clientFacts dt', '#101511'], ['.workCard small', '#0d110e'], ['.securityNote', '#101712']]) {
  const color = selectorColor(selector);
  requireValue(Boolean(color), `${selector} needs an explicit text color.`);
  if (color) requireValue(contrast(color, background) >= 4.5, `${selector} text contrast is below WCAG AA.`);
}

if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join('\n'));
  process.exit(1);
}

console.log(`Command Center contract verified: ${data.clients.length} clients, owner guard, freshness projections, summary integrity, dates, and AA contrast.`);
