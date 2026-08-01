"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import BirthForm from "@/components/BirthForm";
import PatrikaFrame from "@/components/PatrikaFrame";
import Divider from "@/components/Divider";
import Link from "next/link";
import Icon from "@/components/Icon";
import KundliChart from "@/components/KundliChart";
import ResultCTA from "@/components/ResultCTA";
import { nakshatraSlugFromName } from "@/lib/nakshatras";
import { PLANET_HI, PLANET_GLYPH, dignityHi, strengthHi, LAGNA_HI } from "@/lib/hindi-labels";
import { avakahada } from "@/lib/avakahada";
import { fetchKundli, fetchMahadashaList } from "@/lib/api/endpoints";
import type { BirthRequest, KundliFullResult, MahadashaListResult } from "@/lib/api/types";
import { ApiError } from "@/lib/api/client";
import { useBackStep } from "@/lib/useBackStep";

/** Muted, parchment-compatible hue per dasha lord — the ribbon must read as
 *  one artifact, not nine clashing blocks. */
const DASHA_COLOR: Record<string, string> = {
  Sun: "#b37023", Moon: "#7d8ca3", Mars: "#a83a2e", Mercury: "#3d8b5f",
  Jupiter: "#a8842a", Venus: "#b56583", Saturn: "#556074", Rahu: "#6b5b73", Ketu: "#84603a",
};

function DashaRibbon({ periods, isHi }: {
  periods: Array<{ lord: string; start: string; end: string }>;
  isHi: boolean;
}) {
  if (!periods.length) return null;
  const t0 = new Date(periods[0].start).getTime();
  const t1 = new Date(periods[periods.length - 1].end).getTime();
  const span = t1 - t0;
  if (span <= 0) return null;
  const now = Date.now();
  const nowPct = now > t0 && now < t1 ? ((now - t0) / span) * 100 : null;

  return (
    <div className="result-box">
      <div className="result-label" style={{ marginBottom: "0.6rem" }}>
        {isHi ? "आपकी दशा समय-रेखा (विंशोत्तरी)" : "Your Dasha Timeline (Vimshottari)"}
      </div>
      <div className="dasha-ribbon-wrap">
        <div className="dasha-ribbon">
          {periods.map((p) => {
            const w = ((new Date(p.end).getTime() - new Date(p.start).getTime()) / span) * 100;
            const isCurrent = now >= new Date(p.start).getTime() && now < new Date(p.end).getTime();
            const label = isHi ? PLANET_HI[p.lord] ?? p.lord : p.lord;
            return (
              <div
                key={`${p.lord}-${p.start}`}
                className={`dasha-seg${isCurrent ? " current" : ""}`}
                style={{ width: `${w}%`, background: DASHA_COLOR[p.lord] ?? "var(--maroon)" }}
                title={`${label}: ${p.start.slice(0, 10)} → ${p.end.slice(0, 10)}`}
              >
                {w > 7 && (
                  <>
                    <span className={isHi ? "devanagari" : undefined}>{label}</span>
                    <span style={{ fontWeight: 400, opacity: 0.9 }}>’{p.start.slice(2, 4)}–’{p.end.slice(2, 4)}</span>
                  </>
                )}
              </div>
            );
          })}
          {nowPct !== null && <div className="dasha-now" style={{ left: `${nowPct}%` }} aria-hidden="true" />}
        </div>
        <div className="dasha-ribbon-years">
          <span>{periods[0].start.slice(0, 4)}</span>
          {nowPct !== null && (
            <span className="devanagari" style={{ color: "var(--maroon-deep)", fontWeight: 700 }}>
              ▲ {isHi ? "आप यहाँ हैं" : "You are here"}
            </span>
          )}
          <span>{periods[periods.length - 1].end.slice(0, 4)}</span>
        </div>
      </div>
      <p className={`result-explain${isHi ? " devanagari" : ""}`} style={{ marginTop: "0.5rem" }}>
        {isHi
          ? "हर रंगीन खंड एक महादशा है — उस ग्रह का जीवन-अध्याय। सुनहरी रेखा आज है: देखें कि आप किस अध्याय में हैं और अगला कब शुरू होगा।"
          : "Each colored block is one Mahadasha — a life chapter ruled by that planet. The gold line is today: see which chapter you're in and when the next begins."}
      </p>
    </div>
  );
}

