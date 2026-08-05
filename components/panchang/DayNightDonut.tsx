"use client";

import type { RahuKaalResult, MuhurtaSlot } from "@/lib/api/types";
import { toMin } from "@/lib/panchang-calc";

interface DayNightDonutProps {
  sunrise: string;
  sunset: string;
  kaal: RahuKaalResult | null;
  abhijit: MuhurtaSlot | null;
  nowMinInPlace: number;
  nowLabel: string;
  placeLabel: string;
  showNowMarker: boolean;
  isHi: boolean;
}

const SIZE = 220;
const CX = SIZE / 2;
const CY = SIZE / 2;
const R = 92;
const STROKE = 20;
const CIRC = 2 * Math.PI * R;

function arc(key: string, startMin: number, endMin: number, color: string, width: number) {
  let end = endMin;
  if (end < startMin) end += 1440;
  const len = ((end - startMin) / 1440) * CIRC;
  const offset = (startMin / 1440) * CIRC;
  return (
    <circle
      key={key}
      cx={CX} cy={CY} r={R}
      fill="none"
      stroke={color}
      strokeWidth={width}
      strokeDasharray={`${len} ${CIRC - len}`}
      strokeDashoffset={-offset}
      transform={`rotate(-90 ${CX} ${CY})`}
    />
  );
}

/** 6-segment day/night gestalt donut: Day, Night, Rahu Kaal, Gulika Kaal,
 *  Yamaganda, Abhijit. Complements (does not duplicate) the existing linear
 *  DayStrip, which remains the precise minute-level drill-down. */
export default function DayNightDonut({ sunrise, sunset, kaal, abhijit, nowMinInPlace, nowLabel, placeLabel, showNowMarker, isHi }: DayNightDonutProps) {
  const sr = toMin(sunrise), ss = toMin(sunset);

  const segments = [
    arc("night", 0, 1440, "rgba(30,38,70,0.6)", STROKE),
    arc("day", sr, ss, "rgba(201,154,58,0.85)", STROKE),
  ];
  if (kaal) {
    segments.push(arc("rahu", toMin(kaal.rahu_kaal.start), toMin(kaal.rahu_kaal.end), "#c0392b", STROKE * 0.55));
    segments.push(arc("gulika", toMin(kaal.gulika_kaal.start), toMin(kaal.gulika_kaal.end), "#a93226", STROKE * 0.55));
    segments.push(arc("yama", toMin(kaal.yamaganda.start), toMin(kaal.yamaganda.end), "#7a2318", STROKE * 0.55));
  }
  if (abhijit) segments.push(arc("abhijit", toMin(abhijit.start), toMin(abhijit.end), "#1a7a3a", STROKE * 0.55));

  const nowAngleDeg = (nowMinInPlace / 1440) * 360 - 90;
  const nowRad = (nowAngleDeg * Math.PI) / 180;
  const nowX = CX + R * Math.cos(nowRad);
  const nowY = CY + R * Math.sin(nowRad);

  const legend: Array<{ color: string; en: string; hi: string }> = [
    { color: "rgba(201,154,58,0.85)", en: "Day", hi: "दिन" },
    { color: "rgba(30,38,70,0.6)", en: "Night", hi: "रात्रि" },
    { color: "#c0392b", en: "Rahu Kaal", hi: "राहु काल" },
    { color: "#a93226", en: "Gulika Kaal", hi: "गुलिक काल" },
    { color: "#7a2318", en: "Yamaganda", hi: "यमगण्ड" },
    { color: "#1a7a3a", en: "Abhijit", hi: "अभिजीत" },
  ];

  return (
    <div style={{ textAlign: "center" }}>
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
        {segments}
        {showNowMarker && (
          <circle cx={nowX} cy={nowY} r={5.5} fill="var(--maroon-deep)" stroke="var(--gold)" strokeWidth={1.5} />
        )}
        <text x={CX} y={CY - 6} textAnchor="middle" fontSize="12" fontWeight={700} fill="var(--maroon-deep)">
          {placeLabel.length > 14 ? placeLabel.slice(0, 13) + "…" : placeLabel}
        </text>
        <text x={CX} y={CY + 15} textAnchor="middle" fontSize="16" fontWeight={700} fill="var(--gold-bright)">
          {nowLabel}
        </text>
      </svg>
      <div style={{ display: "flex", justifyContent: "center", gap: "0.55rem", flexWrap: "wrap", marginTop: "0.5rem", fontSize: "0.66rem", color: "var(--muted)" }}>
        {legend.map((l) => (
          <span key={l.en} style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
            <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 2, background: l.color }} />
            {isHi ? l.hi : l.en}
          </span>
        ))}
      </div>
    </div>
  );
}
