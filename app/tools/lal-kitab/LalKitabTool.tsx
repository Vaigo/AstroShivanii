"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import BirthForm from "@/components/BirthForm";
import PatrikaFrame from "@/components/PatrikaFrame";
import Divider from "@/components/Divider";
import Icon from "@/components/Icon";
import ResultCTA from "@/components/ResultCTA";
import { PLANET_HI, PLANET_GLYPH } from "@/lib/hindi-labels";
import { fetchLalKitab } from "@/lib/api/endpoints";
import type { BirthRequest, LalKitabFullResult } from "@/lib/api/types";
import { ApiError } from "@/lib/api/client";
import { useBackStep } from "@/lib/useBackStep";

const PLANET_ORDER = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];

function orderedPlanets(chart: Record<string, { house: number }>) {
  return PLANET_ORDER.filter((p) => p in chart);
}

/** The API's "indicator" field is the ASTROLOGICAL TRIGGER (e.g. "Venus in
 *  the 5th house") — useful for a practitioner, meaningless to a first-time
 *  visitor. This maps each of the 9 classical Lal Kitab debts to what it's
 *  traditionally said to feel like or show up as in daily life, so the raw
 *  debt name isn't the only thing shown. Keyed by the API's exact `name`. */
const DEBT_MEANING: Record<string, { en: string; hi: string }> = {
  "Swa Rin (Self Debt)": {
    en: "Classically about an imbalance with your OWN self — it can show up as self-doubt, over-working to prove yourself, or difficulty simply resting without guilt.",
    hi: "यह पारंपरिक रूप से स्वयं के साथ असंतुलन का प्रतीक है — आत्म-संदेह, स्वयं को साबित करने हेतु अत्यधिक परिश्रम, या बिना अपराध-बोध के आराम न कर पाने के रूप में दिख सकता है।",
  },
  "Pitru Rin (Father's Debt)": {
    en: "Linked to your father or paternal lineage — often felt as a strained or distant relationship with your father, or a sense of unfinished duty toward the family line.",
    hi: "पिता या पितृ-पक्ष से जुड़ा — प्रायः पिता के साथ दूरी या तनाव, अथवा परिवार के प्रति अधूरे कर्तव्य के भाव के रूप में महसूस होता है।",
  },
  "Matru Rin (Mother's Debt)": {
    en: "Linked to your mother or maternal side — classically shows as guilt around not doing enough for your mother, or unmet emotional needs from childhood resurfacing later in life.",
    hi: "माता या मातृ-पक्ष से जुड़ा — पारंपरिक रूप से माता के लिए पर्याप्त न कर पाने का अपराध-बोध, या बचपन की अधूरी भावनात्मक आवश्यकताओं के बाद में उभरने के रूप में दिखता है।",
  },
  "Stri Rin (Wife's Debt)": {
    en: "About balance in how women in your life are treated — classically eases marriage and partnerships once honoured and respected consciously.",
    hi: "जीवन की स्त्रियों के साथ व्यवहार के संतुलन से जुड़ा — सचेत सम्मान व आदर देने पर वैवाहिक व साझेदारी संबंध पारंपरिक रूप से सहज होते हैं।",
  },
  "Rishtedari Rin (Relatives' Debt)": {
    en: "A debt toward the wider family circle — often shows as relatives repeatedly needing your help, or old unresolved friction among extended family.",
    hi: "विस्तृत परिवार के प्रति ऋण — प्रायः रिश्तेदारों की बार-बार सहायता आवश्यकता, या परिवार में पुराने अनसुलझे मतभेद के रूप में दिखता है।",
  },
  "Bahin-Putri Rin (Sister/Daughter's Debt)": {
    en: "Connected to sisters or daughters — classically felt as a strong pull of responsibility to protect and provide for the younger women in the family.",
    hi: "बहनों या बेटियों से जुड़ा — पारंपरिक रूप से परिवार की युवा स्त्रियों की रक्षा व भरण-पोषण की प्रबल ज़िम्मेदारी के रूप में महसूस होता है।",
  },
  "Jalim Rin (Cruelty Debt)": {
    en: "Traditionally tied to past harshness toward those with less power — softened, per Lal Kitab, through consistent kindness to workers, animals, and the vulnerable.",
    hi: "पारंपरिक रूप से कमज़ोरों के प्रति अतीत की कठोरता से जुड़ा — लाल किताब के अनुसार कामगारों, पशुओं व असहायों के प्रति निरंतर दयालुता से इसका शमन होता है।",
  },
  "Ajanma Rin (Unborn's Debt)": {
    en: "Traditionally linked to an unborn child in the family's past — addressed classically through supporting children's welfare and charitable giving.",
    hi: "पारंपरिक रूप से परिवार के अतीत में किसी अजन्मे बालक से जुड़ा — शास्त्रानुसार बाल-कल्याण व दान द्वारा इसका निवारण होता है।",
  },
  "Daiviya Rin (Divine Debt)": {
    en: "About gratitude and devotion toward the divine — classically felt as a restless, spiritually \"unsettled\" feeling until worship and selfless service become part of daily life.",
    hi: "ईश्वर के प्रति कृतज्ञता व भक्ति से जुड़ा — जब तक पूजा व निःस्वार्थ सेवा जीवन का हिस्सा नहीं बनती, तब तक एक बेचैन, आध्यात्मिक रूप से अस्थिर भाव बना रहता है।",
  },
};

