import Image from 'next/image';
import Link from 'next/link';

const agenda = [
  ['9:00 AM', 'The AI shift for local businesses', 'What changed, what is real, and why owners should start with their own workflow before trying to train the whole team.'],
  ['10:00 AM', 'Use cases that actually make money', 'Follow-up, intake, document handling, reminders, reporting, customer prep, and admin work that should not be manual anymore.'],
  ['11:00 AM', 'Live examples and practical demos', 'See how AI operating systems can turn emails, PDFs, notes, and tasks into organized business action.'],
  ['12:00 PM', 'Lunch and owner networking', 'Meet other Magic Valley owners who are thinking seriously about where AI fits.'],
  ['1:00 PM', 'AI Opportunity Map workshop', 'Map the repetitive work, missed follow-up, bottlenecks, and owner-only knowledge inside your business.'],
  ['2:00 PM', 'Build vs. buy vs. automate', 'Know when ChatGPT is enough, when off-the-shelf tools are enough, and when custom software makes sense.'],
  ['3:00 PM', 'Your 30-day AI roadmap', 'Leave with your top three opportunities, estimated impact, difficulty, and the first practical next step.'],
];

const outcomes = [
  'A plain-English map of where AI could save time in your business',
  'A prioritized list of your top three AI opportunities',
  'A better understanding of what is hype, what is useful, and what to ignore',
  'Examples of how local service businesses can use AI without becoming tech companies',
];

export default function MagicValleyAIPage() {
  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white overflow-hidden">
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 -left-40 w-96 h-96 bg-orange-500 rounded-full mix-blend-screen filter blur-[128px]" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-600 rounded-full mix-blend-screen filter blur-[128px]" />
      </div>

      <main className="relative z-10">
        <nav className="container mx-auto px-6 py-6 flex justify-between items-center">
          <Link href="/" className="inline-flex items-center">
            <Image src="/logo.png" alt="Stoke AI" width={280} height={96} priority />
          </Link>
          <Link href="/book" className="hidden sm:inline-flex bg-gradient-to-r from-orange-500 to-amber-500 text-black font-bold py-3 px-6 rounded-full transition-all hover:scale-105">
            Book Free AI Audit
          </Link>
        </nav>

        <section className="container mx-auto px-6 py-14 md:py-24">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-block mb-6 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-400 text-sm font-medium">
              Magic Valley business owners · one practical day · limited seats
            </div>
            <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
              The AI workshop for owners who want
              <span className="block bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 bg-clip-text text-transparent">less busywork and more leverage.</span>
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto mb-8">
              A focused one-day working session for Magic Valley owners who want to understand where AI fits in their actual business — without hype, jargon, or another software pitch.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#interest" className="inline-flex items-center justify-center bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-black font-bold py-4 px-8 rounded-full text-lg transition-all transform hover:scale-105 hover:shadow-xl hover:shadow-orange-500/25">
                Join the Interest List
              </a>
              <a href="#agenda" className="inline-flex items-center justify-center border border-gray-700 hover:border-orange-500/50 text-white font-semibold py-4 px-8 rounded-full text-lg transition-all hover:bg-orange-500/5">
                See the Draft Agenda
              </a>
            </div>
            <p className="mt-5 text-sm text-gray-500">Target format: 20–30 seats · $295–$495 range · lunch included · date and venue to be announced.</p>
          </div>
        </section>

        <section className="border-y border-gray-800 bg-black/30 backdrop-blur-sm">
          <div className="container mx-auto px-6 py-10 grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-black text-orange-400">For Owners</div>
              <div className="text-gray-400 text-sm mt-1">Not hobbyists. Not generic employees. Decision-makers.</div>
            </div>
            <div>
              <div className="text-3xl font-black text-orange-400">Practical</div>
              <div className="text-gray-400 text-sm mt-1">Real workflows, real bottlenecks, real next steps.</div>
            </div>
            <div>
              <div className="text-3xl font-black text-orange-400">Local</div>
              <div className="text-gray-400 text-sm mt-1">Built around Magic Valley service businesses.</div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
            <div>
              <h2 className="text-3xl md:text-5xl font-black mb-6">This is not an AI class.</h2>
              <div className="space-y-5 text-gray-300 text-lg leading-relaxed">
                <p>
                  The point is not to teach every tool or make you become a prompt engineer. The point is to help you see where AI can remove friction from the way your company already runs.
                </p>
                <p>
                  If your team is buried in follow-up, intake, admin, scheduling, PDFs, reports, or owner-only knowledge, this workshop helps you turn that mess into a practical AI roadmap.
                </p>
                <p className="text-white font-semibold">
                  You should leave knowing what to build first, what to ignore, and what would actually move the needle.
                </p>
              </div>
            </div>
            <div className="rounded-3xl border border-gray-800 bg-gradient-to-br from-gray-900 via-gray-900 to-orange-950/30 p-8 md:p-10">
              <h3 className="text-2xl font-black mb-5">You will leave with:</h3>
              <div className="space-y-4">
                {outcomes.map((item) => (
                  <div key={item} className="flex gap-3 text-gray-300">
                    <div className="mt-1 h-6 w-6 shrink-0 rounded-full bg-orange-500/20 text-orange-300 flex items-center justify-center">✓</div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="agenda" className="border-y border-gray-800 bg-gradient-to-r from-orange-950/20 via-black to-orange-950/20 py-20">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-black mb-4">Draft one-day agenda</h2>
              <p className="text-gray-400 text-lg">Built for useful owner decisions, not tech theater.</p>
            </div>
            <div className="space-y-4">
              {agenda.map(([time, title, desc]) => (
                <div key={time} className="grid md:grid-cols-[120px_1fr] gap-4 rounded-3xl border border-gray-800 bg-black/50 p-6 hover:border-orange-500/40 transition-colors">
                  <div className="text-orange-400 font-black">{time}</div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">{title}</h3>
                    <p className="text-gray-400 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="interest" className="container mx-auto px-6 py-20 md:py-28">
          <div className="max-w-4xl mx-auto rounded-3xl border border-gray-800 bg-gradient-to-br from-gray-900 via-gray-900 to-orange-950/30 p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-5xl font-black mb-5">Interested in attending?</h2>
            <p className="text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto mb-8">
              We are validating demand before booking the venue. If this sounds useful, book a free 90-minute AI audit and mention the Magic Valley workshop — or email us and we’ll put you on the interest list.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/book" className="inline-flex items-center justify-center bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-black font-bold py-4 px-8 rounded-full text-lg transition-all transform hover:scale-105 hover:shadow-xl hover:shadow-orange-500/25">
                Book Free AI Audit
              </Link>
              <a href="mailto:automate@stoke-ai.com?subject=Magic%20Valley%20AI%20Workshop%20Interest" className="inline-flex items-center justify-center border border-gray-700 hover:border-orange-500/50 text-white font-semibold py-4 px-8 rounded-full text-lg transition-all hover:bg-orange-500/5">
                Email Interest
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
