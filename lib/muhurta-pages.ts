/**
 * Year-dated muhurta SEO pages (/muhurta/[slug]) — the page catalog plus the
 * build-time fetcher that pulls REAL computed dates from the GrahaAPI generic
 * finder (POST /v1/muhurta/find, textbook panchang rules, 60-day range cap).
 *
 * These pages are honest by design: they carry generic panchang-based dates
 * (nakshatra + tithi + choghadiya for Delhi sunrise) and say so, with the
 * ₹51 personal tool as the "checked against YOUR chart" upgrade. The deploy
 * workflow rebuilds every night so the lists never go stale.
 *
 * Each page is scoped to one calendar year (`year`), not a rolling window —
 * fetchMuhurtaDates(purpose, year) bounds its query to [today, Dec 31 of
 * `year`] (or the full Jan 1 – Dec 31 span for a future year). This is what
 * keeps a "2026" page and a "2027" page from ever showing the same rows:
 * their date windows never overlap. Added 2026-09-05 (8 more "-2027" pages,
 * ahead of the October search-demand shift) — when 2026 fully lapses,
 * rename/redirect the "-2026" slugs forward a year, the same convention
 * already planned for /festivals (see LAUNCH.md §3S).
 */
import { BAKE_DATE, STRICT, bakeOr, buildPost } from "@/lib/build-api";
import { MONTHS_HI } from "@/lib/hi-date";

export interface MuhurtaPageDef {
  slug: string;
  purpose: string; // API purpose value
  year: number; // calendar year this page's date window is scoped to
  hiTitle: string; // H1
  enTitle: string; // <title>
  hiHook: string; // one-line hook under the H1
  description: string; // meta description
  faqs: { q: string; a: string }[];
}

