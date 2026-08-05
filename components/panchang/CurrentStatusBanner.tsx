"use client";

import { getActiveChoghadiyaSlot, minutesUntilNextChogSlot, CHOG_MEANING } from "@/lib/panchang-calc";
import type { TimeSlot } from "@/lib/panchang-calc";

interface CurrentStatusBannerProps {
  day: TimeSlot[];
  night: TimeSlot[];
  sunrise: string;
  nowMinInPlace: number;
  isHi: boolean;
}

const QUALITY_STYLE: Record<TimeSlot["quality"], { bg: string; border: string; text: string; en: string; hi: string }> = {
  good: { bg: "rgba(26,122,58,0.1)", border: "rgba(26,122,58,0.4)", text: "#14602e", en: "Auspicious", hi: "शुभ" },
  neutral: { bg: "rgba(201,154,58,0.12)", border: "rgba(201,154,58,0.45)", text: "#6b5220", en: "Neutral", hi: "सामान्य" },
  bad: { bg: "rgba(192,57,43,0.09)", border: "rgba(192,57,43,0.35)", text: "#8a2f24", en: "Avoid", hi: "अशुभ" },
};

function formatCountdown(minutes: number, isHi: boolean): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h <= 0) return isHi ? `${m} मिनट में` : `in ${m}m`;
  return isHi ? `${h} घं ${m} मि में` : `in ${h}h ${m}m`;
}

/** Live "what's happening right now" banner — the currently-active
 *  Choghadiya period plus a countdown to the next one. Ticks off the
 *  shared `nowMinInPlace` value the parent computes once per tick, so it
 *  can never disagree with the donut or the grid's "active" highlight. */
export default function CurrentStatusBanner({ day, night, sunrise, nowMinInPlace, isHi }: CurrentStatusBannerProps) {
  const active = getActiveChoghadiyaSlot(day, night, sunrise, nowMinInPlace);
  const next = minutesUntilNextChogSlot(day, night, sunrise, nowMinInPlace);

  if (!active) {
    return (
      <div className="result-box" style={{ textAlign: "center", margin: 0 }}>
        <div style={{ fontSize: "0.72rem", color: "var(--muted)", marginBottom: "0.2rem" }}>
          {isHi ? "अभी सक्रिय" : "Currently Active"}
        </div>
        <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.85rem", color: "var(--ink-light)", margin: 0 }}>
          {isHi
            ? "अभी रात्रि चोघड़िया चल रही है (बीती रात की, यहाँ लोड नहीं) — आज का दिन चोघड़िया सूर्योदय से शुरू होगी।"
            : "It's before today's sunrise — last night's choghadiya (not loaded here) is still running. Today's day sequence begins at sunrise."}
        </p>
      </div>
    );
  }

  const q = QUALITY_STYLE[active.slot.quality];
  const meaning = CHOG_MEANING[active.slot.name];

  return (
    <div className="result-box" style={{ background: q.bg, borderColor: q.border, textAlign: "center", margin: 0 }}>
      <div style={{ fontSize: "0.72rem", color: "var(--muted)", marginBottom: "0.2rem" }}>
        {isHi ? "अभी सक्रिय" : "Currently Active"}
      </div>
      <div style={{ fontSize: "1.25rem", fontWeight: 700, color: q.text }}>
        {active.slot.name}{" "}
        <span style={{ fontSize: "0.72rem", fontWeight: 600 }}>({isHi ? q.hi : q.en})</span>
      </div>
      <div style={{ fontSize: "0.78rem", color: "var(--muted)" }}>{active.slot.start} – {active.slot.end}</div>
      {meaning && (
        <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.8rem", color: "var(--ink-light)", marginTop: "0.35rem" }}>
          {isHi ? meaning.hi : meaning.en}
        </p>
      )}
      {next && (
        <div style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: "0.5rem" }}>
          {isHi ? "आगामी" : "Next"}: <strong>{next.next.slot.name}</strong> @ {next.next.slot.start} — {formatCountdown(next.minutes, isHi)}
        </div>
      )}
    </div>
  );
}
