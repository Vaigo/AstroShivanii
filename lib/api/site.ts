/** AstroShivanii account + admin API (/v1/site/* — internal endpoints).
 *  Separate from client.ts: these don't use the GrahaAPI key; auth is the
 *  user's own JWT (X-Site-Token) or the admin key (X-Admin-Key). */

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";
const TOKEN_KEY = "as-site-token";
const USER_KEY = "as-site-user";

import type { BirthRequest, TurantUttarAIResult, EventScoreResult, RectEvent, NumerologySuiteResult, VarshphalYearlyResult, NameCorrectionResult } from "./types";

export interface SiteUser { id: number; email: string; name: string; created_at?: number; }

export interface TuOrder {
  id: number; ref_code: string | null; category: string; question: string;
  language: string; amount_inr: number; status: string; narrated_by: string; created_at: number;
  name?: string; user_email?: string; dob?: string; tob?: string;
  /** Real Anthropic API cost for this answer's narration, in USD — null when
   *  narrated_by is 'template' (no AI call was made) or on pre-tracking rows. */
  ai_cost_usd?: number | null;
}

export interface SiteBooking {
  id: number; reading_slug: string; name: string; whatsapp: string;
  dob: string; tob: string; notes: string; amount_inr: number | null;
  status: string; created_at: number; user_email?: string; email?: string;
  /** Only set for the kundli-report product — 'ready' means the PDF can be downloaded. */
  report_status?: string | null;
}

export interface RectificationOrder {
  id: number; ref_code: string | null; dob: string; day_unknown: number;
  approx_tob: string; events_count: number; best_date: string | null;
  best_tob: string | null; confidence_pct: number | null;
  amount_inr: number; status: string; created_at: number;
}

export class SiteApiError extends Error {
  constructor(public code: string, message: string) { super(message); }
}

async function siteFetch<T>(path: string, opts: { body?: unknown; headers?: Record<string, string>; method?: string } = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: opts.method ?? (opts.body !== undefined ? "POST" : "GET"),
    headers: { "Content-Type": "application/json", ...(opts.headers ?? {}) },
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
  });
  const json = await res.json();
  if (!res.ok || json?.success === false) {
    const err = json?.error ?? json?.detail ?? {};
    throw new SiteApiError(err.code ?? "ERROR", err.message ?? `HTTP ${res.status}`);
  }
  return json.data ?? json;
}

/* ── token storage ── */
export function getSiteToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}
export function getStoredUser(): SiteUser | null {
  if (typeof window === "undefined") return null;
  try { return JSON.parse(window.localStorage.getItem(USER_KEY) ?? "null"); } catch { return null; }
}
export function storeSession(token: string, user: SiteUser) {
  window.localStorage.setItem(TOKEN_KEY, token);
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
}
export function clearSession() {
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
}

/* ── auth ── */
export async function siteRegister(email: string, password: string, name: string) {
  const d = await siteFetch<{ token: string; user: SiteUser }>("/v1/site/auth/register", { body: { email, password, name } });
  storeSession(d.token, d.user);
  return d.user;
}
export async function siteLogin(email: string, password: string) {
  const d = await siteFetch<{ token: string; user: SiteUser }>("/v1/site/auth/login", { body: { email, password } });
  storeSession(d.token, d.user);
  return d.user;
}

/* ── profile ── */
export function fetchHistory() {
  return siteFetch<{ orders: TuOrder[]; bookings: SiteBooking[]; rectifications: RectificationOrder[]; total_spent_inr: number }>(
    "/v1/site/me/history", { headers: { "X-Site-Token": getSiteToken() ?? "" } });
}

/* ── booking intent (fire-and-forget; never blocks the booking UX) ── */
export function recordBookingIntent(b: {
  reading_slug: string; name: string; email: string; whatsapp: string;
  dob: string; tob: string; notes: string; amount_inr: number;
}) {
  return siteFetch("/v1/site/bookings/initiate", {
    body: b, headers: { "X-Site-Token": getSiteToken() ?? "" },
  }).catch(() => null);
}

/** तुरंत उत्तर — AstroShivanii-only endpoint. Deliberately NOT on the
 *  GrahaAPI-keyed client (./client.ts): this must never be reachable with
 *  a GrahaAPI developer key, only from this site. */
