import assert from 'node:assert/strict';
import test from 'node:test';
import { PGlite } from '@electric-sql/pglite';

import {
  ensureSmsConsentSchemaWithExecutor,
  persistSmsPreference,
  type PersistedSmsPreference,
  type SmsPreference,
  type SmsSqlExecutor,
  validateSmsPreference,
} from './store.ts';

const base = {
  fullName: 'Casey Client',
  companyName: 'Example Company',
  mobileNumber: '(208) 555-0123',
  website: '',
};

function executor(database: { query: (query: string, params?: unknown[]) => Promise<unknown> }): SmsSqlExecutor {
  return {
    unsafe: async (query, parameters = []) => {
      await database.query(query, parameters);
    },
  };
}

function record(id: string, preference: SmsPreference, mobileE164 = '+12085550123'): PersistedSmsPreference {
  const recordedAt = new Date(Date.now() + Number(id.replace(/\D/g, '').slice(-4) || 0)).toISOString();
  return {
    id,
    fullName: 'Casey Client',
    companyName: 'Example Company',
    mobileE164,
    preference,
    disclosureText: preference === 'opted_in' ? 'affirmative disclosure' : 'No thanks — do not send me text messages.',
    disclosureVersion: preference === 'opted_in' ? 'affirmative-v1' : 'declined-v1',
    sourceUrl: 'https://stoke-ai.com/sms-consent',
    ipAddress: null,
    userAgent: 'test',
    recordedAt,
  };
}

test('requires a valid request object and explicit SMS preference', () => {
  assert.deepEqual(validateSmsPreference(null), { ok: false, error: 'Invalid request body.' });
  assert.deepEqual(validateSmsPreference(undefined), { ok: false, error: 'Invalid request body.' });
  const result = validateSmsPreference({ ...base, preference: null });
  assert.equal(result.ok, false);
  if (!result.ok) assert.match(result.error, /Yes or No thanks/);
});

test('accepts affirmative and declined preferences', () => {
  const optedIn = validateSmsPreference({ ...base, preference: 'opted_in' });
  assert.equal(optedIn.ok, true);
  if (optedIn.ok) {
    assert.equal(optedIn.preference, 'opted_in');
    assert.equal(optedIn.mobileE164, '+12085550123');
  }

  const declined = validateSmsPreference({ ...base, preference: 'declined' });
  assert.equal(declined.ok, true);
  if (declined.ok) {
    assert.equal(declined.preference, 'declined');
    assert.equal(declined.mobileE164, '+12085550123');
  }
});

test('rejects an unknown preference value', () => {
  const result = validateSmsPreference({ ...base, preference: 'maybe' as SmsPreference });
  assert.equal(result.ok, false);
});

test('migrates legacy rows, deduplicates active consent, and enforces database invariants', async () => {
  const db = new PGlite();
  await db.exec(`
    create table sms_consents (
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
    );
    insert into sms_consents values
      ('legacy-1', 'Casey', 'Example', '+12085550123', 'yes', 'v1', 'source', null, null, '2026-07-01T00:00:00Z', null),
      ('legacy-2', 'Casey', 'Example', '+12085550123', 'yes', 'v1', 'source', null, null, '2026-07-02T00:00:00Z', null),
      ('legacy-3', 'Casey', 'Example', '+12085550124', 'yes', 'v1', 'source', null, null, '2026-07-03T00:00:00Z', '2026-07-04T00:00:00Z');
  `);

  await ensureSmsConsentSchemaWithExecutor(executor(db));
  await ensureSmsConsentSchemaWithExecutor(executor(db));

  const rows = await db.query<{ preference: string; revoked_at: string | null }>(
    `select preference, revoked_at from sms_consents where mobile_e164 = $1 order by consented_at`,
    ['+12085550123'],
  );
  assert.equal(rows.rows.length, 2);
  assert.deepEqual(rows.rows.map((row) => row.preference), ['opted_in', 'opted_in']);
  assert.equal(rows.rows.filter((row) => row.revoked_at === null).length, 1);

  await assert.rejects(
    db.query(`insert into sms_consents values ('bad-choice', 'A', 'B', '+12085550125', 'x', 'v', 's', null, null, now(), null, 'maybe')`),
  );
  await assert.rejects(
    db.query(`insert into sms_consents values ('bad-decline', 'A', 'B', '+12085550126', 'x', 'v', 's', null, null, now(), null, 'declined')`),
  );

  await db.close();
});

