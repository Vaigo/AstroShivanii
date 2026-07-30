"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import BirthForm from "@/components/BirthForm";
import PatrikaFrame from "@/components/PatrikaFrame";
import Divider from "@/components/Divider";
import Link from "next/link";
import ResultCTA from "@/components/ResultCTA";
import { fetchAshtakoot, fetchMangalDosha } from "@/lib/api/endpoints";
import type { BirthRequest, AshtakootResult, MangalDoshaResult } from "@/lib/api/types";
import { ApiError } from "@/lib/api/client";

const KOOTAS = [
  { key: "varna",        name: "Varna",        nameHi: "वर्ण",        max: 1, en: "Spiritual compatibility & ego-fit",              hi: "आध्यात्मिक तालमेल और स्वभाव-अहं का मेल" },
  { key: "vashya",       name: "Vashya",        nameHi: "वश्य",        max: 2, en: "Who naturally influences whom in the marriage",   hi: "विवाह में कौन किसे सहज रूप से प्रभावित करता है" },
  { key: "tara",         name: "Tara",          nameHi: "तारा",        max: 3, en: "General well-being & mutual luck",                hi: "समग्र स्वास्थ्य और आपसी सौभाग्य" },
  { key: "yoni",         name: "Yoni",          nameHi: "योनि",        max: 4, en: "Physical & intimate compatibility",              hi: "शारीरिक और अंतरंग तालमेल" },
  { key: "graha_maitri", name: "Graha Maitri",  nameHi: "ग्रह मैत्री",  max: 5, en: "Mental compatibility & friendship",               hi: "मानसिक तालमेल और मित्रता" },
  { key: "gana",         name: "Gana",          nameHi: "गण",          max: 6, en: "Temperament match (deva/manushya/rakshasa)",     hi: "स्वभाव-वर्ग का मेल (देव/मनुष्य/राक्षस)" },
  { key: "bhakoot",      name: "Bhakoot",       nameHi: "भकूट",        max: 7, en: "Love, family growth & prosperity",               hi: "प्रेम, पारिवारिक वृद्धि और समृद्धि" },
  { key: "nadi",         name: "Nadi",          nameHi: "नाड़ी",        max: 8, en: "Health & progeny — the heaviest-weighted koota", hi: "स्वास्थ्य और संतान — सबसे भारी कूट" },
] as const;

/** Donut gauge for the /36 score — tick marks at the classical thresholds
 *  (18 acceptable · 24 good · 28 excellent) so "where do we fall" reads at
 *  a glance instead of needing the number explained. */
function ScoreDonut({ total, max, color, verdict, isHi }: {
  total: number; max: number; color: string; verdict: string; isHi: boolean;
}) {
  const R = 66, C = 2 * Math.PI * R;
  const frac = Math.max(0, Math.min(1, total / max));
  const ticks = [
    { at: 18, hi: "18 स्वीकार्य", en: "18 fair" },
    { at: 24, hi: "24 अच्छा", en: "24 good" },
    { at: 28, hi: "28 उत्तम", en: "28 great" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <svg width="180" height="180" viewBox="0 0 180 180" role="img"
        aria-label={`${total} / ${max}`}>
        <circle cx="90" cy="90" r={R} fill="none" stroke="rgba(201,154,58,0.22)" strokeWidth="14" />
        <circle
          cx="90" cy="90" r={R} fill="none"
          stroke={color} strokeWidth="14" strokeLinecap="round"
          strokeDasharray={`${C * frac} ${C}`}
          transform="rotate(-90 90 90)"
          style={{ transition: "stroke-dasharray 0.8s ease" }}
        />
        {ticks.map(({ at }) => {
          const a = (at / max) * 2 * Math.PI - Math.PI / 2;
          const x1 = 90 + (R - 9) * Math.cos(a), y1 = 90 + (R - 9) * Math.sin(a);
          const x2 = 90 + (R + 9) * Math.cos(a), y2 = 90 + (R + 9) * Math.sin(a);
          return <line key={at} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--maroon-deep)" strokeWidth="2" opacity="0.55" />;
        })}
        <text x="90" y="88" textAnchor="middle" fontSize="38" fontWeight="800"
          fontFamily="var(--font-display)" fill={color}>{total}</text>
        <text x="90" y="112" textAnchor="middle" fontSize="14" fill="var(--muted)">/ {max}</text>
      </svg>
      <div style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", color: "var(--maroon-deep)", marginTop: "0.25rem" }}>
        {verdict}
      </div>
      <div className="devanagari" style={{ fontSize: "0.72rem", color: "var(--muted)", marginTop: "0.3rem" }}>
        {ticks.map((tk, i) => (
          <span key={tk.at}>{i > 0 && " · "}{isHi ? tk.hi : tk.en}</span>
        ))}
      </div>
    </div>
  );
}

