import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import KundliTool from "./KundliTool";
import type { FaqItem } from "@/lib/faq";
import ToolFaq from "@/components/ToolFaq";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://astroshivanii.com";

export const metadata: Metadata = {
  title: "Free Kundli / Birth Chart Calculator",
  description:
    "Calculate your Vedic birth chart (Kundli) for free. Get planetary positions, yogas, current Vimshottari dasha, and Lagna personality. No sign-up needed.",
  alternates: { canonical: "/tools/kundli/" },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Kundli / Birth Chart Calculator",
  description:
    "Calculate your Vedic birth chart (Kundli) for free. Get planetary positions, yogas, current Vimshottari dasha, and Lagna personality.",
  url: `${SITE_URL}/tools/kundli/`,
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
  provider: { "@type": "Person", name: "Shivanii", url: `${SITE_URL}/about/` },
};

const FAQS: FaqItem[] = [
  {
    q: {
      hi: "क्या यह कुंडली कैलकुलेटर सच में मुफ़्त है?",
      en: "Is this Kundli calculator really free?",
    },
    a: {
      hi: "हां, पूरी तरह निःशुल्क — न कोई साइन-अप, न कोई छिपा शुल्क। ग्रह-स्थिति, लग्न, योग और वर्तमान विंशोत्तरी दशा मुफ़्त में देखें और PDF रिपोर्ट डाउनलोड करें। यदि आप चाहें तो कुंडली का व्यक्तिगत विश्लेषण (₹999) अलग से बुक कर सकते हैं — वह वैकल्पिक है, टूल के लिए ज़रूरी नहीं।",
      en: "Yes, completely free — no sign-up, no hidden charge. See your planetary positions, ascendant, yogas and current Vimshottari dasha for free and download the PDF report. If you wish, you can book a personal analysis of your Kundli (₹999) separately — that is optional, not needed for the tool.",
    },
  },
  {
    q: {
      hi: "कुंडली किस विधि से बनाई जाती है? क्या गणना सटीक है?",
      en: "How is the Kundli made? Is the calculation accurate?",
    },
    a: {
      hi: "कुंडली वास्तविक खगोलीय गणना से बनती है — आपके जन्म के क्षण ग्रहों की सटीक स्थिति, लाहिरी अयनांश (भारत सरकार का मानक) के साथ वैदिक (निरयण) पद्धति से। यही अयनांश अधिकांश पारम्परिक ज्योतिषी और पंचांग उपयोग करते हैं, इसलिए परिणाम उनसे मेल खाते हैं।",
      en: "The Kundli comes from a real astronomical calculation — the exact positions of the planets at the moment of your birth, in the Vedic (sidereal) system with the Lahiri ayanamsa (the Indian government standard). Most traditional astrologers and panchangs use this same ayanamsa, so the results match theirs.",
    },
  },
  {
    q: {
      hi: "कुंडली बनाने के लिए क्या-क्या जानकारी चाहिए? जन्म समय क्यों ज़रूरी है?",
      en: "What details do I need to make a Kundli? Why is the birth time essential?",
    },
    a: {
      hi: "तीन चीज़ें — जन्म तिथि, सटीक जन्म समय और जन्म स्थान। जन्म समय इसलिए अनिवार्य है क्योंकि लग्न लगभग हर 2 घंटे में बदल जाता है — कुछ मिनटों का अंतर भी लग्न और भावों को बदल सकता है। जन्म स्थान से सही अक्षांश-देशांतर और समय-क्षेत्र लिया जाता है।",
      en: "Three things — date of birth, exact time of birth and place of birth. The time is essential because the ascendant changes roughly every 2 hours — even a few minutes' difference can change the ascendant and the houses. The place gives the correct latitude, longitude and time zone.",
    },
  },
  {
    q: {
      hi: "फ्री कुंडली में क्या-क्या मिलता है?",
      en: "What does the free Kundli include?",
    },
    a: {
      hi: "लग्न कुंडली और चंद्र कुंडली (दोनों चार्ट), सभी 9 ग्रहों की राशि-भाव-नक्षत्र स्थिति, आपकी कुंडली के प्रमुख योग, चंद्र नक्षत्र, वर्तमान विंशोत्तरी महादशा-अंतर्दशा और पूरी महादशा समय-रेखा — साथ में PDF डाउनलोड। दशाओं का आपके जीवन में अर्थ, नवांश (D9) विश्लेषण और व्यक्तिगत उपाय व्यक्तिगत रीडिंग का हिस्सा हैं।",
      en: "The Lagna chart and the Moon chart (both charts), the sign, house and nakshatra of all 9 planets, the main yogas in your chart, your Moon nakshatra, the current Vimshottari mahadasha and antardasha and the full mahadasha timeline — with a PDF download. What the dashas mean in your life, the Navamsa (D9) analysis and personal remedies are part of a personal reading.",
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
        <Breadcrumbs crumbs={[{ name: "Home", nameHi: "होम", href: "/" }, { name: "Free Tools", nameHi: "निःशुल्क टूल्स", href: "/tools" }, { name: "Kundli", nameHi: "कुंडली" }]} />
      </div>
      <KundliTool />
      <div className="container" style={{ maxWidth: "860px", paddingBottom: "2.5rem" }}>
        <article className="guide-article">
          <ToolFaq faqs={FAQS} />
        </article>
      </div>
    </>
  );
}
