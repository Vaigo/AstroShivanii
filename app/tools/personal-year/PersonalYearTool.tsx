"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import DobNameForm from "@/components/DobNameForm";
import DownloadReportButton from "@/components/DownloadReportButton";
import PatrikaFrame from "@/components/PatrikaFrame";
import Divider from "@/components/Divider";
import Icon from "@/components/Icon";
import ResultCTA from "@/components/ResultCTA";
import { fetchPersonalYear } from "@/lib/api/endpoints";
import type { PersonalYearResult } from "@/lib/api/types";
import { ApiError } from "@/lib/api/client";
import { useBackStep } from "@/lib/useBackStep";
import { pickLang } from "@/lib/hindi-labels";

export default function PersonalYearTool() {
  const { t, lang } = useI18n();
  const isHi = lang === "hi";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<PersonalYearResult | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (result) resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [result]);

  useBackStep(!!result, "personalYearResult", () => {
    setResult(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  async function handleSubmit(data: { dob: string; name: string; system: "chaldean" | "pythagorean" }) {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetchPersonalYear(data);
      setResult(res);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : t("form.error"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: "760px" }}>
        <h1 className={`section-heading${isHi ? " devanagari" : ""}`}>{isHi ? "व्यक्तिगत वर्षांक" : "Personal Year Number"}</h1>
        <p className="section-heading-hi devanagari">{isHi ? "Personal Year Number" : "व्यक्तिगत वर्षांक"}</p>

        <div className="tool-explainer" style={{ textAlign: "center", marginBottom: "2rem" }}>
          {isHi ? (
            <p className="devanagari">
              <span className="hl">व्यक्तिगत वर्षांक</span> बताता है कि इस वर्ष का मुख्य विषय क्या है — नई शुरुआत,
              विश्राम, संबंध या सफलता। यह अंक 1 से 9 के बीच बदलता रहता है और हर 9 वर्ष में चक्र दोहराता है।
            </p>
          ) : (
            <p>
              Your <span className="hl">Personal Year Number</span> reveals this year's dominant theme — new
              beginnings, rest, relationships, or achievement. It cycles from 1 to 9 and repeats every 9 years.
            </p>
          )}
        </div>

        <div style={{ maxWidth: "420px", margin: "0 auto" }}>
          <PatrikaFrame>
            <DobNameForm
              onSubmit={handleSubmit}
              loading={loading}
              hideName
              dobHint={{
                en: "Your Personal Year is calculated purely from this date and today's calendar year — no name needed for this one.",
                hi: "आपका व्यक्तिगत वर्षांक केवल इस तारीख और चालू कैलेंडर वर्ष से निकाला जाता है — इसके लिए नाम की ज़रूरत नहीं।",
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
            <DownloadReportButton filename="AstroShivanii-Personal-Year" />
            <PatrikaFrame>
              <div className="num-core-grid" style={{ maxWidth: "260px", margin: "0 auto 1.5rem" }}>
                <div className="num-core-card">
                  <div className="num-core-num">{result.personal_year}</div>
                  <div className="num-core-label">{isHi ? `वर्ष ${result.current_year}` : `Year ${result.current_year}`}</div>
                  <div className="num-core-planet">{pickLang(result.theme, isHi)}</div>
                  <div className="num-core-sub">{isHi ? result.ruling_planet_hi : result.ruling_planet}</div>
                </div>
              </div>

              <div className="result-box">
                <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.9rem", color: "var(--ink-light)", lineHeight: 1.6 }}>
                  {isHi ? result.meaning.hi : result.meaning.en}
                </p>
                {(result.meaning.strengths?.length > 0 || result.meaning.challenges?.length > 0) && (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "0.75rem", marginTop: "0.75rem" }}>
                    {result.meaning.strengths?.length > 0 && (
                      <div>
                        <div className="result-label" style={{ marginBottom: "0.3rem" }}>{isHi ? "शक्तियां" : "Strengths"}</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
                          {(isHi ? result.meaning.strengths_hi : result.meaning.strengths).map((s) => (
                            <span key={s} className={isHi ? "trait-chip devanagari" : "trait-chip"}>{s}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {result.meaning.challenges?.length > 0 && (
                      <div>
                        <div className="result-label" style={{ marginBottom: "0.3rem" }}>{isHi ? "चुनौतियां" : "Challenges"}</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
                          {(isHi ? result.meaning.challenges_hi : result.meaning.challenges).map((c) => (
                            <span key={c} className={isHi ? "trait-chip devanagari" : "trait-chip"}>{c}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="fav-grid">
                {[
                  { icon: "planet" as const, label: isHi ? "शासक ग्रह" : "Ruling Planet", val: isHi ? result.ruling_planet_hi : result.ruling_planet },
                  { icon: "gem" as const, label: isHi ? "रत्न" : "Gemstone", val: isHi ? result.gemstone_hi : result.gemstone },
                  { icon: "droplet" as const, label: isHi ? "शुभ रंग" : "Favorable Color", val: isHi ? result.colour_hi : result.colour },
                  { icon: "calendar" as const, label: isHi ? "शुभ दिन" : "Favourable Days", val: (isHi ? result.favourable_days_hi : result.favourable_days).join(", ") },
                ].map(({ icon, label, val }) => (
                  <div key={label} className="fav-item">
                    <span className="fav-icon"><Icon name={icon} size={20} /></span>
                    <div>
                      <div className="fav-label">{label}</div>
                      <div className="fav-val">{val}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="result-box">
                <div className="result-label">{isHi ? "मंत्र" : "Mantra"}</div>
                <div className="result-value devanagari">{result.mantra_devanagari}</div>
              </div>

              {/* minmax(0, 1fr), not bare 1fr — a grid track's implicit
                  minimum is its content's width, so the 3rd column (often
                  the longest theme text) was being pushed outside the card
                  on narrow phones instead of wrapping. minmax(0, ...)
                  removes that implicit floor so all 3 columns actually
                  share the available width evenly. */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "0.6rem", margin: "1rem 0" }}>
                <div className="result-box" style={{ textAlign: "center" }}>
                  <div className="result-label">{result.previous_year.year}</div>
                  <div className="result-value" style={{ fontSize: "1.1rem" }}>{result.previous_year.number}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>{pickLang(result.previous_year.theme, isHi)}</div>
                </div>
                <div className="result-box" style={{ textAlign: "center", border: "1.5px solid var(--gold)" }}>
                  <div className="result-label">{result.current_year}</div>
                  <div className="result-value" style={{ fontSize: "1.1rem" }}>{result.personal_year}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>{pickLang(result.theme, isHi)}</div>
                </div>
                <div className="result-box" style={{ textAlign: "center" }}>
                  <div className="result-label">{result.next_year.year}</div>
                  <div className="result-value" style={{ fontSize: "1.1rem" }}>{result.next_year.number}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>{pickLang(result.next_year.theme, isHi)}</div>
                </div>
              </div>

              <div className="result-box">
                <div className="result-label">{isHi ? "सलाह" : "Advice"}</div>
                <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.85rem", color: "var(--ink-light)", lineHeight: 1.6 }}>
                  {isHi ? result.advice_hi : result.advice_en}
                </p>
              </div>

              <div className="result-box">
                <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.85rem", color: "var(--ink-light)", lineHeight: 1.6 }}>
                  {isHi ? result.interpretation_hi : result.interpretation_en}
                </p>
              </div>

              <Divider />
              <ResultCTA
                locked={[
                  { en: "How this year's number interacts with your actual birth chart", hi: "यह वर्षांक आपकी वास्तविक कुंडली से कैसे मेल खाता है" },
                  { en: "Month-by-month breakdown for the year", hi: "महीने-दर-महीने विश्लेषण" },
                  { en: "Chart-specific timing for big decisions", hi: "बड़े निर्णयों के लिए कुंडली-विशेष समय" },
                ]}
                hook={{
                  en: `Your Personal Year ${result.personal_year} sets the theme — a full reading maps it onto your actual planetary periods (dasha).`,
                  hi: `आपका वर्षांक ${result.personal_year} विषय तय करता है — पूर्ण पाठन इसे आपकी वास्तविक दशा से जोड़ता है।`,
                }}
                waText={`Namaste Shivanii ji! My Personal Year Number for ${result.current_year} is ${result.personal_year} (${pickLang(result.theme, false)}). I'd like to know how this year looks for me in detail.`}
                reading={{ href: "/readings/annual-forecast", labelEn: "Book Annual Forecast ₹1,499", labelHi: "वार्षिक भविष्यफल बुक करें ₹1,499" }}
              />
            </PatrikaFrame>
          </div>
        )}

        {!result && !loading && (
          <div style={{ textAlign: "center", padding: "2rem", color: "var(--muted)" }}>
            <div style={{ color: "var(--gold)", marginBottom: "0.75rem", display: "flex", justifyContent: "center" }}>
              <Icon name="calendar" size={40} strokeWidth={1.3} />
            </div>
            <p>{isHi ? "जन्म तिथि डालें — परिणाम नीचे दिखेगा" : "Enter your date of birth — the result will appear below"}</p>
          </div>
        )}
      </div>
    </section>
  );
}
