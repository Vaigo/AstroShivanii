"use client";

import { useI18n } from "@/lib/i18n";
import Reveal from "./Reveal";
import { GOOGLE_PROFILE, GOOGLE_REVIEWS } from "@/lib/reviews";

function Stars({ n }: { n: number }) {
  return (
    <span className="greview-stars" aria-label={`${n} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} style={{ opacity: i < Math.round(n) ? 1 : 0.25 }}>★</span>
      ))}
    </span>
  );
}

/** Compact Google-reviews strip shown near the top of the home page.
 *  Renders nothing until real reviews exist in lib/reviews.ts — never
 *  show an empty or fake social-proof section. */
export default function GoogleReviews() {
  const { lang } = useI18n();
  const isHi = lang === "hi";

  if (GOOGLE_REVIEWS.length === 0 || GOOGLE_PROFILE.count === 0) return null;

  return (
    <section className="section" style={{ paddingTop: "2.5rem", paddingBottom: "2.5rem", background: "rgba(81,19,32,0.04)" }}>
      <div className="container">
        <Reveal>
          <div className="greview-head">
            <span className="greview-logo" aria-label="Google">
              <span style={{ color: "#4285F4" }}>G</span>
              <span style={{ color: "#EA4335" }}>o</span>
              <span style={{ color: "#FBBC05" }}>o</span>
              <span style={{ color: "#4285F4" }}>g</span>
              <span style={{ color: "#34A853" }}>l</span>
              <span style={{ color: "#EA4335" }}>e</span>
            </span>
            <Stars n={GOOGLE_PROFILE.average} />
            <span className="greview-meta">
              {GOOGLE_PROFILE.average.toFixed(1)} · {GOOGLE_PROFILE.count}{" "}
              {isHi ? "समीक्षाएँ" : "reviews"}
            </span>
            <a
              href={GOOGLE_PROFILE.url}
              target="_blank"
              rel="noopener noreferrer"
              className="greview-link"
            >
              {isHi ? "Google पर सभी देखें →" : "See all on Google →"}
            </a>
          </div>
        </Reveal>

        <div className="greview-row">
          {GOOGLE_REVIEWS.slice(0, 6).map((r, i) => (
            <Reveal key={i} delay={i * 70}>
              <figure className="greview-card">
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
                  <span className="greview-avatar">{r.name.charAt(0)}</span>
                  <div>
                    <div className="greview-name">{r.name}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <Stars n={r.rating} />
                      {r.date && <span className="greview-date">{r.date}</span>}
                    </div>
                  </div>
                </div>
                <blockquote className="greview-text">{r.text}</blockquote>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
