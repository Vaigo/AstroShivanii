import type { Metadata } from "next";
import ResetPasswordPage from "./ResetPasswordPage";

// The password reset email links here: {site}/account/reset-password/?token=…
// (GrahaAPI backend, app/site_emails.py RESET_LINK_PATH; keep the two equal).
export const metadata: Metadata = {
  title: "नया पासवर्ड — Reset Password",
  description: "Choose a new password for your astroshivanii.com account.",
  robots: { index: false, follow: false },
  // The address carries the reset token until the page removes it: never
  // send it on to another site as a referrer.
  referrer: "no-referrer",
};

export default function Page() {
  return <ResetPasswordPage />;
}
