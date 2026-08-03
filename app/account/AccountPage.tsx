"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import PatrikaFrame from "@/components/PatrikaFrame";
import Icon from "@/components/Icon";
import { readingName } from "@/lib/readings";
import {
  siteLogin, siteRegister, fetchHistory, getStoredUser, getSiteToken, clearSession,
  downloadMyReport, SiteApiError, type SiteUser, type TuOrder, type SiteBooking, type RectificationOrder,
} from "@/lib/api/site";

const CATEGORY_HI: Record<string, { hi: string; en: string }> = {
  love: { hi: "प्रेम", en: "Love" }, breakup: { hi: "ब्रेकअप", en: "Breakup" },
  marriage: { hi: "विवाह", en: "Marriage" }, career: { hi: "करियर", en: "Career" },
  govtJob: { hi: "सरकारी नौकरी", en: "Govt Job" }, finance: { hi: "धन", en: "Finance" },
  health: { hi: "स्वास्थ्य", en: "Health" }, children: { hi: "संतान", en: "Children" },
  foreign: { hi: "विदेश", en: "Foreign" },
};

function fmtDate(unix: number, isHi: boolean): string {
  return new Date(unix * 1000).toLocaleDateString(isHi ? "hi-IN" : "en-IN",
    { day: "numeric", month: "short", year: "numeric" });
}

type Tab = "orders" | "bookings" | "rectifications" | "payments";

