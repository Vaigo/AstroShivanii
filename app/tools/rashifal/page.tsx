import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import RashifalTool from "./RashifalTool";
import type { FaqItem } from "@/lib/faq";
import RelatedLinks from "@/components/RelatedLinks";
import ToolFaq from "@/components/ToolFaq";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://astroshivanii.com";

export const metadata: Metadata = {
  title: "दैनिक राशिफल — Free Daily Rashifal Calculator",
  description:
    "सभी 12 राशियों का आज का मुफ्त राशिफल — करियर, प्रेम, स्वास्थ्य और धन, गोचर के आधार पर। Free daily Vedic horoscope (Rashifal), no sign-up.",
  alternates: { canonical: "/tools/rashifal/" },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Daily Rashifal — Vedic Horoscope",
  description:
    "Daily Vedic horoscope (Rashifal) for all 12 rashis. Transit-based predictions for career, love, health, and finance.",
  url: `${SITE_URL}/tools/rashifal/`,
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
  provider: { "@type": "Person", name: "Shivanii", url: `${SITE_URL}/about/` },
};

const FAQS: FaqItem[] = [
  {
    q: {
      hi: "राशिफल चंद्र राशि से देखें या सूर्य राशि से?",
      en: "Should a rashifal be read by Moon sign or by Sun sign?",
    },
    a: {
      hi: "वैदिक ज्योतिष में राशिफल चंद्र राशि से देखा जाता है — जन्म के समय चंद्रमा जिस राशि में था। अखबारों वाला 'सन साइन' पश्चिमी पद्धति है। यह टूल चंद्र राशि पर आधारित है; अगर आपको अपनी चंद्र राशि नहीं पता, तो हमारे मुफ्त कुंडली टूल से जन्म-विवरण डालकर तुरंत जान सकते हैं।",
      en: "In Vedic astrology the rashifal is read by Moon sign — the sign the Moon was in at your birth. The 'sun sign' in newspapers is the Western system. This tool is based on the Moon sign; if you don't know yours, enter your birth details in our free Kundli tool and you'll know instantly.",
    },
  },
  {
    q: {
      hi: "यह राशिफल कैसे बनता है — क्या यह रोज़ बदलता है?",
      en: "How is this rashifal made — does it change every day?",
    },
    a: {
      hi: "हां, हर दिन का राशिफल उस दिन के ग्रहों की वास्तविक स्थिति (गोचर) से बनता है — लाहिरी अयनांश पर आधारित वास्तविक खगोलीय गणना से, पहले से लिखे घिसे-पिटे वाक्यों से नहीं। इसीलिए करियर, प्रेम, स्वास्थ्य और धन के स्टार-रेटिंग हर राशि के लिए रोज़ अलग होते हैं।",
      en: "Yes, each day's rashifal comes from the planets' actual positions (transits) that day — from a real astronomical calculation using the Lahiri ayanamsa, not from stock sentences written in advance. That's why the star ratings for career, love, health and money differ for every sign every day.",
    },
  },
  {
    q: {
      hi: "क्या दैनिक और साप्ताहिक राशिफल मुफ्त है?",
      en: "Are the daily and weekly rashifal free?",
    },
    a: {
      hi: "हां, दोनों पूरी तरह मुफ्त हैं — आज का राशिफल और पूरे सप्ताह का राशिफल, सभी 12 राशियों के लिए, बिना साइन-अप या फोन नंबर के। आप परिणाम को PDF के रूप में डाउनलोड भी कर सकते हैं।",
      en: "Yes, both are completely free — today's rashifal and the whole week's, for all 12 signs, without a sign-up or phone number. You can also download the result as a PDF.",
    },
  },
  {
    q: {
      hi: "क्या राशिफल मेरे लिए 100% सटीक होगा?",
      en: "Will the rashifal be 100% accurate for me?",
    },
    a: {
      hi: "ईमानदार जवाब — नहीं। राशिफल आपकी चंद्र राशि के सभी लोगों के लिए एक-जैसा सामान्य संकेत है; कोई भी दैनिक राशिफल गारंटीड भविष्यवाणी नहीं होता। आपकी अपनी कुंडली — दशा, भाव, ग्रहों की व्यक्तिगत स्थिति — परिणाम बदल सकती है। व्यक्तिगत विश्लेषण के लिए Shivanii से कुंडली रीडिंग (₹999) ले सकते हैं।",
      en: "The honest answer — no. A rashifal is the same general signal for everyone with your Moon sign; no daily rashifal is a guaranteed prediction. Your own chart — dashas, houses, the planets' personal placements — can change the outcome. For a personal analysis, you can book a Kundli reading with Shivanii (₹999).",
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
        <Breadcrumbs crumbs={[{ name: "Home", nameHi: "होम", href: "/" }, { name: "Free Tools", nameHi: "निःशुल्क टूल्स", href: "/tools" }, { name: "Rashifal", nameHi: "राशिफल" }]} />
      </div>
      <RashifalTool />
      <div className="container" style={{ maxWidth: "760px", margin: "-2rem auto 0", padding: "0 1rem 2.5rem" }}>
        <article className="guide-article">
          <ToolFaq faqs={FAQS} />
          <p style={{ fontSize: "0.85rem", color: "var(--muted)", textAlign: "center", marginTop: "1.5rem" }}>
            <RelatedLinks links={[{ href: "/tools/panchang", en: "Today's Panchang", hi: "आज का पंचांग" }, { href: "/tools/sade-sati", en: "Sade Sati Checker", hi: "साढ़े साती जांच" }]} />
          </p>
        </article>
      </div>
    </>
  );
}
