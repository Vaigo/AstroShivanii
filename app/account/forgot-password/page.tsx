import type { Metadata } from "next";
import ForgotPasswordPage from "./ForgotPasswordPage";

export const metadata: Metadata = {
  title: "पासवर्ड भूल गए? — Forgot Password",
  description: "Reset the password of your astroshivanii.com account.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <ForgotPasswordPage />;
}
