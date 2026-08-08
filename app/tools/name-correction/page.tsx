import type { Metadata } from "next";
import Link from "next/link";
import NameCorrectionTool from "./NameCorrectionTool";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://astroshivanii.com";

export const metadata: Metadata = {
  title: "Name Correction Checker ₹501 — All Name Types",
  description:
    "Check whether a personal, business, or other name's numerology (Destiny number) harmonises with its owner's Life Path, with natural, pronounceable spelling correction suggestions. ₹501, instant result.",
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Name Correction Checker",
  description:
    "Check whether a personal, business, or other name's numerology harmonises with its owner's Life Path, with natural, pronounceable spelling correction suggestions.",
  url: `${SITE_URL}/tools/name-correction/`,
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "501", priceCurrency: "INR" },
  provider: { "@type": "Person", name: "Shivanii", url: `${SITE_URL}/about/` },
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <NameCorrectionTool />
      <div className="container" style={{ maxWidth: "760px", margin: "-2rem auto 0", padding: "0 1rem 2.5rem", textAlign: "center" }}>
        <p style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
          Related: <Link href="/guides/mulank-bhagyank-numerology">Mulank & Bhagyank Explained</Link> ·{" "}
          <Link href="/tools/numerology">Numerology Calculator</Link>
        </p>
      </div>
    </>
  );
}
