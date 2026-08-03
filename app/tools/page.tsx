import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import Breadcrumbs from "@/components/Breadcrumbs";
import PatrikaFrame from "@/components/PatrikaFrame";
import Icon, { IconName } from "@/components/Icon";
import { CATEGORIES } from "@/lib/turant-uttar-data";

export const metadata: Metadata = {
  title: "Free Vedic Astrology Tools — Kundli, Matching, Numerology & More",
  description:
    "Free Vedic astrology calculators — Kundli, Marriage Matching, Rashifal, Tarot, Sade Sati, Numerology with Lo Shu Grid. No sign-up needed, free forever.",
  alternates: { canonical: "/tools/" },
};

const TOOLS: Array<{ slug: string; icon: IconName; name: string; nameHi: string; desc: string }> = [
  { slug: "panchang",   icon: "sun",    name: "Panchang",              nameHi: "पंचांग",                desc: "Tithi, nakshatra, Rahu Kaal, Abhijit muhurta — any date, any city, plus a monthly calendar view" },
  { slug: "kundli",     icon: "scroll", name: "Kundli / Birth Chart",  nameHi: "कुंडली / जन्म चार्ट",  desc: "North Indian chart, planetary positions, yogas, current dasha" },
  { slug: "baal-kundli", icon: "leaf",  name: "Baal Kundli",           nameHi: "बाल कुंडली",           desc: "Free baby & child birth chart — naming syllable, temperament, health tendencies" },
  { slug: "matching",   icon: "rings",  name: "Marriage Matching",     nameHi: "गुण मिलान",             desc: "36-point Ashtakoot Guna Milan + Mangal Dosha check" },
  { slug: "rashifal",   icon: "star",   name: "Daily Rashifal",        nameHi: "दैनिक राशिफल",          desc: "Today's horoscope for your moon sign (rashi)" },
  { slug: "numerology", icon: "hash",   name: "Numerology",            nameHi: "अंक ज्योतिष",           desc: "Mulank, Bhagyank, Name Number, Lo Shu Grid, Karmic Numbers" },
  { slug: "sade-sati",  icon: "planet", name: "Sade Sati Check",       nameHi: "साढ़े साती जांच",         desc: "Is Saturn's 7.5-year period currently active for you?" },
  { slug: "tarot",      icon: "cards",  name: "Tarot Reading",         nameHi: "टैरो पाठन",             desc: "3-card Vedic tarot spread for your question" },
];

