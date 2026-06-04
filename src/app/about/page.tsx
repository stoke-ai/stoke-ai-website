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
          <div className="max-w-5xl mx-auto">
            <p className="inline-flex mb-5 px-4 py-2 bg-orange-500/10 border border-orange-500/25 rounded-full text-orange-300 text-sm font-semibold">
              Local roots, practical AI systems
            </p>
            <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tight mb-6">
              I’m Jeff Stoker. I build AI systems for established Magic Valley businesses.
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-4xl mb-10">
              I grew up in the Burley, Idaho area around the dairy and milk-processing side of local business. Stoke AI exists because local companies do real, complicated work — and the systems around that work should be just as practical as the people running it.
            </p>

            <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-8 items-stretch">
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
                <h2 className="text-2xl md:text-3xl font-black mb-4">What I’m building Stoke AI to be</h2>
                <div className="space-y-4 text-gray-300 leading-relaxed">
                  <p>
                    Stoke AI is an AI systems partner for successful established businesses that have outgrown spreadsheets, disconnected apps, and manual follow-up loops.
                  </p>
                  <p>
                    The goal is not to replace your people. The goal is to give good teams better systems around the work they already do, so the business can grow without everything depending on memory, heroic effort, or one owner holding the whole operation together.
                  </p>
                  <p>
                    As I add older local photos and more of the story, this page will become a fuller introduction. For now, the most important thing to know is simple: you work directly with me, and the work stays grounded in your actual business.
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
