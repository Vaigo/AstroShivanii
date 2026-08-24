"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import BirthForm from "@/components/BirthForm";
import DownloadReportButton from "@/components/DownloadReportButton";
import PatrikaFrame from "@/components/PatrikaFrame";
import Divider from "@/components/Divider";
import ResultCTA from "@/components/ResultCTA";
import PayPhoneField, { normalizePhone } from "@/components/PayPhoneField";
import {
  createPaymentOrder, verifyPayment, fetchMuhurtaPreview, fetchMuhurtaPersonal, SiteApiError,
  type MuhurtaPurpose, type MuhurtaPreviewResult, type MuhurtaFullResult, type MuhurtaDate, getStoredUser,
} from "@/lib/api/site";
import type { BirthRequest } from "@/lib/api/types";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open(): void; on(event: string, handler: (r: unknown) => void): void };
  }
}

const PRICE = 51;

type Step = "intake" | "preview" | "computing" | "result";

const PURPOSES: Array<{ key: MuhurtaPurpose; hi: string; en: string; emoji: string }> = [
  { key: "vehicle_purchase",  hi: "वाहन खरीद",       en: "Vehicle Purchase",  emoji: "🚗" },
  { key: "property_purchase", hi: "संपत्ति/भूमि खरीद", en: "Property / Land",   emoji: "🏠" },
  { key: "business",          hi: "व्यापार आरंभ",     en: "Business Launch",   emoji: "🪙" },
  { key: "griha_pravesh",     hi: "गृह प्रवेश",       en: "Griha Pravesh",     emoji: "🪔" },
  { key: "marriage",          hi: "विवाह",            en: "Marriage",          emoji: "💍" },
  { key: "travel",            hi: "यात्रा आरंभ",      en: "Journey Start",     emoji: "🧳" },
  { key: "education",         hi: "विद्यारंभ",        en: "Education Start",   emoji: "📖" },
  { key: "naamkaran",         hi: "नामकरण",           en: "Naming Ceremony",   emoji: "🌸" },
];

const TARA_HI: Record<string, string> = {
  Janma: "जन्म", Sampat: "सम्पत्", Vipat: "विपत्", Kshema: "क्षेम", Pratyak: "प्रत्यरि",
  Sadhaka: "साधक", Vadha: "वध", Mitra: "मित्र", "Parama Mitra": "परम मित्र",
};
const WEEKDAY_HI: Record<string, string> = {
  Sunday: "रविवार", Monday: "सोमवार", Tuesday: "मंगलवार", Wednesday: "बुधवार",
  Thursday: "गुरुवार", Friday: "शुक्रवार", Saturday: "शनिवार",
};

function fmtDate(iso: string, isHi: boolean): string {
  const d = new Date(`${iso}T12:00:00`);
  return d.toLocaleDateString(isHi ? "hi-IN" : "en-IN", { day: "numeric", month: "long", year: "numeric" });
}

