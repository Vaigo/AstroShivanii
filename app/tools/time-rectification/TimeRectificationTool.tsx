"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import BirthForm from "@/components/BirthForm";
import PatrikaFrame from "@/components/PatrikaFrame";
import Divider from "@/components/Divider";
import ResultCTA from "@/components/ResultCTA";
import LifeEventRows, { emptyEventRow, isValidRow, type EventRow } from "@/components/LifeEventRows";
import { waLink } from "@/lib/config";
import { fetchAscendantOptions, fetchKpRulingPlanets } from "@/lib/api/endpoints";
import { createPaymentOrder, verifyPayment, fetchRectificationResult, SiteApiError } from "@/lib/api/site";
import type { BirthRequest, AscendantOptionsResult, AscendantWindow, EventScoreResult, KpRulingResult } from "@/lib/api/types";
import { ApiError } from "@/lib/api/client";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open(): void; on(event: string, handler: (r: unknown) => void): void };
  }
}

const PRICE = 1011;

type Step = "birth" | "teaser" | "events" | "paywall" | "computing" | "result";

export default function TimeRectificationTool() {
  const { lang } = useI18n();
  const isHi = lang === "hi";

  const [step, setStep] = useState<Step>("birth");
  const [dayUnknown, setDayUnknown] = useState(false);
  const [birthDraft, setBirthDraft] = useState<BirthRequest | null>(null);
  const [approxTob, setApproxTob] = useState("");
  const [timeRangeMinutes, setTimeRangeMinutes] = useState(60);
  const [userName, setUserName] = useState("");
  const [error, setError] = useState("");

  const [ascOptions, setAscOptions] = useState<AscendantOptionsResult | null>(null);
  const [teaserLoading, setTeaserLoading] = useState(false);
  const [selectedStart, setSelectedStart] = useState<string | null>(null);

  const [rows, setRows] = useState<EventRow[]>(() => [emptyEventRow(), emptyEventRow(), emptyEventRow()]);

  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState("");

  const [result, setResult] = useState<EventScoreResult | null>(null);
  const [resultError, setResultError] = useState("");

  const [kpResult, setKpResult] = useState<KpRulingResult | null>(null);
  const [kpLoading, setKpLoading] = useState(false);

  const [refCode, setRefCode] = useState(() => `REC-${Date.now().toString(36).toUpperCase()}`);
  const stepRef = useRef<HTMLDivElement>(null);

  const minEvents = dayUnknown ? 5 : 3;
  const validEventCount = rows.filter(isValidRow).length;

  // Restore a saved session first — a refresh must never lose a paid result
  // or a half-filled events list.
  useEffect(() => {
    try {
      const saved = window.sessionStorage.getItem("rect-state");
      if (saved) {
        const s = JSON.parse(saved);
        setDayUnknown(!!s.dayUnknown);
        setBirthDraft(s.birthDraft ?? null);
        setApproxTob(s.approxTob ?? "");
        setTimeRangeMinutes(s.timeRangeMinutes ?? 60);
        setUserName(s.userName ?? "");
        setAscOptions(s.ascOptions ?? null);
        setSelectedStart(s.selectedStart ?? null);
        if (Array.isArray(s.rows) && s.rows.length) setRows(s.rows);
        setResult(s.result ?? null);
        if (s.refCode) setRefCode(s.refCode);
        setStep(s.step === "computing" ? "events" : (s.step ?? "birth"));
      }
    } catch { /* corrupted state — start fresh */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      window.sessionStorage.setItem("rect-state", JSON.stringify({
        step, dayUnknown, birthDraft, approxTob, timeRangeMinutes, userName,
        ascOptions, selectedStart, rows, result, refCode,
      }));
    } catch { /* storage full/unavailable — degrade gracefully */ }
  }, [step, dayUnknown, birthDraft, approxTob, timeRangeMinutes, userName, ascOptions, selectedStart, rows, result, refCode]);

  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    stepRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step]);

  // Browser BACK steps back one screen instead of leaving the tool entirely.
  useEffect(() => {
    if (step === "computing") return;
    if (window.history.state?.rectStep === step) return;
    if (step === "birth" && !window.history.state?.rectStep) return;
    window.history.pushState({ ...window.history.state, rectStep: step }, "");
  }, [step]);

  useEffect(() => {
    const onPop = (e: PopStateEvent) => {
      const s = e.state?.rectStep;
      if (s === "birth" || s === "teaser" || s === "events" || s === "paywall" || s === "result") {
        setStep(s);
      } else if (s === undefined && window.location.pathname.includes("time-rectification")) {
        setStep("birth");
      }
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  async function handleContinueFromBirth() {
    if (!birthDraft) return;
    const guess = approxTob || "12:00";
    const range = approxTob ? 60 : 720; // no guess at all -> scan the whole day
    setApproxTob(guess);
    setTimeRangeMinutes(range);
    setError("");
    setStep("teaser");
    setTeaserLoading(true);
    try {
      const teaserDob = dayUnknown ? `${birthDraft.dob}-15` : birthDraft.dob;
      const opts = await fetchAscendantOptions({ dob: teaserDob, lat: birthDraft.lat, lon: birthDraft.lon, tz: birthDraft.tz });
      setAscOptions(opts);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : (isHi ? "कुछ गलत हो गया — पुनः प्रयास करें" : "Something went wrong — please try again"));
      setStep("birth");
    } finally {
      setTeaserLoading(false);
    }
  }

  function pickAscendantWindow(w: AscendantWindow) {
    const [sh, sm] = w.start_local.split(":").map(Number);
    const [eh, em] = w.end_local === "24:00" ? [24, 0] : w.end_local.split(":").map(Number);
    const startMin = sh * 60 + sm, endMin = eh * 60 + em;
    const midMin = (startMin + endMin) / 2;
    const midH = Math.floor(midMin / 60) % 24, midM = Math.round(midMin % 60);
    setApproxTob(`${String(midH).padStart(2, "0")}:${String(midM).padStart(2, "0")}`);
    setTimeRangeMinutes(Math.max(45, Math.round((endMin - startMin) / 2) + 15));
    setSelectedStart(w.start_local);
  }

  // Razorpay checkout.js — loaded once, used by the hard-gated payment step.
  useEffect(() => {
    if (document.querySelector('script[src*="checkout.razorpay.com"]')) return;
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  async function handlePayOnline() {
    setPaying(true); setPayError("");
    try {
      const order = await createPaymentOrder({
        kind: "time-rectification", slug: "time-rectification",
        name: userName.trim(), ref_code: refCode,
      });
      const rzp = new window.Razorpay({
        key: order.key_id,
        amount: order.amount,
        currency: order.currency,
        order_id: order.order_id,
        name: "Astrologer Shivanii",
        description: "जन्म समय शुद्धिकरण — Time Rectification",
        prefill: { name: userName.trim() },
        theme: { color: "#6E1E2A" },
        handler: async (response: unknown) => {
          const r = response as { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string };
          try {
            await verifyPayment(r);
            await handleCompute(r.razorpay_order_id);
          } catch {
            setPayError(isHi
              ? "भुगतान सत्यापन में समस्या — Ref कोड के साथ WhatsApp पर संदेश करें, हम तुरंत सुलझाएंगे"
              : "Verification issue — message us on WhatsApp with your ref code, we'll fix it right away");
          } finally {
            setPaying(false);
          }
        },
        modal: { ondismiss: () => setPaying(false) },
      });
      rzp.on("payment.failed", () => {
        setPayError(isHi ? "भुगतान विफल रहा — पुनः प्रयास करें या WhatsApp से भुगतान करें" : "Payment failed — try again or pay via WhatsApp");
        setPaying(false);
      });
      rzp.open();
    } catch {
      setPaying(false);
      setPayError(isHi
        ? "ऑनलाइन भुगतान अभी उपलब्ध नहीं — कृपया WhatsApp वाला तरीका इस्तेमाल करें"
        : "Online payment unavailable right now — please use the WhatsApp option");
    }
  }

  // HARD-gated: unlike तुरंत उत्तर there is no self-attest fallback — this
  // only ever runs after a verified razorpay_order_id, checked server-side.
  async function handleCompute(razorpayOrderId: string) {
    if (!birthDraft) return;
    setResultError("");
    setStep("computing");
    try {
      const validRows = rows.filter(isValidRow);
      const res = await fetchRectificationResult({
        dob: birthDraft.dob, day_unknown: dayUnknown, approx_tob: approxTob,
        time_range_minutes: timeRangeMinutes, step_minutes: 6,
        lat: birthDraft.lat, lon: birthDraft.lon, tz: birthDraft.tz,
        events: validRows.map((r) => ({ date: r.date, type: r.type, note: r.note })),
        name: userName.trim() || undefined, ref_code: refCode, razorpay_order_id: razorpayOrderId,
      });
      setResult(res);
      setKpResult(null);
      setStep("result");
    } catch (e) {
      setResultError(e instanceof SiteApiError ? e.message : (isHi
        ? "परिणाम लाने में समस्या हुई — Ref कोड के साथ WhatsApp पर संदेश करें"
        : "Couldn't fetch the result — message us on WhatsApp with your ref code"));
      setStep("paywall");
    }
  }

  // Free KP corroboration — a second, independent signal shown alongside the
  // paid result. Best-effort: failure here must never hide the paid result.
  useEffect(() => {
    if (step !== "result" || !result?.best_match || !birthDraft || kpResult || kpLoading) return;
    setKpLoading(true);
    fetchKpRulingPlanets({
      dob: result.best_match.date, approx_tob: result.best_match.tob,
      lat: birthDraft.lat, lon: birthDraft.lon, tz: birthDraft.tz,
    })
      .then(setKpResult)
      .catch(() => { /* corroboration is a bonus signal — silently skip on failure */ })
      .finally(() => setKpLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, result, birthDraft]);

  const waMessage =
    `Namaste Shivanii ji! 🙏 मैंने आपकी वेबसाइट पर "जन्म समय शुद्धिकरण" के लिए भुगतान करना है — ₹${PRICE}.\n` +
    `Reference: ${refCode}`;

  const phase = step === "birth" ? 1 : step === "teaser" || step === "events" ? 2 : 3;
  const phases = [
    { n: 1, hi: "जन्म विवरण", en: "Birth details" },
    { n: 2, hi: "जीवन-घटनाएं", en: "Life events" },
    { n: 3, hi: `परिणाम पाएं (₹${PRICE})`, en: `Get result (₹${PRICE})` },
  ];

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: step === "result" ? "900px" : "720px" }}>
        <h1 className="section-heading">जन्म समय शुद्धिकरण</h1>
        <p className="section-heading-hi devanagari">Time Rectification · ₹{PRICE}</p>

        <div className="tool-explainer" style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <p className="devanagari">
            जन्म समय <span className="hl">ठीक से पता नहीं</span>? अपने जीवन की कुछ{" "}
            <span className="hl">निश्चित घटनाएं</span> बताएं — हम दशा-गणना से आपका संभावित सही समय निकालते हैं।
          </p>
        </div>

        <div className="tu-steps">
          {phases.map((p) => (
            <div key={p.n} className={`tu-step-item${phase === p.n ? " active" : phase > p.n ? " done" : ""}`}>
              <div className="tu-step-num">{phase > p.n ? "✓" : p.n}</div>
              <div className="tu-step-label devanagari">{isHi ? p.hi : p.en}</div>
            </div>
          ))}
        </div>

        {/* ── Step: birth details ─────────────────────────────────────────── */}
        {step === "birth" && (
          <div ref={stepRef}>
            <PatrikaFrame>
              <div className="form-group">
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={dayUnknown}
                    onChange={(e) => { setDayUnknown(e.target.checked); setBirthDraft(null); }}
                  />
                  <span className="devanagari">
                    {isHi ? "मुझे जन्म का सही दिन नहीं पता (केवल वर्ष व महीना)" : "I don't know the exact day of birth (only year & month)"}
                  </span>
                </label>
                <p className={`form-hint${isHi ? " devanagari" : ""}`} style={{ marginTop: "0.4rem" }}>
                  {dayUnknown
                    ? (isHi
                        ? "दिन अज्ञात होने पर हम पूरे महीने के हर दिन की जांच करेंगे — पर विश्वसनीय परिणाम हेतु कम से कम 5 जीवन-घटनाएं देनी होंगी (सामान्यतः 3)।"
                        : "Since the day isn't known, we'll search every day of that month — but we'll need at least 5 life events (instead of the usual 3) for a confident result.")
                    : (isHi
                        ? "अधिक सटीक परिणाम के लिए आगे कम से कम 3 ऐसी घटनाएं जोड़ें जिनकी तारीख आपको निश्चित रूप से याद है — विवाह, नौकरी परिवर्तन, दुर्घटना/बीमारी जैसी घटनाएं सबसे बेहतर परिणाम देती हैं।"
                        : "For the most accurate result, you'll add at least 3 events with dates you're certain of — marriage, job change, or an accident/illness work especially well.")}
                </p>
              </div>

              <BirthForm embedded dayUnknown={dayUnknown} hideTob onChange={setBirthDraft} />

              <div className="form-group">
                <label className="form-label" htmlFor="rect-tob">
                  {isHi ? "जन्म समय का अनुमान (वैकल्पिक)" : "Approximate birth time (optional)"}
                </label>
                <input
                  id="rect-tob"
                  type="time"
                  className="form-input"
                  value={approxTob}
                  onChange={(e) => setApproxTob(e.target.value)}
                />
                <span className="form-hint">
                  {isHi
                    ? "जैसे \"रात करीब 10 बजे\" — बिल्कुल सही न भी पता हो तो चलेगा; कोई अनुमान न हो तो खाली छोड़ें, हम पूरे दिन की जांच करेंगे"
                    : "e.g. \"around 10pm\" — an approximate guess is fine; leave blank to scan the whole day if you have no guess at all"}
                </span>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="rect-name">{isHi ? "आपका नाम (वैकल्पिक)" : "Your name (optional)"}</label>
                <input
                  id="rect-name"
                  className="form-input"
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  maxLength={60}
                />
              </div>

              <button
                type="button"
                className="btn btn-primary"
                style={{ width: "100%" }}
                disabled={!birthDraft}
                onClick={handleContinueFromBirth}
              >
                {isHi ? "आगे बढ़ें" : "Continue"}
              </button>
              {error && <p className="form-error" style={{ marginTop: "1rem" }}>{error}</p>}
            </PatrikaFrame>
          </div>
        )}

        {/* ── Step: free ascendant-window teaser ──────────────────────────── */}
        {step === "teaser" && (
          <div ref={stepRef}>
            <PatrikaFrame>
              {teaserLoading ? (
                <div className="tu-progress">
                  <div className="tu-chakra" aria-hidden="true" />
                  <p className="tu-progress-line">{isHi ? "संभावित लग्न जांचे जा रहे हैं…" : "Checking possible ascendants…"}</p>
                </div>
              ) : (
                <>
                  <p className={isHi ? "devanagari" : undefined} style={{ textAlign: "center", marginBottom: "1rem" }}>
                    {isHi
                      ? "जो लग्न आपसे सबसे मेल खाता लगे, उस पर क्लिक करें — इससे हमें आपके समय का बेहतर अनुमान मिलेगा (वैकल्पिक, छोड़ भी सकते हैं)"
                      : "Click the ascendant that sounds most like you — this helps narrow the guess (optional, you can skip)"}
                  </p>
                  {dayUnknown && (
                    <p className={`form-hint${isHi ? " devanagari" : ""}`} style={{ textAlign: "center", marginBottom: "1rem" }}>
                      {isHi
                        ? "दिन अज्ञात है, इसलिए ये खिड़कियां अनुमानित हैं — महीने के दौरान ~2 घंटे तक खिसक सकती हैं"
                        : "Since the day isn't known, these windows are approximate — they can shift by up to ~2 hours across the month"}
                    </p>
                  )}
                  <div style={{ display: "grid", gap: "0.6rem" }}>
                    {ascOptions?.ascendant_windows.map((w) => (
                      // start_local (not sign) is the unique key: the same sign can
                      // rise twice in one day (sidereal day ~23h56m), giving 13
                      // windows for 12 signs — keying by sign alone collides then.
                      <button
                        key={w.start_local}
                        type="button"
                        onClick={() => pickAscendantWindow(w)}
                        className="service-card"
                        style={{
                          textAlign: "left", cursor: "pointer", width: "100%",
                          border: selectedStart === w.start_local ? "2px solid var(--gold)" : undefined,
                          background: selectedStart === w.start_local ? "rgba(201,154,58,0.08)" : undefined,
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "0.5rem", flexWrap: "wrap" }}>
                          <strong className="devanagari" style={{ color: "var(--maroon-deep)" }}>
                            {w.sign_hi} <span style={{ fontWeight: 400, fontSize: "0.8rem", color: "var(--muted)" }}>· {w.sign}</span>
                            {selectedStart === w.start_local && " ✓"}
                          </strong>
                          <span style={{ fontSize: "0.78rem", color: "var(--muted)" }}>{w.start_local}–{w.end_local}</span>
                        </div>
                        <p className="devanagari" style={{ fontSize: "0.85rem", color: "var(--ink-light)", margin: "0.35rem 0 0" }}>
                          {w.personality.slice(0, 3).join(" · ")}
                        </p>
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ width: "100%", marginTop: "1.1rem" }}
                    onClick={() => setStep("events")}
                  >
                    {isHi ? "आगे बढ़ें" : "Continue"}
                  </button>
                </>
              )}
            </PatrikaFrame>
          </div>
        )}

        {/* ── Step: life events ────────────────────────────────────────────── */}
        {step === "events" && (
          <div ref={stepRef}>
            <PatrikaFrame>
              <LifeEventRows rows={rows} onChange={setRows} min={minEvents} max={10} />
              <button
                type="button"
                className="btn btn-primary"
                style={{ width: "100%", marginTop: "1.25rem" }}
                disabled={validEventCount < minEvents}
                onClick={() => setStep("paywall")}
              >
                {isHi ? `आगे बढ़ें — ₹${PRICE} पर परिणाम पाएं` : `Continue — get the result for ₹${PRICE}`}
              </button>
            </PatrikaFrame>
            <p style={{ textAlign: "center", marginTop: "0.75rem" }}>
              <button
                type="button"
                onClick={() => setStep("teaser")}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.8rem", color: "var(--maroon)", fontWeight: 600, textDecoration: "underline" }}
              >
                ← {isHi ? "पीछे जाएं" : "Go back"}
              </button>
            </p>
          </div>
        )}

        {/* ── Step: paywall ────────────────────────────────────────────────── */}
        {step === "paywall" && (
          <div ref={stepRef}>
            <PatrikaFrame>
              <div className="tu-paywall">
                <div className="tu-paywall-price">₹{PRICE}</div>
                <div className="tu-paywall-sub devanagari">
                  {isHi
                    ? `${validEventCount} घटनाओं के आधार पर पूर्ण दशा-विश्लेषण + KP सत्यापन`
                    : `Full dasha analysis + KP cross-check, based on ${validEventCount} events`}
                </div>
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ width: "100%", marginBottom: "0.75rem" }}
                  onClick={handlePayOnline}
                  disabled={paying}
                >
                  {paying
                    ? (isHi ? "भुगतान खुल रहा है…" : "Opening payment…")
                    : (isHi ? `₹${PRICE} भुगतान करें — UPI / कार्ड` : `Pay ₹${PRICE} — UPI / Card`)}
                </button>
                {payError && (
                  <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.8rem", color: "#ffd7c9", marginBottom: "0.6rem" }}>
                    {payError}
                  </p>
                )}
                {resultError && (
                  <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.8rem", color: "#ffd7c9", marginBottom: "0.6rem" }}>
                    {resultError}
                  </p>
                )}
                <a
                  href={waLink(waMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost btn-sm"
                  style={{ width: "100%", color: "var(--gold-bright)", borderColor: "var(--gold)" }}
                >
                  {isHi ? "WhatsApp से भुगतान" : "Pay via WhatsApp"}
                </a>
                <p className="cta-note" style={{ fontSize: "0.72rem", marginTop: "0.6rem", color: "var(--gold-pale)" }}>
                  Ref: {refCode}
                </p>
                <p className={`cta-note${isHi ? " devanagari" : ""}`} style={{ fontSize: "0.75rem", marginTop: "0.4rem", color: "var(--gold-pale)" }}>
                  {isHi
                    ? "यह संभावना-आधारित परिणाम है, अंतिम प्रमाण नहीं — किसी योग्य ज्योतिषी से पुष्टि कराएं"
                    : "This is a probabilistic result, not final proof — please confirm with a qualified astrologer"}
                </p>
              </div>
            </PatrikaFrame>
            <p style={{ textAlign: "center", marginTop: "0.75rem" }}>
              <button
                type="button"
                onClick={() => setStep("events")}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.8rem", color: "var(--maroon)", fontWeight: 600, textDecoration: "underline" }}
              >
                ← {isHi ? "घटनाएं बदलें" : "Change events"}
              </button>
            </p>
          </div>
        )}

        {/* ── Step: computing ──────────────────────────────────────────────── */}
        {step === "computing" && (
          <div ref={stepRef}>
            <PatrikaFrame>
              <div className="tu-progress">
                <div className="tu-chakra" aria-hidden="true" />
                <p className="tu-progress-line devanagari">
                  {isHi ? "आपके संभावित जन्म-समय की जांच हो रही है…" : "Checking your possible birth time…"}
                </p>
              </div>
            </PatrikaFrame>
          </div>
        )}

        {/* ── Step: result ─────────────────────────────────────────────────── */}
        {step === "result" && result?.best_match && (
          <div ref={stepRef}>
            <PatrikaFrame className="tu-answer">
              <div className="result-box" style={{ marginTop: 0, textAlign: "center" }}>
                <div className="result-label">{isHi ? "सबसे संभावित जन्म समय" : "Most Likely Birth Time"}</div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.6rem", color: "var(--maroon-deep)", marginTop: "0.4rem" }}>
                  <strong>{result.best_match.date} · {result.best_match.tob}</strong>
                </div>
                <p className={`devanagari`} style={{ marginTop: "0.3rem", color: "var(--muted)" }}>
                  {result.best_match.ascendant_hi} लग्न ({result.best_match.ascendant}) · {isHi ? "विश्वास स्तर" : "Confidence"}: {result.best_match.confidence_pct}%
                </p>
              </div>

              <div className="result-box">
                <div className="result-label">{isHi ? "अन्य संभावित समय" : "Other Candidate Times"}</div>
                <div style={{ display: "grid", gap: "0.5rem", marginTop: "0.5rem" }}>
                  {result.top_candidates.slice(1).map((c, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", padding: "0.4rem 0", borderBottom: "1px dashed rgba(201,154,58,0.3)" }}>
                      <span>{c.date} · {c.tob} — <span className="devanagari">{c.ascendant_hi}</span> <span style={{ color: "var(--muted)" }}>({c.ascendant})</span></span>
                      <span style={{ fontWeight: 700, color: "var(--maroon-deep)" }}>{c.confidence_pct}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="tu-teaser-box" style={{ margin: "0.75rem 0" }}>
                <div className="result-label" style={{ marginBottom: "0.35rem" }}>
                  {isHi ? "KP शासक-ग्रह सत्यापन (स्वतंत्र संकेत)" : "KP Ruling-Planet Corroboration (independent signal)"}
                </div>
                {kpLoading ? (
                  <p className={isHi ? "devanagari" : undefined} style={{ margin: 0, color: "var(--muted)" }}>
                    {isHi ? "जांचा जा रहा है…" : "Checking…"}
                  </p>
                ) : kpResult ? (
                  <p className={isHi ? "devanagari" : undefined} style={{ margin: 0 }}>
                    {kpResult.matched_windows.length > 0
                      ? (isHi
                          ? `✓ यह समय KP शासक-ग्रह पद्धति से भी मेल खाता है — दोनों तरीकों में सहमति एक अच्छा संकेत है।`
                          : `✓ This time also matches the KP ruling-planet method — agreement across both methods is a good sign.`)
                      : (isHi
                          ? `KP पद्धति से पूर्ण मेल नहीं मिला — इसका मतलब यह गलत है, ऐसा नहीं; यह सिर्फ एक अतिरिक्त जांच है।`
                          : `The KP method didn't fully match — this doesn't mean the result is wrong, it's just one extra check.`)}
                  </p>
                ) : (
                  <p style={{ margin: 0, color: "var(--muted)" }}>—</p>
                )}
              </div>

              <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.82rem", color: "var(--muted)", textAlign: "center" }}>
                {isHi ? result.disclaimer_hi : result.disclaimer_en}
              </p>

              <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.78rem", color: "var(--muted)", textAlign: "center", marginTop: "0.9rem" }}>
                {isHi
                  ? `यह परिणाम इस ब्राउज़र में सुरक्षित है — पेज रीफ़्रेश करने पर भी। कोई समस्या हो तो Ref कोड (${refCode}) के साथ WhatsApp पर संदेश करें।`
                  : `This result stays saved in this browser, even after refresh. Any issue? Message on WhatsApp with your ref code (${refCode}).`}
              </p>

              <Divider />
              <ResultCTA
                hook={{
                  en: "This result comes from dasha-matching against your life events. A full Kundli PDF report reads your whole chart at this rectified time.",
                  hi: "यह परिणाम आपकी जीवन-घटनाओं से दशा-मिलान पर आधारित है। पूर्ण कुंडली PDF रिपोर्ट इस शुद्ध समय पर आपकी पूरी कुंडली पढ़ती है।",
                }}
                waText={`Namaste Shivanii ji! I got a rectified birth time (${result.best_match.date} ${result.best_match.tob}) on your website. I'd like the full Kundli PDF report at this time.`}
                reading={{ href: "/readings/birth-chart", labelEn: "Full Kundli PDF Report ₹999", labelHi: "पूर्ण कुंडली PDF रिपोर्ट ₹999" }}
              />
            </PatrikaFrame>
          </div>
        )}
      </div>
    </section>
  );
}