export const MUHURTA_PAGES: MuhurtaPageDef[] = [
  {
    slug: "vahan-muhurat-2026",
    purpose: "vehicle_purchase",
    year: 2026,
    hiTitle: "वाहन खरीदने का शुभ मुहूर्त 2026",
    enTitle: "Vehicle Purchase Muhurat 2026 — Shubh Dates for Car & Bike",
    hiHook: "गाड़ी या बाइक की डिलीवरी के लिए नक्षत्र-तिथि से जांचे हुए शुभ दिन, हर दिन के शुभ चौघड़िया समय के साथ।",
    description:
      "Shubh muhurat 2026 for buying a car or bike: real computed auspicious dates (nakshatra + tithi checked) with each day's good choghadiya hours. Updated every night.",
    faqs: [
      {
        q: "वाहन खरीदने के लिए कौन से नक्षत्र शुभ माने जाते हैं?",
        a: "परम्परा में चर संज्ञक और लघु नक्षत्र — जैसे अश्विनी, पुष्य, हस्त, चित्रा, स्वाति, श्रवण, धनिष्ठा, रेवती — वाहन के लिए शुभ माने जाते हैं। नीचे की हर तारीख इसी नक्षत्र-जांच से निकली है।",
      },
      {
        q: "क्या डिलीवरी राहु काल में ले सकते हैं?",
        a: "परम्परा के अनुसार नहीं — शुभ तारीख पर भी राहु काल टालें। इसीलिए हर तारीख के साथ उस दिन के शुभ चौघड़िया समय दिए गए हैं — डिलीवरी उन्हीं में लेना सर्वोत्तम है।",
      },
      {
        q: "क्या ये तारीखें मेरी कुंडली के अनुसार भी शुभ होंगी?",
        a: "ये तारीखें सामान्य पंचांग-नियमों (नक्षत्र, तिथि, चौघड़िया) से हैं — सबके लिए एक जैसी। आपकी अपनी कुंडली से ताराबल, चंद्राष्टम और दशा की जांच के लिए शुभ मुहूर्त टूल इस्तेमाल करें।",
      },
    ],
  },
  {
    slug: "griha-pravesh-muhurat-2026",
    purpose: "griha_pravesh",
    year: 2026,
    hiTitle: "गृह प्रवेश मुहूर्त 2026",
    enTitle: "Griha Pravesh Muhurat 2026 — Auspicious Dates for Housewarming",
    hiHook: "नए घर में प्रवेश के लिए नक्षत्र-तिथि से जांचे शुभ दिन — हर दिन के शुभ समय सहित।",
    description:
      "Griha Pravesh muhurat 2026: computed auspicious housewarming dates (nakshatra + tithi screened) with each day's good hours. Astronomical calculation, updated every night.",
    faqs: [
      {
        q: "गृह प्रवेश के लिए कौन से महीने सर्वोत्तम माने जाते हैं?",
        a: "माघ, फाल्गुन, वैशाख और ज्येष्ठ परम्परागत रूप से सर्वोत्तम माने जाते हैं; चातुर्मास (देवशयनी से देवउठनी एकादशी) प्रायः टाला जाता है। नीचे की सूची में हर महीने की जांची हुई तारीखें हैं।",
      },
      {
        q: "गृह प्रवेश के दिन क्या करना चाहिए?",
        a: "शुभ समय (नीचे दिए चौघड़िया) में कलश और मंगल-प्रतीकों के साथ प्रवेश, गणेश पूजन, नवग्रह शांति और वास्तु पूजन की परम्परा है। पहली रात घर में रहना शुभ माना जाता है।",
      },
      {
        q: "क्या ये तारीखें मेरे परिवार की कुंडली से भी मेल खाएंगी?",
        a: "यह सूची सामान्य पंचांग-जांच से है। गृह-स्वामी की कुंडली से ताराबल-चंद्राष्टम जांच कर व्यक्तिगत तारीख निकालने के लिए शुभ मुहूर्त टूल देखें।",
      },
    ],
  },
  {
    slug: "vivah-muhurat-2026",
    purpose: "marriage",
    year: 2026,
    hiTitle: "विवाह मुहूर्त 2026",
    enTitle: "Vivah (Marriage) Muhurat 2026 — Shubh Wedding Dates",
    hiHook: "शादी की तारीख तय करने से पहले — नक्षत्र-तिथि से जांचे हुए शुभ विवाह-दिन।",
    description:
      "Vivah muhurat 2026: computed shubh wedding dates (nakshatra + tithi screened, Lahiri ayanamsa) with each day's good hours. Updated every night.",
    faqs: [
      {
        q: "विवाह के लिए कौन से महीने शुभ माने जाते हैं?",
        a: "मार्गशीर्ष, माघ, फाल्गुन, वैशाख और ज्येष्ठ श्रेष्ठ माने जाते हैं; आषाढ़ देवशयनी एकादशी तक ही। चातुर्मास, पौष और अधिक मास प्रायः टाले जाते हैं।",
      },
      {
        q: "क्या सिर्फ तारीख देखना काफी है?",
        a: "नहीं — विवाह में वर-वधू दोनों की कुंडली से ताराबल, चंद्रबल और दशा की जांच भी होती है। यह सूची पंचांग-स्तर की है; दोनों कुंडलियों से common शुभ तारीखें निकालने के लिए शुभ मुहूर्त टूल में विवाह विकल्प चुनें।",
      },
      {
        q: "ये तारीखें किस गणना से निकली हैं?",
        a: "हर तारीख वास्तविक खगोलीय गणना (लाहिरी अयनांश) से जांची गई है — विवाह-योग्य नक्षत्र और शुभ तिथि दोनों जिनमें मिलें वही दिन सूची में है, उस दिन के शुभ चौघड़िया समय के साथ।",
      },
    ],
  },
  {
    slug: "property-muhurat-2026",
    purpose: "property_purchase",
    year: 2026,
    hiTitle: "संपत्ति व भूमि खरीदने का शुभ मुहूर्त 2026",
    enTitle: "Property Purchase Muhurat 2026 — Shubh Dates for Land & Home",
    hiHook: "प्लॉट, फ्लैट या ज़मीन की रजिस्ट्री के लिए जांचे हुए शुभ दिन।",
    description:
      "Property and land purchase muhurat 2026: computed auspicious registry dates (nakshatra + tithi screened) with good hours for each day. Updated every night.",
    faqs: [
      {
        q: "रजिस्ट्री और गृह प्रवेश का मुहूर्त अलग-अलग क्यों?",
        a: "संपत्ति खरीद (रजिस्ट्री/बयाना) का कारक मंगल-सम्बन्धी परम्परा से देखा जाता है, जबकि गृह प्रवेश का मुहूर्त अलग नियमों से। दोनों के लिए अलग सूचियां हैं — गृह प्रवेश की तारीखें उसके अपने पेज पर देखें।",
      },
      {
        q: "क्या बयाना (token) भी शुभ दिन पर देना चाहिए?",
        a: "परम्परा में हां — पहला लेन-देन ही आरंभ माना जाता है। बयाना, एग्रीमेंट और रजिस्ट्री — जो भी पहला ठोस कदम हो, उसे नीचे दिए शुभ दिनों के शुभ समय में करना उत्तम है।",
      },
      {
        q: "क्या ये तारीखें मेरी कुंडली से जांची गई हैं?",
        a: "नहीं — यह सामान्य पंचांग-सूची है। अपनी कुंडली (चौथा भाव, ताराबल, दशा) से जांची व्यक्तिगत तारीखों के लिए शुभ मुहूर्त टूल इस्तेमाल करें।",
      },
    ],
  },
  {
    slug: "business-muhurat-2026",
    purpose: "business",
    year: 2026,
    hiTitle: "व्यापार आरंभ का शुभ मुहूर्त 2026",
    enTitle: "Business Opening Muhurat 2026 — Shubh Dates for New Ventures",
    hiHook: "दुकान, कंपनी या नए काम की शुरुआत के लिए जांचे हुए शुभ दिन।",
    description:
      "Business opening muhurat 2026: computed auspicious dates for launching a shop, company or venture — nakshatra + tithi screened, with each day's good hours.",
    faqs: [
      {
        q: "व्यापार आरंभ के लिए कौन से नक्षत्र शुभ हैं?",
        a: "अश्विनी, रोहिणी, पुष्य, हस्त, चित्रा, स्वाति, अनुराधा, श्रवण, रेवती जैसे नक्षत्र व्यापार के लिए श्रेष्ठ माने जाते हैं — पुष्य को विशेष स्थान प्राप्त है। नीचे की तारीखें इसी जांच से हैं।",
      },
      {
        q: "उद्घाटन किस समय करें?",
        a: "शुभ तारीख पर भी समय मायने रखता है — हर तारीख के साथ उस दिन के शुभ/अमृत चौघड़िया दिए गए हैं; उद्घाटन, पहली बिक्री या खाता-पूजन उन्हीं में करें। राहु काल हमेशा टालें।",
      },
      {
        q: "क्या पार्टनरशिप में दोनों की कुंडली देखनी चाहिए?",
        a: "उत्तम यही है। यह सूची सामान्य पंचांग-जांच से है; अपनी कुंडली से (और साझेदार की भी) जांची तारीखों के लिए शुभ मुहूर्त टूल देखें।",
      },
    ],
  },
  {
    slug: "naamkaran-muhurat-2026",
    purpose: "naamkaran",
    year: 2026,
    hiTitle: "नामकरण संस्कार मुहूर्त 2026",
    enTitle: "Naamkaran Muhurat 2026 — Auspicious Naming Ceremony Dates",
    hiHook: "शिशु के नामकरण संस्कार के लिए नक्षत्र-तिथि से जांचे शुभ दिन।",
    description:
      "Naamkaran (naming ceremony) muhurat 2026: computed auspicious dates with each day's good hours — nakshatra and tithi screened astronomically.",
    faqs: [
      {
        q: "नामकरण कब किया जाता है?",
        a: "परम्परा में जन्म के 11वें या 12वें दिन, अन्यथा किसी भी शुभ दिन। नीचे की सूची से अपनी सुविधा का शुभ दिन चुनें — उस दिन के शुभ समय साथ दिए हैं।",
      },
      {
        q: "नाम का पहला अक्षर कैसे चुनें?",
        a: "शिशु के जन्म-नक्षत्र के चरण से शुभ अक्षर निकलता है। हमारा निःशुल्क शुभ-अक्षर टूल जन्म-विवरण से सटीक अक्षर बताता है — नीचे लिंक दिया है।",
      },
      {
        q: "क्या ये तारीखें सभी शिशुओं के लिए एक जैसी हैं?",
        a: "हां — यह सामान्य पंचांग-सूची है। शिशु की अपनी कुंडली (जन्म-नक्षत्र, ताराबल) से जांची तारीख के लिए शुभ मुहूर्त टूल में नामकरण विकल्प चुनें।",
      },
    ],
  },
];

