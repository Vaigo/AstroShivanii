"use client";

/**
 * The /rashifal index: one card per rashi with today's stars and a one-line summary, each linking to that
 * rashi's page. The build bakes the build day's twelve summaries into the static HTML (`initial`, see
 * lib/baked.ts); the browser keeps them while they are still today's (India's date) and otherwise fetches
 * today's rashifal. Without any data the cards are plain links, as the page was before.
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchRashifal } from "@/lib/api/endpoints";
import type { RashiPrediction } from "@/lib/api/types";
import {
  isRashifalDay,
  starLabelHi,
  starTone,
  stars,
  strongestDomain,
  weakestDomain,
  type RashifalAllBaked,
} from "@/lib/daily-data";
import { fmtHi } from "@/lib/hi-date";
import { RASHIS, RASHI_GLYPH } from "@/lib/rashis";
import { useIstTodayIso } from "@/lib/useToday";

/** A card's figures: the best and the weakest area of the day, each with its own stars and good/bad word (no
 *  combined overall star: see lib/daily-data.ts), then the lucky number. */
function AreaLines({ p }: { p: RashiPrediction }) {
  const best = strongestDomain(p);
  const worst = weakestDomain(p);
  const line = (prefix: string, a: { label: string; stars: number }) => (
    <span className="devanagari" style={{ display: "block", fontSize: "0.8rem", lineHeight: 1.6, color: "var(--ink-light)", marginTop: "0.2rem" }}>
      {prefix}: {a.label}{" "}
      <span role="img" aria-label={`5 में से ${a.stars} सितारे`} style={{ color: "var(--gold-bright)", letterSpacing: "0.06em" }}>{stars(a.stars)}</span>{" "}
      <span style={{ fontWeight: 700, color: starTone(a.stars) }}>{starLabelHi(a.stars)}</span>
    </span>
  );
  return (
    <>
      <span style={{ display: "block", marginTop: "0.35rem" }} />
      {line("सबसे अच्छा", best)}
      {worst.stars < best.stars && line("ध्यान दें", worst)}
      <span className="devanagari" style={{ display: "block", fontSize: "0.8rem", color: "var(--muted)", marginTop: "0.2rem" }}>
        शुभ अंक {p.lucky.number}
      </span>
    </>
  );
}

export default function RashifalAllLive({ initial }: { initial?: RashifalAllBaked | null }) {
  const today = useIstTodayIso(); // undefined until hydrated, so the first client render equals the static HTML
  const baked = initial && (today === undefined || today === initial.date) ? initial : null;
  const needLive = !baked && today !== undefined;

  const [live, setLive] = useState<RashifalAllBaked | null>(null);

  useEffect(() => {
    if (!needLive || !today) return;
    let cancelled = false;
    fetchRashifal(today)
      .then((r) => {
        // a 200 with an unexpected body leaves the plain cards, never a render crash
        if (!cancelled && isRashifalDay(r)) setLive({ date: today, rashifal: r.rashifal });
      })
      .catch(() => { /* the cards still link to every rashi */ });
    return () => {
      cancelled = true;
    };
  }, [needLive, today]);

  const data = baked ?? (live && live.date === today ? live : null);
  const byIndex = new Map<number, RashiPrediction>((data?.rashifal ?? []).map((p) => [p.rashi_index, p]));

  return (
    <div data-baked={baked ? baked.date : undefined}>
      {data && (
        <h2 className="guide-h2 devanagari" style={{ textAlign: "center", marginTop: 0 }}>
          आज का राशिफल · {fmtHi(data.date)}
        </h2>
      )}
      <div className="guide-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "0.8rem" }}>
        {RASHIS.map((r) => {
          const p = byIndex.get(r.index);
          return (
            // .guide-card is a flex ROW (right for its usual icon + text); with stars and a summary under the
            // name a card needs to stack, or the summary is squeezed into a sliver beside the name
            <Link
              key={r.slug}
              href={`/rashifal/${r.slug}/`}
              className="guide-card"
              style={{ padding: "0.9rem 1rem", textAlign: "center", flexDirection: "column", alignItems: "center", gap: "0.1rem" }}
            >
              <span style={{ fontSize: "1.4rem", display: "block" }}>{RASHI_GLYPH[r.index]}</span>
              <strong className="devanagari" style={{ display: "block", marginTop: "0.25rem" }}>{r.name_hi}</strong>
              <span style={{ fontSize: "0.78rem", color: "var(--muted)" }}>{r.name}</span>
              {p && <AreaLines p={p} />}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
