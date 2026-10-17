import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import RelatedLinks from "@/components/RelatedLinks";
import ToolFaq from "@/components/ToolFaq";
import type { FaqItem } from "@/lib/faq";
import PanchangTool from "./PanchangTool";
import { PanchangGuide, PanchangIntro } from "./PanchangText";

export const metadata: Metadata = {
  title: "आज का पंचांग (Aaj Ka Panchang) — Tithi & Rahu Kaal",
  description:
    "Today's panchang with real astronomical calculations: tithi, vara, nakshatra, yoga, karana, sunrise-sunset, Rahu Kaal, Gulika Kaal, Yamaganda and Abhijit Muhurta — for any date and city. Free, no sign-up.",
  alternates: { canonical: "/tools/panchang/" },
};

const FAQS: FaqItem[] = [
  {
    q: {
      hi: "पंचांग क्या है?",
      en: "What is a panchang?",
    },
    a: {
      hi: "पंचांग का शाब्दिक अर्थ है 'पाँच अंग' — दिन की वैदिक समय-गणना के पाँच तत्व: तिथि (चंद्र दिवस), वार (सप्ताह का दिन), नक्षत्र (वह तारा-समूह जिसमें चंद्रमा है), योग (सूर्य-चंद्र का संयोग) और करण (तिथि का आधा भाग)। ये मिलकर स्वयं समय की गुणवत्ता बताते हैं — इसीलिए हर मुहूर्त का निर्णय पंचांग से शुरू होता है।",
      en: "Panchang literally means 'five limbs' — the five elements of Vedic timekeeping for a day: tithi (lunar day), vara (weekday), nakshatra (the constellation the Moon occupies), yoga (a Sun-Moon combination) and karana (half of a tithi). Together they describe the quality of time itself, which is why every muhurta decision starts with the panchang.",
    },
  },
  {
    q: {
      hi: "तिथि क्या होती है और यह अंग्रेज़ी तारीख़ से अलग क्यों है?",
      en: "What is a tithi, and why is it different from the English date?",
    },
    a: {
      hi: "तिथि चंद्र दिवस है — वह समय जिसमें चंद्रमा सूर्य से 12° आगे निकलता है। यह आधी रात से आधी रात वाली अंग्रेज़ी तारीख़ से मेल नहीं खाती: तिथि घड़ी के किसी भी समय शुरू और समाप्त हो सकती है, इसीलिए पंचांग हर अंग का समाप्ति-समय दिखाता है।",
      en: "A tithi is a lunar day — the time the Moon takes to move 12° ahead of the Sun. It does not align with the midnight-to-midnight English date: a tithi can begin and end at any clock time, which is why the panchang shows an end-time for each element.",
    },
  },
  {
    q: {
      hi: "राहु काल में क्या नहीं करना चाहिए?",
      en: "What should be avoided in Rahu Kaal?",
    },
    a: {
      hi: "राहु काल रोज़ का लगभग 90 मिनट का समय है, जिसे नया काम शुरू करने के लिए अशुभ माना जाता है — यात्रा, खरीदारी, कोई शुभारंभ या संस्कार। पहले से चल रहे रोज़मर्रा के काम में कोई हर्ज नहीं। इसका समय सूर्योदय और वार पर निर्भर है, इसलिए हर शहर और तारीख़ के लिए अलग होता है — हमेशा अपने स्थान के लिए देखें।",
      en: "Rahu Kaal is a daily ~90-minute window considered inauspicious for STARTING new work — a journey, a purchase, a launch, a ceremony. Routine ongoing work is fine. Its timing depends on sunrise and weekday, so it differs by city and date — always check for your location.",
    },
  },
  {
    q: {
      hi: "अभिजीत मुहूर्त क्या है?",
      en: "What is Abhijit Muhurta?",
    },
    a: {
      hi: "अभिजीत दिन का आठवाँ मुहूर्त है, जो स्थानीय सौर मध्याह्न के आसपास होता है। जब कोई व्यक्तिगत मुहूर्त उपलब्ध न हो, तब इसे शुभ काम शुरू करने का सामान्य रूप से शुभ समय माना जाता है — एक सुरक्षित विकल्प, हालांकि आपकी अपनी कुंडली से मिलाया गया मुहूर्त हमेशा अधिक बलवान होता है।",
      en: "Abhijit is the 8th muhurta of the day, centred on local solar noon. It is treated as a generally auspicious window for starting good work when no personalised muhurta is available — a safe default, though a muhurta matched to your own birth chart is always stronger.",
    },
  },
  {
    q: {
      hi: "चोघड़िया क्या है और शुभ चोघड़िया कौन-से हैं?",
      en: "What is a choghadiya, and which ones are auspicious?",
    },
    a: {
      hi: "दिन और रात को 8-8 बराबर भागों में बाँटने पर हर भाग एक चोघड़िया कहलाता है। अमृत, शुभ और लाभ शुभ चोघड़िया हैं; चल यात्रा के लिए ठीक; उद्वेग, काल और रोग में नए शुभ कार्य टाले जाते हैं। समय सूर्योदय-सूर्यास्त पर निर्भर है, इसलिए हर शहर का चोघड़िया अलग होता है — ऊपर अपने शहर का देखें।",
      en: "Divide the day and the night into 8 equal parts each, and every part is a choghadiya. Amrit, Shubh and Labh are the auspicious ones; Char is fine for travel; new auspicious work is put off during Udveg, Kaal and Rog. The timings depend on sunrise and sunset, so every city's choghadiya is different — check yours above.",
    },
  },
  {
    q: {
      hi: "होरा क्या होती है?",
      en: "What is a hora?",
    },
    a: {
      hi: "सूर्योदय से सूर्यास्त तक का समय 12 बराबर 'ग्रह-घंटों' में बँटता है — हर होरा एक ग्रह की होती है। गुरु और शुक्र की होरा शुभ आरम्भ के लिए, बुध की व्यापार-लेखन के लिए, चंद्र की यात्रा के लिए उत्तम मानी जाती है।",
      en: "The time from sunrise to sunset is split into 12 equal 'planetary hours' — each hora belongs to a planet. Jupiter's and Venus's horas are considered best for auspicious beginnings, Mercury's for business and writing, and the Moon's for travel.",
    },
  },
  {
    q: {
      hi: "क्या यह पंचांग सटीक है?",
      en: "How accurate is this panchang?",
    },
    a: {
      hi: "सभी मान वास्तविक खगोलीय स्थितियों से, लाहिरी अयनांश के साथ — वही मानक जो भारत सरकार के पंचांग अपनाते हैं — आपके चुने हुए शहर के लिए निकाले जाते हैं। ये किसी छपी हुई तालिका से नकल नहीं किए जाते।",
      en: "All values are computed from real astronomical positions using the Lahiri ayanamsa — the same standard used by Indian government panchangs — for the exact city you select. They are not copied from a printed table.",
    },
  },
];

