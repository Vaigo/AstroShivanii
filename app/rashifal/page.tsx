import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import { RASHIS, RASHI_GLYPH } from "@/lib/rashis";

export const metadata: Metadata = {
  title: "आज का राशिफल — Aaj Ka Rashifal, सभी 12 राशियां",
  description:
    "Aaj ka rashifal in Hindi: daily horoscope for all 12 rashis computed from today's real planetary transits — career, money, love, health stars, lucky numbers and auspicious hours. Updated live every day.",
  alternates: { canonical: "/rashifal/" },
};

export default function Page() {
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: "860px" }}>
        <Breadcrumbs crumbs={[{ name: "Home", href: "/" }, { name: "Rashifal" }]} />
        <h1 className="section-heading">आज का राशिफल — Aaj Ka Rashifal</h1>
        <p className="section-heading-hi devanagari">
          अपनी राशि चुनें — आज के वास्तविक गोचर से बना राशिफल, रोज़ स्वतः अपडेट
        </p>

        <div className="tool-explainer" style={{ textAlign: "center", marginBottom: "2rem" }}>
          <p className="devanagari" style={{ fontWeight: 600, color: "var(--maroon)" }}>
            हर राशि का फल आज की असली ग्रह-स्थितियों से — कोई template नहीं, कोई copy-paste नहीं।
          </p>
          <p>
            Every prediction is computed from today&apos;s actual transits over your Moon sign (Lahiri ayanamsa) —
            that&apos;s why it changes daily and differs for every rashi.
          </p>
        </div>

        <div className="guide-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "0.8rem" }}>
          {RASHIS.map((r) => (
            <Link key={r.slug} href={`/rashifal/${r.slug}/`} className="guide-card" style={{ padding: "0.9rem 1rem", textAlign: "center" }}>
              <span style={{ fontSize: "1.4rem", display: "block" }}>{RASHI_GLYPH[r.index]}</span>
              <strong className="devanagari" style={{ display: "block", marginTop: "0.25rem" }}>{r.name_hi}</strong>
              <span style={{ fontSize: "0.78rem", color: "var(--muted)" }}>{r.name}</span>
            </Link>
          ))}
        </div>

        <p className="guide-p devanagari" style={{ textAlign: "center", marginTop: "2rem" }}>
          अपनी सही चंद्र-राशि नहीं पता? <Link href="/tools/kundli/">निःशुल्क कुंडली</Link> से जानें · साप्ताहिक
          राशिफल: <Link href="/tools/rashifal/">राशिफल टूल</Link>
        </p>
      </div>
    </section>
  );
}
