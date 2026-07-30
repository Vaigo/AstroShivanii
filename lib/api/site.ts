/** AstroShivanii account + admin API (/v1/site/* — internal endpoints).
 *  Separate from client.ts: these don't use the GrahaAPI key; auth is the
 *  user's own JWT (X-Site-Token) or the admin key (X-Admin-Key). */

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";
const TOKEN_KEY = "as-site-token";
const USER_KEY = "as-site-user";

export interface SiteUser { id: number; email: string; name: string; created_at?: number; }

export interface TuOrder {
  id: number; ref_code: string | null; category: string; question: string;
  language: string; amount_inr: number; status: string; narrated_by: string; created_at: number;
  name?: string; user_email?: string; dob?: string; tob?: string;
}

export interface SiteBooking {
  id: number; reading_slug: string; name: string; whatsapp: string;
  dob: string; tob: string; notes: string; amount_inr: number | null;
  status: string; created_at: number; user_email?: string; email?: string;
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
  return siteFetch<{ orders: TuOrder[]; bookings: SiteBooking[]; total_spent_inr: number }>(
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

/* ── admin ── */
export interface AdminOverview {
  users: { total: number; new_this_week: number };
  turant_uttar: {
    total: number; today: number; revenue_inr: number;
    by_category: Array<{ category: string; c: number }>;
    trend_14d: Array<{ d: string; c: number }>;
    narrated_by: Array<{ n: string; c: number }>;
  };
  bookings: { total: number; paid: number; by_reading: Array<{ reading_slug: string; c: number }> };
}
export interface AdminUserRow extends SiteUser {
  tu_count: number; booking_count: number; spent_inr: number; created_at: number;
}

const adminHeaders = (key: string) => ({ "X-Admin-Key": key });
export const adminOverview = (key: string) => siteFetch<AdminOverview>("/v1/site/admin/overview", { headers: adminHeaders(key) });
export const adminUsers = (key: string) => siteFetch<{ users: AdminUserRow[] }>("/v1/site/admin/users", { headers: adminHeaders(key) });
export const adminOrders = (key: string) => siteFetch<{ orders: TuOrder[] }>("/v1/site/admin/orders", { headers: adminHeaders(key) });
export const adminBookings = (key: string) => siteFetch<{ bookings: SiteBooking[] }>("/v1/site/admin/bookings", { headers: adminHeaders(key) });
