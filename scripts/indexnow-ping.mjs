// Ping IndexNow (Bing / Yandex / Seznam / Naver share this endpoint) with
// the URLs in the live sitemap. Runs in CI after each Pages deploy so new
// and updated pages get crawled within days instead of weeks.
//
// A deploy from a push can change anything, so it submits every URL. The nightly
// scheduled rebuild only changes the pages whose content is recomputed per day (Rahu
// Kaal, choghadiya, rashifal, and the muhurta lists whose past dates drop out);
// re-submitting the other ~100 unchanged URLs every night would teach the endpoint
// to ignore us, so it submits just those.
// Key file: public/172086d537bf3a792eae2962268faef3.txt (must stay deployed).
const HOST = "astroshivanii.com";
const KEY = "172086d537bf3a792eae2962268faef3";
const DAILY_SECTIONS = ["/rahu-kaal", "/choghadiya", "/rashifal", "/muhurta"];
// the section's own path or anything under it, never a different route that merely starts the same
// (a future /rashifal-2027/ must not be re-submitted every night)
const inDailySection = (pathname) => DAILY_SECTIONS.some((s) => pathname === s || pathname.startsWith(`${s}/`));

const res = await fetch(`https://${HOST}/sitemap.xml`);
if (!res.ok) throw new Error(`sitemap fetch failed: ${res.status}`);
const xml = await res.text();
const all = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
if (!all.length) throw new Error("no URLs found in sitemap");

const nightly = process.env.GITHUB_EVENT_NAME === "schedule";
const urls = nightly ? all.filter((u) => inDailySection(new URL(u).pathname.replace(/\/$/, "") || "/")) : all;
if (!urls.length) throw new Error("no daily URLs found in sitemap");

const ping = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList: urls }),
});
// 200/202 = accepted. 4xx here should fail CI visibly, not silently.
console.log(`IndexNow: submitted ${urls.length} of ${all.length} URLs${nightly ? " (nightly: daily pages only)" : ""} -> HTTP ${ping.status}`);
if (ping.status >= 400) {
  console.error(await ping.text());
  process.exit(1);
}
