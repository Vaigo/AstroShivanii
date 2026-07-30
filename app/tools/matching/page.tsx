import type { Metadata } from "next";
import MatchingTool from "./MatchingTool";

export const metadata: Metadata = {
  title: "Free Marriage Matching (Guna Milan) Calculator",
  description:
    "Free Vedic Ashtakoot Guna Milan calculator — 36-point compatibility score, Mangal Dosha check, Nadi analysis. No sign-up needed.",
};

export default function Page() {
  return <MatchingTool />;
}
