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
  TurantUttarAIResult,
  MahadashaListResult,
} from "./types";

export function fetchKundli(birth: BirthRequest): Promise<KundliFullResult> {
  return post("/v1/kundli/full", birth);
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

/** तुरंत उत्तर paid answer — code computes the chart dossier server-side;
 *  Haiku narrates it when configured, otherwise a rule-based narration
 *  built from the same real facts is returned instead. `context` is the
 *  user's optional 2-3 line situation — framing only, never evidence. */
export function fetchTurantUttarAI(
  birth: BirthRequest, category: string, question: string, language: "en" | "hi", context?: string
): Promise<TurantUttarAIResult> {
  return post("/v1/ai/turant-uttar", { birth, category, question, language, context });
}
