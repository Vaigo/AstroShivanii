import type { Metadata } from "next";
import ContactPage from "./ContactPage";

export const metadata: Metadata = {
  title: "Contact — WhatsApp, Email & Free Discovery Call",
  description: "Contact Astrologer Shivanii via WhatsApp, email, or book a free 10-minute discovery call.",
};

export default function Page() {
  return <ContactPage />;
}
