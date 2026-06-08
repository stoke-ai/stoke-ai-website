import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Jordi Hansen | Landscape Ops Assistant',
  description: 'A private Stoke AI proposal for a practical landscape operations assistant built around quoting, follow-up, scheduling, and callbacks.',
};

const painPoints = [
  {
    label: 'Quote requests',
    line: 'New calls, texts, referrals, website leads, and Facebook messages should not end up as another name on a paper list in the pickup.',
  },
  {
    label: 'Follow-up',
    line: 'Good jobs should not go cold because the quote was sent and nobody had time to check back without sounding pushy.',
  },
  {
    label: 'Schedule pressure',
    line: 'The whiteboard and monthly plan are doing too much work. The next version should show what is quoted, committed, deposit-paid, ready, and waiting.',
  },
  {
    label: 'Small jobs',
    line: 'When the crew finishes early, the fill-in list should be easy to trust: who needs something small, what it is, where it is, and whether it is worth the stop.',
  },
  {
    label: 'Warranty and callbacks',
    line: 'Callbacks should become a visible list with priority, owner, and status — not a text to Ty that everyone hopes gets remembered.',
  },
  {
    label: 'Customer history',
    line: 'The customer record should tell the story: quote, deposit, schedule notes, job notes, callback items, and the next thing Jordi needs to know.',
  },
];

const buildIncludes = [
  {
    title: 'Quote + lead tracker',
    detail: 'A simple source of truth for new requests, quote status, deposit status, ready-to-schedule work, and lost/no-response opportunities.',
  },
  {
    title: 'Non-pushy follow-up rhythm',
    detail: 'Reminder timing and text drafts after quotes go out, so Jordi can win the jobs that only need one more touch.',
  },
  {
    title: 'Schedule-ready job list',
    detail: 'A cleaner view of committed work, waiting items, small fill-in jobs, and what can move when the crew has a gap.',
  },
  {
    title: 'Warranty/callback tracker',
    detail: 'A lightweight board for post-job issues, priority customers, Ty/Jordi ownership, and completion status.',
  },
  {
    title: 'Zoho-centered setup',
    detail: 'Use Zoho as much as practical instead of forcing another disconnected app into the business.',
  },
  {
    title: 'Weekly attention summary',
    detail: 'A plain-English summary of quotes needing attention, jobs waiting on deposits, callbacks, and loose ends.',
  },
];

const phases = [
  {
    step: '01',
    title: 'Confirm the workflow',
    detail: 'Review how quote requests, Zoho, deposit decisions, schedule notes, and callbacks work today so the first version matches Jordi’s real habits.',
  },
  {
    step: '02',
    title: 'Build the first useful version',
    detail: 'Create the lead/quote board, follow-up statuses, callback tracker, and weekly attention summary around the work already happening.',
  },
  {
    step: '03',
    title: 'Test with real jobs',
    detail: 'Use current leads and open jobs to expose what is missing, awkward, or too complicated, then simplify before it becomes another chore.',
  },
  {
    step: '04',
    title: 'Keep it maintained in season',
    detail: 'During active months, Stoke AI keeps the system tuned, fixes small issues, adjusts reminders, and helps keep the board useful.',
  },
];

