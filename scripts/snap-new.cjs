const { chromium } = require("playwright");
const path = require("path");

const OUT = process.argv[2] || __dirname;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  // Panchang: choghadiya section
  await page.goto("http://localhost:3001/tools/panchang", { waitUntil: "networkidle" });
  await page.waitForSelector("text=चोघड़िया", { timeout: 45000 });
  await page.evaluate(() => {
    const els = [...document.querySelectorAll("h3")];
    els.find((e) => e.textContent.includes("चोघड़िया"))?.scrollIntoView({ block: "start" });
  });
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(OUT, "new-choghadiya.png") });

  // Kundli: moon chart toggle + avakahada
  await page.goto("http://localhost:3001/tools/kundli", { waitUntil: "networkidle" });
  await page.fill('input[type="date"]', "1993-07-13");
  await page.fill('input[type="time"]', "22:50");
  await page.click('button:has-text("Calculate")');
  await page.waitForSelector("text=Avakahada", { timeout: 45000 });
  await page.click('button:has-text("चन्द्र कुंडली")');
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(OUT, "new-moonchart.png") });
  await page.evaluate(() => {
    const els = [...document.querySelectorAll(".result-label")];
    els.find((e) => e.textContent.includes("Avakahada"))?.scrollIntoView({ block: "start" });
  });
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(OUT, "new-avakahada.png") });

  // Festivals page
  await page.goto("http://localhost:3001/festivals-2026", { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(OUT, "new-festivals.png") });

  // Home hero with trust badges
  await page.goto("http://localhost:3001/", { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(OUT, "new-hero.png") });

  console.log("done");
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
