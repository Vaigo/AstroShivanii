import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import NumerologyTool from "./NumerologyTool";
import type { FaqItem } from "@/lib/faq";
import RelatedLinks from "@/components/RelatedLinks";
import ToolFaq from "@/components/ToolFaq";

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

const FAQS: FaqItem[] = [
  {
    q: {
      hi: "मूलांक और भाग्यांक में क्या अंतर है?",
      en: "What is the difference between Mulank and Bhagyank?",
    },
    a: {
      hi: "मूलांक केवल आपके जन्म के दिन से बनता है (जैसे 25 तारीख → 2+5 = 7) — यह आपका रोज़ का, सहज स्वभाव है। भाग्यांक पूरी जन्मतिथि (दिन+महीना+वर्ष) जोड़ने से बनता है — यह जीवन की दिशा बताता है, यानी हालात आपको बार-बार किस ओर ले जाते हैं। आसान नियम: रोज़ के फैसलों में मूलांक की सुनिए, ज़िंदगी के बड़े मोड़ों पर भाग्यांक की। यह टूल दोनों अलग-अलग निकालकर उनका आपसी तालमेल भी दिखाता है।",
      en: "The Mulank comes only from the day you were born (for example, the 25th → 2+5 = 7) — it is your everyday, natural temperament. The Bhagyank comes from adding up your full date of birth (day + month + year) — it shows life's direction, the way circumstances keep steering you. A simple rule: listen to your Mulank for everyday decisions and to your Bhagyank at life's big turning points. This tool works out both separately and shows how well they get along.",
    },
  },
  {
    q: {
      hi: "नाम अंक कैसे निकाला जाता है — और वर्तनी क्यों मायने रखती है?",
      en: "How is the name number worked out — and why does spelling matter?",
    },
    a: {
      hi: "यह टूल चाल्डियन पद्धति से नाम अंक निकालता है, जिसमें हर अक्षर का एक निश्चित अंक-मान होता है। इसीलिए वर्तनी बहुत मायने रखती है — एक भी अक्षर बदलने (जैसे Sonia बनाम Soniya) से पूरा अंक बदल जाता है। हमेशा वही पूरा नाम लिखें जिसकी वर्तनी आप जांचना चाहते हैं — उपनाम या घर का नाम नहीं, जब तक आप उसी की जांच न कर रहे हों।",
      en: "This tool works out the name number with the Chaldean system, in which every letter has a fixed value. That's why spelling matters so much — changing even one letter (Sonia vs Soniya, for instance) changes the whole number. Always enter the full name whose spelling you want to check — not a nickname or a pet name, unless that is the one you're checking.",
    },
  },
  {
    q: {
      hi: "लो शु ग्रिड में अनुपस्थित अंक (कार्मिक पाठ) का क्या मतलब है?",
      en: "What do the missing numbers (karmic lessons) in the Lo Shu grid mean?",
    },
    a: {
      hi: "लो शु ग्रिड 3×3 वर्ग में आपकी जन्मतिथि के अंक रखे जाते हैं — यह टूल सम्पूर्ण-ग्रिड पद्धति अपनाता है, यानी मूलांक, भाग्यांक, नाम अंक और कुआ अंक भी ग्रिड में जोड़े जाते हैं। जो अंक फिर भी अनुपस्थित रहें, उनके विषय (जैसे 5 = संतुलन, 8 = धन-प्रबंधन) जीवन में बार-बार सीखने के अवसर बनकर आते हैं — इन्हें कार्मिक पाठ कहते हैं। यह कोई दोष या डरने की बात नहीं, बल्कि आत्म-समझ का संकेत है; टूल हर अनुपस्थित अंक के साथ परंपरागत उपाय भी दिखाता है।",
      en: "The Lo Shu grid places the digits of your date of birth in a 3×3 square — this tool follows the complete-grid method, so your Mulank, Bhagyank, name number and Kua number are added to the grid as well. The numbers still missing after that bring their themes (such as 5 = balance, 8 = managing money) back again and again as chances to learn — these are called karmic lessons. They are not a flaw or anything to fear, but a pointer to self-understanding; the tool shows a traditional remedy with every missing number.",
    },
  },
  {
    q: {
      hi: "क्या यह अंक ज्योतिष कैलकुलेटर मुफ़्त है? क्या इससे भविष्य पक्का पता चलता है?",
      en: "Is this numerology calculator free? Can it tell the future for certain?",
    },
    a: {
      hi: "हां, यह पूरी तरह मुफ़्त है — कोई साइन-अप नहीं, कोई छिपा शुल्क नहीं; मूलांक, भाग्यांक, नाम अंक, कुआ अंक, लो शु ग्रिड और कार्मिक अंक सब तुरंत मिलते हैं। साथ ही ईमानदारी से कहें — अंक ज्योतिष स्वभाव और रुझान समझने का परंपरागत मार्गदर्शन है, कोई गारंटीशुदा भविष्यवाणी नहीं। पूरी तस्वीर अंकों को आपकी कुंडली और जीवन-परिस्थितियों के साथ मिलाकर बनती है, जिसके लिए आप शिवानी जी से व्यक्तिगत परामर्श ले सकते हैं।",
      en: "Yes, it is completely free — no sign-up, no hidden charge; your Mulank, Bhagyank, name number, Kua number, Lo Shu grid and karmic numbers all appear instantly. And honestly — numerology is traditional guidance for understanding your nature and inclinations, not a guaranteed prediction. The full picture comes from reading the numbers together with your birth chart and your life circumstances, for which you can book a personal consultation with Shivanii.",
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

export default function NumerologyPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <div className="container" style={{ maxWidth: "860px", paddingTop: "1rem" }}>
        <Breadcrumbs crumbs={[{ name: "Home", nameHi: "होम", href: "/" }, { name: "Free Tools", nameHi: "निःशुल्क टूल्स", href: "/tools" }, { name: "Numerology", nameHi: "अंक ज्योतिष" }]} />
      </div>
      <NumerologyTool />
      <div className="container" style={{ maxWidth: "860px", padding: "0 1rem 2.5rem" }}>
        <article className="guide-article">
          <ToolFaq faqs={FAQS} />
          <p style={{ fontSize: "0.85rem", color: "var(--muted)", textAlign: "center", marginTop: "1.5rem" }}>
            <RelatedLinks links={[{ href: "/guides/mulank-bhagyank-numerology", en: "Mulank & Bhagyank Explained", hi: "मूलांक और भाग्यांक" }, { href: "/tools/name-correction", en: "Name Correction Checker", hi: "नाम सुधार जांच" }]} />
          </p>
        </article>
      </div>
    </>
  );
}
