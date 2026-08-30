// Ping IndexNow (Bing / Yandex / Seznam / Naver share this endpoint) with
// every URL in the live sitemap. Runs in CI after each Pages deploy so new
// and updated pages get crawled within days instead of weeks.
// Key file: public/172086d537bf3a792eae2962268faef3.txt (must stay deployed).
const HOST = "astroshivanii.com";
const KEY = "172086d537bf3a792eae2962268faef3";

const res = await fetch(`https://${HOST}/sitemap.xml`);
if (!res.ok) throw new Error(`sitemap fetch failed: ${res.status}`);
const xml = await res.text();
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
if (!urls.length) throw new Error("no URLs found in sitemap");

const ping = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList: urls }),
});
// 200/202 = accepted. 4xx here should fail CI visibly, not silently.
console.log(`IndexNow: submitted ${urls.length} URLs -> HTTP ${ping.status}`);
if (ping.status >= 400) {
  console.error(await ping.text());
  process.exit(1);
}
