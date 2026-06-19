'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import type { PortalBoard, PortalCard, PortalClient, PortalStage } from '@/lib/portal/data';

type ClientOption = Pick<PortalClient, 'id' | 'name' | 'username'>;

const stageLabels: Record<string, { title: string; subtitle: string; accent: string; panel: string }> = {
  'building-now': {
    title: 'Working now',
    subtitle: 'What Jeff / Blaze are moving forward',
    accent: 'bg-emerald-300',
    panel: 'border-emerald-300/20 bg-emerald-300/[0.04]',
  },
  'waiting-blocked': {
    title: 'Needs your team',
    subtitle: 'Send these to keep the work moving',
    accent: 'bg-violet-300',
    panel: 'border-violet-300/25 bg-violet-400/[0.045]',
  },
  'up-next': {
    title: 'Coming next',
    subtitle: 'Queued up after the current work',
    accent: 'bg-orange-400',
    panel: 'border-orange-400/20 bg-orange-500/[0.045]',
  },
  discovery: {
    title: 'Finished / decided',
    subtitle: 'Completed or already handled',
    accent: 'bg-red-300',
    panel: 'border-red-300/20 bg-red-400/[0.035]',
  },
};

const stageOrder = ['building-now', 'waiting-blocked', 'up-next', 'discovery'];

