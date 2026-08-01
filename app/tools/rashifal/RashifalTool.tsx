"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import PatrikaFrame from "@/components/PatrikaFrame";
import Divider from "@/components/Divider";
import ResultCTA from "@/components/ResultCTA";
import { fetchRashifal } from "@/lib/api/endpoints";
import type { RashiPrediction } from "@/lib/api/types";
import { ApiError } from "@/lib/api/client";
import { useBackStep } from "@/lib/useBackStep";

/* ︎ forces TEXT presentation — without it Windows/Android render zodiac
   glyphs as colored emoji, which clashes with the parchment theme. */
const RASHIS = [
  { en: "Aries", hi: "मेष", glyph: "♈︎" }, { en: "Taurus", hi: "वृषभ", glyph: "♉︎" }, { en: "Gemini", hi: "मिथुन", glyph: "♊︎" },
  { en: "Cancer", hi: "कर्क", glyph: "♋︎" }, { en: "Leo", hi: "सिंह", glyph: "♌︎" }, { en: "Virgo", hi: "कन्या", glyph: "♍︎" },
  { en: "Libra", hi: "तुला", glyph: "♎︎" }, { en: "Scorpio", hi: "वृश्चिक", glyph: "♏︎" }, { en: "Sagittarius", hi: "धनु", glyph: "♐︎" },
  { en: "Capricorn", hi: "मकर", glyph: "♑︎" }, { en: "Aquarius", hi: "कुंभ", glyph: "♒︎" }, { en: "Pisces", hi: "मीन", glyph: "♓︎" },
];

const DOMAINS = [
  { key: "overall", en: "Overall", hi: "समग्र" },
  { key: "career",  en: "Career", hi: "करियर" },
  { key: "love",    en: "Love & Relationships", hi: "प्रेम और रिश्ते" },
  { key: "health",  en: "Health", hi: "स्वास्थ्य" },
  { key: "finance", en: "Finance", hi: "धन" },
  { key: "spirit",  en: "Spiritual", hi: "आध्यात्म" },
] as const;

function StarRating({ rating }: { rating: number }) {
  return (
    <div style={{ display: "flex", gap: "0.2rem" }}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} style={{ color: i < Math.round(rating) ? "var(--gold)" : "rgba(201,154,58,0.3)", fontSize: "1rem" }}>★</span>
      ))}
    </div>
  );
}

