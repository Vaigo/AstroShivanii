import type { Metadata } from "next";
import KarmicDebtTool from "./KarmicDebtTool";

export const metadata: Metadata = {
  title: "Free Karmic Debt & Missing Numbers Checker — Numerology",
  description:
    "Check for karmic debt numbers (13, 14, 16, 19) and missing/repeated numbers in your birth date, with remedies. Free numerology calculator.",
};

export default function Page() {
  return <KarmicDebtTool />;
}
