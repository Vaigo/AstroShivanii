import type { Metadata } from "next";
import Link from "next/link";
import LalKitabTool from "./LalKitabTool";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://astroshivanii.com";

export const metadata: Metadata = {
  title: "Free Lal Kitab Calculator — Debts & Remedies",
  description:
    "Calculate your Lal Kitab chart — planetary houses, active debts (karz), pakka ghar, and practical remedies (upayas). Free Vedic astrology calculator.",
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Lal Kitab Calculator",
  description:
    "Calculate your Lal Kitab chart — planetary houses, active debts (karz), pakka ghar, and practical remedies (upayas).",
  url: `${SITE_URL}/tools/lal-kitab/`,
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
  provider: { "@type": "Person", name: "Shivanii", url: `${SITE_URL}/about/` },
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <LalKitabTool />
      <div className="container" style={{ maxWidth: "760px", margin: "-2rem auto 0", padding: "0 1rem 2.5rem", textAlign: "center" }}>
        <p style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
          Related: <Link href="/readings/lal-kitab-remedies">Book Lal Kitab Remedies</Link> ·{" "}
          <Link href="/tools/kundli">Kundli / Birth Chart Calculator</Link>
        </p>
      </div>
    </>
  );
}
