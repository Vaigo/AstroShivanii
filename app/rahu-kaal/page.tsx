import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import RahuKaalLive from "@/components/RahuKaalLive";
import { SEO_CITIES } from "@/lib/seo-cities";

export const metadata: Metadata = {
  title: "आज का राहु काल — Rahu Kaal Today, Live City-wise Timings",
  description:
    "Aaj ka Rahu Kaal: today's exact Rahu Kaal, Gulika Kaal and Yamaganda timings computed astronomically from your city's sunrise — Delhi, Mumbai and 30+ Indian cities, updated live.",
  alternates: { canonical: "/rahu-kaal/" },
};

const FAQS = [
  {
    q: "राहु काल क्या है और इसमें क्या नहीं करना चाहिए?",
    a: "राहु काल दिन (सूर्योदय से सूर्यास्त) का आठवां हिस्सा है जो राहु के प्रभाव में माना जाता है। इस अवधि में नया काम शुरू करना, यात्रा आरंभ, खरीदारी, लेन-देन और शुभ कार्य टालने की परम्परा है। जो काम पहले से चल रहे हैं उन्हें रोकने की आवश्यकता नहीं।",
  },
  {
    q: "हर शहर का राहु काल अलग क्यों होता है?",
    a: "राहु काल सूर्योदय और सूर्यास्त पर आधारित है — दिन की लंबाई का 1/8 भाग। हर शहर का सूर्योदय अलग समय पर होता है, इसलिए दिल्ली, मुंबई, कोलकाता का राहु काल कुछ मिनटों से लेकर आधे घंटे तक अलग हो सकता है। इसीलिए यहां हर शहर के लिए अलग खगोलीय गणना की जाती है।",
  },
  {
    q: "क्या राहु काल हर हफ्ते एक ही समय पर आता है?",
    a: "वार के अनुसार राहु काल दिन के अलग-अलग हिस्से में आता है — सोमवार को दूसरा, शनिवार को तीसरा, शुक्रवार को चौथा, बुधवार को पांचवां, गुरुवार को छठा, मंगलवार को सातवां और रविवार को आठवां भाग। लेकिन सटीक घड़ी-समय सूर्योदय के साथ रोज़ बदलता है।",
  },
  {
    q: "गुलिक काल और यमगण्ड क्या हैं?",
    a: "राहु काल की तरह ये भी दिन के 1/8 भाग हैं — गुलिक काल शनि से और यमगण्ड बृहस्पति-सम्बन्धी परम्परा से जुड़ा है। यमगण्ड में विशेषतः यात्रा टालने की सलाह दी जाती है, जबकि गुलिक काल कई कार्यों के लिए ठीक माना जाता है। तीनों समय ऊपर की तालिका में दिए हैं।",
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
        <Breadcrumbs crumbs={[{ name: "Home", href: "/" }, { name: "Free Tools", href: "/tools" }, { name: "Rahu Kaal" }]} />
        <h1 className="section-heading">आज का राहु काल — Rahu Kaal Today</h1>
        <p className="section-heading-hi devanagari">तिथि-वार सटीक समय · आपके शहर के सूर्योदय से खगोलीय गणना</p>

        <div className="tool-explainer" style={{ textAlign: "center", marginBottom: "2rem" }}>
          <p className="devanagari" style={{ fontWeight: 600, color: "var(--maroon)" }}>
            शुभ काम शुरू करने से पहले एक नज़र — आज का राहु काल, गुलिक काल और यमगण्ड, लाइव।
          </p>
          <p>
            Rahu Kaal is one-eighth of the daytime ruled by Rahu — new beginnings, journeys and purchases are
            traditionally avoided in it. The exact window shifts every day with sunrise, and differs city to city.
          </p>
        </div>

        <RahuKaalLive cityEn={delhi.en} cityHi={delhi.hi} lat={delhi.lat} lon={delhi.lon} tz={delhi.tz} />

        <h2 className="guide-h2 devanagari" style={{ marginTop: "2.5rem" }}>अपने शहर का राहु काल देखें</h2>
        <p className="guide-p devanagari">
          ऊपर का समय दिल्ली के सूर्योदय से है। आपका शहर चुनें — हर पेज पर आज + अगले 6 दिनों का सटीक समय:
        </p>
        <div className="guide-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "0.6rem", margin: "1rem 0 2rem" }}>
          {SEO_CITIES.map((c) => (
            <Link key={c.slug} href={`/rahu-kaal/${c.slug}/`} className="guide-card devanagari" style={{ padding: "0.6rem 0.8rem", textAlign: "center" }}>
              {c.hi} <span style={{ color: "var(--muted)", fontSize: "0.78rem" }}>({c.en})</span>
            </Link>
          ))}
        </div>

        <article className="guide-article">
          <h2 className="guide-h2 devanagari">वार के अनुसार राहु काल किस भाग में आता है</h2>
          <p className="guide-p devanagari">
            दिन (सूर्योदय से सूर्यास्त) को 8 बराबर भागों में बांटा जाता है। राहु काल का भाग वार से तय है — समय
            सूर्योदय से। जब सूर्योदय लगभग 6:00 बजे और सूर्यास्त 18:00 बजे हो, तो अनुमानित समय यह बनता है:
          </p>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--gold)" }}>
                  <th className="devanagari" style={{ textAlign: "left", padding: "0.45rem" }}>वार</th>
                  <th className="devanagari" style={{ textAlign: "left", padding: "0.45rem" }}>दिन का भाग</th>
                  <th className="devanagari" style={{ textAlign: "left", padding: "0.45rem" }}>अनुमानित समय</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["सोमवार", "दूसरा", "07:30 – 09:00"],
                  ["मंगलवार", "सातवां", "15:00 – 16:30"],
                  ["बुधवार", "पांचवां", "12:00 – 13:30"],
                  ["गुरुवार", "छठा", "13:30 – 15:00"],
                  ["शुक्रवार", "चौथा", "10:30 – 12:00"],
                  ["शनिवार", "तीसरा", "09:00 – 10:30"],
                  ["रविवार", "आठवां", "16:30 – 18:00"],
                ].map(([vaar, bhag, time]) => (
                  <tr key={vaar} style={{ borderBottom: "1px solid rgba(201,154,58,0.25)" }}>
                    <td className="devanagari" style={{ padding: "0.45rem" }}>{vaar}</td>
                    <td className="devanagari" style={{ padding: "0.45rem" }}>{bhag}</td>
                    <td style={{ padding: "0.45rem" }}>{time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="guide-p devanagari">
            ध्यान रहे — यह तालिका केवल समझने के लिए है। असली समय आपके शहर के उस दिन के सूर्योदय-सूर्यास्त से
            निकलता है, जो ऊपर के लाइव टूल में सटीक रूप से दिया गया है।
          </p>

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
            पूरा पंचांग देखें: <Link href="/tools/panchang/">आज का पंचांग</Link> · शुभ दिन खोजें:{" "}
            <Link href="/tools/shubh-muhurta/">शुभ मुहूर्त टूल</Link>
          </p>
        </article>
      </div>
    </section>
  );
}
