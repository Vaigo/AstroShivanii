import tzlookup from "tz-lookup";

/** IANA timezone name for coordinates — offline, no API call. */
export function timezoneNameFor(lat: number, lon: number): string {
  return tzlookup(lat, lon);
}

/**
 * UTC offset (in hours, e.g. 5.5, -4, 1) of an IANA timezone AT A SPECIFIC
 * HISTORICAL MOMENT — not "now". DST rules and even base offsets have changed
 * over the decades; Intl uses the full IANA tzdb, so a London birth in July
 * 1993 correctly resolves to +1 (BST) while January 1993 resolves to 0 (GMT).
 *
 * Technique: format a known UTC instant in the target zone, reinterpret the
 * wall-clock result as UTC, and diff. The instant is built from the birth
 * date + time treated as UTC — within one offset-width of the true moment,
 * which is exact everywhere except inside the 1–2h of a DST switch itself.
 */
export function utcOffsetHoursAt(tzName: string, dateStr: string, timeStr?: string): number {
  const [y, m, d] = dateStr.split("-").map(Number);
  const [hh, mm] = (timeStr || "12:00").split(":").map(Number);
  const probe = new Date(Date.UTC(y, m - 1, d, hh, mm, 0));

  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: tzName,
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
    hourCycle: "h23",
  });
  const parts: Record<string, string> = {};
  for (const p of dtf.formatToParts(probe)) {
    if (p.type !== "literal") parts[p.type] = p.value;
  }
  const asUtc = Date.UTC(
    Number(parts.year), Number(parts.month) - 1, Number(parts.day),
    Number(parts.hour), Number(parts.minute), Number(parts.second)
  );
  const offsetMinutes = (asUtc - probe.getTime()) / 60000;
  // snap to 15-minute grid (covers :30 and :45 zones, kills float noise)
  return Math.round(offsetMinutes / 15) * 0.25;
}

/** Convenience: coordinates + birth date/time → offset hours. */
export function utcOffsetForPlace(lat: number, lon: number, dateStr: string, timeStr?: string): number {
  return utcOffsetHoursAt(timezoneNameFor(lat, lon), dateStr, timeStr);
}

/** Minutes-since-midnight of `at`, AS OBSERVED in `tzName` — not the
 *  browser's own timezone. Powers live "now" markers/countdowns that must
 *  reflect the queried place's clock, not the visitor's device. */
export function nowMinutesInZone(tzName: string, at: Date): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: tzName, hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  });
  const parts: Record<string, string> = {};
  for (const p of dtf.formatToParts(at)) if (p.type !== "literal") parts[p.type] = p.value;
  return Number(parts.hour) * 60 + Number(parts.minute);
}

/** "YYYY-MM-DD" of `at` AS OBSERVED in `tzName` — for deciding whether the
 *  panchang currently on screen is "today" IN THAT PLACE, not the browser's. */
export function todayInZone(tzName: string, at: Date): string {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: tzName, year: "numeric", month: "2-digit", day: "2-digit",
  });
  const parts: Record<string, string> = {};
  for (const p of dtf.formatToParts(at)) if (p.type !== "literal") parts[p.type] = p.value;
  return `${parts.year}-${parts.month}-${parts.day}`;
}
