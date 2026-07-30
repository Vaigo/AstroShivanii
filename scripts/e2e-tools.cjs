const { chromium } = require("playwright");
const path = require("path");

const OUT = process.argv[2] || __dirname;
const BASE = "http://localhost:3001";

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  const issues = [];
  page.on("pageerror", (e) => issues.push(`[pageerror] ${e.message.slice(0, 300)}`));
  page.on("console", (m) => {
    if (m.type() === "error") issues.push(`[console] ${m.text().slice(0, 300)}`);
  });

  const results = [];

  async function run(name, fn) {
    issues.length = 0;
    try {
      await fn();
      results.push(`${name}: PASS${issues.length ? " (console issues: " + issues.join(" | ") + ")" : ""}`);
    } catch (e) {
      results.push(`${name}: FAIL — ${e.message.slice(0, 300)}${issues.length ? " | " + issues.join(" | ") : ""}`);
      await page.screenshot({ path: path.join(OUT, `e2e-${name}-FAIL.png`) });
    }
  }

  // 1. Kundli
  await run("kundli", async () => {
    await page.goto(BASE + "/tools/kundli", { waitUntil: "networkidle" });
    await page.fill('input[type="date"]', "1993-07-13");
    await page.fill('input[type="time"]', "22:50");
    await page.click('button:has-text("Calculate")');
    await page.waitForSelector("text=Mahadasha", { timeout: 45000 });
    await page.waitForSelector("text=Ascendant", { timeout: 5000 });
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(OUT, "e2e-kundli.png"), fullPage: false });
  });

  // 2. Matching
  await run("matching", async () => {
    await page.goto(BASE + "/tools/matching", { waitUntil: "networkidle" });
    const dates = await page.$$('input[type="date"]');
    if (dates.length < 2) throw new Error("expected 2 date inputs, got " + dates.length);
    await dates[0].fill("1991-02-28");
    await dates[1].fill("1993-07-13");
    await page.click('button:has-text("Calculate Compatibility")');
    await page.waitForSelector("text=/36", { timeout: 45000 });
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(OUT, "e2e-matching.png"), fullPage: false });
  });

  // 3. Rashifal
  await run("rashifal", async () => {
    await page.goto(BASE + "/tools/rashifal", { waitUntil: "networkidle" });
    await page.selectOption("select#rashi", "Leo");
    await page.click('button:has-text("Get Today")');
    await page.waitForSelector("text=Lucky", { timeout: 45000 });
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(OUT, "e2e-rashifal.png"), fullPage: false });
  });

  // 4. Tarot
  await run("tarot", async () => {
    await page.goto(BASE + "/tools/tarot", { waitUntil: "networkidle" });
    await page.fill("input#question", "Will my career grow?");
    await page.click('button:has-text("Draw 3 Cards")');
    await page.waitForSelector("text=Past", { timeout: 45000 });
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(OUT, "e2e-tarot.png"), fullPage: false });
  });

  // 5. Panchang (auto-loads today on mount, then re-query date+city via PlaceSearch)
  await run("panchang", async () => {
    await page.goto(BASE + "/tools/panchang", { waitUntil: "networkidle" });
    await page.waitForSelector("text=राहु काल", { timeout: 45000 });
    await page.fill('input[type="date"]', "2026-08-15");
    await page.click(".place-chip-clear");
    await page.fill('input[placeholder*="Type any city"]', "Mumbai");
    await page.waitForSelector(".place-option", { timeout: 30000 });
    await page.click(".place-option");
    await page.click('button:has-text("Show Panchang")');
    await page.waitForSelector("text=2026-08-15", { timeout: 45000 });
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(OUT, "e2e-panchang.png"), fullPage: false });
  });

  // 5b. Historical DST correctness: London birth, summer (+1 BST) vs winter (0 GMT)
  await run("london-dst", async () => {
    await page.goto(BASE + "/tools/kundli", { waitUntil: "networkidle" });
    await page.click(".place-chip-clear");
    await page.fill('input[placeholder*="Type any city"]', "London");
    await page.waitForSelector(".place-option", { timeout: 30000 });
    await page.click(".place-option");
    await page.fill('input[type="date"]', "1993-07-13");
    await page.fill('input[type="time"]', "22:50");
    await page.waitForSelector("text=UTC+1", { timeout: 10000 });
    await page.screenshot({ path: path.join(OUT, "e2e-london-summer.png"), fullPage: false });
    await page.fill('input[type="date"]', "1993-01-13");
    await page.waitForSelector("text=UTC+0", { timeout: 10000 });
    const summerGone = await page.$("text=UTC+1");
    if (summerGone) throw new Error("winter date still shows UTC+1 — historical offset not recomputed");
    await page.screenshot({ path: path.join(OUT, "e2e-london-winter.png"), fullPage: false });
  });

  // 6. Sade Sati
  await run("sadesati", async () => {
    await page.goto(BASE + "/tools/sade-sati", { waitUntil: "networkidle" });
    await page.fill('input[type="date"]', "1993-07-13");
    await page.fill('input[type="time"]', "22:50");
    await page.click('button:has-text("Calculate")');
    await page.waitForSelector("text=Saturn Currently In", { timeout: 45000 });
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(OUT, "e2e-sadesati.png"), fullPage: false });
  });

  console.log(results.join("\n"));
  await browser.close();
  if (results.some((r) => r.includes("FAIL"))) process.exit(1);
})();
