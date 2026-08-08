import type { Metadata } from "next";
import BaalKundliTool from "./BaalKundliTool";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://astroshivanii.com";

export const metadata: Metadata = {
  title: "बाल कुंडली — Free Baby Kundli, Naming Syllable",
  description:
    "Create your child's free birth chart — auspicious naming syllable (नामाक्षर), temperament, health tendencies, and education direction, calculated from real Vedic astrology.",
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Baal Kundli — Baby Birth Chart Calculator",
  description:
    "Create your child's free birth chart — auspicious naming syllable, temperament, health tendencies, and education direction.",
  url: `${SITE_URL}/tools/baal-kundli/`,
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
  provider: { "@type": "Person", name: "Shivanii", url: `${SITE_URL}/about/` },
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <BaalKundliTool />
    </>
  );
}
