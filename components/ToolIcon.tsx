import type { CSSProperties, ReactNode } from "react";

/**
 * Larger, subject-specific illustrations for the free-tools grid — one per
 * tool, distinct enough that a user can tell them apart at a glance instead
 * of reading the small line-icons from Icon.tsx (which reuse generic shapes
 * like "planet"/"hash" across very different tools). A couple are
 * deliberately colored rather than monochrome (Lal Kitab = literally "Red
 * Book"; Lucky Colors = literally about color) since the color itself is
 * part of what makes them recognizable.
 *
 * Every icon carries a subject-matched micro-animation (the `ti-*` classes,
 * defined in globals.css): the cobra sways ready to strike, Saturn's ring
 * orbits, the year-wheel turns, the palm waves, stars twinkle. All CSS-only
 * (transform/opacity), subtle, and killed globally by the existing
 * prefers-reduced-motion rule.
 */
export type ToolIconName =
  | "panchang"
  | "kundli"
  | "baal-kundli"
  | "matching"
  | "rashifal"
  | "numerology"
  | "sade-sati"
  | "tarot"
  | "lal-kitab"
  | "lucky-colors"
  | "kaal-sarp-dosha"
  | "favorable-alphabet"
  | "personal-year"
  | "karmic-debt"
  | "varshphal"
  | "name-correction"
  | "palmistry"
  | "shubh-muhurta";

