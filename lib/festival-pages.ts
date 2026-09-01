/**
 * Per-festival SEO pages (/festivals/[slug]) — "करवा चौथ 2026 कब है" class
 * queries. Dates are NOT hand-typed: at build time each slug is matched
 * against the computed festival calendar (the same /v1/panchang/festivals
 * data the /festivals-2026 page uses), and that day's auspicious choghadiya
 * slots are fetched for the "पूजा कब करें" section. The deploy cron
 * (1st/15th) keeps everything fresh without human edits.
 */

export interface FestivalPageDef {
  slug: string;
  /** substring matched against the API festival `name` (en) */
  match: string;
  hi: string;
  en: string;
  /** 2-3 sentence significance, Hindi */
  intro: string;
  /** what is traditionally done on the day, Hindi */
  vidhi: string;
}

export const FESTIVAL_PAGES: FestivalPageDef[] = [
  {
    slug: "krishna-janmashtami-2026",
    match: "Krishna Janmashtami",
    hi: "कृष्ण जन्माष्टमी",
    en: "Krishna Janmashtami 2026",
    intro:
      "भाद्रपद कृष्ण अष्टमी को भगवान श्रीकृष्ण का जन्मोत्सव मनाया जाता है। रोहिणी नक्षत्र से युक्त अष्टमी विशेष फलदायी मानी जाती है — व्रत, रात्रि-जागरण और मध्यरात्रि के जन्म-क्षण की पूजा इस पर्व का केंद्र हैं।",
    vidhi:
      "दिन भर व्रत, शाम को झांकी-श्रृंगार, मध्यरात्रि (निशीथ काल) में जन्मोत्सव — पंचामृत अभिषेक, माखन-मिश्री भोग और आरती। अगले दिन दही-हांडी की परम्परा है।",
  },
  {
    slug: "hartalika-teej-2026",
    match: "Hartalika Teej",
    hi: "हरतालिका तीज",
    en: "Hartalika Teej 2026",
    intro:
      "भाद्रपद शुक्ल तृतीया को हरतालिका तीज मनाई जाती है — माता पार्वती की शिव-प्राप्ति की तपस्या का पर्व। सुहागिनें पति की दीर्घायु और कुंवारी कन्याएं उत्तम वर की कामना से निर्जला व्रत रखती हैं।",
    vidhi:
      "निर्जला व्रत, बालू या मिट्टी से शिव-पार्वती-गणेश की प्रतिमा बनाकर पूजन, रात्रि-जागरण और कथा-श्रवण। अगले दिन पारण के बाद व्रत पूर्ण होता है।",
  },
  {
    slug: "ganesh-chaturthi-2026",
    match: "Ganesh Chaturthi",
    hi: "गणेश चतुर्थी",
    en: "Ganesh Chaturthi 2026",
    intro:
      "भाद्रपद शुक्ल चतुर्थी को गणपति बप्पा की स्थापना होती है — विघ्नहर्ता के जन्मदिवस का यह उत्सव 10 दिन चलकर अनंत चतुर्दशी के विसर्जन पर पूर्ण होता है।",
    vidhi:
      "शुभ मुहूर्त में गणेश-प्रतिमा की स्थापना, प्राण-प्रतिष्ठा, 21 दूर्वा व मोदक का भोग। परम्परा में इस दिन चंद्र-दर्शन टाला जाता है।",
  },
  {
    slug: "navratri-2026",
    match: "Sharadiya Navratri",
    hi: "शारदीय नवरात्रि",
    en: "Sharadiya Navratri 2026",
    intro:
      "आश्विन शुक्ल प्रतिपदा से नौ दिनों तक मां दुर्गा के नौ रूपों की उपासना — शारदीय नवरात्रि वर्ष की सबसे बड़ी देवी-आराधना है, जो विजयादशमी (दशहरा) पर पूर्ण होती है।",
    vidhi:
      "पहले दिन शुभ मुहूर्त में कलश-स्थापना (घट-स्थापना), नौ दिन व्रत-उपासना, अष्टमी-नवमी पर कन्या पूजन। कलश-स्थापना प्रतिपदा के शुभ चौघड़िया या अभिजीत मुहूर्त में सर्वोत्तम मानी जाती है।",
  },
  {
    slug: "dussehra-2026",
    match: "Dussehra",
    hi: "दशहरा (विजयादशमी)",
    en: "Dussehra / Vijayadashami 2026",
    intro:
      "आश्विन शुक्ल दशमी — अधर्म पर धर्म की विजय का पर्व। श्रीराम की रावण पर और मां दुर्गा की महिषासुर पर विजय इसी दिन मानी जाती है। विजय मुहूर्त में शुरू किया काम विशेष सफल माना जाता है।",
    vidhi:
      "शस्त्र/उपकरण पूजन (आयुध पूजा), शमी वृक्ष पूजन, अपराजिता पूजा और रावण-दहन। दोपहर का 'विजय मुहूर्त' नए काम की शुरुआत के लिए वर्ष के श्रेष्ठ मुहूर्तों में गिना जाता है।",
  },
  {
    slug: "sharad-purnima-2026",
    match: "Sharad Purnima",
    hi: "शरद पूर्णिमा",
    en: "Sharad Purnima 2026",
    intro:
      "आश्विन पूर्णिमा — वर्ष की वह रात जब चंद्रमा सोलह कलाओं से पूर्ण होकर अमृत-वर्षा करता है, ऐसी मान्यता है। कोजागरी लक्ष्मी पूजन की रात भी यही है।",
    vidhi:
      "रात्रि में खीर बनाकर चांदनी में रखना और अगली सुबह प्रसाद रूप में ग्रहण करना; लक्ष्मी पूजन व रात्रि-जागरण (को जागर्ति = कौन जाग रहा है) की परम्परा।",
  },
  {
    slug: "karwa-chauth-2026",
    match: "Karwa Chauth",
    hi: "करवा चौथ",
    en: "Karwa Chauth 2026",
    intro:
      "कार्तिक कृष्ण चतुर्थी — सुहागिनों का सबसे बड़ा व्रत। पति की दीर्घायु की कामना से सूर्योदय से चंद्रोदय तक निर्जला व्रत रखा जाता है और चंद्र-दर्शन व अर्घ्य के बाद ही जल ग्रहण होता है।",
    vidhi:
      "भोर में सरगी, दिन भर निर्जला व्रत, शाम को करवा माता की कथा व पूजन, चंद्रोदय पर छलनी से चंद्र-दर्शन और अर्घ्य — फिर पति के हाथ से जल ग्रहण कर व्रत पूर्ण।",
  },
  {
    slug: "ahoi-ashtami-2026",
    match: "Ahoi Ashtami",
    hi: "अहोई अष्टमी",
    en: "Ahoi Ashtami 2026",
    intro:
      "कार्तिक कृष्ण अष्टमी — संतान की दीर्घायु और कल्याण के लिए माताओं का व्रत। अहोई माता का पूजन कर तारों को अर्घ्य देकर व्रत खोला जाता है।",
    vidhi:
      "दिन भर निर्जला/निराहार व्रत, दीवार या पट पर अहोई माता का चित्र, शाम को कथा-पूजन और तारों के दर्शन-अर्घ्य के बाद पारण।",
  },
  {
    slug: "dhanteras-2026",
    match: "Dhanteras",
    hi: "धनतेरस",
    en: "Dhanteras 2026",
    intro:
      "कार्तिक कृष्ण त्रयोदशी — दीपोत्सव का पहला दिन। धन्वंतरि जयंती और धन-समृद्धि के देवता कुबेर व माता लक्ष्मी का पूजन; इस दिन की खरीदारी (सोना, चांदी, बर्तन, वाहन) शुभ और स्थायी मानी जाती है।",
    vidhi:
      "संध्या में धन्वंतरि-कुबेर-लक्ष्मी पूजन, घर के द्वार पर यम-दीप, और प्रदोष काल में खरीदारी। खरीद का सर्वोत्तम समय शुभ चौघड़िया व प्रदोष काल का संगम माना जाता है।",
  },
  {
    slug: "diwali-2026",
    match: "Lakshmi Puja",
    hi: "दिवाली (दीपावली)",
    en: "Diwali 2026 — Lakshmi Puja",
    intro:
      "कार्तिक अमावस्या की रात — अंधकार पर प्रकाश की विजय का महापर्व। माता लक्ष्मी और गणेश जी का पूजन प्रदोष/निशीथ काल में, स्थिर लग्न में सर्वोत्तम माना जाता है।",
    vidhi:
      "संध्या में घर-द्वार दीपों से सजाना, प्रदोष काल में लक्ष्मी-गणेश पूजन (स्थिर लग्न — प्रायः वृषभ लग्न की संध्या — श्रेष्ठ), बही-खाता पूजन और पूरे घर में दीपदान।",
  },
  {
    slug: "govardhan-puja-2026",
    match: "Govardhan",
    hi: "गोवर्धन पूजा (अन्नकूट)",
    en: "Govardhan Puja 2026",
    intro:
      "कार्तिक शुक्ल प्रतिपदा — श्रीकृष्ण द्वारा गोवर्धन पर्वत उठाकर इंद्र का मान भंग करने की स्मृति। अन्नकूट में 56 भोग बनाकर गोवर्धन/गिरिराज जी को अर्पित किए जाते हैं।",
    vidhi:
      "गोबर से गोवर्धन जी की आकृति, अन्नकूट भोग, गौ-पूजन और परिक्रमा। पूजन प्रातः या प्रदोष काल के शुभ चौघड़िया में किया जाता है।",
  },
  {
    slug: "bhai-dooj-2026",
    match: "Bhai Dooj",
    hi: "भाई दूज",
    en: "Bhai Dooj 2026",
    intro:
      "कार्तिक शुक्ल द्वितीया — भाई-बहन के स्नेह का पर्व। यम-यमुना की कथा से जुड़ा यह दिन बहन के घर भोजन और तिलक की परम्परा रखता है।",
    vidhi:
      "बहन भाई को तिलक कर आरती उतारती है, भाई उपहार व रक्षा का वचन देता है। तिलक दोपहर के शुभ चौघड़िया/अपराह्न काल में श्रेष्ठ माना जाता है।",
  },
  {
    slug: "chhath-puja-2026",
    match: "Chhath",
    hi: "छठ पूजा",
    en: "Chhath Puja 2026",
    intro:
      "कार्तिक शुक्ल षष्ठी — सूर्योपासना का महापर्व, जिसमें छठी मैया और सूर्यदेव की आराधना होती है। नहाय-खाय से शुरू होकर उषा अर्घ्य तक चार दिन का कठोर व्रत।",
    vidhi:
      "नहाय-खाय → खरना → संध्या अर्घ्य (षष्ठी की शाम, डूबते सूर्य को) → उषा अर्घ्य (सप्तमी की भोर, उगते सूर्य को) — जल में खड़े होकर ठेकुआ-फल के सूप से अर्घ्य।",
  },
  {
    slug: "dev-deepawali-2026",
    match: "Dev Deepawali",
    hi: "देव दीपावली (कार्तिक पूर्णिमा)",
    en: "Dev Deepawali 2026 — Kartik Purnima",
    intro:
      "कार्तिक पूर्णिमा — देवताओं की दिवाली। त्रिपुरासुर पर शिव की विजय के उपलक्ष्य में काशी के घाटों पर लाखों दीप जलते हैं; गंगा-स्नान और दीपदान का विशेष पुण्य माना जाता है।",
    vidhi:
      "प्रातः पवित्र नदी-स्नान, संध्या (प्रदोष काल) में नदी/मंदिर में दीपदान, सत्यनारायण कथा और तुलसी विवाह की समाप्ति से जुड़ी परम्पराएं।",
  },
];

