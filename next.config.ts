import type { NextConfig } from "next";

// India's date when the build starts, fixed once here so every static-generation worker bakes the same day
// into the daily pages (lib/build-api.ts): a build that runs across midnight must not mix two days. An
// explicit BAKE_DATE_IST in the environment wins (to reproduce or rehearse a particular night's build).
const BAKE_DATE_IST = process.env.BAKE_DATE_IST || new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  env: { BAKE_DATE_IST },
  // Next gives a page 60 s to render before it fails the build. The pages that bake data (Rahu Kaal,
  // choghadiya, rashifal, the muhurta lists, the festival calendars) wait on the GrahaAPI, which answers ~500
  // calls per build one after another (a year-long muhurta scan alone is 7 heavy calls per page), so the later
  // pages legitimately wait their turn. lib/build-api.ts gives its own, shorter deadline (240 s).
  staticPageGenerationTimeout: 300,
};

export default nextConfig;
