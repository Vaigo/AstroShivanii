import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import {
  FESTIVAL_PAGES,
  festivalPageBySlug,
  computeFestival,
} from "@/lib/festival-pages";

export function generateStaticParams() {
  return FESTIVAL_PAGES.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const def = festivalPageBySlug(slug);
  if (!def) return {};
  return {
    title: `${def.hi} 2026 कब है — ${def.en} Date & Shubh Muhurat`,
    description: `${def.hi} 2026: exact computed date, day and shubh muhurat (auspicious choghadiya hours + Abhijit) — astronomical calculation on the Lahiri ayanamsa, plus significance and puja vidhi.`,
    alternates: { canonical: `/festivals/${def.slug}/` },
  };
}

const MONTHS_HI = ["जनवरी", "फ़रवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितम्बर", "अक्टूबर", "नवम्बर", "दिसम्बर"];
const WEEKDAY_HI: Record<string, string> = {
  Sunday: "रविवार", Monday: "सोमवार", Tuesday: "मंगलवार", Wednesday: "बुधवार",
  Thursday: "गुरुवार", Friday: "शुक्रवार", Saturday: "शनिवार",
};
const CHOG_HI: Record<string, string> = {
  Amrit: "अमृत", Shubh: "शुभ", Labh: "लाभ", Char: "चर",
};

function fmtHi(date: string): string {
  const [y, m, d] = date.split("-").map(Number);
  return `${d} ${MONTHS_HI[m - 1]} ${y}`;
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const def = festivalPageBySlug(slug);
  if (!def) notFound();

  const c = await computeFestival(def);

  const faqs = [
    {
      q: `${def.hi} 2026 में कब है?`,
      a: c.date
        ? `${def.hi} 2026 में ${fmtHi(c.date)}${c.weekday ? ` (${WEEKDAY_HI[c.weekday] ?? c.weekday})` : ""} को है। यह तारीख वास्तविक खगोलीय गणना (लाहिरी अयनांश, सूर्योदय-व्यापिनी तिथि परम्परा) से निकाली गई है — स्थानीय पंचांग से एक दिन का अंतर संभव है।`
        : `${def.hi} की सटीक तारीख इस समय लोड नहीं हो पाई — ऊपर का पेज अगली गणना पर स्वतः अपडेट हो जाएगा। हमारा पंचांग टूल भी देख सकते हैं।`,
    },
    {
      q: `${def.hi} पर पूजा का शुभ समय क्या रहेगा?`,
      a: c.shubhSlots.length
        ? `उस दिन के शुभ चौघड़िया (दिल्ली सूर्योदय से): ${c.shubhSlots.map((s) => `${CHOG_HI[s.name] ?? s.name} ${s.start}–${s.end}`).join(", ")}${c.abhijit ? `; अभिजीत मुहूर्त ${c.abhijit.start}–${c.abhijit.end}` : ""}। आपके शहर में कुछ मिनट का अंतर होगा — अपने शहर का सटीक चौघड़िया हमारे चौघड़िया टूल में देखें।`
        : "उस दिन के शुभ चौघड़िया हमारे चौघड़िया टूल में देखें — हर शहर के सूर्योदय से सटीक समय मिलेगा। साथ में राहु काल अवश्य टालें।",
    },
    {
      q: `${def.hi} का महत्व क्या है?`,
      a: def.intro,
    },
  ];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
    ...(c.date
      ? [{
          "@context": "https://schema.org",
          "@type": "Event",
          name: `${def.en} (${def.hi})`,
          startDate: c.date,
          eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
          eventStatus: "https://schema.org/EventScheduled",
          location: { "@type": "Country", name: "India" },
          description: def.intro,
        }]
      : []),
  ];

  return (
    <section className="section">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="container" style={{ maxWidth: "860px" }}>
        <Breadcrumbs crumbs={[{ name: "Home", href: "/" }, { name: "Festivals 2026", href: "/festivals-2026" }, { name: def.hi }]} />
        <h1 className="section-heading">{def.hi} 2026 — कब है, शुभ मुहूर्त</h1>
        <p className="section-heading-hi devanagari">{def.en} · तारीख खगोलीय गणना से, अनुमान से नहीं</p>

        <div
          className="result-box devanagari"
          style={{ border: "1.5px solid var(--gold)", background: "rgba(201,154,58,0.07)", textAlign: "center", padding: "1.4rem 1rem", marginBottom: "1.6rem" }}
        >
          {c.date ? (
            <>
              <p style={{ fontSize: "1.7rem", fontWeight: 700, color: "var(--maroon)", margin: 0 }}>
                {fmtHi(c.date)}{c.weekday && `, ${WEEKDAY_HI[c.weekday] ?? c.weekday}`}
              </p>
              {c.shubhSlots.length > 0 && (
                <p style={{ fontSize: "0.9rem", color: "var(--ink-light)", margin: "0.6rem 0 0" }}>
                  शुभ चौघड़िया: {c.shubhSlots.map((s) => `${CHOG_HI[s.name] ?? s.name} ${s.start}–${s.end}`).join(" · ")}
                </p>
              )}
              {c.abhijit && (
                <p style={{ fontSize: "0.9rem", color: "var(--ink-light)", margin: "0.3rem 0 0" }}>
                  अभिजीत मुहूर्त: <strong>{c.abhijit.start}–{c.abhijit.end}</strong>
                </p>
              )}
              <p style={{ fontSize: "0.75rem", color: "var(--muted)", margin: "0.6rem 0 0" }}>
                समय दिल्ली सूर्योदय से — अपने शहर का सटीक समय <Link href="/choghadiya/">चौघड़िया टूल</Link> में देखें
              </p>
            </>
          ) : (
            <p style={{ fontSize: "1rem", color: "var(--muted)", margin: 0 }}>
              तारीख अस्थायी रूप से उपलब्ध नहीं — <Link href="/festivals-2026/">पूरा त्योहार कैलेंडर</Link> देखें।
            </p>
          )}
        </div>

        <article className="guide-article">
          <h2 className="guide-h2 devanagari">महत्व</h2>
          <p className="guide-p devanagari">{def.intro}</p>

          <h2 className="guide-h2 devanagari">पूजा विधि — क्या किया जाता है</h2>
          <p className="guide-p devanagari">{def.vidhi}</p>

          <h2 className="guide-h2 devanagari">आम सवाल</h2>
          <div className="faq-list">
            {faqs.map((f, i) => (
              <details key={i} className="faq-item">
                <summary className="faq-q devanagari">
                  <span>{f.q}</span>
                  <span className="faq-chevron" aria-hidden="true">›</span>
                </summary>
                <div className="faq-a devanagari">{f.a}</div>
              </details>
            ))}
          </div>

          <h2 className="guide-h2 devanagari">2026 के अन्य व्रत-त्योहार</h2>
          <p className="guide-p devanagari" style={{ lineHeight: 2 }}>
            {FESTIVAL_PAGES.filter((f) => f.slug !== def.slug).map((f, i) => (
              <span key={f.slug}>
                {i > 0 && " · "}
                <Link href={`/festivals/${f.slug}/`}>{f.hi}</Link>
              </span>
            ))}
          </p>
          <p className="guide-p devanagari" style={{ textAlign: "center", marginTop: "1rem" }}>
            पूरा कैलेंडर: <Link href="/festivals-2026/">व्रत एवं त्यौहार 2026</Link> · उस दिन का पंचांग:{" "}
            <Link href="/tools/panchang/">पंचांग टूल</Link> · राहु काल: <Link href="/rahu-kaal/">यहां देखें</Link>
          </p>
        </article>
      </div>
    </section>
  );
}
