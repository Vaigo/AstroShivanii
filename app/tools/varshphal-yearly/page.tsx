import type { Metadata } from "next";
import VarshphalYearlyTool from "./VarshphalYearlyTool";

export const metadata: Metadata = {
  title: "Yearly Horoscope ₹1,499 — Varshphal Annual Forecast",
  description:
    "A full Varshphal (solar return) yearly forecast — career, finance, health, relationships and spiritual themes for your coming year, with your Varshesha and overall year score.",
};

export default function Page() {
  return <VarshphalYearlyTool />;
}
