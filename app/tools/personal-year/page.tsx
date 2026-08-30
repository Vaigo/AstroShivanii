import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import PersonalYearTool from "./PersonalYearTool";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://astroshivanii.com";

export const metadata: Metadata = {
  title: "Free Personal Year Number Calculator",
  description:
    "Calculate your Personal Year Number and discover this year's dominant theme, ruling planet, gemstone, and favourable days. Free numerology calculator.",
  alternates: { canonical: "/tools/personal-year/" },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Personal Year Number Calculator",
  description:
    "Calculate your Personal Year Number and discover this year's dominant theme, ruling planet, gemstone, and favourable days.",
  url: `${SITE_URL}/tools/personal-year/`,
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
  provider: { "@type": "Person", name: "Shivanii", url: `${SITE_URL}/about/` },
};

const FAQS = [
  {
    q: "व्यक्तिगत वर्षांक कैसे निकाला जाता है?",
    a: "आपकी जन्म तिथि का दिन और महीना, चालू कैलेंडर वर्ष के साथ जोड़ा जाता है और योग को 1 से 9 के बीच के एक अंक तक घटाया जाता है — यही आपका व्यक्तिगत वर्षांक है। इसके लिए नाम की ज़रूरत नहीं, केवल जन्म तिथि चाहिए। यह अंक हर वर्ष एक आगे बढ़ता है और 9 वर्ष का चक्र पूरा करके फिर 1 से शुरू होता है।",
  },
  {
    q: "व्यक्तिगत वर्षांक कब बदलता है — 1 जनवरी को या जन्मदिन पर?",
    a: "अंकशास्त्र में दोनों परम्पराएं मिलती हैं — कुछ विद्वान कैलेंडर वर्ष (1 जनवरी) से गिनते हैं, कुछ जन्मदिन से। यह कैलकुलेटर व्यापक रूप से प्रचलित कैलेंडर-वर्ष पद्धति का उपयोग करता है, इसलिए परिणाम में पिछला, चालू और अगला वर्ष तीनों के अंक साथ दिखाए जाते हैं ताकि बदलाव का दौर भी समझ आए।",
  },
  {
    q: "क्या यह पर्सनल ईयर कैलकुलेटर फ्री है?",
    a: "हाँ, यह टूल पूरी तरह निःशुल्क है — वर्षांक, वर्ष का विषय, शासक ग्रह, रत्न, शुभ रंग-दिन, मंत्र और सलाह सब मुफ्त मिलते हैं, और रिपोर्ट डाउनलोड भी फ्री है। यदि आप इस वर्ष को अपनी वास्तविक कुंडली और दशा से जोड़कर विस्तार से समझना चाहें, तो वह अलग सशुल्क सेवा है — वार्षिक भविष्यफल ₹1,499।",
  },
  {
    q: "क्या व्यक्तिगत वर्षांक की बातें निश्चित रूप से घटित होती हैं?",
    a: "नहीं — व्यक्तिगत वर्षांक कोई गारंटीशुदा भविष्यवाणी नहीं है। यह अंकशास्त्र के अनुसार वर्ष का सामान्य विषय और झुकाव बताता है, जैसे नई शुरुआत का वर्ष या समापन का वर्ष। सटीक समय-निर्धारण के लिए इसे जन्म कुंडली की दशा-गोचर के साथ मिलाकर देखना चाहिए, क्योंकि एक ही वर्षांक हर व्यक्ति के जीवन में अलग तरह से प्रकट होता है।",
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
        <Breadcrumbs crumbs={[{ name: "Home", href: "/" }, { name: "Free Tools", href: "/tools" }, { name: "Personal Year" }]} />
      </div>
      <PersonalYearTool />
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
        </article>
        <p style={{ fontSize: "0.85rem", color: "var(--muted)", textAlign: "center", marginTop: "1.5rem" }}>
          Related: <Link href="/tools/numerology">Numerology Calculator</Link> ·{" "}
          <Link href="/tools/numerology-suite">Numerology Compatibility Suite</Link>
        </p>
      </div>
    </>
  );
}
