import type { Metadata } from "next";
import Link from "next/link";
import { READINGS, readingName, readingDesc, readingBestFor } from "@/lib/readings";
import Reveal from "@/components/Reveal";
import Breadcrumbs from "@/components/Breadcrumbs";
import Icon from "@/components/Icon";

export const metadata: Metadata = {
  title: "Vedic Astrology Readings & Pricing",
  description:
    "Personal Vedic astrology readings by Astrologer Shivanii — birth chart, marriage matching, Prashna, annual forecast, live consultation and more. Flat transparent pricing.",
  alternates: { canonical: "/readings/" },
};

export default function ReadingsPage() {
  return (
    <section className="section">
      <div className="container">
        <Breadcrumbs crumbs={[{ name: "Home", href: "/" }, { name: "Readings" }]} />

        <h1 className="section-heading">Readings &amp; Pricing</h1>
        <p className="section-heading-hi devanagari">पाठन और मूल्य</p>
        <p style={{ textAlign: "center", color: "var(--muted)", maxWidth: "600px", margin: "0 auto 1rem" }}>
          Every reading is personal. Shivanii reads every chart herself — made for your chart and your
          questions, never a recycled report. Flat pricing, no hidden fees, no per-minute meters.
        </p>
        <p className="devanagari" style={{ textAlign: "center", color: "var(--maroon)", fontWeight: 600, fontSize: "0.95rem", maxWidth: "620px", margin: "0 auto 3rem" }}>
          ₹499 से शुरू — एक फ़िल्म टिकट से कम में, वर्षों काम आने वाला मार्गदर्शन। उत्तर सीधे आपके WhatsApp पर।
        </p>

        <div className="grid-3">
          {READINGS.map((r, i) => {
            const name = readingName(r.slug, "en");
            const nameHi = readingName(r.slug, "hi");
            const desc = readingDesc(r.slug, "en");
            const bestFor = readingBestFor(r.slug, "en");
            return (
              <Reveal key={r.slug} delay={i * 55}>
                <div className="service-card" style={{ display: "flex", flexDirection: "column", position: "relative", height: "100%" }}>
                  {r.popular && (
                    <span className="badge" style={{ position: "absolute", top: "1rem", right: "1rem", zIndex: 1 }}>
                      Most Loved
                    </span>
                  )}
                  <div className="service-card-icon">
                    <Icon name={r.icon} size={24} />
                  </div>
                  <div className="service-card-title">
                    <Link href={`/readings/${r.slug}`} style={{ color: "inherit", textDecoration: "none" }}>
                      {name}
                    </Link>
                  </div>
                  <div className="service-card-title-hi devanagari">{nameHi}</div>
                  <p className="service-card-desc" style={{ flex: 1 }}>
                    {desc.length > 130 ? `${desc.slice(0, 127)}…` : desc}
                  </p>
                  {bestFor && (
                    <div className="best-for" style={{ marginBottom: "0.5rem" }}>
                      <strong>✓ Best for:</strong>
                      <span>{bestFor}</span>
                    </div>
                  )}
                  {r.durationMin && (
                    <p style={{ fontSize: "0.78rem", color: "var(--muted)", marginBottom: "0.25rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                      <Icon name="clock" size={13} /> {r.durationMin} minutes, live
                    </p>
                  )}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "0.75rem", flexWrap: "wrap", gap: "0.5rem" }}>
                    <span className="service-card-price">₹{r.priceINR.toLocaleString("en-IN")}</span>
                    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                      <Link href={`/readings/${r.slug}`} className="btn btn-ghost btn-sm">
                        Details
                      </Link>
                      <Link href={`/book?reading=${r.slug}`} className="btn btn-secondary btn-sm">
                        Book Now
                      </Link>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal>
          <div className="faq-cta" style={{ marginTop: "3rem" }}>
            <p style={{ color: "var(--ink-light)", marginBottom: "1rem" }}>
              Not sure which reading is right for you? Start with a free 10-minute discovery call.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/contact" className="btn btn-ghost">Book Free Discovery Call</Link>
              <Link href="/faq" className="btn btn-ghost">Read the FAQ</Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
