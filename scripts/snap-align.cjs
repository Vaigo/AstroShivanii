const { chromium } = require("playwright");
const path = require("path");

const OUT = process.argv[2] || __dirname;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto("http://localhost:3001/tools/panchang", { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  const form = await page.$(".inline-tool-form");
  await form.screenshot({ path: path.join(OUT, "align-check.png") });
  await browser.close();
  console.log("done");
})().catch((e) => { console.error(e); process.exit(1); });
