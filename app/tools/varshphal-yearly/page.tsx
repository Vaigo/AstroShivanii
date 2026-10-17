import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import VarshphalYearlyTool from "./VarshphalYearlyTool";
import type { FaqItem } from "@/lib/faq";
import RelatedLinks from "@/components/RelatedLinks";
import ToolFaq from "@/components/ToolFaq";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://astroshivanii.com";

export const metadata: Metadata = {
  title: "Yearly Horoscope ₹1,499 — Varshphal Forecast",
  description:
    "A full Varshphal (solar return) yearly forecast — career, finance, health, relationships and spiritual themes for your coming year, with your Varshesha and overall year score.",
  alternates: { canonical: "/tools/varshphal-yearly/" },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Varshphal Yearly Horoscope",
  description:
    "A full Varshphal (solar return) yearly forecast — career, finance, health, relationships and spiritual themes for your coming year.",
  url: `${SITE_URL}/tools/varshphal-yearly/`,
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "1499", priceCurrency: "INR" },
  provider: { "@type": "Person", name: "Shivanii", url: `${SITE_URL}/about/` },
};

const FAQS: FaqItem[] = [
  {
    q: {
      hi: "वर्षफल क्या है और यह सामान्य वार्षिक राशिफल से कैसे अलग है?",
      en: "What is Varshphal, and how is it different from an ordinary yearly horoscope?",
    },
    a: {
      hi: "वर्षफल (ताजिक पद्धति की सौर-वापसी कुंडली) आपके जन्मदिन से अगले जन्मदिन तक के वर्ष का विश्लेषण है — यह कैलेंडर वर्ष नहीं होता। सामान्य वार्षिक राशिफल एक ही राशि के करोड़ों लोगों के लिए एक जैसा होता है, जबकि वर्षफल आपकी जन्म तिथि, समय और स्थान से वास्तविक खगोलीय गणना (लाहिरी अयनांश) द्वारा उस क्षण की कुंडली बनाकर निकाला जाता है जब सूर्य ठीक अपनी जन्मकालीन स्थिति पर लौटता है — इसलिए यह पूरी तरह व्यक्तिगत होता है।",
      en: "Varshphal (the Tajik system's solar-return chart) analyses the year from your birthday to your next birthday — not the calendar year. An ordinary yearly horoscope is the same for crores of people with the same sign, while Varshphal is drawn from your date, time and place of birth with a real astronomical calculation (Lahiri ayanamsa), casting the chart for the moment the Sun returns exactly to its position at your birth — so it is entirely personal.",
    },
  },
  {
    q: {
      hi: "वर्षेश (वर्ष स्वामी) और मुंथा क्या होते हैं?",
      en: "What are the Varshesh (lord of the year) and the Muntha?",
    },
    a: {
      hi: "वर्षेश वह ग्रह है जो ताजिक शास्त्र के पांच पद-अधिकारियों (मुंथा पति, वर्ष लग्न पति, जन्म लग्न पति, दिन-रात्रि पति, त्रिराशि पति) में से चुना जाता है और पूरे वर्ष की प्रमुख घटनाओं पर उसकी छाप रहती है। मुंथा जन्म-लग्न से हर वर्ष एक भाव आगे खिसकने वाला संवेदनशील बिंदु है — वह जिस भाव में हो, वर्ष की ऊर्जा स्वाभाविक रूप से उसी जीवन-क्षेत्र (करियर, धन, विवाह आदि) पर केंद्रित रहती है।",
      en: "The Varshesh is the planet chosen from the Tajik system's five office-holders (the Muntha lord, the lord of the year's ascendant, the lord of the birth ascendant, the day/night lord and the Tri-rashi lord), and its stamp lies on the year's main events. The Muntha is a sensitive point that moves one house further from the birth ascendant every year — whichever house it falls in, the year's energy naturally centres on that area of life (career, money, marriage and so on).",
    },
  },
  {
    q: {
      hi: "क्या यह टूल फ्री है? पूर्ण भविष्यफल में क्या-क्या मिलता है?",
      en: "Is this tool free? What does the full forecast include?",
    },
    a: {
      hi: "आपके वर्षेश की झलक (ग्रह, राशि, भाव और उसकी भूमिका) बिल्कुल मुफ्त है — जन्म विवरण डालते ही असली गणना से दिखती है। पूर्ण भविष्यफल ₹1,499 का है, जिसमें समग्र वर्ष स्कोर (100 में से), मुंथा भाव का विश्लेषण, और करियर, धन, स्वास्थ्य, रिश्ते, आध्यात्म व वर्षपति के प्रभाव — छह क्षेत्रों का विस्तृत फल मिलता है। परिणाम आपके ब्राउज़र में सुरक्षित रहता है। ध्यान रहे — ज्योतिष संभावनाएं और झुकाव दिखाता है, किसी घटना की गारंटी नहीं।",
      en: "A preview of your Varshesh (the planet, its sign and house, and its role) is completely free — it appears from a real calculation as soon as you enter your birth details. The full forecast costs ₹1,499 and includes an overall score for the year (out of 100), an analysis of the Muntha house, and detailed results for six areas — career, money, health, relationships, spirituality and the influence of the year's lord. The result stays saved in your browser. Keep in mind — astrology shows possibilities and tendencies, not a guarantee of any event.",
    },
  },
  {
    q: {
      hi: "जन्म का सही समय पता न हो तो वर्षफल बन सकता है?",
      en: "Can a Varshphal be made without the exact birth time?",
    },
    a: {
      hi: "बन सकता है, पर हम इसे छिपाते नहीं — बिना जन्म-समय के गणना सूर्योदय-अनुमानित लग्न से होती है, और वर्षेश व मुंथा भाव दोनों लग्न पर निर्भर करते हैं, इसलिए असली लग्न अलग निकलने पर परिणाम बदल सकता है। टूल ऐसी स्थिति में स्पष्ट चेतावनी दिखाता है। सबसे भरोसेमंद वर्षफल के लिए जन्म प्रमाणपत्र या परिवार से पूछकर सटीक समय डालें।",
      en: "It can, but we don't hide the catch — without a birth time the calculation uses an ascendant estimated from sunrise, and both the Varshesh and the Muntha house depend on the ascendant, so the result may change if your real ascendant turns out different. The tool shows a clear warning in that case. For the most reliable Varshphal, enter the exact time from your birth certificate or by asking your family.",
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
        <Breadcrumbs crumbs={[{ name: "Home", nameHi: "होम", href: "/" }, { name: "Free Tools", nameHi: "निःशुल्क टूल्स", href: "/tools" }, { name: "Varshphal Yearly Horoscope", nameHi: "वार्षिक भविष्यफल" }]} />
      </div>
      <VarshphalYearlyTool />
      <div className="container" style={{ maxWidth: "760px", margin: "-2rem auto 0", padding: "0 1rem 2.5rem", textAlign: "center" }}>
        <p style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
          <RelatedLinks links={[{ href: "/tools/kundli", en: "Kundli / Birth Chart Calculator", hi: "कुंडली / जन्म चार्ट" }, { href: "/readings/annual-forecast", en: "Book Annual Forecast", hi: "वर्षफल पाठन बुक करें" }]} />
        </p>
      </div>
      <div className="container" style={{ maxWidth: "860px", paddingBottom: "2.5rem" }}>
        <article className="guide-article">
          <ToolFaq faqs={FAQS} />
        </article>
      </div>
    </>
  );
}
