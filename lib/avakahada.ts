/** Avakahada chakra values — classical tables keyed by moon rashi +
 *  nakshatra + pada. Used by the free Kundli tool and matching. */

import { NAKSHATRAS, GANA_HI } from "./nakshatras";

const SIGNS_HI = ["मेष", "वृषभ", "मिथुन", "कर्क", "सिंह", "कन्या", "तुला", "वृश्चिक", "धनु", "मकर", "कुम्भ", "मीन"];

/** Varna by moon sign: water=Brahmin, fire=Kshatriya, earth=Vaishya, air=Shudra. */
const VARNA = ["क्षत्रिय", "वैश्य", "शूद्र", "ब्राह्मण", "क्षत्रिय", "वैश्य", "शूद्र", "ब्राह्मण", "क्षत्रिय", "वैश्य", "शूद्र", "ब्राह्मण"];

/** Vashya by moon sign (common table; Sagittarius/Capricorn use the
 *  predominant classification). */
const VASHYA = ["चतुष्पद", "चतुष्पद", "मानव", "जलचर", "वनचर", "मानव", "मानव", "कीट", "मानव", "जलचर", "मानव", "जलचर"];

/** Tatva (element) by moon sign. */
const TATVA = ["अग्नि", "पृथ्वी", "वायु", "जल", "अग्नि", "पृथ्वी", "वायु", "जल", "अग्नि", "पृथ्वी", "वायु", "जल"];

/** Nadi by nakshatra index (0-based): the classical zigzag आदि→मध्य→अन्त्य→
 *  अन्त्य→मध्य→आदि repeating every 6 (verified: Bharani=मध्य, Magha=अन्त्य,
 *  Shatabhisha=आदि, Revati=अन्त्य). */
const NADI_CYCLE = ["आदि", "मध्य", "अन्त्य", "अन्त्य", "मध्य", "आदि"];
function nadiFor(nakshatraIndex: number): string {
  return NADI_CYCLE[nakshatraIndex % 6];
}

export interface Avakahada {
  rashi: string;         // मेष
  rashiLord: string;
  nakshatraPada: string; // "भरणी – 2"
  nakshatraLord: string;
  varna: string;
  vashya: string;
  yoni: string;
  gana: string;
  nadi: string;
  tatva: string;
  nameSyllable: string;  // नामाक्षर for the pada
}

const SIGN_LORD_HI = ["मंगल", "शुक्र", "बुध", "चंद्र", "सूर्य", "बुध", "शुक्र", "मंगल", "गुरु", "शनि", "शनि", "गुरु"];

export function avakahada(
  moonSignIndex: number,
  nakshatraIndex: number,
  pada: number
): Avakahada | null {
  const nak = NAKSHATRAS[nakshatraIndex];
  if (!nak || moonSignIndex < 0 || moonSignIndex > 11) return null;
  return {
    rashi: SIGNS_HI[moonSignIndex],
    rashiLord: SIGN_LORD_HI[moonSignIndex],
    nakshatraPada: `${nak.name_hi} – ${pada}`,
    nakshatraLord: nak.lord_hi,
    varna: VARNA[moonSignIndex],
    vashya: VASHYA[moonSignIndex],
    yoni: nak.yoni_hi,
    gana: GANA_HI[nak.gana],
    nadi: nadiFor(nakshatraIndex),
    tatva: TATVA[moonSignIndex],
    nameSyllable: nak.syllables[Math.min(Math.max(pada, 1), 4) - 1],
  };
}
