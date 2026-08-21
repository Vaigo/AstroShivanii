"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import BirthForm from "@/components/BirthForm";
import PatrikaFrame from "@/components/PatrikaFrame";
import Divider from "@/components/Divider";
import ResultCTA from "@/components/ResultCTA";
import LifeEventRows, { emptyEventRow, isValidRow, type EventRow } from "@/components/LifeEventRows";
import { EVENT_TYPES } from "@/lib/rectification-data";
import { waLink } from "@/lib/config";
import { fetchAscendantOptions, fetchKpRulingPlanets } from "@/lib/api/endpoints";
import { createPaymentOrder, verifyPayment, fetchRectificationResult, SiteApiError } from "@/lib/api/site";
import type { BirthRequest, AscendantOptionsResult, AscendantWindow, EventScoreResult, KpRulingResult } from "@/lib/api/types";
import { ApiError } from "@/lib/api/client";
import { PLANET_HI } from "@/lib/hindi-labels";
import { NAKSHATRAS } from "@/lib/nakshatras";

const nakHi = (name: string) => NAKSHATRAS.find((n) => n.name === name)?.name_hi ?? name;

/** event_breakdown scores are 0-1 (dasha gated by transit) — too technical
 *  to show raw to a paying customer, so bucket into a plain-language label. */
function matchStrength(score: number, isHi: boolean): { label: string; color: string } {
  if (score >= 0.7) return { label: isHi ? "प्रबल मेल" : "Strong match", color: "#1a7a3a" };
  if (score >= 0.4) return { label: isHi ? "मध्यम मेल" : "Moderate match", color: "#a67c1e" };
  return { label: isHi ? "अल्प मेल" : "Weak match", color: "#8a2f24" };
}

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open(): void; on(event: string, handler: (r: unknown) => void): void };
  }
}

const PRICE = 1100;

