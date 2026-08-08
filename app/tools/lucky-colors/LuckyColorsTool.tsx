"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import BirthForm from "@/components/BirthForm";
import PatrikaFrame from "@/components/PatrikaFrame";
import Divider from "@/components/Divider";
import Icon from "@/components/Icon";
import ResultCTA from "@/components/ResultCTA";
import { fetchLuckyColors } from "@/lib/api/endpoints";
import type { BirthRequest, LuckyColorsResult } from "@/lib/api/types";
import { ApiError } from "@/lib/api/client";
import { useBackStep } from "@/lib/useBackStep";
import { SIGN_HI, PLANET_HI, colorHi } from "@/lib/hindi-labels";

/** Best-effort CSS color for a name returned by the API — most (Red, Gold,
 *  Blue, White, Black…) are valid CSS keywords already; a small fallback
 *  map covers the handful that aren't. */
const CSS_COLOR_MAP: Record<string, string> = {
  Saffron: "#f4c430",
  "Turmeric Yellow": "#e5b80b",
  Maroon: "#800000",
  Cream: "#fffdd0",
  "Off-White": "#faf9f6",
  Copper: "#b87333",
  "Golden Yellow": "#ffdf00",
};

function ColorDot({ name }: { name: string }) {
  const css = CSS_COLOR_MAP[name] ?? name.toLowerCase().replace(/[^a-z]/g, "");
  return (
    <span
      style={{
        display: "inline-block", width: "0.7rem", height: "0.7rem", borderRadius: "50%",
        background: css, border: "1px solid rgba(0,0,0,0.25)", marginRight: "0.4rem", verticalAlign: "middle",
      }}
    />
  );
}

