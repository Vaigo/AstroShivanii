"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import PatrikaFrame from "@/components/PatrikaFrame";
import Divider from "@/components/Divider";
import ResultCTA from "@/components/ResultCTA";
import { waLink } from "@/lib/config";
import { createPaymentOrder, verifyPayment, fetchNameCorrectionResult, SiteApiError } from "@/lib/api/site";
import type { NameCorrectionResult } from "@/lib/api/types";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open(): void; on(event: string, handler: (r: unknown) => void): void };
  }
}

const PRICE = 501;

type Category = "personal" | "business" | "other";
type Step = "intake" | "paywall" | "computing" | "result";

const CATEGORY_LABEL: Record<Category, { en: string; hi: string }> = {
  personal: { en: "Personal", hi: "व्यक्तिगत" },
  business: { en: "Business", hi: "व्यापार" },
  other: { en: "Other", hi: "अन्य" },
};

// The backend always needs A birth date to anchor the Life Path — only the
// LABEL changes per category, not the underlying calculation (confirmed
// with Vaibhav: reuse owner's/founder's birth date for Business/Other
// rather than building a date-less code path).
const DATE_LABEL: Record<Category, { en: string; hi: string }> = {
  personal: { en: "Your date of birth", hi: "आपकी जन्म तिथि" },
  business: { en: "Business owner's date of birth", hi: "व्यापार मालिक की जन्म तिथि" },
  other: { en: "Related person's date of birth", hi: "संबंधित व्यक्ति की जन्म तिथि" },
};

const NAME_LABEL: Record<Category, { en: string; hi: string }> = {
  personal: { en: "Your full name", hi: "आपका पूरा नाम" },
  business: { en: "Business name", hi: "व्यापार का नाम" },
  other: { en: "Name to check", hi: "जांचने के लिए नाम" },
};

const NAME_PLACEHOLDER: Record<Category, { en: string; hi: string }> = {
  personal: { en: "As on birth certificate", hi: "जन्म प्रमाणपत्र अनुसार" },
  business: { en: "e.g., Shivanii Astro Services", hi: "जैसे, शिवानी एस्ट्रो सर्विसेज़" },
  other: { en: "Brand, product, or any other name", hi: "ब्रांड, उत्पाद या कोई अन्य नाम" },
};

