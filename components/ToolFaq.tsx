"use client";

import { useI18n } from "@/lib/i18n";
import type { FaqItem } from "@/lib/faq";

/** The "आम सवाल / Common questions" block on tool pages, in the visitor's
 *  language. The static HTML is Hindi (the default), which is also what each
 *  page's FAQPage JSON-LD carries. */
export default function ToolFaq({ faqs }: { faqs: FaqItem[] }) {
  const { lang } = useI18n();
  const isHi = lang === "hi";
  const dev = isHi ? " devanagari" : "";

  return (
    <>
      <h2 className={`guide-h2${dev}`}>{isHi ? "आम सवाल" : "Common questions"}</h2>
      <div className="faq-list">
        {faqs.map((f, i) => (
          <details key={i} className="faq-item">
            <summary className={`faq-q${dev}`}>
              <span>{isHi ? f.q.hi : f.q.en}</span>
              <span className="faq-chevron" aria-hidden="true">›</span>
            </summary>
            <div className={`faq-a${dev}`}>{isHi ? f.a.hi : f.a.en}</div>
          </details>
        ))}
      </div>
    </>
  );
}
