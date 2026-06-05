import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Goff Welding | Growth Systems Brief',
  description: 'A private Goff Welding growth systems brief prepared from the initial conversation.',
};

const pressurePoints = [
  {
    label: 'Training',
    line: 'The company knows how to do the work. The challenge is getting that knowledge out of heads and into a system new people actually follow.',
  },
  {
    label: 'Hiring',
    line: 'Walk-ins, Facebook, website leads, Indeed, and EIS/ATS should not feel like five separate doors into the same shop.',
  },
  {
    label: 'Quotes',
    line: 'Open opportunities and lukewarm follow-ups need a rhythm before good jobs quietly go cold.',
  },
  {
    label: 'Procurement',
    line: 'BOMs, sanitary fittings, consumables, and SAP handoffs are exactly where structured assistance can remove drag without replacing judgment.',
  },
  {
    label: 'Office load',
    line: 'AR, AP, collections, invoice checks, received/match, and time-entry problems should become exception queues — not invisible stress.',
  },
  {
    label: 'Scheduling',
    line: 'The Google Sheet already contains business logic. The next step is visibility: who, where, capacity, qualifications, and what Austin should review.',
  },
];

const ninetyDays = [
  {
    day: 'First week',
    title: 'Set up the workspace, then meet in person',
    detail: 'After payment, Stoke AI begins setting up the private workspace and first operating board. The kickoff is about a 90-minute in-person working session with Austin and Goff’s leadership team to confirm the first priority and decide what moves first.',
  },
  {
    day: 'Days 8–30',
    title: 'Build, test, and tune the first system',
    detail: 'Build the first useful version, get Goff feedback from real work, and tune it until the team can actually use it.',
  },
  {
    day: 'Days 31–60',
    title: 'Deepen it or move to the next priority',
    detail: 'If the first system needs more depth, improve it. If it is useful enough, move to the next highest-value constraint.',
  },
  {
    day: 'Days 61–90',
    title: 'Keep the operating rhythm moving',
    detail: 'Continue the build → feedback → fine-tune cycle, then use the 90-day review to decide the next phase.',
  },
];

const operatingLoop = [
  {
    title: 'Choose one priority system',
    detail: 'Jeff, Austin, and Goff’s leadership team choose the highest-value operating constraint instead of trying to work every idea at once.',
  },
  {
    title: 'Build the first useful version',
    detail: 'Stoke AI turns the real examples, notes, screenshots, and decisions into a working system the team can actually react to.',
  },
  {
    title: 'Get Goff feedback from real work',
    detail: 'Goff uses it, points out what is wrong, missing, awkward, or unclear, and the system gets tuned around how the business really operates.',
  },
  {
    title: 'Decide the next move',
    detail: 'Once the loop is useful, decide whether to keep improving it or shift to the next priority system.',
  },
];

const ownerQuestions = [
  'Who is waiting on training, and why?',
  'Which open quotes need attention this week?',
  'Where is procurement losing time or context?',
  'Which admin problems are real exceptions vs. repeated patterns?',
  'What changed in the business that makes last month’s plan stale?',
];