export function fetchTurantUttarAI(
  birth: BirthRequest, category: string, question: string, language: "en" | "hi",
  context?: string, refCode?: string, siteToken?: string | null, razorpayOrderId?: string,
  partner?: BirthRequest
): Promise<TurantUttarAIResult> {
  return siteFetch<TurantUttarAIResult>("/v1/site/turant-uttar", {
    body: { birth, category, question, language, context, ref_code: refCode, razorpay_order_id: razorpayOrderId, partner },
    headers: siteToken ? { "X-Site-Token": siteToken } : undefined,
  });
}

/* ── payments (Razorpay — one account serves both sites) ── */
export interface CreatedOrder { order_id: string; amount: number; currency: string; key_id: string; }

export function createPaymentOrder(body: {
  kind: "booking" | "turant-uttar" | "time-rectification" | "numerology-suite" | "varshphal-yearly" | "name-correction" | "palmistry" | "palmistry-plus" | "muhurta-personal"; slug: string;
  name?: string; email?: string; whatsapp?: string; dob?: string; tob?: string; notes?: string; ref_code?: string;
  // birth place — required for the birth-chart/kundli-report product so the
  // auto-generated PDF uses an accurate chart; harmless to omit elsewhere.
  lat?: number; lon?: number; tz?: number; gender?: "male" | "female";
}) {
  return siteFetch<CreatedOrder>("/v1/site/payments/create-order", {
    body, headers: { "X-Site-Token": getSiteToken() ?? "" },
  });
}

export function verifyPayment(body: {
  razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string;
}) {
  return siteFetch<{ verified: boolean }>("/v1/site/payments/verify", { body });
}

/** Time Rectification's compute step — hard-gated server-side on a verified
 *  razorpay_order_id (no self-attest fallback, unlike तुरंत उत्तर). */
export function fetchRectificationResult(body: {
  dob: string; day_unknown: boolean; approx_tob: string;
  time_range_minutes?: number; step_minutes?: number;
  lat: number; lon: number; tz: number; events: RectEvent[];
  name?: string; ref_code?: string; razorpay_order_id: string;
}): Promise<EventScoreResult> {
  return siteFetch<EventScoreResult>("/v1/site/rectification", {
    body, headers: { "X-Site-Token": getSiteToken() ?? "" },
  });
}

/** Numerology Compatibility Suite's compute step — hard-gated server-side on
 *  a verified razorpay_order_id (no self-attest fallback), same pattern as
 *  Time Rectification. */
export function fetchNumerologySuiteResult(body: {
  dob: string; name?: string; system?: "chaldean" | "pythagorean";
  ref_code?: string; razorpay_order_id: string;
}): Promise<NumerologySuiteResult> {
  return siteFetch<NumerologySuiteResult>("/v1/site/numerology-suite", {
    body, headers: { "X-Site-Token": getSiteToken() ?? "" },
  });
}

/** Yearly Horoscope (Varshphal)'s compute step — hard-gated server-side on a
 *  verified razorpay_order_id, same pattern as Time Rectification. */
export function fetchVarshphalYearlyResult(body: {
  dob: string; tob?: string; lat: number; lon: number; tz: number;
  year?: number; ref_code?: string; razorpay_order_id: string;
}): Promise<VarshphalYearlyResult> {
  return siteFetch<VarshphalYearlyResult>("/v1/site/varshphal-yearly", {
    body, headers: { "X-Site-Token": getSiteToken() ?? "" },
  });
}

/** Name Correction's compute step — hard-gated server-side on a verified
 *  razorpay_order_id, same pattern as Numerology Suite. `dob` is the
 *  personal/business-owner's/reference birth date depending on category —
 *  the category itself is a frontend-only label, not sent to the backend. */
export function fetchNameCorrectionResult(body: {
  dob: string; name: string; system?: "chaldean" | "pythagorean";
  /** Optional — either parent's name adds a family_sync first-letter
   *  frequency analysis to the result (personal category only in the UI). */
  father_name?: string; mother_name?: string;
  ref_code?: string; razorpay_order_id: string;
}): Promise<NameCorrectionResult> {
  return siteFetch<NameCorrectionResult>("/v1/site/name-correction", {
    body, headers: { "X-Site-Token": getSiteToken() ?? "" },
  });
}

