import type { Metadata } from "next";
import Link from "next/link";
import KaalSarpTool from "./KaalSarpTool";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://astroshivanii.com";

export const metadata: Metadata = {
  title: "Free Kaal Sarp Dosha Checker — In Your Chart?",
  description:
    "Check whether Kaal Sarp Dosha is present in your birth chart, its direction, and which planets are involved. Free Vedic astrology calculator.",
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Kaal Sarp Dosha Checker",
  description:
    "Check whether Kaal Sarp Dosha is present in your birth chart, its direction, and which planets are involved.",
  url: `${SITE_URL}/tools/kaal-sarp-dosha/`,
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
  provider: { "@type": "Person", name: "Shivanii", url: `${SITE_URL}/about/` },
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <KaalSarpTool />
      <div className="container" style={{ maxWidth: "760px", margin: "-2rem auto 0", padding: "0 1rem 2.5rem", textAlign: "center" }}>
        <p style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
          Related: <Link href="/tools/kundli">Kundli / Birth Chart Calculator</Link> ·{" "}
          <Link href="/tools/sade-sati">Sade Sati Checker</Link>
        </p>
      </div>
    </>
  );
}
