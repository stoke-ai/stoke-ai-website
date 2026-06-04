'use client';

import { FormEvent, useState } from 'react';

type PortalUpdateFormProps = {
  kind: 'reply' | 'new-item';
  cardId?: string;
  cardTitle?: string;
  label: string;
  title: string;
  prompt: string;
  buttonClassName?: string;
};

export default function PortalUpdateForm({
  kind,
  cardId,
  cardTitle,
  label,
  title,
  prompt,
  buttonClassName,
}: PortalUpdateFormProps) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('sending');
    setError('');

    const response = await fetch('/api/portal/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kind, cardId, cardTitle, message }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      setError(data?.error || 'Could not send that. Try again.');
      setStatus('error');
      return;
    }

    setMessage('');
    setStatus('sent');
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          setStatus('idle');
          setError('');
        }}
        className={buttonClassName || 'inline-flex rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-3 text-sm font-black text-black transition hover:from-orange-600 hover:to-amber-600'}
      >
        {label}
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 px-4 py-5 backdrop-blur-sm sm:items-center">
          <div className="w-full max-w-xl rounded-[1.5rem] border border-white/10 bg-[#111214] p-5 shadow-2xl shadow-black/50">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-200">Send to Blaze</p>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-white">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-zinc-300">{prompt}</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-white/10 px-3 py-1.5 text-sm text-zinc-300 transition hover:bg-white/5"
              >
                Close
              </button>
            </div>

            {status === 'sent' ? (
              <div className="mt-5 rounded-2xl border border-emerald-300/25 bg-emerald-300/[0.08] p-4">
                <p className="font-semibold text-emerald-100">Sent.</p>
                <p className="mt-1 text-sm leading-6 text-zinc-300">
                  Blaze has it. Your workspace will update after the request is reviewed.
                </p>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="mt-4 rounded-full bg-emerald-300 px-4 py-2 text-sm font-black text-black"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="mt-5 space-y-4">
                <textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  required
                  minLength={3}
                  rows={6}
                  placeholder={kind === 'new-item' ? 'What should Blaze look at? What is happening now? Why does it matter?' : 'Add the update, answer, link, or details Blaze needs...'}
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-base leading-7 text-white outline-none transition placeholder:text-zinc-600 focus:border-orange-400/60"
                />
                {error ? <p className="text-sm text-red-300">{error}</p> : null}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs leading-5 text-zinc-500">
                    No email, calls, or texts needed. This goes straight into the Stoke AI workspace.
                  </p>
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-3 text-sm font-black text-black transition hover:from-orange-600 hover:to-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {status === 'sending' ? 'Sending…' : 'Send to Blaze'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
