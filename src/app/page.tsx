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
  const [scheduleTime, setScheduleTime] = useState('');
  const [scheduled, setScheduled] = useState(false);

  const generateInsight = (business: string): string => {
    const b = business.toLowerCase();
    if (b.includes('restaurant') || b.includes('cafe') || b.includes('food') || b.includes('bakery') || b.includes('coffee')) {
      return "Restaurant owners we talk to lose 10+ hours a week on scheduling, inventory, and follow-ups alone. An operating system handles all of that in the background — so you can focus on the food and the people.";
    }
    if (b.includes('retail') || b.includes('store') || b.includes('shop')) {
      return "Retail owners spend hours on inventory tracking, reordering, and customer follow-ups. An operating system handles all of that in the background while you focus on customers.";
    }
    if (b.includes('dental') || b.includes('medical') || b.includes('clinic') || b.includes('health')) {
      return "Medical practices lose massive time to appointment reminders, patient follow-ups, and chart prep. An operating system cuts no-shows and admin burden dramatically.";
    }
    if (b.includes('real estate') || b.includes('realtor')) {
      return "Realtors are spending hours qualifying leads and sending follow-ups. An operating system handles that 24/7 — you just show up for the ones ready to buy.";
    }
    if (b.includes('salon') || b.includes('spa') || b.includes('beauty')) {
      return "Salons lose clients not because of bad cuts — but because nobody followed up. An operating system keeps the chair full without you chasing people down.";
    }
    if (b.includes('insurance') || b.includes('agent')) {
      return "Insurance agents drown in renewal prep and lead follow-up. An operating system pre-analyzes renewals, follows up with leads 24/7, and only pulls you in when a client is ready to talk.";
    }
    if (b.includes('construction') || b.includes('contractor') || b.includes('plumb') || b.includes('electric') || b.includes('hvac')) {
      return "Trades businesses are buried in quote requests, scheduling, and follow-ups. An operating system generates quotes faster, keeps the schedule tight, and follows up automatically so no job slips through.";
    }
    return "Every business owner we talk to has the same problem — spending hours on repetitive tasks instead of the work that actually grows the business. That's exactly what an operating system fixes.";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    try {
      const res = await fetch('/api/lead-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          business: formData.business,
          website: formData.website,
          painPoint: formData.painPoint === 'other' ? formData.painPointOther : formData.painPoint,
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
          scheduleTime,
        }),
      });
      setScheduled(true);
    } catch {
      // Silent fail — the initial submission already captured their info
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white overflow-hidden">
      {/* Animated gradient background */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 -left-40 w-96 h-96 bg-orange-500 rounded-full mix-blend-screen filter blur-[128px] animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-600 rounded-full mix-blend-screen filter blur-[128px] animate-pulse" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Nav */}
        <nav className="container mx-auto px-6 py-6 flex justify-between items-center">
          <Image
            src="/logo.png"
            alt="Stoke-AI - Operating Intelligence"
            width={500}
            height={170}
            priority
          />
          <a
            href="#contact"
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-black font-bold py-3 px-6 rounded-full transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-orange-500/25"
          >
            Free Assessment
          </a>
        </nav>

        {/* Hero */}
        <header className="container mx-auto px-6 py-12 md:py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="inline-block mb-6 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full">
                <span className="text-orange-400 text-sm font-medium">Built by a business owner, for business owners</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
                Stop Working
                <br />
                <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 bg-clip-text text-transparent">
                  IN Your Business.
                </span>
                <br />
                Let AI Run It
                <br />
                <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 bg-clip-text text-transparent">
                  FOR You.
                </span>
              </h1>
              <p className="text-xl text-gray-400 max-w-xl mb-8 leading-relaxed">
                After 20 years of running businesses, we built the AI operating system 
                we wish we had — one that handles the busywork 24/7 so you can focus 
                on what actually makes you money.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-black font-bold py-4 px-8 rounded-full text-lg transition-all transform hover:scale-105 hover:shadow-xl hover:shadow-orange-500/25"
                >
                  Talk to Spark Now
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </a>
                <a
                  href="#how"
                  className="inline-flex items-center justify-center border border-gray-700 hover:border-orange-500/50 text-white font-semibold py-4 px-8 rounded-full text-lg transition-all hover:bg-orange-500/5"
                >
                  See How It Works
                </a>
              </div>
              <p className="text-gray-500 text-sm mt-4">Our AI will analyze your workflow and show you where you&apos;re losing time. No sales pitch. No pressure.</p>
            </div>
            <div className="relative order-1 md:order-2">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-amber-500/20 rounded-3xl blur-3xl" />
              <Image
                src="/hero-overwhelmed.png"
                alt="Business owner overwhelmed with paperwork"
                width={700}
                height={467}
                className="relative rounded-3xl border border-gray-800 shadow-2xl"
              />
            </div>
          </div>
        </header>

        {/* Value Props Bar */}
        <div className="border-y border-gray-800 bg-black/30 backdrop-blur-sm">
          <div className="container mx-auto px-6 py-8">
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 text-center">
              <div>
                <div className="text-3xl font-black text-orange-400">Custom Built</div>
                <div className="text-gray-500 text-sm">Your System, Not a Template</div>
              </div>
              <div>
                <div className="text-3xl font-black text-orange-400">24/7</div>
                <div className="text-gray-500 text-sm">Runs While You Sleep</div>
              </div>
              <div>
                <div className="text-3xl font-black text-orange-400">Local</div>
                <div className="text-gray-500 text-sm">Magic Valley, Idaho</div>
              </div>
            </div>
          </div>
        </div>

        {/* The Real Problem Section */}
        <section className="container mx-auto px-6 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
            <div className="order-2 md:order-1">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-orange-500/10 rounded-3xl blur-2xl" />
                <Image
                  src="/phone-notifications.png"
                  alt="Phone overwhelmed with missed calls, emails, and text notifications"
                  width={500}
                  height={400}
                  className="relative rounded-3xl border border-gray-800"
                />
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-3xl md:text-4xl font-black mb-6">
                You know the feeling.
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-6">
                A customer called and you missed it because you were buried in paperwork. 
                A lead came in last week and nobody followed up. You&apos;re working 60-hour 
                weeks and still falling behind.
              </p>
              <p className="text-gray-400 text-lg leading-relaxed mb-6">
                You&apos;re great at what you do. But the operational stuff is eating you alive. 
                And hiring someone at $50K/year just to keep up with admin doesn&apos;t pencil out.
              </p>
              <p className="text-white text-lg leading-relaxed font-medium">
                What if the busywork just... handled itself?
              </p>
            </div>
          </div>
        </section>

        {/* What Gets Handled Section */}
        <section className="border-y border-gray-800 bg-gradient-to-r from-orange-950/20 via-black to-orange-950/20 py-20">
          <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              What if it just
              <br />
              <span className="text-orange-400">handled itself?</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Your AI operating system runs these 24/7. You just check in when you want to.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: '/icon-followups.webp', title: 'Follow-ups', desc: 'Every lead gets a response. Every client gets a touchpoint. Nobody falls through the cracks.' },
              { icon: '/icon-content.webp', title: 'Client Prep', desc: 'Information organized, notes ready, nothing missed — before you walk into the meeting.' },
              { icon: '/icon-scheduling.webp', title: 'Reminders', desc: 'Deadlines, appointments, billing cycles — your system tracks everything and alerts you automatically.' },
              { icon: '/icon-automation.webp', title: 'Busywork', desc: 'Data entry, sorting, comparisons, reports — the tasks nobody should be doing manually anymore.' },
            ].map((item, i) => (
              <div 
                key={i}
                className="relative bg-gradient-to-br from-gray-900/80 to-black border border-gray-800 hover:border-orange-500/50 p-8 rounded-3xl transition-all duration-300 hover:transform hover:scale-105 hover:-translate-y-1 group overflow-hidden"
              >
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-24 bg-orange-500/20 rounded-full blur-2xl group-hover:bg-orange-500/30 transition-all" />
                <div className="relative flex justify-center mb-4">
                  <Image 
                    src={item.icon} 
                    alt={item.title}
                    width={80}
                    height={80}
                    className="group-hover:scale-110 transition-transform duration-300 rounded-2xl"
                  />
                </div>
                <div className="relative text-center">
                  <div className="font-bold text-white text-lg mb-2">{item.title}</div>
                  <div className="text-sm text-gray-400">{item.desc}</div>
                </div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-orange-500 to-amber-500 group-hover:w-1/2 transition-all duration-300 rounded-full" />
              </div>
            ))}
          </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how" className="bg-gradient-to-b from-transparent via-orange-950/10 to-transparent py-20 md:py-32">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black mb-4">
                How It Works
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                No generic software. No cookie-cutter setup. We build around how you actually work.
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              {[
                {
                  num: '01',
                  title: 'Talk to Spark',
                  desc: 'Reach out through the form or start a conversation with Spark, our AI. Spark learns about your business, asks the right questions, and figures out if we\'re a good fit — before anyone\'s time gets wasted.',
                },
                {
                  num: '02',
                  title: 'We Map Your Workflow',
                  desc: 'Once you\'re in, we dig into how your business actually runs. What tools you use, where leads come from, what falls through the cracks. This isn\'t a generic questionnaire — it\'s a real conversation with people who\'ve been running businesses for 20 years.',
                },
                {
                  num: '03', 
                  title: 'We Build Your System',
                  desc: 'Based on your workflow, we build a custom AI operating system around how YOU work. Not a template. Not a one-size-fits-all app. Your system, your rules, built to handle the specific stuff that\'s burying you.',
                },
                {
                  num: '04',
                  title: 'You Review, We Refine',
                  desc: 'You see it working, tell us what\'s right and what needs adjusting. We dial it in until it feels like it was always there.',
                },
                {
                  num: '05',
                  title: 'It Runs. You Don\'t Have To.',
                  desc: 'Your system goes live — handling follow-ups, reminders, client prep, busywork — 24/7. You check in when you want. It checks in with you when it matters.',
                },
              ].map((step, i) => (
                <div key={i} className="flex gap-6 md:gap-10 mb-12 last:mb-0">
                  <div className="shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center text-black font-black text-xl shadow-lg shadow-orange-500/20">
                      {step.num}
                    </div>
                  </div>
                  <div className="pt-2">
                    <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
                    <p className="text-gray-400 text-lg leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Who This Is For */}
        <section id="assessment" className="container mx-auto px-6 py-20 md:py-32">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-black mb-4">
                Built for owners who&apos;d rather <span className="text-orange-400">work ON it</span> than IN it.
              </h2>
              <p className="text-gray-400 text-xl max-w-2xl mx-auto">
                If you started your business for freedom but ended up trapped running it — 
                this is for you.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {[
                { icon: '/icon-automation.webp', title: 'Overwhelmed Owners', desc: 'You\'re doing everything yourself and there aren\'t enough hours in the day. Your system takes the busywork off your plate.' },
                { icon: '/icon-followups.webp', title: 'Growing Businesses', desc: 'You\'re ready to scale but can\'t afford to hire for every task that needs doing. Your system grows with you.' },
                { icon: '/icon-running.webp', title: 'Commission-Based Pros', desc: 'Your income depends on relationships, not paperwork. Let the system handle the rest so you can focus on closing.' },
              ].map((item, i) => (
                <div key={i} className="relative bg-gradient-to-br from-gray-900/80 to-black border border-gray-800 hover:border-orange-500/50 p-8 rounded-3xl transition-all duration-300 group text-center">
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 w-20 h-20 bg-orange-500/20 rounded-full blur-2xl group-hover:bg-orange-500/30 transition-all" />
                  <div className="relative">
                    <Image 
                      src={item.icon} 
                      alt={item.title}
                      width={72}
                      height={72}
                      className="mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 rounded-2xl"
                    />
                    <div className="font-bold text-white text-lg mb-2">{item.title}</div>
                    <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-orange-950/30 border border-gray-800 rounded-3xl p-8 md:p-12 text-center">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Not sure if this fits your business?
              </h3>
              <p className="text-gray-400 text-lg mb-6 max-w-2xl mx-auto">
                Start with a free Operating Assessment. We&apos;ll walk through your daily 
                operations and show you exactly where an operating system would save you time — 
                and where it wouldn&apos;t. No pitch, just clarity.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-black font-bold py-4 px-8 rounded-full text-lg transition-all transform hover:scale-105 hover:shadow-xl hover:shadow-orange-500/25"
                >
                  <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Talk to Spark Now
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center border border-gray-700 hover:border-orange-500/50 text-white font-semibold py-4 px-8 rounded-full text-lg transition-all hover:bg-orange-500/5"
                >
                  Or Send a Message
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* The $500/month Employee */}
        <section className="border-y border-gray-800 bg-gradient-to-r from-orange-950/20 via-black to-orange-950/20">
          <div className="container mx-auto px-6 py-16">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-black mb-6">
                Think of it as hiring
                <br />
                <span className="text-orange-400">a $125K employee.</span>
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
                Your operating system works every hour of every day. It doesn&apos;t call in sick, 
                forget follow-ups, or need training twice. It handles the operational 
                work of a full-time admin — except it works at 2 AM, never takes a day off, 
                and costs a fraction of what you&apos;d pay a person.
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-black/50 border border-gray-800 rounded-2xl p-6">
                  <div className="text-3xl font-black text-orange-400 mb-2">Custom Built</div>
                  <div className="text-gray-400 text-sm">One-time setup tailored to your exact business operations</div>
                </div>
                <div className="bg-black/50 border border-gray-800 rounded-2xl p-6">
                  <div className="text-3xl font-black text-orange-400 mb-2">Always On</div>
                  <div className="text-gray-400 text-sm">Runs 24/7 — nights, weekends, holidays. Your business never stops.</div>
                </div>
                <div className="bg-black/50 border border-gray-800 rounded-2xl p-6">
                  <div className="text-3xl font-black text-orange-400 mb-2">ROI Fast</div>
                  <div className="text-gray-400 text-sm">Most owners recover the cost in time saved within the first month</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Local Section */}
        <section className="container mx-auto px-6 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-black mb-6">
                Your neighbor,
                <br />
                <span className="text-orange-400">not some agency.</span>
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-6">
                I&apos;m Jeff Stoker. I&apos;ve been running businesses for 20 years — and for 
                most of that time, I was the one buried in the busywork. I built Stoke-AI 
                because I needed it myself. My own operating system runs my business every day.
              </p>
              <p className="text-gray-400 text-lg leading-relaxed">
                When you work with Stoke-AI, you get me. Not a support ticket. Not some agency 
                across the country. A local business owner right here in the Magic Valley who 
                gets it — because I&apos;ve been where you are.
              </p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-3xl blur-3xl" />
              <Image
                src="/jeff-relaxed.png"
                alt="Jeff Stoker relaxed at his desk while AI handles the work"
                width={600}
                height={400}
                className="relative rounded-3xl border border-gray-800 shadow-2xl"
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="contact" className="container mx-auto px-6 py-20 md:py-32">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-orange-950/30 border border-gray-800 rounded-3xl p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-10">
                <div>
                  <h2 className="text-3xl md:text-4xl font-black mb-4">
                    Let&apos;s talk about your business.
                  </h2>
                  <p className="text-gray-400 text-lg mb-6">
                    No pressure. No obligation. Just a conversation about whether an 
                    operating system makes sense for how you work.
                  </p>
                  <div className="space-y-4 text-gray-400">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span>Free operating assessment</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span>Honest about what AI can and can&apos;t do</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span>Local, personal service — not a support ticket</span>
                    </div>
                  </div>
                </div>

                <div>
                  {submitted ? (
                    <div className="h-full flex flex-col justify-center p-2">
                      <div className="text-center mb-5">
                        <div className="text-4xl mb-3">🔥</div>
                        <h3 className="text-2xl font-bold mb-2">You&apos;re in. Now let&apos;s get you assessed.</h3>
                        <p className="text-gray-400 text-sm">
                          Spark can run your free AI operating assessment right now — or schedule it for when it works for you.
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
                          <span className="flex items-center justify-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                            </svg>
                            Talk to Spark Now
                          </span>
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
                          <div className="grid grid-cols-2 gap-3">
                            <input
                              type="date"
                              className="px-3 py-2 bg-black/50 border border-gray-700 rounded-xl focus:outline-none focus:border-orange-500 transition-colors text-gray-300 text-sm"
                              min={new Date().toISOString().split('T')[0]}
                              value={scheduleDate}
                              onChange={(e) => setScheduleDate(e.target.value)}
                            />
                            <select
                              className="px-3 py-2 bg-black/50 border border-gray-700 rounded-xl focus:outline-none focus:border-orange-500 transition-colors text-gray-400 text-sm"
                              value={scheduleTime}
                              onChange={(e) => setScheduleTime(e.target.value)}
                            >
                              <option value="" disabled>Time</option>
                              <option value="09:00">9:00 AM</option>
                              <option value="10:00">10:00 AM</option>
                              <option value="11:00">11:00 AM</option>
                              <option value="12:00">12:00 PM</option>
                              <option value="13:00">1:00 PM</option>
                              <option value="14:00">2:00 PM</option>
                              <option value="15:00">3:00 PM</option>
                              <option value="16:00">4:00 PM</option>
                              <option value="17:00">5:00 PM</option>
                            </select>
                          </div>
                          <button
                            onClick={handleSchedule}
                            disabled={!scheduleDate || !scheduleTime}
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
                        <option value="" disabled>What&apos;s eating most of your time? (optional)</option>
                        <option value="Client follow-ups and communication">Client follow-ups and communication</option>
                        <option value="Lead management and response time">Lead management and response time</option>
                        <option value="Paperwork, data entry, admin tasks">Paperwork, data entry, admin tasks</option>
                        <option value="Team coordination and communication">Team coordination and communication</option>
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
                      {error && (
                        <div className="text-red-400 text-sm text-center">{error}</div>
                      )}
                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-4 px-8 rounded-xl text-lg transition-all transform hover:scale-[1.02] hover:shadow-lg hover:shadow-orange-500/25"
                      >
                        {submitting ? 'Sending...' : 'Get My Free Assessment →'}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-800 py-8">
          <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <Image
              src="/logo.png"
              alt="Stoke-AI - Operating Intelligence"
              width={350}
              height={120}
            />
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Stoke-AI · The Magic Valley, Idaho
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
