import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Austin | Stoke AI Operating Partnership',
  description:
    'A private Stoke AI offer page for Austin: ongoing AI and business systems implementation at $5,000/month.',
};

const focusAreas = [
  {
    title: 'Training and company knowledge',
    body: 'Turn the way the business actually works into a living system your team can search, use, and improve instead of relying on tribal knowledge.',
  },
  {
    title: 'Sales and follow-up visibility',
    body: 'Create clearer tracking around estimates, opportunities, next steps, and owner-level follow-up so good work does not disappear in texts or memory.',
  },
  {
    title: 'Office and admin workflows',
    body: 'Find the repetitive work, exception handling, document chasing, and handoffs that slow the team down — then build practical systems around them.',
  },
  {
    title: 'Owner decision support',
    body: 'Give Austin and Jeff a shared place to review priorities, decisions, bottlenecks, and what is being built next.',
  },
];

const included = [
  'Private Stoke AI workspace and live project board',
  'Monthly roadmap focused on the highest-value bottlenecks',
  'AI-assisted workflow design, buildout, and iteration',
  'Weekly written progress updates: done, blocked, waiting, next',
  'Request and comment loop so ideas turn into tracked work',
  'Priority access to Jeff as the business systems partner — without relying on scattered texts',
];

const firstMonth = [
  'Map the current operating bottlenecks and pick the first 1–3 priorities',
  'Set up the shared workspace so comments, tasks, and decisions have one home',
  'Build the first useful workflow or knowledge-system pilot',
  'Review what worked, what needs Austin’s input, and what should be built next',
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-4 text-xs font-semibold uppercase tracking-[0.26em] text-orange-300/90">
      {children}
    </p>
  );
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-3xl border border-white/10 bg-white/[0.045] p-6 shadow-2xl shadow-black/20 ${className}`}>
      {children}
    </div>
  );
}

function WorkspacePreview() {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0f1011] shadow-2xl shadow-black/40">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_0%,rgba(249,115,22,0.28),transparent_34%),radial-gradient(circle_at_88%_95%,rgba(94,106,210,0.22),transparent_38%)]" />
      <div className="relative border-b border-white/10 px-5 py-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-200/80">Austin workspace</p>
          <p className="text-lg font-black text-white">Operating priorities</p>
        </div>
        <span className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-200">
          Live rhythm
        </span>
      </div>
      <div className="relative grid gap-4 p-5 sm:p-6">
        <div className="rounded-2xl border border-orange-400/25 bg-orange-500/10 p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-sm font-black text-orange-100">Current focus</p>
            <span className="rounded-full bg-orange-400/15 px-3 py-1 text-[0.68rem] font-bold text-orange-200">MONTH 1</span>
          </div>
          <p className="text-2xl font-black leading-tight text-white">Build the first operating system layer</p>
          <p className="mt-2 text-sm leading-relaxed text-gray-300">
            Capture knowledge, track decisions, and turn owner-level bottlenecks into visible work.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
            <p className="mb-3 text-sm font-bold text-gray-200">Build queue</p>
            {['Training / company knowledge', 'Estimate and follow-up flow', 'Admin handoff cleanup'].map((item) => (
              <div key={item} className="mb-2 flex items-center gap-2 text-sm text-gray-300 last:mb-0">
                <span className="h-2 w-2 rounded-full bg-orange-300" />
                {item}
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
            <p className="mb-3 text-sm font-bold text-gray-200">Needs Austin</p>
            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3 text-sm text-gray-300">Approve first workflow priority</div>
            <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.04] p-3 text-sm text-gray-300">Share examples of repeated questions</div>
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
          <div className="mb-3 flex items-center justify-between text-sm">
            <span className="font-bold text-gray-200">Comment loop</span>
            <span className="font-black text-orange-200">Received → Seen → Action</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-orange-500 to-amber-300" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AustinOfferPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#08090a] text-white">
      <div className="fixed inset-0 pointer-events-none opacity-80">
        <div className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-orange-500/20 blur-[130px]" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-indigo-500/15 blur-[140px]" />
      </div>

      <div className="relative z-10">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <Link href="/" aria-label="Stoke AI home" className="block w-40 sm:w-52">
            <Image src="/logo.png" alt="Stoke AI" width={500} height={170} priority className="h-auto w-full" />
          </Link>
          <a
            href="#offer"
            className="hidden rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-gray-200 transition hover:border-orange-300/40 hover:text-white sm:inline-flex"
          >
            View the offer
          </a>
        </nav>

        <header className="mx-auto grid max-w-7xl items-center gap-10 px-6 pb-16 pt-8 lg:grid-cols-[1.02fr_0.98fr] lg:pb-24 lg:pt-16">
          <div>
            <div className="mb-6 inline-flex rounded-full border border-orange-400/25 bg-orange-500/10 px-4 py-2 text-sm font-semibold text-orange-200">
              Private offer for Austin
            </div>
            <h1 className="max-w-5xl text-[2.75rem] font-black leading-[0.94] tracking-[-0.06em] text-[#f7f8f8] sm:text-6xl lg:text-7xl">
              A working AI and systems partner for the business you are building.
            </h1>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-gray-300 sm:text-xl">
              Stoke AI is not a one-off chatbot project. It is an ongoing operating partnership: Jeff helps identify the highest-value bottlenecks, Blaze helps keep the work organized, and we build practical systems that make the business easier to run as it grows.
            </p>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
              <a
                href="#start"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-amber-400 px-7 py-4 text-base font-black text-black shadow-2xl shadow-orange-500/20 transition hover:scale-[1.02]"
              >
                Start at $5,000/month
              </a>
              <p className="max-w-sm text-sm leading-6 text-gray-400">
                Month-to-month. Built around real priorities, not software licenses or hourly consulting blocks.
              </p>
            </div>
          </div>
          <WorkspacePreview />
        </header>

        <section id="offer" className="border-y border-white/10 bg-white/[0.025] py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              <Card className="bg-gradient-to-br from-white/[0.07] to-orange-500/[0.08]">
                <SectionLabel>The offer</SectionLabel>
                <h2 className="text-4xl font-black tracking-tight text-white sm:text-5xl">Stoke AI Operating Partnership</h2>
                <p className="mt-5 text-lg leading-8 text-gray-300">
                  A monthly implementation relationship for an owner who wants better systems, clearer follow-up, and more team capacity without adding another disconnected tool.
                </p>
                <div className="mt-8 rounded-2xl border border-orange-300/25 bg-orange-500/10 p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-orange-200">Investment</p>
                  <p className="mt-2 text-5xl font-black text-white">$5,000<span className="text-xl text-gray-300">/month</span></p>
                  <p className="mt-3 text-sm leading-6 text-gray-300">Standard Stoke AI engagement. Month-to-month operating partnership.</p>
                </div>
              </Card>

              <Card>
                <SectionLabel>What Austin gets</SectionLabel>
                <div className="grid gap-3">
                  {included.map((item) => (
                    <div key={item} className="flex gap-3 rounded-2xl border border-white/10 bg-black/25 p-4 text-gray-200">
                      <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-orange-300" />
                      <p className="leading-7">{item}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-16 lg:py-24">
          <div className="mb-10 max-w-3xl">
            <SectionLabel>Where we would start</SectionLabel>
            <h2 className="text-4xl font-black tracking-tight sm:text-5xl">First, we pick the work that matters most.</h2>
            <p className="mt-5 text-lg leading-8 text-gray-300">
              The point is not to invent random AI projects. The point is to stay close to the business, find the places where growth is creating drag, and build the systems that reduce that drag.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {focusAreas.map((area) => (
              <Card key={area.title}>
                <h3 className="text-2xl font-black tracking-tight text-white">{area.title}</h3>
                <p className="mt-3 leading-7 text-gray-300">{area.body}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="border-y border-white/10 bg-[#0f1011] py-16 lg:py-24">
          <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <SectionLabel>First 30 days</SectionLabel>
              <h2 className="text-4xl font-black tracking-tight sm:text-5xl">A practical launch, not a theory project.</h2>
              <p className="mt-5 text-lg leading-8 text-gray-300">
                We start with the operating rhythm, then build the first useful system from real examples inside the business.
              </p>
            </div>
            <div className="grid gap-4">
              {firstMonth.map((item, index) => (
                <div key={item} className="flex gap-4 rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-orange-300/30 bg-orange-500/10 text-sm font-black text-orange-200">
                    {index + 1}
                  </div>
                  <p className="pt-1 text-lg leading-8 text-gray-200">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-16 lg:py-24">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card>
              <SectionLabel>How we work</SectionLabel>
              <h3 className="text-2xl font-black">One shared workspace</h3>
              <p className="mt-3 leading-7 text-gray-300">
                Comments, priorities, decisions, requests, and progress live in one place so the work does not get lost in scattered conversations.
              </p>
            </Card>
            <Card>
              <SectionLabel>Jeff’s role</SectionLabel>
              <h3 className="text-2xl font-black">Business judgment + system design</h3>
              <p className="mt-3 leading-7 text-gray-300">
                Jeff helps decide what is worth building, what should wait, and how the system should fit the way the team actually operates.
              </p>
            </Card>
            <Card>
              <SectionLabel>Blaze’s role</SectionLabel>
              <h3 className="text-2xl font-black">Track, summarize, and move work forward</h3>
              <p className="mt-3 leading-7 text-gray-300">
                Blaze watches the board, pulls comments into action, drafts updates, preserves context, and keeps the loop visible.
              </p>
            </Card>
          </div>
        </section>

        <section id="start" className="mx-auto max-w-5xl px-6 pb-24">
          <div className="rounded-[2rem] border border-orange-300/25 bg-gradient-to-br from-orange-500/15 via-white/[0.045] to-indigo-500/10 p-8 text-center shadow-2xl shadow-black/30 sm:p-12">
            <SectionLabel>Next step</SectionLabel>
            <h2 className="text-4xl font-black tracking-tight sm:text-5xl">If this feels useful, we start with one month.</h2>
            <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-gray-300">
              The first month is about getting the rhythm live, choosing the most valuable first system, and proving that Stoke AI can create clarity and capacity inside the business.
            </p>
            <div className="mt-8 rounded-2xl border border-white/10 bg-black/30 p-5 text-left sm:flex sm:items-center sm:justify-between sm:gap-6">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-orange-200">Standard engagement</p>
                <p className="mt-2 text-4xl font-black">$5,000/month</p>
              </div>
              <p className="mt-4 max-w-md text-sm leading-6 text-gray-300 sm:mt-0">
                Month-to-month. One shared operating board. Weekly progress rhythm. Practical systems built around the work that matters most.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
