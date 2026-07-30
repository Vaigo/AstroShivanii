"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { waLink } from "@/lib/config";
import Icon from "./Icon";

interface ResultCTAProps {
  /** What the full personal reading covers — shown as an honest 🔒 list.
   *  Only list things Shivanii actually delivers. */
  locked?: Array<{ en: string; hi: string }>;
  /** Result-aware hook line shown above the buttons. */
  hook: { en: string; hi: string };
  /** Pre-filled WhatsApp message (already includes the user's result summary). */
  waText: string;
  /** The paid reading this tool naturally leads to. */
  reading: { href: string; labelEn: string; labelHi: string };
  /** Hide the "तुरंत उत्तर ₹149" button — set this on the Turant Uttar tool's
   *  own CTA, since offering that product from within itself is circular. */
  hideTurantUttar?: boolean;
}

/** Shared conversion block for all free tools: honest locked list +
 *  result-aware hook + WhatsApp (pre-filled) + book-reading CTAs. */
export default function ResultCTA({ locked, hook, waText, reading, hideTurantUttar }: ResultCTAProps) {
  const { lang } = useI18n();
  const isHi = lang === "hi";

  return (
    <div style={{ marginTop: "1.25rem" }}>
      {locked && locked.length > 0 && (
        <div className="locked-box">
          <div className="locked-title">
            {isHi ? "पूर्ण व्यक्तिगत पाठन में और क्या मिलता है" : "What the full personal reading adds"}
          </div>
          <ul className="locked-list">
            {locked.map((item, i) => (
              <li key={i}>
                <span className="locked-icon"><Icon name="lock" size={13} /></span>
                {isHi ? item.hi : item.en}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="soft-cta" style={{ marginTop: "1rem" }}>
        <p>{isHi ? hook.hi : hook.en}</p>
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
          <a
            href={waLink(waText)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
          >
            {isHi ? "WhatsApp पर पूछें" : "Ask on WhatsApp"}
          </a>
          {!hideTurantUttar && (
            <Link href="/tools/turant-uttar" className="btn btn-primary">
              {isHi ? "तुरंत उत्तर पाएं ₹149" : "Get Instant Answer ₹149"}
            </Link>
          )}
          <Link href={reading.href} className="btn btn-ghost">
            {isHi ? reading.labelHi : reading.labelEn}
          </Link>
        </div>
        <p className="cta-note" style={{ fontSize: "0.75rem", marginTop: "0.6rem" }}>
          {isHi
            ? "आपका परिणाम संदेश में पहले से जुड़ा होगा"
            : "Your result summary is pre-filled in the message"}
        </p>
      </div>
    </div>
  );
}
