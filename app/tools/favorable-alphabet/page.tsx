import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import FavorableAlphabetTool from "./FavorableAlphabetTool";
import type { FaqItem } from "@/lib/faq";
import RelatedLinks from "@/components/RelatedLinks";
import ToolFaq from "@/components/ToolFaq";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://astroshivanii.com";

export const metadata: Metadata = {
  title: "शुभ अक्षर — Free Favorable Alphabet Calculator",
  description:
    "अपने नाम के पहले (Cornerstone) और अंतिम (Capstone) अक्षर का अंक ज्योतिष अर्थ और उपयुक्त करियर — मुफ्त। Free favorable alphabet calculator.",
  alternates: { canonical: "/tools/favorable-alphabet/" },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Favorable Alphabet Calculator",
  description:
    "Discover your name's Cornerstone (first letter) and Capstone (last letter) numerology meaning, career resonance, and recommended careers.",
  url: `${SITE_URL}/tools/favorable-alphabet/`,
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
  provider: { "@type": "Person", name: "Shivanii", url: `${SITE_URL}/about/` },
};

const FAQS: FaqItem[] = [
  {
    q: {
      hi: "कॉर्नरस्टोन (Cornerstone) और कैपस्टोन (Capstone) क्या होते हैं?",
      en: "What are the Cornerstone and the Capstone?",
    },
    a: {
      hi: "अंक ज्योतिष में नाम का पहला अक्षर कॉर्नरस्टोन कहलाता है — यह बताता है कि आप कोई भी नया काम, नौकरी या रिश्ता शुरू कैसे करते हैं। अंतिम अक्षर कैपस्टोन है — यह बताता है कि आप काम को पूरा कैसे करते हैं। हर अक्षर का एक अंक और हर अंक का एक स्वामी ग्रह होता है, जिससे स्वभाव, करियर तालमेल और अनुशंसित क्षेत्र निकलते हैं।",
      en: "In numerology, the first letter of a name is called the Cornerstone — it shows how you begin anything new: a project, a job or a relationship. The last letter is the Capstone — it shows how you see things through to the end. Every letter has a number and every number a ruling planet, which give the temperament, career fit and recommended fields.",
    },
  },
  {
    q: {
      hi: "क्या इस गणना के लिए जन्म तिथि या जन्म समय चाहिए?",
      en: "Do I need my date or time of birth for this?",
    },
    a: {
      hi: "नहीं। यह गणना केवल आपके नाम के पहले और अंतिम अक्षर पर आधारित है — जन्म तिथि, समय या स्थान की कोई भूमिका नहीं है। इसीलिए यहां सिर्फ नाम पूछा जाता है। यह टूल पूरी तरह मुफ़्त है — कोई साइन-अप या भुगतान नहीं।",
      en: "No. This calculation rests only on the first and last letters of your name — date, time and place of birth play no part, which is why only your name is asked for. The tool is completely free — no sign-up, no payment.",
    },
  },
  {
    q: {
      hi: "गणना किस पद्धति से होती है — चाल्डियन या पाइथागोरियन?",
      en: "Which system is used — Chaldean or Pythagorean?",
    },
    a: {
      hi: "यह टूल चाल्डियन (Chaldean) पद्धति से अक्षरों का अंक-मान निकालता है, जो अंक ज्योतिष की परंपरागत और सर्वाधिक अनुशंसित प्रणाली मानी जाती है। इसमें हर अक्षर को 1 से 8 तक का मान मिलता है और हर मान का एक स्वामी ग्रह, रत्न और रंग जुड़ा होता है — यही परिणाम में दिखाए जाते हैं।",
      en: "This tool takes each letter's value from the Chaldean system, regarded as the traditional and most recommended system of numerology. Every letter gets a value from 1 to 8, and every value is tied to a ruling planet, gemstone and colour — those are what the result shows.",
    },
  },
  {
    q: {
      hi: "पूरा नाम लिखें या वह नाम जिससे लोग बुलाते हैं?",
      en: "Should I enter my full name or the name people call me?",
    },
    a: {
      hi: "नाम ठीक वैसे लिखें जैसा आप जांचना चाहते हैं — उपनाम या छोटा नाम पूरे कानूनी नाम से अलग पहला/अंतिम अक्षर देगा, इसलिए परिणाम भी अलग होगा। ध्यान रहे, अक्षर अंक ज्योतिष की सिर्फ एक परत हैं — यह करियर की दिशा का संकेत देते हैं, कोई गारंटी नहीं। नाम आपकी कुंडली का साथ देता है या नहीं, यह पूर्ण कुंडली विश्लेषण से ही पता चलता है।",
      en: "Enter the name exactly as you want to check it — a nickname or short name gives a different first/last letter from your full legal name, so the result differs too. Keep in mind that letters are only one layer of numerology — they point to a career direction, they don't guarantee it. Whether a name supports your chart is something only a full Kundli analysis can tell.",
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
        <Breadcrumbs crumbs={[{ name: "Home", nameHi: "होम", href: "/" }, { name: "Free Tools", nameHi: "निःशुल्क टूल्स", href: "/tools" }, { name: "Favorable Alphabet", nameHi: "शुभ अक्षर गणना" }]} />
      </div>
      <FavorableAlphabetTool />
      <div className="container" style={{ maxWidth: "760px", margin: "-2rem auto 0", padding: "0 1rem 2.5rem" }}>
        <article className="guide-article">
          <ToolFaq faqs={FAQS} />
          <p className="guide-p" style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.85rem", color: "var(--muted)" }}>
            <RelatedLinks links={[{ href: "/tools/numerology", en: "Numerology Calculator", hi: "अंक ज्योतिष कैलकुलेटर" }, { href: "/tools/name-correction", en: "Name Correction Checker", hi: "नाम सुधार जांच" }]} />
          </p>
        </article>
      </div>
    </>
  );
}
