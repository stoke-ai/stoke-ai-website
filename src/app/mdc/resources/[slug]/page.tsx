import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FinalCta, MdcPage } from "../../_components/MdcChrome";
import { articles, getArticle } from "../../_data/articles";

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return {
    title: `${article.title} | Morgan Door`,
    description: article.description,
    alternates: { canonical: `https://stoke-ai.com/mdc/resources/${article.slug}` },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    author: { "@type": "Organization", name: "Morgan Door Company" },
    publisher: { "@type": "Organization", name: "Morgan Door Company" },
    mainEntityOfPage: `https://stoke-ai.com/mdc/resources/${article.slug}`,
  };

  return (
    <MdcPage>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <article className="resource-article">
        <header className="article-header">
          <div className="shell article-shell">
            <Link className="back-link" href="/mdc/resources">← Garage Door Resources</Link>
            <p className="eyebrow">{article.keyword}</p>
            <h1>{article.title}</h1>
            <p className="article-dek">{article.dek}</p>
            <div className="article-meta"><span>{article.readTime}</span><span>Reviewed July 2026</span><span>Southern Idaho</span></div>
          </div>
        </header>
        <div className="shell article-layout">
          <div className="article-body">
            {article.sections.map((section) => (
              <section key={section.heading}>
                <h2>{section.heading}</h2>
                {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                {section.bullets && <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}
              </section>
            ))}
            <aside className="safety-box"><strong>Safety note</strong><p>Garage door springs, cables, bottom fixtures, and heavy sections can cause serious injury. When the door is off track, hanging, unusually heavy, or damaged, stop operating it and call a trained professional.</p></aside>
          </div>
          <aside className="article-sidebar">
            <div><p className="quote-kicker">Related help</p>{article.related.map((link) => <a key={link.href} href={link.href}>{link.label} →</a>)}</div>
            <div className="sidebar-call"><h3>Need service?</h3><p>Tell Morgan Door what the door is doing and where you are.</p><a className="button" href="/mdc/free-quote">Request a Quote</a></div>
          </aside>
        </div>
      </article>
      <FinalCta />
    </MdcPage>
  );
}
