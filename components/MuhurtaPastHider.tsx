"use client";

import { useEffect } from "react";

/**
 * The muhurta lists are computed at build time and rebuilt on the 1st and 15th, so a date that has passed
 * since the last build (a "21 October" row on 24 October) would still be shown as upcoming. Rows and
 * list items carry data-mu-date="YYYY-MM-DD"; once the page is in the browser, those before today
 * (India's date: the dates are Delhi-based) are hidden, and a data-mu-group container with nothing
 * left is hidden too (separators between visible items come from CSS in globals.css, so hiding never leaves a
 * stray dot). The static HTML keeps every row, so crawlers and no-JS visitors are unaffected.
 */
export default function MuhurtaPastHider() {
  useEffect(() => {
    const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }); // YYYY-MM-DD
    // 1. anything dated before today
    document.querySelectorAll<HTMLElement>("[data-mu-date]").forEach((el) => {
      if ((el.dataset.muDate ?? "") < today) el.hidden = true;
    });
    // 2. a list that shows "the next N dates" (data-mu-keep=N) keeps only the first N that remain
    document.querySelectorAll<HTMLElement>("[data-mu-keep]").forEach((g) => {
      const keep = Number(g.dataset.muKeep);
      g.querySelectorAll<HTMLElement>("[data-mu-date]:not([hidden])").forEach((el, i) => {
        if (i >= keep) el.hidden = true;
      });
    });
    // 3. a group with nothing left (a month in the past, an emptied upcoming list) hides with its heading
    document.querySelectorAll<HTMLElement>("[data-mu-group]").forEach((g) => {
      if (!g.querySelector("[data-mu-date]:not([hidden])")) g.hidden = true;
    });
    // 4. month links whose section is gone
    document.querySelectorAll<HTMLElement>("[data-mu-month]").forEach((l) => {
      const target = document.getElementById(l.dataset.muMonth ?? "");
      if (!target || target.hidden) l.hidden = true;
    });
  }, []);
  return null;
}
