"use client";

/**
 * Live Choghadiya widget for the /choghadiya SEO pages: today's 16 periods
 * (8 day + 8 night) computed from the city's own sunrise/sunset, with the
 * CURRENT period highlighted live and Abhijit muhurta called out.
 */
import { useEffect, useState } from "react";
import PatrikaFrame from "@/components/PatrikaFrame";
import { fetchChoghadiyaDay } from "@/lib/api/endpoints";
import type { ChoghadiyaDayResult, ChoghadiyaPeriod } from "@/lib/api/types";

interface Props {
  cityEn: string;
  cityHi: string;
  lat: number;
  lon: number;
  tz: number;
}

const NAME_HI: Record<string, string> = {
  Amrit: "अमृत", Shubh: "शुभ", Labh: "लाभ", Char: "चर",
  Kaal: "काल", Rog: "रोग", Udveg: "उद्वेग",
};
const QUALITY_HI: Record<string, string> = {
  Excellent: "सर्वश्रेष्ठ", Good: "शुभ", Neutral: "सामान्य", Bad: "अशुभ",
};
const MONTHS_HI = ["जनवरी", "फ़रवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितम्बर", "अक्टूबर", "नवम्बर", "दिसम्बर"];

function istNow(): Date {
  return new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
}

function iso(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function toMinutes(hm: string): number {
  const [h, m] = hm.split(":").map(Number);
  return h * 60 + m;
}

/** Is `now` inside a period, accounting for night periods that cross midnight? */
function isCurrent(p: ChoghadiyaPeriod, nowMin: number): boolean {
  const s = toMinutes(p.start);
  const e = toMinutes(p.end);
  if (s <= e) return nowMin >= s && nowMin < e;
  return nowMin >= s || nowMin < e; // crosses midnight
}

function qualityStyle(q: string): React.CSSProperties {
  if (q === "Excellent") return { color: "#1a7a3a", fontWeight: 700 };
  if (q === "Good") return { color: "#1a7a3a" };
  if (q === "Bad") return { color: "var(--maroon)" };
  return { color: "var(--muted)" };
}

export default function ChoghadiyaLive({ cityEn, cityHi, lat, lon, tz }: Props) {
  const [data, setData] = useState<ChoghadiyaDayResult | null>(null);
  const [error, setError] = useState(false);
  const [nowMin, setNowMin] = useState(() => { const n = istNow(); return n.getHours() * 60 + n.getMinutes(); });

  useEffect(() => {
    fetchChoghadiyaDay(iso(istNow()), lat, lon, tz).then(setData).catch(() => setError(true));
    const t = setInterval(() => { const n = istNow(); setNowMin(n.getHours() * 60 + n.getMinutes()); }, 60_000);
    return () => clearInterval(t);
  }, [lat, lon, tz]);

  if (error) {
    return (
      <p className="devanagari" style={{ textAlign: "center", color: "var(--muted)" }}>
        समय लोड नहीं हो पाया — कृपया पेज दोबारा खोलें।
      </p>
    );
  }

  const today = istNow();
  const current = data?.choghadiya.find((p) => isCurrent(p, nowMin));

  const table = (type: "day" | "night", heading: string) => (
    <div style={{ flex: "1 1 280px", minWidth: 0 }}>
      <h3 className="devanagari" style={{ fontSize: "0.95rem", color: "var(--maroon-deep)", margin: "0 0 0.4rem" }}>{heading}</h3>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
        <tbody>
          {data?.choghadiya.filter((p) => p.type === type).map((p) => {
            const cur = isCurrent(p, nowMin);
            return (
              <tr key={`${p.type}-${p.period}`} style={{
                borderBottom: "1px solid rgba(201,154,58,0.25)",
                background: cur ? "rgba(201,154,58,0.15)" : undefined,
              }}>
                <td className="devanagari" style={{ padding: "0.4rem 0.5rem", fontWeight: cur ? 700 : 500 }}>
                  {NAME_HI[p.name] ?? p.name}{cur && " ◄ अभी"}
                </td>
                <td style={{ padding: "0.4rem 0.5rem", whiteSpace: "nowrap" }}>{p.start}–{p.end}</td>
                <td className="devanagari" style={{ padding: "0.4rem 0.5rem", ...qualityStyle(p.quality) }}>
                  {QUALITY_HI[p.quality] ?? p.quality}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  return (
    <div style={{ maxWidth: "760px", margin: "0 auto" }}>
      <PatrikaFrame>
        <div style={{ textAlign: "center" }}>
          <div className="result-label">
            आज का चौघड़िया — {cityHi} · {today.getDate()} {MONTHS_HI[today.getMonth()]} {today.getFullYear()}
          </div>
          {!data ? (
            <p className="devanagari" style={{ color: "var(--muted)", margin: "1rem 0" }}>गणना हो रही है…</p>
          ) : (
            <>
              {current && (
                <p className="devanagari" style={{ fontSize: "1.5rem", fontWeight: 700, margin: "0.6rem 0 0.2rem", ...qualityStyle(current.quality) }}>
                  अभी: {NAME_HI[current.name] ?? current.name} ({QUALITY_HI[current.quality]}) · {current.start}–{current.end}
                </p>
              )}
              <p className="devanagari" style={{ fontSize: "0.85rem", color: "var(--muted)", margin: "0.2rem 0 0" }}>
                सूर्योदय {data.sunrise} · सूर्यास्त {data.sunset} · अभिजीत मुहूर्त:{" "}
                <strong style={{ color: "var(--maroon)" }}>{data.abhijit.start}–{data.abhijit.end}</strong>
              </p>
            </>
          )}
        </div>
      </PatrikaFrame>

      {data && (
        <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", marginTop: "1.5rem" }}>
          {table("day", "दिन का चौघड़िया (सूर्योदय से)")}
          {table("night", "रात का चौघड़िया (सूर्यास्त से)")}
        </div>
      )}
      {data && (
        <p className="devanagari" style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: "0.6rem", textAlign: "center" }}>
          सभी समय {cityHi} ({cityEn}) के सूर्योदय-सूर्यास्त से खगोलीय गणना द्वारा — IST। अमृत, शुभ, लाभ व चर में
          शुभ कार्य करें; काल, रोग, उद्वेग टालें।
        </p>
      )}
    </div>
  );
}