/* ── Personal Muhurta (शुभ मुहूर्त) ── */

export type MuhurtaPurpose =
  | "marriage" | "business" | "travel" | "education"
  | "griha_pravesh" | "vehicle_purchase" | "property_purchase" | "naamkaran";

export interface MuhurtaCaution { en: string; hi: string; }
export interface MuhurtaProfile {
  tob_given: boolean;
  birth_nakshatra: string;
  karaka: string;
  karaka_condition: { dignity: string; combust: boolean; retrograde: boolean; house: number; sign: string };
  fourth_lord: string;
  fourth_lord_dignity: string;
  sade_sati: boolean;
  dhaiyya: boolean;
  cautions: MuhurtaCaution[];
  strict: boolean;
}
export interface MuhurtaDate {
  date: string; weekday: string; nakshatra: string; tithi: string; paksha: string;
  tara: string; tara_quality: string; chandrabala_good: boolean;
  karaka_transit_ok: boolean; score: number; quality: "Excellent" | "Good" | "Fair";
  auspicious_slots: Array<{ choghadiya: string; start: string; end: string }>;
  notes: MuhurtaCaution[];
  // v2 weighted-method fields
  tithi_num: number; tithi_group: string;
  yoga: string; yoga_shubh: boolean;
  karana: string; karana_shubh: boolean;
  vaar_tier: "shubh" | "saumya" | "krur";
  nakshatra_ok: boolean;
  score_breakdown: { tara: number; yoga: number; karana: number; vaar: number; nakshatra: number; tithi: number };
  relaxed: MuhurtaCaution[];
  // marriage (dual-kundli) only
  partner?: { tara: string; tara_quality: string; chandrabala_good: boolean;
              moon_house_from_natal: number; score: number; quality: string };
  combined_score?: number;
}
export interface MuhurtaPreviewResult {
  // Counts-only teaser (2026-08-24): NOTHING computed is free — no dates, no
  // natal profile, no cautions/windows. tob_given is an input-quality flag.
  purpose: MuhurtaPurpose; from_date: string; to_date: string;
  total_found: number; excellent_count: number; tob_given: boolean;
}
export interface MuhurtaFullResult {
  purpose: MuhurtaPurpose; from_date: string; to_date: string;
  profile: MuhurtaProfile; profile2?: MuhurtaProfile; dates: MuhurtaDate[]; total_found: number;
  relaxation_applied: MuhurtaCaution[];
}

export interface MuhurtaBirth {
  dob: string; tob?: string; lat: number; lon: number; tz: number;
}
interface MuhurtaBirthBody {
  dob: string; tob?: string; lat: number; lon: number; tz: number;
  purpose: MuhurtaPurpose; ref_code?: string;
  /** Target month "YYYY-MM" — scan window clamps to it (within tomorrow→+92d). */
  month?: string;
  /** Marriage only: the second person's birth details — both kundlis are
   *  screened and only the common dates come back. */
  birth2?: MuhurtaBirth;
}

/** Free teaser: counts only — how many dates cleared the screening. Every
 *  computed detail (dates, profile, cautions, windows) is behind the ₹51. */
export function fetchMuhurtaPreview(body: MuhurtaBirthBody): Promise<MuhurtaPreviewResult> {
  return siteFetch<MuhurtaPreviewResult>("/v1/site/muhurta-personal/preview", { body });
}

/** Full 3-month best-dates list — hard-gated server-side on a verified
 *  razorpay_order_id, same trust model as Numerology Suite. */
export function fetchMuhurtaPersonal(body: MuhurtaBirthBody & { razorpay_order_id: string }): Promise<MuhurtaFullResult> {
  return siteFetch<MuhurtaFullResult>("/v1/site/muhurta-personal", {
    body, headers: { "X-Site-Token": getSiteToken() ?? "" },
  });
}

/* ── Palmistry (Hast Rekha Shastra) ── */

