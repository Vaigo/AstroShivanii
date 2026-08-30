import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import NumerologyTool from "./NumerologyTool";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://astroshivanii.com";

export const metadata: Metadata = {
  title: "Free Numerology — Mulank, Bhagyank & Lo Shu Grid",
  description: "Calculate your Mulank (psychic number), Bhagyank (destiny number), Name Number, and Lo Shu Grid with Karmic Lessons and Karmic Debt — free, instant, no sign-up.",
  alternates: { canonical: "/tools/numerology/" },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Numerology Calculator",
  description:
    "Calculate your Mulank (psychic number), Bhagyank (destiny number), Name Number, and Lo Shu Grid with Karmic Lessons and Karmic Debt.",
  url: `${SITE_URL}/tools/numerology/`,
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
  provider: { "@type": "Person", name: "Shivanii", url: `${SITE_URL}/about/` },
};

const FAQS = [
  {
    q: "मूलांक और भाग्यांक में क्या अंतर है?",
    a: "मूलांक केवल आपके जन्म के दिन से बनता है (जैसे 25 तारीख → 2+5 = 7) — यह आपका रोज़ का, सहज स्वभाव है। भाग्यांक पूरी जन्मतिथि (दिन+महीना+वर्ष) जोड़ने से बनता है — यह जीवन की दिशा बताता है, यानी हालात आपको बार-बार किस ओर ले जाते हैं। आसान नियम: रोज़ के फैसलों में मूलांक की सुनिए, ज़िंदगी के बड़े मोड़ों पर भाग्यांक की। यह टूल दोनों अलग-अलग निकालकर उनका आपसी तालमेल भी दिखाता है।",
  },
  {
    q: "नाम अंक कैसे निकाला जाता है — और वर्तनी क्यों मायने रखती है?",
    a: "यह टूल चाल्डियन पद्धति से नाम अंक निकालता है, जिसमें हर अक्षर का एक निश्चित अंक-मान होता है। इसीलिए वर्तनी बहुत मायने रखती है — एक भी अक्षर बदलने (जैसे Sonia बनाम Soniya) से पूरा अंक बदल जाता है। हमेशा वही पूरा नाम लिखें जिसकी वर्तनी आप जांचना चाहते हैं — उपनाम या घर का नाम नहीं, जब तक आप उसी की जांच न कर रहे हों।",
  },
  {
    q: "लो शु ग्रिड में अनुपस्थित अंक (कार्मिक पाठ) का क्या मतलब है?",
    a: "लो शु ग्रिड 3×3 वर्ग में आपकी जन्मतिथि के अंक रखे जाते हैं — यह टूल सम्पूर्ण-ग्रिड पद्धति अपनाता है, यानी मूलांक, भाग्यांक, नाम अंक और कुआ अंक भी ग्रिड में जोड़े जाते हैं। जो अंक फिर भी अनुपस्थित रहें, उनके विषय (जैसे 5 = संतुलन, 8 = धन-प्रबंधन) जीवन में बार-बार सीखने के अवसर बनकर आते हैं — इन्हें कार्मिक पाठ कहते हैं। यह कोई दोष या डरने की बात नहीं, बल्कि आत्म-समझ का संकेत है; टूल हर अनुपस्थित अंक के साथ परंपरागत उपाय भी दिखाता है।",
  },
  {
    q: "क्या यह अंक ज्योतिष कैलकुलेटर मुफ़्त है? क्या इससे भविष्य पक्का पता चलता है?",
    a: "हां, यह पूरी तरह मुफ़्त है — कोई साइन-अप नहीं, कोई छिपा शुल्क नहीं; मूलांक, भाग्यांक, नाम अंक, कुआ अंक, लो शु ग्रिड और कार्मिक अंक सब तुरंत मिलते हैं। साथ ही ईमानदारी से कहें — अंक ज्योतिष स्वभाव और रुझान समझने का परंपरागत मार्गदर्शन है, कोई गारंटीशुदा भविष्यवाणी नहीं। पूरी तस्वीर अंकों को आपकी कुंडली और जीवन-परिस्थितियों के साथ मिलाकर बनती है, जिसके लिए आप शिवानी जी से व्यक्तिगत परामर्श ले सकते हैं।",
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

export default function NumerologyPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <div className="container" style={{ maxWidth: "860px", paddingTop: "1rem" }}>
        <Breadcrumbs crumbs={[{ name: "Home", href: "/" }, { name: "Free Tools", href: "/tools" }, { name: "Numerology" }]} />
      </div>
      <NumerologyTool />
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
          <p style={{ fontSize: "0.85rem", color: "var(--muted)", textAlign: "center", marginTop: "1.5rem" }}>
            Related: <Link href="/guides/mulank-bhagyank-numerology">Mulank & Bhagyank Explained</Link> ·{" "}
            <Link href="/tools/name-correction">Name Correction Checker</Link>
          </p>
        </article>
      </div>
    </>
  );
}
