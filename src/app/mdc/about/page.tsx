import type { Metadata } from "next";
import { FinalCta, MdcPage } from "../_components/MdcChrome";

export const metadata: Metadata = {
  title: "About Morgan Door Company | Family-Owned Since 1975",
  description: "Meet the Burley family behind Morgan Door Company: Lynn Morgan, Roger Morgan, Braxton Greener, and a trained local team serving Southern Idaho.",
  alternates: { canonical: "https://stoke-ai.com/mdc/about" },
};

const people = [
  { name: "Lynn Morgan", role: "Founder", image: "https://morgandoorcompany.com/wp-content/uploads/2025/03/Lynn-Morgan-600x600.jpg", copy: "Lynn started Morgan Door Company in 1975 and built the company around skilled work, honest recommendations, and accountability to local customers." },
  { name: "Roger Morgan", role: "Owner & CEO", image: "https://morgandoorcompany.com/wp-content/uploads/2025/03/roger-sq-600x600.jpg", copy: "Roger carried the business forward in 1998, growing its residential and commercial capabilities without losing the standards attached to the Morgan name." },
  { name: "Braxton Greener", role: "COO", image: "https://morgandoorcompany.com/wp-content/uploads/2025/03/Braxton-Greener-sq-600x600.jpg", copy: "Braxton helps lead today’s operation with a focus on precise, durable installations and a straightforward customer experience." },
];

export default function AboutPage() {
  return (
    <MdcPage>
      <section className="subhero about-hero">
        <div className="subhero-bg" style={{ backgroundImage: "url('https://morgandoorcompany.com/wp-content/uploads/2025/03/mdc-office-400x227.webp')" }} />
        <div className="subhero-overlay" />
        <div className="shell subhero-inner">
          <p className="eyebrow">A Burley company for more than 50 years</p>
          <h1>Family ownership still means your name is on the work.</h1>
          <p>Morgan Door Company has grown across generations, but the basic promise has not changed: answer honestly, recommend what fits, install it correctly, and stand behind the work locally.</p>
        </div>
      </section>

      <section className="section legacy-section">
        <div className="shell legacy-grid">
          <div>
            <p className="eyebrow dark">The Morgan Door story</p>
            <h2>Started by Lynn in 1975. Carried forward by Roger. Built for what comes next.</h2>
          </div>
          <div className="prose">
            <p>In 1975, Lynn Morgan opened Morgan Door Company in Burley. The business grew the way durable local companies usually do: one installation, one repair, and one recommendation at a time.</p>
            <p>Roger took the company forward in 1998. He expanded the operation while keeping it tied to the same community where the Morgan name had to mean something after the invoice was paid.</p>
            <p>Today, Roger, Braxton Greener, and the Morgan Door team serve homeowners, builders, farms, shops, and commercial facilities across the Magic Valley. The equipment and door systems have changed. The expectation of doing the work correctly has not.</p>
          </div>
        </div>
      </section>

      <section className="section team-section">
        <div className="shell">
          <div className="section-heading centered"><p className="eyebrow dark">Three generations of responsibility</p><h2>The people behind the promise.</h2></div>
          <div className="team-grid">
            {people.map((person) => (
              <article key={person.name}>
                <img src={person.image} alt={person.name} />
                <div><p className="quote-kicker">{person.role}</p><h3>{person.name}</h3><p>{person.copy}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="local-proof">
        <div className="shell local-proof-grid">
          <div>
            <p className="eyebrow">Why family ownership matters in 2026</p>
            <h2>You know who is accountable.</h2>
            <p>A local name is not a substitute for good systems or training. It is a reason to make those systems better—because customers see us at the store, at school events, on jobsites, and around town.</p>
          </div>
          <ul>
            <li>✓ Decisions are made by people who understand Southern Idaho</li>
            <li>✓ No national call center or anonymous ownership group</li>
            <li>✓ Long-term service matters more than a one-time sale</li>
            <li>✓ Local reputation follows every truck and every installer</li>
          </ul>
        </div>
      </section>

      <section className="section standards-section">
        <div className="shell">
          <div className="section-heading split-heading">
            <div><p className="eyebrow dark">Training, safety & equipment</p><h2>Professional work requires more than experience alone.</h2></div>
            <p>Garage doors are large moving systems under significant spring tension. Morgan Door’s installers are trained, properly equipped, and work to applicable safety requirements.</p>
          </div>
          <div className="detail-card-grid">
            <article><h3>Trained installers</h3><p>Installation and repair procedures are handled by professionals who understand balance, track, hardware, operators, and safety systems.</p></article>
            <article><h3>Correct equipment</h3><p>The team arrives with the tools and protective equipment required to work safely around heavy doors and counterbalance systems.</p></article>
            <article><h3>Safety certifications</h3><p>Morgan Door states that its team maintains the regulatory safety certificates required for its work.</p></article>
            <article><h3>Final system test</h3><p>The job is not complete until the door travels correctly, relevant safety features are tested, and the customer understands the result.</p></article>
          </div>
        </div>
      </section>

      <section className="section raynor-section">
        <div className="shell repair-grid">
          <div className="repair-photo"><img src="https://morgandoorcompany.com/wp-content/uploads/2025/03/raynor-doors-by-Morgan-Door-Company.webp" alt="Raynor garage doors installed by Morgan Door Company" /></div>
          <div className="repair-copy">
            <p className="eyebrow dark">Raynor and Hörmann</p>
            <h2>Quality doors backed by local installation.</h2>
            <p className="large-copy">Morgan Door sells both Raynor and Hörmann. The door, hardware, operator, and installation should work as one system. You get practical options and a local Burley company to install and service them.</p>
            <a className="button" href="/mdc/garage-door-installation">Explore New Doors</a>
          </div>
        </div>
      </section>

      <section className="section expectation-section">
        <div className="shell">
          <div className="section-heading centered"><p className="eyebrow dark">What to expect when you call</p><h2>No mystery. No runaround.</h2></div>
          <div className="process-grid">
            <article><span>1</span><h3>A local conversation</h3><p>Tell us what the door is doing, where you are, and whether the situation is urgent.</p></article>
            <article><span>2</span><h3>Useful next questions</h3><p>We ask only what helps determine service, safety, measurements, or the right appointment.</p></article>
            <article><span>3</span><h3>A clear recommendation</h3><p>After inspection, we explain the options and quote the work before proceeding.</p></article>
            <article><span>4</span><h3>A professional handoff</h3><p>We test the work, clean the area, and show you what was completed.</p></article>
          </div>
        </div>
      </section>
      <FinalCta title="Work with the local door company built to be here tomorrow." />
    </MdcPage>
  );
}
