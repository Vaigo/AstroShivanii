import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import PanchangTool from "./PanchangTool";

export const metadata: Metadata = {
  title: "आज का पंचांग (Aaj Ka Panchang) — Tithi, Nakshatra, Rahu Kaal, Muhurta",
  description:
    "Today's panchang with real astronomical calculations: tithi, vara, nakshatra, yoga, karana, sunrise-sunset, Rahu Kaal, Gulika Kaal, Yamaganda and Abhijit Muhurta — for any date and city. Free, no sign-up.",
  alternates: { canonical: "/tools/panchang/" },
};

const FAQS = [
  {
    q: "पंचांग क्या है? (What is a panchang?)",
    a: "Panchang literally means 'five limbs' (पांच अंग) — the five elements of Vedic timekeeping for a day: tithi (lunar day), vara (weekday), nakshatra (the constellation the Moon occupies), yoga (a Sun-Moon combination) and karana (half of a tithi). Together they describe the quality of time itself, which is why every muhurta decision starts with the panchang.",
  },
  {
    q: "तिथि क्या होती है और यह अंग्रेज़ी तारीख़ से अलग क्यों है?",
    a: "A tithi is a lunar day — the time the Moon takes to move 12° ahead of the Sun. It does not align with the midnight-to-midnight English date: a tithi can begin and end at any clock time, which is why the panchang shows an end-time for each element.",
  },
  {
    q: "राहु काल में क्या नहीं करना चाहिए? (What to avoid in Rahu Kaal?)",
    a: "Rahu Kaal is a daily ~90-minute window considered inauspicious for STARTING new work — a journey, a purchase, a launch, a ceremony. Routine ongoing work is fine. Its timing depends on sunrise and weekday, so it differs by city and date — always check for your location.",
  },
  {
    q: "अभिजीत मुहूर्त क्या है? (What is Abhijit Muhurta?)",
    a: "Abhijit is the 8th muhurta of the day, centred on local solar noon. It is treated as a generally auspicious window for starting good work when no personalised muhurta is available — a safe default, though a muhurta matched to your own birth chart is always stronger.",
  },
  {
    q: "चोघड़िया क्या है और शुभ चोघड़िया कौन-से हैं?",
    a: "दिन और रात को 8-8 बराबर भागों में बाँटने पर हर भाग एक चोघड़िया कहलाता है। अमृत, शुभ और लाभ शुभ चोघड़िया हैं; चल यात्रा के लिए ठीक; उद्वेग, काल और रोग में नए शुभ कार्य टाले जाते हैं। समय सूर्योदय-सूर्यास्त पर निर्भर है, इसलिए हर शहर का चोघड़िया अलग होता है — ऊपर अपने शहर का देखें।",
  },
  {
    q: "होरा क्या होती है? (What is a hora?)",
    a: "सूर्योदय से सूर्यास्त तक का समय 12 बराबर 'ग्रह-घंटों' में बँटता है — हर होरा एक ग्रह की होती है। गुरु और शुक्र की होरा शुभ आरम्भ के लिए, बुध की व्यापार-लेखन के लिए, चंद्र की यात्रा के लिए उत्तम मानी जाती है।",
  },
  {
    q: "क्या यह पंचांग सटीक है? (How accurate is this panchang?)",
    a: "All values are computed from real astronomical positions using the Lahiri ayanamsa — the same standard used by Indian government panchangs — for the exact city you select. They are not copied from a printed table.",
  },
];

export default function PanchangPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
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
            { name: "Home", href: "/" },
            { name: "Free Tools", href: "/tools" },
            { name: "Panchang" },
          ]}
        />

        <h1 className="section-heading">आज का पंचांग — Daily Panchang</h1>
        <p className="section-heading-hi devanagari">तिथि · वार · नक्षत्र · योग · करण · राहु काल</p>
        <div className="tool-explainer" style={{ textAlign: "center", marginBottom: "2rem" }}>
          <p className="devanagari" style={{ fontWeight: 600, color: "var(--maroon)", marginBottom: "0.4rem" }}>
            हर शुभ काम से पहले — एक नज़र आज के पंचांग पर। करोड़ों भारतीय घरों की सुबह की पहली आदत, अब आपके शहर के सटीक समय के साथ।
          </p>
          <p>
            The panchang is the Vedic calendar of the day — five limbs of time that decide
            when to begin what. This one is computed astronomically (Lahiri ayanamsa) for
            your chosen city and date, including Rahu Kaal, Choghadiya, Hora and Abhijit Muhurta.
          </p>
        </div>

        <PanchangTool />

        {/* ── Crawlable explainer content ── */}
        <article className="guide-article" style={{ marginTop: "3rem" }}>
          <h2 className="guide-h2">What the five limbs of the panchang mean</h2>
          <p className="guide-p">
            <b>Tithi (तिथि)</b> — the lunar day, defined by the Moon moving 12° ahead of the Sun.
            Thirty tithis make a lunar month across two pakshas: Shukla (waxing) and Krishna
            (waning). Fasts, festivals and shraddha dates all follow the tithi, not the English date.
          </p>
          <p className="guide-p">
            <b>Vara (वार)</b> — the weekday, ruled by one of the seven classical planets. The vara
            changes at <i>sunrise</i>, not midnight — which is why a panchang for the early hours
            of the morning shows the previous day's vara.
          </p>
          <p className="guide-p">
            <b>Nakshatra (नक्षत्र)</b> — the 27-fold division of the zodiac the Moon occupies. The
            day's nakshatra colours everything begun in it; it is also the basis of the muhurta
            system and of matching (the birth nakshatra is set by this same calculation).
          </p>
          <p className="guide-p">
            <b>Yoga (योग)</b> — one of 27 Sun-Moon combinations, each auspicious or otherwise for
            specific activities. <b>Karana (करण)</b> — half a tithi; eleven karanas cycle through
            the month, and a few (like Vishti/Bhadra) are avoided for new beginnings.
          </p>

          <h2 className="guide-h2">Rahu Kaal, Gulika Kaal and Yamaganda</h2>
          <p className="guide-p">
            Each day carries three inauspicious windows whose timing depends on sunrise, sunset
            and the weekday: <b>Rahu Kaal</b> (avoid starting anything important),
            <b> Gulika Kaal</b> and <b>Yamaganda</b> (avoid journeys and new ventures). Because
            they are fractions of the actual day-length, they differ city to city — a Delhi Rahu
            Kaal is not a Mumbai Rahu Kaal. The calculator above computes them for your location.
          </p>

          <h2 className="guide-h2">Common questions</h2>
          <div className="faq-list" style={{ marginBottom: "2rem" }}>
            {FAQS.map((f, i) => (
              <details key={i} className="faq-item">
                <summary className="faq-q">
                  <span>{f.q}</span>
                  <span className="faq-chevron" aria-hidden="true">›</span>
                </summary>
                <div className="faq-a">{f.a}</div>
              </details>
            ))}
          </div>

          <p className="guide-p" style={{ textAlign: "center" }}>
            Learn more: <Link href="/guides/what-is-kundli">What is a Kundli?</Link> ·{" "}
            <Link href="/guides/birth-time-missing-astrology">No birth time? What astrology can still tell you</Link>
          </p>
        </article>
      </div>
    </section>
  );
}
