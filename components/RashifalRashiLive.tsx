"use client";

/**
 * Live daily rashifal widget for one rashi — used by the /rashifal/[rashi]
 * SEO pages. Fetches today's all-12 rashifal (the API returns all signs) and
 * renders just this rashi's stars, predictions, lucky details and hours,
 * plus this week's summary.
 */
import { useEffect, useState } from "react";
import PatrikaFrame from "@/components/PatrikaFrame";
import { fetchRashifal, fetchWeeklyRashifal } from "@/lib/api/endpoints";
import type { RashiPrediction, WeeklyRashifalResult } from "@/lib/api/types";

interface Props {
  rashiIndex: number;
  rashiEn: string; // API name, e.g. "Aries"
  rashiHi: string;
}

const MONTHS_HI = ["जनवरी", "फ़रवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितम्बर", "अक्टूबर", "नवम्बर", "दिसम्बर"];
const DOMAIN_HI: [keyof RashiPrediction["domain_stars"], string][] = [
  ["career", "करियर"], ["finance", "धन"], ["love", "प्रेम"], ["health", "स्वास्थ्य"], ["spirit", "मनोबल"],
];

function istToday(): Date {
  return new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
}

function stars(n: number): string {
  return "★".repeat(n) + "☆".repeat(Math.max(0, 5 - n));
}

export default function RashifalRashiLive({ rashiIndex, rashiEn, rashiHi }: Props) {
  const [today, setToday] = useState<RashiPrediction | null>(null);
  const [week, setWeek] = useState<WeeklyRashifalResult | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchRashifal()
      .then((r) => setToday(r.rashifal.find((x) => x.rashi_index === rashiIndex) ?? null))
      .catch(() => setError(true));
    fetchWeeklyRashifal(rashiEn).then(setWeek).catch(() => { /* weekly is a bonus */ });
  }, [rashiIndex, rashiEn]);

  if (error) {
    return (
      <p className="devanagari" style={{ textAlign: "center", color: "var(--muted)" }}>
        राशिफल लोड नहीं हो पाया — कृपया पेज दोबारा खोलें।
      </p>
    );
  }

  const d = istToday();

  return (
    <div style={{ maxWidth: "680px", margin: "0 auto" }}>
      <PatrikaFrame>
        <div style={{ textAlign: "center" }}>
          <div className="result-label">
            आज का {rashiHi} राशिफल · {d.getDate()} {MONTHS_HI[d.getMonth()]} {d.getFullYear()}
          </div>
          {!today ? (
            <p className="devanagari" style={{ color: "var(--muted)", margin: "1rem 0" }}>गणना हो रही है…</p>
          ) : (
            <>
              <p style={{ fontSize: "1.6rem", color: "var(--gold-bright)", margin: "0.5rem 0 0.1rem", letterSpacing: "0.15em" }}>
                {stars(today.overall_stars)}
              </p>
              <p className="devanagari" style={{ fontSize: "0.95rem", color: "var(--ink-light)", lineHeight: 1.75, margin: "0.6rem 0 0" }}>
                {today.predictions_hi.overall}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem 1.2rem", justifyContent: "center", margin: "1rem 0 0" }}>
                {DOMAIN_HI.map(([k, label]) => (
                  <span key={k} className="devanagari" style={{ fontSize: "0.85rem" }}>
                    {label}: <span style={{ color: "var(--gold-bright)" }}>{stars(today.domain_stars[k])}</span>
                  </span>
                ))}
              </div>
              <p className="devanagari" style={{ fontSize: "0.85rem", color: "var(--ink-light)", marginTop: "0.9rem" }}>
                शुभ अंक: <strong>{today.lucky.number}</strong> · शुभ रंग: <strong>{today.lucky.colors.join(", ")}</strong> ·
                शुभ समय: <strong>{today.auspicious_hours.slice(0, 2).join(" · ")}</strong>
              </p>
              <p className="devanagari" style={{ fontSize: "0.85rem", color: "var(--maroon)", marginTop: "0.4rem" }}>
                मंत्र: {today.lucky.mantra}
              </p>
            </>
          )}
        </div>
      </PatrikaFrame>

      {today && (
        <div className="result-box" style={{ marginTop: "1.2rem" }}>
          <div className="result-label">क्षेत्रवार — आज</div>
          <ul className="devanagari" style={{ paddingLeft: "1.1rem", fontSize: "0.88rem", lineHeight: 1.8, margin: "0.4rem 0 0" }}>
            <li><strong>करियर:</strong> {today.predictions_hi.career}</li>
            <li><strong>धन:</strong> {today.predictions_hi.finance}</li>
            <li><strong>प्रेम:</strong> {today.predictions_hi.love}</li>
            <li><strong>स्वास्थ्य:</strong> {today.predictions_hi.health}</li>
          </ul>
        </div>
      )}

      {week && (
        <div className="result-box" style={{ marginTop: "1.2rem" }}>
          <div className="result-label">इस सप्ताह ({week.week_start} — {week.week_end})</div>
          <p className="devanagari" style={{ fontSize: "0.88rem", color: "var(--ink-light)", lineHeight: 1.75, margin: "0.4rem 0 0" }}>
            {week.summary_hi}
          </p>
          {week.best_day && (
            <p className="devanagari" style={{ fontSize: "0.85rem", color: "var(--maroon)", marginTop: "0.4rem" }}>
              सप्ताह का सबसे अच्छा दिन: <strong>{week.best_day}</strong>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
