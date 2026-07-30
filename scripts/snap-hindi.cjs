const { chromium } = require("playwright");
const path = require("path");

const OUT = process.argv[2] || __dirname;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  await page.goto("http://localhost:3001/tools/kundli", { waitUntil: "networkidle" });
  // switch to Hindi
  await page.click('button:has-text("हिं")');
  await page.waitForTimeout(300);
  await page.fill('input[type="date"]', "1991-02-28");
  await page.fill('input[type="time"]', "11:55");
  await page.click('button:has-text("गणना करें")');
  await page.waitForSelector("text=महादशा", { timeout: 45000 });
  await page.waitForTimeout(800); // let the auto-scroll settle
  await page.screenshot({ path: path.join(OUT, "hindi-kundli.png") });

  // check layout: form centered, result below — capture full page top
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(OUT, "hindi-kundli-top.png") });

  console.log("done");
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
