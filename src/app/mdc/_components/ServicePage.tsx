import { FinalCta, MdcPage, phoneDisplay, phoneHref } from "./MdcChrome";

export type ServicePageData = {
  eyebrow: string;
  title: string;
  intro: string;
  image: string;
  imageAlt: string;
  problemsTitle: string;
  problems: { title: string; copy: string }[];
  differentiators: { title: string; copy: string }[];
  process: { title: string; copy: string }[];
  localProof: string[];
  faqs: { question: string; answer: string }[];
  quoteHref?: string;
  quoteLabel?: string;
};

export default function ServicePage({ data }: { data: ServicePageData }) {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: data.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <MdcPage>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <section className="subhero">
        <div className="subhero-bg" style={{ backgroundImage: `url("${data.image}")` }} role="img" aria-label={data.imageAlt} />
        <div className="subhero-overlay" />
        <div className="shell subhero-inner">
          <p className="eyebrow">{data.eyebrow}</p>
          <h1>{data.title}</h1>
          <p>{data.intro}</p>
          <div className="hero-actions">
            <a className="button button-call" href={phoneHref}>Call {phoneDisplay}</a>
            <a className="button button-ghost" href={data.quoteHref ?? "/mdc/free-quote"}>{data.quoteLabel ?? "Get a Free Quote"}</a>
          </div>
        </div>
      </section>

      <section className="trust-bar">
        <div className="shell trust-grid">
          <div><strong>50+</strong><span>Years serving Southern Idaho</span></div>
          <div><strong>Family</strong><span>Owned & operated</span></div>
          <div><strong>Raynor</strong><span>Residential & commercial</span></div>
          <div><strong>Trained</strong><span>Professional installers</span></div>
          <div><strong>Local</strong><span>Magic Valley experience</span></div>
        </div>
      </section>

      <section className="section sub-section">
        <div className="shell">
          <div className="section-heading split-heading">
            <div><p className="eyebrow dark">Problems we solve</p><h2>{data.problemsTitle}</h2></div>
            <p>We start with what is actually wrong, explain the practical options, and quote the work before moving forward.</p>
          </div>
          <div className="detail-card-grid">
            {data.problems.map((item) => <article key={item.title}><h3>{item.title}</h3><p>{item.copy}</p></article>)}
          </div>
        </div>
      </section>

      <section className="section why-section">
        <div className="shell">
          <div className="section-heading centered"><p className="eyebrow dark">Why Morgan Door</p><h2>Local accountability from estimate to final test.</h2></div>
          <div className="why-grid">
            {data.differentiators.map((item, index) => (
              <article key={item.title}><span>0{index + 1}</span><h3>{item.title}</h3><p>{item.copy}</p></article>
            ))}
          </div>
        </div>
      </section>

      <section className="section process-section">
        <div className="shell">
          <div className="section-heading centered"><p className="eyebrow dark">Simple process</p><h2>Know what happens next.</h2></div>
          <div className="process-grid">
            {data.process.map((item, index) => <article key={item.title}><span>{index + 1}</span><h3>{item.title}</h3><p>{item.copy}</p></article>)}
          </div>
        </div>
      </section>

      <section className="local-proof">
        <div className="shell local-proof-grid">
          <div><p className="eyebrow">Built in Burley</p><h2>Southern Idaho experience matters.</h2><p>Cold mornings, wind, dust, agricultural buildings, busy shops, and long travel distances all affect what makes a door system practical here.</p></div>
          <ul>{data.localProof.map((proof) => <li key={proof}>✓ {proof}</li>)}</ul>
        </div>
      </section>

      <section className="section faq-section">
        <div className="shell faq-layout">
          <div><p className="eyebrow dark">Straight answers</p><h2>Frequently asked questions.</h2><p>Still unsure? Call us. You will reach a local team that works on these doors every day.</p></div>
          <div className="faq-list">
            {data.faqs.map((faq) => <details key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}
          </div>
        </div>
      </section>
      <FinalCta />
    </MdcPage>
  );
}
