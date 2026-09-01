import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import ChoghadiyaLive from "@/components/ChoghadiyaLive";
import { SEO_CITIES, cityBySlug } from "@/lib/seo-cities";

export function generateStaticParams() {
  return SEO_CITIES.map((c) => ({ city: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city } = await params;
  const c = cityBySlug(city);
  if (!c) return {};
  return {
    title: `${c.hi} का आज का चौघड़िया — Choghadiya Today in ${c.en}`,
    description: `Aaj ka choghadiya in ${c.en} (${c.hi}): live day & night choghadiya table with the current period highlighted, plus Abhijit muhurta — computed from ${c.en}'s own sunrise and sunset.`,
    alternates: { canonical: `/choghadiya/${c.slug}/` },
  };
}

export default async function Page({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  const c = cityBySlug(city);
  if (!c) notFound();

  const faqs = [
    {
      q: `${c.hi} का चौघड़िया दूसरे शहरों से अलग क्यों है?`,
      a: `चौघड़िया सूर्योदय-सूर्यास्त के 8-8 भाग हैं, और ${c.hi} (अक्षांश ${c.lat}°, देशांतर ${c.lon}°) का सूर्योदय दूसरे शहरों से अलग समय पर होता है। यहां दिया हर समय ${c.hi} की अपनी खगोलीय गणना से है — किसी और शहर की तालिका यहां सटीक नहीं बैठेगी।`,
    },
    {
      q: "शुभ काम के लिए कौन-से चौघड़िया चुनें?",
      a: "अमृत, शुभ, लाभ और चर — ये चार शुभ माने जाते हैं। काल, रोग और उद्वेग में नए काम टालें। साथ में राहु काल भी देख लें — शुभ चौघड़िया और राहु काल एक साथ पड़ें तो राहु काल को वरीयता देकर वह समय टालना ही परम्परा है।",
    },
    {
      q: "रात का चौघड़िया कब काम आता है?",
      a: "रात के काम — जैसे देर की यात्रा शुरू करना, रात की पूजा, या ऑनलाइन शुभ काम — के लिए रात का चौघड़िया देखा जाता है। यह सूर्यास्त से अगले सूर्योदय तक के 8 भाग हैं, तालिका ऊपर दी है।",
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

  return (
    <section className="section">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <div className="container" style={{ maxWidth: "860px" }}>
        <Breadcrumbs
          crumbs={[
            { name: "Home", href: "/" },
            { name: "Choghadiya", href: "/choghadiya" },
            { name: c.en },
          ]}
        />
        <h1 className="section-heading">{c.hi} का आज का चौघड़िया</h1>
        <p className="section-heading-hi devanagari">Choghadiya Today in {c.en} · दिन-रात के 16 भाग · अभिजीत मुहूर्त</p>

        <div className="tool-explainer" style={{ textAlign: "center", marginBottom: "2rem" }}>
          <p className="devanagari" style={{ fontWeight: 600, color: "var(--maroon)" }}>
            {c.hi} के आज के सूर्योदय-सूर्यास्त से खगोलीय गणना — अभी चल रहा चौघड़िया highlighted है।
          </p>
        </div>

        <ChoghadiyaLive cityEn={c.en} cityHi={c.hi} lat={c.lat} lon={c.lon} tz={c.tz} />

        <article className="guide-article" style={{ marginTop: "2.5rem" }}>
          <h2 className="guide-h2 devanagari">आम सवाल</h2>
          <div className="faq-list">
            {faqs.map((f, i) => (
              <details key={i} className="faq-item">
                <summary className="faq-q devanagari">
                  <span>{f.q}</span>
                  <span className="faq-chevron" aria-hidden="true">›</span>
                </summary>
                <div className="faq-a devanagari">{f.a}</div>
              </details>
            ))}
          </div>

          <h2 className="guide-h2 devanagari">अन्य शहर</h2>
          <p className="guide-p devanagari" style={{ lineHeight: 2 }}>
            {SEO_CITIES.filter((x) => x.slug !== c.slug).slice(0, 12).map((x, i) => (
              <span key={x.slug}>
                {i > 0 && " · "}
                <Link href={`/choghadiya/${x.slug}/`}>{x.hi}</Link>
              </span>
            ))}
            {" · "}
            <Link href="/choghadiya/">सभी शहर →</Link>
          </p>

          <p className="guide-p devanagari" style={{ textAlign: "center", marginTop: "1.5rem" }}>
            {c.hi} का राहु काल: <Link href={`/rahu-kaal/${c.slug}/`}>यहां देखें</Link> ·{" "}
            <Link href="/tools/panchang/">पूरा पंचांग</Link>
          </p>
        </article>
      </div>
    </section>
  );
}
