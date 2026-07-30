import type { Metadata } from "next";
import RashifalTool from "./RashifalTool";

export const metadata: Metadata = {
  title: "Free Daily Rashifal — Vedic Horoscope",
  description:
    "Free daily Vedic horoscope (Rashifal) for all 12 rashis. Transit-based predictions for career, love, health, and finance. No sign-up needed.",
};

export default function Page() {
  return <RashifalTool />;
}
