import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import NameCorrectionTool from "./NameCorrectionTool";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://astroshivanii.com";

export const metadata: Metadata = {
  title: "Name Correction Checker ₹501 — All Name Types",
  description:
    "Check whether a personal, business, or other name's numerology (Destiny number) harmonises with its owner's Mulank and Bhagyank — up to 10 natural, pronounceable spelling suggestions, plus an optional family sync analysis using your parents' names. ₹501, instant result.",
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

const FAQS = [
  {
    q: "नाम सुधार जांच कैसे काम करती है?",
    a: "आपके नाम के हर अक्षर का एक अंक होता है (कैल्डियन अंक ज्योतिष प्रणाली से) — इनका जोड़ नाम का भाग्यांक (Destiny Number) बनाता है। टूल जांचता है कि यह अंक आपके मूलांक (जन्म-दिन से) और भाग्यांक (पूरी जन्मतिथि से) — दोनों से मेल खाता है या शास्त्रीय \"मित्र\" अंक है, और कोई \"शत्रु\" अंक टकराव तो नहीं। मेल न होने पर उच्चारण में लगभग वैसी ही 10 तक वैकल्पिक स्पेलिंग सुझाई जाती हैं।",
  },
  {
    q: "मूलांक और भाग्यांक में क्या अंतर है?",
    a: "मूलांक केवल जन्म के दिन से बनता है — जैसे 23 तारीख को जन्म हो तो 2+3 = 5। भाग्यांक पूरी जन्मतिथि (दिन+महीना+वर्ष) के जोड़ से बनता है। नाम का अंक तभी सहायक माना जाता है जब वह इन दोनों के अनुकूल हो — इसीलिए यह जांच केवल नाम से नहीं, आपकी जन्मतिथि के साथ मिलाकर की जाती है।",
  },
  {
    q: "क्या व्यापार या ब्रांड के नाम की भी जांच हो सकती है?",
    a: "हां — व्यक्तिगत नाम के अलावा व्यापार, ब्रांड या किसी अन्य नाम की जांच भी उपलब्ध है। व्यापार के नाम की जांच मालिक/संस्थापक की वास्तविक जन्मतिथि के मूलांक-भाग्यांक से होती है, पंजीकरण या लॉन्च की तारीख से नहीं। व्यक्तिगत श्रेणी में माता-पिता का नाम देने पर पारिवारिक तालमेल विश्लेषण भी मुफ्त में जुड़ता है।",
  },
  {
    q: "क्या नाम की स्पेलिंग बदलने से किस्मत बदलने की गारंटी है?",
    a: "नहीं — कोई भी ईमानदार ज्योतिषी ऐसी गारंटी नहीं दे सकता। अंक ज्योतिष एक शुरुआती संकेत देता है, गारंटी नहीं। यह जांच ₹501 में तुरंत परिणाम देती है, और कुछ नामों के लिए सभी नियम पूरे करने वाला सुधार गणितीय रूप से संभव ही नहीं होता — तब टूल यह साफ बता देता है, कोई जबरदस्ती सुझाव नहीं थोपता। कोई कानूनी/आधिकारिक बदलाव करने से पहले सुझाए गए नाम को अपनी वास्तविक कुंडली से मिलाकर पुष्टि कराना उचित है।",
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
        <Breadcrumbs crumbs={[{ name: "Home", href: "/" }, { name: "Free Tools", href: "/tools" }, { name: "Name Correction" }]} />
      </div>
      <NameCorrectionTool />
      <div className="container" style={{ maxWidth: "760px", margin: "-2rem auto 0", padding: "0 1rem 2.5rem" }}>
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
        <p style={{ fontSize: "0.85rem", color: "var(--muted)", textAlign: "center", marginTop: "1.5rem" }}>
          Related: <Link href="/guides/mulank-bhagyank-numerology">Mulank & Bhagyank Explained</Link> ·{" "}
          <Link href="/tools/numerology">Numerology Calculator</Link>
        </p>
      </div>
    </>
  );
}
