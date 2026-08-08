import type { Metadata } from "next";
import Link from "next/link";
import FavorableAlphabetTool from "./FavorableAlphabetTool";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://astroshivanii.com";

export const metadata: Metadata = {
  title: "Free Favorable Alphabet Calculator — Numerology",
  description:
    "Discover your name's Cornerstone (first letter) and Capstone (last letter) numerology meaning, career resonance, and recommended careers. Free calculator.",
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Favorable Alphabet Calculator",
  description:
    "Discover your name's Cornerstone (first letter) and Capstone (last letter) numerology meaning, career resonance, and recommended careers.",
  url: `${SITE_URL}/tools/favorable-alphabet/`,
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
  provider: { "@type": "Person", name: "Shivanii", url: `${SITE_URL}/about/` },
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <FavorableAlphabetTool />
      <div className="container" style={{ maxWidth: "760px", margin: "-2rem auto 0", padding: "0 1rem 2.5rem", textAlign: "center" }}>
        <p style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
          Related: <Link href="/tools/numerology">Numerology Calculator</Link> ·{" "}
          <Link href="/tools/name-correction">Name Correction Checker</Link>
        </p>
      </div>
    </>
  );
}
