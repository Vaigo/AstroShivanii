"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import BirthForm from "@/components/BirthForm";
import DownloadReportButton from "@/components/DownloadReportButton";
import PatrikaFrame from "@/components/PatrikaFrame";
import Link from "next/link";
import Icon from "@/components/Icon";
import KundliResultView from "@/components/KundliResultView";
import { fetchKundli, fetchMahadashaList } from "@/lib/api/endpoints";
import { ageYearsAndStage } from "@/lib/childAge";
import type { BirthRequest, KundliFullResult, MahadashaListResult } from "@/lib/api/types";
import { ApiError } from "@/lib/api/client";
import { useBackStep } from "@/lib/useBackStep";

export default function BaalKundliTool() {
  const { t, lang } = useI18n();
  const isHi = lang === "hi";
  const [name, setName] = useState("");
  const [gender, setGender] = useState<"" | "male" | "female">("");
  const [birthDraft, setBirthDraft] = useState<BirthRequest | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<KundliFullResult | null>(null);
  const [mahaList, setMahaList] = useState<MahadashaListResult["dasha"]["mahadasha"] | null>(null);
  const [lastBirth, setLastBirth] = useState<BirthRequest | null>(null);
  const [chartMode, setChartMode] = useState<"lagna" | "moon">("lagna");
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (result) resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [result]);

  useBackStep(!!result, "baalKundliResult", () => {
    setResult(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  async function handleCalculate() {
    if (!birthDraft) return;
    setLoading(true);
    setError("");
    setResult(null);
    setChartMode("lagna");
    try {
      const [data, dashaData] = await Promise.all([
        fetchKundli(birthDraft),
        fetchMahadashaList(birthDraft).catch(() => null),
      ]);
      setResult(data);
      setMahaList(dashaData?.dasha?.mahadasha ?? null);
      setLastBirth(birthDraft);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : t("form.error"));
    } finally {
      setLoading(false);
    }
  }

  const age = lastBirth ? ageYearsAndStage(lastBirth.dob) : null;
  const isAdultDob = age?.lifeStage === "वयस्क";
  const childFirstName = name.trim();

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: "760px" }}>
        <h1 className={`section-heading${isHi ? " devanagari" : ""}`}>{isHi ? "बाल कुंडली" : "Baal Kundli"}</h1>
        <p className="section-heading-hi devanagari">{isHi ? "Baby / Child Birth Chart" : "बाल कुंडली"}</p>

        <div className="tool-explainer" style={{ textAlign: "center", marginBottom: "2rem" }}>
          {isHi ? (
            <p className="devanagari">
              अपने <span className="hl">बच्चे</span> की जन्म-कुंडली बनाएं — <span className="hl">नामकरण के लिए
              शुभ अक्षर</span>, लग्न, ग्रह-स्थिति और वर्तमान दशा देखें, बिल्कुल निःशुल्क। स्वभाव, स्वास्थ्य व
              शिक्षा की गहराई से व्याख्या नीचे व्यक्तिगत पाठन के रूप में उपलब्ध है।{" "}
              <Link href="/guides/what-is-baal-kundli" style={{ color: "var(--maroon)", fontWeight: 600 }}>
                बाल कुंडली क्या है? →
              </Link>
            </p>
          ) : (
            <p>
              Create your <span className="hl">child&apos;s</span> birth chart — see the{" "}
              <span className="hl">auspicious naming syllable</span>, ascendant, planetary positions, and
              current dasha, completely free. A deeper read on temperament, health tendencies, and
              education direction is available below as a personal reading.{" "}
              <Link href="/guides/what-is-baal-kundli" style={{ color: "var(--maroon)", fontWeight: 600 }}>
                What is a Baal Kundli? →
              </Link>
            </p>
          )}
        </div>

        {/* Form — centered */}
        <div style={{ maxWidth: "480px", margin: "0 auto" }}>
          <PatrikaFrame>
            <div className="form-2col">
              <div className="form-group">
                <label className="form-label" htmlFor="bk-name">{isHi ? "बच्चे का नाम (वैकल्पिक)" : "Child's name (optional)"}</label>
                <input
                  id="bk-name"
                  className="form-input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={60}
                  placeholder={isHi ? "नाम तय न हो तो खाली छोड़ें" : "Leave blank if not named yet"}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="bk-gender">{isHi ? "लिंग (वैकल्पिक)" : "Gender (optional)"}</label>
                <select
                  id="bk-gender"
                  className="form-select"
                  value={gender}
                  onChange={(e) => setGender(e.target.value as "" | "male" | "female")}
                >
                  <option value="">{isHi ? "— चुनें —" : "— select —"}</option>
                  <option value="female">{isHi ? "बेटी" : "Daughter"}</option>
                  <option value="male">{isHi ? "बेटा" : "Son"}</option>
                </select>
              </div>
            </div>

            <BirthForm embedded onChange={setBirthDraft} requireTime />

            <button
              type="button"
              className="btn btn-primary"
              style={{ width: "100%", marginTop: "1rem" }}
              disabled={!birthDraft || loading}
              onClick={handleCalculate}
            >
              {loading ? t("form.calculating") : t("form.calculate")}
            </button>
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
        {result && !loading && lastBirth && (
          <div ref={resultRef} className="print-area" style={{ marginTop: "2rem", scrollMarginTop: "90px" }}>
            <DownloadReportButton filename="AstroShivanii-Baal-Kundli" />
            {isAdultDob && (
              <div className="tu-teaser-box" style={{ marginBottom: "1rem" }}>
                <p className={isHi ? "devanagari" : undefined}>
                  {isHi
                    ? "यह टूल विशेष रूप से बच्चों के लिए बनाया गया है — वयस्क के लिए हमारा पूर्ण कुंडली टूल देखें।"
                    : "This tool is built specifically for children — for an adult, try our regular Kundli tool."}
                </p>
                <Link href="/tools/kundli" className="btn btn-ghost btn-sm" style={{ marginTop: "0.5rem", display: "inline-block" }}>
                  {isHi ? "पूर्ण कुंडली टूल पर जाएं →" : "Go to the full Kundli tool →"}
                </Link>
              </div>
            )}
            <KundliResultView
              result={result}
              mahaList={mahaList}
              lastBirth={lastBirth}
              chartMode={chartMode}
              onChartModeChange={setChartMode}
              childInfo={{
                name: childFirstName,
                gender,
                ageYears: age?.ageYears ?? null,
                lifeStage: age?.lifeStage ?? "वयस्क",
              }}
              cta={{
                hideTurantUttar: true,
                locked: [
                  { en: "Your child's temperament & learning style — in depth", hi: "बच्चे का स्वभाव व सीखने की शैली — विस्तार से" },
                  { en: "Health tendencies to watch (awareness, not diagnosis)", hi: "स्वास्थ्य की मूल प्रवृत्तियाँ (सावधानी हेतु, निदान नहीं)" },
                  { en: "Direction for education & natural interests", hi: "शिक्षा व प्राकृतिक रुचियों की दिशा" },
                  { en: "Next 3 dasha chapters — childhood through teenage years", hi: "अगले 3 दशा-चरण — बचपन से किशोरावस्था तक" },
                  { en: "Guidance for naming, Mundan & other samskaras", hi: "नामकरण, मुंडन व अन्य संस्कारों के लिए मार्गदर्शन" },
                  { en: "Personalised remedies — for parents, on the child's behalf", hi: "व्यक्तिगत उपाय — माता-पिता के लिए (बच्चे की ओर से)" },
                ],
                hook: {
                  en: "This is the WHAT of your child's chart. What it means — temperament, health, education — is a personal conversation.",
                  hi: "यह आपके बच्चे की कुंडली का \"क्या\" है। स्वभाव, स्वास्थ्य व शिक्षा में इसका वास्तविक अर्थ एक व्यक्तिगत संवाद है।",
                },
                waText: `Namaste Shivanii ji! I made my child${childFirstName ? ` (${childFirstName})` : ""}'s Baal Kundli on your website — ${result.ascendant.sign} lagna, Moon in ${result.moon_nakshatra?.name} nakshatra. I would like a full personal reading for my child.`,
                reading: { href: "/readings/birth-chart", labelEn: "Book Birth Chart Reading ₹999", labelHi: "कुंडली विश्लेषण बुक करें ₹999" },
              }}
            />
          </div>
        )}

        {!result && !loading && (
          <div style={{ textAlign: "center", padding: "2rem", color: "var(--muted)" }}>
            <div style={{ color: "var(--gold)", marginBottom: "0.75rem", display: "flex", justifyContent: "center" }}>
              <Icon name="leaf" size={40} strokeWidth={1.3} />
            </div>
            <p className={isHi ? "devanagari" : undefined}>
              {isHi ? "जन्म विवरण डालें — बाल कुंडली नीचे दिखेगी" : "Enter birth details — the Baal Kundli will appear below"}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
