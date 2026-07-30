const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 900 });

  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await page.waitForTimeout(1800);

  // Hero with FOMO badge
  await page.screenshot({ path: "C:/Users/VGovind/AppData/Local/Temp/v2_hero.png" });

  // Genuine strip
  await page.evaluate(() => window.scrollBy(0, 850));
  await page.waitForTimeout(900);
  await page.screenshot({ path: "C:/Users/VGovind/AppData/Local/Temp/v2_genuine.png" });

  // Tools section
  await page.evaluate(() => window.scrollBy(0, 850));
  await page.waitForTimeout(900);
  await page.screenshot({ path: "C:/Users/VGovind/AppData/Local/Temp/v2_tools.png" });

  // Price anchor
  await page.evaluate(() => window.scrollBy(0, 2400));
  await page.waitForTimeout(900);
  await page.screenshot({ path: "C:/Users/VGovind/AppData/Local/Temp/v2_price.png" });

  // Price anchor lower + FOMO
  await page.evaluate(() => window.scrollBy(0, 700));
  await page.waitForTimeout(900);
  await page.screenshot({ path: "C:/Users/VGovind/AppData/Local/Temp/v2_fomo.png" });

  // Comparison section
  await page.evaluate(() => window.scrollBy(0, 1000));
  await page.waitForTimeout(900);
  await page.screenshot({ path: "C:/Users/VGovind/AppData/Local/Temp/v2_compare.png" });

  console.log("done");
  await browser.close();
})();
