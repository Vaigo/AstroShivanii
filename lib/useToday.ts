import { useSyncExternalStore } from "react";

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
