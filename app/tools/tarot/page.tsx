import type { Metadata } from "next";
import TarotTool from "./TarotTool";

export const metadata: Metadata = {
  title: "Free Vedic Tarot Reading",
  description:
    "Free tarot card reading with Vedic astrological context. 3-card spread for past, present, and future. No sign-up needed.",
};

export default function Page() {
  return <TarotTool />;
}