MUHURTA_PAGES.push(
  {
    slug: "yatra-muhurat-2026",
    purpose: "travel",
    year: 2026,
    hiTitle: "यात्रा का शुभ मुहूर्त 2026",
    enTitle: "Yatra (Travel) Muhurat 2026 — Auspicious Journey Dates",
    hiHook: "लंबी यात्रा, विदेश-प्रस्थान या तीर्थ के लिए नक्षत्र-तिथि से जांचे शुभ दिन।",
    description:
      "Yatra muhurat 2026: computed auspicious travel and journey dates (nakshatra + tithi screened) with each day's good hours. Updated every night.",
    faqs: [
      {
        q: "यात्रा के लिए कौन-से नक्षत्र शुभ माने जाते हैं?",
        a: "चर संज्ञक नक्षत्र — स्वाति, पुनर्वसु, श्रवण, धनिष्ठा, शतभिषा — यात्रा के लिए श्रेष्ठ माने जाते हैं; साथ में अश्विनी, मृगशिरा, पुष्य, हस्त, अनुराधा, रेवती भी शुभ। नीचे की हर तारीख इसी जांच से निकली है।",
      },
      {
        q: "क्या दिशा-शूल भी देखना चाहिए?",
        a: "हां — परम्परा में वार के अनुसार कुछ दिशाओं की यात्रा टाली जाती है (जैसे सोमवार-शनिवार को पूर्व, रविवार-शुक्रवार को पश्चिम)। यह सूची तारीख-स्तर की है; निकलने का समय उस दिन के शुभ चौघड़िया में रखें और राहु काल हमेशा टालें।",
      },
      {
        q: "क्या ये तारीखें मेरी कुंडली से जांची गई हैं?",
        a: "नहीं — यह सामान्य पंचांग-सूची है, सबके लिए एक जैसी। अपनी कुंडली से ताराबल-चंद्राष्टम जांचकर व्यक्तिगत यात्रा-तारीख के लिए शुभ मुहूर्त टूल में यात्रा विकल्प चुनें।",
      },
    ],
  },
  {
    slug: "vidyarambh-muhurat-2026",
    purpose: "education",
    year: 2026,
    hiTitle: "विद्यारंभ मुहूर्त 2026",
    enTitle: "Vidyarambh Muhurat 2026 — Auspicious Dates to Begin Education",
    hiHook: "बच्चे की पढ़ाई की शुरुआत, अक्षर-आरंभ या नए course के लिए जांचे शुभ दिन।",
    description:
      "Vidyarambh muhurat 2026: computed auspicious dates for beginning education, akshar-arambh or a new course — nakshatra and tithi screened astronomically.",
    faqs: [
      {
        q: "विद्यारंभ के लिए कौन-से नक्षत्र श्रेष्ठ हैं?",
        a: "बुध और गुरु से जुड़े नक्षत्र — अश्विनी, पुनर्वसु, पुष्य, हस्त, चित्रा, स्वाति, अनुराधा, श्रवण, रेवती — विद्यारंभ के लिए श्रेष्ठ माने जाते हैं। बसंत पंचमी परम्परा में सर्वोत्तम दिन है, पर पूरे वर्ष शुभ दिन मिलते हैं — सूची नीचे है।",
      },
      {
        q: "विद्यारंभ किस उम्र और किस समय करें?",
        a: "परम्परा में अक्षर-आरंभ प्रायः 3-5 वर्ष की आयु में होता है। दिन के शुभ चौघड़िया (अमृत/शुभ/लाभ) में, सरस्वती वंदना के साथ शुरुआत उत्तम मानी जाती है — हर तारीख के शुभ समय साथ दिए हैं।",
      },
      {
        q: "क्या बड़ों के नए course/परीक्षा-तैयारी के लिए भी यही तारीखें चलेंगी?",
        a: "हां — विद्यारंभ का नियम किसी भी विद्या की शुरुआत पर लागू होता है: नया course, coaching, संगीत-वाद्य, यहां तक कि नई skill भी। व्यक्तिगत (कुंडली-आधारित) तारीख के लिए शुभ मुहूर्त टूल में शिक्षा विकल्प चुनें।",
      },
    ],
  },
);

