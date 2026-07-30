"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import BirthForm from "@/components/BirthForm";
import PatrikaFrame from "@/components/PatrikaFrame";
import Divider from "@/components/Divider";
import Icon from "@/components/Icon";
import ResultCTA from "@/components/ResultCTA";
import KundliChart from "@/components/KundliChart";
import { waLink } from "@/lib/config";
import { fetchKundli, fetchTurantUttarAI } from "@/lib/api/endpoints";
import { resolveTier, getFactSheet, type FactSheet } from "@/lib/turant-uttar-engine";
import { PLANET_HI } from "@/lib/hindi-labels";
import {
  CATEGORIES, CONTENT, FALLBACK_CATEGORY, matchCategory,
  type CategoryKey, type Tier,
} from "@/lib/turant-uttar-data";
import type { BirthRequest, KundliFullResult, TurantUttarAIResult } from "@/lib/api/types";
import { ApiError } from "@/lib/api/client";

const PRICE = 149;

/** Hindi label for the house each category reads, used only in the
 *  progress-animation status lines. */
const HOUSE_LABEL_HI: Record<CategoryKey, string> = {
  love: "शुक्र व सप्तम भाव", breakup: "सप्तम व द्वादश भाव", marriage: "सप्तम भाव",
  career: "दशम भाव", govtJob: "सूर्य व दशम भाव", finance: "एकादश भाव", health: "षष्ठ भाव",
  children: "पंचम भाव", foreign: "द्वादश भाव",
};

const ORDINAL_HI = ["", "प्रथम", "द्वितीय", "तृतीय", "चतुर्थ", "पंचम", "षष्ठ", "सप्तम", "अष्टम", "नवम", "दशम", "एकादश", "द्वादश"];
const STRENGTH_HI: Record<FactSheet["strength"], string> = { strong: "बलवान", neutral: "सामान्य", weak: "दुर्बल" };
const STRENGTH_COLOR: Record<FactSheet["strength"], string> = { strong: "#1a7a3a", neutral: "#c99a3a", weak: "#c0392b" };

type Step = "pick" | "birth" | "computing" | "teaser" | "narrating" | "unlocked";

/** useSearchParams() requires a Suspense boundary for static export builds. */
export default function TurantUttarTool() {
  return (
    <Suspense fallback={null}>
      <TurantUttarInner />
    </Suspense>
  );
}

