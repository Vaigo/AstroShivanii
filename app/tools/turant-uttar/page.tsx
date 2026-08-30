import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import TurantUttarTool from "./TurantUttarTool";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://astroshivanii.com";

export const metadata: Metadata = {
  title: "तुरंत उत्तर — Instant Answer ₹149",
  description:
    "Ask one focused question — love, marriage, career, finance, health, children, or foreign travel — and get a real chart-based quick-take answer in minutes, ₹149.",
  alternates: { canonical: "/tools/turant-uttar/" },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Turant Uttar — Instant Quick-Take Answer",
  description:
    "Ask one focused question and get a real chart-based quick-take answer in minutes.",
  url: `${SITE_URL}/tools/turant-uttar/`,
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "149", priceCurrency: "INR" },
  provider: { "@type": "Person", name: "Shivanii", url: `${SITE_URL}/about/` },
};

const FAQS = [
  {
    q: "तुरंत उत्तर क्या है और इसकी कीमत कितनी है?",
    a: "तुरंत उत्तर में आप एक केंद्रित प्रश्न चुनते हैं — प्रेम, विवाह, करियर, सरकारी नौकरी, धन, स्वास्थ्य, संतान या विदेश — और अपने जन्म विवरण से हम आपकी कुंडली की वास्तविक खगोलीय गणना (लाहिरी अयनांश) करते हैं। कुंडली बनना और संक्षिप्त झलक (टीज़र) निःशुल्क है; पूर्ण उत्तर — कुंडली चार्ट, भाव-स्वामी की स्थिति, वर्तमान महादशा और आवश्यक होने पर उपाय सहित — ₹149 में खुलता है।",
  },
  {
    q: "क्या यह उत्तर सच में मेरी कुंडली से निकलता है या पहले से लिखा हुआ है?",
    a: "उत्तर का हर तथ्य आपकी अपनी कुंडली की वास्तविक गणना से आता है — आपके प्रश्न से जुड़ा भाव, उस भाव का स्वामी और उसकी बलवान/दुर्बल स्थिति, तथा आपकी चल रही महादशा और उसकी समाप्ति-तिथि। उत्तर में आपको अपना कुंडली चार्ट भी दिखता है जिसमें प्रश्न से जुड़ा भाव चिह्नित होता है। कुछ उत्तरों के लेखन में Astro Shivanii AI सहायता करती है, पर आधार हमेशा आपकी असली कुंडली ही होती है।",
  },
  {
    q: "भुगतान कैसे होता है और उत्तर कब मिलता है?",
    a: "भुगतान UPI, कार्ड या नेटबैंकिंग से सुरक्षित Razorpay के माध्यम से होता है। भुगतान सत्यापित होते ही पूर्ण उत्तर उसी पेज पर कुछ ही क्षणों में खुल जाता है और आपके ब्राउज़र में सुरक्षित रहता है — पेज रीफ़्रेश करने पर भी। कोई समस्या हो तो अपने Ref कोड के साथ WhatsApp पर संदेश करें, हम उत्तर पूरा करवाएंगे। कृपया ध्यान दें — भुगतान रिफंड नहीं होता।",
  },
  {
    q: "तुरंत उत्तर और शिवानी जी के पूर्ण प्रश्न-पाठन में क्या अंतर है?",
    a: "तुरंत उत्तर एक त्वरित झलक है जो मुख्यतः दो कारकों — प्रश्न से जुड़े भाव और वर्तमान महादशा — पर आधारित है, इसलिए यह कोई गारंटीशुदा भविष्यवाणी नहीं बल्कि आपकी कुंडली की ईमानदार त्वरित व्याख्या है। यदि आपको गहन विश्लेषण चाहिए — पूरी कुंडली, वर्ग-कुंडलियां और सभी दशा-स्तर — तो शिवानी जी का पूर्ण प्रश्न-पाठन (₹499) बुक करें।",
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
        <Breadcrumbs crumbs={[{ name: "Home", href: "/" }, { name: "Free Tools", href: "/tools" }, { name: "Turant Uttar" }]} />
      </div>
      <TurantUttarTool />
      <div className="container" style={{ maxWidth: "860px", padding: "0 1rem 2.5rem" }}>
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
          Related: <Link href="/readings/ask-one-question">Ask Shivanii Directly</Link> ·{" "}
          <Link href="/guides/birth-time-missing-astrology">No birth time? What astrology can still tell you</Link>
        </p>
      </div>
    </>
  );
}
