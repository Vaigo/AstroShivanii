"use client";

import { useEffect, useRef } from "react";

/** Gives an in-page UI state (a tool's result screen, a calendar's month
 *  view …) its own browser-history entry, so the Back button unwinds that
 *  state instead of leaving the page entirely. Without this, a visitor who
 *  came straight from the homepage and is three interactions deep inside a
 *  tool gets dumped all the way back to the homepage by a single Back press.
 *
 *  When `active` flips false→true an entry is pushed (preserving Next.js
 *  App Router's own history.state keys); pressing Back then fires `onBack`
 *  — which must clear that state — and stays on the page. The next Back
 *  leaves the page normally. Mirrors the pattern already used by the
 *  turant-uttar multi-step flow. */
export function useBackStep(active: boolean, key: string, onBack: () => void) {
  const activeRef = useRef(false);
  const onBackRef = useRef(onBack);
  onBackRef.current = onBack;

  useEffect(() => {
    if (active && !activeRef.current && !window.history.state?.[key]) {
      window.history.pushState({ ...window.history.state, [key]: true }, "");
    }
    activeRef.current = active;
  }, [active, key]);

  useEffect(() => {
    const onPop = () => {
      if (activeRef.current && !window.history.state?.[key]) {
        onBackRef.current();
      }
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [key]);
}
