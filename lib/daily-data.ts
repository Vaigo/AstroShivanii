/**
 * Shapes and wording for the daily pages (Rahu Kaal, choghadiya, rashifal). The build computes each page's
 * answer once (lib/baked.ts) and bakes it into the static HTML; the live widgets start from that baked
 * answer and only fall back to fetching in the browser when it is no longer today's. This file has no
 * fetching and no browser APIs, so server pages (FAQ, meta description) and client widgets share it.
 */
import type {
  ChoghadiyaDayResult,
  ChoghadiyaPeriod,
  RahuKaalResult,
  RashiPrediction,
  RashifalDailyResult,
  WeeklyRashifalResult,
} from "@/lib/api/types";
import { fmtHi, weekdayHi } from "@/lib/hi-date";

export interface RahuKaalDay {
  date: string;
  weekdayHi: string;
  data: RahuKaalResult | null;
}
/** days[0] is the build day (India's date); the rest follow, a few more than the page shows so a page that is
 *  served a day or two late can still pick today's window out of it. */
export interface RahuKaalBaked {
  days: RahuKaalDay[];
}
export interface ChoghadiyaBaked {
  date: string;
  data: ChoghadiyaDayResult;
}
export interface RashifalBaked {
  date: string;
  today: RashiPrediction;
  week: WeeklyRashifalResult | null;
}
export interface RashifalAllBaked {
  date: string;
  rashifal: RashiPrediction[];
}

/** Days of Rahu Kaal a page shows (today + the next 6). */
export const RAHU_SHOW_DAYS = 7;

/**
 * The rows to show: the baked ones until the browser knows India's date (`today` is undefined while the HTML
 * is rendered and hydrated), then the window that starts today. `null` = the baked days cannot answer for
 * today (a page served long after its build, or today's baked row is missing): the widget must fetch live
 * instead of showing another day's times, or "not available", when the API could tell.
 */
export function pickRahuDays(days: RahuKaalDay[], today: string | undefined): RahuKaalDay[] | null {
  if (today === undefined) return days.slice(0, RAHU_SHOW_DAYS);
  const i = days.findIndex((d) => d.date === today);
  if (i < 0 || days.length - i < RAHU_SHOW_DAYS) return null;
  const window = days.slice(i, i + RAHU_SHOW_DAYS);
  return window[0].data ? window : null;
}

// ── response shape checks ───────────────────────────────────────────────────────────────────────────────────
// Used by the build (lib/baked.ts, before anything is baked) and by the widgets' live fetches (before a
// response reaches setState): a 200 with an unexpected body must become the "not available" state, never a
// render crash that throws away the baked answer already on the page.

const isHm = (s: unknown): s is string => typeof s === "string" && /^\d{1,2}:\d{2}/.test(s);
const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null;

export function isRahuKaalResult(d: unknown): d is RahuKaalResult {
  if (!isObj(d)) return false;
  const windows = [d.rahu_kaal, d.gulika_kaal, d.yamaganda];
  return windows.every((w) => isObj(w) && isHm(w.start) && isHm(w.end)) && isHm(d.sunrise) && isHm(d.sunset);
}

export function isChoghadiyaDay(d: unknown): d is ChoghadiyaDayResult {
  if (!isObj(d) || !Array.isArray(d.choghadiya) || d.choghadiya.length !== 16) return false;
  const periods = d.choghadiya.every(
    (p) => isObj(p) && (p.type === "day" || p.type === "night") && typeof p.name === "string" && typeof p.quality === "string" && isHm(p.start) && isHm(p.end),
  );
  return periods && isObj(d.abhijit) && isHm(d.abhijit.start) && isHm(d.abhijit.end) && isHm(d.sunrise) && isHm(d.sunset);
}

export function isRashifalDay(d: unknown): d is RashifalDailyResult {
  if (!isObj(d) || !Array.isArray(d.rashifal) || d.rashifal.length !== 12) return false;
  return d.rashifal.every(
    (p) =>
      isObj(p) &&
      typeof p.rashi_index === "number" &&
      typeof p.overall_stars === "number" &&
      isObj(p.domain_stars) &&
      isObj(p.lucky) &&
      typeof p.lucky.number === "number" &&
      Array.isArray(p.lucky.colors) &&
      Array.isArray(p.auspicious_hours) &&
      isObj(p.predictions_hi) &&
      typeof p.predictions_hi.overall === "string",
  );
}

export function isWeeklyRashifal(w: unknown): w is WeeklyRashifalResult {
  return (
    isObj(w) &&
    typeof w.week_start === "string" &&
    typeof w.week_end === "string" &&
    Array.isArray(w.days) &&
    w.days.length > 0 &&
    w.days.every((d) => isObj(d) && typeof d.date === "string" && typeof d.weekday === "string" && isObj(d.domain_stars))
  );
}