const investment = [
  {
    label: 'Starter build',
    price: '$3,500',
    detail: 'Set up the first useful version around quote tracking, follow-ups, schedule-ready work, callbacks, and Zoho where practical.',
  },
  {
    label: 'Active-season support',
    price: '$500/month',
    detail: 'Keep the system tuned during the months Jordi is using it: small fixes, reminder changes, workflow tweaks, and support.',
  },
  {
    label: 'Winter slowdown',
    price: 'Pauseable',
    detail: 'If the business slows down and there is not meaningful maintenance to do, support can pause and restart when the season ramps back up.',
  },
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-[0.7rem] font-black uppercase tracking-[0.32em] text-[#77d86d]">{children}</p>;
}

function GreenLine() {
  return <div className="my-8 h-px w-full bg-gradient-to-r from-transparent via-[#77d86d]/70 to-transparent" />;
}

export default function JordiOfferPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#041008] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(119,216,109,0.22),transparent_34%),radial-gradient(circle_at_88%_18%,rgba(255,255,255,0.08),transparent_24%),linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:auto,auto,56px_56px,56px_56px]" />
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(120deg,transparent,rgba(119,216,109,0.08)_38%,transparent_58%)]" />

      <div className="relative z-10">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <Link href="/" aria-label="Stoke AI home" className="text-xs font-black uppercase tracking-[0.28em] text-white/45 transition hover:text-white">
            Private Stoke AI proposal
          </Link>
          <div className="hidden items-center gap-3 sm:flex">
            <a href="#build" className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-bold text-white/75 hover:border-[#77d86d]/45 hover:text-white">The build</a>
            <a href="#decision" className="rounded-full bg-white px-5 py-3 text-sm font-black text-black hover:bg-[#77d86d] hover:text-black">Decision</a>
          </div>
        </nav>

        <header className="mx-auto grid max-w-7xl gap-10 px-5 pb-20 pt-8 sm:px-8 lg:grid-cols-[0.98fr_1.02fr] lg:items-center lg:pb-28 lg:pt-12">
          <div>
            <div className="mb-8 inline-flex rounded-full border border-[#77d86d]/25 bg-[#77d86d]/10 px-4 py-2 text-sm font-black text-[#d7ffd2] shadow-[0_0_60px_rgba(119,216,109,0.12)]">
              Private proposal for Jordi Hansen
            </div>
            <h1 className="text-[3.35rem] font-black leading-[0.84] tracking-[-0.08em] text-white sm:text-7xl lg:text-8xl">
              A lightweight office assistant for the landscaping work already moving.
            </h1>
            <p className="mt-7 max-w-2xl text-xl font-medium leading-9 text-white/68 sm:text-2xl">
              The first move is not a fancy chatbot. It is a simple operating system for quotes, follow-ups, deposits, schedule-ready work, callbacks, and the loose ends that currently live in texts, paper, the whiteboard, and memory.
            </p>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 rounded-[2.5rem] bg-[#77d86d]/20 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2.2rem] border border-white/12 bg-[#0b1b10] shadow-2xl shadow-black">
              <div className="border-b border-white/10 bg-white/[0.04] p-7 sm:p-9">
                <Eyebrow>The practical problem</Eyebrow>
                <p className="mt-4 text-4xl font-black leading-tight tracking-[-0.055em] sm:text-5xl">
                  The business grew faster than the admin system.
                </p>
                <p className="mt-5 text-lg leading-8 text-white/62">
                  That is a good problem — but the paper list, 600+ texts, Zoho quotes, job board, and callback messages need one visible rhythm.
                </p>
              </div>
              <div className="grid gap-3 p-5 sm:p-6">
                {['New request → quote needed', 'Quote sent → follow-up due', 'Deposit paid → ready to schedule', 'Callback → assigned and closed'].map((item) => (
                  <div key={item} className="rounded-2xl border border-white/10 bg-black/28 p-4 text-base font-black text-white/78">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </header>

        <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
            <div className="lg:sticky lg:top-8">
              <Eyebrow>What I heard</Eyebrow>
              <h2 className="mt-5 text-5xl font-black leading-[0.9] tracking-[-0.07em] sm:text-6xl">This is not about working harder.</h2>
              <p className="mt-6 text-lg leading-8 text-white/62">
                Jordi is already running the crew, selling jobs, quoting work, handling customers, and keeping the schedule moving. The opportunity is to make the important items visible before they become stress, missed follow-up, or another note on paper.
              </p>
            </div>

            <div className="grid gap-3">
              {painPoints.map((point, index) => (
                <div key={point.label} className="group grid gap-4 rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-5 transition hover:-translate-y-0.5 hover:border-[#77d86d]/45 hover:bg-[#77d86d]/10 md:grid-cols-[84px_170px_1fr] md:items-center">
                  <p className="text-4xl font-black tracking-[-0.08em] text-white/18 group-hover:text-[#77d86d]">{String(index + 1).padStart(2, '0')}</p>
                  <p className="text-lg font-black text-white">{point.label}</p>
                  <p className="leading-7 text-white/64">{point.line}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="build" className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
          <div className="overflow-hidden rounded-[2.4rem] border border-white/10 bg-[#08170c] shadow-2xl shadow-black">
            <div className="grid border-b border-white/10 lg:grid-cols-[0.88fr_1.12fr]">
              <div className="p-8 sm:p-10 lg:p-12">
                <Eyebrow>The first build</Eyebrow>
                <h2 className="mt-5 text-5xl font-black leading-[0.9] tracking-[-0.07em] sm:text-6xl">Landscape Ops Assistant — starter system.</h2>
                <p className="mt-6 text-lg leading-8 text-white/62">
                  Built to feel like a part-time office assistant without hiring another person: what needs a quote, what needs a follow-up, what is waiting on deposit, what is ready for the crew, and what callback still needs to be closed.
                </p>
              </div>
              <div className="border-t border-white/10 bg-black/28 p-5 sm:p-8 lg:border-l lg:border-t-0">
                <div className="rounded-[1.7rem] border border-[#77d86d]/20 bg-[#77d86d]/8 p-5">
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.25em] text-[#b8ffb0]">Weekly attention view</p>
                      <p className="mt-1 text-2xl font-black">What needs Jordi?</p>
                    </div>
                    <div className="rounded-full border border-[#77d86d]/30 px-3 py-1 text-xs font-black text-[#d7ffd2]">Simple by design</div>
                  </div>
                  <div className="grid gap-3">
                    {['Quotes sent but not answered', 'New requests not quoted yet', 'Deposits needed before scheduling', 'Small jobs that can fill crew gaps', 'Warranty/callback items assigned to Ty or Jordi'].map((item) => (
                      <div key={item} className="rounded-2xl border border-white/10 bg-black/35 p-4 text-base font-bold leading-7 text-white/78">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 p-5 sm:p-7 lg:grid-cols-3">
              {buildIncludes.map((item) => (
                <div key={item.title} className="rounded-[1.6rem] border border-white/10 bg-white/[0.045] p-6">
                  <h3 className="text-2xl font-black leading-tight tracking-[-0.04em]">{item.title}</h3>
                  <p className="mt-4 leading-7 text-white/58">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:py-20">
          <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <Eyebrow>How it rolls out</Eyebrow>
              <h2 className="mt-5 text-5xl font-black leading-[0.9] tracking-[-0.07em] sm:text-6xl">A bounded build, then active-season support.</h2>
            </div>
            <p className="max-w-lg text-lg leading-8 text-white/62">
              The goal is to get the first useful version working without turning Jordi into the tech guy.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-4">
            {phases.map((phase) => (
              <div key={phase.step} className="min-h-[310px] rounded-[1.8rem] border border-white/10 bg-white/[0.045] p-6 transition hover:border-[#77d86d]/45 hover:bg-white/[0.07]">
                <p className="text-sm font-black uppercase tracking-[0.24em] text-[#77d86d]">{phase.step}</p>
                <h3 className="mt-6 text-3xl font-black leading-tight tracking-[-0.045em]">{phase.title}</h3>
                <p className="mt-4 leading-7 text-white/60">{phase.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:py-20">
          <div className="overflow-hidden rounded-[2.4rem] border border-white/10 bg-[#0b1b10] shadow-2xl shadow-black">
            <div className="grid gap-8 border-b border-white/10 p-8 sm:p-10 lg:grid-cols-[0.9fr_1.1fr] lg:p-12">
              <div>
                <Eyebrow>Investment</Eyebrow>
                <h2 className="mt-5 text-5xl font-black leading-[0.9] tracking-[-0.07em] sm:text-6xl">Build it once, then keep it useful while the season is active.</h2>
              </div>
              <p className="text-lg leading-8 text-white/64">
                The setup gets the starter system in place. The monthly support is for the months where Jordi wants Stoke AI maintaining, tuning, and improving it so he does not have to become the tech guy.
              </p>
            </div>
            <div className="grid divide-y divide-white/10 lg:grid-cols-3 lg:divide-x lg:divide-y-0">
              {investment.map((item) => (
                <div key={item.label} className="p-7">
                  <p className="text-sm font-black uppercase tracking-[0.24em] text-[#77d86d]">{item.label}</p>
                  <p className="mt-3 text-4xl font-black tracking-[-0.05em]">{item.price}</p>
                  <p className="mt-3 leading-7 text-white/58">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="decision" className="mx-auto max-w-6xl px-5 pb-24 pt-8 sm:px-8">
          <div className="relative overflow-hidden rounded-[2.6rem] border border-[#77d86d]/35 bg-[#77d86d] p-[1px] shadow-[0_0_90px_rgba(119,216,109,0.2)]">
            <div className="rounded-[2.55rem] bg-[#061009] p-8 sm:p-12">
              <div className="text-center">
                <Eyebrow>Decision</Eyebrow>
                <h2 className="mx-auto mt-5 max-w-4xl text-5xl font-black leading-[0.9] tracking-[-0.07em] sm:text-7xl">If this is the right first pain to solve, start here.</h2>
                <p className="mx-auto mt-7 max-w-3xl text-xl leading-9 text-white/65">
                  The first version stays focused on the admin drag Jordi already described: quote tracking, follow-up reminders, deposit/schedule visibility, callbacks, and weekly attention summaries.
                </p>
                <GreenLine />
                <div className="mx-auto mt-9 max-w-2xl rounded-[1.8rem] border border-white/10 bg-white/[0.055] p-7">
                  <p className="text-sm font-black uppercase tracking-[0.26em] text-[#b8ffb0]">Starter engagement</p>
                  <p className="mt-4 text-5xl font-black tracking-[-0.06em] sm:text-6xl">$3,500 build</p>
                  <p className="mt-3 text-3xl font-black tracking-[-0.05em] text-white/86">+ $500/month active-season support</p>
                  <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-white/55">
                    Secure checkout starts the starter build today. Active-season support begins 30 days after checkout, and winter support can pause when there is no meaningful maintenance needed.
                  </p>
                  <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <a href="https://buy.stripe.com/4gMaEPcpz4Qs3lxd4V4ko03" className="inline-flex items-center justify-center rounded-full bg-[#77d86d] px-7 py-4 text-base font-black text-black transition hover:bg-white">
                      Start the build
                    </a>
                    <a href="https://calendar.app.google/YeqJLsyJHv1SQeXQ6" className="inline-flex items-center justify-center rounded-full bg-white px-7 py-4 text-base font-black text-black transition hover:bg-[#77d86d]">
                      Talk with Jeff first
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
