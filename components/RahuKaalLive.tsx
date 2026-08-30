"use client";

/**
 * Live Rahu Kaal widget for the /rahu-kaal SEO pages: today's window big and
 * bold, then the next 7 days as a table. All times computed astronomically
 * for the given city (sunrise-based, so they differ city to city — that is
 * the whole point of per-city pages).
 */
import { useEffect, useState } from "react";
import PatrikaFrame from "@/components/PatrikaFrame";
import { fetchRahuKaal } from "@/lib/api/endpoints";
import type { RahuKaalResult } from "@/lib/api/types";

interface Props {
  cityEn: string;
  cityHi: string;
  lat: number;
  lon: number;
  tz: number;
}

interface DayRow {
  date: string;
  weekdayHi: string;
  data: RahuKaalResult | null;
}

const WEEKDAY_HI = ["रविवार", "सोमवार", "मंगलवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार"];
const MONTHS_HI = ["जनवरी", "फ़रवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितम्बर", "अक्टूबर", "नवम्बर", "दिसम्बर"];

function istToday(): Date {
  // "today" must be India's today, not the visitor's browser timezone
  const s = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
  return new Date(s);
}

function iso(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function fmtHi(d: Date): string {
  return `${d.getDate()} ${MONTHS_HI[d.getMonth()]} ${d.getFullYear()}`;
}

export default function RahuKaalLive({ cityEn, cityHi, lat, lon, tz }: Props) {
  const [rows, setRows] = useState<DayRow[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const base = istToday();
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(base);
      d.setDate(d.getDate() + i);
      return d;
    });
    Promise.all(
      days.map(async (d) => {
        try {
          const data = await fetchRahuKaal(iso(d), lat, lon, tz);
          return { date: iso(d), weekdayHi: WEEKDAY_HI[d.getDay()], data };
        } catch {
          return { date: iso(d), weekdayHi: WEEKDAY_HI[d.getDay()], data: null };
        }
      }),
    ).then((r) => {
      if (r.every((row) => row.data === null)) setError(true);
      setRows(r);
    });
  }, [lat, lon, tz]);

  if (error) {
    return (
      <p className="devanagari" style={{ textAlign: "center", color: "var(--muted)" }}>
        समय लोड नहीं हो पाया — कृपया पेज दोबारा खोलें।
      </p>
    );
  }

  const today = rows?.[0];
  const todayDate = istToday();

  return (
    <div style={{ maxWidth: "640px", margin: "0 auto" }}>
      <PatrikaFrame>
        <div style={{ textAlign: "center" }}>
          <div className="result-label">
            आज का राहु काल — {cityHi} · {fmtHi(todayDate)}
          </div>
          {!rows ? (
            <p className="devanagari" style={{ color: "var(--muted)", margin: "1rem 0" }}>गणना हो रही है…</p>
          ) : today?.data ? (
            <>
              <p
                className="devanagari"
                style={{ fontSize: "1.9rem", fontWeight: 700, color: "var(--maroon)", margin: "0.6rem 0 0.2rem" }}
              >
                {today.data.rahu_kaal.start} – {today.data.rahu_kaal.end}
              </p>
              <p className="devanagari" style={{ fontSize: "0.85rem", color: "var(--muted)", margin: 0 }}>
                {today.weekdayHi} · सूर्योदय {today.data.sunrise} · सूर्यास्त {today.data.sunset}
              </p>
              <p className="devanagari" style={{ fontSize: "0.85rem", color: "var(--ink-light)", marginTop: "0.7rem" }}>
                गुलिक काल: <strong>{today.data.gulika_kaal.start}–{today.data.gulika_kaal.end}</strong> · यमगण्ड:{" "}
                <strong>{today.data.yamaganda.start}–{today.data.yamaganda.end}</strong>
              </p>
            </>
          ) : (
            <p className="devanagari" style={{ color: "var(--muted)", margin: "1rem 0" }}>आज का समय उपलब्ध नहीं।</p>
          )}
        </div>
      </PatrikaFrame>

      {rows && rows.length > 1 && (
        <div style={{ overflowX: "auto", marginTop: "1.5rem" }}>
          <table className="rk-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid var(--gold)" }}>
                <th className="devanagari" style={{ textAlign: "left", padding: "0.5rem" }}>दिनांक</th>
                <th className="devanagari" style={{ textAlign: "left", padding: "0.5rem" }}>वार</th>
                <th className="devanagari" style={{ textAlign: "left", padding: "0.5rem" }}>राहु काल</th>
                <th className="devanagari" style={{ textAlign: "left", padding: "0.5rem" }}>गुलिक काल</th>
                <th className="devanagari" style={{ textAlign: "left", padding: "0.5rem" }}>यमगण्ड</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.date} style={{ borderBottom: "1px solid rgba(201,154,58,0.25)" }}>
                  <td style={{ padding: "0.5rem", whiteSpace: "nowrap" }}>{r.date}</td>
                  <td className="devanagari" style={{ padding: "0.5rem" }}>{r.weekdayHi}</td>
                  <td style={{ padding: "0.5rem", fontWeight: 600, color: "var(--maroon)", whiteSpace: "nowrap" }}>
                    {r.data ? `${r.data.rahu_kaal.start}–${r.data.rahu_kaal.end}` : "—"}
                  </td>
                  <td style={{ padding: "0.5rem", whiteSpace: "nowrap" }}>
                    {r.data ? `${r.data.gulika_kaal.start}–${r.data.gulika_kaal.end}` : "—"}
                  </td>
                  <td style={{ padding: "0.5rem", whiteSpace: "nowrap" }}>
                    {r.data ? `${r.data.yamaganda.start}–${r.data.yamaganda.end}` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="devanagari" style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: "0.5rem", textAlign: "center" }}>
            सभी समय {cityHi} ({cityEn}) के सूर्योदय-सूर्यास्त से खगोलीय गणना द्वारा — IST।
          </p>
        </div>
      )}
    </div>
  );
}
