/**
 * The one way the static build talks to the GrahaAPI (Rahu Kaal, choghadiya and rashifal answers in
 * lib/baked.ts, the muhurta lists, the festival calendars). The deploy workflow rebuilds every night, so a
 * hiccup in that one run decides what crawlers see for the next 24 hours; this keeps the build from shipping
 * wrong or half-empty pages:
 *  - a test-mode (sk-test-) response is a fixed sample, never real data: it is refused, not used
 *  - bounded concurrency, a timeout per attempt, 4 attempts spread over ~35 s (rides out an API redeploy)
 *  - a circuit breaker: after BREAKER_AFTER requests in a row that never got an answer, the rest of the
 *    build's requests fail at once instead of each waiting out its own retries (Next fails a page that takes
 *    longer than staticPageGenerationTimeout to render, and a dead API must not do that to every page)
 *  - BAKE_STRICT=1 (set only for the nightly scheduled run) turns any failure into a failed build, so
 *    yesterday's complete pages stay live instead of being replaced by incomplete ones
 *
 * SERVER-ONLY: import it from server components, pages and lib code that runs at build time, never from
 * a "use client" file.
 */
import { randomUUID } from "node:crypto";
import { istIsoNow } from "@/lib/hi-date";

/** India's date for this build. next.config.ts pins it once, so every build worker agrees even if the build
 *  runs across midnight; without it (tools, tests) it is read from the clock. */
export const BAKE_DATE = process.env.BAKE_DATE_IST || istIsoNow();
export const STRICT = process.env.BAKE_STRICT === "1";

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";
// `find`, not `??`: an unset GitHub secret is baked in as "" and `??` would keep it
const KEY = [process.env.NEXT_PUBLIC_API_KEY, process.env.NEXT_PUBLIC_API_TEST_KEY].find((k) => !!k);

// ── bounded concurrency ─────────────────────────────────────────────────────────────────────────────────────

const MAX_CONCURRENT = 8;
let active = 0;
const waiting: Array<() => void> = [];

async function acquire(): Promise<void> {
  if (active < MAX_CONCURRENT) {
    active++;
    return;
  }
  await new Promise<void>((resolve) => waiting.push(resolve)); // the releaser hands its slot straight over
}

function release(): void {
  const next = waiting.shift();
  if (next) next();
  else active--;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ── transport ───────────────────────────────────────────────────────────────────────────────────────────────

class Permanent extends Error {} // a 4xx / refused response / open breaker: retrying cannot change it

const ATTEMPT_TIMEOUT_MS = 15_000;
/** Pause before attempt 2, 3 and 4: an API redeploy or a network blip is over by then. */
const RETRY_DELAYS_MS = [2_000, 8_000, 25_000];

const BREAKER_AFTER = 8;
let failedRequests = 0; // consecutive requests that used up every attempt without an answer

function breakerOpen(): boolean {
  return failedRequests >= BREAKER_AFTER;
}

/** POST `body` to the GrahaAPI and return its `data`. Throws when it cannot get a real answer. */
export async function buildPost<T>(path: string, body: unknown): Promise<T> {
  if (!KEY) throw new Permanent("no API key configured (NEXT_PUBLIC_API_KEY)");
  let last: unknown;
  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt++) {
    if (attempt > 0) await sleep(RETRY_DELAYS_MS[attempt - 1]);
    try {
      await acquire();
      let res: Response;
      try {
        // a request that queued for a slot while the breaker opened fails at once
        if (breakerOpen()) throw new Permanent("API unreachable (circuit open after repeated failures)");
        res = await fetch(`${BASE}${path}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${KEY}`,
            // Next keeps build-time fetches in .next/cache (keyed by URL, headers and body), and `cache:
            // "no-store"` is refused in a static export. A unique id per request can never match an entry,
            // so an answer baked into a page is always fetched now, never replayed from an earlier build.
            "X-Request-Id": randomUUID(),
          },
          body: JSON.stringify(body),
          signal: AbortSignal.timeout(ATTEMPT_TIMEOUT_MS),
        });
      } finally {
        release();
      }
      const text = await res.text();
      if (!res.ok) {
        let code = "";
        try {
          code = JSON.parse(text)?.error?.code ?? "";
        } catch {
          code = text.replace(/\s+/g, " ").slice(0, 80); // an HTML error page from the edge, say
        }
        const msg = `${path} -> HTTP ${res.status} ${code}`.trim();
        // 5xx / 429 / 408 are "the API is not coping" (a redeploy answers 502s): retried, and counted toward
        // the breaker when they never clear. A 4xx is an answer about OUR request: the API itself is up.
        if (res.status >= 500 || res.status === 429 || res.status === 408) throw new Error(msg);
        failedRequests = 0;
        throw new Permanent(msg);
      }
      failedRequests = 0; // a real answer: the API is up
      let json;
      try {
        json = JSON.parse(text);
      } catch {
        throw new Error(`${path} -> HTTP ${res.status} but not JSON: ${text.replace(/\s+/g, " ").slice(0, 80)}`);
      }
      if (json?.meta && (json.meta.mode === "test" || json.meta.test_mode === true)) {
        throw new Permanent(`${path} answered in test mode (sample data): refusing to use it`);
      }
      return (json.data ?? json) as T;
    } catch (e) {
      if (e instanceof Permanent) throw e;
      last = e;
    }
  }
  failedRequests++;
  throw new Error(`${path} failed after ${RETRY_DELAYS_MS.length + 1} attempts: ${last instanceof Error ? last.message : String(last)}`);
}

// ── deadline + fallback policy ──────────────────────────────────────────────────────────────────────────────

/** A page's data must be ready inside Next's per-page limit (staticPageGenerationTimeout in next.config.ts,
 *  300 s), however slow the API is. It includes the time a request spends queued behind the others: the
 *  GrahaAPI answers the build's ~500 calls one after another, so the last pages wait for the first. */
const DEADLINE_MS = 240_000;

export function withDeadline<T>(work: Promise<T>): Promise<T> {
  let timer: ReturnType<typeof setTimeout>;
  const late = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`gave up after ${DEADLINE_MS / 1000}s`)), DEADLINE_MS);
  });
  return Promise.race([work, late]).finally(() => clearTimeout(timer));
}

/**
 * Run `make` under the deadline. A failure returns `fallback` (the page then renders without that data and
 * says so), except under BAKE_STRICT=1 where it throws and fails the build.
 */
export async function bakeOr<T, F>(label: string, make: () => Promise<T>, fallback: F): Promise<T | F> {
  try {
    return await withDeadline(make());
  } catch (e) {
    const msg = `[bake] ${label}: ${e instanceof Error ? e.message : String(e)}`;
    if (STRICT) throw new Error(msg);
    console.warn(`${msg} (falling back)`);
    return fallback;
  }
}
