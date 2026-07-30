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
  },
};

export default function Page() {
  return <HomePage />;
}
