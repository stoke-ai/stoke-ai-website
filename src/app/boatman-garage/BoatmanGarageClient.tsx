'use client';

import { FormEvent, useState } from 'react';

const customerStatus = {
  customer: 'Jeff Stoker',
  boat: '1987 Four Winns',
  status: 'Checked in and waiting for shop review',
  note: 'Your boat is with Boat Man Garage. Michael will add the next repair update after he finishes the initial look-over and confirms what needs attention first.',
  next: 'Next update: after inspection',
  updated: 'Demo status updated today',
};

const services = [
  'Fiberglass repair',
  'Gelcoat color match',
  'Engine maintenance',
  'Oil and filter service',
  'Mobile boat repair',
  'Stereo, lighting, ballast, heaters, carpet, and GatorStep upgrades',
];

const steps = [
  ['1', 'Request service', 'Send your boat info, photos, and what you need fixed.'],
  ['2', 'We check it in', 'Boat Man Garage confirms the boat and starts the repair queue.'],
  ['3', 'Check status anytime', 'Enter your phone number to see the latest status.'],
  ['4', 'Pickup when ready', 'You get a clear ready-for-pickup update when the job is done.'],
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
      setError('Enter the phone number you used with Boat Man Garage.');
      return;
    }

    setError('');
    setSearched(true);
  };

  return (
    <main className="min-h-screen bg-[#f6f2ea] text-[#10202a]">
      <header className="sticky top-0 z-20 border-b border-white/15 bg-[#0d1b24]/92 text-white backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <a href="#top" className="text-lg font-black tracking-tight">Boat Man Garage</a>
          <nav className="hidden items-center gap-7 text-sm font-bold text-white/78 md:flex">
            <a href="#status" className="hover:text-white">Check status</a>
            <a href="#services" className="hover:text-white">Services</a>
            <a href="#request" className="hover:text-white">Request service</a>
          </nav>
          <a href="tel:2086502206" className="rounded-full bg-[#f6b75d] px-4 py-2 text-sm font-black text-[#0d1b24]">Call now</a>
        </div>
      </header>

      <section id="top" className="relative overflow-hidden bg-[#0d1b24] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(52,143,173,0.52),transparent_34%),radial-gradient(circle_at_92%_8%,rgba(246,183,93,0.42),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.05)_0_1px,transparent_1px_18px)]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
          <div className="flex flex-col justify-center">
            <p className="mb-5 w-fit rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-black uppercase tracking-[0.2em] text-[#bcebf5]">
              Rupert, Idaho • Boat repair + fiberglass
            </p>
            <h1 className="max-w-4xl text-5xl font-black leading-[0.92] tracking-tight sm:text-7xl">
              Quality boat work with clear status updates.
            </h1>
            <p className="mt-6 max-w-2xl text-xl leading-9 text-white/78">
              Boat Man Garage handles fiberglass repair, maintenance, mobile repair, and upgrades — with a simple way for customers to check where their boat is in the shop.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#request" className="rounded-full bg-[#f6b75d] px-7 py-4 text-center text-sm font-black text-[#0d1b24] shadow-xl shadow-black/20">
                Request service
              </a>
              <a href="#status" className="rounded-full border border-white/25 bg-white/8 px-7 py-4 text-center text-sm font-black text-white">
                Check boat status
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-[2.5rem] bg-[#348fad]/20 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-white/10 p-4 shadow-2xl shadow-black/35 backdrop-blur">
              <div className="rounded-[1.5rem] bg-[#f9f5ec] p-5 text-[#10202a]">
                <p className="text-xs font-black uppercase tracking-[0.24em] text-[#348fad]">Customer status lookup</p>
                <h2 className="mt-2 text-3xl font-black">Check your boat</h2>
                <p className="mt-2 leading-7 text-[#52606b]">Enter the phone number you gave Boat Man Garage to see your current shop update.</p>
                <form onSubmit={checkStatus} className="mt-5 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-[#10202a]/8">
                  <label className="sr-only" htmlFor="hero-phone">Phone number</label>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <input
                      id="hero-phone"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      placeholder="Enter your cell phone"
                      className="min-w-0 flex-1 rounded-xl bg-[#f1ebe0] px-4 py-4 text-base font-bold text-[#10202a] outline-none placeholder:text-[#7c8791] focus:ring-2 focus:ring-[#348fad]"
                    />
                    <button className="rounded-xl bg-[#0d1b24] px-5 py-4 text-sm font-black text-white">Check</button>
                  </div>
                </form>
                {error ? <p className="mt-3 text-sm font-black text-[#a23d2b]">{error}</p> : null}
                {searched ? <StatusCard compact /> : <p className="mt-4 text-sm font-bold text-[#6a7680]">No status is shown until a customer enters their phone number.</p>}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="status" className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-[#10202a]/8 sm:p-8">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-[#348fad]">Check your boat</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight">Enter your phone number.</h2>
            <p className="mt-4 text-lg leading-8 text-[#4c5b66]">
              If your boat is checked in, your latest shop status appears here. No account, no password, no guessing.
            </p>
            <form onSubmit={checkStatus} className="mt-7">
              <label className="text-sm font-black text-[#10202a]" htmlFor="status-phone">Phone number</label>
              <div className="mt-2 flex flex-col gap-2 rounded-2xl bg-[#f1ebe0] p-2 sm:flex-row">
                <input
                  id="status-phone"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="Enter your cell phone"
                  className="min-w-0 flex-1 rounded-xl bg-white px-4 py-4 font-bold text-[#10202a] outline-none placeholder:text-[#7c8791] focus:ring-2 focus:ring-[#348fad]"
                />
                <button className="rounded-xl bg-[#0d1b24] px-5 py-4 text-sm font-black text-white">Check</button>
              </div>
            </form>
            <p className="mt-4 text-sm font-bold text-[#71808a]">Enter the phone number connected to your repair ticket.</p>
          </div>

          <div>
            {searched ? (
              <StatusCard />
            ) : (
              <div className="grid min-h-full place-items-center rounded-[2rem] border-2 border-dashed border-[#10202a]/15 bg-white/60 p-8 text-center">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.22em] text-[#348fad]">Status hidden</p>
                  <h3 className="mt-3 text-3xl font-black">Enter a phone number to pull up the boat.</h3>
                  <p className="mt-3 max-w-xl leading-7 text-[#52606b]">Your boat status will appear here after the number is checked.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section id="services" className="bg-white py-14">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-[#348fad]">Services</p>
              <h2 className="mt-3 text-4xl font-black tracking-tight">Boat repair, fiberglass, maintenance, and upgrades.</h2>
              <p className="mt-4 text-lg leading-8 text-[#4c5b66]">
                From rock damage and dock scratches to maintenance and custom upgrades, Boat Man Garage keeps the work practical, clear, and built around getting you back on the water.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {services.map((service) => (
                <div key={service} className="rounded-2xl border border-[#10202a]/10 bg-[#f6f2ea] p-5 text-lg font-black">
                  {service}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <p className="text-sm font-black uppercase tracking-[0.22em] text-[#348fad]">How it works</p>
        <h2 className="mt-3 max-w-3xl text-4xl font-black tracking-tight">A cleaner repair process from first message to pickup.</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {steps.map(([num, title, body]) => (
            <div key={title} className="rounded-[1.75rem] bg-[#10202a] p-6 text-white">
              <div className="mb-5 grid h-11 w-11 place-items-center rounded-full bg-[#f6b75d] text-lg font-black text-[#10202a]">{num}</div>
              <h3 className="text-xl font-black">{title}</h3>
              <p className="mt-3 leading-7 text-white/70">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="request" className="bg-[#0d1b24] py-14 text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-[#f6b75d]">Request service</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight">Send photos and tell us what your boat needs.</h2>
            <p className="mt-4 text-lg leading-8 text-white/70">
              Customers can send the basics here so Boat Man Garage can review the job before the next call or drop-off.
            </p>
            <div className="mt-7 rounded-2xl bg-white/8 p-5">
              <p className="text-xl font-black">Boat Man Garage</p>
              <p className="mt-2 text-white/70">302 E Baseline RD, Rupert, ID 83350</p>
              <a href="tel:2086502206" className="mt-4 inline-flex rounded-full bg-[#f6b75d] px-5 py-3 text-sm font-black text-[#0d1b24]">Call 208-650-2206</a>
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-6 text-[#10202a] shadow-2xl shadow-black/25 sm:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-black">Name</label>
                <div className="mt-2 rounded-xl bg-[#f1ebe0] px-4 py-4 text-[#7b8792]">Your name</div>
              </div>
              <div>
                <label className="text-sm font-black">Phone</label>
                <div className="mt-2 rounded-xl bg-[#f1ebe0] px-4 py-4 text-[#7b8792]">Best number</div>
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm font-black">Boat</label>
                <div className="mt-2 rounded-xl bg-[#f1ebe0] px-4 py-4 text-[#7b8792]">Make / model / year</div>
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm font-black">What do you need?</label>
                <div className="mt-2 min-h-28 rounded-xl bg-[#f1ebe0] px-4 py-4 text-[#7b8792]">Describe repair, maintenance, damage, or upgrade...</div>
              </div>
              <div className="sm:col-span-2 rounded-xl border-2 border-dashed border-[#348fad]/40 bg-[#eef8fb] px-4 py-6 text-center font-black text-[#1e6578]">
                Add photos of your boat or damage
              </div>
            </div>
            <button className="mt-5 w-full rounded-full bg-[#0d1b24] px-6 py-4 text-sm font-black text-white">Send request</button>
          </div>
        </div>
      </section>

      <footer className="bg-[#071015] px-5 py-8 text-center text-sm font-bold text-white/55">
        Boat Man Garage concept site • Customer status lookup demo
      </footer>
    </main>
  );
}

function StatusCard({ compact = false }: { compact?: boolean }) {
  return (
    <article className={`${compact ? 'mt-5' : ''} rounded-[2rem] border border-[#10202a]/10 bg-white p-6 shadow-sm`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[#348fad]">Status found</p>
          <h3 className="mt-1 text-3xl font-black">{customerStatus.boat}</h3>
          <p className="mt-1 font-bold text-[#66737d]">{customerStatus.customer}</p>
        </div>
        <span className="rounded-full bg-[#fff0d8] px-4 py-2 text-xs font-black text-[#8c5513]">{customerStatus.updated}</span>
      </div>
      <div className="mt-5 rounded-2xl bg-[#f6f2ea] p-5">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-[#7b8792]">Current status</p>
        <p className="mt-2 text-2xl font-black">{customerStatus.status}</p>
        <p className="mt-3 leading-7 text-[#43505a]">{customerStatus.note}</p>
      </div>
      <div className="mt-4 rounded-2xl bg-[#eaf7f1] p-4 font-black text-[#246344]">{customerStatus.next}</div>
    </article>
  );
}
