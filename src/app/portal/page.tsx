import Image from 'next/image';
import Link from 'next/link';
import PortalLoginForm from '@/components/PortalLoginForm';
import { getPortalSessionClientId } from '@/lib/portal/auth';
import { getPortalBoard } from '@/lib/portal/trello';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Client Portal | Stoke AI',
  description: 'Internal Stoke AI client portal for project status, board visibility, and next-step tracking.',
};

function formatUpdated(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
}

export default async function ClientPortalPage() {
  const clientId = await getPortalSessionClientId();
  const board = clientId ? await getPortalBoard(clientId) : null;
  const totalCards = board?.stages.reduce((total, stage) => total + stage.cards.length, 0) ?? 0;

  return (
    <main className="min-h-screen bg-[#0d0d0d] text-white">
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute -top-24 -left-32 h-96 w-96 rounded-full bg-orange-500 blur-[128px]" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-amber-600 blur-[128px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-6">
        <nav className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="inline-flex items-center gap-4">
            <Image src="/logo.png" alt="Stoke AI" width={220} height={75} priority />
          </Link>
          <div className="flex items-center gap-3 text-sm text-zinc-400">
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-emerald-300">
              {board ? `${board.client.name} portal` : 'Client portal'}
            </span>
            {board ? (
              <form action="/api/portal/logout" method="post">
                <button className="rounded-full border border-white/10 px-4 py-2 text-white transition hover:border-orange-400/60 hover:bg-orange-500/10">
                  Sign out
                </button>
              </form>
            ) : null}
            <Link href="/" className="rounded-full border border-white/10 px-4 py-2 text-white transition hover:border-orange-400/60 hover:bg-orange-500/10">
              Back to site
            </Link>
          </div>
        </nav>

        <section className="grid gap-6 py-10 lg:grid-cols-[1.4fr_0.6fr] lg:items-stretch">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl shadow-black/30 backdrop-blur">
            <p className="mb-4 inline-flex rounded-full border border-orange-500/25 bg-orange-500/10 px-4 py-2 text-sm font-semibold text-orange-300">
              Stoke AI
            </p>
            <h1 className="max-w-4xl text-4xl font-black leading-tight md:text-6xl">
              {board ? board.client.headline : 'Client Portal'}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-400">
              {board
                ? board.client.summary
                : 'Sign in to see current work, next steps, and anything Stoke AI needs from you.'}
            </p>
            {board ? (
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-black/25 p-5">
                  <div className="text-3xl font-black text-orange-300">{board.stages.length}</div>
                  <div className="text-sm text-zinc-400">Project lanes</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/25 p-5">
                  <div className="text-3xl font-black text-orange-300">{totalCards}</div>
                  <div className="text-sm text-zinc-400">Visible cards</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/25 p-5">
                  <div className="text-3xl font-black text-orange-300">Active</div>
                  <div className="text-sm text-zinc-400">Workspace</div>
                </div>
              </div>
            ) : null}
          </div>

          <aside className="rounded-3xl border border-white/10 bg-black/40 p-6 shadow-2xl shadow-black/30 backdrop-blur">
            {board ? (
              <>
                <h2 className="text-xl font-bold">Portal status</h2>
                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  Signed in for {board.client.name}. Updates are customer-safe and filtered to show project status, next steps, and blockers only.
                </p>
                <div className="mt-6 space-y-3 text-sm text-zinc-300">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-zinc-500">Source</p>
                    <p className="mt-1 font-semibold">{board.source === 'trello' ? 'Trello board sync' : 'Internal portal data'}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-zinc-500">Last refreshed</p>
                    <p className="mt-1 font-semibold">{formatUpdated(board.lastUpdated)}</p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold">Sign in</h2>
                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  Use the username and password Stoke AI provided.
                </p>
                <PortalLoginForm />
                {process.env.NODE_ENV !== 'production' ? (
                  <p className="mt-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs leading-5 text-zinc-500">
                    Local preview: username austin-kevin, password austin-preview.
                  </p>
                ) : null}
              </>
            )}
          </aside>
        </section>

        {board ? (
          <>
            <section className="rounded-3xl border border-white/10 bg-black/35 p-5 backdrop-blur">
              <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-300">Project board</p>
                  <h2 className="mt-2 text-2xl font-black">Customer-visible roadmap</h2>
                </div>
                <p className="max-w-xl text-sm text-zinc-400">
                  Each card answers: what is happening, why it matters, and what comes next.
                </p>
              </div>

              <div className="grid gap-4 lg:grid-cols-4">
                {board.stages.map((stage) => (
                  <div key={stage.title} className={`rounded-2xl border p-4 ${stage.tone}`}>
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="font-bold">{stage.title}</h3>
                      <span className="rounded-full bg-black/30 px-2 py-1 text-xs text-zinc-300">{stage.cards.length}</span>
                    </div>
                    <div className="space-y-3">
                      {stage.cards.length ? (
                        stage.cards.map((card) => (
                          <article key={card.id} className="rounded-2xl border border-white/10 bg-[#111]/90 p-4 shadow-lg shadow-black/20">
                            <div className="mb-3 flex items-start justify-between gap-3">
                              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{card.client}</p>
                              <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-orange-200">{card.status}</span>
                            </div>
                            <h4 className="font-bold leading-snug">{card.title}</h4>
                            <p className="mt-2 text-sm leading-6 text-zinc-400">{card.detail}</p>
                            {card.action ? (
                              <p className="mt-3 rounded-xl border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-xs leading-5 text-amber-100">
                                Client action: {card.action}
                              </p>
                            ) : null}
                          </article>
                        ))
                      ) : (
                        <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 p-4 text-sm text-zinc-500">
                          Nothing customer-visible in this lane right now.
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="grid gap-6 py-8 lg:grid-cols-[0.75fr_1.25fr]">
              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
                <h2 className="text-xl font-bold">What customers see</h2>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-zinc-400">
                  <li>• Current active work and the next planned item.</li>
                  <li>• Any blockers where Stoke AI needs customer input.</li>
                  <li>• A clean timeline of recently completed milestones.</li>
                  <li>• No internal notes, private credentials, or messy build chatter.</li>
                </ul>
                <div className="mt-6 rounded-2xl border border-orange-500/20 bg-orange-500/10 p-4">
                  <p className="text-sm font-bold text-orange-200">Need to add something?</p>
                  <p className="mt-2 text-sm leading-6 text-zinc-300">
                    Send bottlenecks, examples, screenshots, or “we should look at this” ideas and Stoke AI will turn them into visible queue items.
                  </p>
                  <a
                    href={`mailto:${board.client.contactEmail}?subject=${encodeURIComponent(`${board.client.name} portal request`)}&body=${encodeURIComponent('What should Stoke AI look at?\n\nWhy does it matter?\n\nAny examples, links, screenshots, or files to attach?\n')}`}
                    className="mt-4 inline-flex rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-3 text-sm font-black text-black transition hover:from-orange-600 hover:to-amber-600"
                  >
                    Send a new request
                  </a>
                </div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
                <h2 className="text-xl font-bold">Recent activity</h2>
                <div className="mt-4 space-y-3">
                  {board.activity.map((item) => (
                    <div key={item} className="rounded-2xl border border-white/10 bg-black/25 p-4 text-sm text-zinc-300">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        ) : (
          <section className="rounded-3xl border border-white/10 bg-black/35 p-8 text-center backdrop-blur">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-300">Private workspace</p>
            <h2 className="mt-3 text-3xl font-black">Sign in to view your workspace.</h2>
            <p className="mx-auto mt-3 max-w-2xl text-zinc-400">
              Use the username and password Stoke AI provided to view your workspace.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}
