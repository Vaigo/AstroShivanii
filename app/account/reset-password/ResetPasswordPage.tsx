"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import Icon from "@/components/Icon";
import PasswordInput from "@/components/PasswordInput";
import AuthShell, { AuthStatus, BackToLogin } from "../AuthShell";
import { siteResetPassword, SiteApiError } from "@/lib/api/site";
import { pickMessageLang } from "@/lib/hindi-labels";

// Messages are kept as "English | Hindi", like the API's, so a language
// switch after an error still shows the right half (pickMessageLang).
const GENERIC_ERROR = "The password was not changed — please try again | पासवर्ड नहीं बदला — पुनः प्रयास करें";
const TOO_SHORT = "Use at least 6 characters | कम से कम 6 अक्षर का पासवर्ड चुनें";
const MISMATCH = "The two passwords don't match | दोनों पासवर्ड एक जैसे नहीं हैं";
const UPDATED = "Password updated. Please log in. | पासवर्ड बदल दिया गया। अब लॉगिन करें।";

/** The backend's tokens are 43 URL-safe characters. This loose check only
 *  keeps a link that a mail app cut short or mangled from being sent. */
const TOKEN_SHAPE = /^[A-Za-z0-9_-]{20,200}$/;

const TITLE = { hi: "नया पासवर्ड चुनें", en: "Set a New Password" };

/**
 * /account/reset-password/?token=… — the page the password reset email links
 * to. It asks for the new password twice and sends it with the token to
 * POST /v1/site/auth/reset-password. A link works once and for 1 hour; a
 * missing, cut-short or dead link gets a "request a new link" screen instead
 * of a form that cannot work.
 */
export default function ResetPasswordPage() {
  // useSearchParams needs a Suspense boundary in a static export: the HTML
  // carries the frame, and the form renders in the browser, where the link is.
  return (
    <Suspense fallback={<AuthShell title={TITLE}><div className="spinner" /></AuthShell>}>
      <ResetPasswordForm />
    </Suspense>
  );
}

function ResetPasswordForm() {
  const { lang } = useI18n();
  const isHi = lang === "hi";
  const params = useSearchParams();

  // Read once and kept in this component's memory only: never logged or
  // stored. The effect takes it out of the address bar so it is not left in
  // the browser history or copied along with the page's URL.
  const [token] = useState(() => params.get("token") ?? "");
  useEffect(() => {
    if (!new URLSearchParams(window.location.search).has("token")) return;
    // A tick later, so the call goes through Next's router (it hooks
    // history.replaceState in an effect of its own, which runs after this one
    // on the first render) and the router forgets the old address too.
    const timer = window.setTimeout(() => window.history.replaceState(null, "", window.location.pathname), 0);
    return () => window.clearTimeout(timer);
  }, []);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  // the API's answer once the link was used: done, or why it no longer works
  const [done, setDone] = useState("");
  const [deadLink, setDeadLink] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 6) { setError(TOO_SHORT); return; }
    if (password !== confirm) { setError(MISMATCH); return; }
    setBusy(true); setError("");
    try {
      const d = await siteResetPassword(token, password);
      setPassword(""); setConfirm("");
      setDone(d?.message || UPDATED);
    } catch (err) {
      if (err instanceof SiteApiError && err.code === "INVALID_OR_EXPIRED_TOKEN") setDeadLink(err.message);
      else setError(err instanceof SiteApiError ? err.message : GENERIC_ERROR);
    } finally {
      setBusy(false);
    }
  }

  const requestNewLink = (
    <Link href="/account/forgot-password" className="btn btn-primary" style={{ width: "100%", whiteSpace: "normal" }}>
      {isHi ? "नया लिंक मँगाएँ" : "Request a new link"}
    </Link>
  );

  if (done) {
    return (
      <AuthShell title={TITLE}>
        <AuthStatus isHi={isHi} icon={<Icon name="check" size={28} />} heading={isHi ? "नया पासवर्ड सेट हो गया" : "Your new password is set"}>
          <p role="status">{pickMessageLang(done, isHi)}</p>
        </AuthStatus>
        <Link href="/account" className="btn btn-primary" style={{ width: "100%", whiteSpace: "normal" }}>
          {isHi ? "लॉगिन करें" : "Log in"}
        </Link>
      </AuthShell>
    );
  }

  if (deadLink) {
    return (
      <AuthShell title={TITLE}>
        <AuthStatus isHi={isHi} icon={<Icon name="lock" size={26} />} heading={isHi ? "यह लिंक अब काम नहीं करता" : "This link no longer works"}>
          <p role="alert">{pickMessageLang(deadLink, isHi)}</p>
          <p style={{ marginTop: "0.5rem", fontSize: "0.88rem", color: "var(--muted)" }}>
            {isHi ? "आपका पासवर्ड नहीं बदला है।" : "Your password has not changed."}
          </p>
        </AuthStatus>
        {requestNewLink}
        <BackToLogin isHi={isHi} />
      </AuthShell>
    );
  }

  if (!TOKEN_SHAPE.test(token)) {
    return (
      <AuthShell title={TITLE}>
        <AuthStatus isHi={isHi} icon={<Icon name="lock" size={26} />}
          heading={token
            ? (isHi ? "यह लिंक अधूरा है" : "This link is incomplete")
            : (isHi ? "रीसेट लिंक नहीं मिला" : "No reset link found")}>
          <p>
            {isHi
              ? "ईमेल में आया पूरा रीसेट लिंक दोबारा खोलें, या नया लिंक मँगाएँ। हर लिंक एक ही बार और 1 घंटे तक काम करता है।"
              : "Open the whole reset link from your email again, or request a new one. Each link works once, for 1 hour."}
          </p>
        </AuthStatus>
        {requestNewLink}
        <BackToLogin isHi={isHi} />
      </AuthShell>
    );
  }

  return (
    <AuthShell title={TITLE}>
      <form onSubmit={handleSubmit}>
        <p className={isHi ? "devanagari" : undefined} style={{ color: "var(--ink-light)", fontSize: "0.92rem", lineHeight: 1.6, marginBottom: "1.1rem" }}>
          {isHi
            ? "कम से कम 6 अक्षर का नया पासवर्ड चुनें और उसे दो बार डालें।"
            : "Choose a new password of at least 6 characters and type it twice."}
        </p>
        <div className="form-group">
          <label className="form-label" htmlFor="reset-new">{isHi ? "नया पासवर्ड" : "New password"}</label>
          <PasswordInput id="reset-new" required minLength={6} maxLength={128} autoComplete="new-password"
            value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="reset-confirm">{isHi ? "नया पासवर्ड दोबारा" : "New password again"}</label>
          <PasswordInput id="reset-confirm" required minLength={6} maxLength={128} autoComplete="new-password"
            value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </div>

        {error && <p className="form-error" role="alert" style={{ marginBottom: "0.75rem" }}>{pickMessageLang(error, isHi)}</p>}

        <button type="submit" className="btn btn-primary" disabled={busy} style={{ width: "100%" }}>
          {busy ? "…" : (isHi ? "पासवर्ड बदलें" : "Update password")}
        </button>
      </form>
      <BackToLogin isHi={isHi} />
    </AuthShell>
  );
}
