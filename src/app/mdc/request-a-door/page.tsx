import type { Metadata } from "next";
import { MdcPage, phoneDisplay, phoneHref } from "../_components/MdcChrome";
import RequestDoorForm from "../_components/RequestDoorForm";

export const metadata: Metadata = {
  title: "Request a Garage or Overhead Door | Morgan Door Company",
  description: "Tell Morgan Door what you need for your home or business in Burley, Twin Falls, or the Magic Valley.",
};

export default function RequestDoorPage() {
  return (
    <MdcPage>
      <section className="quote-page door-request-page">
        <div className="shell quote-page-grid">
          <div className="quote-page-copy">
            <p className="eyebrow">New door request</p>
            <h1>Tell us what kind of door you need.</h1>
            <p className="hero-lede">Start with home or business, then share what you know. A rough size and a few preferences are enough to get the conversation moving.</p>
            <div className="urgent-card">
              <h3>Not sure about a measurement?</h3>
              <p>Send your best guess. Morgan Door can verify the opening before anything is ordered.</p>
              <a className="button button-call" href={phoneHref}>Or call {phoneDisplay}</a>
            </div>
            <div className="form-trust">
              <div><strong>Family-owned</strong><span>Local shop, not a national lead mill</span></div>
              <div><strong>Built in Burley</strong><span>Serving the Magic Valley since 1975</span></div>
              <div><strong>Home & business</strong><span>Garage and overhead doors</span></div>
              <div><strong>Human follow-up</strong><span>A local team member reviews every request</span></div>
            </div>
          </div>
          <div className="quote-card quote-card-page door-request-card">
            <div className="quote-heading">
              <p className="quote-kicker">Request a door</p>
              <h2>First, is it for a home or business?</h2>
              <p>The options change to fit the kind of building you choose.</p>
            </div>
            <RequestDoorForm />
          </div>
        </div>
      </section>
    </MdcPage>
  );
}
