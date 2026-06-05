import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Goff Welding | Payment Received',
  description: 'Next steps for the Goff Welding Stoke AI Operating System kickoff.',
};

const kickoffSteps = [
  {
    label: 'Schedule the kickoff',
    detail: 'Pick a time for Jeff to come meet with Austin and Kevin in person.',
  },
  {
    label: 'Confirm the first constraint',
    detail: 'Use the meeting to decide whether Training / the Goff Bible is still the right first operating loop.',
  },
  {
    label: 'Set the working board',
    detail: 'Turn priorities, examples, owners, and next steps into the first shared operating board.',
  },
];

export default function GoffsThankYouPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(255,122,24,0.24),transparent_34%),radial-gradient(circle_at_85%_18%,rgba(255,255,255,0.08),transparent_24%),linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:auto,auto,56px_56px,56px_56px]" />
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(120deg,transparent,rgba(255,138,42,0.08)_38%,transparent_58%)]" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col px-5 py-8 sm:px-8">
        <nav className="flex items-center justify-between">
          <Link href="/goffs" className="text-xs font-black uppercase tracking-[0.28em] text-white/45 transition hover:text-white">
            Goff Welding growth systems brief
          </Link>
          <Link href="/goffs" className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-bold text-white/75 hover:border-[#ff8a2a]/45 hover:text-white">
            Back to brief
          </Link>
        </nav>

        <section className="flex flex-1 items-center py-16">
          <div className="w-full overflow-hidden rounded-[2.6rem] border border-[#ff8a2a]/30 bg-[#0b0b0b]/92 shadow-2xl shadow-black">
            <div className="border-b border-white/10 bg-[#ff8a2a] p-1" />
            <div className="p-8 sm:p-12 lg:p-14">
              <div className="mb-8 inline-flex rounded-full border border-[#ff8a2a]/25 bg-[#ff8a2a]/10 px-4 py-2 text-sm font-black text-[#ffd1aa]">
                Payment received
              </div>

              <h1 className="max-w-4xl text-5xl font-black leading-[0.9] tracking-[-0.07em] sm:text-7xl">
                The next step is the in-person kickoff.
              </h1>

              <p className="mt-7 max-w-3xl text-xl leading-9 text-white/66">
                Thanks — the Stoke AI Operating System monthly service is started. Please schedule a time for Jeff to come meet with Austin and Kevin, confirm the first priority, and set up the working board.
              </p>

              <div className="mt-10 grid gap-4 md:grid-cols-3">
                {kickoffSteps.map((step, index) => (
                  <div key={step.label} className="rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-5">
                    <p className="text-4xl font-black tracking-[-0.08em] text-[#ff8a2a]">{String(index + 1).padStart(2, '0')}</p>
                    <h2 className="mt-5 text-2xl font-black tracking-[-0.04em]">{step.label}</h2>
                    <p className="mt-3 leading-7 text-white/58">{step.detail}</p>
                  </div>
                ))}
              </div>

              <div className="mt-10 rounded-[1.8rem] border border-white/10 bg-black/40 p-6 sm:flex sm:items-center sm:justify-between sm:gap-8">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.25em] text-[#ffb06a]">Kickoff meeting</p>
                  <p className="mt-3 text-lg leading-8 text-white/64">
                    Use the booking link to choose a time. Jeff will treat this as the in-person first-week kickoff, not another sales call.
                  </p>
                </div>
                <a href="https://calendar.app.google/YeqJLsyJHv1SQeXQ6" className="mt-6 inline-flex shrink-0 items-center justify-center rounded-full bg-[#ff8a2a] px-7 py-4 text-base font-black text-white transition hover:bg-white hover:text-black sm:mt-0">
                  Schedule kickoff meeting
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
