const { chromium } = require("playwright");
const path = require("path");

const OUT = process.argv[2] || __dirname;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  for (const [url, name] of [
    ["/nakshatra/bharani", "seo-nakshatra"],
    ["/rashi/mesh", "seo-rashi"],
    ["/nakshatra", "seo-nak-index"],
  ]) {
    await page.goto("http://localhost:3001" + url, { waitUntil: "networkidle" });
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(OUT, `${name}.png`) });
  }
  console.log("done");
  await browser.close();
})();
