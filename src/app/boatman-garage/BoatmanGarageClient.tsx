'use client';

import { FormEvent, useState } from 'react';

const shopPhotos = {
  hero: 'https://static.wixstatic.com/media/96b042_696c63757a8d4210bf7dc45ba3849d5f~mv2.jpeg/v1/fill/w_900,h_985,al_c,q_88,usm_0.66_1.00_0.01,enc_avif,quality_auto/96b042_696c63757a8d4210bf7dc45ba3849d5f~mv2.jpeg',
  detailOne: 'https://static.wixstatic.com/media/96b042_cfac4627492e43ca9c76ec9ad6033b30~mv2.jpeg/v1/fill/w_520,h_760,al_c,q_86,usm_0.66_1.00_0.01,enc_avif,quality_auto/96b042_cfac4627492e43ca9c76ec9ad6033b30~mv2.jpeg',
  detailTwo: 'https://static.wixstatic.com/media/96b042_203fab321e4a4655be58eb5cca98b5f8~mv2.jpeg/v1/fill/w_520,h_760,al_c,q_86,usm_0.66_1.00_0.01,enc_avif,quality_auto/96b042_203fab321e4a4655be58eb5cca98b5f8~mv2.jpeg',
};

const customerStatus = {
  customer: 'Jeff Stoker',
  boat: '1987 Four Winns',
  ticket: 'BMG-0417',
  status: 'Starter received — waiting for install / next shop update',
  note: 'Your gas tank repair has been pressure tested and the replacement starter arrived Friday. The next step is installing the starter, confirming the boat starts correctly, and completing the water/leak check.',
  next: 'Next expected update: starter install + river test schedule',
  updated: 'July 6',
  shopDays: '42 days since first call',
};

const statusTimeline = [
  { date: 'May 12', label: 'Initial call', detail: 'Customer called about the 1987 Four Winns. Boat Man Garage scheduled shop drop-off for May 26.', type: 'scheduled' },
  { date: 'May 22', label: 'Early drop-off requested', detail: 'Customer asked if the boat could be dropped off early. Shop said that would not work.', type: 'message' },
  { date: 'May 22', label: 'Gas tank issue disclosed', detail: 'Customer texted that a screw punctured the gas tank. Shop replied: “That’s okay, I fix everything.”', type: 'issue' },
  { date: 'May 25', label: 'Drop-off time confirmed', detail: 'Customer asked what time to drop off. Shop said between 9:00 and 9:30.', type: 'scheduled' },
  { date: 'May 26', label: 'Boat dropped off', detail: 'Shop directed customer to pull next to the stock trailer on the west end because the front of the shop was full.', type: 'done' },
  { date: 'May 28', label: 'Customer asked for tank update', detail: 'Customer asked: “Any thoughts about the gas tank yet?” No response recorded.', type: 'no-response' },
  { date: 'June 1', label: 'JB Weld plan', detail: 'Shop said JB Weld had come in, hoped to apply it late that night, let it set 24–48 hours, then pressure test.', type: 'update' },
  { date: 'June 5', label: 'First tank repair failed', detail: 'Customer asked about pressure testing. Shop said it did not stick and planned to prep one more time with a new cleaning method.', type: 'issue' },
  { date: 'June 10', label: 'Pressure test looked good', detail: 'Shop said the tank was pressure testing and appeared to be holding fuel. Customer approved going through everything else.', type: 'update' },
  { date: 'June 10', label: 'Water leak / river test added', detail: 'Customer was worried about how much water the boat took on. Shop said he would run it to the river and see where and why.', type: 'scheduled' },
  { date: 'June 17', label: 'River test delayed', detail: 'Customer asked for updates. Shop apologized, said wind and other boats put him behind, and planned to try the river test the next morning.', type: 'delay' },
  { date: 'June 19', label: 'River test not completed', detail: 'Customer asked if the boat was taken out. Shop said it was not.', type: 'delay' },
  { date: 'June 23', label: 'Starter problem found', detail: 'Shop took the boat out but it would not start. Customer approved finding a replacement starter by phone.', type: 'issue' },
  { date: 'July 6', label: 'Starter arrived', detail: 'Customer asked if there was any luck finding a starter. Shop said yes — it came in Friday.', type: 'current' },
];

