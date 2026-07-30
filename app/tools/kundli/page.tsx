import type { Metadata } from "next";
import KundliTool from "./KundliTool";

export const metadata: Metadata = {
  title: "Free Kundli / Birth Chart Calculator",
  description:
    "Calculate your Vedic birth chart (Kundli) for free. Get planetary positions, yogas, current Vimshottari dasha, and Lagna personality. No sign-up needed.",
};

export default function Page() {
  return <KundliTool />;
}