export default function AccountPage() {
  const { lang } = useI18n();
  const isHi = lang === "hi";

  const [user, setUser] = useState<SiteUser | null>(null);
  const [checked, setChecked] = useState(false);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const [tab, setTab] = useState<Tab>("orders");
  const [orders, setOrders] = useState<TuOrder[]>([]);
  const [bookings, setBookings] = useState<SiteBooking[]>([]);
  const [rectifications, setRectifications] = useState<RectificationOrder[]>([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [downloadError, setDownloadError] = useState("");

  async function handleDownload(bookingId: number) {
    setDownloadingId(bookingId);
    setDownloadError("");
    try {
      await downloadMyReport(bookingId);
    } catch {
      setDownloadError(isHi ? "डाउनलोड में समस्या — कृपया पुनः प्रयास करें" : "Couldn't download — please try again");
    } finally {
      setDownloadingId(null);
    }
  }

  useEffect(() => {
    if (getSiteToken()) setUser(getStoredUser());
    setChecked(true);
  }, []);

  useEffect(() => {
    if (!user) return;
    setLoadingHistory(true);
    fetchHistory()
      .then((h) => { setOrders(h.orders); setBookings(h.bookings); setRectifications(h.rectifications); setTotalSpent(h.total_spent_inr); })
      .catch((e) => {
        // expired/invalid token → back to login
        if (e instanceof SiteApiError && (e.code === "LOGIN_REQUIRED" || e.code === "USER_NOT_FOUND")) {
          clearSession(); setUser(null);
        }
      })
      .finally(() => setLoadingHistory(false));
  }, [user]);

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setError("");
    try {
      const u = mode === "login"
        ? await siteLogin(email.trim(), password)
        : await siteRegister(email.trim(), password, name.trim());
      setUser(u);
    } catch (err) {
      setError(err instanceof SiteApiError ? err.message : (isHi ? "कुछ गलत हो गया — पुनः प्रयास करें" : "Something went wrong — please try again"));
    } finally {
      setBusy(false);
    }
  }

  function logout() {
    clearSession();
    setUser(null); setOrders([]); setBookings([]); setRectifications([]); setTotalSpent(0);
  }

  if (!checked) return null;

  /* ── Logged OUT: login/register ─────────────────────────────────────────── */
  if (!user) {
    return (
      <section className="section">
        <div className="container" style={{ maxWidth: "460px" }}>
          <h1 className="section-heading">{isHi ? "मेरा खाता" : "My Account"}</h1>
          <p className="section-heading-hi devanagari">{isHi ? "My Account" : "मेरा खाता"}</p>

          <PatrikaFrame>
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.25rem" }}>
              {(["login", "register"] as const).map((m) => (
                <button key={m} type="button"
                  className={`btn btn-sm ${mode === m ? "btn-secondary" : "btn-ghost"}`}
                  style={{ flex: 1 }}
                  onClick={() => { setMode(m); setError(""); }}>
                  {m === "login" ? (isHi ? "लॉगिन" : "Login") : (isHi ? "नया खाता" : "Sign Up")}
                </button>
              ))}
            </div>

            <form onSubmit={handleAuth}>
              {mode === "register" && (
                <div className="form-group">
                  <label className="form-label" htmlFor="acc-name">{isHi ? "आपका नाम" : "Your name"}</label>
                  <input id="acc-name" className="form-input" type="text" value={name}
                    onChange={(e) => setName(e.target.value)} maxLength={80} />
                </div>
              )}
              <div className="form-group">
                <label className="form-label" htmlFor="acc-email">{isHi ? "ईमेल" : "Email"}</label>
                <input id="acc-email" className="form-input" type="email" required value={email}
                  onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="acc-pass">{isHi ? "पासवर्ड (कम से कम 6 अक्षर)" : "Password (min 6 characters)"}</label>
                <input id="acc-pass" className="form-input" type="password" required minLength={6} value={password}
                  onChange={(e) => setPassword(e.target.value)} />
              </div>

              {error && <p className="form-error" style={{ marginBottom: "0.75rem" }}>{error}</p>}

              <button type="submit" className="btn btn-primary" disabled={busy} style={{ width: "100%" }}>
                {busy ? "…" : mode === "login" ? (isHi ? "लॉगिन करें" : "Log In") : (isHi ? "खाता बनाएं" : "Create Account")}
              </button>
            </form>

            <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.78rem", color: "var(--muted)", textAlign: "center", marginTop: "1rem" }}>
              {isHi
                ? "खाता बनाने से आपके सभी प्रश्न, बुकिंग और भुगतान एक जगह सुरक्षित रहते हैं।"
                : "An account keeps all your questions, bookings and payments in one place."}
            </p>
          </PatrikaFrame>
        </div>
      </section>
    );
  }

  /* ── Logged IN: profile ─────────────────────────────────────────────────── */
  const payments = [
    ...orders.map((o) => ({ when: o.created_at, what: isHi ? "तुरंत उत्तर" : "Turant Uttar", detail: o.question, amount: o.amount_inr, status: o.status })),
    ...bookings.filter((b) => b.amount_inr).map((b) => ({ when: b.created_at, what: readingName(b.reading_slug, lang), detail: b.notes || "—", amount: b.amount_inr!, status: b.status })),
    ...rectifications.map((r) => ({
      when: r.created_at, what: isHi ? "समय शुद्धिकरण" : "Time Rectification",
      detail: r.best_date && r.best_tob ? `${r.best_date} ${r.best_tob}` : "—",
      amount: r.amount_inr, status: r.status,
    })),
  ].sort((a, b) => b.when - a.when);

  const tabs: Array<{ key: Tab; hi: string; en: string; count: number }> = [
    { key: "orders", hi: "मेरे प्रश्न", en: "My Questions", count: orders.length },
    { key: "bookings", hi: "मेरी बुकिंग", en: "My Bookings", count: bookings.length },
    { key: "rectifications", hi: "समय शुद्धिकरण", en: "Time Rectification", count: rectifications.length },
    { key: "payments", hi: "भुगतान", en: "Payments", count: payments.length },
  ];

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: "820px" }}>
        <h1 className="section-heading">{isHi ? "मेरा खाता" : "My Account"}</h1>
        <p className="section-heading-hi devanagari">{isHi ? "My Account" : "मेरा खाता"}</p>

        {/* Profile header */}
        <PatrikaFrame style={{ marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg, var(--maroon), var(--maroon-deep))", border: "2px solid var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gold-bright)", flexShrink: 0 }}>
              <Icon name="user" size={26} />
            </div>
            <div style={{ flex: 1, minWidth: 180 }}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.15rem", color: "var(--maroon-deep)" }}>
                {user.name || user.email}
              </div>
              <div style={{ fontSize: "0.85rem", color: "var(--muted)" }}>{user.email}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.3rem", color: "var(--maroon-deep)" }}>
                ₹{totalSpent.toLocaleString("en-IN")}
              </div>
              <div className="devanagari" style={{ fontSize: "0.72rem", color: "var(--muted)" }}>
                {isHi ? "कुल भुगतान" : "total spent"}
              </div>
            </div>
            <button type="button" className="btn btn-ghost btn-sm" onClick={logout}>
              {isHi ? "लॉगआउट" : "Log out"}
            </button>
          </div>
        </PatrikaFrame>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap" }}>
          {tabs.map((tb) => (
            <button key={tb.key} type="button"
              className={`btn btn-sm ${tab === tb.key ? "btn-secondary" : "btn-ghost"}`}
              onClick={() => setTab(tb.key)}>
              {isHi ? tb.hi : tb.en} ({tb.count})
            </button>
          ))}
        </div>

        {loadingHistory && <div className="spinner" />}

        {/* ── My Questions ── */}
        {!loadingHistory && tab === "orders" && (
          orders.length === 0 ? (
            <PatrikaFrame style={{ textAlign: "center" }}>
              <p className={isHi ? "devanagari" : undefined} style={{ color: "var(--muted)", marginBottom: "1rem" }}>
                {isHi ? "अभी तक कोई प्रश्न नहीं पूछा।" : "No questions asked yet."}
              </p>
              <Link href="/tools/turant-uttar" className="btn btn-primary btn-sm">
                {isHi ? "पहला प्रश्न पूछें ₹149" : "Ask your first question ₹149"}
              </Link>
            </PatrikaFrame>
          ) : (
            <div style={{ display: "grid", gap: "0.75rem" }}>
              {orders.map((o) => (
                <PatrikaFrame key={o.id} style={{ padding: "1.1rem 1.35rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem", flexWrap: "wrap", alignItems: "baseline" }}>
                    <span className="devanagari" style={{ fontWeight: 700, color: "var(--maroon-deep)", fontSize: "1.02rem" }}>
                      “{o.question}”
                    </span>
                    <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "var(--maroon-deep)" }}>₹{o.amount_inr}</span>
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: "0.35rem", display: "flex", gap: "0.9rem", flexWrap: "wrap" }}>
                    <span>{fmtDate(o.created_at, isHi)}</span>
                    <span className="devanagari">{(CATEGORY_HI[o.category] ?? { hi: o.category, en: o.category })[isHi ? "hi" : "en"]}</span>
                    {o.ref_code && <span>Ref: {o.ref_code}</span>}
                    <span style={{ color: "#1a7a3a", fontWeight: 700 }}>{isHi ? "उत्तर दिया गया ✓" : "Answered ✓"}</span>
                  </div>
                </PatrikaFrame>
              ))}
            </div>
          )
        )}

        {/* ── My Bookings ── */}
        {!loadingHistory && tab === "bookings" && (
          bookings.length === 0 ? (
            <PatrikaFrame style={{ textAlign: "center" }}>
              <p className={isHi ? "devanagari" : undefined} style={{ color: "var(--muted)", marginBottom: "1rem" }}>
                {isHi ? "अभी तक कोई पाठन बुक नहीं किया।" : "No readings booked yet."}
              </p>
              <Link href="/book" className="btn btn-primary btn-sm">
                {isHi ? "पाठन बुक करें" : "Book a Reading"}
              </Link>
            </PatrikaFrame>
          ) : (
            <div style={{ display: "grid", gap: "0.75rem" }}>
              {bookings.map((b) => (
                <PatrikaFrame key={b.id} style={{ padding: "1.1rem 1.35rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem", flexWrap: "wrap", alignItems: "baseline" }}>
                    <span style={{ fontWeight: 700, color: "var(--maroon-deep)", fontSize: "1.02rem" }} className="devanagari">
                      {readingName(b.reading_slug, lang)}
                    </span>
                    {b.amount_inr ? <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "var(--maroon-deep)" }}>₹{b.amount_inr.toLocaleString("en-IN")}</span> : null}
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: "0.35rem", display: "flex", gap: "0.9rem", flexWrap: "wrap", alignItems: "center" }}>
                    <span>{fmtDate(b.created_at, isHi)}</span>
                    {b.reading_slug === "birth-chart" && b.report_status ? (
                      <span className="devanagari" style={{
                        fontWeight: 700,
                        color: b.report_status === "ready" ? "#1a7a3a"
                          : b.report_status === "failed" ? "#b3423a"
                          : "var(--saffron)",
                      }}>
                        {b.report_status === "ready" && "✓ "}
                        {b.report_status === "queued" && (isHi ? "रिपोर्ट तैयार होने वाली है…" : "Report queued to start…")}
                        {b.report_status === "generating" && (isHi ? "रिपोर्ट तैयार हो रही है…" : "Preparing your report…")}
                        {b.report_status === "pending_review" && (isHi ? "शिवानी जी की अंतिम स्वीकृति बाकी है" : "Awaiting Shivanii's final sign-off")}
                        {b.report_status === "failed" && (isHi ? "समस्या हुई — कृपया WhatsApp पर संपर्क करें" : "Something went wrong — please contact us on WhatsApp")}
                        {b.report_status === "rejected" && (isHi ? "पुनः तैयार की जा रही है" : "Being redone")}
                        {b.report_status === "ready" && (isHi ? "रिपोर्ट तैयार है" : "Report ready")}
                      </span>
                    ) : (
                      <span className="devanagari" style={{ fontWeight: 700, color: b.status === "paid" ? "#1a7a3a" : "var(--saffron)" }}>
                        {b.status === "paid" ? (isHi ? "भुगतान हुआ ✓" : "Paid ✓") : (isHi ? "प्रक्रिया में — WhatsApp पर पूर्ण करें" : "In progress — complete on WhatsApp")}
                      </span>
                    )}
                    {b.report_status === "ready" && (
                      <button
                        type="button"
                        className="btn btn-primary btn-sm devanagari"
                        disabled={downloadingId === b.id}
                        onClick={() => handleDownload(b.id)}
                      >
                        {downloadingId === b.id ? "…" : (isHi ? "रिपोर्ट डाउनलोड करें" : "Download Report")}
                      </button>
                    )}
                  </div>
                  {downloadError && downloadingId === null && (
                    <p className="form-error devanagari" style={{ marginTop: "0.4rem", fontSize: "0.78rem" }}>{downloadError}</p>
                  )}
                </PatrikaFrame>
              ))}
            </div>
          )
        )}

        {/* ── Time Rectification ── */}
        {!loadingHistory && tab === "rectifications" && (
          rectifications.length === 0 ? (
            <PatrikaFrame style={{ textAlign: "center" }}>
              <p className={isHi ? "devanagari" : undefined} style={{ color: "var(--muted)", marginBottom: "1rem" }}>
                {isHi ? "अभी तक कोई समय-शुद्धिकरण नहीं किया।" : "No time rectification done yet."}
              </p>
              <Link href="/tools/time-rectification" className="btn btn-primary btn-sm devanagari">
                {isHi ? "जन्म समय शुद्धिकरण शुरू करें ₹1100" : "Start Time Rectification ₹1100"}
              </Link>
            </PatrikaFrame>
          ) : (
            <div style={{ display: "grid", gap: "0.75rem" }}>
              {rectifications.map((r) => (
                <PatrikaFrame key={r.id} style={{ padding: "1.1rem 1.35rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem", flexWrap: "wrap", alignItems: "baseline" }}>
                    <span className="devanagari" style={{ fontWeight: 700, color: "var(--maroon-deep)", fontSize: "1.02rem" }}>
                      {r.dob}{r.day_unknown ? (isHi ? " (दिन अज्ञात)" : " (day unknown)") : ""}
                    </span>
                    <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "var(--maroon-deep)" }}>₹{r.amount_inr}</span>
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: "0.35rem", display: "flex", gap: "0.9rem", flexWrap: "wrap", alignItems: "baseline" }}>
                    <span>{fmtDate(r.created_at, isHi)}</span>
                    <span>{isHi ? `${r.events_count} घटनाएं` : `${r.events_count} events`}</span>
                    {r.status === "paid" && r.best_date && r.best_tob ? (
                      <span className="devanagari" style={{ color: "#1a7a3a", fontWeight: 700 }}>
                        {isHi ? "परिणाम: " : "Result: "}
                        <strong>{r.best_date} · {r.best_tob}</strong>
                        {r.confidence_pct != null && ` (${r.confidence_pct}%)`}
                      </span>
                    ) : (
                      <span className="devanagari" style={{ fontWeight: 700, color: "var(--saffron)" }}>
                        {isHi ? "प्रक्रिया में — WhatsApp पर पूर्ण करें" : "In progress — complete on WhatsApp"}
                      </span>
                    )}
                  </div>
                </PatrikaFrame>
              ))}
            </div>
          )
        )}

        {/* ── Payments ── */}
        {!loadingHistory && tab === "payments" && (
          payments.length === 0 ? (
            <PatrikaFrame style={{ textAlign: "center" }}>
              <p className={isHi ? "devanagari" : undefined} style={{ color: "var(--muted)" }}>
                {isHi ? "कोई भुगतान रिकॉर्ड नहीं।" : "No payment records."}
              </p>
            </PatrikaFrame>
          ) : (
            <PatrikaFrame style={{ padding: "0.5rem 1.35rem" }}>
              {payments.map((p, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem", alignItems: "baseline", padding: "0.8rem 0", borderBottom: i < payments.length - 1 ? "1px dashed rgba(201,154,58,0.3)" : "none", flexWrap: "wrap" }}>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <span className="devanagari" style={{ fontWeight: 700, color: "var(--maroon-deep)" }}>{p.what}</span>
                    <span style={{ fontSize: "0.75rem", color: "var(--muted)", display: "block" }}>{fmtDate(p.when, isHi)}</span>
                  </div>
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "var(--maroon-deep)" }}>₹{p.amount.toLocaleString("en-IN")}</span>
                </div>
              ))}
            </PatrikaFrame>
          )
        )}
      </div>
    </section>
  );
}
