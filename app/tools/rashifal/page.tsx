import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import RashifalTool from "./RashifalTool";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://astroshivanii.com";

export const metadata: Metadata = {
  title: "Free Daily Rashifal — Vedic Horoscope",
  description:
    "Free daily Vedic horoscope (Rashifal) for all 12 rashis. Transit-based predictions for career, love, health, and finance. No sign-up needed.",
  alternates: { canonical: "/tools/rashifal/" },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Daily Rashifal — Vedic Horoscope",
  description:
    "Daily Vedic horoscope (Rashifal) for all 12 rashis. Transit-based predictions for career, love, health, and finance.",
  url: `${SITE_URL}/tools/rashifal/`,
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
  provider: { "@type": "Person", name: "Shivanii", url: `${SITE_URL}/about/` },
};

const FAQS = [
  {
    q: "राशिफल चंद्र राशि से देखें या सूर्य राशि से?",
    a: "वैदिक ज्योतिष में राशिफल चंद्र राशि से देखा जाता है — जन्म के समय चंद्रमा जिस राशि में था। अखबारों वाला 'सन साइन' पश्चिमी पद्धति है। यह टूल चंद्र राशि पर आधारित है; अगर आपको अपनी चंद्र राशि नहीं पता, तो हमारे मुफ्त कुंडली टूल से जन्म-विवरण डालकर तुरंत जान सकते हैं।",
  },
  {
    q: "यह राशिफल कैसे बनता है — क्या यह रोज़ बदलता है?",
    a: "हां, हर दिन का राशिफल उस दिन के ग्रहों की वास्तविक स्थिति (गोचर) से बनता है — लाहिरी अयनांश पर आधारित वास्तविक खगोलीय गणना से, पहले से लिखे घिसे-पिटे वाक्यों से नहीं। इसीलिए करियर, प्रेम, स्वास्थ्य और धन के स्टार-रेटिंग हर राशि के लिए रोज़ अलग होते हैं।",
  },
  {
    q: "क्या दैनिक और साप्ताहिक राशिफल मुफ्त है?",
    a: "हां, दोनों पूरी तरह मुफ्त हैं — आज का राशिफल और पूरे सप्ताह का राशिफल, सभी 12 राशियों के लिए, बिना साइन-अप या फोन नंबर के। आप परिणाम को PDF के रूप में डाउनलोड भी कर सकते हैं।",
  },
  {
    q: "क्या राशिफल मेरे लिए 100% सटीक होगा?",
    a: "ईमानदार जवाब — नहीं। राशिफल आपकी चंद्र राशि के सभी लोगों के लिए एक-जैसा सामान्य संकेत है; कोई भी दैनिक राशिफल गारंटीड भविष्यवाणी नहीं होता। आपकी अपनी कुंडली — दशा, भाव, ग्रहों की व्यक्तिगत स्थिति — परिणाम बदल सकती है। व्यक्तिगत विश्लेषण के लिए Shivanii से कुंडली रीडिंग (₹999) ले सकते हैं।",
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

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <div className="container" style={{ maxWidth: "860px", paddingTop: "1rem" }}>
        <Breadcrumbs crumbs={[{ name: "Home", href: "/" }, { name: "Free Tools", href: "/tools" }, { name: "Rashifal" }]} />
      </div>
      <RashifalTool />
      <div className="container" style={{ maxWidth: "760px", margin: "-2rem auto 0", padding: "0 1rem 2.5rem" }}>
        <article className="guide-article">
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
          <p style={{ fontSize: "0.85rem", color: "var(--muted)", textAlign: "center", marginTop: "1.5rem" }}>
            Related: <Link href="/tools/panchang">Today's Panchang</Link> ·{" "}
            <Link href="/tools/sade-sati">Sade Sati Checker</Link>
          </p>
        </article>
      </div>
    </>
  );
}
