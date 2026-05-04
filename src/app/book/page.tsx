'use client';

import { FormEvent, useEffect, useState } from 'react';
import Image from 'next/image';
import AddressAutocomplete from '@/components/AddressAutocomplete';

type Slot = { start: string; end: string; label: string };

export default function BookPage() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [configured, setConfigured] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [booked, setBooked] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    business: '',
    email: '',
    phone: '',
    officeAddress: '',
    workflows: '',
    tools: '',
  });

  useEffect(() => {
    fetch('/api/booking/availability?days=21')
      .then((res) => res.json())
      .then((data) => {
        setSlots(data.slots || []);
        setConfigured(data.configured !== false);
      })
      .catch(() => setConfigured(false))
      .finally(() => setLoadingSlots(false));
  }, []);

  const updateForm = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const slotsByDate = slots.reduce<Record<string, Slot[]>>((groups, slot) => {
    const key = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/Boise',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date(slot.start));
    groups[key] = [...(groups[key] || []), slot];
    return groups;
  }, {});

  const availableDates = Object.keys(slotsByDate);
  const visibleTimes = selectedDate ? slotsByDate[selectedDate] || [] : [];

  useEffect(() => {
    if (!selectedDate && availableDates.length > 0) {
      setSelectedDate(availableDates[0]);
    }
  }, [availableDates, selectedDate]);

  const formatDateButton = (dateKey: string) => {
    const [year, month, day] = dateKey.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day, 12));
    const weekday = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Boise', weekday: 'short' }).format(date);
    const monthDay = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Boise', month: 'short', day: 'numeric' }).format(date);
    return { weekday, monthDay };
  };

  const formatTimeButton = (slot: Slot) => new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Boise',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(slot.start));

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const response = await fetch('/api/booking/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, slotStart: selectedSlot }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Booking failed');
      }

      setBooked(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Booking failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 -left-40 w-96 h-96 bg-orange-500 rounded-full mix-blend-screen filter blur-[128px]" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-600 rounded-full mix-blend-screen filter blur-[128px]" />
      </div>

      <main className="relative z-10 container mx-auto px-6 py-8 max-w-5xl">
        <nav className="mb-12 flex items-center justify-between">
          <a href="/" className="inline-flex items-center">
            <Image src="/logo.png" alt="Stoke AI" width={220} height={75} priority />
          </a>
          <a href="/" className="text-sm text-gray-400 hover:text-orange-400">Back to site</a>
        </nav>

        <section className="grid lg:grid-cols-[1fr_420px] gap-10 items-start">
          <div>
            <div className="inline-block mb-5 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-400 text-sm font-medium">
              In-person · 90 minutes · Jeff comes to your office
            </div>
            <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6">
              Book an <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">AI Strategy Audit</span>
            </h1>
            <div className="space-y-4 text-lg text-gray-300 leading-relaxed max-w-2xl">
              <p>Book an in-person appointment with Jeff to talk through where custom AI systems could save time, reduce manual work, or create more operating leverage in your business.</p>
              <p>This is a practical strategy conversation — not a sales demo. Jeff will come to your office, learn how your team works, look for bottlenecks, and help identify whether an AI-powered workflow, assistant, or automation system makes sense for you.</p>
              <p className="text-orange-200">Please have one or two workflows in mind that you’d love to stop doing manually.</p>
            </div>

            <div className="mt-10 grid sm:grid-cols-3 gap-4">
              {['Office workflow review', 'Bottleneck map', 'AI system recommendations'].map((item) => (
                <div key={item} className="rounded-2xl border border-gray-800 bg-black/40 p-4 text-gray-300">
                  <div className="text-orange-400 mb-2">✓</div>
                  <div className="font-semibold text-white">{item}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-gray-800 bg-black/60 backdrop-blur-sm p-6 shadow-2xl">
            {booked ? (
              <div className="py-8 text-center space-y-4">
                <div className="mx-auto w-14 h-14 rounded-full bg-orange-500 text-black flex items-center justify-center text-2xl font-black">✓</div>
                <h2 className="text-2xl font-bold">You’re booked.</h2>
                <p className="text-gray-300">Jeff has the office address and workflow notes. You’ll receive a confirmation shortly.</p>
              </div>
            ) : !configured ? (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Calendar setup is almost ready</h2>
                <p className="text-gray-300">The branded booking page is in place. Until production Google Calendar credentials are connected, use the live Google booking link.</p>
                <a className="block text-center bg-gradient-to-r from-orange-500 to-amber-500 text-black font-bold py-3 px-5 rounded-xl" href="https://calendar.app.google/YeqJLsyJHv1SQeXQ6">Open current booking link</a>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                <h2 className="text-2xl font-bold">Choose a time</h2>
                <div className="space-y-3">
                  <label className="block text-sm text-gray-400">Available appointments</label>
                  {loadingSlots ? (
                    <div className="text-gray-400">Loading available times…</div>
                  ) : availableDates.length === 0 ? (
                    <div className="rounded-xl border border-gray-800 bg-[#111] p-4 text-gray-300">No available appointments are showing right now. Try again later or use the current Google booking link.</div>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {availableDates.map((dateKey) => {
                          const label = formatDateButton(dateKey);
                          const active = selectedDate === dateKey;
                          return (
                            <button
                              key={dateKey}
                              type="button"
                              onClick={() => { setSelectedDate(dateKey); setSelectedSlot(''); }}
                              className={`rounded-xl border px-3 py-3 text-left transition ${active ? 'border-orange-400 bg-orange-500/20 text-white' : 'border-gray-800 bg-[#111] text-gray-300 hover:border-orange-500/50'}`}
                            >
                              <div className="text-xs uppercase tracking-wide text-gray-500">{label.weekday}</div>
                              <div className="font-semibold">{label.monthDay}</div>
                              <div className="text-xs text-gray-500">{slotsByDate[dateKey].length} times</div>
                            </button>
                          );
                        })}
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {visibleTimes.map((slot) => {
                          const active = selectedSlot === slot.start;
                          return (
                            <button
                              key={slot.start}
                              type="button"
                              onClick={() => setSelectedSlot(slot.start)}
                              className={`rounded-xl border px-3 py-3 font-semibold transition ${active ? 'border-orange-400 bg-gradient-to-r from-orange-500 to-amber-500 text-black' : 'border-gray-800 bg-[#111] text-white hover:border-orange-500/50'}`}
                            >
                              {formatTimeButton(slot)}
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>

                {([
                  ['name', 'Your name'],
                  ['business', 'Business name'],
                  ['email', 'Email'],
                  ['phone', 'Phone'],
                ] as const).map(([field, label]) => (
                  <div key={field}>
                    <label className="block text-sm text-gray-400 mb-2">{label}</label>
                    <input required value={form[field]} onChange={(e) => updateForm(field, e.target.value)} className="w-full bg-[#111] border border-gray-700 rounded-xl px-4 py-3 text-white" />
                  </div>
                ))}

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Office address for Jeff to visit</label>
                  <AddressAutocomplete
                    required
                    value={form.officeAddress}
                    onChange={(value) => updateForm('officeAddress', value)}
                  />
                  <p className="mt-2 text-xs text-gray-500">Start typing and select the matching address so Jeff has the right location.</p>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">One or two workflows you’d love to stop doing manually</label>
                  <textarea required rows={4} value={form.workflows} onChange={(e) => updateForm('workflows', e.target.value)} className="w-full bg-[#111] border border-gray-700 rounded-xl px-4 py-3 text-white" />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Current tools/systems you use <span className="text-gray-600">optional</span></label>
                  <input value={form.tools} onChange={(e) => updateForm('tools', e.target.value)} className="w-full bg-[#111] border border-gray-700 rounded-xl px-4 py-3 text-white" />
                </div>

                {error && <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">{error}</div>}

                <button disabled={submitting || !selectedSlot} className="w-full bg-gradient-to-r from-orange-500 to-amber-500 disabled:opacity-50 text-black font-bold py-4 px-5 rounded-xl">
                  {submitting ? 'Booking…' : 'Book AI Strategy Audit'}
                </button>
              </form>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
