"use client";

import { useState } from "react";
import { getActiveChoghadiyaSlot, CHOG_MEANING } from "@/lib/panchang-calc";
import type { TimeSlot } from "@/lib/panchang-calc";
import Icon from "@/components/Icon";

interface ChoghadiyaGridProps {
  day: TimeSlot[];
  night: TimeSlot[];
  sunrise: string;
  sunset: string;
  /** null when not viewing today — no period should claim to be "active"
   *  for a date that isn't actually happening right now. */
  nowMinInPlace: number | null;
  isHi: boolean;
}

const QUALITY_TAG: Record<TimeSlot["quality"], { bg: string; border: string; text: string; en: string; hi: string; icon: "check" | "shield" | "clock" }> = {
  good: { bg: "rgba(26,122,58,0.08)", border: "rgba(26,122,58,0.35)", text: "#14602e", en: "Shubh", hi: "शुभ", icon: "check" },
  neutral: { bg: "rgba(201,154,58,0.1)", border: "rgba(201,154,58,0.4)", text: "#6b5220", en: "Neutral", hi: "सामान्य", icon: "clock" },
  bad: { bg: "rgba(192,57,43,0.07)", border: "rgba(192,57,43,0.3)", text: "#8a2f24", en: "Ashubh", hi: "अशुभ", icon: "shield" },
};

/** Toggleable day/night Choghadiya grid — replaces the previous
 *  always-both-shown lists. Defaults to whichever period is currently
 *  active (falls back to "day" when that can't be determined, e.g. before
 *  today's sunrise). */
export default function ChoghadiyaGrid({ day, night, sunrise, sunset, nowMinInPlace, isHi }: ChoghadiyaGridProps) {
  const active = nowMinInPlace != null ? getActiveChoghadiyaSlot(day, night, sunrise, nowMinInPlace) : null;
  const [period, setPeriod] = useState<"day" | "night">(active?.period ?? "day");
  const slots = period === "day" ? day : night;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
        <button type="button" className={`btn btn-sm ${period === "day" ? "btn-secondary" : "btn-ghost"}`} onClick={() => setPeriod("day")}>
          {isHi ? "दिन" : "Day"}{" "}
          <span style={{ fontSize: "0.7rem", opacity: 0.7 }}>({sunrise}–{sunset})</span>
        </button>
        <button type="button" className={`btn btn-sm ${period === "night" ? "btn-secondary" : "btn-ghost"}`} onClick={() => setPeriod("night")}>
          {isHi ? "रात्रि" : "Night"}{" "}
          <span style={{ fontSize: "0.7rem", opacity: 0.7 }}>({sunset}–{sunrise})</span>
        </button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "0.5rem" }}>
        {slots.map((s, i) => {
          const q = QUALITY_TAG[s.quality];
          const isActive = !!active && active.period === period && active.index === i;
          const meaning = CHOG_MEANING[s.name];
          return (
            <div
              key={i}
              style={{
                padding: "0.6rem 0.7rem", borderRadius: "2px", background: q.bg,
                border: isActive ? `2px solid ${q.text}` : `1px solid ${q.border}`,
                boxShadow: isActive ? "0 0 0 2px rgba(201,154,58,0.25)" : undefined,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 700, color: q.text, fontSize: "0.9rem" }}>{s.name}</span>
                <span style={{ color: q.text, display: "inline-flex", alignItems: "center", gap: "0.2rem", fontSize: "0.66rem", fontWeight: 600 }}>
                  <Icon name={q.icon} size={12} />{isHi ? q.hi : q.en}
                </span>
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>{s.start}–{s.end}</div>
              {meaning && (
                <div className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.72rem", color: "var(--ink-light)", marginTop: "0.25rem" }}>
                  {isHi ? meaning.hi : meaning.en}
                </div>
              )}
              {isActive && (
                <div style={{ fontSize: "0.65rem", color: q.text, fontWeight: 700, marginTop: "0.25rem" }}>
                  ● {isHi ? "अभी" : "NOW"}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
