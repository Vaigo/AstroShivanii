const { chromium } = require("playwright");
const path = require("path");

const OUT = process.argv[2] || __dirname;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const consoleMsgs = [];
  page.on("console", (m) => {
    if (m.type() === "error" || m.type() === "warning") {
      consoleMsgs.push(`[${m.type()}] ${m.text()}`);
    }
  });
  page.on("pageerror", (e) => consoleMsgs.push(`[pageerror] ${e.message}`));

  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);

  // viewport shot at the Free Tools section
  const toolsY = await page.evaluate(() => {
    const els = [...document.querySelectorAll("h2")];
    const el = els.find((e) => e.textContent.includes("Free Vedic Tools"));
    return el ? el.getBoundingClientRect().top + window.scrollY - 100 : 800;
  });
  await page.evaluate((y) => window.scrollTo(0, y), toolsY);
  await page.waitForTimeout(900);
  await page.screenshot({ path: path.join(OUT, "home-tools-viewport.png") });

  // scroll further to testimonials
  await page.evaluate(() => {
    const els = [...document.querySelectorAll("h2")];
    const el = els.find((e) => e.textContent.includes("What People Say"));
    if (el) el.scrollIntoView({ block: "start" });
  });
  await page.waitForTimeout(900);
  await page.screenshot({ path: path.join(OUT, "home-testimonials-viewport.png") });

  console.log("CONSOLE ISSUES:");
  console.log(consoleMsgs.length ? consoleMsgs.join("\n") : "(none)");

  await browser.close();
})();
