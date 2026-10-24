import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import NumerologySuiteTool from "./NumerologySuiteTool";
import type { FaqItem } from "@/lib/faq";
import RelatedLinks from "@/components/RelatedLinks";
import ToolFaq from "@/components/ToolFaq";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://astroshivanii.com";

export const metadata: Metadata = {
  title: "अंक ज्योतिष संगतता सूट ₹299 — Love & Career",
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

const FAQS: FaqItem[] = [
  {
    q: {
      hi: "मूलांक और भाग्यांक क्या होते हैं और कैसे निकलते हैं?",
      en: "What are Mulank and Bhagyank, and how are they worked out?",
    },
    a: {
      hi: "मूलांक आपकी जन्म तिथि के केवल दिन के अंकों का योग है (जैसे 25 तारीख → 2+5 = 7) — यह आपके मूल व्यक्तित्व का अंक है। भाग्यांक पूरी जन्म तिथि (दिन+महीना+वर्ष) के सभी अंकों का योग है — यह जीवन-पथ का अंक है। यह टूल चाल्डियन पद्धति पर आधारित है, और जन्म तिथि डालते ही ये दोनों अंक आपको मुफ़्त झलक में दिख जाते हैं।",
      en: "The Mulank is the sum of the digits of just the day of your birth (for example, the 25th → 2+5 = 7) — it is the number of your core personality. The Bhagyank is the sum of all the digits of your full date of birth (day + month + year) — it is your life-path number. This tool follows the Chaldean system, and both numbers appear in the free preview as soon as you enter your date of birth.",
    },
  },
  {
    q: {
      hi: "₹299 की पूरी रिपोर्ट में क्या-क्या मिलता है?",
      en: "What does the full ₹299 report include?",
    },
    a: {
      hi: "एक ही रिपोर्ट में चार खंड मिलते हैं — प्रेम (आपकी प्रेम-शैली और सबसे अनुकूल साथी अंक), करियर (मूलांक व भाग्यांक दोनों में सशक्त करियर विकल्प), व्यापार (सर्वोत्तम व्यापारिक साझेदार अंक) और विवाह (संगतता विश्लेषण व विवाह के लिए शुभ वर्ष)। रिपोर्ट भुगतान के तुरंत बाद बनती है और आपके ब्राउज़र में सुरक्षित रहती है — रीफ़्रेश करने पर भी।",
      en: "One report with four sections — love (your style in love and your most compatible partner numbers), career (strong career options across both your Mulank and Bhagyank), business (your best business-partner numbers) and marriage (a compatibility analysis and auspicious years for marriage). The report is created right after payment and stays saved in your browser — even if you refresh.",
    },
  },
  {
    q: {
      hi: "क्या नाम देना ज़रूरी है?",
      en: "Do I have to give my name?",
    },
    a: {
      hi: "नहीं, नाम वैकल्पिक है। नाम देने पर विवाह खंड में सोल-अर्ज विश्लेषण (नाम के स्वरों से निकला अंक) भी जुड़ जाता है। नाम न दें तो भी प्रेम, करियर और व्यापार — तीनों खंड पूरे मिलते हैं।",
      en: "No, the name is optional. Giving it adds a Soul Urge analysis (a number drawn from the vowels of your name) to the marriage section. Without a name you still get the love, career and business sections in full.",
    },
  },
  {
    q: {
      hi: "क्या अंक ज्योतिष की बातें पक्की भविष्यवाणी होती हैं?",
      en: "Are numerology findings firm predictions?",
    },
    a: {
      hi: "नहीं — अंक ज्योतिष आपके स्वभाव और रुझान की दिशा दिखाता है, कोई गारंटीशुदा भविष्यवाणी नहीं। यह रिपोर्ट अंकों पर आधारित मार्गदर्शन है; गहरे व्यक्तिगत विश्लेषण के लिए इसे आपकी वास्तविक जन्म कुंडली के साथ जोड़कर देखना सबसे अच्छा रहता है, जो Shivanii व्यक्तिगत पाठन में करती हैं।",
      en: "No — numerology shows the direction of your nature and inclinations, not a guaranteed prediction. This report is number-based guidance; for a deeper personal analysis it is best read together with your actual birth chart, which Shivanii does in a personal reading.",
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
        <Breadcrumbs crumbs={[{ name: "Home", nameHi: "होम", href: "/" }, { name: "Free Tools", nameHi: "निःशुल्क टूल्स", href: "/tools" }, { name: "Numerology Suite", nameHi: "अंक ज्योतिष सूट" }]} />
      </div>
      <NumerologySuiteTool />
      <div className="container" style={{ maxWidth: "760px", margin: "-2rem auto 0", padding: "0 1rem 2.5rem" }}>
        <article className="guide-article">
          <ToolFaq faqs={FAQS} />
          <p style={{ fontSize: "0.85rem", color: "var(--muted)", textAlign: "center", marginTop: "1.5rem" }}>
            <RelatedLinks links={[{ href: "/tools/numerology", en: "Numerology Calculator", hi: "अंक ज्योतिष कैलकुलेटर" }, { href: "/tools/personal-year", en: "Personal Year Number Calculator", hi: "व्यक्तिगत वर्षांक" }]} />
          </p>
        </article>
      </div>
    </>
  );
}
