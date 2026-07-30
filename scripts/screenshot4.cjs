const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await page.waitForTimeout(1800);

  // Find how tall the page is
  const height = await page.evaluate(() => document.body.scrollHeight);
  console.log("Page height:", height);

  // Take snapshots at regular intervals to find sections
  for (let y = 3500; y <= 6000; y += 900) {
    await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
    await page.waitForTimeout(800);
    await page.screenshot({ path: `C:/Users/VGovind/AppData/Local/Temp/scan_${y}.png` });
    console.log("Shot at y=" + y);
  }

  await browser.close();
})();
