"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import BirthForm from "@/components/BirthForm";
import DownloadReportButton from "@/components/DownloadReportButton";
import PatrikaFrame from "@/components/PatrikaFrame";
import Link from "next/link";
import Icon from "@/components/Icon";
import KundliResultView from "@/components/KundliResultView";
import { PLANET_HI } from "@/lib/hindi-labels";
import { fetchKundli, fetchMahadashaList } from "@/lib/api/endpoints";
import type { BirthRequest, KundliFullResult, MahadashaListResult } from "@/lib/api/types";
import { ApiError } from "@/lib/api/client";
import { useBackStep } from "@/lib/useBackStep";

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
        <h1 className={`section-heading${isHi ? " devanagari" : ""}`}>{isHi ? "कुंडली / जन्म चार्ट" : "Kundli / Birth Chart"}</h1>
        <p className="section-heading-hi devanagari">{isHi ? "Kundli / Birth Chart" : "कुंडली / जन्म चार्ट"}</p>

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
        {result && !loading && lastBirth && (
          <div ref={resultRef} className="print-area" style={{ marginTop: "2rem", scrollMarginTop: "90px" }}>
            <DownloadReportButton filename="AstroShivanii-Kundli" />
            <KundliResultView
              result={result}
              mahaList={mahaList}
              lastBirth={lastBirth}
              chartMode={chartMode}
              onChartModeChange={setChartMode}
              cta={{
                locked: [
                  { en: "What your current dasha means for career & money", hi: "वर्तमान दशा का करियर-धन पर अर्थ" },
                  { en: "Your next 3 dasha periods, decade by decade", hi: "आपकी अगली 3 दशाएँ — दशक-दर-दशक" },
                  { en: "Navamsa (D9) — marriage & inner strength", hi: "नवांश (D9) — विवाह और आंतरिक बल" },
                  { en: "Yoga-by-yoga interpretation for YOUR chart", hi: "हर योग का आपकी कुंडली में फल" },
                  { en: "House-lord analysis (all 12 bhavas)", hi: "द्वादश भाव — स्वामी-विश्लेषण" },
                  { en: "Personalised remedies (honest, no fear-selling)", hi: "व्यक्तिगत उपाय (बिना डर के)" },
                ],
                hook: {
                  en: `This is the WHAT of your chart. What it means for your life — ${result.current_dasha?.mahadasha?.lord} Mahadasha and all — is a conversation.`,
                  hi: `यह आपकी कुंडली का "क्या" है। "आपके जीवन के लिए इसका अर्थ" — ${PLANET_HI[result.current_dasha?.mahadasha?.lord] ?? result.current_dasha?.mahadasha?.lord} महादशा समेत — एक व्यक्तिगत संवाद है।`,
                },
                waText: `Namaste Shivanii ji! I calculated my kundli on your website — ${result.ascendant.sign} lagna, Moon in ${result.moon_nakshatra?.name} nakshatra, currently ${result.current_dasha?.mahadasha?.lord} Mahadasha. I would like a full personal reading.`,
                reading: { href: "/readings/birth-chart", labelEn: "Book Birth Chart Reading ₹999", labelHi: "कुंडली विश्लेषण बुक करें ₹999" },
              }}
            />
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
