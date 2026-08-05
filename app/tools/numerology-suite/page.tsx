import type { Metadata } from "next";
import NumerologySuiteTool from "./NumerologySuiteTool";

export const metadata: Metadata = {
  title: "Numerology Compatibility Suite ₹299 — Love, Career, Business & Marriage",
  description:
    "A 4-in-1 numerology report from your Mulank and Bhagyank — love style, career fit, business partnerships, and marriage compatibility, in one instant report.",
};

export default function Page() {
  return <NumerologySuiteTool />;
}
