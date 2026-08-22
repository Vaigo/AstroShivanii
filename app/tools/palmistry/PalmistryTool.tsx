"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import PatrikaFrame from "@/components/PatrikaFrame";
import Divider from "@/components/Divider";
import ResultCTA from "@/components/ResultCTA";
import { waLink } from "@/lib/config";
import {
  createPaymentOrder, verifyPayment, fetchPalmistryResult, precheckPalmistryPhotos, SiteApiError,
  type PalmistryResult, type PalmistryHand, type PalmistryPrecheckVerdict,
} from "@/lib/api/site";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open(): void; on(event: string, handler: (r: unknown) => void): void };
  }
}

const PRICE = 299;

type Step = "intake" | "paywall" | "computing" | "result";

const LINE_LABEL: Record<string, { hi: string; en: string }> = {
  life: { hi: "जीवन रेखा", en: "Life line" },
  head: { hi: "शीर्ष रेखा", en: "Head line" },
  heart: { hi: "हृदय रेखा", en: "Heart line" },
  fate: { hi: "भाग्य रेखा", en: "Fate line" },
  sun: { hi: "सूर्य रेखा", en: "Sun line" },
  health: { hi: "स्वास्थ्य रेखा", en: "Health line" },
  marriage: { hi: "विवाह/प्रेम रेखा", en: "Marriage/love line" },
};
const SHAPE_LABEL: Record<string, { hi: string; en: string }> = {
  nimna: { hi: "निम्न श्रेणी", en: "Elemental" },
  vargakar: { hi: "वर्गाकार", en: "Square" },
  phaila: { hi: "आगे से फैला हुआ", en: "Spatulate" },
  darshanik: { hi: "दार्शनिक", en: "Philosophic" },
  nukila: { hi: "नुकीला", en: "Conic" },
  shantinishth: { hi: "शांतिनिष्ठ", en: "Psychic" },
  mishrit: { hi: "मिश्रित", en: "Mixed" },
};

/** A hand-drawn illustration (not a real photo — no photo has permanent-use
 *  consent for this purpose) showing what a good submission looks like:
 *  flat hand, fingers naturally spread, filling a well-lit frame. */
