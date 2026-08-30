import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import VarshphalYearlyTool from "./VarshphalYearlyTool";

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

const FAQS = [
  {
    q: "वर्षफल क्या है और यह सामान्य वार्षिक राशिफल से कैसे अलग है?",
    a: "वर्षफल (ताजिक पद्धति की सौर-वापसी कुंडली) आपके जन्मदिन से अगले जन्मदिन तक के वर्ष का विश्लेषण है — यह कैलेंडर वर्ष नहीं होता। सामान्य वार्षिक राशिफल एक ही राशि के करोड़ों लोगों के लिए एक जैसा होता है, जबकि वर्षफल आपकी जन्म तिथि, समय और स्थान से वास्तविक खगोलीय गणना (लाहिरी अयनांश) द्वारा उस क्षण की कुंडली बनाकर निकाला जाता है जब सूर्य ठीक अपनी जन्मकालीन स्थिति पर लौटता है — इसलिए यह पूरी तरह व्यक्तिगत होता है।",
  },
  {
    q: "वर्षेश (वर्ष स्वामी) और मुंथा क्या होते हैं?",
    a: "वर्षेश वह ग्रह है जो ताजिक शास्त्र के पांच पद-अधिकारियों (मुंथा पति, वर्ष लग्न पति, जन्म लग्न पति, दिन-रात्रि पति, त्रिराशि पति) में से चुना जाता है और पूरे वर्ष की प्रमुख घटनाओं पर उसकी छाप रहती है। मुंथा जन्म-लग्न से हर वर्ष एक भाव आगे खिसकने वाला संवेदनशील बिंदु है — वह जिस भाव में हो, वर्ष की ऊर्जा स्वाभाविक रूप से उसी जीवन-क्षेत्र (करियर, धन, विवाह आदि) पर केंद्रित रहती है।",
  },
  {
    q: "क्या यह टूल फ्री है? पूर्ण भविष्यफल में क्या-क्या मिलता है?",
    a: "आपके वर्षेश की झलक (ग्रह, राशि, भाव और उसकी भूमिका) बिल्कुल मुफ्त है — जन्म विवरण डालते ही असली गणना से दिखती है। पूर्ण भविष्यफल ₹1,499 का है, जिसमें समग्र वर्ष स्कोर (100 में से), मुंथा भाव का विश्लेषण, और करियर, धन, स्वास्थ्य, रिश्ते, आध्यात्म व वर्षपति के प्रभाव — छह क्षेत्रों का विस्तृत फल मिलता है। परिणाम आपके ब्राउज़र में सुरक्षित रहता है। ध्यान रहे — ज्योतिष संभावनाएं और झुकाव दिखाता है, किसी घटना की गारंटी नहीं।",
  },
  {
    q: "जन्म का सही समय पता न हो तो वर्षफल बन सकता है?",
    a: "बन सकता है, पर हम इसे छिपाते नहीं — बिना जन्म-समय के गणना सूर्योदय-अनुमानित लग्न से होती है, और वर्षेश व मुंथा भाव दोनों लग्न पर निर्भर करते हैं, इसलिए असली लग्न अलग निकलने पर परिणाम बदल सकता है। टूल ऐसी स्थिति में स्पष्ट चेतावनी दिखाता है। सबसे भरोसेमंद वर्षफल के लिए जन्म प्रमाणपत्र या परिवार से पूछकर सटीक समय डालें।",
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
        <Breadcrumbs crumbs={[{ name: "Home", href: "/" }, { name: "Free Tools", href: "/tools" }, { name: "Varshphal Yearly Horoscope" }]} />
      </div>
      <VarshphalYearlyTool />
      <div className="container" style={{ maxWidth: "760px", margin: "-2rem auto 0", padding: "0 1rem 2.5rem", textAlign: "center" }}>
        <p style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
          Related: <Link href="/tools/kundli">Kundli / Birth Chart Calculator</Link> ·{" "}
          <Link href="/readings/annual-forecast">Book Annual Forecast</Link>
        </p>
      </div>
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
