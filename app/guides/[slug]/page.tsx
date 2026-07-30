import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GUIDES, getGuide } from "@/lib/guides";
import Breadcrumbs from "@/components/Breadcrumbs";
import Divider from "@/components/Divider";
import Icon from "@/components/Icon";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://astroshivanii.com";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};
  return {
    title: guide.title,
    description: guide.description,
    alternates: { canonical: `/guides/${guide.slug}/` },
    openGraph: {
      type: "article",
      title: guide.title,
      description: guide.description,
      url: `/guides/${guide.slug}/`,
    },
  };
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    dateModified: guide.updated,
    inLanguage: "en-IN",
    author: {
      "@type": "Person",
      name: "Shivanii",
      url: `${SITE_URL}/about/`,
    },
    publisher: { "@type": "Organization", name: "Astrologer Shivanii", url: SITE_URL },
    mainEntityOfPage: `${SITE_URL}/guides/${guide.slug}/`,
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: guide.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const related = GUIDES.filter((g) => g.slug !== guide.slug).slice(0, 3);

  return (
    <section className="section">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="container" style={{ maxWidth: "760px" }}>
        <Breadcrumbs
          crumbs={[
            { name: "Home", href: "/" },
            { name: "Guides", href: "/guides" },
            { name: guide.title },
          ]}
        />

        <article className="guide-article">
          <header style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div className="contact-icon" style={{ marginBottom: "0.75rem" }}>
              <Icon name={guide.icon} size={26} />
            </div>
            <h1 style={{ fontSize: "clamp(1.6rem, 4vw, 2.2rem)", marginBottom: "0.5rem" }}>
              {guide.title}
            </h1>
            <p className="devanagari" style={{ color: "var(--muted)", fontSize: "1.05rem", marginBottom: "0.75rem" }}>
              {guide.titleHi}
            </p>
            <p className="guide-card-meta">
              {guide.readMins} min read · Updated{" "}
              {new Date(guide.updated).toLocaleDateString("en-IN", { year: "numeric", month: "long" })}
              {" · "}By Shivanii
            </p>
          </header>

          {guide.intro.map((p, i) => (
            <p key={i} className="guide-p guide-intro">{p}</p>
          ))}

          {guide.sections.map((s) => (
            <div key={s.h}>
              <h2 className="guide-h2">{s.h}</h2>
              {s.p.map((p, i) => (
                <p key={i} className="guide-p">{p}</p>
              ))}
              {s.list && (
                <ul className="guide-list">
                  {s.list.map((li, i) => (
                    <li key={i}>{li}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          {/* Mini FAQ */}
          <h2 className="guide-h2">Common questions</h2>
          <div className="faq-list" style={{ marginBottom: "2rem" }}>
            {guide.faq.map((f, i) => (
              <details key={i} className="faq-item">
                <summary className="faq-q">
                  <span>{f.q}</span>
                  <span className="faq-chevron" aria-hidden="true">›</span>
                </summary>
                <div className="faq-a">{f.a}</div>
              </details>
            ))}
          </div>

          {/* CTA */}
          <div className="guide-cta">
            <p style={{ fontFamily: "var(--font-devanagari)", color: "var(--gold)", marginBottom: "0.75rem" }}>
              This is the theory. Your chart is the practice.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              {guide.tryTool && (
                <Link href={guide.tryTool.href} className="btn btn-ghost" style={{ color: "var(--gold-bright)", borderColor: "var(--gold)" }}>
                  {guide.tryTool.label}
                </Link>
              )}
              {guide.bookReading && (
                <Link href={guide.bookReading.href} className="btn btn-primary">
                  {guide.bookReading.label}
                </Link>
              )}
            </div>
          </div>

          <Divider symbol="ॐ" />

          {/* Related guides */}
          <h2 className="guide-h2" style={{ textAlign: "center" }}>Keep reading</h2>
          <div className="guide-grid" style={{ marginTop: "1rem" }}>
            {related.map((g) => (
              <Link key={g.slug} href={`/guides/${g.slug}`} className="guide-card">
                <div className="guide-card-icon">
                  <Icon name={g.icon} size={20} />
                </div>
                <div>
                  <h3 className="guide-card-title">{g.title}</h3>
                  <span className="guide-card-meta">{g.readMins} min read</span>
                </div>
              </Link>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