export interface PalmistryLine {
  present: boolean;
  length?: "short" | "medium" | "long";
  continuity?: "unbroken" | "broken" | "chained";
  confidence: number;
}
export interface PalmistryMark { shape: string; near?: string; confidence: number; }
export interface PalmistrySymbol { name: string; confidence: number; }
export interface PalmistryMount { prominence: "flat" | "average" | "prominent"; confidence: number; }
export interface PalmistryHand {
  handedness: "Left" | "Right";
  hand_detection_confidence?: number;
  image_quality_score: number;
  hand_shape: string;
  hand_shape_confidence: number;
  finger_ratios: Record<string, number>;
  mounts: Record<string, PalmistryMount>;
  lines: Record<string, PalmistryLine>;
  marks: PalmistryMark[];
  symbols: PalmistrySymbol[];
  narration_note?: string;
}
export interface PalmistryResult {
  opening: string; topic_insight: string; narrative: string; timing_note: string;
  remedies: string[]; tips: string[];
  /** आगे के संकेत — forward-looking classical readings, each naming its basis. */
  future_signs?: string[];
  /** सावधानी-संकेत — calm accident/loss cautions from measured features (or one reassurance line). */
  caution_signs?: string[];
  /** दिनांकित सावधानी-अवधियां — only when optional birth details were given; method never named. */
  timing_cautions?: string[];
  dossier: { primary_hand: PalmistryHand; other_hand?: PalmistryHand };
  narrated_by: "haiku" | "template";
  /** server-rendered PDF (photos embedded) — API path, null when render failed */
  pdf_url?: string | null;
  powered_by: string;
}

export interface PalmistryPrecheckVerdict {
  hand_detected: boolean;
  image_quality_score: number;
  verdict: "retake" | "usable" | "good";
  reason: "no_hand_detected" | "low_quality" | "borderline_quality" | null;
  message: string | null;
}
export interface PalmistryPrecheckResult {
  palm: PalmistryPrecheckVerdict;
  other_hand?: PalmistryPrecheckVerdict;
}

/** Free, no-payment, no-login pre-flight check — call this the moment a
 *  photo is selected, BEFORE the paywall, so a bad photo is caught and the
 *  user is told to retake it before they ever pay ₹299. Runs only the
 *  deterministic engine server-side (no Anthropic call), so it's cheap to
 *  call on every file selection. Deliberately NOT siteFetch (multipart). */
export function precheckPalmistryPhotos(args: { palmImage: File; otherHandImage?: File }): Promise<PalmistryPrecheckResult> {
  const form = new FormData();
  form.append("palm_image", args.palmImage);
  if (args.otherHandImage) form.append("other_hand_image", args.otherHandImage);

  return fetch(`${BASE}/v1/site/palmistry/precheck`, { method: "POST", body: form }).then(async (res) => {
    const json = await res.json();
    if (!res.ok || json?.success === false) {
      const err = json?.error ?? json?.detail ?? {};
      throw new SiteApiError(err.code ?? "ERROR", err.message ?? `HTTP ${res.status}`);
    }
    return json.data as PalmistryPrecheckResult;
  });
}

/** Palmistry's compute step — hard-gated server-side on a verified
 *  razorpay_order_id (no self-attest fallback, same trust model as Time
 *  Rectification: a vision-AI call is too costly per attempt to leave a
 *  free path open). Deliberately NOT siteFetch — this sends real image
 *  files as multipart form data, not a JSON body. */
export function fetchPalmistryResult(args: {
  palmImage: File; otherHandImage: File;
  name?: string; gender?: "male" | "female"; ref_code?: string; razorpay_order_id: string; language: "en" | "hi";
  /** optional — unlocks the dated caution windows in the report */
  birth?: MuhurtaBirth | null;
}): Promise<PalmistryResult> {
  const form = new FormData();
  form.append("palm_image", args.palmImage);
  form.append("other_hand_image", args.otherHandImage);
  form.append("name", args.name ?? "");
  form.append("gender", args.gender ?? "");
  form.append("ref_code", args.ref_code ?? "");
  form.append("razorpay_order_id", args.razorpay_order_id);
  form.append("language", args.language);
  if (args.birth) {
    form.append("dob", args.birth.dob);
    if (args.birth.tob) form.append("tob", args.birth.tob);
    form.append("lat", String(args.birth.lat));
    form.append("lon", String(args.birth.lon));
    form.append("tz", String(args.birth.tz));
  }

  return fetch(`${BASE}/v1/site/palmistry`, {
    method: "POST", body: form,
    headers: { "X-Site-Token": getSiteToken() ?? "" },
  }).then(async (res) => {
    const json = await res.json();
    if (!res.ok || json?.success === false) {
      const err = json?.error ?? json?.detail ?? {};
      throw new SiteApiError(err.code ?? "ERROR", err.message ?? `HTTP ${res.status}`);
    }
    return json.data as PalmistryResult;
  });
}

