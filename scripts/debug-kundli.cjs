const { chromium } = require("playwright");
const path = require("path");

const OUT = process.argv[2] || __dirname;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const msgs = [];
  page.on("console", (m) => { if (m.type() === "error") msgs.push(m.text().slice(0, 400)); });
  page.on("pageerror", (e) => msgs.push("PAGEERROR: " + e.message.slice(0, 400)));

  await page.goto("http://localhost:3001/tools/kundli", { waitUntil: "networkidle" });
  await page.fill('input[type="date"]', "1993-07-13");
  await page.fill('input[type="time"]', "22:50");
  await page.click('button:has-text("Calculate")');
  await page.waitForTimeout(8000);
  const hasMaha = await page.$("text=Mahadasha");
  const hasAva = await page.$("text=अवकहड़ा");
  console.log("mahadasha:", !!hasMaha, "| avakahada:", !!hasAva);
  console.log(msgs.length ? "ERRORS:\n" + msgs.join("\n") : "no console errors");
  await page.screenshot({ path: path.join(OUT, "debug-kundli.png"), fullPage: false });
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
