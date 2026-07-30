import type { Metadata } from "next";
import NumerologyTool from "./NumerologyTool";

export const metadata: Metadata = {
  title: "Free Numerology — Mulank, Bhagyank, Lo Shu Grid, Karmic Numbers",
  description: "Calculate your Mulank (psychic number), Bhagyank (destiny number), Name Number, and Lo Shu Grid with Karmic Lessons and Karmic Debt — free, instant, no sign-up.",
};

export default function NumerologyPage() {
  return <NumerologyTool />;
}
