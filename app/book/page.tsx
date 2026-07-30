import type { Metadata } from "next";
import BookPage from "./BookPage";

export const metadata: Metadata = {
  title: "Book a Personal Vedic Astrology Reading",
  description:
    "Book a personal Vedic astrology reading with Astrologer Shivanii. Secure payment via Razorpay. Readings delivered within 48 hours.",
};

export default function Page() {
  return <BookPage />;
}