function makeCard(clientName: string): PortalCard {
  return {
    id: `card_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    client: clientName,
    title: 'New priority',
    status: 'Draft',
    detail: 'Describe the priority in plain client-facing language.',
    action: '',
  };
}

function cloneStages(stages: PortalStage[]) {
  return stages.map((stage) => ({ ...stage, cards: stage.cards.map((card) => ({ ...card })) }));
}

export default function PortalAdminBoardEditor({ clients }: { clients: ClientOption[] }) {
  const defaultClientId = clients.find((client) => client.id === 'goff-welding')?.id || clients[0]?.id || '';
  const [clientId, setClientId] = useState(defaultClientId);
  const [board, setBoard] = useState<PortalBoard | null>(null);
  const [draftStages, setDraftStages] = useState<PortalStage[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notifyClientOnSave, setNotifyClientOnSave] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const displayStages = useMemo(
    () => stageOrder.map((id) => draftStages.find((stage) => stage.id === id)).filter(Boolean) as PortalStage[],
    [draftStages],
  );

  async function loadBoard(nextClientId = clientId) {
    if (!nextClientId) return;
    setLoading(true);
    setError('');
    setStatus('');
    try {
      const response = await fetch(`/api/portal/boards/${nextClientId}`, { cache: 'no-store' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not load board.');
      setBoard(data.board);
      setDraftStages(cloneStages(data.board.stages));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load board.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBoard(clientId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId]);

  function updateCard(stageId: string, cardId: string, updates: Partial<PortalCard>) {
    setDraftStages((stages) =>
      stages.map((stage) =>
        stage.id === stageId
          ? { ...stage, cards: stage.cards.map((card) => (card.id === cardId ? { ...card, ...updates } : card)) }
          : stage,
      ),
    );
  }

  function addCard(stageId: string) {
    if (!board) return;
    setDraftStages((stages) =>
      stages.map((stage) => (stage.id === stageId ? { ...stage, cards: [makeCard(board.client.name), ...stage.cards] } : stage)),
    );
    setStatus('Added a draft card. Edit it, then save changes.');
  }

  function removeCard(stageId: string, cardId: string) {
    setDraftStages((stages) =>
      stages.map((stage) => (stage.id === stageId ? { ...stage, cards: stage.cards.filter((card) => card.id !== cardId) } : stage)),
    );
  }

  function moveCard(stageId: string, cardId: string, targetStageId: string, direction?: 'up' | 'down') {
    setDraftStages((stages) => {
      const sourceStage = stages.find((stage) => stage.id === stageId);
      const card = sourceStage?.cards.find((item) => item.id === cardId);
      if (!card) return stages;

      if (direction) {
        return stages.map((stage) => {
          if (stage.id !== stageId) return stage;
          const cards = [...stage.cards];
          const index = cards.findIndex((item) => item.id === cardId);
          const nextIndex = direction === 'up' ? index - 1 : index + 1;
          if (nextIndex < 0 || nextIndex >= cards.length) return stage;
          [cards[index], cards[nextIndex]] = [cards[nextIndex], cards[index]];
          return { ...stage, cards };
        });
      }

      return stages.map((stage) => {
        if (stage.id === stageId) return { ...stage, cards: stage.cards.filter((item) => item.id !== cardId) };
        if (stage.id === targetStageId) return { ...stage, cards: [{ ...card }, ...stage.cards] };
        return stage;
      });
    });
  }

  async function saveBoard() {
    if (!board) return;
    setSaving(true);
    setError('');
    setStatus('');
    try {
      const response = await fetch(`/api/portal/boards/${board.client.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stages: draftStages, notifyClient: notifyClientOnSave }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not save board.');
      setBoard(data.board);
      setDraftStages(cloneStages(data.board.stages));
      setStatus(data.notification ? 'Saved. A client portal notification was staged, but delivery is paused.' : 'Saved. The client portal now shows these priorities.');
      setNotifyClientOnSave(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save board.');
    } finally {
      setSaving(false);
    }
  }

  const activeStage = draftStages.find((stage) => stage.id === 'building-now');
  const needsStage = draftStages.find((stage) => stage.id === 'waiting-blocked');
  const nextStage = draftStages.find((stage) => stage.id === 'up-next');
  const quietStage = draftStages.find((stage) => stage.id === 'discovery');
  const simpleSections = [
    { stage: activeStage, eyebrow: 'Current focus', title: 'Main thing we are working on', note: 'Usually keep this to one clear item.' },
    { stage: needsStage, eyebrow: 'Needed from client', title: 'What we need from them', note: 'Only show what they actually need to send or decide.' },
    { stage: nextStage, eyebrow: 'Later', title: 'What comes after that', note: 'Keep this short so it does not feel like a task dump.' },
  ].filter((section) => section.stage) as Array<{ stage: PortalStage; eyebrow: string; title: string; note: string }>;

  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-5 shadow-2xl shadow-black/20 md:p-6">
      <div className="flex flex-col gap-4 border-b border-white/10 pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-orange-200">Client portal command center</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">Simple client portal editor.</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-400">
            Keep the client view calm: one current focus, a short checklist, and a small “what happens next” section. Archive anything that is not useful for the client right now.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={clientId}
            onChange={(event) => setClientId(event.target.value)}
            className="rounded-full border border-white/10 bg-black/40 px-4 py-2 text-sm font-semibold text-white outline-none focus:border-orange-400/50"
          >
            {clients.map((client) => (
              <option key={client.id} value={client.id} className="bg-zinc-950">
                {client.name}
              </option>
            ))}
          </select>
          <button type="button" onClick={() => loadBoard()} className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold hover:border-orange-400/40 hover:bg-white/5">
            Reload
          </button>
          {board ? (
            <Link href="/portal" className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold hover:border-orange-400/40 hover:bg-white/5">
              Preview portal
            </Link>
          ) : null}
          <label className="flex max-w-xs items-center gap-2 rounded-2xl border border-white/10 bg-black/25 px-3 py-2 text-xs leading-5 text-zinc-300">
            <input
              type="checkbox"
              checked={notifyClientOnSave}
              onChange={(event) => setNotifyClientOnSave(event.target.checked)}
              className="h-4 w-4 accent-orange-400"
            />
            Stage client notification for this save. Delivery is paused; no email/SMS sends yet.
          </label>
          <button
            type="button"
            onClick={saveBoard}
            disabled={saving || loading || !board}
            className="rounded-full bg-orange-400 px-5 py-2 text-sm font-black text-black transition hover:bg-orange-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save board'}
          </button>
        </div>
      </div>

      {error ? <div className="mt-4 rounded-2xl border border-red-400/20 bg-red-400/[0.08] p-4 text-sm text-red-100">{error}</div> : null}
      {status ? <div className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.08] p-4 text-sm text-emerald-100">{status}</div> : null}
      {loading ? <p className="mt-5 text-sm text-zinc-400">Loading board…</p> : null}

      <div className="mt-6 space-y-5">
        {simpleSections.map(({ stage, eyebrow, title, note }) => (
          <div key={stage.id} className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4 md:p-5">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-200">{eyebrow}</p>
                <h2 className="mt-1 text-xl font-black tracking-tight text-white">{title}</h2>
                <p className="mt-1 text-sm leading-6 text-zinc-400">{note}</p>
              </div>
              <button type="button" onClick={() => addCard(stage.id)} className="w-fit rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold hover:bg-orange-400 hover:text-black">
                + Add item
              </button>
            </div>

            <div className="space-y-3">
              {stage.cards.map((card, index) => {
                const isNeedsSection = stage.id === 'waiting-blocked';
                return (
                <article key={card.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <div className="grid gap-3 md:grid-cols-[1.2fr_0.45fr]">
                    <label className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
                      Title
                      <input
                        value={card.title}
                        onChange={(event) => updateCard(stage.id, card.id, { title: event.target.value })}
                        className="mt-1 w-full rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm font-semibold normal-case tracking-normal text-white outline-none focus:border-orange-400/50"
                      />
                    </label>
                    <label className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
                      Status
                      <input
                        value={card.status}
                        onChange={(event) => updateCard(stage.id, card.id, { status: event.target.value })}
                        className="mt-1 w-full rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm normal-case tracking-normal text-white outline-none focus:border-orange-400/50"
                      />
                    </label>
                  </div>

                  {isNeedsSection ? (
                    <>
                      <label className="mt-3 block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">What we need</label>
                      <textarea
                        value={card.action || card.detail || ''}
                        onChange={(event) => updateCard(stage.id, card.id, { action: event.target.value })}
                        rows={2}
                        placeholder="Example: Send the current employee materials folder."
                        className="mt-1 w-full rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm leading-6 text-white outline-none focus:border-orange-400/50"
                      />
                    </>
                  ) : (
                    <>
                      <label className="mt-3 block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">Short note</label>
                      <textarea
                        value={card.detail}
                        onChange={(event) => updateCard(stage.id, card.id, { detail: event.target.value })}
                        rows={2}
                        className="mt-1 w-full rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm leading-6 text-white outline-none focus:border-orange-400/50"
                      />
                    </>
                  )}

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button type="button" disabled={index === 0} onClick={() => moveCard(stage.id, card.id, stage.id, 'up')} className="rounded-full border border-white/10 px-3 py-1.5 text-xs disabled:opacity-40">
                      ↑ Up
                    </button>
                    <button type="button" disabled={index === stage.cards.length - 1} onClick={() => moveCard(stage.id, card.id, stage.id, 'down')} className="rounded-full border border-white/10 px-3 py-1.5 text-xs disabled:opacity-40">
                      ↓ Down
                    </button>
                    {simpleSections
                      .filter((section) => section.stage.id !== stage.id)
                      .map((section) => (
                        <button key={section.stage.id} type="button" onClick={() => moveCard(stage.id, card.id, section.stage.id)} className="rounded-full border border-white/10 px-3 py-1.5 text-xs hover:bg-white/10">
                          Move to {section.eyebrow}
                        </button>
                      ))}
                    {quietStage ? (
                      <button type="button" onClick={() => moveCard(stage.id, card.id, quietStage.id)} className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-zinc-300 hover:bg-white/10">
                        Move to archive
                      </button>
                    ) : null}
                    <button type="button" onClick={() => removeCard(stage.id, card.id)} className="rounded-full border border-red-300/20 px-3 py-1.5 text-xs text-red-100 hover:bg-red-400/10">
                      Delete
                    </button>
                  </div>
                </article>
                );
              })}
              {stage.cards.length === 0 ? <p className="rounded-2xl border border-dashed border-white/10 p-4 text-sm text-zinc-500">Nothing in this section.</p> : null}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
