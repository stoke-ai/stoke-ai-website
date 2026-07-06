const demoJobs = [
  {
    phone: '(208) 650-2206',
    name: "Jeff's boat",
    boat: 'Malibu wakesurf boat',
    status: 'Waiting on material',
    stage: 'Parts / materials',
    note: 'Fiberglass prep is complete. The next step is color match material, then final repair and cleanup.',
    next: 'Next update: Friday afternoon',
    updated: 'Updated today by Michael through chat',
  },
  {
    phone: '(208) 555-0148',
    name: "Ryan's boat",
    boat: 'Axis A22',
    status: 'In progress',
    stage: 'Repair work',
    note: 'Interior upgrade is underway. Photos will be added when the install is ready for final review.',
    next: 'Next update: Tomorrow',
    updated: 'Updated from shop phone',
  },
];

const features = [
  {
    title: 'Michael texts the agent',
    body: 'He sends normal messages like “Jeff boat waiting on gelcoat, update Friday.” The system cleans it up and updates the customer page.',
  },
  {
    title: 'Customer checks by phone',
    body: 'No login. No app. The customer enters their phone number and sees only the simple status tied to that number.',
  },
  {
    title: 'Website becomes the front door',
    body: 'Request service, check status, and understand the repair process without calling Michael while he is in the middle of work.',
  },
  {
    title: 'Daily reminders prevent silence',
    body: 'The agent can ask Michael which boats need updates today so nobody goes a week wondering what happened.',
  },
];

const stack = [
  ['Website page', 'Stoke AI / Next.js page under stoke-ai.com/boatman-garage for the demo, later moved or embedded on boatmangarage.com'],
  ['Simple job database', 'A small table for customer phone, boat nickname, status, public note, next update, and photos'],
  ['Chat agent', 'SMS or Telegram agent for Michael to create and update jobs from his phone'],
  ['Text messaging', 'Twilio or existing SMS gateway to send update links and reminders'],
  ['Optional photos', 'Upload from Michael’s phone into the job record; keep it lightweight for v1'],
];

export const metadata = {
  title: 'Boat Man Garage Status System | Stoke AI',
  description: 'A simple customer status concept for Boat Man Garage, built by Stoke AI.',
};

