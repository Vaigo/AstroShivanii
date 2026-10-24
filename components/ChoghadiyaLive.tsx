"use client";

/**
 * Choghadiya widget for the /choghadiya SEO pages: the day's 16 periods (8 day + 8 night) computed from the
 * city's own sunrise/sunset, with the CURRENT period highlighted live and Abhijit muhurta called out.
 *
 * The build bakes the build day's table into the static HTML (`initial`, see lib/baked.ts). The "now"
 * highlight is client-only (the clock is not known at build time, and a build-time "now" would mismatch on
 * hydration); if the page is served on a later India date than its build, today's table is fetched live.
 *
 * Between midnight and sunrise the running period belongs to YESTERDAY's night table (a night table runs
 * from sunset to the next sunrise, and each weekday has its own sequence), so that is what the "now" line
 * reads then; today's rows are not highlighted before sunrise.
 */
import { useEffect, useState } from "react";
import PatrikaFrame from "@/components/PatrikaFrame";
import { fetchChoghadiyaDay } from "@/lib/api/endpoints";
import type { ChoghadiyaDayResult, ChoghadiyaPeriod } from "@/lib/api/types";
import {
  CHOGHADIYA_NAME_HI as NAME_HI,
  CHOGHADIYA_QUALITY_HI as QUALITY_HI,
  isChoghadiyaDay,
  periodLabel,
  shubhDayPeriods,
  type ChoghadiyaBaked,
} from "@/lib/daily-data";
import { addDaysIso, fmtHi, weekdayHi } from "@/lib/hi-date";
import { useIstMinutes, useIstTodayIso } from "@/lib/useToday";

interface Props {
  cityEn: string;
  cityHi: string;
  lat: number;
  lon: number;
  tz: number;
  /** The build's answer for this city; absent when the build could not fetch it (the widget then fetches). */
  initial?: ChoghadiyaBaked | null;
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

export default function ChoghadiyaLive({ cityEn, cityHi, lat, lon, tz, initial }: Props) {
  const today = useIstTodayIso(); // undefined until hydrated
  const nowMin = useIstMinutes(); // null until hydrated
  // the baked table is today's table until India's date moves past the build day
  const baked = initial && (today === undefined || today === initial.date) ? initial : null;
  const needLive = !baked && today !== undefined;

  const [live, setLive] = useState<{ date: string; data: ChoghadiyaDayResult | null } | null>(null);

  useEffect(() => {
    if (!needLive || !today) return;
    let cancelled = false;
    fetchChoghadiyaDay(today, lat, lon, tz)
      .then((data) => {
        // a 200 with an unexpected body is the error state, never a render crash
        if (!cancelled) setLive({ date: today, data: isChoghadiyaDay(data) ? data : null });
      })
      .catch(() => {
        if (!cancelled) setLive({ date: today, data: null });
      });
    return () => {
      cancelled = true;
    };
  }, [needLive, today, lat, lon, tz]);

  const liveNow = live && live.date === today ? live : null;
  const error = !!liveNow && liveNow.data === null;
  const data = baked ? baked.data : liveNow?.data ?? null;
  const date = baked ? baked.date : liveNow?.data ? liveNow.date : null;

  // Before sunrise the running period is in yesterday's night table: fetch that one (only in those hours)
  const preDawn = !!data && nowMin !== null && nowMin < toMinutes(data.sunrise);
  const prevDate = date ? addDaysIso(date, -1) : null;
  const [prev, setPrev] = useState<{ date: string; data: ChoghadiyaDayResult | null } | null>(null);

  useEffect(() => {
    if (!preDawn || !prevDate) return;
    let cancelled = false;
    fetchChoghadiyaDay(prevDate, lat, lon, tz)
      .then((d) => {
        if (!cancelled) setPrev({ date: prevDate, data: isChoghadiyaDay(d) ? d : null });
      })
      .catch(() => {
        if (!cancelled) setPrev({ date: prevDate, data: null });
      });
    return () => {
      cancelled = true;
    };
  }, [preDawn, prevDate, lat, lon, tz]);

  if (error) {
    return (
      <p className="devanagari" style={{ textAlign: "center", color: "var(--muted)" }}>
        समय लोड नहीं हो पाया — कृपया पेज दोबारा खोलें।
      </p>
    );
  }

  const prevData = prev && prev.date === prevDate ? prev.data : null;
  let current: ChoghadiyaPeriod | undefined;
  if (data && nowMin !== null) {
    current = preDawn
      ? prevData?.choghadiya.filter((p) => p.type === "night").find((p) => isCurrent(p, nowMin))
      : data.choghadiya.find((p) => isCurrent(p, nowMin));
  }
  const wednesday = !!date && weekdayHi(date) === "बुधवार";

  const table = (type: "day" | "night", heading: string) => (
    <div style={{ flex: "1 1 280px", minWidth: 0 }}>
      <h3 className="devanagari" style={{ fontSize: "0.95rem", color: "var(--maroon-deep)", margin: "0 0 0.4rem" }}>{heading}</h3>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
        <tbody>
          {data?.choghadiya.filter((p) => p.type === type).map((p) => {
            // today's rows are highlighted only from sunrise on (see the note at the top of the file)
            const cur = nowMin !== null && !preDawn && isCurrent(p, nowMin);
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
    <div style={{ maxWidth: "760px", margin: "0 auto" }} data-baked={baked ? baked.date : undefined}>
      <PatrikaFrame>
        <div style={{ textAlign: "center" }}>
          {/* the date shown is the date the table is for (the baked day, or today once fetched) */}
          <div className="result-label">
            {`आज का चौघड़िया — ${cityHi}`}{date ? ` · ${fmtHi(date)}` : ""}
          </div>
          {!data ? (
            <p className="devanagari" style={{ color: "var(--muted)", margin: "1rem 0", minHeight: "6rem" }}>गणना हो रही है…</p>
          ) : (
            <>
              {current && (
                <p className="devanagari" style={{ fontSize: "1.5rem", fontWeight: 700, margin: "0.6rem 0 0.2rem", ...qualityStyle(current.quality) }}>
                  अभी: {NAME_HI[current.name] ?? current.name} ({QUALITY_HI[current.quality]}) · {current.start}–{current.end}
                  {preDawn && (
                    <span style={{ display: "block", fontSize: "0.8rem", fontWeight: 400, color: "var(--muted)" }}>
                      कल रात की तालिका से — आज की तालिका सूर्योदय {data.sunrise} से चलती है
                    </span>
                  )}
                </p>
              )}
              <p className="devanagari" style={{ fontSize: "0.85rem", color: "var(--muted)", margin: "0.2rem 0 0" }}>
                सूर्योदय {data.sunrise} · सूर्यास्त {data.sunset} · अभिजीत मुहूर्त:{" "}
                <strong style={{ color: "var(--maroon)" }}>{data.abhijit.start}–{data.abhijit.end}</strong>
                {wednesday && " (बुधवार को अभिजीत मान्य नहीं माना जाता)"}
              </p>
              <p className="devanagari" style={{ fontSize: "0.85rem", color: "var(--ink-light)", margin: "0.5rem 0 0" }}>
                दिन के शुभ चौघड़िया: <strong>{shubhDayPeriods(data).map(periodLabel).join(" · ") || "—"}</strong>
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
