import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import ChoghadiyaLive from "@/components/ChoghadiyaLive";
import { SEO_CITIES } from "@/lib/seo-cities";

export const metadata: Metadata = {
  title: "आज का चौघड़िया — Aaj Ka Choghadiya, Live Day & Night Muhurat",
  description:
    "Aaj ka choghadiya: today's live day and night choghadiya (Amrit, Shubh, Labh, Char, Kaal, Rog, Udveg) with the current period highlighted, plus Abhijit muhurta — computed from your city's own sunrise. Delhi, Mumbai and 30+ Indian cities.",
  alternates: { canonical: "/choghadiya/" },
};

const FAQS = [
  {
    q: "चौघड़िया क्या है और कैसे बनता है?",
    a: "दिन (सूर्योदय से सूर्यास्त) और रात, दोनों को 8-8 बराबर भागों में बांटा जाता है — हर भाग लगभग डेढ़ घंटे का, इसीलिए नाम 'चौ-घड़िया' (चार घड़ी)। हर भाग का एक स्वामी ग्रह है, और उसी से उसका फल तय होता है: अमृत, शुभ, लाभ, चर शुभ माने जाते हैं; काल, रोग, उद्वेग अशुभ।",
  },
  {
    q: "किस काम के लिए कौन-सा चौघड़िया चुनें?",
    a: "अमृत — हर शुभ कार्य के लिए सर्वोत्तम। शुभ — विवाह, पूजा, धार्मिक कार्य। लाभ — व्यापार, नया काम, खरीदारी। चर — यात्रा और चलते-फिरते काम। काल/रोग/उद्वेग में नए काम टालें — पर ध्यान रहे, चौघड़िया के साथ राहु काल भी देखना चाहिए।",
  },
  {
    q: "अभिजीत मुहूर्त क्या है?",
    a: "दोपहर के आसपास (स्थानीय मध्याह्न के लगभग 24 मिनट आगे-पीछे) का छोटा-सा दैनिक मुहूर्त, जो लगभग हर काम के लिए शुभ माना जाता है — बुधवार को छोड़कर। जब कोई और शुभ समय न मिले तो अभिजीत सबसे भरोसेमंद विकल्प है। ऊपर के टूल में आज का सटीक अभिजीत समय दिया है।",
  },
  {
    q: "हर शहर का चौघड़िया अलग क्यों होता है?",
    a: "चौघड़िया सूर्योदय-सूर्यास्त पर आधारित है, और हर शहर का सूर्योदय अलग समय पर होता है। इसीलिए दिल्ली और मुंबई का एक ही दिन का चौघड़िया कई मिनट अलग रहता है — यहां हर शहर की अपनी खगोलीय गणना होती है।",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const delhi = SEO_CITIES[0];

export default function Page() {
  return (
    <section className="section">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <div className="container" style={{ maxWidth: "860px" }}>
        <Breadcrumbs crumbs={[{ name: "Home", href: "/" }, { name: "Free Tools", href: "/tools" }, { name: "Choghadiya" }]} />
        <h1 className="section-heading">आज का चौघड़िया — Aaj Ka Choghadiya</h1>
        <p className="section-heading-hi devanagari">दिन-रात के 16 चौघड़िया · अभी कौन-सा चल रहा है · अभिजीत मुहूर्त</p>

        <div className="tool-explainer" style={{ textAlign: "center", marginBottom: "2rem" }}>
          <p className="devanagari" style={{ fontWeight: 600, color: "var(--maroon)" }}>
            कोई भी शुभ काम शुरू करने से पहले — अभी कौन-सा चौघड़िया चल रहा है, एक नज़र में।
          </p>
          <p>
            Choghadiya divides the day and the night into 8 parts each, ruled by planets — Amrit, Shubh, Labh and
            Char are auspicious. Times below are computed live from the city&apos;s own sunrise.
          </p>
        </div>

        <ChoghadiyaLive cityEn={delhi.en} cityHi={delhi.hi} lat={delhi.lat} lon={delhi.lon} tz={delhi.tz} />

        <h2 className="guide-h2 devanagari" style={{ marginTop: "2.5rem" }}>अपने शहर का चौघड़िया देखें</h2>
        <div className="guide-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "0.6rem", margin: "1rem 0 2rem" }}>
          {SEO_CITIES.map((c) => (
            <Link key={c.slug} href={`/choghadiya/${c.slug}/`} className="guide-card devanagari" style={{ padding: "0.6rem 0.8rem", textAlign: "center" }}>
              {c.hi} <span style={{ color: "var(--muted)", fontSize: "0.78rem" }}>({c.en})</span>
            </Link>
          ))}
        </div>

        <article className="guide-article">
          <h2 className="guide-h2 devanagari">सातों चौघड़िया — कौन शुभ, कौन अशुभ</h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--gold)" }}>
                  <th className="devanagari" style={{ textAlign: "left", padding: "0.45rem" }}>चौघड़िया</th>
                  <th className="devanagari" style={{ textAlign: "left", padding: "0.45rem" }}>स्वामी</th>
                  <th className="devanagari" style={{ textAlign: "left", padding: "0.45rem" }}>फल</th>
                  <th className="devanagari" style={{ textAlign: "left", padding: "0.45rem" }}>किस काम के लिए</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["अमृत", "चंद्र", "सर्वश्रेष्ठ", "हर शुभ कार्य"],
                  ["शुभ", "गुरु", "शुभ", "विवाह, पूजा, धार्मिक कार्य"],
                  ["लाभ", "बुध", "शुभ", "व्यापार आरंभ, खरीदारी, नया काम"],
                  ["चर", "शुक्र", "शुभ (गतिशील)", "यात्रा, वाहन, चलते-फिरते काम"],
                  ["काल", "शनि", "अशुभ", "टालें (धन-संचय अपवाद परम्परा में)"],
                  ["रोग", "मंगल", "अशुभ", "टालें (विवाद/प्रतियोगिता अपवाद)"],
                  ["उद्वेग", "सूर्य", "अशुभ", "टालें (सरकारी काम अपवाद परम्परा में)"],
                ].map(([n, l, ph, use]) => (
                  <tr key={n} style={{ borderBottom: "1px solid rgba(201,154,58,0.25)" }}>
                    <td className="devanagari" style={{ padding: "0.45rem", fontWeight: 600 }}>{n}</td>
                    <td className="devanagari" style={{ padding: "0.45rem" }}>{l}</td>
                    <td className="devanagari" style={{ padding: "0.45rem" }}>{ph}</td>
                    <td className="devanagari" style={{ padding: "0.45rem" }}>{use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="guide-h2 devanagari">आम सवाल</h2>
          <div className="faq-list">
            {FAQS.map((f, i) => (
              <details key={i} className="faq-item">
                <summary className="faq-q devanagari">
                  <span>{f.q}</span>
                  <span className="faq-chevron" aria-hidden="true">›</span>
                </summary>
                <div className="faq-a devanagari">{f.a}</div>
              </details>
            ))}
          </div>

          <p className="guide-p devanagari" style={{ textAlign: "center", marginTop: "1.5rem" }}>
            साथ में देखें: <Link href="/rahu-kaal/">आज का राहु काल</Link> ·{" "}
            <Link href="/tools/panchang/">पूरा पंचांग</Link> · अपनी कुंडली से शुभ दिन:{" "}
            <Link href="/tools/shubh-muhurta/">शुभ मुहूर्त टूल</Link>
          </p>
        </article>
      </div>
    </section>
  );
}
