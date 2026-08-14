import type { Metadata } from "next";
import { MdcPage, phoneDisplay, phoneHref } from "../_components/MdcChrome";
import QuoteForm from "../_components/QuoteForm";

export const metadata: Metadata = {
  title: "Request a Free Garage Door Quote | Morgan Door Company",
  description: "Request garage door repair, installation, commercial door, or maintenance help from Morgan Door Company in about 60 seconds.",
};

export default function QuotePage() {
  return (
    <MdcPage>
      <section className="quote-page">
        <div className="shell quote-page-grid">
          <div className="quote-page-copy">
            <p className="eyebrow">About 60 seconds</p>
            <h1>Request a free quote without waiting on hold.</h1>
            <p className="hero-lede">Tell us what you need and how to reach you. A local team member will review the request and follow up with a useful next step.</p>
            <div className="urgent-card">
              <h3>Need help right now?</h3>
              <p>If the door is stuck open, off track, hanging, or blocking a vehicle, call and describe the safety issue.</p>
              <a className="button button-call" href={phoneHref}>Call {phoneDisplay}</a>
            </div>
            <div className="form-trust">
              <div><strong>Local response</strong><span>No outsourced call center</span></div>
              <div><strong>No obligation</strong><span>Clear next step before work</span></div>
              <div><strong>50+ years</strong><span>Serving Southern Idaho</span></div>
              <div><strong>All-brand repair</strong><span>Raynor and Hörmann doors</span></div>
            </div>
          </div>
          <div className="quote-card quote-card-page">
            <div className="quote-heading"><p className="quote-kicker">Free quote request</p><h2>What can we help with?</h2><p>Photos are helpful but not required. We can ask for them during follow-up if needed.</p></div>
            <QuoteForm />
          </div>
        </div>
      </section>
      <section className="section next-section">
        <div className="shell">
          <div className="section-heading centered"><p className="eyebrow dark">After you submit</p><h2>Fast acknowledgment. Human follow-up.</h2></div>
          <div className="process-grid">
            <article><span>1</span><h3>Immediate confirmation</h3><p>The page confirms that your request reached the team.</p></article>
            <article><span>2</span><h3>Request review</h3><p>A local team member checks the service, location, urgency, and details.</p></article>
            <article><span>3</span><h3>Call or text follow-up</h3><p>We clarify what is needed and determine the appointment or estimate path.</p></article>
            <article><span>4</span><h3>Clear next step</h3><p>You know whether the next move is service, measurement, site visit, or product selection.</p></article>
          </div>
        </div>
      </section>
    </MdcPage>
  );
}
