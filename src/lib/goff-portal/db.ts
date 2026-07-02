import postgres from 'postgres';

// Goff portal database (Neon). GOFF_DATABASE_URL wins so the Goff-owned
// database stays separate from anything else that later uses DATABASE_URL.
// Degrades gracefully: callers must handle a null client while the env var
// is not yet configured.
let client: ReturnType<typeof postgres> | null | undefined;

export function goffDb() {
  if (client !== undefined) return client;
  const url = process.env.GOFF_DATABASE_URL || process.env.DATABASE_URL;
  client = url ? postgres(url, { ssl: 'require', max: 3, idle_timeout: 20 }) : null;
  return client;
}
