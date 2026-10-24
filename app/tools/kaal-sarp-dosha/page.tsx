import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import KaalSarpTool from "./KaalSarpTool";
import type { FaqItem } from "@/lib/faq";
import RelatedLinks from "@/components/RelatedLinks";
import ToolFaq from "@/components/ToolFaq";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://astroshivanii.com";

export const metadata: Metadata = {
  title: "काल सर्प दोष जांच — Free Kaal Sarp Dosha Check",
  description:
    "जानें आपकी कुंडली में काल सर्प (कालसर्प) दोष है या नहीं, उसकी दिशा और शामिल ग्रह — मुफ्त वैदिक कैलकुलेटर। Free Kaal Sarp Dosha checker.",
  alternates: { canonical: "/tools/kaal-sarp-dosha/" },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Kaal Sarp Dosha Checker",
  description:
    "Check whether Kaal Sarp Dosha is present in your birth chart, its direction, and which planets are involved.",
  url: `${SITE_URL}/tools/kaal-sarp-dosha/`,
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
  provider: { "@type": "Person", name: "Shivanii", url: `${SITE_URL}/about/` },
};

const FAQS: FaqItem[] = [
  {
    q: {
      hi: "काल सर्प दोष कब बनता है और कैसे पता चलता है?",
      en: "When does Kaal Sarp Dosha form, and how do you find out?",
    },
    a: {
      hi: "काल सर्प दोष तब बनता है जब सूर्य, चंद्र, मंगल, बुध, गुरु, शुक्र और शनि — सातों ग्रह — कुंडली में राहु और केतु की धुरी के एक ही ओर स्थित हों। एक भी ग्रह दूसरी ओर हो तो यह दोष बनता ही नहीं। ऊपर का टूल आपके जन्म विवरण से वास्तविक खगोलीय गणना (लाहिरी अयनांश) करके बताता है कि यह स्थिति आपकी कुंडली में है या नहीं, किस दिशा में है और कौन-कौन से ग्रह शामिल हैं।",
      en: "Kaal Sarp Dosha forms when all seven planets — Sun, Moon, Mars, Mercury, Jupiter, Venus and Saturn — sit on one side of the Rahu–Ketu axis in the birth chart. If even one planet is on the other side, the dosha does not form at all. The tool above runs a real astronomical calculation (Lahiri ayanamsa) on your birth details and tells you whether this placement is in your chart, in which direction, and which planets are involved.",
    },
  },
  {
    q: {
      hi: "क्या काल सर्प दोष सच में इतना खतरनाक है?",
      en: "Is Kaal Sarp Dosha really that dangerous?",
    },
    a: {
      hi: "नहीं — इसकी छवि इसके वास्तविक असर से कहीं ज़्यादा डरावनी बना दी गई है। शास्त्रीय रूप से इसका असर इतना है कि कुछ क्षेत्रों में मेहनत का फल देर से मिलता है — काम अटकते हैं, रुकते नहीं। यह मृत्यु या अनहोनी का संकेत बिल्कुल नहीं है, और यह स्थिति बहुत आम है — अनगिनत सफल लोगों की कुंडली में मौजूद है। कई कुंडलियों में कुछ शर्तें पूरी होने पर यह लगभग बेअसर (भंग) भी हो जाता है, जो पूरी कुंडली देखकर ही पता चलता है।",
      en: "No — its image has been made far scarier than its actual effect. Classically, its effect is that effort pays off late in some areas of life — things get delayed, not stopped. It is not a sign of death or disaster, and the placement is very common — it appears in the charts of countless successful people. In many charts it is also largely cancelled (bhanga) when certain conditions are met, which only the full chart can show.",
    },
  },
  {
    q: {
      hi: "उदित और अनुदित गोलार्ध काल सर्प में क्या अंतर है?",
      en: "What is the difference between the Udit and Anudit Golardh types?",
    },
    a: {
      hi: "यह केवल दिशा की पहचान है — उदित गोलार्ध में सातों ग्रह राहु से केतु की ओर बंधे होते हैं, और अनुदित गोलार्ध में केतु से राहु की ओर। दिशा से उपाय नहीं बदलते; यह सिर्फ यह बताती है कि आपकी कुंडली में यह बनावट किस रूप में है। दोष की वास्तविक तीव्रता राहु-केतु के भाव, ग्रहों की स्थिति और दशाओं से तय होती है, दिशा से नहीं।",
      en: "It only identifies the direction — in Udit Golardh the seven planets are hemmed in from Rahu towards Ketu, and in Anudit Golardh from Ketu towards Rahu. The direction doesn't change the remedies; it only describes the form this pattern takes in your chart. The dosha's real intensity is set by the houses of Rahu and Ketu, the planets' placements and the dashas, not by its direction.",
    },
  },
  {
    q: {
      hi: "क्या यह जांच मुफ्त है? उपाय कहां मिलेंगे?",
      en: "Is this check free? Where do I find remedies?",
    },
    a: {
      hi: "हां, यह जांच पूरी तरह निःशुल्क है — जन्म तिथि, समय और स्थान डालते ही परिणाम मिलता है। दोष मिलने पर सामान्य शास्त्रीय उपाय (राहु-केतु शांति पूजा, नाग पंचमी पूजा, महामृत्युंजय जाप आदि) परिणाम के साथ ही दिखाए जाते हैं। ध्यान रहे — ये सामान्य उपाय हैं; दोष की वास्तविक तीव्रता, भंग योग और कुंडली-विशेष उपाय पूर्ण कुंडली विश्लेषण (₹999) में ही तय हो सकते हैं। कोई भी उपाय गारंटीशुदा परिणाम का दावा नहीं करता।",
      en: "Yes, this check is completely free — enter your birth date, time and place and you get the result. If the dosha is found, general classical remedies (Rahu–Ketu shanti puja, Nag Panchami puja, Mahamrityunjaya jaap and so on) are shown with the result. Keep in mind these are general remedies; the dosha's real intensity, any cancelling yogas and remedies specific to your chart can only be settled in a full Kundli analysis (₹999). No remedy can claim a guaranteed result.",
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
        <Breadcrumbs crumbs={[{ name: "Home", nameHi: "होम", href: "/" }, { name: "Free Tools", nameHi: "निःशुल्क टूल्स", href: "/tools" }, { name: "Kaal Sarp Dosha", nameHi: "काल सर्प दोष" }]} />
      </div>
      <KaalSarpTool />
      <div className="container" style={{ maxWidth: "760px", margin: "-2rem auto 0", padding: "0 1rem 2.5rem" }}>
        <article className="guide-article">
          <ToolFaq faqs={FAQS} />
          <p style={{ fontSize: "0.85rem", color: "var(--muted)", textAlign: "center", marginTop: "1.5rem" }}>
            <RelatedLinks links={[{ href: "/tools/kundli", en: "Kundli / Birth Chart Calculator", hi: "कुंडली / जन्म चार्ट" }, { href: "/tools/sade-sati", en: "Sade Sati Checker", hi: "साढ़े साती जांच" }]} />
          </p>
        </article>
      </div>
    </>
  );
}
