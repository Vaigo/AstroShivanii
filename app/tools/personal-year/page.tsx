import type { Metadata } from "next";
import PersonalYearTool from "./PersonalYearTool";

export const metadata: Metadata = {
  title: "Free Personal Year Number Calculator — Numerology",
  description:
    "Calculate your Personal Year Number and discover this year's dominant theme, ruling planet, gemstone, and favourable days. Free numerology calculator.",
};

export default function Page() {
  return <PersonalYearTool />;
}
