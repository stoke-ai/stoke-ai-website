import type { Metadata } from "next";
import { MdcPage } from "../_components/MdcChrome";

export const metadata: Metadata = {
  title: "Morgan Door Website Audit & 90-Day Growth Plan",
  description: "Conversion audit, competitive benchmark, redesign brief, quote flow, and local SEO content plan for Morgan Door Company.",
  robots: { index: false, follow: false },
};

const priorities = [
  ["1", "Replace phone-only conversion with a visible quote form", "Put the 60-second form in the hero, on every service page, and behind a persistent mobile CTA. Route submissions to a monitored inbox/CRM with immediate confirmation.", "Very high"],
  ["2", "Build one strong page for each money service", "Dedicated repair, residential installation, commercial overhead door, and maintenance pages should target separate search intent and answer buying questions.", "Very high"],
  ["3", "Own the 50-year story above the fold", "“Family-owned since 1975 in Burley” is Morgan Door’s hardest-to-copy advantage. Make it visible before generic quality claims.", "Very high"],
  ["4", "Create real Burley and Twin Falls local authority", "Use service-area copy, project photography, local conditions, consistent business details, internal links, and city-specific proof—not doorway pages with swapped city names.", "High"],
  ["5", "Turn reviews into proof near decisions", "Show Tony D. and Bryce T. beside repair and CTA sections; add location, job type, review source, rating count, and a repeatable review collection process.", "High"],
  ["6", "State availability and safety triage clearly", "Use “same-day appointments may be available,” explain urgent conditions, and separate emergency calls from routine quotes without making unsupported 24/7 promises.", "High"],
  ["7", "Publish problem-led content that earns service clicks", "Answer broken spring, noisy door, opener, winter, and maintenance questions better than aggregators, then link directly into the correct service page.", "Medium-high"],
  ["8", "Fix technical local SEO and measurement", "Add unique titles, canonicals, Organization/LocalBusiness/Service/FAQ schema, call/form events, Search Console, GBP UTM links, and a monthly lead-by-page report.", "Medium-high"],
];

