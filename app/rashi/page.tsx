import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import { RASHIS } from "@/lib/rashis";

export const metadata: Metadata = {
  title: "12 राशियाँ (Rashis) — स्वामी, तत्व, स्वभाव, करियर | All Moon Signs",
  description:
    "All 12 Vedic rashis (moon signs) — Mesh to Meen — with ruling planet, element, nakshatras, honest personality, career, love and health guidance.",
  alternates: { canonical: "/rashi/" },
};

export default function RashiIndexPage() {
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: "900px" }}>
        <Breadcrumbs crumbs={[{ name: "Home", href: "/" }, { name: "Rashis" }]} />

        <h1 className="section-heading">The 12 Rashis</h1>
        <p className="section-heading-hi devanagari">बारह राशियाँ — चंद्र राशि के अनुसार</p>
        <p style={{ textAlign: "center", color: "var(--muted)", margin: "0 auto 1rem", maxWidth: "640px", fontSize: "0.95rem" }}>
          In Vedic astrology your rashi is your <b>Moon sign</b> — the sign the Moon occupied
          at your birth — not the Western sun sign. It governs your mind, emotions and the
          rashifal that applies to you.
        </p>
        <p style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <Link href="/tools/kundli" style={{ color: "var(--maroon)", fontWeight: 600 }}>
            Don&apos;t know your Moon sign? Find it free →
          </Link>
        </p>

        <div className="guide-grid">
          {RASHIS.map((r) => (
            <Link key={r.slug} href={`/rashi/${r.slug}`} className="guide-card">
              <div className="guide-card-icon" style={{ fontFamily: "var(--font-display)", fontSize: "0.8rem", fontWeight: 800 }}>
                {r.index + 1}
              </div>
              <div>
                <h2 className="guide-card-title">
                  {r.name_hi} <span style={{ color: "var(--muted)", fontWeight: 400 }}>({r.name})</span>
                </h2>
                <p className="guide-card-desc">
                  Lord: {r.lord} · {r.element} · {r.quality}
                </p>
                <span className="guide-card-meta">{r.symbol}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
