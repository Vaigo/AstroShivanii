"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import BirthForm from "@/components/BirthForm";
import PatrikaFrame from "@/components/PatrikaFrame";
import Divider from "@/components/Divider";
import Link from "next/link";
import Icon from "@/components/Icon";
import ResultCTA from "@/components/ResultCTA";
import { SIGN_HI } from "@/lib/hindi-labels";
import { fetchSadeSati } from "@/lib/api/endpoints";
import type { BirthRequest, SadeSatiResult } from "@/lib/api/types";
import { ApiError } from "@/lib/api/client";
import { useBackStep } from "@/lib/useBackStep";
import { todayInZone } from "@/lib/timezone";

export default function SadeSatiTool() {
  const { t, lang } = useI18n();
  const isHi = lang === "hi";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<SadeSatiResult | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (result) resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [result]);

  // Back button clears the result (returning to the form) instead of leaving the page.
  useBackStep(!!result, "sadeSatiResult", () => {
    setResult(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  async function handleSubmit(birth: BirthRequest) {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      // "Today" must be the calendar date in IST, not the browser's UTC date
      // (new Date().toISOString() would report YESTERDAY for anyone browsing
      // India between 00:00–05:30 IST) — same bug class already fixed in Panchang.
      const today = todayInZone("Asia/Kolkata", new Date());
      const data = await fetchSadeSati({ birth, transit_date: today });
      setResult(data);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : t("form.error"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: "760px" }}>
        <h1 className={`section-heading${isHi ? " devanagari" : ""}`}>{isHi ? "साढ़े साती जांच" : "Sade Sati Check"}</h1>
        <p className="section-heading-hi devanagari">{isHi ? "Sade Sati Check" : "साढ़े साती जांच"}</p>

        <div className="tool-explainer" style={{ textAlign: "center", marginBottom: "2rem" }}>
          {isHi ? (
            <p className="devanagari">
              <span className="hl">साढ़े साती</span> शनि ग्रह से जुड़ी लगभग <span className="hl">7.5 वर्ष</span> की
              अवधि है, जिससे अधिकांश लोग जीवन में 2–3 बार गुज़रते हैं। इसकी छवि डरावनी है — पर कई लोगों के लिए यह
              उनके सबसे उत्पादक वर्ष साबित होते हैं। नीचे जांचें कि क्या यह अभी आपके लिए सक्रिय है।{" "}
              <Link href="/guides/sade-sati-meaning" style={{ color: "var(--maroon)", fontWeight: 600 }}>
                साढ़े साती का असली अर्थ जानें →
              </Link>
            </p>
          ) : (
            <p>
              <span className="hl">Sade Sati</span> is a roughly <span className="hl">7.5-year period</span> linked
              to the planet Saturn that most people go through 2–3 times in life. It has a scary reputation —
              but for many it turns out to be their most productive years. Check below whether it is currently
              active for you.{" "}
              <Link href="/guides/sade-sati-meaning" style={{ color: "var(--maroon)", fontWeight: 600 }}>
                What Sade Sati really means →
              </Link>
            </p>
          )}
        </div>

        {/* Form — centered */}
        <div style={{ maxWidth: "480px", margin: "0 auto" }}>
          <PatrikaFrame>
            <BirthForm onSubmit={handleSubmit} loading={loading} />
            {error && <p className="form-error" style={{ marginTop: "1rem" }}>{error}</p>}
          </PatrikaFrame>
        </div>

        {loading && (
          <div style={{ textAlign: "center", padding: "3rem" }}>
            <div className="spinner" />
            <p style={{ color: "var(--muted)" }}>{t("form.loading")}</p>
          </div>
        )}

        {/* Result — always below the form */}
        {result && !loading && (
          <div ref={resultRef} style={{ marginTop: "2rem", scrollMarginTop: "90px" }}>
            <PatrikaFrame>
              <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    background: result.in_sade_sati
                      ? "linear-gradient(135deg, #8B2535, #511320)"
                      : "linear-gradient(135deg, #1a7a3a, #0d4a24)",
                    border: "3px solid var(--gold)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1rem",
                    color: "var(--gold-bright)",
                  }}
                >
                  {result.in_sade_sati ? <Icon name="planet" size={30} /> : <Icon name="check" size={30} />}
                </div>
                <h2
                  style={{
                    fontSize: "1.3rem",
                    color: result.in_sade_sati ? "var(--maroon)" : "#1a7a3a",
                    marginBottom: "0.25rem",
                  }}
                >
                  {result.in_sade_sati
                    ? (isHi ? "साढ़े साती सक्रिय है" : "Sade Sati is ACTIVE")
                    : result.in_dhaiya
                      ? (isHi ? `ढैया सक्रिय है (${result.dhaiya_hi ?? result.dhaiya_type ?? ""})` : `Dhaiya is active (${result.dhaiya_type ?? "2.5-year Saturn transit"})`)
                      : (isHi ? "साढ़े साती सक्रिय नहीं है" : "Sade Sati is NOT Active")}
                </h2>
                {result.current_phase && (
                  <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
                    {isHi
                      ? <span className="devanagari">चरण: {result.current_phase_hi}</span>
                      : <>Phase: {result.current_phase} <span className="devanagari">({result.current_phase_hi})</span></>}
                  </p>
                )}
                {/* What this status actually MEANS — status-specific, honest, no fear */}
                <p className={`result-explain${isHi ? " devanagari" : ""}`} style={{ maxWidth: "520px", margin: "0.85rem auto 0", textAlign: "center", borderTop: "none", paddingTop: 0 }}>
                  {result.in_sade_sati
                    ? (isHi
                        ? <>शनि इस समय आपकी चंद्र राशि ({result.natal_moon_sign_hi}) के प्रभाव-क्षेत्र से गुज़र रहा है। साढ़े साती का अर्थ दंड नहीं — यह <span className="hl">अनुशासन, ज़िम्मेदारी और छँटाई</span> का दौर है: जो चीज़ें कमज़ोर नींव पर हैं, वे दबाव में आती हैं, और जो मेहनत ईमानदारी से होती है, वह स्थायी फल बनाती है। इस दौर में बड़े निर्णय सोच-समझकर लें, स्वास्थ्य-दिनचर्या नियमित रखें, और नीचे दिए चरण-विवरण से समझें कि अभी कौन-सा भाग चल रहा है।</>
                        : <>Saturn is currently moving through the influence zone of your Moon sign ({result.natal_moon_sign}). Sade Sati is not a punishment — it is a period of <span className="hl">discipline, responsibility and pruning</span>: whatever rests on weak foundations comes under pressure, while honest sustained effort builds lasting results. Take big decisions deliberately, keep health routines steady, and use the phase table below to see exactly which part you are in.</>)
                    : result.in_dhaiya
                      ? (isHi
                          ? <>यह साढ़े साती नहीं, <span className="hl">ढैया (लगभग 2.5 वर्ष)</span> है — {result.dhaiya_hi ?? ""}. चौथे भाव का शनि (कंटक) घर-मन-सुख की परीक्षा लेता है, आठवें भाव का शनि (अष्टम) अचानक बदलावों से जुड़ा है। प्रभाव साढ़े साती से हल्का, पर दिनचर्या व धैर्य वही माँगता है।</>
                          : <>This is not Sade Sati but <span className="hl">Dhaiya (≈ 2.5 years)</span> — {result.dhaiya_type ?? ""} Saturn. The 4th-house transit (Kantaka) tests home, mind and comfort; the 8th-house transit (Ashtama) is linked to sudden changes. Lighter than Sade Sati, but it asks for the same steady routine and patience.</>)
                      : (isHi
                          ? <>अभी शनि आपकी चंद्र राशि ({result.natal_moon_sign_hi}) से साढ़े साती बनाने वाले भावों में नहीं है — <span className="hl">यह दौर आपके लिए सक्रिय नहीं है</span>। नीचे दी गई अगली अवधि नोट कर लें: साढ़े साती अचानक नहीं आती, शनि की धीमी चाल से वर्षों पहले उसकी तिथि निश्चित होती है — यही तैयारी का लाभ है।</>
                          : <>Saturn is currently not in the houses that form Sade Sati from your Moon sign ({result.natal_moon_sign}) — <span className="hl">this period is not active for you</span>. Note the next window below: Sade Sati never arrives unannounced; Saturn's slow motion fixes its dates years in advance — which is exactly what makes preparation possible.</>)}
                </p>
              </div>

              <div className="result-box">
                <div className="result-label">{isHi ? "आपकी चंद्र राशि" : "Your Moon Sign"}</div>
                <div className="result-value">
                  {isHi ? result.natal_moon_sign_hi : result.natal_moon_sign}{" "}
                  <span className="devanagari" style={{ fontSize: "0.9em" }}>
                    {isHi ? result.natal_moon_sign : result.natal_moon_sign_hi}
                  </span>
                </div>
              </div>

              <div className="result-box">
                <div className="result-label">{isHi ? "शनि वर्तमान में" : "Saturn Currently In"}</div>
                <div className="result-value">
                  {isHi ? result.saturn_current_sign_hi : result.saturn_current_sign}{" "}
                  <span className="devanagari" style={{ fontSize: "0.9em" }}>
                    {isHi ? result.saturn_current_sign : result.saturn_current_sign_hi}
                  </span>
                  <span style={{ fontSize: "0.8rem", color: "var(--muted)", marginLeft: "0.4rem" }}>
                    {result.saturn_degree_in_sign?.toFixed(1)}°{result.saturn_retrograde ? " ℞" : ""}
                  </span>
                </div>
              </div>

              {result.in_sade_sati && result.current_sade_sati && (
                <div className="result-box">
                  <div className="result-label">{isHi ? "यह साढ़े साती अवधि" : "This Sade Sati Runs"}</div>
                  <div className="result-value" style={{ fontSize: "0.95rem" }}>
                    {result.current_sade_sati.start} → {result.current_sade_sati.end}
                  </div>
                </div>
              )}

              {result.in_sade_sati && result.current_phases && result.current_phases.length > 0 && (
                <div className="result-box">
                  <div className="result-label" style={{ marginBottom: "0.5rem" }}>
                    {isHi ? "तीन चरण" : "The Three Phases"}
                  </div>
                  <table style={{ width: "100%", fontSize: "0.82rem", borderCollapse: "collapse" }}>
                    <tbody>
                      {result.current_phases.map((ph) => {
                        const isCurrent = ph.phase === result.current_phase;
                        return (
                          <tr key={ph.phase} style={{ background: isCurrent ? "rgba(201,154,58,0.15)" : "transparent", fontWeight: isCurrent ? 700 : 400 }}>
                            <td style={{ padding: "0.35rem 0.5rem", textTransform: "capitalize" }}>
                              {isHi
                                ? <span className="devanagari">{ph.phase_hi}</span>
                                : <>{ph.phase} <span className="devanagari" style={{ color: "var(--muted)" }}>({ph.phase_hi})</span></>}
                            </td>
                            <td style={{ padding: "0.35rem 0.5rem" }}>
                              {isHi ? SIGN_HI[ph.sign] ?? ph.sign : ph.sign}
                            </td>
                            <td style={{ padding: "0.35rem 0.5rem", color: "var(--muted)" }}>{ph.from} → {ph.to}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  <p className="devanagari" style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: "0.5rem", lineHeight: 1.5 }}>
                    {isHi ? (
                      <><span className="hl">आरम्भिक (Rising)</span> — शनि 12वें भाव में, समायोजन और आंतरिक तैयारी का समय ·{" "}
                      <span className="hl">शिखर (Peak)</span> — शनि राशि पर, सबसे भारी पर सबसे परिवर्तनकारी चरण ·{" "}
                      <span className="hl">अवसान (Setting)</span> — शनि दूसरे भाव में, फल मिलने और स्थिरता का समय</>
                    ) : (
                      <><span className="hl">Rising</span> — Saturn in the 12th house, a time of adjustment and inner preparation ·{" "}
                      <span className="hl">Peak</span> — Saturn on your moon sign, the heaviest but most transformative phase ·{" "}
                      <span className="hl">Setting</span> — Saturn in the 2nd house, results settle in and stability returns</>
                    )}
                  </p>
                </div>
              )}

              {!result.in_sade_sati && result.next_sade_sati && (
                <div className="result-box">
                  <div className="result-label">{isHi ? "अगली साढ़े साती" : "Next Sade Sati"}</div>
                  <div className="result-value" style={{ fontSize: "0.95rem" }}>
                    {result.next_sade_sati.start} → {result.next_sade_sati.end}
                  </div>
                </div>
              )}

              {result.previous_sade_sati && (
                <div className="result-box">
                  <div className="result-label">{isHi ? "पिछली साढ़े साती" : "Previous Sade Sati"}</div>
                  <div className="result-value" style={{ fontSize: "0.95rem" }}>
                    {result.previous_sade_sati.start} → {result.previous_sade_sati.end}
                  </div>
                  <p className={`result-explain${isHi ? " devanagari" : ""}`}>
                    {isHi
                      ? "इन वर्षों को याद कीजिए — उस दौर में जीवन कैसा रहा, यही सबसे ईमानदार संकेत है कि आपका शनि आपसे कैसा व्यवहार करता है।"
                      : "Think back to these years — how life actually felt then is the most honest indicator of how your Saturn treats you."}
                  </p>
                </div>
              )}

              <div className="result-box">
                <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.85rem", color: "var(--ink-light)", lineHeight: 1.6 }}>
                  {(isHi ? result.note_hi : result.note_en) ?? result.note}
                </p>
              </div>

              {result.remedies && result.remedies.length > 0 && (
                <div className="result-box">
                  <div className="result-label" style={{ marginBottom: "0.5rem" }}>
                    {isHi ? "सुझाए गए उपाय" : "Suggested Remedies"}
                  </div>
                  <ul style={{ paddingLeft: "1.2rem" }}>
                    {((isHi ? result.remedies_hi : result.remedies_en) ?? result.remedies).map((r, i) => (
                      <li key={i} className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.85rem", color: "var(--ink-light)", marginBottom: "0.25rem" }}>{r}</li>
                    ))}
                  </ul>
                  <p className={`result-explain${isHi ? " devanagari" : ""}`}>
                    {isHi
                      ? "ये सामान्य शास्त्रीय उपाय हैं — शनि सेवा और अनुशासन से प्रसन्न होता है, महँगे अनुष्ठानों से नहीं। कुंडली-विशेष उपाय के लिए जन्म-शनि की स्थिति देखना ज़रूरी है।"
                      : "These are general classical remedies — Saturn responds to service and discipline, not expensive rituals. Chart-specific remedies need your natal Saturn examined."}
                  </p>
                </div>
              )}

              <Divider />
              <ResultCTA
                locked={[
                  { en: "Is YOUR natal Saturn strong or weak? (that decides everything)", hi: "आपका जन्म-शनि बली है या दुर्बल? (यही सब तय करता है)" },
                  { en: "Ashtakavarga cushioning of each phase", hi: "हर चरण का अष्टकवर्ग-आधार" },
                  { en: "Which months inside the phase need care", hi: "चरण के भीतर कौन-से महीने सावधानी के" },
                  { en: "Honest, chart-specific remedies", hi: "ईमानदार, कुंडली-विशेष उपाय" },
                ]}
                hook={{
                  en: result.in_sade_sati
                    ? "Whether Sade Sati trains you or troubles you depends on your natal Saturn's strength — that's a personal reading, not a calculator."
                    : "No Sade Sati now — but knowing how your Saturn behaves prepares you before the next one arrives.",
                  hi: result.in_sade_sati
                    ? "साढ़े साती प्रशिक्षण देगी या परेशानी — यह आपके जन्म-शनि के बल पर निर्भर है। यह गणना नहीं, व्यक्तिगत पाठन का विषय है।"
                    : "अभी साढ़े साती नहीं — पर अपने शनि का स्वभाव जानना अगली साढ़े साती से पहले की तैयारी है।",
                }}
                waText={`Namaste Shivanii ji! I checked Sade Sati on your website — Moon sign ${result.natal_moon_sign}, status: ${result.in_sade_sati ? `ACTIVE (${result.current_phase} phase)` : "not active"}. I want to know how my Saturn will treat me.`}
                reading={{ href: "/readings/birth-chart", labelEn: "Book Birth Chart Reading ₹999", labelHi: "कुंडली विश्लेषण बुक करें ₹999" }}
              />
            </PatrikaFrame>
          </div>
        )}

        {!result && !loading && (
          <div style={{ textAlign: "center", padding: "2rem", color: "var(--muted)" }}>
            <div style={{ color: "var(--gold)", marginBottom: "0.75rem", display: "flex", justifyContent: "center" }}>
              <Icon name="planet" size={40} strokeWidth={1.3} />
            </div>
            <p>{isHi ? "जन्म विवरण डालें — परिणाम नीचे दिखेगा" : "Enter your birth details — the result will appear below"}</p>
          </div>
        )}
      </div>
    </section>
  );
}
