/**
 * Classical meaning snippets for the palmistry result page — shown alongside
 * the MEASURED dossier so a paying customer sees what each found feature
 * classically signifies, in plain language, without an extra AI call.
 * Tendency wording only (never guarantees, never lifespan/dates), following
 * the backend's palmistry_reference guardrails: life ≠ lifespan, a missing
 * fate line = self-made (explicitly not unlucky), mounts are photo-estimates.
 */

export const LINE_MEANINGS: Record<string, { hi: string; en: string }> = {
  life: {
    hi: "जीवन-शक्ति और दम-खम की रेखा — लंबाई जीवट दिखाती है, आयु नहीं",
    en: "vitality & stamina — its length shows life-force, not lifespan",
  },
  head: {
    hi: "सोचने के तरीके की रेखा — निर्णय-शैली और करियर-योग्यता की झलक",
    en: "how the mind works — decision style and career aptitude",
  },
  heart: {
    hi: "भावना और प्रेम-क्षमता की रेखा — रिश्तों में गहराई",
    en: "emotional nature — the capacity for deep bonds",
  },
  fate: {
    hi: "परिस्थितियों/सहारे का करियर-पथ में योगदान",
    en: "how much circumstance and support shape your path",
  },
  sun: {
    hi: "पहचान और प्रतिष्ठा की ओर झुकाव का शुभ संकेत",
    en: "a favorable pull toward recognition and reputation",
  },
  health: {
    hi: "दिनचर्या-संकेतक — साफ हो तो शुभ; रुकावट हो तो देखभाल का इशारा",
    en: "a routine-checker — clean is good; interruptions nudge self-care",
  },
  marriage: {
    hi: "किसी रिश्ते की जीवन पर छाप — शादी की तारीख़/गारंटी नहीं",
    en: "a relationship's imprint on life — never a wedding date or promise",
  },
};

export const LINE_QUALITY_NOTES: Record<string, { hi: string; en: string }> = {
  long: { hi: "लंबी — प्रभाव गहरा", en: "long — strong influence" },
  medium: { hi: "मध्यम", en: "medium" },
  short: { hi: "छोटी — फुर्तीला/व्यावहारिक रुझान", en: "short — quick, practical bent" },
  unbroken: { hi: "अखंड ✓", en: "unbroken ✓" },
  broken: { hi: "बीच में बदलाव के दौर", en: "phases of change along it" },
  chained: { hi: "उतार-चढ़ाव के संकेत", en: "hints of ebb and flow" },
};

export const MOUNT_MEANINGS: Record<string, { name_hi: string; name_en: string; hi: string; en: string }> = {
  jupiter: { name_hi: "गुरु पर्वत", name_en: "Jupiter", hi: "नेतृत्व व महत्वाकांक्षा", en: "leadership & ambition" },
  saturn: { name_hi: "शनि पर्वत", name_en: "Saturn", hi: "गंभीरता व अनुशासन", en: "seriousness & discipline" },
  sun: { name_hi: "सूर्य पर्वत", name_en: "Sun", hi: "रचनात्मक पहचान की चाह", en: "desire for creative recognition" },
  mercury: { name_hi: "बुध पर्वत", name_en: "Mercury", hi: "व्यापार-बुद्धि व संवाद", en: "business sense & communication" },
  venus: { name_hi: "शुक्र पर्वत", name_en: "Venus", hi: "प्रेम, गर्मजोशी, जीवन-रस", en: "love, warmth, vitality" },
  moon: { name_hi: "चंद्र पर्वत", name_en: "Moon", hi: "कल्पना व यात्रा-प्रेम", en: "imagination & love of travel" },
  mars_upper: { name_hi: "मंगल (द्वितीय)", name_en: "Mars (upper)", hi: "मानसिक साहस", en: "mental courage" },
  mars_lower: { name_hi: "मंगल (प्रथम)", name_en: "Mars (lower)", hi: "शारीरिक साहस व पहल", en: "physical courage & initiative" },
};

export const PROMINENCE_LABEL: Record<string, { hi: string; en: string }> = {
  prominent: { hi: "उभरा हुआ — यह गुण प्रबल", en: "prominent — this trait runs strong" },
  average: { hi: "सामान्य", en: "average" },
  flat: { hi: "सपाट — अभ्यास से विकसित होता है", en: "flat — grows with practice" },
};

export const SHAPE_MEANINGS: Record<string, { hi: string; en: string }> = {
  nimna: { hi: "सीधा-सादा, आवेग में तेज़", en: "straightforward, impulsive energy" },
  vargakar: { hi: "व्यावहारिक, नियम-प्रिय, समय के पक्के — व्यापार/ज़मीनी कामों की समझ", en: "practical, orderly, punctual — a grounded, business-ready temperament" },
  phaila: { hi: "सक्रिय, मेहनती, बेचैन ऊर्जा", en: "active, hardworking, restless energy" },
  darshanik: { hi: "गहरा, ठहर कर सोचने वाला मन", en: "a deep, deliberate thinker" },
  nukila: { hi: "कलात्मक स्वभाव", en: "an artistic temperament" },
  shantinishth: { hi: "शांत, कम भौतिक लालसा — दुर्लभ प्रकार", en: "calm, low material craving — a rare type" },
  mishrit: { hi: "मिला-जुला, लचीला स्वभाव — सबसे आम प्रकार", en: "a blended, adaptable nature — the most common type" },
};

/** Split "…**key phrase**…" narration into segments for <strong> rendering. */
export function splitBold(text: string): Array<{ bold: boolean; text: string }> {
  return text.split(/\*\*(.+?)\*\*/g).map((seg, i) => ({ bold: i % 2 === 1, text: seg })).filter((s) => s.text !== "");
}
