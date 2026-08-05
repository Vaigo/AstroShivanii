"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import BirthForm from "@/components/BirthForm";
import PatrikaFrame from "@/components/PatrikaFrame";
import Divider from "@/components/Divider";
import Icon from "@/components/Icon";
import ResultCTA from "@/components/ResultCTA";
import { fetchSpecialYogas } from "@/lib/api/endpoints";
import type { BirthRequest, SpecialYogasResult } from "@/lib/api/types";
import { ApiError } from "@/lib/api/client";
import { useBackStep } from "@/lib/useBackStep";

const DIRECTION_LABEL: Record<string, { en: string; hi: string }> = {
  "Udit Golardha (Rahu→Ketu)": { en: "Udit Golardha (Rahu → Ketu)", hi: "उदित गोलार्ध (राहु → केतु)" },
  "Anudit Golardha (Ketu→Rahu)": { en: "Anudit Golardha (Ketu → Rahu)", hi: "अनुदित गोलार्ध (केतु → राहु)" },
};

export default function KaalSarpTool() {
  const { t, lang } = useI18n();
  const isHi = lang === "hi";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<SpecialYogasResult | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (result) resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [result]);

  useBackStep(!!result, "kaalSarpResult", () => {
    setResult(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  async function handleSubmit(birth: BirthRequest) {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const data = await fetchSpecialYogas(birth);
      setResult(data);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : t("form.error"));
    } finally {
      setLoading(false);
    }
  }

  const kaalSarp = result?.special_yogas.find((y) => y.name === "Kaal Sarpa Yoga");

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: "760px" }}>
        <h1 className={`section-heading${isHi ? " devanagari" : ""}`}>{isHi ? "काल सर्प दोष जांच" : "Kaal Sarp Dosha Checker"}</h1>
        <p className="section-heading-hi devanagari">{isHi ? "Kaal Sarp Dosha Checker" : "काल सर्प दोष जांच"}</p>

        <div className="tool-explainer" style={{ textAlign: "center", marginBottom: "2rem" }}>
          {isHi ? (
            <p className="devanagari">
              <span className="hl">काल सर्प दोष</span> तब बनता है जब सभी सात ग्रह राहु और केतु के एक ही ओर स्थित हों।
              यह जितना डरावना बताया जाता है उतना नहीं — जांचें कि यह आपकी कुंडली में मौजूद है या नहीं।
            </p>
          ) : (
            <p>
              <span className="hl">Kaal Sarp Dosha</span> forms when all seven classical planets sit on one side of
              the Rahu–Ketu axis. It has a scarier reputation than it deserves — check whether it's actually present
              in your chart.
            </p>
          )}
        </div>

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

        {result && !loading && (
          <div ref={resultRef} style={{ marginTop: "2rem", scrollMarginTop: "90px" }}>
            <PatrikaFrame>
              <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                <div
                  style={{
                    width: "80px", height: "80px", borderRadius: "50%",
                    background: kaalSarp
                      ? "linear-gradient(135deg, #8B2535, #511320)"
                      : "linear-gradient(135deg, #1a7a3a, #0d4a24)",
                    border: "3px solid var(--gold)", display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 1rem", color: "var(--gold-bright)",
                  }}
                >
                  {kaalSarp ? <Icon name="planet" size={30} /> : <Icon name="check" size={30} />}
                </div>
                <h2 style={{ fontSize: "1.3rem", color: kaalSarp ? "var(--maroon)" : "#1a7a3a", marginBottom: "0.25rem" }}>
                  {kaalSarp
                    ? (isHi ? "काल सर्प दोष उपस्थित है" : "Kaal Sarp Dosha is PRESENT")
                    : (isHi ? "काल सर्प दोष उपस्थित नहीं है" : "Kaal Sarp Dosha is NOT Present")}
                </h2>
              </div>

              {kaalSarp ? (
                <>
                  <div className="result-box">
                    <div className="result-label">{isHi ? "प्रकार" : "Direction"}</div>
                    <div className="result-value">
                      {kaalSarp.direction
                        ? (isHi ? DIRECTION_LABEL[kaalSarp.direction]?.hi ?? kaalSarp.direction : DIRECTION_LABEL[kaalSarp.direction]?.en ?? kaalSarp.direction)
                        : "—"}
                    </div>
                  </div>
                  <div className="result-box">
                    <div className="result-label">{isHi ? "शामिल ग्रह" : "Planets Involved"}</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginTop: "0.4rem" }}>
                      {kaalSarp.planets.map((p) => (
                        <span key={p} className="trait-chip">{p}</span>
                      ))}
                    </div>
                  </div>
                  <div className="result-box">
                    <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.85rem", color: "var(--ink-light)", lineHeight: 1.6 }}>
                      {isHi ? kaalSarp.effect_hi : kaalSarp.effect_en}
                    </p>
                  </div>
                </>
              ) : (
                <div className="result-box">
                  <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.85rem", color: "var(--ink-light)", lineHeight: 1.6 }}>
                    {isHi
                      ? "आपके सातों ग्रह राहु-केतु अक्ष के दोनों ओर फैले हुए हैं — इसलिए काल सर्प दोष की शर्त पूरी नहीं होती।"
                      : "Your seven classical planets are spread on both sides of the Rahu–Ketu axis — the condition for Kaal Sarp Dosha isn't met."}
                  </p>
                </div>
              )}

              <Divider />
              <ResultCTA
                locked={[
                  { en: "Exact strength & timing of this dosha's effects in your life", hi: "इस दोष के प्रभाव की सटीक ताकत व समय" },
                  { en: "Whether any cancellation (Kaal Sarp Bhang) applies to you", hi: "क्या कोई भंग योग आप पर लागू होता है" },
                  { en: "Chart-specific remedies, not generic ones", hi: "सामान्य नहीं, कुंडली-विशेष उपाय" },
                ]}
                hook={{
                  en: kaalSarp
                    ? "Presence alone doesn't tell the whole story — its real strength depends on your full chart."
                    : "No Kaal Sarp Dosha — but a full reading checks every other dosha too.",
                  hi: kaalSarp
                    ? "केवल उपस्थिति पूरी कहानी नहीं बताती — इसकी वास्तविक ताकत पूरी कुंडली पर निर्भर करती है।"
                    : "काल सर्प दोष नहीं है — पर पूर्ण पाठन में अन्य सभी दोष भी जांचे जाते हैं।",
                }}
                waText={`Namaste Shivanii ji! I checked Kaal Sarp Dosha on your website — result: ${kaalSarp ? `PRESENT (${kaalSarp.direction ?? ""})` : "not present"}. I want to know more.`}
                reading={{ href: "/readings/birth-chart", labelEn: "Book Birth Chart Reading ₹999", labelHi: "कुंडली विश्लेषण बुक करें ₹999" }}
              />
            </PatrikaFrame>
          </div>
        )}

        {!result && !loading && (
          <div style={{ textAlign: "center", padding: "2rem", color: "var(--muted)" }}>
            <div style={{ color: "var(--gold)", marginBottom: "0.75rem", display: "flex", justifyContent: "center" }}>
              <Icon name="shield" size={40} strokeWidth={1.3} />
            </div>
            <p>{isHi ? "जन्म विवरण डालें — परिणाम नीचे दिखेगा" : "Enter your birth details — the result will appear below"}</p>
          </div>
        )}
      </div>
    </section>
  );
}