const services = [
  ['Fiberglass + gelcoat', 'Dock rash, rock damage, color match, campers, jet skis, and semi hoods.'],
  ['Maintenance + diagnostics', 'Oil, filters, tune-ups, engine checks, and get-back-on-the-water fixes.'],
  ['Mobile repair', 'Driveway, storage unit, or lakeside service when the boat cannot come to the shop.'],
  ['Custom upgrades', 'Audio, lighting, ballast, surf systems, heaters, carpet, and GatorStep installs.'],
];

const process = [
  ['Request', 'Send the boat, photos, and what is going wrong.'],
  ['Check-in', 'The shop confirms the job and starts the repair queue.'],
  ['Status', 'Enter your phone number anytime to see the latest update.'],
  ['Pickup', 'When it is ready, you get a clear pickup update.'],
];

export default function BoatmanGarageClient() {
  const [phone, setPhone] = useState('');
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');

  const checkStatus = (event: FormEvent) => {
    event.preventDefault();
    const digits = phone.replace(/\D/g, '');

    if (digits.length < 7) {
      setSearched(false);
      setError('Enter the phone number connected to your boat.');
      return;
    }

    setError('');
    setSearched(true);
  };

  return (
    <main className="min-h-screen bg-[#e9e2d2] text-[#111b1f] selection:bg-[#d98935]/30">
      <header className="sticky top-0 z-30 border-b border-[#111b1f]/10 bg-[#f6f1e6]/88 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <a href="#top" className="group flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-[#111b1f] text-sm font-black text-[#f3b159]">BM</span>
            <span>
              <span className="block text-lg font-black leading-none tracking-tight">Boat Man Garage</span>
              <span className="block text-[0.68rem] font-black uppercase tracking-[0.22em] text-[#66736e]">Rupert, Idaho</span>
            </span>
          </a>
          <nav className="hidden items-center gap-7 text-sm font-black text-[#3f4c4d] md:flex">
            <a href="#status" className="hover:text-[#111b1f]">Check status</a>
            <a href="#work" className="hover:text-[#111b1f]">Work</a>
            <a href="#services" className="hover:text-[#111b1f]">Services</a>
            <a href="#request" className="hover:text-[#111b1f]">Request service</a>
          </nav>
          <a href="tel:2086502206" className="rounded-full bg-[#111b1f] px-5 py-3 text-sm font-black text-white shadow-sm">Call</a>
        </div>
      </header>

      <section id="top" className="relative overflow-hidden border-b border-[#111b1f]/10">
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(17,27,31,0.04)_0_1px,transparent_1px_44px),radial-gradient(circle_at_10%_10%,rgba(22,95,119,0.18),transparent_32%),radial-gradient(circle_at_90%_18%,rgba(217,137,53,0.22),transparent_28%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-5 py-10 sm:px-8 lg:grid-cols-[0.93fr_1.07fr] lg:py-16">
          <div className="flex flex-col justify-center">
            <p className="mb-6 flex w-fit items-center gap-2 rounded-full border border-[#111b1f]/10 bg-[#f6f1e6] px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-[#165f77] shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[#2f8b5f]" /> 24/7 mobile repair available
            </p>
            <h1 className="max-w-4xl text-[3.6rem] font-black leading-[0.86] tracking-[-0.075em] text-[#111b1f] sm:text-7xl lg:text-8xl">
              Repaired right. Updated without the runaround.
            </h1>
            <p className="mt-7 max-w-2xl text-xl leading-9 text-[#495653]">
              Fiberglass, gelcoat, maintenance, mobile repair, and upgrades — now with a simple status lookup so you know where your boat stands.
            </p>
            <div className="mt-9 grid max-w-xl gap-3 sm:grid-cols-2">
              <a href="#status" className="rounded-full bg-[#d98935] px-7 py-4 text-center text-sm font-black text-[#111b1f] shadow-lg shadow-[#d98935]/20">Check boat status</a>
              <a href="#request" className="rounded-full border border-[#111b1f]/18 bg-[#f6f1e6] px-7 py-4 text-center text-sm font-black text-[#111b1f]">Request service</a>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[0.72fr_0.28fr]">
            <div className="relative min-h-[560px] overflow-hidden rounded-[2.2rem] bg-[#111b1f] shadow-2xl shadow-[#111b1f]/25">
              <img src={shopPhotos.hero} alt="Boat Man Garage repair work" className="absolute inset-0 h-full w-full object-cover opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111b1f]/86 via-[#111b1f]/18 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white sm:p-8">
                <p className="text-xs font-black uppercase tracking-[0.26em] text-[#f3b159]">Shop standard</p>
                <p className="mt-2 max-w-md text-3xl font-black leading-tight">Good work should not be hard to get an update on.</p>
              </div>
            </div>
            <div className="hidden gap-4 lg:grid">
              <img src={shopPhotos.detailOne} alt="Boat repair detail" className="h-full min-h-0 rounded-[1.5rem] object-cover shadow-xl shadow-[#111b1f]/15" />
              <div className="rounded-[1.5rem] bg-[#111b1f] p-5 text-white shadow-xl shadow-[#111b1f]/15">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[#f3b159]">Known for</p>
                <p className="mt-3 text-2xl font-black leading-tight">Fiberglass repairs that look finished, not patched.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="status" className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:py-16">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2.2rem] bg-[#111b1f] p-6 text-white shadow-2xl shadow-[#111b1f]/18 sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#f3b159]">Customer lookup</p>
            <h2 className="mt-3 text-4xl font-black leading-none tracking-[-0.04em] sm:text-5xl">Check your boat.</h2>
            <p className="mt-4 text-lg leading-8 text-white/68">Enter the cell number on your repair ticket. If your boat is checked in, your latest shop update appears here.</p>
            <form onSubmit={checkStatus} className="mt-7 rounded-[1.5rem] bg-white p-3 text-[#111b1f] shadow-inner">
              <label className="sr-only" htmlFor="status-phone">Cell phone number</label>
              <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                <input
                  id="status-phone"
                  value={phone}
                  inputMode="tel"
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="Enter your cell phone"
                  className="min-w-0 rounded-[1.1rem] bg-[#eee7d8] px-5 py-4 text-lg font-black outline-none placeholder:text-[#7a817d] focus:ring-2 focus:ring-[#d98935]"
                />
                <button className="rounded-[1.1rem] bg-[#d98935] px-7 py-4 text-sm font-black text-[#111b1f]">Check status</button>
              </div>
            </form>
            {error ? <p className="mt-4 rounded-2xl bg-[#6b2b22] px-4 py-3 text-sm font-black text-white">{error}</p> : null}
            <p className="mt-5 text-sm font-bold text-white/50">No boat information is shown until a phone number is entered.</p>
          </div>

          <div className="min-h-[420px]">
            {searched ? <StatusCard /> : <EmptyStatus />}
          </div>
        </div>
      </section>

      <section id="work" className="border-y border-[#111b1f]/10 bg-[#f6f1e6] py-14">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 sm:px-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#165f77]">Work you can see</p>
            <h2 className="mt-3 text-5xl font-black leading-[0.92] tracking-[-0.06em] text-[#111b1f]">From rough damage to water-ready.</h2>
            <p className="mt-5 text-lg leading-8 text-[#4e5b58]">The site should sell the thing people already like about Michael: the work. Status updates just make the customer experience match the craftsmanship.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <img src={shopPhotos.detailOne} alt="Fiberglass repair progress" className="h-[420px] w-full rounded-[2rem] object-cover shadow-xl shadow-[#111b1f]/14" />
            <img src={shopPhotos.detailTwo} alt="Boat repair finished work" className="h-[420px] w-full rounded-[2rem] object-cover shadow-xl shadow-[#111b1f]/14 sm:mt-12" />
          </div>
        </div>
      </section>

      <section id="services" className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:py-16">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#165f77]">Services</p>
            <h2 className="mt-3 max-w-3xl text-5xl font-black leading-[0.92] tracking-[-0.06em] text-[#111b1f]">Repair, maintenance, and upgrades without the mystery.</h2>
          </div>
          <a href="tel:2086502206" className="w-fit rounded-full bg-[#111b1f] px-6 py-4 text-sm font-black text-white">Call 208-650-2206</a>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {services.map(([title, body]) => (
            <article key={title} className="rounded-[2rem] border border-[#111b1f]/10 bg-[#f6f1e6] p-6 shadow-sm">
              <h3 className="text-2xl font-black leading-tight tracking-[-0.03em]">{title}</h3>
              <p className="mt-4 leading-7 text-[#52605d]">{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#111b1f] py-14 text-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-[#f3b159]">The customer flow</p>
          <div className="mt-5 grid gap-4 md:grid-cols-4">
            {process.map(([title, body], index) => (
              <div key={title} className="rounded-[1.7rem] border border-white/10 bg-white/[0.06] p-6">
                <p className="text-5xl font-black tracking-[-0.08em] text-white/18">0{index + 1}</p>
                <h3 className="mt-5 text-2xl font-black">{title}</h3>
                <p className="mt-3 leading-7 text-white/62">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="request" className="mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:py-16">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-[#165f77]">Request service</p>
          <h2 className="mt-3 text-5xl font-black leading-[0.92] tracking-[-0.06em]">Send the basics before you call.</h2>
          <p className="mt-5 text-lg leading-8 text-[#4e5b58]">A better website lets customers send the boat, photos, and problem first. Michael can look at the request when he has a minute instead of trying to piece it together from scattered texts.</p>
          <div className="mt-7 rounded-[1.7rem] bg-[#f6f1e6] p-5 shadow-sm ring-1 ring-[#111b1f]/10">
            <p className="font-black">Boat Man Garage</p>
            <p className="mt-1 text-[#5e6966]">302 E Baseline RD, Rupert, ID 83350</p>
            <p className="mt-1 text-[#5e6966]">Mon–Fri 9–6 • Sat 9–2</p>
          </div>
        </div>

        <div className="rounded-[2.2rem] bg-[#f6f1e6] p-4 shadow-2xl shadow-[#111b1f]/12 ring-1 ring-[#111b1f]/10 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name" value="Your name" />
            <Field label="Phone" value="Best cell number" />
            <Field label="Boat" value="Make / model / year" wide />
            <div className="sm:col-span-2">
              <p className="text-sm font-black">What do you need?</p>
              <div className="mt-2 min-h-32 rounded-[1.25rem] bg-white px-4 py-4 font-bold text-[#838b86] ring-1 ring-[#111b1f]/8">Fiberglass damage, maintenance, mobile repair, upgrade, or other issue...</div>
            </div>
            <div className="sm:col-span-2 rounded-[1.25rem] border-2 border-dashed border-[#165f77]/35 bg-[#e8f2f3] px-4 py-8 text-center font-black text-[#165f77]">Add photos of the boat or damage</div>
          </div>
          <button className="mt-5 w-full rounded-full bg-[#d98935] px-6 py-4 text-sm font-black text-[#111b1f]">Send request</button>
        </div>
      </section>

      <footer className="bg-[#0a1114] px-5 py-10 text-white">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 sm:px-8 md:flex-row md:items-center">
          <div>
            <p className="text-xl font-black">Boat Man Garage</p>
            <p className="mt-1 text-sm font-bold text-white/50">Boat repair and fiberglass work in Rupert, Idaho.</p>
          </div>
          <a href="tel:2086502206" className="w-fit rounded-full bg-white px-5 py-3 text-sm font-black text-[#111b1f]">Call 208-650-2206</a>
        </div>
      </footer>
    </main>
  );
}

function StatusCard() {
  const currentIndex = statusTimeline.length - 1;

  return (
    <article className="h-full rounded-[2.2rem] border border-[#111b1f]/10 bg-[#f6f1e6] p-4 shadow-2xl shadow-[#111b1f]/12 sm:p-6">
      <div className="rounded-[1.6rem] bg-white p-5 shadow-sm ring-1 ring-[#111b1f]/8 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#165f77]">Status found</p>
            <h3 className="mt-2 text-4xl font-black leading-none tracking-[-0.06em] sm:text-5xl">{customerStatus.boat}</h3>
            <p className="mt-2 font-black text-[#66716d]">{customerStatus.customer} • {customerStatus.ticket}</p>
          </div>
          <div className="rounded-[1.2rem] bg-[#111b1f] px-4 py-3 text-right text-white">
            <p className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-[#f3b159]">Last update</p>
            <p className="text-lg font-black">{customerStatus.updated}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-[1.2rem] bg-[#e8f2f3] p-4">
            <p className="text-[0.68rem] font-black uppercase tracking-[0.18em] text-[#165f77]">Current stage</p>
            <p className="mt-2 text-xl font-black leading-tight">Starter / final test</p>
          </div>
          <div className="rounded-[1.2rem] bg-[#fff3dd] p-4">
            <p className="text-[0.68rem] font-black uppercase tracking-[0.18em] text-[#9a5e17]">Timeline</p>
            <p className="mt-2 text-xl font-black leading-tight">{customerStatus.shopDays}</p>
          </div>
          <div className="rounded-[1.2rem] bg-[#e8f4ed] p-4">
            <p className="text-[0.68rem] font-black uppercase tracking-[0.18em] text-[#2f704e]">Next step</p>
            <p className="mt-2 text-xl font-black leading-tight">Install + test</p>
          </div>
        </div>

        <div className="mt-4 rounded-[1.4rem] bg-[#111b1f] p-5 text-white">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#f3b159]">Current status</p>
          <p className="mt-2 text-2xl font-black leading-tight sm:text-3xl">{customerStatus.status}</p>
          <p className="mt-4 leading-8 text-white/70">{customerStatus.note}</p>
        </div>
        <div className="mt-4 rounded-[1.4rem] bg-[#e8f2f3] p-5 font-black text-[#165f77]">{customerStatus.next}</div>
      </div>

      <div className="mt-5 rounded-[1.6rem] bg-white p-5 shadow-sm ring-1 ring-[#111b1f]/8 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#165f77]">Repair history</p>
            <h4 className="mt-2 text-3xl font-black leading-none tracking-[-0.05em]">What has happened so far</h4>
          </div>
          <p className="rounded-full bg-[#f6f1e6] px-4 py-2 text-xs font-black text-[#5d6764]">May 12 → July 6</p>
        </div>

        <div className="mt-6 space-y-3">
          {statusTimeline.map((item, index) => (
            <div key={`${item.date}-${item.label}`} className="grid gap-3 rounded-[1.25rem] border border-[#111b1f]/8 bg-[#fbfaf6] p-4 sm:grid-cols-[6.5rem_1fr]">
              <div>
                <p className="text-sm font-black text-[#111b1f]">{item.date}</p>
                <span className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-[0.63rem] font-black uppercase tracking-[0.14em] ${badgeClass(item.type)}`}>
                  {index === currentIndex ? 'Current' : item.type.replace('-', ' ')}
                </span>
              </div>
              <div className="relative border-l border-[#111b1f]/12 pl-4">
                <span className={`absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full ${dotClass(item.type)}`} />
                <p className="text-lg font-black leading-tight">{item.label}</p>
                <p className="mt-2 leading-7 text-[#55615d]">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

function badgeClass(type: string) {
  if (type === 'current') return 'bg-[#111b1f] text-white';
  if (type === 'no-response') return 'bg-[#f6dfd8] text-[#8a2f21]';
  if (type === 'delay') return 'bg-[#fff3dd] text-[#8b5a18]';
  if (type === 'issue') return 'bg-[#eadff8] text-[#53367b]';
  if (type === 'done' || type === 'update') return 'bg-[#e8f4ed] text-[#2f704e]';
  return 'bg-[#e8f2f3] text-[#165f77]';
}

function dotClass(type: string) {
  if (type === 'current') return 'bg-[#111b1f]';
  if (type === 'no-response') return 'bg-[#b54835]';
  if (type === 'delay') return 'bg-[#d98935]';
  if (type === 'issue') return 'bg-[#7150a0]';
  if (type === 'done' || type === 'update') return 'bg-[#2f8b5f]';
  return 'bg-[#165f77]';
}

function EmptyStatus() {
  return (
    <div className="grid h-full min-h-[420px] place-items-center rounded-[2.2rem] border border-[#111b1f]/10 bg-[#f6f1e6] p-8 text-center shadow-sm">
      <div className="max-w-md">
        <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-[#111b1f] text-2xl text-[#f3b159]">⌁</div>
        <p className="text-xs font-black uppercase tracking-[0.24em] text-[#165f77]">Waiting for phone number</p>
        <h3 className="mt-3 text-4xl font-black leading-none tracking-[-0.05em]">Your boat status appears here.</h3>
        <p className="mt-4 leading-7 text-[#58635f]">Customers only see a status after checking the phone number tied to their repair ticket.</p>
      </div>
    </div>
  );
}

function Field({ label, value, wide = false }: { label: string; value: string; wide?: boolean }) {
  return (
    <div className={wide ? 'sm:col-span-2' : ''}>
      <p className="text-sm font-black">{label}</p>
      <div className="mt-2 rounded-[1.25rem] bg-white px-4 py-4 font-bold text-[#838b86] ring-1 ring-[#111b1f]/8">{value}</div>
    </div>
  );
}
