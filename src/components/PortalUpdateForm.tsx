'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';

type PortalUpdateFormProps = {
  kind: 'reply' | 'new-item';
  cardId?: string;
  cardTitle?: string;
  label: string;
  title: string;
  prompt: string;
  buttonClassName?: string;
  latestMessage?: {
    message: string;
    status: 'new' | 'seen' | 'replied' | 'converted' | 'closed';
    createdAt: string;
    blazeReply?: string;
    progressNote?: string;
  } | null;
};

type SavedSubmission = {
  message: string;
  sentAt: string;
  status?: 'new' | 'seen' | 'replied' | 'converted' | 'closed';
  blazeReply?: string;
  progressNote?: string;
};

const statusLabels = {
  new: 'Sent to Blaze',
  seen: 'Seen by Blaze',
  replied: 'Blaze replied',
  converted: 'Converted to task',
  closed: 'Closed',
};

function formatSentAt(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'just now';

  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function PortalUpdateForm({
  kind,
  cardId,
  cardTitle,
  label,
  title,
  prompt,
  buttonClassName,
  latestMessage,
}: PortalUpdateFormProps) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');
  const [savedSubmission, setSavedSubmission] = useState<SavedSubmission | null>(null);

  const storageKey = useMemo(
    () => `stoke-portal-update:${kind}:${cardId || 'new-item'}:${cardTitle || ''}`,
    [cardId, cardTitle, kind],
  );

  useEffect(() => {
    if (latestMessage) {
      setSavedSubmission({
        message: latestMessage.message,
        sentAt: latestMessage.createdAt,
        status: latestMessage.status,
        blazeReply: latestMessage.blazeReply,
        progressNote: latestMessage.progressNote,
      });
      return;
    }

    try {
      const stored = window.localStorage.getItem(storageKey);
      if (stored) setSavedSubmission(JSON.parse(stored) as SavedSubmission);
    } catch {
      // Local receipt is best-effort only. Server submission still works.
    }
  }, [latestMessage, storageKey]);

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

    const data = await response.json().catch(() => null);
    const receipt = {
      message,
      sentAt: data?.message?.createdAt || new Date().toISOString(),
      status: data?.message?.status || 'new',
      blazeReply: data?.message?.blazeReply,
      progressNote: data?.message?.progressNote,
    } as SavedSubmission;
    setSavedSubmission(receipt);
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(receipt));
    } catch {
      // Ignore local storage failures; the success state still confirms this session.
    }

    setMessage('');
    setStatus('sent');
  }

  if (savedSubmission && !open) {
    return (
      <div className="mt-4 rounded-2xl border border-emerald-300/25 bg-emerald-300/[0.08] p-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-emerald-100">{statusLabels[savedSubmission.status || 'new']}</p>
            <p className="mt-1 text-xs leading-5 text-zinc-300">
              Received {formatSentAt(savedSubmission.sentAt)}. This update is saved in the shared portal inbox.
            </p>
            <p className="mt-2 line-clamp-2 text-xs leading-5 text-zinc-400">“{savedSubmission.message}”</p>
            {savedSubmission.blazeReply ? (
              <p className="mt-3 rounded-xl border border-emerald-300/20 bg-black/20 p-3 text-xs leading-5 text-emerald-50">
                <span className="font-semibold">Blaze replied:</span> {savedSubmission.blazeReply}
              </p>
            ) : null}
            {savedSubmission.progressNote ? (
              <p className="mt-3 rounded-xl border border-sky-300/20 bg-black/20 p-3 text-xs leading-5 text-sky-50">
                <span className="font-semibold">Progress:</span> {savedSubmission.progressNote}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={() => {
              setOpen(true);
              setStatus('idle');
              setError('');
            }}
            className="shrink-0 rounded-full border border-emerald-300/30 px-3 py-2 text-xs font-semibold text-emerald-100 transition hover:bg-emerald-300/10"
          >
            Add another update
          </button>
        </div>
      </div>
    );
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
