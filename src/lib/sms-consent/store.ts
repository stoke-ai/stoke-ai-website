import postgres from 'postgres';

export const SMS_CONSENT_VERSION = 'stoke-client-sms-v1-2026-07-14';
export const SMS_CONSENT_TEXT = 'I agree to receive conversational text messages from Stoke AI about my active services, project updates, questions, requested information, and account support. Message frequency varies. Message and data rates may apply. Reply STOP to unsubscribe or HELP for help. Consent is not a condition of purchase.';
export const SMS_DECLINE_VERSION = 'stoke-client-sms-declined-v1-2026-07-28';
export const SMS_DECLINE_TEXT = 'No thanks — do not send me text messages.';

export type SmsPreference = 'opted_in' | 'declined';

export type SmsPreferenceInput = {
  fullName: string;
  companyName: string;
  mobileNumber: string;
  preference: SmsPreference | null;
  website?: string;
};

type SqlParameter = string | number | boolean | null;

export type SmsSqlExecutor = {
  unsafe: (query: string, parameters?: SqlParameter[]) => Promise<unknown>;
};

export type PersistedSmsPreference = {
  id: string;
  fullName: string;
  companyName: string;
  mobileE164: string;
  preference: SmsPreference;
  disclosureText: string;
  disclosureVersion: string;
  sourceUrl: string;
  ipAddress: string | null;
  userAgent: string | null;
  recordedAt: string;
};

const sql = process.env.DATABASE_URL
  ? postgres(process.env.DATABASE_URL, { ssl: 'require', max: 3 })
  : null;

let schemaReady = false;

export const SMS_CONSENT_SCHEMA_STATEMENTS = [
  `create table if not exists sms_consents (
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
    revoked_at timestamptz,
    preference text not null
  )`,
  `alter table sms_consents add column if not exists preference text`,
  `update sms_consents set preference = 'opted_in' where preference is null`,
  `alter table sms_consents alter column preference set not null`,
  `alter table sms_consents alter column preference drop default`,
  `do $$
    begin
      if not exists (
        select 1 from pg_constraint
        where conname = 'sms_consents_preference_allowed'
          and conrelid = 'sms_consents'::regclass
      ) then
        alter table sms_consents
          add constraint sms_consents_preference_allowed
          check (preference in ('opted_in', 'declined'));
      end if;
    end
  $$`,
  `do $$
    begin
      if not exists (
        select 1 from pg_constraint
        where conname = 'sms_consents_declined_is_revoked'
          and conrelid = 'sms_consents'::regclass
      ) then
        alter table sms_consents
          add constraint sms_consents_declined_is_revoked
          check (preference <> 'declined' or revoked_at is not null);
      end if;
    end
  $$`,
  `with ranked as (
    select id,
      row_number() over (
        partition by mobile_e164
        order by consented_at desc, id desc
      ) as active_rank
    from sms_consents
    where preference = 'opted_in' and revoked_at is null
  )
  update sms_consents as consent
  set revoked_at = now()
  from ranked
  where consent.id = ranked.id and ranked.active_rank > 1`,
  `create index if not exists sms_consents_mobile_idx on sms_consents (mobile_e164)`,
  `create unique index if not exists sms_consents_one_active_opt_in_per_number
    on sms_consents (mobile_e164)
    where preference = 'opted_in' and revoked_at is null`,
];

export async function ensureSmsConsentSchemaWithExecutor(executor: SmsSqlExecutor) {
  for (const statement of SMS_CONSENT_SCHEMA_STATEMENTS) {
    await executor.unsafe(statement);
  }
}

async function ensureSchema() {
  if (schemaReady || !sql) return;
  await ensureSmsConsentSchemaWithExecutor(sql as unknown as SmsSqlExecutor);
  schemaReady = true;
}

function normalizePhone(value: string) {
  const digits = value.replace(/\D/g, '');
  const ten = digits.length === 11 && digits.startsWith('1') ? digits.slice(1) : digits;
  if (ten.length !== 10) return null;
  return `+1${ten}`;
}

export function validateSmsPreference(input: SmsPreferenceInput | null | undefined) {
  if (!input || typeof input !== 'object') return { ok: false as const, error: 'Invalid request body.' };
  const fullName = String(input.fullName || '').trim();
  const companyName = String(input.companyName || '').trim();
  const mobileE164 = normalizePhone(String(input.mobileNumber || ''));
  if (!fullName || !companyName || !mobileE164) return { ok: false as const, error: 'Please complete your name, company, and a valid 10-digit mobile number.' };
  if (input.preference !== 'opted_in' && input.preference !== 'declined') {
    return { ok: false as const, error: 'Please choose Yes or No thanks for text messages.' };
  }
  return { ok: true as const, fullName, companyName, mobileE164, preference: input.preference };
}

export async function persistSmsPreference(executor: SmsSqlExecutor, record: PersistedSmsPreference) {
  await executor.unsafe('select pg_advisory_xact_lock(hashtext($1))', [record.mobileE164]);
  await executor.unsafe(
    `update sms_consents
      set revoked_at = $1
      where mobile_e164 = $2
        and preference = 'opted_in'
        and revoked_at is null`,
    [record.recordedAt, record.mobileE164],
  );
  await executor.unsafe(
    `insert into sms_consents (
      id, full_name, company_name, mobile_e164, consent_text,
      consent_version, source_url, ip_address, user_agent, consented_at,
      revoked_at, preference
    ) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
    [
      record.id,
      record.fullName,
      record.companyName,
      record.mobileE164,
      record.disclosureText,
      record.disclosureVersion,
      record.sourceUrl,
      record.ipAddress,
      record.userAgent,
      record.recordedAt,
      record.preference === 'opted_in' ? null : record.recordedAt,
      record.preference,
    ],
  );
}

export async function saveSmsPreference(input: SmsPreferenceInput | null | undefined, evidence: { ipAddress?: string | null; userAgent?: string | null; sourceUrl: string }) {
  const validated = validateSmsPreference(input);
  if (!validated.ok) return validated;
  if (input?.website) return { ok: true as const, ignored: true as const };
  if (!sql) throw new Error('SMS consent storage is not configured.');

  await ensureSchema();
  const id = crypto.randomUUID();
  const recordedAt = new Date().toISOString();
  const optedIn = validated.preference === 'opted_in';

  const record: PersistedSmsPreference = {
    id,
    fullName: validated.fullName,
    companyName: validated.companyName,
    mobileE164: validated.mobileE164,
    preference: validated.preference,
    disclosureText: optedIn ? SMS_CONSENT_TEXT : SMS_DECLINE_TEXT,
    disclosureVersion: optedIn ? SMS_CONSENT_VERSION : SMS_DECLINE_VERSION,
    sourceUrl: evidence.sourceUrl,
    ipAddress: evidence.ipAddress || null,
    userAgent: evidence.userAgent || null,
    recordedAt,
  };

  await sql.begin(async (transaction) => {
    await persistSmsPreference(transaction as unknown as SmsSqlExecutor, record);
  });

  return {
    ok: true as const,
    id,
    mobileE164: validated.mobileE164,
    preference: validated.preference,
    optedIn,
    recordedAt,
  };
}
