import { READINGS, readingName } from "@/lib/readings";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://astroshivanii.com";

/**
 * Site-wide JSON-LD: WebSite, Person (Shivanii), and ProfessionalService
 * with the full reading catalogue as offers. Rendered once in the root layout.
 */
export default function StructuredData() {
  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    // "AstroShivanii" (matching the domain) is the primary site name Google
    // shows as the SERP site-name label; the double-i spelling is what
    // distinguishes us from astroshivani.com. Without this exact token the
    // brand query "astro shivanii" had zero text evidence pointing here.
    name: "AstroShivanii",
    alternateName: ["Astro Shivanii", "Astrologer Shivanii", "एस्ट्रो शिवानी", "ज्योतिषाचार्य शिवानी"],
    description:
      "Personal Vedic astrology readings in Hindi & English — birth chart, marriage matching, Prashna, annual forecast and more.",
    inLanguage: ["en-IN", "hi-IN"],
  };

  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/#shivanii`,
    name: "Shivanii",
    // includes the single-i spelling people actually type into search
    alternateName: ["ज्योतिषाचार्य शिवानी", "Astro Shivanii", "Astrologer Shivanii", "Astrologer Shivani", "Shivani"],
    jobTitle: "Vedic Astrologer",
    url: `${SITE_URL}/about/`,
    knowsLanguage: ["Hindi", "English"],
    knowsAbout: [
      "Vedic Astrology",
      "Kundli Reading",
      "Guna Milan",
      "Prashna Jyotish",
      "KP Astrology",
      "Lal Kitab",
      "Bhrigu Nadi",
      "Numerology",
    ],
    worksFor: { "@id": `${SITE_URL}/#service` },
  };

  const service = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}/#service`,
    name: "AstroShivanii — Vedic Astrology Readings by Astrologer Shivanii",
    url: SITE_URL,
    description:
      "Personal Vedic astrology consultations by Astrologer Shivanii. Every chart read personally — no templates. Hindi & English.",
    priceRange: "₹499–₹3,999",
    areaServed: "IN",
    availableLanguage: ["Hindi", "English"],
    founder: { "@id": `${SITE_URL}/#shivanii` },
    makesOffer: READINGS.map((r) => ({
      "@type": "Offer",
      name: readingName(r.slug, "en"),
      url: `${SITE_URL}/readings/${r.slug}/`,
      price: r.priceINR,
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
    })),
  };

  return (
    <>
      {[website, person, service].map((obj, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(obj) }}
        />
      ))}
    </>
  );
}
