const { chromium } = require("playwright");
const path = require("path");

const OUT = process.argv[2] || __dirname;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto("http://localhost:3000/readings", { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  await page.evaluate(() => window.scrollTo(0, 400));
  await page.waitForTimeout(900);
  await page.screenshot({ path: path.join(OUT, "readings-fixed.png") });
  console.log("saved");
  await browser.close();
})();