function TurantUttarInner() {
  const { t, lang } = useI18n();
  const isHi = lang === "hi";
  const searchParams = useSearchParams();
  const [step, setStep] = useState<Step>("pick");
  const [category, setCategory] = useState<CategoryKey | null>(null);
  const [questionText, setQuestionText] = useState("");
  const [customText, setCustomText] = useState("");
  const [error, setError] = useState("");
  const [tier, setTier] = useState<Tier | null>(null);
  const [kundli, setKundli] = useState<KundliFullResult | null>(null);
  const [facts, setFacts] = useState<FactSheet | null>(null);
  const [birthData, setBirthData] = useState<BirthRequest | null>(null);
  const [birthDraft, setBirthDraft] = useState<BirthRequest | null>(null);
  const [userName, setUserName] = useState("");
  const [userGender, setUserGender] = useState<"" | "male" | "female">("");
  const [situation, setSituation] = useState("");
  const [narration, setNarration] = useState<TurantUttarAIResult | null>(null);
  const [progressLine, setProgressLine] = useState(0);
  const [refCode, setRefCode] = useState(() => `TU-${Date.now().toString(36).toUpperCase()}`);
  const stepRef = useRef<HTMLDivElement>(null);

  // On mount: restore a saved session first (an accidental refresh must never
  // lose the user's question, chart, ref code — or a paid answer). Only if
  // there's nothing to restore, apply the ?category deep-link from /tools.
  useEffect(() => {
    try {
      const saved = window.sessionStorage.getItem("tu-state");
      if (saved) {
        const s = JSON.parse(saved);
        if (s.step && s.category) {
          setCategory(s.category);
          setQuestionText(s.questionText ?? "");
          setBirthData(s.birthData ?? null);
          setKundli(s.kundli ?? null);
          setFacts(s.facts ?? null);
          setTier(s.tier ?? null);
          setNarration(s.narration ?? null);
          setSituation(s.situation ?? "");
          if (s.refCode) setRefCode(s.refCode);
          // Never restore into a transient loading state
          setStep(s.step === "computing" || s.step === "narrating" ? "birth" : s.step);
          return;
        }
      }
    } catch { /* corrupted state — start fresh */ }

    const catParam = searchParams.get("category");
    const def = CATEGORIES.find((c) => c.key === catParam);
    if (def) {
      setCategory(def.key);
      setQuestionText(isHi ? def.chip.hi : def.chip.en);
      setStep("birth");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist the flow so refresh/tab-restore continues where the user left off.
  useEffect(() => {
    if (step === "pick") {
      window.sessionStorage.removeItem("tu-state");
      return;
    }
    try {
      window.sessionStorage.setItem("tu-state", JSON.stringify({
        step, category, questionText, birthData, kundli, facts, tier, narration, refCode, situation,
      }));
    } catch { /* storage full/unavailable — degrade to pre-fix behavior */ }
  }, [step, category, questionText, birthData, kundli, facts, tier, narration, refCode, situation]);

  // Scroll to the new step on every CHANGE — but not on first mount, so a
  // fresh visitor sees the title, explainer, and step map before anything else.
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    stepRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step]);

  // Browser BACK should step back one screen (birth → pick, teaser → birth),
  // not dump the user out of the flow entirely. Each user-visible step gets a
  // history entry; popstate restores it. Data survives via the saved session.
  useEffect(() => {
    if (step === "computing" || step === "narrating") return; // transient
    if (window.history.state?.tuStep === step) return;
    if (step === "pick" && !window.history.state?.tuStep) return; // initial entry
    window.history.pushState({ ...window.history.state, tuStep: step }, "");
  }, [step]);

  useEffect(() => {
    const onPop = (e: PopStateEvent) => {
      const s = e.state?.tuStep;
      if (s === "pick" || s === "birth" || s === "teaser" || s === "unlocked") {
        setStep(s);
      } else if (s === undefined && window.location.pathname.includes("turant-uttar")) {
        setStep("pick");
      }
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  function pickCategory(cat: CategoryKey) {
    const def = CATEGORIES.find((c) => c.key === cat)!;
    setCategory(cat);
    setQuestionText(isHi ? def.chip.hi : def.chip.en);
    setStep("birth");
  }

  function submitCustom(e: React.FormEvent) {
    e.preventDefault();
    if (!customText.trim()) return;
    setQuestionText(customText.trim());
    setCategory(matchCategory(customText) ?? FALLBACK_CATEGORY);
    setStep("birth");
  }

  async function handleBirth(birth: BirthRequest) {
    setError("");
    setStep("computing");
    setProgressLine(0);

    const lineTimer = setInterval(() => {
      setProgressLine((i) => Math.min(i + 1, progressLines.length - 1));
    }, 1100);

    try {
      const [result] = await Promise.all([
        fetchKundli(birth),
        new Promise((r) => setTimeout(r, 4400)), // paced so the animation feels real, not instant-fake
      ]);
      clearInterval(lineTimer);
      setKundli(result);
      setBirthData(birth);
      setFacts(getFactSheet(result, category!));
      setTier(resolveTier(result, category!));
      setStep("teaser");
    } catch (e) {
      clearInterval(lineTimer);
      setError(e instanceof ApiError ? e.message : t("form.error"));
      setStep("birth");
    }
  }

  /** TEMPORARY (v1): called after the WhatsApp self-attested "I've paid"
   *  click. Swap this for a real Razorpay Payment Link + webhook-confirmed
   *  unlock later — the narration call itself doesn't need to change. */
  async function handleUnlock() {
    setStep("narrating");
    try {
      const result = await fetchTurantUttarAI(
        birthData!, category!, questionText, lang, situation.trim() || undefined
      );
      // Until the AI key is configured the backend returns a facts-only
      // template. Blend in our hand-written tier verdict so the answer
      // still opens warm and human, then grounds itself in the chart facts.
      if (result.narrated_by === "template" && category && tier) {
        const warm = CONTENT[category][tier];
        result.narrative = `${lang === "hi" ? warm.answer.hi : warm.answer.en}\n\n${result.narrative}`;
        if (!result.remedies?.length && warm.remedy) {
          result.remedies = [lang === "hi" ? warm.remedy.hi : warm.remedy.en];
        }
      }
      setNarration(result);
    } catch {
      setNarration(null); // falls back to the local template answer below
    }
    setStep("unlocked");
  }

  const progressLines = category ? [
    isHi ? "आपकी कुंडली पढ़ी जा रही है…" : "Reading your birth chart…",
    isHi ? "वर्तमान दशा की जांच हो रही है…" : "Checking your current dasha…",
    isHi ? `${HOUSE_LABEL_HI[category]} का विश्लेषण…` : "Analysing the relevant house & planet…",
    isHi ? "उत्तर तैयार किया जा रहा है…" : "Preparing your answer…",
  ] : [];

  const content = category && tier ? CONTENT[category][tier] : null;
  const tierPct = tier ? (tier - 1) / 3 * 100 : 0;

  // Every internal step maps to one of 3 phases a first-time visitor can
  // hold in their head: choose the question, give birth details, get the answer.
  const phase = step === "pick" ? 1 : step === "birth" ? 2 : 3;
  const phases = [
    { n: 1, hi: "प्रश्न चुनें", en: "Choose question" },
    { n: 2, hi: "जन्म विवरण", en: "Birth details" },
    { n: 3, hi: `उत्तर पाएं (₹${PRICE})`, en: `Get answer (₹${PRICE})` },
  ];

  const waMessage =
    `Namaste Shivanii ji! 🙏 मैंने आपकी वेबसाइट पर "तुरंत उत्तर" के लिए भुगतान करना है — ₹${PRICE}.\n` +
    `Reference: ${refCode}\nप्रश्न: ${questionText}`;

  return (
    <section className="section">
      {/* Focused width while asking; generous width for reading the answer */}
      <div className="container" style={{ maxWidth: step === "unlocked" ? "900px" : "720px" }}>
        <h1 className="section-heading">तुरंत उत्तर पाएं</h1>
        <p className="section-heading-hi devanagari">Instant Quick-Take Answer · ₹{PRICE}</p>

        <div className="tool-explainer" style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <p className="devanagari">
            आपका <span className="hl">प्रश्न</span> चुनें — हम आपकी कुंडली से{" "}
            <span className="hl">वास्तविक गणना</span> करते हैं और तुरंत एक संक्षिप्त उत्तर देते हैं।
            गहन विश्लेषण चाहिए? शिवानी जी से पूर्ण पाठन बुक करें।
          </p>
        </div>

        {/* Always-visible 3-step map — a first-time visitor sees the whole
            journey (and the price) up front, and always knows where they are. */}
        <div className="tu-steps">
          {phases.map((p) => (
            <div key={p.n} className={`tu-step-item${phase === p.n ? " active" : phase > p.n ? " done" : ""}`}>
              <div className="tu-step-num">{phase > p.n ? "✓" : p.n}</div>
              <div className="tu-step-label devanagari">{isHi ? p.hi : p.en}</div>
            </div>
          ))}
        </div>

        {/* ── Step: pick ─────────────────────────────────────────────────── */}
        {step === "pick" && (
          <div ref={stepRef}>
            <div className="tu-category-grid">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.key}
                  type="button"
                  className="tu-category-chip"
                  onClick={() => pickCategory(cat.key)}
                >
                  <span className="tu-category-chip-icon"><Icon name={cat.icon} size={20} /></span>
                  <span className="tu-category-chip-text">{isHi ? cat.chip.hi : cat.chip.en}</span>
                </button>
              ))}
            </div>

            <PatrikaFrame className="tu-custom-box">
              <form onSubmit={submitCustom}>
                <div className="form-group">
                  <label className="form-label">{isHi ? "या अपना प्रश्न लिखें" : "Or type your own question"}</label>
                  <input
                    className="form-input"
                    type="text"
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    placeholder={isHi ? "अपना प्रश्न यहां लिखें…" : "Type your question here…"}
                    maxLength={200}
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={!customText.trim()}>
                  {isHi ? "आगे बढ़ें" : "Continue"}
                </button>
              </form>
            </PatrikaFrame>
          </div>
        )}

        {/* ── Step: birth details ────────────────────────────────────────── */}
        {step === "birth" && (
          <div ref={stepRef}>
            <p style={{ textAlign: "center", marginBottom: "1rem" }}>
              <strong className={isHi ? "devanagari" : undefined}>
                {isHi ? "आपका प्रश्न: " : "Your question: "}
              </strong>
              {questionText}
            </p>
            <PatrikaFrame>
              {/* Name + gender: address them personally, and write correct
                  gendered Hindi. Optional — never a wall. */}
              <div className="form-2col">
                <div className="form-group">
                  <label className="form-label" htmlFor="tu-name">{isHi ? "आपका नाम (वैकल्पिक)" : "Your name (optional)"}</label>
                  <input
                    id="tu-name"
                    className="form-input"
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    maxLength={60}
                    placeholder={isHi ? "उत्तर में इसी नाम से संबोधन होगा" : "We'll address you by this name"}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="tu-gender">{isHi ? "लिंग (वैकल्पिक)" : "Gender (optional)"}</label>
                  <select
                    id="tu-gender"
                    className="form-select"
                    value={userGender}
                    onChange={(e) => setUserGender(e.target.value as "" | "male" | "female")}
                  >
                    <option value="">{isHi ? "— चुनें —" : "— select —"}</option>
                    <option value="female">{isHi ? "महिला" : "Female"}</option>
                    <option value="male">{isHi ? "पुरुष" : "Male"}</option>
                  </select>
                </div>
              </div>

              <BirthForm embedded onChange={setBirthDraft} />

              <div className="form-group">
                <label className="form-label" htmlFor="tu-situation">
                  {isHi ? "चाहें तो अपनी स्थिति 2–3 पंक्तियों में बताइए (वैकल्पिक)" : "Share your situation in 2–3 lines (optional)"}
                </label>
                <textarea
                  id="tu-situation"
                  className="form-input"
                  rows={3}
                  value={situation}
                  onChange={(e) => setSituation(e.target.value)}
                  maxLength={400}
                  placeholder={isHi ? "जैसे: शादी को 3 साल हुए हैं, कुछ महीनों से दूरी महसूस हो रही है…" : "e.g., married 3 years, feeling some distance lately…"}
                  style={{ resize: "vertical" }}
                />
                <span className="form-hint">
                  {isHi
                    ? "इससे उत्तर आपकी परिस्थिति से जुड़ता है — गणना कुंडली से ही होती है"
                    : "This shapes the answer to your life — the calculation still comes only from your chart"}
                </span>
              </div>

              <button
                type="button"
                className="btn btn-primary"
                style={{ width: "100%" }}
                disabled={!birthDraft}
                onClick={() =>
                  birthDraft &&
                  handleBirth({
                    ...birthDraft,
                    name: userName.trim() || undefined,
                    gender: userGender || undefined,
                  })
                }
              >
                {t("form.calculate")}
              </button>
              {error && <p className="form-error" style={{ marginTop: "1rem" }}>{error}</p>}
            </PatrikaFrame>
            <p style={{ textAlign: "center", marginTop: "0.75rem" }}>
              <button
                type="button"
                onClick={() => setStep("pick")}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.8rem", color: "var(--maroon)", fontWeight: 600, textDecoration: "underline" }}
              >
                ← {isHi ? "प्रश्न बदलें" : "Change question"}
              </button>
            </p>
          </div>
        )}

        {/* ── Step: computing (real fetch + paced animation) ─────────────── */}
        {step === "computing" && (
          <div ref={stepRef}>
            <PatrikaFrame>
              <div className="tu-progress">
                <div className="tu-chakra" aria-hidden="true" />
                <p className="tu-progress-line">{progressLines[progressLine]}</p>
              </div>
            </PatrikaFrame>
          </div>
        )}

        {/* ── Step: teaser + paywall ──────────────────────────────────────── */}
        {step === "teaser" && content && (
          <div ref={stepRef}>
            <PatrikaFrame>
              <div className="tu-tier-strip">
                <div className="tu-tier-marker" style={{ left: `${tierPct}%` }} />
              </div>
              <div className="tu-teaser-box">
                <p className={isHi ? "devanagari" : undefined}>{isHi ? content.teaser.hi : content.teaser.en}</p>
              </div>

              <div className="tu-paywall">
                <div className="tu-paywall-price">₹{PRICE}</div>
                <div className="tu-paywall-sub">
                  {isHi ? "पूर्ण उत्तर + आवश्यक होने पर उपाय" : "Full answer + remedy if relevant"}
                </div>
                <a
                  href={waLink(waMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{ width: "100%", marginBottom: "0.75rem" }}
                >
                  {isHi ? `WhatsApp पर ₹${PRICE} भुगतान करें` : `Pay ₹${PRICE} on WhatsApp`}
                </a>
                <button
                  type="button"
                  className="btn btn-ghost"
                  style={{ width: "100%", color: "var(--gold-bright)", borderColor: "var(--gold)" }}
                  onClick={handleUnlock}
                >
                  {isHi ? "मैंने भुगतान कर दिया — उत्तर देखें" : "I've Paid — Show My Answer"}
                </button>
                <p className="cta-note" style={{ fontSize: "0.72rem", marginTop: "0.6rem", color: "var(--gold-pale)" }}>
                  Ref: {refCode}
                </p>
                <p className={`cta-note${isHi ? " devanagari" : ""}`} style={{ fontSize: "0.75rem", marginTop: "0.4rem", color: "var(--gold-pale)" }}>
                  {isHi
                    ? "उत्तर न मिले तो पूर्ण रिफंड — बस Ref कोड के साथ WhatsApp पर संदेश करें"
                    : "No answer = full refund — just message on WhatsApp with your ref code"}
                </p>
              </div>
            </PatrikaFrame>
          </div>
        )}

        {/* ── Step: narrating (real chart dossier being written up) ──────── */}
        {step === "narrating" && (
          <div ref={stepRef}>
            <PatrikaFrame>
              <div className="tu-progress">
                <div className="tu-chakra" aria-hidden="true" />
                <p className="tu-progress-line">
                  {isHi ? "आपका विस्तृत उत्तर तैयार किया जा रहा है…" : "Preparing your detailed answer…"}
                </p>
              </div>
            </PatrikaFrame>
          </div>
        )}

        {/* ── Step: unlocked full answer ──────────────────────────────────── */}
        {step === "unlocked" && content && facts && kundli && (
          <div ref={stepRef}>
            <PatrikaFrame className="tu-answer">
              <div className="tu-tier-strip">
                <div className="tu-tier-marker" style={{ left: `${tierPct}%` }} />
              </div>

              {/* The question, echoed — a paid answer must visibly address THE question */}
              <div className="tu-question-echo">
                <span className="q-label">{isHi ? "आपका प्रश्न" : "Your Question"}</span>
                <span className="q-text">{questionText}</span>
              </div>

              {/* Real, per-person chart facts — the question's house shaded saffron */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "1rem" }}>
                <KundliChart
                  ascSignIndex={kundli.ascendant.sign_index}
                  ascDegrees={kundli.ascendant.degrees}
                  planets={kundli.planets}
                  size={290}
                  highlightHouses={[facts.house]}
                />
                <p className="devanagari" style={{ fontSize: "0.75rem", color: "var(--saffron)", fontWeight: 700, marginTop: "0.4rem" }}>
                  {isHi
                    ? `◆ सुनहरा भाग = आपके प्रश्न से जुड़ा ${ORDINAL_HI[facts.house]} भाव`
                    : `◆ Shaded area = the ${facts.house}th house your question is read from`}
                </p>
              </div>

              <div className="result-box" style={{ marginTop: 0 }}>
                <div className="result-label">{isHi ? "आपकी कुंडली से" : "From Your Chart"}</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.55rem", fontSize: "0.95rem" }} className={isHi ? "devanagari" : undefined}>
                  <span>
                    <strong style={{ color: "var(--muted)" }}>{isHi ? "प्रासंगिक भाव" : "Relevant house"}:</strong>{" "}
                    {isHi ? `${ORDINAL_HI[facts.house]} भाव` : `${facts.house}th house`}
                  </span>
                  <span>
                    <strong style={{ color: "var(--muted)" }}>{isHi ? "भाव-स्वामी" : "House lord"}:</strong>{" "}
                    {isHi ? PLANET_HI[facts.houseLord] ?? facts.houseLord : facts.houseLord}
                    {" — "}{isHi ? facts.houseLordSignHi : facts.houseLordSign}
                  </span>
                  <span>
                    <strong style={{ color: "var(--muted)" }}>{isHi ? "स्थिति" : "Strength"}:</strong>{" "}
                    <span style={{ color: STRENGTH_COLOR[facts.strength], fontWeight: 700 }}>
                      {isHi ? STRENGTH_HI[facts.strength] : facts.strength}
                    </span>
                  </span>
                  <span>
                    <strong style={{ color: "var(--muted)" }}>{isHi ? "वर्तमान महादशा" : "Current Mahadasha"}:</strong>{" "}
                    {isHi ? PLANET_HI[facts.dashaLord] ?? facts.dashaLord : facts.dashaLord}
                    {facts.dashaEnd && ` (${isHi ? "तक" : "until"} ${facts.dashaEnd.slice(0, 10)})`}
                  </span>
                </div>
              </div>

              {/* How astrology reads this topic — the lens, before the reading */}
              {narration?.topic_insight && (
                <div className="tu-teaser-box" style={{ margin: "0 0 0.75rem" }}>
                  <div className="result-label" style={{ marginBottom: "0.35rem" }}>
                    {isHi ? "ज्योतिष इस विषय को कैसे देखता है" : "How Astrology Reads This Topic"}
                  </div>
                  <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "1rem", lineHeight: 1.75, margin: 0 }}>
                    {narration.topic_insight}
                  </p>
                </div>
              )}

              <div className="result-box">
                <div className="result-label">{isHi ? "पूर्ण उत्तर" : "Full Answer"}</div>
                <div className={`tu-answer-body${isHi ? " devanagari" : ""}`} style={{ marginTop: "0.5rem" }}>
                  {narration ? (
                    <>
                      <p className="tu-answer-opening">{narration.opening}</p>
                      {/* Each paragraph breathes on its own — no wall of text */}
                      {narration.narrative.split(/\n{2,}|\n/).filter(Boolean).map((para, i) => (
                        <p key={i}>{para}</p>
                      ))}
                    </>
                  ) : (
                    <>
                      <p className="tu-answer-opening">{isHi ? content.answer.hi : content.answer.en}</p>
                      <p>
                        {isHi
                          ? (tier! >= 3 && facts.dashaEnd
                              ? `यह प्रभाव सामान्यतः वर्तमान महादशा (${facts.dashaEnd.slice(0, 10)} तक) के दौरान बना रहेगा — दशा बदलने पर स्थिति में स्पष्ट परिवर्तन की संभावना है।`
                              : `यह विश्लेषण आपके ${ORDINAL_HI[facts.house]} भाव और वर्तमान महादशा पर आधारित है — यही दो कारक इस उत्तर का आधार हैं।`)
                          : (tier! >= 3 && facts.dashaEnd
                              ? `This influence is likely to hold through the current Mahadasha (until ${facts.dashaEnd.slice(0, 10)}) — expect a real shift once it changes.`
                              : `This reading is based on your ${facts.house}th house and current Mahadasha — those two factors are what this answer rests on.`)}
                      </p>
                    </>
                  )}
                </div>
                {narration?.timing_note && (
                  <div className={`tu-timing${isHi ? " devanagari" : ""}`}>
                    <strong style={{ color: "var(--maroon-deep)" }}>{isHi ? "समय: " : "Timing: "}</strong>
                    {narration.timing_note}
                  </div>
                )}
              </div>

              {((narration?.remedies?.length ?? 0) > 0 || (!narration && content.remedy)) && (
                <div className="remedy-box">
                  <div className="remedy-title">
                    <Icon name="diya" size={18} />
                    {isHi ? "उपाय" : "Remedies"}
                  </div>
                  <ul className={isHi ? "devanagari" : undefined}>
                    {narration?.remedies?.length
                      ? narration.remedies.map((r, i) => <li key={i}>{r}</li>)
                      : <li>{isHi ? content.remedy?.hi : content.remedy?.en}</li>}
                  </ul>
                </div>
              )}

              {/* Practical, non-ritual guidance that follows from the reading */}
              {(narration?.tips?.length ?? 0) > 0 && (
                <div className="result-box">
                  <div className="result-label" style={{ marginBottom: "0.6rem" }}>
                    {isHi ? "व्यावहारिक सुझाव" : "Practical Tips"}
                  </div>
                  <ol className={`tu-tips-list${isHi ? " devanagari" : ""}`}>
                    {narration!.tips.map((tp, i) => <li key={i}>{tp}</li>)}
                  </ol>
                </div>
              )}

              {/* Post-purchase reassurance: the answer survives refresh, and the
                  ref code is the user's proof of payment on WhatsApp. */}
              <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.78rem", color: "var(--muted)", textAlign: "center", marginTop: "0.9rem" }}>
                {isHi
                  ? `यह उत्तर इस ब्राउज़र में सुरक्षित है — पेज रीफ़्रेश करने पर भी। कोई समस्या हो तो Ref कोड (${refCode}) के साथ WhatsApp पर संदेश करें।`
                  : `This answer stays saved in this browser, even after refresh. Any issue? Message on WhatsApp with your ref code (${refCode}).`}
              </p>

              <Divider />
              <ResultCTA
                hideTurantUttar
                hook={{
                  en: "This quick-take reads two chart factors. A full Prashna reading examines your whole chart, divisional charts, and every relevant dasha layer.",
                  hi: "यह त्वरित उत्तर दो कारकों पर आधारित है। पूर्ण प्रश्न-पाठन आपकी पूरी कुंडली, वर्ग-कुंडली और सभी दशा-स्तरों की गहन जांच करता है।",
                }}
                waText={`Namaste Shivanii ji! I got a quick-take answer on your website about "${questionText}". I'd like a full Prashna reading for a deeper answer.`}
                reading={{ href: "/readings/ask-one-question", labelEn: "Full Prashna Reading ₹499", labelHi: "पूर्ण प्रश्न-पाठन ₹499" }}
              />
            </PatrikaFrame>
          </div>
        )}
      </div>
    </section>
  );
}