const plan = [
  ["Week 1", "garage door repair Burley ID", "Garage Door Repair in Burley, ID", "Fast, professional garage door repair for broken springs, cables, off-track doors, openers, and unsafe doors in Burley.", "Repair outcomes; urgent triage; all-brand scope; process; FAQs", "Homepage, quote, maintenance"],
  ["Week 1", "garage door installation Burley ID", "Residential Garage Door Installation in Burley", "Choose and install a durable Raynor garage door for your Southern Idaho home with guidance from a local family-owned team.", "Door choices; insulation; Raynor; installation process; FAQs", "Homepage, About, quote"],
  ["Week 2", "commercial overhead doors Twin Falls", "Commercial & Overhead Doors in Twin Falls and the Magic Valley", "Commercial door installation, repair, operators, and maintenance for shops, farms, warehouses, and facilities.", "Applications; downtime; operators; process; FAQs", "Homepage, quote, maintenance"],
  ["Week 2", "garage door maintenance Magic Valley", "Garage Door Maintenance & Safety Checks", "Catch worn hardware, poor balance, damaged seals, and safety issues before they become a garage door breakdown.", "Inspection scope; warning signs; frequency; commercial plans", "Repair, installation, quote"],
  ["Week 3", "broken garage door spring Burley ID", "Broken Garage Door Spring in Burley? What to Do", "Heard a loud bang or found a door that will not open? Learn the safe next steps for a broken spring in Burley.", "Stop-use guidance; symptoms; trapped car; professional repair", "Repair, maintenance, quote"],
  ["Week 3", "noisy garage door Magic Valley", "Why Is My Garage Door So Noisy?", "Learn what squeaking, grinding, popping, scraping, and rattling can mean—and when to stop using the door.", "Sound guide; safe checks; stop signs; maintenance", "Maintenance, repair, quote"],
  ["Week 4", "garage door opener repair Twin Falls ID", "Garage Door Opener Problems: Repair the Opener or the Door?", "Separate remote, sensor, operator, balance, and door hardware problems before replacing the wrong part.", "Basic checks; door vs opener; repair vs replace", "Repair, maintenance, quote"],
  ["Week 4", "family owned garage door company Burley", "50 Years in Burley: The Morgan Door Story", "From Lynn Morgan in 1975 to Roger, Braxton, and today’s team: five decades of local garage door work.", "Founding; 1998 transition; family ownership; Raynor; service area", "About, installation, quote"],
  ["Week 5", "garage door winter maintenance Magic Valley", "Magic Valley Garage Door Winter Prep Checklist", "Prepare seals, hardware, sensors, balance, and safe operation for Southern Idaho cold and wind.", "Seals; cycle check; sensors; safety; professional inspection", "Maintenance, installation, quote"],
  ["Week 6", "garage door summer checklist Idaho", "Before Summer Travel: 7 Garage Door Checks", "A practical garage door and opener checklist before vacations, camping trips, and busy Magic Valley summers.", "Security; remotes; sensors; seals; smart access; service timing", "Maintenance, opener article, quote"],
  ["Week 6", "garage door mid year inspection", "The 10-Minute Mid-Year Garage Door Check", "Spot changes in sound, balance, travel, seals, and safety before the second half of the year.", "Visual check; sound; travel; safe homeowner tasks; call signs", "Maintenance, noisy door, repair"],
  ["Week 7", "garage door off track Burley", "Garage Door Off Track? Stop Before the Damage Spreads", "Learn why an off-track garage door is dangerous, what not to touch, and how professional repair works.", "Causes; immediate safety; repair steps; prevention", "Repair, broken spring, quote"],
  ["Week 7", "garage door cable repair Magic Valley", "Frayed or Broken Garage Door Cable: What It Means", "Understand cable warning signs, why the door may sit crooked, and why this is not a DIY repair.", "Cable role; symptoms; safety; service process", "Repair, maintenance, quote"],
  ["Week 8", "insulated garage doors Idaho", "Are Insulated Garage Doors Worth It in Southern Idaho?", "Compare comfort, strength, noise, attached-garage use, and cost before choosing an insulated garage door.", "R-value; attached garages; weather; noise; selection", "Installation, Raynor, quote"],
  ["Week 9", "Raynor garage doors Magic Valley", "Why Morgan Door Installs Raynor Garage Doors", "A practical look at Raynor residential and commercial options, local installation, and long-term service.", "Product fit; residential; commercial; installation quality", "Installation, commercial, About"],
  ["Week 10", "commercial door maintenance Twin Falls", "How Planned Overhead Door Maintenance Reduces Downtime", "A practical maintenance framework for Magic Valley shops, farms, warehouses, and service facilities.", "Critical openings; inspection items; frequency; documentation", "Commercial, maintenance, quote"],
  ["Week 11", "new garage door curb appeal Burley", "Choosing a Garage Door That Fits Your Southern Idaho Home", "Compare style, windows, color, insulation, and maintenance without getting buried in a catalog.", "Architecture; windows; color; material; budget", "Installation, Raynor article, quote"],
  ["Week 12", "garage door safety check Idaho", "Is Your Garage Door’s Safety Reverse Working?", "Learn what garage door safety systems do, how to follow manufacturer tests, and when to call a professional.", "Photo eyes; reversal; testing guidance; never bypass; service", "Maintenance, opener article, quote"],
  ["Week 13", "garage door company Magic Valley", "How to Choose a Garage Door Company in the Magic Valley", "Compare training, safety, estimates, products, reviews, local history, and after-sale support before hiring.", "Questions to ask; red flags; local proof; repair vs install", "About, services, reviews, quote"],
];

