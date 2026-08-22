import type { Metadata } from "next";
import Link from "next/link";
import TurantUttarTool from "./TurantUttarTool";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://astroshivanii.com";

export const metadata: Metadata = {
  title: "तुरंत उत्तर — Instant Answer ₹149",
  description:
    "Ask one focused question — love, marriage, career, finance, health, children, or foreign travel — and get a real chart-based quick-take answer in minutes, ₹149.",
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Turant Uttar — Instant Quick-Take Answer",
  description:
    "Ask one focused question and get a real chart-based quick-take answer in minutes.",
  url: `${SITE_URL}/tools/turant-uttar/`,
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "149", priceCurrency: "INR" },
  provider: { "@type": "Person", name: "Shivanii", url: `${SITE_URL}/about/` },
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <TurantUttarTool />
      <div className="container" style={{ maxWidth: "760px", margin: "-2rem auto 0", padding: "0 1rem 2.5rem", textAlign: "center" }}>
        <p style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
          Related: <Link href="/readings/ask-one-question">Ask Shivanii Directly</Link> ·{" "}
          <Link href="/guides/birth-time-missing-astrology">No birth time? What astrology can still tell you</Link>
        </p>
      </div>
    </>
  );
}
