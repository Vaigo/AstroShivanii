import { post } from "./client";
import type {
  BirthRequest,
  MilanRequest,
  TarotRequest,
  TransitBirthRequest,
  KundliFullResult,
  AshtakootResult,
  RashifalDailyResult,
  TarotResult,
  SadeSatiResult,
  PanchangFullResult,
  RahuKaalResult,
  MuhurtaResult,
  MangalDoshaResult,
  FestivalsResult,
  MahadashaListResult,
  AscendantOptionsRequest,
  AscendantOptionsResult,
  KpRulingResult,
  LalKitabFullResult,
  LuckyColorsResult,
  SpecialYogasResult,
  DobRequest,
  NumerologyRequest,
  FirstLetterResult,
  PersonalYearResult,
  KarmicDebtResult,
  MissingNumbersResult,
  WeeklyRashifalResult,
  VarshphalYearLordResult,
  VarshphalMunthaResult,
} from "./types";

export function fetchKundli(birth: BirthRequest): Promise<KundliFullResult> {
  return post("/v1/kundli/full", birth);
}

/** Free birth-time-rectification teaser — all 12 ascendant windows for the
 *  birth day with traits, used to seed a starting approx_tob guess. */
export function fetchAscendantOptions(req: AscendantOptionsRequest): Promise<AscendantOptionsResult> {
  return post("/v1/rectification/ascendant-options", req);
}

/** KP ruling-planet corroboration for one already-resolved candidate time —
 *  a free, independent second signal shown alongside the paid result. */
export function fetchKpRulingPlanets(req: {
  dob: string; approx_tob: string; lat: number; lon: number; tz: number;
}): Promise<KpRulingResult> {
  return post("/v1/rectification/kp-ruling-planets", req);
}

/** Full Vimshottari mahadasha sequence — powers the dasha timeline ribbon. */
export function fetchMahadashaList(birth: BirthRequest): Promise<MahadashaListResult> {
  return post("/v1/dasha/mahadasha", birth);
}

export function fetchAshtakoot(req: MilanRequest): Promise<AshtakootResult> {
  return post("/v1/milan/ashtakoot", req);
}

/**
 * /v1/rashifal/daily is POST-only and takes no rashi — it returns all 12
 * rashis for the date. Callers pick the rashi client-side.
 */
export function fetchRashifal(date?: string, tz = 5.5): Promise<RashifalDailyResult> {
  return post("/v1/rashifal/daily", { date, tz });
}

export function fetchTarot(req: TarotRequest): Promise<TarotResult> {
  return post("/v1/tarot/draw", req);
}

export function fetchSadeSati(
  req: TransitBirthRequest
): Promise<SadeSatiResult> {
  return post("/v1/transits/sade-sati", req);
}

/** Panchang endpoints take a BirthRequest-shaped body where `dob` is the date.
 *  We anchor tob to 12:00 noon so the vara reflects the civil day (the vara
 *  changes at sunrise — a midnight anchor would return the previous day). */
function panchangBody(date: string, lat: number, lon: number, tz: number) {
  return { dob: date, tob: "12:00", lat, lon, tz };
}

export function fetchPanchang(
  date: string, lat: number, lon: number, tz: number
): Promise<PanchangFullResult> {
  return post("/v1/panchang/full", panchangBody(date, lat, lon, tz));
}

export function fetchRahuKaal(
  date: string, lat: number, lon: number, tz: number
): Promise<RahuKaalResult> {
  return post("/v1/panchang/rahu-kaal", panchangBody(date, lat, lon, tz));
}

export function fetchMuhurta(
  date: string, lat: number, lon: number, tz: number
): Promise<MuhurtaResult> {
  return post("/v1/panchang/muhurta", panchangBody(date, lat, lon, tz));
}

export function fetchMangalDosha(req: MilanRequest): Promise<MangalDoshaResult> {
  return post("/v1/milan/mangal-dosha", req);
}

export function fetchFestivals(
  date: string, lat: number, lon: number, tz: number
): Promise<FestivalsResult> {
  return post("/v1/panchang/festivals", panchangBody(date, lat, lon, tz));
}

// fetchTurantUttarAI moved to lib/api/site.ts — it's AstroShivanii-only and
// must never travel through the GrahaAPI-keyed client.

export function fetchLalKitab(birth: BirthRequest): Promise<LalKitabFullResult> {
  return post("/v1/lalkitab/full", birth);
}

export function fetchLuckyColors(birth: BirthRequest): Promise<LuckyColorsResult> {
  return post("/v1/remedies/colors", birth);
}

export function fetchSpecialYogas(birth: BirthRequest): Promise<SpecialYogasResult> {
  return post("/v1/rajyog/special-yogas", birth);
}

export function fetchFirstLetter(req: DobRequest): Promise<FirstLetterResult> {
  return post("/v1/numerology/first-letter", req);
}

export function fetchPersonalYear(req: NumerologyRequest): Promise<PersonalYearResult> {
  return post("/v1/numerology/personal-year", req);
}

export function fetchKarmicDebt(req: DobRequest): Promise<KarmicDebtResult> {
  return post("/v1/numerology/karmic-debt", req);
}

export function fetchMissingNumbers(req: DobRequest): Promise<MissingNumbersResult> {
  return post("/v1/numerology/missing-numbers", req);
}

/** BySignRequest.rashi is the English name (e.g. "Scorpio") — the exact
 *  string RashifalTool already keeps in its selectedRashi state. */
export function fetchWeeklyRashifal(rashi: string, date?: string, tz = 5.5): Promise<WeeklyRashifalResult> {
  return post("/v1/rashifal/weekly", { rashi, date, tz });
}

/** Free, real (non-fabricated) teasers for the paid Yearly Horoscope —
 *  cheap single-fact lookups, safe to expose pre-payment like every other
 *  free tool on the site. */
export function fetchVarshphalYearLord(birth: BirthRequest, year?: number): Promise<VarshphalYearLordResult> {
  return post(`/v1/varshphal/year-lord${year ? `?year=${year}` : ""}`, birth);
}

export function fetchVarshphalMuntha(birth: BirthRequest, year?: number): Promise<VarshphalMunthaResult> {
  return post(`/v1/varshphal/muntha${year ? `?year=${year}` : ""}`, birth);
}
