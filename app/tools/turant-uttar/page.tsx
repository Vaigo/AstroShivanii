import type { Metadata } from "next";
import TurantUttarTool from "./TurantUttarTool";

export const metadata: Metadata = {
  title: "तुरंत उत्तर पाएं — Instant Quick-Take Answer ₹149",
  description:
    "Ask one focused question — love, marriage, career, finance, health, children, or foreign travel — and get a real chart-based quick-take answer in minutes, ₹149.",
};

export default function Page() {
  return <TurantUttarTool />;
}
