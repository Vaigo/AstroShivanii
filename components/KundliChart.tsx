import type { Planet } from "@/lib/api/types";

/** North Indian chart, computed programmatically from API house numbers.
 *  House positions are FIXED (counter-clockwise): H1 top diamond, H2 top-left
 *  corner … H12 top-right corner. Sign number per house =
 *  ((lagna_sign_index + house − 1) mod 12) + 1. Never hand-place labels. */

const SIGN_NUM_POS: Record<number, [number, number]> = {
  1: [200, 152], 2: [100, 78], 3: [72, 105], 4: [152, 205],
  5: [72, 305], 6: [100, 338], 7: [200, 266], 8: [300, 338],
  9: [328, 305], 10: [248, 205], 11: [328, 105], 12: [300, 78],
};

const PLANET_ANCHOR: Record<number, [number, number]> = {
  1: [200, 66], 2: [100, 40], 3: [52, 84], 4: [100, 188],
  5: [52, 292], 6: [100, 350], 7: [200, 318], 8: [300, 350],
  9: [352, 306], 10: [295, 196], 11: [350, 80], 12: [300, 40],
};

const ABBR: Record<string, string> = {
  Sun: "सू", Moon: "चं", Mars: "मं", Mercury: "बु", Jupiter: "गु",
  Venus: "शु", Saturn: "श", Rahu: "रा", Ketu: "के",
  Uranus: "यू", Neptune: "ने", Pluto: "प्लू",
};

const MODERN = new Set(["Uranus", "Neptune", "Pluto"]);

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
  planets: Record<string, Planet>;
  size?: number;
  /** "lagna" (default) or "moon" — chandra kundli counts houses from the Moon sign. */
  mode?: "lagna" | "moon";
  /** House numbers (1-12, counted in this chart's own mode) to shade gold —
   *  e.g. the house a paid question was answered from. */
  highlightHouses?: number[];
}

export default function KundliChart({ ascSignIndex, ascDegrees, planets, size = 320, mode = "lagna", highlightHouses }: KundliChartProps) {
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
    push(1, `ल ${Math.round(ascDegrees)}°`, false);
  }
  for (const [name, p] of Object.entries(planets)) {
    const abbr = ABBR[name];
    if (!abbr || !p.house) continue;
    const label = `${abbr}${p.retrograde ? "(व)" : ""}${p.is_vargottama ? "★" : ""}${Math.round(p.degrees)}°`;
    push(houseOf(p), label, MODERN.has(name));
  }

  return (
    <svg width={size} height={size} viewBox="0 0 400 400" role="img" aria-label="जन्म कुंडली — North Indian chart">
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
          <text key={`s${house}`} x={x} y={y} fontSize="12" fill="#b3733a" textAnchor="middle" fontWeight="bold">
            {signNum}
          </text>
        );
      })}

      {/* planets, stacked per house */}
      {Array.from(byHouse.entries()).map(([house, list]) => {
        const [x, y] = PLANET_ANCHOR[house];
        return list.slice(0, 4).map((p, i) => (
          <text
            key={`${house}-${i}`}
            x={x}
            y={y + i * 15}
            fontSize="12.5"
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
