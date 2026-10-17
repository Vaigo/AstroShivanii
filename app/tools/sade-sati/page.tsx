import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import SadeSatiTool from "./SadeSatiTool";
import type { FaqItem } from "@/lib/faq";
import ToolFaq from "@/components/ToolFaq";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://astroshivanii.com";

export const metadata: Metadata = {
  title: "Free Sade Sati Checker — Is It Active?",
  description:
    "Check if Saturn's Sade Sati is currently active in your chart. Free Vedic astrology calculator — enter your birth details.",
  alternates: { canonical: "/tools/sade-sati/" },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Sade Sati Checker",
  description: "Check if Saturn's Sade Sati is currently active in your chart.",
  url: `${SITE_URL}/tools/sade-sati/`,
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
  provider: { "@type": "Person", name: "Shivanii", url: `${SITE_URL}/about/` },
};

const FAQS: FaqItem[] = [
  {
    q: {
      hi: "साढ़े साती कब शुरू होती है और कितने साल चलती है?",
      en: "When does Sade Sati begin and how many years does it last?",
    },
    a: {
      hi: "जब गोचर का शनि आपकी चंद्र राशि से 12वें भाव में प्रवेश करता है, तब साढ़े साती शुरू होती है। शनि एक राशि में लगभग 2.5 वर्ष रहता है, इसलिए तीन राशियों (12वीं, चंद्र राशि और 2री) से गुज़रने में कुल लगभग 7.5 वर्ष लगते हैं — इसी से नाम पड़ा 'साढ़े साती'। अधिकांश लोग जीवन में इससे 2–3 बार गुज़रते हैं। यह टूल आपकी जन्म तिथि से चंद्र राशि निकालकर वर्तमान, पिछली और अगली साढ़े साती की सटीक तिथियां बताता है।",
      en: "Sade Sati begins when transiting Saturn enters the 12th house from your Moon sign. Saturn stays in a sign for about 2.5 years, so passing through three signs (the 12th, the Moon sign itself and the 2nd) takes about 7.5 years in all — hence the name 'Sade Sati' (seven and a half). Most people go through it 2–3 times in a lifetime. This tool works out your Moon sign from your birth details and gives the exact dates of your current, previous and next Sade Sati.",
    },
  },
  {
    q: {
      hi: "साढ़े साती के तीन चरण कौन-से हैं और कौन-सा सबसे भारी माना जाता है?",
      en: "What are the three phases of Sade Sati, and which is considered the heaviest?",
    },
    a: {
      hi: "आरम्भिक (Rising) चरण — शनि चंद्र राशि से 12वें भाव में, समायोजन और आंतरिक तैयारी का समय। शिखर (Peak) चरण — शनि आपकी चंद्र राशि पर, परम्परा में सबसे भारी पर सबसे परिवर्तनकारी चरण। अवसान (Setting) चरण — शनि 2रे भाव में, फल मिलने और स्थिरता लौटने का समय। यदि साढ़े साती सक्रिय है तो टूल तीनों चरणों की तिथियां दिखाता है और बताता है कि आप अभी किस चरण में हैं।",
      en: "The Rising phase — Saturn in the 12th from your Moon sign, a time of adjustment and inner preparation. The Peak phase — Saturn on your Moon sign, traditionally the heaviest but also the most transformative phase. The Setting phase — Saturn in the 2nd house, a time when results arrive and stability returns. If Sade Sati is active, the tool shows the dates of all three phases and which one you are in now.",
    },
  },
  {
    q: {
      hi: "क्या साढ़े साती हमेशा बुरी होती है?",
      en: "Is Sade Sati always bad?",
    },
    a: {
      hi: "नहीं — यह डर व्यापार का हिस्सा अधिक है, शास्त्र का कम। साढ़े साती अनुशासन, ज़िम्मेदारी और छँटाई का दौर है: कमज़ोर नींव वाली चीज़ें दबाव में आती हैं, पर ईमानदार मेहनत स्थायी फल देती है। कई लोगों के लिए ये उनके सबसे उत्पादक वर्ष साबित होते हैं। असर कैसा रहेगा, यह आपके जन्म-शनि के बल पर निर्भर करता है — कोई भी कैलकुलेटर या ज्योतिषी परिणाम की गारंटी नहीं दे सकता; टूल केवल अवधि और चरण तथ्यात्मक रूप से बताता है।",
      en: "No — the fear owes more to business than to the scriptures. Sade Sati is a period of discipline, responsibility and pruning: things built on weak foundations come under pressure, but honest hard work brings lasting results. For many people these turn out to be their most productive years. How it plays out depends on the strength of Saturn in your birth chart — no calculator or astrologer can guarantee the outcome; the tool only states the period and phase as facts.",
    },
  },
  {
    q: {
      hi: "यह साढ़े साती चेकर कैसे गणना करता है? क्या यह मुफ़्त है?",
      en: "How does this Sade Sati checker calculate? Is it free?",
    },
    a: {
      hi: "हां, यह टूल पूरी तरह मुफ़्त है। यह आपके जन्म विवरण से चंद्र राशि और शनि की वर्तमान स्थिति वास्तविक खगोलीय गणना से निकालता है — लाहिरी अयनांश (भारत सरकार का मानक) पर आधारित, कोई अनुमानित तालिका नहीं। साढ़े साती के अलावा यह ढैया (कंटक/अष्टम शनि की लगभग 2.5 वर्ष की अवधि) भी जांचता है और शनि की डिग्री व वक्री स्थिति तक दिखाता है।",
      en: "Yes, this tool is completely free. It works out your Moon sign and Saturn's current position from your birth details with a real astronomical calculation — based on the Lahiri ayanamsa (the Indian government standard), not an approximate table. Besides Sade Sati, it also checks Dhaiya (Kantaka/Ashtama Shani, a period of about 2.5 years) and even shows Saturn's degree and whether it is retrograde.",
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
        <Breadcrumbs crumbs={[{ name: "Home", nameHi: "होम", href: "/" }, { name: "Free Tools", nameHi: "निःशुल्क टूल्स", href: "/tools" }, { name: "Sade Sati", nameHi: "साढ़े साती" }]} />
      </div>
      <SadeSatiTool />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container" style={{ maxWidth: "860px" }}>
          <article className="guide-article">
            <ToolFaq faqs={FAQS} />
          </article>
        </div>
      </section>
    </>
  );
}
