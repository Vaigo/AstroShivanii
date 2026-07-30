const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await page.waitForTimeout(1800);

  // Scroll to price comparison cards
  await page.evaluate(() => window.scrollTo(0, 2900));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: "C:/Users/VGovind/AppData/Local/Temp/v3_pricecards.png" });

  await browser.close();
})();
