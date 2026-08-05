import type { Metadata } from "next";
import LuckyColorsTool from "./LuckyColorsTool";

export const metadata: Metadata = {
  title: "Free Lucky Color Calculator — Auspicious Colors from Your Birth Chart",
  description:
    "Find your auspicious and inauspicious colors based on your Lagna and Nakshatra lord. Free Vedic astrology calculator — enter your birth details.",
};

export default function Page() {
  return <LuckyColorsTool />;
}
