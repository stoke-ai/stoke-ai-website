'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type Slot = { start: string; end: string; label: string };

const boiseDateKeyFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/Boise',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

function boiseDateKey(value: string | Date) {
  const parts = boiseDateKeyFormatter.formatToParts(new Date(value));
  const year = parts.find((part) => part.type === 'year')?.value;
  const month = parts.find((part) => part.type === 'month')?.value;
  const day = parts.find((part) => part.type === 'day')?.value;
  return `${year}-${month}-${day}`;
}

function utcNoonFromDateKey(dateKey: string) {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day, 12));
}

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
    meetingPreference: 'Google Meet',
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

  const slotsByDate = useMemo(() => slots.reduce<Record<string, Slot[]>>((groups, slot) => {
    const key = boiseDateKey(slot.start);
    groups[key] = [...(groups[key] || []), slot];
    return groups;
  }, {}), [slots]);

  const availableDates = useMemo(() => Object.keys(slotsByDate).sort(), [slotsByDate]);
  const visibleTimes = selectedDate ? slotsByDate[selectedDate] || [] : [];
  const selectedSlotLabel = slots.find((slot) => slot.start === selectedSlot)?.label;

  useEffect(() => {
    if (!selectedDate && availableDates.length > 0) {
      setSelectedDate(availableDates[0]);
    }
  }, [availableDates, selectedDate]);

  const calendarDays = useMemo(() => {
    if (availableDates.length === 0) return [];
    const [year, month] = availableDates[0].split('-').map(Number);
    const first = new Date(Date.UTC(year, month - 1, 1, 12));
    const start = new Date(first);
    start.setUTCDate(first.getUTCDate() - first.getUTCDay());
    return Array.from({ length: 35 }, (_, index) => {
      const date = new Date(start);
      date.setUTCDate(start.getUTCDate() + index);
      const key = date.toISOString().slice(0, 10);
      return {
        key,
        day: date.getUTCDate(),
        inMonth: date.getUTCMonth() === month - 1,
        available: Boolean(slotsByDate[key]),
      };
    });
  }, [availableDates, slotsByDate]);

  const calendarMonthLabel = availableDates.length > 0
    ? new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(utcNoonFromDateKey(availableDates[0]))
    : '';

  const selectedDateLabel = selectedDate
    ? new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'UTC' }).format(utcNoonFromDateKey(selectedDate))
    : '';

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
          <Link href="/" className="inline-flex items-center">
            <Image src="/logo.png" alt="Stoke AI" width={220} height={75} priority />
          </Link>
          <Link href="/" className="text-sm text-gray-400 hover:text-orange-400">Back to site</Link>
        </nav>

        <section className="grid lg:grid-cols-[1fr_420px] gap-10 items-start">
          <div>
            <div className="inline-block mb-5 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-400 text-sm font-medium">
              Free · 90 minutes · Google Meet
            </div>
            <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6">
              Book a <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">Free 90-Minute AI Audit</span>
            </h1>
            <div className="space-y-4 text-lg text-gray-300 leading-relaxed max-w-2xl">
              <p>Book a free 90-minute Google Meet with Jeff to talk through where custom AI systems could save time, reduce manual work, or create more operating leverage in your business.</p>
              <p>This is a practical strategy conversation — not a sales demo. Jeff will learn how your team works, look for bottlenecks, and help identify whether an AI-powered workflow, assistant, or automation system makes sense for you.</p>
              <p className="text-orange-200">Please have one or two workflows in mind that you’d love to stop doing manually.</p>
            </div>

            <div className="mt-10 grid gap-3 min-[520px]:grid-cols-3">
              {[
                {
                  label: 'Workflow review',
                  detail: 'Walk the real process',
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                      <path d="M8 6h13" />
                      <path d="M8 12h13" />
                      <path d="M8 18h13" />
                      <path d="m3 6 .8.8L5.5 5" />
                      <path d="m3 12 .8.8 1.7-1.8" />
                      <path d="m3 18 .8.8 1.7-1.8" />
                    </svg>
                  ),
                },
                {
                  label: 'Bottleneck map',
                  detail: 'Find the expensive drag',
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                      <path d="M4 19V5" />
                      <path d="M4 7h12l-2 4 2 4H4" />
                      <path d="M18 19v-5" />
                      <path d="M14 19h8" />
                    </svg>
                  ),
                },
                {
                  label: 'AI system recommendations',
                  detail: 'Prioritized next build',
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                      <path d="M12 2a7 7 0 0 0-4 12.74V17h8v-2.26A7 7 0 0 0 12 2Z" />
                      <path d="M9 21h6" />
                      <path d="M10 17h4" />
                      <path d="M12 6v4l3 2" />
                    </svg>
                  ),
                },
              ].map((item, index) => (
                <div
                  key={item.label}
                  className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.045] p-4 shadow-2xl shadow-black/25 transition-all hover:-translate-y-0.5 hover:border-orange-400/50 hover:bg-orange-500/[0.07]"
                >
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-300/70 to-transparent" />
                  <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-orange-500/15 blur-2xl" />
                  <div className="relative flex items-start gap-3 min-[520px]:block">
                    <div className="mb-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-orange-400/30 bg-gradient-to-br from-orange-500/25 to-amber-400/10 text-orange-200 shadow-inner shadow-orange-500/20">
                      {item.icon}
                    </div>
                    <div>
                      <div className="mb-1 text-[0.62rem] font-black uppercase tracking-[0.22em] text-orange-300/75">0{index + 1}</div>
                      <div className="text-base font-black leading-snug text-white">{item.label}</div>
                      <div className="mt-1 text-xs font-medium leading-relaxed text-gray-400">{item.detail}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-gray-800 bg-black/60 backdrop-blur-sm p-6 shadow-2xl">
            {booked ? (
              <div className="py-8 text-center space-y-4">
                <div className="mx-auto w-14 h-14 rounded-full bg-orange-500 text-black flex items-center justify-center text-2xl font-black">✓</div>
                <h2 className="text-2xl font-bold">You’re booked.</h2>
                <p className="text-gray-300">Jeff has your workflow notes. You’ll receive a Google Meet confirmation shortly.</p>
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
                    <div className="rounded-2xl border border-gray-800 bg-[#0f0f0f] p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs uppercase tracking-wide text-gray-500">Select a date</div>
                          <div className="text-lg font-semibold text-white">{calendarMonthLabel}</div>
                        </div>
                        <div className="text-xs text-gray-500">Mountain Time</div>
                      </div>

                      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => <div key={day}>{day}</div>)}
                      </div>

                      <div className="grid grid-cols-7 gap-1">
                        {calendarDays.map((day) => {
                          const active = selectedDate === day.key;
                          return (
                            <button
                              key={day.key}
                              type="button"
                              disabled={!day.available}
                              onClick={() => { setSelectedDate(day.key); setSelectedSlot(''); }}
                              className={`relative aspect-square rounded-lg border text-sm font-semibold transition ${
                                active
                                  ? 'border-orange-400 bg-gradient-to-br from-orange-500 to-amber-500 text-black shadow-lg shadow-orange-500/20'
                                  : day.available
                                    ? 'border-gray-700 bg-black/60 text-white hover:border-orange-500/70 hover:bg-orange-500/10'
                                    : 'border-transparent text-gray-700 cursor-not-allowed'
                              } ${!day.inMonth ? 'opacity-40' : ''}`}
                            >
                              {day.day}
                              {day.available && !active && <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-orange-400" />}
                            </button>
                          );
                        })}
                      </div>

                      {selectedDate && (
                        <div className="border-t border-gray-800 pt-4 space-y-3">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <div className="text-xs uppercase tracking-wide text-gray-500">Available times</div>
                              <div className="font-semibold text-white">{selectedDateLabel}</div>
                            </div>
                            {selectedSlotLabel && <div className="text-xs text-orange-300">Selected: {selectedSlotLabel.split(', ').pop()}</div>}
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {visibleTimes.map((slot) => {
                              const active = selectedSlot === slot.start;
                              return (
                                <button
                                  key={slot.start}
                                  type="button"
                                  onClick={() => setSelectedSlot(slot.start)}
                                  className={`rounded-lg border px-3 py-2.5 font-semibold transition ${active ? 'border-orange-400 bg-orange-500 text-black' : 'border-gray-800 bg-black/70 text-white hover:border-orange-500/60'}`}
                                >
                                  {formatTimeButton(slot)}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
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
                  <label className="block text-sm text-gray-400 mb-2">Preferred meeting note</label>
                  <input
                    value={form.meetingPreference}
                    onChange={(e) => updateForm('meetingPreference', e.target.value)}
                    className="w-full bg-[#111] border border-gray-700 rounded-xl px-4 py-3 text-white"
                  />
                  <p className="mt-2 text-xs text-gray-500">Default is web conference. Add anything useful before the call.</p>
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
                  {submitting ? 'Booking…' : 'Book Free AI Audit'}
                </button>
              </form>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
