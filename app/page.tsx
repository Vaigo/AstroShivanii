import type { Metadata } from "next";
import HomePage from "@/components/HomePage";

export const metadata: Metadata = {
  title: "Astrologer Shivanii — Personal Vedic Astrology Readings",
  description:
    "Personal Vedic astrology readings by Astrologer Shivanii. Kundli, marriage matching, Prashna, annual forecast and more. Hindi & English. Flat transparent pricing.",
  openGraph: {
    title: "Astrologer Shivanii — Personal Vedic Astrology Readings",
    description:
      "Every reading personal. Read by Shivanii herself. Kundli, Guna Milan, Prashna, Varshphal and more. Hindi-first. Flat pricing.",
    url: "/",
    // Next.js does NOT deep-merge `openGraph` with the layout's — a page-level
    // block replaces it wholesale, so `images` must be repeated here or the
    // og:image tag silently disappears for this page (confirmed via built
    // output before this fix).
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Astrologer Shivanii — Personal Vedic Astrology Readings" }],
  },
};

export default function Page() {
  return <HomePage />;
}
