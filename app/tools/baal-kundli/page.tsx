import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import BaalKundliTool from "./BaalKundliTool";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://astroshivanii.com";

export const metadata: Metadata = {
  title: "बाल कुंडली — Free Baby Kundli, Naming Syllable",
  description:
    "Create your child's free birth chart — auspicious naming syllable (नामाक्षर), ascendant, planetary positions, and current dasha, calculated from real Vedic astrology. Personal guidance on temperament, health, and education is available separately.",
  alternates: { canonical: "/tools/baal-kundli/" },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Baal Kundli — Baby Birth Chart Calculator",
  description:
    "Create your child's free birth chart — auspicious naming syllable, ascendant, planetary positions, and current dasha.",
  url: `${SITE_URL}/tools/baal-kundli/`,
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
  provider: { "@type": "Person", name: "Shivanii", url: `${SITE_URL}/about/` },
};

const FAQS = [
  {
    q: "बाल कुंडली में क्या-क्या मिलता है? क्या यह सच में निःशुल्क है?",
    a: "हां, यह टूल पूरी तरह निःशुल्क है — बच्चे का लग्न, ग्रह-स्थिति, चंद्र नक्षत्र, नामकरण के लिए शुभ अक्षर (नामाक्षर) और वर्तमान महादशा तुरंत मिलती है। सारी गणना वास्तविक खगोलीय स्थिति और लाहिरी अयनांश (भारत सरकार का मानक) पर आधारित है, कोई अनुमानित तालिका नहीं।",
  },
  {
    q: "नामकरण के लिए शुभ अक्षर (नामाक्षर) कैसे तय होता है?",
    a: "परम्परा के अनुसार बच्चे के जन्म-समय पर चंद्रमा जिस नक्षत्र के जिस चरण (पाद) में था, उसी से नाम का पहला अक्षर तय होता है — हर नक्षत्र के चारों चरणों का अपना अक्षर है। यह टूल जन्म-समय से चंद्रमा की सटीक स्थिति निकालकर वही अक्षर बताता है।",
  },
  {
    q: "क्या जन्म का सटीक समय ज़रूरी है?",
    a: "हां, बाल कुंडली के लिए जन्म का समय आवश्यक है — लग्न कुछ ही मिनटों में बदल सकता है और नक्षत्र-चरण (जिससे नामाक्षर बनता है) भी समय पर निर्भर है। अस्पताल के डिस्चार्ज कार्ड या जन्म प्रमाणपत्र में लिखा समय सबसे भरोसेमंद स्रोत है।",
  },
  {
    q: "बच्चे के स्वभाव, स्वास्थ्य और शिक्षा की व्याख्या कहां मिलेगी?",
    a: "यह टूल कुंडली के तथ्य (लग्न, ग्रह, दशा, नामाक्षर) निःशुल्क दिखाता है। स्वभाव, सीखने की शैली, स्वास्थ्य की प्रवृत्तियों और शिक्षा की दिशा की गहराई से व्याख्या शिवानी जी का व्यक्तिगत कुंडली विश्लेषण (₹999) है — यह ज्योतिषीय मार्गदर्शन है, किसी परिणाम की गारंटी या चिकित्सकीय निदान नहीं।",
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
        <Breadcrumbs crumbs={[{ name: "Home", href: "/" }, { name: "Free Tools", href: "/tools" }, { name: "Baal Kundli" }]} />
      </div>
      <BaalKundliTool />
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
