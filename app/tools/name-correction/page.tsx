import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import NameCorrectionTool from "./NameCorrectionTool";
import type { FaqItem } from "@/lib/faq";
import RelatedLinks from "@/components/RelatedLinks";
import ToolFaq from "@/components/ToolFaq";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://astroshivanii.com";

export const metadata: Metadata = {
  title: "नाम सुधार जांच — Name Correction ₹501",
  description:
    "नाम का अंक (Destiny number) आपके मूलांक-भाग्यांक से मेल खाता है या नहीं — 10 तक उच्चारण-योग्य वर्तनी सुझाव, परिवार सिंक वैकल्पिक। ₹501, तुरंत। Name correction checker.",
  alternates: { canonical: "/tools/name-correction/" },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Name Correction Checker",
  description:
    "Check whether a personal, business, or other name's numerology harmonises with its owner's Mulank and Bhagyank — up to 10 natural, pronounceable spelling suggestions, plus an optional family sync analysis using the parents' names.",
  url: `${SITE_URL}/tools/name-correction/`,
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "501", priceCurrency: "INR" },
  provider: { "@type": "Person", name: "Shivanii", url: `${SITE_URL}/about/` },
};

const FAQS: FaqItem[] = [
  {
    q: {
      hi: "नाम सुधार जांच कैसे काम करती है?",
      en: "How does the name correction check work?",
    },
    a: {
      hi: "आपके नाम के हर अक्षर का एक अंक होता है (कैल्डियन अंक ज्योतिष प्रणाली से) — इनका जोड़ नाम का भाग्यांक (Destiny Number) बनाता है। टूल जांचता है कि यह अंक आपके मूलांक (जन्म-दिन से) और भाग्यांक (पूरी जन्मतिथि से) — दोनों से मेल खाता है या शास्त्रीय \"मित्र\" अंक है, और कोई \"शत्रु\" अंक टकराव तो नहीं। मेल न होने पर उच्चारण में लगभग वैसी ही 10 तक वैकल्पिक स्पेलिंग सुझाई जाती हैं।",
      en: "Every letter of your name has a number (in the Chaldean numerology system) — together they make the name's Destiny Number. The tool checks whether this number matches, or is a classical \"friend\" of, both your Mulank (from your birth day) and your Bhagyank (from your full date of birth), and that there is no clash with an \"enemy\" number. If it doesn't match, it suggests up to 10 alternative spellings that sound almost the same.",
    },
  },
  {
    q: {
      hi: "मूलांक और भाग्यांक में क्या अंतर है?",
      en: "What is the difference between Mulank and Bhagyank?",
    },
    a: {
      hi: "मूलांक केवल जन्म के दिन से बनता है — जैसे 23 तारीख को जन्म हो तो 2+3 = 5। भाग्यांक पूरी जन्मतिथि (दिन+महीना+वर्ष) के जोड़ से बनता है। नाम का अंक तभी सहायक माना जाता है जब वह इन दोनों के अनुकूल हो — इसीलिए यह जांच केवल नाम से नहीं, आपकी जन्मतिथि के साथ मिलाकर की जाती है।",
      en: "The Mulank comes only from the day you were born — for example, born on the 23rd: 2+3 = 5. The Bhagyank is the sum of your full date of birth (day + month + year). A name's number is considered supportive only when it suits both — which is why this check is made against your date of birth, not on the name alone.",
    },
  },
  {
    q: {
      hi: "क्या व्यापार या ब्रांड के नाम की भी जांच हो सकती है?",
      en: "Can a business or brand name be checked too?",
    },
    a: {
      hi: "हां — व्यक्तिगत नाम के अलावा व्यापार, ब्रांड या किसी अन्य नाम की जांच भी उपलब्ध है। व्यापार के नाम की जांच मालिक/संस्थापक की वास्तविक जन्मतिथि के मूलांक-भाग्यांक से होती है, पंजीकरण या लॉन्च की तारीख से नहीं। व्यक्तिगत श्रेणी में माता-पिता का नाम देने पर पारिवारिक तालमेल विश्लेषण भी मुफ्त में जुड़ता है।",
      en: "Yes — besides personal names, you can check a business, a brand or any other name. A business name is checked against the Mulank and Bhagyank of the owner's or founder's real date of birth, not the registration or launch date. In the personal category, giving the parents' names also adds a family-harmony analysis for free.",
    },
  },
  {
    q: {
      hi: "क्या नाम की स्पेलिंग बदलने से किस्मत बदलने की गारंटी है?",
      en: "Is changing the spelling of my name guaranteed to change my luck?",
    },
    a: {
      hi: "नहीं — कोई भी ईमानदार ज्योतिषी ऐसी गारंटी नहीं दे सकता। अंक ज्योतिष एक शुरुआती संकेत देता है, गारंटी नहीं। यह जांच ₹501 में तुरंत परिणाम देती है, और कुछ नामों के लिए सभी नियम पूरे करने वाला सुधार गणितीय रूप से संभव ही नहीं होता — तब टूल यह साफ बता देता है, कोई जबरदस्ती सुझाव नहीं थोपता। कोई कानूनी/आधिकारिक बदलाव करने से पहले सुझाए गए नाम को अपनी वास्तविक कुंडली से मिलाकर पुष्टि कराना उचित है।",
      en: "No — no honest astrologer can give that guarantee. Numerology gives an early signal, not a guarantee. This check gives an instant result for ₹501, and for some names a correction that meets every rule is mathematically impossible — then the tool says so plainly instead of forcing a suggestion. Before any legal or official change, it's wise to have the suggested name confirmed against your actual birth chart.",
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
        <Breadcrumbs crumbs={[{ name: "Home", nameHi: "होम", href: "/" }, { name: "Free Tools", nameHi: "निःशुल्क टूल्स", href: "/tools" }, { name: "Name Correction", nameHi: "नाम सुधार" }]} />
      </div>
      <NameCorrectionTool />
      <div className="container" style={{ maxWidth: "760px", margin: "-2rem auto 0", padding: "0 1rem 2.5rem" }}>
        <article className="guide-article">
          <ToolFaq faqs={FAQS} />
        </article>
        <p style={{ fontSize: "0.85rem", color: "var(--muted)", textAlign: "center", marginTop: "1.5rem" }}>
          <RelatedLinks links={[{ href: "/guides/mulank-bhagyank-numerology", en: "Mulank & Bhagyank Explained", hi: "मूलांक और भाग्यांक" }, { href: "/tools/numerology", en: "Numerology Calculator", hi: "अंक ज्योतिष कैलकुलेटर" }]} />
        </p>
      </div>
    </>
  );
}
