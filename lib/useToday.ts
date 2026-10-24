import { useSyncExternalStore } from "react";
import { istIsoNow, istMinutesNow } from "./hi-date";

const subscribe = () => () => {};

/** The visitor's local date as YYYY-MM-DD (not UTC: just after midnight in India the UTC date is still yesterday). */
function localIso(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/**
 * "Today" for the `max` of a birth-date input. It is `undefined` while the static HTML is rendered and
 * hydrated, then the visitor's real date. Computed during render instead, `max` is the BUILD day frozen
 * into the exported HTML — a baby born after the last deploy could not be entered until the next one.
 * (useSyncExternalStore with a server snapshot is React's way to do this without a hydration mismatch.)
 */
export function useTodayIso(): string | undefined {
  return useSyncExternalStore(subscribe, localIso, () => undefined);
}

// A page left open across midnight must notice the new day, so these two re-read the clock every 30 s
// (a snapshot that has not changed causes no re-render) and the moment a tab is shown again: a tab restored
// from the back-forward cache or woken from sleep would otherwise keep yesterday's date until the next tick
const subscribeTick = (onChange: () => void) => {
  const t = setInterval(onChange, 30_000);
  const onVisible = () => {
    if (document.visibilityState === "visible") onChange();
  };
  window.addEventListener("pageshow", onChange);
  document.addEventListener("visibilitychange", onVisible);
  return () => {
    clearInterval(t);
    window.removeEventListener("pageshow", onChange);
    document.removeEventListener("visibilitychange", onVisible);
  };
};

/**
 * India's calendar date, `undefined` while the static HTML is rendered and hydrated. The daily pages bake
 * the build day's times into the HTML; comparing that day with this one (after hydration, so the first
 * client render still equals the server HTML) tells them whether the baked times are still today's.
 */
export function useIstTodayIso(): string | undefined {
  return useSyncExternalStore(subscribeTick, istIsoNow, () => undefined);
}

/** India's clock in minutes after midnight, `null` until hydrated (the "now" highlight is client-only). */
export function useIstMinutes(): number | null {
  return useSyncExternalStore(subscribeTick, istMinutesNow, () => null);
}
