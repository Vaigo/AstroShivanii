import type { Metadata } from "next";
import PalmistryTool from "./PalmistryTool";
import RelatedLinks from "@/components/RelatedLinks";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://astroshivanii.com";

export const metadata: Metadata = {
  title: "हस्तरेखा विश्लेषण ₹299 — Palmistry from Photos",
  description:
    "Upload photos of both your palms for a real Hast Rekha Shastra analysis — hand shape, lines, mounts and special marks, each with an honest confidence score, not a blanket guess.",
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Palmistry Reading (Hast Rekha Shastra)",
  description:
    "A real palmistry analysis from photos of both your palms — hand shape, lines, mounts and marks, with an honest confidence score per finding.",
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
        text: "Your photos are embedded only in your own downloadable PDF report — that is the one place they live. They are never stored anywhere else, never shared, and never used for anything but your reading.",
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
          <RelatedLinks links={[{ href: "/tools/kundli", en: "Kundli / Birth Chart", hi: "कुंडली / जन्म चार्ट" }, { href: "/tools/matching", en: "Marriage Matching", hi: "गुण मिलान" }]} />
        </p>
      </div>
    </>
  );
}
