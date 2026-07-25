import type { Metadata } from "next";
import { MdcPage } from "../_components/MdcChrome";
import { articles } from "../_data/articles";

export const metadata: Metadata = {
  title: "Garage Door Advice for Magic Valley Homeowners | Morgan Door",
  description: "Practical garage door repair, maintenance, safety, opener, and installation guidance for Burley, Twin Falls, and Southern Idaho.",
};

export default function ResourcesPage() {
  return (
    <MdcPage>
      <section className="resource-hero">
        <div className="shell">
          <p className="eyebrow">Useful answers from a local door company</p>
          <h1>Garage door advice for Magic Valley homes and businesses.</h1>
          <p>Practical safety, maintenance, and problem-solving guidance—written for Southern Idaho conditions and the questions customers actually ask.</p>
        </div>
      </section>
      <section className="section">
        <div className="shell article-grid">
          {articles.map((article) => (
            <article className="article-card" key={article.slug}>
              <p className="quote-kicker">{article.keyword}</p>
              <h2><a href={`/mdc/resources/${article.slug}`}>{article.title}</a></h2>
              <p>{article.dek}</p>
              <div><span>{article.readTime}</span><a href={`/mdc/resources/${article.slug}`}>Read article →</a></div>
            </article>
          ))}
        </div>
      </section>
    </MdcPage>
  );
}
