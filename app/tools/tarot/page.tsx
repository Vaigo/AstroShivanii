import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import TarotTool from "./TarotTool";
import type { FaqItem } from "@/lib/faq";
import RelatedLinks from "@/components/RelatedLinks";
import ToolFaq from "@/components/ToolFaq";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://astroshivanii.com";

export const metadata: Metadata = {
  title: "Free Tarot Card Reading — 3-Card Spread",
  description:
    "Free 3-card tarot reading — past, present, future — using the classic Rider-Waite-Smith deck. No sign-up needed.",
  alternates: { canonical: "/tools/tarot/" },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Tarot Card Reading",
  description:
    "Free 3-card tarot reading — past, present, future — using the classic Rider-Waite-Smith deck.",
  url: `${SITE_URL}/tools/tarot/`,
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
  provider: { "@type": "Person", name: "Shivanii", url: `${SITE_URL}/about/` },
};

const FAQS: FaqItem[] = [
  {
    q: {
      hi: "क्या यह टैरो रीडिंग सच में मुफ्त है?",
      en: "Is this tarot reading really free?",
    },
    a: {
      hi: "हाँ, यह 3-कार्ड स्प्रेड (अतीत–वर्तमान–भविष्य) पूरी तरह मुफ्त है — न कोई साइन-अप, न कोई छिपा शुल्क। आप जितनी बार चाहें कार्ड निकाल सकते हैं, और रीडिंग को PDF की तरह डाउनलोड भी कर सकते हैं। किसी एक सवाल का गहरा, व्यक्तिगत उत्तर चाहिए तो शिवानी जी से सीधे पूछने की सशुल्क सेवा (₹499) अलग से उपलब्ध है।",
      en: "Yes, this 3-card spread (past–present–future) is completely free — no sign-up, no hidden charge. You can draw cards as often as you like and download the reading as a PDF too. If you want a deep, personal answer to one question, the paid service of asking Shivanii directly (₹499) is available separately.",
    },
  },
  {
    q: {
      hi: "उल्टा (reversed) कार्ड निकले तो क्या यह बुरा संकेत है?",
      en: "Is a reversed card a bad sign?",
    },
    a: {
      hi: "नहीं, डरने की बात नहीं। उल्टे कार्ड का अर्थ है कि उसी कार्ड की ऊर्जा अवरुद्ध, विलंबित या भीतर की ओर मुड़ी हुई है — यह 'बुरा फल' नहीं, बल्कि ध्यान देने का संकेत है। रीडिंग में उल्टा कार्ड आने पर उसका अर्थ वहीं समझाया भी जाता है।",
      en: "No, there's nothing to fear. A reversed card means the energy of that same card is blocked, delayed or turned inward — not a 'bad outcome', but a sign to pay attention. When a reversed card comes up, its meaning is explained right there in the reading.",
    },
  },
  {
    q: {
      hi: "इस रीडिंग में कौन सा टैरो डेक इस्तेमाल होता है?",
      en: "Which tarot deck does this reading use?",
    },
    a: {
      hi: "क्लासिक राइडर-वेट-स्मिथ डेक (1909) — टैरो की दुनिया का सबसे प्रचलित डेक, जिसमें 78 कार्ड होते हैं: 22 मेजर अर्काना (जीवन के बड़े मोड़) और 56 माइनर अर्काना (वैंड्स, कप्स, स्वॉर्ड्स, पेंटाकल्स)। फिलहाल यही एकमात्र डेक यहाँ उपलब्ध है।",
      en: "The classic Rider-Waite-Smith deck (1909) — the most widely used deck in the tarot world, with 78 cards: 22 Major Arcana (life's big turning points) and 56 Minor Arcana (Wands, Cups, Swords and Pentacles). For now it is the only deck available here.",
    },
  },
  {
    q: {
      hi: "क्या टैरो कार्ड भविष्य पक्का बता देते हैं?",
      en: "Can tarot cards tell the future for certain?",
    },
    a: {
      hi: "नहीं — और जो ऐसा दावा करे, उससे सावधान रहें। टैरो इस क्षण की ऊर्जा और संभावित दिशा की ओर इशारा करता है; कार्ड भाग्य तय नहीं करते, निर्णय आपके ही हाथ में रहते हैं। किसी सवाल का समयबद्ध, ज्योतिषीय उत्तर चाहिए तो जन्म कुंडली या प्रश्न ज्योतिष अधिक उपयुक्त है — जो वास्तविक खगोलीय गणना पर आधारित होता है।",
      en: "No — and be wary of anyone who claims they can. Tarot points to the energy of this moment and its likely direction; the cards don't decide your fate, the decisions stay in your hands. If you want a time-bound, astrological answer to a question, a birth chart or Prashna (horary) astrology is better suited — it rests on real astronomical calculation.",
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
        <Breadcrumbs crumbs={[{ name: "Home", nameHi: "होम", href: "/" }, { name: "Free Tools", nameHi: "निःशुल्क टूल्स", href: "/tools" }, { name: "Tarot Reading", nameHi: "टैरो पाठन" }]} />
      </div>
      <TarotTool />
      <div className="container" style={{ maxWidth: "760px", margin: "-2rem auto 0", padding: "0 1rem 2.5rem", textAlign: "center" }}>
        <p style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
          <RelatedLinks links={[{ href: "/tools/turant-uttar", en: "Turant Uttar — Instant Answer", hi: "तुरंत उत्तर" }, { href: "/readings/ask-one-question", en: "Ask Shivanii Directly", hi: "शिवानी जी से सीधे पूछें" }]} />
        </p>
      </div>
      <div className="container" style={{ maxWidth: "860px", paddingBottom: "2.5rem" }}>
        <article className="guide-article">
          <ToolFaq faqs={FAQS} />
        </article>
      </div>
    </>
  );
}
