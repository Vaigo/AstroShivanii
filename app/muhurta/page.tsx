import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import { MUHURTA_PAGES } from "@/lib/muhurta-pages";

export const metadata: Metadata = {
  title: "शुभ मुहूर्त 2026 — Muhurat Dates for Every Occasion",
  description:
    "Shubh muhurat 2026 for vehicle purchase, griha pravesh, vivah (marriage), property, business opening and naamkaran — real computed dates with each day's good hours, updated twice a month.",
  alternates: { canonical: "/muhurta/" },
};

export default function Page() {
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: "860px" }}>
        <Breadcrumbs crumbs={[{ name: "Home", href: "/" }, { name: "Muhurat 2026" }]} />
        <h1 className="section-heading">शुभ मुहूर्त 2026</h1>
        <p className="section-heading-hi devanagari">
          हर काम के लिए खगोलीय गणना से जांचे हुए शुभ दिन — अनुमान नहीं, गणना
        </p>

        <div className="tool-explainer" style={{ textAlign: "center", marginBottom: "2rem" }}>
          <p className="devanagari" style={{ fontWeight: 600, color: "var(--maroon)" }}>
            नीचे हर विषय की सूची में नक्षत्र-तिथि से जांची तारीखें और हर दिन के शुभ चौघड़िया समय मिलेंगे।
          </p>
          <p>
            Every list is computed astronomically (Lahiri ayanamsa) and refreshed twice a month — never a
            hand-copied calendar.
          </p>
        </div>

        <div className="guide-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1rem" }}>
          {MUHURTA_PAGES.map((p) => (
            <Link key={p.slug} href={`/muhurta/${p.slug}/`} className="guide-card" style={{ padding: "1.1rem 1.2rem" }}>
              <strong className="devanagari" style={{ display: "block", marginBottom: "0.3rem" }}>{p.hiTitle}</strong>
              <span className="devanagari" style={{ fontSize: "0.82rem", color: "var(--muted)" }}>{p.hiHook}</span>
            </Link>
          ))}
        </div>

        <p className="guide-p devanagari" style={{ textAlign: "center", marginTop: "2rem" }}>
          अपनी कुंडली से जांची व्यक्तिगत तारीखें: <Link href="/tools/shubh-muhurta/">शुभ मुहूर्त टूल</Link> · आज का
          समय: <Link href="/rahu-kaal/">राहु काल</Link>
        </p>
      </div>
    </section>
  );
}
