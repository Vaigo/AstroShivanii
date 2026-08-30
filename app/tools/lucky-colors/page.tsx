import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import LuckyColorsTool from "./LuckyColorsTool";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://astroshivanii.com";

export const metadata: Metadata = {
  title: "Free Lucky Color Calculator — Vedic Astrology",
  description:
    "Find your auspicious and inauspicious colors based on your Lagna and Nakshatra lord. Free Vedic astrology calculator — enter your birth details.",
  alternates: { canonical: "/tools/lucky-colors/" },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Lucky Color Calculator",
  description:
    "Find your auspicious and inauspicious colors based on your Lagna and Nakshatra lord.",
  url: `${SITE_URL}/tools/lucky-colors/`,
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
  provider: { "@type": "Person", name: "Shivanii", url: `${SITE_URL}/about/` },
};

const FAQS = [
  {
    q: "मेरे शुभ रंग कैसे तय किए जाते हैं?",
    a: "आपके जन्म विवरण से वास्तविक खगोलीय गणना (लाहिरी अयनांश) द्वारा दो चीज़ें निकाली जाती हैं — आपकी लग्न (जन्म के समय पूर्व में उगती राशि) और आपका जन्म नक्षत्र। लग्न स्वामी ग्रह के शास्त्रीय रंग आपके व्यक्तित्व के रंग बनते हैं, और नक्षत्र स्वामी के रंग मन के रंग — साथ में यह भी बताया जाता है कि किस ग्रह से कौन-सा रंग क्यों आया।",
  },
  {
    q: "क्या यह शुभ रंग कैलकुलेटर मुफ्त है?",
    a: "हां, यह टूल पूरी तरह मुफ्त है — न कोई शुल्क, न कोई लॉगिन। परिणाम का PDF भी मुफ्त डाउनलोड कर सकते हैं। यदि आप अपने दुर्बल ग्रहों के लिए विशेष रंग या रत्न-सुझाव चाहते हैं, तो वह Shivanii जी की पूर्ण कुंडली रीडिंग (₹999) का हिस्सा है — पर बुनियादी शुभ रंग यहां मुफ्त मिलते हैं।",
  },
  {
    q: "जन्म समय पता न हो तो क्या परिणाम सही आएगा?",
    a: "बिना जन्म समय के हम सूर्योदय-कुंडली से गणना करते हैं और परिणाम पर साफ-साफ 'अनुमानित' का चिह्न लगाते हैं — क्योंकि लग्न लगभग हर 2 घंटे में बदलती है, सटीक समय देने पर रंग बदल भी सकते हैं। हम अनुमान को विश्वसनीय बताकर पेश नहीं करते; सबसे सही परिणाम के लिए जन्म समय ज़रूर डालें।",
  },
  {
    q: "क्या शुभ रंग पहनने से किस्मत बदल जाएगी?",
    a: "नहीं — रंग कोई जादुई गारंटी नहीं हैं, और हम ऐसा कोई वादा नहीं करते। ज्योतिष परम्परा में अपने ग्रह-अनुकूल रंग पहनना आत्मविश्वास और मानसिक अनुकूलता बढ़ाने वाला सहायक उपाय माना जाता है — जैसे इंटरव्यू या शुभ अवसर पर लग्न स्वामी का रंग। अशुभ बताए रंगों को अलमारी से निकालने की भी ज़रूरत नहीं — बस बड़े मौकों पर शुभ रंग प्राथमिकता से चुनें।",
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
        <Breadcrumbs crumbs={[{ name: "Home", href: "/" }, { name: "Free Tools", href: "/tools" }, { name: "Lucky Colors" }]} />
      </div>
      <LuckyColorsTool />
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
          <p className="guide-p" style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.85rem", color: "var(--muted)" }}>
            Related: <Link href="/tools/numerology">Numerology Calculator</Link> ·{" "}
            <Link href="/tools/favorable-alphabet">Favorable Alphabet Calculator</Link>
          </p>
        </article>
      </div>
    </>
  );
}
