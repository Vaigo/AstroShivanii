const { chromium } = require("playwright");
const path = require("path");

const OUT = process.argv[2] || __dirname;
const BASE = "http://localhost:3001";

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  async function fullShot(url, name) {
    await page.goto(BASE + url, { waitUntil: "networkidle" });
    await page.waitForTimeout(500);
    const height = await page.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < height; y += 700) {
      await page.evaluate((yy) => window.scrollTo(0, yy), y);
      await page.waitForTimeout(200);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(OUT, name), fullPage: true });
    console.log("saved", name);
  }

  await fullShot("/about", "r-about.png");
  await fullShot("/book", "r-book.png");
  await fullShot("/contact", "r-contact.png");
  await fullShot("/readings/birth-chart", "r-reading-detail.png");
  await fullShot("/tools/kundli", "r-tool-kundli.png");

  await browser.close();
})();
