import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import SadeSatiTool from "./SadeSatiTool";

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

const FAQS = [
  {
    q: "साढ़े साती कब शुरू होती है और कितने साल चलती है?",
    a: "जब गोचर का शनि आपकी चंद्र राशि से 12वें भाव में प्रवेश करता है, तब साढ़े साती शुरू होती है। शनि एक राशि में लगभग 2.5 वर्ष रहता है, इसलिए तीन राशियों (12वीं, चंद्र राशि और 2री) से गुज़रने में कुल लगभग 7.5 वर्ष लगते हैं — इसी से नाम पड़ा 'साढ़े साती'। अधिकांश लोग जीवन में इससे 2–3 बार गुज़रते हैं। यह टूल आपकी जन्म तिथि से चंद्र राशि निकालकर वर्तमान, पिछली और अगली साढ़े साती की सटीक तिथियां बताता है।",
  },
  {
    q: "साढ़े साती के तीन चरण कौन-से हैं और कौन-सा सबसे भारी माना जाता है?",
    a: "आरम्भिक (Rising) चरण — शनि चंद्र राशि से 12वें भाव में, समायोजन और आंतरिक तैयारी का समय। शिखर (Peak) चरण — शनि आपकी चंद्र राशि पर, परम्परा में सबसे भारी पर सबसे परिवर्तनकारी चरण। अवसान (Setting) चरण — शनि 2रे भाव में, फल मिलने और स्थिरता लौटने का समय। यदि साढ़े साती सक्रिय है तो टूल तीनों चरणों की तिथियां दिखाता है और बताता है कि आप अभी किस चरण में हैं।",
  },
  {
    q: "क्या साढ़े साती हमेशा बुरी होती है?",
    a: "नहीं — यह डर व्यापार का हिस्सा अधिक है, शास्त्र का कम। साढ़े साती अनुशासन, ज़िम्मेदारी और छँटाई का दौर है: कमज़ोर नींव वाली चीज़ें दबाव में आती हैं, पर ईमानदार मेहनत स्थायी फल देती है। कई लोगों के लिए ये उनके सबसे उत्पादक वर्ष साबित होते हैं। असर कैसा रहेगा, यह आपके जन्म-शनि के बल पर निर्भर करता है — कोई भी कैलकुलेटर या ज्योतिषी परिणाम की गारंटी नहीं दे सकता; टूल केवल अवधि और चरण तथ्यात्मक रूप से बताता है।",
  },
  {
    q: "यह साढ़े साती चेकर कैसे गणना करता है? क्या यह मुफ़्त है?",
    a: "हां, यह टूल पूरी तरह मुफ़्त है। यह आपके जन्म विवरण से चंद्र राशि और शनि की वर्तमान स्थिति वास्तविक खगोलीय गणना से निकालता है — लाहिरी अयनांश (भारत सरकार का मानक) पर आधारित, कोई अनुमानित तालिका नहीं। साढ़े साती के अलावा यह ढैया (कंटक/अष्टम शनि की लगभग 2.5 वर्ष की अवधि) भी जांचता है और शनि की डिग्री व वक्री स्थिति तक दिखाता है।",
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
        <Breadcrumbs crumbs={[{ name: "Home", href: "/" }, { name: "Free Tools", href: "/tools" }, { name: "Sade Sati" }]} />
      </div>
      <SadeSatiTool />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container" style={{ maxWidth: "860px" }}>
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
      </section>
    </>
  );
}
