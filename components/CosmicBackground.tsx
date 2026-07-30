"use client";

import { useEffect, useRef } from "react";

export default function CosmicBackground() {
  const svgRef = useRef<SVGSVGElement>(null);
  const chakraRef = useRef<SVGGElement>(null);
  const kundliRef = useRef<SVGGElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let angle = 0;
    let kundliAngle = 0;

    function animate() {
      angle += 0.04;
      kundliAngle -= 0.015;
      if (chakraRef.current) {
        chakraRef.current.setAttribute(
          "transform",
          `rotate(${angle} 50 50)`
        );
      }
      if (kundliRef.current) {
        kundliRef.current.setAttribute(
          "transform",
          `translate(50 50) rotate(${kundliAngle}) translate(-50 -50)`
        );
      }
      rafRef.current = requestAnimationFrame(animate);
    }

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // Seeded PRNG so server and client render identical stars (no hydration mismatch)
  let seed = 108;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  const stars = Array.from({ length: 120 }, () => ({
    cx: rand() * 100,
    cy: rand() * 100,
    r: 0.1 + rand() * 0.25,
    delay: rand() * 4,
  }));

  const spokes = Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * Math.PI * 2;
    const x1 = 50 + 12 * Math.cos(angle);
    const y1 = 50 + 12 * Math.sin(angle);
    const x2 = 50 + 46 * Math.cos(angle);
    const y2 = 50 + 46 * Math.sin(angle);
    return { x1, y1, x2, y2 };
  });

  const nakshatraDots = Array.from({ length: 27 }, (_, i) => {
    const angle = (i / 27) * Math.PI * 2 - Math.PI / 2;
    return {
      cx: 50 + 44 * Math.cos(angle),
      cy: 50 + 44 * Math.sin(angle),
    };
  });

  return (
    <div className="cosmic-bg" aria-hidden="true">
      <svg
        ref={svgRef}
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        style={{ width: "100%", height: "100%" }}
      >
        <defs>
          <style>{`
            /* Gentle twinkle: opacity + a soft scale "breathe", not opacity alone —
               a flat opacity pulse reads as flicker; adding scale reads as light. */
            @keyframes twinkle {
              0%, 100% { opacity: 0.15; transform: scale(0.75); }
              50%      { opacity: 0.75; transform: scale(1.15); }
            }
          `}</style>
          <radialGradient id="vignette" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="100%" stopColor="rgba(81,19,32,0.35)" />
          </radialGradient>
        </defs>

        {/* Twinkling stars — kept at their own visible opacity, independent of
            the decorative chakra/kundli layers below (which stay faint). */}
        <g>
          {stars.map((s, i) => (
            <circle
              key={i}
              cx={s.cx}
              cy={s.cy}
              r={s.r}
              fill="#E7C36A"
              style={{
                transformOrigin: `${s.cx}px ${s.cy}px`,
                animation: `twinkle ${2 + s.delay}s ease-in-out infinite`,
                animationDelay: `${s.delay}s`,
              }}
            />
          ))}
        </g>

        {/* Nakshatra Chakra */}
        <g ref={chakraRef} transform="rotate(0 50 50)" style={{ opacity: 0.14 }}>
          {/* Rings */}
          {[12, 24, 36, 44].map((r) => (
            <circle key={r} cx="50" cy="50" r={r} fill="none" stroke="#C99A3A" strokeWidth="0.3" />
          ))}
          {/* Spokes */}
          {spokes.map((s, i) => (
            <line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke="#C99A3A" strokeWidth="0.2" />
          ))}
          {/* 27 Nakshatra dots */}
          {nakshatraDots.map((d, i) => (
            <circle key={i} cx={d.cx} cy={d.cy} r={0.6} fill="#E7C36A" />
          ))}
          {/* Inner circle */}
          <circle cx="50" cy="50" r="4" fill="none" stroke="#E7C36A" strokeWidth="0.4" />
          <circle cx="50" cy="50" r="1.5" fill="#E7C36A" />
        </g>

        {/* Faint kundli watermark */}
        <g ref={kundliRef} style={{ opacity: 0.06 }}>
          <rect x="38" y="38" width="24" height="24" fill="none" stroke="#C99A3A" strokeWidth="0.4" />
          <line x1="38" y1="38" x2="62" y2="62" stroke="#C99A3A" strokeWidth="0.25" />
          <line x1="62" y1="38" x2="38" y2="62" stroke="#C99A3A" strokeWidth="0.25" />
          <line x1="50" y1="38" x2="50" y2="62" stroke="#C99A3A" strokeWidth="0.25" />
          <line x1="38" y1="50" x2="62" y2="50" stroke="#C99A3A" strokeWidth="0.25" />
        </g>

        {/* Vignette overlay */}
        <rect x="0" y="0" width="100" height="100" fill="url(#vignette)" style={{ opacity: 0.15 }} />
      </svg>
    </div>
  );
}
