import type { Metadata } from "next";
import Link from "next/link";
import { GUIDES } from "@/lib/guides";
import Breadcrumbs from "@/components/Breadcrumbs";
import Icon from "@/components/Icon";

export const metadata: Metadata = {
  title: "Vedic Astrology Guides — Kundli, Guna Milan, Sade Sati & More",
  description:
    "Plain-language guides to Vedic astrology: what a Kundli shows, how 36-guna matching works, the truth about Sade Sati and Mangal dosha, numerology basics, and more.",
  alternates: { canonical: "/guides/" },
};

export default function GuidesPage() {
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: "900px" }}>
        <Breadcrumbs crumbs={[{ name: "Home", href: "/" }, { name: "Guides" }]} />

        <h1 className="section-heading">Vedic Astrology Guides</h1>
        <p className="section-heading-hi devanagari">सरल भाषा में ज्योतिष</p>
        <p style={{ textAlign: "center", color: "var(--muted)", margin: "0 auto 2.5rem", maxWidth: "620px", fontSize: "0.95rem" }}>
          Honest, jargon-free explanations — what the classics actually say, what apps get wrong,
          and no fear-selling anywhere.
        </p>

        <div className="guide-grid">
          {GUIDES.map((g) => (
            <Link key={g.slug} href={`/guides/${g.slug}`} className="guide-card">
              <div className="guide-card-icon">
                <Icon name={g.icon} size={20} />
              </div>
              <div>
                <h2 className="guide-card-title">{g.title}</h2>
                <p className="guide-card-desc">{g.description}</p>
                <span className="guide-card-meta">
                  {g.readMins} min read · <span className="devanagari">{g.titleHi}</span>
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="faq-cta">
          <p style={{ color: "var(--muted)", marginBottom: "1rem", fontSize: "0.95rem" }}>
            Prefer answers about your own chart?
          </p>
          <Link href="/book" className="btn btn-primary">Book a Personal Reading</Link>
        </div>
      </div>
    </section>
  );
}
