"use client";

import { RASHIS, RASHI_GLYPH } from "@/lib/rashis";
import { rashiIndexFromNakshatra } from "@/lib/panchang-calc";

interface MoonSignPanelProps {
  nakshatraIndex: number;
  pada: number;
  moonPhase: string;
  isHi: boolean;
}

export default function MoonSignPanel({ nakshatraIndex, pada, moonPhase, isHi }: MoonSignPanelProps) {
  const rashiIdx = rashiIndexFromNakshatra(nakshatraIndex, pada);
  const rashi = RASHIS[rashiIdx];
  const glyph = RASHI_GLYPH[rashiIdx];
  if (!rashi) return null;

  return (
    <div className="result-box" style={{ textAlign: "center", margin: 0, height: "100%" }}>
      <div style={{ fontSize: "0.72rem", color: "var(--muted)", marginBottom: "0.3rem" }}>
        {isHi ? "चंद्र राशि" : "Moon Sign"}
      </div>
      <div style={{ fontSize: "2.2rem", lineHeight: 1, color: "var(--gold)" }} aria-hidden="true">{glyph}</div>
      <div style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--maroon-deep)", marginTop: "0.2rem" }}>
        {rashi.name}{" "}
        <span className="devanagari" style={{ color: "var(--muted)", fontSize: "0.85em" }}>{rashi.name_hi}</span>
      </div>
      <div style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: "0.15rem" }}>
        {isHi ? `स्वामी: ${rashi.lord_hi}` : `Ruled by ${rashi.lord}`}
      </div>
      <div style={{ borderTop: "1px dashed rgba(201,154,58,0.3)", marginTop: "0.6rem", paddingTop: "0.5rem" }}>
        <div style={{ fontSize: "0.7rem", color: "var(--muted)" }}>{isHi ? "चंद्र कला" : "Moon Phase"}</div>
        <div style={{ fontSize: "0.88rem", color: "var(--ink-light)" }}>{moonPhase}</div>
      </div>
    </div>
  );
}
