import type { Metadata } from "next";
import TimeRectificationTool from "./TimeRectificationTool";

export const metadata: Metadata = {
  title: "जन्म समय शुद्धिकरण — Birth Time Rectification ₹1011",
  description:
    "Don't know your exact birth time? Tell us a few certain life events — marriage, job change, an accident — and we'll narrow down your real birth time using dasha analysis, cross-checked with the KP ruling-planet method.",
};

export default function Page() {
  return <TimeRectificationTool />;
}
