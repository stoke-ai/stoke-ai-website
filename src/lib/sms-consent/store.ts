import postgres from 'postgres';

export const SMS_CONSENT_VERSION = 'stoke-client-sms-v1-2026-07-14';
export const SMS_CONSENT_TEXT = 'I agree to receive conversational text messages from Stoke AI about my active services, project updates, questions, requested information, and account support. Message frequency varies. Message and data rates may apply. Reply STOP to unsubscribe or HELP for help. Consent is not a condition of purchase. See our Privacy Policy and Terms of Service.';

export type SmsConsentInput = {
  fullName: string;
  companyName: string;
  mobileNumber: string;
  accepted: boolean;
  website?: string;
};

export type SmsConsentEvidence = {
  ipAddress?: string;
  userAgent?: string;
  sourceUrl: string;
};

const databaseUrl = process.env.DATABASE_URL || process.env.Database_url;
let sqlClient: postgres.Sql | null = null;
let schemaReady: Promise<void> | null = null;

function db() {
  if (!databaseUrl) throw new Error('DATABASE_URL is required to store SMS consent evidence.');
  sqlClient ??= postgres(databaseUrl, { max: 2, ssl: 'require' });
  return sqlClient;
}

async function ensureSchema() {
  schemaReady ??= (async () => {
    const sql = db();
    await sql`
      create table if not exists sms_consents (
        id text primary key,
        full_name text not null,
        company_name text not null,
        mobile_e164 text not null,
        consent_text text not null,
        consent_version text not null,
        source_url text not null,
        ip_address text,
        user_agent text,
        consented_at timestamptz not null,
        revoked_at timestamptz
      )
    `;
    await sql`create index if not exists sms_consents_mobile_consented_idx on sms_consents (mobile_e164, consented_at desc)`;
  })();
  await schemaReady;
}

function cleanText(value: unknown, maxLength: number) {
  return String(value || '').trim().replace(/\s+/g, ' ').slice(0, maxLength);
}

export function normalizeUsPhone(value: unknown) {
  let digits = String(value || '').replace(/\D/g, '');
  if (digits.length === 10) digits = `1${digits}`;
  if (digits.length !== 11 || !digits.startsWith('1')) return null;
  return `+${digits}`;
}

export function validateSmsConsent(input: SmsConsentInput) {
  const fullName = cleanText(input.fullName, 120);
  const companyName = cleanText(input.companyName, 160);
  const mobileE164 = normalizeUsPhone(input.mobileNumber);

  if (input.website) return { ok: false as const, error: 'Unable to process this submission.' };
  if (fullName.length < 2) return { ok: false as const, error: 'Enter your full name.' };
  if (companyName.length < 2) return { ok: false as const, error: 'Enter your company name.' };
  if (!mobileE164) return { ok: false as const, error: 'Enter a valid U.S. mobile number.' };
  if (input.accepted !== true) return { ok: false as const, error: 'Check the consent box to enroll in text messages.' };

  return { ok: true as const, fullName, companyName, mobileE164 };
}

export async function saveSmsConsent(input: SmsConsentInput, evidence: SmsConsentEvidence) {
  const validated = validateSmsConsent(input);
  if (!validated.ok) return validated;

  await ensureSchema();
  const sql = db();
  const id = `sms_${Date.now().toString(36)}_${crypto.randomUUID().replace(/-/g, '').slice(0, 12)}`;
  const consentedAt = new Date().toISOString();

  await sql`
    insert into sms_consents (
      id, full_name, company_name, mobile_e164, consent_text,
      consent_version, source_url, ip_address, user_agent, consented_at
    ) values (
      ${id}, ${validated.fullName}, ${validated.companyName}, ${validated.mobileE164},
      ${SMS_CONSENT_TEXT}, ${SMS_CONSENT_VERSION}, ${evidence.sourceUrl},
      ${evidence.ipAddress || null}, ${evidence.userAgent || null}, ${consentedAt}
    )
  `;

  return { ok: true as const, id, mobileE164: validated.mobileE164, consentedAt };
}
