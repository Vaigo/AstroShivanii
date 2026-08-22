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

/** Classical planet knowledge used to make the result readable as a story
 *  instead of three bare rows — each planet's weekday and what it governs
 *  (standard Vedic associations, nothing invented). */
const PLANET_INFO: Record<string, {
  day_en: string; day_hi: string;
  governs_en: string; governs_hi: string;
}> = {
  Sun:     { day_en: "Sunday",    day_hi: "रविवार",  governs_en: "confidence, health, recognition at work", governs_hi: "आत्मविश्वास, स्वास्थ्य, काम में पहचान" },
  Moon:    { day_en: "Monday",    day_hi: "सोमवार",  governs_en: "peace of mind, emotions, public connection", governs_hi: "मन की शांति, भावनाएं, लोगों से जुड़ाव" },
  Mars:    { day_en: "Tuesday",   day_hi: "मंगलवार", governs_en: "courage, energy, winning competitions", governs_hi: "साहस, ऊर्जा, प्रतियोगिता में जीत" },
  Mercury: { day_en: "Wednesday", day_hi: "बुधवार",  governs_en: "speech, studies, business dealings", governs_hi: "वाणी, पढ़ाई, व्यापारिक लेन-देन" },
  Jupiter: { day_en: "Thursday",  day_hi: "गुरुवार", governs_en: "wisdom, luck, wealth, blessings of elders", governs_hi: "बुद्धि, भाग्य, धन, बड़ों का आशीर्वाद" },
  Venus:   { day_en: "Friday",    day_hi: "शुक्रवार", governs_en: "love, charm, comfort, artistic success", governs_hi: "प्रेम, आकर्षण, सुख-सुविधा, कला में सफलता" },
  Saturn:  { day_en: "Saturday",  day_hi: "शनिवार",  governs_en: "discipline, patience, long-term career stability", governs_hi: "अनुशासन, धैर्य, करियर की दीर्घकालिक स्थिरता" },
  Rahu:    { day_en: "Saturday",  day_hi: "शनिवार",  governs_en: "ambition, unconventional gains, foreign connections", governs_hi: "महत्वाकांक्षा, अप्रत्याशित लाभ, विदेश-संबंध" },
  Ketu:    { day_en: "Tuesday",   day_hi: "मंगलवार", governs_en: "intuition, detachment, spiritual depth", governs_hi: "अंतर्ज्ञान, वैराग्य, आध्यात्मिक गहराई" },
};

