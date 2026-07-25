"use client";

import { useState } from "react";
import Link from "next/link";
import QuoteForm from "./_components/QuoteForm";

const phoneDisplay = "(208) 678-3667";
const phoneHref = "tel:+12086783667";

const services = [
  {
    number: "01",
    title: "Garage Door Repair",
    copy: "Broken springs, snapped cables, off-track doors, opener problems, and doors that will not open or close.",
    action: "Schedule a repair",
    href: "/mdc/garage-door-repair",
  },
  {
    number: "02",
    title: "New Garage Doors",
    copy: "Compare styles, insulation, windows, and finishes. We measure, install, test, and clean up.",
    action: "Explore new doors",
    href: "/mdc/garage-door-installation",
  },
  {
    number: "03",
    title: "Commercial Doors",
    copy: "Overhead doors, operators, repairs, and planned maintenance for shops, farms, and facilities.",
    action: "Commercial solutions",
    href: "/mdc/commercial-overhead-doors",
  },
  {
    number: "04",
    title: "Safety & Maintenance",
    copy: "Catch worn hardware, poor balance, damaged seals, and safety issues before they become breakdowns.",
    action: "Book a safety check",
    href: "/mdc/maintenance-safety-checks",
  },
];

const problems = [
  "Door will not open",
  "Broken spring or cable",
  "Door is off track",
  "Opener or sensor problem",
  "Grinding or scraping",
  "Vehicle or weather damage",
];

