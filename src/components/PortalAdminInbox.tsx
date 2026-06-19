'use client';

import { FormEvent, useEffect, useState } from 'react';
import type { PortalMessage, PortalMessageStatus } from '@/lib/portal/store';

const statusLabels: Record<PortalMessageStatus, string> = {
  new: 'New',
  seen: 'Seen by Blaze',
  replied: 'Blaze replied',
  converted: 'Converted to task',
  closed: 'Closed',
};

function formatTime(value: string) {
  return new Date(value).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function PortalAdminInbox() {
  const [messages, setMessages] = useState<PortalMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, { reply: string; progress: string }>>({});
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [error, setError] = useState('');

  async function loadMessages() {
    try {
      const response = await fetch('/api/portal/messages', { cache: 'no-store' });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || 'Could not load portal messages.');
      }
      setMessages(data.messages || []);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load portal messages.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMessages();
  }, []);

  async function updateMessage(id: string, updates: { status?: PortalMessageStatus; blazeReply?: string; progressNote?: string }) {
    setSavingId(id);
    setError('');
    try {
      const response = await fetch('/api/portal/messages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || 'Could not update portal message.');
      }
      setDrafts((current) => ({ ...current, [id]: { reply: '', progress: '' } }));
      await loadMessages();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update portal message.');
    } finally {
      setSavingId(null);
    }
  }

  function setDraft(id: string, key: 'reply' | 'progress', value: string) {
    setDrafts((current) => ({
      ...current,
      [id]: { reply: current[id]?.reply || '', progress: current[id]?.progress || '', [key]: value },
    }));
  }

  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-5 text-zinc-50 shadow-2xl shadow-black/20 md:p-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex flex-col gap-4 border-b border-white/10 pb-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-orange-200">Stoke AI admin</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight">Recent portal messages</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
              Latest client notes. Open one only when you need to reply or add a progress note. Client notification events are staged portal-wide, but delivery is paused until Jeff turns it on.
            </p>
          </div>
          <button
            type="button"
            onClick={loadMessages}
            className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-zinc-100 transition hover:border-orange-400/40 hover:bg-white/5"
          >
            Refresh inbox
          </button>
        </div>

        {loading ? <p className="text-zinc-400">Loading portal messages…</p> : null}

        {error ? (
          <div className="mb-4 rounded-2xl border border-red-400/20 bg-red-400/[0.08] p-4 text-sm leading-6 text-red-100">
            {error} If you recently opened a client portal in this same browser, sign back into the Stoke-AI admin account and refresh this page.
          </div>
        ) : null}

        {!loading && !error && messages.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.03] p-10 text-center text-zinc-400">
            No portal updates yet. When a client sends one, it will appear here.
          </div>
        ) : null}

        <div className="space-y-3">
          {messages.slice(0, 5).map((message) => {
            const draft = drafts[message.id] || { reply: '', progress: '' };
            const expanded = expandedId === message.id;
            return (
              <article key={message.id} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-orange-400 px-2.5 py-1 text-[11px] font-black text-black">{statusLabels[message.status]}</span>
                      <span className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-zinc-300">{message.clientName}</span>
                      {message.senderName ? (
                        <span className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-zinc-300">From {message.senderName}</span>
                      ) : null}
                      <span className="text-xs text-zinc-500">{formatTime(message.createdAt)}</span>
                    </div>
                    <h2 className="mt-3 text-lg font-bold text-white">{message.cardTitle || (message.kind === 'new-item' ? 'New item' : 'Portal update')}</h2>
                    <p className="mt-2 line-clamp-2 whitespace-pre-wrap text-sm leading-6 text-zinc-300">{message.message}</p>
                  </div>

                  <div className="flex shrink-0 flex-wrap gap-2 md:justify-end">
                    <button
                      type="button"
                      onClick={() => setExpandedId(expanded ? null : message.id)}
                      className="rounded-full border border-white/10 px-3 py-2 text-xs font-semibold text-zinc-100 transition hover:border-orange-400/40 hover:bg-orange-400/10"
                    >
                      {expanded ? 'Close tools' : 'Open tools'}
                    </button>
                    <button
                      type="button"
                      disabled={savingId === message.id}
                      onClick={() => updateMessage(message.id, { status: 'closed' })}
                      className="rounded-full border border-white/10 px-3 py-2 text-xs font-semibold text-zinc-100 transition hover:border-orange-400/40 hover:bg-orange-400/10 disabled:opacity-50"
                    >
                      Close
                    </button>
                  </div>
                </div>

                {expanded ? (
                  <div className="mt-4 border-t border-white/10 pt-4">
                    <p className="whitespace-pre-wrap rounded-2xl border border-white/10 bg-black/25 p-4 text-sm leading-6 text-zinc-200">{message.message}</p>

                    {message.blazeReply ? (
                      <div className="mt-4 rounded-2xl border border-emerald-300/20 bg-emerald-300/[0.07] p-4 text-sm leading-6 text-emerald-50">
                        <span className="font-semibold">Latest Blaze reply:</span> {message.blazeReply}
                      </div>
                    ) : null}
                    {message.progressNote ? (
                      <div className="mt-3 rounded-2xl border border-sky-300/20 bg-sky-300/[0.07] p-4 text-sm leading-6 text-sky-50">
                        <span className="font-semibold">Latest progress note:</span> {message.progressNote}
                      </div>
                    ) : null}

                    <div className="mt-4 flex flex-wrap gap-2">
                      {(['seen', 'converted'] as PortalMessageStatus[]).map((status) => (
                        <button
                          key={status}
                          type="button"
                          disabled={savingId === message.id}
                          onClick={() => updateMessage(message.id, { status })}
                          className="rounded-full border border-white/10 px-3 py-2 text-xs font-semibold text-zinc-100 transition hover:border-orange-400/40 hover:bg-orange-400/10 disabled:opacity-50"
                        >
                          Mark {statusLabels[status]}
                        </button>
                      ))}
                    </div>

                    <form className="mt-4 grid gap-4 md:grid-cols-2" onSubmit={(event: FormEvent<HTMLFormElement>) => event.preventDefault()}>
                      <div>
                        <label className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">Reply visible to client</label>
                        <textarea
                          value={draft.reply}
                          onChange={(event) => setDraft(message.id, 'reply', event.target.value)}
                          rows={3}
                          className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm leading-6 text-white outline-none focus:border-orange-400/50"
                          placeholder="Blaze response the client will see…"
                        />
                        <button
                          type="button"
                          disabled={savingId === message.id || draft.reply.trim().length < 2}
                          onClick={() => updateMessage(message.id, { blazeReply: draft.reply })}
                          className="mt-3 rounded-full bg-emerald-300 px-4 py-2 text-xs font-black text-black disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Send reply
                        </button>
                      </div>
                      <div>
                        <label className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">Progress note visible to client</label>
                        <textarea
                          value={draft.progress}
                          onChange={(event) => setDraft(message.id, 'progress', event.target.value)}
                          rows={3}
                          className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm leading-6 text-white outline-none focus:border-orange-400/50"
                          placeholder="Progress update, next action, or status change…"
                        />
                        <button
                          type="button"
                          disabled={savingId === message.id || draft.progress.trim().length < 2}
                          onClick={() => updateMessage(message.id, { progressNote: draft.progress })}
                          className="mt-3 rounded-full bg-sky-300 px-4 py-2 text-xs font-black text-black disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Add progress note
                        </button>
                      </div>
                    </form>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
