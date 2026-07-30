import React from "react";

interface PatrikaFrameProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/** Filigree corner ornament — two-tone solid strokes (deep gold + highlight)
 *  so no SVG gradient ids are needed (ids would collide across frames). */
function Corner({ rotate }: { rotate: number }) {
  return (
    <svg
      className="pf-corner"
      viewBox="0 0 32 32"
      aria-hidden="true"
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {/* corner rule */}
      <path d="M3 30 V11 Q3 3 11 3 H30" fill="none" stroke="#a8791f" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M4.2 28 V11.5 Q4.2 4.2 11.5 4.2 H28" fill="none" stroke="#ecd08a" strokeWidth="0.9" strokeLinecap="round" opacity="0.85" />
      {/* inner curl */}
      <path d="M11 3 Q17 5.5 15 11 Q13.5 15.5 8.5 13.5" fill="none" stroke="#a8791f" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8.5 13.5 Q6.5 12.6 6.8 10.8" fill="none" stroke="#a8791f" strokeWidth="1.2" strokeLinecap="round" />
      {/* leaf dots */}
      <circle cx="19.5" cy="8" r="1.7" fill="#c99a3a" />
      <circle cx="19.5" cy="8" r="0.7" fill="#f2dc9b" />
      <circle cx="9" cy="19.5" r="1.4" fill="#c99a3a" />
    </svg>
  );
}

export default function PatrikaFrame({ children, className = "", style }: PatrikaFrameProps) {
  return (
    <div className={`patrika-frame ${className}`} style={style}>
      <Corner rotate={0} />
      <Corner rotate={90} />
      <Corner rotate={180} />
      <Corner rotate={270} />
      {children}
    </div>
  );
}
