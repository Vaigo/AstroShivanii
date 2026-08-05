"use client";

import Icon, { IconName } from "@/components/Icon";

interface PulseItem {
  icon: IconName;
  label_en: string;
  label_hi: string;
  value: string;
}

interface HeavenlyPulseProps {
  sunrise: string;
  sunset: string;
  tithi: string;
  nakshatra: string;
  rahuKaal: string;
  isHi: boolean;
}

/** Quick-glance strip at the top of the day view — additive to the existing
 *  detailed fact-grid lower down (which keeps its Hindi "meaning" captions
 *  and Yoga/Karana/Moon-Phase coverage this strip doesn't repeat). */
export default function HeavenlyPulse({ sunrise, sunset, tithi, nakshatra, rahuKaal, isHi }: HeavenlyPulseProps) {
  const items: PulseItem[] = [
    { icon: "sun", label_en: "Sunrise", label_hi: "सूर्योदय", value: sunrise },
    { icon: "moon", label_en: "Sunset", label_hi: "सूर्यास्त", value: sunset },
    { icon: "calendar", label_en: "Tithi", label_hi: "तिथि", value: tithi },
    { icon: "star", label_en: "Nakshatra", label_hi: "नक्षत्र", value: nakshatra },
    { icon: "shield", label_en: "Rahu Kaal", label_hi: "राहु काल", value: rahuKaal },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(95px, 1fr))", gap: "0.5rem" }}>
      {items.map((it) => (
        <div
          key={it.label_en}
          style={{
            textAlign: "center", padding: "0.6rem 0.4rem", borderRadius: "2px",
            border: "1px solid rgba(201,154,58,0.3)", background: "rgba(201,154,58,0.05)",
          }}
        >
          <div style={{ color: "var(--gold)", display: "flex", justifyContent: "center", marginBottom: "0.25rem" }}>
            <Icon name={it.icon} size={18} />
          </div>
          <div style={{ fontSize: "0.66rem", color: "var(--muted)" }}>{isHi ? it.label_hi : it.label_en}</div>
          <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--maroon-deep)" }}>{it.value}</div>
        </div>
      ))}
    </div>
  );
}
