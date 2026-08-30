import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import KundliTool from "./KundliTool";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://astroshivanii.com";

export const metadata: Metadata = {
  title: "Free Kundli / Birth Chart Calculator",
  description:
    "Calculate your Vedic birth chart (Kundli) for free. Get planetary positions, yogas, current Vimshottari dasha, and Lagna personality. No sign-up needed.",
  alternates: { canonical: "/tools/kundli/" },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Kundli / Birth Chart Calculator",
  description:
    "Calculate your Vedic birth chart (Kundli) for free. Get planetary positions, yogas, current Vimshottari dasha, and Lagna personality.",
  url: `${SITE_URL}/tools/kundli/`,
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
  provider: { "@type": "Person", name: "Shivanii", url: `${SITE_URL}/about/` },
};

const FAQS = [
  {
    q: "क्या यह कुंडली कैलकुलेटर सच में मुफ़्त है?",
    a: "हां, पूरी तरह निःशुल्क — न कोई साइन-अप, न कोई छिपा शुल्क। ग्रह-स्थिति, लग्न, योग और वर्तमान विंशोत्तरी दशा मुफ़्त में देखें और PDF रिपोर्ट डाउनलोड करें। यदि आप चाहें तो कुंडली का व्यक्तिगत विश्लेषण (₹999) अलग से बुक कर सकते हैं — वह वैकल्पिक है, टूल के लिए ज़रूरी नहीं।",
  },
  {
    q: "कुंडली किस विधि से बनाई जाती है? क्या गणना सटीक है?",
    a: "कुंडली वास्तविक खगोलीय गणना से बनती है — आपके जन्म के क्षण ग्रहों की सटीक स्थिति, लाहिरी अयनांश (भारत सरकार का मानक) के साथ वैदिक (निरयण) पद्धति से। यही अयनांश अधिकांश पारम्परिक ज्योतिषी और पंचांग उपयोग करते हैं, इसलिए परिणाम उनसे मेल खाते हैं।",
  },
  {
    q: "कुंडली बनाने के लिए क्या-क्या जानकारी चाहिए? जन्म समय क्यों ज़रूरी है?",
    a: "तीन चीज़ें — जन्म तिथि, सटीक जन्म समय और जन्म स्थान। जन्म समय इसलिए अनिवार्य है क्योंकि लग्न लगभग हर 2 घंटे में बदल जाता है — कुछ मिनटों का अंतर भी लग्न और भावों को बदल सकता है। जन्म स्थान से सही अक्षांश-देशांतर और समय-क्षेत्र लिया जाता है।",
  },
  {
    q: "फ्री कुंडली में क्या-क्या मिलता है?",
    a: "लग्न कुंडली और चंद्र कुंडली (दोनों चार्ट), सभी 9 ग्रहों की राशि-भाव-नक्षत्र स्थिति, आपकी कुंडली के प्रमुख योग, चंद्र नक्षत्र, वर्तमान विंशोत्तरी महादशा-अंतर्दशा और पूरी महादशा समय-रेखा — साथ में PDF डाउनलोड। दशाओं का आपके जीवन में अर्थ, नवांश (D9) विश्लेषण और व्यक्तिगत उपाय व्यक्तिगत रीडिंग का हिस्सा हैं।",
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
        <Breadcrumbs crumbs={[{ name: "Home", href: "/" }, { name: "Free Tools", href: "/tools" }, { name: "Kundli" }]} />
      </div>
      <KundliTool />
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
