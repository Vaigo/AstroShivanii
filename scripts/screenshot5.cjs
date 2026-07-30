const { chromium } = require("playwright");
const path = require("path");

const OUT = process.argv[2] || __dirname;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  async function fullShot(url, name) {
    await page.goto(url, { waitUntil: "networkidle" });
    await page.waitForTimeout(600);
    // scroll through the page to trigger IntersectionObserver reveals
    const height = await page.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < height; y += 700) {
      await page.evaluate((yy) => window.scrollTo(0, yy), y);
      await page.waitForTimeout(250);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(OUT, name), fullPage: true });
    console.log("saved", name);
  }

  await fullShot("http://localhost:3000/", "home.png");
  await fullShot("http://localhost:3000/faq", "faq.png");
  await fullShot("http://localhost:3000/guides", "guides.png");
  await fullShot("http://localhost:3000/guides/sade-sati-meaning", "guide-article.png");
  await fullShot("http://localhost:3000/tools", "tools.png");
  await fullShot("http://localhost:3000/readings", "readings.png");
  await fullShot("http://localhost:3000/does-not-exist", "notfound.png");

  await browser.close();
})();
