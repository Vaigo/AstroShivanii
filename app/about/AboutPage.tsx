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

              {/* PLACEHOLDER: Replace with actual credentials */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                {([
                  ["sparkle", "[Degree / certification — to be added by Shivanii]"],
                  ["compass", "[City, India]"],
                  ["globe", "Hindi (native) · English · [Other language?]"],
                  ["calendar", "[X years of practice — to be added]"],
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
            <h3 style={{ marginBottom: "0.75rem" }}>Her Story</h3>
            {/* PLACEHOLDER: Shivanii to provide personal astrology origin story */}
            <div
              style={{
                background: "rgba(201,154,58,0.08)",
                border: "1px dashed var(--gold)",
                borderRadius: "2px",
                padding: "1.5rem",
                fontStyle: "italic",
                color: "var(--muted)",
                fontSize: "0.9rem",
              }}
            >
              <p style={{ marginBottom: "0.75rem" }}>
                [Shivanii's personal story — how she came to astrology, what drew her to the Vedic tradition,
                pivotal moments in her practice — will be written here.]
              </p>
              <p>
                [Her approach to readings, why she values honesty over fear-selling, and what she hopes
                clients take away from their consultations.]
              </p>
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
