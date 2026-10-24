import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import MuhurtaPastHider from "@/components/MuhurtaPastHider";
import {
  MUHURTA_PAGES,
  MONTHS_HI,
  muhurtaPageBySlug,
  muhurtaTitle,
  muhurtaDescription,
  SEASONAL_CAUTION,
  fetchMuhurtaDates,
  type FinderDate,
} from "@/lib/muhurta-pages";

export function generateStaticParams() {
  return MUHURTA_PAGES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const def = muhurtaPageBySlug(slug);
  if (!def) return {};
  // the dates are fetched once per build (cached in lib/muhurta-pages.ts), so the description can name the
  // months the list really covers instead of a generic English line
  const dates = await fetchMuhurtaDates(def.purpose, def.year);
  return {
    title: muhurtaTitle(def),
    description: muhurtaDescription(def, dates),
    alternates: { canonical: `/muhurta/${def.slug}/` },
  };
}

const WEEKDAY_HI: Record<string, string> = {
  Sunday: "रविवार", Monday: "सोमवार", Tuesday: "मंगलवार", Wednesday: "बुधवार",
  Thursday: "गुरुवार", Friday: "शुक्रवार", Saturday: "शनिवार",
};

function monthKey(date: string): string {
  const [y, m] = date.split("-").map(Number);
  return `${MONTHS_HI[m - 1]} ${y}`;
}

