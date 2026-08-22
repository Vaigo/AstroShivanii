import type { Metadata } from "next";
import Link from "next/link";
import ShubhMuhurtaTool from "./ShubhMuhurtaTool";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://astroshivanii.com";

export const metadata: Metadata = {
  title: "शुभ मुहूर्त ₹199 — Personal Muhurta from Your Kundli",
  description:
    "Best dates in the next 3 months for buying a vehicle, property, starting a business, griha pravesh or travel — screened against YOUR birth chart: tarabala, chandrashtama, karaka strength, tithi-vara-nakshatra shuddhi.",
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Shubh Muhurta — Personal Muhurta Finder",
  description:
    "Kundli-based auspicious date finder — the best dates in the next 3 months for a vehicle, property, business, griha pravesh, marriage or journey, personalised to one birth chart.",
  url: `${SITE_URL}/tools/shubh-muhurta/`,
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "199", priceCurrency: "INR" },
  provider: { "@type": "Person", name: "Shivanii", url: `${SITE_URL}/about/` },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How is this different from a printed panchang or muhurat list?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Printed muhurat lists are the same for everyone. This tool checks each date against YOUR birth chart — tarabala from your birth nakshatra, the chandrashtama veto from your Moon sign, and the condition of the purpose's karaka planet in your chart — so the same date can pass for one person and fail for another.",
      },
    },
    {
      "@type": "Question",
      name: "What exactly is checked before a date is suggested?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Five layers: a purpose-suitable nakshatra, a favorable tithi (Rikta tithis, Ashtami and Amavasya excluded), a purpose-suitable weekday, tarabala from your own birth star (Vipat, Pratyari and Vadha days removed), and the chandrashtama veto. Each surviving date also carries its good choghadiya time-windows, computed from your city's actual sunrise.",
      },
    },
    {
      "@type": "Question",
      name: "Is this enough to fix a wedding date?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "It's the same first screening a traditional astrologer performs (panchang-shuddhi plus personal tarabala). For major ceremonies like marriage or griha pravesh, the final date should additionally be confirmed with lagna-shuddhi — fixing the exact rising sign of the moment — which Shivanii does personally.",
      },
    },
  ],
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <ShubhMuhurtaTool />
      <p style={{ textAlign: "center", fontSize: "0.85rem", color: "var(--muted)", paddingBottom: "2.5rem" }}>
        Related: <Link href="/tools/panchang">Panchang</Link> · <Link href="/tools/kundli">Kundli / Birth Chart</Link> ·{" "}
        <Link href="/readings/ask-one-question">Ask Shivanii Directly</Link>
      </p>
    </>
  );
}