export default function KundliTool() {
  const { t, lang } = useI18n();
  const isHi = lang === "hi";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<KundliFullResult | null>(null);
  const [mahaList, setMahaList] = useState<MahadashaListResult["dasha"]["mahadasha"] | null>(null);
  const [lastBirth, setLastBirth] = useState<BirthRequest | null>(null);
  const [chartMode, setChartMode] = useState<"lagna" | "moon">("lagna");
  const resultRef = useRef<HTMLDivElement>(null);

  // The result always renders BELOW the form — scroll it into view when it arrives.
  useEffect(() => {
    if (result) resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [result]);

  // Back button clears the result (returning to the form) instead of leaving the page.
  useBackStep(!!result, "kundliResult", () => {
    setResult(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  async function handleSubmit(birth: BirthRequest) {
    setLoading(true);
    setError("");
    setResult(null);
    setChartMode("lagna");
    try {
      // Timeline is additive — never block the main kundli on it
      const [data, dashaData] = await Promise.all([
        fetchKundli(birth),
        fetchMahadashaList(birth).catch(() => null),
      ]);
      setResult(data);
      setMahaList(dashaData?.dasha?.mahadasha ?? null);
      setLastBirth(birth);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : t("form.error"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: "760px" }}>
        <h1 className="section-heading">Kundli / Birth Chart</h1>
        <p className="section-heading-hi devanagari">कुंडली / जन्म चार्ट</p>

        <div className="tool-explainer" style={{ textAlign: "center", marginBottom: "2rem" }}>
          {isHi ? (
            <p className="devanagari">
              आपकी <span className="hl">कुंडली</span> आपके जन्म के क्षण आकाश का एक नक्शा है। जन्म-विवरण डालें
              और देखें — आपकी <span className="hl">लग्न राशि</span> क्या है, हर <span className="hl">ग्रह</span> किस
              भाव में बैठा है, और आप इस समय जीवन की किस <span className="hl">दशा (ग्रह-काल)</span> से गुज़र रहे हैं
              — सब कुछ सटीक गणना से, बिल्कुल निःशुल्क।{" "}
              <Link href="/guides/what-is-kundli" style={{ color: "var(--maroon)", fontWeight: 600 }}>
                नए हैं? पढ़ें "कुंडली क्या है?" →
              </Link>
            </p>
          ) : (
            <p>
              Your Kundli is a map of the sky at the moment you were born. Enter your details to see
              your <span className="hl">rising sign</span>, where each <span className="hl">planet</span> sits, and
              which <span className="hl">planetary period (dasha)</span> of life you are in
              right now — all calculated precisely, free.{" "}
              <Link href="/guides/what-is-kundli" style={{ color: "var(--maroon)", fontWeight: 600 }}>
                New to this? Read &ldquo;What is a Kundli?&rdquo; →
              </Link>
            </p>
          )}
        </div>

        {/* Form — centered */}
        <div style={{ maxWidth: "480px", margin: "0 auto" }}>
          <PatrikaFrame>
            <BirthForm onSubmit={handleSubmit} loading={loading} requireTime />
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
              <div style={{ marginBottom: "1rem" }}>
                <span className="accuracy-badge accuracy-reliable">
                  {isHi ? "✓ विश्वसनीय गणना" : "✓ Reliable"}
                </span>
              </div>

              {/* North Indian chart — computed from API house numbers */}
              <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
                <button
                  type="button"
                  className={`btn btn-sm ${chartMode === "lagna" ? "btn-secondary" : "btn-ghost"}`}
                  onClick={() => setChartMode("lagna")}
                >
                  लग्न कुंडली
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${chartMode === "moon" ? "btn-secondary" : "btn-ghost"}`}
                  onClick={() => setChartMode("moon")}
                >
                  चन्द्र कुंडली
                </button>
              </div>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
                <KundliChart
                  ascSignIndex={result.ascendant.sign_index}
                  ascDegrees={result.ascendant.degrees}
                  ascDms={result.ascendant.dms}
                  planets={result.planets}
                  mode={chartMode}
                />
              </div>
              <p style={{ textAlign: "center", fontSize: "0.72rem", color: "var(--muted)", marginTop: "-0.5rem", marginBottom: "1rem" }}>
                {chartMode === "moon" ? "चन्द्र कुंडली — भाव चंद्र राशि से गिने गए · " : ""}
                (व)=वक्री · ★=वर्गोत्तम · ल=लग्न · अंक = राशि संख्या · astroshivanii.com
              </p>

              {/* Ascendant */}
              <div className="result-box" style={{ marginTop: 0 }}>
                <div className="result-label">{isHi ? "लग्न (उदय राशि)" : "Ascendant (Lagna)"}</div>
                <div className="result-value">
                  {isHi ? result.ascendant.sign_hi : result.ascendant.sign} {result.ascendant.dms}{" "}
                  <span className="devanagari" style={{ fontSize: "0.9em", color: "var(--muted)" }}>
                    {isHi ? result.ascendant.sign : result.ascendant.sign_hi}
                  </span>
                </div>
                <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.85rem", color: "var(--ink-light)", marginTop: "0.5rem" }}>
                  {isHi ? LAGNA_HI[result.ascendant.sign_index] : result.lagna_personality}
                </p>
              </div>

              {/* Moon Nakshatra */}
              <div className="result-box">
                <div className="result-label">{isHi ? "जन्म नक्षत्र (चंद्र)" : "Moon Nakshatra"}</div>
                <div className="result-value">
                  {isHi ? result.moon_nakshatra?.name_hi : result.moon_nakshatra?.name}{" "}
                  <span className="devanagari" style={{ fontSize: "0.9em", color: "var(--muted)" }}>
                    {isHi ? result.moon_nakshatra?.name : result.moon_nakshatra?.name_hi}
                  </span>{" "}
                  ({isHi ? "स्वामी" : "Lord"}: {isHi ? PLANET_HI[result.moon_nakshatra?.lord] ?? result.moon_nakshatra?.lord : result.moon_nakshatra?.lord},{" "}
                  {isHi ? "पाद" : "Pada"} {result.moon_nakshatra?.pada})
                </div>
                <p className={`result-explain${isHi ? " devanagari" : ""}`}>
                  {isHi ? (
                    <>
                      जहाँ आपकी <span className="hl">राशि</span> आपके स्वभाव की बड़ी तस्वीर बताती है, वहीं आपका{" "}
                      <span className="hl">नक्षत्र</span> उसकी बारीक बुनावट — आपकी सहज प्रवृत्तियाँ, प्रतिक्रियाएँ
                      और अवचेतन पैटर्न — दिखाता है। इसका <span className="hl">स्वामी ग्रह</span> यह तय करता है कि
                      आपकी दशा-प्रणाली किस ग्रह से आरम्भ होती है।
                    </>
                  ) : (
                    <>
                      If your <span className="hl">rashi (moon sign)</span> is the broad shape of your nature, your{" "}
                      <span className="hl">nakshatra</span> is its fine texture — your instinctive reactions and
                      the patterns that repeat without you noticing. Its <span className="hl">ruling planet</span>{" "}
                      also decides which planet your whole dasha sequence begins from.
                    </>
                  )}
                </p>
                {nakshatraSlugFromName(result.moon_nakshatra?.name ?? "") && (
                  <Link
                    href={`/nakshatra/${nakshatraSlugFromName(result.moon_nakshatra.name)}`}
                    style={{ fontSize: "0.8rem", color: "var(--maroon)", fontWeight: 600, marginTop: "0.5rem", display: "inline-block" }}
                  >
                    {isHi
                      ? `अपने ${result.moon_nakshatra.name_hi} नक्षत्र के बारे में पढ़ें →`
                      : `Read about your ${result.moon_nakshatra.name} nakshatra →`}
                  </Link>
                )}
              </div>

              {/* Current Dasha */}
              <div className="result-box">
                <div className="result-label">{isHi ? "वर्तमान दशा" : "Current Dasha"}</div>
                <div className="result-value">
                  {isHi
                    ? `${PLANET_HI[result.current_dasha?.mahadasha?.lord] ?? result.current_dasha?.mahadasha?.lord} महादशा`
                    : `${result.current_dasha?.mahadasha?.lord} Mahadasha`}
                </div>
                {result.current_dasha?.antardasha && (
                  <div style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
                    {isHi
                      ? `${PLANET_HI[result.current_dasha.antardasha.lord] ?? result.current_dasha.antardasha.lord} अंतर्दशा · ${result.current_dasha.antardasha.end?.slice(0, 10)} तक`
                      : `${result.current_dasha.antardasha.lord} Antardasha · until ${result.current_dasha.antardasha.end?.slice(0, 10)}`}
                  </div>
                )}
                <div style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: "0.25rem" }}>
                  {isHi
                    ? `महादशा ${result.current_dasha?.mahadasha?.end?.slice(0, 10)} तक`
                    : `Mahadasha until ${result.current_dasha?.mahadasha?.end?.slice(0, 10)}`}
                </div>
                <p className={`result-explain${isHi ? " devanagari" : ""}`}>
                  {isHi ? (
                    <>
                      <span className="hl">महादशा</span> आपके जीवन के एक बड़े अध्याय की दिशा तय करती है — कौन-सा
                      ग्रह अभी सबसे अधिक प्रभावी है। इसके भीतर चल रही <span className="hl">अंतर्दशा</span> उस
                      अध्याय को महीने-दर-महीने बारीक आकार देती है। दोनों ग्रह मिलकर बताते हैं कि अभी आपके लिए
                      कौन-से क्षेत्र (करियर, धन, रिश्ते, स्वास्थ्य) अधिक सक्रिय हैं।
                    </>
                  ) : (
                    <>
                      Your <span className="hl">Mahadasha</span> sets the overall direction of this chapter of
                      life — which planet is currently steering the show. The <span className="hl">Antardasha</span>{" "}
                      running inside it shapes that chapter month to month. Together they point to which areas
                      of life — career, money, relationships, health — are most active for you right now.
                    </>
                  )}
                </p>
              </div>

              {/* Dasha timeline ribbon — the current dasha in life-context */}
              {mahaList && mahaList.length > 0 && <DashaRibbon periods={mahaList} isHi={isHi} />}

              {/* Planets table */}
              {result.planets && (
                <div className="result-box">
                  <div className="result-label" style={{ marginBottom: "0.75rem" }}>
                    {isHi ? "ग्रह स्थिति" : "Planets"}
                  </div>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", fontSize: "0.8rem", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ borderBottom: "1px solid var(--gold)" }}>
                          <th style={{ textAlign: "left", padding: "0.35rem 0.5rem", color: "var(--muted)", fontWeight: 700 }}>{isHi ? "ग्रह" : "Planet"}</th>
                          <th style={{ textAlign: "left", padding: "0.35rem 0.5rem", color: "var(--muted)", fontWeight: 700 }}>{isHi ? "राशि" : "Sign"}</th>
                          <th style={{ textAlign: "left", padding: "0.35rem 0.5rem", color: "var(--muted)", fontWeight: 700 }}>{isHi ? "अंश" : "Deg"}</th>
                          <th style={{ textAlign: "left", padding: "0.35rem 0.5rem", color: "var(--muted)", fontWeight: 700 }}>{isHi ? "भाव" : "House"}</th>
                          <th style={{ textAlign: "left", padding: "0.35rem 0.5rem", color: "var(--muted)", fontWeight: 700 }}>{isHi ? "नक्षत्र–पाद" : "Nakshatra–Pada"}</th>
                          <th style={{ textAlign: "left", padding: "0.35rem 0.5rem", color: "var(--muted)", fontWeight: 700 }}>{isHi ? "स्थिति" : "Status"}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(result.planets).map(([name, p]) => {
                          const strong = p.is_exalted || p.is_own_sign || p.is_mool_trikona || p.is_vargottama;
                          let dignityText = isHi ? dignityHi(p.dignity) : (p.dignity !== "N/A" ? p.dignity : "—");
                          // A chip must SAY why it's colored — vargottama/combust aren't in the base dignity string
                          const extras: string[] = [];
                          if (p.is_vargottama) extras.push(isHi ? "वर्गोत्तम" : "Vargottama");
                          if (p.is_combust) extras.push(isHi ? "अस्त" : "Combust");
                          if (extras.length) dignityText = dignityText === "—" ? extras.join(" · ") : `${dignityText} · ${extras.join(" · ")}`;
                          return (
                          <tr key={name} style={{ borderBottom: "1px solid rgba(201,154,58,0.15)" }}>
                            <td style={{ padding: "0.35rem 0.5rem", fontWeight: 600, whiteSpace: "nowrap" }}>
                              <span aria-hidden="true" style={{ color: "var(--maroon)", marginRight: "0.3rem" }}>{PLANET_GLYPH[name] ?? ""}</span>
                              {isHi ? PLANET_HI[name] ?? name : name}{p.retrograde ? " ℞" : ""}
                            </td>
                            <td style={{ padding: "0.35rem 0.5rem" }}>{isHi ? p.sign_hi : p.sign}</td>
                            <td style={{ padding: "0.35rem 0.5rem", whiteSpace: "nowrap" }}>{p.dms}</td>
                            <td style={{ padding: "0.35rem 0.5rem" }}>{p.house}</td>
                            <td style={{ padding: "0.35rem 0.5rem", whiteSpace: "nowrap" }}>
                              {p.nakshatra ? `${isHi ? p.nakshatra.name_hi ?? p.nakshatra.name : p.nakshatra.name} – ${p.nakshatra.pada}` : "—"}
                            </td>
                            <td style={{ padding: "0.35rem 0.5rem" }}>
                              {/* Chips only for NOTABLE dignity — a chip on every neutral row is noise */}
                              {strong || p.is_debilitated || p.is_combust ? (
                                <span className={`dig-chip ${p.is_debilitated || p.is_combust ? "bad" : "good"}`}>
                                  {dignityText}
                                </span>
                              ) : (
                                <span style={{ color: "var(--muted)" }}>{dignityText}</span>
                              )}
                            </td>
                          </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Glossary — what each dignity term/symbol in the table and chart actually means */}
                  <div style={{ marginTop: "1rem", paddingTop: "0.85rem", borderTop: "1px dashed rgba(201,154,58,0.35)" }}>
                    <div style={{ fontSize: "0.78rem", color: "var(--muted)", fontWeight: 700, marginBottom: "0.5rem" }}>
                      {isHi ? "शब्दावली — इनका अर्थ" : "Glossary — what these mean"}
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: "0.55rem", fontSize: "0.78rem", color: "var(--ink-light)" }} className={isHi ? "devanagari" : undefined}>
                      <div><strong style={{ color: "var(--maroon-deep)" }}>℞ {isHi ? "वक्री (Retrograde)" : "Retrograde"}:</strong> {isHi
                        ? "ग्रह पृथ्वी से देखने पर आकाश में पीछे जाता दिखता है — इसका फल सीधा नहीं, भीतर की ओर, पुनर्विचार व देरी से जुड़ा माना जाता है।"
                        : "The planet appears to move backward as seen from Earth — its effect tends to be introspective, delayed, or asking for a second attempt rather than a straightforward result."}
                      </div>
                      <div><strong style={{ color: "var(--maroon-deep)" }}>★ {isHi ? "वर्गोत्तम (Vargottama)" : "Vargottama"}:</strong> {isHi
                        ? "ग्रह जन्म-कुंडली (D1) और नवांश (D9) — दोनों में एक ही राशि में है। यह ग्रह की शक्ति को बहुत बढ़ाता है, मानो वह अपने ही घर में स्थिर बैठा हो।"
                        : "The planet sits in the same sign in both the birth chart (D1) and the Navamsa (D9) — this significantly strengthens it, as if firmly anchored in its own house."}
                      </div>
                      <div><strong style={{ color: "var(--maroon-deep)" }}>{isHi ? "उच्च (Exalted)" : "Exalted"}:</strong> {isHi
                        ? "ग्रह उस राशि में है जहाँ उसे सर्वाधिक शक्ति और शुभता प्राप्त होती है — बहुत अच्छा फल देने वाली स्थिति।"
                        : "The planet is in the sign where it functions at its highest strength and gives its most favorable results."}
                      </div>
                      <div><strong style={{ color: "var(--maroon-deep)" }}>{isHi ? "नीच (Debilitated)" : "Debilitated"}:</strong> {isHi
                        ? "ग्रह उस राशि में है जहाँ उसकी शक्ति सबसे कम होती है — फल कमज़ोर या संघर्षपूर्ण हो सकता है, पर सही उपाय से इसे संभाला जा सकता है।"
                        : "The planet is in the sign where it functions weakest — results here can feel effortful, though remedies and awareness can ease this."}
                      </div>
                      <div><strong style={{ color: "var(--maroon-deep)" }}>{isHi ? "अस्त (Combust)" : "Combust"}:</strong> {isHi
                        ? "ग्रह सूर्य के बहुत निकट है, जिससे उसकी अपनी चमक और स्वतंत्र शक्ति सूर्य के तेज़ में दब जाती है — फल कमज़ोर या छुपा हुआ मिल सकता है।"
                        : "The planet sits too close to the Sun, so its own light and independent strength are overpowered by the Sun's glare — its results can feel muted or hidden."}
                      </div>
                      <div><strong style={{ color: "var(--maroon-deep)" }}>{isHi ? "मूल त्रिकोण / स्वराशि" : "Mool Trikona / Own Sign"}:</strong> {isHi
                        ? "ग्रह अपनी ही राशि में या उसकी एक विशेष उप-स्थिति में बैठा है — यह भी एक बलवान, आरामदायक स्थिति है, उच्च जितनी प्रबल नहीं पर स्थिर व भरोसेमंद।"
                        : "The planet is in a sign it rules, or a special sub-position within it — a strong, comfortable placement, a notch below exaltation but stable and dependable."}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* अवकहड़ा चक्र — matching essentials, computed from moon rashi + nakshatra */}
              {result.planets.Moon && result.moon_nakshatra && (() => {
                const av = avakahada(result.planets.Moon.sign_index, result.moon_nakshatra.index, result.moon_nakshatra.pada);
                if (!av) return null;
                const rows: Array<[string, string, string, string]> = [
                  ["राशि", `${av.rashi} (स्वामी ${av.rashiLord})`, "गण / Gana", av.gana],
                  ["नक्षत्र–चरण", `${av.nakshatraPada} (स्वामी ${av.nakshatraLord})`, "योनि / Yoni", av.yoni],
                  ["वर्ण / Varna", av.varna, "नाड़ी / Nadi", av.nadi],
                  ["वश्य / Vashya", av.vashya, "तत्व / Tatva", av.tatva],
                ];
                return (
                  <div className="result-box">
                    <div className="result-label" style={{ marginBottom: "0.5rem" }}>
                      {isHi ? "अवकहड़ा चक्र (मिलान के मूल तत्व)" : "Avakahada Chakra (matching essentials)"}
                    </div>
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", fontSize: "0.82rem", borderCollapse: "collapse" }}>
                        <tbody>
                          {rows.map(([k1, v1, k2, v2]) => (
                            <tr key={k1} style={{ borderBottom: "1px solid rgba(201,154,58,0.15)" }}>
                              <td style={{ padding: "0.3rem 0.5rem", color: "var(--muted)", fontWeight: 600 }}>{k1}</td>
                              <td style={{ padding: "0.3rem 0.5rem" }} className="devanagari">{v1}</td>
                              <td style={{ padding: "0.3rem 0.5rem", color: "var(--muted)", fontWeight: 600 }}>{k2}</td>
                              <td style={{ padding: "0.3rem 0.5rem" }} className="devanagari">{v2}</td>
                            </tr>
                          ))}
                          <tr>
                            <td style={{ padding: "0.3rem 0.5rem", color: "var(--muted)", fontWeight: 600 }}>नामाक्षर</td>
                            <td style={{ padding: "0.3rem 0.5rem" }} className="devanagari" colSpan={3}>
                              &ldquo;{av.nameSyllable}&rdquo; {isHi ? "— परम्परा में इसी अक्षर से नाम रखा जाता है" : "— the traditional naming syllable for this pada"}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <p style={{ fontSize: "0.72rem", color: "var(--muted)", marginTop: "0.4rem" }}>
                      {isHi
                        ? "ये तत्व विवाह-मिलान (अष्टकूट) और नामकरण में प्रयुक्त होते हैं — मिलान हमारे निःशुल्क टूल से करें।"
                        : "These values drive Ashtakoot matching and naming — try the free matching tool."}
                    </p>
                  </div>
                );
              })()}

              {/* जन्म विवरण — full transparency of what was calculated */}
              {lastBirth && (
                <div className="result-box">
                  <div className="result-label" style={{ marginBottom: "0.5rem" }}>
                    {isHi ? "जन्म विवरण (गणना-आधार)" : "Birth Details (calculation basis)"}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "0.4rem", fontSize: "0.82rem" }}>
                    <span><strong style={{ color: "var(--muted)" }}>{isHi ? "तिथि" : "Date"}:</strong> {lastBirth.dob}</span>
                    <span><strong style={{ color: "var(--muted)" }}>{isHi ? "समय" : "Time"}:</strong> {lastBirth.tob ?? (isHi ? "सूर्योदय (अनुमानित)" : "sunrise (approx.)")}</span>
                    <span><strong style={{ color: "var(--muted)" }}>{isHi ? "स्थान" : "Place"}:</strong> {lastBirth.lat.toFixed(4)}°N, {lastBirth.lon.toFixed(4)}°E</span>
                    <span><strong style={{ color: "var(--muted)" }}>{isHi ? "समय-क्षेत्र" : "Timezone"}:</strong> UTC{lastBirth.tz >= 0 ? "+" : ""}{lastBirth.tz}</span>
                    <span><strong style={{ color: "var(--muted)" }}>{isHi ? "अयनांश" : "Ayanamsa"}:</strong> {isHi ? "लाहिरी" : "Lahiri"} {result.ascendant.ayanamsa.toFixed(4)}°</span>
                  </div>
                  <p style={{ fontSize: "0.72rem", color: "var(--muted)", marginTop: "0.4rem" }}>
                    {isHi
                      ? "हम अपनी हर गणना का आधार खुलकर दिखाते हैं — यही हमारी पहचान है।"
                      : "We show exactly what every calculation was based on — that transparency is the brand."}
                  </p>
                </div>
              )}

              {/* Yogas */}
              {result.yogas && result.yogas.length > 0 && (
                <div className="result-box">
                  <div className="result-label" style={{ marginBottom: "0.5rem" }}>
                    {isHi ? `योग (${result.yogas.length})` : `Yogas Detected (${result.yogas.length})`}
                  </div>
                  <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginBottom: "0.75rem" }} className={isHi ? "devanagari" : undefined}>
                    {isHi
                      ? <><span className="hl">योग</span> दो या अधिक ग्रहों की विशेष स्थिति से बनने वाला संयोजन है — कुछ आपको बल देते हैं, कुछ सावधानी का संकेत। नीचे आपकी कुंडली में मिले योग हैं, अपनी वास्तविक शक्ति (नीचे दी गई) के साथ।</>
                      : <>A <span className="hl">yoga</span> is a special combination formed by two or more planets — some strengthen your chart, others signal a caution. Here are the ones present in your chart, with their actual strength below.</>}
                  </p>
                  {result.yogas.map((y) => (
                    <div key={y.name} style={{ marginBottom: "0.5rem", padding: "0.5rem", background: "rgba(201,154,58,0.08)", borderRadius: "2px" }}>
                      <strong style={{ fontSize: "0.85rem", color: "var(--maroon-deep)" }}>{y.name}</strong>
                      <span style={{ fontSize: "0.75rem", color: "var(--muted)", marginLeft: "0.5rem" }}>
                        {isHi ? strengthHi(y.strength) : y.strength}
                      </span>
                      <p style={{ fontSize: "0.78rem", color: "var(--ink-light)", marginTop: "0.2rem" }}>{y.description}</p>
                    </div>
                  ))}
                </div>
              )}

              <Divider />
              <ResultCTA
                locked={[
                  { en: "What your current dasha means for career & money", hi: "वर्तमान दशा का करियर-धन पर अर्थ" },
                  { en: "Your next 3 dasha periods, decade by decade", hi: "आपकी अगली 3 दशाएँ — दशक-दर-दशक" },
                  { en: "Navamsa (D9) — marriage & inner strength", hi: "नवांश (D9) — विवाह और आंतरिक बल" },
                  { en: "Yoga-by-yoga interpretation for YOUR chart", hi: "हर योग का आपकी कुंडली में फल" },
                  { en: "House-lord analysis (all 12 bhavas)", hi: "द्वादश भाव — स्वामी-विश्लेषण" },
                  { en: "Personalised remedies (honest, no fear-selling)", hi: "व्यक्तिगत उपाय (बिना डर के)" },
                ]}
                hook={{
                  en: `This is the WHAT of your chart. What it means for your life — ${result.current_dasha?.mahadasha?.lord} Mahadasha and all — is a conversation.`,
                  hi: `यह आपकी कुंडली का "क्या" है। "आपके जीवन के लिए इसका अर्थ" — ${PLANET_HI[result.current_dasha?.mahadasha?.lord] ?? result.current_dasha?.mahadasha?.lord} महादशा समेत — एक व्यक्तिगत संवाद है।`,
                }}
                waText={`Namaste Shivanii ji! I calculated my kundli on your website — ${result.ascendant.sign} lagna, Moon in ${result.moon_nakshatra?.name} nakshatra, currently ${result.current_dasha?.mahadasha?.lord} Mahadasha. I would like a full personal reading.`}
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
            <p>{isHi ? "जन्म विवरण डालें — कुंडली नीचे दिखेगी" : "Enter your birth details — your chart will appear below"}</p>
          </div>
        )}
      </div>
    </section>
  );
}
