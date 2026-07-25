"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";

export const phoneDisplay = "(208) 678-3667";
export const phoneHref = "tel:+12086783667";

export function MdcHeader() {
  const [open, setOpen] = useState(false);

  return (
    <>
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
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            <span />
            <span />
            <span />
          </button>
          <nav className={open ? "nav nav-open" : "nav"} aria-label="Main navigation">
            <a href="/mdc/garage-door-repair">Repair</a>
            <a href="/mdc/garage-door-installation">New Doors</a>
            <a href="/mdc/commercial-overhead-doors">Commercial</a>
            <a href="/mdc/about">About</a>
            <a className="nav-phone" href={phoneHref}>{phoneDisplay}</a>
            <a className="button button-small" href="/mdc/free-quote">Get Free Quote</a>
          </nav>
        </div>
      </header>
    </>
  );
}

export function MdcFooter() {
  return (
    <>
      <footer>
        <div className="shell footer-grid">
          <div className="footer-brand">
            <img
              src="https://morgandoorcompany.com/wp-content/uploads/2021/10/Morgan-Door-Company-v5-200x90.png"
              alt="Morgan Door Company"
            />
            <p>Family-owned garage door repair and installation across the Magic Valley since 1975.</p>
          </div>
          <div>
            <strong>Services</strong>
            <a href="/mdc/garage-door-repair">Garage Door Repair</a>
            <a href="/mdc/garage-door-installation">New Garage Doors</a>
            <a href="/mdc/commercial-overhead-doors">Commercial Doors</a>
            <a href="/mdc/maintenance-safety-checks">Maintenance</a>
          </div>
          <div>
            <strong>Company</strong>
            <a href="/mdc/about">Our Story</a>
            <Link href="/mdc/resources">Helpful Articles</Link>
            <a href="/mdc/free-quote">Free Quote</a>
            <a href={phoneHref}>Contact</a>
          </div>
          <div className="footer-contact">
            <strong>Talk with Morgan Door</strong>
            <a href={phoneHref}>{phoneDisplay}</a>
            <span>Burley, Idaho</span>
            <span>Serving the Magic Valley</span>
          </div>
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
    </>
  );
}

export function MdcPage({ children }: { children: ReactNode }) {
  return (
    <main className="mdc-site">
      <MdcHeader />
      {children}
      <MdcFooter />
    </main>
  );
}

export function FinalCta({ title = "Tell us what you need. We’ll tell you the next step." }: { title?: string }) {
  return (
    <section className="final-cta">
      <div className="shell final-inner">
        <div>
          <p className="eyebrow">Get the door working. Get the project moving.</p>
          <h2>{title}</h2>
        </div>
        <div className="final-actions">
          <a className="button button-call" href={phoneHref}>Call {phoneDisplay}</a>
          <a className="button button-ghost" href="/mdc/free-quote">Get My Free Quote</a>
        </div>
      </div>
    </section>
  );
}