// 2027 — the full calendar year, added ahead of the October search-demand
// shift (couples/families planning a 2027 wedding or griha pravesh start
// searching months in advance). Same eight purposes, same FAQ substance
// (the classical rules don't change year to year) — only the year and the
// framing change; the date TABLE is what's actually different, since its
// window (Jan 1 – Dec 31, 2027) never overlaps the "-2026" pages' window.
MUHURTA_PAGES.push(
  {
    slug: "vahan-muhurat-2027",
    purpose: "vehicle_purchase",
    year: 2027,
    hiTitle: "वाहन खरीदने का शुभ मुहूर्त 2027",
    enTitle: "Vehicle Purchase Muhurat 2027 — Shubh Dates for Car & Bike",
    hiHook: "2027 में गाड़ी या बाइक की डिलीवरी के लिए नक्षत्र-तिथि से जांचे हुए शुभ दिन, हर दिन के शुभ चौघड़िया समय के साथ।",
    description:
      "Shubh muhurat 2027 for buying a car or bike: full-year computed auspicious dates (nakshatra + tithi checked) with each day's good choghadiya hours. Updated every night.",
    faqs: [
      {
        q: "वाहन खरीदने के लिए कौन से नक्षत्र शुभ माने जाते हैं?",
        a: "परम्परा में चर संज्ञक और लघु नक्षत्र — जैसे अश्विनी, पुष्य, हस्त, चित्रा, स्वाति, श्रवण, धनिष्ठा, रेवती — वाहन के लिए शुभ माने जाते हैं। 2027 की हर तारीख इसी नक्षत्र-जांच से निकली है।",
      },
      {
        q: "क्या डिलीवरी राहु काल में ले सकते हैं?",
        a: "परम्परा के अनुसार नहीं — शुभ तारीख पर भी राहु काल टालें। इसीलिए हर तारीख के साथ उस दिन के शुभ चौघड़िया समय दिए गए हैं — डिलीवरी उन्हीं में लेना सर्वोत्तम है।",
      },
      {
        q: "क्या ये तारीखें मेरी कुंडली के अनुसार भी शुभ होंगी?",
        a: "ये तारीखें सामान्य पंचांग-नियमों (नक्षत्र, तिथि, चौघड़िया) से हैं — सबके लिए एक जैसी। आपकी अपनी कुंडली से ताराबल, चंद्राष्टम और दशा की जांच के लिए शुभ मुहूर्त टूल इस्तेमाल करें।",
      },
    ],
  },
  {
    slug: "griha-pravesh-muhurat-2027",
    purpose: "griha_pravesh",
    year: 2027,
    hiTitle: "गृह प्रवेश मुहूर्त 2027",
    enTitle: "Griha Pravesh Muhurat 2027 — Auspicious Dates for Housewarming",
    hiHook: "2027 में नए घर में प्रवेश के लिए नक्षत्र-तिथि से जांचे शुभ दिन — साल भर की सूची, हर दिन के शुभ समय सहित।",
    description:
      "Griha Pravesh muhurat 2027: full-year computed auspicious housewarming dates (nakshatra + tithi screened) with each day's good hours. Astronomical calculation, updated every night.",
    faqs: [
      {
        q: "गृह प्रवेश के लिए कौन से महीने सर्वोत्तम माने जाते हैं?",
        a: "माघ, फाल्गुन, वैशाख और ज्येष्ठ परम्परागत रूप से सर्वोत्तम माने जाते हैं; चातुर्मास (देवशयनी से देवउठनी एकादशी) प्रायः टाला जाता है। नीचे 2027 के हर महीने की जांची हुई तारीखें हैं।",
      },
      {
        q: "गृह प्रवेश के दिन क्या करना चाहिए?",
        a: "शुभ समय (नीचे दिए चौघड़िया) में कलश और मंगल-प्रतीकों के साथ प्रवेश, गणेश पूजन, नवग्रह शांति और वास्तु पूजन की परम्परा है। पहली रात घर में रहना शुभ माना जाता है।",
      },
      {
        q: "क्या ये तारीखें मेरे परिवार की कुंडली से भी मेल खाएंगी?",
        a: "यह सूची सामान्य पंचांग-जांच से है। गृह-स्वामी की कुंडली से ताराबल-चंद्राष्टम जांच कर व्यक्तिगत तारीख निकालने के लिए शुभ मुहूर्त टूल देखें।",
      },
    ],
  },
  {
    slug: "vivah-muhurat-2027",
    purpose: "marriage",
    year: 2027,
    hiTitle: "विवाह मुहूर्त 2027",
    enTitle: "Vivah (Marriage) Muhurat 2027 — Shubh Wedding Dates",
    hiHook: "2027 की शादी की तारीख तय करने से पहले — नक्षत्र-तिथि से जांचे हुए साल भर के शुभ विवाह-दिन।",
    description:
      "Vivah muhurat 2027: full-year computed shubh wedding dates (nakshatra + tithi screened, Lahiri ayanamsa) with each day's good hours. Updated every night.",
    faqs: [
      {
        q: "विवाह के लिए कौन से महीने शुभ माने जाते हैं?",
        a: "मार्गशीर्ष, माघ, फाल्गुन, वैशाख और ज्येष्ठ श्रेष्ठ माने जाते हैं; आषाढ़ देवशयनी एकादशी तक ही। चातुर्मास, पौष और अधिक मास प्रायः टाले जाते हैं — 2027 में भी यही नियम लागू है।",
      },
      {
        q: "क्या सिर्फ तारीख देखना काफी है?",
        a: "नहीं — विवाह में वर-वधू दोनों की कुंडली से ताराबल, चंद्रबल और दशा की जांच भी होती है। यह सूची पंचांग-स्तर की है; दोनों कुंडलियों से common शुभ तारीखें निकालने के लिए शुभ मुहूर्त टूल में विवाह विकल्प चुनें।",
      },
      {
        q: "क्या इतनी जल्दी 2027 की तारीखें निकल सकती हैं?",
        a: "हां — पंचांग गणना खगोलीय है (लाहिरी अयनांश), किसी छपे कैलेंडर पर निर्भर नहीं। इसलिए 2027 की पूरी साल की तारीखें अभी से उतनी ही सटीक हैं जितनी नज़दीकी महीने की।",
      },
    ],
  },
  {
    slug: "property-muhurat-2027",
    purpose: "property_purchase",
    year: 2027,
    hiTitle: "संपत्ति व भूमि खरीदने का शुभ मुहूर्त 2027",
    enTitle: "Property Purchase Muhurat 2027 — Shubh Dates for Land & Home",
    hiHook: "2027 में प्लॉट, फ्लैट या ज़मीन की रजिस्ट्री के लिए जांचे हुए साल भर के शुभ दिन।",
    description:
      "Property and land purchase muhurat 2027: full-year computed auspicious registry dates (nakshatra + tithi screened) with good hours for each day. Updated every night.",
    faqs: [
      {
        q: "रजिस्ट्री और गृह प्रवेश का मुहूर्त अलग-अलग क्यों?",
        a: "संपत्ति खरीद (रजिस्ट्री/बयाना) का कारक मंगल-सम्बन्धी परम्परा से देखा जाता है, जबकि गृह प्रवेश का मुहूर्त अलग नियमों से। दोनों के लिए अलग सूचियां हैं — गृह प्रवेश की तारीखें उसके अपने पेज पर देखें।",
      },
      {
        q: "क्या बयाना (token) भी शुभ दिन पर देना चाहिए?",
        a: "परम्परा में हां — पहला लेन-देन ही आरंभ माना जाता है। बयाना, एग्रीमेंट और रजिस्ट्री — जो भी पहला ठोस कदम हो, उसे नीचे दिए शुभ दिनों के शुभ समय में करना उत्तम है।",
      },
      {
        q: "क्या ये तारीखें मेरी कुंडली से जांची गई हैं?",
        a: "नहीं — यह सामान्य पंचांग-सूची है। अपनी कुंडली (चौथा भाव, ताराबल, दशा) से जांची व्यक्तिगत तारीखों के लिए शुभ मुहूर्त टूल इस्तेमाल करें।",
      },
    ],
  },
  {
    slug: "business-muhurat-2027",
    purpose: "business",
    year: 2027,
    hiTitle: "व्यापार आरंभ का शुभ मुहूर्त 2027",
    enTitle: "Business Opening Muhurat 2027 — Shubh Dates for New Ventures",
    hiHook: "2027 में दुकान, कंपनी या नए काम की शुरुआत के लिए जांचे हुए साल भर के शुभ दिन।",
    description:
      "Business opening muhurat 2027: full-year computed auspicious dates for launching a shop, company or venture — nakshatra + tithi screened, with each day's good hours.",
    faqs: [
      {
        q: "व्यापार आरंभ के लिए कौन से नक्षत्र शुभ हैं?",
        a: "अश्विनी, रोहिणी, पुष्य, हस्त, चित्रा, स्वाति, अनुराधा, श्रवण, रेवती जैसे नक्षत्र व्यापार के लिए श्रेष्ठ माने जाते हैं — पुष्य को विशेष स्थान प्राप्त है। नीचे 2027 की तारीखें इसी जांच से हैं।",
      },
      {
        q: "उद्घाटन किस समय करें?",
        a: "शुभ तारीख पर भी समय मायने रखता है — हर तारीख के साथ उस दिन के शुभ/अमृत चौघड़िया दिए गए हैं; उद्घाटन, पहली बिक्री या खाता-पूजन उन्हीं में करें। राहु काल हमेशा टालें।",
      },
      {
        q: "क्या पार्टनरशिप में दोनों की कुंडली देखनी चाहिए?",
        a: "उत्तम यही है। यह सूची सामान्य पंचांग-जांच से है; अपनी कुंडली से (और साझेदार की भी) जांची तारीखों के लिए शुभ मुहूर्त टूल देखें।",
      },
    ],
  },
  {
    slug: "naamkaran-muhurat-2027",
    purpose: "naamkaran",
    year: 2027,
    hiTitle: "नामकरण संस्कार मुहूर्त 2027",
    enTitle: "Naamkaran Muhurat 2027 — Auspicious Naming Ceremony Dates",
    hiHook: "2027 में शिशु के नामकरण संस्कार के लिए नक्षत्र-तिथि से जांचे साल भर के शुभ दिन।",
    description:
      "Naamkaran (naming ceremony) muhurat 2027: full-year computed auspicious dates with each day's good hours — nakshatra and tithi screened astronomically.",
    faqs: [
      {
        q: "नामकरण कब किया जाता है?",
        a: "परम्परा में जन्म के 11वें या 12वें दिन, अन्यथा किसी भी शुभ दिन। नीचे की सूची से अपनी सुविधा का शुभ दिन चुनें — उस दिन के शुभ समय साथ दिए हैं।",
      },
      {
        q: "नाम का पहला अक्षर कैसे चुनें?",
        a: "शिशु के जन्म-नक्षत्र के चरण से शुभ अक्षर निकलता है। हमारा निःशुल्क शुभ-अक्षर टूल जन्म-विवरण से सटीक अक्षर बताता है — नीचे लिंक दिया है।",
      },
      {
        q: "क्या ये तारीखें सभी शिशुओं के लिए एक जैसी हैं?",
        a: "हां — यह सामान्य पंचांग-सूची है। शिशु की अपनी कुंडली (जन्म-नक्षत्र, ताराबल) से जांची तारीख के लिए शुभ मुहूर्त टूल में नामकरण विकल्प चुनें।",
      },
    ],
  },
  {
    slug: "yatra-muhurat-2027",
    purpose: "travel",
    year: 2027,
    hiTitle: "यात्रा का शुभ मुहूर्त 2027",
    enTitle: "Yatra (Travel) Muhurat 2027 — Auspicious Journey Dates",
    hiHook: "2027 में लंबी यात्रा, विदेश-प्रस्थान या तीर्थ के लिए नक्षत्र-तिथि से जांचे साल भर के शुभ दिन।",
    description:
      "Yatra muhurat 2027: full-year computed auspicious travel and journey dates (nakshatra + tithi screened) with each day's good hours. Updated every night.",
    faqs: [
      {
        q: "यात्रा के लिए कौन-से नक्षत्र शुभ माने जाते हैं?",
        a: "चर संज्ञक नक्षत्र — स्वाति, पुनर्वसु, श्रवण, धनिष्ठा, शतभिषा — यात्रा के लिए श्रेष्ठ माने जाते हैं; साथ में अश्विनी, मृगशिरा, पुष्य, हस्त, अनुराधा, रेवती भी शुभ। नीचे 2027 की हर तारीख इसी जांच से निकली है।",
      },
      {
        q: "क्या दिशा-शूल भी देखना चाहिए?",
        a: "हां — परम्परा में वार के अनुसार कुछ दिशाओं की यात्रा टाली जाती है (जैसे सोमवार-शनिवार को पूर्व, रविवार-शुक्रवार को पश्चिम)। यह सूची तारीख-स्तर की है; निकलने का समय उस दिन के शुभ चौघड़िया में रखें और राहु काल हमेशा टालें।",
      },
      {
        q: "क्या ये तारीखें मेरी कुंडली से जांची गई हैं?",
        a: "नहीं — यह सामान्य पंचांग-सूची है, सबके लिए एक जैसी। अपनी कुंडली से ताराबल-चंद्राष्टम जांचकर व्यक्तिगत यात्रा-तारीख के लिए शुभ मुहूर्त टूल में यात्रा विकल्प चुनें।",
      },
    ],
  },
  {
    slug: "vidyarambh-muhurat-2027",
    purpose: "education",
    year: 2027,
    hiTitle: "विद्यारंभ मुहूर्त 2027",
    enTitle: "Vidyarambh Muhurat 2027 — Auspicious Dates to Begin Education",
    hiHook: "2027 में बच्चे की पढ़ाई की शुरुआत, अक्षर-आरंभ या नए course के लिए जांचे साल भर के शुभ दिन।",
    description:
      "Vidyarambh muhurat 2027: full-year computed auspicious dates for beginning education, akshar-arambh or a new course — nakshatra and tithi screened astronomically.",
    faqs: [
      {
        q: "विद्यारंभ के लिए कौन-से नक्षत्र श्रेष्ठ हैं?",
        a: "बुध और गुरु से जुड़े नक्षत्र — अश्विनी, पुनर्वसु, पुष्य, हस्त, चित्रा, स्वाति, अनुराधा, श्रवण, रेवती — विद्यारंभ के लिए श्रेष्ठ माने जाते हैं। बसंत पंचमी परम्परा में सर्वोत्तम दिन है, पर 2027 में भी पूरे वर्ष शुभ दिन मिलते हैं — सूची नीचे है।",
      },
      {
        q: "विद्यारंभ किस उम्र और किस समय करें?",
        a: "परम्परा में अक्षर-आरंभ प्रायः 3-5 वर्ष की आयु में होता है। दिन के शुभ चौघड़िया (अमृत/शुभ/लाभ) में, सरस्वती वंदना के साथ शुरुआत उत्तम मानी जाती है — हर तारीख के शुभ समय साथ दिए हैं।",
      },
      {
        q: "क्या बड़ों के नए course/परीक्षा-तैयारी के लिए भी यही तारीखें चलेंगी?",
        a: "हां — विद्यारंभ का नियम किसी भी विद्या की शुरुआत पर लागू होता है: नया course, coaching, संगीत-वाद्य, यहां तक कि नई skill भी। व्यक्तिगत (कुंडली-आधारित) तारीख के लिए शुभ मुहूर्त टूल में शिक्षा विकल्प चुनें।",
      },
    ],
  },
);

