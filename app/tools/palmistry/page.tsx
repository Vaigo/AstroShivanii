import type { Metadata } from "next";
import Link from "next/link";
import PalmistryTool from "./PalmistryTool";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://astroshivanii.com";

export const metadata: Metadata = {
  title: "Palmistry Reading ₹299 — Hast Rekha Shastra from Your Photo",
  description:
    "Upload a photo of your palm for a real Hast Rekha Shastra analysis — hand shape, lines, mounts and special marks, each with an honest confidence score, not a blanket guess.",
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Palmistry Reading (Hast Rekha Shastra)",
  description:
    "A real palmistry analysis from a photo of your palm — hand shape, lines, mounts and marks, with an honest confidence score per finding.",
  url: `${SITE_URL}/tools/palmistry/`,
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "299", priceCurrency: "INR" },
  provider: { "@type": "Person", name: "Shivanii", url: `${SITE_URL}/about/` },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How accurate is a palmistry reading from a photo?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Every finding comes with its own confidence score based on how clearly your specific photo showed that feature — a blurry or unclear photo will honestly show lower confidence rather than a forced guess. A line or mark that can't be confidently identified is reported as such, not invented.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need to upload both hands?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes — both hands are required. This is a real classical technique, not an add-on: one hand shows your innate tendency, the other shows how it has developed, and the reading compares the two.",
      },
    },
    {
      "@type": "Question",
      name: "Is my photo stored?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No — your photo is processed for the analysis and then discarded. Only the resulting reading is kept in your order history.",
      },
    },
  ],
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <PalmistryTool />
      <div className="container" style={{ maxWidth: "760px", margin: "-2rem auto 0", padding: "0 1rem 2.5rem", textAlign: "center" }}>
        <p style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
          Related: <Link href="/tools/kundli">Kundli / Birth Chart</Link> ·{" "}
          <Link href="/tools/matching">Marriage Matching</Link>
        </p>
      </div>
    </>
  );
}
