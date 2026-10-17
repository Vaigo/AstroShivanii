import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import LalKitabTool from "./LalKitabTool";
import type { FaqItem } from "@/lib/faq";
import RelatedLinks from "@/components/RelatedLinks";
import ToolFaq from "@/components/ToolFaq";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://astroshivanii.com";

export const metadata: Metadata = {
  title: "Free Lal Kitab Calculator — Debts & Remedies",
  description:
    "Calculate your Lal Kitab chart — planetary houses, active debts (karz), pakka ghar, and practical remedies (upayas). Free Vedic astrology calculator.",
  alternates: { canonical: "/tools/lal-kitab/" },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Lal Kitab Calculator",
  description:
    "Calculate your Lal Kitab chart — planetary houses, active debts (karz), pakka ghar, and practical remedies (upayas).",
  url: `${SITE_URL}/tools/lal-kitab/`,
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
  provider: { "@type": "Person", name: "Shivanii", url: `${SITE_URL}/about/` },
};

const FAQS: FaqItem[] = [
  {
    q: {
      hi: "लाल किताब में 'ऋण' (कर्ज) का क्या मतलब है? क्या यह पैसों का कर्ज है?",
      en: "What does 'rin' (debt) mean in Lal Kitab? Is it a money debt?",
    },
    a: {
      hi: "नहीं, यह पैसों का कर्ज नहीं है। लाल किताब मानती है कि कुछ अधूरी जिम्मेदारियां परिवार में पीढ़ी-दर-पीढ़ी चली आती हैं — जैसे पितृ ऋण, मातृ ऋण, स्वयं ऋण आदि 9 प्रकार के ऋण। कुंडली में ग्रहों की विशेष स्थिति से पहचाना जाता है कि कौन-सा ऋण सक्रिय है। हर ऋण का एक सीधा, व्यावहारिक उपाय होता है — यह टूल आपकी कुंडली से सक्रिय ऋण और उनके पारंपरिक उपाय दिखाता है।",
      en: "No, it is not a money debt. Lal Kitab holds that some unfinished responsibilities pass down a family from generation to generation — 9 kinds of rin such as Pitru rin (ancestral debt), Matru rin (mother's debt) and Swayam rin (self debt). Particular planetary placements in the chart show which debt is active. Every debt has a direct, practical remedy — this tool shows the active debts in your chart and their traditional remedies.",
    },
  },
  {
    q: {
      hi: "पक्का घर क्या होता है?",
      en: "What is a 'pakka ghar' (permanent house)?",
    },
    a: {
      hi: "लाल किताब में हर ग्रह के 1-2 'पक्के घर' (स्थायी भाव) माने जाते हैं — जैसे सूर्य का पक्का घर पहला भाव। जब ग्रह अपने पक्के घर में बैठा हो, तो वह घर जैसा सहज महसूस करता है और अपना पूरा, स्थिर फल देता है। यह टूल आपकी कुंडली के नौ ग्रहों की स्थिति और यह दोनों तालिकाओं में दिखाता है कि कौन-सा ग्रह अपने पक्के घर में है।",
      en: "In Lal Kitab every planet has 1–2 'pakka ghar' (permanent houses) — for example, the Sun's pakka ghar is the 1st house. When a planet sits in its pakka ghar it is as comfortable as at home and gives its full, steady results. This tool shows the positions of the nine planets in your chart, and both tables mark which planets are in their pakka ghar.",
    },
  },
  {
    q: {
      hi: "क्या यह लाल किताब कैलकुलेटर मुफ्त है? गणना किस आधार पर होती है?",
      en: "Is this Lal Kitab calculator free? What is the calculation based on?",
    },
    a: {
      hi: "हां, यह टूल पूरी तरह मुफ्त है — ग्रह स्थिति, सक्रिय ऋण, पक्का घर, भाव-अनुसार फल और उपाय, सब बिना किसी शुल्क के। गणना वास्तविक खगोलीय स्थिति से होती है, लाहिरी अयनांश (भारत सरकार का मानक) के आधार पर — कोई अनुमानित या रटी-रटाई तालिका नहीं। यदि आप प्राथमिकता क्रम में व्यक्तिगत उपाय योजना चाहें, तो शिवानी जी का लाल किताब उपाय पाठन ₹899 में अलग से उपलब्ध है।",
      en: "Yes, this tool is completely free — planetary positions, active debts, pakka ghar, house-wise results and remedies, all without any charge. The calculation uses real astronomical positions with the Lahiri ayanamsa (the Indian government standard) — not an approximate or rote table. If you want a personal remedy plan in order of priority, Shivanii's Lal Kitab remedies reading is available separately for ₹899.",
    },
  },
  {
    q: {
      hi: "क्या लाल किताब के उपाय करने से समस्या निश्चित रूप से हल हो जाएगी?",
      en: "Will doing Lal Kitab remedies definitely solve my problem?",
    },
    a: {
      hi: "ईमानदार उत्तर — कोई भी ज्योतिषीय उपाय गारंटी नहीं है, और ऐसा दावा करने वालों से सावधान रहें। लाल किताब की परम्परा में उपाय सरल, कम खर्च वाले और स्वयं करने योग्य होते हैं — जैसे दान, सेवा या दिनचर्या में छोटा बदलाव — और इन्हें मन के संतुलन व कर्म-सुधार का माध्यम माना जाता है। उपाय को अपने प्रयासों का पूरक समझें, विकल्प नहीं; स्वास्थ्य या कानूनी मामलों में योग्य विशेषज्ञ की सलाह ही प्राथमिक है।",
      en: "The honest answer — no astrological remedy is a guarantee, and beware of anyone who claims otherwise. In the Lal Kitab tradition, remedies are simple, low-cost and things you can do yourself — giving in charity, service, or a small change in routine — and are seen as a way to balance the mind and improve one's karma. Treat a remedy as a complement to your own efforts, not a substitute; in health or legal matters, a qualified professional's advice comes first.",
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
        <Breadcrumbs crumbs={[{ name: "Home", nameHi: "होम", href: "/" }, { name: "Free Tools", nameHi: "निःशुल्क टूल्स", href: "/tools" }, { name: "Lal Kitab", nameHi: "लाल किताब" }]} />
      </div>
      <LalKitabTool />
      <div className="container" style={{ maxWidth: "760px", margin: "-2rem auto 0", padding: "0 1rem 2.5rem" }}>
        <article className="guide-article">
          <ToolFaq faqs={FAQS} />
        </article>
        <p style={{ fontSize: "0.85rem", color: "var(--muted)", textAlign: "center", marginTop: "1.5rem" }}>
          <RelatedLinks links={[{ href: "/readings/lal-kitab-remedies", en: "Book Lal Kitab Remedies", hi: "लाल किताब उपाय पाठन बुक करें" }, { href: "/tools/kundli", en: "Kundli / Birth Chart Calculator", hi: "कुंडली / जन्म चार्ट" }]} />
        </p>
      </div>
    </>
  );
}