function PalmSampleDiagram() {
  return (
    <svg viewBox="0 0 220 220" role="img" aria-label="Example: an open hand with fingers spread, filling the photo frame"
      style={{ width: "150px", height: "150px", flexShrink: 0 }}>
      <rect x="8" y="8" width="204" height="204" rx="18" fill="none" stroke="var(--gold)" strokeWidth="2" strokeDasharray="6 5" />
      {/* light cue */}
      <circle cx="34" cy="34" r="9" fill="var(--gold-bright)" opacity="0.85" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
        <line key={a} x1="34" y1="34" x2={34 + 15 * Math.cos((a * Math.PI) / 180)} y2={34 + 15 * Math.sin((a * Math.PI) / 180)}
          stroke="var(--gold-bright)" strokeWidth="1.5" opacity="0.6" />
      ))}
      {/* fingers, fanned from a pivot near the top of the palm */}
      <g stroke="var(--maroon)" strokeWidth="1.5">
        <rect x="101" y="22" width="18" height="80" rx="9" fill="var(--gold-pale)" transform="rotate(0 110 100)" />
        <rect x="101" y="32" width="16" height="70" rx="8" fill="var(--gold-pale)" transform="rotate(-16 110 100)" />
        <rect x="101" y="32" width="16" height="70" rx="8" fill="var(--gold-pale)" transform="rotate(16 110 100)" />
        <rect x="101" y="48" width="14" height="54" rx="7" fill="var(--gold-pale)" transform="rotate(34 110 100)" />
        <rect x="70" y="96" width="17" height="52" rx="8" fill="var(--gold-pale)" transform="rotate(-52 78 140)" />
      </g>
      {/* palm + wrist */}
      <ellipse cx="110" cy="146" rx="45" ry="52" fill="var(--gold-pale)" stroke="var(--maroon)" strokeWidth="1.5" />
      <rect x="86" y="188" width="48" height="24" rx="10" fill="var(--gold-pale)" stroke="var(--maroon)" strokeWidth="1.5" />
      {/* good-example badge */}
      <circle cx="186" cy="186" r="17" fill="#4caf7d" />
      <path d="M178 186 l5 6 l11 -14" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function PalmistryTool() {
  const { lang } = useI18n();
  const isHi = lang === "hi";
  const [step, setStep] = useState<Step>("intake");
  const stepRef = useRef<HTMLDivElement>(null);

  const [palmFile, setPalmFile] = useState<File | null>(null);
  const [otherHandFile, setOtherHandFile] = useState<File | null>(null);
  const [palmPreview, setPalmPreview] = useState<string | null>(null);
  const [otherPreview, setOtherPreview] = useState<string | null>(null);
  const [palmCheck, setPalmCheck] = useState<PalmistryPrecheckVerdict | "checking" | null>(null);
  const [otherCheck, setOtherCheck] = useState<PalmistryPrecheckVerdict | "checking" | null>(null);
  const [userName, setUserName] = useState("");
  const [gender, setGender] = useState<"" | "male" | "female">("");
  const [error, setError] = useState("");

  const palmCameraRef = useRef<HTMLInputElement>(null);
  const palmGalleryRef = useRef<HTMLInputElement>(null);
  const otherCameraRef = useRef<HTMLInputElement>(null);
  const otherGalleryRef = useRef<HTMLInputElement>(null);

  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState("");
  const [resultError, setResultError] = useState("");
  const [result, setResult] = useState<PalmistryResult | null>(null);
  const [refCode] = useState(() => `PM-${Date.now().toString(36).toUpperCase()}`);

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

  useEffect(() => () => {
    if (palmPreview) URL.revokeObjectURL(palmPreview);
    if (otherPreview) URL.revokeObjectURL(otherPreview);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function pickPalmFile(file: File | null) {
    setPalmFile(file);
    setPalmCheck(null);
    setPalmPreview((prev) => { if (prev) URL.revokeObjectURL(prev); return file ? URL.createObjectURL(file) : null; });
    if (!file) return;
    setPalmCheck("checking");
    precheckPalmistryPhotos({ palmImage: file }).then((r) => setPalmCheck(r.palm)).catch(() => setPalmCheck(null));
  }

  function pickOtherFile(file: File | null) {
    setOtherHandFile(file);
    setOtherCheck(null);
    setOtherPreview((prev) => { if (prev) URL.revokeObjectURL(prev); return file ? URL.createObjectURL(file) : null; });
    if (!file) return;
    setOtherCheck("checking");
    precheckPalmistryPhotos({ palmImage: file }).then((r) => setOtherCheck(r.palm)).catch(() => setOtherCheck(null));
  }

  const blocksContinue = (c: PalmistryPrecheckVerdict | "checking" | null) =>
    c === "checking" || (typeof c === "object" && c?.verdict === "retake");
  const palmBlocksContinue = blocksContinue(palmCheck);
  const otherBlocksContinue = blocksContinue(otherCheck);

  function handleContinueFromIntake() {
    if (!palmFile || !otherHandFile || !gender || palmBlocksContinue || otherBlocksContinue) return;
    setError("");
    setStep("paywall");
  }

  function renderCheckStatus(check: PalmistryPrecheckVerdict | "checking" | null) {
    if (check === "checking") {
      return <p className="form-hint" style={{ marginTop: "0.4rem" }}>{isHi ? "तस्वीर जाँची जा रही है…" : "Checking photo quality…"}</p>;
    }
    if (!check) return null;
    if (check.verdict === "good") {
      return (
        <p className={isHi ? "devanagari" : undefined} style={{ color: "#4caf7d", fontSize: "0.82rem", fontWeight: 600, marginTop: "0.4rem" }}>
          ✓ {isHi ? "अच्छी तस्वीर — पढ़ने के लिए तैयार" : "Looks good — ready to read"}
        </p>
      );
    }
    const [enMsg, hiMsg] = (check.message ?? "").split(" | ");
    const isRetake = check.verdict === "retake";
    return (
      <p className={isHi ? "devanagari" : undefined}
        style={{ color: isRetake ? "#ff8b7a" : "#ffcf7a", fontSize: "0.82rem", fontWeight: 600, marginTop: "0.4rem" }}>
        {isRetake ? "⚠ " : "ℹ "}{isHi ? (hiMsg || check.message) : (enMsg || check.message)}
      </p>
    );
  }

  async function handlePayOnline() {
    setPaying(true); setPayError("");
    try {
      const order = await createPaymentOrder({ kind: "palmistry", slug: "palmistry", name: userName.trim(), ref_code: refCode });
      const rzp = new window.Razorpay({
        key: order.key_id, amount: order.amount, currency: order.currency, order_id: order.order_id,
        name: "Astrologer Shivanii", description: "हस्त रेखा विश्लेषण — Palmistry Reading",
        prefill: { name: userName.trim() }, theme: { color: "#6E1E2A" },
        handler: async (response: unknown) => {
          const r = response as { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string };
          try {
            await verifyPayment(r);
            await handleAnalyze(r.razorpay_order_id);
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

  // HARD-gated: real analysis only ever runs after a verified
  // razorpay_order_id, checked server-side — no self-attest fallback (a
  // vision-AI call is too costly per attempt to leave a free path open).
  async function handleAnalyze(razorpayOrderId: string) {
    if (!palmFile || !otherHandFile) return;
    setResultError("");
    setStep("computing");
    try {
      const res = await fetchPalmistryResult({
        palmImage: palmFile, otherHandImage: otherHandFile,
        name: userName.trim() || undefined, gender: gender || undefined, ref_code: refCode,
        razorpay_order_id: razorpayOrderId, language: lang as "en" | "hi",
      });
      setResult(res);
      setStep("result");
    } catch (e) {
      setResultError(e instanceof SiteApiError ? e.message : (isHi
        ? "विश्लेषण में समस्या हुई — Ref कोड के साथ WhatsApp पर संदेश करें"
        : "Couldn't analyze the photo — message us on WhatsApp with your ref code"));
      setStep("paywall");
    }
  }

  const waMessage =
    `Namaste Shivanii ji! 🙏 मैंने आपकी वेबसाइट पर "हस्त रेखा विश्लेषण" के लिए भुगतान करना है — ₹${PRICE}.\n` +
    `Reference: ${refCode}`;

  const phase = step === "intake" ? 1 : step === "paywall" ? 2 : 3;
  const phases = [
    { n: 1, hi: "तस्वीरें लें", en: "Take photos" },
    { n: 2, hi: `विश्लेषण पाएं (₹${PRICE})`, en: `Get analysis (₹${PRICE})` },
  ];

  function renderHand(hand: PalmistryHand, title: string) {
    const shape = SHAPE_LABEL[hand.hand_shape];
    const presentLines = Object.entries(hand.lines).filter(([, v]) => v.present);
    return (
      <div className="result-box" key={title}>
        <div className="result-label">{title}</div>
        <p className={isHi ? "devanagari" : undefined} style={{ margin: "0.4rem 0" }}>
          <strong style={{ color: "var(--muted)" }}>{isHi ? "हाथ की बनावट" : "Hand shape"}:</strong>{" "}
          {shape ? (isHi ? shape.hi : shape.en) : hand.hand_shape}
        </p>
        {presentLines.length > 0 ? (
          <ul className={isHi ? "devanagari" : undefined}>
            {presentLines.map(([key, v]) => (
              <li key={key}>
                {LINE_LABEL[key] ? (isHi ? LINE_LABEL[key].hi : LINE_LABEL[key].en) : key}
                {v.length && ` — ${v.length}`}{v.continuity && `, ${v.continuity}`}
              </li>
            ))}
          </ul>
        ) : (
          <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
            {isHi
              ? "इस तस्वीर में कोई रेखा पूरे भरोसे के साथ नहीं पहचानी जा सकी — यह आम बात है।"
              : "No line could be confidently identified in this photo — that's common."}
          </p>
        )}
        {hand.marks.length > 0 && (
          <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.85rem" }}>
            {isHi ? "विशेष चिह्न: " : "Marks found: "}
            {hand.marks.map((m) => m.shape).join(", ")}
          </p>
        )}
      </div>
    );
  }

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: step === "result" ? "900px" : "720px" }}>
        <h1 className="section-heading">हस्त रेखा विश्लेषण</h1>
        <p className="section-heading-hi devanagari">Palmistry Reading (Hast Rekha Shastra) · ₹{PRICE}</p>

        <div className="tool-explainer" style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <p className="devanagari">
            अपनी <span className="hl">हथेली की तस्वीर</span> भेजें — हाथ की बनावट, रेखाएं, पर्वत और विशेष चिह्नों का
            वास्तविक विश्लेषण, हर खोज के साथ ईमानदार भरोसे का स्तर।
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

        {step === "intake" && (
          <div ref={stepRef}>
            <PatrikaFrame>
              <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start", marginBottom: "1.4rem", flexWrap: "wrap" }}>
                <PalmSampleDiagram />
                <div style={{ flex: "1 1 220px", minWidth: "200px" }}>
                  <p className={isHi ? "devanagari" : undefined} style={{ fontWeight: 700, marginBottom: "0.4rem", color: "var(--maroon-deep)" }}>
                    {isHi ? "अच्छी तस्वीर ऐसी दिखती है" : "A good photo looks like this"}
                  </p>
                  <ul className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.85rem", margin: 0, paddingLeft: "1.1rem", lineHeight: 1.7 }}>
                    <li>{isHi ? "हाथ सीधा, सपाट, उंगलियां स्वाभाविक रूप से थोड़ी फैली हुई" : "Hand flat and open, fingers naturally spread"}</li>
                    <li>{isHi ? "हथेली सीधे कैमरे की ओर — कोई तिरछापन नहीं" : "Palm facing straight at the camera — not angled"}</li>
                    <li>{isHi ? "अच्छी, सम रोशनी — तेज़ परछाई से बचें" : "Even, good lighting — avoid harsh shadows"}</li>
                    <li>{isHi ? "हथेली फ्रेम का अधिकतर हिस्सा भरे, पर पूरी तरह दिखे" : "Palm fills most of the frame, but stays fully visible"}</li>
                    <li>{isHi ? "तस्वीर फोकस में हो, धुंधली न हो" : "Photo is in focus, not blurry"}</li>
                  </ul>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="pm-palm-gallery">
                  {isHi ? "हथेली की तस्वीर (आवश्यक)" : "Palm photo (required)"}
                </label>
                <span className="form-hint" style={{ display: "block", marginBottom: "0.55rem" }}>
                  {isHi
                    ? "यह मुख्य तस्वीर है — इसी से रेखाएं, पर्वत और हाथ की बनावट पढ़ी जाती है। जितनी स्पष्ट तस्वीर, उतना भरोसेमंद विश्लेषण।"
                    : "This is the main photo — lines, mounts and hand shape are all read from it. The clearer it is, the more confident the reading."}
                </span>
                <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => palmCameraRef.current?.click()}>
                    📷 {isHi ? "तस्वीर लें" : "Take Photo"}
                  </button>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => palmGalleryRef.current?.click()}>
                    🖼️ {isHi ? "गैलरी से चुनें" : "Upload from Gallery"}
                  </button>
                </div>
                <input ref={palmCameraRef} id="pm-palm-camera" type="file" accept="image/*" capture="environment"
                  style={{ display: "none" }} onChange={(e) => pickPalmFile(e.target.files?.[0] ?? null)} />
                <input ref={palmGalleryRef} id="pm-palm-gallery" type="file" accept="image/*"
                  style={{ display: "none" }} onChange={(e) => pickPalmFile(e.target.files?.[0] ?? null)} />

                {palmFile && (
                  <div style={{ display: "flex", gap: "0.7rem", alignItems: "center", marginTop: "0.7rem" }}>
                    {palmPreview && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={palmPreview} alt="" style={{ width: "56px", height: "56px", objectFit: "cover", borderRadius: "8px", border: "1px solid var(--gold)" }} />
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: "0.8rem", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{palmFile.name}</p>
                      {renderCheckStatus(palmCheck)}
                    </div>
                    <button type="button" onClick={() => pickPalmFile(null)}
                      style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.1rem", color: "var(--muted)" }}
                      aria-label={isHi ? "तस्वीर हटाएं" : "Remove photo"}>×</button>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="pm-other-gallery">
                  {isHi ? "दूसरे हाथ की तस्वीर (आवश्यक)" : "Other hand's photo (required)"}
                </label>
                <span className="form-hint" style={{ display: "block", marginBottom: "0.55rem" }}>
                  {isHi
                    ? "दोनों हाथों की तुलना असली हस्तरेखा-विद्या की परंपरा है — एक हाथ आपके जन्मजात स्वभाव को, दूसरा आज तक के विकास को दर्शाता है। दोनों तस्वीरों के बिना पूर्ण पाठन संभव नहीं।"
                    : "Comparing both hands is real classical technique — one shows innate tendency, the other how it's developed so far. A full reading needs both photos."}
                </span>
                <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => otherCameraRef.current?.click()}>
                    📷 {isHi ? "तस्वीर लें" : "Take Photo"}
                  </button>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => otherGalleryRef.current?.click()}>
                    🖼️ {isHi ? "गैलरी से चुनें" : "Upload from Gallery"}
                  </button>
                </div>
                <input ref={otherCameraRef} id="pm-other-camera" type="file" accept="image/*" capture="environment"
                  style={{ display: "none" }} onChange={(e) => pickOtherFile(e.target.files?.[0] ?? null)} />
                <input ref={otherGalleryRef} id="pm-other-gallery" type="file" accept="image/*"
                  style={{ display: "none" }} onChange={(e) => pickOtherFile(e.target.files?.[0] ?? null)} />

                {otherHandFile && (
                  <div style={{ display: "flex", gap: "0.7rem", alignItems: "center", marginTop: "0.7rem" }}>
                    {otherPreview && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={otherPreview} alt="" style={{ width: "56px", height: "56px", objectFit: "cover", borderRadius: "8px", border: "1px solid var(--gold)" }} />
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: "0.8rem", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{otherHandFile.name}</p>
                      {renderCheckStatus(otherCheck)}
                    </div>
                    <button type="button" onClick={() => pickOtherFile(null)}
                      style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.1rem", color: "var(--muted)" }}
                      aria-label={isHi ? "तस्वीर हटाएं" : "Remove photo"}>×</button>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="pm-name">{isHi ? "आपका नाम" : "Your name"}</label>
                <input
                  id="pm-name" className="form-input" type="text"
                  value={userName} onChange={(e) => setUserName(e.target.value)} maxLength={60}
                  placeholder={isHi ? "जैसे: राहुल शर्मा" : "e.g. Rahul Sharma"}
                />
                <span className="form-hint">
                  {isHi ? "पाठन में आपको नाम से संबोधित करने के लिए" : "So the reading can address you by name"}
                </span>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="pm-gender">{isHi ? "लिंग" : "Gender"}</label>
                <select
                  id="pm-gender" className="form-input"
                  value={gender} onChange={(e) => setGender(e.target.value as "" | "male" | "female")}
                >
                  <option value="">{isHi ? "चुनें" : "Select"}</option>
                  <option value="female">{isHi ? "स्त्री" : "Female"}</option>
                  <option value="male">{isHi ? "पुरुष" : "Male"}</option>
                </select>
                <span className="form-hint">
                  {isHi ? "सही हिंदी वाक्य-रचना के लिए आवश्यक — यह पूर्वानुमान नहीं बदलता" : "Needed for grammatically correct Hindi phrasing — this doesn't change what's predicted"}
                </span>
              </div>

              <button
                type="button" className="btn btn-primary" style={{ width: "100%" }}
                disabled={!palmFile || !otherHandFile || !gender || palmBlocksContinue || otherBlocksContinue}
                onClick={handleContinueFromIntake}
              >
                {palmCheck === "checking" || otherCheck === "checking"
                  ? (isHi ? "तस्वीरें जाँची जा रही हैं…" : "Checking photos…")
                  : (isHi ? "आगे बढ़ें" : "Continue")}
              </button>
              {error && <p className="form-error" style={{ marginTop: "1rem" }}>{error}</p>}
            </PatrikaFrame>
          </div>
        )}

        {step === "paywall" && (
          <div ref={stepRef}>
            <PatrikaFrame>
              <div className="tu-paywall">
                <div className="tu-paywall-price">₹{PRICE}</div>
                <div className="tu-paywall-sub">
                  {isHi ? "पूर्ण हस्त रेखा विश्लेषण — रेखाएं, पर्वत, बनावट, विशेष चिह्न" : "Full palmistry reading — lines, mounts, hand shape, special marks"}
                </div>
                <button
                  type="button" className="btn btn-primary" style={{ width: "100%", marginBottom: "0.75rem" }}
                  onClick={handlePayOnline} disabled={paying}
                >
                  {paying ? (isHi ? "भुगतान खुल रहा है…" : "Opening payment…") : (isHi ? `₹${PRICE} भुगतान करें — UPI / कार्ड` : `Pay ₹${PRICE} — UPI / Card`)}
                </button>
                {payError && <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.8rem", color: "#ffd7c9", marginBottom: "0.6rem" }}>{payError}</p>}
                {resultError && <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.8rem", color: "#ffd7c9", marginBottom: "0.6rem" }}>{resultError}</p>}
                <a href={waLink(waMessage)} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm" style={{ color: "var(--gold-bright)", borderColor: "var(--gold)" }}>
                  {isHi ? "WhatsApp से भुगतान" : "Pay via WhatsApp"}
                </a>
                <p className="cta-note" style={{ fontSize: "0.72rem", marginTop: "0.6rem", color: "var(--gold-pale)" }}>Ref: {refCode}</p>
              </div>
            </PatrikaFrame>
            <p style={{ textAlign: "center", marginTop: "0.75rem" }}>
              <button type="button" onClick={() => setStep("intake")}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.8rem", color: "var(--maroon)", fontWeight: 600, textDecoration: "underline" }}>
                ← {isHi ? "तस्वीर बदलें" : "Change photo"}
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
                  {isHi ? "आपकी हथेली का विश्लेषण किया जा रहा है…" : "Analyzing your palm…"}
                </p>
              </div>
            </PatrikaFrame>
          </div>
        )}

        {step === "result" && result && (
          <div ref={stepRef}>
            <PatrikaFrame className="tu-answer">
              <div className="result-box" style={{ marginTop: 0 }}>
                <div className="result-label">{isHi ? "पूर्ण उत्तर" : "Full Reading"}</div>
                <div className={`tu-answer-body${isHi ? " devanagari" : ""}`} style={{ marginTop: "0.5rem" }}>
                  <p className="tu-answer-opening">{result.opening}</p>
                  {result.narrative.split(/\n{2,}|\n/).filter(Boolean).map((para, i) => <p key={i}>{para}</p>)}
                </div>
                {result.timing_note && (
                  <div className={`tu-timing${isHi ? " devanagari" : ""}`}>
                    <strong style={{ color: "var(--maroon-deep)" }}>{isHi ? "नोट: " : "Note: "}</strong>{result.timing_note}
                  </div>
                )}
              </div>

              {renderHand(result.dossier.primary_hand, isHi ? "आपकी हथेली से" : "From Your Palm")}
              {result.dossier.other_hand && renderHand(result.dossier.other_hand, isHi ? "दूसरे हाथ से" : "From Your Other Hand")}

              {result.tips.length > 0 && (
                <div className="result-box">
                  <div className="result-label" style={{ marginBottom: "0.6rem" }}>{isHi ? "व्यावहारिक सुझाव" : "Practical Tips"}</div>
                  <ol className={`tu-tips-list${isHi ? " devanagari" : ""}`}>
                    {result.tips.map((tp, i) => <li key={i}>{tp}</li>)}
                  </ol>
                </div>
              )}

              <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.78rem", color: "var(--muted)", textAlign: "center", marginTop: "0.9rem" }}>
                {isHi
                  ? `कोई समस्या हो तो Ref कोड (${refCode}) के साथ WhatsApp पर संदेश करें।`
                  : `Any issue? Message on WhatsApp with your ref code (${refCode}).`}
              </p>

              <Divider />
              <ResultCTA
                hook={{
                  en: "This reading is from photo-based measurement and AI identification — a live session with Shivanii can examine your actual hand in far more depth.",
                  hi: "यह पाठन तस्वीर-आधारित मापन और AI पहचान पर आधारित है — शिवानी जी के साथ लाइव सत्र में आपके असली हाथ की कहीं अधिक गहराई से जांच होती है।",
                }}
                waText={`Namaste Shivanii ji! I got a palmistry reading on your website. I'd like a live reading for a deeper analysis.`}
                reading={{ href: "/readings/ask-one-question", labelEn: "Live Consultation", labelHi: "लाइव परामर्श" }}
              />
            </PatrikaFrame>
          </div>
        )}
      </div>
    </section>
  );
}
