"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import BirthForm from "@/components/BirthForm";
import PatrikaFrame from "@/components/PatrikaFrame";
import Divider from "@/components/Divider";
import ResultCTA from "@/components/ResultCTA";
import { waLink } from "@/lib/config";
import { fetchVarshphalYearLord } from "@/lib/api/endpoints";
import { createPaymentOrder, verifyPayment, fetchVarshphalYearlyResult, SiteApiError } from "@/lib/api/site";
import type { BirthRequest, VarshphalYearLordResult, VarshphalYearlyResult } from "@/lib/api/types";
import { ApiError } from "@/lib/api/client";
import { pickLang, PLANET_HI } from "@/lib/hindi-labels";

/** Classical Tajika office-bearer roles — a fixed 5-value enum from the
 *  backend (varshphal.py::_compute_varshesha), Sanskrit terms with no
 *  Hindi field of their own; transliterated to Devanagari here. */
const VARSHESHA_ROLE_HI: Record<string, string> = {
  "Muntha Pati": "मुंथा पति",
  "Varsha Lagna Pati": "वर्ष लग्न पति",
  "Janma Lagna Pati": "जन्म लग्न पति",
  "Dina-Ratri Pati": "दिन-रात्रि पति",
  "Tri-Rashi Pati": "त्रिराशि पति",
};
const varsheshaRole = (role: string, isHi: boolean) => (isHi ? VARSHESHA_ROLE_HI[role] ?? role : role);

// General classical house significations (Vedic astrology) — used to turn a
// bare house number (Muntha, etc.) into a one-word life area a non-astrologer
// can place instantly.
const HOUSE_MEANING: Record<number, { en: string; hi: string }> = {
  1: { en: "self & health", hi: "स्वयं व स्वास्थ्य" },
  2: { en: "money & family", hi: "धन व परिवार" },
  3: { en: "effort & siblings", hi: "पुरुषार्थ व भाई-बहन" },
  4: { en: "home & mother", hi: "घर व माता" },
  5: { en: "children & creativity", hi: "संतान व रचनात्मकता" },
  6: { en: "health issues & rivals", hi: "स्वास्थ्य बाधा व शत्रु" },
  7: { en: "marriage & partnerships", hi: "विवाह व साझेदारी" },
  8: { en: "sudden change & obstacles", hi: "अचानक परिवर्तन व बाधाएं" },
  9: { en: "fortune & higher learning", hi: "भाग्य व उच्च शिक्षा" },
  10: { en: "career & status", hi: "करियर व प्रतिष्ठा" },
  11: { en: "income & gains", hi: "आय व लाभ" },
  12: { en: "expenses & spirituality", hi: "व्यय व आध्यात्म" },
};
const houseMeaning = (house: number, isHi: boolean) => HOUSE_MEANING[house]?.[isHi ? "hi" : "en"] ?? "";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open(): void; on(event: string, handler: (r: unknown) => void): void };
  }
}

const PRICE = 1499;
const CURRENT_YEAR = new Date().getFullYear();

type Step = "birth" | "teaser" | "paywall" | "computing" | "result";

const PREDICTION_LABELS: Array<{ key: keyof VarshphalYearlyResult["predictions"]; en: string; hi: string }> = [
  { key: "career", en: "Career", hi: "करियर" },
  { key: "finance", en: "Finance", hi: "धन" },
  { key: "health", en: "Health", hi: "स्वास्थ्य" },
  { key: "relationships", en: "Relationships", hi: "रिश्ते" },
  { key: "spiritual", en: "Spiritual", hi: "आध्यात्म" },
  { key: "year_lord_influence", en: "Year Lord's Influence", hi: "वर्षपति का प्रभाव" },
];

