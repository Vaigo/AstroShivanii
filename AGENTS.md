<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Pages whose data is fetched at build time (nightly rebuild)

The site is a static export, rebuilt by `.github/workflows/deploy.yml` on every push **and every night at 00:05 IST**. Several pages
bake data fetched from the GrahaAPI into their HTML so crawlers and no-JS visitors see real answers:

- `/rahu-kaal/[city]`, `/choghadiya/[city]`, `/rashifal/[rashi]` and the three index pages — `lib/baked.ts` (answers + checks), widgets in
  `components/*Live.tsx` (shape/wording in `lib/daily-data.ts`, India-date helpers in `lib/hi-date.ts`, hooks in `lib/useToday.ts`)
- `/muhurta/[slug]` (`lib/muhurta-pages.ts`), `/festivals/[slug]` and `/festivals-2026` (`lib/festival-pages.ts`)

Rules that keep a bad build from shipping wrong or empty pages:

- **Every build-time API call goes through `buildPost` / `bakeOr` in `lib/build-api.ts`** (timeout, retries, circuit breaker, refuses
  test-mode sample answers, unique request id so Next's fetch cache can never replay an old answer). Never `fetch` the API directly in a page.
- **`BAKE_STRICT=1`** (nightly and manual runs) turns any failed fetch into a failed build, so yesterday's complete pages stay live.
  Pushes are not strict: an API outage must not block an urgent fix; the page then falls back to its live widget.
- **`scripts/verify-baked.mjs`** runs after the build (CI step) and checks every page above; add a new baked page family there.
  Rehearse failures with `scripts/stub-api.mjs` (hang / 502 / test-mode) — see the header of that file.
- A baked widget compares the baked day with India's date after hydration (`useIstTodayIso`): same day keeps the baked answer, a later
  day re-slices the baked window or fetches live. Its first client render must equal the static HTML (no `Date`/`Intl` in render, use the
  hooks), and widgets are keyed by slug (`key={c.slug}`) so client navigation never carries one city's fetched data to the next.
- A **new daily page** must be registered in three hardcoded places: the families in `scripts/verify-baked.mjs`, `DAILY_SECTIONS` in
  `scripts/indexnow-ping.mjs` (what the nightly IndexNow ping submits) and `DATA_ROUTES` in `app/sitemap.ts` (which hubs carry a `lastmod`).
- Rashifal shows the five areas of life separately, each with its own stars and good/bad word (`starLabelHi/En` in `lib/daily-data.ts`).
  There is deliberately no combined "overall" star, sentence or weekly average.
- The nightly cron is switched off by GitHub after 60 days without repository activity (public repo): re-enable it under Actions.