export const CHOGHADIYA_NAME_HI: Record<string, string> = {
  Amrit: "अमृत", Shubh: "शुभ", Labh: "लाभ", Char: "चर",
  Kaal: "काल", Rog: "रोग", Udveg: "उद्वेग",
};
export const CHOGHADIYA_QUALITY_HI: Record<string, string> = {
  Excellent: "सर्वश्रेष्ठ", Good: "शुभ", Neutral: "सामान्य", Bad: "अशुभ",
};

const win = (w: { start: string; end: string }) => `${w.start}–${w.end}`;
const toMin = (hm: string) => {
  const [h, m] = hm.split(":").map(Number);
  return h * 60 + m;
};

/** "24 अक्टूबर 2026 (शनिवार) को जोधपुर में राहु काल 09:12 से 10:37 तक है। …" Present tense: the sentence is
 *  read long after it is written, and the date in it says which day it is about. */
export function rahuKaalSentence(cityHi: string, day: RahuKaalDay & { data: RahuKaalResult }): string {
  const d = day.data;
  return (
    `${fmtHi(day.date)} (${day.weekdayHi}) को ${cityHi} में राहु काल ${d.rahu_kaal.start} से ${d.rahu_kaal.end} तक है। ` +
    `गुलिक काल ${win(d.gulika_kaal)} और यमगण्ड ${win(d.yamaganda)}; सूर्योदय ${d.sunrise}, सूर्यास्त ${d.sunset}।`
  );
}

/** What a dated first FAQ answer ends with, so it reads on its own (as a quoted snippet): which day it is
 *  about, and that what the page shows follows each day. `what`: "राहु काल", "चौघड़िया", "राशिफल". */
export function datedTail(date: string, what: string): string {
  return `यह ${what} ${fmtHi(date)} का है; पेज पर दिखने वाला ${what} हर दिन की तारीख के अनुसार अपने-आप बदल जाता है।`;
}

/** The auspicious (Excellent/Good) daytime choghadiya, in clock order. */
export function shubhDayPeriods(data: ChoghadiyaDayResult): ChoghadiyaPeriod[] {
  return data.choghadiya.filter((p) => p.type === "day" && (p.quality === "Excellent" || p.quality === "Good"));
}

/** At most `n` of the auspicious daytime periods, the best (Excellent) first, shown in clock order. For a
 *  snippet that has room for only a few: the first three by clock would drop Amrit on some weekdays. */
export function bestShubhPeriods(data: ChoghadiyaDayResult, n: number): ChoghadiyaPeriod[] {
  const all = shubhDayPeriods(data);
  const chosen = [...all.filter((p) => p.quality === "Excellent"), ...all.filter((p) => p.quality !== "Excellent")].slice(0, n);
  return chosen.sort((a, b) => toMin(a.start) - toMin(b.start));
}

export function periodLabel(p: ChoghadiyaPeriod): string {
  return `${CHOGHADIYA_NAME_HI[p.name] ?? p.name} ${p.start}–${p.end}`;
}

/** "अभिजीत मुहूर्त 11:45–12:33", with the classical Wednesday exception the site's own FAQ states (the API
 *  still returns the window on a Wednesday, noting "Avoid on Wednesday"). */
export function abhijitText(date: string, abhijit: { start: string; end: string }): string {
  const base = `अभिजीत मुहूर्त ${win(abhijit)}`;
  return weekdayHi(date) === "बुधवार" ? `${base} (बुधवार को अभिजीत मान्य नहीं माना जाता)` : base;
}

/** "24 अक्टूबर 2026 को जोधपुर में दिन के शुभ चौघड़िया — अमृत 06:12–07:40 · … । अभिजीत मुहूर्त 11:45–12:33।" */
export function choghadiyaSentence(cityHi: string, date: string, data: ChoghadiyaDayResult): string {
  const shubh = shubhDayPeriods(data).map(periodLabel).join(" · ");
  return (
    `${fmtHi(date)} को ${cityHi} में दिन के शुभ चौघड़िया — ${shubh || "कोई नहीं"}। ` +
    `${abhijitText(date, data.abhijit)}। काल, रोग और उद्वेग में नए काम टालें।`
  );
}

/**
 * Why this city's sunrise is not Delhi's, in numbers the build has: "आज जोधपुर में सूर्योदय 06:42 है, दिल्ली
 * (06:27) से 15 मिनट बाद; दिन की लंबाई 11 घंटे 20 मिनट।" Gives each city page something no other city's page
 * has, and answers the "why is it different" question with today's figures.
 */
