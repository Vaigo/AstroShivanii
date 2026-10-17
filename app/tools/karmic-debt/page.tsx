import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import KarmicDebtTool from "./KarmicDebtTool";
import type { FaqItem } from "@/lib/faq";
import RelatedLinks from "@/components/RelatedLinks";
import ToolFaq from "@/components/ToolFaq";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://astroshivanii.com";

export const metadata: Metadata = {
  title: "Free Karmic Debt & Missing Numbers Checker",
  description:
    "Check for karmic debt numbers (13, 14, 16, 19) and missing/repeated numbers in your birth date, with remedies. Free numerology calculator.",
  alternates: { canonical: "/tools/karmic-debt/" },
};

const FAQS: FaqItem[] = [
  {
    q: {
      hi: "कार्मिक ऋण अंक (13, 14, 16, 19) क्या होते हैं?",
      en: "What are the karmic debt numbers (13, 14, 16, 19)?",
    },
    a: {
      hi: "अंक ज्योतिष में 13, 14, 16 और 19 को कार्मिक ऋण अंक माना जाता है — यह पिछले जन्मों के अधूरे पाठों का संकेत माने जाते हैं। यह टूल आपके जन्म दिन, संकुचन से पहले के भाग्यांक और (नाम देने पर) नामांक — तीनों स्थानों पर इन अंकों की जांच करता है। हर मिले हुए अंक का अर्थ और उससे जुड़ा पाठ परिणाम में दिखाया जाता है।",
      en: "In numerology, 13, 14, 16 and 19 are treated as karmic debt numbers — taken as signs of lessons left unfinished in past lives. This tool checks for them in three places: your birth day, your Bhagyank before it is reduced, and (if you give your name) your name number. The meaning of every number found, and the lesson tied to it, is shown in the result.",
    },
  },
  {
    q: {
      hi: "क्या यह टूल फ्री है? क्या जानकारी देनी होगी?",
      en: "Is this tool free? What do I need to enter?",
    },
    a: {
      hi: "हां, यह टूल पूरी तरह निःशुल्क है। सिर्फ जन्म तिथि डालनी है — नाम देना वैकल्पिक है, देने पर नामांक-आधारित जांच भी जुड़ जाती है। एक ही बार में कार्मिक ऋण, अनुपस्थित अंक (कार्मिक पाठ) और दोहराए गए अंक (शक्तियां) — तीनों परिणाम मिलते हैं, और रिपोर्ट डाउनलोड भी की जा सकती है।",
      en: "Yes, this tool is completely free. You only need your date of birth — the name is optional, and giving it adds the name-number check. In one go you get all three results: karmic debt, missing numbers (karmic lessons) and repeated numbers (strengths), and you can download the report too.",
    },
  },
  {
    q: {
      hi: "यहां के अनुपस्थित अंक मुख्य अंक ज्योतिष कैलकुलेटर से अलग क्यों दिखते हैं?",
      en: "Why do the missing numbers here differ from the main Numerology Calculator?",
    },
    a: {
      hi: "यह टूल केवल आपकी जन्म तिथि के अंकों पर आधारित शास्त्रीय पद्धति उपयोग करता है, जबकि मुख्य अंक ज्योतिष कैलकुलेटर का लो शु ग्रिड उसमें मूलांक, भाग्यांक, नामांक और कुआ अंक भी जोड़ता है (सम्पूर्ण-ग्रिड पद्धति)। इसलिए दोनों जगह अनुपस्थित अंक अलग दिख सकते हैं — दोनों ही मान्य पद्धतियां हैं, बस अलग-अलग प्रश्नों का उत्तर देती हैं।",
      en: "This tool uses the classical method based only on the digits of your date of birth, while the Lo Shu grid in the main Numerology Calculator also adds your Mulank, Bhagyank, name number and Kua number (the complete-grid method). That's why the missing numbers can differ between the two — both are valid methods; they simply answer different questions.",
    },
  },
  {
    q: {
      hi: "कार्मिक ऋण निकलने पर क्या करना चाहिए? क्या यह डरने की बात है?",
      en: "What should I do if I have a karmic debt? Is it something to fear?",
    },
    a: {
      hi: "नहीं, यह डरने की बात नहीं है — कार्मिक ऋण एक पैटर्न बताता है, कोई निश्चित भविष्यवाणी नहीं। हर अनुपस्थित अंक के साथ उसका शासक ग्रह, रत्न और सरल उपाय परिणाम में दिखाया जाता है। अंक केवल संकेत देते हैं; यह आपकी वास्तविक कुंडली से कैसे जुड़ते हैं, यह जानने के लिए पूर्ण कुंडली विश्लेषण (₹999) उपलब्ध है।",
      en: "No, there is nothing to fear — a karmic debt describes a pattern, not a fixed prediction. Every missing number is shown with its ruling planet, gemstone and a simple remedy. Numbers only point the way; to see how they connect with your actual birth chart, a full Kundli analysis (₹999) is available.",
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

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Karmic Debt & Missing Numbers Checker",
  description:
    "Check for karmic debt numbers (13, 14, 16, 19) and missing/repeated numbers in your birth date, with remedies.",
  url: `${SITE_URL}/tools/karmic-debt/`,
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
  provider: { "@type": "Person", name: "Shivanii", url: `${SITE_URL}/about/` },
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <div className="container" style={{ maxWidth: "860px", paddingTop: "1rem" }}>
        <Breadcrumbs crumbs={[{ name: "Home", nameHi: "होम", href: "/" }, { name: "Free Tools", nameHi: "निःशुल्क टूल्स", href: "/tools" }, { name: "Karmic Debt", nameHi: "कार्मिक ऋण" }]} />
      </div>
      <KarmicDebtTool />
      <div className="container" style={{ maxWidth: "860px", padding: "0 1rem 2.5rem" }}>
        <article className="guide-article">
          <ToolFaq faqs={FAQS} />
          <p style={{ fontSize: "0.85rem", color: "var(--muted)", textAlign: "center", marginTop: "1.5rem" }}>
            <RelatedLinks links={[{ href: "/tools/numerology", en: "Numerology Calculator", hi: "अंक ज्योतिष कैलकुलेटर" }, { href: "/tools/name-correction", en: "Name Correction Checker", hi: "नाम सुधार जांच" }]} />
          </p>
        </article>
      </div>
    </>
  );
}
