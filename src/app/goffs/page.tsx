import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Goff Welding | Stoke AI Operating Partnership',
  description:
    'A private Stoke AI offer page for Goff Welding: ongoing AI and business systems implementation.',
};

const focusAreas = [
  {
    title: 'Training hub + “Goff Bible”',
    body: 'Austin called training the most important need right now. Goff Welding went from roughly 30 employees to 50+ quickly, and new people need one source of truth for who Goff is, how onboarding works, SOPs, foreman training, procurement training, tests, hands-on verification, and reminders when homework is not getting done.',
  },
  {
    title: 'Hiring and applicant flow',
    body: 'Welding has constant churn, traveling workers, walk-ins, Facebook leads, website leads, Indeed, and the EIS/ATS process. The goal is to centralize intake, screen consistently, track experience levels, and reduce the quarter-day manual drag that used to come with applicants.',
  },
  {
    title: 'CRM follow-up and quote pipeline',
    body: 'CRMs are managing customers, quotes, projects, and follow-up. The obvious win is helping them chase lukewarm opportunities, log next steps after calls, surface open quotes, and keep attention on the hot jobs most likely to close.',
  },
  {
    title: 'Procurement + BOM assistant',
    body: 'Kevin has already been testing AI around BOMs and procurement. A Goff assistant can help with sanitary fittings, welding consumables, materials, structured quote-to-procurement handoffs, and double-checking the details before they hit SAP Business One.',
  },
  {
    title: 'Office admin, AR/AP, and time-entry checks',
    body: 'The office workload is heavy: collections calls, late invoice follow-up, AP invoice reading, received/match checks, time-entry troubleshooting, and routing questions back to the CRM who knows the job. AI can handle alerts, drafts, checks, and exception queues.',
  },
  {
    title: 'Scheduling and job visibility',
    body: 'Right now scheduling lives heavily in a Google Sheet with a lot of logic around qualifications, capacity, jobs, and timing. A future system could help optimize who goes where, flag constraints, summarize daily reports, and show Austin what was completed or suspicious enough to review.',
  },
];

const included = [
  'Private Stoke AI workspace and live project board for Goff priorities',
  'Monthly roadmap focused on the highest-value bottlenecks Austin, Kevin, and Jeff identify together',
  'AI-assisted workflow design, buildout, and iteration around training, hiring, CRM follow-up, procurement, AR/AP, scheduling, and admin exceptions',
  'Weekly written progress updates: done, blocked, waiting, next',
  'Request and comment loop so Austin/Kevin can drop ideas, examples, documents, and priorities without losing them in texts or memory',
  'Quarterly one-day Business Systems Review to reset priorities and choose the next highest-value work',
  'Priority access to Jeff as the business systems partner — without turning Jeff into another day-to-day bottleneck',
];

const quarterlyReview = [
  'Do the “rules do not exist” brain dump Austin described: if Goff Welding were built from scratch today, how should the work flow?',
  'Re-rank the live backlog: training, hiring, CRM follow-up, procurement, AR/AP, scheduling, admin exceptions, SAP/Samsara/API opportunities, and custom software ideas',
  'Decide what to stop, continue, or build next for the coming quarter based on where the business actually changed',
  'Update the roadmap so the engagement stays tied to business priorities, not random AI ideas or stale projects',
];

