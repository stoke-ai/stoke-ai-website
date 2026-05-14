import Image from 'next/image';
import Link from 'next/link';

const projectStages = [
  {
    title: 'Discovery',
    tone: 'border-sky-500/30 bg-sky-500/10',
    cards: [
      {
        client: 'Rachel Hansen Agency',
        title: 'Renewal workflow review',
        status: 'Complete',
        detail: 'Mapped the active renewal prep process and identified the next automation bottlenecks.',
      },
    ],
  },
  {
    title: 'Building Now',
    tone: 'border-orange-500/40 bg-orange-500/10',
    cards: [
      {
        client: 'Rachel Hansen Agency',
        title: 'Profile card + project queue system',
        status: 'In progress',
        detail: 'Creating a clearer customer-facing view of current work, blockers, and what Stoke AI is handling next.',
      },
      {
        client: 'Handy Truck Lines',
        title: 'Dispatching operating system foundation',
        status: 'In progress',
        detail: 'Core workflow design for load tracking, driver visibility, and dispatch handoff.',
      },
    ],
  },
  {
    title: 'Up Next',
    tone: 'border-amber-500/35 bg-amber-500/10',
    cards: [
      {
        client: 'Rachel Hansen Agency',
        title: 'Less manual queue resolution',
        status: 'Next sprint',
        detail: 'Reduce human cleanup work by turning repeat decisions into reusable automation rules.',
      },
      {
        client: 'Stoke AI Portal',
        title: 'Trello-style client board integration',
        status: 'Starting',
        detail: 'Give customers a secure portal where they can see current work without needing direct access to internal tools.',
      },
    ],
  },
  {
    title: 'Waiting / Blocked',
    tone: 'border-zinc-500/30 bg-zinc-500/10',
    cards: [
      {
        client: 'Client input needed',
        title: 'Sample docs, approvals, or credentials',
        status: 'As needed',
        detail: 'Anything that requires customer review will be surfaced here with a clear requested action.',
      },
    ],
  },
];

const activity = [
  'Portal shell created for secure customer project visibility.',
  'Board columns drafted around how Stoke AI actually builds: discovery, building now, up next, and blocked.',
  'Next integration target: sync these cards from Trello or the internal project tracker instead of hardcoding them.',
];

export const metadata = {
  title: 'Client Portal | Stoke AI',
  description: 'Internal Stoke AI client portal for project status, board visibility, and next-step tracking.',
};

export default function ClientPortalPage() {
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
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-emerald-300">Portal preview</span>
            <Link href="/" className="rounded-full border border-white/10 px-4 py-2 text-white transition hover:border-orange-400/60 hover:bg-orange-500/10">
              Back to site
            </Link>
          </div>
        </nav>

        <section className="grid gap-6 py-10 lg:grid-cols-[1.4fr_0.6fr] lg:items-stretch">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl shadow-black/30 backdrop-blur">
            <p className="mb-4 inline-flex rounded-full border border-orange-500/25 bg-orange-500/10 px-4 py-2 text-sm font-semibold text-orange-300">
              Internal customer portal
            </p>
            <h1 className="max-w-4xl text-4xl font-black leading-tight md:text-6xl">
              A simple place for clients to see what Stoke AI is working on next.
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-400">
              This is the starting shell for the logged-in client experience: project status, active sprint cards,
              blockers, and next steps — presented like a clean Trello board without exposing internal operations.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-black/25 p-5">
                <div className="text-3xl font-black text-orange-300">4</div>
                <div className="text-sm text-zinc-400">Project lanes</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/25 p-5">
                <div className="text-3xl font-black text-orange-300">Client</div>
                <div className="text-sm text-zinc-400">Safe visibility</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/25 p-5">
                <div className="text-3xl font-black text-orange-300">Next</div>
                <div className="text-sm text-zinc-400">Trello sync/auth</div>
              </div>
            </div>
          </div>

          <aside className="rounded-3xl border border-white/10 bg-black/40 p-6 shadow-2xl shadow-black/30 backdrop-blur">
            <h2 className="text-xl font-bold">Client login</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Preview only. Authentication will connect this screen to the customer account before launch.
            </p>
            <form className="mt-6 space-y-4">
              <label className="block text-sm font-semibold text-zinc-300">
                Email
                <input
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-orange-400"
                  placeholder="client@company.com"
                  type="email"
                />
              </label>
              <label className="block text-sm font-semibold text-zinc-300">
                Password
                <input
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-orange-400"
                  placeholder="••••••••"
                  type="password"
                />
              </label>
              <button
                type="button"
                className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-3 font-bold text-black transition hover:from-orange-600 hover:to-amber-600"
              >
                Preview portal
              </button>
            </form>
          </aside>
        </section>

        <section className="rounded-3xl border border-white/10 bg-black/35 p-5 backdrop-blur">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-300">Project board</p>
              <h2 className="mt-2 text-2xl font-black">Customer-visible roadmap</h2>
            </div>
            <p className="max-w-xl text-sm text-zinc-400">
              Each card should answer: what is happening, why it matters, and what comes next.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-4">
            {projectStages.map((stage) => (
              <div key={stage.title} className={`rounded-2xl border p-4 ${stage.tone}`}>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-bold">{stage.title}</h3>
                  <span className="rounded-full bg-black/30 px-2 py-1 text-xs text-zinc-300">{stage.cards.length}</span>
                </div>
                <div className="space-y-3">
                  {stage.cards.map((card) => (
                    <article key={`${stage.title}-${card.title}`} className="rounded-2xl border border-white/10 bg-[#111]/90 p-4 shadow-lg shadow-black/20">
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{card.client}</p>
                        <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-orange-200">{card.status}</span>
                      </div>
                      <h4 className="font-bold leading-snug">{card.title}</h4>
                      <p className="mt-2 text-sm leading-6 text-zinc-400">{card.detail}</p>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-6 py-8 lg:grid-cols-[0.75fr_1.25fr]">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-xl font-bold">What customers should see</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-zinc-400">
              <li>• Current active work and the next planned item.</li>
              <li>• Any blockers where we need customer input.</li>
              <li>• A clean timeline of recently completed milestones.</li>
              <li>• No internal notes, private credentials, or messy build chatter.</li>
            </ul>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-xl font-bold">Recent activity</h2>
            <div className="mt-4 space-y-3">
              {activity.map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-black/25 p-4 text-sm text-zinc-300">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
