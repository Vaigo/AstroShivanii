import type { Metadata } from "next";
import Link from "next/link";
import LuckyColorsTool from "./LuckyColorsTool";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://astroshivanii.com";

export const metadata: Metadata = {
  title: "Free Lucky Color Calculator — Vedic Astrology",
  description:
    "Find your auspicious and inauspicious colors based on your Lagna and Nakshatra lord. Free Vedic astrology calculator — enter your birth details.",
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Lucky Color Calculator",
  description:
    "Find your auspicious and inauspicious colors based on your Lagna and Nakshatra lord.",
  url: `${SITE_URL}/tools/lucky-colors/`,
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
  provider: { "@type": "Person", name: "Shivanii", url: `${SITE_URL}/about/` },
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <LuckyColorsTool />
      <div className="container" style={{ maxWidth: "760px", margin: "-2rem auto 0", padding: "0 1rem 2.5rem", textAlign: "center" }}>
        <p style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
          Related: <Link href="/tools/numerology">Numerology Calculator</Link> ·{" "}
          <Link href="/tools/favorable-alphabet">Favorable Alphabet Calculator</Link>
        </p>
      </div>
    </>
  );
}
