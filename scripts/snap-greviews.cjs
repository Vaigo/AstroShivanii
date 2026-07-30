const { chromium } = require("playwright");
const path = require("path");

const OUT = process.argv[2] || __dirname;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto("http://localhost:3001/", { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  await page.evaluate(() => document.querySelector(".greview-head")?.scrollIntoView({ block: "center" }));
  await page.waitForTimeout(900);
  await page.screenshot({ path: path.join(OUT, "greviews.png") });
  await browser.close();
  console.log("done");
})().catch((e) => { console.error(e); process.exit(1); });
