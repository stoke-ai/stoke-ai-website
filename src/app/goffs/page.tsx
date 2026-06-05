import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Goff Welding | Private Operating Brief',
  description: 'A private Stoke AI operating brief for Austin, Kevin, and the Goff Welding team.',
};

const signalCards = [
  {
    label: 'What I heard',
    title: 'Training is the first real system gap.',
    body: 'Goff has grown fast. The knowledge exists, but too much of it still lives in people, partial SOPs, repeated questions, and “ask Cecilia / Austin / Jesse / Billy.”',
  },
  {
    label: 'What that means',
    title: 'The business needs a living Goff Bible, not another document folder.',
    body: 'Onboarding, foreman training, procurement training, quizzes, reminders, hands-on signoffs, and visibility into who is stuck or overdue.',
  },
  {
    label: 'Where this goes',
    title: 'The same rhythm becomes the model for hiring, CRM, procurement, AR/AP, and scheduling.',
    body: 'Start with the clearest bottleneck, prove the cadence, then keep ranking the next highest-value system instead of chasing random AI ideas.',
  },
];

const operatingMap = [
  {
    number: '01',
    eyebrow: 'Training / Goff Bible',
    title: 'Turn tribal knowledge into a system people actually use.',
    body: 'One source of truth for onboarding, SOPs, tests, homework reminders, hands-on verification, and completion visibility.',
    status: 'Recommended first build',
  },
  {
    number: '02',
    eyebrow: 'Hiring / applicant flow',
    title: 'Centralize walk-ins, Facebook, website leads, Indeed, and EIS/ATS.',
    body: 'Screen consistently, track experience, reduce manual drag, and make the applicant flow visible instead of scattered.',
    status: 'Backlog candidate',
  },
  {
    number: '03',
    eyebrow: 'CRM / quote follow-up',
    title: 'Keep hot opportunities from cooling off quietly.',
    body: 'Surface open quotes, log call next steps, draft follow-ups, and keep CRMs pointed at the jobs most likely to close.',
    status: 'Backlog candidate',
  },
  {
    number: '04',
    eyebrow: 'Procurement / BOM',
    title: 'Give Kevin a structured assistant for materials and quote handoff.',
    body: 'Support sanitary fittings, welding consumables, BOM checks, procurement notes, and SAP Business One handoff details.',
    status: 'Backlog candidate',
  },
  {
    number: '05',
    eyebrow: 'Office admin / AR / AP',
    title: 'Create exception queues instead of more invisible office load.',
    body: 'Collections follow-up, AP invoice reading, received/match checks, time-entry issues, and routing questions back to the CRM who owns the job.',
    status: 'Backlog candidate',
  },
  {
    number: '06',
    eyebrow: 'Scheduling / visibility',
    title: 'Move from spreadsheet logic toward operational visibility.',
    body: 'Qualifications, crew capacity, job timing, daily reports, suspicious items, and what Austin needs to review.',
    status: 'Future system',
  },
];

const firstThirty = [
  'Turn the meeting transcript into a ranked Goff operating roadmap Austin and Kevin can mark up.',
  'Launch the shared Goff workspace: priorities, comments, decisions, examples, documents, and progress in one place.',
  'Design the first Training / Goff Bible workflow around real materials Goff already has.',
  'Build the first visible loop: assigned training, reminders, tests, hands-on signoff, and a dashboard of done / stuck / overdue.',
];

