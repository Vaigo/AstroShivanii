import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import LalKitabTool from "./LalKitabTool";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://astroshivanii.com";

export const metadata: Metadata = {
  title: "Free Lal Kitab Calculator — Debts & Remedies",
  description:
    "Calculate your Lal Kitab chart — planetary houses, active debts (karz), pakka ghar, and practical remedies (upayas). Free Vedic astrology calculator.",
  alternates: { canonical: "/tools/lal-kitab/" },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Lal Kitab Calculator",
  description:
    "Calculate your Lal Kitab chart — planetary houses, active debts (karz), pakka ghar, and practical remedies (upayas).",
  url: `${SITE_URL}/tools/lal-kitab/`,
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
  provider: { "@type": "Person", name: "Shivanii", url: `${SITE_URL}/about/` },
};

const FAQS = [
  {
    q: "लाल किताब में 'ऋण' (कर्ज) का क्या मतलब है? क्या यह पैसों का कर्ज है?",
    a: "नहीं, यह पैसों का कर्ज नहीं है। लाल किताब मानती है कि कुछ अधूरी जिम्मेदारियां परिवार में पीढ़ी-दर-पीढ़ी चली आती हैं — जैसे पितृ ऋण, मातृ ऋण, स्वयं ऋण आदि 9 प्रकार के ऋण। कुंडली में ग्रहों की विशेष स्थिति से पहचाना जाता है कि कौन-सा ऋण सक्रिय है। हर ऋण का एक सीधा, व्यावहारिक उपाय होता है — यह टूल आपकी कुंडली से सक्रिय ऋण और उनके पारंपरिक उपाय दिखाता है।",
  },
  {
    q: "पक्का घर क्या होता है?",
    a: "लाल किताब में हर ग्रह के 1-2 'पक्के घर' (स्थायी भाव) माने जाते हैं — जैसे सूर्य का पक्का घर पहला भाव। जब ग्रह अपने पक्के घर में बैठा हो, तो वह घर जैसा सहज महसूस करता है और अपना पूरा, स्थिर फल देता है। यह टूल आपकी कुंडली के नौ ग्रहों की स्थिति और यह दोनों तालिकाओं में दिखाता है कि कौन-सा ग्रह अपने पक्के घर में है।",
  },
  {
    q: "क्या यह लाल किताब कैलकुलेटर मुफ्त है? गणना किस आधार पर होती है?",
    a: "हां, यह टूल पूरी तरह मुफ्त है — ग्रह स्थिति, सक्रिय ऋण, पक्का घर, भाव-अनुसार फल और उपाय, सब बिना किसी शुल्क के। गणना वास्तविक खगोलीय स्थिति से होती है, लाहिरी अयनांश (भारत सरकार का मानक) के आधार पर — कोई अनुमानित या रटी-रटाई तालिका नहीं। यदि आप प्राथमिकता क्रम में व्यक्तिगत उपाय योजना चाहें, तो शिवानी जी का लाल किताब उपाय पाठन ₹899 में अलग से उपलब्ध है।",
  },
  {
    q: "क्या लाल किताब के उपाय करने से समस्या निश्चित रूप से हल हो जाएगी?",
    a: "ईमानदार उत्तर — कोई भी ज्योतिषीय उपाय गारंटी नहीं है, और ऐसा दावा करने वालों से सावधान रहें। लाल किताब की परम्परा में उपाय सरल, कम खर्च वाले और स्वयं करने योग्य होते हैं — जैसे दान, सेवा या दिनचर्या में छोटा बदलाव — और इन्हें मन के संतुलन व कर्म-सुधार का माध्यम माना जाता है। उपाय को अपने प्रयासों का पूरक समझें, विकल्प नहीं; स्वास्थ्य या कानूनी मामलों में योग्य विशेषज्ञ की सलाह ही प्राथमिक है।",
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
        <Breadcrumbs crumbs={[{ name: "Home", href: "/" }, { name: "Free Tools", href: "/tools" }, { name: "Lal Kitab" }]} />
      </div>
      <LalKitabTool />
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
          Related: <Link href="/readings/lal-kitab-remedies">Book Lal Kitab Remedies</Link> ·{" "}
          <Link href="/tools/kundli">Kundli / Birth Chart Calculator</Link>
        </p>
      </div>
    </>
  );
}
