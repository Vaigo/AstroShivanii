const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 900 });

  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await page.waitForTimeout(1800);

  // Hero
  await page.screenshot({ path: "C:/Users/VGovind/AppData/Local/Temp/s_hero.png" });

  // Scroll to tools section
  await page.evaluate(() => window.scrollBy(0, 750));
  await page.waitForTimeout(900);
  await page.screenshot({ path: "C:/Users/VGovind/AppData/Local/Temp/s_tools.png" });

  // Scroll to readings
  await page.evaluate(() => window.scrollBy(0, 900));
  await page.waitForTimeout(900);
  await page.screenshot({ path: "C:/Users/VGovind/AppData/Local/Temp/s_readings.png" });

  // Scroll to comparison section
  await page.evaluate(() => window.scrollBy(0, 1800));
  await page.waitForTimeout(900);
  await page.screenshot({ path: "C:/Users/VGovind/AppData/Local/Temp/s_why_stats.png" });

  // Scroll deeper into comparison table
  await page.evaluate(() => window.scrollBy(0, 900));
  await page.waitForTimeout(900);
  await page.screenshot({ path: "C:/Users/VGovind/AppData/Local/Temp/s_compare_table.png" });

  console.log("All screenshots saved.");
  await browser.close();
})();
