import { readFile } from 'node:fs/promises';

const page = await readFile(new URL('../src/app/sms-consent/page.tsx', import.meta.url), 'utf8');
const route = await readFile(new URL('../src/app/api/sms-consent/route.ts', import.meta.url), 'utf8');
const store = await readFile(new URL('../src/lib/sms-consent/store.ts', import.meta.url), 'utf8');

const checks = [
  [page.includes("preference: null"), 'form starts with no SMS preference selected'],
  [page.includes('Yes, I agree'), 'affirmative choice is visible'],
  [page.includes('No thanks'), 'decline choice is visible'],
  [page.includes('type="radio"') && page.includes('name="sms-preference"'), 'choices share a radio group'],
  [page.match(/required type="radio"/g)?.length === 2, 'both preference choices use native required semantics'],
  [page.includes('Save SMS preference'), 'neutral submit language is present'],
  [page.includes('SMS preference saved.'), 'decline confirmation heading is present'],
  [page.includes('Stoke AI will not send text messages'), 'decline confirmation is explicit'],
  [page.includes('Message and data rates may apply.'), 'message-rate disclosure remains present'],
  [page.includes('Reply STOP to unsubscribe or HELP for help.'), 'STOP and HELP disclosure remains present'],
  [page.includes('Consent is not a condition of purchase.'), 'no-condition-of-purchase disclosure remains present'],
  [page.includes('href="/privacy"') && page.includes('href="/terms"'), 'Privacy Policy and Terms links remain present'],
  [store.includes("preference: SmsPreference | null"), 'server input requires an explicit preference value'],
  [store.includes("input.preference !== 'opted_in' && input.preference !== 'declined'"), 'server rejects missing or unknown preference values'],
  [store.includes("record.preference === 'opted_in' ? null : record.recordedAt"), 'declined preference is persisted as revoked at the decision time'],
  [store.includes("pg_advisory_xact_lock(hashtext($1))"), 'preference writes are serialized by normalized mobile number'],
  [store.includes('sms_consents_one_active_opt_in_per_number'), 'database permits at most one active affirmative record per number'],
  [store.includes("check (preference in ('opted_in', 'declined'))") && store.includes("check (preference <> 'declined' or revoked_at is not null)"), 'database enforces preference and decline invariants'],
  [store.includes('set revoked_at = $1') && store.includes("preference = 'opted_in'") && store.includes('revoked_at is null'), 'each preference change revokes earlier active affirmative records for the same number'],
  [store.includes('record.preference,'), 'the selected preference is persisted'],
  [route.includes('preference: result.preference') && route.includes('optedIn: result.optedIn'), 'API response distinguishes affirmative and declined outcomes'],
];

const failed = checks.filter(([ok]) => !ok).map(([, message]) => message);
if (failed.length) {
  console.error('SMS preference verification failed:');
  for (const message of failed) console.error(`- ${message}`);
  process.exit(1);
}

console.log(`SMS preference verification passed (${checks.length} checks).`);
