'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';

const disclosure = 'I agree to receive conversational text messages from Stoke AI about my active services, project updates, questions, requested information, and account support. Message frequency varies. Message and data rates may apply. Reply STOP to unsubscribe or HELP for help. Consent is not a condition of purchase.';

export default function SmsConsentPage() {
  const [form, setForm] = useState({ fullName: '', companyName: '', mobileNumber: '', accepted: false, website: '' });
  const [status, setStatus] = useState<'idle' | 'saving' | 'complete'>('idle');
  const [error, setError] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setStatus('saving');
    try {
      const response = await fetch('/api/sms-consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Unable to save your consent.');
      setStatus('complete');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save your consent.');
      setStatus('idle');
    }
  }

  return (
    <main className="min-h-screen bg-[#0d0d0d] text-white">
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute -top-40 -left-32 h-[28rem] w-[28rem] rounded-full bg-orange-500/10 blur-[130px]" />
        <div className="absolute -bottom-48 -right-24 h-[30rem] w-[30rem] rounded-full bg-amber-500/[0.07] blur-[150px]" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-5 py-6 sm:px-8 sm:py-8">
        <header className="flex items-center justify-between border-b border-white/10 pb-5">
          <Link href="/" aria-label="Stoke AI home" className="block w-40 sm:w-48">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Stoke AI" className="h-auto w-full" />
          </Link>
          <span className="rounded-full border border-orange-400/25 bg-orange-500/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-orange-200">
            Client communications
          </span>
        </header>

        <section className="grid flex-1 items-center gap-8 py-8 lg:grid-cols-[0.82fr_1.18fr] lg:gap-14 lg:py-10">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-orange-300">Text enrollment</p>
            <h1 className="max-w-xl text-4xl font-black leading-[1.02] tracking-tight sm:text-5xl">
              Keep project communication moving.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-gray-300 sm:text-lg">
              Enroll your mobile number for direct, conversational updates from Stoke AI about active work, questions, and account support.
            </p>
            <div className="mt-6 grid gap-3 text-sm text-gray-300 sm:grid-cols-3 lg:grid-cols-1">
              {['Active service and project updates', 'Questions and requested information', 'Account and client support'].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-400/15 text-xs font-black text-orange-200">✓</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white/10 bg-[#151515] p-5 shadow-2xl shadow-black/35 sm:p-7">
            {status === 'complete' ? (
              <div className="flex min-h-[31rem] flex-col items-center justify-center text-center" role="status">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-400/15 text-2xl text-emerald-300">✓</div>
                <h2 className="text-3xl font-black">Text consent confirmed.</h2>
                <p className="mt-3 max-w-md leading-relaxed text-gray-300">
                  Stoke AI can now send conversational messages to the mobile number you provided. Reply STOP at any time to unsubscribe.
                </p>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4" noValidate>
                <div>
                  <h2 className="text-2xl font-black">Client SMS consent</h2>
                  <p className="mt-1 text-sm text-gray-400">All fields are required. The checkbox is intentionally unchecked.</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm font-bold text-gray-200">
                    Full name
                    <input required autoComplete="name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="mt-2 w-full rounded-xl border border-white/15 bg-black/35 px-4 py-3 text-base text-white outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20" placeholder="Your full name" />
                  </label>
                  <label className="block text-sm font-bold text-gray-200">
                    Company
                    <input required autoComplete="organization" value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} className="mt-2 w-full rounded-xl border border-white/15 bg-black/35 px-4 py-3 text-base text-white outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20" placeholder="Company name" />
                  </label>
                </div>

                <label className="block text-sm font-bold text-gray-200">
                  Mobile number
                  <input required type="tel" inputMode="tel" autoComplete="tel" value={form.mobileNumber} onChange={(e) => setForm({ ...form, mobileNumber: e.target.value })} className="mt-2 w-full rounded-xl border border-white/15 bg-black/35 px-4 py-3 text-base text-white outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20" placeholder="(208) 555-0123" />
                </label>

                <input tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />

                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-orange-400/20 bg-orange-500/[0.06] p-4 text-sm leading-relaxed text-gray-200">
                  <input required type="checkbox" checked={form.accepted} onChange={(e) => setForm({ ...form, accepted: e.target.checked })} className="mt-1 h-5 w-5 shrink-0 accent-orange-500" />
                  <span>
                    {disclosure}{' '}
                    See our <Link href="/privacy" className="font-bold text-orange-300 underline underline-offset-2">Privacy Policy</Link> and <Link href="/terms" className="font-bold text-orange-300 underline underline-offset-2">Terms of Service</Link>.
                  </span>
                </label>

                {error && <p role="alert" className="rounded-xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200">{error}</p>}

                <button disabled={status === 'saving'} className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 px-5 py-3.5 text-base font-black text-black transition hover:from-orange-400 hover:to-amber-300 focus:outline-none focus:ring-4 focus:ring-orange-400/30 disabled:cursor-wait disabled:opacity-70">
                  {status === 'saving' ? 'Saving consent…' : 'Confirm text message consent'}
                </button>
                <p className="text-center text-xs leading-relaxed text-gray-500">Submitting this form enrolls only the mobile number entered above. It does not enroll you in marketing messages.</p>
              </form>
            )}
          </div>
        </section>

        <footer className="flex flex-col gap-2 border-t border-white/10 pt-5 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <p>JHEKOO LLC dba Stoke AI · Burley, Idaho</p>
          <div className="flex gap-4"><Link href="/privacy" className="hover:text-orange-300">Privacy</Link><Link href="/terms" className="hover:text-orange-300">Terms</Link></div>
        </footer>
      </div>
    </main>
  );
}
