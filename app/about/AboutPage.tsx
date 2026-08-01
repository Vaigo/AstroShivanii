"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import PatrikaFrame from "@/components/PatrikaFrame";
import Divider from "@/components/Divider";
import Icon, { IconName } from "@/components/Icon";

export default function AboutPage() {
  const { t, lang } = useI18n();

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: "800px" }}>
        <h1 className="section-heading">{t("about.heading")}</h1>
        <p className="section-heading-hi devanagari">{t("about.headingHi")}</p>

        <PatrikaFrame>
          <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start", marginBottom: "2rem", flexWrap: "wrap" }}>
            <img
              src="/shivanii-profile.png"
              alt="Shivanii — ज्योतिषाचार्य शिवानी"
              width={180}
              height={180}
              style={{
                width: "180px",
                height: "180px",
                borderRadius: "50%",
                flexShrink: 0,
                boxShadow: "var(--shadow-card)",
                objectFit: "cover",
              }}
            />
            <div style={{ flex: 1, minWidth: "220px" }}>
              <h2 style={{ marginBottom: "0.3rem", fontSize: "1.6rem" }}>Shivanii</h2>
              <p className="devanagari" style={{ color: "var(--muted)", marginBottom: "1rem" }}>ज्योतिषाचार्य शिवानी</p>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                {([
                  ["sparkle", lang === "hi" ? "प्रमाणित ज्योतिषी" : "Certified Astrologer"],
                  ["compass", lang === "hi" ? "भारत" : "India"],
                  ["globe", lang === "hi" ? "हिंदी" : "Hindi"],
                  ["calendar", lang === "hi" ? "वर्षों का अनुभव" : "Many Years of Experience"],
                ] as Array<[IconName, string]>).map(([icon, text]) => (
                  <p key={text} style={{ color: "var(--ink-light)", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ color: "var(--gold)", display: "flex" }}><Icon name={icon} size={16} /></span>
                    {text}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <Divider symbol="ॐ" />

          {/* Story placeholder */}
          <div style={{ marginBottom: "2rem" }}>
            <h3 style={{ marginBottom: "0.75rem" }}>{lang === "hi" ? "उनकी सोच" : "Her Approach"}</h3>
            <div style={{ padding: "1.5rem", background: "rgba(201,154,58,0.06)", border: "1px solid rgba(201,154,58,0.3)", borderRadius: "2px" }}>
              {lang === "hi" ? (
                <>
                  <p className="devanagari" style={{ marginBottom: "0.9rem", color: "var(--ink-light)" }}>
                    शिवानी जी की ज्योतिष-पद्धति शास्त्रीय सिद्धांतों पर आधारित है, शॉर्टकट्स पर नहीं। हर पाठन एक वास्तविक
                    जन्म-कुंडली से शुरू होता है — सही जन्म-समय, सही अयनांश और प्रश्न के अनुसार सही वर्ग-कुंडली का पूरा ध्यान
                    रखते हुए। वे ज्योतिष को स्पष्टता का एक माध्यम मानती हैं, निर्णय नहीं — जो आपकी प्रवृत्तियों और समय को
                    समझने में मदद करे, न कि आपके अपने विवेक की जगह ले।
                  </p>
                  <p className="devanagari" style={{ color: "var(--ink-light)" }}>
                    हर ग्राहक के लिए उनकी एक ही अपेक्षा है — एक ईमानदार उत्तर, इतनी सरलता से समझाया गया कि वह वाकई समझ
                    आए, बिना किसी डर-आधारित उपाय या अनचाहे प्रतिवेदन में उलझाए। अगर कुंडली में कोई कठिन समय दिखे, तो वे
                    इसे स्पष्ट रूप से बताती हैं — साथ ही यह भी, कि वास्तव में क्या सहायक हो सकता है।
                  </p>
                </>
              ) : (
                <>
                  <p style={{ marginBottom: "0.9rem", color: "var(--ink-light)" }}>
                    Shivanii&apos;s approach to Vedic astrology is rooted in classical technique, not shortcuts.
                    Every reading starts with a real birth chart, computed with careful attention to the
                    details that are easy to skip — the exact birth time, the correct ayanamsa, the right
                    divisional chart for the question being asked. She treats astrology as a tool for
                    clarity, not a verdict — something that helps you understand tendencies and timing, not
                    a substitute for your own judgment.
                  </p>
                  <p style={{ color: "var(--ink-light)" }}>
                    What she wants every client to walk away with is simple: an honest answer, explained in
                    a way that actually makes sense, without being talked into fear-driven remedies or
                    reports you didn&apos;t ask for. If a chart shows a difficult period, she&apos;ll tell
                    you so plainly — along with what, if anything, can genuinely help.
                  </p>
                </>
              )}
            </div>
          </div>

          <h3 style={{ marginBottom: "0.75rem" }}>Approach & Values</h3>
          <div className="grid-2" style={{ marginBottom: "2rem" }}>
            {([
              { icon: "user", title: "Personal, not templated", desc: "Every chart is read fresh, for you alone. No copy-paste, no recycled reports." },
              { icon: "eye", title: "Transparent predictions", desc: "Honest about what astrology can and can't say. Confidence levels included." },
              { icon: "lock", title: "Privacy first", desc: "Your birth details are used only to read your chart and never shared or sold." },
              { icon: "diya", title: "Hindi-first", desc: "Comfortable explaining complex Vedic concepts in Hindi, the way it should be." },
            ] as Array<{ icon: IconName; title: string; desc: string }>).map((v) => (
              <div key={v.title} style={{ padding: "1rem", background: "rgba(201,154,58,0.06)", border: "1px solid rgba(201,154,58,0.3)", borderRadius: "2px" }}>
                <div style={{ color: "var(--maroon)", marginBottom: "0.4rem" }}>
                  <Icon name={v.icon} size={22} />
                </div>
                <strong style={{ fontSize: "0.95rem", color: "var(--maroon-deep)" }}>{v.title}</strong>
                <p style={{ fontSize: "0.85rem", color: "var(--ink-light)", marginTop: "0.25rem" }}>{v.desc}</p>
              </div>
            ))}
          </div>

          <Divider />

          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/book" className="btn btn-primary">
              Book a Reading
            </Link>
            <Link href="/contact" className="btn btn-ghost">
              WhatsApp / Contact
            </Link>
          </div>
        </PatrikaFrame>
      </div>
    </section>
  );
}
