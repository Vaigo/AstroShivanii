"use client";

/**
 * Rahu Kaal widget for the /rahu-kaal SEO pages: today's window big and bold, then the next days as a table.
 * All times are computed astronomically for the given city (sunrise-based, so they differ city to city —
 * that is the whole point of per-city pages).
 *
 * The build bakes the build day's window into the static HTML (`initial`, see lib/baked.ts), so crawlers and
 * no-JS visitors see real times. In the browser the baked window is matched against India's date: today's
 * slice is shown, and only if the page was served too long after its build is today fetched live.
 */
import { useEffect, useState } from "react";
import PatrikaFrame from "@/components/PatrikaFrame";
import { fetchRahuKaal } from "@/lib/api/endpoints";
import { isRahuKaalResult, pickRahuDays, RAHU_SHOW_DAYS, type RahuKaalBaked, type RahuKaalDay } from "@/lib/daily-data";
import { addDaysIso, fmtHi, fmtHiShort, weekdayHi } from "@/lib/hi-date";
import { useIstTodayIso } from "@/lib/useToday";

interface Props {
  cityEn: string;
  cityHi: string;
  lat: number;
  lon: number;
  tz: number;
  /** The build's answer for this city; absent when the build could not fetch it (the widget then fetches). */
  initial?: RahuKaalBaked | null;
}

export default function RahuKaalLive({ cityEn, cityHi, lat, lon, tz, initial }: Props) {
  // India's date: undefined until hydrated, so the first client render equals the static HTML
  const today = useIstTodayIso();
  const baked = initial ? pickRahuDays(initial.days, today) : null;
  const needLive = !baked && today !== undefined;

  const [live, setLive] = useState<{ base: string; rows: RahuKaalDay[] | null } | null>(null);

  useEffect(() => {
    if (!needLive || !today) return;
    let cancelled = false;
    const dates = Array.from({ length: RAHU_SHOW_DAYS }, (_, i) => addDaysIso(today, i));
    Promise.all(
      dates.map(async (date) => {
        try {
          const data = await fetchRahuKaal(date, lat, lon, tz);
          // a 200 with an unexpected body is "not available", never a render crash
          return { date, weekdayHi: weekdayHi(date), data: isRahuKaalResult(data) ? data : null };
        } catch {
          return { date, weekdayHi: weekdayHi(date), data: null };
        }
      }),
    ).then((r) => {
      if (!cancelled) setLive({ base: today, rows: r.every((row) => row.data === null) ? null : r });
    });
    return () => {
      cancelled = true;
    };
  }, [needLive, today, lat, lon, tz]);

  const liveNow = live && live.base === today ? live : null;
  const error = !!liveNow && liveNow.rows === null;
  const rows = baked ?? liveNow?.rows ?? null;

  if (error) {
    return (
      <p className="devanagari" style={{ textAlign: "center", color: "var(--muted)" }}>
        समय लोड नहीं हो पाया — कृपया पेज दोबारा खोलें।
      </p>
    );
  }

  const first = rows?.[0];

  return (
    <div style={{ maxWidth: "640px", margin: "0 auto" }} data-baked={baked?.[0]?.date}>
      <PatrikaFrame>
        <div style={{ textAlign: "center" }}>
          {/* the date shown is the date the times below are for (the baked day, or today once fetched) */}
          <div className="result-label">
            {`आज का राहु काल — ${cityHi}`}{first ? ` · ${fmtHi(first.date)}` : ""}
          </div>
          {!first ? (
            <p className="devanagari" style={{ color: "var(--muted)", margin: "1rem 0", minHeight: "7rem" }}>गणना हो रही है…</p>
          ) : first.data ? (
            <>
              <p
                className="devanagari"
                style={{ fontSize: "1.9rem", fontWeight: 700, color: "var(--maroon)", margin: "0.6rem 0 0.2rem" }}
              >
                {first.data.rahu_kaal.start} – {first.data.rahu_kaal.end}
              </p>
              <p className="devanagari" style={{ fontSize: "0.85rem", color: "var(--muted)", margin: 0 }}>
                {first.weekdayHi} · सूर्योदय {first.data.sunrise} · सूर्यास्त {first.data.sunset}
              </p>
              <p className="devanagari" style={{ fontSize: "0.85rem", color: "var(--ink-light)", marginTop: "0.7rem" }}>
                गुलिक काल: <strong>{first.data.gulika_kaal.start}–{first.data.gulika_kaal.end}</strong> · यमगण्ड:{" "}
                <strong>{first.data.yamaganda.start}–{first.data.yamaganda.end}</strong>
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
                  <td className="devanagari" style={{ padding: "0.5rem", whiteSpace: "nowrap" }}>
                    <time dateTime={r.date}>{fmtHiShort(r.date)}</time>
                  </td>
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
