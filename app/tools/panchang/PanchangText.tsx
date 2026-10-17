"use client";

import { useI18n } from "@/lib/i18n";

/** Heading + intro of the Panchang page, in the visitor's language. */
export function PanchangIntro() {
  const { lang } = useI18n();
  const isHi = lang === "hi";

  return (
    <>
      <h1 className={`section-heading${isHi ? " devanagari" : ""}`}>{isHi ? "आज का पंचांग" : "Today's Panchang"}</h1>
      <p className="section-heading-hi devanagari">
        {isHi ? "तिथि · वार · नक्षत्र · योग · करण · राहु काल" : "Tithi · Vara · Nakshatra · Yoga · Karana · Rahu Kaal"}
      </p>
      <div className="tool-explainer" style={{ textAlign: "center", marginBottom: "2rem" }}>
        <p className={isHi ? "devanagari" : undefined} style={{ fontWeight: 600, color: "var(--maroon)", marginBottom: "0.4rem" }}>
          {isHi
            ? "हर शुभ काम से पहले — एक नज़र आज के पंचांग पर। करोड़ों भारतीय घरों की सुबह की पहली आदत, अब आपके शहर के सटीक समय के साथ।"
            : "Before anything auspicious — a look at today's panchang. The first morning habit of crores of Indian homes, now with exact timings for your city."}
        </p>
        <p className={isHi ? "devanagari" : undefined}>
          {isHi
            ? "पंचांग दिन का वैदिक कैलेंडर है — समय के पाँच अंग, जो तय करते हैं कि कौन-सा काम कब शुरू करें। यह पंचांग आपके चुने हुए शहर और तारीख के लिए खगोलीय गणना (लाहिरी अयनांश) से बनता है, जिसमें राहु काल, चोघड़िया, होरा और अभिजीत मुहूर्त भी शामिल हैं।"
            : "The panchang is the Vedic calendar of the day — five limbs of time that decide when to begin what. This one is computed astronomically (Lahiri ayanamsa) for your chosen city and date, including Rahu Kaal, Choghadiya, Hora and Abhijit Muhurta."}
        </p>
      </div>
    </>
  );
}

/** The explainer article under the calculator, in the visitor's language. */
export function PanchangGuide() {
  const { lang } = useI18n();

  if (lang === "hi") {
    return (
      <>
        <h2 className="guide-h2 devanagari">पंचांग के पाँच अंगों का अर्थ</h2>
        <p className="guide-p devanagari">
          <b>तिथि</b> — चंद्र दिवस, यानी वह समय जिसमें चंद्रमा सूर्य से 12° आगे बढ़ता है। तीस तिथियाँ दो पक्षों — शुक्ल
          (बढ़ता चंद्रमा) और कृष्ण (घटता चंद्रमा) — में मिलकर एक चंद्र मास बनाती हैं। व्रत, त्योहार और श्राद्ध की तारीखें
          अंग्रेज़ी तारीख से नहीं, तिथि से तय होती हैं।
        </p>
        <p className="guide-p devanagari">
          <b>वार</b> — सप्ताह का दिन, जिसका स्वामी सात शास्त्रीय ग्रहों में से एक होता है। वार आधी रात को नहीं,{" "}
          <i>सूर्योदय</i> पर बदलता है — इसीलिए भोर से पहले के समय का पंचांग पिछले दिन का वार दिखाता है।
        </p>
        <p className="guide-p devanagari">
          <b>नक्षत्र</b> — राशिचक्र के 27 भागों में से वह भाग जिसमें चंद्रमा होता है। दिन का नक्षत्र उस दिन शुरू किए गए
          हर काम पर अपनी छाप छोड़ता है; मुहूर्त-पद्धति और गुण मिलान का आधार भी यही है (जन्म नक्षत्र इसी गणना से तय होता है)।
        </p>
        <p className="guide-p devanagari">
          <b>योग</b> — सूर्य-चंद्र के 27 संयोगों में से एक; हर योग कुछ कामों के लिए शुभ होता है, कुछ के लिए नहीं।{" "}
          <b>करण</b> — तिथि का आधा भाग; महीने भर में ग्यारह करण बारी-बारी आते हैं, और कुछ (जैसे विष्टि/भद्रा) में नई
          शुरुआत टाली जाती है।
        </p>

        <h2 className="guide-h2 devanagari">राहु काल, गुलिक काल और यमगण्ड</h2>
        <p className="guide-p devanagari">
          हर दिन तीन अशुभ समय-खंड होते हैं, जिनका समय सूर्योदय, सूर्यास्त और वार पर निर्भर करता है:{" "}
          <b>राहु काल</b> (कोई भी महत्वपूर्ण काम शुरू न करें), <b>गुलिक काल</b> और <b>यमगण्ड</b> (यात्रा और नए काम
          टालें)। ये वास्तविक दिनमान के हिस्से हैं, इसलिए हर शहर में अलग होते हैं — दिल्ली का राहु काल मुंबई का राहु काल
          नहीं है। ऊपर का कैलकुलेटर इन्हें आपके स्थान के लिए निकालता है।
        </p>
      </>
    );
  }

  return (
    <>
      <h2 className="guide-h2">What the five limbs of the panchang mean</h2>
      <p className="guide-p">
        <b>Tithi</b> — the lunar day, defined by the Moon moving 12° ahead of the Sun.
        Thirty tithis make a lunar month across two pakshas: Shukla (waxing) and Krishna
        (waning). Fasts, festivals and shraddha dates all follow the tithi, not the English date.
      </p>
      <p className="guide-p">
        <b>Vara</b> — the weekday, ruled by one of the seven classical planets. The vara
        changes at <i>sunrise</i>, not midnight — which is why a panchang for the early hours
        of the morning shows the previous day&apos;s vara.
      </p>
      <p className="guide-p">
        <b>Nakshatra</b> — the 27-fold division of the zodiac the Moon occupies. The
        day&apos;s nakshatra colours everything begun in it; it is also the basis of the muhurta
        system and of matching (the birth nakshatra is set by this same calculation).
      </p>
      <p className="guide-p">
        <b>Yoga</b> — one of 27 Sun-Moon combinations, each auspicious or otherwise for
        specific activities. <b>Karana</b> — half a tithi; eleven karanas cycle through
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
    </>
  );
}
