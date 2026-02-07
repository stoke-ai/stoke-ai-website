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
      return "For food service businesses, AI can predict daily demand based on weather and events — reducing waste by 20-30%. Plus, automated messaging can boost repeat visits.";
    }
    if (b.includes('retail') || b.includes('store') || b.includes('shop')) {
      return "Retail businesses are seeing huge wins with AI inventory management and personalized product recommendations — increasing average order value by 15-25%.";
    }
    if (b.includes('dental') || b.includes('medical') || b.includes('clinic') || b.includes('health')) {
      return "Healthcare practices are automating appointment reminders and follow-ups — reducing no-shows by up to 30% and freeing staff for patient care.";
    }
    if (b.includes('real estate') || b.includes('realtor')) {
      return "Real estate pros are using AI to auto-generate listings, qualify leads 24/7, and predict which properties sell fastest. Some save 10+ hours weekly.";
    }
    if (b.includes('salon') || b.includes('spa') || b.includes('beauty')) {
      return "Salons are crushing it with AI booking and rebooking reminders. Some see 25% more appointments just from automated 'time for a touch-up' messages.";
    }
    return "Every business has repetitive tasks eating up time — emails, scheduling, follow-ups. AI can handle these automatically, often saving 10-15 hours per week.";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    try {
      // Submit directly to our webhook (handles email, SMS, call, notifications)
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
      
      // Generate insight client-side
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
            alt="Stoke-AI"
            width={180}
            height={60}
            priority
          />
          <a
            href="#contact"
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-black font-bold py-3 px-6 rounded-full transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-orange-500/25"
          >
            Get Started
          </a>
        </nav>

        {/* Hero */}
        <header className="container mx-auto px-6 py-12 md:py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block mb-6 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full">
                <span className="text-orange-400 text-sm font-medium">🔥 Your own AI assistant — not just another tool</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
                Your business
                <br />
                <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 bg-clip-text text-transparent">
                  runs you.
                </span>
              </h1>
              <p className="text-xl text-gray-400 max-w-xl mb-6 leading-relaxed">
                Phone ringing. Emails piling up. Everyone needs something from you. 
                You didn&apos;t start a business to be buried in busywork.
                <span className="text-white font-medium"> Let&apos;s flip that.</span>
              </p>
              <p className="text-lg text-gray-500 max-w-xl mb-8">
                <span className="text-orange-400">Never</span> calls in sick. 
                <span className="text-orange-400">Never</span> asks for a raise. 
                <span className="text-orange-400">Never</span> quits on you. 
                <span className="text-orange-400">Never</span> forgets a follow-up.
                <br />
                <span className="text-gray-600 text-sm italic">(Okay, it might take a break during a power outage. It&apos;s not magic.)</span>
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-black font-bold py-4 px-8 rounded-full text-lg transition-all transform hover:scale-105 hover:shadow-xl hover:shadow-orange-500/25"
                >
                  See What&apos;s Possible
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
                <a
                  href="#what-you-get"
                  className="inline-flex items-center justify-center border border-gray-700 hover:border-orange-500/50 text-white font-semibold py-4 px-8 rounded-full text-lg transition-all hover:bg-orange-500/5"
                >
                  What You Get
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-amber-500/20 rounded-3xl blur-3xl" />
              <Image
                src="/hero-overwhelmed.png"
                alt="Overwhelmed business owner looking at phone"
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
                <div className="text-gray-500 text-sm">Your Assistant Never Sleeps</div>
              </div>
              <div>
                <div className="text-3xl font-black text-orange-400">Local</div>
                <div className="text-gray-500 text-sm">The Magic Valley, Idaho</div>
              </div>
              <div>
                <div className="text-3xl font-black text-orange-400">Yours</div>
                <div className="text-gray-500 text-sm">Dedicated System, Not Shared</div>
              </div>
            </div>
          </div>
        </div>

        {/* Problem/Solution Section */}
        <section className="container mx-auto px-6 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
            <div className="order-2 md:order-1">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-orange-500/10 rounded-3xl blur-2xl" />
                <Image
                  src="/abstract-ai.webp"
                  alt="AI visualization"
                  width={500}
                  height={400}
                  className="relative rounded-3xl border border-gray-800"
                />
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-3xl md:text-4xl font-black mb-6">
                Not another app.
                <br />
                <span className="text-gray-500">Your own AI assistant.</span>
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-6">
                ChatGPT is great for questions. But you don&apos;t need a chatbot — 
                you need someone who handles the follow-ups, drafts the emails, 
                remembers your clients, and <em>actually gets things done</em>.
              </p>
              <p className="text-gray-400 text-lg leading-relaxed">
                We build you a 
                <span className="text-white"> dedicated AI assistant</span> that knows 
                <span className="text-white"> your business</span>, runs 
                <span className="text-white"> 24/7</span>, and handles the repetitive 
                stuff so you can focus on what you do best.
              </p>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="container mx-auto px-6 pb-20">
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: '/icon-followups.webp', title: 'Follow-ups', desc: 'Never forget a lead again' },
              { icon: '/icon-content.webp', title: 'Content', desc: 'Posts, emails, drafts on demand' },
              { icon: '/icon-scheduling.webp', title: 'Scheduling', desc: 'Reminders and coordination' },
              { icon: '/icon-automation.webp', title: 'Automation', desc: 'Repetitive tasks handled' },
            ].map((item, i) => (
              <div 
                key={i}
                className="relative bg-gradient-to-br from-gray-900/80 to-black border border-gray-800 hover:border-orange-500/50 p-8 rounded-3xl transition-all duration-300 hover:transform hover:scale-105 hover:-translate-y-1 group overflow-hidden"
              >
                {/* Glow effect behind icon */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-24 bg-orange-500/20 rounded-full blur-2xl group-hover:bg-orange-500/30 transition-all" />
                
                {/* Icon */}
                <div className="relative flex justify-center mb-4">
                  <Image 
                    src={item.icon} 
                    alt={item.title}
                    width={80}
                    height={80}
                    className="group-hover:scale-110 transition-transform duration-300 rounded-2xl"
                  />
                </div>
                
                {/* Text */}
                <div className="relative text-center">
                  <div className="font-bold text-white text-lg mb-2">{item.title}</div>
                  <div className="text-sm text-gray-400">{item.desc}</div>
                </div>
                
                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-orange-500 to-amber-500 group-hover:w-1/2 transition-all duration-300 rounded-full" />
              </div>
            ))}
          </div>
        </section>

        {/* What You Get Section */}
        <section id="what-you-get" className="container mx-auto px-6 py-20 md:py-32">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-black mb-4">
                What you actually get.
              </h2>
              <p className="text-gray-400 text-lg">
                Not a subscription to another app. A dedicated system built for your business.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { icon: '/icon-system.webp', title: 'Your Own System', desc: 'A dedicated AI assistant running 24/7 on hardware we set up for you. Not shared. Not a chatbot. Yours.' },
                { icon: '/icon-chat.webp', title: 'Text It Like a Team Member', desc: 'Message your assistant from your phone. Ask it to draft emails, check your calendar, follow up with leads — and it does it.' },
                { icon: '/icon-running.webp', title: 'Automations That Run', desc: 'Drip campaigns, follow-up sequences, morning briefings, content calendars — set it once, it runs forever.' },
                { icon: '/icon-growth.webp', title: 'It Keeps Getting Better', desc: 'New AI models drop? You get them. New features we build for other clients? You get those too. Your assistant evolves.' },
              ].map((item, i) => (
                <div key={i} className="relative bg-gradient-to-br from-gray-900/80 to-black border border-gray-800 hover:border-orange-500/50 p-8 rounded-3xl transition-all duration-300 hover:transform hover:scale-[1.02] group overflow-hidden">
                  {/* Glow effect */}
                  <div className="absolute top-6 left-6 w-20 h-20 bg-orange-500/20 rounded-full blur-2xl group-hover:bg-orange-500/30 transition-all" />
                  
                  {/* Content */}
                  <div className="relative flex gap-5">
                    <div className="shrink-0">
                      <Image 
                        src={item.icon} 
                        alt={item.title}
                        width={72}
                        height={72}
                        className="group-hover:scale-110 transition-transform duration-300 rounded-2xl"
                      />
                    </div>
                    <div>
                      <div className="font-bold text-white text-lg mb-2">{item.title}</div>
                      <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                  
                  {/* Bottom accent */}
                  <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-orange-500 to-amber-500 group-hover:w-full transition-all duration-500" />
                </div>
              ))}
            </div>
            
            <div className="mt-8 p-6 bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/20 rounded-2xl">
              <p className="text-gray-300 text-lg text-center mb-4">
                <span className="text-orange-400 font-bold">This isn&apos;t maintenance — it&apos;s membership.</span>
                <br />
                <span className="text-gray-400">Every upgrade, every feature, every improvement — you get it all.</span>
              </p>
              <div className="grid md:grid-cols-3 gap-4 mt-6 text-sm">
                <div className="text-center p-3 bg-black/30 rounded-xl">
                  <div className="text-gray-400">While you&apos;re <span className="text-white">closing deals</span></div>
                  <div className="text-orange-400 font-medium">It&apos;s sending follow-ups</div>
                </div>
                <div className="text-center p-3 bg-black/30 rounded-xl">
                  <div className="text-gray-400">While you&apos;re <span className="text-white">sleeping</span></div>
                  <div className="text-orange-400 font-medium">It&apos;s nurturing leads</div>
                </div>
                <div className="text-center p-3 bg-black/30 rounded-xl">
                  <div className="text-gray-400">While you&apos;re <span className="text-white">at your kid&apos;s game</span></div>
                  <div className="text-orange-400 font-medium">It&apos;s drafting content</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how" className="bg-gradient-to-b from-transparent via-orange-950/10 to-transparent py-20 md:py-32">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black mb-4">
                Simple. Personal. Effective.
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                No 47-step frameworks. No enterprise BS. Just a straightforward way to get AI working for you.
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              {[
                {
                  num: '01',
                  title: 'We Talk',
                  desc: 'A real conversation about your business. What\'s working, what\'s not, what keeps you up at night. No sales pitch—just listening.',
                },
                {
                  num: '02', 
                  title: 'We Find the Fit',
                  desc: 'I\'ll be straight with you about what AI can actually help with—and what it can\'t. No overselling. If AI isn\'t the answer, I\'ll tell you.',
                },
                {
                  num: '03',
                  title: 'We Make It Happen',
                  desc: 'Whether it\'s setting up tools, training your team, or building something custom—we get it working. And I stick around until it does.',
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
                consulting firm charging enterprise rates. I&apos;m a local guy 
                who believes small businesses deserve access to the same AI 
                advantages the big companies have.
              </p>
              <p className="text-gray-400 text-lg leading-relaxed">
                When you work with Stoke-AI, you get me—someone who understands 
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

        {/* Built by AI Section */}
        <section className="border-y border-gray-800 bg-gradient-to-r from-orange-950/20 via-black to-orange-950/20">
          <div className="container mx-auto px-6 py-16">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-block mb-6 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full">
                <span className="text-orange-400 text-sm font-medium">⚡ Live Demo — Right Now</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black mb-4">
                Meet <span className="text-orange-400">Spark</span> — my AI assistant.
              </h2>
              <p className="text-xl text-gray-300 mb-2">
                She built this website. She wrote the email you&apos;re about to receive.
              </p>
              <p className="text-gray-400 text-lg leading-relaxed mb-8">
                Spark handles my follow-ups, drafts my content, manages my calendar, and runs my automations 24/7. 
                This isn&apos;t a demo of what&apos;s <em>possible</em> — it&apos;s what I use every single day.
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { icon: '/icon-instant.webp', title: 'Instant Response', desc: 'Submit the form below — Spark will send you a personalized email in minutes' },
                  { icon: '/icon-text.webp', title: 'Text Follow-up', desc: 'Include your phone and Spark will text you too — just like she does for my leads' },
                  { icon: '/icon-analyze.webp', title: 'Website Analysis', desc: 'Drop your URL and get AI-generated insights about your business' },
                ].map((item, i) => (
                  <div key={i} className="relative bg-black/50 border border-gray-800 hover:border-orange-500/50 rounded-2xl p-6 transition-all duration-300 hover:transform hover:scale-105 group overflow-hidden text-left">
                    {/* Glow effect */}
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
                  <span className="text-orange-400 font-bold">No coding. No technical skills.</span>
                  <br />
                  <span className="text-gray-400">Just plain English conversations — that&apos;s how all of this was built.</span>
                </p>
                <p className="mt-4 text-xl text-white font-bold">
                  Your assistant will do the same for you.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Cost of NOT Having AI Section */}
        <section className="container mx-auto px-6 py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-black mb-6">
              What&apos;s <span className="text-orange-400">not</span> having an AI assistant costing you?
            </h2>
            <div className="grid md:grid-cols-2 gap-5 text-left mb-8">
              {[
                { icon: '/icon-money.webp', title: '$40,000–$80,000/year', desc: 'for a full-time employee to do what AI handles' },
                { icon: '/icon-family.webp', title: 'Time with your family', desc: 'while you answer emails at 10pm' },
                { icon: '/icon-skiing.webp', title: 'Powder days at Pomerelle', desc: 'because you\'re stuck catching up on follow-ups' },
                { icon: '/icon-boating.webp', title: 'Summers on the Snake River', desc: 'while your inbox runs your life' },
              ].map((item, i) => (
                <div key={i} className="relative bg-gray-900/50 border border-gray-800 hover:border-orange-500/50 rounded-2xl p-6 transition-all duration-300 group overflow-hidden">
                  <div className="absolute top-4 left-4 w-16 h-16 bg-orange-500/20 rounded-full blur-xl group-hover:bg-orange-500/30 transition-all" />
                  <div className="relative flex gap-4 items-start">
                    <Image 
                      src={item.icon} 
                      alt={item.title}
                      width={56}
                      height={56}
                      className="rounded-xl group-hover:scale-110 transition-transform duration-300"
                    />
                    <div>
                      <div className="text-white font-medium">{item.title}</div>
                      <div className="text-gray-500 text-sm">{item.desc}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xl text-gray-400">
              You didn&apos;t start a business to be <span className="text-white">buried in busywork</span>.
              <br />
              <span className="text-gray-500">You started it to live better.</span>
            </p>
          </div>
        </section>

        {/* CTA Section */}
        <section id="contact" className="container mx-auto px-6 py-20 md:py-32">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-orange-950/30 border border-gray-800 rounded-3xl p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-10">
                <div>
                  <h2 className="text-3xl md:text-4xl font-black mb-4">
                    Ready to figure this out?
                  </h2>
                  <p className="text-gray-400 text-lg mb-6">
                    No pressure. No obligation. Just a conversation about 
                    your business and whether AI makes sense for you.
                  </p>
                  <div className="space-y-4 text-gray-400">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span>Free initial conversation</span>
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
                            <span>⚡</span> AI Quick Analysis
                          </div>
                          <p className="text-gray-300 text-sm leading-relaxed">{aiInsight}</p>
                          <p className="text-gray-500 text-xs mt-3 italic">
                            This insight was generated in seconds by Spark, my AI assistant. Imagine what we could do with a full consultation.
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
                        {submitting ? 'Sending...' : 'Let\'s Talk →'}
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
              alt="Stoke-AI"
              width={120}
              height={40}
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
