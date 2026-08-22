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
import { PLANET_HI } from "@/lib/hindi-labels";

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
                  {/* Plain-language "what this actually means" — shown FIRST,
                      before any technical detail, because this dosha's scary
                      reputation is exactly what a worried visitor arrives
                      with. Honest, calm framing — no fear-selling. */}
                  <div className="result-box">
                    <div className="result-label">{isHi ? "इसका असल मतलब क्या है" : "What This Actually Means"}</div>
                    <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.88rem", color: "var(--ink-light)", lineHeight: 1.7, margin: "0.4rem 0 0" }}>
                      {isHi
                        ? "सबसे पहले — घबराइए नहीं। इसका अर्थ केवल इतना है कि आपके सातों ग्रह राहु-केतु की धुरी के एक ही ओर इकट्ठे हैं। शास्त्रों में इसे ऊर्जा का एक ही दिशा में सिमट जाना माना गया है — जिससे जीवन में कुछ क्षेत्रों में मेहनत का फल देर से मिलता है, काम बनते-बनते अटकते हैं, पर रुकते नहीं। यह मृत्यु या विनाश का सूचक बिल्कुल नहीं है — यह एक बहुत आम स्थिति है, और अनगिनत सफल लोगों की कुंडली में यह मौजूद है।"
                        : "First things first — don't panic. All this means is that your seven classical planets are gathered on one side of the Rahu–Ketu axis. Classical texts read it as energy concentrated in one direction — so in some areas of life, effort pays off slower, and things stall just before completion, but they don't stop. It is absolutely not an omen of death or ruin — it's a very common pattern, present in the charts of countless successful people."}
                    </p>
                    <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.85rem", color: "var(--ink-light)", lineHeight: 1.7, margin: "0.6rem 0 0" }}>
                      {isHi
                        ? "इसका प्रभाव पूरे जीवन एक-सा नहीं रहता — यह मुख्यतः राहु या केतु की दशा-अंतर्दशा में महसूस होता है, और कई कुंडलियों में भंग योग (cancellation) होने से यह लगभग निष्क्रिय भी हो जाता है।"
                        : "Its effect isn't constant through life either — it's mainly felt during Rahu or Ketu's dasha periods, and in many charts a cancellation (Kaal Sarp Bhang) renders it nearly inactive."}
                    </p>
                  </div>
                  <div className="result-box">
                    <div className="result-label">{isHi ? "प्रकार" : "Direction"}</div>
                    <div className="result-value">
                      {kaalSarp.direction
                        ? (isHi ? DIRECTION_LABEL[kaalSarp.direction]?.hi ?? kaalSarp.direction : DIRECTION_LABEL[kaalSarp.direction]?.en ?? kaalSarp.direction)
                        : "—"}
                    </div>
                    <p className={`result-explain${isHi ? " devanagari" : ""}`}>
                      {isHi
                        ? "यह सिर्फ यह बताता है कि आपके सातों ग्रह राहु से केतु की ओर बंधे हैं या केतु से राहु की ओर — दिशा से उपाय नहीं बदलते, यह केवल आपकी कुंडली की बनावट पहचानने के लिए है।"
                        : "This just tells you which of the two nodes your seven planets are hemmed behind — Rahu leading toward Ketu, or Ketu leading toward Rahu. It doesn't change the remedies; it's simply how this pattern is identified in your chart."}
                    </p>
                  </div>
                  <div className="result-box">
                    <div className="result-label">{isHi ? "शामिल ग्रह" : "Planets Involved"}</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginTop: "0.4rem" }}>
                      {kaalSarp.planets.map((p) => (
                        <span key={p} className="trait-chip">{isHi ? PLANET_HI[p] ?? p : p}</span>
                      ))}
                    </div>
                  </div>
                  <div className="result-box">
                    <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.85rem", color: "var(--ink-light)", lineHeight: 1.6 }}>
                      {isHi ? kaalSarp.effect_hi : kaalSarp.effect_en}
                    </p>
                  </div>
                  <div className="result-box">
                    <div className="result-label" style={{ marginBottom: "0.4rem" }}>
                      {isHi ? "सामान्य शास्त्रीय उपाय" : "General Classical Remedies"}
                    </div>
                    <ul className={isHi ? "devanagari" : undefined} style={{ paddingLeft: "1.1rem", fontSize: "0.85rem", color: "var(--ink-light)", lineHeight: 1.7, margin: 0 }}>
                      {isHi ? (
                        <>
                          <li>महाशिवरात्रि या श्रावण में राहु-केतु शांति पूजा</li>
                          <li>नाग पंचमी पर नाग देवता की पूजा और दूध अर्पण</li>
                          <li>महामृत्युंजय मंत्र का नियमित जाप</li>
                          <li>त्र्यंबकेश्वर या कालहस्ती में विशेष पूजा (जहां यह परंपरा प्रचलित है)</li>
                        </>
                      ) : (
                        <>
                          <li>Rahu-Ketu shanti puja, ideally during Mahashivratri or Shravan month</li>
                          <li>Naag Panchami worship — offering milk to a Naag Devta idol/temple</li>
                          <li>Regular japa of the Maha Mrityunjaya mantra</li>
                          <li>A dedicated puja at Trimbakeshwar or Kalahasti (where this tradition is followed)</li>
                        </>
                      )}
                    </ul>
                    <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: "0.5rem" }}>
                      {isHi
                        ? "ये सामान्य, गैर-कुंडली-विशेष उपाय हैं। दोष की वास्तविक तीव्रता और सही उपाय आपकी पूर्ण कुंडली देखकर ही तय किए जा सकते हैं।"
                        : "These are general, not chart-specific. This dosha's real intensity and the right remedy for you can only be judged from your full chart."}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="result-box">
                    <div className="result-label">{isHi ? "आपकी जांच में क्या देखा गया" : "What We Checked"}</div>
                    <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.88rem", color: "var(--ink-light)", lineHeight: 1.7, margin: "0.4rem 0 0" }}>
                      {isHi
                        ? "काल सर्प दोष तभी बनता है जब सूर्य, चंद्र, मंगल, बुध, गुरु, शुक्र और शनि — सातों ग्रह — राहु-केतु की धुरी के एक ही ओर फंसे हों। आपकी कुंडली में ग्रह इस धुरी के दोनों ओर फैले हुए हैं, इसलिए यह स्थिति नहीं बनती। यदि कहीं और आपको यह दोष बताया गया है, तो यह जांच उसका सीधा उत्तर है — शर्त ही पूरी नहीं होती।"
                        : "Kaal Sarp Dosha only forms when all seven planets — Sun, Moon, Mars, Mercury, Jupiter, Venus and Saturn — are hemmed on ONE side of the Rahu–Ketu axis. In your chart, the planets are spread across both sides of that axis, so the pattern simply doesn't form. If someone elsewhere told you that you have this dosha, this check is your direct answer — the defining condition isn't met."}
                    </p>
                  </div>
                  <div className="result-box">
                    <div className="result-label">{isHi ? "राहु-केतु फिर भी मायने रखते हैं" : "Rahu & Ketu Still Matter"}</div>
                    <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.85rem", color: "var(--ink-light)", lineHeight: 1.7, margin: "0.4rem 0 0" }}>
                      {isHi
                        ? "दोष न होने का अर्थ यह नहीं कि राहु-केतु आपकी कुंडली में निष्क्रिय हैं — हर कुंडली में यह धुरी इच्छाओं (राहु) और वैराग्य (केतु) की दिशा बताती है। ये किन भावों में बैठे हैं, यही तय करता है कि जीवन का कौन-सा क्षेत्र आपको सबसे ज़्यादा खींचता है और किससे मन स्वाभाविक रूप से हटता है। यह पूर्ण कुंडली विश्लेषण का विषय है।"
                        : "Not having the dosha doesn't mean Rahu and Ketu are silent in your chart — in every chart, this axis marks the direction of your strongest cravings (Rahu) and your natural detachment (Ketu). Which houses they occupy decides which area of life pulls you hardest and which you effortlessly let go — that's a full-chart-reading conversation."}
                    </p>
                  </div>
                  <div className="result-box">
                    <div className="result-label">{isHi ? "आगे क्या जांचें" : "What to Check Next"}</div>
                    <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.85rem", color: "var(--ink-light)", lineHeight: 1.7, margin: "0.4rem 0 0" }}>
                      {isHi
                        ? <>काल सर्प तो साफ़ निकला — पर कुंडली में देखने योग्य और भी स्थितियां हैं। हमारे निःशुल्क टूल से <a href="/tools/sade-sati" style={{ color: "var(--maroon)", fontWeight: 600 }}>साढ़े साती</a> जांचें (क्या शनि की 7.5 वर्षीय अवधि चल रही है?), या <a href="/tools/matching" style={{ color: "var(--maroon)", fontWeight: 600 }}>गुण मिलान</a> में मंगल दोष देखें।</>
                        : <>Kaal Sarp came back clear — but there are other patterns worth checking. Use our free tools to check <a href="/tools/sade-sati" style={{ color: "var(--maroon)", fontWeight: 600 }}>Sade Sati</a> (is Saturn&apos;s 7.5-year period active for you?), or <a href="/tools/matching" style={{ color: "var(--maroon)", fontWeight: 600 }}>Marriage Matching</a> which includes a Mangal Dosha check.</>}
                    </p>
                  </div>
                </>
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
