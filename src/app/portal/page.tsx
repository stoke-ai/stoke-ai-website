import Image from 'next/image';
import Link from 'next/link';
import PortalLoginForm from '@/components/PortalLoginForm';
import PortalUpdateForm from '@/components/PortalUpdateForm';
import { getPortalSessionClientId } from '@/lib/portal/auth';
import { getPortalBoard } from '@/lib/portal/trello';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Client Portal | Stoke AI',
  description: 'Private Stoke AI workspace for priorities, projects, decisions, and progress.',
};

function getStage(board: NonNullable<Awaited<ReturnType<typeof getPortalBoard>>>, stageId: string) {
  return board.stages.find((stage) => stage.id === stageId);
}

function Card({
  title,
  status,
  detail,
  action,
  featured = false,
  cardId,
}: {
  cardId: string;
  title: string;
  status: string;
  detail: string;
  action?: string;
  featured?: boolean;
}) {
  return (
    <article
      className={`rounded-2xl border p-4 transition ${
        featured
          ? 'border-orange-400/30 bg-orange-500/[0.08] shadow-[0_0_0_1px_rgba(249,115,22,0.08)]'
          : 'border-white/8 bg-white/[0.035] hover:border-white/15 hover:bg-white/[0.055]'
      }`}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <h4 className="text-base font-semibold leading-snug text-zinc-50">{title}</h4>
        <span className="shrink-0 rounded-full border border-white/10 bg-black/25 px-2.5 py-1 text-[11px] font-medium text-zinc-300">
          {status}
        </span>
      </div>
      <p className="text-sm leading-6 text-zinc-300">{detail}</p>
      {action ? (
        <div className="mt-4 rounded-xl border border-amber-400/20 bg-amber-400/[0.08] px-3 py-2.5 text-sm leading-5 text-amber-100">
          <span className="font-semibold text-amber-200">Needed:</span> {action}
        </div>
      ) : null}
      <PortalUpdateForm
        kind="reply"
        cardId={cardId}
        cardTitle={title}
        label={action ? 'Send update' : 'Comment'}
        title={action ? 'Send what Blaze needs' : `Comment on ${title}`}
        prompt={action || 'Add a note, question, link, screenshot description, or correction for this item.'}
        buttonClassName="mt-4 inline-flex rounded-full border border-white/10 bg-white/[0.05] px-3 py-2 text-xs font-semibold text-zinc-100 transition hover:border-orange-400/40 hover:bg-orange-400/10"
      />
    </article>
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
                Current projects, what Stoke AI is working on, what needs your input, and what is coming next.
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

  const doneStage = getStage(board, 'discovery');
  const activeStage = getStage(board, 'building-now');
  const nextStage = getStage(board, 'up-next');
  const needsStage = getStage(board, 'waiting-blocked');

  const doneCards = doneStage?.cards ?? [];
  const activeCards = activeStage?.cards ?? [];
  const nextCards = nextStage?.cards ?? [];
  const needsCards = needsStage?.cards ?? [];
  const currentCard = activeCards[0] ?? nextCards[0] ?? doneCards[0];
  const nextCard = nextCards[0];
  const needsCard = needsCards[0];

  const columns = [
    { title: 'In progress', subtitle: 'What Jeff is working on now', cards: activeCards, accent: 'bg-orange-400' },
    { title: 'Needs you', subtitle: 'Input needed to keep moving', cards: needsCards, accent: 'bg-amber-300' },
    { title: 'Next', subtitle: 'Queued up after the current work', cards: nextCards, accent: 'bg-sky-300' },
    { title: 'Done', subtitle: 'Finished or already decided', cards: doneCards, accent: 'bg-emerald-300' },
  ];

  return (
    <main className="min-h-screen bg-[#08090a] text-zinc-50">
      <div className="fixed inset-0 pointer-events-none opacity-35">
        <div className="absolute -top-40 left-1/3 h-96 w-96 rounded-full bg-orange-500/20 blur-[150px]" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-amber-500/10 blur-[150px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1500px] px-5 py-5 md:px-8">
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
          <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 md:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-orange-200">Your workspace</p>
              <h1 className="mt-3 text-4xl font-black tracking-tight md:text-6xl">{board.client.name}</h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-300">
                Your projects, Jeff’s current focus, anything waiting on you, and what is coming next.
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                  <p className="text-sm text-zinc-400">Jeff is working on</p>
                  <p className="mt-1 line-clamp-2 text-lg font-semibold text-zinc-50">{currentCard?.title ?? 'Nothing active'}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                  <p className="text-sm text-zinc-400">Needs you</p>
                  <p className="mt-1 text-lg font-semibold text-zinc-50">{needsCards.length ? `${needsCards.length} item${needsCards.length === 1 ? '' : 's'}` : 'Nothing right now'}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                  <p className="text-sm text-zinc-400">Completed</p>
                  <p className="mt-1 text-lg font-semibold text-zinc-50">{doneCards.length} item{doneCards.length === 1 ? '' : 's'}</p>
                </div>
              </div>
            </div>

            <aside className="rounded-[2rem] border border-orange-400/20 bg-orange-500/[0.055] p-6 md:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-orange-200">Right now</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight">{currentCard?.title ?? 'Workspace is open'}</h2>
              <div className="mt-5 grid gap-3 text-sm">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-zinc-400">Current focus</p>
                  <p className="mt-1 text-base font-semibold text-zinc-50">{currentCard?.title ?? 'Workspace is open'}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-zinc-400">Why it matters</p>
                  <p className="mt-1 leading-6 text-zinc-200">{currentCard?.detail ?? board.client.summary}</p>
                </div>
              </div>
              {needsCard ? (
                <div className="mt-6 rounded-2xl border border-amber-300/25 bg-amber-300/[0.08] p-4">
                  <p className="text-sm font-semibold text-amber-200">Needed from you</p>
                  <p className="mt-2 text-sm leading-6 text-zinc-200">{needsCard.action ?? needsCard.detail}</p>
                  <PortalUpdateForm
                    kind="reply"
                    cardId={needsCard.id}
                    cardTitle={needsCard.title}
                    label="Send update"
                    title="Send what Blaze needs"
                    prompt={needsCard.action ?? needsCard.detail}
                    buttonClassName="mt-4 inline-flex rounded-full bg-amber-300 px-4 py-2 text-xs font-black text-black transition hover:bg-amber-200"
                  />
                </div>
              ) : (
                <div className="mt-6 rounded-2xl border border-emerald-300/20 bg-emerald-300/[0.07] p-4">
                  <p className="text-sm font-semibold text-emerald-200">Nothing needed from you right now.</p>
                  <p className="mt-2 text-sm leading-6 text-zinc-300">Stoke AI will keep the current work moving and update this space when your input is needed.</p>
                </div>
              )}
            </aside>
          </div>
        </section>

        <section className="mb-4 mt-2 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-orange-200">Your projects</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight">Everything in one place.</h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-zinc-400">
            Clients can add items or send updates. Blaze keeps the board organized so nothing gets moved by accident.
          </p>
        </section>

        <section className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-4">
          {columns.map((column) => (
            <div key={column.title} className="rounded-[1.5rem] border border-white/10 bg-white/[0.025] p-4">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${column.accent}`} />
                    <h3 className="font-semibold text-zinc-50">{column.title}</h3>
                  </div>
                  <p className="mt-1 text-xs leading-5 text-zinc-400">{column.subtitle}</p>
                </div>
                <span className="rounded-full border border-white/10 bg-black/25 px-2.5 py-1 text-xs text-zinc-400">{column.cards.length}</span>
              </div>

              <div className="space-y-3">
                {column.cards.length ? (
                  column.cards.map((card, index) => (
                    <Card
                      key={card.id}
                      cardId={card.id}
                      title={card.title}
                      status={card.status}
                      detail={card.detail}
                      action={card.action}
                      featured={column.title === 'In progress' && index === 0}
                    />
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-white/10 bg-black/15 p-4 text-sm leading-6 text-zinc-500">
                    Nothing here right now.
                  </div>
                )}
              </div>
            </div>
          ))}
        </section>

        <section className="grid gap-5 py-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-orange-200">Add something</p>
            <h2 className="mt-3 text-2xl font-black tracking-tight">Send Jeff a new issue or bottleneck.</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              If something is slow, repetitive, hard to track, or living in someone’s head, send it here.
            </p>
            <PortalUpdateForm
              kind="new-item"
              label="Send new item"
              title="Add something for Blaze to review"
              prompt="Share the issue, bottleneck, idea, screenshot description, link, or workflow detail. Blaze will turn it into the right workspace item."
            />
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-orange-200">Coming next</p>
            <h2 className="mt-3 text-2xl font-black tracking-tight">{nextCard?.title ?? 'Next priority will show here.'}</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              {nextCard?.detail ?? 'Once the current work is clear, Stoke AI will place the next priority here so there is no guessing.'}
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
