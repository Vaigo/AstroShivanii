import React from "react";

interface PatrikaFrameProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function PatrikaFrame({ children, className = "", style }: PatrikaFrameProps) {
  return (
    <div className={`patrika-frame ${className}`} style={style}>
      {children}
    </div>
  );
}
