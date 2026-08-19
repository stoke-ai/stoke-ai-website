import Image from 'next/image';
import Link from 'next/link';
import PortalLoginForm from '@/components/PortalLoginForm';
import PortalUpdateForm from '@/components/PortalUpdateForm';
import type { PortalCard } from '@/lib/portal/data';
import { getPortalSessionClientId } from '@/lib/portal/auth';
import { getPortalBoard } from '@/lib/portal/trello';
import { getLatestPortalMessage } from '@/lib/portal/store';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Client Portal | Stoke AI',
  description: 'Private Stoke AI workspace for priorities, projects, decisions, and progress.',
};

function getStage(board: NonNullable<Awaited<ReturnType<typeof getPortalBoard>>>, stageId: string) {
  return board.stages.find((stage) => stage.id === stageId);
}

type LatestPortalMessage = Awaited<ReturnType<typeof getLatestPortalMessage>>;
type NeedAccent = 'procurement' | 'ar' | 'shared';

const needAccentStyles: Record<NeedAccent, { badge: string; button: string }> = {
  procurement: {
    badge: 'bg-orange-300 text-black',
    button: 'bg-orange-300 text-black hover:bg-orange-200',
  },
  ar: {
    badge: 'bg-sky-300 text-black',
    button: 'bg-sky-300 text-black hover:bg-sky-200',
  },
  shared: {
    badge: 'bg-amber-300 text-black',
    button: 'bg-amber-300 text-black hover:bg-amber-200',
  },
};

function statusForClient(defaultStatus: string, latestMessage: LatestPortalMessage) {
  if (!latestMessage) return defaultStatus;
  if (latestMessage.status === 'new') return 'Sent to Blaze';
  if (latestMessage.status === 'seen') return 'Blaze reviewing';
  if (latestMessage.status === 'replied') return 'Blaze replied';
  if (latestMessage.status === 'converted') return 'In progress';
  if (latestMessage.status === 'closed') return 'Done';
  return defaultStatus;
}

function buttonLabelForAction(action?: string) {
  const value = action?.toLowerCase() ?? '';
  if (value.includes('ready for review')) return 'Mark ready for review';
  if (value.includes('confirm cecilia') || value.includes('3:00')) return 'Confirm meeting';
  if (value.includes('contact') || value.includes('introduce') || value.includes('person')) return 'Send contact';
  if (value.includes('screenshot') || value.includes('example')) return 'Send example';
  if (value.includes('folder') || value.includes('doc') || value.includes('file') || value.includes('link')) return 'Send materials';
  return action ? 'Send this' : 'Add note';
}

