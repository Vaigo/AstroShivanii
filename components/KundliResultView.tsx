"use client";

import { useI18n } from "@/lib/i18n";
import Link from "next/link";
import KundliChart from "@/components/KundliChart";
import PatrikaFrame from "@/components/PatrikaFrame";
import Divider from "@/components/Divider";
import ResultCTA from "@/components/ResultCTA";
import { nakshatraSlugFromName } from "@/lib/nakshatras";
import { PLANET_HI, PLANET_GLYPH, dignityHi, strengthHi, LAGNA_HI } from "@/lib/hindi-labels";
import { avakahada } from "@/lib/avakahada";
import type { BirthRequest, KundliFullResult, MahadashaListResult } from "@/lib/api/types";
import type { LifeStage } from "@/lib/childAge";

/** Classical planets only — exaltation/debilitation/combustion applies to
 *  these, not the modern outer planets. */
const ABBR_PLANETS = new Set(["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"]);

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
        {/* The ▲ marker must sit UNDER the gold "today" line (nowPct), not
            centered — centered it points at the wrong mahadasha entirely. */}
        <div className="dasha-ribbon-years" style={{ position: "relative" }}>
          <span>{periods[0].start.slice(0, 4)}</span>
          {nowPct !== null && (
            <span
              className="devanagari"
              style={{
                position: "absolute",
                left: `${Math.min(86, Math.max(10, nowPct))}%`,
                transform: "translateX(-50%)",
                color: "var(--maroon-deep)",
                fontWeight: 700,
                whiteSpace: "nowrap",
              }}
            >
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

export interface ChildInfo {
  name: string;
  gender: "male" | "female" | "";
  ageYears: number | null;
  lifeStage: LifeStage;
}

interface KundliCTAProps {
  locked?: Array<{ en: string; hi: string }>;
  hook: { en: string; hi: string };
  waText: string;
  reading: { href: string; labelEn: string; labelHi: string };
  hideTurantUttar?: boolean;
}

interface KundliResultViewProps {
  result: KundliFullResult;
  mahaList: MahadashaListResult["dasha"]["mahadasha"] | null;
  lastBirth: BirthRequest;
  chartMode: "lagna" | "moon";
  onChartModeChange: (m: "lagna" | "moon") => void;
  cta: KundliCTAProps;
  /** Present only for the Baal Kundli tool — absent here reproduces the
   *  regular Kundli tool's exact existing behavior with zero change. */
  childInfo?: ChildInfo;
}

/** Everything below the accuracy badge through Yogas — extracted out of
 *  KundliTool.tsx so the Baal Kundli tool can reuse the identical chart/
 *  dasha/avakahada/yoga rendering, adding only a नामाक्षर headline card and
 *  child-appropriate ResultCTA copy (passed in via `cta`/`childInfo`, never
 *  decided in here). KundliTool.tsx itself calls this with no `childInfo` —
 *  that path must stay pixel-for-pixel identical to before this extraction. */
export default function KundliResultView({
  result, mahaList, lastBirth, chartMode, onChartModeChange, cta, childInfo,
}: KundliResultViewProps) {
  const { lang } = useI18n();
  const isHi = lang === "hi";

  // Lifted to the top so both the (optional) नामाक्षर headline card AND the
  // existing Avakahada Chakra table read from the SAME computed value.
  const av = result.planets.Moon && result.moon_nakshatra
    ? avakahada(result.planets.Moon.sign_index, result.moon_nakshatra.index, result.moon_nakshatra.pada)
    : null;

  const childLabel = childInfo
    ? (childInfo.name.trim()
        ? `${childInfo.name.trim()} की`
        : (childInfo.gender === "male" ? "आपके बेटे की" : childInfo.gender === "female" ? "आपकी बेटी की" : "आपके बच्चे की"))
    : null;

  return (
    <PatrikaFrame>
      <div style={{ marginBottom: "1rem" }}>
        <span className="accuracy-badge accuracy-reliable">
          {isHi ? "✓ विश्वसनीय गणना" : "✓ Reliable"}
        </span>
      </div>

      {/* नामाक्षर headline — Baal Kundli only. Uses the SAME avakahada() call
          as the table further down; not a second computation. */}
      {childInfo && av && (
        <div className="result-box" style={{ marginTop: 0, background: "rgba(201,154,58,0.1)", textAlign: "center" }}>
          <div className="result-label">
            {isHi ? `नामकरण के लिए शुभ अक्षर — ${childLabel} कुंडली से` : "Auspicious Naming Syllable"}
          </div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.8rem", color: "var(--maroon-deep)", marginTop: "0.3rem" }}>
            🌸 &ldquo;{av.nameSyllable}&rdquo;
          </div>
          <p className={`result-explain${isHi ? " devanagari" : ""}`} style={{ marginTop: "0.3rem" }}>
            {isHi
              ? `परंपरा अनुसार ${childLabel} नाम इस अक्षर से रखा जा सकता है — यह ${av.nakshatraPada} से निकलता है।`
              : `By tradition, a name starting with this syllable is considered auspicious — derived from ${av.nakshatraPada}.`}
          </p>
        </div>
      )}

      {/* North Indian chart — computed from API house numbers */}
      <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
        <button
          type="button"
          className={`btn btn-sm ${chartMode === "lagna" ? "btn-secondary" : "btn-ghost"}`}
          onClick={() => onChartModeChange("lagna")}
        >
          लग्न कुंडली
        </button>
        <button
          type="button"
          className={`btn btn-sm ${chartMode === "moon" ? "btn-secondary" : "btn-ghost"}`}
          onClick={() => onChartModeChange("moon")}
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
        (व)=वक्री · ↑=उच्च · ↓=नीच · (अ)=अस्त · ★=वर्गोत्तम · ल=लग्न · अंक = राशि संख्या · astroshivanii.com
      </p>

      {/* उच्च / नीच / अस्त ग्रह — the chart's strength story at a glance */}
      {(() => {
        const names = (pred: (p: { is_exalted?: boolean; is_debilitated?: boolean; is_combust?: boolean }) => boolean | undefined) =>
          Object.entries(result.planets)
            .filter(([n, p]) => ABBR_PLANETS.has(n) && pred(p))
            .map(([n]) => (isHi ? PLANET_HI[n] ?? n : n))
            .join(", ");
        const uch = names((p) => p.is_exalted);
        const neech = names((p) => p.is_debilitated);
        const asta = names((p) => p.is_combust);
        const none = isHi ? "कोई नहीं" : "none";
        return (
          <div className="result-box" style={{ marginTop: 0 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "0.4rem", fontSize: "0.85rem" }} className={isHi ? "devanagari" : undefined}>
              <span><strong style={{ color: "#1a7a3a" }}>↑ {isHi ? "उच्च ग्रह" : "Exalted"}:</strong> {uch || none}</span>
              <span><strong style={{ color: "#8a2f24" }}>↓ {isHi ? "नीच ग्रह" : "Debilitated"}:</strong> {neech || none}</span>
              <span><strong style={{ color: "#8a6414" }}>(अ) {isHi ? "अस्त ग्रह" : "Combust"}:</strong> {asta || none}</span>
            </div>
            <p className={`result-explain${isHi ? " devanagari" : ""}`}>
              {isHi
                ? "उच्च ग्रह अपनी सर्वाधिक शक्ति में फल देता है; नीच ग्रह का फल संघर्षपूर्ण रहता है; अस्त ग्रह सूर्य के तेज़ में दबकर कमज़ोर फल देता है — विस्तृत अर्थ नीचे शब्दावली में।"
                : "An exalted planet gives its strongest results; a debilitated one struggles; a combust planet is muted by the Sun's glare — full meanings in the glossary below."}
            </p>
          </div>
        );
      })()}

      {/* Ascendant */}
      <div className="result-box" style={{ marginTop: 0 }}>
        <div className="result-label">
          {isHi ? `लग्न (उदय राशि)${childInfo ? ` — ${childLabel}` : ""}` : "Ascendant (Lagna)"}
        </div>
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

      {/* अवकहड़ा चक्र — matching essentials, computed from moon rashi + nakshatra.
          Each entry carries a one-line plain-language meaning: these Sanskrit
          terms (Varna/Vashya/Yoni/Gana/Nadi) are exactly the ones a
          first-time visitor has never seen explained anywhere — a bare
          key:value table here read as gibberish. */}
      {av && (() => {
        const entries: Array<{ term: string; value: string; hi: string; en: string }> = [
          { term: isHi ? "राशि" : "Rashi (Moon sign)", value: `${av.rashi} (स्वामी ${av.rashiLord})`,
            hi: "जन्म के समय चंद्रमा जिस राशि में था — आपके मन और भावनाओं की मूल प्रकृति यहीं से पढ़ी जाती है।",
            en: "The sign the Moon occupied at your birth — the root of your emotional nature; daily rashifal is read from this." },
          { term: isHi ? "नक्षत्र–चरण" : "Nakshatra–Pada", value: `${av.nakshatraPada} (स्वामी ${av.nakshatraLord})`,
            hi: "27 नक्षत्रों में से चंद्रमा का ठिकाना, चौथाई-भाग (चरण) तक — व्यक्तित्व की सबसे बारीक परत।",
            en: "The Moon's exact station among the 27 lunar mansions, down to its quarter (pada) — the finest layer of personality." },
          { term: isHi ? "वर्ण" : "Varna", value: av.varna,
            hi: "स्वभाव की मूल प्रवृत्ति — चिंतनशील, नेतृत्वकारी, व्यवहारकुशल या परिश्रमी। विवाह-मिलान में 1 गुण इसी से मिलता है।",
            en: "Your temperament's basic bent — contemplative, leading, enterprising, or hard-working. Worth 1 of the 36 matching points." },
          { term: isHi ? "वश्य" : "Vashya", value: av.vashya,
            hi: "किस प्रकार के स्वभाव वाले लोगों से आपकी सहज बनती है और कौन आपको सहज प्रभावित कर पाता है — मिलान में 2 गुण।",
            en: "Which temperaments you naturally get along with, and who can naturally influence you — worth 2 matching points." },
          { term: isHi ? "योनि" : "Yoni", value: av.yoni,
            hi: "आपके नक्षत्र का प्रतीक-पशु — सहज स्वभाव और निकटता की अनुकूलता इसी से आंकी जाती है। मिलान में 4 गुण।",
            en: "Your nakshatra's symbolic animal — instinctive nature and physical compatibility are judged from it. Worth 4 matching points." },
          { term: isHi ? "गण" : "Gana", value: av.gana,
            hi: "तीन जीवन-दृष्टियों में आपका स्थान: देव (सौम्य), मनुष्य (व्यावहारिक), राक्षस (तीव्र व निडर — नाम से घबराएं नहीं, यह बुरा नहीं है)। मिलान में 6 गुण।",
            en: "Your place among three life-outlooks: Deva (gentle), Manushya (practical), Rakshasa (intense & fearless — despite the name, not bad). Worth 6 matching points." },
          { term: isHi ? "नाड़ी" : "Nadi", value: av.nadi,
            hi: "शारीरिक प्रकृति की धारा (आदि/मध्य/अन्त्य) — स्वास्थ्य व संतान की अनुकूलता इसी से देखी जाती है। मिलान में सबसे भारी, पूरे 8 गुण।",
            en: "Your constitutional stream (Adi/Madhya/Antya) — health and progeny compatibility are read from it. The heaviest factor in matching: 8 full points." },
          { term: isHi ? "तत्व" : "Tatva", value: av.tatva,
            hi: "आपकी राशि का मूल तत्व — अग्नि (जोश), पृथ्वी (स्थिरता), वायु (विचार) या जल (भावना)।",
            en: "Your sign's element — Fire (drive), Earth (steadiness), Air (ideas), or Water (feeling)." },
          { term: isHi ? "नामाक्षर" : "Naming syllable", value: `"${av.nameSyllable}"`,
            hi: "परंपरा में नाम इसी अक्षर से रखा जाता है — ताकि नाम हर उच्चारण पर आपके जन्म-नक्षत्र से जुड़ा रहे।",
            en: "Tradition names a child starting with this syllable — so every utterance of the name stays tied to the birth nakshatra." },
        ];
        return (
          <div className="result-box">
            <div className="result-label" style={{ marginBottom: "0.25rem" }}>
              {isHi ? "अवकहड़ा चक्र" : "Avakahada Chakra"}
            </div>
            <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.8rem", color: "var(--ink-light)", lineHeight: 1.6, margin: "0 0 0.75rem" }}>
              {isHi
                ? "पंडित जी विवाह-मिलान और नामकरण से पहले सबसे पहले यही तालिका बनाते हैं — आपकी कुंडली का 'पहचान-पत्र', जो केवल चंद्रमा की स्थिति से बनता है।"
                : "This is the first table a traditional astrologer prepares before matching or naming — your chart's 'identity card', built entirely from the Moon's position."}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
              {entries.map((e) => (
                <div key={e.term} style={{ borderBottom: "1px solid rgba(201,154,58,0.15)", paddingBottom: "0.5rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem", flexWrap: "wrap", alignItems: "baseline" }}>
                    <span style={{ color: "var(--muted)", fontWeight: 600, fontSize: "0.82rem" }}>{e.term}</span>
                    <span className="devanagari" style={{ fontWeight: 600, fontSize: "0.88rem" }}>{e.value}</span>
                  </div>
                  <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.78rem", color: "var(--ink-light)", lineHeight: 1.55, margin: "0.2rem 0 0" }}>
                    {isHi ? e.hi : e.en}
                  </p>
                </div>
              ))}
            </div>
            <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: "0.6rem" }}>
              {isHi
                ? <>इन्हीं तत्वों से विवाह के 36 गुण मिलाए जाते हैं — <a href="/tools/matching" style={{ color: "var(--maroon)", fontWeight: 600 }}>निःशुल्क गुण मिलान</a> में आज़माएं।</>
                : <>These are the exact ingredients of the 36-point marriage match — try them in the <a href="/tools/matching" style={{ color: "var(--maroon)", fontWeight: 600 }}>free matching tool</a>.</>}
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
              <strong className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.85rem", color: "var(--maroon-deep)" }}>{isHi ? y.name_hi ?? y.name : y.name}</strong>
              <span style={{ fontSize: "0.75rem", color: "var(--muted)", marginLeft: "0.5rem" }}>
                {isHi ? strengthHi(y.strength) : y.strength}
              </span>
              <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.78rem", color: "var(--ink-light)", marginTop: "0.2rem" }}>
                {isHi ? y.description_hi ?? y.description : y.description}
              </p>
            </div>
          ))}
        </div>
      )}

      <Divider />
      <ResultCTA {...cta} />
    </PatrikaFrame>
  );
}
