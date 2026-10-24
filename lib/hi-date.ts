/**
 * Date helpers shared by the daily pages (Rahu Kaal, choghadiya, rashifal). Everything works on plain
 * YYYY-MM-DD strings: the dates are India's calendar days, never a visitor's browser date or the build
 * server's UTC date (just after midnight in India UTC is still "yesterday").
 */

// Anusvara spellings (नवंबर, दिसंबर), the ones Hindi news and search use
export const MONTHS_HI = ["जनवरी", "फ़रवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"];
export const WEEKDAYS_HI = ["रविवार", "सोमवार", "मंगलवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार"];

/** India's calendar date right now as YYYY-MM-DD. */
export function istIsoNow(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
}

/** India's clock right now, in minutes after midnight. */
export function istMinutesNow(): number {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? 0);
  return get("hour") * 60 + get("minute");
}

/** `iso` plus `n` days (calendar arithmetic, no timezone involved). */
export function addDaysIso(iso: string, n: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
}

export function weekdayHi(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return WEEKDAYS_HI[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
}

const WEEKDAYS_EN = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/** "Saturday": the name the API's `vara` field uses, for checking a response against the date asked for. */
export function weekdayEn(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return WEEKDAYS_EN[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
}

/** "24 अक्टूबर 2026" */
export function fmtHi(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS_HI[m - 1]} ${y}`;
}

/** "24 अक्टूबर" (the year is in the heading or the column above) */
export function fmtHiShort(iso: string): string {
  const [, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS_HI[m - 1]}`;
}
