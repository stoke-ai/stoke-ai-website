'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    business: '',
    website: '',
    painPoint: '',
    painPointOther: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [aiInsight, setAiInsight] = useState('');
  const [showSchedule, setShowSchedule] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleHour, setScheduleHour] = useState('12');
  const [scheduleMinute, setScheduleMinute] = useState('00');
  const [scheduleAmPm, setScheduleAmPm] = useState('PM');
  const [scheduled, setScheduled] = useState(false);

  const generateInsight = (business: string): string => {
    const b = business.toLowerCase();
    if (b.includes('farm') || b.includes('ag') || b.includes('ranch') || b.includes('crop')) {
      return 'Agriculture businesses lose expensive time to repeat data entry, missed handoffs, and seasonal chaos. A custom AI system can organize the work before it becomes another fire drill.';
    }
    if (b.includes('truck') || b.includes('logistics') || b.includes('dispatch') || b.includes('freight')) {
      return 'Logistics teams cannot afford spreadsheet mistakes. The right AI-backed operating system can tighten dispatch, maintenance tracking, and handoffs so fewer things slip through the cracks.';
    }
    if (b.includes('insurance') || b.includes('agent') || b.includes('policy')) {
      return 'Insurance agencies drown in renewal prep and repetitive account review. A custom system can turn hours of manual work into a repeatable workflow your team can trust.';
    }
    return 'Most local businesses do not need more software to learn. They need the daily bottlenecks mapped, simplified, and automated so the team can execute without constant cleanup.';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const painPoint = formData.painPoint === 'other' ? formData.painPointOther : formData.painPoint;
      const res = await fetch('/api/lead-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          business: formData.business,
          website: formData.website,
          painPoint,
          action: 'free-ai-audit-request',
        }),
      });

      if (!res.ok) throw new Error('Failed to submit');

      setAiInsight(generateInsight(formData.business));
      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSchedule = async () => {
    try {
      await fetch('/api/lead-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          business: formData.business,
          website: formData.website,
          painPoint: formData.painPoint === 'other' ? formData.painPointOther : formData.painPoint,
          action: 'schedule',
          scheduleDate,
          scheduleTime: (() => {
            let h = parseInt(scheduleHour);
            if (scheduleAmPm === 'PM' && h !== 12) h += 12;
            if (scheduleAmPm === 'AM' && h === 12) h = 0;
            return `${h.toString().padStart(2, '0')}:${scheduleMinute}`;
          })(),
          scheduleTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }),
      });
      setScheduled(true);
    } catch {
      // Silent fail — the initial submission already captured their info.
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white overflow-hidden">
      <div className="fixed inset-0 opacity-25 pointer-events-none">
        <div className="absolute -top-24 -left-32 w-96 h-96 bg-orange-500 rounded-full mix-blend-screen filter blur-[128px]" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-600 rounded-full mix-blend-screen filter blur-[128px]" />
      </div>

      <div className="relative z-10">
        <nav className="container mx-auto px-6 py-5 sm:py-6 flex justify-center sm:justify-between items-center gap-6">
          <a href="#top" aria-label="Stoke AI home" className="block w-40 sm:w-44 md:w-64">
            <Image
              src="/logo.png"
              alt="Stoke AI"
              width={500}
              height={170}
              priority
              className="w-full h-auto"
            />
          </a>
          <a
            href="#contact"
            className="hidden sm:inline-flex items-center justify-center bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500 text-black font-black py-3 px-6 rounded-full transition-all hover:scale-105 hover:shadow-lg hover:shadow-orange-500/25"
          >
            Talk Through What’s Possible
          </a>
        </nav>

        {/* Section 1: The Hero Section */}
        <header id="top" className="container mx-auto px-6 pt-4 pb-16 md:pt-20 md:pb-28">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-8 lg:gap-12 items-center">
            <div className="max-w-5xl text-center lg:text-left">
              <div className="inline-flex mb-5 px-3 sm:px-4 py-2 bg-orange-500/10 border border-orange-500/25 rounded-full text-orange-300 text-xs sm:text-sm font-semibold">
                AI partner for established local businesses
              </div>
              <h1 className="text-[2.55rem] sm:text-5xl md:text-7xl font-black leading-[0.94] tracking-tight mb-5 md:mb-8 max-w-4xl">
                We Build AI Systems That Give Your Team More Capacity.
              </h1>
              <div className="relative mb-6 lg:hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/25 to-amber-500/10 rounded-[1.75rem] blur-3xl" />
                <Image
                  src="/hero-ai-impact-audit.jpg"
                  alt="Stoke AI builds practical custom AI systems for local business operations"
                  width={900}
                  height={900}
                  priority
                  className="relative w-full aspect-[4/3] rounded-[1.75rem] border border-orange-500/20 shadow-2xl shadow-black/40 object-cover"
                />
              </div>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-300 leading-relaxed max-w-3xl mx-auto lg:mx-0 mb-7 md:mb-10">
                Off-the-shelf software doesn&apos;t fix local, heavy-duty businesses. We build custom, automated workflows that eliminate human error, drastically reduce your overhead, and run your daily operations on autopilot.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 items-center lg:items-start sm:items-center justify-center lg:justify-start">
                <a
                  href="#contact"
                  className="w-full sm:w-auto inline-flex items-center justify-center bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500 text-black font-black py-4 sm:py-5 px-8 rounded-full text-lg transition-all hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/30"
                >
                  Talk Through What’s Possible
                </a>
                <p className="text-sm text-gray-500 max-w-sm">
                  Built for established local businesses with real operational complexity.
                </p>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/25 to-amber-500/10 rounded-[2rem] blur-3xl" />
              <Image
                src="/hero-ai-impact-audit.jpg"
                alt="Stoke AI builds practical custom AI systems for local business operations"
                width={900}
                height={900}
                priority
                className="relative w-full rounded-[2rem] border border-orange-500/20 shadow-2xl shadow-black/40 object-cover"
              />
            </div>
          </div>
        </header>

        {/* Section 2: Local Proof */}
        <section className="bg-[#16120f] border-y border-orange-500/10 py-20 md:py-28">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mb-12">
              <h2 className="text-3xl md:text-5xl font-black mb-5">
                Real Results for Magic Valley Businesses.
              </h2>
              <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
                Off-the-shelf software rarely fits how established local businesses actually operate. Stoke AI helps teams turn repetitive paperwork, messy spreadsheets, follow-ups, scheduling, reporting, and internal handoffs into practical systems that create more capacity without adding more chaos.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 items-stretch">
              <article className="relative bg-gradient-to-br from-gray-900/95 via-black to-orange-950/25 border border-orange-500/20 rounded-[2rem] p-7 md:p-8 shadow-2xl shadow-black/25 overflow-hidden">
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl" />
                <div className="relative flex items-center gap-5 mb-7">
                  <Image
                    src="/testimonial-rachel-hansen.jpg"
                    alt="Rachel from Hansen Insurance Agency"
                    width={160}
                    height={160}
                    className="w-24 h-24 md:w-28 md:h-28 rounded-2xl object-cover object-top border border-orange-500/30 shadow-xl shadow-black/30"
                  />
                  <div>
                    <p className="text-orange-300 font-black text-xl md:text-2xl leading-tight mb-2">Giving the Office Its Capacity Back</p>
                    <p className="text-gray-400 font-semibold">Rachel · Hansen Insurance Agency</p>
                  </div>
                </div>
                <div className="relative bg-black/35 border border-gray-800/80 rounded-3xl p-6 md:p-7">
                  <div className="text-orange-400/35 text-6xl font-black leading-none mb-1" aria-hidden="true">“</div>
                  <blockquote className="text-lg md:text-xl text-gray-100 font-semibold leading-relaxed">
                    Before Stoke AI, my team was buried in manual data entry. Prepping a single policy renewal took 30 minutes of brute-force typing. Jeff built a custom automated system that lets us do 30 renewals in that exact same 30 minutes. He didn&apos;t just give us a piece of software; he gave my office our capacity back.
                  </blockquote>
                </div>
              </article>

              <article className="relative bg-gradient-to-br from-gray-900/95 via-black to-orange-950/25 border border-orange-500/20 rounded-[2rem] p-7 md:p-8 shadow-2xl shadow-black/25 overflow-hidden">
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl" />
                <div className="relative flex items-center gap-5 mb-7">
                  <Image
                    src="/testimonial-bryce-morgan.jpg"
                    alt="Bryce from Handy Truck Line"
                    width={160}
                    height={160}
                    className="w-24 h-24 md:w-28 md:h-28 rounded-2xl object-cover object-top border border-orange-500/30 shadow-xl shadow-black/30"
                  />
                  <div>
                    <p className="text-orange-300 font-black text-xl md:text-2xl leading-tight mb-2">Escaping the Google Sheets Trap</p>
                    <p className="text-gray-400 font-semibold">Bryce · Handy Truck Line</p>
                  </div>
                </div>
                <div className="relative bg-black/35 border border-gray-800/80 rounded-3xl p-6 md:p-7">
                  <div className="text-orange-400/35 text-6xl font-black leading-none mb-1" aria-hidden="true">“</div>
                  <blockquote className="text-lg md:text-xl text-gray-100 font-semibold leading-relaxed">
                    We ran dispatch on Google Sheets for a long time, and it worked — until the business outgrew it. As we kept growing, the manual data entry started becoming a ceiling. Jeff is turning that into a custom automated system built around how we actually operate. But the biggest ROI so far has been the shift in how we think. Partnering with Stoke AI showed us what&apos;s actually possible. Jeff inspired me to start using AI myself to build custom truck and tire maintenance trackers. He doesn&apos;t just implement AI — he upgrades how you look at your business.
                  </blockquote>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* Section 3: How It Works */}
        <section id="how" className="container mx-auto px-6 py-20 md:py-28">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl md:text-5xl font-black mb-5">
              How Stoke AI Works
              <br />
              <span className="bg-gradient-to-r from-orange-300 to-amber-400 bg-clip-text text-transparent">With Your Team</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
              You don’t need another app to babysit or another consultant handing you ideas. We give your team a simple way to capture bottlenecks, choose the next priority, and turn practical AI opportunities into working systems.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Your Private Build Queue.',
                desc: 'Your team gets one organized place to submit bottlenecks, ideas, and AI opportunities. We help sort the noise, clarify the priority, and keep the next build visible.',
              },
              {
                title: 'One Priority at a Time.',
                desc: 'Instead of trying to overhaul everything at once, we focus on the highest-leverage system first. You see steady progress, clear updates, and working improvements your team can actually use.',
              },
              {
                title: 'Built Around Your Business.',
                desc: 'No generic templates or software bloat. We build around how your team already works, then improve the workflows, handoffs, and repeatable tasks that create the most operational drag.',
              },
            ].map((step, index) => (
              <div key={step.title} className="relative bg-gradient-to-br from-gray-900/90 to-black border border-gray-800 rounded-3xl p-8 md:p-10 hover:border-orange-500/40 transition-colors">
                <div className="absolute -top-4 -right-4 w-14 h-14 rounded-2xl bg-orange-500 text-black font-black flex items-center justify-center shadow-lg shadow-orange-500/20">
                  {index + 1}
                </div>
                <div className="mb-7 w-14 h-14 rounded-2xl border border-orange-500/30 bg-orange-500/10 flex items-center justify-center text-orange-300" aria-hidden="true">
                  {index === 0 && (
                    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M8 4h8" />
                      <path d="M9 2h6a1 1 0 0 1 1 1v2H8V3a1 1 0 0 1 1-1Z" />
                      <path d="M6 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1" />
                      <path d="M8 11h8" />
                      <path d="M8 16h5" />
                    </svg>
                  )}
                  {index === 1 && (
                    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M13 2 4 14h7l-1 8 10-13h-7l0-7Z" />
                    </svg>
                  )}
                  {index === 2 && (
                    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M8 5v14" />
                      <path d="M16 5v14" />
                      <path d="M4 12h4" />
                      <path d="M16 12h4" />
                    </svg>
                  )}
                </div>
                <h3 className="text-2xl font-black mb-4">{step.title}</h3>
                <p className="text-gray-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <a
              href="#contact"
              className="inline-flex items-center justify-center bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500 text-black font-black py-5 px-8 rounded-full text-lg transition-all hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/30"
            >
              Talk Through What’s Possible
            </a>
          </div>
        </section>

        {/* Section 4: How We Turn Bottlenecks Into Working Systems */}
        <section className="bg-gradient-to-b from-black via-orange-950/10 to-black border-y border-gray-800 py-20 md:py-28">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-4xl mx-auto mb-12">
              <h2 className="text-3xl md:text-5xl font-black mb-5">
                How We Turn Bottlenecks Into Working Systems
              </h2>
              <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
                We start with the way your business actually works, then identify where AI, automation, or better systems could create the most breathing room for your team.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6 max-w-7xl mx-auto items-stretch">
              <article className="relative lg:scale-[1.03] rounded-[2rem] border border-orange-500/45 bg-gradient-to-br from-gray-900 via-black to-orange-950/45 p-7 md:p-8 shadow-2xl shadow-orange-950/25 overflow-hidden">
                <div className="absolute top-0 right-0 w-56 h-56 bg-orange-500/15 rounded-full blur-3xl" />
                <div className="relative">
                  <p className="inline-flex mb-4 px-3 py-1 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-200 text-sm font-bold">
                    First conversation
                  </p>
                  <h3 className="text-2xl md:text-3xl font-black mb-4">
                    Step 1: Talk Through What&apos;s Possible
                  </h3>
                  <p className="hidden lg:block text-4xl font-black text-white mb-4">
                    Practical <span className="text-lg text-gray-300 font-bold">AI conversation</span>
                  </p>
                  <p className="hidden lg:block text-amber-200 italic leading-relaxed bg-orange-500/10 border border-orange-500/25 rounded-2xl p-4 mb-6">
                    No generic AI pitch. We look at your real workflows and talk through where AI could actually help.
                  </p>
                  <div className="grid gap-4 mb-8">
                    {[
                      {
                        eyebrow: '01',
                        title: 'Bottleneck Map',
                        desc: 'Where time, attention, and follow-through are leaking.',
                        icon: (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                            <path d="M4 19V5" />
                            <path d="M4 7h12l-2 4 2 4H4" />
                            <path d="M18 19v-5" />
                            <path d="M14 19h8" />
                          </svg>
                        ),
                      },
                      {
                        eyebrow: '02',
                        title: 'AI Opportunity',
                        desc: 'Where AI or automation could support your team without disrupting how they work.',
                        icon: (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                            <path d="M13 2 4 14h7l-1 8 10-13h-7l0-7Z" />
                          </svg>
                        ),
                      },
                      {
                        eyebrow: '03',
                        title: 'First Systems Priority',
                        desc: 'The first practical system worth exploring.',
                        icon: (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                            <path d="M9 18h6" />
                            <path d="M10 22h4" />
                            <path d="M12 2a7 7 0 0 0-4 12.74V17h8v-2.26A7 7 0 0 0 12 2Z" />
                            <path d="M12 6v4l3 2" />
                          </svg>
                        ),
                      },
                    ].map((item) => (
                      <div
                        key={item.title}
                        className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.045] p-4 shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-0.5 hover:border-orange-400/55 hover:bg-orange-500/[0.075]"
                      >
                        <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-orange-300 via-orange-500 to-amber-400 opacity-70" />
                        <div className="absolute -right-12 -top-12 h-28 w-28 rounded-full bg-orange-500/10 blur-2xl transition-opacity group-hover:opacity-100" />
                        <div className="relative flex gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-orange-400/30 bg-gradient-to-br from-orange-500/25 to-amber-400/10 text-orange-200 shadow-inner shadow-orange-500/10">
                            {item.icon}
                          </div>
                          <div>
                            <div className="mb-1 flex items-center gap-2">
                              <span className="text-[0.65rem] font-black tracking-[0.22em] text-orange-300/80">{item.eyebrow}</span>
                              <span className="h-px w-8 bg-orange-400/30" />
                              <span className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-amber-100/60">included</span>
                            </div>
                            <h4 className="text-lg font-black text-white">{item.title}</h4>
                            <p className="mt-1 text-sm leading-relaxed text-gray-300">{item.desc}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </article>

              <article className="rounded-[2rem] border border-gray-800 bg-gray-950/70 p-7 md:p-8 shadow-xl shadow-black/20">
                <div className="w-12 h-12 rounded-2xl bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-200 font-black mb-6">
                  2
                </div>
                <h3 className="text-2xl md:text-3xl font-black mb-5">
                  Step 2: Choose the First Build
                </h3>
                <p className="text-gray-300 leading-relaxed text-lg">
                  We help separate useful AI opportunities from distractions, then identify the first system that would create visible relief for your team. Sometimes that&apos;s a workflow, sometimes it&apos;s an automation, and sometimes it&apos;s simply a better way for information to move through the business.
                </p>
              </article>

              <article className="rounded-[2rem] border border-gray-800 bg-gray-950/70 p-7 md:p-8 shadow-xl shadow-black/20">
                <div className="w-12 h-12 rounded-2xl bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-200 font-black mb-6">
                  3
                </div>
                <h3 className="text-2xl md:text-3xl font-black mb-4">
                  Step 3: Build the System With Your Team
                </h3>
                <p className="text-gray-300 leading-relaxed text-lg mb-6">
                  If there&apos;s a fit, Stoke AI works alongside your team to build the workflow, automation, or internal system one priority at a time — with clear updates and a simple place to track progress.
                </p>
                <p className="text-sm text-gray-300 leading-relaxed border-t border-gray-800 pt-5">
                  The goal is not to replace your people. The goal is to give them better systems around the work they already do.
                </p>
              </article>
            </div>

            <div className="lg:hidden max-w-2xl mx-auto mt-6 rounded-[2rem] border border-orange-500/40 bg-gradient-to-br from-gray-900 via-black to-orange-950/45 p-7 shadow-2xl shadow-orange-950/25">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-300 mb-3">
                Start here
              </p>
              <p className="text-4xl font-black text-white mb-4">
                Practical <span className="text-lg text-gray-300 font-bold">AI Conversation</span>
              </p>
              <p className="text-amber-200 italic leading-relaxed bg-orange-500/10 border border-orange-500/25 rounded-2xl p-4">
                We look at your real workflows and talk through where AI could actually help.
              </p>
            </div>

            <div className="text-center mt-12">
              <a
                href="#contact"
                className="whitespace-nowrap inline-flex items-center justify-center bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500 text-black font-black py-4 px-10 rounded-full text-lg transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-orange-500/25"
              >
                Talk Through What’s Possible
              </a>
            </div>
          </div>
        </section>

        {/* CTA / Lead Capture */}
        <section id="contact" className="container mx-auto px-6 py-20 md:py-28">
          <div className="max-w-5xl mx-auto bg-gradient-to-br from-gray-900 via-gray-900 to-orange-950/30 border border-gray-800 rounded-3xl p-8 md:p-12 shadow-2xl shadow-black/25">
            <div className="grid md:grid-cols-2 gap-10 md:gap-14">
              <div>
                <p className="text-orange-300 font-bold mb-3">Practical AI Conversation</p>
                <h2 className="text-3xl md:text-5xl font-black mb-5">
                  Let&apos;s talk through what AI could actually do for your business.
                </h2>
                <p className="text-gray-300 text-lg leading-relaxed mb-7">
                  Most local businesses have only scratched the surface of AI. ChatGPT is useful, but the real leverage comes when AI is connected to your workflows, follow-ups, quoting, scheduling, reporting, customer communication, and internal systems.
                </p>
                <div className="space-y-4 text-gray-300">
                  <div className="flex gap-3">
                    <span className="text-orange-400 font-black">✓</span>
                    <span>A practical conversation about your actual business</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-orange-400 font-black">✓</span>
                    <span>Where AI could give your team more capacity</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-orange-400 font-black">✓</span>
                    <span>No pressure, no generic AI pitch</span>
                  </div>
                </div>
              </div>

              <div>
                {submitted ? (
                  <div className="h-full flex flex-col justify-center p-2">
                    <div className="text-center mb-5">
                      <div className="text-4xl mb-3">🔥</div>
                      <h3 className="text-2xl font-bold mb-2">You&apos;re in. Now let&apos;s talk through what&apos;s possible.</h3>
                      <p className="text-gray-400 text-sm">
                        Spark can start a short AI discovery conversation right now — or you can schedule it for when it works for you.
                      </p>
                    </div>
                    {aiInsight && (
                      <div className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/20 rounded-xl p-3 mb-5">
                        <div className="text-xs text-orange-400 font-semibold mb-1 flex items-center gap-2">
                          <span>⚡</span> Quick take on your business
                        </div>
                        <p className="text-gray-300 text-xs leading-relaxed">{aiInsight}</p>
                      </div>
                    )}
                    <div className="space-y-3">
                      <a
                        href={`/discovery?name=${encodeURIComponent(formData.name)}&business=${encodeURIComponent(formData.business)}&painPoint=${encodeURIComponent(formData.painPoint === 'other' ? formData.painPointOther : formData.painPoint)}&email=${encodeURIComponent(formData.email)}&phone=${encodeURIComponent(formData.phone)}`}
                        className="block w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-black font-bold py-4 px-6 rounded-xl text-center text-lg transition-all transform hover:scale-[1.02] hover:shadow-lg hover:shadow-orange-500/25"
                      >
                        Start My AI Discovery Now
                        <span className="text-black/60 text-xs font-normal block mt-1">5-minute voice assessment — get results instantly</span>
                      </a>
                      <button
                        onClick={() => setShowSchedule(true)}
                        className="block w-full border border-gray-700 hover:border-orange-500/50 text-white font-semibold py-4 px-6 rounded-xl text-center text-lg transition-all hover:bg-orange-500/5"
                      >
                        Schedule for Later
                        <span className="text-gray-500 text-xs font-normal block mt-1">Pick a time that works for you</span>
                      </button>
                    </div>
                    {showSchedule && (
                      <div className="mt-4 space-y-3">
                        <div>
                          <label className="text-gray-400 text-xs mb-1 block">Pick a date</label>
                          <input
                            type="date"
                            className="w-full px-3 py-2 bg-gray-800 border border-orange-500/30 rounded-xl focus:outline-none focus:border-orange-500 transition-colors text-white text-sm cursor-pointer [color-scheme:dark]"
                            min={new Date(Date.now() - 86400000).toISOString().split('T')[0]}
                            value={scheduleDate}
                            onChange={(e) => setScheduleDate(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="text-gray-400 text-xs mb-1 block">Pick a time</label>
                          <div className="flex gap-1">
                            <select className="px-2 py-2 bg-gray-800 border border-orange-500/30 rounded-xl focus:outline-none focus:border-orange-500 transition-colors text-white text-sm cursor-pointer" value={scheduleHour} onChange={(e) => setScheduleHour(e.target.value)}>
                              {['12','1','2','3','4','5','6','7','8','9','10','11'].map(h => <option key={h} value={h}>{h}</option>)}
                            </select>
                            <select className="px-2 py-2 bg-gray-800 border border-orange-500/30 rounded-xl focus:outline-none focus:border-orange-500 transition-colors text-white text-sm cursor-pointer" value={scheduleMinute} onChange={(e) => setScheduleMinute(e.target.value)}>
                              <option value="00">:00</option>
                              <option value="15">:15</option>
                              <option value="30">:30</option>
                              <option value="45">:45</option>
                            </select>
                            <select className="px-2 py-2 bg-gray-800 border border-orange-500/30 rounded-xl focus:outline-none focus:border-orange-500 transition-colors text-white text-sm cursor-pointer" value={scheduleAmPm} onChange={(e) => setScheduleAmPm(e.target.value)}>
                              <option value="AM">AM</option>
                              <option value="PM">PM</option>
                            </select>
                          </div>
                        </div>
                        <button
                          onClick={handleSchedule}
                          disabled={!scheduleDate}
                          className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-3 px-6 rounded-xl transition-all"
                        >
                          {scheduled ? '✓ Scheduled! Check your email for confirmation.' : 'Confirm Time →'}
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                      type="text"
                      placeholder="Your name"
                      required
                      className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-xl focus:outline-none focus:border-orange-500 transition-colors placeholder-gray-600"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      required
                      className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-xl focus:outline-none focus:border-orange-500 transition-colors placeholder-gray-600"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    <input
                      type="tel"
                      placeholder="Phone (fastest way to reach you)"
                      className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-xl focus:outline-none focus:border-orange-500 transition-colors placeholder-gray-600"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                    <input
                      type="text"
                      placeholder="What kind of business do you run?"
                      required
                      className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-xl focus:outline-none focus:border-orange-500 transition-colors placeholder-gray-600"
                      value={formData.business}
                      onChange={(e) => setFormData({ ...formData, business: e.target.value })}
                    />
                    <select
                      className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-xl focus:outline-none focus:border-orange-500 transition-colors text-gray-400"
                      value={formData.painPoint}
                      onChange={(e) => setFormData({ ...formData, painPoint: e.target.value })}
                    >
                      <option value="" disabled>Where do you feel the most operational drag? (optional)</option>
                      <option value="Human error and rework">Human error and rework</option>
                      <option value="Manual paperwork and data entry">Manual paperwork and data entry</option>
                      <option value="Follow-ups and team handoffs">Follow-ups and team handoffs</option>
                      <option value="Scheduling, dispatch, or tracking">Scheduling, dispatch, or tracking</option>
                      <option value="All of the above">Honestly, all of the above</option>
                      <option value="other">Something else</option>
                    </select>
                    {formData.painPoint === 'other' && (
                      <input
                        type="text"
                        placeholder="Tell me more..."
                        className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-xl focus:outline-none focus:border-orange-500 transition-colors placeholder-gray-600"
                        value={formData.painPointOther}
                        onChange={(e) => setFormData({ ...formData, painPointOther: e.target.value })}
                      />
                    )}
                    <input
                      type="text"
                      placeholder="Your website URL (optional)"
                      className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-xl focus:outline-none focus:border-orange-500 transition-colors placeholder-gray-600"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    />
                    {error && <div className="text-red-400 text-sm text-center">{error}</div>}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-black font-black py-4 px-8 rounded-xl text-lg transition-all transform hover:scale-[1.02] hover:shadow-lg hover:shadow-orange-500/25"
                    >
                      {submitting ? 'Sending...' : 'Talk Through What’s Possible →'}
                    </button>
                    <p className="text-gray-500 text-xs text-center">
                      No pressure, no generic AI pitch — just a practical conversation about where your business is losing time.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>

        <footer className="border-t border-gray-800 py-12">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div>
                <Image src="/logo.png" alt="Stoke AI" width={280} height={96} className="mb-4" />
                <p className="text-gray-400 text-sm mb-4">
                  Fractional AI CTO services for practical, blue-collar businesses that need execution — not more software noise.
                </p>
                <p className="text-gray-500 text-sm">Burley, Idaho · Serving the Magic Valley and beyond</p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2">
                  <li><a href="#contact" className="text-gray-400 hover:text-orange-500 text-sm">Talk Through What’s Possible</a></li>
                  <li><a href="#how" className="text-gray-400 hover:text-orange-500 text-sm">How It Works</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">Get In Touch</h4>
                <ul className="space-y-2">
                  <li className="text-gray-400 text-sm">Ready to stop babysitting operations? Start with a practical AI conversation.</li>
                  <li><a href="mailto:automate@stoke-ai.com" className="text-gray-400 hover:text-orange-500 text-sm">automate@stoke-ai.com</a></li>
                  <li><a href="tel:+18557915002" className="text-gray-400 hover:text-orange-500 text-sm">(855) 791-5002</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-500 text-sm">© {new Date().getFullYear()} Stoke AI · Practical AI systems for Magic Valley businesses</p>
              <div className="flex gap-6">
                <a href="/privacy" className="text-gray-500 hover:text-orange-500 text-sm">Privacy Policy</a>
                <a href="/terms" className="text-gray-500 hover:text-orange-500 text-sm">Terms of Service</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
