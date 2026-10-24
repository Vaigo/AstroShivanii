"use client";

/**
 * Daily rashifal widget for one rashi — used by the /rashifal/[rashi] SEO pages. The five areas of life
 * (career, money, love, health, spirit) each show their own stars, the good/bad word for those stars and their
 * own line of text; there is no combined "overall" star, sentence or weekly average (see lib/daily-data.ts).
 * Below that, the week's stars day by day, area by area.
 *
 * The build bakes the build day's rashifal into the static HTML (`initial`, see lib/baked.ts). In the browser
 * it stays on screen while it is still today's (India's date); if the page is served on a later day, today's
 * all-12 rashifal is fetched live (the API returns every sign; this widget picks its own).
 */
import { useEffect, useState } from "react";
import PatrikaFrame from "@/components/PatrikaFrame";
import { fetchRashifal, fetchWeeklyRashifal } from "@/lib/api/endpoints";
import type { RashiPrediction, WeeklyRashifalResult } from "@/lib/api/types";
import {
  DOMAINS_HI,
  colorsHi,
  isRashifalDay,
  isWeeklyRashifal,
  starLabelHi,
  starTone,
  stars,
  type RashifalBaked,
} from "@/lib/daily-data";
import { fmtHi, fmtHiShort, weekdayHi } from "@/lib/hi-date";
import { useIstTodayIso } from "@/lib/useToday";

interface Props {
  rashiIndex: number;
  rashiEn: string; // API name, e.g. "Aries"
  rashiHi: string;
  /** The build's answer for this rashi; absent when the build could not fetch it (the widget then fetches). */
  initial?: RashifalBaked | null;
}

