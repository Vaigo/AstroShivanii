import type { Metadata } from "next";
import AboutPage from "./AboutPage";

export const metadata: Metadata = {
  // The name-query landing page: carries both spellings (Shivanii / Shivani)
  // and the Hindi name — the "शिवानी ज्योतिषी" SERP has no real astrologer
  // ranking at all (recon 2026-09-01), so this page targets it directly.
  title: "Astrologer Shivanii (ज्योतिषाचार्य शिवानी) — About",
  description:
    "Meet Astrologer Shivanii (Shivani) — शिवानी ज्योतिषी. A genuine Vedic astrology practitioner offering personal readings in Hindi and English. Her story, credentials, and approach.",
  alternates: { canonical: "/about/" },
};

export default function Page() {
  return <AboutPage />;
}
