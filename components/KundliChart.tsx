import type { Planet } from "@/lib/api/types";

/** North Indian chart, computed programmatically from API house numbers.
 *  House positions are FIXED (counter-clockwise): H1 top diamond, H2 top-left
 *  corner … H12 top-right corner. Sign number per house =
 *  ((lagna_sign_index + house − 1) mod 12) + 1. Never hand-place labels. */

// Kendra houses (1,4,7,10) are the large kite quarters — sign number sits
// toward the diamond's center, planets stack toward the kite's outer tip,
// with a wide gap since there's real room. Corner houses (2,3,5,6,8,9,11,12)
// are small triangles — sign number stays near the triangle's outer corner,
// planets anchor near its centroid, both pushed as far apart as the small
// shape allows (this is what was too tight before: e.g. house 10 had both
// anchors within 47px of each other despite being a large kendra house).
const SIGN_NUM_POS: Record<number, [number, number]> = {
  1: [200, 160], 2: [95, 88], 3: [66, 96], 4: [160, 200],
  5: [66, 304], 6: [95, 312], 7: [200, 240], 8: [305, 312],
  9: [334, 304], 10: [240, 200], 11: [334, 96], 12: [305, 88],
};

const PLANET_ANCHOR: Record<number, [number, number]> = {
  1: [200, 55], 2: [100, 32], 3: [45, 78], 4: [95, 200],
  5: [45, 322], 6: [100, 368], 7: [200, 345], 8: [300, 368],
  9: [355, 322], 10: [340, 200], 11: [355, 78], 12: [300, 32],
};

// Corner houses render fewer, smaller, more tightly-stacked lines — a small
// triangle genuinely can't hold 4 lines of a 14.5px bold label without
// running into the sign number or the house's own edges.
const CORNER_HOUSES = new Set([2, 3, 5, 6, 8, 9, 11, 12]);

const ABBR: Record<string, string> = {
  Sun: "सू", Moon: "चं", Mars: "मं", Mercury: "बु", Jupiter: "गु",
  Venus: "शु", Saturn: "श", Rahu: "रा", Ketu: "के",
  Uranus: "यू", Neptune: "ने", Pluto: "प्लू",
};

const MODERN = new Set(["Uranus", "Neptune", "Pluto"]);

/** "5°43'47"" → "5°43'" — degree+minute only, no seconds (keeps chart labels
 *  compact while still being more precise than a bare rounded degree). */
