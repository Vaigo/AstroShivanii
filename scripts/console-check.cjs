const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const msgs = [];
  page.on("console", (m) => {
    if (m.type() === "error" || m.type() === "warning") msgs.push(`[${m.type()}] ${m.text().slice(0, 500)}`);
  });
  page.on("pageerror", (e) => msgs.push(`[pageerror] ${e.message.slice(0, 500)}`));

  const pages = ["/", "/tools/kundli", "/tools/matching", "/tools/sade-sati", "/tools/rashifal", "/tools/tarot", "/tools/numerology", "/readings/birth-chart", "/book", "/faq", "/guides/what-is-kundli", "/about", "/contact"];
  for (const p of pages) {
    msgs.length = 0;
    await page.goto("http://localhost:3001" + p, { waitUntil: "networkidle" });
    await page.waitForTimeout(900);
    console.log(p, "→", msgs.length ? "ISSUES:\n" + msgs.join("\n---\n") : "clean");
  }
  await browser.close();
})();
