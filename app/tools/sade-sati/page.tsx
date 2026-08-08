import type { Metadata } from "next";
import SadeSatiTool from "./SadeSatiTool";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://astroshivanii.com";

export const metadata: Metadata = {
  title: "Free Sade Sati Checker — Is It Active?",
  description:
    "Check if Saturn's Sade Sati is currently active in your chart. Free Vedic astrology calculator — enter your birth details.",
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Sade Sati Checker",
  description: "Check if Saturn's Sade Sati is currently active in your chart.",
  url: `${SITE_URL}/tools/sade-sati/`,
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
  provider: { "@type": "Person", name: "Shivanii", url: `${SITE_URL}/about/` },
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <SadeSatiTool />
    </>
  );
}