function formatRelative(value?: string) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? '' : 's'} ago`;
  const months = Math.floor(days / 30);
  return `${months} month${months === 1 ? '' : 's'} ago`;
}

function needsHeadline(count: number) {
  if (count === 1) return 'One thing we need from your team.';
  if (count === 2) return 'Two things we need from your team.';
  if (count === 3) return 'Three simple things.';
  return `What we need from your team — ${count} items.`;
}

function ownerLabel(owner?: string, stageId?: string) {
  if (owner === 'you' || stageId === 'waiting-blocked') {
    return { text: 'Needs you', className: 'border-amber-300/30 bg-amber-300/[0.1] text-amber-100' };
  }
  if (owner === 'shared') {
    return { text: 'Shared', className: 'border-white/15 bg-white/[0.05] text-zinc-200' };
  }
  if (stageId === 'shipped') {
    return { text: 'Stoke finished', className: 'border-emerald-300/25 bg-emerald-300/[0.08] text-emerald-100' };
  }
  if (owner === 'stoke' || stageId === 'building-now') {
    return { text: 'Stoke working', className: 'border-orange-300/25 bg-orange-300/[0.08] text-orange-100' };
  }
  return { text: 'Pipeline', className: 'border-white/10 bg-white/[0.04] text-zinc-300' };
}

function OwnerBadge({ owner, stageId }: { owner?: string; stageId?: string }) {
  const label = ownerLabel(owner, stageId);
  return (
    <span className={`w-fit shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${label.className}`}>
      {label.text}
    </span>
  );
}

function NeedResponseCard({
  card,
  latestMessage,
  number,
  accent,
}: {
  card: PortalCard;
  latestMessage: LatestPortalMessage;
  number: number;
  accent: NeedAccent;
}) {
  const clientStatus = statusForClient(card.status, latestMessage);
  const styles = needAccentStyles[accent];

  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <div className="flex gap-3">
        <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-black ${styles.badge}`}>{number}</span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 xl:flex-row xl:items-start xl:justify-between">
            <h3 className="font-semibold text-zinc-50">{card.title}</h3>
            <span
              className={`w-fit shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
                latestMessage
                  ? 'border-emerald-300/25 bg-emerald-300/[0.08] text-emerald-100'
                  : 'border-white/10 bg-white/[0.04] text-zinc-300'
              }`}
            >
              {clientStatus}
            </span>
          </div>
          <p className="mt-2 text-sm leading-6 text-zinc-300">{card.action ?? card.detail}</p>
        </div>
      </div>
      <PortalUpdateForm
        kind="reply"
        cardId={card.id}
        cardTitle={card.title}
        label={buttonLabelForAction(card.action)}
        title="Send this to Jeff / Blaze"
        prompt={card.action ?? card.detail}
        latestMessage={latestMessage}
        buttonClassName={`ml-10 mt-4 inline-flex rounded-full px-5 py-2.5 text-sm font-black transition ${styles.button}`}
      />
    </div>
  );
}

