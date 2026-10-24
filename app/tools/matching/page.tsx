import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import MatchingTool from "./MatchingTool";
import type { FaqItem } from "@/lib/faq";
import ToolFaq from "@/components/ToolFaq";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://astroshivanii.com";

export const metadata: Metadata = {
  title: "कुंडली मिलान (Kundli Matching) — Free Guna Milan",
  description:
    "मुफ्त कुंडली मिलान (अष्टकूट गुण मिलान): 36 गुणों का स्कोर, मंगल दोष और नाड़ी की जांच — बिना साइन-अप। Free Kundli Matching (Ashtakoot Guna Milan) calculator.",
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

const FAQS: FaqItem[] = [
  {
    q: {
      hi: "कुंडली मिलान में 36 में से कितने गुण मिलने चाहिए?",
      en: "How many of the 36 gunas should match in Kundli matching?",
    },
    a: {
      hi: "परंपरा में 18 या उससे अधिक अंक स्वीकार्य, 24+ अच्छा और 28+ उत्तम माना जाता है। लेकिन कुल अंक आधी कहानी है — कौन-सा कूट कमज़ोर है, यह उतना ही मायने रखता है। नाड़ी (8 अंक) और भकूट (7 अंक) सबसे भारी कूट हैं; कम स्कोर का अर्थ अस्वीकृति नहीं, बल्कि गहराई से जांच का संकेत है।",
      en: "Traditionally 18 or more points are considered acceptable, 24+ good and 28+ excellent. But the total is only half the story — which koota is weak matters just as much. Nadi (8 points) and Bhakoot (7 points) are the heaviest kootas; a low score doesn't mean rejection, it is a signal to look deeper.",
    },
  },
  {
    q: {
      hi: "क्या यह गुण मिलान कैलकुलेटर मुफ्त है? गणना किस आधार पर होती है?",
      en: "Is this Guna Milan calculator free? What is the calculation based on?",
    },
    a: {
      hi: "हां, यह टूल पूरी तरह मुफ्त है — कोई साइन-अप नहीं। दोनों की चंद्र-राशि और नक्षत्र वास्तविक खगोलीय गणना (लाहिरी अयनांश) से निकाले जाते हैं, फिर आठों कूट — वर्ण, वश्य, तारा, योनि, ग्रह मैत्री, गण, भकूट, नाड़ी — के अंक और मंगल दोष की जांच दिखाई जाती है। दोष-निवारण (परिहार) और नवांश सहित पूर्ण मिलान Shivanii द्वारा ₹1,299 की सशुल्क सेवा है।",
      en: "Yes, this tool is completely free — no sign-up. Both people's Moon signs and nakshatras come from a real astronomical calculation (Lahiri ayanamsa); then the points for all eight kootas — Varna, Vashya, Tara, Yoni, Graha Maitri, Gana, Bhakoot and Nadi — and the Mangal Dosha check are shown. A full matching with dosha cancellations (parihar) and the Navamsa is a paid service by Shivanii for ₹1,299.",
    },
  },
  {
    q: {
      hi: "नाड़ी दोष या मंगल दोष निकले तो क्या विवाह नहीं हो सकता?",
      en: "If Nadi Dosha or Mangal Dosha is found, does that rule out the marriage?",
    },
    a: {
      hi: "ऐसा नहीं है। नाड़ी दोष के निवारण-नियम (परिहार) शास्त्रों में सबसे अधिक हैं — जैसे नक्षत्र-चरण भेद — और मंगल दोष दोनों कुंडलियों में होने पर प्रायः परस्पर निरस्त माना जाता है। इसलिए केवल दोष दिखने पर निर्णय न लें; निर्णय से पहले परिहार की जांच अवश्य कराएं। कोई भी टूल या ज्योतिषी विवाह की सफलता की गारंटी नहीं दे सकता — मिलान एक पारंपरिक मार्गदर्शन है।",
      en: "No. The scriptures give more cancellation rules (parihar) for Nadi Dosha than for any other — such as a difference in nakshatra quarter — and when both charts have Mangal Dosha it is usually considered to cancel out. So don't decide on the dosha alone; always have the cancellations checked before deciding. No tool or astrologer can guarantee a marriage's success — matching is traditional guidance.",
    },
  },
  {
    q: {
      hi: "जन्म का सही समय न पता हो तो मिलान कितना भरोसेमंद है?",
      en: "How reliable is the matching if the exact birth time isn't known?",
    },
    a: {
      hi: "यह मिलान पूरी तरह चंद्रमा की स्थिति पर आधारित है, और चंद्रमा तेज़ चलता है — लगभग 13° प्रतिदिन — यानी एक ही दिन में राशि या नक्षत्र बदल सकता है। समय न देने पर टूल सूर्योदय का अनुमान लेता है और परिणाम में यह बात ईमानदारी से बता देता है। ऐसे में सही जन्म-समय मिलते ही मिलान दोबारा जांच लेना उचित है।",
      en: "This matching rests entirely on the Moon's position, and the Moon moves fast — about 13° a day — so the sign or nakshatra can change within a single day. Without a time, the tool assumes sunrise and says so honestly in the result. In that case, it's wise to check the matching again once the correct birth time is known.",
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
        <Breadcrumbs crumbs={[{ name: "Home", nameHi: "होम", href: "/" }, { name: "Free Tools", nameHi: "निःशुल्क टूल्स", href: "/tools" }, { name: "Guna Milan", nameHi: "गुण मिलान" }]} />
      </div>
      <MatchingTool />
      <div className="container" style={{ maxWidth: "860px", paddingBottom: "2.5rem" }}>
        <article className="guide-article">
          <ToolFaq faqs={FAQS} />
        </article>
      </div>
    </>
  );
}