export function festivalPageBySlug(slug: string): FestivalPageDef | undefined {
  return FESTIVAL_PAGES.find((f) => f.slug === slug);
}

// ── Build-time data ───────────────────────────────────────────────────────────

export interface FestivalComputed {
  date: string | null; // YYYY-MM-DD; null = API unreachable at build
  weekday: string | null;
  /** that day's auspicious choghadiya slots (day periods only) */
  shubhSlots: { name: string; start: string; end: string; quality: string }[];
  abhijit: { start: string; end: string } | null;
}

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";
const KEY = process.env.NEXT_PUBLIC_API_KEY ?? process.env.NEXT_PUBLIC_API_TEST_KEY ?? "sk-test-dev";
const REF = { lat: 28.6139, lon: 77.209, tz: 5.5 }; // Delhi reference, stated on page

async function apiPost(path: string, body: unknown): Promise<Record<string, unknown> | null> {
  try {
    const res = await fetch(`${BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${KEY}` },
      body: JSON.stringify(body),
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (json?.meta?.mode === "test") return null; // never ship sample data as real dates
    return json?.data ?? null;
  } catch {
    return null;
  }
}

let _calendar: { date: string; name: string }[] | null = null;

/** The 2026 festival calendar, fetched once per build and cached in-module. */
async function festivalCalendar(): Promise<{ date: string; name: string }[]> {
  if (_calendar) return _calendar;
  const all: { date: string; name: string }[] = [];
  for (let m = 1; m <= 12; m++) {
    const data = await apiPost("/v1/panchang/festivals", {
      dob: `2026-${String(m).padStart(2, "0")}-01`, tob: "12:00", ...REF,
    });
    const items = (data?.festivals as { date: string; name: string }[] | undefined) ?? [];
    for (const f of items) if (f.date?.startsWith("2026")) all.push({ date: f.date, name: f.name });
  }
  _calendar = all;
  return all;
}

export async function computeFestival(def: FestivalPageDef): Promise<FestivalComputed> {
  const cal = await festivalCalendar();
  const hit = cal.find((f) => f.name.includes(def.match));
  if (!hit) return { date: null, weekday: null, shubhSlots: [], abhijit: null };

  const day = await apiPost("/v1/muhurta/full", { date: hit.date, ...REF });
  const chog = (day?.choghadiya as { type: string; name: string; quality: string; start: string; end: string }[] | undefined) ?? [];
  const abhijit = (day?.abhijit as { start: string; end: string } | undefined) ?? null;
  return {
    date: hit.date,
    weekday: (day?.vara as string | undefined) ?? null,
    shubhSlots: chog
      .filter((p) => p.type === "day" && (p.quality === "Excellent" || p.quality === "Good"))
      .map((p) => ({ name: p.name, start: p.start, end: p.end, quality: p.quality })),
    abhijit,
  };
}
