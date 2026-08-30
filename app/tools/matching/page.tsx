import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import MatchingTool from "./MatchingTool";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://astroshivanii.com";

export const metadata: Metadata = {
  title: "Free Marriage Matching (Guna Milan) Calculator",
  description:
    "Free Vedic Ashtakoot Guna Milan calculator — 36-point compatibility score, Mangal Dosha check, Nadi analysis. No sign-up needed.",
  alternates: { canonical: "/tools/matching/" },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Marriage Matching (Guna Milan) Calculator",
  description:
    "Vedic Ashtakoot Guna Milan calculator — 36-point compatibility score, Mangal Dosha check, Nadi analysis.",
  url: `${SITE_URL}/tools/matching/`,
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
  provider: { "@type": "Person", name: "Shivanii", url: `${SITE_URL}/about/` },
};

const FAQS = [
  {
    q: "कुंडली मिलान में 36 में से कितने गुण मिलने चाहिए?",
    a: "परंपरा में 18 या उससे अधिक अंक स्वीकार्य, 24+ अच्छा और 28+ उत्तम माना जाता है। लेकिन कुल अंक आधी कहानी है — कौन-सा कूट कमज़ोर है, यह उतना ही मायने रखता है। नाड़ी (8 अंक) और भकूट (7 अंक) सबसे भारी कूट हैं; कम स्कोर का अर्थ अस्वीकृति नहीं, बल्कि गहराई से जांच का संकेत है।",
  },
  {
    q: "क्या यह गुण मिलान कैलकुलेटर मुफ्त है? गणना किस आधार पर होती है?",
    a: "हां, यह टूल पूरी तरह मुफ्त है — कोई साइन-अप नहीं। दोनों की चंद्र-राशि और नक्षत्र वास्तविक खगोलीय गणना (लाहिरी अयनांश) से निकाले जाते हैं, फिर आठों कूट — वर्ण, वश्य, तारा, योनि, ग्रह मैत्री, गण, भकूट, नाड़ी — के अंक और मंगल दोष की जांच दिखाई जाती है। दोष-निवारण (परिहार) और नवांश सहित पूर्ण मिलान Shivanii द्वारा ₹1,299 की सशुल्क सेवा है।",
  },
  {
    q: "नाड़ी दोष या मंगल दोष निकले तो क्या विवाह नहीं हो सकता?",
    a: "ऐसा नहीं है। नाड़ी दोष के निवारण-नियम (परिहार) शास्त्रों में सबसे अधिक हैं — जैसे नक्षत्र-चरण भेद — और मंगल दोष दोनों कुंडलियों में होने पर प्रायः परस्पर निरस्त माना जाता है। इसलिए केवल दोष दिखने पर निर्णय न लें; निर्णय से पहले परिहार की जांच अवश्य कराएं। कोई भी टूल या ज्योतिषी विवाह की सफलता की गारंटी नहीं दे सकता — मिलान एक पारंपरिक मार्गदर्शन है।",
  },
  {
    q: "जन्म का सही समय न पता हो तो मिलान कितना भरोसेमंद है?",
    a: "यह मिलान पूरी तरह चंद्रमा की स्थिति पर आधारित है, और चंद्रमा तेज़ चलता है — लगभग 13° प्रतिदिन — यानी एक ही दिन में राशि या नक्षत्र बदल सकता है। समय न देने पर टूल सूर्योदय का अनुमान लेता है और परिणाम में यह बात ईमानदारी से बता देता है। ऐसे में सही जन्म-समय मिलते ही मिलान दोबारा जांच लेना उचित है।",
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
        <Breadcrumbs crumbs={[{ name: "Home", href: "/" }, { name: "Free Tools", href: "/tools" }, { name: "Guna Milan" }]} />
      </div>
      <MatchingTool />
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