function fmtDay(date: string): string {
  const [, m, d] = date.split("-").map(Number);
  return `${d} ${MONTHS_HI[m - 1]}`;
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const def = muhurtaPageBySlug(slug);
  if (!def) notFound();

  const dates = await fetchMuhurtaDates(def.purpose, def.year);
  const byMonth = new Map<string, FinderDate[]>();
  for (const d of dates) {
    const k = monthKey(d.date);
    if (!byMonth.has(k)) byMonth.set(k, []);
    byMonth.get(k)!.push(d);
  }

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: def.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  // When the list was computed (printed as "last computed", never as "today"), and the first few dates in it
  const computedOn = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  const computedLabel = `${computedOn.getDate()} ${MONTHS_HI[computedOn.getMonth()]} ${computedOn.getFullYear()}`;
  const upcoming = dates.slice(0, 8);

  return (
    <section className="section">
      <MuhurtaPastHider />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <div className="container" style={{ maxWidth: "860px" }}>
        <Breadcrumbs crumbs={[{ name: "Home", href: "/" }, { name: `Muhurat ${def.year}`, href: "/muhurta" }, { name: def.hiTitle }]} />
        <h1 className="section-heading">{def.hiTitle}</h1>
        <p className="section-heading-hi devanagari">{def.hiHook}</p>

        {/* Wedding and housewarming lists still include Chaturmas/Kharmas dates (see SEASONAL_CAUTION): no
            "upcoming shubh days" highlight on those two page types until the finder screens them. */}
        {dates.length > 0 && !SEASONAL_CAUTION.has(def.purpose) && (
          <div className="devanagari" style={{ textAlign: "center", margin: "0 0 1.5rem", lineHeight: 1.9 }}>
            {/* 8 are rendered; the page hider keeps the first 5 that are not in the past (data-mu-keep) */}
            <p data-mu-group data-mu-keep="5" style={{ margin: 0 }}>
              <strong>आने वाले शुभ दिन:</strong>{" "}
              {upcoming.map((d) => (
                <span key={d.date} className="mu-up" data-mu-date={d.date} style={{ whiteSpace: "nowrap" }}>
                  {fmtDay(d.date)} ({WEEKDAY_HI[d.weekday] ?? d.weekday})
                </span>
              ))}
            </p>
            <p style={{ margin: "0.4rem 0 0", fontSize: "0.9rem" }}>
              {[...byMonth.entries()].map(([month, rows]) => (
                <span key={month} className="mu-mo" data-mu-month={`m-${rows[0].date.slice(0, 7)}`}>
                  <a href={`#m-${rows[0].date.slice(0, 7)}`} style={{ display: "inline-block", padding: "0.3rem 0.2rem" }}>{month}</a>
                </span>
              ))}
            </p>
            <p style={{ margin: "0.3rem 0 0", fontSize: "0.75rem", color: "var(--muted)" }}>
              सूची की अंतिम गणना: {computedLabel}।
            </p>
          </div>
        )}

        <div className="tool-explainer" style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <p>
            Every date below is computed astronomically (Lahiri ayanamsa): the nakshatra and tithi are screened by
            the classical rules for this purpose, and each date carries that day&apos;s auspicious choghadiya hours.
          </p>
          <p className="devanagari" style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
            समय दिल्ली के सूर्योदय से हैं — आपके शहर में कुछ मिनट का अंतर संभव है। सूची हर रात ताज़ा की जाती है।
          </p>
        </div>

        <div
          className="result-box devanagari"
          style={{ border: "1.5px solid var(--gold)", background: "rgba(201,154,58,0.07)", padding: "0.9rem 1.1rem", marginBottom: "2rem", textAlign: "center" }}
        >
          ये सामान्य पंचांग-आधारित तारीखें हैं — सबके लिए एक जैसी। <strong>आपकी अपनी कुंडली</strong> से ताराबल,
          चंद्राष्टम व दशा जांचकर व्यक्तिगत शुभ तारीखें:{" "}
          <Link href="/tools/shubh-muhurta/" style={{ fontWeight: 700 }}>शुभ मुहूर्त टूल →</Link>
        </div>

        {dates.length === 0 ? (
          <p className="guide-p devanagari" style={{ textAlign: "center" }}>
            सूची अभी अस्थायी रूप से उपलब्ध नहीं है — कृपया कुछ देर बाद देखें, या{" "}
            <Link href="/tools/shubh-muhurta/">शुभ मुहूर्त टूल</Link> से अपनी तारीखें निकालें।
          </p>
        ) : (
          [...byMonth.entries()].map(([month, rows]) => (
            <div key={month} id={`m-${rows[0].date.slice(0, 7)}`} data-mu-group style={{ marginBottom: "1.8rem", scrollMarginTop: "1rem" }}>
              <h2 className="guide-h2 devanagari">{month} के शुभ दिन</h2>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid var(--gold)" }}>
                      <th className="devanagari" style={{ textAlign: "left", padding: "0.45rem" }}>तारीख</th>
                      <th className="devanagari" style={{ textAlign: "left", padding: "0.45rem" }}>वार</th>
                      <th className="devanagari" style={{ textAlign: "left", padding: "0.45rem" }}>नक्षत्र</th>
                      <th className="devanagari" style={{ textAlign: "left", padding: "0.45rem" }}>तिथि</th>
                      <th className="devanagari" style={{ textAlign: "left", padding: "0.45rem" }}>शुभ समय (चौघड़िया)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((d) => (
                      <tr key={d.date} data-mu-date={d.date} style={{ borderBottom: "1px solid rgba(201,154,58,0.25)" }}>
                        <td className="devanagari" style={{ padding: "0.45rem", fontWeight: 600, whiteSpace: "nowrap" }}>
                          {fmtDay(d.date)}
                          {d.quality === "Excellent" && <span title="Excellent" style={{ color: "var(--gold-bright)" }}> ★</span>}
                        </td>
                        <td className="devanagari" style={{ padding: "0.45rem" }}>{WEEKDAY_HI[d.weekday] ?? d.weekday}</td>
                        <td style={{ padding: "0.45rem" }}>{d.nakshatra}</td>
                        <td style={{ padding: "0.45rem", whiteSpace: "nowrap" }}>{d.tithi} ({d.paksha})</td>
                        <td style={{ padding: "0.45rem", whiteSpace: "nowrap" }}>
                          {d.auspicious_slots.map((s) => `${s.choghadiya} ${s.start}–${s.end}`).join(" · ") || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        )}

        <article className="guide-article" style={{ marginTop: "2rem" }}>
          <h2 className="guide-h2 devanagari">आम सवाल</h2>
          <div className="faq-list">
            {def.faqs.map((f, i) => (
              <details key={i} className="faq-item">
                <summary className="faq-q devanagari">
                  <span>{f.q}</span>
                  <span className="faq-chevron" aria-hidden="true">›</span>
                </summary>
                <div className="faq-a devanagari">{f.a}</div>
              </details>
            ))}
          </div>

          <h2 className="guide-h2 devanagari">इसी विषय के अन्य वर्ष</h2>
          <p className="guide-p devanagari" style={{ lineHeight: 2 }}>
            {MUHURTA_PAGES.filter((p) => p.purpose === def.purpose && p.slug !== def.slug).map((p, i) => (
              <span key={p.slug}>
                {i > 0 && " · "}
                <Link href={`/muhurta/${p.slug}/`}>{p.hiTitle}</Link>
              </span>
            ))}
          </p>

          <h2 className="guide-h2 devanagari">अन्य मुहूर्त</h2>
          <p className="guide-p devanagari" style={{ lineHeight: 2 }}>
            {MUHURTA_PAGES.filter((p) => p.purpose !== def.purpose).map((p, i) => (
              <span key={p.slug}>
                {i > 0 && " · "}
                <Link href={`/muhurta/${p.slug}/`}>{p.hiTitle}</Link>
              </span>
            ))}
          </p>
          <p className="guide-p devanagari" style={{ textAlign: "center", marginTop: "1rem" }}>
            आज का पंचांग व राहु काल: <Link href="/rahu-kaal/">राहु काल टूल</Link> ·{" "}
            <Link href="/tools/panchang/">पंचांग</Link>
          </p>
        </article>
      </div>
    </section>
  );
}
