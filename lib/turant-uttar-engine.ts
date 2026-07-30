/** तुरंत उत्तर — tier computation. No AI: two real chart facts collapse
 *  into a 1-4 tier that selects pre-written content (turant-uttar-data.ts).
 *
 *  Factor A — significator strength: is the relevant house lord exalted/
 *  own-sign (strong), debilitated/combust (weak), or neither (neutral)?
 *  Factor B — dasha relevance: is the running Mahadasha lord the same
 *  planet as that house lord (connected) or a different one (unrelated)?
 *
 *  This is a first-pass model for Shivanii to review/correct — house-lord-
 *  only significators are a simplification (no divisional charts, no
 *  karaka planets, no aspects), not a final classical authority. */

import type { CategoryKey } from "./turant-uttar-data";
import type { KundliFullResult, Planet } from "./api/types";

const SIGN_LORD_EN = [
  "Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury",
  "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter",
];

/** Which house governs each category (whole-sign, from the ascendant). */
const CATEGORY_HOUSE: Record<CategoryKey, number> = {
  love: 7,
  breakup: 7,
  marriage: 7,
  career: 10,
  govtJob: 10,
  finance: 11,
  health: 6,
  children: 5,
  foreign: 12,
};

type Strength = "strong" | "neutral" | "weak";

function houseLordName(kundli: KundliFullResult, house: number): string {
  const h = kundli.houses.find((x) => x.house === house);
  const signIndex = h ? h.sign_index : (kundli.ascendant.sign_index + house - 1) % 12;
  return SIGN_LORD_EN[signIndex];
}

function planetStrength(p: Planet | undefined): Strength {
  if (!p) return "neutral";
  if (p.is_exalted || p.is_own_sign || p.is_mool_trikona) return "strong";
  if (p.is_debilitated || p.is_combust) return "weak";
  return "neutral";
}

/** Generic resolver used by every category except "breakup". */
function resolveGenericTier(kundli: KundliFullResult, category: CategoryKey): 1 | 2 | 3 | 4 {
  const house = CATEGORY_HOUSE[category];
  const lord = houseLordName(kundli, house);
  const strength = planetStrength(kundli.planets[lord]);
  const dashaLord = kundli.current_dasha?.mahadasha?.lord;
  const connected = dashaLord === lord;

  if (strength === "strong" && connected) return 1;
  if (strength === "weak" && !connected) return 4;
  if (strength === "weak" || (strength === "neutral" && !connected)) return 3;
  return 2;
}

/** Breakup uses a different signal: where the dasha lord actually sits
 *  (7th house = reunion-favoring, 6th/8th/12th = separation/closure). */
function resolveBreakupTier(kundli: KundliFullResult): 1 | 2 | 3 | 4 {
  const dashaLordName = kundli.current_dasha?.mahadasha?.lord;
  const dashaLordPlanet = dashaLordName ? kundli.planets[dashaLordName] : undefined;
  const lordHouse = dashaLordPlanet?.house;
  const seventhLord = houseLordName(kundli, 7);
  const strength = planetStrength(kundli.planets[seventhLord]);

  if (lordHouse === 7 || dashaLordName === "Venus") return strength === "weak" ? 2 : 1;
  if (lordHouse === 6 || lordHouse === 8 || lordHouse === 12) return strength === "strong" ? 3 : 4;
  return strength === "strong" ? 2 : 3;
}

/** Government vs private/business isn't a favorable→unfavorable spectrum —
 *  it's four distinct outcomes. Sun is the classical government/authority
 *  karaka; Mercury/Venus lean trade/private-sector. */
function resolveGovtJobTier(kundli: KundliFullResult): 1 | 2 | 3 | 4 {
  const sun = kundli.planets["Sun"];
  const sunStrength = planetStrength(sun);
  const tenthLord = houseLordName(kundli, 10);
  const dashaLord = kundli.current_dasha?.mahadasha?.lord;
  const sunConnected = dashaLord === "Sun" || tenthLord === "Sun" || sun?.house === 10;
  const tradeConnected = dashaLord === "Mercury" || dashaLord === "Venus";
  const tradeStrength = planetStrength(kundli.planets[dashaLord ?? ""]);

  if (sunStrength === "strong" && sunConnected) return 1;
  if (sunConnected || sunStrength === "strong") return 2;
  if (tradeConnected && tradeStrength !== "weak") return 3;
  return 4;
}

export function resolveTier(kundli: KundliFullResult, category: CategoryKey): 1 | 2 | 3 | 4 {
  if (category === "breakup") return resolveBreakupTier(kundli);
  if (category === "govtJob") return resolveGovtJobTier(kundli);
  return resolveGenericTier(kundli, category);
}

export interface FactSheet {
  house: number;
  houseLord: string;
  houseLordSign: string;
  houseLordSignHi: string;
  strength: Strength;
  dashaLord: string;
  dashaEnd: string | undefined;
}

/** The real, per-person facts behind the tier — shown on the paid answer
 *  screen so two different charts visibly produce two different readings,
 *  not just the same templated paragraph. */
export function getFactSheet(kundli: KundliFullResult, category: CategoryKey): FactSheet {
  const house = CATEGORY_HOUSE[category];
  const lord = houseLordName(kundli, house);
  const lordPlanet = kundli.planets[lord];
  return {
    house,
    houseLord: lord,
    houseLordSign: lordPlanet?.sign ?? "",
    houseLordSignHi: lordPlanet?.sign_hi ?? "",
    strength: planetStrength(lordPlanet),
    dashaLord: kundli.current_dasha?.mahadasha?.lord ?? "",
    dashaEnd: kundli.current_dasha?.mahadasha?.end,
  };
}
