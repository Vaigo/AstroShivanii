import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import NumerologySuiteTool from "./NumerologySuiteTool";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://astroshivanii.com";

export const metadata: Metadata = {
  title: "Numerology Suite ₹299 — Love, Career & Marriage",
  description:
    "A 4-in-1 numerology report from your Mulank and Bhagyank — love style, career fit, business partnerships, and marriage compatibility, in one instant report.",
  alternates: { canonical: "/tools/numerology-suite/" },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Numerology Compatibility Suite",
  description:
    "A 4-in-1 numerology report from your Mulank and Bhagyank — love style, career fit, business partnerships, and marriage compatibility.",
  url: `${SITE_URL}/tools/numerology-suite/`,
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "299", priceCurrency: "INR" },
  provider: { "@type": "Person", name: "Shivanii", url: `${SITE_URL}/about/` },
};

const FAQS = [
  {
    q: "मूलांक और भाग्यांक क्या होते हैं और कैसे निकलते हैं?",
    a: "मूलांक आपकी जन्म तिथि के केवल दिन के अंकों का योग है (जैसे 25 तारीख → 2+5 = 7) — यह आपके मूल व्यक्तित्व का अंक है। भाग्यांक पूरी जन्म तिथि (दिन+महीना+वर्ष) के सभी अंकों का योग है — यह जीवन-पथ का अंक है। यह टूल चाल्डियन पद्धति पर आधारित है, और जन्म तिथि डालते ही ये दोनों अंक आपको मुफ़्त झलक में दिख जाते हैं।",
  },
  {
    q: "₹299 की पूरी रिपोर्ट में क्या-क्या मिलता है?",
    a: "एक ही रिपोर्ट में चार खंड मिलते हैं — प्रेम (आपकी प्रेम-शैली और सबसे अनुकूल साथी अंक), करियर (मूलांक व भाग्यांक दोनों में सशक्त करियर विकल्प), व्यापार (सर्वोत्तम व्यापारिक साझेदार अंक) और विवाह (संगतता विश्लेषण व विवाह के लिए शुभ वर्ष)। रिपोर्ट भुगतान के तुरंत बाद बनती है और आपके ब्राउज़र में सुरक्षित रहती है — रीफ़्रेश करने पर भी।",
  },
  {
    q: "क्या नाम देना ज़रूरी है?",
    a: "नहीं, नाम वैकल्पिक है। नाम देने पर विवाह खंड में सोल-अर्ज विश्लेषण (नाम के स्वरों से निकला अंक) भी जुड़ जाता है। नाम न दें तो भी प्रेम, करियर और व्यापार — तीनों खंड पूरे मिलते हैं।",
  },
  {
    q: "क्या अंक ज्योतिष की बातें पक्की भविष्यवाणी होती हैं?",
    a: "नहीं — अंक ज्योतिष आपके स्वभाव और रुझान की दिशा दिखाता है, कोई गारंटीशुदा भविष्यवाणी नहीं। यह रिपोर्ट अंकों पर आधारित मार्गदर्शन है; गहरे व्यक्तिगत विश्लेषण के लिए इसे आपकी वास्तविक जन्म कुंडली के साथ जोड़कर देखना सबसे अच्छा रहता है, जो Shivanii व्यक्तिगत पाठन में करती हैं।",
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
        <Breadcrumbs crumbs={[{ name: "Home", href: "/" }, { name: "Free Tools", href: "/tools" }, { name: "Numerology Suite" }]} />
      </div>
      <NumerologySuiteTool />
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
            Related: <Link href="/tools/numerology">Numerology Calculator</Link> ·{" "}
            <Link href="/tools/personal-year">Personal Year Number Calculator</Link>
          </p>
        </article>
      </div>
    </>
  );
}
