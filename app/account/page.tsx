import type { Metadata } from "next";
import AccountPage from "./AccountPage";

export const metadata: Metadata = {
  title: "मेरा खाता — My Account",
  description: "Your questions, bookings and payments — all in one place.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <AccountPage />;
}
