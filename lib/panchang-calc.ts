/** Client-side panchang derivations: Choghadiya, Hora, Panchak, Bhadra.
 *
 *  Choghadiya and Hora are pure arithmetic over sunrise/sunset + weekday —
 *  the sequences below are the fixed classical tables (same ones printed in
 *  traditional panchangs). Night windows use the same day's sunrise as an
 *  approximation of the next sunrise (error ≤ ~2 min — noted in the UI). */

export interface TimeSlot {
  name: string;        // चोघड़िया name or hora lord (Hindi)
  start: string;       // "HH:MM"
  end: string;
  quality: "good" | "neutral" | "bad";
}

/* ── helpers ── */
function toMin(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}
function toHHMM(min: number): string {
  const m = ((Math.round(min) % 1440) + 1440) % 1440;
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
}

/* ── Choghadiya ───────────────────────────────────────────────────────────── */

const CHOG_QUALITY: Record<string, "good" | "neutral" | "bad"> = {
  "अमृत": "good", "शुभ": "good", "लाभ": "good",
  "चल": "neutral",
  "उद्वेग": "bad", "काल": "bad", "रोग": "bad",
};

/** Classical day/night sequences per weekday (0=Sunday … 6=Saturday).
 *  Each lists the first 7 slots; the 8th always repeats the 1st. */
const CHOG_DAY: Record<number, string[]> = {
  0: ["उद्वेग", "चल", "लाभ", "अमृत", "काल", "शुभ", "रोग"],
  1: ["अमृत", "काल", "शुभ", "रोग", "उद्वेग", "चल", "लाभ"],
  2: ["रोग", "उद्वेग", "चल", "लाभ", "अमृत", "काल", "शुभ"],
  3: ["लाभ", "अमृत", "काल", "शुभ", "रोग", "उद्वेग", "चल"],
  4: ["शुभ", "रोग", "उद्वेग", "चल", "लाभ", "अमृत", "काल"],
  5: ["चल", "लाभ", "अमृत", "काल", "शुभ", "रोग", "उद्वेग"],
  6: ["काल", "शुभ", "रोग", "उद्वेग", "चल", "लाभ", "अमृत"],
};

const CHOG_NIGHT: Record<number, string[]> = {
  0: ["शुभ", "अमृत", "चल", "रोग", "काल", "लाभ", "उद्वेग"],
  1: ["चल", "रोग", "काल", "लाभ", "उद्वेग", "शुभ", "अमृत"],
  2: ["काल", "लाभ", "उद्वेग", "शुभ", "अमृत", "चल", "रोग"],
  3: ["उद्वेग", "शुभ", "अमृत", "चल", "रोग", "काल", "लाभ"],
  4: ["अमृत", "चल", "रोग", "काल", "लाभ", "उद्वेग", "शुभ"],
  5: ["रोग", "काल", "लाभ", "उद्वेग", "शुभ", "अमृत", "चल"],
  6: ["लाभ", "उद्वेग", "शुभ", "अमृत", "चल", "रोग", "काल"],
};

function buildSlots(names: string[], startMin: number, span: number): TimeSlot[] {
  const seq = [...names, names[0]]; // 8th repeats the 1st
  const step = span / 8;
  return seq.map((name, i) => ({
    name,
    start: toHHMM(startMin + i * step),
    end: toHHMM(startMin + (i + 1) * step),
    quality: CHOG_QUALITY[name],
  }));
}

export function choghadiya(
  weekdayIndex: number,   // 0=Sunday … 6=Saturday (panchang vara.index)
  sunrise: string,
  sunset: string
): { day: TimeSlot[]; night: TimeSlot[] } {
  const sr = toMin(sunrise);
  const ss = toMin(sunset);
  const dayLen = ss - sr;
  const nightLen = 1440 - dayLen; // until (approx.) next sunrise
  return {
    day: buildSlots(CHOG_DAY[weekdayIndex] ?? CHOG_DAY[0], sr, dayLen),
    night: buildSlots(CHOG_NIGHT[weekdayIndex] ?? CHOG_NIGHT[0], ss, nightLen),
  };
}

/* ── Hora (planetary hours) ──────────────────────────────────────────────── */

const HORA_ORDER = ["सूर्य", "शुक्र", "बुध", "चंद्र", "शनि", "गुरु", "मंगल"];
/** First hora of the day belongs to the weekday lord. */
const DAY_LORD_INDEX: Record<number, number> = { 0: 0, 1: 3, 2: 6, 3: 2, 4: 5, 5: 1, 6: 4 };
const HORA_QUALITY: Record<string, "good" | "neutral" | "bad"> = {
  "गुरु": "good", "शुक्र": "good", "चंद्र": "good", "बुध": "good",
  "सूर्य": "neutral",
  "शनि": "bad", "मंगल": "bad",
};

export function horas(
  weekdayIndex: number,
  sunrise: string,
  sunset: string
): TimeSlot[] {
  const sr = toMin(sunrise);
  const ss = toMin(sunset);
  const step = (ss - sr) / 12; // 12 day horas
  const startIdx = DAY_LORD_INDEX[weekdayIndex] ?? 0;
  return Array.from({ length: 12 }, (_, i) => {
    const lord = HORA_ORDER[(startIdx + i) % 7];
    return {
      name: lord,
      start: toHHMM(sr + i * step),
      end: toHHMM(sr + (i + 1) * step),
      quality: HORA_QUALITY[lord],
    };
  });
}

/* ── Panchak & Bhadra ────────────────────────────────────────────────────── */

/** Panchak: Moon in the 2nd half of Dhanishtha (index 22, progress ≥ 0.5)
 *  through Revati (index 26). */
export function isPanchak(nakshatraIndex: number, progress: number): boolean {
  if (nakshatraIndex >= 23 && nakshatraIndex <= 26) return true;
  return nakshatraIndex === 22 && progress >= 0.5;
}

/** Bhadra: the Vishti karana — avoid starting auspicious work while it runs. */
export function isBhadra(karanaName: string): boolean {
  return /vishti|विष्टि/i.test(karanaName);
}