export function sunriseVsDelhi(
  cityHi: string,
  city: { sunrise: string; sunset: string },
  delhi: { sunrise: string; sunset: string },
): string {
  const delta = toMin(city.sunrise) - toMin(delhi.sunrise);
  const dayLen = toMin(city.sunset) - toMin(city.sunrise);
  const vs =
    delta === 0 ? `दिल्ली (${delhi.sunrise}) के बराबर` : `दिल्ली (${delhi.sunrise}) से ${Math.abs(delta)} मिनट ${delta < 0 ? "पहले" : "बाद"}`;
  return `आज ${cityHi} में सूर्योदय ${city.sunrise} है, ${vs}; सूर्यास्त ${city.sunset}, दिन की लंबाई ${Math.floor(dayLen / 60)} घंटे ${dayLen % 60} मिनट।`;
}

/** The longest of `candidates` that fits a search-result description (≈158 characters). */
export function fitDescription(...candidates: string[]): string {
  return candidates.find((c) => c.length <= 158) ?? candidates[candidates.length - 1];
}

export function stars(n: number): string {
  return "★".repeat(n) + "☆".repeat(Math.max(0, 5 - n));
}

// ── rashifal: the figures the day's computation really produces ─────────────────────────────────────────────

export const DOMAINS_HI: [keyof RashiPrediction["domain_stars"], string][] = [
  ["career", "करियर"], ["finance", "धन"], ["love", "प्रेम"], ["health", "स्वास्थ्य"], ["spirit", "मनोबल"],
];

// The five areas of life are shown each on its own, with its own stars and the good/bad word that goes with
// them. There is deliberately NO combined "overall" star, sentence or weekly average: the API's overall is
// the five scores added up and divided by 3, so most days read "5 stars, success everywhere" while one area
// shows 1 star. These are the API's own words for each star level (backend _stars_label).
const STAR_LABEL_HI: Record<number, string> = { 5: "उत्कृष्ट", 4: "बहुत अच्छा", 3: "ठीक", 2: "सतर्क", 1: "कठिन" };
const STAR_LABEL_EN: Record<number, string> = { 5: "Excellent", 4: "Good", 3: "Moderate", 2: "Cautious", 1: "Challenging" };
const clampStar = (n: number) => Math.min(5, Math.max(1, Math.round(n)));

export function starLabelHi(n: number): string {
  return STAR_LABEL_HI[clampStar(n)];
}
export function starLabelEn(n: number): string {
  return STAR_LABEL_EN[clampStar(n)];
}
/** Colour for a star level's word: good green, bad maroon, middle muted (as the choghadiya tables do). */
export function starTone(n: number): string {
  const s = clampStar(n);
  return s >= 4 ? "#1a7a3a" : s <= 2 ? "var(--maroon)" : "var(--muted)";
}

/** The area with the most stars (the first of equals, in the order above). Computed per rashi and per day. */
export function strongestDomain(p: RashiPrediction): { label: string; stars: number } {
  let best = DOMAINS_HI[0];
  for (const d of DOMAINS_HI) if (p.domain_stars[d[0]] > p.domain_stars[best[0]]) best = d;
  return { label: best[1], stars: p.domain_stars[best[0]] };
}

/** The area with the fewest stars (the first of equals). */
export function weakestDomain(p: RashiPrediction): { label: string; stars: number } {
  let worst = DOMAINS_HI[0];
  for (const d of DOMAINS_HI) if (p.domain_stars[d[0]] < p.domain_stars[worst[0]]) worst = d;
  return { label: worst[1], stars: p.domain_stars[worst[0]] };
}

const COLOR_HI: Record<string, string> = {
  Black: "काला", Blue: "नीला", Brown: "भूरा", Coral: "मूंगिया", "Electric Blue": "गहरा नीला", Gold: "सुनहरा",
  Green: "हरा", Lavender: "लैवेंडर", "Light Blue": "हल्का नीला", Maroon: "मैरून", "Navy Blue": "गहरा नीला",
  Orange: "नारंगी", Pink: "गुलाबी", Purple: "बैंगनी", Red: "लाल", "Sea Green": "समुद्री हरा", Silver: "चांदी जैसा",
  White: "सफेद", Yellow: "पीला",
};
/** Lucky colours in Hindi (an unknown name stays as the API sent it). */
export function colorsHi(colors: string[]): string {
  return colors.map((c) => COLOR_HI[c] ?? c).join(", ");
}

/** "24 अक्टूबर 2026 को मेष राशि के सितारे — करियर ★☆☆☆☆ (कठिन), धन …। शुभ अंक 9, शुभ रंग लाल, मूंगिया।" Only the
 *  figures the day's computation produces, each area with its own good/bad word (no template prose, no overall),
 *  so it is true for exactly this rashi and day. */
export function rashifalFacts(rashiHi: string, date: string, p: RashiPrediction): string {
  const per = DOMAINS_HI.map(([k, label]) => `${label} ${stars(p.domain_stars[k])} (${starLabelHi(p.domain_stars[k])})`).join(", ");
  return `${fmtHi(date)} को ${rashiHi} राशि के सितारे — ${per}। शुभ अंक ${p.lucky.number}, शुभ रंग ${colorsHi(p.lucky.colors)}।`;
}
