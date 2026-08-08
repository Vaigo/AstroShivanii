import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { READINGS, readingName, readingDesc } from "@/lib/readings";
import { truncateDescription } from "@/lib/seo";
import ReadingDetail from "./ReadingDetail";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://astroshivanii.com";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return READINGS.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const reading = READINGS.find((r) => r.slug === slug);
  if (!reading) return {};
  const name = readingName(slug, "en");
  const desc = readingDesc(slug, "en");
  const shortDesc = truncateDescription(desc);
  return {
    title: `${name} — ₹${reading.priceINR.toLocaleString("en-IN")}, Flat Pricing`,
    description: shortDesc,
    alternates: { canonical: `/readings/${slug}/` },
    openGraph: {
      title: name,
      description: shortDesc,
      // Page-level openGraph replaces the layout's wholesale in Next.js (no
      // deep merge), so images must be repeated here — see app/page.tsx.
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Astrologer Shivanii — Personal Vedic Astrology Readings" }],
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const reading = READINGS.find((r) => r.slug === slug);
  if (!reading) notFound();

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE_URL}/readings/${slug}/#service`,
    serviceType: readingName(slug, "en"),
    name: readingName(slug, "en"),
    description: readingDesc(slug, "en"),
    url: `${SITE_URL}/readings/${slug}/`,
    provider: { "@type": "Person", name: "Shivanii", url: `${SITE_URL}/about/` },
    areaServed: "IN",
    availableLanguage: ["Hindi", "English"],
    offers: {
      "@type": "Offer",
      price: reading.priceINR,
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/readings/${slug}/`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <ReadingDetail reading={reading} />
    </>
  );
}
