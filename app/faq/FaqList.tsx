"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { FAQS } from "@/lib/faq";
import Reveal from "@/components/Reveal";

export default function FaqList() {
  const { lang } = useI18n();
  const isHi = lang === "hi";

  return (
    <div className="container" style={{ maxWidth: "760px" }}>
      <h1 className="section-heading">
        {isHi ? "अक्सर पूछे जाने वाले प्रश्न" : "Frequently Asked Questions"}
      </h1>
      <p className="section-heading-hi devanagari">
        {isHi ? "आपके हर सवाल का ईमानदार जवाब" : "अक्सर पूछे जाने वाले प्रश्न"}
      </p>
      <p style={{ textAlign: "center", color: "var(--muted)", marginBottom: "2.5rem", fontSize: "0.95rem" }}>
        {isHi
          ? "बुकिंग, सटीकता, गोपनीयता और मूल्य के बारे में सब कुछ — साफ़ शब्दों में।"
          : "Everything about bookings, accuracy, privacy, and pricing — in plain words."}
      </p>

      <div className="faq-list">
        {FAQS.map((f, i) => (
          <Reveal key={i} delay={Math.min(i, 6) * 40}>
            <details className="faq-item" {...(i === 0 ? { open: true } : {})}>
              <summary className="faq-q">
                <span>{isHi ? f.q.hi : f.q.en}</span>
                <span className="faq-chevron" aria-hidden="true">›</span>
              </summary>
              <div className="faq-a">{isHi ? f.a.hi : f.a.en}</div>
            </details>
          </Reveal>
        ))}
      </div>

      <div className="faq-cta">
        <p style={{ color: "var(--muted)", marginBottom: "1rem", fontSize: "0.95rem" }}>
          {isHi ? "कोई और सवाल? सीधे पूछिए —" : "Still have a question? Just ask —"}
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/contact" className="btn btn-primary">
            {isHi ? "WhatsApp पर पूछें" : "Ask on WhatsApp"}
          </Link>
          <Link href="/book" className="btn btn-ghost">
            {isHi ? "पाठन बुक करें" : "Book a Reading"}
          </Link>
        </div>
      </div>
    </div>
  );
}
