import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import RahuKaalLive from "@/components/RahuKaalLive";
import { SEO_CITIES, cityBySlug } from "@/lib/seo-cities";

export function generateStaticParams() {
  return SEO_CITIES.map((c) => ({ city: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city } = await params;
  const c = cityBySlug(city);
  if (!c) return {};
  return {
    title: `${c.hi} में आज का राहु काल — Rahu Kaal Today in ${c.en}`,
    description: `Rahu Kaal today in ${c.en} (${c.hi}): exact live timings with Gulika Kaal and Yamaganda, computed astronomically from ${c.en}'s own sunrise — today plus the next 6 days.`,
    alternates: { canonical: `/rahu-kaal/${c.slug}/` },
  };
}

export default async function Page({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  const c = cityBySlug(city);
  if (!c) notFound();

  const faqs = [
    {
      q: `${c.hi} का राहु काल दिल्ली से अलग क्यों है?`,
      a: `राहु काल सूर्योदय-सूर्यास्त पर आधारित है — दिन का 1/8 भाग। ${c.hi} का सूर्योदय (अक्षांश ${c.lat}°, देशांतर ${c.lon}°) दिल्ली से अलग समय पर होता है, इसलिए राहु काल भी कुछ मिनट आगे-पीछे रहता है। यहां दिया समय ${c.hi} की अपनी खगोलीय गणना से है।`,
    },
    {
      q: "राहु काल में क्या टालना चाहिए?",
      a: "परम्परा के अनुसार नया काम शुरू करना, यात्रा आरंभ, बड़ी खरीदारी, लेन-देन और शुभ संस्कार राहु काल में टाले जाते हैं। पहले से चल रहे काम जारी रख सकते हैं। पूजा-उपासना (विशेषतः राहु शांति) इस अवधि में की जा सकती है।",
    },
    {
      q: "क्या यह समय हर पंचांग में एक जैसा होगा?",
      a: `हां — राहु काल की गणना सीधी है (दिन का 1/8 वां वार-क्रम से), इसलिए जो भी पंचांग ${c.hi} के सटीक सूर्योदय से गणना करे, समय यही आएगा। एक-दो मिनट का अंतर सूर्योदय की परिभाषा से आ सकता है।`,
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
            { name: "Rahu Kaal", href: "/rahu-kaal" },
            { name: c.en },
          ]}
        />
        <h1 className="section-heading">{c.hi} में आज का राहु काल</h1>
        <p className="section-heading-hi devanagari">Rahu Kaal Today in {c.en} · गुलिक काल · यमगण्ड — लाइव</p>

        <div className="tool-explainer" style={{ textAlign: "center", marginBottom: "2rem" }}>
          <p className="devanagari" style={{ fontWeight: 600, color: "var(--maroon)" }}>
            {c.hi} के आज के सूर्योदय-सूर्यास्त से खगोलीय गणना — अनुमान नहीं, सटीक समय।
          </p>
          <p>
            Rahu Kaal in {c.en} is computed from the city&apos;s own sunrise and sunset for each date — the window
            below updates live and includes the next 6 days for planning.
          </p>
        </div>

        <RahuKaalLive cityEn={c.en} cityHi={c.hi} lat={c.lat} lon={c.lon} tz={c.tz} />

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
                <Link href={`/rahu-kaal/${x.slug}/`}>{x.hi}</Link>
              </span>
            ))}
            {" · "}
            <Link href="/rahu-kaal/">सभी शहर →</Link>
          </p>

          <p className="guide-p devanagari" style={{ textAlign: "center", marginTop: "1.5rem" }}>
            {c.hi} का पूरा पंचांग: <Link href="/tools/panchang/">आज का पंचांग</Link> · अपनी कुंडली से शुभ दिन:{" "}
            <Link href="/tools/shubh-muhurta/">शुभ मुहूर्त टूल</Link>
          </p>
        </article>
      </div>
    </section>
  );
}
