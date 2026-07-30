import type { Metadata } from "next";
import AboutPage from "./AboutPage";

export const metadata: Metadata = {
  title: "About Astrologer Shivanii",
  description:
    "Meet Astrologer Shivanii — a genuine Vedic astrology practitioner offering personal readings in Hindi and English. Her story, credentials, and approach.",
};

export default function Page() {
  return <AboutPage />;
}
