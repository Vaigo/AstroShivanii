"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import DobNameForm from "@/components/DobNameForm";
import DownloadReportButton from "@/components/DownloadReportButton";
import PatrikaFrame from "@/components/PatrikaFrame";
import Divider from "@/components/Divider";
import Icon from "@/components/Icon";
import ResultCTA from "@/components/ResultCTA";
import { fetchFirstLetter } from "@/lib/api/endpoints";
import type { FirstLetterResult } from "@/lib/api/types";
import { ApiError } from "@/lib/api/client";
import { useBackStep } from "@/lib/useBackStep";

export default function FavorableAlphabetTool() {
  const { t, lang } = useI18n();
  const isHi = lang === "hi";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<FirstLetterResult | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (result) resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [result]);

  useBackStep(!!result, "favorableAlphabetResult", () => {
    setResult(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // This calculation only ever looks at the first and last letters of the
  // name (verified against backend/app/routers/numerology.py's first-letter
  // handler) — a date of birth plays no role, so we don't ask for one here;
  // DobNameForm's hideDob sends the API's required-but-unread dob field
  // silently under the hood.
  async function handleSubmit(data: { dob: string; name: string; system: "chaldean" | "pythagorean" }) {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetchFirstLetter(data);
      setResult(res);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : t("form.error"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: "780px" }}>
        <h1 className={`section-heading${isHi ? " devanagari" : ""}`}>{isHi ? "शुभ अक्षर गणना" : "Favorable Alphabet Calculator"}</h1>
        <p className="section-heading-hi devanagari">{isHi ? "Favorable Alphabet Calculator" : "शुभ अक्षर गणना"}</p>

        <div className="tool-explainer" style={{ textAlign: "center", marginBottom: "2rem" }}>
          {isHi ? (
            <p className="devanagari">
              आपके नाम का <span className="hl">पहला अक्षर (Cornerstone)</span> और{" "}
              <span className="hl">अंतिम अक्षर (Capstone)</span> बताते हैं कि आप जीवन को कैसे शुरू करते हैं और कैसे
              पूरा करते हैं — करियर की दिशा सहित। केवल आपका नाम चाहिए, जन्म तिथि की ज़रूरत नहीं — गणना{" "}
              <span className="hl">चाल्डियन पद्धति</span> (परंपरागत व सर्वाधिक अनुशंसित) से होती है।
            </p>
          ) : (
            <p>
              The <span className="hl">first letter (Cornerstone)</span> and{" "}
              <span className="hl">last letter (Capstone)</span> of your name reveal how you start things and how
              you finish them — including career direction. Only your name is needed, no date of birth — the
              calculation uses the <span className="hl">Chaldean system</span> (the traditional, most-recommended
              method).
            </p>
          )}
        </div>

        <div style={{ maxWidth: "420px", margin: "0 auto" }}>
          <PatrikaFrame>
            <DobNameForm
              onSubmit={handleSubmit}
              loading={loading}
              nameRequired
              hideDob
              nameHint={{
                en: "This tool reads only the first and last letters (Cornerstone and Capstone) — enter your name exactly as you want it read. A nickname or short form will give a different Cornerstone/Capstone than your full legal name.",
                hi: "यह उपकरण केवल पहले और अंतिम अक्षर (Cornerstone और Capstone) को पढ़ता है — नाम ठीक वैसे ही लिखें जैसा जांचना है। उपनाम या छोटा नाम आपके पूरे कानूनी नाम से अलग Cornerstone/Capstone देगा।",
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
            <DownloadReportButton filename="AstroShivanii-Favorable-Alphabet" />
            <PatrikaFrame>
              {/* Plain-language framing FIRST — "Cornerstone/Capstone/Chaldean
                  value" were shown below with zero in-result explanation. */}
              <div className="result-box" style={{ marginTop: 0, marginBottom: "1rem" }}>
                <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.88rem", color: "var(--ink-light)", lineHeight: 1.7, margin: 0 }}>
                  {isHi
                    ? <>आसान भाषा में: आपके नाम का <strong>पहला अक्षर</strong> बताता है कि आप कोई भी काम — नई नौकरी, नया रिश्ता, नई चुनौती — <strong>शुरू कैसे</strong> करते हैं। और <strong>आखिरी अक्षर</strong> बताता है कि आप उसे <strong>पूरा कैसे</strong> करते हैं। हर अक्षर का एक अंक होता है और हर अंक का एक ग्रह — नीचे के सारे नतीजे इसी से निकले हैं।</>
                    : <>The simple version: your name&apos;s <strong>first letter</strong> shows how you <strong>begin</strong> anything — a new job, a new relationship, a new challenge. And the <strong>last letter</strong> shows how you <strong>finish</strong> it. Every letter has a number, and every number has a planet — that&apos;s where all the results below come from.</>}
                </p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem", marginBottom: "1rem" }}>
                <div className="result-box" style={{ textAlign: "center" }}>
                  <div className="result-label">{isHi ? "कॉर्नरस्टोन (पहला अक्षर)" : "Cornerstone (First Letter)"}</div>
                  <div style={{ fontSize: "2.4rem", fontFamily: "var(--font-display)", color: "var(--maroon-deep)", margin: "0.3rem 0" }}>
                    {result.cornerstone.letter}
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "var(--muted)" }}>{isHi ? `चाल्डियन मान: ${result.cornerstone.value}` : `Chaldean value: ${result.cornerstone.value}`}</div>
                  <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.85rem", color: "var(--ink-light)", marginTop: "0.5rem" }}>
                    {isHi ? result.cornerstone.meaning_hi : result.cornerstone.meaning_en}
                  </p>
                  <div style={{ marginTop: "0.6rem", fontSize: "0.8rem", color: "var(--muted)" }}>
                    {isHi ? result.cornerstone.ruling_planet_hi : result.cornerstone.ruling_planet} ·{" "}
                    {isHi ? result.cornerstone.gemstone_hi : result.cornerstone.gemstone} ·{" "}
                    {result.cornerstone.colour}
                  </div>
                </div>

                <div className="result-box" style={{ textAlign: "center" }}>
                  <div className="result-label">{isHi ? "कैपस्टोन (अंतिम अक्षर)" : "Capstone (Last Letter)"}</div>
                  <div style={{ fontSize: "2.4rem", fontFamily: "var(--font-display)", color: "var(--maroon-deep)", margin: "0.3rem 0" }}>
                    {result.capstone.letter}
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "var(--muted)" }}>{isHi ? `चाल्डियन मान: ${result.capstone.value}` : `Chaldean value: ${result.capstone.value}`}</div>
                  <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.85rem", color: "var(--ink-light)", marginTop: "0.5rem" }}>
                    {isHi ? result.capstone.meaning_hi : result.capstone.meaning_en}
                  </p>
                  <div style={{ marginTop: "0.6rem", fontSize: "0.8rem", color: "var(--muted)" }}>
                    {isHi ? result.capstone.ruling_planet_hi : result.capstone.ruling_planet} ·{" "}
                    {isHi ? result.capstone.gemstone_hi : result.capstone.gemstone} ·{" "}
                    {result.capstone.colour}
                  </div>
                </div>
              </div>

              <div className="result-box">
                <div className="result-label">{isHi ? "करियर तालमेल" : "Career Resonance"}</div>
                <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.9rem", color: "var(--ink-light)", lineHeight: 1.6 }}>
                  {isHi ? result.career_resonance_hi : result.career_resonance}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginTop: "0.6rem" }}>
                  {(isHi ? result.recommended_careers_hi : result.recommended_careers).map((c) => (
                    <span key={c} className={isHi ? "trait-chip devanagari" : "trait-chip"}>{c}</span>
                  ))}
                </div>
              </div>

              <div className="result-box">
                <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.85rem", color: "var(--ink-light)", lineHeight: 1.6 }}>
                  {isHi ? result.interpretation_hi : result.interpretation_en}
                </p>
              </div>

              <Divider />
              <ResultCTA
                locked={[
                  { en: "Whether your name's vibration truly matches your birth chart", hi: "क्या आपके नाम का कंपन आपकी कुंडली से मेल खाता है" },
                  { en: "A name-correction suggestion, if genuinely needed", hi: "यदि आवश्यक हो तो नाम-सुधार का सुझाव" },
                ]}
                hook={{
                  en: "Letters are one layer of numerology — a full reading checks whether your name actually supports your birth chart.",
                  hi: "अक्षर अंक ज्योतिष की एक परत हैं — पूर्ण पाठन जांचता है कि आपका नाम आपकी कुंडली का साथ देता है या नहीं।",
                }}
                waText={`Namaste Shivanii ji! My Cornerstone letter is ${result.cornerstone.letter} and Capstone is ${result.capstone.letter}. I'd like to know if my name truly supports my chart.`}
                reading={{ href: "/readings/birth-chart", labelEn: "Book Birth Chart Reading ₹999", labelHi: "कुंडली विश्लेषण बुक करें ₹999" }}
              />
            </PatrikaFrame>
          </div>
        )}

        {!result && !loading && (
          <div style={{ textAlign: "center", padding: "2rem", color: "var(--muted)" }}>
            <div style={{ color: "var(--gold)", marginBottom: "0.75rem", display: "flex", justifyContent: "center" }}>
              <Icon name="type" size={40} strokeWidth={1.3} />
            </div>
            <p>{isHi ? "अपना नाम डालें — परिणाम नीचे दिखेगा" : "Enter your name — the result will appear below"}</p>
          </div>
        )}
      </div>
    </section>
  );
}
