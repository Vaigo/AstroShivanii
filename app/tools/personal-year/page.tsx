import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import PersonalYearTool from "./PersonalYearTool";
import type { FaqItem } from "@/lib/faq";
import RelatedLinks from "@/components/RelatedLinks";
import ToolFaq from "@/components/ToolFaq";

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

const FAQS: FaqItem[] = [
  {
    q: {
      hi: "व्यक्तिगत वर्षांक कैसे निकाला जाता है?",
      en: "How is the Personal Year Number worked out?",
    },
    a: {
      hi: "आपकी जन्म तिथि का दिन और महीना, चालू कैलेंडर वर्ष के साथ जोड़ा जाता है और योग को 1 से 9 के बीच के एक अंक तक घटाया जाता है — यही आपका व्यक्तिगत वर्षांक है। इसके लिए नाम की ज़रूरत नहीं, केवल जन्म तिथि चाहिए। यह अंक हर वर्ष एक आगे बढ़ता है और 9 वर्ष का चक्र पूरा करके फिर 1 से शुरू होता है।",
      en: "The day and month of your birth are added to the current calendar year, and the total is reduced to a single number from 1 to 9 — that is your Personal Year Number. You don't need a name for it, only your date of birth. The number moves up by one every year and, after completing a 9-year cycle, starts again from 1.",
    },
  },
  {
    q: {
      hi: "व्यक्तिगत वर्षांक कब बदलता है — 1 जनवरी को या जन्मदिन पर?",
      en: "When does the Personal Year Number change — on 1 January or on my birthday?",
    },
    a: {
      hi: "अंकशास्त्र में दोनों परम्पराएं मिलती हैं — कुछ विद्वान कैलेंडर वर्ष (1 जनवरी) से गिनते हैं, कुछ जन्मदिन से। यह कैलकुलेटर व्यापक रूप से प्रचलित कैलेंडर-वर्ष पद्धति का उपयोग करता है, इसलिए परिणाम में पिछला, चालू और अगला वर्ष तीनों के अंक साथ दिखाए जाते हैं ताकि बदलाव का दौर भी समझ आए।",
      en: "Numerology has both traditions — some practitioners count from the calendar year (1 January), others from the birthday. This calculator uses the widely followed calendar-year method, which is why the result shows the numbers for the previous, current and next year together, so the period of change makes sense too.",
    },
  },
  {
    q: {
      hi: "क्या यह पर्सनल ईयर कैलकुलेटर फ्री है?",
      en: "Is this Personal Year calculator free?",
    },
    a: {
      hi: "हाँ, यह टूल पूरी तरह निःशुल्क है — वर्षांक, वर्ष का विषय, शासक ग्रह, रत्न, शुभ रंग-दिन, मंत्र और सलाह सब मुफ्त मिलते हैं, और रिपोर्ट डाउनलोड भी फ्री है। यदि आप इस वर्ष को अपनी वास्तविक कुंडली और दशा से जोड़कर विस्तार से समझना चाहें, तो वह अलग सशुल्क सेवा है — वार्षिक भविष्यफल ₹1,499।",
      en: "Yes, this tool is completely free — the year number, the year's theme, ruling planet, gemstone, lucky colour and day, mantra and advice all come free, and downloading the report is free too. If you want to understand this year in detail against your actual birth chart and dasha, that is a separate paid service — the Annual Forecast at ₹1,499.",
    },
  },
  {
    q: {
      hi: "क्या व्यक्तिगत वर्षांक की बातें निश्चित रूप से घटित होती हैं?",
      en: "Will what the Personal Year Number says definitely happen?",
    },
    a: {
      hi: "नहीं — व्यक्तिगत वर्षांक कोई गारंटीशुदा भविष्यवाणी नहीं है। यह अंकशास्त्र के अनुसार वर्ष का सामान्य विषय और झुकाव बताता है, जैसे नई शुरुआत का वर्ष या समापन का वर्ष। सटीक समय-निर्धारण के लिए इसे जन्म कुंडली की दशा-गोचर के साथ मिलाकर देखना चाहिए, क्योंकि एक ही वर्षांक हर व्यक्ति के जीवन में अलग तरह से प्रकट होता है।",
      en: "No — the Personal Year Number is not a guaranteed prediction. In numerology it describes the year's general theme and leaning, such as a year of new beginnings or a year of endings. For precise timing it should be read together with the dashas and transits in your birth chart, because the same year number plays out differently in each person's life.",
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
        <Breadcrumbs crumbs={[{ name: "Home", nameHi: "होम", href: "/" }, { name: "Free Tools", nameHi: "निःशुल्क टूल्स", href: "/tools" }, { name: "Personal Year", nameHi: "व्यक्तिगत वर्षांक" }]} />
      </div>
      <PersonalYearTool />
      <div className="container" style={{ maxWidth: "760px", margin: "-2rem auto 0", padding: "0 1rem 2.5rem" }}>
        <article className="guide-article">
          <ToolFaq faqs={FAQS} />
        </article>
        <p style={{ fontSize: "0.85rem", color: "var(--muted)", textAlign: "center", marginTop: "1.5rem" }}>
          <RelatedLinks links={[{ href: "/tools/numerology", en: "Numerology Calculator", hi: "अंक ज्योतिष कैलकुलेटर" }, { href: "/tools/numerology-suite", en: "Numerology Compatibility Suite", hi: "अंक ज्योतिष संगतता सूट" }]} />
        </p>
      </div>
    </>
  );
}
