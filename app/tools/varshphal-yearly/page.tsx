import type { Metadata } from "next";
import Link from "next/link";
import VarshphalYearlyTool from "./VarshphalYearlyTool";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://astroshivanii.com";

export const metadata: Metadata = {
  title: "Yearly Horoscope ₹1,499 — Varshphal Forecast",
  description:
    "A full Varshphal (solar return) yearly forecast — career, finance, health, relationships and spiritual themes for your coming year, with your Varshesha and overall year score.",
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Varshphal Yearly Horoscope",
  description:
    "A full Varshphal (solar return) yearly forecast — career, finance, health, relationships and spiritual themes for your coming year.",
  url: `${SITE_URL}/tools/varshphal-yearly/`,
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "1499", priceCurrency: "INR" },
  provider: { "@type": "Person", name: "Shivanii", url: `${SITE_URL}/about/` },
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <VarshphalYearlyTool />
      <div className="container" style={{ maxWidth: "760px", margin: "-2rem auto 0", padding: "0 1rem 2.5rem", textAlign: "center" }}>
        <p style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
          Related: <Link href="/tools/kundli">Kundli / Birth Chart Calculator</Link> ·{" "}
          <Link href="/readings/annual-forecast">Book Annual Forecast</Link>
        </p>
      </div>
    </>
  );
}