test('repeated affirmative submissions leave exactly one active opt-in', async () => {
  const db = new PGlite();
  await ensureSmsConsentSchemaWithExecutor(executor(db));
  await db.transaction(async (transaction) => persistSmsPreference(executor(transaction), record('yes-1', 'opted_in')));
  await db.transaction(async (transaction) => persistSmsPreference(executor(transaction), record('yes-2', 'opted_in')));

  const result = await db.query<{ total: number; active: number }>(`
    select count(*)::int as total,
      count(*) filter (where preference = 'opted_in' and revoked_at is null)::int as active
    from sms_consents where mobile_e164 = '+12085550123'
  `);
  assert.deepEqual(result.rows[0], { total: 2, active: 1 });
  await db.close();
});

test('a decline revokes every earlier active affirmative record', async () => {
  const db = new PGlite();
  await ensureSmsConsentSchemaWithExecutor(executor(db));
  await db.transaction(async (transaction) => persistSmsPreference(executor(transaction), record('yes-10', 'opted_in')));
  await db.transaction(async (transaction) => persistSmsPreference(executor(transaction), record('no-20', 'declined')));

  const result = await db.query<{ active: number; declined: number }>(`
    select count(*) filter (where preference = 'opted_in' and revoked_at is null)::int as active,
      count(*) filter (where preference = 'declined' and revoked_at is not null)::int as declined
    from sms_consents where mobile_e164 = '+12085550123'
  `);
  assert.deepEqual(result.rows[0], { active: 0, declined: 1 });
  await db.close();
});

test('concurrent affirmative then decline invocations finish with no active consent', async () => {
  const db = new PGlite();
  await ensureSmsConsentSchemaWithExecutor(executor(db));

  let releaseAffirmative!: () => void;
  const holdAffirmative = new Promise<void>((resolve) => { releaseAffirmative = resolve; });
  let affirmativeStarted!: () => void;
  const started = new Promise<void>((resolve) => { affirmativeStarted = resolve; });

  const affirmative = db.transaction(async (transaction) => {
    affirmativeStarted();
    await holdAffirmative;
    await persistSmsPreference(executor(transaction), record('yes-100', 'opted_in'));
  });
  await started;
  const decline = db.transaction(async (transaction) => {
    await persistSmsPreference(executor(transaction), record('no-200', 'declined'));
  });
  releaseAffirmative();
  await Promise.all([affirmative, decline]);

  const result = await db.query<{ active: number; declined: number }>(`
    select count(*) filter (where preference = 'opted_in' and revoked_at is null)::int as active,
      count(*) filter (where preference = 'declined' and revoked_at is not null)::int as declined
    from sms_consents where mobile_e164 = '+12085550123'
  `);
  assert.deepEqual(result.rows[0], { active: 0, declined: 1 });
  await db.close();
});

test('failed insert rolls back revocation of the previous active opt-in', async () => {
  const db = new PGlite();
  await ensureSmsConsentSchemaWithExecutor(executor(db));
  const original = record('same-id', 'opted_in');
  await db.transaction(async (transaction) => persistSmsPreference(executor(transaction), original));

  await assert.rejects(
    db.transaction(async (transaction) => persistSmsPreference(executor(transaction), { ...record('same-id', 'declined'), recordedAt: new Date().toISOString() })),
  );

  const result = await db.query<{ active: number; total: number }>(`
    select count(*) filter (where preference = 'opted_in' and revoked_at is null)::int as active,
      count(*)::int as total
    from sms_consents where mobile_e164 = '+12085550123'
  `);
  assert.deepEqual(result.rows[0], { active: 1, total: 1 });
  await db.close();
});
