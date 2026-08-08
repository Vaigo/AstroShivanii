/** Hindi renderings for API values the backend returns in English only.
 *  Sign/nakshatra Hindi comes from the API itself (sign_hi, name_hi) —
 *  these maps cover planets, dignities and lagna one-liners. */

/** Several endpoints (Milan, Numerology, Varshphal verdicts/themes/predictions)
 *  return a single field as "हिंदी / English" instead of two separate fields.
 *  Splits on that convention and returns the half matching isHi; falls back
 *  to the whole string unchanged if it isn't in that shape. */
export function pickLang(text: string | undefined | null, isHi: boolean): string {
  if (!text) return "";
  const parts = text.split(" / ");
  if (parts.length !== 2) return text;
  return isHi ? parts[0] : parts[1];
}

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

/** Classical remedy color names (remedies.py PLANET_COLORS) — English-only
 *  from the API; used by Lucky Colors and any other tool showing these. */
export const COLOR_HI: Record<string, string> = {
  Red: "लाल", Orange: "नारंगी", Saffron: "केसरिया", Gold: "सुनहरा",
  White: "सफ़ेद", Silver: "चांदी जैसा", Cream: "क्रीम", "Light Blue": "हल्का नीला",
  Scarlet: "गहरा लाल", "Blood Red": "रक्त लाल",
  Green: "हरा", "Light Green": "हल्का हरा", "Emerald Green": "पन्ना हरा", "Sea Green": "समुद्री हरा",
  Yellow: "पीला", "Golden Yellow": "सुनहरा पीला", "Turmeric Yellow": "हल्दी पीला",
  Pink: "गुलाबी", "Pastel tones": "हल्के पेस्टल रंग",
  Blue: "नीला", "Dark Blue": "गहरा नीला", "Electric Blue": "चमकीला नीला", Black: "काला",
  Navy: "नेवी नीला", "Navy Blue": "नेवी नीला",
  "Dark Grey": "गहरा स्लेटी", "Multi-coloured": "बहुरंगी", "Smoky Grey": "धुएँ-सा स्लेटी",
  Brown: "भूरा", "Dark/muddy tones": "गहरे व मटमैले रंग",
  Coral: "मूंगा रंग", Maroon: "मैरून", Purple: "बैंगनी", Lavender: "हल्का बैंगनी",
};
export const colorHi = (name: string) => COLOR_HI[name] ?? name;

/** Full weekday names — backend returns plain English (e.g. Python's
 *  strftime("%A") or a hardcoded "Tuesday") with no Hindi counterpart. */
export const WEEKDAY_HI: Record<string, string> = {
  Sunday: "रविवार", Monday: "सोमवार", Tuesday: "मंगलवार", Wednesday: "बुधवार",
  Thursday: "गुरुवार", Friday: "शुक्रवार", Saturday: "शनिवार",
};
export const weekdayHi = (name: string) => WEEKDAY_HI[name] ?? name;

/** The 27 nitya yogas (ephemeris.py YOGA_NAMES) — Panchang-specific, distinct
 *  from the Kundli raj-yoga vocabulary; no Hindi form exists in the backend. */
export const YOGA_NAMES_HI: Record<string, string> = {
  Vishkambha: "विष्कुम्भ", Priti: "प्रीति", Ayushman: "आयुष्मान", Saubhagya: "सौभाग्य",
  Shobhana: "शोभन", Atiganda: "अतिगण्ड", Sukarma: "सुकर्मा", Dhriti: "धृति",
  Shula: "शूल", Ganda: "गण्ड", Vriddhi: "वृद्धि", Dhruva: "ध्रुव",
  Vyaghata: "व्याघात", Harshana: "हर्षण", Vajra: "वज्र", Siddhi: "सिद्धि",
  Vyatipata: "व्यतीपात", Variyan: "वरीयान्", Parigha: "परिघ", Shiva: "शिव",
  Siddha: "सिद्ध", Sadhya: "साध्य", Shubha: "शुभ", Shukla: "शुक्ल",
  Brahma: "ब्रह्म", Indra: "इन्द्र", Vaidhriti: "वैधृति",
};
export const yogaNameHi = (name: string) => YOGA_NAMES_HI[name] ?? name;

/** The 11 karanas — half-tithi units (ephemeris.py KARANA_NAMES). */
export const KARANA_NAMES_HI: Record<string, string> = {
  Bava: "बव", Balava: "बालव", Kaulava: "कौलव", Taitula: "तैतिल", Garaja: "गरज",
  Vanija: "वणिज", Vishti: "विष्टि (भद्रा)", Shakuni: "शकुनि",
  Chatushpada: "चतुष्पद", Naga: "नाग", Kimstughna: "किंस्तुघ्न",
};
export const karanaNameHi = (name: string) => KARANA_NAMES_HI[name] ?? name;

/** ephemeris.py get_moon_phase() — a fixed 7-value enum. */
export const MOON_PHASE_HI: Record<string, string> = {
  "New Moon": "अमावस्या",
  "Waxing Crescent / First Quarter": "शुक्ल पक्ष — बढ़ता चंद्रमा",
  "Waxing Gibbous": "शुक्ल पक्ष — पूर्णिमा की ओर",
  "Full Moon": "पूर्णिमा",
  "Waning Gibbous": "कृष्ण पक्ष — घटता चंद्रमा",
  "Last Quarter": "कृष्ण पक्ष — अंतिम चौथाई",
  "Waning Crescent": "कृष्ण पक्ष — क्षीण चंद्रमा",
};
export const moonPhaseHi = (name: string) => MOON_PHASE_HI[name] ?? name;

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