const firstMonth = [
  'Turn the transcript and meeting notes into a ranked Goff AI roadmap Austin, Kevin, and Jeff can react to',
  'Set up the shared workspace so comments, tasks, decisions, documents, and examples have one home',
  'Start with the training / Goff Bible system unless Austin and Kevin choose a different top priority',
  'Define the first practical build: reminders, completion tracking, tests, hands-on verification, and a simple dashboard of who is done, stuck, or overdue',
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
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-200/80">Goff Welding workspace</p>
          <p className="text-lg font-black text-white">Austin + Kevin priorities</p>
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
          <p className="text-2xl font-black leading-tight text-white">Training hub + Goff Bible</p>
          <p className="mt-2 text-sm leading-relaxed text-gray-300">
            One place for onboarding, SOPs, tests, reminders, hands-on verification, and completion visibility.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
            <p className="mb-3 text-sm font-bold text-gray-200">Backlog from the meeting</p>
            {['Hiring / ATS flow', 'CRM follow-up and quotes', 'Procurement + BOM assistant', 'AR/AP and time-entry checks'].map((item) => (
              <div key={item} className="mb-2 flex items-center gap-2 text-sm text-gray-300 last:mb-0">
                <span className="h-2 w-2 rounded-full bg-orange-300" />
                {item}
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
            <p className="mb-3 text-sm font-bold text-gray-200">Needs Goff Welding</p>
            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3 text-sm text-gray-300">Approve top priority: training unless the team re-ranks it</div>
            <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.04] p-3 text-sm text-gray-300">Share real SOPs, training materials, procurement examples, and quote follow-up examples</div>
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
          <div className="mb-3 flex items-center justify-between text-sm">
            <span className="font-bold text-gray-200">Quarterly reset</span>
            <span className="font-black text-orange-200">Review → Re-rank → Roadmap</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-orange-500 to-amber-300" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GoffsOfferPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#08090a] text-white">
      <div className="fixed inset-0 pointer-events-none opacity-80">
        <div className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-orange-500/20 blur-[130px]" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-indigo-500/15 blur-[140px]" />
      </div>

      <div className="relative z-10">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <div className="flex items-center gap-4">
            <Link href="/" aria-label="Stoke AI home" className="block w-32 sm:w-40">
              <Image src="/logo.png" alt="Stoke AI" width={500} height={170} priority className="h-auto w-full" />
            </Link>
            <div className="h-10 w-px bg-white/10" />
            <a href="https://goffwelding.com/" aria-label="Goff Welding website" className="flex h-14 w-20 items-center justify-center rounded-2xl border border-white/10 bg-white px-3 shadow-lg shadow-black/20" target="_blank" rel="noreferrer">
              <Image src="/goff-welding-logo.png" alt="Goff Welding" width={260} height={190} className="max-h-12 w-auto object-contain" />
            </a>
          </div>
          <div className="hidden items-center gap-3 sm:flex">
            <a href="https://goffwelding.com/" target="_blank" rel="noreferrer" className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-gray-200 transition hover:border-orange-300/40 hover:text-white">
              goffwelding.com
            </a>
            <a
              href="#offer"
              className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-gray-200 transition hover:border-orange-300/40 hover:text-white"
            >
              View the offer
            </a>
          </div>
        </nav>

        <header className="mx-auto grid max-w-7xl items-center gap-10 px-6 pb-16 pt-8 lg:grid-cols-[1.02fr_0.98fr] lg:pb-24 lg:pt-16">
          <div>
            <div className="mb-6 inline-flex rounded-full border border-orange-400/25 bg-orange-500/10 px-4 py-2 text-sm font-semibold text-orange-200">
              Private offer for Goff Welding • goffwelding.com
            </div>
            <h1 className="max-w-5xl text-[2.75rem] font-black leading-[0.94] tracking-[-0.06em] text-[#f7f8f8] sm:text-6xl lg:text-7xl">
              A working AI and systems partner for Goff Welding’s next stage of growth.
            </h1>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-gray-300 sm:text-xl">
              Goff Welding has grown fast, built a strong leadership group, and now has real operational complexity across training, hiring, quoting, procurement, scheduling, AR/AP, and customer follow-up. Stoke AI gives Austin, Kevin, and the team an outside systems partner to turn those bottlenecks into a visible roadmap and practical builds.
            </p>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
              <a
                href="#start"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-amber-400 px-7 py-4 text-base font-black text-black shadow-2xl shadow-orange-500/20 transition hover:scale-[1.02]"
              >
                Review the plan
              </a>
              <p className="max-w-sm text-sm leading-6 text-gray-400">
                Month-to-month. One shared board. Weekly progress rhythm. Quarterly priority reset.
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
                  A monthly implementation relationship for a growing welding and fabrication business that does not need random AI experiments. It needs a ranked operating roadmap, practical systems, and a recurring cadence to decide what matters most next.
                </p>
                <div className="mt-8 rounded-2xl border border-orange-300/25 bg-orange-500/10 p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-orange-200">How it works</p>
                  <p className="mt-2 text-2xl font-black text-white">Month-to-month operating partnership</p>
                  <p className="mt-3 text-sm leading-6 text-gray-300">One shared board, weekly progress rhythm, and a quarterly review/reset after every three paid months.</p>
                </div>
              </Card>

              <Card>
                <SectionLabel>What Goff Welding gets</SectionLabel>
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
            <SectionLabel>Meeting-specific priorities</SectionLabel>
            <h2 className="text-4xl font-black tracking-tight sm:text-5xl">This is the real backlog from the conversation.</h2>
            <p className="mt-5 text-lg leading-8 text-gray-300">
              Austin said training is the most important priority right now, but the meeting surfaced a broader set of systems that can be ranked and built over time.
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
              <h2 className="text-4xl font-black tracking-tight sm:text-5xl">Start where Austin already pointed.</h2>
              <p className="mt-5 text-lg leading-8 text-gray-300">
                Training is the clearest first system: Goff has a lot of new people, SOPs exist in pieces, and the team needs a culture of going back to the Goff Bible instead of always asking Cecilia, Austin, Jesse, or Billy.
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
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <Card className="bg-gradient-to-br from-orange-500/[0.10] via-white/[0.045] to-indigo-500/[0.08]">
              <SectionLabel>Every quarter</SectionLabel>
              <h2 className="text-4xl font-black tracking-tight sm:text-5xl">One day to reset priorities.</h2>
              <p className="mt-5 text-lg leading-8 text-gray-300">
                Austin named the exact reason this matters: six months from now, a project that looked important may not matter anymore because the business changed. The quarterly review keeps Stoke AI outside the day-to-day fires and focused on the highest-leverage work.
              </p>
              <div className="mt-7 rounded-2xl border border-orange-300/25 bg-black/30 p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-orange-200">Included in the standard engagement</p>
                <p className="mt-3 text-2xl font-black text-white">Quarterly one-day reset + next-quarter roadmap</p>
              </div>
            </Card>
            <div className="grid gap-4">
              {quarterlyReview.map((item, index) => (
                <div key={item} className="flex gap-4 rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-orange-300/30 bg-orange-500/10 text-sm font-black text-orange-200">
                    Q{index + 1}
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
                Austin and Kevin can drop priorities, examples, documents, screenshots, ideas, and “this is driving me crazy” notes into one board. Blaze keeps the loop visible so comments become work instead of disappearing.
              </p>
            </Card>
            <Card>
              <SectionLabel>Jeff’s role</SectionLabel>
              <h3 className="text-2xl font-black">Outside business judgment + system design</h3>
              <p className="mt-3 leading-7 text-gray-300">
                Jeff stays outside the daily fires, helps decide what is worth building, pushes back when the list gets too scattered, and keeps the work tied to Austin’s actual operating priorities.
              </p>
            </Card>
            <Card>
              <SectionLabel>Blaze’s role</SectionLabel>
              <h3 className="text-2xl font-black">Track, summarize, and move work forward</h3>
              <p className="mt-3 leading-7 text-gray-300">
                Blaze watches the board, pulls comments into action, drafts updates, preserves context, summarizes decisions, and keeps the Goff roadmap current between meetings.
              </p>
            </Card>
          </div>
        </section>

        <section id="start" className="mx-auto max-w-5xl px-6 pb-24">
          <div className="rounded-[2rem] border border-orange-300/25 bg-gradient-to-br from-orange-500/15 via-white/[0.045] to-indigo-500/10 p-8 text-center shadow-2xl shadow-black/30 sm:p-12">
            <SectionLabel>Next step</SectionLabel>
            <h2 className="text-4xl font-black tracking-tight sm:text-5xl">If this fits Goff Welding, we start with one month.</h2>
            <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-gray-300">
              The first month is about getting the rhythm live, confirming the ranked priorities with Austin and Kevin, and starting the training / Goff Bible system unless the team intentionally chooses something else first.
            </p>
            <div className="mt-8 rounded-2xl border border-white/10 bg-black/30 p-5 text-left sm:flex sm:items-center sm:justify-between sm:gap-6">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-orange-200">Standard engagement</p>
                <p className="mt-2 text-4xl font-black">$5,000/month</p>
              </div>
              <p className="mt-4 max-w-md text-sm leading-6 text-gray-300 sm:mt-0">
                Month-to-month. One shared operating board. Weekly progress rhythm. Quarterly priority reset. Practical systems built around the work that matters most.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