export function muhurtaPageBySlug(slug: string): MuhurtaPageDef | undefined {
  return MUHURTA_PAGES.find((p) => p.slug === slug);
}

// ── Search wording ────────────────────────────────────────────────────────────
// Search Console (Oct 2026): most muhurta clicks come from Hinglish, month-specific queries —
// "gadi lene ka shubh muhurat october 2026", "bike lene ka shubh muhurat" — while these pages were titled
// and described in English ("Vehicle Purchase Muhurat"). The Hindi heading keeps the exact phrase that
// already ranks; the romanised phrase people type, and the Latin month names, are added after it.
export const PURPOSE_COPY: Record<string, { hi: string; roman: string; en: string }> = {
  vehicle_purchase: { hi: "गाड़ी या बाइक लेने का शुभ मुहूर्त", roman: "Gadi Lene Ka Shubh Muhurat", en: "vehicle purchase muhurat" },
  griha_pravesh: { hi: "गृह प्रवेश का शुभ मुहूर्त", roman: "Griha Pravesh Shubh Muhurat", en: "housewarming muhurat" },
  marriage: { hi: "शादी-विवाह का शुभ मुहूर्त", roman: "Vivah Muhurat, Shadi Ka Shubh Muhurat", en: "wedding dates" },
  property_purchase: { hi: "ज़मीन, प्लॉट या मकान खरीदने का शुभ मुहूर्त", roman: "Plot Kharidne Ka Muhurat", en: "property purchase muhurat" },
  business: { hi: "दुकान या व्यापार शुरू करने का शुभ मुहूर्त", roman: "Dukan Kholne Ka Muhurat", en: "business opening muhurat" },
  naamkaran: { hi: "नामकरण संस्कार का शुभ मुहूर्त", roman: "Naamkaran Muhurat", en: "naming ceremony muhurat" },
  travel: { hi: "यात्रा का शुभ मुहूर्त", roman: "Yatra Muhurat", en: "travel muhurat" },
  education: { hi: "विद्यारंभ का शुभ मुहूर्त", roman: "Vidyarambh Muhurat", en: "education start muhurat" },
};

