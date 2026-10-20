"use client";

import { useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import Icon from "@/components/Icon";
import AuthShell, { AuthStatus, BackToLogin } from "../AuthShell";
import { siteForgotPassword, SiteApiError, type ForgotPasswordAnswer } from "@/lib/api/site";
import { pickMessageLang } from "@/lib/hindi-labels";
import { waLink } from "@/lib/config";

// Messages are kept as "English | Hindi", like the API's, so a language
// switch after an error still shows the right half (pickMessageLang).
const GENERIC_ERROR = "Something went wrong — please try again | कुछ गलत हो गया — पुनः प्रयास करें";
const BAD_EMAIL = "Please enter a valid email address | कृपया सही ईमेल पता डालें";

/**
 * /account/forgot-password/ — asks for the account's email. The API gives the
 * same answer for every address (it never tells whether an account exists),
 * and this page shows that answer:
 * - email:    a reset link is on its way; it opens /account/reset-password/
 * - support:  the server cannot send email yet, so the message points to
 *             WhatsApp (and the button opens a chat)
 * - response: development server only: the token comes back in the answer,
 *             and the button opens the reset page with it
 */
export default function ForgotPasswordPage() {
  const { lang } = useI18n();
  const isHi = lang === "hi";

  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [answer, setAnswer] = useState<ForgotPasswordAnswer | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setError("");
    try {
      setAnswer(await siteForgotPassword(email.trim()));
    } catch (err) {
      setError(!(err instanceof SiteApiError) ? GENERIC_ERROR
        : err.code === "VALIDATION_ERROR" ? BAD_EMAIL
        : err.message);
    } finally {
      setBusy(false);
    }
  }

  function startOver() {
    setAnswer(null); setError("");
  }

  const title = { hi: "पासवर्ड भूल गए?", en: "Forgot Password?" };

  if (answer?.delivery === "email") {
    return (
      <AuthShell title={title}>
        <AuthStatus isHi={isHi} icon={<Icon name="mail" size={26} />} heading={isHi ? "अपना ईमेल देखें" : "Check your email"}>
          <p role="status">{pickMessageLang(answer.message, isHi)}</p>
        </AuthStatus>
        <Link href="/account" className="btn btn-primary" style={{ width: "100%", whiteSpace: "normal" }}>
          {isHi ? "लॉगिन पर वापस जाएं" : "Back to login"}
        </Link>
        <p className={isHi ? "devanagari" : undefined} style={{ textAlign: "center", marginTop: "1rem", fontSize: "0.85rem", color: "var(--muted)" }}>
          {isHi ? "गलत ईमेल डाला था?" : "Typed the wrong email?"}{" "}
          <button type="button" onClick={startOver}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 0, font: "inherit", color: "var(--maroon)", fontWeight: 600, textDecoration: "underline" }}>
            {isHi ? "दूसरा ईमेल डालें" : "Try another one"}
          </button>
        </p>
      </AuthShell>
    );
  }

  if (answer?.delivery === "support") {
    const chat = waLink(isHi
      ? `नमस्ते, मुझे astroshivanii.com पर अपने खाते का पासवर्ड रीसेट करना है। खाते का ईमेल: ${email.trim()}`
      : `Namaste, I need help resetting the password of my astroshivanii.com account. Account email: ${email.trim()}`);
    return (
      <AuthShell title={title}>
        <AuthStatus isHi={isHi} icon={<Icon name="message" size={26} />} heading={isHi ? "WhatsApp पर मदद लें" : "Get help on WhatsApp"}>
          <p role="status" style={{ overflowWrap: "anywhere" }}>{pickMessageLang(answer.message, isHi)}</p>
        </AuthStatus>
        <a href={chat} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ width: "100%", whiteSpace: "normal" }}>
          {isHi ? "WhatsApp पर संदेश करें" : "Message us on WhatsApp"}
        </a>
        <BackToLogin isHi={isHi} />
      </AuthShell>
    );
  }

  if (answer?.delivery === "response") {
    return (
      <AuthShell title={title}>
        <AuthStatus isHi={isHi} icon={<Icon name="lock" size={26} />} heading={isHi ? "नया पासवर्ड चुनें" : "Choose a new password"}>
          <p role="status">{pickMessageLang(answer.message, isHi)}</p>
        </AuthStatus>
        {answer.reset_token && (
          <Link href={`/account/reset-password/?token=${encodeURIComponent(answer.reset_token)}`} className="btn btn-primary" style={{ width: "100%", whiteSpace: "normal" }}>
            {isHi ? "पासवर्ड रीसेट पेज खोलें" : "Open the reset page"}
          </Link>
        )}
        <BackToLogin isHi={isHi} />
      </AuthShell>
    );
  }

  return (
    <AuthShell title={title}>
      <form onSubmit={handleSubmit}>
        <p className={isHi ? "devanagari" : undefined} style={{ color: "var(--ink-light)", fontSize: "0.92rem", lineHeight: 1.6, marginBottom: "1.1rem" }}>
          {isHi
            ? "पासवर्ड रीसेट करने के लिए अपने astroshivanii.com खाते का ईमेल डालें।"
            : "Enter the email of your astroshivanii.com account to reset its password."}
        </p>
        <div className="form-group">
          <label className="form-label" htmlFor="forgot-email">{isHi ? "ईमेल" : "Email"}</label>
          <input id="forgot-email" className="form-input" type="email" required autoComplete="email"
            maxLength={254} value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        {error && <p className="form-error" role="alert" style={{ marginBottom: "0.75rem" }}>{pickMessageLang(error, isHi)}</p>}

        <button type="submit" className="btn btn-primary" disabled={busy} style={{ width: "100%" }}>
          {busy ? "…" : (isHi ? "पासवर्ड रीसेट करें" : "Reset password")}
        </button>
      </form>
      <BackToLogin isHi={isHi} />
    </AuthShell>
  );
}
