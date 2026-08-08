import type { Metadata } from "next";
import Link from "next/link";
import NumerologyTool from "./NumerologyTool";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://astroshivanii.com";

export const metadata: Metadata = {
  title: "Free Numerology — Mulank, Bhagyank & Lo Shu Grid",
  description: "Calculate your Mulank (psychic number), Bhagyank (destiny number), Name Number, and Lo Shu Grid with Karmic Lessons and Karmic Debt — free, instant, no sign-up.",
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Numerology Calculator",
  description:
    "Calculate your Mulank (psychic number), Bhagyank (destiny number), Name Number, and Lo Shu Grid with Karmic Lessons and Karmic Debt.",
  url: `${SITE_URL}/tools/numerology/`,
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
  provider: { "@type": "Person", name: "Shivanii", url: `${SITE_URL}/about/` },
};

export default function NumerologyPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <NumerologyTool />
      <div className="container" style={{ maxWidth: "760px", margin: "-2rem auto 0", padding: "0 1rem 2.5rem", textAlign: "center" }}>
        <p style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
          Related: <Link href="/guides/mulank-bhagyank-numerology">Mulank & Bhagyank Explained</Link> ·{" "}
          <Link href="/tools/name-correction">Name Correction Checker</Link>
        </p>
      </div>
    </>
  );
}