export default function RashifalTool() {
  const { t, lang } = useI18n();
  const isHi = lang === "hi";
  const [selectedRashi, setSelectedRashi] = useState("Aries");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<RashiPrediction | null>(null);
  const [forDate, setForDate] = useState("");
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (result) resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [result]);

  // Back button clears the result (returning to the rashi picker) instead of leaving the page.
  useBackStep(!!result, "rashifalResult", () => {
    setResult(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  async function handleCalculate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const today = new Date().toISOString().split("T")[0];
      // The API returns all 12 rashis for the date; pick the selected one.
      const data = await fetchRashifal(today);
      const mine = data.rashifal.find((r) => r.rashi_en === selectedRashi) ?? null;
      if (!mine) throw new ApiError(500, "NOT_FOUND", "Rashi not found in response");
      setForDate(data.date);
      setResult(mine);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : t("form.error"));
    } finally {
      setLoading(false);
    }
  }

  const texts = result ? (isHi ? result.predictions_hi : result.predictions_en) : null;

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: "760px" }}>
        <h1 className="section-heading">Daily Rashifal</h1>
        <p className="section-heading-hi devanagari">दैनिक राशिफल</p>

        <div className="tool-explainer" style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          {isHi ? (
            <p className="devanagari">
              राशिफल आपकी <span className="hl">चंद्र राशि</span> पर आधारित है — आज ग्रहों का <span className="hl">गोचर (transit)</span> उस
              राशि के लिए जीवन के हर क्षेत्र को कैसे प्रभावित करता है, इसका सामान्य संकेत। यह सबके लिए एक-जैसा है;
              आपकी अपनी कुंडली का बारीक प्रभाव अलग हो सकता है।
            </p>
          ) : (
            <p>
              Your rashifal is based on your <span className="hl">moon sign</span> — a general signal of how
              today&apos;s planetary <span className="hl">transits</span> touch each area of life for that sign.
              It&apos;s the same for everyone born under it; your own chart can shift the details.
            </p>
          )}
        </div>

        <PatrikaFrame style={{ marginBottom: "1.5rem" }}>
          <form onSubmit={handleCalculate}>
            <p className="form-label" style={{ marginBottom: "0.75rem" }}>{t("form.rashi")}</p>
            {/* Symbol grid instead of a dropdown — scannable, thumb-friendly,
                and it looks like astrology rather than a form */}
            <div className="rashi-grid" role="radiogroup" aria-label={t("form.rashi")}>
              {RASHIS.map((r) => (
                <button
                  key={r.en}
                  type="button"
                  role="radio"
                  aria-checked={selectedRashi === r.en}
                  className={`rashi-tile${selectedRashi === r.en ? " active" : ""}`}
                  onClick={() => setSelectedRashi(r.en)}
                >
                  <span className="rashi-tile-glyph" aria-hidden="true">{r.glyph}</span>
                  <span className="rashi-tile-hi">{r.hi}</span>
                  <span className="rashi-tile-en">{r.en}</span>
                </button>
              ))}
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: "100%" }}>
              {loading ? t("form.calculating") : isHi ? "आज का राशिफल देखें" : "Get Today's Rashifal"}
            </button>
          </form>
        </PatrikaFrame>

        {error && <p className="form-error">{error}</p>}

        {loading && (
          <div style={{ textAlign: "center" }}>
            <div className="spinner" />
            <p style={{ color: "var(--muted)" }}>{t("form.loading")}</p>
          </div>
        )}

        {result && texts && !loading && (
          <div ref={resultRef} style={{ scrollMarginTop: "90px" }}>
          <PatrikaFrame>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem", flexWrap: "wrap", gap: "0.5rem" }}>
              <div>
                <h2 style={{ fontSize: "1.4rem", marginBottom: "0.2rem" }}>
                  {result.rashi_en}{" "}
                  <span className="devanagari" style={{ color: "var(--muted)", fontSize: "0.85em" }}>
                    {result.rashi_hi}
                  </span>
                </h2>
                <span style={{ color: "var(--muted)", fontSize: "0.82rem" }}>
                  {forDate} · {isHi ? "स्वामी" : "Lord"}: {result.rashi_lord} · {result.symbol}
                </span>
              </div>
              <div style={{ textAlign: "right" }}>
                <StarRating rating={result.overall_stars} />
                <span style={{ fontSize: "0.78rem", color: "var(--saffron)", fontWeight: 700 }}>
                  {texts.stars_label}
                </span>
              </div>
            </div>

            <Divider />

            {DOMAINS.map(({ key, en, hi }) => {
              const text = texts[key];
              if (!text) return null;
              const stars = key === "overall" ? null : result.domain_stars[key];
              return (
                <div key={key} className="result-box" style={{ marginTop: "0.75rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div className="result-label">{isHi ? hi : en}</div>
                    {stars != null && <StarRating rating={stars} />}
                  </div>
                  <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.9rem", color: "var(--ink-light)", lineHeight: 1.6 }}>
                    {text}
                  </p>
                </div>
              );
            })}

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "0.75rem", marginTop: "1rem" }}>
              <div className="result-box" style={{ margin: 0, textAlign: "center" }}>
                <div className="result-label">{isHi ? "शुभ रंग" : "Lucky Colors"}</div>
                <div className="result-value" style={{ fontSize: "0.9rem" }}>
                  {result.lucky.colors.join(", ")}
                </div>
              </div>
              <div className="result-box" style={{ margin: 0, textAlign: "center" }}>
                <div className="result-label">{isHi ? "शुभ अंक" : "Lucky Number"}</div>
                <div className="result-value">{result.lucky.number}</div>
              </div>
              <div className="result-box" style={{ margin: 0, textAlign: "center" }}>
                <div className="result-label">{isHi ? "शुभ दिन" : "Lucky Day"}</div>
                <div className="result-value" style={{ fontSize: "0.9rem" }}>{result.lucky.day}</div>
              </div>
              <div className="result-box" style={{ margin: 0, textAlign: "center" }}>
                <div className="result-label">{isHi ? "मंत्र" : "Mantra"}</div>
                <div className="result-value devanagari" style={{ fontSize: "0.9rem" }}>{result.lucky.mantra}</div>
              </div>
            </div>
            <p style={{ fontSize: "0.78rem", color: "var(--muted)", textAlign: "center", marginTop: "0.5rem" }} className={isHi ? "devanagari" : undefined}>
              {isHi
                ? <>ये चारों आज के लिए <span className="hl">सहायक ऊर्जा</span> बढ़ाने के सरल, पारंपरिक उपाय हैं — निर्णय इन पर निर्भर नहीं होने चाहिए।</>
                : <>These four are simple, traditional ways to lean into <span className="hl">today's supportive energy</span> — not things your decisions should hinge on.</>}
            </p>

            {result.auspicious_hours?.length > 0 && (
              <div className="result-box" style={{ marginTop: "0.75rem", textAlign: "center" }}>
                <div className="result-label">{isHi ? "शुभ मुहूर्त (आज)" : "Auspicious Hours (today)"}</div>
                <div style={{ fontSize: "0.9rem", color: "var(--maroon-deep)", fontWeight: 600 }}>
                  {result.auspicious_hours.join(" · ")}
                </div>
                <p className={`result-explain${isHi ? " devanagari" : ""}`}>
                  {isHi
                    ? <>इन घंटों में <span className="hl">नया काम शुरू करना</span>, महत्वपूर्ण बातचीत या निर्णय लेना शुभ माना जाता है। बड़े निर्णयों (विवाह, गृह-प्रवेश) के लिए पूर्ण मुहूर्त परामर्श लें।</>
                    : <>These are windows favorable for <span className="hl">starting something new</span> — a conversation, a task, a decision. For major life events (wedding, griha-pravesh), get a proper muhurta consultation.</>}
                </p>
              </div>
            )}

            <Divider />
            <ResultCTA
              hook={{
                en: "A rashifal is for everyone born under your moon sign. Your own chart — dasha, transits, houses — tells YOUR story.",
                hi: "राशिफल आपकी राशि के सभी लोगों के लिए है। आपकी अपनी कुंडली — दशा, गोचर, भाव — आपकी कहानी कहती है।",
              }}
              waText={`Namaste Shivanii ji! I read today's ${result.rashi_en} rashifal on your website. I would like a personal reading of my own chart.`}
              reading={{ href: "/readings/birth-chart", labelEn: "Book Birth Chart Reading ₹999", labelHi: "कुंडली विश्लेषण बुक करें ₹999" }}
            />
          </PatrikaFrame>
          </div>
        )}
      </div>
    </section>
  );
}