export default function ToolsPage() {
  return (
    <section className="section">
      <div className="container">
        <Breadcrumbs crumbs={[{ name: "Home", href: "/" }, { name: "Free Tools" }]} />

        <h1 className="section-heading">Free Vedic Tools</h1>
        <p className="section-heading-hi devanagari">निःशुल्क वैदिक गणनाएं</p>
        <p style={{ textAlign: "center", color: "var(--muted)", marginBottom: "2rem", fontSize: "0.95rem" }}>
          Real calculations from the same engine Shivanii uses. No sign-up needed. Free forever.
        </p>

        {/* ── Three-tier ladder — so a first-time visitor knows what each option is for ── */}
        <Reveal>
          <div
            style={{
              display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1rem", marginBottom: "2.5rem", maxWidth: "820px", marginLeft: "auto", marginRight: "auto",
            }}
          >
            {[
              { tag: "मुफ़्त", title: "निःशुल्क टूल्स", desc: "अपनी कुंडली में क्या है, यह देखें — बिना पैसे, बिना रजिस्ट्रेशन", tagEn: "Free", titleEn: "Free Tools", descEn: "See what's in your chart — no cost, no sign-up" },
              { tag: "₹149", title: "तुरंत उत्तर", desc: "एक खास सवाल का तुरंत, कुंडली-आधारित उत्तर", tagEn: "₹149", titleEn: "Turant Uttar", descEn: "One specific question, answered instantly from your chart" },
              { tag: "₹499+", title: "व्यक्तिगत पाठन", desc: "शिवानी जी स्वयं आपकी पूरी स्थिति का गहन विश्लेषण करती हैं", tagEn: "₹499+", titleEn: "Personal Reading", descEn: "Shivanii herself studies your full situation in depth" },
            ].map((t, i) => (
              <div key={i} style={{ textAlign: "center", padding: "1rem", background: "rgba(201,154,58,0.06)", border: "1px solid rgba(201,154,58,0.25)", borderRadius: "2px" }}>
                <span style={{ display: "inline-block", fontSize: "0.7rem", fontWeight: 700, color: "var(--maroon)", background: "rgba(201,154,58,0.15)", padding: "0.15rem 0.5rem", borderRadius: "2px", marginBottom: "0.5rem" }}>
                  {t.tag}
                </span>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--maroon-deep)", marginBottom: "0.3rem" }}>
                  {t.title} <span style={{ fontWeight: 400, fontSize: "0.8rem", color: "var(--muted)" }}>· {t.titleEn}</span>
                </div>
                <p className="devanagari" style={{ fontSize: "0.82rem", color: "var(--ink-light)", margin: 0 }}>{t.desc}</p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* ── तुरंत उत्तर — featured above the free tools, questions clickable right here ── */}
        <Reveal>
          <PatrikaFrame style={{ marginBottom: "2.5rem", border: "1.5px solid var(--gold)" }}>
            <div style={{ textAlign: "center", marginBottom: "1.25rem" }}>
              <span style={{ display: "inline-block", background: "var(--gold)", color: "var(--maroon-deep)", fontSize: "0.7rem", fontWeight: 700, padding: "0.2rem 0.6rem", borderRadius: "2px", marginBottom: "0.6rem" }}>
                ₹149 · तुरंत उत्तर
              </span>
              <h2 style={{ fontSize: "1.4rem", marginBottom: "0.2rem" }}>तुरंत उत्तर पाएं</h2>
              <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
                अपना प्रश्न चुनें — वास्तविक कुंडली-आधारित उत्तर मिनटों में
              </p>
            </div>

            <div className="tu-category-grid">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.key}
                  href={`/tools/turant-uttar?category=${cat.key}`}
                  className="tu-category-chip"
                  style={{ textDecoration: "none" }}
                >
                  <span className="tu-category-chip-icon"><Icon name={cat.icon} size={20} /></span>
                  <span className="tu-category-chip-text">{cat.chip.hi}</span>
                </Link>
              ))}
            </div>

            <p style={{ textAlign: "center", marginTop: "0.5rem" }}>
              <Link href="/tools/turant-uttar" style={{ fontSize: "0.85rem", color: "var(--maroon)", fontWeight: 600 }}>
                या अपना प्रश्न लिखें →
              </Link>
            </p>
          </PatrikaFrame>
        </Reveal>

        {/* ── जन्म समय शुद्धिकरण — featured, paid tool ── */}
        <Reveal>
          <PatrikaFrame style={{ marginBottom: "2.5rem", border: "1.5px solid var(--gold)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", flexWrap: "wrap" }}>
              <div className="service-card-icon" style={{ flexShrink: 0 }}>
                <Icon name="clock" size={26} />
              </div>
              <div style={{ flex: 1, minWidth: 220 }}>
                <span style={{ display: "inline-block", background: "var(--gold)", color: "var(--maroon-deep)", fontSize: "0.7rem", fontWeight: 700, padding: "0.2rem 0.6rem", borderRadius: "2px", marginBottom: "0.5rem" }}>
                  ₹1100 · जन्म समय शुद्धिकरण
                </span>
                <h2 style={{ fontSize: "1.25rem", marginBottom: "0.2rem" }}>जन्म समय पता नहीं?</h2>
                <p style={{ color: "var(--muted)", fontSize: "0.9rem", margin: 0 }}>
                  अपने जीवन की कुछ निश्चित घटनाएं बताएं — हम दशा-गणना से आपका सही जन्म समय (और आवश्यकता होने पर तारीख) निकालते हैं
                </p>
              </div>
              <Link href="/tools/time-rectification" className="btn btn-primary">
                शुरू करें →
              </Link>
            </div>
          </PatrikaFrame>
        </Reveal>

        <div className="grid-3">
          {TOOLS.map((tool, i) => (
            <Reveal key={tool.slug} delay={i * 60}>
              <Link href={`/tools/${tool.slug}`} style={{ textDecoration: "none", display: "block", height: "100%" }}>
                <div className="service-card" style={{ cursor: "pointer", height: "100%", display: "flex", flexDirection: "column" }}>
                  <div className="service-card-icon">
                    <Icon name={tool.icon} size={24} />
                  </div>
                  <div className="service-card-title">{tool.name}</div>
                  <div className="service-card-title-hi devanagari">{tool.nameHi}</div>
                  <p className="service-card-desc">{tool.desc}</p>
                  <div style={{ marginTop: "auto" }}>
                    <span className="btn btn-ghost btn-sm">Try Free →</span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="faq-cta" style={{ marginTop: "3rem" }}>
            <p style={{ color: "var(--ink-light)", marginBottom: "1rem", fontSize: "0.95rem" }}>
              A free tool shows you <em>what</em> is in your chart.
              A personal reading tells you <em>what it means for your life</em>.
            </p>
            <Link href="/book" className="btn btn-primary">Book a Personal Reading</Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
