// Initialize the Goff portal schema on Neon.
// Usage: GOFF_DATABASE_URL=postgres://... node scripts/goff-db-init.mjs
import postgres from 'postgres';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const url = process.env.GOFF_DATABASE_URL || process.env.DATABASE_URL;
if (!url) {
  console.error('Set GOFF_DATABASE_URL (or DATABASE_URL) first.');
  process.exit(1);
}

const sql = postgres(url, { ssl: 'require', max: 1 });
const schema = readFileSync(join(dirname(fileURLToPath(import.meta.url)), '..', 'db', 'goff-portal-schema.sql'), 'utf8');

try {
  await sql.unsafe(schema);
  const tables = await sql`
    SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name LIKE 'goff_%' ORDER BY table_name`;
  console.log('Schema applied. Goff tables:', tables.map(t => t.table_name).join(', '));
} finally {
  await sql.end();
}
