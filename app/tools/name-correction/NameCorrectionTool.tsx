"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import PatrikaFrame from "@/components/PatrikaFrame";
import Divider from "@/components/Divider";
import ResultCTA from "@/components/ResultCTA";
import PayPhoneField, { normalizePhone } from "@/components/PayPhoneField";
import { createPaymentOrder, verifyPayment, fetchNameCorrectionResult, SiteApiError, getStoredUser } from "@/lib/api/site";
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

// Category only relabels the two fields below it — the harmony calculation
// itself never changes, so the hint says so up front to avoid confusion.
const CATEGORY_HINT = {
  en: "This just changes what we ask for below — the calculation always checks a name's numbers against the birth date's Mulank and Bhagyank.",
  hi: "इससे केवल नीचे मांगी जाने वाली जानकारी बदलती है — गणना हमेशा नाम के अंकों की तुलना जन्मतिथि के मूलांक व भाग्यांक से करती है।",
};

const DATE_HINT: Record<Category, { en: string; hi: string }> = {
  personal: {
    en: "We derive your Mulank (from the day alone) and Bhagyank (from the full date) — the name is checked for harmony against both.",
    hi: "इससे आपका मूलांक (केवल जन्म-दिन से) और भाग्यांक (पूरी तारीख से) निकाला जाता है — नाम की जांच इन्हीं दोनों से होती है।",
  },
  business: {
    en: "Use the owner's/founder's actual birth date, not the registration or launch date — the business name is checked against the owner's own numbers.",
    hi: "मालिक/संस्थापक की वास्तविक जन्मतिथि दें, पंजीकरण या लॉन्च तारीख नहीं — व्यापार के नाम की जांच मालिक के अपने अंकों से होती है।",
  },
  other: {
    en: "Enter the birth date of the person this name belongs to — that date's Mulank and Bhagyank are what the name is checked against.",
    hi: "इस नाम से जुड़े व्यक्ति की जन्मतिथि दर्ज करें — नाम की जांच इसी तारीख के मूलांक व भाग्यांक से की जाती है।",
  },
};

const NAME_HINT: Record<Category, { en: string; hi: string }> = {
  personal: {
    en: "Type it exactly as spelled today, on your ID — numerology is calculated letter by letter, so even a small spelling change shifts the number.",
    hi: "आज जैसा नाम पहचान-पत्र पर लिखा है वैसे ही दर्ज करें — अंक ज्योतिष अक्षर-दर-अक्षर गिनता है, इसलिए छोटी सी स्पेलिंग भी अंक बदल देती है।",
  },
  business: {
    en: "Use the exact spelling shown on signage/branding today — that precise spelling is what gets scored.",
    hi: "आज साइनेज/ब्रांडिंग में जो सटीक स्पेलिंग दिखती है वही दर्ज करें — उसी की गणना होती है।",
  },
  other: {
    en: "Enter the exact current spelling of the name you want checked.",
    hi: "जिस नाम की जांच करनी है, उसकी मौजूदा सटीक स्पेलिंग दर्ज करें।",
  },
};

/** spelling_variants[].mechanism — plain-language description of HOW the
 *  suggested name differs from the original (added_letters is the raw
 *  evidence; this is the human-readable summary of it). */
function mechanismLabel(mechanism: string, isHi: boolean): string {
  switch (mechanism) {
    case "spelling":
      return isHi ? "मौजूदा स्पेलिंग में मामूली बदलाव — कोई नया अक्षर नहीं जोड़ा गया" : "Existing spelling softened slightly — no new letter added";
    case "middle_initial":
      return isHi ? "नाम के बीच में एक आद्याक्षर जोड़ा गया" : "One middle initial added between your names";
    case "spelling_and_initial":
      return isHi ? "स्पेलिंग में बदलाव + एक आद्याक्षर जोड़ा गया" : "Spelling softened + one middle initial added";
    case "2initials":
      return isHi ? "नाम के बीच में दो आद्याक्षर जोड़े गए" : "Two middle initials added between your names";
    case "spelling_and_2initials":
      return isHi ? "स्पेलिंग में बदलाव + दो आद्याक्षर जोड़े गए" : "Spelling softened + two middle initials added";
    default:
      return mechanism;
  }
}

/** family_sync[].verdict — chip label + colors, matching the rating-chip
 *  conventions used for spelling variants. "clashing" deliberately renders
 *  as a calm "Opposed", not an alarm — the description text already explains
 *  it's a common generational pattern, not a defect (honesty rule: never
 *  manufacture fear the product can't and needn't fix). */
