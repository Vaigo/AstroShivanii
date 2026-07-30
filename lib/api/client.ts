const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";
// Production builds set NEXT_PUBLIC_API_KEY to the site's internal GrahaAPI key
// (enterprise-plan, label "AstroShivanii website"). Dev falls back to a test key.
// NOTE: this is a static-export site — any key here ships in the public JS bundle.
// The internal key is therefore treated as rotatable and monitored server-side;
// never reuse it for anything else.
const API_KEY =
  process.env.NEXT_PUBLIC_API_KEY ??
  process.env.NEXT_PUBLIC_API_TEST_KEY ??
  "sk-test-dev";

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

  return json.data ?? json;
}

export function post<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function get<T>(path: string, params?: Record<string, string>): Promise<T> {
  const url = params
    ? `${path}?${new URLSearchParams(params).toString()}`
    : path;
  return request<T>(url, { method: "GET" });
}