const boardLoop = [
  'Austin or Kevin drops a note, file, screenshot, bottleneck, or “this is driving me crazy” item.',
  'Blaze captures it, keeps it visible, and turns it into either a decision, task, question, or backlog item.',
  'Jeff reviews the important judgment calls and keeps the work from drifting into low-value automation theater.',
  'The board shows what is done, what is next, what needs Goff, and what changed since last review.',
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[0.72rem] font-black uppercase tracking-[0.28em] text-[#b8793a]">{children}</p>;
}

function ShellCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-[1.75rem] border border-[#171717]/10 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.08)] ${className}`}>{children}</div>;
}

function OwnerMemo() {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-[#1f2937]/10 bg-[#111315] p-5 text-white shadow-2xl shadow-black/25">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(255,122,26,0.26),transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.08),transparent_35%)]" />
      <div className="relative rounded-[1.4rem] border border-white/10 bg-black/25 p-5 backdrop-blur">
        <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-orange-200">Private operating brief</p>
            <p className="mt-1 text-2xl font-black tracking-tight">Austin + Kevin</p>
          </div>
          <div className="rounded-full border border-orange-300/30 bg-orange-400/10 px-3 py-1 text-xs font-black text-orange-100">Not a pitch deck</div>
        </div>
        <div className="mt-5 grid gap-3">
          {['Training hub', 'Hiring flow', 'CRM follow-up', 'Procurement / BOM', 'AR/AP exceptions', 'Scheduling visibility'].map((item, index) => (
            <div key={item} className="group flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.045] p-4 transition hover:border-orange-300/35 hover:bg-orange-400/10">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs font-black text-orange-100">{index + 1}</span>
                <span className="font-bold text-gray-100">{item}</span>
              </div>
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-gray-500 group-hover:text-orange-200">Rank</span>
            </div>
          ))}
        </div>
        <div className="mt-5 rounded-2xl border border-orange-300/25 bg-orange-400/10 p-4">
          <p className="text-sm font-black text-orange-100">Default recommendation</p>
          <p className="mt-1 text-xl font-black tracking-tight">Start with the Goff Bible, then let the board decide what earns attention next.</p>
        </div>
      </div>
    </div>
  );
}

export default function GoffsOfferPage() {
  return (
    <main className="min-h-screen bg-[#f5f0e8] text-[#181512]">
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(24,21,18,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(24,21,18,0.045)_1px,transparent_1px)] bg-[size:42px_42px]" />
      <div className="relative z-10">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <div className="flex items-center gap-4">
            <Link href="/" aria-label="Stoke AI home" className="block w-28 sm:w-36">
              <Image src="/logo.png" alt="Stoke AI" width={500} height={170} priority className="h-auto w-full brightness-0" />
            </Link>
            <div className="h-10 w-px bg-black/10" />
            <a href="https://goffwelding.com/" target="_blank" rel="noreferrer" aria-label="Goff Welding website" className="flex h-14 w-20 items-center justify-center rounded-2xl border border-black/10 bg-white px-3 shadow-sm">
              <Image src="/goff-welding-logo.png" alt="Goff Welding" width={260} height={190} className="max-h-12 w-auto object-contain" />
            </a>
          </div>
          <div className="hidden items-center gap-3 sm:flex">
            <a href="#map" className="rounded-full border border-black/10 bg-white/70 px-5 py-3 text-sm font-black text-[#181512] transition hover:bg-white">Operating map</a>
            <a href="#start" className="rounded-full bg-[#181512] px-5 py-3 text-sm font-black text-white transition hover:bg-[#2b2520]">Final offer</a>
          </div>
        </nav>

        <header className="mx-auto grid max-w-7xl items-center gap-10 px-5 pb-16 pt-8 sm:px-8 lg:grid-cols-[1.02fr_0.98fr] lg:pb-24 lg:pt-16">
          <div>
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-[#181512]/10 bg-white/70 px-4 py-2 text-sm font-black shadow-sm">
              <span className="h-2.5 w-2.5 rounded-full bg-[#e87322]" />
              Private page for Goff Welding — built from the conversation
            </div>
            <h1 className="max-w-5xl text-[3.2rem] font-black leading-[0.88] tracking-[-0.07em] text-[#181512] sm:text-7xl lg:text-8xl">
              This is what I heard inside Goff Welding.
            </h1>
            <p className="mt-7 max-w-3xl text-xl leading-9 text-[#4a4037] sm:text-2xl">
              Not a generic AI proposal. A private operating brief for Austin and Kevin: what seems to matter, where the first leverage is, and how Stoke AI would turn the work into a visible rhythm.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <a href="#map" className="inline-flex items-center justify-center rounded-full bg-[#e87322] px-7 py-4 text-base font-black text-white shadow-xl shadow-orange-900/15 transition hover:-translate-y-0.5 hover:bg-[#d65f14]">
                See the operating map
              </a>
              <p className="max-w-md text-sm font-semibold leading-6 text-[#6d6258]">
                The goal is simple: make the work visible enough that the right next system becomes obvious.
              </p>
            </div>
          </div>
          <OwnerMemo />
        </header>

        <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:py-16">
          <div className="grid gap-5 lg:grid-cols-3">
            {signalCards.map((card) => (
              <ShellCard key={card.title} className="p-6">
                <SectionLabel>{card.label}</SectionLabel>
                <h2 className="mt-5 text-3xl font-black leading-tight tracking-[-0.04em]">{card.title}</h2>
                <p className="mt-4 text-base leading-8 text-[#5c5248]">{card.body}</p>
              </ShellCard>
            ))}
          </div>
        </section>

        <section id="map" className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:py-24">
          <div className="mb-10 grid gap-6 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
            <div>
              <SectionLabel>Operating map</SectionLabel>
              <h2 className="mt-5 text-5xl font-black leading-[0.95] tracking-[-0.06em] sm:text-6xl">Six systems surfaced in one conversation.</h2>
            </div>
            <p className="text-xl leading-9 text-[#4f463e]">
              This is the part that should feel different: the conversation was not summarized into generic AI ideas. It was translated into the actual operating systems Goff can rank, build, and improve.
            </p>
          </div>
          <div className="grid gap-4">
            {operatingMap.map((item) => (
              <div key={item.number} className="group grid gap-5 rounded-[2rem] border border-[#181512]/10 bg-white/80 p-5 shadow-sm transition hover:-translate-y-0.5 hover:bg-white hover:shadow-xl hover:shadow-orange-900/10 lg:grid-cols-[0.18fr_0.32fr_1fr_0.22fr] lg:items-center lg:p-6">
                <p className="text-5xl font-black tracking-[-0.08em] text-[#d5c4b2] group-hover:text-[#e87322]">{item.number}</p>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.24em] text-[#b8793a]">{item.eyebrow}</p>
                  <p className="mt-2 text-sm font-bold text-[#7b7066]">{item.status}</p>
                </div>
                <div>
                  <h3 className="text-2xl font-black leading-tight tracking-[-0.035em]">{item.title}</h3>
                  <p className="mt-2 max-w-3xl leading-7 text-[#5c5248]">{item.body}</p>
                </div>
                <div className="h-2 rounded-full bg-[#efe4d8]">
                  <div className={`h-full rounded-full bg-[#e87322] ${item.number === '01' ? 'w-full' : item.number === '06' ? 'w-1/3' : 'w-2/3'}`} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[#181512] py-16 text-white lg:py-24">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div className="lg:sticky lg:top-8">
              <SectionLabel>First 30 days</SectionLabel>
              <h2 className="mt-5 text-5xl font-black leading-[0.95] tracking-[-0.06em] sm:text-6xl">Start with a visible win, not a vague AI initiative.</h2>
              <p className="mt-6 text-lg leading-8 text-[#c9bfb4]">
                The default first build is the Training / Goff Bible system because Austin already named training as the most important priority. If Austin and Kevin re-rank it, the roadmap changes. That is the point.
              </p>
            </div>
            <div className="grid gap-4">
              {firstThirty.map((item, index) => (
                <div key={item} className="rounded-[1.6rem] border border-white/10 bg-white/[0.055] p-6">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-orange-400/15 text-sm font-black text-orange-100">{index + 1}</div>
                  <p className="text-xl font-bold leading-8 text-[#f4efe8]">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <ShellCard className="overflow-hidden">
              <div className="border-b border-black/10 bg-[#fffaf3] p-6">
                <SectionLabel>The work loop</SectionLabel>
                <h2 className="mt-4 text-4xl font-black tracking-[-0.05em] sm:text-5xl">Comments do not disappear. They become movement.</h2>
              </div>
              <div className="grid gap-0 divide-y divide-black/10">
                {boardLoop.map((item, index) => (
                  <div key={item} className="grid gap-4 p-6 sm:grid-cols-[56px_1fr] sm:items-start">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#181512] text-sm font-black text-white">{index + 1}</div>
                    <p className="text-lg font-semibold leading-8 text-[#4f463e]">{item}</p>
                  </div>
                ))}
              </div>
            </ShellCard>

            <ShellCard className="bg-[#fffaf3] p-7">
              <SectionLabel>Every quarter</SectionLabel>
              <h2 className="mt-5 text-4xl font-black leading-tight tracking-[-0.05em]">One day to reset the business systems roadmap.</h2>
              <p className="mt-5 text-lg leading-8 text-[#5c5248]">
                Austin named the reason this matters: six months from now, a project that looked important may not matter because the business changed. The quarterly review protects the engagement from stale priorities.
              </p>
              <div className="mt-7 rounded-3xl border border-[#181512]/10 bg-white p-5">
                <p className="text-sm font-black uppercase tracking-[0.22em] text-[#b8793a]">Quarterly reset agenda</p>
                <ul className="mt-4 space-y-3 text-base font-semibold leading-7 text-[#4f463e]">
                  <li>• The “rules do not exist” brain dump</li>
                  <li>• Re-rank the live backlog</li>
                  <li>• Decide stop / continue / build next</li>
                  <li>• Publish the next-quarter roadmap</li>
                </ul>
              </div>
            </ShellCard>
          </div>
        </section>

        <section id="start" className="mx-auto max-w-6xl px-5 pb-24 sm:px-8">
          <div className="overflow-hidden rounded-[2.4rem] bg-[#181512] text-white shadow-2xl shadow-orange-950/20">
            <div className="grid gap-0 lg:grid-cols-[1fr_0.72fr]">
              <div className="p-8 sm:p-12">
                <SectionLabel>Final offer</SectionLabel>
                <h2 className="mt-5 text-5xl font-black leading-[0.95] tracking-[-0.06em] sm:text-6xl">If this fits Goff Welding, start with one month.</h2>
                <p className="mt-6 max-w-3xl text-xl leading-9 text-[#d7cec4]">
                  Month-to-month operating partnership. One shared board. Weekly progress rhythm. Quarterly priority reset. Practical systems built around the work that matters most.
                </p>
              </div>
              <div className="flex flex-col justify-between border-t border-white/10 bg-[#0f0d0c] p-8 sm:p-12 lg:border-l lg:border-t-0">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.26em] text-orange-200">Standard engagement</p>
                  <p className="mt-5 text-5xl font-black tracking-[-0.06em] sm:text-6xl">$5,000/month</p>
                  <p className="mt-4 text-sm font-semibold leading-6 text-[#b8aca0]">No long-term contract. Start the rhythm, prove the value, and keep earning the next month.</p>
                </div>
                <a href="mailto:jeff@stoke-ai.com?subject=Goff%20Welding%20Operating%20Partnership" className="mt-8 inline-flex items-center justify-center rounded-full bg-[#e87322] px-7 py-4 text-base font-black text-white transition hover:bg-[#d65f14]">
                  Tell Jeff this is worth a conversation
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
