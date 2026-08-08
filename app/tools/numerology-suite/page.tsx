import type { Metadata } from "next";
import Link from "next/link";
import NumerologySuiteTool from "./NumerologySuiteTool";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://astroshivanii.com";

export const metadata: Metadata = {
  title: "Numerology Suite ₹299 — Love, Career & Marriage",
  description:
    "A 4-in-1 numerology report from your Mulank and Bhagyank — love style, career fit, business partnerships, and marriage compatibility, in one instant report.",
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Numerology Compatibility Suite",
  description:
    "A 4-in-1 numerology report from your Mulank and Bhagyank — love style, career fit, business partnerships, and marriage compatibility.",
  url: `${SITE_URL}/tools/numerology-suite/`,
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "299", priceCurrency: "INR" },
  provider: { "@type": "Person", name: "Shivanii", url: `${SITE_URL}/about/` },
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <NumerologySuiteTool />
      <div className="container" style={{ maxWidth: "760px", margin: "-2rem auto 0", padding: "0 1rem 2.5rem", textAlign: "center" }}>
        <p style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
          Related: <Link href="/tools/numerology">Numerology Calculator</Link> ·{" "}
          <Link href="/tools/personal-year">Personal Year Number Calculator</Link>
        </p>
      </div>
    </>
  );
}