export default function NameCorrectionTool() {
  const { lang } = useI18n();
  const isHi = lang === "hi";

  const [step, setStep] = useState<Step>("intake");
  const [category, setCategory] = useState<Category>("personal");
  const [dob, setDob] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState("");
  const [resultError, setResultError] = useState("");
  const [result, setResult] = useState<NameCorrectionResult | null>(null);

  const [refCode, setRefCode] = useState(() => `NAMEC-${Date.now().toString(36).toUpperCase()}`);
  const stepRef = useRef<HTMLDivElement>(null);

  // Restore a saved session — a refresh must never lose a paid result.
  useEffect(() => {
    try {
      const saved = window.sessionStorage.getItem("name-correction-state");
      if (saved) {
        const s = JSON.parse(saved);
        setCategory(s.category ?? "personal");
        setDob(s.dob ?? "");
        setName(s.name ?? "");
        setResult(s.result ?? null);
        if (s.refCode) setRefCode(s.refCode);
        setStep(s.step === "computing" ? "intake" : (s.step ?? "intake"));
      }
    } catch { /* corrupted state — start fresh */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      window.sessionStorage.setItem("name-correction-state", JSON.stringify({ step, category, dob, name, result, refCode }));
    } catch { /* storage full/unavailable — degrade gracefully */ }
  }, [step, category, dob, name, result, refCode]);

  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    stepRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step]);

  useEffect(() => {
    if (step === "computing") return;
    if (window.history.state?.nameCorrStep === step) return;
    if (step === "intake" && !window.history.state?.nameCorrStep) return;
    window.history.pushState({ ...window.history.state, nameCorrStep: step }, "");
  }, [step]);

  useEffect(() => {
    const onPop = (e: PopStateEvent) => {
      const s = e.state?.nameCorrStep;
      if (s === "intake" || s === "paywall" || s === "result") setStep(s);
      else if (s === undefined && window.location.pathname.includes("name-correction")) setStep("intake");
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

  function handleContinueFromIntake(e: React.FormEvent) {
    e.preventDefault();
    if (!dob || !name.trim()) return;
    setError("");
    setStep("paywall");
  }

  async function handlePayOnline() {
    setPaying(true); setPayError("");
    try {
      const order = await createPaymentOrder({
        kind: "name-correction", slug: "name-correction",
        name: name.trim(), ref_code: refCode,
      });
      const rzp = new window.Razorpay({
        key: order.key_id,
        amount: order.amount,
        currency: order.currency,
        order_id: order.order_id,
        name: "Astrologer Shivanii",
        description: "नाम सुधार जांच — Name Correction",
        prefill: { name: name.trim() },
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
      const res = await fetchNameCorrectionResult({
        dob, name: name.trim(), system: "chaldean", ref_code: refCode, razorpay_order_id: razorpayOrderId,
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
    `Namaste Shivanii ji! 🙏 मैंने आपकी वेबसाइट पर "नाम सुधार जांच" के लिए भुगतान करना है — ₹${PRICE}.\n` +
    `Reference: ${refCode}`;

  const phase = step === "intake" ? 1 : step === "paywall" || step === "computing" ? 2 : 3;
  const phases = [
    { n: 1, hi: "विवरण", en: "Details" },
    { n: 2, hi: `परिणाम पाएं (₹${PRICE})`, en: `Get result (₹${PRICE})` },
    { n: 3, hi: "परिणाम", en: "Result" },
  ];

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: step === "result" ? "820px" : "560px" }}>
        <h1 className={`section-heading${isHi ? " devanagari" : ""}`}>{isHi ? "नाम सुधार जांच" : "Name Correction Checker"}</h1>
        <p className="section-heading-hi devanagari">Name Correction · ₹{PRICE}</p>

        <div className="tool-explainer" style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          {isHi ? (
            <p className="devanagari">
              हर नाम का एक <span className="hl">भाग्यांक (Destiny Number)</span> होता है। जांचें कि आपका, आपके व्यापार का,
              या किसी अन्य नाम का अंक <span className="hl">मूलांक व भाग्यांक</span> से मेल खाता है या नहीं — और स्वाभाविक,
              उच्चारण में सही सुधार सुझाव पाएं।
            </p>
          ) : (
            <p>
              Every name carries a <span className="hl">Destiny Number</span>. Check whether a personal, business,
              or other name&apos;s number harmonises with the owner&apos;s <span className="hl">Mulank and Bhagyank</span> — and
              get natural, pronounceable correction suggestions if it doesn&apos;t.
            </p>
          )}
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
              <form onSubmit={handleContinueFromIntake}>
                <div className="form-group">
                  <label className="form-label">{isHi ? "श्रेणी" : "Category"}</label>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    {(Object.keys(CATEGORY_LABEL) as Category[]).map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setCategory(c)}
                        className={category === c ? "btn btn-primary btn-sm" : "btn btn-ghost btn-sm"}
                        style={{ flex: "1 1 auto", minWidth: 0 }}
                      >
                        {isHi ? CATEGORY_LABEL[c].hi : CATEGORY_LABEL[c].en}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">{isHi ? DATE_LABEL[category].hi : DATE_LABEL[category].en}</label>
                  <input
                    type="date"
                    className="form-input"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    required
                    max={new Date().toISOString().split("T")[0]}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">{isHi ? NAME_LABEL[category].hi : NAME_LABEL[category].en}</label>
                  <input
                    type="text"
                    className="form-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder={isHi ? NAME_PLACEHOLDER[category].hi : NAME_PLACEHOLDER[category].en}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!dob || !name.trim()}
                  style={{ width: "100%" }}
                >
                  {isHi ? `आगे बढ़ें — ₹${PRICE} में परिणाम पाएं` : `Continue — get the result for ₹${PRICE}`}
                </button>
                {error && <p className="form-error" style={{ marginTop: "1rem" }}>{error}</p>}
              </form>
            </PatrikaFrame>
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
                    ? `"${name}" के लिए मूलांक-भाग्यांक मेल जांच + सुधारित नाम सुझाव`
                    : `Mulank-Bhagyank match check + corrected name suggestions for "${name}"`}
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
              </div>
            </PatrikaFrame>
            <p style={{ textAlign: "center", marginTop: "0.75rem" }}>
              <button
                type="button"
                onClick={() => setStep("intake")}
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
                  {isHi ? "नाम की जांच हो रही है…" : "Checking the name…"}
                </p>
              </div>
            </PatrikaFrame>
          </div>
        )}

        {/* ── Step: result ─────────────────────────────────────────────────── */}
        {step === "result" && result && (
          <div ref={stepRef}>
            <PatrikaFrame>
              <div className="result-box" style={{ marginTop: 0, textAlign: "center" }}>
                <div className="result-label">{isHi ? "नाम" : "Name"}</div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.3rem", color: "var(--maroon-deep)", marginTop: "0.3rem" }}>
                  {result.original_name}
                </div>
                <p style={{ marginTop: "0.4rem", color: "var(--muted)" }}>
                  {isHi ? "भाग्यांक" : "Destiny"}: <strong>{result.current_destiny_number}</strong>
                  {" · "}
                  {isHi ? "मूलांक" : "Mulank"}: <strong>{result.mulank}</strong>
                  {" · "}
                  {isHi ? "भाग्यांक (जन्मतिथि)" : "Bhagyank"}: <strong>{result.bhagyank}</strong>
                </p>
              </div>

              {result.current_is_ideal ? (
                <div className="result-box" style={{ background: "rgba(26,122,58,0.05)", borderColor: "rgba(26,122,58,0.3)" }}>
                  <span style={{ color: "#1a7a3a", fontWeight: 700 }}>
                    ✓ {isHi ? "यह नाम पहले से ही मूलांक व भाग्यांक के अनुकूल है" : "This name already harmonises with both Mulank and Bhagyank"}
                  </span>
                </div>
              ) : (
                <>
                  <div className="result-box" style={{ background: "rgba(201,154,58,0.06)", borderColor: "rgba(201,154,58,0.3)" }}>
                    <span style={{ color: "var(--maroon)", fontWeight: 700 }}>
                      {isHi ? "सुधार सुझाव" : "Correction suggested"}
                    </span>
                  </div>

                  {result.spelling_variants.length > 0 ? (
                    <div style={{ marginTop: "1rem" }}>
                      <div className="result-label" style={{ marginBottom: "0.4rem" }}>
                        {isHi ? `${result.spelling_variants.length} सुधारित नाम — उच्चारण में स्वाभाविक` : `${result.spelling_variants.length} Corrected Names — Natural to Pronounce`}
                      </div>
                      <div style={{ display: "grid", gap: "0.6rem" }}>
                        {result.spelling_variants.map((v, i) => (
                          <div key={i} className="result-box" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                            <div>
                              <span style={{ fontWeight: 700, fontSize: "1.05rem", color: "var(--maroon-deep)" }}>{v.name}</span>
                              <div style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: "0.15rem" }}>
                                {isHi ? "भाग्यांक" : "Destiny"}: {v.destiny}
                              </div>
                            </div>
                            <span
                              className={isHi ? "devanagari" : undefined}
                              style={{
                                fontSize: "0.72rem", fontWeight: 700, padding: "0.25rem 0.65rem", borderRadius: "2px",
                                background: v.rating === "best" ? "var(--gold)" : v.rating === "good" ? "rgba(26,122,58,0.12)" : "rgba(150,150,150,0.15)",
                                color: v.rating === "best" ? "var(--maroon-deep)" : v.rating === "good" ? "#1a7a3a" : "var(--muted)",
                              }}
                            >
                              {isHi
                                ? (v.rating === "best" ? "श्रेष्ठ" : v.rating === "good" ? "अच्छा" : "सामान्य")
                                : v.rating.toUpperCase()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.85rem", color: "var(--muted)", marginTop: "1rem" }}>
                      {isHi
                        ? "इस नाम के लिए कोई ऐसा सुधार नहीं मिला जो सभी नियमों (मूलांक-भाग्यांक तालमेल, 4/8 से बचाव, उच्चारण सुरक्षा) को एक साथ पूरा करे — यह गणितीय रूप से एक ईमानदार सीमा है, बग नहीं। शिवानी से व्यक्तिगत सलाह लें।"
                        : "No correction was found that satisfies all the rules at once (Mulank-Bhagyank harmony, avoiding 4/8, safe pronunciation) — this is a genuine mathematical limit for this specific name, not a bug. Ask Shivanii for a personal recommendation."}
                    </p>
                  )}
                </>
              )}

              <div className="result-box" style={{ marginTop: "1rem" }}>
                <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.82rem", color: "var(--muted)", margin: 0 }}>
                  {isHi ? result.disclaimer_hi : result.disclaimer_en}
                </p>
              </div>

              <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.78rem", color: "var(--muted)", textAlign: "center", marginTop: "0.9rem" }}>
                {isHi
                  ? `यह परिणाम इस ब्राउज़र में सुरक्षित है — पेज रीफ़्रेश करने पर भी। कोई समस्या हो तो Ref कोड (${refCode}) के साथ WhatsApp पर संदेश करें।`
                  : `This result stays saved in this browser, even after refresh. Any issue? Message on WhatsApp with your ref code (${refCode}).`}
              </p>

              <Divider />
              <ResultCTA
                locked={[
                  { en: "Whether this number truly fits your actual birth chart, not just numerology alone", hi: "यह अंक आपकी वास्तविक कुंडली से कितना मेल खाता है" },
                  { en: "A properly vetted corrected spelling before you commit to a legal/official change", hi: "कानूनी बदलाव से पहले सही जांचा-परखा सुधारित नाम" },
                ]}
                hook={{
                  en: "Numerology gives a starting signal — a full reading cross-checks it against your actual chart before you change anything official.",
                  hi: "अंक ज्योतिष एक शुरुआती संकेत देता है — पूर्ण पाठन इसे आपकी वास्तविक कुंडली से जोड़कर पुष्टि करता है, इससे पहले कि आप कुछ आधिकारिक बदलें।",
                }}
                waText={`Namaste Shivanii ji! I got my Name Correction result on your website for "${result.original_name}" (${CATEGORY_LABEL[category].en}). Destiny: ${result.current_destiny_number}, Mulank: ${result.mulank}, Bhagyank: ${result.bhagyank}. I'd like to know more.`}
                reading={{ href: "/readings/birth-chart", labelEn: "Book Birth Chart Reading ₹999", labelHi: "कुंडली विश्लेषण बुक करें ₹999" }}
              />
            </PatrikaFrame>
          </div>
        )}
      </div>
    </section>
  );
}
