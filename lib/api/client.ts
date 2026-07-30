const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";
// Production builds set NEXT_PUBLIC_API_KEY to the site's internal GrahaAPI key
// (enterprise-plan, label "AstroShivanii website"). Dev falls back to a test key.
// NOTE: this is a static-export site — any key here ships in the public JS bundle.
// The internal key is therefore treated as rotatable and monitored server-side;
// never reuse it for anything else.
// `??` only falls through on null/undefined, not on "" — an unset GitHub
// Actions secret bakes in as an empty string, which `??` alone would ship
// as a broken `Bearer ` token instead of falling back. Filter empties first.
const API_KEY =
  [process.env.NEXT_PUBLIC_API_KEY, process.env.NEXT_PUBLIC_API_TEST_KEY, "sk-test-dev"]
    .find((k) => !!k) as string;

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string
  ) {
    super(message);
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
      ...options.headers,
    },
  });

  const json = await res.json();

  if (!res.ok) {
    const err = json?.error ?? json?.detail ?? {};
    throw new ApiError(
      res.status,
      err.code ?? "API_ERROR",
      err.message ?? `HTTP ${res.status}`
    );
  }

  // HONESTY GUARD: if the API answered in test mode (sk-test key — a fixed
  // sample chart, NOT the visitor's data), never present it as their result.
  // This happens only when the production API key isn't configured yet.
  if (json?.meta && (json.meta.mode === "test" || json.meta.test_mode === true)) {
    throw new ApiError(
      503,
      "SETUP",
      "This tool is being set up — please try again a little later. | यह टूल अभी तैयार हो रहा है — कृपया थोड़ी देर बाद आज़माएं।"
    );
  }

  return json.data ?? json;
}

export function post<T>(path: string, body: unknown, headers?: Record<string, string>): Promise<T> {
  return request<T>(path, {
    method: "POST",
    body: JSON.stringify(body),
    headers,
  });
}

export function get<T>(path: string, params?: Record<string, string>): Promise<T> {
  const url = params
    ? `${path}?${new URLSearchParams(params).toString()}`
    : path;
  return request<T>(url, { method: "GET" });
}
