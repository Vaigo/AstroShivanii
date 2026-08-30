import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import KarmicDebtTool from "./KarmicDebtTool";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://astroshivanii.com";

export const metadata: Metadata = {
  title: "Free Karmic Debt & Missing Numbers Checker",
  description:
    "Check for karmic debt numbers (13, 14, 16, 19) and missing/repeated numbers in your birth date, with remedies. Free numerology calculator.",
  alternates: { canonical: "/tools/karmic-debt/" },
};

const FAQS = [
  {
    q: "कार्मिक ऋण अंक (13, 14, 16, 19) क्या होते हैं?",
    a: "अंक ज्योतिष में 13, 14, 16 और 19 को कार्मिक ऋण अंक माना जाता है — यह पिछले जन्मों के अधूरे पाठों का संकेत माने जाते हैं। यह टूल आपके जन्म दिन, संकुचन से पहले के भाग्यांक और (नाम देने पर) नामांक — तीनों स्थानों पर इन अंकों की जांच करता है। हर मिले हुए अंक का अर्थ और उससे जुड़ा पाठ परिणाम में दिखाया जाता है।",
  },
  {
    q: "क्या यह टूल फ्री है? क्या जानकारी देनी होगी?",
    a: "हां, यह टूल पूरी तरह निःशुल्क है। सिर्फ जन्म तिथि डालनी है — नाम देना वैकल्पिक है, देने पर नामांक-आधारित जांच भी जुड़ जाती है। एक ही बार में कार्मिक ऋण, अनुपस्थित अंक (कार्मिक पाठ) और दोहराए गए अंक (शक्तियां) — तीनों परिणाम मिलते हैं, और रिपोर्ट डाउनलोड भी की जा सकती है।",
  },
  {
    q: "यहां के अनुपस्थित अंक मुख्य अंक ज्योतिष कैलकुलेटर से अलग क्यों दिखते हैं?",
    a: "यह टूल केवल आपकी जन्म तिथि के अंकों पर आधारित शास्त्रीय पद्धति उपयोग करता है, जबकि मुख्य अंक ज्योतिष कैलकुलेटर का लो शु ग्रिड उसमें मूलांक, भाग्यांक, नामांक और कुआ अंक भी जोड़ता है (सम्पूर्ण-ग्रिड पद्धति)। इसलिए दोनों जगह अनुपस्थित अंक अलग दिख सकते हैं — दोनों ही मान्य पद्धतियां हैं, बस अलग-अलग प्रश्नों का उत्तर देती हैं।",
  },
  {
    q: "कार्मिक ऋण निकलने पर क्या करना चाहिए? क्या यह डरने की बात है?",
    a: "नहीं, यह डरने की बात नहीं है — कार्मिक ऋण एक पैटर्न बताता है, कोई निश्चित भविष्यवाणी नहीं। हर अनुपस्थित अंक के साथ उसका शासक ग्रह, रत्न और सरल उपाय परिणाम में दिखाया जाता है। अंक केवल संकेत देते हैं; यह आपकी वास्तविक कुंडली से कैसे जुड़ते हैं, यह जानने के लिए पूर्ण कुंडली विश्लेषण (₹999) उपलब्ध है।",
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

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Karmic Debt & Missing Numbers Checker",
  description:
    "Check for karmic debt numbers (13, 14, 16, 19) and missing/repeated numbers in your birth date, with remedies.",
  url: `${SITE_URL}/tools/karmic-debt/`,
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
  provider: { "@type": "Person", name: "Shivanii", url: `${SITE_URL}/about/` },
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <div className="container" style={{ maxWidth: "860px", paddingTop: "1rem" }}>
        <Breadcrumbs crumbs={[{ name: "Home", href: "/" }, { name: "Free Tools", href: "/tools" }, { name: "Karmic Debt" }]} />
      </div>
      <KarmicDebtTool />
      <div className="container" style={{ maxWidth: "860px", padding: "0 1rem 2.5rem" }}>
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
            Related: <Link href="/tools/numerology">Numerology Calculator</Link> ·{" "}
            <Link href="/tools/name-correction">Name Correction Checker</Link>
          </p>
        </article>
      </div>
    </>
  );
}
