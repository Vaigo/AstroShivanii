/**
 * Year-dated muhurta SEO pages (/muhurta/[slug]) — the page catalog plus the
 * build-time fetcher that pulls REAL computed dates from the GrahaAPI generic
 * finder (POST /v1/muhurta/find, textbook panchang rules, 60-day range cap).
 *
 * These pages are honest by design: they carry generic panchang-based dates
 * (nakshatra + tithi + choghadiya for Delhi sunrise) and say so, with the
 * ₹51 personal tool as the "checked against YOUR chart" upgrade. The deploy
 * workflow rebuilds on the 1st and 15th so the lists never go stale.
 */

export interface MuhurtaPageDef {
  slug: string;
  purpose: string; // API purpose value
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
    hiTitle: "वाहन खरीदने का शुभ मुहूर्त 2026",
    enTitle: "Vehicle Purchase Muhurat 2026 — Shubh Dates for Car & Bike",
    hiHook: "गाड़ी या बाइक की डिलीवरी के लिए नक्षत्र-तिथि से जांचे हुए शुभ दिन, हर दिन के शुभ चौघड़िया समय के साथ।",
    description:
      "Shubh muhurat 2026 for buying a car or bike: real computed auspicious dates (nakshatra + tithi checked) with each day's good choghadiya hours. Updated twice a month.",
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
    hiTitle: "गृह प्रवेश मुहूर्त 2026",
    enTitle: "Griha Pravesh Muhurat 2026 — Auspicious Dates for Housewarming",
    hiHook: "नए घर में प्रवेश के लिए नक्षत्र-तिथि से जांचे शुभ दिन — हर दिन के शुभ समय सहित।",
    description:
      "Griha Pravesh muhurat 2026: computed auspicious housewarming dates (nakshatra + tithi screened) with each day's good hours. Astronomical calculation, updated twice a month.",
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
    hiTitle: "विवाह मुहूर्त 2026",
    enTitle: "Vivah (Marriage) Muhurat 2026 — Shubh Wedding Dates",
    hiHook: "शादी की तारीख तय करने से पहले — नक्षत्र-तिथि से जांचे हुए शुभ विवाह-दिन।",
    description:
      "Vivah muhurat 2026: computed shubh wedding dates (nakshatra + tithi screened, Lahiri ayanamsa) with each day's good hours. Updated twice a month.",
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
    hiTitle: "संपत्ति व भूमि खरीदने का शुभ मुहूर्त 2026",
    enTitle: "Property Purchase Muhurat 2026 — Shubh Dates for Land & Home",
    hiHook: "प्लॉट, फ्लैट या ज़मीन की रजिस्ट्री के लिए जांचे हुए शुभ दिन।",
    description:
      "Property and land purchase muhurat 2026: computed auspicious registry dates (nakshatra + tithi screened) with good hours for each day. Updated twice a month.",
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

export function muhurtaPageBySlug(slug: string): MuhurtaPageDef | undefined {
  return MUHURTA_PAGES.find((p) => p.slug === slug);
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

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";
const KEY = process.env.NEXT_PUBLIC_API_KEY ?? process.env.NEXT_PUBLIC_API_TEST_KEY ?? "sk-test-dev";
// Delhi — the generic reference point; the page says so and points at the
// personal tool for city/chart-specific screening.
const REF = { lat: 28.6139, lon: 77.209, tz: 5.5 };

function isoPlus(base: Date, days: number): string {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Scan from tomorrow (build date) ~6 months ahead in ≤60-day chunks (the
 *  finder's range cap). Returns [] if the API is unreachable — the page then
 *  renders its explainer with an honest "list temporarily unavailable" note
 *  rather than failing the whole build. */
export async function fetchMuhurtaDates(purpose: string): Promise<FinderDate[]> {
  const today = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  const chunks: [string, string][] = [
    [isoPlus(today, 1), isoPlus(today, 60)],
    [isoPlus(today, 61), isoPlus(today, 120)],
    [isoPlus(today, 121), isoPlus(today, 180)],
  ];
  const all: FinderDate[] = [];
  for (const [from_date, to_date] of chunks) {
    try {
      const res = await fetch(`${BASE}/v1/muhurta/find`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${KEY}` },
        body: JSON.stringify({ from_date, to_date, purpose, ...REF }),
      });
      if (!res.ok) continue;
      const json = await res.json();
      if (json?.meta?.mode === "test") continue; // sample-chart data must never ship as real dates
      all.push(...(json?.data?.auspicious_times ?? []));
    } catch {
      // keep whatever chunks succeeded
    }
  }
  return all;
}
