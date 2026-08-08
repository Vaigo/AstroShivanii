import type { Metadata } from "next";
import KundliTool from "./KundliTool";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://astroshivanii.com";

export const metadata: Metadata = {
  title: "Free Kundli / Birth Chart Calculator",
  description:
    "Calculate your Vedic birth chart (Kundli) for free. Get planetary positions, yogas, current Vimshottari dasha, and Lagna personality. No sign-up needed.",
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Kundli / Birth Chart Calculator",
  description:
    "Calculate your Vedic birth chart (Kundli) for free. Get planetary positions, yogas, current Vimshottari dasha, and Lagna personality.",
  url: `${SITE_URL}/tools/kundli/`,
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
  provider: { "@type": "Person", name: "Shivanii", url: `${SITE_URL}/about/` },
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <KundliTool />
    </>
  );
}