function shortDms(dms: string | undefined): string | null {
  const m = dms?.match(/^(-?\d+°\d+')/);
  return m ? m[1] : null;
}

/** The 12 fixed house regions of the North Indian chart (square 2..398 with
 *  both diagonals + the midpoint diamond; diagonal×diamond intersections at
 *  (101,101)/(299,101)/(299,299)/(101,299)). Used only for highlighting. */
const HOUSE_POLY: Record<number, string> = {
  1: "200,2 299,101 200,200 101,101",
  2: "2,2 200,2 101,101",
  3: "2,2 101,101 2,200",
  4: "2,200 101,101 200,200 101,299",
  5: "2,200 101,299 2,398",
  6: "2,398 101,299 200,398",
  7: "101,299 200,200 299,299 200,398",
  8: "200,398 299,299 398,398",
  9: "398,398 299,299 398,200",
  10: "200,200 299,101 398,200 299,299",
  11: "398,200 299,101 398,2",
  12: "398,2 299,101 200,2",
};

interface KundliChartProps {
  ascSignIndex: number;
  ascDegrees: number;
  /** Full "D°M'S"" ascendant DMS string — shown as degree+minute on the chart
   *  when available; falls back to a rounded ascDegrees if omitted. */
  ascDms?: string;
  planets: Record<string, Planet>;
  size?: number;
  /** "lagna" (default) or "moon" — chandra kundli counts houses from the Moon sign. */
  mode?: "lagna" | "moon";
  /** House numbers (1-12, counted in this chart's own mode) to shade gold —
   *  e.g. the house a paid question was answered from. */
  highlightHouses?: number[];
}

export default function KundliChart({ ascSignIndex, ascDegrees, ascDms, planets, size = 420, mode = "lagna", highlightHouses }: KundliChartProps) {
  // Chandra kundli: re-anchor everything to the Moon's sign.
  const moonSignIndex = planets.Moon?.sign_index ?? ascSignIndex;
  const anchorSign = mode === "moon" ? moonSignIndex : ascSignIndex;
  const houseOf = (p: Planet) =>
    mode === "moon" ? ((p.sign_index - moonSignIndex + 12) % 12) + 1 : p.house;

  // group planets by house (computed from the API's own house/sign fields)
  const byHouse = new Map<number, Array<{ label: string; modern: boolean }>>();

  const push = (house: number, label: string, modern: boolean) => {
    if (!byHouse.has(house)) byHouse.set(house, []);
    byHouse.get(house)!.push({ label, modern });
  };

  if (mode === "lagna") {
    push(1, `ल ${shortDms(ascDms) ?? `${Math.round(ascDegrees)}°`}`, false);
  }
  for (const [name, p] of Object.entries(planets)) {
    const abbr = ABBR[name];
    if (!abbr || !p.house) continue;
    const deg = shortDms(p.dms) ?? `${Math.round(p.degrees)}°`;
    const dignity = p.is_exalted ? "↑" : p.is_debilitated ? "↓" : "";
    const combust = p.is_combust ? "(अ)" : "";
    const label = `${abbr}${p.retrograde ? "(व)" : ""}${dignity}${combust}${p.is_vargottama ? "★" : ""}${deg}`;
    push(houseOf(p), label, MODERN.has(name));
  }

  return (
    <svg
      width="100%"
      height="auto"
      viewBox="0 0 400 400"
      style={{ maxWidth: size, display: "block" }}
      role="img"
      aria-label="जन्म कुंडली — North Indian chart"
    >
      <rect x="2" y="2" width="396" height="396" fill="#fffdf6" stroke="#511320" strokeWidth="3" />

      {/* Question-relevant house(s), shaded before the frame lines draw over */}
      {highlightHouses?.map((h) =>
        HOUSE_POLY[h] ? (
          <polygon key={`hl${h}`} points={HOUSE_POLY[h]} fill="rgba(224, 138, 46, 0.22)" stroke="#E08A2E" strokeWidth="2" />
        ) : null
      )}

      <line x1="2" y1="2" x2="398" y2="398" stroke="#511320" strokeWidth="1.6" />
      <line x1="398" y1="2" x2="2" y2="398" stroke="#511320" strokeWidth="1.6" />
      <polygon points="200,2 398,200 200,398 2,200" fill="none" stroke="#511320" strokeWidth="1.6" />

      {/* sign numbers */}
      {Array.from({ length: 12 }, (_, i) => {
        const house = i + 1;
        const signNum = ((anchorSign + house - 1) % 12) + 1;
        const [x, y] = SIGN_NUM_POS[house];
        return (
          <text key={`s${house}`} x={x} y={y} fontSize="15" fill="#b3733a" textAnchor="middle" fontWeight="bold">
            {signNum}
          </text>
        );
      })}

      {/* planets, stacked per house — corner houses get smaller text and
          fewer lines since their triangles are genuinely too small for 4
          full-size stacked labels without crowding the sign number */}
      {Array.from(byHouse.entries()).map(([house, list]) => {
        const [x, y] = PLANET_ANCHOR[house];
        const isCorner = CORNER_HOUSES.has(house);
        const fontSize = isCorner ? "12.5" : "14.5";
        const lineStep = isCorner ? 13 : 17;
        const maxLines = isCorner ? 3 : 4;
        return list.slice(0, maxLines).map((p, i) => (
          <text
            key={`${house}-${i}`}
            x={x}
            y={y + i * lineStep}
            fontSize={fontSize}
            fill={p.modern ? "#6b5fa8" : "#1c2150"}
            textAnchor="middle"
            fontWeight="bold"
          >
            {p.label}
          </text>
        ));
      })}
    </svg>
  );
}
