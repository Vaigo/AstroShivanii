const { chromium } = require("playwright");
const path = require("path");

const OUT = process.argv[2] || __dirname;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto("http://localhost:3001/", { waitUntil: "networkidle" });
  await page.evaluate(() => document.querySelector(".price-card-featured")?.scrollIntoView({ block: "center" }));
  await page.waitForTimeout(1000);
  const card = await page.$(".price-card-featured");
  await card.screenshot({ path: path.join(OUT, "price-featured.png") });
  await browser.close();
  console.log("done");
})().catch((e) => { console.error(e); process.exit(1); });
