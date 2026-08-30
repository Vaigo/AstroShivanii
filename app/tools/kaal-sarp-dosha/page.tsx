import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import KaalSarpTool from "./KaalSarpTool";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://astroshivanii.com";

export const metadata: Metadata = {
  title: "Free Kaal Sarp Dosha Checker — In Your Chart?",
  description:
    "Check whether Kaal Sarp Dosha is present in your birth chart, its direction, and which planets are involved. Free Vedic astrology calculator.",
  alternates: { canonical: "/tools/kaal-sarp-dosha/" },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Kaal Sarp Dosha Checker",
  description:
    "Check whether Kaal Sarp Dosha is present in your birth chart, its direction, and which planets are involved.",
  url: `${SITE_URL}/tools/kaal-sarp-dosha/`,
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
  provider: { "@type": "Person", name: "Shivanii", url: `${SITE_URL}/about/` },
};

const FAQS = [
  {
    q: "काल सर्प दोष कब बनता है और कैसे पता चलता है?",
    a: "काल सर्प दोष तब बनता है जब सूर्य, चंद्र, मंगल, बुध, गुरु, शुक्र और शनि — सातों ग्रह — कुंडली में राहु और केतु की धुरी के एक ही ओर स्थित हों। एक भी ग्रह दूसरी ओर हो तो यह दोष बनता ही नहीं। ऊपर का टूल आपके जन्म विवरण से वास्तविक खगोलीय गणना (लाहिरी अयनांश) करके बताता है कि यह स्थिति आपकी कुंडली में है या नहीं, किस दिशा में है और कौन-कौन से ग्रह शामिल हैं।",
  },
  {
    q: "क्या काल सर्प दोष सच में इतना खतरनाक है?",
    a: "नहीं — इसकी छवि इसके वास्तविक असर से कहीं ज़्यादा डरावनी बना दी गई है। शास्त्रीय रूप से इसका असर इतना है कि कुछ क्षेत्रों में मेहनत का फल देर से मिलता है — काम अटकते हैं, रुकते नहीं। यह मृत्यु या अनहोनी का संकेत बिल्कुल नहीं है, और यह स्थिति बहुत आम है — अनगिनत सफल लोगों की कुंडली में मौजूद है। कई कुंडलियों में कुछ शर्तें पूरी होने पर यह लगभग बेअसर (भंग) भी हो जाता है, जो पूरी कुंडली देखकर ही पता चलता है।",
  },
  {
    q: "उदित और अनुदित गोलार्ध काल सर्प में क्या अंतर है?",
    a: "यह केवल दिशा की पहचान है — उदित गोलार्ध में सातों ग्रह राहु से केतु की ओर बंधे होते हैं, और अनुदित गोलार्ध में केतु से राहु की ओर। दिशा से उपाय नहीं बदलते; यह सिर्फ यह बताती है कि आपकी कुंडली में यह बनावट किस रूप में है। दोष की वास्तविक तीव्रता राहु-केतु के भाव, ग्रहों की स्थिति और दशाओं से तय होती है, दिशा से नहीं।",
  },
  {
    q: "क्या यह जांच मुफ्त है? उपाय कहां मिलेंगे?",
    a: "हां, यह जांच पूरी तरह निःशुल्क है — जन्म तिथि, समय और स्थान डालते ही परिणाम मिलता है। दोष मिलने पर सामान्य शास्त्रीय उपाय (राहु-केतु शांति पूजा, नाग पंचमी पूजा, महामृत्युंजय जाप आदि) परिणाम के साथ ही दिखाए जाते हैं। ध्यान रहे — ये सामान्य उपाय हैं; दोष की वास्तविक तीव्रता, भंग योग और कुंडली-विशेष उपाय पूर्ण कुंडली विश्लेषण (₹999) में ही तय हो सकते हैं। कोई भी उपाय गारंटीशुदा परिणाम का दावा नहीं करता।",
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
        <Breadcrumbs crumbs={[{ name: "Home", href: "/" }, { name: "Free Tools", href: "/tools" }, { name: "Kaal Sarp Dosha" }]} />
      </div>
      <KaalSarpTool />
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
          <p style={{ fontSize: "0.85rem", color: "var(--muted)", textAlign: "center", marginTop: "1.5rem" }}>
            Related: <Link href="/tools/kundli">Kundli / Birth Chart Calculator</Link> ·{" "}
            <Link href="/tools/sade-sati">Sade Sati Checker</Link>
          </p>
        </article>
      </div>
    </>
  );
}
