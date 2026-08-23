"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import BirthForm from "@/components/BirthForm";
import PatrikaFrame from "@/components/PatrikaFrame";
import DownloadReportButton from "@/components/DownloadReportButton";
import Divider from "@/components/Divider";
import ResultCTA from "@/components/ResultCTA";
import PayPhoneField, { normalizePhone } from "@/components/PayPhoneField";
import {
  createPaymentOrder, verifyPayment, fetchPalmistryResult, precheckPalmistryPhotos, SiteApiError,
  type PalmistryResult, type PalmistryHand, type PalmistryPrecheckVerdict, type MuhurtaBirth, getStoredUser,
} from "@/lib/api/site";
import {
  LINE_MEANINGS, LINE_QUALITY_NOTES, MOUNT_MEANINGS, PROMINENCE_LABEL, SHAPE_MEANINGS, splitBold,
} from "@/lib/palmistry-meanings";

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

/** A real reference photo (CC BY-SA 4.0, Wikimedia Commons — see
 *  public/palmistry/ATTRIBUTION.md) showing what a good submission looks
 *  like: flat hand, fingers naturally spread, filling a well-lit frame.
 *  An earlier hand-drawn SVG attempt at this read as an unrecognizable
 *  blob — a real photo doesn't have that risk. */
function PalmSampleDiagram() {
  return (
    <div style={{ position: "relative", width: "132px", height: "180px", flexShrink: 0 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/palmistry/sample-good-photo.jpg"
        alt="Example of a good palm photo: flat hand, fingers spread, palm facing the camera, filling the frame"
        width={132}
        height={180}
        style={{
          width: "132px", height: "180px", objectFit: "contain", objectPosition: "center",
          background: "var(--gold-pale)", borderRadius: "8px", border: "2px dashed var(--gold)",
        }}
      />
      <span style={{
        position: "absolute", bottom: "-8px", right: "-8px", width: "26px", height: "26px", borderRadius: "50%",
        background: "#4caf7d", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid var(--panel-solid)",
      }} aria-hidden="true">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 12l5 5L20 6" />
        </svg>
      </span>
    </div>
  );
}

/** Real in-browser camera capture. `capture="environment"` on a plain file
 *  input only HINTS mobile browsers to prefer the camera — on desktop, and
 *  inconsistently on some mobile browsers, it just opens the same file
 *  picker as the gallery button, which is exactly the "Take Photo does
 *  nothing different" complaint this replaces. Uses getUserMedia for an
 *  actual live camera view with its own capture button. */
function CameraCapture({ onCapture, onClose, isHi }: { onCapture: (file: File) => void; onClose: () => void; isHi: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    navigator.mediaDevices?.getUserMedia({ video: { facingMode: "environment" }, audio: false })
      .then((stream) => {
        if (cancelled) { stream.getTracks().forEach((t) => t.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch(() => setError(isHi
        ? "कैमरा एक्सेस नहीं मिला — ब्राउज़र को अनुमति दें, या गैलरी से चुनें"
        : "Couldn't access the camera — allow permission in your browser, or upload from gallery instead"));
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [isHi]);

  function handleCapture() {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      if (blob) onCapture(new File([blob], `camera-${Date.now()}.jpg`, { type: "image/jpeg" }));
    }, "image/jpeg", 0.92);
  }

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(20,8,10,0.92)", zIndex: 1000,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "1.25rem",
    }}>
      {error ? (
        <>
          <p className={isHi ? "devanagari" : undefined} style={{ color: "#fff", marginBottom: "1.2rem", textAlign: "center", maxWidth: "360px" }}>{error}</p>
          <button type="button" className="btn btn-ghost btn-sm" onClick={onClose} style={{ color: "#fff", borderColor: "#fff" }}>
            {isHi ? "बंद करें" : "Close"}
          </button>
        </>
      ) : (
        <>
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video ref={videoRef} autoPlay playsInline muted
            style={{ maxWidth: "100%", maxHeight: "70vh", borderRadius: "8px", border: "2px solid var(--gold)" }} />
          <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
            <button type="button" className="btn btn-primary" onClick={handleCapture}>
              📸 {isHi ? "फ़ोटो लें" : "Capture"}
            </button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={onClose} style={{ color: "#fff", borderColor: "#fff" }}>
              {isHi ? "रद्द करें" : "Cancel"}
            </button>
          </div>
        </>
      )}
    </div>
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
  // optional birth details — unlock the dated "कब विशेष ध्यान रखें" windows
  const [palmBirth, setPalmBirth] = useState<MuhurtaBirth | null>(null);
  const [gender, setGender] = useState<"" | "male" | "female">("");
  const [error, setError] = useState("");

  const palmGalleryRef = useRef<HTMLInputElement>(null);
  const otherGalleryRef = useRef<HTMLInputElement>(null);
  const [cameraFor, setCameraFor] = useState<"palm" | "other" | null>(null);

  const [paying, setPaying] = useState(false);
  const [payPhone, setPayPhone] = useState("");
  const [payError, setPayError] = useState("");
  const [resultError, setResultError] = useState("");
  const [result, setResult] = useState<PalmistryResult | null>(null);
  const [refCode, setRefCode] = useState(() => `PM-${Date.now().toString(36).toUpperCase()}`);
  const [orderId, setOrderId] = useState("");

  // On mount: restore a saved session. The uploaded photos are File objects
  // and cannot survive a refresh, so the PAID result body itself is what gets
  // persisted — a refresh at the result step must never vaporize a ₹299 reading.
  useEffect(() => {
    try {
      const saved = window.sessionStorage.getItem("palmistry-state");
      if (saved) {
        const s = JSON.parse(saved);
        setUserName(s.userName ?? "");
        if (s.gender) setGender(s.gender);
        setOrderId(s.orderId ?? "");
        setPalmBirth(s.palmBirth ?? null);
        if (s.refCode) setRefCode(s.refCode);
        if (s.result) {
          setResult(s.result);
          setStep("result");
        }
        // No result yet → restart at intake (photos are gone; the paywall
        // without photos would be a dead end).
      }
    } catch { /* corrupted state — start fresh */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist as soon as anything worth keeping exists — above all the result,
  // written the moment it arrives so even a crash right after payment keeps it.
  useEffect(() => {
    if (!result && !userName && !gender && !orderId) return;
    try {
      window.sessionStorage.setItem("palmistry-state", JSON.stringify({ userName, gender, palmBirth, result, refCode, orderId }));
    } catch { /* storage full/unavailable — degrade gracefully */ }
  }, [userName, gender, palmBirth, result, refCode, orderId]);

  // Browser BACK steps back one screen instead of leaving the tool; the
  // paywall is only a valid target while the photos still exist in memory.
  useEffect(() => {
    if (step === "computing") return; // transient
    if (window.history.state?.pmStep === step) return;
    if (step === "intake" && !window.history.state?.pmStep) return; // initial entry
    window.history.pushState({ ...window.history.state, pmStep: step }, "");
  }, [step]);

  useEffect(() => {
    const onPop = (e: PopStateEvent) => {
      const s = e.state?.pmStep;
      if (s === "paywall") {
        setStep(palmFile && otherHandFile ? "paywall" : "intake");
      } else if (s === "intake" || s === "result") {
        setStep(s);
      } else if (s === undefined && window.location.pathname.includes("palmistry")) {
        setStep("intake");
      }
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [palmFile, otherHandFile]);

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
      const order = await createPaymentOrder({ kind: "palmistry", slug: "palmistry", name: userName.trim(), ref_code: refCode, whatsapp: normalizePhone(payPhone) });
      const rzp = new window.Razorpay({
        key: order.key_id, amount: order.amount, currency: order.currency, order_id: order.order_id,
        name: "Astrologer Shivanii", description: "हस्त रेखा विश्लेषण — Palmistry Reading",
        prefill: { name: userName.trim(), contact: normalizePhone(payPhone), ...(getStoredUser()?.email ? { email: getStoredUser()!.email } : {}) }, theme: { color: "#6E1E2A" },
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

  // HARD-gated: real analysis only ever runs after a verified
  // razorpay_order_id, checked server-side — no self-attest fallback (a
  // vision-AI call is too costly per attempt to leave a free path open).
  async function handleAnalyze(razorpayOrderId: string) {
    if (!palmFile || !otherHandFile) return;
    setOrderId(razorpayOrderId);
    setResultError("");
    setStep("computing");
    try {
      const res = await fetchPalmistryResult({
        palmImage: palmFile, otherHandImage: otherHandFile,
        name: userName.trim() || undefined, gender: gender || undefined, ref_code: refCode,
        razorpay_order_id: razorpayOrderId, language: lang as "en" | "hi",
        birth: palmBirth,
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

  const phase = step === "intake" ? 1 : step === "paywall" ? 2 : 3;
  const phases = [
    { n: 1, hi: "तस्वीरें लें", en: "Take photos" },
    { n: 2, hi: `विश्लेषण पाएं (₹${PRICE})`, en: `Get analysis (₹${PRICE})` },
  ];

  /** Render **bold** narration spans as real highlights. */
  function boldText(text: string) {
    return splitBold(text).map((seg, i) =>
      seg.bold ? <strong key={i} className="hl">{seg.text}</strong> : <span key={i}>{seg.text}</span>);
  }

  function renderHand(hand: PalmistryHand, title: string) {
    const shape = SHAPE_LABEL[hand.hand_shape];
    const shapeMeaning = SHAPE_MEANINGS[hand.hand_shape];
    const presentLines = Object.entries(hand.lines).filter(([, v]) => v.present);
    const notableMounts = Object.entries(hand.mounts ?? {}).filter(([, m]) => m.prominence !== "average");
    return (
      <div className="result-box" key={title}>
        <div className="result-label">{title}</div>
        <p className={isHi ? "devanagari" : undefined} style={{ margin: "0.4rem 0" }}>
          <strong style={{ color: "var(--muted)" }}>{isHi ? "हाथ की बनावट" : "Hand shape"}:</strong>{" "}
          <strong>{shape ? (isHi ? shape.hi : shape.en) : hand.hand_shape}</strong>
          {shapeMeaning && <span style={{ color: "var(--ink-light)" }}> — {isHi ? shapeMeaning.hi : shapeMeaning.en}</span>}
        </p>
        {presentLines.length > 0 ? (
          <ul className={isHi ? "devanagari" : undefined} style={{ lineHeight: 1.75 }}>
            {presentLines.map(([key, v]) => {
              const meaning = LINE_MEANINGS[key];
              const qual = [v.length && LINE_QUALITY_NOTES[v.length], v.continuity && LINE_QUALITY_NOTES[v.continuity]]
                .filter(Boolean).map((q) => (isHi ? q!.hi : q!.en)).join(" · ");
              return (
                <li key={key} style={{ marginBottom: "0.35rem" }}>
                  <strong>{LINE_LABEL[key] ? (isHi ? LINE_LABEL[key].hi : LINE_LABEL[key].en) : key}</strong>
                  {qual && <span style={{ color: "var(--muted)", fontSize: "0.82rem" }}> ({qual})</span>}
                  {meaning && (
                    <span style={{ display: "block", fontSize: "0.82rem", color: "var(--ink-light)" }}>
                      {isHi ? meaning.hi : meaning.en}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
            {isHi
              ? "इस तस्वीर में कोई रेखा पूरे भरोसे के साथ नहीं पहचानी जा सकी — यह आम बात है।"
              : "No line could be confidently identified in this photo — that's common."}
          </p>
        )}
        {notableMounts.length > 0 && (
          <div style={{ marginTop: "0.6rem" }}>
            <p className={isHi ? "devanagari" : undefined} style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--maroon-deep)", margin: "0 0 0.25rem" }}>
              {isHi ? "पर्वत (हथेली के उभार)" : "Mounts (the palm's raised pads)"}
            </p>
            <ul className={isHi ? "devanagari" : undefined} style={{ lineHeight: 1.7 }}>
              {notableMounts.map(([key, m]) => {
                const info = MOUNT_MEANINGS[key];
                const prom = PROMINENCE_LABEL[m.prominence];
                return (
                  <li key={key} style={{ fontSize: "0.85rem" }}>
                    <strong>{info ? (isHi ? info.name_hi : info.name_en) : key}</strong>
                    {info && <> — {isHi ? info.hi : info.en}</>}
                    {prom && <span style={{ color: "var(--muted)" }}> · {isHi ? prom.hi : prom.en}</span>}
                  </li>
                );
              })}
            </ul>
            <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.74rem", color: "var(--muted)", margin: "0.25rem 0 0" }}>
              {isHi
                ? "नोट: उभार 3D होता है — एक सपाट तस्वीर से यह अनुमान ही है, इसलिए इन्हें रेखाओं जितना पक्का न मानें।"
                : "Note: a bulge is 3D — from one flat photo this is an estimate, so weigh mounts more lightly than lines."}
            </p>
          </div>
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
      {cameraFor && (
        <CameraCapture
          isHi={isHi}
          onClose={() => setCameraFor(null)}
          onCapture={(file) => {
            if (cameraFor === "palm") pickPalmFile(file); else pickOtherFile(file);
            setCameraFor(null);
          }}
        />
      )}
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
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => setCameraFor("palm")}>
                    📷 {isHi ? "तस्वीर लें" : "Take Photo"}
                  </button>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => palmGalleryRef.current?.click()}>
                    🖼️ {isHi ? "गैलरी से चुनें" : "Upload from Gallery"}
                  </button>
                </div>
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
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => setCameraFor("other")}>
                    📷 {isHi ? "तस्वीर लें" : "Take Photo"}
                  </button>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => otherGalleryRef.current?.click()}>
                    🖼️ {isHi ? "गैलरी से चुनें" : "Upload from Gallery"}
                  </button>
                </div>
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

              <div className="form-group" style={{ border: "1px dashed rgba(201,154,58,0.55)", borderRadius: "4px", padding: "0.8rem 0.9rem", background: "rgba(201,154,58,0.05)" }}>
                <label className="form-label" style={{ marginBottom: "0.2rem" }}>
                  {isHi ? "जन्म-विवरण (वैकल्पिक)" : "Birth details (optional)"}
                </label>
                <span className={`form-hint${isHi ? " devanagari" : ""}`} style={{ display: "block", marginBottom: "0.6rem" }}>
                  {isHi
                    ? "अधिक सटीकता के लिए जन्म-विवरण जोड़ें — रिपोर्ट में 'कब विशेष ध्यान रखें' की तारीख़-सहित अवधियां भी मिलेंगी।"
                    : "Add birth details for more accuracy — your report will also include dated 'when to be extra careful' periods."}
                </span>
                <BirthForm embedded onChange={setPalmBirth} />
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
                <PayPhoneField isHi={isHi} value={payPhone} onChange={setPayPhone} />
                <button
                  type="button" className="btn btn-primary" style={{ width: "100%", marginBottom: "0.75rem" }}
                  onClick={handlePayOnline} disabled={paying || !normalizePhone(payPhone)}
                >
                  {paying ? (isHi ? "भुगतान खुल रहा है…" : "Opening payment…") : (isHi ? `₹${PRICE} भुगतान करें — UPI / कार्ड` : `Pay ₹${PRICE} — UPI / Card`)}
                </button>
                {payError && <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.8rem", color: "#ffd7c9", marginBottom: "0.6rem" }}>{payError}</p>}
                {resultError && <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.8rem", color: "#ffd7c9", marginBottom: "0.6rem" }}>{resultError}</p>}
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
          <div ref={stepRef} className="print-area">
            <DownloadReportButton filename="AstroShivanii-Palmistry-Reading" />
            <PatrikaFrame className="tu-answer">
              {result.topic_insight && (
                <div className="result-box" style={{ marginTop: 0, background: "rgba(201,154,58,0.07)" }}>
                  <div className="result-label">{isHi ? "यह पाठन कैसे पढ़ें" : "How To Read This"}</div>
                  <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.85rem", color: "var(--ink-light)", lineHeight: 1.7, margin: "0.35rem 0 0" }}>
                    {boldText(result.topic_insight)}
                  </p>
                </div>
              )}
              <div className="result-box" style={{ marginTop: result.topic_insight ? undefined : 0 }}>
                <div className="result-label">{isHi ? "पूर्ण उत्तर" : "Full Reading"}</div>
                <div className={`tu-answer-body${isHi ? " devanagari" : ""}`} style={{ marginTop: "0.5rem" }}>
                  <p className="tu-answer-opening">{boldText(result.opening)}</p>
                  {result.narrative.split(/\n{2,}|\n/).filter(Boolean).map((para, i) => <p key={i}>{boldText(para)}</p>)}
                </div>
                {result.timing_note && (
                  <div className={`tu-timing${isHi ? " devanagari" : ""}`}>
                    <strong style={{ color: "var(--maroon-deep)" }}>{isHi ? "नोट: " : "Note: "}</strong>{boldText(result.timing_note)}
                  </div>
                )}
              </div>

              {(result.future_signs ?? []).length > 0 && (
                <div className="result-box" style={{ border: "1.5px solid var(--gold)", background: "rgba(201,154,58,0.08)" }}>
                  <div className="result-label" style={{ marginBottom: "0.6rem" }}>
                    ✦ {isHi ? "आगे के संकेत" : "Signs For The Road Ahead"}
                  </div>
                  <ol className={`tu-tips-list${isHi ? " devanagari" : ""}`}>
                    {result.future_signs!.map((s, i) => <li key={i}>{boldText(s)}</li>)}
                  </ol>
                  <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.74rem", color: "var(--muted)", margin: "0.5rem 0 0" }}>
                    {isHi
                      ? "ये शास्त्रीय प्रवृत्ति-संकेत हैं — दिशा दिखाते हैं, तारीख़ या गारंटी नहीं।"
                      : "These are classical tendency-signs — they show direction, not dates or guarantees."}
                  </p>
                </div>
              )}

              {((result.caution_signs ?? []).length > 0 || (result.timing_cautions ?? []).length > 0) && (
                <div className="result-box" style={{ border: "1px solid rgba(160,90,30,0.5)", background: "rgba(160,90,30,0.06)" }}>
                  <div className="result-label" style={{ marginBottom: "0.6rem" }}>
                    {isHi ? "सावधानी-संकेत (दुर्घटना/नुकसान)" : "Caution Signs (accident/loss)"}
                  </div>
                  <ol className={`tu-tips-list${isHi ? " devanagari" : ""}`}>
                    {result.caution_signs!.map((s, i) => <li key={i}>{boldText(s)}</li>)}
                  </ol>
                  {(result.timing_cautions ?? []).length > 0 && (
                    <div style={{ marginTop: "0.7rem" }}>
                      <p className={isHi ? "devanagari" : undefined} style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--maroon-deep)", margin: "0 0 0.35rem" }}>
                        {isHi ? "कब विशेष ध्यान रखें" : "When to take extra care"}
                      </p>
                      <ol className={`tu-tips-list${isHi ? " devanagari" : ""}`}>
                        {result.timing_cautions!.map((s, i) => <li key={`tc${i}`}>{boldText(s)}</li>)}
                      </ol>
                    </div>
                  )}
                  <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.74rem", color: "var(--muted)", margin: "0.5rem 0 0" }}>
                    {isHi
                      ? "ये तैयारी के संकेत हैं, घटना की घोषणा नहीं — डरने की कोई बात नहीं।"
                      : "These are signs to prepare, never announcements of events — nothing to fear."}
                  </p>
                </div>
              )}

              {renderHand(result.dossier.primary_hand, isHi ? "आपकी हथेली से" : "From Your Palm")}
              {result.dossier.other_hand && renderHand(result.dossier.other_hand, isHi ? "दूसरे हाथ से" : "From Your Other Hand")}

              {(result.remedies ?? []).length > 0 && (
                <div className="result-box">
                  <div className="result-label" style={{ marginBottom: "0.6rem" }}>{isHi ? "उपाय" : "Remedies"}</div>
                  <ol className={`tu-tips-list${isHi ? " devanagari" : ""}`}>
                    {result.remedies.map((r, i) => <li key={i}>{boldText(r)}</li>)}
                  </ol>
                </div>
              )}

              {result.tips.length > 0 && (
                <div className="result-box">
                  <div className="result-label" style={{ marginBottom: "0.6rem" }}>{isHi ? "व्यावहारिक सुझाव" : "Practical Tips"}</div>
                  <ol className={`tu-tips-list${isHi ? " devanagari" : ""}`}>
                    {result.tips.map((tp, i) => <li key={i}>{boldText(tp)}</li>)}
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