export default function PanchangPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q.hi,
      acceptedAnswer: { "@type": "Answer", text: f.a.hi },
    })),
  };

  return (
    <section className="section">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="container" style={{ maxWidth: "860px" }}>
        <Breadcrumbs
          crumbs={[
            { name: "Home", nameHi: "होम", href: "/" },
            { name: "Free Tools", nameHi: "निःशुल्क टूल्स", href: "/tools" },
            { name: "Panchang", nameHi: "पंचांग" },
          ]}
        />

        <PanchangIntro />

        <PanchangTool />

        {/* ── Crawlable explainer content ── */}
        <article className="guide-article" style={{ marginTop: "3rem" }}>
          <PanchangGuide />

          <div style={{ marginBottom: "2rem" }}>
            <ToolFaq faqs={FAQS} />
          </div>

          <p className="guide-p" style={{ textAlign: "center" }}>
            <RelatedLinks
              label={{ en: "Learn more:", hi: "और जानें:" }}
              links={[
                { href: "/guides/what-is-kundli", en: "What is a Kundli?", hi: "कुंडली क्या है?" },
                { href: "/guides/birth-time-missing-astrology", en: "No birth time? What astrology can still tell you", hi: "जन्म समय नहीं पता? ज्योतिष फिर भी क्या बताता है" },
              ]}
            />
          </p>
        </article>
      </div>
    </section>
  );
}