/* ── admin ── */
export interface AdminOverview {
  users: { total: number; new_this_week: number };
  turant_uttar: {
    total: number; today: number; revenue_inr: number; ai_cost_usd: number;
    by_category: Array<{ category: string; c: number }>;
    trend_14d: Array<{ d: string; c: number }>;
    narrated_by: Array<{ n: string; c: number }>;
  };
  bookings: { total: number; paid: number; by_reading: Array<{ reading_slug: string; c: number }>; report_ai_cost_usd: number };
  palmistry: { total: number; revenue_inr: number; ai_cost_usd: number };
}
export interface AdminUserRow extends SiteUser {
  /** Sum of amount_inr across orders LINKED to this account (user_id set) —
   *  Turant Uttar has no login step, so most orders are unlinked guest
   *  checkouts and won't show here even though they were paid. Total real
   *  revenue lives on the Overview tab instead. */
  tu_count: number; booking_count: number; spent_inr: number; created_at: number;
}

const adminHeaders = (key: string) => ({ "X-Admin-Key": key });
export const adminOverview = (key: string) => siteFetch<AdminOverview>("/v1/site/admin/overview", { headers: adminHeaders(key) });
export const adminUsers = (key: string) => siteFetch<{ users: AdminUserRow[] }>("/v1/site/admin/users", { headers: adminHeaders(key) });
export const adminOrders = (key: string) => siteFetch<{ orders: TuOrder[] }>("/v1/site/admin/orders", { headers: adminHeaders(key) });
export const adminBookings = (key: string) => siteFetch<{ bookings: SiteBooking[] }>("/v1/site/admin/bookings", { headers: adminHeaders(key) });

/* ── kundli deluxe PDF reports ── */
export interface ReportJob {
  id: number; booking_id: number; status: string; error: string | null;
  created_at: number; updated_at: number; approved_at: number | null;
  name?: string; email?: string; whatsapp?: string; dob?: string; tob?: string; amount_inr?: number;
  /** Real Anthropic API cost across all ~27 section-narration calls for this
   *  one report, in USD — set once generation finishes. */
  ai_cost_usd?: number | null;
}

export const adminReports = (key: string) => siteFetch<{ reports: ReportJob[] }>("/v1/site/admin/reports", { headers: adminHeaders(key) });
export const adminReportApprove = (key: string, jobId: number) =>
  siteFetch<{ status: string }>(`/v1/site/admin/reports/${jobId}/approve`, { method: "POST", headers: adminHeaders(key) });
export const adminReportReject = (key: string, jobId: number) =>
  siteFetch<{ status: string }>(`/v1/site/admin/reports/${jobId}/reject`, { method: "POST", headers: adminHeaders(key) });

/** Both PDF endpoints require an auth header a plain <a href> can't send —
 *  fetch as a blob client-side, then hand the browser a local object URL. */
async function fetchPdfBlob(path: string, headers: Record<string, string>): Promise<string> {
  const res = await fetch(`${BASE}${path}`, { headers });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    const err = json?.error ?? json?.detail ?? {};
    throw new SiteApiError(err.code ?? "ERROR", err.message ?? `HTTP ${res.status}`);
  }
  const blob = await res.blob();
  return URL.createObjectURL(blob);
}

export const adminPreviewReportUrl = (key: string, jobId: number) =>
  fetchPdfBlob(`/v1/site/admin/reports/${jobId}/preview`, adminHeaders(key));

export async function downloadMyReport(bookingId: number, filename = "kundli-report.pdf") {
  const url = await fetchPdfBlob(`/v1/site/reports/${bookingId}/download`, { "X-Site-Token": getSiteToken() ?? "" });
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30_000);
}