export default function RashifalRashiLive({ rashiIndex, rashiEn, rashiHi, initial }: Props) {
  const today = useIstTodayIso(); // undefined until hydrated, so the first client render equals the static HTML
  const baked = initial && (today === undefined || today === initial.date) ? initial : null;
  const needLive = !baked && today !== undefined;

  const [liveToday, setLiveToday] = useState<{ date: string; value: RashiPrediction | null } | null>(null);
  const [liveWeek, setLiveWeek] = useState<{ date: string; value: WeeklyRashifalResult } | null>(null);

  useEffect(() => {
    if (!needLive || !today) return;
    let cancelled = false;
    fetchRashifal(today)
      .then((r) => {
        // a 200 with an unexpected body is the error state, never a render crash
        const mine = isRashifalDay(r) ? r.rashifal.find((x) => x.rashi_index === rashiIndex) : undefined;
        if (!cancelled) setLiveToday({ date: today, value: mine ?? null });
      })
      .catch(() => {
        if (!cancelled) setLiveToday({ date: today, value: null });
      });
    fetchWeeklyRashifal(rashiEn, today)
      .then((w) => {
        if (!cancelled && isWeeklyRashifal(w)) setLiveWeek({ date: today, value: w });
      })
      .catch(() => { /* the week is a bonus */ });
    return () => {
      cancelled = true;
    };
  }, [needLive, today, rashiIndex, rashiEn]);

  // The week is a bonus the build only warns about: if it is missing from the baked answer, fetch it once here
  const bakedDate = baked ? baked.date : null;
  const needWeek = !!baked && !baked.week;
  useEffect(() => {
    if (!needWeek || !bakedDate) return;
    let cancelled = false;
    fetchWeeklyRashifal(rashiEn, bakedDate)
      .then((w) => {
        if (!cancelled && isWeeklyRashifal(w)) setLiveWeek({ date: bakedDate, value: w });
      })
      .catch(() => { /* the week is a bonus */ });
    return () => {
      cancelled = true;
    };
  }, [needWeek, bakedDate, rashiEn]);

  const lt = liveToday && liveToday.date === today ? liveToday : null;
  const error = !!lt && lt.value === null;
  const day = baked ? baked.today : lt?.value ?? null;
  const date = baked ? baked.date : lt?.value ? lt.date : null;
  const liveWeekNow = liveWeek && liveWeek.date === (baked ? baked.date : today) ? liveWeek.value : null;
  const week = baked ? baked.week ?? liveWeekNow : liveWeekNow;

  if (error) {
    return (
      <p className="devanagari" style={{ textAlign: "center", color: "var(--muted)" }}>
        राशिफल लोड नहीं हो पाया — कृपया पेज दोबारा खोलें।
      </p>
    );
  }

  return (
    <div style={{ maxWidth: "680px", margin: "0 auto" }} data-baked={baked ? baked.date : undefined}>
      <PatrikaFrame>
        <div style={{ textAlign: "center" }}>
          {/* the date shown is the date the rashifal is for (the baked day, or today once fetched) */}
          <div className="result-label">
            {`आज का ${rashiHi} राशिफल`}{date ? ` · ${fmtHi(date)}` : ""}
          </div>
          {!day ? (
            <p className="devanagari" style={{ color: "var(--muted)", margin: "1rem 0", minHeight: "12rem" }}>गणना हो रही है…</p>
          ) : (
            <>
              <div style={{ textAlign: "left", marginTop: "0.8rem" }}>
                {DOMAINS_HI.map(([k, label]) => {
                  const n = day.domain_stars[k];
                  const text = day.predictions_hi[k];
                  return (
                    <div key={k} style={{ padding: "0.55rem 0", borderBottom: "1px solid rgba(201,154,58,0.25)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "0.5rem", flexWrap: "wrap" }}>
                        <strong className="devanagari">{label}</strong>
                        <span>
                          <span role="img" aria-label={`5 में से ${n} सितारे`} style={{ color: "var(--gold-bright)", letterSpacing: "0.12em" }}>
                            {stars(n)}
                          </span>{" "}
                          <span className="devanagari" style={{ fontWeight: 700, fontSize: "0.9rem", color: starTone(n) }}>{starLabelHi(n)}</span>
                        </span>
                      </div>
                      {text && (
                        <p className="devanagari" style={{ fontSize: "0.88rem", color: "var(--ink-light)", lineHeight: 1.7, margin: "0.25rem 0 0" }}>
                          {text}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
              <p className="devanagari" style={{ fontSize: "0.85rem", color: "var(--ink-light)", marginTop: "0.9rem" }}>
                शुभ अंक: <strong>{day.lucky.number}</strong> · शुभ रंग: <strong>{colorsHi(day.lucky.colors)}</strong> ·
                सामान्य शुभ समय (सभी शहरों के लिए): <strong>{day.auspicious_hours.slice(0, 2).join(" · ")}</strong>
              </p>
              <p className="devanagari" style={{ fontSize: "0.85rem", color: "var(--maroon)", marginTop: "0.4rem" }}>
                मंत्र: {day.lucky.mantra}
              </p>
            </>
          )}
        </div>
      </PatrikaFrame>

      {week && (
        <div className="result-box" style={{ marginTop: "1.2rem" }}>
          <div className="result-label">
            इस सप्ताह के सितारे (<time dateTime={week.week_start}>{fmtHiShort(week.week_start)}</time> — <time dateTime={week.week_end}>{fmtHiShort(week.week_end)}</time>)
          </div>
          <div style={{ overflowX: "auto", marginTop: "0.5rem" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem", minWidth: "520px" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--gold)" }}>
                  <th className="devanagari" style={{ textAlign: "left", padding: "0.35rem" }}>दिन</th>
                  {DOMAINS_HI.map(([k, label]) => (
                    <th key={k} className="devanagari" style={{ textAlign: "center", padding: "0.35rem" }}>{label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {week.days.map((d) => (
                  <tr key={d.date} style={{ borderBottom: "1px solid rgba(201,154,58,0.25)" }}>
                    <td className="devanagari" style={{ padding: "0.35rem", whiteSpace: "nowrap" }}>
                      <time dateTime={d.date}>{fmtHiShort(d.date)}</time> <span style={{ color: "var(--muted)" }}>{weekdayHi(d.date)}</span>
                    </td>
                    {DOMAINS_HI.map(([k]) => {
                      const n = d.domain_stars[k];
                      return (
                        <td key={k} style={{ padding: "0.35rem", textAlign: "center", whiteSpace: "nowrap" }}>
                          <span role="img" aria-label={`5 में से ${n} सितारे`} style={{ color: "var(--gold-bright)", fontSize: "0.75rem", letterSpacing: "0.08em" }}>
                            {stars(n)}
                          </span>
                          <span className="devanagari" style={{ display: "block", fontSize: "0.72rem", color: starTone(n) }}>{starLabelHi(n)}</span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