/** Wedding and housewarming lists still contain dates inside Chaturmas / Kharmas, which these pages' own FAQ
 *  says are avoided (open question for Shivanii, LAUNCH.md P3-S17). Until the finder screens them, those
 *  two page types make no "these are the shubh days of <months>" claim in the description and do not
 *  highlight upcoming dates at the top. */
export const SEASONAL_CAUTION = new Set(["marriage", "griha_pravesh"]);

export { MONTHS_HI };
const MONTHS_EN = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const monthOf = (d: string) => Number(d.split("-")[1]) - 1;

/** "अक्टूबर" or "अक्टूबर–दिसंबर" — the months the list actually covers. */
export function monthRangeHi(dates: { date: string }[]): string {
  const first = MONTHS_HI[monthOf(dates[0].date)];
  const last = MONTHS_HI[monthOf(dates[dates.length - 1].date)];
  return first === last ? first : `${first}–${last}`;
}

/** "November–December 2026" — the Latin month names people type next to the year. */
export function monthRangeEn(dates: { date: string }[]): string {
  const first = MONTHS_EN[monthOf(dates[0].date)];
  const last = MONTHS_EN[monthOf(dates[dates.length - 1].date)];
  const year = dates[0].date.slice(0, 4);
  return first === last ? `${first} ${year}` : `${first}–${last} ${year}`;
}

