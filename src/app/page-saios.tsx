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
      return "For food service businesses, an operating system can handle inventory alerts, staff scheduling, and customer re-engagement automatically — freeing you to focus on food and service.";
    }
    if (b.includes('retail') || b.includes('store') || b.includes('shop')) {
      return "Retail businesses benefit from automated inventory tracking, customer follow-ups, and smart reordering — reducing stockouts and boosting repeat business.";
    }
    if (b.includes('dental') || b.includes('medical') || b.includes('clinic') || b.includes('health')) {
      return "Healthcare practices see huge wins from automated appointment reminders, patient follow-ups, and chart prep — reducing no-shows and admin burden.";
    }
    if (b.includes('real estate') || b.includes('realtor')) {
      return "Real estate pros use operating systems to auto-qualify leads, schedule showings, and send market updates — staying top-of-mind without manual work.";
    }
    if (b.includes('salon') || b.includes('spa') || b.includes('beauty')) {
      return "Salons see big wins from automated booking confirmations, rebooking reminders, and product reorder alerts — keeping the chair full and inventory stocked.";
    }
    if (b.includes('insurance') || b.includes('agent')) {
      return "Insurance agencies benefit from automated renewal reminders, lead follow-up sequences, and client touchpoint campaigns — never missing a renewal or opportunity.";
    }
    return "Every business has repetitive tasks eating up time — follow-ups, scheduling, reminders, content creation. An operating system handles these automatically, often recovering 10-15 hours per week.";
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
            Get Your Free Assessment
          </a>
        </nav>

        {/* Hero */}
        <header className="container mx-auto px-6 py-12 md:py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="inline-block mb-6 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full">
                <span className="text-orange-400 text-sm font-medium">🔥 An Operating System — not just another tool</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
                Your Business Needs an
                <br />
                <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 bg-clip-text text-transparent">
                  Operating System
                </span>
              </h1>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-300">
                Not more software.
              </h2>
              <p className="text-xl text-gray-400 max-w-xl mb-8 leading-relaxed">
                SAIOS runs your business 24/7 — handling follow-ups, scheduling, client communication, 
                and content creation while you focus on closing deals and strategy.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="tel:+18557915002"
                  className="inline-flex items-center justify-center bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-black font-bold py-4 px-8 rounded-full text-lg transition-all transform hover:scale-105 hover:shadow-xl hover:shadow-orange-500/25"
                >
                  Call (855) 791-5002
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </a>
                <a
                  href="#assessment"
                  className="inline-flex items-center justify-center border border-gray-700 hover:border-orange-500/50 text-white font-semibold py-4 px-8 rounded-full text-lg transition-all hover:bg-orange-500/5"
                >
                  Learn More
                </a>
              </div>
            </div>
            <div className="relative order-1 md:order-2">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-amber-500/20 rounded-3xl blur-3xl" />
              <Image
                src="/hero-overwhelmed.png"
                alt="Business owner managing multiple tasks"
                width={700}
                height={467}
                className="relative rounded-3xl border border-gray-800 shadow-2xl"
              />
            </div>
          </div>
        </header>

        {/* Social Proof Bar */}
        <div className="border-y border-gray-800 bg-black/30 backdrop-blur-sm">
          <div className="container mx-auto px-6 py-8">
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 text-center">
              <div>
                <div className="text-3xl font-black text-orange-400">24/7</div>
                <div className="text-gray-500 text-sm">Always Running</div>
              </div>
              <div>
                <div className="text-3xl font-black text-orange-400">Custom</div>
                <div className="text-gray-500 text-sm">Built For Your Business</div>
              </div>
              <div>
                <div className="text-3xl font-black text-orange-400">Local</div>
                <div className="text-gray-500 text-sm">The Magic Valley, Idaho</div>
              </div>
            </div>
          </div>
        </div>

        {/* Operating Assessment Section */}
        <section id="assessment" className="container mx-auto px-6 py-20 md:py-32">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-black mb-4">
                We Map Your Operations First
              </h2>
              <p className="text-gray-400 text-xl max-w-2xl mx-auto">
                Before we build anything, we interview you about your business — workflows, pain points, 
                what you do all day. Then SAIOS is custom-built around how YOU actually work.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {[
                { icon: '/icon-automation.webp', title: 'Fully Automatable', desc: 'Tasks that need zero human judgment — scheduling, reminders, follow-ups, data entry' },
                { icon: '/icon-content.webp', title: 'AI-Assisted', desc: 'You guide, SAIOS executes — drafting emails, creating content, research, proposals' },
                { icon: '/icon-running.webp', title: 'Human-Only', desc: 'What genuinely requires you — closing deals, strategy, relationships, creative decisions' },
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
                Your Free Operating Assessment shows you:
              </h3>
              <div className="grid md:grid-cols-2 gap-4 mb-8 text-left">
                {[
                  'How much time you could recover each week',
                  'What can run automatically vs. what needs you',
                  'Which tasks are costing you the most money',
                  'A custom roadmap for your SAIOS build',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="shrink-0 w-6 h-6 bg-orange-500/20 rounded-full flex items-center justify-center mt-1">
                      <svg className="w-3 h-3 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
              <p className="text-xl text-gray-400 mb-8">
                <span className="text-white font-bold">No sales pitch. No pressure.</span> Just clarity.
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

        {/* Problem/Solution Section */}
        <section className="container mx-auto px-6 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
            <div className="order-2 md:order-1">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-orange-500/10 rounded-3xl blur-2xl" />
                <Image
                  src="/abstract-ai.webp"
                  alt="Operating system visualization"
                  width={500}
                  height={400}
                  className="relative rounded-3xl border border-gray-800"
                />
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-3xl md:text-4xl font-black mb-6">
                Not a Chatbot.
                <br />
                <span className="text-gray-500">An Operating System.</span>
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-6">
                ChatGPT is great for questions. But your business doesn&apos;t need another app to check — 
                it needs a system that runs operations automatically. Follow-ups, scheduling, client communication, 
                content creation.
              </p>
              <p className="text-gray-400 text-lg leading-relaxed">
                SAIOS handles the repetitive work 24/7 while you focus on what actually grows the business — 
                closing deals, building relationships, making strategic decisions.
              </p>
            </div>
          </div>
        </section>

        {/* What SAIOS Does Grid */}
        <section className="container mx-auto px-6 pb-20">
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: '/icon-followups.webp', title: 'Follow-ups', desc: 'Never miss a lead again' },
              { icon: '/icon-content.webp', title: 'Content', desc: 'Posts, emails, drafts on demand' },
              { icon: '/icon-scheduling.webp', title: 'Scheduling', desc: 'Reminders and coordination' },
              { icon: '/icon-automation.webp', title: 'Workflows', desc: 'Repetitive tasks handled' },
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

        {/* How SAIOS Works */}
        <section id="how" className="bg-gradient-to-b from-transparent via-orange-950/10 to-transparent py-20 md:py-32">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black mb-4">
                How It Works
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                No 47-step frameworks. No cookie-cutter solutions. Your SAIOS is custom-built for your business.
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              {[
                {
                  num: '01',
                  title: 'Discovery Interview',
                  desc: 'We talk about your business — what you do all day, where you\'re stuck, what\'s costing you time and money. This conversation becomes the blueprint for your system.',
                },
                {
                  num: '02', 
                  title: 'Custom Build',
                  desc: 'We build your SAIOS based on that interview — workflows tailored to YOUR business, not a generic template. Every automation is designed around how you actually operate.',
                },
                {
                  num: '03',
                  title: 'Go Live',
                  desc: 'Your system goes live and starts handling operations 24/7. You text it like a team member, it runs in the background, and you focus on running the business instead of the busywork.',
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

        {/* Built by AI Section - Reframed as Proof */}
        <section className="border-y border-gray-800 bg-gradient-to-r from-orange-950/20 via-black to-orange-950/20">
          <div className="container mx-auto px-6 py-16">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-block mb-6 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full">
                <span className="text-orange-400 text-sm font-medium">⚡ Proof of Concept</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black mb-4">
                I Built My Own First
              </h2>
              <p className="text-xl text-gray-300 mb-2">
                Spark runs Stoke-AI — my own SAIOS.
              </p>
              <p className="text-gray-400 text-lg leading-relaxed mb-8">
                She built this website. She handles my leads, drafts my emails, manages follow-ups, 
                and runs automations 24/7. Everything you see here is what she does for MY business. 
                Now I build custom SAIOS for you.
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { icon: '/icon-instant.webp', title: 'Instant Response', desc: 'Submit the form below — Spark will send you a personalized email in minutes' },
                  { icon: '/icon-text.webp', title: 'Text Follow-up', desc: 'Include your phone and Spark will text you too — just like YOUR system will' },
                  { icon: '/icon-analyze.webp', title: 'Business Analysis', desc: 'Drop your URL and get AI-generated insights — a preview of what SAIOS can do' },
                ].map((item, i) => (
                  <div key={i} className="relative bg-black/50 border border-gray-800 hover:border-orange-500/50 rounded-2xl p-6 transition-all duration-300 hover:transform hover:scale-105 group overflow-hidden text-left">
                    <div className="absolute top-4 left-4 w-16 h-16 bg-orange-500/20 rounded-full blur-xl group-hover:bg-orange-500/30 transition-all" />
                    <div className="relative">
                      <Image 
                        src={item.icon} 
                        alt={item.title}
                        width={56}
                        height={56}
                        className="mb-4 group-hover:scale-110 transition-transform duration-300 rounded-xl"
                      />
                      <div className="font-bold text-white mb-2">{item.title}</div>
                      <div className="text-sm text-gray-400">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-10 p-6 bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/20 rounded-2xl text-center">
                <p className="text-lg">
                  <span className="text-orange-400 font-bold">No coding required.</span>
                  <br />
                  <span className="text-gray-400">Your SAIOS will be just as capable — but built for YOUR business.</span>
                </p>
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
                Based right here in the Magic Valley, Idaho. I&apos;m not a faceless 
                consulting firm. I&apos;m a local guy who built my own operating system first, 
                then started building them for other small businesses.
              </p>
              <p className="text-gray-400 text-lg leading-relaxed">
                When you work with Stoke-AI, you get me — someone who understands 
                small-town business and genuinely wants to see you succeed.
              </p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-3xl blur-3xl" />
              <Image
                src="/local-business.webp"
                alt="Local Idaho business"
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
                    Ready to see how SAIOS fits your business?
                  </h2>
                  <p className="text-gray-400 text-lg mb-6">
                    No pressure. No obligation. Just a conversation about 
                    your business and whether an operating system makes sense.
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
                      <span>Honest recommendations</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span>Local, personal service</span>
                    </div>
                  </div>
                </div>

                <div>
                  {submitted ? (
                    <div className="h-full flex flex-col justify-center p-6">
                      <div className="text-center mb-6">
                        <div className="text-5xl mb-4">🔥</div>
                        <h3 className="text-2xl font-bold mb-2">You&apos;re in!</h3>
                        <p className="text-gray-400">
                          I&apos;ll be in touch within 24 hours.
                        </p>
                      </div>
                      {aiInsight && (
                        <div className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/20 rounded-xl p-4 mt-4">
                          <div className="text-xs text-orange-400 font-semibold mb-2 flex items-center gap-2">
                            <span>⚡</span> Quick Analysis
                          </div>
                          <p className="text-gray-300 text-sm leading-relaxed">{aiInsight}</p>
                          <p className="text-gray-500 text-xs mt-3 italic">
                            Generated in seconds by Spark. Imagine what a full SAIOS could do.
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
                        placeholder="Phone (optional — for faster follow-up!)"
                        className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-xl focus:outline-none focus:border-orange-500 transition-colors placeholder-gray-600"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                      <input
                        type="text"
                        placeholder="What's your business?"
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
                        <option value="" disabled>How are you using AI in your business right now?</option>
                        <option value="I haven't started yet">I haven't started yet</option>
                        <option value="Just ChatGPT for writing or ideas">Just ChatGPT for writing or ideas</option>
                        <option value="Tried some tools but nothing stuck">Tried some tools but nothing stuck</option>
                        <option value="I have some automations running">I have some automations running</option>
                        <option value="I'm not sure what's possible">I'm not sure what's possible</option>
                        <option value="other">Other</option>
                      </select>
                      {formData.painPoint === 'other' && (
                        <input
                          type="text"
                          placeholder="Tell us more..."
                          required
                          className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-xl focus:outline-none focus:border-orange-500 transition-colors placeholder-gray-600"
                          value={formData.painPointOther}
                          onChange={(e) => setFormData({ ...formData, painPointOther: e.target.value })}
                        />
                      )}
                      <input
                        type="url"
                        placeholder="Website URL (optional — we'll analyze it!)"
                        className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-xl focus:outline-none focus:border-orange-500 transition-colors placeholder-gray-600"
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      />
                      <textarea
                        placeholder="What are you hoping AI can help with?"
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
                        {submitting ? 'Sending...' : 'Book Free Assessment →'}
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