const assistantMemory = [
  'Training paths, SOPs, homework, tests, and hands-on signoffs',
  'Quote follow-up patterns, open opportunities, and customer next steps',
  'Procurement examples, BOM details, consumables, and SAP handoff context',
  'Recurring office exceptions across AR, AP, invoices, collections, and time entries',
  'Austin and the leadership team’s quarterly priorities as the business changes',
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-[0.7rem] font-black uppercase tracking-[0.32em] text-[#ff8a2a]">{children}</p>;
}

function WeldLine() {
  return <div className="h-px w-full bg-gradient-to-r from-transparent via-[#ff8a2a]/70 to-transparent" />;
}

export default function GoffsOfferPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(255,122,24,0.24),transparent_34%),radial-gradient(circle_at_85%_18%,rgba(255,255,255,0.08),transparent_24%),linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:auto,auto,56px_56px,56px_56px]" />
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(120deg,transparent,rgba(255,138,42,0.08)_38%,transparent_58%)]" />

      <div className="relative z-10">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <Link href="/" aria-label="Stoke AI home" className="text-xs font-black uppercase tracking-[0.28em] text-white/45 transition hover:text-white">
            Goff Welding growth systems brief
          </Link>
          <div className="hidden items-center gap-3 sm:flex">
            <a href="#cockpit" className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-bold text-white/75 hover:border-[#ff8a2a]/45 hover:text-white">The cockpit</a>
            <a href="#decision" className="rounded-full bg-white px-5 py-3 text-sm font-black text-black hover:bg-[#ff8a2a] hover:text-white">Decision</a>
          </div>
        </nav>

        <header className="mx-auto grid max-w-7xl gap-10 px-5 pb-20 pt-8 sm:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:pb-28 lg:pt-12">
          <div>
            <div className="mb-8 inline-flex rounded-full border border-[#ff8a2a]/25 bg-[#ff8a2a]/10 px-4 py-2 text-sm font-black text-[#ffd1aa] shadow-[0_0_60px_rgba(255,138,42,0.12)]">
              Private growth systems brief for Austin + leadership team
            </div>
            <h1 className="text-[3.6rem] font-black leading-[0.82] tracking-[-0.08em] text-white sm:text-7xl lg:text-8xl">
              Goff Welding has outgrown memory.
            </h1>
            <p className="mt-7 max-w-2xl text-xl font-medium leading-9 text-white/68 sm:text-2xl">
              That is not a weakness. It is what happens when a real company grows. The next stage is turning the way Goff already works into systems your team can see, trust, and improve.
            </p>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 rounded-[2.5rem] bg-[#ff8a2a]/20 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2.2rem] border border-white/12 bg-[#101010] shadow-2xl shadow-black">
              <div className="bg-white p-8 sm:p-10">
                <Image src="/goff-welding-logo.png" alt="Goff Welding" width={520} height={380} priority className="mx-auto h-auto w-full max-w-md object-contain" />
              </div>
              <div className="border-t border-white/10 bg-[#0b0b0b] p-6 sm:p-8">
                <Eyebrow>The point</Eyebrow>
                <p className="mt-4 text-3xl font-black leading-tight tracking-[-0.045em] sm:text-4xl">
                  This should feel like someone walked through the shop, listened, and came back with the first version of the operating system.
                </p>
              </div>
            </div>
          </div>
        </header>

        <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
            <div className="lg:sticky lg:top-8">
              <Eyebrow>What is actually happening</Eyebrow>
              <h2 className="mt-5 text-5xl font-black leading-[0.9] tracking-[-0.07em] sm:text-6xl">The bottleneck is not effort. It is visibility.</h2>
              <p className="mt-6 text-lg leading-8 text-white/62">
                Goff already has capable people, existing tools, and working habits. The opportunity is to make the important work easier to find, easier to assign, easier to follow up, and easier to improve.
              </p>
            </div>

            <div className="grid gap-3">
              {pressurePoints.map((point, index) => (
                <div key={point.label} className="group grid gap-4 rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-5 transition hover:-translate-y-0.5 hover:border-[#ff8a2a]/45 hover:bg-[#ff8a2a]/10 md:grid-cols-[84px_160px_1fr] md:items-center">
                  <p className="text-4xl font-black tracking-[-0.08em] text-white/18 group-hover:text-[#ff8a2a]">{String(index + 1).padStart(2, '0')}</p>
                  <p className="text-lg font-black text-white">{point.label}</p>
                  <p className="leading-7 text-white/64">{point.line}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="cockpit" className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
          <div className="overflow-hidden rounded-[2.4rem] border border-white/10 bg-[#0d0d0d] shadow-2xl shadow-black">
            <div className="grid border-b border-white/10 lg:grid-cols-[0.88fr_1.12fr]">
              <div className="p-8 sm:p-10 lg:p-12">
                <Eyebrow>The cockpit Austin should have</Eyebrow>
                <h2 className="mt-5 text-5xl font-black leading-[0.9] tracking-[-0.07em] sm:text-6xl">A command view for the questions that actually matter.</h2>
                <p className="mt-6 text-lg leading-8 text-white/62">
                  Not another dashboard full of fake numbers. A practical owner view: what changed, what needs attention, what is stuck, and what the team needs next.
                </p>
              </div>
              <div className="border-t border-white/10 bg-black/35 p-5 lg:border-l lg:border-t-0 sm:p-8">
                <div className="rounded-[1.7rem] border border-[#ff8a2a]/20 bg-[#ff8a2a]/8 p-5">
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.25em] text-[#ffb06a]">Goff operating cockpit</p>
                      <p className="mt-1 text-2xl font-black">This week</p>
                    </div>
                    <div className="rounded-full border border-[#ff8a2a]/30 px-3 py-1 text-xs font-black text-[#ffd1aa]">Live priorities</div>
                  </div>
                  <div className="grid gap-3">
                    {ownerQuestions.map((question) => (
                      <div key={question} className="rounded-2xl border border-white/10 bg-black/35 p-4 text-base font-bold leading-7 text-white/78">
                        {question}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="grid divide-y divide-white/10 lg:grid-cols-3 lg:divide-x lg:divide-y-0">
              <div className="p-7">
                <p className="text-sm font-black uppercase tracking-[0.24em] text-[#ff8a2a]">Jeff</p>
                <p className="mt-3 text-2xl font-black tracking-[-0.03em]">Business judgment</p>
                <p className="mt-3 leading-7 text-white/58">Keep the work tied to what is worth doing, push back on scattered ideas, and help Austin and the leadership team choose the next constraint.</p>
              </div>
              <div className="p-7">
                <p className="text-sm font-black uppercase tracking-[0.24em] text-[#ff8a2a]">Stoke AI</p>
                <p className="mt-3 text-2xl font-black tracking-[-0.03em]">Operating assistant</p>
                <p className="mt-3 leading-7 text-white/58">Capture comments, preserve context, draft updates, watch for stuck items, and turn loose notes into visible movement.</p>
              </div>
              <div className="p-7">
                <p className="text-sm font-black uppercase tracking-[0.24em] text-[#ff8a2a]">Goff</p>
                <p className="mt-3 text-2xl font-black tracking-[-0.03em]">Real examples</p>
                <p className="mt-3 leading-7 text-white/58">Supply the SOPs, screenshots, quote examples, procurement details, and field realities that make the system useful.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:py-20">
          <div className="relative overflow-hidden rounded-[2.4rem] border border-[#ff8a2a]/25 bg-[#ff8a2a]/10 p-8 shadow-[0_0_90px_rgba(255,138,42,0.12)] sm:p-10 lg:p-12">
            <div className="absolute right-0 top-0 h-64 w-64 translate-x-1/4 -translate-y-1/4 rounded-full bg-[#ff8a2a]/25 blur-3xl" />
            <div className="relative grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
              <div>
                <Eyebrow>Where this can go</Eyebrow>
                <h2 className="mt-5 text-5xl font-black leading-[0.9] tracking-[-0.07em] sm:text-6xl">Eventually, Goff can have its own operating assistant.</h2>
                <p className="mt-6 text-lg leading-8 text-white/68">
                  Not a generic chatbot. A Goff-specific assistant that remembers how the business works, what Austin and the leadership team care about, and what changed since the last reset.
                </p>
              </div>
              <div className="rounded-[1.9rem] border border-white/10 bg-black/45 p-6">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.25em] text-[#ffb06a]">Goff operating assistant</p>
                    <p className="mt-1 text-2xl font-black">Built from Goff’s real work</p>
                  </div>
                  <div className="hidden rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-black text-white/60 sm:block">Future state</div>
                </div>
                <div className="grid gap-3">
                  {assistantMemory.map((item) => (
                    <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.045] p-4 text-base font-bold leading-7 text-white/76">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:py-20">
          <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <Eyebrow>The first 90 days</Eyebrow>
              <h2 className="mt-5 text-5xl font-black leading-[0.9] tracking-[-0.07em] sm:text-6xl">Earn trust by building the first useful loop.</h2>
            </div>
            <p className="max-w-lg text-lg leading-8 text-white/62">
              The first target is not “AI transformation.” It is one visible system that Goff people can use and Austin can inspect.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-4">
            {ninetyDays.map((phase) => (
              <div key={phase.day} className="min-h-[310px] rounded-[1.8rem] border border-white/10 bg-white/[0.045] p-6 transition hover:border-[#ff8a2a]/45 hover:bg-white/[0.07]">
                <p className="text-sm font-black uppercase tracking-[0.24em] text-[#ff8a2a]">{phase.day}</p>
                <h3 className="mt-6 text-3xl font-black leading-tight tracking-[-0.045em]">{phase.title}</h3>
                <p className="mt-4 leading-7 text-white/60">{phase.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:py-20">
          <div className="overflow-hidden rounded-[2.4rem] border border-white/10 bg-[#101010] shadow-2xl shadow-black">
            <div className="grid gap-8 border-b border-white/10 p-8 sm:p-10 lg:grid-cols-[0.9fr_1.1fr] lg:p-12">
              <div>
                <Eyebrow>How the monthly partnership works</Eyebrow>
                <h2 className="mt-5 text-5xl font-black leading-[0.9] tracking-[-0.07em] sm:text-6xl">One priority system at a time.</h2>
              </div>
              <div className="space-y-5 text-lg leading-8 text-white/64">
                <p>
                  This is not a full-time employee or an hourly support desk. The goal is not to fill every gap in the business with more labor.
                </p>
                <p>
                  The goal is to use Jeff’s judgment, Stoke AI’s operating workspace, and Goff’s real examples to move the highest-value system forward each month: build, get feedback, fine-tune, then decide what should move next.
                </p>
              </div>
            </div>
            <div className="grid divide-y divide-white/10 lg:grid-cols-4 lg:divide-x lg:divide-y-0">
              {operatingLoop.map((item, index) => (
                <div key={item.title} className="p-6 sm:p-7">
                  <p className="text-4xl font-black tracking-[-0.08em] text-[#ff8a2a]">{String(index + 1).padStart(2, '0')}</p>
                  <h3 className="mt-5 text-2xl font-black leading-tight tracking-[-0.04em]">{item.title}</h3>
                  <p className="mt-4 leading-7 text-white/58">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="rounded-[2.2rem] border border-white/10 bg-[#111] p-8 sm:p-10">
              <Eyebrow>Why the quarterly reset matters</Eyebrow>
              <h2 className="mt-5 text-5xl font-black leading-[0.9] tracking-[-0.07em] sm:text-6xl">Six months from now, the right answer may be different.</h2>
              <p className="mt-6 text-lg leading-8 text-white/62">
                Austin already said the important thing: if the business changes, the plan has to change. After the first 90 days, Jeff meets with Austin and the leadership team again in person to review what improved, what the team is actually using, what still feels clunky, and whether the engagement should continue into the next phase.
              </p>
            </div>
            <div className="space-y-4">
              {['Rules do not exist brain dump', 'Re-rank the constraints', 'Stop stale work', 'Publish the next-quarter build plan'].map((item, index) => (
                <div key={item} className="flex items-center gap-4 rounded-[1.4rem] border border-white/10 bg-black/35 p-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#ff8a2a] text-sm font-black text-black">{index + 1}</div>
                  <p className="text-xl font-black tracking-[-0.03em]">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="decision" className="mx-auto max-w-6xl px-5 pb-24 pt-8 sm:px-8">
          <div className="relative overflow-hidden rounded-[2.6rem] border border-[#ff8a2a]/35 bg-[#ff8a2a] p-[1px] shadow-[0_0_90px_rgba(255,138,42,0.2)]">
            <div className="rounded-[2.55rem] bg-[#080808] p-8 sm:p-12">
              <div className="mb-8 flex justify-center">
                <div className="rounded-[1.4rem] bg-white px-8 py-5 shadow-2xl shadow-black/50">
                  <Image src="/goff-welding-logo.png" alt="Goff Welding" width={300} height={220} priority className="h-auto w-52 object-contain" />
                </div>
              </div>
              <div className="text-center">
                <Eyebrow>Decision</Eyebrow>
                <h2 className="mx-auto mt-5 max-w-4xl text-5xl font-black leading-[0.9] tracking-[-0.07em] sm:text-7xl">If this feels like Goff, start with one month.</h2>
                <p className="mx-auto mt-7 max-w-3xl text-xl leading-9 text-white/65">
                  Month-to-month. Work starts when payment is complete: private workspace setup, first operating board preparation, weekly progress rhythm, about a 90-minute in-person kickoff, and an in-person 90-day review. The partnership focuses on one priority system at a time — not hourly staff augmentation or a full-time employee.
                </p>
                <WeldLine />
                <div className="mx-auto mt-9 max-w-2xl rounded-[1.8rem] border border-white/10 bg-white/[0.055] p-7">
                  <p className="text-sm font-black uppercase tracking-[0.26em] text-[#ffb06a]">Standard engagement</p>
                  <p className="mt-4 text-5xl font-black tracking-[-0.06em] sm:text-6xl">$5,000/month</p>
                  <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-white/55">
                    Secure Stripe checkout starts the monthly service. Stoke AI begins preparing the private workspace and first operating board before the in-person kickoff. Monthly work focuses on one priority operating system at a time.
                  </p>
                  <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <a href="https://buy.stripe.com/9B6cMXgFP5Uw2ht2qh4ko01" className="inline-flex items-center justify-center rounded-full bg-[#ff8a2a] px-7 py-4 text-base font-black text-white transition hover:bg-white hover:text-black">
                      Start monthly service
                    </a>
                    <a href="https://calendar.app.google/YeqJLsyJHv1SQeXQ6" className="inline-flex items-center justify-center rounded-full bg-white px-7 py-4 text-base font-black text-black transition hover:bg-[#ff8a2a] hover:text-white">
                      Ask a question first
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
