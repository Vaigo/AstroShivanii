const { chromium } = require("playwright");
const path = require("path");

const OUT = process.argv[2] || __dirname;
const BASE = "http://localhost:3001";

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  // Panchang auto-loads; scroll to its CTA
  await page.goto(BASE + "/tools/panchang", { waitUntil: "networkidle" });
  await page.waitForSelector("text=राहु काल", { timeout: 45000 });
  await page.evaluate(() => document.querySelector(".soft-cta")?.scrollIntoView({ block: "center" }));
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(OUT, "cta-panchang.png") });

  // Kundli: run a calc, scroll to CTA
  await page.goto(BASE + "/tools/kundli", { waitUntil: "networkidle" });
  await page.fill('input[type="date"]', "1993-07-13");
  await page.click('button:has-text("Calculate")');
  await page.waitForSelector("text=Mahadasha", { timeout: 45000 });
  await page.evaluate(() => document.querySelector(".soft-cta")?.scrollIntoView({ block: "center" }));
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(OUT, "cta-kundli.png") });

  // Numerology bottom section (dark inline gradient)
  await page.goto(BASE + "/tools/numerology", { waitUntil: "networkidle" });
  await page.fill('input[type="text"]', "Shivani Gupta");
  await page.fill('input[type="date"]', "1993-07-13");
  await page.click('button:has-text("गणना करें"), button:has-text("Calculate")');
  await page.waitForTimeout(1200);
  await page.evaluate(() => {
    const secs = document.querySelectorAll("section");
    secs[secs.length - 1]?.scrollIntoView({ block: "center" });
  });
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(OUT, "cta-numerology.png") });

  // Guide CTA (dark)
  await page.goto(BASE + "/nakshatra/bharani", { waitUntil: "networkidle" });
  await page.evaluate(() => document.querySelector(".guide-cta")?.scrollIntoView({ block: "center" }));
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(OUT, "cta-nakshatra.png") });

  console.log("done");
  await browser.close();
})();
