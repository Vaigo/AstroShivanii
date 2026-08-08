import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import Divider from "@/components/Divider";
import { RASHIS, getRashi } from "@/lib/rashis";
import { truncateDescription } from "@/lib/seo";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://astroshivanii.com";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return RASHIS.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const r = getRashi(slug);
  if (!r) return {};
  return {
    title: `${r.name_hi} राशि (${r.name} Moon Sign) — स्वभाव व करियर`,
    description: truncateDescription(
      `${r.name_hi} (${r.name}) rashi explained: lord ${r.lord}, ${r.element} element, honest personality, career fields and love style.`
    ),
    alternates: { canonical: `/rashi/${r.slug}/` },
  };
}

export default async function RashiPage({ params }: Props) {
  const { slug } = await params;
  const r = getRashi(slug);
  if (!r) notFound();

  const prev = RASHIS[(r.index + 11) % 12];
  const next = RASHIS[(r.index + 1) % 12];

  const faqs = [
    {
      q: `${r.name_hi} राशि का स्वामी कौन है?`,
      a: `${r.name_hi} (${r.name}) का स्वामी ${r.lord} (${r.lord_hi}) है। तत्व: ${r.element_hi}, स्वभाव: ${r.quality_hi}। ${r.lord} की दशा और गोचर इस राशि के जातकों के लिए विशेष महत्वपूर्ण होते हैं।`,
    },
    {
      q: `${r.name_hi} राशि में कौन-कौन से नक्षत्र आते हैं?`,
      a: `${r.name_hi} में ये नक्षत्र आते हैं: ${r.nakshatra_spans.join("; ")}। आपका सटीक नक्षत्र आपके चंद्रमा के अंश से तय होता है।`,
    },
    {
      q: `${r.name_hi} राशि का शुभ दिन और रंग क्या है?`,
      a: `परम्परा में ${r.name_hi} के लिए ${r.lucky_day} शुभ दिन और ${r.lucky_colors.join(", ")} शुभ रंग माने जाते हैं — ये स्वामी ${r.lord_hi} से जुड़े हैं। स्मरण रहे: व्यक्तिगत शुभ-अशुभ आपकी पूरी कुंडली से तय होता है, केवल राशि से नहीं।`,
    },
  ];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${r.name_hi} राशि (${r.name} moon sign) — complete guide`,
    description: `${r.name} rashi: lord ${r.lord}, personality, career, love and health.`,
    inLanguage: "hi-IN",
    author: { "@type": "Person", name: "Shivanii", url: `${SITE_URL}/about/` },
    publisher: { "@type": "Organization", name: "Astrologer Shivanii", url: SITE_URL },
    mainEntityOfPage: `${SITE_URL}/rashi/${r.slug}/`,
  };

  return (
    <section className="section">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <div className="container" style={{ maxWidth: "760px" }}>
        <Breadcrumbs
          crumbs={[
            { name: "Home", href: "/" },
            { name: "Rashis", href: "/rashi" },
            { name: r.name },
          ]}
        />

        <article className="guide-article">
          <header style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <p className="guide-card-meta">Rashi {r.index + 1} of 12 · {r.symbol}</p>
            <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.4rem)", marginBottom: "0.25rem" }}>
              <span className="devanagari">{r.name_hi} राशि</span>
            </h1>
            <p style={{ color: "var(--maroon)", fontSize: "1.1rem" }}>{r.name} — Moon Sign</p>
          </header>

          <div className="planes-wrap" style={{ marginBottom: "1.5rem" }}>
            <table className="planes-table">
              <tbody>
                <tr><td><strong>स्वामी / Lord</strong></td><td>{r.lord} <span className="devanagari">({r.lord_hi})</span></td></tr>
                <tr><td><strong>तत्व / Element</strong></td><td>{r.element} <span className="devanagari">({r.element_hi})</span></td></tr>
                <tr><td><strong>स्वभाव / Quality</strong></td><td>{r.quality} <span className="devanagari">({r.quality_hi})</span></td></tr>
                <tr><td><strong>प्रतीक / Symbol</strong></td><td>{r.symbol} <span className="devanagari">({r.symbol_hi})</span></td></tr>
                <tr><td><strong>शरीर-अंग / Body part</strong></td><td>{r.body_part}</td></tr>
                <tr><td><strong>शुभ दिन / रंग</strong></td><td>{r.lucky_day} · {r.lucky_colors.join(", ")}</td></tr>
              </tbody>
            </table>
          </div>

          <h2 className="guide-h2">स्वभाव — Nature &amp; mind</h2>
          <p className="guide-p">{r.traits_en}</p>
          <p className="guide-p devanagari">{r.traits_hi}</p>

          <h2 className="guide-h2">Nakshatras in {r.name}</h2>
          <p className="guide-p">
            Your rashi tells the chapter; your <Link href="/nakshatra">nakshatra</Link> tells
            the page. {r.name_hi} contains:
          </p>
          <ul className="guide-list">
            {r.nakshatra_spans.map((s) => <li key={s}>{s}</li>)}
          </ul>

          <h2 className="guide-h2">Career</h2>
          <p className="guide-p">{r.career}</p>

          <h2 className="guide-h2">Love &amp; relationships</h2>
          <p className="guide-p">{r.love}</p>

          <h2 className="guide-h2">Health tendencies</h2>
          <p className="guide-p">
            {r.health} These are tendencies, not diagnoses — and a well-placed lord in your
            personal chart changes the picture entirely.
          </p>

          <h2 className="guide-h2">Common questions</h2>
          <div className="faq-list" style={{ marginBottom: "2rem" }}>
            {faqs.map((f, i) => (
              <details key={i} className="faq-item">
                <summary className="faq-q">
                  <span className="devanagari">{f.q}</span>
                  <span className="faq-chevron" aria-hidden="true">›</span>
                </summary>
                <div className="faq-a devanagari">{f.a}</div>
              </details>
            ))}
          </div>

          <div className="guide-cta">
            <p style={{ fontFamily: "var(--font-devanagari)", color: "var(--gold)", marginBottom: "0.75rem" }}>
              {r.name_hi} आपकी चंद्र राशि है? आज का हाल राशिफल में, जीवन का हाल कुंडली में।
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/tools/rashifal" className="btn btn-ghost" style={{ color: "var(--gold-bright)", borderColor: "var(--gold)" }}>
                आज का {r.name_hi} राशिफल
              </Link>
              <Link href="/readings/birth-chart" className="btn btn-primary">
                Get your chart read by Shivanii
              </Link>
            </div>
          </div>

          <Divider symbol="✦" />

          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
            <Link href={`/rashi/${prev.slug}`} style={{ color: "var(--maroon)", fontWeight: 600, fontSize: "0.9rem" }}>
              ← {prev.name}
            </Link>
            <Link href="/rashi" style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
              All 12 rashis
            </Link>
            <Link href={`/rashi/${next.slug}`} style={{ color: "var(--maroon)", fontWeight: 600, fontSize: "0.9rem" }}>
              {next.name} →
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}
