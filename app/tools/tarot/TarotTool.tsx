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
                {isHi ? "सामान्य पाठन के लिए खाली छोड़ें" : "Leave blank for a general reading"}
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

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
              {result.cards.map((card, i) => (
                <div
                  key={i}
                  style={{
                    background: "linear-gradient(135deg, var(--maroon-deep), var(--maroon))",
                    border: "2px solid var(--gold)",
                    borderRadius: "4px",
                    padding: "1.25rem 1rem",
                    textAlign: "center",
                    color: "var(--gold-bright)",
                    position: "relative",
                  }}
                >
                  <div style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--gold-pale)", marginBottom: "0.75rem" }}>
                    {positions[i] ?? card.position}
                  </div>
                  <div style={{ fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted-light)", marginBottom: "0.4rem" }}>
                    {card.suit}
                  </div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "0.95rem", fontWeight: 700, marginBottom: "0.25rem" }}>
                    {card.name}
                    {card.reversed && <span style={{ display: "block", fontSize: "0.7rem", color: "var(--saffron-light)" }}>↓ {isHi ? "उल्टा" : "Reversed"}</span>}
                  </div>
                  <div className="devanagari" style={{ fontSize: "0.8rem", color: "var(--gold-pale)" }}>
                    {card.name_hi}
                  </div>
                  {card.keywords && (
                    <div style={{ marginTop: "0.75rem", fontSize: "0.68rem", color: "var(--muted-light)" }}>
                      {card.keywords.slice(0, 3).join(" · ")}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Per-card interpretations (real API fields: interpretation_en / interpretation_hi) */}
            {result.cards.map((card, i) => {
              const text = isHi ? card.interpretation_hi : card.interpretation_en;
              if (!text) return null;
              return (
                <div key={`interp-${i}`} className="result-box" style={{ marginTop: "0.75rem" }}>
                  <div className="result-label">
                    {positions[i] ?? card.position} — {card.name}
                    {card.reversed ? (isHi ? " (उल्टा)" : " (Reversed)") : ""}
                  </div>
                  <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.9rem", color: "var(--ink-light)", lineHeight: 1.7 }}>
                    {text}
                  </p>
                  <p style={{ fontSize: "0.72rem", color: "var(--muted)", marginTop: "0.3rem" }}>
                    {card.element} · {card.domain}
                  </p>
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
              reading={{ href: "/readings/ask-one-question", labelEn: "Ask One Question (Prashna) ₹499", labelHi: "एक प्रश्न पूछें (प्रश्न ज्योतिष) ₹499" }}
            />
          </PatrikaFrame>
          </div>
        )}
      </div>
    </section>
  );
}