function familyVerdictChip(verdict: string, isHi: boolean): { label: string; bg: string; color: string } {
  switch (verdict) {
    case "same_frequency":
      return { label: isHi ? "समान आवृत्ति" : "Same frequency", bg: "var(--gold)", color: "var(--maroon-deep)" };
    case "harmonious":
      return { label: isHi ? "मैत्रीपूर्ण" : "Harmonious", bg: "rgba(26,122,58,0.12)", color: "#1a7a3a" };
    case "clashing":
      return { label: isHi ? "विपरीत" : "Opposed", bg: "rgba(138,47,36,0.12)", color: "#8a2f24" };
    default:
      return { label: isHi ? "तटस्थ" : "Neutral", bg: "rgba(150,150,150,0.15)", color: "var(--muted)" };
  }
}

export default function NameCorrectionTool() {
  const { lang } = useI18n();
  const isHi = lang === "hi";

  const [step, setStep] = useState<Step>("intake");
  const [category, setCategory] = useState<Category>("personal");
  const [dob, setDob] = useState("");
  const [name, setName] = useState("");
  // Optional, personal category only — unlock the family-frequency analysis
  // (first letters of the parents' names checked against the person's own
  // first letter, Mulank, and Bhagyank).
  const [fatherName, setFatherName] = useState("");
  const [motherName, setMotherName] = useState("");
  const [error, setError] = useState("");

  const [paying, setPaying] = useState(false);
  const [payPhone, setPayPhone] = useState("");
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
        setFatherName(s.fatherName ?? "");
        setMotherName(s.motherName ?? "");
        setResult(s.result ?? null);
        if (s.refCode) setRefCode(s.refCode);
        setStep(s.step === "computing" ? "intake" : (s.step ?? "intake"));
      }
    } catch { /* corrupted state — start fresh */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      window.sessionStorage.setItem("name-correction-state", JSON.stringify({ step, category, dob, name, fatherName, motherName, result, refCode }));
    } catch { /* storage full/unavailable — degrade gracefully */ }
  }, [step, category, dob, name, fatherName, motherName, result, refCode]);

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
        name: name.trim(), ref_code: refCode, whatsapp: normalizePhone(payPhone),
      });
      const rzp = new window.Razorpay({
        key: order.key_id,
        amount: order.amount,
        currency: order.currency,
        order_id: order.order_id,
        name: "Astrologer Shivanii",
        description: "नाम सुधार जांच — Name Correction",
        prefill: { name: name.trim(), contact: normalizePhone(payPhone), ...(getStoredUser()?.email ? { email: getStoredUser()!.email } : {}) },
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
        setPayError(isHi ? "भुगतान विफल रहा — कृपया पुनः प्रयास करें" : "Payment failed — please try again");
        setPaying(false);
      });
      rzp.open();
    } catch {
      setPaying(false);
      setPayError(isHi
        ? "ऑनलाइन भुगतान अभी उपलब्ध नहीं — कृपया थोड़ी देर बाद पुनः प्रयास करें"
        : "Online payment unavailable right now — please try again in a moment");
    }
  }

  // HARD-gated: real computation only ever runs after a verified
  // razorpay_order_id, checked server-side — no self-attest fallback.
  async function handleCompute(razorpayOrderId: string) {
    setResultError("");
    setStep("computing");
    try {
      const res = await fetchNameCorrectionResult({
        dob, name: name.trim(), system: "chaldean",
        // Family sync only makes sense for a person's own name — never sent
        // for business/other even if the fields held text from an earlier
        // category choice.
        father_name: category === "personal" ? fatherName.trim() : "",
        mother_name: category === "personal" ? motherName.trim() : "",
        ref_code: refCode, razorpay_order_id: razorpayOrderId,
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
                  <p className={`form-hint${isHi ? " devanagari" : ""}`} style={{ marginTop: "0.4rem" }}>
                    {isHi ? CATEGORY_HINT.hi : CATEGORY_HINT.en}
                  </p>
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
                  <span className={`form-hint${isHi ? " devanagari" : ""}`}>
                    {isHi ? DATE_HINT[category].hi : DATE_HINT[category].en}
                  </span>
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
                  <span className={`form-hint${isHi ? " devanagari" : ""}`}>
                    {isHi ? NAME_HINT[category].hi : NAME_HINT[category].en}
                  </span>
                </div>

                {category === "personal" && (
                  <>
                    <p className={`form-hint${isHi ? " devanagari" : ""}`} style={{ marginBottom: "0.6rem" }}>
                      {isHi
                        ? "वैकल्पिक: माता-पिता का नाम देने पर परिणाम में \"पारिवारिक तालमेल\" विश्लेषण भी जुड़ता है — उनके नाम के पहले अक्षर की आवृत्ति आपके नाम, मूलांक व भाग्यांक से कितनी मेल खाती है। न देना चाहें तो खाली छोड़ें, बाकी परिणाम पूरा ही मिलेगा।"
                        : "Optional: adding a parent's name unlocks a \"family sync\" analysis in your result — how the first-letter frequency of their name sits with your own name, Mulank, and Bhagyank. Leave blank to skip; the rest of the result is complete either way."}
                    </p>
                    <div className="form-group">
                      <label className="form-label">{isHi ? "पिता का नाम (वैकल्पिक)" : "Father's name (optional)"}</label>
                      <input
                        type="text"
                        className="form-input"
                        value={fatherName}
                        onChange={(e) => setFatherName(e.target.value)}
                        maxLength={120}
                        placeholder={isHi ? "जैसे, सुरेश शर्मा" : "e.g., Suresh Sharma"}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">{isHi ? "माता का नाम (वैकल्पिक)" : "Mother's name (optional)"}</label>
                      <input
                        type="text"
                        className="form-input"
                        value={motherName}
                        onChange={(e) => setMotherName(e.target.value)}
                        maxLength={120}
                        placeholder={isHi ? "जैसे, मीना शर्मा" : "e.g., Meena Sharma"}
                      />
                    </div>
                  </>
                )}

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
                    ? `"${name}" के लिए मूलांक-भाग्यांक मेल जांच + 10 तक सुधारित नाम सुझाव${category === "personal" && (fatherName.trim() || motherName.trim()) ? " + पारिवारिक तालमेल विश्लेषण" : ""}`
                    : `Mulank-Bhagyank match check + up to 10 corrected name suggestions for "${name}"${category === "personal" && (fatherName.trim() || motherName.trim()) ? " + family sync analysis" : ""}`}
                </div>
                <PayPhoneField isHi={isHi} value={payPhone} onChange={setPayPhone} />
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ width: "100%", marginBottom: "0.75rem" }}
                  onClick={handlePayOnline}
                  disabled={paying || !normalizePhone(payPhone)}
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

              <div className="result-box">
                <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.85rem", color: "var(--ink-light)", lineHeight: 1.6, margin: 0 }}>
                  {isHi
                    ? "हर नाम के अक्षरों का जोड़ एक भाग्यांक (Destiny Number) बनाता है। यह नाम तभी सहायक माना जाता है जब यह भाग्यांक आपके मूलांक (जन्म-दिन से) और भाग्यांक (पूरी जन्मतिथि से) — दोनों के समान हो या उनका शास्त्रीय \"मित्र\" अंक हो, बिना किसी \"शत्रु\" अंक के टकराव के। नीचे यही तालमेल जांचा गया है।"
                    : "Every name's letters add up to one Destiny Number. A name is considered supportive when that number matches — or is a classical \"friend\" of — both your Mulank (from your birth day) and Bhagyank (from your full birth date), with no clash from an \"enemy\" number. That's the harmony check below."}
                </p>
                {result.ideal_destiny_numbers.length > 0 && (
                  <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.82rem", color: "var(--muted)", margin: "0.5rem 0 0" }}>
                    {isHi
                      ? `आपके लिए सबसे अनुकूल भाग्यांक: ${result.ideal_destiny_numbers.join(", ")}`
                      : `Destiny numbers that work best for you: ${result.ideal_destiny_numbers.join(", ")}`}
                  </p>
                )}
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
                    <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.82rem", color: "var(--ink-light)", margin: "0.4rem 0 0" }}>
                      {isHi
                        ? `"${result.original_name}" का भाग्यांक (${result.current_destiny_number}) आपके मूलांक व भाग्यांक से पूरी तरह मेल नहीं खाता — नीचे ऐसी वैकल्पिक स्पेलिंग दी गई हैं जो उच्चारण में लगभग वैसी ही रहें, पर नियमों को पूरा करें।`
                        : `"${result.original_name}"'s Destiny number (${result.current_destiny_number}) doesn't fully harmonise with your Mulank and Bhagyank — below are alternate spellings that sound nearly the same but satisfy the rules.`}
                    </p>
                  </div>

                  {result.spelling_variants.length > 0 ? (
                    <div style={{ marginTop: "1rem" }}>
                      <div className="result-label" style={{ marginBottom: "0.4rem" }}>
                        {isHi ? `${result.spelling_variants.length} सुधारित नाम — उच्चारण में स्वाभाविक` : `${result.spelling_variants.length} Corrected Names — Natural to Pronounce`}
                      </div>
                      <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.78rem", color: "var(--muted)", margin: "0 0 0.6rem" }}>
                        {isHi
                          ? "श्रेष्ठ = आपके मूलांक/भाग्यांक से पूर्ण मेल · अच्छा = शास्त्रीय \"मित्र\" अंक · सामान्य = नियम पूरे करता है पर मेल हल्का है"
                          : "BEST = matches your numbers exactly · GOOD = a classical \"friend\" number · MODERATE = passes every rule, just a milder match"}
                      </p>
                      <div style={{ display: "grid", gap: "0.6rem" }}>
                        {result.spelling_variants.map((v, i) => (
                          <div key={i} className="result-box" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                            <div>
                              <span style={{ fontWeight: 700, fontSize: "1.05rem", color: "var(--maroon-deep)" }}>{v.name}</span>
                              <div style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: "0.15rem" }}>
                                {isHi ? "भाग्यांक" : "Destiny"}: {v.destiny}
                              </div>
                              <div className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.76rem", color: "var(--ink-light)", marginTop: "0.2rem" }}>
                                {mechanismLabel(v.mechanism, isHi)}
                                {v.added_letters.length > 0 && ` (${v.added_letters.join(", ")})`}
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

              {result.family_sync && (
                <div style={{ marginTop: "1.25rem" }}>
                  <div className="result-label" style={{ marginBottom: "0.4rem" }}>
                    {isHi ? "पारिवारिक तालमेल — नाम के पहले अक्षर की आवृत्ति" : "Family Sync — First-Letter Frequency"}
                  </div>
                  <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.82rem", color: "var(--ink-light)", margin: "0 0 0.6rem" }}>
                    {isHi
                      ? `आपका नाम ${result.family_sync.child_first_letter} से शुरू होता है (अंक ${result.family_sync.child_letter_value}) — नीचे देखें कि माता-पिता के नामों की आरंभिक आवृत्ति इससे कैसे जुड़ती है।`
                      : `Your name opens with ${result.family_sync.child_first_letter} (vibration ${result.family_sync.child_letter_value}) — here's how your parents' opening letters relate to it.`}
                  </p>
                  <div style={{ display: "grid", gap: "0.6rem" }}>
                    {result.family_sync.parents.map((p) => {
                      const chip = familyVerdictChip(p.verdict, isHi);
                      return (
                        <div key={p.relation} className="result-box" style={{ margin: 0 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "0.75rem", flexWrap: "wrap" }}>
                            <span style={{ fontWeight: 700, color: "var(--maroon-deep)" }}>
                              {p.relation === "father" ? (isHi ? "पिता" : "Father") : (isHi ? "माता" : "Mother")}: {p.name}
                              <span style={{ fontWeight: 400, fontSize: "0.8rem", color: "var(--muted)" }}>
                                {" "}· {p.first_letter} ({isHi ? "अंक" : "vibration"} {p.letter_value})
                              </span>
                            </span>
                            <span
                              className={isHi ? "devanagari" : undefined}
                              style={{ fontSize: "0.72rem", fontWeight: 700, padding: "0.25rem 0.65rem", borderRadius: "2px", background: chip.bg, color: chip.color }}
                            >
                              {chip.label}
                            </span>
                          </div>
                          <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.84rem", color: "var(--ink-light)", lineHeight: 1.6, margin: "0.45rem 0 0" }}>
                            {isHi ? p.description_hi : p.description_en}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                  <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.84rem", color: "var(--ink-light)", lineHeight: 1.6, margin: "0.6rem 0 0", fontWeight: 600 }}>
                    {isHi ? result.family_sync.overall_hi : result.family_sync.overall_en}
                  </p>
                  <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.76rem", color: "var(--muted)", margin: "0.4rem 0 0" }}>
                    {isHi ? result.family_sync.note_hi : result.family_sync.note_en}
                  </p>
                </div>
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