export default function LuckyColorsTool() {
  const { t, lang } = useI18n();
  const isHi = lang === "hi";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<LuckyColorsResult | null>(null);
  // The API computes an honest accuracy flag server-side (sunrise-chart
  // fallback when tob is missing) but returns it in `meta`, which the
  // shared API client (lib/api/client.ts) discards — only `data` reaches
  // callers. We already know locally whether the visitor gave a birth time,
  // which is the exact same fact the server-side flag would report, so we
  // derive it here instead of silently dropping the promise made by
  // BirthForm's "results marked as approximate" hint.
  const [tobGiven, setTobGiven] = useState(true);
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
      setTobGiven(!!birth.tob);
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
            <p className={`form-hint${isHi ? " devanagari" : ""}`} style={{ marginTop: "-0.5rem" }}>
              {isHi
                ? "यह उपकरण आपकी लग्न (Ascendant) पर आधारित है, जो लगभग हर 2 घंटे में बदलती है — सटीक जन्म समय दिए बिना परिणाम अनुमानित (सूर्योदय-कुंडली) रहता है।"
                : "This tool is based on your Ascendant, which shifts roughly every 2 hours — without an exact birth time, the result stays an approximation (calculated from a sunrise chart)."}
            </p>
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
                <h2 style={{ fontSize: "1.3rem", marginBottom: "0.6rem" }}>{isHi ? "आपके शुभ रंग" : "Your Lucky Colors"}</h2>
                <span className={`accuracy-badge ${tobGiven ? "accuracy-reliable" : "accuracy-unreliable"}`}>
                  {tobGiven
                    ? (isHi ? "✓ विश्वसनीय — सटीक जन्म समय पर आधारित" : "✓ Reliable — based on your exact birth time")
                    : (isHi ? "⚠ अनुमानित — जन्म समय नहीं दिया गया" : "⚠ Approximate — no birth time given")}
                </span>
                {!tobGiven && (
                  <p className={`form-hint${isHi ? " devanagari" : ""}`} style={{ marginTop: "0.5rem", maxWidth: "480px", marginLeft: "auto", marginRight: "auto" }}>
                    {isHi
                      ? "बिना जन्म समय के हमने सूर्योदय-कुंडली का उपयोग किया — लग्न लगभग हर 2 घंटे में बदलती है, इसलिए आपका सटीक समय देने पर ये रंग बदल भी सकते हैं। अधिक सटीक परिणाम के लिए ऊपर जाकर समय जोड़ें।"
                      : "Without a birth time, we used a sunrise chart — since the Ascendant shifts roughly every 2 hours, these colors could change once you add your exact time. Scroll up and add it for a more precise result."}
                  </p>
                )}
              </div>

              {/* The "why" story — the chain (lagna → its lord → that
                  planet's classical colors) told in one readable paragraph,
                  so the values below read as an explanation, not a data dump. */}
              <div className="result-box">
                <div className="result-label">{isHi ? "आपके रंग ऐसे चुने गए" : "How your colors were found"}</div>
                <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.88rem", color: "var(--ink-light)", lineHeight: 1.7, margin: "0.4rem 0 0" }}>
                  {isHi ? (
                    <>आसान भाषा में समझिए। जैसे सूरज रोज़ उगता है, वैसे ही आसमान की 12 राशियां भी बारी-बारी उगती हैं। आपके जन्म की घड़ी में <strong>{SIGN_HI[result.lagna] ?? result.lagna}</strong> राशि उग रही थी — इसी को <strong>लग्न</strong> कहते हैं। हर राशि का एक मालिक ग्रह होता है — आपकी लग्न के मालिक <strong>{PLANET_HI[result.lagna_lord] ?? result.lagna_lord}</strong> हैं। इन्हें अपनी कुंडली के घर का मुखिया समझिए — इनके रंग पहनने से आपका पूरा व्यक्तित्व निखरता है। दूसरे खास ग्रह हैं <strong>{PLANET_HI[result.nakshatra_lord] ?? result.nakshatra_lord}</strong> — ये आपके मन के साथी हैं (जन्म के समय चांद जिस तारे में था, उसके मालिक)। इनके रंग मन शांत और मूड अच्छा रखते हैं।</>
                  ) : (
                    <>Here&apos;s the simple version. Just like the sun rises daily, all 12 zodiac signs take turns rising too. At the hour you were born, <strong>{result.lagna}</strong> was the one rising — that&apos;s called your <strong>Lagna</strong>. Every sign has an owner planet — yours is owned by <strong>{result.lagna_lord}</strong>. Think of it as the head of your chart&apos;s household — wearing its colors brings out your whole personality. Your second special planet is <strong>{result.nakshatra_lord}</strong> — the companion of your mind (it owns the star the Moon sat in when you were born). Its colors keep your mind calm and your mood steady.</>
                  )}
                </p>
              </div>

              {/* Shown grouped by WHICH lord each color belongs to — these
                  colors genuinely come from two different planets (Lagna
                  lord and Nakshatra lord), and showing them as one
                  undifferentiated list looked like a data error when
                  checked against either planet's classical colors alone. */}
              {([
                { src: result.auspicious_colors_by_source.lagna_lord,
                  title_hi: "व्यक्तित्व के रंग", title_en: "Your Personality Colors",
                  role_hi: "लग्न स्वामी", role_en: "Lagna lord",
                  use_hi: "बड़े मौकों के लिए — इंटरव्यू, प्रस्तुति, पहली मुलाकात, शुभ कार्य",
                  use_en: "For the big moments — interviews, presentations, first meetings, auspicious ceremonies" },
                { src: result.auspicious_colors_by_source.nakshatra_lord,
                  title_hi: "मन के रंग", title_en: "Your Mind's Colors",
                  role_hi: "नक्षत्र स्वामी", role_en: "Nakshatra lord",
                  use_hi: "रोज़मर्रा के लिए — पढ़ाई, काम का दिन, मन शांत रखने के लिए",
                  use_en: "For everyday wear — study days, workdays, keeping the mind settled" },
              ] as const).map((block) => {
                const planet = block.src.planet;
                const info = PLANET_INFO[planet];
                return (
                  <div className="result-box" key={block.title_en}>
                    <div className="result-label" style={{ marginBottom: "0.5rem" }}>
                      {isHi
                        ? `${block.title_hi} — ${block.role_hi} ${PLANET_HI[planet] ?? planet} से`
                        : `${block.title_en} — from your ${block.role_en}, ${planet}`}
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                      {block.src.colors.map((c) => (
                        <span key={c} className="trait-chip" style={{ background: "rgba(26,122,58,0.08)", borderColor: "rgba(26,122,58,0.3)" }}>
                          <ColorDot name={c} />{isHi ? colorHi(c) : c}
                        </span>
                      ))}
                    </div>
                    {info && (
                      <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.82rem", color: "var(--ink-light)", lineHeight: 1.65, margin: "0.6rem 0 0" }}>
                        {isHi
                          ? <>{PLANET_HI[planet] ?? planet} को {info.governs_hi} का ग्रह माना जाता है। {block.use_hi}। एक आसान याद रखने वाली बात — <strong>{info.day_hi}</strong> {PLANET_HI[planet] ?? planet} का अपना दिन है, उस दिन ये रंग पहनना सबसे शुभ माना जाता है।</>
                          : <>{planet} is considered the planet of {info.governs_en}. {block.use_en}. An easy rule to remember — <strong>{info.day_en}</strong> is {planet}&apos;s own day, so wearing these colors that day is considered most auspicious.</>}
                      </p>
                    )}
                  </div>
                );
              })}

              {(() => {
                // The API's inauspicious list is "colors of the Lagna lord's
                // enemy planets" — which can include the NAKSHATRA lord's own
                // colors when those two planets are classical enemies. Showing
                // the same color as both "good for your mind" and "avoid it"
                // reads as a contradiction, so a color recommended by either
                // of the visitor's OWN two planets wins and is dropped from
                // the avoid list here.
                const recommended = new Set([
                  ...result.auspicious_colors_by_source.lagna_lord.colors,
                  ...result.auspicious_colors_by_source.nakshatra_lord.colors,
                ]);
                const avoid = result.inauspicious_colors.filter((c) => !recommended.has(c));
                if (avoid.length === 0) return null;
                return (
                  <div className="result-box">
                    <div className="result-label" style={{ marginBottom: "0.5rem" }}>
                      {isHi ? "बड़े मौकों पर इनसे बचें" : "Skip These on Important Days"}
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                      {avoid.map((c) => (
                        <span key={c} className="trait-chip" style={{ background: "rgba(192,57,43,0.06)", borderColor: "rgba(192,57,43,0.25)", opacity: 0.85 }}>
                          <ColorDot name={c} />{isHi ? colorHi(c) : c}
                        </span>
                      ))}
                    </div>
                    <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.82rem", color: "var(--ink-light)", lineHeight: 1.65, margin: "0.6rem 0 0" }}>
                      {isHi
                        ? "ये रंग उन ग्रहों के हैं जो आपके लग्न स्वामी से स्वाभाविक मेल नहीं रखते। घबराने की कोई बात नहीं — इन्हें अलमारी से निकालने की ज़रूरत नहीं है। बस इंटरव्यू, परीक्षा या किसी शुभ कार्य जैसे बड़े दिन पर इनके बजाय ऊपर वाले रंग चुनें।"
                        : "These belong to planets that don't sit naturally with your Lagna lord. Nothing to worry about — no need to empty your wardrobe. Just reach for the colors above instead of these on a big day like an interview, exam, or auspicious ceremony."}
                    </p>
                  </div>
                );
              })()}

              {/* Practical cheat-sheet — the "so what do I actually DO with
                  this" answer, in concrete everyday situations. */}
              <div className="result-box">
                <div className="result-label" style={{ marginBottom: "0.5rem" }}>
                  {isHi ? "इनका उपयोग कैसे करें" : "How to Actually Use This"}
                </div>
                <ul className={isHi ? "devanagari" : undefined} style={{ paddingLeft: "1.1rem", fontSize: "0.85rem", color: "var(--ink-light)", lineHeight: 1.75, margin: 0 }}>
                  {isHi ? (
                    <>
                      <li><strong>इंटरव्यू / प्रस्तुति / शुभ कार्य:</strong> व्यक्तित्व के रंग (लग्न स्वामी वाले) पहनें — शर्ट, साड़ी, दुपट्टा या पगड़ी में।</li>
                      <li><strong>परीक्षा / पढ़ाई / मानसिक शांति:</strong> मन के रंग (नक्षत्र स्वामी वाले) चुनें — पेन, डायरी या कपड़ों में।</li>
                      <li><strong>पूरा रंग ज़रूरी नहीं:</strong> रुमाल, घड़ी का पट्टा, धागा या दुपट्टे जैसी छोटी चीज़ भी परंपरा में पर्याप्त मानी जाती है।</li>
                      <li><strong>घर में:</strong> पूजा स्थान या पढ़ाई की मेज़ पर इन रंगों का कपड़ा या सजावट रख सकते हैं।</li>
                    </>
                  ) : (
                    <>
                      <li><strong>Interview / presentation / ceremony:</strong> wear your personality colors (Lagna lord&apos;s) — in a shirt, saree, dupatta, or turban.</li>
                      <li><strong>Exams / study / mental calm:</strong> pick your mind&apos;s colors (Nakshatra lord&apos;s) — even in a pen, diary, or clothing.</li>
                      <li><strong>It needn&apos;t be head-to-toe:</strong> a handkerchief, watch strap, thread, or scarf in the color is traditionally considered enough.</li>
                      <li><strong>At home:</strong> use these colors in a cloth or décor at your puja space or study desk.</li>
                    </>
                  )}
                </ul>
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
