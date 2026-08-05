"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import PatrikaFrame from "@/components/PatrikaFrame";
import Divider from "@/components/Divider";
import ResultCTA from "@/components/ResultCTA";
import { waLink } from "@/lib/config";
import { calcMulank, calcBhagyank } from "@/lib/numerology-calc";
import { createPaymentOrder, verifyPayment, fetchNumerologySuiteResult, SiteApiError } from "@/lib/api/site";
import type { NumerologySuiteResult } from "@/lib/api/types";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open(): void; on(event: string, handler: (r: unknown) => void): void };
  }
}

const PRICE = 299;

type Step = "intake" | "teaser" | "paywall" | "computing" | "result";

export default function NumerologySuiteTool() {
  const { lang } = useI18n();
  const isHi = lang === "hi";

  const [step, setStep] = useState<Step>("intake");
  const [dob, setDob] = useState("");
  const [userName, setUserName] = useState("");
  const [error, setError] = useState("");

  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState("");
  const [resultError, setResultError] = useState("");
  const [result, setResult] = useState<NumerologySuiteResult | null>(null);

  const [refCode, setRefCode] = useState(() => `NUMS-${Date.now().toString(36).toUpperCase()}`);
  const stepRef = useRef<HTMLDivElement>(null);

  // Restore a saved session — a refresh must never lose a paid result.
  useEffect(() => {
    try {
      const saved = window.sessionStorage.getItem("num-suite-state");
      if (saved) {
        const s = JSON.parse(saved);
        setDob(s.dob ?? "");
        setUserName(s.userName ?? "");
        setResult(s.result ?? null);
        if (s.refCode) setRefCode(s.refCode);
        setStep(s.step === "computing" ? "intake" : (s.step ?? "intake"));
      }
    } catch { /* corrupted state — start fresh */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      window.sessionStorage.setItem("num-suite-state", JSON.stringify({ step, dob, userName, result, refCode }));
    } catch { /* storage full/unavailable — degrade gracefully */ }
  }, [step, dob, userName, result, refCode]);

  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    stepRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step]);

  useEffect(() => {
    if (step === "computing") return;
    if (window.history.state?.numSuiteStep === step) return;
    if (step === "intake" && !window.history.state?.numSuiteStep) return;
    window.history.pushState({ ...window.history.state, numSuiteStep: step }, "");
  }, [step]);

  useEffect(() => {
    const onPop = (e: PopStateEvent) => {
      const s = e.state?.numSuiteStep;
      if (s === "intake" || s === "teaser" || s === "paywall" || s === "result") setStep(s);
      else if (s === undefined && window.location.pathname.includes("numerology-suite")) setStep("intake");
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // Razorpay checkout.js — loaded once, used by the hard-gated payment step.
  useEffect(() => {
    if (document.querySelector('script[src*="checkout.razorpay.com"]')) return;
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const mulank = dob ? calcMulank(dob) : null;
  const bhagyank = dob ? calcBhagyank(dob) : null;

  function handleContinueFromIntake() {
    if (!dob) return;
    setError("");
    setStep("teaser");
  }

  async function handlePayOnline() {
    setPaying(true); setPayError("");
    try {
      const order = await createPaymentOrder({
        kind: "numerology-suite", slug: "numerology-suite",
        name: userName.trim(), ref_code: refCode,
      });
      const rzp = new window.Razorpay({
        key: order.key_id,
        amount: order.amount,
        currency: order.currency,
        order_id: order.order_id,
        name: "Astrologer Shivanii",
        description: "अंक ज्योतिष संगतता सूट — Numerology Compatibility Suite",
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

  // HARD-gated: real computation only ever runs after a verified
  // razorpay_order_id, checked server-side — no self-attest fallback.
  async function handleCompute(razorpayOrderId: string) {
    setResultError("");
    setStep("computing");
    try {
      const res = await fetchNumerologySuiteResult({
        dob, name: userName.trim() || undefined, ref_code: refCode, razorpay_order_id: razorpayOrderId,
      });
      setResult(res);
      setStep("result");
    } catch (e) {
      setResultError(e instanceof SiteApiError ? e.message : (isHi
        ? "परिणाम लाने में समस्या हुई — Ref कोड के साथ WhatsApp पर संदेश करें"
        : "Couldn't fetch the result — message us on WhatsApp with your ref code"));
      setStep("paywall");
    }
  }

  const waMessage =
    `Namaste Shivanii ji! 🙏 मैंने आपकी वेबसाइट पर "अंक ज्योतिष संगतता सूट" के लिए भुगतान करना है — ₹${PRICE}.\n` +
    `Reference: ${refCode}`;

  const phase = step === "intake" ? 1 : step === "teaser" ? 2 : 3;
  const phases = [
    { n: 1, hi: "जन्म तिथि", en: "Birth date" },
    { n: 2, hi: "झलक", en: "Preview" },
    { n: 3, hi: `पूरी रिपोर्ट (₹${PRICE})`, en: `Full report (₹${PRICE})` },
  ];

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: step === "result" ? "900px" : "720px" }}>
        <h1 className="section-heading">अंक ज्योतिष संगतता सूट</h1>
        <p className="section-heading-hi devanagari">Numerology Compatibility Suite · ₹{PRICE}</p>

        <div className="tool-explainer" style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <p className="devanagari">
            एक ही रिपोर्ट में <span className="hl">प्रेम, करियर, व्यापार और विवाह</span> — आपके मूलांक व भाग्यांक से
            चार-आयामी अंक ज्योतिष विश्लेषण, एक साथ जोड़कर।
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

        {/* ── Step: intake ─────────────────────────────────────────────────── */}
        {step === "intake" && (
          <div ref={stepRef}>
            <PatrikaFrame>
              <div className="form-group">
                <label className="form-label" htmlFor="ns-dob">{isHi ? "जन्म तिथि" : "Date of Birth"}</label>
                <input
                  id="ns-dob" type="date" className="form-input"
                  value={dob} onChange={(e) => setDob(e.target.value)}
                  max={new Date().toISOString().split("T")[0]} required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="ns-name">{isHi ? "आपका नाम (वैकल्पिक)" : "Your name (optional)"}</label>
                <input
                  id="ns-name" className="form-input" type="text"
                  value={userName} onChange={(e) => setUserName(e.target.value)} maxLength={60}
                />
                <span className="form-hint">
                  {isHi ? "नाम देने पर विवाह खंड में सोल-अर्ज विश्लेषण भी जुड़ता है" : "Adding your name enables the Soul Urge analysis in the marriage section"}
                </span>
              </div>
              <button
                type="button" className="btn btn-primary" style={{ width: "100%" }}
                disabled={!dob} onClick={handleContinueFromIntake}
              >
                {isHi ? "आगे बढ़ें" : "Continue"}
              </button>
              {error && <p className="form-error" style={{ marginTop: "1rem" }}>{error}</p>}
            </PatrikaFrame>
          </div>
        )}

        {/* ── Step: free teaser (client-side Mulank/Bhagyank, same as the free Numerology tool) ── */}
        {step === "teaser" && mulank && bhagyank && (
          <div ref={stepRef}>
            <PatrikaFrame>
              <div className="num-core-grid" style={{ maxWidth: "420px", margin: "0 auto 1rem" }}>
                <div className="num-core-card">
                  <div className="num-core-num">{mulank.value}</div>
                  <div className="num-core-label">{isHi ? "मूलांक" : "Mulank"}</div>
                </div>
                <div className="num-core-card">
                  <div className="num-core-num">{bhagyank.value}</div>
                  <div className="num-core-label">{isHi ? "भाग्यांक" : "Bhagyank"}</div>
                </div>
              </div>
              <p className={isHi ? "devanagari" : undefined} style={{ textAlign: "center", color: "var(--ink-light)" }}>
                {isHi
                  ? `आपका मूलांक ${mulank.value} प्रेम में आपकी शैली तय करता है — पूरी रिपोर्ट में देखें प्रेम, करियर, व्यापार और विवाह के लिए इसका पूरा अर्थ।`
                  : `Your Mulank ${mulank.value} shapes your style in love — see the full report for what it means across love, career, business and marriage.`}
              </p>
              <button
                type="button" className="btn btn-primary" style={{ width: "100%", marginTop: "1.1rem" }}
                onClick={() => setStep("paywall")}
              >
                {isHi ? `आगे बढ़ें — ₹${PRICE} में पूरी रिपोर्ट पाएं` : `Continue — get the full report for ₹${PRICE}`}
              </button>
            </PatrikaFrame>
            <p style={{ textAlign: "center", marginTop: "0.75rem" }}>
              <button
                type="button" onClick={() => setStep("intake")}
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
                  {isHi ? "प्रेम + करियर + व्यापार + विवाह — एक साथ" : "Love + Career + Business + Marriage — all in one"}
                </div>
                <button
                  type="button" className="btn btn-primary" style={{ width: "100%", marginBottom: "0.75rem" }}
                  onClick={handlePayOnline} disabled={paying}
                >
                  {paying ? (isHi ? "भुगतान खुल रहा है…" : "Opening payment…") : (isHi ? `₹${PRICE} भुगतान करें — UPI / कार्ड` : `Pay ₹${PRICE} — UPI / Card`)}
                </button>
                {payError && <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.8rem", color: "#ffd7c9", marginBottom: "0.6rem" }}>{payError}</p>}
                {resultError && <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.8rem", color: "#ffd7c9", marginBottom: "0.6rem" }}>{resultError}</p>}
                <a href={waLink(waMessage)} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm" style={{ width: "100%", color: "var(--gold-bright)", borderColor: "var(--gold)" }}>
                  {isHi ? "WhatsApp से भुगतान" : "Pay via WhatsApp"}
                </a>
                <p className="cta-note" style={{ fontSize: "0.72rem", marginTop: "0.6rem", color: "var(--gold-pale)" }}>Ref: {refCode}</p>
              </div>
            </PatrikaFrame>
            <p style={{ textAlign: "center", marginTop: "0.75rem" }}>
              <button
                type="button" onClick={() => setStep("teaser")}
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
                <p className="tu-progress-line devanagari">{isHi ? "आपकी रिपोर्ट तैयार हो रही है…" : "Preparing your report…"}</p>
              </div>
            </PatrikaFrame>
          </div>
        )}

        {/* ── Step: result ─────────────────────────────────────────────────── */}
        {step === "result" && result && (
          <div ref={stepRef}>
            <PatrikaFrame>
              <div className="result-box" style={{ marginTop: 0 }}>
                <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.92rem", color: "var(--ink-light)", lineHeight: 1.6, margin: 0 }}>
                  {isHi ? result.narrative_hi : result.narrative_en}
                </p>
              </div>

              <h3 className="num-sub-heading" style={{ marginTop: "1.5rem" }}>{isHi ? "प्रेम" : "Love"}</h3>
              <div className="result-box">
                <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.88rem", color: "var(--ink-light)", lineHeight: 1.6 }}>
                  {isHi ? result.love.interpretation_hi : result.love.interpretation_en}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginTop: "0.5rem" }}>
                  {result.love.compatible_numbers.map((n) => <span key={n} className="trait-chip">{n}</span>)}
                </div>
              </div>

              <h3 className="num-sub-heading" style={{ marginTop: "1.5rem" }}>{isHi ? "करियर" : "Career"}</h3>
              <div className="result-box">
                <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.88rem", color: "var(--ink-light)", lineHeight: 1.6 }}>
                  {isHi ? result.career.interpretation_hi : result.career.interpretation_en}
                </p>
                {result.career.strongest_careers && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginTop: "0.5rem" }}>
                    {result.career.strongest_careers.map((c) => <span key={c} className="trait-chip">{c}</span>)}
                  </div>
                )}
              </div>

              <h3 className="num-sub-heading" style={{ marginTop: "1.5rem" }}>{isHi ? "व्यापार" : "Business"}</h3>
              <div className="result-box">
                <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.88rem", color: "var(--ink-light)", lineHeight: 1.6 }}>
                  {isHi ? result.business.interpretation_hi : result.business.interpretation_en}
                </p>
                <div style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: "0.4rem" }}>
                  {isHi ? "सर्वोत्तम साझेदार अंक" : "Best partner numbers"}: {result.business.best_business_partners.join(", ")}
                </div>
              </div>

              <h3 className="num-sub-heading" style={{ marginTop: "1.5rem" }}>{isHi ? "विवाह" : "Marriage"}</h3>
              <div className="result-box">
                <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.88rem", color: "var(--ink-light)", lineHeight: 1.6 }}>
                  {isHi ? result.marriage.interpretation_hi : result.marriage.interpretation_en}
                </p>
                {result.marriage.favourable_years_for_marriage.length > 0 && (
                  <div style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: "0.4rem" }}>
                    {isHi ? "शुभ वर्ष" : "Favourable years"}: {result.marriage.favourable_years_for_marriage.join(", ")}
                  </div>
                )}
              </div>

              <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.78rem", color: "var(--muted)", textAlign: "center", marginTop: "0.9rem" }}>
                {isHi
                  ? `यह परिणाम इस ब्राउज़र में सुरक्षित है — पेज रीफ़्रेश करने पर भी। कोई समस्या हो तो Ref कोड (${refCode}) के साथ WhatsApp पर संदेश करें।`
                  : `This result stays saved in this browser, even after refresh. Any issue? Message on WhatsApp with your ref code (${refCode}).`}
              </p>

              <Divider />
              <ResultCTA
                hook={{
                  en: "This report reads your numbers — a personal reading combines them with your actual birth chart.",
                  hi: "यह रिपोर्ट आपके अंक पढ़ती है — व्यक्तिगत पाठन इन्हें आपकी वास्तविक कुंडली से जोड़ता है।",
                }}
                waText={`Namaste Shivanii ji! I got my Numerology Compatibility Suite report (Mulank ${result.mulank}, Bhagyank ${result.bhagyank}) on your website. I'd like a personal reading.`}
                reading={{ href: "/readings/birth-chart", labelEn: "Book Birth Chart Reading ₹999", labelHi: "कुंडली विश्लेषण बुक करें ₹999" }}
              />
            </PatrikaFrame>
          </div>
        )}
      </div>
    </section>
  );
}
