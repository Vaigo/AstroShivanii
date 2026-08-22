"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import BirthForm from "@/components/BirthForm";
import DownloadReportButton from "@/components/DownloadReportButton";
import PatrikaFrame from "@/components/PatrikaFrame";
import Divider from "@/components/Divider";
import ResultCTA from "@/components/ResultCTA";
import {
  createPaymentOrder, verifyPayment, fetchMuhurtaPreview, fetchMuhurtaPersonal, SiteApiError,
  type MuhurtaPurpose, type MuhurtaPreviewResult, type MuhurtaFullResult, type MuhurtaDate,
} from "@/lib/api/site";
import type { BirthRequest } from "@/lib/api/types";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open(): void; on(event: string, handler: (r: unknown) => void): void };
  }
}

const PRICE = 199;

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
  const [preview, setPreview] = useState<MuhurtaPreviewResult | null>(null);
  const [result, setResult] = useState<MuhurtaFullResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState("");
  const [refCode] = useState(() => `MH-${Date.now().toString(36).toUpperCase()}`);

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

  async function handleBirthSubmit(b: BirthRequest) {
    if (!purpose) {
      setError(isHi ? "पहले ऊपर से काम चुनें — किस चीज़ का मुहूर्त चाहिए?" : "First pick the purpose above — what do you need a date for?");
      return;
    }
    setBirth(b);
    setError("");
    setLoading(true);
    try {
      const p = await fetchMuhurtaPreview({ ...b, purpose, ref_code: refCode });
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
      const order = await createPaymentOrder({ kind: "muhurta-personal", slug: "muhurta-personal", ref_code: refCode });
      const rzp = new window.Razorpay({
        key: order.key_id, amount: order.amount, currency: order.currency, order_id: order.order_id,
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
    setStep("computing");
    try {
      const res = await fetchMuhurtaPersonal({ ...birth, purpose, ref_code: refCode, razorpay_order_id: razorpayOrderId });
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

  function renderProfile(profile: MuhurtaPreviewResult["profile"]) {
    return (
      <div className="result-box">
        <div className="result-label">{isHi ? "आपकी कुंडली में क्या देखा गया" : "What We Checked In Your Chart"}</div>
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
            {d.quality === "Excellent" ? (isHi ? "उत्तम" : "Excellent") : (isHi ? "शुभ" : "Good")}
          </span>
        </div>
        <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.82rem", color: "var(--ink-light)", margin: "0.4rem 0 0.4rem" }}>
          {isHi
            ? <>{d.nakshatra} नक्षत्र · {d.tithi} ({d.paksha === "Shukla" ? "शुक्ल" : "कृष्ण"} पक्ष) · आपके लिए <strong>{TARA_HI[d.tara] ?? d.tara} तारा</strong>{d.chandrabala_good ? " · चंद्रबल अनुकूल" : ""}</>
            : <>{d.nakshatra} nakshatra · {d.tithi} ({d.paksha} paksha) · <strong>{d.tara} tara</strong> for you{d.chandrabala_good ? " · chandrabala favorable" : ""}</>}
        </p>
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
              <BirthForm onSubmit={handleBirthSubmit} loading={loading} />
              <p className={`form-hint${isHi ? " devanagari" : ""}`} style={{ marginTop: "-0.5rem" }}>
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

              {renderProfile(preview.profile)}

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
                  <div className="result-label" style={{ margin: "1rem 0 0.25rem" }}>
                    {isHi ? "आपकी सबसे शुभ तारीख (निःशुल्क झलक)" : "Your Best Date (free preview)"}
                  </div>
                  {preview.best_date && renderDate(preview.best_date, true)}

                  {preview.remaining_count > 0 && (
                    <div className="tu-paywall" style={{ marginTop: "1.25rem" }}>
                      <div className="tu-paywall-price">₹{PRICE}</div>
                      <div className={`tu-paywall-sub${isHi ? " devanagari" : ""}`}>
                        {isHi
                          ? `${preview.remaining_count} और शुभ तारीखें मिली हैं — पूरी 3-महीने की सूची, हर तारीख के शुभ समय के साथ`
                          : `${preview.remaining_count} more auspicious dates found — the full 3-month list, with each day's good hours`}
                      </div>
                      <button
                        type="button" className="btn btn-primary" style={{ width: "100%", marginBottom: "0.75rem" }}
                        onClick={handlePayOnline} disabled={paying}
                      >
                        {paying ? (isHi ? "भुगतान खुल रहा है…" : "Opening payment…") : (isHi ? `₹${PRICE} भुगतान करें — UPI / कार्ड` : `Pay ₹${PRICE} — UPI / Card`)}
                      </button>
                      {payError && <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.8rem", color: "#ffd7c9", marginBottom: "0.6rem" }}>{payError}</p>}
                      <p className="cta-note" style={{ fontSize: "0.72rem", marginTop: "0.4rem", color: "var(--gold-pale)" }}>Ref: {refCode}</p>
                    </div>
                  )}
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

              {renderProfile(result.profile)}
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
