import type { Metadata } from "next";
import KaalSarpTool from "./KaalSarpTool";

export const metadata: Metadata = {
  title: "Free Kaal Sarp Dosha Checker — Is It in Your Birth Chart?",
  description:
    "Check whether Kaal Sarp Dosha is present in your birth chart, its direction, and which planets are involved. Free Vedic astrology calculator.",
};

export default function Page() {
  return <KaalSarpTool />;
}
