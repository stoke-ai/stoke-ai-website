import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#0d0d0d] text-white overflow-hidden">
      <div className="fixed inset-0 opacity-25 pointer-events-none">
        <div className="absolute -top-24 -left-32 w-96 h-96 bg-orange-500 rounded-full mix-blend-screen filter blur-[128px]" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-600 rounded-full mix-blend-screen filter blur-[128px]" />
      </div>

      <div className="relative z-10">
        <nav className="container mx-auto px-6 py-5 sm:py-6 flex justify-center sm:justify-between items-center gap-6">
          <Link href="/" aria-label="Stoke AI home" className="block w-40 sm:w-44 md:w-64">
            <Image
              src="/logo.png"
              alt="Stoke AI"
              width={500}
              height={170}
              priority
              className="w-full h-auto"
            />
          </Link>
          <Link
            href="/#contact"
            className="hidden sm:inline-flex items-center justify-center bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500 text-black font-black py-3 px-6 rounded-full transition-all hover:scale-105 hover:shadow-lg hover:shadow-orange-500/25"
          >
            Talk Through What’s Possible
          </Link>
        </nav>

        <section className="container mx-auto px-6 pt-10 pb-20 md:pt-20 md:pb-28">
          <div className="max-w-6xl mx-auto">
            <p className="inline-flex mb-5 px-4 py-2 bg-orange-500/10 border border-orange-500/25 rounded-full text-orange-300 text-sm font-semibold">
              Declo roots, practical AI systems
            </p>
            <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tight mb-6 max-w-5xl">
              I’m Jeff Stoker. I help established Magic Valley businesses use AI on the operating side of the business.
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-4xl mb-10">
              I was born and raised in Declo, part of the Stoker milk family. I grew up around the work of processing, homogenizing, and delivering milk throughout the Magic Valley and eventually across southern Idaho.
            </p>

            <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-8 items-start mb-10">
              <div className="relative rounded-[2rem] border border-orange-500/20 bg-gradient-to-br from-orange-500/20 via-gray-950 to-black p-3 shadow-2xl shadow-black/30">
                <Image
                  src="/jeff-stoker-local.png"
                  alt="Jeff Stoker, founder of Stoke AI"
                  width={1200}
                  height={900}
                  priority
                  className="h-[420px] lg:h-[540px] w-full rounded-[1.5rem] object-cover object-[50%_32%] saturate-105 contrast-105"
                />
                <div className="pointer-events-none absolute inset-3 rounded-[1.5rem] bg-gradient-to-t from-black/60 via-transparent to-orange-500/10" />
                <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/10 bg-black/55 p-4 backdrop-blur-md">
                  <p className="text-sm font-bold text-orange-200">A real local person, not an anonymous AI vendor.</p>
                  <p className="text-xs text-gray-300">I’ll swap in older Declo/Stoker milk photos as I find them.</p>
                </div>
              </div>

              <div className="rounded-[2rem] border border-gray-800 bg-gray-950/75 p-8 shadow-xl shadow-black/20">
                <h2 className="text-2xl md:text-3xl font-black mb-5">Why this work matters to me</h2>
                <div className="space-y-5 text-gray-300 leading-relaxed text-lg">
                  <p>
                    After leaving Declo, I served a mission for The Church of Jesus Christ of Latter-day Saints in South Carolina, then came back to Idaho and moved to Boise to attend Boise State.
                  </p>
                  <p>
                    From there, my work kept circling around the same thing: business operations. I sold insurance with Farmers, bought and ran an Allstate agency, worked in retail banking at Wells Fargo, then sold merchant services and payroll services in business services.
                  </p>
                  <p>
                    Later, I started a Home Helpers Home Care franchise from scratch and grew it to about 65 employees at its peak, with offices in Middleton, Meridian, and Coeur d’Alene. More recently, I served as CFO/COO for a growing company.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 items-stretch">
              <div className="rounded-[2rem] border border-orange-500/20 bg-gradient-to-br from-gray-900 via-black to-orange-950/25 p-8 shadow-2xl shadow-black/25">
                <h2 className="text-2xl md:text-3xl font-black mb-4">Why local context matters</h2>
                <p className="text-gray-300 leading-relaxed mb-5">
                  I’m not trying to sell Magic Valley businesses a generic AI playbook. The work starts by understanding how your business actually runs: the people, handoffs, follow-ups, reporting, quoting, scheduling, paperwork, and customer communication that keep the company moving.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  Then we use practical AI and automation to support that work — one priority at a time — so your team has more capacity without adding more chaos.
                </p>
              </div>

              <div className="rounded-[2rem] border border-gray-800 bg-gray-950/75 p-8 shadow-xl shadow-black/20">
                <h2 className="text-2xl md:text-3xl font-black mb-4">Why Stoke AI exists</h2>
                <div className="space-y-4 text-gray-300 leading-relaxed">
                  <p>
                    I know what it feels like to manage the moving pieces of a business: customers, employees, schedules, follow-ups, reporting, payroll, vendors, and the constant decisions that never quite fit inside one piece of software.
                  </p>
                  <p>
                    When I started using AI seriously, I saw a light at the end of the tunnel. Not because AI replaces the people in a business, but because it can support the operating side of the business in a way owners have needed for a long time.
                  </p>
                  <p>
                    The part of entrepreneurship I have always loved is the freedom it can create — especially the freedom to spend time with the people you love. Stoke AI is being built to help good businesses grow without making the owner carry every system in their head.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                href="/#contact"
                className="inline-flex items-center justify-center bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500 text-black font-black py-4 px-8 rounded-full text-lg transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-orange-500/25"
              >
                Talk Through What’s Possible
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center border border-gray-700 hover:border-orange-500/50 text-white font-bold py-4 px-8 rounded-full text-lg transition-all hover:bg-orange-500/5"
              >
                Back to Stoke AI
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