export default async function ClientPortalPage() {
  const clientId = await getPortalSessionClientId();
  const board = clientId ? await getPortalBoard(clientId) : null;

  if (!board) {
    return (
      <main className="min-h-screen bg-[#08090a] text-zinc-50">
        <div className="fixed inset-0 pointer-events-none opacity-40">
          <div className="absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-orange-500/20 blur-[140px]" />
          <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-amber-500/10 blur-[120px]" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-6">
          <nav className="flex items-center justify-between border-b border-white/[0.07] pb-5">
            <Link href="/" className="inline-flex items-center gap-3">
              <Image src="/logo.png" alt="Stoke AI" width={190} height={65} priority />
            </Link>
            <Link href="/" className="rounded-full border border-white/10 px-4 py-2 text-sm text-zinc-200 transition hover:border-orange-400/40 hover:bg-white/[0.04]">
              Back to site
            </Link>
          </nav>

          <section className="grid flex-1 items-center gap-10 py-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className="mb-4 inline-flex rounded-full border border-orange-400/20 bg-orange-400/[0.08] px-4 py-2 text-sm font-semibold text-orange-200">
                Private client workspace
              </p>
              <h1 className="max-w-3xl text-5xl font-black leading-[0.98] tracking-tight md:text-7xl">
                See what is moving.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
                One simple place to see what Stoke finished, what is in progress, and what your team still needs to do.
              </p>
            </div>

            <aside className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-7 shadow-2xl shadow-black/30 backdrop-blur">
              <h2 className="text-2xl font-bold">Sign in</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-400">Use the username and password Stoke AI provided.</p>
              <PortalLoginForm />
              {process.env.NODE_ENV !== 'production' ? (
                <p className="mt-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs leading-5 text-zinc-500">
                  Local preview: username jeff, password stoke-preview.
                </p>
              ) : null}
            </aside>
          </section>
        </div>
      </main>
    );
  }

  const activeStage = getStage(board, 'building-now');
  const nextStage = getStage(board, 'up-next');
  const needsStage = getStage(board, 'waiting-blocked');
  const shippedStage = getStage(board, 'shipped');

  const activeCards = activeStage?.cards ?? [];
  const nextCards = nextStage?.cards ?? [];
  const needsCards = needsStage?.cards ?? [];
  const shippedCards = shippedStage?.cards ?? [];
  const currentCard = activeCards[0] ?? nextCards[0];

  const isGoffWorkspace = board.client.id === 'goff-welding';
  const NEEDS_VISIBLE_CAP = isGoffWorkspace ? needsCards.length : 5;
  const visibleNeeds = needsCards.slice(0, NEEDS_VISIBLE_CAP);
  const overflowNeedsCount = Math.max(0, needsCards.length - visibleNeeds.length);
  const needsCardsWithMessages = await Promise.all(
    visibleNeeds.map(async (card) => ({
      card,
      latestMessage: await getLatestPortalMessage(board.client.id, card.id),
    })),
  );
  const procurementNeeds = needsCardsWithMessages.filter(({ card }) => card.id.startsWith('gw-procurement-'));
  const arNeeds = needsCardsWithMessages.filter(
    ({ card }) => card.id.startsWith('gw-ar-') || card.id === 'gw-fresh-sap-aging-export' || card.id === 'gw-billing-mailbox-confirmation',
  );
  const laneNeedIds = new Set([...procurementNeeds, ...arNeeds].map(({ card }) => card.id));
  const sharedGoffNeeds = needsCardsWithMessages.filter(({ card }) => !laneNeedIds.has(card.id));
  const procurementPriority = activeCards.find((card) => card.id === 'gw-procurement-specialist-active');
  const arPriority = activeCards.find((card) => card.id === 'gw-ar-collections-active');

  const visibleShipped = isGoffWorkspace ? shippedCards : shippedCards.slice(0, 6);
  const overflowShippedCount = Math.max(0, shippedCards.length - visibleShipped.length);
  const updatedRelative = formatRelative(board.lastUpdated);
  const activePriorityCount = [procurementPriority, arPriority].filter(Boolean).length || Math.min(activeCards.length || 1, 2);
  const needsFromYouCount = needsCards.length;
  const stokeFinishedCount = shippedCards.length;

  return (
    <main className="min-h-screen bg-[#08090a] text-zinc-50">
      <div className="fixed inset-0 pointer-events-none opacity-35">
        <div className="absolute -top-40 left-1/3 h-96 w-96 rounded-full bg-orange-500/20 blur-[150px]" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-amber-500/10 blur-[150px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-5 py-5 md:px-8">
        <nav className="flex flex-col gap-4 border-b border-white/[0.07] pb-5 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="inline-flex items-center gap-4">
            <Image src="/logo.png" alt="Stoke AI" width={185} height={62} priority />
          </Link>
          <div className="flex items-center gap-3 text-sm text-zinc-400">
            <span className="rounded-full border border-emerald-400/20 bg-emerald-400/[0.08] px-3 py-1.5 text-emerald-200">
              {board.client.name}
            </span>
            <form action="/api/portal/logout" method="post">
              <button className="rounded-full border border-white/10 px-4 py-2 text-zinc-200 transition hover:border-orange-400/40 hover:bg-white/[0.04]">
                Sign out
              </button>
            </form>
          </div>
        </nav>

        <section className="py-8 md:py-10">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-orange-400/25 bg-orange-400/[0.1] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-orange-200">
                {isGoffWorkspace ? 'Goff Project Workspace' : `${board.client.name} workspace`}
              </span>
              {updatedRelative ? <span className="text-xs text-zinc-500">Updated {updatedRelative}</span> : null}
            </div>
            <h1 className="mt-5 text-3xl font-black tracking-tight md:text-5xl">
              {isGoffWorkspace ? 'Your priorities. Our finished work.' : 'Here’s what’s moving.'}
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-300">
              {isGoffWorkspace
                ? 'This page always shows the two active Stoke priorities on top, exactly what Goff still needs to do, and a verifiable list of what Stoke has already finished.'
                : board.client.summary}
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-orange-300/20 bg-orange-300/[0.07] p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-orange-200">Active priorities</p>
                <p className="mt-2 text-3xl font-black text-zinc-50">{isGoffWorkspace ? activePriorityCount : Math.min(activeCards.length || 1, 2)}</p>
                <p className="mt-1 text-xs leading-5 text-zinc-400">What Stoke is building now</p>
              </div>
              <div className="rounded-2xl border border-amber-300/20 bg-amber-300/[0.07] p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-200">Needs from you</p>
                <p className="mt-2 text-3xl font-black text-zinc-50">{needsFromYouCount}</p>
                <p className="mt-1 text-xs leading-5 text-zinc-400">Only true client actions</p>
              </div>
              <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/[0.07] p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-200">What Stoke finished</p>
                <p className="mt-2 text-3xl font-black text-zinc-50">{stokeFinishedCount}</p>
                <p className="mt-1 text-xs leading-5 text-zinc-400">Verified wins you can point to</p>
              </div>
            </div>

            {!isGoffWorkspace && currentCard ? (
              <div className="mt-5 rounded-2xl border border-orange-400/25 bg-orange-500/[0.06] p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-200">Current focus</p>
                  <OwnerBadge owner={currentCard.owner} stageId="building-now" />
                </div>
                <h2 className="mt-2 text-xl font-bold text-zinc-50">{currentCard.title}</h2>
                <p className="mt-2 text-sm leading-7 text-zinc-300">{currentCard.detail}</p>
              </div>
            ) : null}

            <p className="mt-5 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs leading-5 text-zinc-400">
              <span className="font-semibold text-zinc-300">How to read this page:</span> orange/blue = active Stoke work · amber = needs your team · green = already finished by Stoke with proof.
            </p>
            <p className="mt-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs leading-5 text-zinc-400">
              <span className="font-semibold text-zinc-300">What’s Blaze?</span> Blaze is Jeff’s AI partner. When you send something here, Blaze sees it first and Jeff is looped in on anything important.
            </p>
          </div>
        </section>

        {isGoffWorkspace ? (
          <section className="pb-8">
            <div className="mb-5">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-200">Active priorities · on top</p>
              <h2 className="mt-3 text-2xl font-black tracking-tight">Two focused lanes right now.</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400">
                Each lane shows what Stoke is building and exactly what Goff still needs to send or decide for that lane.
              </p>
            </div>

            <div className="grid items-start gap-5 lg:grid-cols-2">
              <div className="order-1 rounded-[2rem] border border-sky-300/25 bg-sky-300/[0.06] p-5 md:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-200">Priority 1 · Cecilia, Alice, Quinton</p>
                    <h3 className="mt-2 text-2xl font-black tracking-tight">Accounts Receivable</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <OwnerBadge owner="stoke" stageId="building-now" />
                    <span className="rounded-full border border-sky-300/25 bg-sky-300/[0.08] px-3 py-1 text-xs font-semibold text-sky-100">Active</span>
                  </div>
                </div>
                {arPriority ? <p className="mt-4 text-sm leading-6 text-zinc-300">{arPriority.detail}</p> : null}
                <div className="mt-6 border-t border-sky-200/15 pt-5">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-100">Needed from Goff for AR</p>
                    <OwnerBadge owner="you" stageId="waiting-blocked" />
                  </div>
                  <div className="space-y-3">
                    {arNeeds.length ? (
                      arNeeds.map(({ card, latestMessage }, index) => (
                        <NeedResponseCard key={card.id} card={card} latestMessage={latestMessage} number={index + 1} accent="ar" />
                      ))
                    ) : (
                      <p className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-zinc-400">Nothing needed from the team right now.</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="order-2 rounded-[2rem] border border-orange-300/25 bg-orange-300/[0.06] p-5 md:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-200">Priority 2 · Kevin</p>
                    <h3 className="mt-2 text-2xl font-black tracking-tight">Procurement</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <OwnerBadge owner="stoke" stageId="building-now" />
                    <span className="rounded-full border border-orange-300/25 bg-orange-300/[0.08] px-3 py-1 text-xs font-semibold text-orange-100">Active</span>
                  </div>
                </div>
                {procurementPriority ? <p className="mt-4 text-sm leading-6 text-zinc-300">{procurementPriority.detail}</p> : null}
                <div className="mt-6 border-t border-orange-200/15 pt-5">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-orange-100">Needed from Goff for procurement</p>
                    <OwnerBadge owner="you" stageId="waiting-blocked" />
                  </div>
                  <div className="space-y-3">
                    {procurementNeeds.length ? (
                      procurementNeeds.map(({ card, latestMessage }, index) => (
                        <NeedResponseCard key={card.id} card={card} latestMessage={latestMessage} number={index + 1} accent="procurement" />
                      ))
                    ) : (
                      <p className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-zinc-400">Nothing needed from the team right now.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {sharedGoffNeeds.length ? (
              <div className="mt-5 rounded-[2rem] border border-white/10 bg-white/[0.03] p-5 md:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-300">Shared workforce and access items</p>
                  <OwnerBadge owner="you" stageId="waiting-blocked" />
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {sharedGoffNeeds.map(({ card, latestMessage }, index) => (
                    <NeedResponseCard key={card.id} card={card} latestMessage={latestMessage} number={index + 1} accent="shared" />
                  ))}
                </div>
              </div>
            ) : null}
          </section>
        ) : null}

        {visibleShipped.length > 0 ? (
          <section className="pb-2">
            <div className="rounded-[2rem] border border-emerald-300/20 bg-emerald-300/[0.05] p-6 md:p-8">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-200">What Stoke has done</p>
                  <h2 className="mt-3 text-2xl font-black tracking-tight">
                    {isGoffWorkspace ? 'Verifiable finished work.' : 'Wins worth seeing.'}
                  </h2>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400">
                    {isGoffWorkspace
                      ? 'When someone asks “what has Stoke done for us?”, this is the answer. Every item below is finished work with a plain-English proof line — not a plan and not a promise.'
                      : 'Finished work Stoke has already delivered for your team.'}
                  </p>
                </div>
                <OwnerBadge owner="stoke" stageId="shipped" />
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {visibleShipped.map((card) => {
                  const shippedAt = formatRelative(card.updatedAt);
                  return (
                    <div key={card.id} className="rounded-2xl border border-emerald-300/20 bg-black/20 p-4">
                      <div className="flex items-start gap-3">
                        <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-300 text-[10px] font-black text-black">✓</span>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <h3 className="font-semibold text-zinc-50">{card.title}</h3>
                            <span className="shrink-0 rounded-full border border-emerald-300/20 bg-emerald-300/[0.08] px-2.5 py-1 text-[11px] font-semibold text-emerald-100">
                              {card.status}
                            </span>
                          </div>
                          <p className="mt-1 text-sm leading-6 text-zinc-300">{card.detail}</p>
                          {card.evidence ? (
                            <p className="mt-2 rounded-lg border border-emerald-300/15 bg-emerald-300/[0.06] px-2.5 py-2 text-xs leading-5 text-emerald-100/90">
                              <span className="font-semibold text-emerald-100">Proof:</span> {card.evidence}
                            </p>
                          ) : null}
                          {shippedAt ? <p className="mt-2 text-xs text-emerald-200/70">Recorded {shippedAt}</p> : null}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {overflowShippedCount > 0 ? (
                <p className="mt-4 text-xs text-emerald-200/70">+ {overflowShippedCount} more finished earlier.</p>
              ) : null}
            </div>
          </section>
        ) : null}

        {!isGoffWorkspace && needsCardsWithMessages.length > 0 ? (
          <section className="py-8">
            <div className="rounded-[2rem] border border-amber-300/25 bg-amber-300/[0.07] p-6 md:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-200">What we need from your team</p>
              <h2 className="mt-3 text-2xl font-black tracking-tight">{needsHeadline(needsCards.length)}</h2>

              <div className="mt-6 space-y-3">
                {needsCardsWithMessages.map(({ card, latestMessage }, index) => {
                  const clientStatus = statusForClient(card.status, latestMessage);
                  return (
                    <div key={card.id} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <div className="flex gap-3">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-300 text-sm font-black text-black">{index + 1}</span>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                            <h3 className="font-semibold text-zinc-50">{card.title}</h3>
                            <span
                              className={`w-fit shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
                                latestMessage
                                  ? 'border-emerald-300/25 bg-emerald-300/[0.08] text-emerald-100'
                                  : 'border-amber-300/25 bg-amber-300/[0.08] text-amber-100'
                              }`}
                            >
                              {clientStatus}
                            </span>
                          </div>
                          <p className="mt-1 text-sm leading-6 text-zinc-300">{card.action ?? card.detail}</p>
                        </div>
                      </div>
                      <PortalUpdateForm
                        kind="reply"
                        cardId={card.id}
                        cardTitle={card.title}
                        label={buttonLabelForAction(card.action)}
                        title="Send this to Jeff / Blaze"
                        prompt={card.action ?? card.detail}
                        latestMessage={latestMessage}
                        buttonClassName="ml-10 mt-4 inline-flex rounded-full bg-amber-300 px-5 py-2.5 text-sm font-black text-black transition hover:bg-amber-200"
                      />
                    </div>
                  );
                })}
              </div>
              {overflowNeedsCount > 0 ? (
                <p className="mt-4 text-xs text-amber-100/70">+ {overflowNeedsCount} more on the list — Jeff will surface them as the top items get answered.</p>
              ) : null}
            </div>
          </section>
        ) : null}

        {!isGoffWorkspace && needsCardsWithMessages.length === 0 ? (
          <section className="py-8">
            <div className="rounded-[2rem] border border-emerald-300/25 bg-emerald-300/[0.06] p-6 md:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-200">Nothing on your team right now</p>
              <h2 className="mt-3 text-2xl font-black tracking-tight">You’re clear. Blaze has the queue.</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-300">
                When something needs your input, it will show up here. Until then, keep moving — we’ll bring you in only when it matters.
              </p>
            </div>
          </section>
        ) : null}

        {nextCards.length > 0 ? (
          <section className="py-8">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 md:p-8">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-200">Lined up next</p>
                  <h2 className="mt-3 text-2xl font-black tracking-tight">Coming after the current focus.</h2>
                </div>
                <p className="max-w-md text-sm leading-6 text-zinc-400">
                  Visible so good ideas don’t get lost. Committed work is in the priorities section above.
                </p>
              </div>
              <div className="mt-6 grid gap-3 md:grid-cols-2">
                {nextCards.map((card) => (
                  <div key={card.id} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-semibold text-zinc-50">{card.title}</h3>
                      <span className="shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-semibold text-zinc-300">
                        {card.status}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-zinc-300">{card.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section className="pb-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 md:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-200">Send anything else</p>
            <h2 className="mt-3 text-2xl font-black tracking-tight">Question, file, screenshot, correction?</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-300">
              Use this workspace for normal requests, files, links, decisions, and corrections. Stoke AI will organize the next action and keep its status visible here.
            </p>
            <PortalUpdateForm
              kind="new-item"
              label="Send to Jeff / Blaze"
              title="Send something for Jeff / Blaze to review"
              prompt="Share the question, file, correction, link, or workflow detail. Jeff and Blaze will put it in the right place."
            />
            <p className="mt-5 text-sm text-zinc-400">
              Easier to show than type?{' '}
              <Link
                href="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ2sw-K7aDXdfHgtDxOLKoORuN9RwzclOJDLUP7bJuv1GKMRfZF0NkgccRG2k0punsmVVDM4Xtk3"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-emerald-300 underline-offset-4 hover:underline"
              >
                Schedule a quick check-in with Jeff →
              </Link>
            </p>
          </div>
        </section>

        <footer className="border-t border-white/[0.07] pb-8 pt-6 text-sm text-zinc-500">
          <p>Use this workspace as the normal operating channel. For a same-day operational emergency, use your established urgent contact path; Stoke AI will record the outcome and next step here.</p>
        </footer>
      </div>
    </main>
  );
}
