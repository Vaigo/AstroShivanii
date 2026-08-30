import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import TarotTool from "./TarotTool";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://astroshivanii.com";

export const metadata: Metadata = {
  title: "Free Tarot Card Reading — 3-Card Spread",
  description:
    "Free 3-card tarot reading — past, present, future — using the classic Rider-Waite-Smith deck. No sign-up needed.",
  alternates: { canonical: "/tools/tarot/" },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Tarot Card Reading",
  description:
    "Free 3-card tarot reading — past, present, future — using the classic Rider-Waite-Smith deck.",
  url: `${SITE_URL}/tools/tarot/`,
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
  provider: { "@type": "Person", name: "Shivanii", url: `${SITE_URL}/about/` },
};

const FAQS = [
  {
    q: "क्या यह टैरो रीडिंग सच में मुफ्त है?",
    a: "हाँ, यह 3-कार्ड स्प्रेड (अतीत–वर्तमान–भविष्य) पूरी तरह मुफ्त है — न कोई साइन-अप, न कोई छिपा शुल्क। आप जितनी बार चाहें कार्ड निकाल सकते हैं, और रीडिंग को PDF की तरह डाउनलोड भी कर सकते हैं। किसी एक सवाल का गहरा, व्यक्तिगत उत्तर चाहिए तो शिवानी जी से सीधे पूछने की सशुल्क सेवा (₹499) अलग से उपलब्ध है।",
  },
  {
    q: "उल्टा (reversed) कार्ड निकले तो क्या यह बुरा संकेत है?",
    a: "नहीं, डरने की बात नहीं। उल्टे कार्ड का अर्थ है कि उसी कार्ड की ऊर्जा अवरुद्ध, विलंबित या भीतर की ओर मुड़ी हुई है — यह 'बुरा फल' नहीं, बल्कि ध्यान देने का संकेत है। रीडिंग में उल्टा कार्ड आने पर उसका अर्थ वहीं समझाया भी जाता है।",
  },
  {
    q: "इस रीडिंग में कौन सा टैरो डेक इस्तेमाल होता है?",
    a: "क्लासिक राइडर-वेट-स्मिथ डेक (1909) — टैरो की दुनिया का सबसे प्रचलित डेक, जिसमें 78 कार्ड होते हैं: 22 मेजर अर्काना (जीवन के बड़े मोड़) और 56 माइनर अर्काना (वैंड्स, कप्स, स्वॉर्ड्स, पेंटाकल्स)। फिलहाल यही एकमात्र डेक यहाँ उपलब्ध है।",
  },
  {
    q: "क्या टैरो कार्ड भविष्य पक्का बता देते हैं?",
    a: "नहीं — और जो ऐसा दावा करे, उससे सावधान रहें। टैरो इस क्षण की ऊर्जा और संभावित दिशा की ओर इशारा करता है; कार्ड भाग्य तय नहीं करते, निर्णय आपके ही हाथ में रहते हैं। किसी सवाल का समयबद्ध, ज्योतिषीय उत्तर चाहिए तो जन्म कुंडली या प्रश्न ज्योतिष अधिक उपयुक्त है — जो वास्तविक खगोलीय गणना पर आधारित होता है।",
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
        <Breadcrumbs crumbs={[{ name: "Home", href: "/" }, { name: "Free Tools", href: "/tools" }, { name: "Tarot Reading" }]} />
      </div>
      <TarotTool />
      <div className="container" style={{ maxWidth: "760px", margin: "-2rem auto 0", padding: "0 1rem 2.5rem", textAlign: "center" }}>
        <p style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
          Related: <Link href="/tools/turant-uttar">Turant Uttar — Instant Answer</Link> ·{" "}
          <Link href="/readings/ask-one-question">Ask Shivanii Directly</Link>
        </p>
      </div>
      <div className="container" style={{ maxWidth: "860px", paddingBottom: "2.5rem" }}>
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
        </article>
      </div>
    </>
  );
}
