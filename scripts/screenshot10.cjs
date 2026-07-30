const { chromium } = require("playwright");
const path = require("path");

const OUT = process.argv[2] || __dirname;
const BASE = "http://localhost:3001";

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  // Genuine strip (right under hero)
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.waitForTimeout(900);
  await page.evaluate(() => {
    const el = document.querySelector(".genuine-strip");
    if (el) el.scrollIntoView({ block: "center" });
  });
  await page.waitForTimeout(900);
  await page.screenshot({ path: path.join(OUT, "i-genuine.png") });

  // Free tools icons
  await page.evaluate(() => {
    const els = [...document.querySelectorAll("h2")];
    const el = els.find((e) => e.textContent.includes("Free Vedic Tools"));
    if (el) el.scrollIntoView({ block: "start" });
  });
  await page.waitForTimeout(900);
  await page.screenshot({ path: path.join(OUT, "i-tools.png") });

  // How it works
  await page.evaluate(() => {
    const els = [...document.querySelectorAll("h2")];
    const el = els.find((e) => e.textContent.includes("How It Works"));
    if (el) el.scrollIntoView({ block: "center" });
  });
  await page.waitForTimeout(900);
  await page.screenshot({ path: path.join(OUT, "i-how.png") });

  // Why Shivanii diff cards
  await page.evaluate(() => {
    const el = document.querySelector(".diff-card");
    if (el) el.scrollIntoView({ block: "center" });
  });
  await page.waitForTimeout(900);
  await page.screenshot({ path: path.join(OUT, "i-diff.png") });

  // Readings page
  await page.goto(BASE + "/readings", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  await page.evaluate(() => window.scrollTo(0, 420));
  await page.waitForTimeout(900);
  await page.screenshot({ path: path.join(OUT, "i-readings.png") });

  console.log("done");
  await browser.close();
})();
