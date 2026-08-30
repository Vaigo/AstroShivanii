import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import FavorableAlphabetTool from "./FavorableAlphabetTool";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://astroshivanii.com";

export const metadata: Metadata = {
  title: "Free Favorable Alphabet Calculator — Numerology",
  description:
    "Discover your name's Cornerstone (first letter) and Capstone (last letter) numerology meaning, career resonance, and recommended careers. Free calculator.",
  alternates: { canonical: "/tools/favorable-alphabet/" },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Favorable Alphabet Calculator",
  description:
    "Discover your name's Cornerstone (first letter) and Capstone (last letter) numerology meaning, career resonance, and recommended careers.",
  url: `${SITE_URL}/tools/favorable-alphabet/`,
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
  provider: { "@type": "Person", name: "Shivanii", url: `${SITE_URL}/about/` },
};

const FAQS = [
  {
    q: "कॉर्नरस्टोन (Cornerstone) और कैपस्टोन (Capstone) क्या होते हैं?",
    a: "अंक ज्योतिष में नाम का पहला अक्षर कॉर्नरस्टोन कहलाता है — यह बताता है कि आप कोई भी नया काम, नौकरी या रिश्ता शुरू कैसे करते हैं। अंतिम अक्षर कैपस्टोन है — यह बताता है कि आप काम को पूरा कैसे करते हैं। हर अक्षर का एक अंक और हर अंक का एक स्वामी ग्रह होता है, जिससे स्वभाव, करियर तालमेल और अनुशंसित क्षेत्र निकलते हैं।",
  },
  {
    q: "क्या इस गणना के लिए जन्म तिथि या जन्म समय चाहिए?",
    a: "नहीं। यह गणना केवल आपके नाम के पहले और अंतिम अक्षर पर आधारित है — जन्म तिथि, समय या स्थान की कोई भूमिका नहीं है। इसीलिए यहां सिर्फ नाम पूछा जाता है। यह टूल पूरी तरह मुफ़्त है — कोई साइन-अप या भुगतान नहीं।",
  },
  {
    q: "गणना किस पद्धति से होती है — चाल्डियन या पाइथागोरियन?",
    a: "यह टूल चाल्डियन (Chaldean) पद्धति से अक्षरों का अंक-मान निकालता है, जो अंक ज्योतिष की परंपरागत और सर्वाधिक अनुशंसित प्रणाली मानी जाती है। इसमें हर अक्षर को 1 से 8 तक का मान मिलता है और हर मान का एक स्वामी ग्रह, रत्न और रंग जुड़ा होता है — यही परिणाम में दिखाए जाते हैं।",
  },
  {
    q: "पूरा नाम लिखें या वह नाम जिससे लोग बुलाते हैं?",
    a: "नाम ठीक वैसे लिखें जैसा आप जांचना चाहते हैं — उपनाम या छोटा नाम पूरे कानूनी नाम से अलग पहला/अंतिम अक्षर देगा, इसलिए परिणाम भी अलग होगा। ध्यान रहे, अक्षर अंक ज्योतिष की सिर्फ एक परत हैं — यह करियर की दिशा का संकेत देते हैं, कोई गारंटी नहीं। नाम आपकी कुंडली का साथ देता है या नहीं, यह पूर्ण कुंडली विश्लेषण से ही पता चलता है।",
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
        <Breadcrumbs crumbs={[{ name: "Home", href: "/" }, { name: "Free Tools", href: "/tools" }, { name: "Favorable Alphabet" }]} />
      </div>
      <FavorableAlphabetTool />
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
          <p className="guide-p" style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.85rem", color: "var(--muted)" }}>
            Related: <Link href="/tools/numerology">Numerology Calculator</Link> ·{" "}
            <Link href="/tools/name-correction">Name Correction Checker</Link>
          </p>
        </article>
      </div>
    </>
  );
}
