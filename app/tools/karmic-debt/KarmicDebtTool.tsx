"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import DobNameForm from "@/components/DobNameForm";
import DownloadReportButton from "@/components/DownloadReportButton";
import PatrikaFrame from "@/components/PatrikaFrame";
import Divider from "@/components/Divider";
import Icon from "@/components/Icon";
import ResultCTA from "@/components/ResultCTA";
import { fetchKarmicDebt, fetchMissingNumbers } from "@/lib/api/endpoints";
import type { KarmicDebtResult, MissingNumbersResult, KarmicDebtPosition } from "@/lib/api/types";
import { ApiError } from "@/lib/api/client";
import { useBackStep } from "@/lib/useBackStep";

const POSITION_LABEL: Record<KarmicDebtPosition, { en: string; hi: string }> = {
  birth_day: { en: "Birth Day", hi: "जन्म दिन" },
  bhagyank_pre_reduction: { en: "Bhagyank (before reduction)", hi: "भाग्यांक (संकुचन से पहले)" },
  name_number: { en: "Name Number", hi: "नाम अंक" },
};

interface CombinedResult {
  karmic: KarmicDebtResult;
  missing: MissingNumbersResult;
}

export default function KarmicDebtTool() {
  const { t, lang } = useI18n();
  const isHi = lang === "hi";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<CombinedResult | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (result) resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [result]);

  useBackStep(!!result, "karmicDebtResult", () => {
    setResult(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  async function handleSubmit(data: { dob: string; name: string; system: "chaldean" | "pythagorean" }) {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const body = { dob: data.dob, name: data.name, system: data.system };
      const [karmic, missing] = await Promise.all([fetchKarmicDebt(body), fetchMissingNumbers(body)]);
      setResult({ karmic, missing });
    } catch (e) {
      setError(e instanceof ApiError ? e.message : t("form.error"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: "820px" }}>
        <h1 className={`section-heading${isHi ? " devanagari" : ""}`}>{isHi ? "कार्मिक ऋण व अनुपस्थित अंक" : "Karmic Debt & Missing Numbers"}</h1>
        <p className="section-heading-hi devanagari">{isHi ? "Karmic Debt & Missing Numbers" : "कार्मिक ऋण व अनुपस्थित अंक"}</p>

        <div className="tool-explainer" style={{ textAlign: "center", marginBottom: "2rem" }}>
          {isHi ? (
            <p className="devanagari">
              <span className="hl">कार्मिक ऋण</span> पिछले जन्मों की गलतियों का भार है, जबकि{" "}
              <span className="hl">अनुपस्थित अंक</span> इस जीवन में सीखे जाने वाले पाठ बताते हैं। नाम वैकल्पिक है —
              देने पर नाम-आधारित जांच भी जुड़ जाती है।
            </p>
          ) : (
            <p>
              <span className="hl">Karmic debt</span> carries the weight of past-life actions, while{" "}
              <span className="hl">missing numbers</span> reveal lessons to learn in this life. Name is optional —
              adding it enables name-based checks too.
            </p>
          )}
        </div>

        <div style={{ maxWidth: "420px", margin: "0 auto" }}>
          <PatrikaFrame>
            <DobNameForm
              onSubmit={handleSubmit}
              loading={loading}
              nameRequired={false}
              dobHint={{
                en: "Checked digit by digit — your exact birth day and full date decide which numbers (13, 14, 16, 19) show up as karmic debt, and which 1–9 digits are missing from your Lo Shu grid.",
                hi: "अंक-दर-अंक जांचा जाता है — आपका जन्म दिन और पूरी जन्म तिथि ही तय करते हैं कि कौन-से अंक (13, 14, 16, 19) कार्मिक ऋण के रूप में मिलते हैं, और लो शु ग्रिड में कौन-से 1–9 अंक अनुपस्थित हैं।",
              }}
            />
            {error && <p className="form-error" style={{ marginTop: "1rem" }}>{error}</p>}
          </PatrikaFrame>
        </div>

        {loading && (
          <div style={{ textAlign: "center", padding: "3rem" }}>
            <div className="spinner" />
            <p style={{ color: "var(--muted)" }}>{t("form.loading")}</p>
          </div>
        )}

        {result && !loading && (
          <div ref={resultRef} className="print-area" style={{ marginTop: "2rem", scrollMarginTop: "90px" }}>
            <DownloadReportButton filename="AstroShivanii-Karmic-Debt" />
            {/* ── Section A: Karmic Debt ── */}
            <PatrikaFrame style={{ marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "1.2rem", marginBottom: "0.75rem" }}>{isHi ? "कार्मिक ऋण" : "Karmic Debt"}</h2>

              {!result.karmic.has_karmic_debt ? (
                <div className="result-box" style={{ background: "rgba(26,122,58,0.05)", borderColor: "rgba(26,122,58,0.3)" }}>
                  <span style={{ color: "#1a7a3a", fontWeight: 700 }}>✓ {isHi ? "कोई कार्मिक ऋण नहीं" : "No Karmic Debt"}</span>
                </div>
              ) : (
                result.karmic.karmic_debts_found.map((d, i) => (
                  <div key={i} className="karmic-debt-card">
                    <div className="karmic-debt-header">
                      <span className="karmic-debt-num">⚠ {d.number}</span>
                      <span className="karmic-debt-theme">
                        {isHi ? POSITION_LABEL[d.position].hi : POSITION_LABEL[d.position].en}
                      </span>
                    </div>
                    <p className="karmic-debt-meaning">{isHi ? d.info.hi : d.info.en}</p>
                  </div>
                ))
              )}

              <div className="result-box" style={{ marginTop: "0.75rem" }}>
                <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.85rem", color: "var(--ink-light)", lineHeight: 1.6 }}>
                  {isHi ? result.karmic.interpretation_hi : result.karmic.interpretation_en}
                </p>
              </div>
            </PatrikaFrame>

            {/* ── Section B: Missing & Repeated Numbers ── */}
            <PatrikaFrame>
              <h2 style={{ fontSize: "1.2rem", marginBottom: "0.75rem" }}>{isHi ? "अनुपस्थित व दोहराए गए अंक" : "Missing & Repeated Numbers"}</h2>
              <p className={`form-hint${isHi ? " devanagari" : ""}`} style={{ marginTop: "-0.4rem", marginBottom: "0.9rem" }}>
                {isHi
                  ? "यह केवल आपकी जन्म तिथि के अंकों पर आधारित है (शास्त्रीय पद्धति)। हमारे मुख्य अंक ज्योतिष कैलकुलेटर में दिखने वाला लो शु ग्रिड इसमें मूलांक, भाग्यांक, नामांक और कुआ अंक भी जोड़ता है (सम्पूर्ण-ग्रिड पद्धति) — इसलिए वहां अनुपस्थित अंक यहां से अलग दिख सकते हैं; दोनों ही मान्य पद्धतियां हैं।"
                  : "This is based purely on the digits of your date of birth (the classical method). The Lo Shu grid in our main Numerology Calculator also folds in your Mulank, Bhagyank, Name Number, and Kua (the complete-grid method) — so the missing numbers can differ between the two. Both are legitimate methods; they simply answer slightly different questions."}
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
                {/* Missing numbers — full cards with remedy + colour */}
                <div>
                  <div className="result-label" style={{ marginBottom: "0.4rem" }}>{isHi ? "अनुपस्थित अंक (कार्मिक पाठ)" : "Missing Numbers (Karmic Lessons)"}</div>
                  {result.missing.missing_numbers.length === 0 ? (
                    <div className="result-box" style={{ background: "rgba(26,122,58,0.05)", borderColor: "rgba(26,122,58,0.3)" }}>
                      <span style={{ color: "#1a7a3a", fontWeight: 700 }}>✓ {isHi ? "कोई अनुपस्थित अंक नहीं" : "No Missing Numbers"}</span>
                    </div>
                  ) : (
                    result.missing.missing_numbers.map((n) => {
                      const l = result.missing.missing_lessons[String(n)];
                      if (!l) return null;
                      return (
                        <div key={n} className="karmic-lesson-card" style={{ marginBottom: "0.6rem" }}>
                          <div className="kl-num">{n}</div>
                          <div className="kl-body">
                            <p className="kl-lesson">{isHi ? l.hi : l.en}</p>
                            <div style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: "0.3rem" }}>
                              {isHi ? l.ruling_planet_hi : l.ruling_planet} · {isHi ? l.gemstone_hi : l.gemstone} · {l.colour}
                            </div>
                            <div className="kl-remedy">
                              <strong>{isHi ? "उपाय:" : "Remedy:"}</strong> {isHi ? l.remedy_hi : l.remedy_en}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Repeated numbers — lighter strength cards, no remedy/colour data available */}
                <div>
                  <div className="result-label" style={{ marginBottom: "0.4rem" }}>{isHi ? "दोहराए गए अंक (शक्तियां)" : "Repeated Numbers (Strengths)"}</div>
                  {result.missing.repeated_numbers.length === 0 ? (
                    <div className="result-box">
                      <span style={{ color: "var(--muted)" }}>{isHi ? "कोई दोहराया अंक नहीं" : "No repeated numbers"}</span>
                    </div>
                  ) : (
                    result.missing.repeated_numbers.map((n) => {
                      const s = result.missing.repeated_strengths[String(n)];
                      if (!s) return null;
                      return (
                        <div key={n} className="result-box" style={{ marginBottom: "0.6rem", background: "rgba(201,154,58,0.06)", borderColor: "rgba(201,154,58,0.3)" }}>
                          <div className="result-label">{isHi ? `अंक ${n}` : `Number ${n}`}</div>
                          <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.85rem", color: "var(--ink-light)" }}>
                            {isHi ? s.hi : s.en}
                          </p>
                          <div style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: "0.3rem" }}>
                            {isHi ? s.ruling_planet_hi : s.ruling_planet} · {isHi ? s.gemstone_hi : s.gemstone}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="result-box" style={{ marginTop: "0.75rem" }}>
                <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.85rem", color: "var(--ink-light)", lineHeight: 1.6 }}>
                  {isHi ? result.missing.interpretation_hi : result.missing.interpretation_en}
                </p>
              </div>

              <Divider />
              <ResultCTA
                locked={[
                  { en: "How these numbers combine with your actual birth chart", hi: "यह अंक आपकी वास्तविक कुंडली से कैसे जुड़ते हैं" },
                  { en: "Chart-specific remedies, not generic ones", hi: "सामान्य नहीं, कुंडली-विशेष उपाय" },
                ]}
                hook={{
                  en: "Numbers show the pattern — a full reading connects it to what's actually happening in your life.",
                  hi: "अंक पैटर्न दिखाते हैं — पूर्ण पाठन इसे आपके जीवन की वास्तविक स्थिति से जोड़ता है।",
                }}
                waText={`Namaste Shivanii ji! I checked Karmic Debt & Missing Numbers on your website. Has karmic debt: ${result.karmic.has_karmic_debt}, missing numbers: ${result.missing.missing_numbers.join(", ") || "none"}. I'd like to know more.`}
                reading={{ href: "/readings/birth-chart", labelEn: "Book Birth Chart Reading ₹999", labelHi: "कुंडली विश्लेषण बुक करें ₹999" }}
              />
            </PatrikaFrame>
          </div>
        )}

        {!result && !loading && (
          <div style={{ textAlign: "center", padding: "2rem", color: "var(--muted)" }}>
            <div style={{ color: "var(--gold)", marginBottom: "0.75rem", display: "flex", justifyContent: "center" }}>
              <Icon name="eye" size={40} strokeWidth={1.3} />
            </div>
            <p>{isHi ? "जन्म तिथि डालें — परिणाम नीचे दिखेगा" : "Enter your date of birth — the result will appear below"}</p>
          </div>
        )}
      </div>
    </section>
  );
}