export default function BoatmanGaragePage() {
  const primaryJob = demoJobs[0];

  return (
    <main className="min-h-screen bg-[#f4f0e8] text-[#17202a]">
      <section className="relative overflow-hidden border-b border-[#17202a]/10 bg-[#101820] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(75,159,185,0.45),transparent_32%),radial-gradient(circle_at_88%_10%,rgba(242,178,86,0.38),transparent_28%)]" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-5 py-10 sm:px-8 lg:grid-cols-[1fr_0.9fr] lg:py-16">
          <div className="flex flex-col justify-center">
            <div className="mb-5 inline-flex w-fit rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold tracking-wide text-[#cfeaf2]">
              Stoke AI concept for Boat Man Garage
            </div>
            <h1 className="max-w-3xl text-4xl font-black leading-[0.95] tracking-tight sm:text-6xl">
              Let customers check their boat status without interrupting the shop.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/78">
              A simple phone-based status page plus a chat agent Michael can update from his phone. No customer logins, no heavy dashboard, no extra computer work.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#demo" className="rounded-full bg-[#f2b256] px-6 py-3 text-center text-sm font-black text-[#101820] shadow-lg shadow-black/20">
                See the phone lookup demo
              </a>
              <a href="#build" className="rounded-full border border-white/25 px-6 py-3 text-center text-sm font-bold text-white/90">
                What we would build
              </a>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/15 bg-white/10 p-4 shadow-2xl shadow-black/30 backdrop-blur">
            <div className="rounded-[1.5rem] bg-[#f8f5ee] p-5 text-[#17202a]">
              <div className="flex items-center justify-between border-b border-[#17202a]/10 pb-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.25em] text-[#4b9fb9]">Customer status</p>
                  <h2 className="text-2xl font-black">{primaryJob.name}</h2>
                </div>
                <span className="rounded-full bg-[#d9f0de] px-3 py-1 text-xs font-black text-[#1f6b38]">Active</span>
              </div>
              <div className="mt-5 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#17202a]/8">
                <p className="text-sm font-bold text-[#64717d]">{primaryJob.boat}</p>
                <p className="mt-2 text-3xl font-black">{primaryJob.status}</p>
                <p className="mt-3 text-base leading-7 text-[#3a4652]">{primaryJob.note}</p>
                <div className="mt-5 rounded-xl bg-[#edf7fa] p-4 text-sm font-bold text-[#19586b]">{primaryJob.next}</div>
              </div>
              <p className="mt-4 text-center text-xs font-bold text-[#7b8792]">Found by phone number • No login required</p>
            </div>
          </div>
        </div>
      </section>

      <section id="demo" className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-[#4b9fb9]">How the customer uses it</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">They enter a phone number. That is it.</h2>
            <p className="mt-4 text-lg leading-8 text-[#4d5963]">
              For the first version, privacy stays practical: the page shows a boat nickname, status, public note, and next update. No full account, no invoices, no sensitive customer data.
            </p>
            <div className="mt-6 rounded-2xl border border-[#17202a]/10 bg-white p-5 shadow-sm">
              <label className="text-sm font-black text-[#17202a]">Phone number</label>
              <div className="mt-2 flex gap-2">
                <div className="flex-1 rounded-xl border border-[#17202a]/15 bg-[#f8f5ee] px-4 py-3 font-bold text-[#5d6872]">208-650-2206</div>
                <button className="rounded-xl bg-[#101820] px-5 py-3 text-sm font-black text-white">Check</button>
              </div>
              <p className="mt-3 text-xs font-bold text-[#7b8792]">Demo result shown to the right.</p>
            </div>
          </div>

          <div className="grid gap-4">
            {demoJobs.map((job) => (
              <article key={job.phone} className="rounded-[1.5rem] border border-[#17202a]/10 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-black uppercase tracking-[0.18em] text-[#4b9fb9]">{job.stage}</p>
                    <h3 className="mt-1 text-2xl font-black">{job.name}</h3>
                    <p className="mt-1 font-bold text-[#6b7782]">{job.boat}</p>
                  </div>
                  <span className="rounded-full bg-[#fff1d8] px-3 py-1 text-xs font-black text-[#8c5513]">{job.status}</span>
                </div>
                <p className="mt-4 leading-7 text-[#3d4852]">{job.note}</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl bg-[#f4f0e8] p-3 text-sm font-bold text-[#4d5963]">{job.next}</div>
                  <div className="rounded-xl bg-[#edf7fa] p-3 text-sm font-bold text-[#19586b]">{job.updated}</div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="build" className="bg-white py-12">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-[#4b9fb9]">What this proves</p>
          <h2 className="mt-3 max-w-3xl text-3xl font-black tracking-tight sm:text-4xl">The value is communication, not a complicated shop system.</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-[1.5rem] border border-[#17202a]/10 bg-[#f8f5ee] p-6">
                <h3 className="text-xl font-black">{feature.title}</h3>
                <p className="mt-3 leading-7 text-[#4d5963]">{feature.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <div className="rounded-[2rem] bg-[#101820] p-6 text-white sm:p-8">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-[#f2b256]">Software needed for v1</p>
          <div className="mt-6 grid gap-3">
            {stack.map(([label, detail]) => (
              <div key={label} className="grid gap-2 rounded-2xl border border-white/10 bg-white/8 p-4 sm:grid-cols-[180px_1fr]">
                <div className="font-black text-white">{label}</div>
                <div className="leading-7 text-white/72">{detail}</div>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-2xl bg-[#f2b256] p-5 text-[#101820]">
            <p className="text-xl font-black">Trade-value pitch</p>
            <p className="mt-2 leading-7 font-semibold">
              “Michael, I can build you a lightweight status system so customers stop wondering where their boat is. You keep doing the boat work, and I’ll make the communication side feel professional without adding another computer job to your day.”
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
