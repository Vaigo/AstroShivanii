"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import PatrikaFrame from "@/components/PatrikaFrame";
import Divider from "@/components/Divider";
import ResultCTA from "@/components/ResultCTA";
import { fetchTarot } from "@/lib/api/endpoints";
import type { TarotResult } from "@/lib/api/types";
import { ApiError } from "@/lib/api/client";
import { useBackStep } from "@/lib/useBackStep";

export default function TarotTool() {
  const { t, lang } = useI18n();
  const isHi = lang === "hi";
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<TarotResult | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (result) resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [result]);

  // Back button clears the drawn spread (returning to the question) instead of leaving the page.
  useBackStep(!!result, "tarotResult", () => {
    setResult(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  async function handleDraw(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const data = await fetchTarot({ question: question || undefined, spread: "three_card" });
      setResult(data);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : t("form.error"));
    } finally {
      setLoading(false);
    }
  }

  const positions = isHi ? ["अतीत", "वर्तमान", "भविष्य"] : ["Past", "Present", "Future"];
  const positionMeaning = isHi
    ? ["जो ऊर्जा इस स्थिति को यहाँ तक लाई", "अभी आपके इर्द-गिर्द क्या सक्रिय है", "यही रुख रहा तो संभावित दिशा"]
    : ["The energy that brought this here", "What is active around you now", "The likely direction if this course holds"];
  const suitHi: Record<string, string> = {
    major: "मेजर अर्काना — जीवन के बड़े मोड़",
    wands: "वैंड्स (छड़ी) — कर्म, ऊर्जा, जुनून",
    cups: "कप्स (प्याले) — भावनाएँ, रिश्ते",
    swords: "स्वॉर्ड्स (तलवारें) — विचार, संघर्ष",
    pentacles: "पेंटाकल्स (सिक्के) — धन, काम, भौतिक जीवन",
  };
  const suitEn: Record<string, string> = {
    major: "Major Arcana — life's big turning points",
    wands: "Wands — action, energy, passion",
    cups: "Cups — emotions, relationships",
    swords: "Swords — thoughts, conflict",
    pentacles: "Pentacles — money, work, the material",
  };

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: "800px" }}>
        <h1 className="section-heading">Tarot Reading</h1>
        <p className="section-heading-hi devanagari">टैरो पाठन</p>

        <div className="tool-explainer" style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          {isHi ? (
            <p className="devanagari">
              यह <span className="hl">3-कार्ड स्प्रेड</span> — अतीत, वर्तमान, भविष्य — आपकी स्थिति की ऊर्जा को
              एक कहानी के रूप में दिखाता है। कार्ड <span className="hl">भाग्य तय नहीं करते</span>, वे इस क्षण की
              संभावनाओं की ओर इशारा करते हैं।
            </p>
          ) : (
            <p>
              This <span className="hl">3-card spread</span> — past, present, future — reads the energy of
              your situation as a story. Cards <span className="hl">don't fix your fate</span>, they point at
              the possibilities already forming around this moment.
            </p>
          )}
          <p className={`form-hint${isHi ? " devanagari" : ""}`} style={{ marginTop: "0.5rem" }}>
            {isHi
              ? "यह पाठन क्लासिक राइडर-वेट-स्मिथ डेक (1909) के 78 कार्डों से किया जाता है — यह अभी एकमात्र उपलब्ध डेक है।"
              : "This reading draws from the classic Rider-Waite-Smith deck (1909), 78 cards — the only deck currently available here."}
          </p>
        </div>

        <PatrikaFrame style={{ marginBottom: "1.5rem" }}>
          <form onSubmit={handleDraw}>
            <div className="form-group">
              <label className="form-label" htmlFor="question">
                {isHi ? "आपका प्रश्न (वैकल्पिक)" : "Your Question (optional)"}
              </label>
              <input
                id="question"
                type="text"
                className="form-input"
                placeholder={isHi ? "किस विषय में मार्गदर्शन चाहिए?" : "What do you seek guidance on?"}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                maxLength={200}
              />
              <span className="form-hint">
                {isHi
                  ? "पारंपरिक तरीके के अनुसार, कार्ड निकालते समय यह प्रश्न मन में रखें — इससे नीचे के अर्थ आपकी स्थिति से जोड़ना आसान होगा। खाली छोड़ने पर सामान्य पाठन मिलेगा।"
                  : "In classic tarot practice, holding this question in mind while the cards are drawn makes the meanings below easier to relate to your situation. Leave it blank for a general reading."}
              </span>
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: "100%" }}>
              {loading ? t("form.loading") : isHi ? "3 कार्ड निकालें" : "Draw 3 Cards"}
            </button>
          </form>
        </PatrikaFrame>

        {error && <p className="form-error">{error}</p>}

        {loading && (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <div className="spinner" />
            <p style={{ color: "var(--muted)" }}>{isHi ? "कार्ड फेंटे जा रहे हैं…" : "Shuffling the cards…"}</p>
          </div>
        )}

        {result && !loading && (
          <div ref={resultRef} style={{ scrollMarginTop: "90px" }}>
          <PatrikaFrame>
            {result.question && (
              <p style={{ fontStyle: "italic", color: "var(--muted)", marginBottom: "1rem", textAlign: "center" }}>
                "{result.question}"
              </p>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "1rem", marginBottom: "1rem" }}>
              {result.cards.map((card, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.8rem", fontWeight: 800, letterSpacing: "0.06em", color: "var(--maroon-deep)", marginBottom: "0.1rem" }}>
                    {positions[i] ?? card.position}
                  </div>
                  <div className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.62rem", color: "var(--muted)", marginBottom: "0.5rem", minHeight: "2em", lineHeight: 1.3 }}>
                    {positionMeaning[i] ?? ""}
                  </div>
                  {/* Rider-Waite scan (public domain, 1909) — reversed cards render upside-down */}
                  <img
                    src={`/tarot/${card.id}.jpg`}
                    alt={`${card.name} (${card.name_hi})${card.reversed ? " — reversed" : ""}`}
                    width={300}
                    height={519}
                    style={{
                      width: "100%",
                      height: "auto",
                      borderRadius: "5px",
                      border: "2px solid var(--gold)",
                      boxShadow: "0 6px 18px rgba(81,19,32,0.3)",
                      transform: card.reversed ? "rotate(180deg)" : undefined,
                      display: "block",
                    }}
                  />
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "0.9rem", fontWeight: 700, color: "var(--maroon-deep)", marginTop: "0.5rem" }}>
                    {card.name}
                  </div>
                  <div className="devanagari" style={{ fontSize: "0.8rem", color: "var(--ink-light)" }}>
                    {card.name_hi}
                  </div>
                  {card.reversed && (
                    <span className="devanagari" style={{ display: "inline-block", marginTop: "0.25rem", fontSize: "0.65rem", fontWeight: 700, color: "#8a2f24", border: "1px solid #c0392b", borderRadius: "10px", padding: "0.05rem 0.5rem" }}>
                      ↓ {isHi ? "उल्टा कार्ड" : "Reversed"}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Reversed cards worry people — say plainly what reversal means */}
            {result.cards.some((c) => c.reversed) && (
              <div className="kaal-box" style={{ marginBottom: "1rem" }}>
                <strong className={isHi ? "devanagari" : undefined}>{isHi ? "उल्टा कार्ड क्या होता है?" : "What does a reversed card mean?"}</strong>
                <div className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.78rem" }}>
                  {isHi
                    ? "डरने की बात नहीं — उल्टे कार्ड का अर्थ है वही ऊर्जा अवरुद्ध, विलंबित या भीतर की ओर मुड़ी हुई है। यह 'बुरा फल' नहीं, ध्यान देने का संकेत है।"
                    : "Nothing to fear — a reversed card means the same energy is blocked, delayed, or turned inward. It is a point of attention, not a 'bad omen'."}
                </div>
              </div>
            )}

            {/* Per-card interpretations (real API fields: interpretation_en / interpretation_hi) */}
            {result.cards.map((card, i) => {
              const text = isHi ? card.interpretation_hi : card.interpretation_en;
              if (!text) return null;
              return (
                <div key={`interp-${i}`} className="result-box" style={{ marginTop: "0.75rem" }}>
                  <div style={{ display: "flex", gap: "0.9rem", alignItems: "flex-start" }}>
                    <img
                      src={`/tarot/${card.id}.jpg`}
                      alt=""
                      aria-hidden="true"
                      width={54}
                      height={93}
                      style={{ width: "54px", height: "auto", borderRadius: "3px", border: "1px solid var(--gold)", flexShrink: 0, transform: card.reversed ? "rotate(180deg)" : undefined }}
                    />
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div className="result-label">
                        {positions[i] ?? card.position} — {isHi ? card.name_hi : card.name}
                        {card.reversed ? (isHi ? " (उल्टा)" : " (Reversed)") : ""}
                      </div>
                      <p className={`devanagari`} style={{ fontSize: "0.72rem", color: "var(--muted)", margin: "0.1rem 0 0.4rem" }}>
                        {isHi ? suitHi[card.suit] ?? card.suit : suitEn[card.suit] ?? card.suit}
                      </p>
                      <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.9rem", color: "var(--ink-light)", lineHeight: 1.7 }}>
                        {text}
                      </p>
                      {card.keywords && card.keywords.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem", marginTop: "0.5rem" }}>
                          {card.keywords.slice(0, 4).map((k) => (
                            <span key={k} className="trait-chip" style={{ fontSize: "0.68rem" }}>{k}</span>
                          ))}
                        </div>
                      )}
                      {(card.element || card.domain) && (
                        <p style={{ fontSize: "0.72rem", color: "var(--muted)", marginTop: "0.4rem" }}>
                          {[card.element, card.domain].filter(Boolean).join(" · ")}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {result.cards.length >= 3 && (
              <div className="result-box" style={{ marginTop: "0.75rem", background: "rgba(201,154,58,0.08)" }}>
                <div className="result-label">{isHi ? "तीनों कार्ड मिलाकर" : "Reading the Three Together"}</div>
                <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.9rem", color: "var(--ink-light)", lineHeight: 1.7 }}>
                  {isHi ? (
                    <>
                      <span className="hl">{result.cards[0].name_hi}</span> ने जो नींव रखी, वह{" "}
                      <span className="hl">{result.cards[1].name_hi}</span> में आपके वर्तमान अनुभव के रूप में
                      दिख रही है — और यह ऊर्जा <span className="hl">{result.cards[2].name_hi}</span> की दिशा में
                      बढ़ रही है, यदि आप वर्तमान का यही रुख बनाए रखें।
                    </>
                  ) : (
                    <>
                      What <span className="hl">{result.cards[0].name}</span> set in motion is now showing up
                      as your <span className="hl">{result.cards[1].name}</span> present — and if that stays on
                      its current course, it is moving toward <span className="hl">{result.cards[2].name}</span>.
                    </>
                  )}
                </p>
              </div>
            )}

            <Divider />
            <ResultCTA
              hook={{
                en: "Cards show the moment's energy. Your birth chart shows the decade's direction — and Prashna gives one precise answer to one question.",
                hi: "कार्ड क्षण की ऊर्जा दिखाते हैं। जन्म कुंडली दशक की दिशा — और प्रश्न ज्योतिष एक सवाल का सटीक उत्तर देता है।",
              }}
              waText={`Namaste Shivanii ji! I drew a tarot spread on your website${result.question ? ` about: "${result.question}"` : ""}. I would like a proper Prashna reading for my question.`}
              reading={{ href: "/readings/ask-one-question", labelEn: "Ask Shivanii Directly ₹499", labelHi: "शिवानी जी से सीधे पूछें ₹499" }}
            />
          </PatrikaFrame>
          </div>
        )}
      </div>
    </section>
  );
}
