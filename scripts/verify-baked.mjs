// Post-build check for the pages whose data the build fetches: the daily pages (Rahu Kaal, choghadiya,
// rashifal), the muhurta lists and the festival calendar. For the daily pages every page must have its
// answer baked into the static HTML (data-baked="YYYY-MM-DD" on the widget + a dated first FAQ answer),
// all pages must carry the same day, and the answers must differ where they should (cities have
// different sunrises, the twelve rashis different predictions). A page that fell back to the client-only
// widget, a worker that baked another day, or one city's data copied onto all of them fails here.
//
//   node scripts/verify-baked.mjs [outDir] [--strict]
//
// Without --strict (or BAKE_STRICT=1, which the nightly scheduled build sets) problems are warnings: a local
// build with no backend running legitimately bakes nothing.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
// one source for the Hindi date format (Node strips the types; the warning about the file's module type is harmless)
import { addDaysIso, fmtHi, istIsoNow } from "../lib/hi-date.ts";

const OUT = process.argv.find((a, i) => i >= 2 && !a.startsWith("--")) ?? "out";
const strict = process.env.BAKE_STRICT === "1" || process.argv.includes("--strict");
const problems = [];

const slugsIn = (file) => [...readFileSync(file, "utf8").matchAll(/slug:\s*"([a-z0-9-]+)"/g)].map((m) => m[1]);
const cities = slugsIn("lib/seo-cities.ts");
const rashis = slugsIn("lib/rashis.ts");
if (cities.length < 30 || rashis.length !== 12) {
  console.error(`[verify-baked] could not read the slug lists (cities ${cities.length}, rashis ${rashis.length})`);
  process.exit(1);
}

const dates = new Set();
const notBaked = []; // routes that fell back to the client-only widget (reported once, not 80 times)

