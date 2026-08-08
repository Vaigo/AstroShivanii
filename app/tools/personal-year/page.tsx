import type { Metadata } from "next";
import Link from "next/link";
import PersonalYearTool from "./PersonalYearTool";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://astroshivanii.com";

export const metadata: Metadata = {
  title: "Free Personal Year Number Calculator",
  description:
    "Calculate your Personal Year Number and discover this year's dominant theme, ruling planet, gemstone, and favourable days. Free numerology calculator.",
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Personal Year Number Calculator",
  description:
    "Calculate your Personal Year Number and discover this year's dominant theme, ruling planet, gemstone, and favourable days.",
  url: `${SITE_URL}/tools/personal-year/`,
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
  provider: { "@type": "Person", name: "Shivanii", url: `${SITE_URL}/about/` },
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <PersonalYearTool />
      <div className="container" style={{ maxWidth: "760px", margin: "-2rem auto 0", padding: "0 1rem 2.5rem", textAlign: "center" }}>
        <p style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
          Related: <Link href="/tools/numerology">Numerology Calculator</Link> ·{" "}
          <Link href="/tools/numerology-suite">Numerology Compatibility Suite</Link>
        </p>
      </div>
    </>
  );
}
