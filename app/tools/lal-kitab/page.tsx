import type { Metadata } from "next";
import LalKitabTool from "./LalKitabTool";

export const metadata: Metadata = {
  title: "Free Lal Kitab Calculator — Debts, Pakka Ghar & Remedies",
  description:
    "Calculate your Lal Kitab chart — planetary houses, active debts (karz), pakka ghar, and practical remedies (upayas). Free Vedic astrology calculator.",
};

export default function Page() {
  return <LalKitabTool />;
}
