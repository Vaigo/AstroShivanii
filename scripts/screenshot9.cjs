const { chromium } = require("playwright");
const path = require("path");

const OUT = process.argv[2] || __dirname;
const BASE = "http://localhost:3001";

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  // How It Works section on home
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  await page.evaluate(() => {
    const els = [...document.querySelectorAll("h2")];
    const el = els.find((e) => e.textContent.includes("How It Works"));
    if (el) el.scrollIntoView({ block: "center" });
  });
  await page.waitForTimeout(1100);
  await page.screenshot({ path: path.join(OUT, "v-howitworks.png") });

  // Readings cards with best-for
  await page.goto(BASE + "/readings", { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  await page.evaluate(() => window.scrollTo(0, 500));
  await page.waitForTimeout(1100);
  await page.screenshot({ path: path.join(OUT, "v-readings.png") });

  // Reading detail
  await page.goto(BASE + "/readings/kp-precision", { waitUntil: "networkidle" });
  await page.waitForTimeout(900);
  await page.screenshot({ path: path.join(OUT, "v-detail.png"), fullPage: true });

  // Matching tool explainer
  await page.goto(BASE + "/tools/matching", { waitUntil: "networkidle" });
  await page.waitForTimeout(900);
  await page.screenshot({ path: path.join(OUT, "v-matching.png") });

  console.log("done");
  await browser.close();
})();