const cities = [
  "Burley",
  "Twin Falls",
  "Rupert",
  "Heyburn",
  "Kimberly",
  "Jerome",
  "Buhl",
  "Filer",
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="mdc-site">
      <div className="utility">
        <div className="shell utility-inner">
          <span>Serving Burley, Twin Falls & the Magic Valley</span>
          <span className="utility-right">Family-owned since 1975</span>
        </div>
      </div>

      <header className="site-header">
        <div className="shell header-inner">
          <a className="brand" href="/mdc" aria-label="Morgan Door Company home">
            <img
              src="https://morgandoorcompany.com/wp-content/uploads/2021/10/Morgan-Door-Company-v5-200x90.png"
              alt="Morgan Door Company"
            />
          </a>
          <button
            className="menu-button"
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span />
            <span />
            <span />
          </button>
          <nav className={menuOpen ? "nav nav-open" : "nav"} aria-label="Main navigation">
            <a href="/mdc/garage-door-repair" onClick={() => setMenuOpen(false)}>Repair</a>
            <a href="/mdc/garage-door-installation" onClick={() => setMenuOpen(false)}>New Doors</a>
            <a href="/mdc/commercial-overhead-doors" onClick={() => setMenuOpen(false)}>Commercial</a>
            <a href="/mdc/about" onClick={() => setMenuOpen(false)}>About</a>
            <a className="nav-phone" href={phoneHref}>{phoneDisplay}</a>
            <a className="button button-small" href="/mdc/free-quote" onClick={() => setMenuOpen(false)}>
              Get Free Quote
            </a>
          </nav>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero-image" role="img" aria-label="Garage door installed on a Magic Valley home" />
        <div className="hero-shade" />
        <div className="shell hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Magic Valley&apos;s local door company since 1975</p>
            <h1>Garage door help you can count on.</h1>
            <p className="hero-lede">
              Fast repairs. Straight answers. Residential and commercial doors installed to last.
            </p>
            <div className="urgent-line">
              <span className="urgent-dot" />
              <p><strong>Door stuck or won&apos;t close?</strong> Call now. Same-day appointments may be available.</p>
            </div>
            <div className="hero-actions">
              <a className="button button-call" href={phoneHref}>Call {phoneDisplay}</a>
              <a className="button button-ghost" href="/mdc/free-quote">Get a Free Quote</a>
            </div>
            <p className="micro">Talk with a local team member. No call center. No runaround.</p>
          </div>

          <div className="quote-card" id="quote">
            <div className="quote-heading">
              <p className="quote-kicker">Takes about 60 seconds</p>
              <h2>Get your free quote</h2>
              <p>Tell us what you need. We&apos;ll follow up with a useful next step.</p>
            </div>
            <QuoteForm compact />
          </div>
        </div>
      </section>

      <section className="trust-bar" aria-label="Why customers trust Morgan Door">
        <div className="shell trust-grid">
          <div><strong>50+</strong><span>Years in Southern Idaho</span></div>
          <div><strong>Family</strong><span>Owned & operated</span></div>
          <div><strong>Raynor</strong><span>Residential & commercial</span></div>
          <div><strong>Trained</strong><span>Professional installers</span></div>
          <div><strong>5-Star</strong><span>Local reputation</span></div>
        </div>
      </section>

      <section className="section services-section" id="services">
        <div className="shell">
          <div className="section-heading split-heading">
            <div>
              <p className="eyebrow dark">Start with the job in front of you</p>
              <h2>What can we help you fix or improve?</h2>
            </div>
            <p>We&apos;ll explain the options, give you a clear quote, and help you choose what makes sense.</p>
          </div>
          <div className="service-grid">
            {services.map((service) => (
              <article className="service-card" key={service.number}>
                <div className="service-number">{service.number}</div>
                <h3>{service.title}</h3>
                <p>{service.copy}</p>
                <a href={service.href}>{service.action}<span aria-hidden="true"> →</span></a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="repair-section" id="repair">
        <div className="shell repair-grid">
          <div className="repair-photo">
            <img
              src="https://morgandoorcompany.com/wp-content/uploads/2025/03/installer-temp.webp"
              alt="Garage door installer working on a residential door"
            />
            <div className="photo-label">
              <strong>All-brand repair</strong>
              <span>Homes, shops & businesses</span>
            </div>
          </div>
          <div className="repair-copy">
            <p className="eyebrow dark">When your whole day is stuck</p>
            <h2>Get your garage door moving safely again.</h2>
            <p className="large-copy">
              A broken door can trap your vehicle or leave your property exposed. Tell us what&apos;s happening and we&apos;ll give you the safest next step.
            </p>
            <div className="problem-grid">
              {problems.map((problem) => (
                <div key={problem}><span>✓</span>{problem}</div>
              ))}
            </div>
            <div className="inline-actions">
              <a className="button" href={phoneHref}>Call for repair</a>
              <a className="text-link" href="/mdc/free-quote">Request repair online →</a>
            </div>
            <p className="safety-note"><strong>Safety first:</strong> Do not attempt to release or replace a spring yourself.</p>
          </div>
        </div>
      </section>

      <section className="section story-section" id="about">
        <div className="shell story-grid">
          <div className="story-copy">
            <p className="eyebrow">Local experience you cannot manufacture</p>
            <h2>Built in Burley. Still family-owned.</h2>
            <p className="story-intro">
              Lynn Morgan started Morgan Door Company in 1975 with a practical standard: understand the problem, recommend what fits, and do the work correctly.
            </p>
            <div className="timeline">
              <div>
                <span>1975</span>
                <p><strong>Lynn Morgan founds the company</strong> and builds a reputation one local job at a time.</p>
              </div>
              <div>
                <span>1998</span>
                <p><strong>Roger carries the business forward</strong> while keeping the Morgan name accountable to the community.</p>
              </div>
              <div>
                <span>Today</span>
                <p><strong>Roger, Braxton, and the current team</strong> serve homes and businesses across the Magic Valley.</p>
              </div>
            </div>
          </div>
          <div className="story-visual">
            <img
              src="https://morgandoorcompany.com/wp-content/uploads/2025/03/mdc-office-400x227.webp"
              alt="Morgan Door Company office in Burley, Idaho"
            />
            <blockquote>
              <p>“They were extremely professional and did the job the same day I called.”</p>
              <cite>Bryce T. · Local customer</cite>
            </blockquote>
          </div>
        </div>
      </section>

      <section className="section process-section">
        <div className="shell">
          <div className="section-heading centered">
            <p className="eyebrow dark">No runaround</p>
            <h2>Straightforward from first call to final test.</h2>
          </div>
          <div className="process-grid">
            <article><span>1</span><h3>Tell us what&apos;s happening</h3><p>Call or send the short quote form. Photos help, but they&apos;re not required.</p></article>
            <article><span>2</span><h3>Get a clear recommendation</h3><p>We inspect the system, explain the options, and give you a quote before work begins.</p></article>
            <article><span>3</span><h3>We complete the work</h3><p>A trained installer arrives with the right equipment and protects the work area.</p></article>
            <article><span>4</span><h3>We test and walk through</h3><p>We verify safe operation, clean up, and show you exactly what was done.</p></article>
          </div>
        </div>
      </section>

      <section className="gallery-section">
        <div className="gallery-copy">
          <p className="eyebrow">Quality Raynor garage doors</p>
          <h2>A door that belongs on your home.</h2>
          <p>Compare practical choices in style, insulation, windows, finish, and operation without getting buried in a catalog.</p>
          <a className="button button-light" href="/mdc/free-quote">Get a door quote</a>
        </div>
        <div className="gallery-images">
          <img src="https://morgandoorcompany.com/wp-content/uploads/2024/04/portfolio1.jpg" alt="Residential garage door installation" />
          <img src="https://morgandoorcompany.com/wp-content/uploads/2025/02/hmpg2.jpg" alt="Modern garage doors on a Magic Valley home" />
        </div>
      </section>

      <section className="section commercial-section" id="commercial">
        <div className="shell commercial-grid">
          <div>
            <p className="eyebrow dark">Commercial & overhead doors</p>
            <h2>Keep your building secure and your operation moving.</h2>
          </div>
          <div>
            <p>Installation, repair, operators, and planned service for businesses, shops, agricultural operations, and facilities across the Magic Valley.</p>
            <div className="commercial-tags">
              <span>Sectional doors</span>
              <span>Insulated doors</span>
              <span>Shop & ag doors</span>
              <span>Operators & controls</span>
            </div>
            <a className="text-link" href="/mdc/free-quote">Request a commercial site visit →</a>
          </div>
        </div>
      </section>

      <section className="section reviews-section">
        <div className="shell">
          <div className="section-heading split-heading">
            <div>
              <p className="eyebrow dark">Honesty, integrity & experience</p>
              <h2>What Magic Valley customers say.</h2>
            </div>
            <div className="rating"><strong>5.0</strong><span>★★★★★</span><small>Local customer reputation</small></div>
          </div>
          <div className="review-grid">
            <blockquote>
              <div className="review-stars">★★★★★</div>
              <p>“These guys replaced my cables and lubricated all moving parts. They got the job done quickly and efficiently. I feel like we got a lot of value for the price.”</p>
              <cite>Tony D. <span>Garage door repair</span></cite>
            </blockquote>
            <blockquote>
              <div className="review-stars">★★★★★</div>
              <p>“They were extremely professional and did the job the same day I called. I will call Morgan Door for all of my door issues or replacements.”</p>
              <cite>Bryce T. <span>Same-day service</span></cite>
            </blockquote>
          </div>
        </div>
      </section>

      <section className="local-section">
        <div className="shell local-grid">
          <div>
            <p className="eyebrow">Your local garage door company</p>
            <h2>Serving the Magic Valley from Burley.</h2>
            <p>Homes, shops, farms, and businesses. If you&apos;re outside these towns, call us and we&apos;ll give you a straight answer about coverage.</p>
          </div>
          <div className="city-grid">
            {cities.map((city) => <span key={city}>{city}</span>)}
          </div>
        </div>
      </section>

      <section className="final-cta">
        <div className="shell final-inner">
          <div>
            <p className="eyebrow">Get the door working. Get the project moving.</p>
            <h2>Tell us what you need. We&apos;ll tell you the next step.</h2>
          </div>
          <div className="final-actions">
            <a className="button button-call" href={phoneHref}>Call {phoneDisplay}</a>
            <a className="button button-ghost" href="/mdc/free-quote">Get My Free Quote</a>
          </div>
        </div>
      </section>

      <footer>
        <div className="shell footer-grid">
          <div className="footer-brand">
            <img
              src="https://morgandoorcompany.com/wp-content/uploads/2021/10/Morgan-Door-Company-v5-200x90.png"
              alt="Morgan Door Company"
            />
            <p>Family-owned garage door repair and installation across the Magic Valley since 1975.</p>
          </div>
          <div><strong>Services</strong><a href="/mdc/garage-door-repair">Garage Door Repair</a><a href="/mdc/garage-door-installation">New Garage Doors</a><a href="/mdc/commercial-overhead-doors">Commercial Doors</a><a href="/mdc/maintenance-safety-checks">Maintenance</a></div>
          <div><strong>Company</strong><a href="/mdc/about">Our Story</a><Link href="/mdc/resources">Resources</Link><a href="/mdc/free-quote">Free Quote</a><a href={phoneHref}>Contact</a></div>
          <div className="footer-contact"><strong>Talk with Morgan Door</strong><a href={phoneHref}>{phoneDisplay}</a><span>Burley, Idaho</span><span>Serving the Magic Valley</span></div>
        </div>
        <div className="shell footer-bottom">
          <span>© 2026 Morgan Door Company</span>
          <span>Concept site for review</span>
        </div>
      </footer>

      <div className="mobile-bar">
        <a href={phoneHref}>Call Now</a>
        <a href="/mdc/free-quote">Free Quote</a>
      </div>
    </main>
  );
}