export default function LalKitabTool() {
  const { t, lang } = useI18n();
  const isHi = lang === "hi";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<LalKitabFullResult | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (result) resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [result]);

  useBackStep(!!result, "lalKitabResult", () => {
    setResult(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  async function handleSubmit(birth: BirthRequest) {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const data = await fetchLalKitab(birth);
      setResult(data);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : t("form.error"));
    } finally {
      setLoading(false);
    }
  }

  const planetKeys = result ? orderedPlanets(result.chart) : [];
  const activeDebts = result ? result.debts.filter((d) => d.active) : [];
  const inactiveDebts = result ? result.debts.filter((d) => !d.active) : [];
  const predictionsByHouse = result ? [...result.predictions].sort((a, b) => a.house - b.house) : [];

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: "860px" }}>
        <h1 className={`section-heading${isHi ? " devanagari" : ""}`}>{isHi ? "लाल किताब गणना" : "Lal Kitab Calculator"}</h1>
        <p className="section-heading-hi devanagari">{isHi ? "Lal Kitab Calculator" : "लाल किताब गणना"}</p>

        <div className="tool-explainer" style={{ textAlign: "center", marginBottom: "2rem" }}>
          {isHi ? (
            <p className="devanagari">
              <span className="hl">लाल किताब</span> ग्रहों को घरों में देखने की एक व्यावहारिक, सरल-उपाय पद्धति है —
              ऋण (कर्ज), पक्का घर और तुरंत करने योग्य उपाय। आपकी कुंडली से आपके ऋण व उपाय नीचे देखें।
            </p>
          ) : (
            <p>
              <span className="hl">Lal Kitab</span> is a practical, simple-remedy system for reading planets in
              houses — debts (karz), pakka ghar, and remedies you can act on immediately. See your chart's debts
              and remedies below.
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
              <div style={{ textAlign: "center", marginBottom: "1rem" }}>
                <h2 style={{ fontSize: "1.3rem" }}>
                  {isHi ? "लग्न" : "Lagna"}: {result.lagna.sign}{" "}
                  <span className="devanagari" style={{ color: "var(--muted)", fontSize: "0.85em" }}>{result.lagna.sign_hi}</span>
                </h2>
              </div>

              {/* ── Chart ── */}
              <h3 className="num-sub-heading">{isHi ? "ग्रह स्थिति" : "Planetary Chart"}</h3>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", fontSize: "0.82rem", borderCollapse: "collapse", minWidth: "520px" }}>
                  <thead>
                    <tr style={{ textAlign: "left", borderBottom: "1px solid rgba(201,154,58,0.3)" }}>
                      <th style={{ padding: "0.4rem 0.5rem" }}>{isHi ? "ग्रह" : "Planet"}</th>
                      <th style={{ padding: "0.4rem 0.5rem" }}>{isHi ? "घर" : "House"}</th>
                      <th style={{ padding: "0.4rem 0.5rem" }}>{isHi ? "राशि" : "Sign"}</th>
                      <th style={{ padding: "0.4rem 0.5rem" }}>{isHi ? "अंश" : "Degree"}</th>
                      <th style={{ padding: "0.4rem 0.5rem" }}>{isHi ? "पक्का घर" : "Pakka Ghar"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {planetKeys.map((p) => {
                      const e = result.chart[p];
                      return (
                        <tr key={p} style={{ borderBottom: "1px solid rgba(201,154,58,0.12)" }}>
                          <td style={{ padding: "0.4rem 0.5rem", fontWeight: 600 }}>
                            <span style={{ marginRight: "0.3rem", color: "var(--gold)" }}>{PLANET_GLYPH[p] ?? ""}</span>
                            {isHi ? PLANET_HI[p] ?? p : p}
                          </td>
                          <td style={{ padding: "0.4rem 0.5rem" }}>{e.house}</td>
                          <td style={{ padding: "0.4rem 0.5rem" }}>{isHi ? e.sign_hi : e.sign}</td>
                          <td style={{ padding: "0.4rem 0.5rem", color: "var(--muted)" }}>{e.dms}{e.retrograde ? " ℞" : ""}</td>
                          <td style={{ padding: "0.4rem 0.5rem" }}>
                            {e.in_pakka_ghar
                              ? <span style={{ color: "#1a7a3a", fontWeight: 700 }}>✓</span>
                              : <span style={{ color: "var(--muted)" }}>—</span>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p className="scroll-hint">{isHi ? "← अधिक देखने के लिए स्वाइप करें →" : "← Swipe to see more →"}</p>
              <p className={`result-explain${isHi ? " devanagari" : ""}`}>
                {isHi
                  ? <><span className="hl">पक्का घर</span> का अर्थ है "स्थायी घर" — हर ग्रह के 1-2 ऐसे भाव होते हैं जहां वह घर जैसा सहज महसूस करता है और अपना पूरा, स्थिर फल देता है। ✓ का मतलब है वह ग्रह अभी उसी स्थायी घर में बैठा है — नीचे पूरी तालिका में सभी ग्रहों के लिए यह देखा जा सकता है।</>
                  : <><span className="hl">Pakka Ghar</span> means "permanent house" — each planet has 1–2 houses where it feels naturally at home and gives its full, steady results. A ✓ means that planet is currently sitting in its own permanent house — see the full table further below for every planet.</>}
              </p>

              {/* ── Debts ── */}
              <h3 className="num-sub-heading" style={{ marginTop: "1.75rem" }}>{isHi ? "ऋण (कर्ज)" : "Debts (Karz)"}</h3>
              <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.85rem", color: "var(--ink-light)", lineHeight: 1.65, margin: "0 0 0.75rem" }}>
                {isHi
                  ? "यहां 'ऋण' का मतलब पैसे का कर्ज नहीं है। लाल किताब मानती है कि कुछ अधूरी जिम्मेदारियां परिवार में पीढ़ी-दर-पीढ़ी चली आती हैं — जैसे कोई पुराना उधार जो चुकाना बाकी रह गया हो। कुंडली में ग्रहों की खास स्थिति से यह पहचाना जाता है। अच्छी बात यह है — हर ऋण का एक सीधा, आसान उपाय होता है, और उपाय पूरा करते ही ऋण चुका हुआ माना जाता है।"
                  : "Here, 'debt' doesn't mean money owed. Lal Kitab believes some unfinished responsibilities travel down a family, generation to generation — like an old loan still waiting to be repaid. Specific planet positions in your chart reveal which one. The good news — every debt has a direct, simple remedy, and once done, the debt is considered repaid."}
              </p>
              {activeDebts.length === 0 ? (
                <div className="result-box" style={{ background: "rgba(26,122,58,0.05)", borderColor: "rgba(26,122,58,0.3)" }}>
                  <span style={{ color: "#1a7a3a", fontWeight: 700 }}>✓ {isHi ? "कोई सक्रिय ऋण नहीं" : "No Active Debts"}</span>
                </div>
              ) : (
                activeDebts.map((d, i) => {
                  const meaning = DEBT_MEANING[d.name];
                  return (
                    <div key={i} className="karmic-debt-card">
                      <div className="karmic-debt-header">
                        <span className="karmic-debt-num">⚠</span>
                        <span className="karmic-debt-theme">{isHi ? d.name_hi : d.name}</span>
                      </div>
                      {meaning && (
                        <p className={`karmic-debt-meaning${isHi ? " devanagari" : ""}`}>
                          {isHi ? meaning.hi : meaning.en}
                        </p>
                      )}
                      <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.78rem", color: "var(--muted)", marginBottom: "0.6rem" }}>
                        <strong>{isHi ? "कुंडली में कारण: " : "Seen in your chart as: "}</strong>
                        {isHi ? d.indicator_hi : d.indicator}
                      </p>
                      <div className="karmic-debt-remedy">
                        <strong>{isHi ? "उपाय:" : "Remedy:"}</strong> {isHi ? d.remedy_hi : d.remedy}
                      </div>
                    </div>
                  );
                })
              )}
              {inactiveDebts.length > 0 && (
                <details style={{ marginTop: "0.5rem" }}>
                  <summary style={{ cursor: "pointer", fontSize: "0.82rem", color: "var(--muted)" }}>
                    {isHi ? `${inactiveDebts.length} निष्क्रिय ऋण देखें` : `Show ${inactiveDebts.length} inactive debts`}
                  </summary>
                  {inactiveDebts.map((d, i) => (
                    <div key={i} className="result-box" style={{ marginTop: "0.5rem", opacity: 0.7 }}>
                      <div className="result-label">{isHi ? d.name_hi : d.name}</div>
                      <p style={{ fontSize: "0.82rem", color: "var(--muted)" }}>{isHi ? d.indicator_hi : d.indicator}</p>
                    </div>
                  ))}
                </details>
              )}

              {/* ── Predictions ── */}
              {predictionsByHouse.length > 0 && (
                <>
                  <h3 className="num-sub-heading" style={{ marginTop: "1.75rem" }}>{isHi ? "भाव-अनुसार भविष्यफल" : "House-wise Predictions"}</h3>
                  {predictionsByHouse.map((p, i) => (
                    <div key={i} className="result-box">
                      <div className="result-label">
                        {isHi ? `भाव ${p.house} — ${PLANET_HI[p.planet] ?? p.planet}` : `House ${p.house} — ${p.planet}`}
                      </div>
                      <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.85rem", color: "var(--ink-light)", lineHeight: 1.6 }}>
                        {isHi ? p.prediction_hi : p.prediction}
                      </p>
                    </div>
                  ))}
                </>
              )}

              {/* ── Pakka Ghar table ── */}
              <h3 className="num-sub-heading" style={{ marginTop: "1.75rem" }}>{isHi ? "पक्का घर" : "Pakka Ghar"}</h3>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", fontSize: "0.82rem", borderCollapse: "collapse", minWidth: "480px" }}>
                  <thead>
                    <tr style={{ textAlign: "left", borderBottom: "1px solid rgba(201,154,58,0.3)" }}>
                      <th style={{ padding: "0.4rem 0.5rem" }}>{isHi ? "ग्रह" : "Planet"}</th>
                      <th style={{ padding: "0.4rem 0.5rem" }}>{isHi ? "पक्का घर" : "Pakka Ghar Houses"}</th>
                      <th style={{ padding: "0.4rem 0.5rem" }}>{isHi ? "वर्तमान भाव" : "Placed In"}</th>
                      <th style={{ padding: "0.4rem 0.5rem" }}>{isHi ? "पक्का घर में?" : "In Pakka Ghar?"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {planetKeys.map((p) => {
                      const e = result.pakka_ghar[p];
                      if (!e) return null;
                      return (
                        <tr key={p} style={{ borderBottom: "1px solid rgba(201,154,58,0.12)" }}>
                          <td style={{ padding: "0.4rem 0.5rem", fontWeight: 600 }}>{isHi ? PLANET_HI[p] ?? p : p}</td>
                          <td style={{ padding: "0.4rem 0.5rem" }}>{e.pakka_ghar.join(", ")}</td>
                          <td style={{ padding: "0.4rem 0.5rem" }}>{e.placed_in_house}</td>
                          <td style={{ padding: "0.4rem 0.5rem" }}>
                            {e.in_pakka_ghar
                              ? <span style={{ color: "#1a7a3a", fontWeight: 700 }}>✓</span>
                              : <span style={{ color: "var(--muted)" }}>✕</span>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p className="scroll-hint">{isHi ? "← अधिक देखने के लिए स्वाइप करें →" : "← Swipe to see more →"}</p>

              {/* ── Upayas ── */}
              {result.upayas.length > 0 && (
                <>
                  <h3 className="num-sub-heading" style={{ marginTop: "1.75rem" }}>{isHi ? "उपाय" : "Remedies (Upayas)"}</h3>
                  {result.upayas.map((u, i) => (
                    <div key={i} className="result-box">
                      <div className="result-label">
                        {isHi ? `${PLANET_HI[u.planet] ?? u.planet}${u.house ? ` — भाव ${u.house}` : ""}` : `${u.planet}${u.house ? ` — House ${u.house}` : ""}`}
                      </div>
                      <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.82rem", color: "var(--muted)", marginBottom: "0.4rem" }}>{isHi ? u.reason_hi : u.reason}</p>
                      <ul className={isHi ? "devanagari" : undefined} style={{ paddingLeft: "1.2rem" }}>
                        {(isHi ? u.upayas_hi : u.upayas).map((up, j) => (
                          <li key={j} style={{ fontSize: "0.85rem", color: "var(--ink-light)", marginBottom: "0.2rem" }}>{up}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </>
              )}

              <Divider />
              <ResultCTA
                locked={[
                  { en: "Which debts/remedies are strongest for you right now", hi: "अभी आपके लिए सबसे प्रभावी ऋण/उपाय कौन-से हैं" },
                  { en: "A prioritized, step-by-step remedy plan", hi: "प्राथमिकता क्रम में उपाय योजना" },
                  { en: "Cross-checked against your Vimshottari dasha timing", hi: "आपकी विंशोत्तरी दशा से मिलान" },
                ]}
                hook={{
                  en: "This shows what Lal Kitab sees in your chart — a full reading tells you which remedy to start with, and when.",
                  hi: "यह लाल किताब की दृष्टि दिखाता है — पूर्ण पाठन बताता है कि कौन-सा उपाय पहले करें, और कब।",
                }}
                waText={`Namaste Shivanii ji! I checked my Lal Kitab chart on your website — Lagna ${result.lagna.sign}, active debts: ${activeDebts.map((d) => d.name).join(", ") || "none"}. I'd like personalized remedies.`}
                reading={{ href: "/readings/lal-kitab-remedies", labelEn: "Book Lal Kitab Remedies ₹899", labelHi: "लाल किताब उपाय बुक करें ₹899" }}
              />
            </PatrikaFrame>
          </div>
        )}

        {!result && !loading && (
          <div style={{ textAlign: "center", padding: "2rem", color: "var(--muted)" }}>
            <div style={{ color: "var(--gold)", marginBottom: "0.75rem", display: "flex", justifyContent: "center" }}>
              <Icon name="book" size={40} strokeWidth={1.3} />
            </div>
            <p>{isHi ? "जन्म विवरण डालें — परिणाम नीचे दिखेगा" : "Enter your birth details — the result will appear below"}</p>
          </div>
        )}
      </div>
    </section>
  );
}
