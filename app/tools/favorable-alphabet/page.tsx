import type { Metadata } from "next";
import FavorableAlphabetTool from "./FavorableAlphabetTool";

export const metadata: Metadata = {
  title: "Free Favorable Alphabet Calculator — Cornerstone & Capstone Numerology",
  description:
    "Discover your name's Cornerstone (first letter) and Capstone (last letter) numerology meaning, career resonance, and recommended careers. Free calculator.",
};

export default function Page() {
  return <FavorableAlphabetTool />;
}
