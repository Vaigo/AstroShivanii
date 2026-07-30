import type { Metadata } from "next";
import SadeSatiTool from "./SadeSatiTool";

export const metadata: Metadata = {
  title: "Free Sade Sati Check — Is Saturn's 7.5-year Period Active?",
  description:
    "Check if Saturn's Sade Sati is currently active in your chart. Free Vedic astrology calculator — enter your birth details.",
};

export default function Page() {
  return <SadeSatiTool />;
}
