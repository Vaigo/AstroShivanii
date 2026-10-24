/**
 * Build-time answers for the daily pages (Rahu Kaal, choghadiya, rashifal), computed once per build and baked
 * into the static HTML so crawlers, no-JS visitors and answer engines see real times, not "calculating…".
 * The deploy workflow rebuilds every night just after midnight IST; the live widgets (components/*Live.tsx)
 * compare the baked day with the visitor's India date and fetch live if a page is ever served late.
 *
 * SERVER-ONLY: imports from here belong in server components (pages, sitemap), never in "use client" files
 * (those import the shapes from lib/daily-data.ts). Transport, retries, test-mode refusal, the circuit
 * breaker and BAKE_STRICT live in lib/build-api.ts; on top of that every answer is checked here for its shape
 * and for being the day that was asked for, because a wrong time baked into a page is worse than none.
 */
import type {
  ChoghadiyaDayResult,
  RahuKaalResult,
  RashifalDailyResult,
  WeeklyRashifalResult,
} from "@/lib/api/types";
import { panchangBody } from "@/lib/api/endpoints";
import { BAKE_DATE, STRICT, bakeOr, buildPost, withDeadline } from "@/lib/build-api";
import type { ChoghadiyaBaked, RahuKaalBaked, RashifalAllBaked, RashifalBaked } from "@/lib/daily-data";
import { RAHU_SHOW_DAYS, isChoghadiyaDay, isRahuKaalResult, isRashifalDay, isWeeklyRashifal } from "@/lib/daily-data";
import { addDaysIso, weekdayEn, weekdayHi } from "@/lib/hi-date";
import type { SeoCity } from "@/lib/seo-cities";

export { BAKE_DATE };

/** Rahu Kaal days baked per city: the days shown plus two spare, so a page served up to two days late can
 *  still pick today's window instead of fetching. */
const BAKE_DAYS = RAHU_SHOW_DAYS + 2;

const bake = <T>(label: string, make: () => Promise<T>) => bakeOr<T, null>(label, make, null);

const cache = new Map<string, Promise<unknown>>();

/** generateMetadata and the page both need the answer: one fetch per key per build process. */
function once<T>(key: string, make: () => Promise<T | null>): Promise<T | null> {
  let p = cache.get(key) as Promise<T | null> | undefined;
  if (!p) {
    // In a build a miss is remembered, so generateMetadata and the page body do not both wait out the same
    // failure; a dev server forgets it, so one early miss does not stick until the dev server restarts.
    p = make().then((r) => {
      if (r === null && process.env.NODE_ENV === "development") cache.delete(key);
      return r;
    });
    cache.set(key, p);
  }
  return p;
}

// ── Rahu Kaal ───────────────────────────────────────────────────────────────────────────────────────────────

/** The panchang response carries no date, but it does carry `vara`: it must be the weekday of the date asked. */
function checkRahu(d: RahuKaalResult, date: string): void {
  if (!isRahuKaalResult(d)) throw new Error("rahu-kaal response has no usable windows");
  if (d.vara !== weekdayEn(date)) throw new Error(`rahu-kaal answered for a ${d.vara}, asked ${date} (${weekdayEn(date)})`);
}

export function bakedRahuKaal(city: SeoCity): Promise<RahuKaalBaked | null> {
  return once(`rahu:${city.slug}`, () =>
    bake(`rahu-kaal ${city.slug}`, async () => {
      const dates = Array.from({ length: BAKE_DAYS }, (_, i) => addDaysIso(BAKE_DATE, i));
      const days = await Promise.all(
        dates.map(async (date) => {
          try {
            const data = await buildPost<RahuKaalResult>("/v1/panchang/rahu-kaal", panchangBody(date, city.lat, city.lon, city.tz));
            checkRahu(data, date);
            return { date, weekdayHi: weekdayHi(date), data };
          } catch (e) {
            // today's row is the whole point of the page; a later day may be missing (shown as "—")
            if (date === BAKE_DATE || STRICT) throw e;
            return { date, weekdayHi: weekdayHi(date), data: null };
          }
        }),
      );
      return { days };
    }),
  );
}

// ── Choghadiya ──────────────────────────────────────────────────────────────────────────────────────────────

export function bakedChoghadiya(city: SeoCity): Promise<ChoghadiyaBaked | null> {
  return once(`chog:${city.slug}`, () =>
    bake(`choghadiya ${city.slug}`, async () => {
      // same request as fetchChoghadiyaDay in lib/api/endpoints.ts
      const data = await buildPost<ChoghadiyaDayResult>("/v1/muhurta/full", { date: BAKE_DATE, lat: city.lat, lon: city.lon, tz: city.tz });
      if (!isChoghadiyaDay(data)) throw new Error("choghadiya response is not a 16-period day");
      if (data.date && data.date !== BAKE_DATE) throw new Error(`choghadiya answered for ${data.date}, asked ${BAKE_DATE}`);
      if (data.vara && data.vara !== weekdayEn(BAKE_DATE)) throw new Error(`choghadiya answered for a ${data.vara}, asked ${BAKE_DATE} (${weekdayEn(BAKE_DATE)})`);
      return { date: BAKE_DATE, data };
    }),
  );
}

// ── Rashifal ────────────────────────────────────────────────────────────────────────────────────────────────

/** All 12 rashis for the build day (one call; every rashi page and the index share it). */
export function bakedRashifalAll(): Promise<RashifalAllBaked | null> {
  return once("rashifal:all", () =>
    bake("rashifal daily", async () => {
      // same request as fetchRashifal in lib/api/endpoints.ts, with the date pinned to India's day
      const data = await buildPost<RashifalDailyResult>("/v1/rashifal/daily", { date: BAKE_DATE, tz: 5.5 });
      if (!isRashifalDay(data)) throw new Error("rashifal response is not 12 complete rashis");
      if (data.date && data.date !== BAKE_DATE) throw new Error(`rashifal answered for ${data.date}, asked ${BAKE_DATE}`);
      return { date: BAKE_DATE, rashifal: data.rashifal };
    }),
  );
}

export function bakedRashifal(rashiIndex: number, rashiEn: string): Promise<RashifalBaked | null> {
  return once(`rashifal:${rashiIndex}`, async () => {
    const all = await bakedRashifalAll();
    const today = all?.rashifal.find((r) => r.rashi_index === rashiIndex);
    if (!all || !today) return null;
    // the week is a bonus (the live widget treats it that way too): a miss never fails the build
    let week: WeeklyRashifalResult | null = null;
    try {
      // same request as fetchWeeklyRashifal in lib/api/endpoints.ts
      const w = await withDeadline(buildPost<WeeklyRashifalResult>("/v1/rashifal/weekly", { rashi: rashiEn, date: BAKE_DATE, tz: 5.5 }));
      if (isWeeklyRashifal(w) && w.week_start === BAKE_DATE) week = w;
    } catch (e) {
      console.warn(`[bake] weekly rashifal ${rashiEn}: ${e instanceof Error ? e.message : String(e)}`);
    }
    return { date: all.date, today, week };
  });
}
