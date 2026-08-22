"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import PatrikaFrame from "@/components/PatrikaFrame";
import Divider from "@/components/Divider";
import Breadcrumbs from "@/components/Breadcrumbs";
import Icon from "@/components/Icon";
import type { Reading } from "@/lib/readings";
import { readingName, readingDesc, readingBestFor } from "@/lib/readings";

interface Props {
  reading: Reading;
}

export default function ReadingDetail({ reading }: Props) {
  const { lang } = useI18n();
  const isHi = lang === "hi";
  const name = readingName(reading.slug, lang);
  const desc = readingDesc(reading.slug, lang);
  const bestFor = readingBestFor(reading.slug, lang);
  const nameHi = readingName(reading.slug, "hi");

  const steps = isHi
    ? ["बुक करें और जन्म विवरण भेजें", "शिवानी स्वयं आपकी कुंडली पढ़ती हैं", "48 घंटे में पाठन प्राप्त करें + 1 निःशुल्क फ़ॉलो-अप"]
    : ["Book & share your birth details", "Shivanii personally reads your chart", "Receive it within 48 hours + 1 free follow-up"];

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: "760px" }}>
        <Breadcrumbs
          crumbs={[
            { name: "Home", href: "/" },
            { name: isHi ? "पाठन" : "Readings", href: "/readings" },
            { name },
          ]}
        />

        <PatrikaFrame>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div
              className="contact-icon"
              style={{ width: "72px", height: "72px", marginBottom: "1rem" }}
            >
              <Icon name={reading.icon} size={34} />
            </div>
            <h1 style={{ marginBottom: "0.35rem" }}>{name}</h1>
            {lang === "en" && (
              <p className="devanagari" style={{ color: "var(--muted)", fontSize: "1rem" }}>{nameHi}</p>
            )}
            <div style={{ marginTop: "1rem", display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <span className="service-card-price">₹{reading.priceINR.toLocaleString("en-IN")}</span>
              {reading.durationMin && (
                <span style={{ color: "var(--muted)", fontSize: "0.9rem", display: "flex", alignItems: "center" }}>
                  {reading.durationMin} {isHi ? "मिनट" : "min"}
                </span>
              )}
              {reading.popular && <span className="badge">{isHi ? "सबसे लोकप्रिय" : "Most Loved"}</span>}
            </div>
          </div>

          <Divider />

          <p style={{ color: "var(--ink-light)", lineHeight: 1.8, fontSize: "1rem", marginBottom: "1.25rem" }}>
            {desc}
          </p>

          {bestFor && (
            <div className="best-for" style={{ marginBottom: "2rem" }}>
              <strong>✓ {isHi ? "किसके लिए सही:" : "Best for:"}</strong>
              <span>{bestFor}</span>
            </div>
          )}

          <div style={{ background: "rgba(201,154,58,0.08)", border: "1px solid var(--gold)", borderRadius: "2px", padding: "1.25rem", marginBottom: "1.5rem" }}>
            <h3 style={{ fontSize: "1rem", marginBottom: "0.75rem", color: "var(--maroon-deep)" }}>
              {isHi ? "आपको क्या मिलेगा" : "What you'll receive"}
            </h3>
            <ul style={{ paddingLeft: "1.2rem", color: "var(--ink-light)", fontSize: "0.9rem", lineHeight: 1.8 }}>
              <li>{isHi ? "शिवानी द्वारा व्यक्तिगत विश्लेषण — कोई टेम्पलेट नहीं" : "Personalised analysis by Shivanii — not a template"}</li>
              <li>{isHi ? "लिखित पाठन 48 घंटे में (शिवानी जी से सीधे पूछें — 24 घंटे में)" : "Written reading delivered within 48 hours (24 hours for Ask Shivanii Directly)"}</li>
              <li>{isHi ? "WhatsApp पर एक फ़ॉलो-अप प्रश्न शामिल" : "One follow-up question via WhatsApp included"}</li>
              {reading.slug === "live-consultation" && (
                <li>{isHi ? "बुकिंग के बाद Zoom / फ़ोन कॉल लिंक" : "Zoom / phone call link sent after booking confirmation"}</li>
              )}
              {reading.slug === "annual-forecast" && (
                <li>{isHi ? "सभी प्रमुख जीवन क्षेत्रों के मासिक हाइलाइट" : "Month-by-month highlights for all major life areas"}</li>
              )}
              {reading.slug === "lal-kitab-remedies" && (
                <li>{isHi ? "विशिष्ट, किफ़ायती उपाय — सामान्य सलाह नहीं" : "Specific, affordable remedies — not generic advice"}</li>
              )}
            </ul>
          </div>

          {/* What happens after booking — plain 3 steps */}
          <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", flexWrap: "wrap", marginBottom: "2rem" }}>
            {steps.map((s, i) => (
              <span
                key={i}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  fontSize: "0.78rem",
                  color: "var(--muted)",
                  background: "rgba(255,255,255,0.5)",
                  border: "1px solid rgba(201,154,58,0.3)",
                  borderRadius: "99px",
                  padding: "0.3rem 0.8rem",
                }}
              >
                <strong style={{ color: "var(--saffron)" }}>{i + 1}.</strong> {s}
              </span>
            ))}
          </div>

          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href={`/book?reading=${reading.slug}`} className="btn btn-primary btn-lg">
              {isHi ? "अभी बुक करें" : "Book Now"} — ₹{reading.priceINR.toLocaleString("en-IN")}
            </Link>
            <Link href="/contact" className="btn btn-ghost">
              {isHi ? "पहले WhatsApp पर पूछें" : "Questions? WhatsApp first"}
            </Link>
          </div>

          <p style={{ textAlign: "center", fontSize: "0.8rem", color: "var(--muted)", marginTop: "1rem" }}>
            {isHi
              ? "Razorpay से सुरक्षित भुगतान।"
              : "Secure payment via Razorpay."}
          </p>
        </PatrikaFrame>

        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <Link href="/readings" style={{ color: "var(--muted)", fontSize: "0.875rem" }}>
            ← {isHi ? "सभी पाठन देखें" : "Back to all readings"}
          </Link>
        </div>
      </div>
    </section>
  );
}
