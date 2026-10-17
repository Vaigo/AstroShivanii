import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import TurantUttarTool from "./TurantUttarTool";
import type { FaqItem } from "@/lib/faq";
import RelatedLinks from "@/components/RelatedLinks";
import ToolFaq from "@/components/ToolFaq";

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

const FAQS: FaqItem[] = [
  {
    q: {
      hi: "तुरंत उत्तर क्या है और इसकी कीमत कितनी है?",
      en: "What is Turant Uttar and what does it cost?",
    },
    a: {
      hi: "तुरंत उत्तर में आप एक केंद्रित प्रश्न चुनते हैं — प्रेम, विवाह, करियर, सरकारी नौकरी, धन, स्वास्थ्य, संतान या विदेश — और अपने जन्म विवरण से हम आपकी कुंडली की वास्तविक खगोलीय गणना (लाहिरी अयनांश) करते हैं। कुंडली बनना और संक्षिप्त झलक (टीज़र) निःशुल्क है; पूर्ण उत्तर — कुंडली चार्ट, भाव-स्वामी की स्थिति, वर्तमान महादशा और आवश्यक होने पर उपाय सहित — ₹149 में खुलता है।",
      en: "In Turant Uttar you pick one focused question — love, marriage, career, government job, money, health, children or going abroad — and from your birth details we make a real astronomical calculation of your Kundli (Lahiri ayanamsa). Building the Kundli and a short preview (teaser) are free; the full answer — with your Kundli chart, the placement of the house lord, your current mahadasha and remedies where needed — unlocks for ₹149.",
    },
  },
  {
    q: {
      hi: "क्या यह उत्तर सच में मेरी कुंडली से निकलता है या पहले से लिखा हुआ है?",
      en: "Does the answer really come from my Kundli, or is it pre-written?",
    },
    a: {
      hi: "उत्तर का हर तथ्य आपकी अपनी कुंडली की वास्तविक गणना से आता है — आपके प्रश्न से जुड़ा भाव, उस भाव का स्वामी और उसकी बलवान/दुर्बल स्थिति, तथा आपकी चल रही महादशा और उसकी समाप्ति-तिथि। उत्तर में आपको अपना कुंडली चार्ट भी दिखता है जिसमें प्रश्न से जुड़ा भाव चिह्नित होता है। कुछ उत्तरों के लेखन में Astro Shivanii AI सहायता करती है, पर आधार हमेशा आपकी असली कुंडली ही होती है।",
      en: "Every fact in the answer comes from the actual calculation of your own Kundli — the house linked to your question, that house's lord and how strong or weak it is placed, and your running mahadasha and its end date. The answer also shows your Kundli chart with the house linked to your question marked. Astro Shivanii AI helps word some answers, but the basis is always your real Kundli.",
    },
  },
  {
    q: {
      hi: "भुगतान कैसे होता है और उत्तर कब मिलता है?",
      en: "How do I pay and when do I get the answer?",
    },
    a: {
      hi: "भुगतान UPI, कार्ड या नेटबैंकिंग से सुरक्षित Razorpay के माध्यम से होता है। भुगतान सत्यापित होते ही पूर्ण उत्तर उसी पेज पर कुछ ही क्षणों में खुल जाता है और आपके ब्राउज़र में सुरक्षित रहता है — पेज रीफ़्रेश करने पर भी। कोई समस्या हो तो अपने Ref कोड के साथ WhatsApp पर संदेश करें, हम उत्तर पूरा करवाएंगे। कृपया ध्यान दें — भुगतान रिफंड नहीं होता।",
      en: "Payment is by UPI, card or netbanking through secure Razorpay. As soon as the payment is verified, the full answer opens on the same page within moments and stays saved in your browser — even if you refresh the page. If anything goes wrong, message us on WhatsApp with your Ref code and we'll complete your answer. Please note — payments are non-refundable.",
    },
  },
  {
    q: {
      hi: "तुरंत उत्तर और शिवानी जी के पूर्ण प्रश्न-पाठन में क्या अंतर है?",
      en: "How is Turant Uttar different from Shivanii's full question reading?",
    },
    a: {
      hi: "तुरंत उत्तर एक त्वरित झलक है जो मुख्यतः दो कारकों — प्रश्न से जुड़े भाव और वर्तमान महादशा — पर आधारित है, इसलिए यह कोई गारंटीशुदा भविष्यवाणी नहीं बल्कि आपकी कुंडली की ईमानदार त्वरित व्याख्या है। यदि आपको गहन विश्लेषण चाहिए — पूरी कुंडली, वर्ग-कुंडलियां और सभी दशा-स्तर — तो शिवानी जी का पूर्ण प्रश्न-पाठन (₹499) बुक करें।",
      en: "Turant Uttar is a quick look based mainly on two factors — the house linked to your question and your current mahadasha — so it is not a guaranteed prediction but an honest quick interpretation of your Kundli. If you need an in-depth analysis — the full chart, the divisional charts and every dasha level — book Shivanii's full question reading (₹499).",
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
        <Breadcrumbs crumbs={[{ name: "Home", nameHi: "होम", href: "/" }, { name: "Free Tools", nameHi: "निःशुल्क टूल्स", href: "/tools" }, { name: "Turant Uttar", nameHi: "तुरंत उत्तर" }]} />
      </div>
      <TurantUttarTool />
      <div className="container" style={{ maxWidth: "860px", padding: "0 1rem 2.5rem" }}>
        <article className="guide-article">
          <ToolFaq faqs={FAQS} />
        </article>
        <p style={{ fontSize: "0.85rem", color: "var(--muted)", textAlign: "center", marginTop: "1.5rem" }}>
          <RelatedLinks links={[{ href: "/readings/ask-one-question", en: "Ask Shivanii Directly", hi: "शिवानी जी से सीधे पूछें" }, { href: "/guides/birth-time-missing-astrology", en: "No birth time? What astrology can still tell you", hi: "जन्म समय नहीं पता? ज्योतिष फिर भी क्या बताता है" }]} />
        </p>
      </div>
    </>
  );
}