export default function VarshphalYearlyTool() {
  const { lang } = useI18n();
  const isHi = lang === "hi";

  const [step, setStep] = useState<Step>("birth");
  const [birthDraft, setBirthDraft] = useState<BirthRequest | null>(null);
  const [year, setYear] = useState(CURRENT_YEAR);
  const [userName, setUserName] = useState("");
  const [error, setError] = useState("");

  const [teaser, setTeaser] = useState<VarshphalYearLordResult | null>(null);
  const [teaserLoading, setTeaserLoading] = useState(false);

  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState("");
  const [resultError, setResultError] = useState("");
  const [result, setResult] = useState<VarshphalYearlyResult | null>(null);

  const [refCode, setRefCode] = useState(() => `VYH-${Date.now().toString(36).toUpperCase()}`);
  const stepRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const saved = window.sessionStorage.getItem("varshphal-yearly-state");
      if (saved) {
        const s = JSON.parse(saved);
        setBirthDraft(s.birthDraft ?? null);
        setYear(s.year ?? CURRENT_YEAR);
        setUserName(s.userName ?? "");
        setTeaser(s.teaser ?? null);
        setResult(s.result ?? null);
        if (s.refCode) setRefCode(s.refCode);
        setStep(s.step === "computing" ? "birth" : (s.step ?? "birth"));
      }
    } catch { /* corrupted state — start fresh */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      window.sessionStorage.setItem("varshphal-yearly-state", JSON.stringify({ step, birthDraft, year, userName, teaser, result, refCode }));
    } catch { /* storage full/unavailable — degrade gracefully */ }
  }, [step, birthDraft, year, userName, teaser, result, refCode]);

  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    stepRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step]);

  useEffect(() => {
    if (step === "computing") return;
    if (window.history.state?.vyStep === step) return;
    if (step === "birth" && !window.history.state?.vyStep) return;
    window.history.pushState({ ...window.history.state, vyStep: step }, "");
  }, [step]);

  useEffect(() => {
    const onPop = (e: PopStateEvent) => {
      const s = e.state?.vyStep;
      if (s === "birth" || s === "teaser" || s === "paywall" || s === "result") setStep(s);
      else if (s === undefined && window.location.pathname.includes("varshphal-yearly")) setStep("birth");
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

  async function handleContinueFromBirth() {
    if (!birthDraft) return;
    setError("");
    setStep("teaser");
    setTeaserLoading(true);
    try {
      const yl = await fetchVarshphalYearLord(birthDraft, year);
      setTeaser(yl);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : (isHi ? "कुछ गलत हो गया — पुनः प्रयास करें" : "Something went wrong — please try again"));
      setStep("birth");
    } finally {
      setTeaserLoading(false);
    }
  }

  async function handlePayOnline() {
    if (!birthDraft) return;
    setPaying(true); setPayError("");
    try {
      const order = await createPaymentOrder({
        kind: "varshphal-yearly", slug: "varshphal-yearly",
        name: userName.trim(), ref_code: refCode,
        dob: birthDraft.dob, tob: birthDraft.tob, lat: birthDraft.lat, lon: birthDraft.lon, tz: birthDraft.tz,
      });
      const rzp = new window.Razorpay({
        key: order.key_id,
        amount: order.amount,
        currency: order.currency,
        order_id: order.order_id,
        name: "Astrologer Shivanii",
        description: `वार्षिक भविष्यफल ${year} — Yearly Horoscope`,
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

  // HARD-gated: real computation only ever runs after a verified
  // razorpay_order_id, checked server-side — no self-attest fallback.
  async function handleCompute(razorpayOrderId: string) {
    if (!birthDraft) return;
    setResultError("");
    setStep("computing");
    try {
      const res = await fetchVarshphalYearlyResult({
        dob: birthDraft.dob, tob: birthDraft.tob, lat: birthDraft.lat, lon: birthDraft.lon, tz: birthDraft.tz,
        year, ref_code: refCode, razorpay_order_id: razorpayOrderId,
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
    `Namaste Shivanii ji! 🙏 मैंने आपकी वेबसाइट पर "${year} वार्षिक भविष्यफल" के लिए भुगतान करना है — ₹${PRICE}.\n` +
    `Reference: ${refCode}`;

  const phase = step === "birth" ? 1 : step === "teaser" ? 2 : 3;
  const phases = [
    { n: 1, hi: "जन्म विवरण", en: "Birth details" },
    { n: 2, hi: "झलक", en: "Preview" },
    { n: 3, hi: `पूर्ण भविष्यफल (₹${PRICE})`, en: `Full forecast (₹${PRICE})` },
  ];

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: step === "result" ? "900px" : "720px" }}>
        <h1 className="section-heading">वार्षिक भविष्यफल</h1>
        <p className="section-heading-hi devanagari">Yearly Horoscope (Varshphal) · ₹{PRICE}</p>

        <div className="tool-explainer" style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <p className="devanagari">
            <span className="hl">वर्षफल</span> (सौर वापसी कुंडली) से आपके जन्मदिन से अगले जन्मदिन तक का वर्ष कैसा
            रहेगा — करियर, धन, स्वास्थ्य, रिश्ते और आध्यात्म — जानें।
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

        {/* ── Step: birth details + year ───────────────────────────────────── */}
        {step === "birth" && (
          <div ref={stepRef}>
            <PatrikaFrame>
              <BirthForm embedded onChange={setBirthDraft} />
              <p className={`form-hint${isHi ? " devanagari" : ""}`} style={{ marginTop: "-0.5rem", marginBottom: "1rem" }}>
                {isHi
                  ? "वर्षफल में वर्षेश (वर्ष स्वामी) और मुंथा भाव — दोनों आपके जन्म-लग्न पर निर्भर करते हैं, और लग्न सटीक जन्म-समय से ही सही बनता है। समय न देने पर हम सूर्योदय के अनुमान से गणना करते हैं, जो कम सटीक हो सकता है।"
                  : "The Varshesha (year lord) and Muntha house both depend on your Ascendant, which needs an accurate birth time to place correctly. Without it, we fall back to a sunrise-based estimate, which can be less precise."}
              </p>
              <div className="form-group">
                <label className="form-label" htmlFor="vy-year">{isHi ? "किस वर्ष के लिए?" : "For which year?"}</label>
                <select
                  id="vy-year" className="form-input" value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                >
                  {[CURRENT_YEAR, CURRENT_YEAR + 1].map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
                <span className="form-hint">
                  {isHi
                    ? `यह कैलेंडर वर्ष नहीं है — यह आपके ${year} के जन्मदिन से अगले जन्मदिन तक का सौर-वापसी वर्ष है`
                    : `This isn't the calendar year — it's your solar-return year, running from your ${year} birthday to your next one`}
                </span>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="vy-name">{isHi ? "आपका नाम (वैकल्पिक)" : "Your name (optional)"}</label>
                <input
                  id="vy-name" className="form-input" type="text"
                  value={userName} onChange={(e) => setUserName(e.target.value)} maxLength={60}
                />
                <span className="form-hint">
                  {isHi
                    ? "यह केवल भुगतान रसीद पर दिखेगा — भविष्यफल की गणना में इसका कोई उपयोग नहीं होता"
                    : "This only appears on your payment receipt — it isn't used anywhere in the forecast calculation"}
                </span>
              </div>
              <button
                type="button" className="btn btn-primary" style={{ width: "100%" }}
                disabled={!birthDraft} onClick={handleContinueFromBirth}
              >
                {isHi ? "आगे बढ़ें" : "Continue"}
              </button>
              {error && <p className="form-error" style={{ marginTop: "1rem" }}>{error}</p>}
            </PatrikaFrame>
          </div>
        )}

        {/* ── Step: free, real year-lord teaser ────────────────────────────── */}
        {step === "teaser" && (
          <div ref={stepRef}>
            <PatrikaFrame>
              {teaserLoading ? (
                <div className="tu-progress">
                  <div className="tu-chakra" aria-hidden="true" />
                  <p className="tu-progress-line">{isHi ? "वर्षेश की जांच हो रही है…" : "Checking your Varshesha…"}</p>
                </div>
              ) : teaser && (
                <>
                  <div className="result-box" style={{ marginTop: 0, textAlign: "center" }}>
                    <div className="result-label">{isHi ? "आपका वर्षेश (वर्ष स्वामी)" : "Your Varshesha (Year Lord)"}</div>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.5rem", color: "var(--maroon-deep)", marginTop: "0.4rem" }}>
                      {isHi ? PLANET_HI[teaser.varshesha] ?? teaser.varshesha : teaser.varshesha}
                    </div>
                    <p className="devanagari" style={{ marginTop: "0.3rem", color: "var(--muted)" }}>
                      {teaser.varshesha_sign_hi} ({teaser.varshesha_sign}) · {isHi ? "भाव" : "House"} {teaser.varshesha_house}
                    </p>
                    <p className={isHi ? "devanagari" : undefined} style={{ marginTop: "0.2rem", color: "var(--muted)", fontSize: "0.85rem" }}>
                      {varsheshaRole(teaser.varshesha_role, isHi)} · {pickLang(teaser.varshesha_quality, isHi)}
                    </p>
                  </div>
                  <p className={isHi ? "devanagari" : undefined} style={{ textAlign: "center", color: "var(--ink-light)" }}>
                    {isHi
                      ? `${teaser.varshesha} इस वर्ष आपके प्रमुख विषयों पर शासन करता है — पूर्ण भविष्यफल में करियर, धन, स्वास्थ्य, रिश्ते व आध्यात्म पर इसका पूरा असर देखें।`
                      : `${teaser.varshesha} governs your dominant themes this year — see the full forecast for exactly what that means across career, finance, health, relationships and spirituality.`}
                  </p>
                  {!birthDraft?.tob && (
                    <div className="kaal-box" style={{ marginTop: "0.9rem" }}>
                      <strong className={isHi ? "devanagari" : undefined}>
                        {isHi ? "⚠ जन्म-समय के बिना आगे बढ़ रहे हैं" : "⚠ Proceeding without a birth time"}
                      </strong>
                      <p className={isHi ? "devanagari" : undefined} style={{ margin: "0.4rem 0 0" }}>
                        {isHi
                          ? "ऊपर दिखाया गया वर्षेश सूर्योदय-अनुमानित लग्न पर आधारित है, आपके वास्तविक जन्म-समय पर नहीं — असली लग्न अलग निकलने पर वर्षेश व मुंथा भाव दोनों बदल सकते हैं। सटीक जन्म-समय जोड़कर सबसे भरोसेमंद परिणाम पाएं।"
                          : "The Varshesha shown above is based on a sunrise-estimated Ascendant, not your real birth time — if your true Ascendant differs, both the Varshesha and the Muntha house can change. Add your exact birth time for the most reliable result."}
                      </p>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        style={{ marginTop: "0.6rem" }}
                        onClick={() => setStep("birth")}
                      >
                        {isHi ? "जन्म समय जोड़ें" : "Add my birth time"}
                      </button>
                    </div>
                  )}
                  <button
                    type="button" className="btn btn-primary" style={{ width: "100%", marginTop: "1.1rem" }}
                    onClick={() => setStep("paywall")}
                  >
                    {isHi ? `आगे बढ़ें — ₹${PRICE} में पूर्ण भविष्यफल पाएं` : `Continue — get the full forecast for ₹${PRICE}`}
                  </button>
                </>
              )}
            </PatrikaFrame>
            <p style={{ textAlign: "center", marginTop: "0.75rem" }}>
              <button
                type="button" onClick={() => setStep("birth")}
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
                  {isHi ? `${year} का पूर्ण वर्षफल विश्लेषण` : `Full ${year} Varshphal analysis`}
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
                <p className="tu-progress-line devanagari">{isHi ? "आपका वर्षफल तैयार हो रहा है…" : "Preparing your yearly forecast…"}</p>
              </div>
            </PatrikaFrame>
          </div>
        )}

        {/* ── Step: result ─────────────────────────────────────────────────── */}
        {step === "result" && result && (
          <div ref={stepRef}>
            <PatrikaFrame>
              <div className="result-box" style={{ marginTop: 0, textAlign: "center" }}>
                <div className="result-label">{isHi ? "समग्र वर्ष स्कोर" : "Overall Year Score"}</div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "2rem", color: "var(--maroon-deep)", marginTop: "0.3rem" }}>
                  {result.overall_year_score}<span style={{ fontSize: "1rem", color: "var(--muted)" }}>/100</span>
                </div>
                <p className={isHi ? "devanagari" : undefined} style={{ marginTop: "0.2rem", color: "var(--muted)", fontSize: "0.82rem" }}>
                  {isHi
                    ? "यह गुरु, शनि, मुंथा और वर्षेश की इस वर्ष की स्थिति को मिलाकर बना एक सार-स्कोर है — अधिक अंक यानी ग्रहों का साथ ज़्यादा है, पर कम स्कोर पर भी नीचे व्यावहारिक मार्गदर्शन मौजूद है"
                    : "A composite of how favourably Jupiter, Saturn, Muntha, and the Varshesha are placed this year — higher means the planets lean more in your favour, but even a lower score comes with real guidance below, not just a verdict"}
                </p>
                <p className="devanagari" style={{ marginTop: "0.5rem", color: "var(--muted)" }}>
                  {isHi ? "वर्षेश" : "Varshesha"}: {isHi ? PLANET_HI[result.varshesha] ?? result.varshesha : result.varshesha} ({varsheshaRole(result.varshesha_role, isHi)}) · {isHi ? "मुंथा भाव" : "Muntha House"} {result.muntha_house}
                </p>
                <p className={isHi ? "devanagari" : undefined} style={{ marginTop: "0.2rem", color: "var(--muted)", fontSize: "0.82rem" }}>
                  {isHi
                    ? `वर्षेश वह ग्रह है जो इस पूरे वर्ष आपकी प्रमुख घटनाओं पर छाप छोड़ता है। मुंथा हर वर्ष एक भाव आगे खिसकती है — इस वर्ष यह ${houseMeaning(result.muntha_house, true)} के भाव में है, यानी ध्यान व ऊर्जा स्वाभाविक रूप से यहीं केंद्रित रहेगी।`
                    : `The Varshesha is the planet that colours this year's major events. Muntha advances one house every year — this year it sits in the house of ${houseMeaning(result.muntha_house, false)}, meaning your focus and energy naturally gravitate there.`}
                </p>
              </div>

              <p className={isHi ? "devanagari" : undefined} style={{ textAlign: "center", fontSize: "0.85rem", color: "var(--muted)", margin: "0 0 0.5rem" }}>
                {isHi ? "पांच प्रमुख जीवन-क्षेत्रों में इस वर्ष का सार:" : "This year's outlook across five key life areas:"}
              </p>
              {PREDICTION_LABELS.map(({ key, en, hi }) => (
                <div key={key} className="result-box">
                  <div className="result-label">{isHi ? hi : en}</div>
                  <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.9rem", color: "var(--ink-light)", lineHeight: 1.6 }}>
                    {pickLang(result.predictions[key], isHi)}
                  </p>
                </div>
              ))}

              <div className="result-box">
                <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.85rem", color: "var(--ink-light)" }}>
                  {pickLang(result.note, isHi)}
                </p>
              </div>

              <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.78rem", color: "var(--muted)", textAlign: "center", marginTop: "0.9rem" }}>
                {isHi
                  ? `यह परिणाम इस ब्राउज़र में सुरक्षित है — पेज रीफ़्रेश करने पर भी। कोई समस्या हो तो Ref कोड (${refCode}) के साथ WhatsApp पर संदेश करें।`
                  : `This result stays saved in this browser, even after refresh. Any issue? Message on WhatsApp with your ref code (${refCode}).`}
              </p>

              <Divider />
              <ResultCTA
                hook={{
                  en: "Varshphal shows the year's themes — a live consultation walks through exactly how to act on them, month by month.",
                  hi: "वर्षफल वर्ष के विषय दिखाता है — लाइव परामर्श में महीने-दर-महीने बताया जाता है कि इन पर कैसे कार्य करें।",
                }}
                waText={`Namaste Shivanii ji! I got my ${year} Yearly Horoscope (Varshesha: ${result.varshesha}, score ${result.overall_year_score}/100) on your website. I'd like a live consultation.`}
                reading={{ href: "/readings/live-consultation", labelEn: "Book Live Consultation ₹1,999", labelHi: "लाइव परामर्श बुक करें ₹1,999" }}
              />
            </PatrikaFrame>
          </div>
        )}
      </div>
    </section>
  );
}
