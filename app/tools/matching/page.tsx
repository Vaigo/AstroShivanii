import type { Metadata } from "next";
import MatchingTool from "./MatchingTool";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://astroshivanii.com";

export const metadata: Metadata = {
  title: "Free Marriage Matching (Guna Milan) Calculator",
  description:
    "Free Vedic Ashtakoot Guna Milan calculator — 36-point compatibility score, Mangal Dosha check, Nadi analysis. No sign-up needed.",
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Marriage Matching (Guna Milan) Calculator",
  description:
    "Vedic Ashtakoot Guna Milan calculator — 36-point compatibility score, Mangal Dosha check, Nadi analysis.",
  url: `${SITE_URL}/tools/matching/`,
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
  provider: { "@type": "Person", name: "Shivanii", url: `${SITE_URL}/about/` },
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <MatchingTool />
    </>
  );
}
