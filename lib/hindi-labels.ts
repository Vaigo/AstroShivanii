/** Hindi renderings for API values the backend returns in English only.
 *  Sign/nakshatra Hindi comes from the API itself (sign_hi, name_hi) —
 *  these maps cover planets, dignities and lagna one-liners. */

export const PLANET_HI: Record<string, string> = {
  Sun: "सूर्य", Moon: "चंद्र", Mars: "मंगल", Mercury: "बुध", Jupiter: "गुरु",
  Venus: "शुक्र", Saturn: "शनि", Rahu: "राहु", Ketu: "केतु",
  Uranus: "यूरेनस", Neptune: "नेपच्यून", Pluto: "प्लूटो",
};

/** Astronomical glyphs — instant visual anchors next to planet names. */
export const PLANET_GLYPH: Record<string, string> = {
  Sun: "☉", Moon: "☽", Mars: "♂", Mercury: "☿", Jupiter: "♃",
  Venus: "♀", Saturn: "♄", Rahu: "☊", Ketu: "☋",
  Uranus: "♅", Neptune: "♆", Pluto: "♇",
};

export const SIGN_HI: Record<string, string> = {
  Aries: "मेष", Taurus: "वृषभ", Gemini: "मिथुन", Cancer: "कर्क",
  Leo: "सिंह", Virgo: "कन्या", Libra: "तुला", Scorpio: "वृश्चिक",
  Sagittarius: "धनु", Capricorn: "मकर", Aquarius: "कुम्भ", Pisces: "मीन",
};

export function dignityHi(dignity: string): string {
  if (!dignity || dignity === "N/A") return "—";
  if (dignity.includes("Own Sign")) return "स्वराशि";
  if (dignity.includes("Exalt")) return "उच्च";
  if (dignity.includes("Debilitat")) return "नीच";
  if (dignity.includes("Mool")) return "मूल त्रिकोण";
  if (dignity.includes("Neutral")) return "सामान्य";
  return dignity;
}

export function strengthHi(strength: string): string {
  if (strength.includes("Strong")) return "प्रबल";
  if (strength.includes("Moderate")) return "मध्यम";
  if (strength.includes("Weak") || strength.includes("Partial")) return "आंशिक";
  return strength;
}

/** Lagna one-liners for Hindi mode — the API's lagna_personality is English-only. */
export const LAGNA_HI: Record<number, string> = {
  0:  "मेष लग्न — साहसी, तत्पर, नेतृत्व-प्रिय। मंगल-शासित: ऊर्जा और पहल आपकी पहचान है।",
  1:  "वृषभ लग्न — स्थिर, धैर्यवान, सौंदर्य-प्रेमी। शुक्र-शासित: निर्माण और निष्ठा आपकी शक्ति है।",
  2:  "मिथुन लग्न — जिज्ञासु, वाक्-कुशल, बहुमुखी। बुध-शासित: संवाद आपकी प्रतिभा है।",
  3:  "कर्क लग्न — भावुक, पोषक, परिवार-केंद्रित। चंद्र-शासित: संवेदना आपकी शक्ति है।",
  4:  "सिंह लग्न — गरिमामय, उदार, स्वाभिमानी। सूर्य-शासित: नेतृत्व आपके लिए सहज है।",
  5:  "कन्या लग्न — विश्लेषक, सेवा-भावी, परिष्कार-प्रिय। बुध-शासित: बारीकी आपकी कला है।",
  6:  "तुला लग्न — संतुलित, न्यायप्रिय, सौम्य। शुक्र-शासित: संबंध और सौंदर्य-बोध आपकी पूँजी हैं।",
  7:  "वृश्चिक लग्न — गहन, दृढ़, रहस्य-भेदक। मंगल-शासित: रूपांतरण आपकी शक्ति है।",
  8:  "धनु लग्न — आशावादी, धर्म-बुद्धि, स्पष्टवादी। गुरु-शासित: अर्थ की खोज आपका पथ है।",
  9:  "मकर लग्न — कर्मठ, अनुशासित, दीर्घ-दृष्टा। शनि-शासित: धैर्य से शिखर तक।",
  10: "कुम्भ लग्न — मौलिक, मानवतावादी, तंत्र-दृष्टा। शनि-शासित: समाज-हित आपकी दिशा है।",
  11: "मीन लग्न — करुणामय, कल्पनाशील, श्रद्धालु। गुरु-शासित: अंतर्ज्ञान आपका दीपक है।",
};
