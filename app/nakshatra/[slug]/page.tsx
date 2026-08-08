import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import Divider from "@/components/Divider";
import { NAKSHATRAS, GANA_HI, getNakshatra, padaNavamsa } from "@/lib/nakshatras";
import { truncateDescription } from "@/lib/seo";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://astroshivanii.com";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return NAKSHATRAS.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const n = getNakshatra(slug);
  if (!n) return {};
  return {
    title: `${n.name} Nakshatra (${n.name_hi}) — स्वामी ${n.lord_hi}`,
    description: truncateDescription(
      `${n.name} nakshatra explained: ruling planet ${n.lord}, deity ${n.deity}, ${n.gana} gana — honest personality, career and remedy guidance.`
    ),
    alternates: { canonical: `/nakshatra/${n.slug}/` },
  };
}

export default async function NakshatraPage({ params }: Props) {
  const { slug } = await params;
  const n = getNakshatra(slug);
  if (!n) notFound();

  const prev = NAKSHATRAS[(n.index + 26) % 27];
  const next = NAKSHATRAS[(n.index + 1) % 27];

  const faqs = [
    {
      q: `${n.name} nakshatra का स्वामी ग्रह कौन है?`,
      a: `${n.name} (${n.name_hi}) का स्वामी ${n.lord} (${n.lord_hi}) है और देवता ${n.deity_hi} हैं। इसका विस्तार ${n.span_hi} तक है। ${n.lord} की दशा-अंतर्दशा इस नक्षत्र के जातकों के जीवन में विशेष महत्व रखती है।`,
    },
    {
      q: `${n.name} में जन्म हो तो नाम किस अक्षर से रखें?`,
      a: `${n.name_hi} के चार चरणों के नामाक्षर हैं: ${n.syllables.join(", ")}। परम्परा में जन्म-पाद के अक्षर से नाम रखा जाता है — आपका पाद आपकी जन्म-कुंडली से पता चलता है।`,
    },
    {
      q: `${n.name} nakshatra किस राशि में आता है?`,
      a: `${n.name} का विस्तार ${n.span} (${n.span_hi}) है। गण: ${n.gana} (${GANA_HI[n.gana]}), योनि: ${n.yoni} (${n.yoni_hi}) — ये दोनों विवाह-मिलान (अष्टकूट) में प्रयुक्त होते हैं।`,
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
    headline: `${n.name} Nakshatra (${n.name_hi}) — complete guide`,
    description: `${n.name} nakshatra: lord ${n.lord}, deity ${n.deity}, personality, careers and remedies.`,
    inLanguage: "en-IN",
    author: { "@type": "Person", name: "Shivanii", url: `${SITE_URL}/about/` },
    publisher: { "@type": "Organization", name: "Astrologer Shivanii", url: SITE_URL },
    mainEntityOfPage: `${SITE_URL}/nakshatra/${n.slug}/`,
  };

  return (
    <section className="section">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <div className="container" style={{ maxWidth: "760px" }}>
        <Breadcrumbs
          crumbs={[
            { name: "Home", href: "/" },
            { name: "Nakshatras", href: "/nakshatra" },
            { name: n.name },
          ]}
        />

        <article className="guide-article">
          <header style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <p className="guide-card-meta">Nakshatra {n.index + 1} of 27</p>
            <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.4rem)", marginBottom: "0.25rem" }}>
              {n.name} Nakshatra
            </h1>
            <p className="devanagari" style={{ color: "var(--maroon)", fontSize: "1.3rem" }}>{n.name_hi}</p>
          </header>

          {/* Attribute table */}
          <div className="planes-wrap" style={{ marginBottom: "1.5rem" }}>
            <table className="planes-table">
              <tbody>
                <tr><td><strong>विस्तार / Span</strong></td><td>{n.span} <span className="devanagari">({n.span_hi})</span></td></tr>
                <tr><td><strong>स्वामी / Lord</strong></td><td>{n.lord} <span className="devanagari">({n.lord_hi})</span></td></tr>
                <tr><td><strong>देवता / Deity</strong></td><td>{n.deity} <span className="devanagari">({n.deity_hi})</span></td></tr>
                <tr><td><strong>प्रतीक / Symbol</strong></td><td>{n.symbol} <span className="devanagari">({n.symbol_hi})</span></td></tr>
                <tr><td><strong>गण / Gana</strong></td><td>{n.gana} <span className="devanagari">({GANA_HI[n.gana]})</span></td></tr>
                <tr><td><strong>योनि / Yoni</strong></td><td>{n.yoni} <span className="devanagari">({n.yoni_hi})</span></td></tr>
                <tr><td><strong>नामाक्षर / Name syllables</strong></td><td className="devanagari">{n.syllables.join(" · ")}</td></tr>
              </tbody>
            </table>
          </div>

          <h2 className="guide-h2">स्वभाव — Nature &amp; personality</h2>
          <p className="guide-p">{n.traits_en}</p>
          <p className="guide-p devanagari">{n.traits_hi}</p>

          <h2 className="guide-h2">The four padas</h2>
          <p className="guide-p">
            Each nakshatra spans four padas (quarters), and each pada falls in a different
            navamsa sign — colouring the same star four different ways. Your pada comes from
            your exact Moon degree:
          </p>
          <div className="planes-wrap" style={{ marginBottom: "1.25rem" }}>
            <table className="planes-table">
              <thead>
                <tr><th>पाद</th><th>नामाक्षर</th><th>नवांश राशि</th></tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4].map((p) => {
                  const nav = padaNavamsa(n.index, p);
                  return (
                    <tr key={p}>
                      <td>Pada {p}</td>
                      <td className="devanagari">{n.syllables[p - 1]}</td>
                      <td>{nav.en} <span className="devanagari">({nav.hi})</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <h2 className="guide-h2">Career directions</h2>
          <ul className="guide-list">
            {n.careers.map((c) => <li key={c}>{c}</li>)}
          </ul>

          <h2 className="guide-h2">The honest caution</h2>
          <p className="guide-p">
            {n.watch_out} <span className="devanagari">({n.watch_out_hi})</span> — every
            nakshatra has a shadow; naming it plainly is how this site works. No star is
            "bad", and no shadow is a sentence.
          </p>

          <h2 className="guide-h2">Matching &amp; remedies</h2>
          <p className="guide-p">
            In Ashtakoot matching, {n.name}&apos;s <b>{n.gana} gana</b> and <b>{n.yoni} yoni</b>{" "}
            are compared with the partner&apos;s star — but gana or yoni mismatches alone never
            reject a match; the full picture decides. For strengthening this nakshatra, the
            classical route is honouring its deity <span className="devanagari">{n.deity_hi}</span>{" "}
            and the mantra and charity of its lord <b>{n.lord}</b>{" "}
            on the lord&apos;s weekday — personalised remedies belong in a full reading, not a webpage.
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

          {/* CTA */}
          <div className="guide-cta">
            <p style={{ fontFamily: "var(--font-devanagari)", color: "var(--gold)", marginBottom: "0.75rem" }}>
              {n.name_hi} आपका जन्म-नक्षत्र है? यह केवल परिचय है — कुंडली पूरी कहानी कहती है।
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/tools/kundli" className="btn btn-ghost" style={{ color: "var(--gold-bright)", borderColor: "var(--gold)" }}>
                Check your nakshatra free
              </Link>
              <Link href="/readings/birth-chart" className="btn btn-primary">
                Get your chart read by Shivanii
              </Link>
            </div>
          </div>

          <Divider symbol="✦" />

          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
            <Link href={`/nakshatra/${prev.slug}`} style={{ color: "var(--maroon)", fontWeight: 600, fontSize: "0.9rem" }}>
              ← {prev.name}
            </Link>
            <Link href="/nakshatra" style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
              All 27 nakshatras
            </Link>
            <Link href={`/nakshatra/${next.slug}`} style={{ color: "var(--maroon)", fontWeight: 600, fontSize: "0.9rem" }}>
              {next.name} →
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}
