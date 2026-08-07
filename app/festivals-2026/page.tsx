import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import type { FestivalItem } from "@/lib/api/types";

export const metadata: Metadata = {
  title: "व्रत एवं त्यौहार कैलेंडर 2026 — Ekadashi, Pradosh, Purnima, Amavasya Dates",
  description:
    "Complete 2026 vrat & festival calendar computed astronomically: every Ekadashi, Pradosh Vrat, Purnima, Amavasya and major tithi-based observance with dates — free, accurate, Lahiri ayanamsa.",
  alternates: { canonical: "/festivals-2026/" },
};

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";
const KEY = process.env.NEXT_PUBLIC_API_KEY ?? process.env.NEXT_PUBLIC_API_TEST_KEY ?? "sk-test-dev";

const MONTHS_HI = ["जनवरी", "फ़रवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितम्बर", "अक्टूबर", "नवम्बर", "दिसम्बर"];
/** Weekly weekday-vrats (every Somvar/Shanivar…) would flood a yearly
 *  calendar — we list tithi-based observances and mention weekly vrats in prose. */
const WEEKLY = /^(Somvar|Mangalvar|Budhvar|Guruvar|Shukravar|Shanivar|Ravivar)/i;

async function fetchYearFestivals(): Promise<FestivalItem[]> {
  const seen = new Set<string>();
  const all: FestivalItem[] = [];
  for (let m = 1; m <= 12; m++) {
    const dob = `2026-${String(m).padStart(2, "0")}-01`;
    try {
      const res = await fetch(`${BASE}/v1/panchang/festivals`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${KEY}` },
        body: JSON.stringify({ dob, tob: "12:00", lat: 28.6139, lon: 77.209, tz: 5.5 }),
      });
      if (!res.ok) continue;
      const json = await res.json();
      const items: FestivalItem[] = json?.data?.festivals ?? [];
      for (const f of items) {
        if (!f.date?.startsWith("2026")) continue;
        if (WEEKLY.test(f.name)) continue;
        const k = `${f.date}|${f.name}`;
        if (!seen.has(k)) {
          seen.add(k);
          all.push(f);
        }
      }
    } catch {
      // build proceeds with whatever months succeeded
    }
  }
  return all.sort((a, b) => a.date.localeCompare(b.date));
}

const FAQS = [
  {
    q: "2026 में एकादशी व्रत कब-कब है?",
    a: "हर माह दो एकादशी होती हैं — शुक्ल और कृष्ण पक्ष की। नीचे दिए कैलेंडर में 2026 की सभी एकादशी तिथियाँ खगोलीय गणना से दी गई हैं। एकादशी व्रत भगवान विष्णु को समर्पित है।",
  },
  {
    q: "ये तिथियाँ कितनी सटीक हैं?",
    a: "सभी तिथियाँ वास्तविक खगोलीय स्थितियों से लाहिरी अयनांश पर गणना की गई हैं — वही मानक जो भारत सरकार के पंचांगों में प्रयुक्त होता है। तिथि सूर्योदय-व्यापिनी परम्परा के अनुसार दी गई है; स्थानीय पंचांग से एक दिन का अंतर संभव है।",
  },
  {
    q: "व्रत का सही समय (मुहूर्त) कैसे जानें?",
    a: "तिथि का आरम्भ-समाप्ति समय आपके शहर पर निर्भर करता है — हमारे निःशुल्क दैनिक पंचांग टूल में अपनी तिथि और शहर चुनकर सटीक समय देखें, राहु काल और चोघड़िया समेत।",
  },
];

export default async function FestivalsPage() {
  const festivals = await fetchYearFestivals();

  const byMonth = new Map<number, FestivalItem[]>();
  for (const f of festivals) {
    const m = parseInt(f.date.slice(5, 7), 10) - 1;
    if (!byMonth.has(m)) byMonth.set(m, []);
    byMonth.get(m)!.push(f);
  }

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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <div className="container" style={{ maxWidth: "860px" }}>
        <Breadcrumbs crumbs={[{ name: "Home", href: "/" }, { name: "व्रत-त्यौहार 2026" }]} />

        <h1 className="section-heading">व्रत एवं त्यौहार 2026</h1>
        <p className="section-heading-hi devanagari">एकादशी · प्रदोष · पूर्णिमा · अमावस्या — पूरे वर्ष की तिथियाँ</p>
        <div className="temple-skyline-band" aria-hidden="true" style={{ margin: "0.5rem 0 1.5rem" }} />
        <div className="tool-explainer" style={{ textAlign: "center", marginBottom: "1rem" }}>
          <p>
            2026 की हर तिथि-आधारित व्रत-तिथि, वास्तविक खगोलीय गणना से (लाहिरी अयनांश) —
            छपे पंचांग से नक़ल नहीं। साप्ताहिक व्रत (सोमवार, शनिवार आदि) हर सप्ताह आते हैं,
            इसलिए यहाँ तिथि-पर्व दिए गए हैं। अपने शहर का सटीक समय{" "}
            <Link href="/tools/panchang" style={{ color: "var(--maroon)", fontWeight: 600 }}>दैनिक पंचांग</Link> में देखें।
          </p>
        </div>

        {festivals.length === 0 ? (
          <p style={{ textAlign: "center", color: "var(--muted)", padding: "2rem" }}>
            कैलेंडर अद्यतन हो रहा है — कृपया <Link href="/tools/panchang">दैनिक पंचांग</Link> देखें।
          </p>
        ) : (
          Array.from(byMonth.entries()).map(([m, items]) => (
            <div key={m} style={{ marginBottom: "1.5rem" }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", color: "var(--maroon-deep)", borderBottom: "1.5px solid rgba(201,154,58,0.4)", paddingBottom: "0.3rem", marginBottom: "0.6rem" }}>
                {MONTHS_HI[m]} 2026
              </h2>
              <div className="planes-wrap">
                <table className="planes-table">
                  <tbody>
                    {items.map((f, i) => (
                      <tr key={i}>
                        <td style={{ whiteSpace: "nowrap", fontWeight: 700, color: "var(--maroon)" }}>
                          {parseInt(f.date.slice(8, 10), 10)} {MONTHS_HI[m]}
                        </td>
                        <td style={{ fontWeight: 600 }}>{f.name}</td>
                        <td style={{ color: "var(--muted)", fontSize: "0.82rem" }}>{f.significance}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        )}

        <div className="faq-list" style={{ margin: "2rem 0" }}>
          {FAQS.map((f, i) => (
            <details key={i} className="faq-item">
              <summary className="faq-q">
                <span className="devanagari">{f.q}</span>
                <span className="faq-chevron" aria-hidden="true">›</span>
              </summary>
              <div className="faq-a devanagari">{f.a}</div>
            </details>
          ))}
        </div>

        <div className="guide-cta">
          <p style={{ fontFamily: "var(--font-devanagari)", color: "var(--gold)", marginBottom: "0.75rem" }}>
            व्रत की तिथि सबकी एक है — पर विवाह, गृह-प्रवेश या नए काम का मुहूर्त आपकी कुंडली से तय होता है।
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/tools/panchang" className="btn btn-ghost" style={{ color: "var(--gold-bright)", borderColor: "var(--gold)" }}>
              पंचांग देखें
            </Link>
            <Link href="/book" className="btn btn-primary">
              व्यक्तिगत मुहूर्त परामर्श
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
