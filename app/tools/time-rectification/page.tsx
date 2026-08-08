import type { Metadata } from "next";
import Link from "next/link";
import TimeRectificationTool from "./TimeRectificationTool";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://astroshivanii.com";

export const metadata: Metadata = {
  title: "जन्म समय शुद्धिकरण — Birth Time Rectification ₹1100",
  description:
    "Don't know your exact birth time? Tell us a few certain life events — marriage, job change, an accident — and we'll narrow down your real birth time using dasha analysis, cross-checked with the KP ruling-planet method.",
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Birth Time Rectification",
  description:
    "Narrow down your real birth time from a few certain life events, using dasha analysis cross-checked with the KP ruling-planet method.",
  url: `${SITE_URL}/tools/time-rectification/`,
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "1100", priceCurrency: "INR" },
  provider: { "@type": "Person", name: "Shivanii", url: `${SITE_URL}/about/` },
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <TimeRectificationTool />
      <div className="container" style={{ maxWidth: "760px", margin: "-2rem auto 0", padding: "0 1rem 2.5rem", textAlign: "center" }}>
        <p style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
          Related: <Link href="/guides/birth-time-missing-astrology">No birth time? What astrology can still tell you</Link> ·{" "}
          <Link href="/tools/kundli">Kundli / Birth Chart Calculator</Link>
        </p>
      </div>
    </>
  );
}