function ScoreBar({ score, max }: { score: number; max: number }) {
  const pct = (score / max) * 100;
  const color = pct >= 75 ? "#1a7a3a" : pct >= 50 ? "#c99a3a" : "#c0392b";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
      <div style={{ flex: 1, background: "rgba(201,154,58,0.15)", borderRadius: "2px", height: "8px", overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, background: color, height: "100%", borderRadius: "2px", transition: "width 0.5s" }} />
      </div>
      <span style={{ fontSize: "0.8rem", fontWeight: 700, color, minWidth: "32px", textAlign: "right" }}>
        {score}/{max}
      </span>
    </div>
  );
}

export default function MatchingTool() {
  const { t, lang } = useI18n();
  const isHi = lang === "hi";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<AshtakootResult | null>(null);
  const [mangal, setMangal] = useState<MangalDoshaResult | null>(null);
  const [p1, setP1] = useState<BirthRequest | null>(null);
  const [p2, setP2] = useState<BirthRequest | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (result) resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [result]);

  async function handleCalculate(e: React.FormEvent) {
    e.preventDefault();
    if (!p1 || !p2) return;
    setLoading(true);
    setError("");
    setResult(null);
    setMangal(null);
    try {
      const req = { person1: p1, person2: p2 };
      const [data, md] = await Promise.all([
        fetchAshtakoot(req),
        fetchMangalDosha(req).catch(() => null), // dosha check is additive, never blocks the score
      ]);
      setResult(data);
      setMangal(md);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : t("form.error"));
    } finally {
      setLoading(false);
    }
  }

  const totalColor = result
    ? result.total >= 28 ? "#1a7a3a" : result.total >= 21 ? "#c99a3a" : result.total >= 18 ? "#e08a2e" : "#c0392b"
    : "var(--maroon)";

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: "1000px" }}>
        <h1 className="section-heading">Marriage Matching</h1>
        <p className="section-heading-hi devanagari">गुण मिलान · अष्टकूट</p>

        <div className="tool-explainer" style={{ textAlign: "center", marginBottom: "2rem" }}>
          {isHi ? (
            <p className="devanagari">
              यह पारंपरिक <span className="hl">वैदिक मिलान</span> दोनों कुंडलियों को वैवाहिक जीवन के{" "}
              <span className="hl">8 पहलुओं (अष्टकूट)</span> पर परखकर <span className="hl">36 में से</span> अंक
              देता है। <span className="hl">18+</span> स्वीकार्य, <span className="hl">24+</span> अच्छा माना
              जाता है। कम अंक का अर्थ अस्वीकृति नहीं — बल्कि गहराई से जांच का संकेत है।{" "}
              <Link href="/guides/kundli-matching-guna-milan" style={{ color: "var(--maroon)", fontWeight: 600 }}>
                36 गुण कैसे काम करते हैं →
              </Link>
            </p>
          ) : (
            <p>
              The traditional Vedic compatibility check: both charts are compared on{" "}
              <span className="hl">8 aspects</span> of married life and scored{" "}
              <span className="hl">out of 36 points</span>. <span className="hl">18+</span> is considered
              acceptable, <span className="hl">24+</span> good.
              A low score is a signal to look deeper — not an automatic rejection.{" "}
              <Link href="/guides/kundli-matching-guna-milan" style={{ color: "var(--maroon)", fontWeight: 600 }}>
                How the 36 gunas work →
              </Link>
            </p>
          )}
        </div>

        <form onSubmit={handleCalculate}>
          <div className="form-2col-wide" style={{ marginBottom: "1.5rem" }}>
            <PatrikaFrame>
              <BirthForm embedded onChange={setP1} label={t("form.person1")} />
            </PatrikaFrame>
            <PatrikaFrame>
              <BirthForm embedded onChange={setP2} label={t("form.person2")} />
            </PatrikaFrame>
          </div>

          <div style={{ textAlign: "center" }}>
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading || !p1 || !p2}
            >
              {loading ? t("form.calculating") : isHi ? "मिलान करें" : "Calculate Compatibility"}
            </button>
            {(!p1 || !p2) && (
              <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: "0.5rem" }}>
                {isHi ? "गणना के लिए दोनों की जन्म तिथि डालें" : "Enter both dates of birth to calculate"}
              </p>
            )}
          </div>
        </form>

        {error && <p className="form-error" style={{ marginTop: "1rem", textAlign: "center" }}>{error}</p>}

        {loading && (
          <div style={{ textAlign: "center", padding: "3rem" }}>
            <div className="spinner" />
            <p style={{ color: "var(--muted)" }}>{t("form.loading")}</p>
          </div>
        )}

        {result && !loading && (
          <div ref={resultRef} style={{ marginTop: "2rem", scrollMarginTop: "90px" }}>
            <PatrikaFrame>
              {/* Score header */}
              <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                <ScoreDonut total={result.total} max={36} color={totalColor} verdict={result.verdict} isHi={isHi} />
                <div style={{ fontSize: "0.85rem", color: "var(--muted)", marginTop: "0.35rem" }}>
                  {result.percentage}% {isHi ? "संगति" : "compatibility"}
                </div>
                <p className={`result-explain${isHi ? " devanagari" : ""}`} style={{ maxWidth: "480px", margin: "0.75rem auto 0", textAlign: "center", borderTop: "none", paddingTop: 0 }}>
                  {result.total >= 28
                    ? (isHi
                        ? <>यह <span className="hl">उत्कृष्ट मेल</span> है — 28+ अंक बहुत कम जोड़ों को मिलते हैं। पर अंक सिर्फ आधी कहानी हैं; कौन-सा कूट मज़बूत है, यह भी उतना ही मायने रखता है।</>
                        : <>This is an <span className="hl">excellent match</span> — 28+ is rare. But the score is only half the story; which specific kootas are strong matters just as much.</>)
                    : result.total >= 21
                      ? (isHi
                          ? <>यह <span className="hl">अच्छा मेल</span> है — पारंपरिक रूप से स्वीकार्य सीमा से ऊपर। कोई भी शेष <span className="hl">दोष</span> नीचे देखें और परिहार (निवारण) की जांच अवश्य कराएँ।</>
                          : <>This is a <span className="hl">good match</span> — comfortably above the traditional acceptable line. Check for any remaining <span className="hl">dosha</span> below, and always verify cancellation (parihara).</>)
                      : result.total >= 18
                        ? (isHi
                            ? <>यह <span className="hl">स्वीकार्य सीमा</span> पर है — निर्णय से पहले कौन-से कूट कमज़ोर हैं, यह गहराई से समझना ज़रूरी है।</>
                            : <>This sits right at the <span className="hl">acceptable threshold</span> — understanding exactly which kootas are weak matters before deciding.</>)
                        : (isHi
                            ? <><span className="hl">18 से कम अंक</span> का अर्थ अस्वीकृति नहीं — बल्कि यह है कि निर्णय से पहले हर कूट, दोष-निवारण और नवांश की गहन जांच अनिवार्य है।</>
                            : <>A score <span className="hl">below 18</span> doesn't mean rejection — it means a careful, koota-by-koota review with dosha-cancellation and navamsa checks is essential before deciding.</>)}
                </p>
              </div>

              <Divider />

              {/* Koota breakdown */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.1rem" }}>
                {KOOTAS.map(({ key, name, nameHi, max, en, hi }) => {
                  const koota = result[key as keyof AshtakootResult] as { score: number; max: number } | undefined;
                  if (!koota) return null;
                  return (
                    <div key={key}>
                      <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--maroon-deep)", marginBottom: "0.35rem" }}>
                        {isHi ? nameHi : name}{" "}
                        <span className="devanagari" style={{ fontWeight: 400, color: "var(--muted)", fontSize: "0.8em" }}>
                          {isHi ? name : nameHi}
                        </span>
                        {key === "nadi" && (koota as { nadi_dosha?: boolean }).nadi_dosha && (
                          <span style={{ color: "#c0392b", marginLeft: "0.35rem", fontSize: "0.7rem" }}>⚠ Dosha</span>
                        )}
                      </div>
                      <ScoreBar score={koota.score} max={koota.max} />
                      <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: "0.3rem", lineHeight: 1.4 }}>
                        {isHi ? hi : en}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Dosha verdicts — deliberately 2 lines each, honest and calm */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "0.75rem", marginTop: "1.25rem" }}>
                {mangal && (
                  <div className={`kaal-box${!mangal.person1.has_mangal_dosha && !mangal.person2.has_mangal_dosha ? " good" : ""}`}>
                    <strong>
                      Mangal Dosha:{" "}
                      {!mangal.person1.has_mangal_dosha && !mangal.person2.has_mangal_dosha
                        ? "None — neither chart is Manglik ✓"
                        : mangal.mutual_cancellation
                          ? "Present in both — mutually cancelled ✓"
                          : `Person 1: ${mangal.person1.has_mangal_dosha ? "Yes" : "No"} · Person 2: ${mangal.person2.has_mangal_dosha ? "Yes" : "No"}`}
                    </strong>
                    <div style={{ fontSize: "0.78rem" }}>
                      {!mangal.person1.has_mangal_dosha && !mangal.person2.has_mangal_dosha
                        ? "मंगल दोष नहीं है — इस विषय में चिंता की आवश्यकता नहीं।"
                        : "दोष दिखा? रुकिए — कई दोष cancellation से कटते हैं। निर्णय से पहले पूरी जांच कराएँ।"}
                    </div>
                  </div>
                )}
                <div className={`kaal-box${!result.nadi.nadi_dosha ? " good" : ""}`}>
                  <strong>Nadi Dosha: {result.nadi.nadi_dosha ? "Present" : "None ✓"}</strong>
                  <div style={{ fontSize: "0.78rem" }}>
                    {result.nadi.nadi_dosha
                      ? "सबसे भारी कूट — पर इसके cancellation नियम भी सबसे अधिक हैं। भयभीत न हों, जांच कराएँ।"
                      : "नाड़ी दोष नहीं है — स्वास्थ्य-संतान के इस प्रमुख कूट में मेल शुभ।"}
                  </div>
                </div>
              </div>

              <Divider />
              <ResultCTA
                locked={[
                  { en: "Which lost points actually matter for you two", hi: "खोए अंक आप दोनों के लिए कितने मायने रखते हैं" },
                  { en: "Dosha cancellation (parihara) analysis", hi: "दोष-निवारण (परिहार) जांच" },
                  { en: "Navamsa (D9) compatibility", hi: "नवांश मिलान" },
                  { en: "Dasha-sync: how your life-periods align", hi: "दशा-संगति — जीवन-काल का तालमेल" },
                  { en: "Rajju & Papasamyam checks", hi: "रज्जु एवं पाप-साम्य जांच" },
                ]}
                hook={{
                  en: `${result.total}/36 — but scores don't marry, people do. Which points matter for you two, and what cancels out — that's the full matching.`,
                  hi: `${result.total}/36 — पर अंक विवाह नहीं करते, लोग करते हैं। कौन-से अंक आपके लिए मायने रखते हैं और क्या कटता है — यही पूर्ण मिलान है।`,
                }}
                waText={`Namaste Shivanii ji! We checked our kundli match on your website — score ${result.total}/36 (${result.verdict}). We would like the full matching analysis before deciding.`}
                reading={{ href: "/readings/marriage-matching", labelEn: "Book Full Matching ₹1,299", labelHi: "पूर्ण मिलान बुक करें ₹1,299" }}
              />
            </PatrikaFrame>
          </div>
        )}
      </div>
    </section>
  );
}