const ART: Record<ToolIconName, ReactNode> = {
  // Almanac page with a sun at its center — Panchang is the sun/moon-position calendar
  panchang: (
    <>
      <rect x="6" y="7" width="20" height="21" rx="1.5" />
      <path d="M11 3.5v6M21 3.5v6" />
      <g className="ti-pulse">
        <circle cx="16" cy="18.5" r="3" />
        <path d="M16 13.5v1.3M16 22.2v1.3M11.3 18.5h1.3M19.4 18.5h1.3" />
      </g>
    </>
  ),
  // The actual North-Indian kundli chart glyph — square + both diagonals + the
  // inscribed diamond. Anyone who has seen a real kundli recognizes this shape.
  kundli: (
    <>
      <rect x="4.5" y="4.5" width="23" height="23" />
      <path d="M4.5 4.5l23 23M27.5 4.5l-23 23" />
      <path className="ti-blink" d="M16 4.5L27.5 16 16 27.5 4.5 16z" />
    </>
  ),
  // A cradle with a star charm hanging above it
  "baal-kundli": (
    <>
      <g className="ti-rock">
        <path d="M6 21c0-5.2 4.5-9.5 10-9.5s10 4.3 10 9.5" />
        <path d="M5 21h22" />
        <path d="M11.5 21v3.5M20.5 21v3.5" />
      </g>
      <path className="ti-twinkle" d="M16 4.5l1 2.6 2.6 1-2.6 1-1 2.6-1-2.6-2.6-1 2.6-1z" />
    </>
  ),
  // Two wedding rings overlapping, a small sparkle marking the union
  matching: (
    <>
      <circle className="ti-pulse" cx="12.5" cy="20" r="7" />
      <circle className="ti-pulse" style={{ animationDelay: "1.5s" }} cx="19.5" cy="20" r="7" />
      <path className="ti-twinkle" d="M16 7l1 2.7 2.7 1-2.7 1-1 2.7-1-2.7-2.7-1 2.7-1z" />
    </>
  ),
  // A moon among stars — Rashifal reads today's sky for your moon sign
  rashifal: (
    <>
      <path d="M20 7.5a8.5 8.5 0 1 0 5 15.4A7 7 0 0 1 20 7.5z" />
      <path className="ti-twinkle" d="M7.5 10l0.6 1.7L9.8 12.3l-1.7 0.6L7.5 14.6l-0.6-1.7L5.2 12.3l1.7-0.6z" />
      <path className="ti-twinkle" style={{ animationDelay: "1.2s" }} d="M25 19l0.5 1.3 1.3 0.5-1.3 0.5L25 22.6l-0.5-1.3-1.3-0.5 1.3-0.5z" />
    </>
  ),
  // The Lo Shu 3x3 grid — numerology's most recognizable device
  numerology: (
    <>
      <rect x="6" y="6" width="20" height="20" />
      <line className="ti-blink" x1="12.6" y1="6" x2="12.6" y2="26" />
      <line className="ti-blink" style={{ animationDelay: "0.9s" }} x1="19.3" y1="6" x2="19.3" y2="26" />
      <line className="ti-blink" style={{ animationDelay: "1.8s" }} x1="6" y1="12.6" x2="26" y2="12.6" />
      <line className="ti-blink" style={{ animationDelay: "2.7s" }} x1="6" y1="19.3" x2="26" y2="19.3" />
    </>
  ),
  // Saturn — Sade Sati is specifically about Saturn's transit; the ring's
  // dashes flow around it like orbiting debris.
  "sade-sati": (
    <>
      <circle cx="16" cy="16" r="6" />
      <ellipse className="ti-orbit" cx="16" cy="16" rx="13" ry="4.2" transform="rotate(-20 16 16)" strokeDasharray="4 3" />
    </>
  ),
  // A single ornate card with a star face — reads as "tarot" more specifically
  // than two blank overlapping rectangles
  tarot: (
    <>
      <g className="ti-rock">
        <rect x="9.5" y="4" width="13" height="24" rx="1.5" />
        <path className="ti-twinkle" d="M16 11.5l1.3 3.6 3.6 1.3-3.6 1.3-1.3 3.6-1.3-3.6-3.6-1.3 3.6-1.3z" />
      </g>
    </>
  ),
  // Literally "Red Book" — the one place a deliberate color fill earns its keep
  "lal-kitab": (
    <g className="ti-pulse">
      <path d="M8 5h13a2 2 0 0 1 2 2v18a2 2 0 0 0-2-2H8a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"
        fill="#A6242F" stroke="none" />
      <path d="M8 5h13a2 2 0 0 1 2 2v18a2 2 0 0 0-2-2H8a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" />
      <line x1="10" y1="10.5" x2="18" y2="10.5" stroke="#f5e0a0" strokeWidth="1.2" />
      <line x1="10" y1="14" x2="18" y2="14" stroke="#f5e0a0" strokeWidth="1.2" />
    </g>
  ),
  // Three overlapping color swatches — the tool is literally about which color
  // suits you; they breathe one after another.
  "lucky-colors": (
    <>
      <circle className="ti-pulse" cx="12" cy="13" r="5" fill="#C9453D" stroke="none" />
      <circle className="ti-pulse" style={{ animationDelay: "1s" }} cx="21" cy="12" r="5" fill="#3D8FC9" stroke="none" />
      <circle className="ti-pulse" style={{ animationDelay: "2s" }} cx="16.5" cy="20.5" r="5" fill="#E0A93A" stroke="none" />
    </>
  ),
  // KAAL SARP — the serpent wrapped AROUND the icon circle, hooded head
  // chasing its own tapering tail (Rahu = head, Ketu = tail, everything caught
  // between: literally the dosha's definition), slowly rotating. Geometry
  // rules learned the hard way (2026-09-05): every part — hood, head, tongue —
  // sits ON the r=11.8 ring (tangent-oriented ellipses), so nothing pokes past
  // the viewBox (the earlier head got clipped at y<0 and looked hoodless) and
  // the ring clears the 68px card circle at the 60px render size. The
  // invisible r=15.4 circle keeps the fill-box rotation origin at the true
  // centre despite the head/tail gap. Tail tapers over five short arcs.
  "kaal-sarp-dosha": (
    <g className="ti-spin" style={{ animationDuration: "14s" }}>
      <circle cx="16" cy="16" r="15.4" fill="none" stroke="none" />
      <path d="M21.54 5.58 A11.8 11.8 0 0 1 22.77 6.33" strokeWidth="0.9"/>
      <path d="M22.77 6.33 A11.8 11.8 0 0 1 23.90 7.23" strokeWidth="1.4"/>
      <path d="M23.90 7.23 A11.8 11.8 0 0 1 24.91 8.26" strokeWidth="1.9"/>
      <path d="M24.91 8.26 A11.8 11.8 0 0 1 25.78 9.40" strokeWidth="2.4"/>
      <path d="M25.78 9.40 A11.8 11.8 0 0 1 26.51 10.64" strokeWidth="2.85"/>
      <path d="M26.51 10.64 A11.8 11.8 0 1 1 5.78 10.10" strokeWidth="3.2"/>
      <path d="M26.69 17.88 L28.56 18.21" stroke="#f5e0a0" strokeWidth="0.8"/>
      <path d="M22.97 24.31 L24.20 25.77" stroke="#f5e0a0" strokeWidth="0.8"/>
      <path d="M16.00 26.85 L16.00 28.75" stroke="#f5e0a0" strokeWidth="0.8"/>
      <path d="M9.03 24.31 L7.80 25.77" stroke="#f5e0a0" strokeWidth="0.8"/>
      <path d="M5.31 17.88 L3.44 18.21" stroke="#f5e0a0" strokeWidth="0.8"/>
      <ellipse cx="7.51" cy="7.80" rx="3.6" ry="3.5" transform="rotate(314 7.51 7.80)" fill="currentColor" stroke="none"/>
      <path d="M9.31 9.54 L5.71 6.07" stroke="#f5e0a0" strokeWidth="0.85"/>
      <ellipse cx="11.39" cy="5.14" rx="2.5" ry="2.1" transform="rotate(337 11.39 5.14)" fill="currentColor" stroke="none"/>
      <circle cx="11.64" cy="4.02" r="0.52" fill="#f5e0a0" stroke="none"/>
      <g className="ti-flick">
      <path d="M13.75 4.42 A11.8 11.8 0 0 1 15.38 4.22 M15.38 4.22 L16.22 3.35 M15.38 4.22 L16.19 5.05" stroke="#f5e0a0" strokeWidth="0.9"/>
      </g>
    </g>
  ),
  // A capital letter with a sparkle marking it as the auspicious one
  "favorable-alphabet": (
    <>
      <path d="M9 24.5L15.2 6h1.6l6.2 18.5" />
      <line x1="11.3" y1="18" x2="20.7" y2="18" />
      <path className="ti-twinkle" d="M24.5 5.5l0.7 1.8 1.8 0.7-1.8 0.7-0.7 1.8-0.7-1.8-1.8-0.7 1.8-0.7z" />
    </>
  ),
  // A calendar with the year's number circled — the highlight pulses
  "personal-year": (
    <>
      <rect x="5" y="7" width="22" height="20" rx="1.5" />
      <line x1="11" y1="3.5" x2="11" y2="9.5" />
      <line x1="21" y1="3.5" x2="21" y2="9.5" />
      <line x1="5" y1="13" x2="27" y2="13" />
      <circle className="ti-pulse" cx="16" cy="20" r="4" />
    </>
  ),
  // Same Lo Shu family as Numerology, but with one cell struck out — the
  // missing number's ✕ blinks for attention.
  "karmic-debt": (
    <>
      <rect x="6" y="6" width="20" height="20" />
      <line x1="12.6" y1="6" x2="12.6" y2="26" />
      <line x1="19.3" y1="6" x2="19.3" y2="26" />
      <line x1="6" y1="12.6" x2="26" y2="12.6" />
      <line x1="6" y1="19.3" x2="26" y2="19.3" />
      <g className="ti-blink" style={{ animationDuration: "1.6s" }}>
        <line x1="8.3" y1="14.6" x2="10.9" y2="17.2" />
        <line x1="10.9" y1="14.6" x2="8.3" y2="17.2" />
      </g>
    </>
  ),
  // A year wheel — Varshphal is literally the annual solar-return chart;
  // the spokes turn slowly like the year itself.
  varshphal: (
    <>
      <circle cx="16" cy="16" r="10.5" />
      <circle cx="16" cy="16" r="2.8" />
      <path className="ti-spin" d="M16 4v3.2M16 24.8V28M28 16h-3.2M7.2 16H4M24.3 7.7l-2.3 2.3M10 22l-2.3 2.3M24.3 24.3L22 22M10 10L7.7 7.7" />
    </>
  ),
  // A flowing signature that writes itself, with a corrective sparkle
  "name-correction": (
    <>
      <path className="ti-write" pathLength={100} d="M5 21.5c2.7-1 4.6-8 6.5-8s1.8 6 3.7 6 2.8-10 4.6-10 1.9 8.5 3.7 8.5" />
      <path className="ti-twinkle" d="M24.5 6l0.8 2 2 0.8-2 0.8-0.8 2-0.8-2-2-0.8 2-0.8z" />
    </>
  ),
  // A calendar with one date marked by a twinkling star — the auspicious day
  "shubh-muhurta": (
    <>
      <rect x="5" y="7" width="22" height="20" rx="1.5" />
      <line x1="11" y1="3.5" x2="11" y2="9.5" />
      <line x1="21" y1="3.5" x2="21" y2="9.5" />
      <line x1="5" y1="13" x2="27" y2="13" />
      <path className="ti-twinkle" d="M16 15.5l1.2 3.2 3.2 1.2-3.2 1.2-1.2 3.2-1.2-3.2-3.2-1.2 3.2-1.2z" />
    </>
  ),
  // A simplified open palm, waving hello
  palmistry: (
    <g className="ti-wave">
      <path d="M9.5 26.5v-8.2a1.8 1.8 0 1 1 3.6 0v3" />
      <path d="M13.1 21.3v-8a1.8 1.8 0 1 1 3.6 0v6.8" />
      <path d="M16.7 20.1V11a1.8 1.8 0 1 1 3.6 0v9" />
      <path d="M20.3 20v-6.2a1.8 1.8 0 1 1 3.6 0v8.4c0 4-3.2 7.3-7.3 7.3h-1.5c-2.6 0-4-1-5.3-2.8l-2.9-4.3" />
    </g>
  ),
};

interface ToolIconProps {
  name: ToolIconName;
  size?: number;
  strokeWidth?: number;
  className?: string;
  style?: CSSProperties;
}

export default function ToolIcon({ name, size = 32, strokeWidth = 1.6, className, style }: ToolIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {ART[name]}
    </svg>
  );
}
