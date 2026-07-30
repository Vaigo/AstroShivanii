import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import { NAKSHATRAS, GANA_HI } from "@/lib/nakshatras";

export const metadata: Metadata = {
  title: "27 Nakshatras — स्वामी, देवता, गुण और विशेषताएँ | All Birth Stars",
  description:
    "All 27 nakshatras of Vedic astrology with their ruling planet, deity, symbol, gana, name syllables and honest personality analysis — from Ashwini to Revati.",
  alternates: { canonical: "/nakshatra/" },
};

export default function NakshatraIndexPage() {
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: "900px" }}>
        <Breadcrumbs crumbs={[{ name: "Home", href: "/" }, { name: "Nakshatras" }]} />

        <h1 className="section-heading">The 27 Nakshatras</h1>
        <p className="section-heading-hi devanagari">सत्ताईस नक्षत्र — जन्म तारे</p>
        <p style={{ textAlign: "center", color: "var(--muted)", margin: "0 auto 1rem", maxWidth: "640px", fontSize: "0.95rem" }}>
          The nakshatra your Moon occupied at birth is the most personal signature in Vedic
          astrology — it names you, times your dashas, and describes your instinctive nature
          more precisely than the rashi alone.
        </p>
        <p style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <Link href="/tools/kundli" style={{ color: "var(--maroon)", fontWeight: 600 }}>
            Don&apos;t know your nakshatra? Find it free →
          </Link>
        </p>

        <div className="guide-grid">
          {NAKSHATRAS.map((n) => (
            <Link key={n.slug} href={`/nakshatra/${n.slug}`} className="guide-card">
              <div className="guide-card-icon" style={{ fontFamily: "var(--font-display)", fontSize: "0.8rem", fontWeight: 800 }}>
                {n.index + 1}
              </div>
              <div>
                <h2 className="guide-card-title">
                  {n.name} <span className="devanagari" style={{ color: "var(--muted)", fontWeight: 400 }}>{n.name_hi}</span>
                </h2>
                <p className="guide-card-desc">
                  {n.span} · Lord: {n.lord} · {n.gana} <span className="devanagari">({GANA_HI[n.gana]})</span> gana
                </p>
                <span className="guide-card-meta devanagari">नामाक्षर: {n.syllables.join(", ")}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