/** <title>: the Hindi heading people already find, then the Hinglish phrase they type. The year is repeated
 *  in the Hinglish half when the Hindi half is short enough to leave room, so a -2026 and a -2027 page
 *  do not look identical to a year-less query. */
export function muhurtaTitle(def: MuhurtaPageDef): string {
  const roman = PURPOSE_COPY[def.purpose]?.roman ?? def.enTitle.split(" — ")[0];
  return `${def.hiTitle} — ${roman}${def.hiTitle.length <= 34 ? ` ${def.year}` : ""}`;
}

/** Meta description built from the dates this page really lists (so it names the right months), ending in
 *  the Latin month names. Falls back to the hand-written English one if the finder returned nothing. */
export function muhurtaDescription(def: MuhurtaPageDef, dates: { date: string }[]): string {
  const copy = PURPOSE_COPY[def.purpose];
  if (!copy || dates.length === 0) return def.description;
  if (SEASONAL_CAUTION.has(def.purpose)) {
    const what = def.purpose === "marriage" ? "शादी-विवाह" : "गृह प्रवेश";
    return `${what} की पंचांग-जांची तारीखें ${def.year} — नक्षत्र, तिथि, चौघड़िया सहित। चातुर्मास व खरमास के दिन अलग से देखें। ${copy.roman.split(", ").pop()} ${def.year}.`;
  }
  const head = `${copy.hi} ${def.year}: ${monthRangeHi(dates)} के शुभ दिन — नक्षत्र, तिथि, चौघड़िया सहित।`;
  const full = `${head} ${copy.roman}, ${monthRangeEn(dates)}.`;
  return full.length <= 158 ? full : `${head} ${monthRangeEn(dates)}.`;
}

