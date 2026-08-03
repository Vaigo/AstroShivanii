import type { Metadata } from "next";
import BaalKundliTool from "./BaalKundliTool";

export const metadata: Metadata = {
  title: "बाल कुंडली — Free Baby & Child Kundli, Naming Syllable",
  description:
    "Create your child's free birth chart — auspicious naming syllable (नामाक्षर), temperament, health tendencies, and education direction, calculated from real Vedic astrology.",
};

export default function Page() {
  return <BaalKundliTool />;
}