type Step = "birth" | "teaser" | "events" | "confirm" | "paywall" | "computing" | "result";

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
  // True when the user typed their own approx time on the birth step — in
  // that case an ascendant-window click in the teaser step must NOT silently
  // overwrite it (a remembered clock time is a stronger signal than a
  // personality-vibe guess); it only narrows the search when they gave no
  // guess at all (approxTob was blank, defaulted to a full-day scan).
  const [hasOwnTobGuess, setHasOwnTobGuess] = useState(false);
  // Shown when the customer has given NO time signal at all — neither a
  // guessed clock time nor a picked ascendant window — right before letting
  // them proceed anyway. Tested directly against a real known-birth-time
  // case: that specific combination (full-day blind scan) put the WRONG
  // time on top even with 8 life events, while a rough guess (even wrong by
  // 25 min) got the right time to rank #1. Worth one honest speed bump.
  const [showSkipWarning, setShowSkipWarning] = useState(false);

  const [rows, setRows] = useState<EventRow[]>(() => Array.from({ length: 5 }, emptyEventRow));

  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState("");

  const [result, setResult] = useState<EventScoreResult | null>(null);
  const [resultError, setResultError] = useState("");

  const [kpResult, setKpResult] = useState<KpRulingResult | null>(null);
  const [kpLoading, setKpLoading] = useState(false);

  const [refCode, setRefCode] = useState(() => `REC-${Date.now().toString(36).toUpperCase()}`);
  const stepRef = useRef<HTMLDivElement>(null);

  const minEvents = dayUnknown ? 7 : 5;
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
        setHasOwnTobGuess(!!s.hasOwnTobGuess);
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
        ascOptions, selectedStart, hasOwnTobGuess, rows, result, refCode,
      }));
    } catch { /* storage full/unavailable — degrade gracefully */ }
  }, [step, dayUnknown, birthDraft, approxTob, timeRangeMinutes, userName, ascOptions, selectedStart, hasOwnTobGuess, rows, result, refCode]);

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
      if (s === "birth" || s === "teaser" || s === "events" || s === "confirm" || s === "paywall" || s === "result") {
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
    setHasOwnTobGuess(!!approxTob);
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
    setSelectedStart(w.start_local);
    // A user-remembered clock time outranks a "which ascendant sounds like
    // me" guess — never overwrite it. Only narrow the actual search window
    // when the user gave no time at all (this is then the only signal we have).
    if (hasOwnTobGuess) return;
    const [sh, sm] = w.start_local.split(":").map(Number);
    const [eh, em] = w.end_local === "24:00" ? [24, 0] : w.end_local.split(":").map(Number);
    const startMin = sh * 60 + sm, endMin = eh * 60 + em;
    const midMin = (startMin + endMin) / 2;
    const midH = Math.floor(midMin / 60) % 24, midM = Math.round(midMin % 60);
    setApproxTob(`${String(midH).padStart(2, "0")}:${String(midM).padStart(2, "0")}`);
    setTimeRangeMinutes(Math.max(45, Math.round((endMin - startMin) / 2) + 15));
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
        modal: {
          ondismiss: () => {
            setPaying(false);
            setPayError(isHi
              ? "Checkout बंद हो गया। यदि आपने भुगतान पूरा किया है और वह यहां नहीं दिख रहा, तो कृपया WhatsApp पर संदेश करें, हम इसे सुलझा देंगे।"
              : "Checkout closed. If you completed a payment and it isn't reflected here, message us on WhatsApp and we'll sort it out.");
          },
        },
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

  // A fresh attempt is a NEW paid computation, not a free re-edit of the
  // already-paid result — the "Start a new rectification" button on the
  // result screen is this, not an "undo".
  function startNewRectification() {
    setDayUnknown(false);
    setBirthDraft(null);
    setApproxTob("");
    setTimeRangeMinutes(60);
    setUserName("");
    setAscOptions(null);
    setSelectedStart(null);
    setHasOwnTobGuess(false);
    setShowSkipWarning(false);
    setRows(Array.from({ length: 5 }, emptyEventRow));
    setResult(null);
    setKpResult(null);
    setRefCode(`REC-${Date.now().toString(36).toUpperCase()}`);
    setStep("birth");
  }

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
                        ? "दिन अज्ञात होने पर हम पूरे महीने के हर दिन की जांच करेंगे — पर विश्वसनीय परिणाम हेतु कम से कम 7 जीवन-घटनाएं देनी होंगी (सामान्यतः 5)।"
                        : "Since the day isn't known, we'll search every day of that month — but we'll need at least 7 life events (instead of the usual 5) for a confident result.")
                    : (isHi
                        ? "अधिक सटीक परिणाम के लिए आगे कम से कम 5 ऐसी घटनाएं जोड़ें जिनकी तारीख आपको निश्चित रूप से याद है। यदि आपको कोई दुर्घटना, गंभीर बीमारी या सर्जरी याद है — उसे अवश्य शामिल करें: ये घटनाएं सीधे आपके लग्न (जन्म के समय उदय होने वाली राशि) से जुड़ी होती हैं, इसलिए विवाह या नौकरी-परिवर्तन जैसी घटनाओं से कहीं अधिक सटीकता से समय बताती हैं।"
                        : "For the most accurate result, you'll add at least 5 events with dates you're certain of. If you've had an accident, a serious illness, or a surgery, include it — these are tied directly to your Ascendant (the sign rising at the exact moment of birth), so they pin down your birth time far more sharply than events like marriage or a job change.")}
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
                    ? "जैसे \"रात करीब 10 बजे\" — बिल्कुल सही न भी पता हो तो चलेगा, और इससे सटीकता काफी बढ़ जाती है; कोई अनुमान न हो तो खाली छोड़ें (अगले चरण में एक और तरीका मिलेगा)"
                    : "e.g. \"around 10pm\" — even a rough guess meaningfully improves accuracy; leave blank if you truly have no idea (you'll get one more way to narrow it down on the next step)"}
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
                    {hasOwnTobGuess
                      ? (isHi
                          ? `आपने पहले ही एक अनुमानित समय (${approxTob}) दिया है, इसलिए खोज उसी के आसपास रहेगी — नीचे किसी लग्न पर क्लिक करना सिर्फ़ रुचि के लिए है, इससे आपका दिया समय नहीं बदलेगा।`
                          : `You've already given an approximate time (${approxTob}), so the search stays anchored to that — clicking an ascendant below is just for interest and won't change your search window.`)
                      : (isHi
                          ? "जो लग्न आपसे सबसे मेल खाता लगे, उस पर क्लिक करें — चूंकि आपने कोई समय नहीं बताया, यही हमारा एकमात्र अनुमान होगा (वैकल्पिक, छोड़ भी सकते हैं)"
                          : "Click the ascendant that sounds most like you — since you gave no time at all, this becomes our only guess to narrow the search (optional, you can skip)")}
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
                        <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.85rem", color: "var(--ink-light)", margin: "0.35rem 0 0" }}>
                          {isHi ? w.hi : w.personality.slice(0, 3).join(" · ")}
                        </p>
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ width: "100%", marginTop: "1.1rem" }}
                    onClick={() => {
                      if (!hasOwnTobGuess && !selectedStart) {
                        setShowSkipWarning(true);
                      } else {
                        setStep("events");
                      }
                    }}
                  >
                    {isHi ? "आगे बढ़ें" : "Continue"}
                  </button>
                  {showSkipWarning && (
                    <div className="kaal-box" style={{ marginTop: "0.9rem" }}>
                      <strong className={isHi ? "devanagari" : undefined}>
                        {isHi ? "⚠ बिना किसी समय-संकेत के आगे बढ़ रहे हैं" : "⚠ Proceeding with no time signal at all"}
                      </strong>
                      <p className={isHi ? "devanagari" : undefined} style={{ margin: "0.4rem 0 0" }}>
                        {isHi
                          ? "आपने न कोई अनुमानित समय दिया है, न ऊपर कोई लग्न चुना — इस स्थिति में खोज पूरे दिन में होगी। हमारी अपनी वास्तविक जांच में, ठीक इसी स्थिति में एल्गोरिथ्म ने गलत समय को शीर्ष परिणाम बताया — भले ही कई जीवन-घटनाएं दी गई हों। ऊपर सिर्फ एक लग्न चुनने मात्र से सटीकता में बड़ा सुधार होता है।"
                          : "You haven't given an approximate time, and you haven't picked an ascendant above either — in that exact situation, the search scans the entire day. In our own real testing, that specific combination led the algorithm to the WRONG top result, even with several life events. Picking just one ascendant above meaningfully improves your odds."}
                      </p>
                      <div style={{ display: "flex", gap: "0.6rem", marginTop: "0.7rem", flexWrap: "wrap" }}>
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          onClick={() => setShowSkipWarning(false)}
                        >
                          {isHi ? "ठीक है, एक लग्न चुनता/चुनती हूं" : "Okay, let me pick one"}
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => setStep("events")}
                        >
                          {isHi ? "फिर भी आगे बढ़ें" : "Continue anyway"}
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </PatrikaFrame>
            {!teaserLoading && (
              <p style={{ textAlign: "center", marginTop: "0.75rem" }}>
                <button
                  type="button"
                  onClick={() => { setShowSkipWarning(false); setStep("birth"); }}
                  style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.8rem", color: "var(--maroon)", fontWeight: 600, textDecoration: "underline" }}
                >
                  ← {isHi ? "जन्म विवरण बदलें" : "Edit birth details"}
                </button>
              </p>
            )}
          </div>
        )}

        {/* ── Step: life events ────────────────────────────────────────────── */}
        {step === "events" && (
          <div ref={stepRef}>
            <PatrikaFrame>
              <div className="kaal-box" style={{ marginBottom: "1.1rem" }}>
                <strong className={isHi ? "devanagari" : undefined}>
                  {isHi ? "⚠ महत्वपूर्ण — कृपया ध्यान दें" : "⚠ Important — please read"}
                </strong>
                <p className={isHi ? "devanagari" : undefined} style={{ margin: "0.3rem 0 0" }}>
                  {isHi
                    ? "परिणाम की सटीकता पूरी तरह आपके द्वारा दी गई जानकारी पर निर्भर करती है — जितनी अधिक और जितनी सटीक घटनाएं आप जोड़ेंगे, परिणाम उतना ही विश्वसनीय होगा। कृपया केवल वे घटनाएं चुनें जिनकी तारीख आपको पूरी तरह निश्चित याद है, और न्यूनतम से अधिक घटनाएं जोड़ने की कोशिश करें।"
                    : "The accuracy of your result depends entirely on the information you provide — the more events you add, and the more certain their dates, the more reliable the result. Please add only events whose dates you're fully certain of, and try to add more than the minimum."}
                </p>
                <p className={isHi ? "devanagari" : undefined} style={{ margin: "0.5rem 0 0", fontWeight: 600 }}>
                  {isHi
                    ? "विशेष रूप से: यदि आपको कोई दुर्घटना, गंभीर बीमारी या सर्जरी की तारीख निश्चित याद है, तो उसे ज़रूर जोड़ें — भले ही आपके पास पहले से पर्याप्त घटनाएं हों। ये आपके सटीक जन्म-समय की पहचान की सबसे सशक्त कुंजी हैं।"
                    : "Specifically: if you're certain of the date of an accident, a serious illness, or a surgery, add it — even if you already have enough events. These are the single strongest markers we have for pinning down your exact birth time."}
                </p>
              </div>
              <LifeEventRows rows={rows} onChange={setRows} min={minEvents} max={10} />
              <button
                type="button"
                className="btn btn-primary"
                style={{ width: "100%", marginTop: "1.25rem" }}
                disabled={validEventCount < minEvents}
                onClick={() => setStep("confirm")}
              >
                {isHi ? "आगे बढ़ें" : "Continue"}
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

        {/* ── Step: confirm — final review of everything before payment ──── */}
        {step === "confirm" && (
          <div ref={stepRef}>
            <PatrikaFrame>
              <p className={isHi ? "devanagari" : undefined} style={{ textAlign: "center", marginBottom: "1rem", fontWeight: 600 }}>
                {isHi ? "भुगतान से पहले अपनी सभी जानकारी जांच लें" : "Review everything before you pay"}
              </p>

              <div className="result-box">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div className="result-label">{isHi ? "जन्म विवरण" : "Birth details"}</div>
                  <button type="button" onClick={() => setStep("birth")} className="btn btn-ghost btn-sm" style={{ padding: "0.2rem 0.6rem", fontSize: "0.75rem" }}>
                    {isHi ? "बदलें" : "Edit"}
                  </button>
                </div>
                <div style={{ fontSize: "0.9rem", marginTop: "0.4rem", lineHeight: 1.6 }}>
                  {userName.trim() && <div>{isHi ? "नाम" : "Name"}: {userName.trim()}</div>}
                  <div>{isHi ? "जन्म तारीख" : "DOB"}: {birthDraft?.dob}{dayUnknown && (isHi ? " (केवल वर्ष-महीना, दिन अज्ञात)" : " (year-month only, day unknown)")}</div>
                  <div>{isHi ? "अनुमानित समय" : "Approx. time"}: {approxTob || "—"} (± {timeRangeMinutes} {isHi ? "मिनट" : "min"})</div>
                  <div>{isHi ? "स्थान (अक्षांश, देशांतर)" : "Location (lat, lon)"}: {birthDraft ? `${birthDraft.lat.toFixed(3)}, ${birthDraft.lon.toFixed(3)}` : "—"}</div>
                </div>
              </div>

              <div className="result-box">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div className="result-label">{isHi ? "जीवन-घटनाएं" : "Life events"} ({validEventCount})</div>
                  <button type="button" onClick={() => setStep("events")} className="btn btn-ghost btn-sm" style={{ padding: "0.2rem 0.6rem", fontSize: "0.75rem" }}>
                    {isHi ? "बदलें" : "Edit"}
                  </button>
                </div>
                <div style={{ marginTop: "0.4rem" }}>
                  {rows.filter(isValidRow).map((r) => {
                    const label = EVENT_TYPES.find((et) => et.key === r.type)?.label;
                    return (
                      <div key={r.id} style={{ fontSize: "0.9rem", padding: "0.3rem 0", borderBottom: "1px dashed rgba(201,154,58,0.3)" }}>
                        <span className={isHi ? "devanagari" : undefined}>{label ? (isHi ? label.hi : label.en) : r.type}</span>
                        {" — "}{r.date}
                        {r.note && <span style={{ color: "var(--muted)" }}> ({r.note})</span>}
                      </div>
                    );
                  })}
                </div>
                <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: "0.5rem" }}>
                  {isHi
                    ? "याद रखें: परिणाम इन्हीं घटनाओं पर आधारित है — अभी भी \"बदलें\" दबाकर और निश्चित घटनाएं जोड़ सकते हैं, इससे सटीकता बढ़ती है।"
                    : "Remember: the result is built entirely from these events — you can still hit \"Edit\" to add more certain ones, which improves accuracy."}
                </p>
              </div>

              <button
                type="button"
                className="btn btn-primary"
                style={{ width: "100%", marginTop: "1rem" }}
                onClick={() => setStep("paywall")}
              >
                {isHi ? `सही है — आगे बढ़ें` : "Looks right — continue"}
              </button>
            </PatrikaFrame>
            <p style={{ textAlign: "center", marginTop: "0.75rem" }}>
              <button
                type="button"
                onClick={() => setStep("events")}
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
                onClick={() => setStep("confirm")}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.8rem", color: "var(--maroon)", fontWeight: 600, textDecoration: "underline" }}
              >
                ← {isHi ? "पीछे जाएं" : "Go back"}
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
                <p className={isHi ? "devanagari" : undefined} style={{ marginTop: "0.2rem", color: "var(--muted)", fontSize: "0.85rem" }}>
                  {isHi ? "लग्नेश" : "Ascendant Lord"}: {isHi ? PLANET_HI[result.best_match.ascendant_lord] ?? result.best_match.ascendant_lord : result.best_match.ascendant_lord}
                  {" · "}
                  {isHi ? "चंद्र नक्षत्र" : "Moon Nakshatra"}: {isHi ? nakHi(result.best_match.moon_nakshatra) : result.best_match.moon_nakshatra}
                </p>
              </div>

              <div className="result-box">
                <div className="result-label">{isHi ? "घटना-अनुसार मेल" : "Event-by-Event Match"}</div>
                <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.78rem", color: "var(--muted)", margin: "0.2rem 0 0.6rem" }}>
                  {isHi
                    ? "यह समय आपकी हर घटना से कितना मेल खाता है — दशा और गोचर दोनों के आधार पर"
                    : "How well this time matches each of your events — based on both dasha and transit"}
                </p>
                <div style={{ display: "grid", gap: "0.4rem" }}>
                  {result.best_match.event_breakdown.map((eb, i) => {
                    const label = EVENT_TYPES.find((et) => et.key === eb.type)?.label;
                    const m = matchStrength(eb.score, isHi);
                    return (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.85rem", padding: "0.3rem 0", borderBottom: "1px dashed rgba(201,154,58,0.3)" }}>
                        <span className={isHi ? "devanagari" : undefined}>
                          {label ? (isHi ? label.hi : label.en) : eb.type} — {eb.date}
                        </span>
                        <span style={{ fontWeight: 700, color: m.color, whiteSpace: "nowrap", marginLeft: "0.5rem" }} className={isHi ? "devanagari" : undefined}>
                          {m.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
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

              <p style={{ textAlign: "center", marginTop: "0.75rem" }}>
                <button
                  type="button"
                  onClick={startNewRectification}
                  style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.8rem", color: "var(--maroon)", fontWeight: 600, textDecoration: "underline" }}
                >
                  {isHi ? "नई जांच शुरू करें (नया भुगतान आवश्यक)" : "Start a new rectification (new payment required)"}
                </button>
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