export default function LuckyColorsTool() {
  const { t, lang } = useI18n();
  const isHi = lang === "hi";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<LuckyColorsResult | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (result) resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [result]);

  useBackStep(!!result, "luckyColorsResult", () => {
    setResult(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  async function handleSubmit(birth: BirthRequest) {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const data = await fetchLuckyColors(birth);
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
        <h1 className={`section-heading${isHi ? " devanagari" : ""}`}>{isHi ? "शुभ रंग गणना" : "Lucky Color Calculator"}</h1>
        <p className="section-heading-hi devanagari">{isHi ? "Lucky Color Calculator" : "शुभ रंग गणना"}</p>

        <div className="tool-explainer" style={{ textAlign: "center", marginBottom: "2rem" }}>
          {isHi ? (
            <p className="devanagari">
              आपकी <span className="hl">लग्न</span> और <span className="hl">नक्षत्र स्वामी</span> के आधार पर वे रंग,
              जो आपके लिए शुभ माने जाते हैं — कपड़ों, कमरे या शुभ अवसरों के लिए चुनने हेतु।
            </p>
          ) : (
            <p>
              Colors considered auspicious for you, based on your <span className="hl">Ascendant (Lagna)</span> and{" "}
              <span className="hl">Nakshatra lord</span> — useful for clothing, decor, or important occasions.
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
                <div style={{ color: "var(--gold)", marginBottom: "0.5rem", display: "flex", justifyContent: "center" }}>
                  <Icon name="droplet" size={36} />
                </div>
                <h2 style={{ fontSize: "1.3rem" }}>{isHi ? "आपके शुभ रंग" : "Your Lucky Colors"}</h2>
              </div>

              <div className="result-box">
                <div className="result-label">{isHi ? "लग्न" : "Ascendant (Lagna)"}</div>
                <div className="result-value">{isHi ? SIGN_HI[result.lagna] ?? result.lagna : result.lagna}</div>
              </div>
              <div className="result-box">
                <div className="result-label">{isHi ? "लग्न स्वामी" : "Lagna Lord"}</div>
                <div className="result-value">{isHi ? PLANET_HI[result.lagna_lord] ?? result.lagna_lord : result.lagna_lord}</div>
              </div>
              <div className="result-box">
                <div className="result-label">{isHi ? "नक्षत्र स्वामी" : "Nakshatra Lord"}</div>
                <div className="result-value">{isHi ? PLANET_HI[result.nakshatra_lord] ?? result.nakshatra_lord : result.nakshatra_lord}</div>
              </div>

              {/* Shown grouped by WHICH lord each color belongs to — these
                  colors genuinely come from two different planets (Lagna
                  lord and Nakshatra lord), and showing them as one
                  undifferentiated list looked like a data error when
                  checked against either planet's classical colors alone. */}
              <div className="result-box">
                <div className="result-label" style={{ marginBottom: "0.5rem" }}>
                  {isHi
                    ? `शुभ रंग — लग्न स्वामी (${PLANET_HI[result.auspicious_colors_by_source.lagna_lord.planet] ?? result.auspicious_colors_by_source.lagna_lord.planet})`
                    : `Auspicious Colors — Lagna Lord (${result.auspicious_colors_by_source.lagna_lord.planet})`}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                  {result.auspicious_colors_by_source.lagna_lord.colors.map((c) => (
                    <span key={c} className="trait-chip" style={{ background: "rgba(26,122,58,0.08)", borderColor: "rgba(26,122,58,0.3)" }}>
                      <ColorDot name={c} />{isHi ? colorHi(c) : c}
                    </span>
                  ))}
                </div>
              </div>
              <div className="result-box">
                <div className="result-label" style={{ marginBottom: "0.5rem" }}>
                  {isHi
                    ? `शुभ रंग — नक्षत्र स्वामी (${PLANET_HI[result.auspicious_colors_by_source.nakshatra_lord.planet] ?? result.auspicious_colors_by_source.nakshatra_lord.planet})`
                    : `Auspicious Colors — Nakshatra Lord (${result.auspicious_colors_by_source.nakshatra_lord.planet})`}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                  {result.auspicious_colors_by_source.nakshatra_lord.colors.map((c) => (
                    <span key={c} className="trait-chip" style={{ background: "rgba(26,122,58,0.08)", borderColor: "rgba(26,122,58,0.3)" }}>
                      <ColorDot name={c} />{isHi ? colorHi(c) : c}
                    </span>
                  ))}
                </div>
              </div>

              {result.inauspicious_colors.length > 0 && (
                <div className="result-box">
                  <div className="result-label" style={{ marginBottom: "0.5rem" }}>
                    {isHi ? "बचने योग्य रंग" : "Colors to Avoid"}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                    {result.inauspicious_colors.map((c) => (
                      <span key={c} className="trait-chip" style={{ background: "rgba(192,57,43,0.06)", borderColor: "rgba(192,57,43,0.25)", opacity: 0.85 }}>
                        <ColorDot name={c} />{isHi ? colorHi(c) : c}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="result-box">
                <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.85rem", color: "var(--ink-light)", lineHeight: 1.6 }}>
                  {isHi
                    ? "अपने ग्रह के दिन इन शुभ रंगों को पहनने से उसका शुभ प्रभाव और बढ़ता है।"
                    : result.note}
                </p>
              </div>

              <Divider />
              <ResultCTA
                locked={[
                  { en: "Which colors strengthen your weak planets specifically", hi: "आपके दुर्बल ग्रहों को बल देने वाले विशेष रंग" },
                  { en: "Colors for career, health & relationship contexts separately", hi: "करियर, स्वास्थ्य व रिश्तों के लिए अलग-अलग रंग" },
                  { en: "Gemstone pairing with your lucky colors", hi: "शुभ रंगों के साथ रत्न सुझाव" },
                ]}
                hook={{
                  en: "Colors are one layer — a full reading matches them to your actual planetary strengths.",
                  hi: "रंग केवल एक परत हैं — पूर्ण पाठन इन्हें आपके वास्तविक ग्रह-बल से जोड़ता है।",
                }}
                waText={`Namaste Shivanii ji! I checked my Lucky Colors on your website — Lagna ${result.lagna}, auspicious colors: ${result.auspicious_colors.join(", ")}. I'd like to know more.`}
                reading={{ href: "/readings/birth-chart", labelEn: "Book Birth Chart Reading ₹999", labelHi: "कुंडली विश्लेषण बुक करें ₹999" }}
              />
            </PatrikaFrame>
          </div>
        )}

        {!result && !loading && (
          <div style={{ textAlign: "center", padding: "2rem", color: "var(--muted)" }}>
            <div style={{ color: "var(--gold)", marginBottom: "0.75rem", display: "flex", justifyContent: "center" }}>
              <Icon name="droplet" size={40} strokeWidth={1.3} />
            </div>
            <p>{isHi ? "जन्म विवरण डालें — परिणाम नीचे दिखेगा" : "Enter your birth details — the result will appear below"}</p>
          </div>
        )}
      </div>
    </section>
  );
}
