import type { Metadata } from "next";
import Link from "next/link";
import TarotTool from "./TarotTool";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://astroshivanii.com";

export const metadata: Metadata = {
  title: "Free Vedic Tarot Reading",
  description:
    "Free tarot card reading with Vedic astrological context. 3-card spread for past, present, and future. No sign-up needed.",
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Vedic Tarot Reading",
  description:
    "Free tarot card reading with Vedic astrological context. 3-card spread for past, present, and future.",
  url: `${SITE_URL}/tools/tarot/`,
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
  provider: { "@type": "Person", name: "Shivanii", url: `${SITE_URL}/about/` },
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <TarotTool />
      <div className="container" style={{ maxWidth: "760px", margin: "-2rem auto 0", padding: "0 1rem 2.5rem", textAlign: "center" }}>
        <p style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
          Related: <Link href="/tools/turant-uttar">Turant Uttar — Instant Answer</Link> ·{" "}
          <Link href="/readings/ask-one-question">Book Ask One Question</Link>
        </p>
      </div>
    </>
  );
}