// ── Build-time date fetching ──────────────────────────────────────────────────

export interface FinderDate {
  date: string;
  weekday: string;
  nakshatra: string;
  tithi: string;
  paksha: string;
  quality: string;
  auspicious_slots: { choghadiya: string; start: string; end: string }[];
}

// Delhi — the generic reference point; the page says so and points at the
// personal tool for city/chart-specific screening.
const REF = { lat: 28.6139, lon: 77.209, tz: 5.5 };

function addDays(base: Date, days: number): Date {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
}

function isoDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Split [start, end] into ≤60-day windows (the finder's per-call range cap). */
function chunkRange(start: Date, end: Date): [string, string][] {
  const chunks: [string, string][] = [];
  let cur = start;
  while (cur <= end) {
    const chunkEnd = addDays(cur, 59) < end ? addDays(cur, 59) : end;
    chunks.push([isoDate(cur), isoDate(chunkEnd)]);
    cur = addDays(chunkEnd, 1);
  }
  return chunks;
}

const datesCache = new Map<string, Promise<FinderDate[]>>();

/** One fetch per (purpose, year) per build process: generateMetadata (title/description name the real
 *  months) and the page body both need the dates, and the finder is a POST that Next does not dedupe. */
export function fetchMuhurtaDates(purpose: string, year: number): Promise<FinderDate[]> {
  const key = `${purpose}:${year}`;
  let p = datesCache.get(key);
  if (!p) {
    // under the build's deadline and strict mode (lib/build-api.ts): a nightly build whose list would be
    // missing months fails instead of deploying a shorter list
    p = bakeOr(`muhurta ${purpose} ${year}`, () => fetchMuhurtaDatesUncached(purpose, year), [] as FinderDate[]).then((r) => {
      if (r.length === 0) datesCache.delete(key); // a failed fetch must not stick for the life of a dev server
      return r;
    });
    datesCache.set(key, p);
  }
  return p;
}

/** Scan ONE calendar year for auspicious dates — [max(today, Jan 1 of
 *  `year`), Dec 31 of `year`] (today = India's date for this build; the
 *  browser hides rows once their day has passed), chunked in ≤60-day
 *  windows. Bounding to the
 *  named year (not a rolling "next N months" window) is what keeps the
 *  "-2026" and "-2027" pages honest and non-overlapping: a "2026" page never
 *  shows a 2027 date, and vice versa. Returns [] once `year` has fully
 *  lapsed, or if the API is unreachable — the page then renders its
 *  explainer with an honest "list temporarily unavailable" note rather than
 *  failing the whole build. */
async function fetchMuhurtaDatesUncached(purpose: string, year: number): Promise<FinderDate[]> {
  const [ty, tm, td] = BAKE_DATE.split("-").map(Number);
  const today = new Date(ty, tm - 1, td); // India's date for this build, as a local calendar date
  const jan1 = new Date(year, 0, 1);
  const dec31 = new Date(year, 11, 31);
  // today itself counts: the list is built just after midnight IST, and the page's "upcoming dates" block
  // and table must include the day it is being read on (the browser hides a row only once its day is past)
  const start = today > jan1 ? today : jan1;
  if (start > dec31) return [];
  const all: FinderDate[] = [];
  for (const [from_date, to_date] of chunkRange(start, dec31)) {
    try {
      // test-mode (sample-chart) answers are refused by buildPost: they must never ship as real dates
      const data = await buildPost<{ auspicious_times?: FinderDate[] }>("/v1/muhurta/find", { from_date, to_date, purpose, ...REF });
      all.push(...(data.auspicious_times ?? []));
    } catch (e) {
      // the nightly (strict) build must not publish a list with a month missing; any other build keeps the
      // chunks that did succeed, and says so
      if (STRICT) throw e;
      console.warn(`[bake] muhurta ${purpose} ${from_date}..${to_date}: ${e instanceof Error ? e.message : String(e)} (chunk skipped)`);
    }
  }
  return all;
}