/** The page's baked day and its first FAQ answer, or null (a problem is recorded). */
function inspect(route) {
  const file = path.join(OUT, route, "index.html");
  if (!existsSync(file)) {
    problems.push(`${route}: no page in ${OUT}/`);
    return null;
  }
  const html = readFileSync(file, "utf8");
  const baked = html.match(/data-baked="(\d{4}-\d{2}-\d{2})"/);
  if (!baked) {
    notBaked.push(route);
    return null;
  }
  dates.add(baked[1]);
  if (/गणना हो रही है…/.test(html)) problems.push(`${route}: baked, yet "गणना हो रही है…" is in the HTML`);
  // the dated FAQ answer must be about the same day the widget says it is baked for
  const metaDate = html.match(/<meta name="description" content="(\d{1,2} \S+ \d{4})[:\s]/);
  if (metaDate && metaDate[1] !== fmtHi(baked[1])) problems.push(`${route}: meta description date "${metaDate[1]}" is not the baked day ${baked[1]}`);
  const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  let answer = null;
  for (const m of ld) {
    try {
      const j = JSON.parse(m[1]);
      if (j["@type"] === "FAQPage") answer = j.mainEntity?.[0]?.acceptedAnswer?.text ?? null;
    } catch {
      problems.push(`${route}: FAQ JSON-LD does not parse`);
    }
  }
  return { date: baked[1], answer, html };
}

function family(label, routes, pattern, minDistinct) {
  const answers = [];
  let ok = 0;
  for (const route of routes) {
    const r = inspect(route);
    if (!r) continue;
    ok++;
    const a = r.answer ?? "";
    const m = a.match(pattern);
    if (!m) problems.push(`${route}: first FAQ answer is not today's dated answer`);
    else if (!a.includes(fmtHi(r.date))) problems.push(`${route}: first FAQ answer does not carry the baked day (${fmtHi(r.date)})`);
    else answers.push(m[0]);
  }
  const distinct = new Set(answers).size;
  if (ok > 0 && distinct < minDistinct) {
    problems.push(`${label}: only ${distinct} distinct answers across ${ok} pages (expected at least ${minDistinct}) — one page's data copied onto others?`);
  }
  console.log(`[verify-baked] ${label}: ${ok}/${routes.length} baked, ${distinct} distinct answers`);
}

// Real sunrises differ city to city (a normal day gives 30+ distinct answers across 34 cities); a bug that
// copies one city's data onto others, or a stale cache, collapses that number, so require 60% distinct
const cityMin = Math.floor(0.6 * cities.length);
family("rahu-kaal cities", cities.map((c) => `rahu-kaal/${c}`), /राहु काल \d{1,2}:\d{2} से \d{1,2}:\d{2} तक/, cityMin);
family("choghadiya cities", cities.map((c) => `choghadiya/${c}`), /अभिजीत मुहूर्त \d{1,2}:\d{2}–\d{1,2}:\d{2}/, cityMin);
// the rashifal answer is the day's star figures for that rashi: dated, with all five domains and a lucky number
family("rashifal rashis", rashis.map((r) => `rashifal/${r}`), /राशि के सितारे — करियर .*धन .*प्रेम .*स्वास्थ्य .*मनोबल .*शुभ अंक \d+/s, 12);

for (const route of ["rahu-kaal", "choghadiya", "rashifal"]) {
  const r = inspect(route);
  console.log(`[verify-baked] /${route}/ index: ${r ? "baked" : "NOT baked"}`);
}

// ── the muhurta lists and the festival calendar: fetched at build time too, and the most visited pages ──────────
// A fetch that fell back leaves a "temporarily unavailable" page; that must not go out unnoticed.
{
  const read = (route) => {
    const f = path.join(OUT, route, "index.html");
    return existsSync(f) ? readFileSync(f, "utf8") : null;
  };
  const nowYear = Number(istIsoNow().slice(0, 4));
  const december = istIsoNow().slice(5, 7) === "12";
  const muhurtaDir = path.join(OUT, "muhurta");
  const slugs = existsSync(muhurtaDir) ? readdirSync(muhurtaDir, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name) : [];
  const unavailable = [];
  for (const slug of slugs) {
    const year = Number(slug.match(/-(\d{4})$/)?.[1]);
    const html = read(`muhurta/${slug}`);
    if (!html || !year) continue;
    if (/सूची अभी अस्थायी रूप से उपलब्ध नहीं/.test(html)) {
      // this year's list can legitimately be empty in the last weeks of December, and a lapsed year's always is
      if (year > nowYear || (year === nowYear && !december)) unavailable.push(`muhurta/${slug}`);
    } else if (year > nowYear && !/data-mu-date=/.test(html)) {
      unavailable.push(`muhurta/${slug} (no dates)`);
    }
  }
  const fest = read("festivals-2026");
  if (!fest || /कैलेंडर अद्यतन हो रहा है/.test(fest)) unavailable.push("festivals-2026");
  const festDir = path.join(OUT, "festivals");
  for (const e of existsSync(festDir) ? readdirSync(festDir, { withFileTypes: true }) : []) {
    if (e.isDirectory() && /तारीख अस्थायी रूप से उपलब्ध नहीं/.test(read(`festivals/${e.name}`) ?? "")) unavailable.push(`festivals/${e.name}`);
  }
  console.log(`[verify-baked] muhurta lists + festival calendar: ${unavailable.length ? unavailable.length + " page(s) without data" : "all have data"}`);
  if (unavailable.length) {
    problems.push(`${unavailable.length} page(s) fell back to "temporarily unavailable" (the build could not fetch their data): ${unavailable.slice(0, 5).join(", ")}`);
  }
}

if (notBaked.length) {
  problems.unshift(
    `${notBaked.length} daily pages have no answer baked into the HTML (client-only fallback), e.g. ${notBaked.slice(0, 3).join(", ")}`,
  );
}
if (dates.size > 1) problems.push(`pages were baked for different days: ${[...dates].join(", ")}`);
console.log(`[verify-baked] baked day: ${[...dates].join(", ") || "none"}`);
// A nightly build bakes India's date at build start, and this runs minutes later: the baked day must be today
// or (a build that straddled midnight) yesterday. Anything older means the build did not bake today's answer.
if (strict && dates.size === 1) {
  const day = [...dates][0];
  const today = istIsoNow();
  if (day !== today && addDaysIso(day, 1) !== today) problems.push(`pages are baked for ${day}, but India's date is ${today}`);
}

if (problems.length) {
  const tag = strict ? "ERROR" : "warning";
  for (const p of problems) console.error(`[verify-baked] ${tag}: ${p}`);
  if (strict) process.exit(1);
  // a push deploy still goes out (an API outage must not block a fix), but the run must not look clean
  if (process.env.GITHUB_ACTIONS) {
    console.log(`::warning title=Daily pages not baked::${problems.length} problem(s), e.g. ${problems[0]}. The pages fall back to fetching in the browser until the next nightly build.`);
  }
}