export default function StrategyPage() {
  return (
    <MdcPage>
      <section className="strategy-hero">
        <div className="shell">
          <p className="eyebrow">Brutal audit + execution brief</p>
          <h1>Morgan Door can own Southern Idaho. The current site makes customers work too hard.</h1>
          <p>The company has the strongest trust story in the market—50 years, family ownership, Raynor, trained installers, and real same-day proof—but the existing website buries it under repetition, generic claims, and phone-only conversion.</p>
          <a className="button button-light" href="#priority-list">Jump to the 8 highest-ROI changes</a>
        </div>
      </section>

      <section className="section report-section">
        <div className="shell report-layout">
          <aside className="report-nav">
            <strong>Report sections</strong>
            <a href="#conversion">Conversion killers</a><a href="#seo">SEO gaps</a><a href="#ux">UX & mobile</a><a href="#trust">Missed trust</a><a href="#benchmarks">Benchmarks</a><a href="#architecture">Redesign brief</a><a href="#quote-flow">Quote experience</a><a href="#content-plan">90-day SEO plan</a><a href="#priority-list">Top 8 actions</a>
          </aside>
          <div className="report-body">
            <section id="conversion">
              <p className="eyebrow dark">01 · Conversion killers</p>
              <h2>The current site asks stressed customers to hunt, guess, and call.</h2>
              <ul className="brutal-list">
                <li><strong>“Call Today!” is not a conversion system.</strong> It appears repeatedly without the phone number in the visible CTA text, service selection, scheduling context, or an online fallback.</li>
                <li><strong>The hero repeats the same headline.</strong> “Trusted Garage Door Experts in the Magic Valley” appears multiple times, burning the most valuable screen space without naming repair, installation, Burley, commercial work, or a reason to choose Morgan.</li>
                <li><strong>“Receive your free quote” leads back to a phone call.</strong> There is no fast form for visitors who cannot or do not want to call during work, after hours, or while comparing installers.</li>
                <li><strong>Services are vague.</strong> “Sales, Installation, and Service” does not let a trapped homeowner jump directly to broken spring repair or let a facility manager find commercial overhead doors.</li>
                <li><strong>Trust arrives late.</strong> The strongest proof—50 years, family history, trained installers, safety certificates, Raynor, and same-day review language—is scattered below generic marketing copy.</li>
                <li><strong>No urgency routing.</strong> A stuck-open door and a future replacement quote enter the same phone-only path. Safety, security, and trapped-vehicle cases should be recognized immediately.</li>
              </ul>
            </section>

            <section id="seo">
              <p className="eyebrow dark">02 · High-intent local SEO gaps</p>
              <h2>Morgan is not giving Google a page that cleanly answers each money search.</h2>
              <div className="audit-grid">
                <article><h3>Garage door repair Burley ID</h3><p>Needs a dedicated repair page with all-brand scope, broken springs, cables, off-track doors, openers, same-day language, safety guidance, Burley proof, and FAQs.</p></article>
                <article><h3>Garage doors Magic Valley</h3><p>Needs a strong regional hub connecting services, cities, local history, projects, reviews, and consistent business information.</p></article>
                <article><h3>Overhead door installation Twin Falls</h3><p>Needs a commercial page built around shops, farms, warehouses, operators, maintenance, downtime, and Twin Falls service—not a generic residential services page.</p></article>
                <article><h3>Garage door installation Burley ID</h3><p>Needs residential selection guidance, Raynor product relevance, insulation for Idaho, process, real photography, and installation FAQs.</p></article>
                <article><h3>Problem searches</h3><p>Broken spring, door will not open, noisy door, opener trouble, off-track door, and cable failure deserve useful articles that funnel into repair.</p></article>
                <article><h3>Technical signals</h3><p>Unique titles, descriptions, canonicals, Service and FAQ schema, descriptive internal links, image alt text, GBP UTM tracking, and call/form events should be standard.</p></article>
              </div>
            </section>

            <section id="ux">
              <p className="eyebrow dark">03 · UX and mobile</p>
              <h2>Mobile visitors need three answers in five seconds.</h2>
              <p><strong>Can you fix this? Do you serve my town? How do I reach you now?</strong> The redesign keeps a visible call/quote bar, uses service-specific routes instead of anchor hunting, raises tap targets, reduces repeated headings, and gives urgent cases a direct call path. Forms use phone-friendly inputs, plain labels, a progress-light single step, and a confirmation state that explains what happens next.</p>
              <p>The visual hierarchy should put urgent repair first, replacement second, commercial third, and company story as the proof layer. Decorative animation should never delay the phone number, quote form, or essential content.</p>
            </section>

            <section id="trust">
              <p className="eyebrow dark">04 · Missed trust assets</p>
              <h2>The current site owns rare proof and presents it like filler.</h2>
              <div className="trust-matrix">
                <div><strong>50 years</strong><span>Lead with “Family-owned in Burley since 1975,” not a generic experts claim.</span></div>
                <div><strong>Lynn → Roger → Braxton</strong><span>Turn the timeline into a continuity and accountability story.</span></div>
                <div><strong>Raynor partner</strong><span>Explain what the partnership gives residential and commercial buyers.</span></div>
                <div><strong>Training & safety</strong><span>Name trained installers, proper equipment, certifications, and final safety testing without inventing credentials.</span></div>
                <div><strong>Same-day proof</strong><span>Use Bryce T.’s exact experience near repair CTAs; promise only availability, not guaranteed 24/7 response.</span></div>
                <div><strong>Local reviews</strong><span>Add job type, town, source, dates, and review count as the review system matures.</span></div>
              </div>
            </section>

            <section id="benchmarks">
              <p className="eyebrow dark">05 · Competitor benchmark</p>
              <h2>What the strongest garage door sites do better—and where Morgan can beat them.</h2>
              <div className="benchmark-table">
                <div className="benchmark-head"><span>Site</span><span>What works</span><span>Morgan’s advantage</span></div>
                <div><a href="https://twinfallsgaragedoor.com/">Twin Falls Garage Door</a><span>Exact-match repair headline, phone + estimate CTA, service/city pages, issue-led content, FAQs.</span><span>Out-trust it with a verifiable 1975 Burley history, named family leadership, real jobs, and disciplined claims.</span></div>
                <div><a href="https://overheaddoorinc.com/overhead-door-company-of-twin-falls/">Overhead Door of Twin Falls</a><span>Recognizable brand, commercial/residential breadth, 24-hour on-call positioning, A+ BBB claim.</span><span>Win on family accountability, Raynor choice, Burley/Rupert depth, simpler quote UX, and warmer local proof.</span></div>
                <div><a href="https://www.idgaragedoor.com/">Idaho Garage Door</a><span>Book Online, 24/7 and same-day messages, service gallery, city list, live chat, maintenance program.</span><span>Match booking convenience without noisy UI; lead with 50 years, actual owners, safer wording, and stronger editorial quality.</span></div>
                <div><a href="https://www.precisiondoor.net/">Precision Door Service</a><span>Urgency-first national conversion patterns, prominent phone/booking, repair categories, reviews, financing.</span><span>Use the conversion discipline without looking franchised or generic; Morgan’s local history is more credible.</span></div>
              </div>
            </section>

            <section id="architecture">
              <p className="eyebrow dark">06 · Complete redesign brief</p>
              <h2>Build a conversion system, not a prettier brochure.</h2>
              <h3>Information architecture</h3>
              <p>Home → Repair → Residential Installation → Commercial/Overhead Doors → Maintenance/Safety → Service Areas → About → Reviews/Projects → Resources → Free Quote. Add focused city pages only when each contains genuine local proof and useful differentiation.</p>
              <h3>Page wireframes</h3>
              <p><strong>Homepage:</strong> utility/local bar, logo/navigation, urgent hero with embedded quote form, five-point trust bar, service cards, repair triage, family timeline, process, Raynor gallery, commercial block, testimonials, service area, final CTA.</p>
              <p><strong>Service pages:</strong> outcome H1, call/quote pair, proof strip, problems solved, Why Morgan, 4-step process, local proof, FAQ schema, final CTA. <strong>About:</strong> family promise, 1975/1998/today narrative, people, safety standards, Raynor, expectations. <strong>Articles:</strong> clear answer first, safety guardrails, scannable sections, related service links, quote rail.</p>
              <h3>Visual direction</h3>
              <p>Deep Idaho navy, working blue, warm off-white, and a restrained safety amber. Oswald-style condensed display type for strong service headlines; clean sans serif for body copy. Prioritize real Magic Valley homes, Morgan technicians, Burley office/team, installed Raynor doors, and commercial openings. Avoid generic smiling-call-center stock photography and glossy 3D door renders.</p>
              <h3>Conversion architecture</h3>
              <p>Every high-intent page gets a visible phone number, free-quote CTA, contextual CTA language, review proof near the decision, and a persistent mobile bar. Track calls, form starts, form completion, service chosen, urgent flag, page/UTM source, and lead outcome.</p>
              <h3>Mobile priorities</h3>
              <p>Call/quote controls stay thumb reachable; the headline fits without burying the first CTA; form fields use correct input modes; navigation opens cleanly; cards become one column; photos crop intentionally; accordion FAQs remain readable; no chat bubble covers the sticky CTA.</p>
              <h3>Local SEO requirements</h3>
              <p>Consistent name/address/phone, embedded service geography, unique metadata, clean heading order, LocalBusiness/Service/FAQ/Article schema, descriptive links, optimized real images, review source integrity, GBP service/category alignment, Search Console, sitemap inclusion at launch, and no thin city-page duplication.</p>
            </section>

            <section id="quote-flow">
              <p className="eyebrow dark">07 · Ideal free quote experience</p>
              <h2>Faster than calling, without discouraging serious callers.</h2>
              <p><strong>Primary fields:</strong> service type, name, city/ZIP, mobile phone, optional email, short problem description, urgent checkbox, hidden spam field. <strong>Progressive follow-up:</strong> request photos, door count/size, preferred timing, property type, and product preferences only after the first submission or when the chosen service needs them.</p>
              <p><strong>Confirmation:</strong> “Request received. A local team member will review it shortly. If the door is stuck open, off track, or blocking a vehicle, call (208) 678-3667 now.” Show the captured service/location and allow correction.</p>
              <p><strong>Follow-up sequence:</strong> immediate confirmation email/text; human response target during business hours; one next-day reminder if contact is missed; a 3-day useful follow-up tied to the selected service; close the loop when scheduled or declined. Get explicit SMS consent before automated marketing messages.</p>
              <p><strong>Adjacent trust:</strong> family-owned since 1975, local response/no call center, all-brand repair, Raynor partner, trained installers, Tony/Bryce proof, privacy promise, and truthful same-day availability language.</p>
            </section>

            <section id="content-plan">
              <p className="eyebrow dark">08 · 90-day local SEO content plan</p>
              <h2>Build money pages first. Publish support content second.</h2>
              <div className="plan-list">
                {plan.map(([week, keyword, title, meta, outline, links]) => (
                  <article key={`${week}-${keyword}`}>
                    <div><span>{week}</span><strong>{keyword}</strong></div>
                    <h3>{title}</h3>
                    <p><strong>Meta:</strong> {meta}</p>
                    <p><strong>Outline:</strong> {outline}</p>
                    <p><strong>Internal links:</strong> {links}</p>
                  </article>
                ))}
              </div>
            </section>

            <section id="priority-list">
              <p className="eyebrow dark">Ranked action list</p>
              <h2>The 8 highest-ROI changes.</h2>
              <div className="priority-list">
                {priorities.map(([number, title, action, impact]) => (
                  <article key={number}><span>{number}</span><div><h3>{title}</h3><p>{action}</p></div><strong>{impact}</strong></article>
                ))}
              </div>
            </section>
          </div>
        </div>
      </section>
    </MdcPage>
  );
}
