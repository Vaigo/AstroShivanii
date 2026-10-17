import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import LuckyColorsTool from "./LuckyColorsTool";
import type { FaqItem } from "@/lib/faq";
import RelatedLinks from "@/components/RelatedLinks";
import ToolFaq from "@/components/ToolFaq";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://astroshivanii.com";

export const metadata: Metadata = {
  title: "Free Lucky Color Calculator — Vedic Astrology",
  description:
    "Find your auspicious and inauspicious colors based on your Lagna and Nakshatra lord. Free Vedic astrology calculator — enter your birth details.",
  alternates: { canonical: "/tools/lucky-colors/" },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Lucky Color Calculator",
  description:
    "Find your auspicious and inauspicious colors based on your Lagna and Nakshatra lord.",
  url: `${SITE_URL}/tools/lucky-colors/`,
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
  provider: { "@type": "Person", name: "Shivanii", url: `${SITE_URL}/about/` },
};

const FAQS: FaqItem[] = [
  {
    q: {
      hi: "मेरे शुभ रंग कैसे तय किए जाते हैं?",
      en: "How are my lucky colours worked out?",
    },
    a: {
      hi: "आपके जन्म विवरण से वास्तविक खगोलीय गणना (लाहिरी अयनांश) द्वारा दो चीज़ें निकाली जाती हैं — आपकी लग्न (जन्म के समय पूर्व में उगती राशि) और आपका जन्म नक्षत्र। लग्न स्वामी ग्रह के शास्त्रीय रंग आपके व्यक्तित्व के रंग बनते हैं, और नक्षत्र स्वामी के रंग मन के रंग — साथ में यह भी बताया जाता है कि किस ग्रह से कौन-सा रंग क्यों आया।",
      en: "A real astronomical calculation (Lahiri ayanamsa) on your birth details gives two things — your ascendant (the sign rising in the east at the moment of birth) and your birth nakshatra. The classical colours of the ascendant's lord become the colours of your personality, and those of the nakshatra's lord the colours of your mind — and the result also explains which colour comes from which planet, and why.",
    },
  },
  {
    q: {
      hi: "क्या यह शुभ रंग कैलकुलेटर मुफ्त है?",
      en: "Is this lucky colour calculator free?",
    },
    a: {
      hi: "हां, यह टूल पूरी तरह मुफ्त है — न कोई शुल्क, न कोई लॉगिन। परिणाम का PDF भी मुफ्त डाउनलोड कर सकते हैं। यदि आप अपने दुर्बल ग्रहों के लिए विशेष रंग या रत्न-सुझाव चाहते हैं, तो वह Shivanii जी की पूर्ण कुंडली रीडिंग (₹999) का हिस्सा है — पर बुनियादी शुभ रंग यहां मुफ्त मिलते हैं।",
      en: "Yes, this tool is completely free — no charge, no login. You can download the result as a PDF for free too. If you want specific colours or gemstone suggestions for your weak planets, that is part of Shivanii's full Kundli reading (₹999) — but your basic lucky colours are free here.",
    },
  },
  {
    q: {
      hi: "जन्म समय पता न हो तो क्या परिणाम सही आएगा?",
      en: "Will the result be right if I don't know my birth time?",
    },
    a: {
      hi: "बिना जन्म समय के हम सूर्योदय-कुंडली से गणना करते हैं और परिणाम पर साफ-साफ 'अनुमानित' का चिह्न लगाते हैं — क्योंकि लग्न लगभग हर 2 घंटे में बदलती है, सटीक समय देने पर रंग बदल भी सकते हैं। हम अनुमान को विश्वसनीय बताकर पेश नहीं करते; सबसे सही परिणाम के लिए जन्म समय ज़रूर डालें।",
      en: "Without a birth time we calculate from a sunrise chart and clearly mark the result as 'approximate' — because the ascendant changes roughly every 2 hours, the colours may change once you give the exact time. We never present an estimate as reliable; for the most accurate result, do enter your birth time.",
    },
  },
  {
    q: {
      hi: "क्या शुभ रंग पहनने से किस्मत बदल जाएगी?",
      en: "Will wearing my lucky colours change my luck?",
    },
    a: {
      hi: "नहीं — रंग कोई जादुई गारंटी नहीं हैं, और हम ऐसा कोई वादा नहीं करते। ज्योतिष परम्परा में अपने ग्रह-अनुकूल रंग पहनना आत्मविश्वास और मानसिक अनुकूलता बढ़ाने वाला सहायक उपाय माना जाता है — जैसे इंटरव्यू या शुभ अवसर पर लग्न स्वामी का रंग। अशुभ बताए रंगों को अलमारी से निकालने की भी ज़रूरत नहीं — बस बड़े मौकों पर शुभ रंग प्राथमिकता से चुनें।",
      en: "No — colours are not a magic guarantee, and we make no such promise. In the astrological tradition, wearing the colours that suit your planets is seen as a supporting practice that builds confidence and a favourable state of mind — like wearing your ascendant lord's colour to an interview or on an auspicious occasion. There's no need to clear the unfavourable colours out of your wardrobe either — just prefer your lucky colours on the big occasions.",
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
        <Breadcrumbs crumbs={[{ name: "Home", nameHi: "होम", href: "/" }, { name: "Free Tools", nameHi: "निःशुल्क टूल्स", href: "/tools" }, { name: "Lucky Colors", nameHi: "शुभ रंग" }]} />
      </div>
      <LuckyColorsTool />
      <div className="container" style={{ maxWidth: "860px", padding: "0 1rem 2.5rem" }}>
        <article className="guide-article">
          <ToolFaq faqs={FAQS} />
          <p className="guide-p" style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.85rem", color: "var(--muted)" }}>
            <RelatedLinks links={[{ href: "/tools/numerology", en: "Numerology Calculator", hi: "अंक ज्योतिष कैलकुलेटर" }, { href: "/tools/favorable-alphabet", en: "Favorable Alphabet Calculator", hi: "शुभ अक्षर गणना" }]} />
          </p>
        </article>
      </div>
    </>
  );
}
