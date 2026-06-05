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

  async function loadMessages() {
    const response = await fetch('/api/portal/messages', { cache: 'no-store' });
    const data = await response.json();
    setMessages(data.messages || []);
    setLoading(false);
  }

  useEffect(() => {
    loadMessages();
  }, []);

  async function updateMessage(id: string, updates: { status?: PortalMessageStatus; blazeReply?: string; progressNote?: string }) {
    setSavingId(id);
    await fetch('/api/portal/messages', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...updates }),
    });
    setDrafts((current) => ({ ...current, [id]: { reply: '', progress: '' } }));
    await loadMessages();
    setSavingId(null);
  }

  function setDraft(id: string, key: 'reply' | 'progress', value: string) {
    setDrafts((current) => ({
      ...current,
      [id]: { reply: current[id]?.reply || '', progress: current[id]?.progress || '', [key]: value },
    }));
  }

  return (
    <main className="min-h-screen bg-[#08090a] px-5 py-8 text-zinc-50 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 border-b border-white/10 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-orange-200">Stoke AI admin</p>
            <h1 className="mt-2 text-4xl font-black tracking-tight">Portal Inbox</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
              Client updates land here first. Mark them seen, reply, add progress notes, or close them so the client portal updates from the same shared activity feed.
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

        {!loading && messages.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.03] p-10 text-center text-zinc-400">
            No portal updates yet. When Austin or Jeff sends one, it will appear here.
          </div>
        ) : null}

        <div className="space-y-5">
          {messages.map((message) => {
            const draft = drafts[message.id] || { reply: '', progress: '' };
            return (
              <article key={message.id} className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 shadow-2xl shadow-black/20">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-orange-400 px-3 py-1 text-xs font-black text-black">{statusLabels[message.status]}</span>
                      <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-300">{message.clientName}</span>
                      <span className="text-xs text-zinc-500">{formatTime(message.createdAt)}</span>
                    </div>
                    <h2 className="mt-4 text-2xl font-bold text-white">{message.cardTitle || (message.kind === 'new-item' ? 'New item' : 'Portal update')}</h2>
                    <p className="mt-3 whitespace-pre-wrap rounded-2xl border border-white/10 bg-black/25 p-4 text-sm leading-6 text-zinc-200">{message.message}</p>
                  </div>

                  <div className="flex min-w-48 flex-wrap gap-2 md:justify-end">
                    {(['seen', 'converted', 'closed'] as PortalMessageStatus[]).map((status) => (
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
                </div>

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

                <form
                  className="mt-5 grid gap-4 md:grid-cols-2"
                  onSubmit={(event: FormEvent<HTMLFormElement>) => event.preventDefault()}
                >
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">Reply visible to client</label>
                    <textarea
                      value={draft.reply}
                      onChange={(event) => setDraft(message.id, 'reply', event.target.value)}
                      rows={4}
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm leading-6 text-white outline-none focus:border-orange-400/50"
                      placeholder="Blaze response Austin will see in the portal…"
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
                      rows={4}
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
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
}