export default function ShubhMuhurtaTool() {
  const { lang } = useI18n();
  const isHi = lang === "hi";
  const [step, setStep] = useState<Step>("intake");
  const stepRef = useRef<HTMLDivElement>(null);

  const [purpose, setPurpose] = useState<MuhurtaPurpose | null>(null);
  const [birth, setBirth] = useState<BirthRequest | null>(null);
  const [month, setMonth] = useState("");                       // "" = full 3 months
  const [birth2, setBirth2] = useState<BirthRequest | null>(null);   // marriage: second person
  const [birthDraft, setBirthDraft] = useState<BirthRequest | null>(null); // marriage: first person (embedded form)
  const [preview, setPreview] = useState<MuhurtaPreviewResult | null>(null);
  const [result, setResult] = useState<MuhurtaFullResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [paying, setPaying] = useState(false);
  const [payPhone, setPayPhone] = useState("");
  const [payError, setPayError] = useState("");
  const [refCode, setRefCode] = useState(() => `MH-${Date.now().toString(36).toUpperCase()}`);
  const [orderId, setOrderId] = useState("");

  // On mount: restore a saved session — an accidental refresh must never lose
  // a preview, the birth details, or (above all) a PAID date list.
  useEffect(() => {
    try {
      const saved = window.sessionStorage.getItem("muhurta-state");
      if (saved) {
        const s = JSON.parse(saved);
        if (s.step && s.purpose) {
          setPurpose(s.purpose);
          setBirth(s.birth ?? null);
          setMonth(s.month ?? "");
          setBirth2(s.birth2 ?? null);
          setPreview(s.preview ?? null);
          setResult(s.result ?? null);
          setOrderId(s.orderId ?? "");
          if (s.refCode) setRefCode(s.refCode);
          // Paid but the result didn't make it into storage (refresh mid-compute):
          // the backend accepts a verified order_id again, so re-fetch it now.
          if (s.orderId && !s.result && s.birth && s.purpose) {
            setStep("computing");
            fetchMuhurtaPersonal({
              ...s.birth, purpose: s.purpose, ref_code: s.refCode, razorpay_order_id: s.orderId,
              ...(s.month ? { month: s.month } : {}), ...(s.birth2 ? { birth2: s.birth2 } : {}),
            })
              .then((res) => { setResult(res); setStep("result"); })
              .catch(() => setStep(s.preview ? "preview" : "intake"));
            return;
          }
          // never restore into the transient computing state
          setStep(s.step === "computing" ? "preview" : s.step);
        }
      }
    } catch { /* corrupted state — start fresh */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist the flow so refresh/tab-restore continues where the user left off.
  // orderId is kept because a verified order can re-fetch the paid list.
  useEffect(() => {
    if (step === "intake" && !preview && !result) {
      window.sessionStorage.removeItem("muhurta-state");
      return;
    }
    try {
      window.sessionStorage.setItem("muhurta-state", JSON.stringify({
        step, purpose, birth, month, birth2, preview, result, refCode, orderId,
      }));
    } catch { /* storage full/unavailable — degrade gracefully */ }
  }, [step, purpose, birth, month, birth2, preview, result, refCode, orderId]);

  // Browser BACK steps back one screen (result → preview → intake) instead of
  // dumping the user out of the flow; data survives via the saved session.
  useEffect(() => {
    if (step === "computing") return; // transient
    if (window.history.state?.mhStep === step) return;
    if (step === "intake" && !window.history.state?.mhStep) return; // initial entry
    window.history.pushState({ ...window.history.state, mhStep: step }, "");
  }, [step]);

  useEffect(() => {
    const onPop = (e: PopStateEvent) => {
      const s = e.state?.mhStep;
      if (s === "intake" || s === "preview" || s === "result") {
        setStep(s);
      } else if (s === undefined && window.location.pathname.includes("shubh-muhurta")) {
        setStep("intake");
      }
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    stepRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step]);

  useEffect(() => {
    if (document.querySelector('script[src*="checkout.razorpay.com"]')) return;
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const isMarriage = purpose === "marriage";

  // Month chips: current + next two (the backend clamps to tomorrow→+92d).
  const monthOptions = (() => {
    const out: Array<{ value: string; label: string }> = [];
    const now = new Date();
    for (let i = 0; i < 3; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
      out.push({
        value: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
        label: d.toLocaleDateString(isHi ? "hi-IN" : "en-IN", { month: "long", year: "numeric" }),
      });
    }
    return out;
  })();

  async function handleBirthSubmit(b: BirthRequest) {
    if (!purpose) {
      setError(isHi ? "पहले ऊपर से काम चुनें — किस चीज़ का मुहूर्त चाहिए?" : "First pick the purpose above — what do you need a date for?");
      return;
    }
    if (isMarriage && !birth2) {
      setError(isHi ? "विवाह के लिए वर और वधू दोनों का जन्म-विवरण चाहिए" : "Marriage needs BOTH the groom's and the bride's birth details");
      return;
    }
    setBirth(b);
    setError("");
    setLoading(true);
    try {
      const p = await fetchMuhurtaPreview({
        ...b, purpose, ref_code: refCode,
        ...(month ? { month } : {}),
        ...(isMarriage && birth2 ? { birth2 } : {}),
      });
      setPreview(p);
      setStep("preview");
    } catch (e) {
      setError(e instanceof SiteApiError ? e.message : (isHi ? "गणना में समस्या हुई — पुनः प्रयास करें" : "Something went wrong — please retry"));
    } finally {
      setLoading(false);
    }
  }

  async function handlePayOnline() {
    setPaying(true); setPayError("");
    try {
      const order = await createPaymentOrder({ kind: "muhurta-personal", slug: "muhurta-personal", ref_code: refCode, whatsapp: normalizePhone(payPhone) });
      const rzp = new window.Razorpay({
        key: order.key_id, amount: order.amount, currency: order.currency, order_id: order.order_id,
        prefill: { contact: normalizePhone(payPhone), ...(getStoredUser()?.email ? { email: getStoredUser()!.email } : {}) },
        name: "Astrologer Shivanii", description: "शुभ मुहूर्त — Personal Muhurta",
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
              ? "Checkout बंद हो गया। यदि आपने भुगतान पूरा किया है और वह यहां नहीं दिख रहा, तो कृपया WhatsApp पर संदेश करें।"
              : "Checkout closed. If you completed a payment and it isn't reflected here, message us on WhatsApp.");
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

  // HARD-gated: full list only after a verified razorpay_order_id.
  async function handleCompute(razorpayOrderId: string) {
    if (!birth || !purpose) return;
    setOrderId(razorpayOrderId);
    setStep("computing");
    try {
      const res = await fetchMuhurtaPersonal({
        ...birth, purpose, ref_code: refCode, razorpay_order_id: razorpayOrderId,
        ...(month ? { month } : {}),
        ...(isMarriage && birth2 ? { birth2 } : {}),
      });
      setResult(res);
      setStep("result");
    } catch (e) {
      setPayError(e instanceof SiteApiError ? e.message : (isHi
        ? "परिणाम लाने में समस्या हुई — Ref कोड के साथ WhatsApp पर संदेश करें"
        : "Couldn't fetch the result — message us on WhatsApp with your ref code"));
      setStep("preview");
    }
  }

  const purposeLabel = purpose ? PURPOSES.find((p) => p.key === purpose) : null;

  function renderRelaxation(relaxation: MuhurtaFullResult["relaxation_applied"]) {
    if (!relaxation || relaxation.length === 0) return null;
    return (
      <div className="result-box" style={{ border: "1px solid rgba(201,120,58,0.55)", background: "rgba(201,120,58,0.07)" }}>
        <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--maroon-deep)", margin: 0 }}>
          {isHi
            ? "पारदर्शिता: इस अवधि में कोई तारीख सभी शर्तें पास नहीं कर पाई — विधि के अनुसार सबसे कम महत्व वाली शर्तें छोड़ी गईं:"
            : "Transparency: no date passed every condition in this window — per the method, the lowest-weight conditions were relaxed:"}
        </p>
        <ul className={isHi ? "devanagari" : undefined} style={{ paddingLeft: "1.1rem", fontSize: "0.8rem", color: "var(--ink-light)", lineHeight: 1.7, margin: "0.4rem 0 0" }}>
          {relaxation.map((c, i) => <li key={i}>{isHi ? c.hi : c.en}</li>)}
        </ul>
      </div>
    );
  }

  function renderProfile(profile: MuhurtaFullResult["profile"], heading?: string) {
    return (
      <div className="result-box" key={heading ?? "p1"}>
        <div className="result-label">{heading ?? (isHi ? "आपकी कुंडली में क्या देखा गया" : "What We Checked In Your Chart")}</div>
        <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.87rem", color: "var(--ink-light)", lineHeight: 1.7, margin: "0.4rem 0 0" }}>
          {isHi
            ? <>इस काम के कारक ग्रह <strong>{profile.karaka}</strong> हैं — आपकी कुंडली में वे <strong>{profile.karaka_condition.sign}</strong> राशि ({profile.karaka_condition.dignity}) में, भाव {profile.karaka_condition.house} में हैं। आपका जन्म-नक्षत्र <strong>{profile.birth_nakshatra}</strong> है — नीचे की हर तारीख इसी से ताराबल जांच कर चुनी गई है।</>
            : <>The karaka (significator) planet for this purpose is <strong>{profile.karaka}</strong> — in your chart it sits in <strong>{profile.karaka_condition.sign}</strong> ({profile.karaka_condition.dignity}), house {profile.karaka_condition.house}. Your birth star is <strong>{profile.birth_nakshatra}</strong> — every date below has passed the tarabala check from it.</>}
        </p>
        {profile.cautions.length > 0 ? (
          <>
            <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.84rem", fontWeight: 700, color: "var(--maroon-deep)", margin: "0.7rem 0 0.3rem" }}>
              {isHi ? "सावधानी-संकेत (इनकी वजह से हमने सिर्फ सबसे मजबूत दिन चुने):" : "Caution signals (because of these, only the strongest days were kept):"}
            </p>
            <ul className={isHi ? "devanagari" : undefined} style={{ paddingLeft: "1.1rem", fontSize: "0.83rem", color: "var(--ink-light)", lineHeight: 1.7, margin: 0 }}>
              {profile.cautions.map((c, i) => <li key={i}>{isHi ? c.hi : c.en}</li>)}
            </ul>
            <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.78rem", color: "var(--muted)", margin: "0.5rem 0 0" }}>
              {isHi
                ? "घबराने की बात नहीं — ये संकेत बताते हैं कि आपके लिए तारीख चुनने में ज़्यादा सावधानी चाहिए, और हमने वही किया है।"
                : "Nothing to fear — these simply mean date-picking needs extra care for you, and that's exactly what we've applied."}
            </p>
          </>
        ) : (
          <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.84rem", color: "#1a7a3a", fontWeight: 600, margin: "0.6rem 0 0" }}>
            ✓ {isHi ? "आपकी कुंडली में इस काम के लिए कोई विशेष सावधानी-संकेत नहीं मिला।" : "No special caution signals found in your chart for this purpose."}
          </p>
        )}
        {!profile.tob_given && (
          <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.78rem", color: "var(--muted)", margin: "0.5rem 0 0" }}>
            {isHi
              ? "⚠ जन्म समय नहीं दिया गया — कुंडली-जांच सूर्योदय-कुंडली से हुई है (तारीखों की पंचांग-जांच पर असर नहीं)।"
              : "⚠ No birth time given — the chart checks used a sunrise chart (the panchang checks on dates are unaffected)."}
          </p>
        )}
      </div>
    );
  }

  function renderDate(d: MuhurtaDate, highlight = false) {
    return (
      <div key={d.date} className="result-box" style={highlight ? { border: "1.5px solid var(--gold)", background: "rgba(201,154,58,0.07)" } : undefined}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "0.5rem" }}>
          <strong className={isHi ? "devanagari" : undefined} style={{ color: "var(--maroon-deep)", fontSize: "1.02rem" }}>
            {fmtDate(d.date, isHi)} · {isHi ? WEEKDAY_HI[d.weekday] ?? d.weekday : d.weekday}
          </strong>
          <span className="trait-chip" style={d.quality === "Excellent" ? { background: "rgba(26,122,58,0.1)", borderColor: "rgba(26,122,58,0.4)", fontWeight: 700 } : undefined}>
            {d.quality === "Excellent" ? (isHi ? "उत्तम" : "Excellent") : d.quality === "Good" ? (isHi ? "शुभ" : "Good") : (isHi ? "साधारण" : "Fair")}
            {" · "}{Math.round(d.combined_score ?? d.score)}/100
          </span>
        </div>
        <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.82rem", color: "var(--ink-light)", margin: "0.4rem 0 0.4rem" }}>
          {isHi
            ? <>{d.nakshatra} नक्षत्र · {d.tithi} ({d.paksha === "Shukla" ? "शुक्ल" : "कृष्ण"} पक्ष) · आपके लिए <strong>{TARA_HI[d.tara] ?? d.tara} तारा</strong>{d.chandrabala_good ? " · चंद्रबल अनुकूल" : ""}</>
            : <>{d.nakshatra} nakshatra · {d.tithi} ({d.paksha} paksha) · <strong>{d.tara} tara</strong> for you{d.chandrabala_good ? " · chandrabala favorable" : ""}</>}
        </p>
        {d.yoga && (
          <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.78rem", color: "var(--muted)", margin: "0 0 0.4rem" }}>
            {isHi
              ? <>योग {d.yoga}{d.yoga_shubh ? "" : " ⚠"} · करण {d.karana}{d.karana_shubh ? "" : " ⚠"} · तिथि-वर्ग {d.tithi_group} · वार {d.vaar_tier === "shubh" ? "शुभ" : d.vaar_tier === "saumya" ? "सौम्य" : "क्रूर ⚠"}</>
              : <>Yoga {d.yoga}{d.yoga_shubh ? "" : " ⚠"} · Karana {d.karana}{d.karana_shubh ? "" : " ⚠"} · Tithi group {d.tithi_group} · Vaar {d.vaar_tier}{d.vaar_tier === "krur" ? " ⚠" : ""}</>}
          </p>
        )}
        {d.partner && (
          <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.8rem", color: "var(--ink-light)", margin: "0 0 0.4rem" }}>
            {isHi
              ? <>दूसरी कुंडली से भी शुभ: <strong>{TARA_HI[d.partner.tara] ?? d.partner.tara} तारा</strong>{d.partner.chandrabala_good ? " · चंद्रबल अनुकूल" : ""} · अंक {Math.round(d.partner.score)}/100</>
              : <>Auspicious for the second chart too: <strong>{d.partner.tara} tara</strong>{d.partner.chandrabala_good ? " · chandrabala favorable" : ""} · score {Math.round(d.partner.score)}/100</>}
          </p>
        )}
        {(d.relaxed ?? []).map((c, i) => (
          <p key={`rx${i}`} className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.76rem", color: "#9a5b1f", margin: "0 0 0.3rem" }}>
            ⚠ {isHi ? c.hi : c.en}
          </p>
        ))}
        {d.auspicious_slots.length > 0 && (
          <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.82rem", margin: 0 }}>
            <strong style={{ color: "var(--muted)" }}>{isHi ? "शुभ समय: " : "Good hours: "}</strong>
            {d.auspicious_slots.map((s) => `${s.start}–${s.end} (${s.choghadiya})`).join(" · ")}
          </p>
        )}
        {d.notes.map((n, i) => (
          <p key={i} className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.78rem", color: "var(--muted)", margin: "0.4rem 0 0" }}>
            ℹ {isHi ? n.hi : n.en}
          </p>
        ))}
      </div>
    );
  }

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: "760px" }}>
        <h1 className="section-heading devanagari">शुभ मुहूर्त</h1>
        <p className="section-heading-hi">Personal Muhurta Finder · ₹{PRICE}</p>

        <div className="tool-explainer" style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <p className={isHi ? "devanagari" : undefined}>
            {isHi
              ? <>गाड़ी, घर, व्यापार या कोई भी नई शुरुआत — <span className="hl">आपकी अपनी कुंडली</span> जांचकर अगले 3 महीने की <span className="hl">सबसे शुभ तारीखें</span>, हर तारीख के शुभ समय के साथ।</>
              : <>A vehicle, a home, a business, any new beginning — the <span className="hl">best dates in the next 3 months</span>, checked against <span className="hl">your own birth chart</span>, with the good hours of each day.</>}
          </p>
        </div>

        {step === "intake" && (
          <div ref={stepRef}>
            <PatrikaFrame>
              <div className="form-group">
                <label className="form-label">{isHi ? "किस काम का मुहूर्त चाहिए? *" : "What do you need a date for? *"}</label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "0.5rem" }}>
                  {PURPOSES.map((p) => (
                    <button
                      key={p.key} type="button"
                      onClick={() => { setPurpose(p.key); setError(""); }}
                      className={isHi ? "devanagari" : undefined}
                      style={{
                        padding: "0.6rem 0.5rem", borderRadius: "2px", cursor: "pointer", fontSize: "0.85rem", fontWeight: 600,
                        border: purpose === p.key ? "2px solid var(--maroon)" : "1px solid rgba(201,154,58,0.45)",
                        background: purpose === p.key ? "rgba(110,30,42,0.08)" : "rgba(255,255,255,0.5)",
                        color: "var(--maroon-deep)",
                      }}
                    >
                      {p.emoji} {isHi ? p.hi : p.en}
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">{isHi ? "किस महीने में चाहिए?" : "Which month do you want it in?"}</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {[{ value: "", label: isHi ? "अगले 3 महीने" : "Next 3 months" }, ...monthOptions].map((mo) => (
                    <button
                      key={mo.value} type="button"
                      onClick={() => setMonth(mo.value)}
                      className={isHi ? "devanagari" : undefined}
                      style={{
                        padding: "0.45rem 0.8rem", borderRadius: "2px", cursor: "pointer", fontSize: "0.82rem", fontWeight: 600,
                        border: month === mo.value ? "2px solid var(--maroon)" : "1px solid rgba(201,154,58,0.45)",
                        background: month === mo.value ? "rgba(110,30,42,0.08)" : "rgba(255,255,255,0.5)",
                        color: "var(--maroon-deep)",
                      }}
                    >
                      {mo.label}
                    </button>
                  ))}
                </div>
              </div>

              {isMarriage ? (
                <>
                  <p className={isHi ? "devanagari" : undefined} style={{ fontWeight: 700, color: "var(--maroon-deep)", margin: "0.4rem 0 0.6rem" }}>
                    {isHi ? "वर का जन्म-विवरण" : "Groom's birth details"}
                  </p>
                  <BirthForm embedded onChange={setBirthDraft} />
                  <p className={isHi ? "devanagari" : undefined} style={{ fontWeight: 700, color: "var(--maroon-deep)", margin: "1rem 0 0.6rem" }}>
                    {isHi ? "वधू का जन्म-विवरण" : "Bride's birth details"}
                  </p>
                  <BirthForm embedded onChange={setBirth2} />
                  <p className={`form-hint${isHi ? " devanagari" : ""}`} style={{ margin: "0.4rem 0 0.9rem" }}>
                    {isHi
                      ? "विवाह में पूरी जांच दोनों कुंडलियों पर चलती है — सिर्फ वही तारीखें आती हैं जो दोनों में शुभ हों।"
                      : "For marriage the entire screen runs on BOTH charts — only dates auspicious for both come back."}
                  </p>
                  <button
                    type="button" className="btn btn-primary" style={{ width: "100%" }}
                    disabled={loading || !birthDraft || !birth2}
                    onClick={() => birthDraft && handleBirthSubmit(birthDraft)}
                  >
                    {loading ? (isHi ? "गणना हो रही है…" : "Calculating…") : (isHi ? "गणना करें" : "Calculate")}
                  </button>
                </>
              ) : (
                <BirthForm onSubmit={handleBirthSubmit} loading={loading} />
              )}
              {/* BirthForm ends with its submit button — this hint needs real
                  clearance below it, not the negative pull-up used after
                  hint-ending forms (it overlapped the button). */}
              <p className={`form-hint${isHi ? " devanagari" : ""}`} style={{ marginTop: "0.9rem" }}>
                {isHi
                  ? "तारीखें आपकी कुंडली से जांची जाती हैं — ताराबल आपके जन्म-नक्षत्र से, चंद्राष्टम आपकी राशि से। इसीलिए एक ही तारीख किसी के लिए शुभ और किसी के लिए नहीं होती।"
                  : "Dates are checked against YOUR chart — tarabala from your birth star, chandrashtama from your Moon sign. That's why the same date can be right for one person and wrong for another."}
              </p>
              {error && <p className="form-error" style={{ marginTop: "1rem" }}>{error}</p>}
            </PatrikaFrame>
          </div>
        )}

        {step === "preview" && preview && (
          <div ref={stepRef}>
            <PatrikaFrame>
              <div style={{ textAlign: "center", marginBottom: "1rem" }}>
                <h2 className={isHi ? "devanagari" : undefined} style={{ fontSize: "1.25rem", marginBottom: "0.25rem" }}>
                  {isHi ? `${purposeLabel?.hi ?? ""} के लिए आपकी जांच` : `Your Screening for ${purposeLabel?.en ?? ""}`}
                </h2>
                <p className={isHi ? "devanagari" : undefined} style={{ color: "var(--muted)", fontSize: "0.85rem" }}>
                  {fmtDate(preview.from_date, isHi)} — {fmtDate(preview.to_date, isHi)}
                </p>
              </div>

              {/* Counts-only teaser (2026-08-24): nothing computed is shown
                  free — no dates, no chart profile, no cautions/windows.
                  All of it unlocks together behind the ₹51. */}
              {preview.total_found === 0 ? (
                <div className="result-box">
                  <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.87rem", color: "var(--ink-light)", lineHeight: 1.7 }}>
                    {isHi
                      ? "अगले 3 महीनों में इस काम के लिए हमारी सख्त जांच से कोई तारीख पास नहीं हुई — यह भी एक ईमानदार व उपयोगी उत्तर है। ऐसे में शिवानी जी से बात करें, वे आपकी पूरी कुंडली देखकर विकल्प निकाल सकती हैं।"
                      : "No date in the next 3 months cleared our strict screening for this purpose — an honest and useful answer in itself. Talk to Shivanii; from your full chart she can work out alternatives."}
                  </p>
                </div>
              ) : (
                <>
                  <div className="result-box" style={{ border: "1.5px solid var(--gold)", background: "rgba(201,154,58,0.07)", textAlign: "center" }}>
                    <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "1rem", fontWeight: 700, color: "var(--maroon-deep)", margin: 0 }}>
                      ✓ {isHi
                        ? `जांच पूरी — आपकी कुंडली${preview.purpose === "marriage" ? " (वर-वधू दोनों)" : ""} और पंचांग से ${preview.total_found} शुभ ${preview.total_found === 1 ? "तारीख मिली" : "तारीखें मिलीं"}`
                        : `Screening complete — ${preview.total_found} auspicious ${preview.total_found === 1 ? "date" : "dates"} found from your chart${preview.purpose === "marriage" ? " (both charts)" : ""} and the panchang`}
                    </p>
                    {preview.excellent_count > 0 && (
                      <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.85rem", color: "var(--ink-light)", margin: "0.4rem 0 0" }}>
                        {isHi ? `इनमें ${preview.excellent_count} उत्तम श्रेणी की ${preview.excellent_count === 1 ? "है" : "हैं"}` : `${preview.excellent_count} of them ${preview.excellent_count === 1 ? "is" : "are"} Excellent grade`}
                      </p>
                    )}
                    {!preview.tob_given && (
                      <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.78rem", color: "var(--muted)", margin: "0.5rem 0 0" }}>
                        {isHi
                          ? "⚠ जन्म समय नहीं दिया गया — कुंडली-जांच सूर्योदय-कुंडली से हुई है (तारीखों की पंचांग-जांच पर असर नहीं)।"
                          : "⚠ No birth time given — the chart checks used a sunrise chart (the panchang checks on dates are unaffected)."}
                      </p>
                    )}
                  </div>

                  <div className="tu-paywall" style={{ marginTop: "1.25rem" }}>
                    <div className="tu-paywall-price">₹{PRICE}</div>
                    <div className={`tu-paywall-sub${isHi ? " devanagari" : ""}`}>
                      {isHi
                        ? "पूरी तारीख-सूची, हर तारीख के शुभ समय के साथ + आपकी कुंडली की पूरी जांच-रिपोर्ट — कारक ग्रह की स्थिति, सावधानी-संकेत और कौन-सी अवधियां क्यों हटाई गईं"
                        : "The full date list with each day's good hours + your complete chart screening report — karaka condition, caution signals, and which periods were excluded and why"}
                    </div>
                    <PayPhoneField isHi={isHi} value={payPhone} onChange={setPayPhone} />
                    <button
                      type="button" className="btn btn-primary" style={{ width: "100%", marginBottom: "0.75rem" }}
                      onClick={handlePayOnline} disabled={paying || !normalizePhone(payPhone)}
                    >
                      {paying ? (isHi ? "भुगतान खुल रहा है…" : "Opening payment…") : (isHi ? `₹${PRICE} भुगतान करें — UPI / कार्ड` : `Pay ₹${PRICE} — UPI / Card`)}
                    </button>
                    {payError && <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.8rem", color: "#ffd7c9", marginBottom: "0.6rem" }}>{payError}</p>}
                    <p className="cta-note" style={{ fontSize: "0.72rem", marginTop: "0.4rem", color: "var(--gold-pale)" }}>Ref: {refCode}</p>
                  </div>
                </>
              )}
            </PatrikaFrame>
            <p style={{ textAlign: "center", marginTop: "0.75rem" }}>
              <button type="button" onClick={() => { setStep("intake"); setPreview(null); }}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.8rem", color: "var(--maroon)", fontWeight: 600, textDecoration: "underline" }}>
                ← {isHi ? "विवरण बदलें" : "Change details"}
              </button>
            </p>
          </div>
        )}

        {step === "computing" && (
          <div ref={stepRef}>
            <PatrikaFrame>
              <div className="tu-progress">
                <div className="tu-chakra" aria-hidden="true" />
                <p className="tu-progress-line">
                  {isHi ? "आपकी पूरी तारीख-सूची तैयार की जा रही है…" : "Preparing your full date list…"}
                </p>
              </div>
            </PatrikaFrame>
          </div>
        )}

        {step === "result" && result && (
          <div ref={stepRef} className="print-area">
            <DownloadReportButton filename="AstroShivanii-Shubh-Muhurta" />
            <PatrikaFrame>
              <div style={{ textAlign: "center", marginBottom: "1rem" }}>
                <h2 className={isHi ? "devanagari" : undefined} style={{ fontSize: "1.25rem", marginBottom: "0.25rem" }}>
                  {isHi ? `${purposeLabel?.hi ?? ""} — आपकी शुभ तारीखें` : `${purposeLabel?.en ?? ""} — Your Auspicious Dates`}
                </h2>
                <p className={isHi ? "devanagari" : undefined} style={{ color: "var(--muted)", fontSize: "0.85rem" }}>
                  {fmtDate(result.from_date, isHi)} — {fmtDate(result.to_date, isHi)} · {result.total_found} {isHi ? "तारीखें" : "dates"}
                </p>
              </div>

              {renderProfile(result.profile, result.profile2 ? (isHi ? "वर की कुंडली में क्या देखा गया" : "Checked In The Groom's Chart") : undefined)}
              {result.profile2 && renderProfile(result.profile2, isHi ? "वधू की कुंडली में क्या देखा गया" : "Checked In The Bride's Chart")}
              {renderRelaxation(result.relaxation_applied)}
              {result.dates.map((d, i) => renderDate(d, i === 0))}

              <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.78rem", color: "var(--muted)", textAlign: "center", marginTop: "0.9rem" }}>
                {isHi
                  ? "हर तारीख नक्षत्र-तिथि-वार शुद्धि, आपके जन्म-नक्षत्र से ताराबल, चंद्राष्टम-जांच और कारक ग्रह की गोचर-जांच से गुज़री है। बड़े संस्कार (विवाह/गृह प्रवेश) की अंतिम तारीख किसी योग्य ज्योतिषी से लग्न-शुद्धि करवाकर पक्की करें।"
                  : "Every date passed nakshatra-tithi-vara shuddhi, tarabala from your birth star, the chandrashtama check, and the karaka's transit check. For major ceremonies (marriage/griha pravesh), confirm the final date with lagna-shuddhi by a qualified astrologer."}
              </p>

              <Divider />
              <ResultCTA
                hook={{
                  en: "This screening covers the panchang and your chart's key factors — for a wedding or griha pravesh, Shivanii can fix the final lagna-shuddhi muhurta personally.",
                  hi: "यह जांच पंचांग और आपकी कुंडली के मुख्य तत्वों तक है — विवाह या गृह प्रवेश के लिए शिवानी जी स्वयं लग्न-शुद्धि सहित अंतिम मुहूर्त निकाल सकती हैं।",
                }}
                waText={`Namaste Shivanii ji! I used the Shubh Muhurta tool (${purposeLabel?.en ?? ""}, ref ${refCode}). I'd like you to fix the final muhurta personally.`}
                reading={{ href: "/readings/ask-one-question", labelEn: "Ask Shivanii Directly ₹499", labelHi: "शिवानी जी से सीधे पूछें ₹499" }}
              />
            </PatrikaFrame>
          </div>
        )}
      </div>
    </section>
  );
}
