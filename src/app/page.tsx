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
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [aiInsight, setAiInsight] = useState('');

  const generateInsight = (business: string): string => {
    const b = business.toLowerCase();
    if (b.includes('restaurant') || b.includes('cafe') || b.includes('food') || b.includes('bakery') || b.includes('coffee')) {
      return "Restaurant owners tell us they lose 10+ hours a week on scheduling, inventory, and follow-ups alone. Those are exactly the tasks an operating system handles automatically.";
    }
    if (b.includes('retail') || b.includes('store') || b.includes('shop')) {
      return "Retail owners we've talked to spend hours on inventory tracking, reordering, and customer follow-ups. An operating system handles all of that in the background while you focus on customers.";
    }
    if (b.includes('dental') || b.includes('medical') || b.includes('clinic') || b.includes('health')) {
      return "Medical practices lose massive time to appointment reminders, patient follow-ups, and chart prep. An operating system cuts no-shows and admin burden dramatically.";
    }
    if (b.includes('real estate') || b.includes('realtor')) {
      return "Realtors we work with were spending hours qualifying leads and sending follow-ups. Their operating system now handles that 24/7 — they just show up to closings.";
    }
    if (b.includes('salon') || b.includes('spa') || b.includes('beauty')) {
      return "Salon owners tell us rebooking reminders and no-show follow-ups eat up their week. An operating system keeps the chair full without you chasing people down.";
    }
    if (b.includes('insurance') || b.includes('agent')) {
      return "Insurance agents we work with were drowning in renewal prep — 60+ hours a month of manual comparisons. Their operating system now pre-analyzes everything before the client walks in.";
    }
    return "Every business owner we talk to has the same problem — they're spending hours on repetitive tasks instead of the work that actually grows the business. That's exactly what we fix.";
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
          message: formData.message,
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
                <p className="text-gray-500 text-sm mt-2">Our AI will analyze your workflow and show you where you&apos;re losing time. No sales pitch. No pressure.</p>
              </div>
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
                  src="/abstract-ai.webp"
                  alt="Business operations running smoothly"
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

        {/* Real Results Section */}
        <section className="border-y border-gray-800 bg-gradient-to-r from-orange-950/20 via-black to-orange-950/20">
          <div className="container mx-auto px-6 py-16">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-black mb-4">
                  This is what it looks like
                  <br />
                  <span className="text-orange-400">when it&apos;s working.</span>
                </h2>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-black/50 border border-gray-800 rounded-2xl p-8">
                  <div className="text-red-400/80 text-sm font-semibold mb-4 uppercase tracking-wider">Before</div>
                  <ul className="space-y-4 text-gray-400">
                    <li className="flex items-start gap-3">
                      <span className="text-red-400/60 mt-1">✕</span>
                      <span>Leads slipping through the cracks because nobody followed up</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-red-400/60 mt-1">✕</span>
                      <span>Spending hours on repetitive tasks that don&apos;t grow the business</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-red-400/60 mt-1">✕</span>
                      <span>Working nights and weekends just to stay caught up</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-red-400/60 mt-1">✕</span>
                      <span>Hiring help you can&apos;t afford or doing everything yourself</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-black/50 border border-orange-500/30 rounded-2xl p-8">
                  <div className="text-orange-400 text-sm font-semibold mb-4 uppercase tracking-wider">After</div>
                  <ul className="space-y-4 text-gray-300">
                    <li className="flex items-start gap-3">
                      <span className="text-orange-400 mt-1">✓</span>
                      <span>Every lead gets a response within minutes — automatically</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-orange-400 mt-1">✓</span>
                      <span>Repetitive tasks handled in the background, 24/7</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-orange-400 mt-1">✓</span>
                      <span>Your week opens up for the work that actually makes money</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-orange-400 mt-1">✓</span>
                      <span>A system that scales with you — no new hires needed</span>
                    </li>
                  </ul>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* What Gets Handled Section */}
        <section className="container mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              The stuff that eats your week
            </h2>
            <p className="text-gray-400 text-lg">
              Your system handles these automatically. You just check in when you want to.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: '/icon-followups.webp', title: 'Follow-ups', desc: 'Every lead gets a response. Every client gets a touchpoint. Nobody falls through the cracks.' },
              { icon: '/icon-content.webp', title: 'Client Prep', desc: 'Documents analyzed, numbers compared, talking points ready — before you walk into the meeting.' },
              { icon: '/icon-scheduling.webp', title: 'Reminders', desc: 'Renewals, deadlines, billing cycles — your system tracks everything and alerts your team.' },
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
                  title: 'We Learn Your Business',
                  desc: 'We sit down and talk about what you do all day. Where are you stuck? What takes too long? What falls through the cracks? This conversation becomes the blueprint — not some template we use for everyone.',
                },
                {
                  num: '02', 
                  title: 'We Build Your System',
                  desc: 'Your operating system is custom-built around YOUR workflows. The way you handle renewals, the way you follow up with leads, the way your team communicates — we automate the parts that don\'t need you.',
                },
                {
                  num: '03',
                  title: 'You Get Your Time Back',
                  desc: 'Your system goes live and starts working 24/7. You can text it like a team member. It handles the operations in the background while you do what you\'re actually good at — selling, advising, and taking care of clients.',
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
                Built for people who
                <br />
                <span className="text-orange-400">earn what they close.</span>
              </h2>
              <p className="text-gray-400 text-xl max-w-2xl mx-auto">
                Commission-based entrepreneurs — insurance agents, realtors, financial advisors — 
                who are great at their job but buried in the operational side of running a book of business.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {[
                { icon: '/icon-automation.webp', title: 'Insurance Agents', desc: 'Renewal comparisons, cross-sell flagging, client prep — your system knows every policy before you do.' },
                { icon: '/icon-followups.webp', title: 'Realtors', desc: 'Lead follow-up, market updates, showing coordination — your pipeline stays full without manual chasing.' },
                { icon: '/icon-running.webp', title: 'Financial Advisors', desc: 'Client touchpoints, review prep, compliance tracking — relationship management on autopilot.' },
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
                  href="tel:+18557915002"
                  className="inline-flex items-center justify-center bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-black font-bold py-4 px-8 rounded-full text-lg transition-all transform hover:scale-105 hover:shadow-xl hover:shadow-orange-500/25"
                >
                  <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Call (855) 791-5002
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
                <span className="text-orange-400">a $125K employee for $500/month.</span>
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
                Your operating system works every hour of every day. It doesn&apos;t call in sick, 
                forget follow-ups, or need training twice. After a one-time custom build, 
                ongoing maintenance is $500/month — a fraction of what you&apos;d pay a full-time 
                admin who can&apos;t work at 2 AM.
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-black/50 border border-gray-800 rounded-2xl p-6">
                  <div className="text-3xl font-black text-orange-400 mb-2">Custom Build</div>
                  <div className="text-gray-400 text-sm">One-time setup tailored to your exact business operations</div>
                </div>
                <div className="bg-black/50 border border-gray-800 rounded-2xl p-6">
                  <div className="text-3xl font-black text-orange-400 mb-2">$500/mo</div>
                  <div className="text-gray-400 text-sm">Ongoing maintenance, updates, and support after Day 60</div>
                </div>
                <div className="bg-black/50 border border-gray-800 rounded-2xl p-6">
                  <div className="text-3xl font-black text-orange-400 mb-2">ROI Fast</div>
                  <div className="text-gray-400 text-sm">Most clients recover the cost in time saved within the first month</div>
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
                I&apos;m Jeff Stoker, based right here in the Magic Valley. I built my own 
                operating system first — it runs my business, handles my leads, drafts my emails, 
                and manages my follow-ups 24/7. Everything I build for you is something 
                I use myself every day.
              </p>
              <p className="text-gray-400 text-lg leading-relaxed">
                When you work with Stoke-AI, you get me. Not a support ticket. Not a chatbot. 
                A local guy who understands small-town business and actually picks up the phone.
              </p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-3xl blur-3xl" />
              <Image
                src="/local-business.webp"
                alt="Magic Valley Idaho business"
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
                    <div className="h-full flex flex-col justify-center p-6">
                      <div className="text-center mb-6">
                        <div className="text-5xl mb-4">🔥</div>
                        <h3 className="text-2xl font-bold mb-2">Got it!</h3>
                        <p className="text-gray-400">
                          I&apos;ll be in touch within 24 hours — usually much faster.
                        </p>
                      </div>
                      {aiInsight && (
                        <div className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/20 rounded-xl p-4 mt-4">
                          <div className="text-xs text-orange-400 font-semibold mb-2 flex items-center gap-2">
                            <span>⚡</span> Quick Take on Your Business
                          </div>
                          <p className="text-gray-300 text-sm leading-relaxed">{aiInsight}</p>
                          <p className="text-gray-500 text-xs mt-3 italic">
                            That took 2 seconds. Imagine what a full system could do for you.
                          </p>
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
                        placeholder="What's your business? (e.g. insurance agency, real estate)"
                        required
                        className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-xl focus:outline-none focus:border-orange-500 transition-colors placeholder-gray-600"
                        value={formData.business}
                        onChange={(e) => setFormData({ ...formData, business: e.target.value })}
                      />
                      <select
                        required
                        className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-xl focus:outline-none focus:border-orange-500 transition-colors text-gray-400"
                        value={formData.painPoint}
                        onChange={(e) => setFormData({ ...formData, painPoint: e.target.value })}
                      >
                        <option value="" disabled>What&apos;s eating most of your time?</option>
                        <option value="Client follow-ups and renewals">Client follow-ups and renewals</option>
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
                          required
                          className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-xl focus:outline-none focus:border-orange-500 transition-colors placeholder-gray-600"
                          value={formData.painPointOther}
                          onChange={(e) => setFormData({ ...formData, painPointOther: e.target.value })}
                        />
                      )}
                      <input
                        type="url"
                        placeholder="Website URL (optional)"
                        className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-xl focus:outline-none focus:border-orange-500 transition-colors placeholder-gray-600"
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      />
                      <textarea
                        placeholder="Anything else you want me to know?"
                        rows={3}
                        className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-xl focus:outline-none focus:border-orange-500 transition-colors resize-none placeholder-gray-600"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
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
