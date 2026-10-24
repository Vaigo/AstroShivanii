"use client";

import { useEffect, useRef, useState } from "react";

interface CountUpProps {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}

export default function CountUp({ end, suffix = "", prefix = "", duration = 1400 }: CountUpProps) {
  // Start at the FINAL value: the static HTML (what crawlers, link previews and no-JS visitors read)
  // must say "237", not "0" — it used to read "0 free tools" and "₹0 readings start at". The count-up
  // only replays the number from 0 when the element scrolls into view, and only if motion is allowed.
  const [val, setVal] = useState(end);
  const spanRef = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = spanRef.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return; // keeps the final value

    // The observer's first callback reports where the counter is at load. Already on screen: leave the final
    // number alone (a reset would flash final -> 0 -> count). Below the fold: reset to 0 now, while nobody
    // can see it, so scrolling it in never shows the final value first.
    let primed = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (started.current) return;
        if (!primed) {
          primed = true;
          if (entry.isIntersecting) {
            started.current = true;
            observer.unobserve(el);
          } else {
            setVal(0);
          }
          return;
        }
        if (entry.isIntersecting) {
          started.current = true;
          const startTime = performance.now();
          const tick = (now: number) => {
            const p = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setVal(Math.round(eased * end));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          observer.unobserve(el);
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration]);

  return (
    <span ref={spanRef}>
      {prefix}{val.toLocaleString("en-IN")}{suffix}
    </span>
  );
}
