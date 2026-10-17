import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import BaalKundliTool from "./BaalKundliTool";
import type { FaqItem } from "@/lib/faq";
import ToolFaq from "@/components/ToolFaq";

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

const FAQS: FaqItem[] = [
  {
    q: {
      hi: "बाल कुंडली में क्या-क्या मिलता है? क्या यह सच में निःशुल्क है?",
      en: "What does the Baal Kundli show? Is it really free?",
    },
    a: {
      hi: "हां, यह टूल पूरी तरह निःशुल्क है — बच्चे का लग्न, ग्रह-स्थिति, चंद्र नक्षत्र, नामकरण के लिए शुभ अक्षर (नामाक्षर) और वर्तमान महादशा तुरंत मिलती है। सारी गणना वास्तविक खगोलीय स्थिति और लाहिरी अयनांश (भारत सरकार का मानक) पर आधारित है, कोई अनुमानित तालिका नहीं।",
      en: "Yes, this tool is completely free — you instantly get the child's ascendant, planetary positions, Moon nakshatra, the auspicious naming syllable (namakshar) and the current mahadasha. Every calculation uses real astronomical positions and the Lahiri ayanamsa (the Indian government standard), not an approximate table.",
    },
  },
  {
    q: {
      hi: "नामकरण के लिए शुभ अक्षर (नामाक्षर) कैसे तय होता है?",
      en: "How is the auspicious naming syllable (namakshar) decided?",
    },
    a: {
      hi: "परम्परा के अनुसार बच्चे के जन्म-समय पर चंद्रमा जिस नक्षत्र के जिस चरण (पाद) में था, उसी से नाम का पहला अक्षर तय होता है — हर नक्षत्र के चारों चरणों का अपना अक्षर है। यह टूल जन्म-समय से चंद्रमा की सटीक स्थिति निकालकर वही अक्षर बताता है।",
      en: "By tradition, the first letter of the name comes from the nakshatra and the quarter (pada) of it that the Moon occupied at the moment of birth — each nakshatra's four quarters have their own syllable. This tool works out the Moon's exact position from the birth time and gives you that syllable.",
    },
  },
  {
    q: {
      hi: "क्या जन्म का सटीक समय ज़रूरी है?",
      en: "Is the exact birth time necessary?",
    },
    a: {
      hi: "हां, बाल कुंडली के लिए जन्म का समय आवश्यक है — लग्न कुछ ही मिनटों में बदल सकता है और नक्षत्र-चरण (जिससे नामाक्षर बनता है) भी समय पर निर्भर है। अस्पताल के डिस्चार्ज कार्ड या जन्म प्रमाणपत्र में लिखा समय सबसे भरोसेमंद स्रोत है।",
      en: "Yes, a Baal Kundli needs the birth time — the ascendant can change within minutes, and the nakshatra quarter (which gives the naming syllable) depends on the time too. The time written on the hospital discharge card or the birth certificate is the most reliable source.",
    },
  },
  {
    q: {
      hi: "बच्चे के स्वभाव, स्वास्थ्य और शिक्षा की व्याख्या कहां मिलेगी?",
      en: "Where can I get an interpretation of the child's temperament, health and education?",
    },
    a: {
      hi: "यह टूल कुंडली के तथ्य (लग्न, ग्रह, दशा, नामाक्षर) निःशुल्क दिखाता है। स्वभाव, सीखने की शैली, स्वास्थ्य की प्रवृत्तियों और शिक्षा की दिशा की गहराई से व्याख्या शिवानी जी का व्यक्तिगत कुंडली विश्लेषण (₹999) है — यह ज्योतिषीय मार्गदर्शन है, किसी परिणाम की गारंटी या चिकित्सकीय निदान नहीं।",
      en: "This tool shows the chart's facts (ascendant, planets, dasha, naming syllable) for free. An in-depth interpretation of temperament, learning style, health tendencies and the direction of education is Shivanii's personal Kundli analysis (₹999) — it is astrological guidance, not a guaranteed outcome or a medical diagnosis.",
    },
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q.hi,
    acceptedAnswer: { "@type": "Answer", text: f.a.hi },
  })),
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <div className="container" style={{ maxWidth: "860px", paddingTop: "1rem" }}>
        <Breadcrumbs crumbs={[{ name: "Home", nameHi: "होम", href: "/" }, { name: "Free Tools", nameHi: "निःशुल्क टूल्स", href: "/tools" }, { name: "Baal Kundli", nameHi: "बाल कुंडली" }]} />
      </div>
      <BaalKundliTool />
      <div className="container" style={{ maxWidth: "860px", paddingBottom: "2.5rem" }}>
        <article className="guide-article">
          <ToolFaq faqs={FAQS} />
        </article>
      </div>
    </>
  );
}
