"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import Divider from "./Divider";
import PatrikaFrame from "./PatrikaFrame";
import Reveal from "./Reveal";
import WhyShivanii from "./WhyShivanii";
import PriceAnchor from "./PriceAnchor";
import Testimonials from "./Testimonials";
import GoogleReviews from "./GoogleReviews";
import HowItWorks from "./HowItWorks";
import Icon, { IconName } from "./Icon";
import { FAQS } from "@/lib/faq";
import { GUIDES } from "@/lib/guides";
import { CATEGORIES } from "@/lib/turant-uttar-data";

const READINGS: Array<{
  slug: string;
  icon: IconName;
  price: string;
  key: string;
  mostLoved?: boolean;
  tag?: { en: string; hi: string };
}> = [
  { slug: "ask-one-question",   icon: "question",  price: "₹499",   key: "prashna",
    tag: { en: "Focused", hi: "केंद्रित" } },
  { slug: "birth-chart",        icon: "scroll",    price: "₹999",   key: "kundli", mostLoved: true },
  { slug: "marriage-matching",  icon: "rings",     price: "₹1,299", key: "matching",
    tag: { en: "36-Point", hi: "36 गुण" } },
  { slug: "career-money",       icon: "briefcase", price: "₹1,199", key: "career",
    tag: { en: "Dasha-Based", hi: "दशा-आधारित" } },
  { slug: "live-consultation",  icon: "phone",     price: "₹1,999", key: "live",
    tag: { en: "Live Call", hi: "लाइव संवाद" } },
  { slug: "annual-forecast",    icon: "calendar",  price: "₹1,499", key: "varshphal",
    tag: { en: "Full Year", hi: "पूरे वर्ष का" } },
  { slug: "lal-kitab-remedies", icon: "book",      price: "₹899",   key: "lalkitab",
    tag: { en: "Remedy-Focused", hi: "उपाय-केंद्रित" } },
  { slug: "kp-precision",       icon: "target",    price: "₹1,499", key: "kp",
    tag: { en: "Precise Timing", hi: "सटीक समय" } },
  { slug: "bhrigu-nadi-deep",   icon: "leaf",      price: "₹3,999", key: "bhrigu",
    tag: { en: "Most In-Depth", hi: "सबसे गहन" } },
];

const FREE_TOOLS: Array<{ slug: string; icon: IconName; key: string }> = [
  { slug: "panchang",            icon: "sun",      key: "panchang" },
  { slug: "kundli",              icon: "scroll",   key: "kundli" },
  { slug: "baal-kundli",         icon: "leaf",     key: "baalKundli" },
  { slug: "matching",            icon: "rings",    key: "matching" },
  { slug: "rashifal",            icon: "star",     key: "rashifal" },
  { slug: "sade-sati",           icon: "planet",   key: "sadeSati" },
  { slug: "numerology",          icon: "hash",     key: "numerology" },
  { slug: "tarot",               icon: "cards",    key: "tarot" },
  { slug: "lal-kitab",           icon: "book",     key: "lalKitab" },
  { slug: "lucky-colors",        icon: "droplet",  key: "luckyColors" },
  { slug: "kaal-sarp-dosha",     icon: "shield",   key: "kaalSarpDosha" },
  { slug: "favorable-alphabet",  icon: "type",     key: "favorableAlphabet" },
  { slug: "personal-year",       icon: "calendar", key: "personalYear" },
  { slug: "karmic-debt",         icon: "eye",      key: "karmicDebt" },
];

export default function HomePage() {
  const { t, lang } = useI18n();
  const isHi = lang === "hi";

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section
        style={{
          minHeight: "88vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "5rem 1.5rem 4rem",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "800px", width: "100%" }}>
          {/* FOMO badge — above the frame */}
          <div style={{ textAlign: "center", marginBottom: "1rem" }}>
            <div className={`fomo-badge${isHi ? " devanagari" : ""}`}>
              <span className="fomo-dot" />
              {isHi
                ? "शिवानी जी सप्ताह में केवल 8 कुंडलियां स्वयं पढ़ती हैं — इसीलिए हर पाठन व्यक्तिगत है"
                : "Shivanii personally reads only 8 charts a week — that's why every reading is personal"}
            </div>
          </div>

          <PatrikaFrame style={{ padding: "2.25rem 2.5rem 3rem" }}>
            <div className="hero-stagger">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/ganesha.png"
                alt="श्री गणेश"
                className="hero-ganesha"
                onError={(e) => { e.currentTarget.style.display = "none"; }}
              />
              <p
                className="devanagari"
                style={{
                  fontSize: "1.5rem",
                  color: "var(--gold-deep)",
                  letterSpacing: "0.1em",
                  marginBottom: "1rem",
                  fontWeight: 400,
                }}
              >
                {t("hero.invocation")}
              </p>

              <p
                className="devanagari"
                style={{
                  fontSize: "clamp(1rem, 2.5vw, 1.3rem)",
                  color: "var(--muted)",
                  marginBottom: "0.5rem",
                }}
              >
                {t("hero.taglineDevanagari")}
              </p>

              <h1 style={{ marginBottom: "0.6rem", fontSize: "clamp(2.2rem, 6vw, 4rem)" }}>
                {t("hero.name")}
              </h1>

              {/* Punchy tagline replacing generic subtitle */}
              <p
                style={{
                  fontSize: "clamp(1rem, 2vw, 1.15rem)",
                  color: "var(--maroon-mid)",
                  fontWeight: 600,
                  marginBottom: "0.5rem",
                }}
              >
                Genuine predictions — made for your chart, your questions, your life.
              </p>
              <p
                className="devanagari"
                style={{
                  fontSize: "0.95rem",
                  color: "var(--muted)",
                  marginBottom: "1.75rem",
                }}
              >
                असली भविष्यवाणी — आपकी कुंडली, आपके प्रश्न, आपके जीवन के लिए
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  justifyContent: "center",
                  flexWrap: "wrap",
                  marginBottom: "1.5rem",
                }}
              >
                <Link href="/book" className="btn btn-primary btn-lg">
                  {t("hero.ctaPrimary")}
                </Link>
                <Link href="/tools" className="btn btn-ghost btn-lg">
                  {t("hero.ctaSecondary")}
                </Link>
              </div>

              <p style={{ fontSize: "0.85rem", color: "var(--muted)", fontStyle: "italic" }}>
                {t("hero.trustLine")} &nbsp;·&nbsp; Vedic Astrology · Hindi & English
              </p>
              <p className="devanagari" style={{ fontSize: "0.82rem", color: "var(--maroon)", fontWeight: 600, marginTop: "0.6rem" }}>
                ✓ बिना रजिस्ट्रेशन &nbsp; ✓ बिना OTP &nbsp; ✓ आपकी जानकारी 100% गुप्त
              </p>
            </div>
          </PatrikaFrame>
        </div>
      </section>

      {/* ── Google Reviews (renders only once real reviews are in lib/reviews.ts) ── */}
      <GoogleReviews />

      {/* ── Free Tools ───────────────────────────────────────────────────────── */}
      <section className="section" style={{ background: "rgba(81,19,32,0.04)" }}>
        <div className="container">
          <Reveal>
            <h2 className="section-heading">{t("tools.heading")}</h2>
            <p className="section-heading-hi">{t("tools.subheading")}</p>
            <p className={isHi ? "devanagari" : undefined} style={{ textAlign: "center", color: "var(--maroon)", fontWeight: 600, fontSize: "0.92rem", marginTop: "-0.5rem", marginBottom: "2rem" }}>
              {t("tools.attract")}
            </p>
          </Reveal>

          <div className="grid-3" style={{ marginBottom: "2rem" }}>
            {FREE_TOOLS.map((tool, i) => (
              <Reveal key={tool.slug} delay={i * 70}>
                <Link href={`/tools/${tool.slug}`} style={{ textDecoration: "none", display: "block", height: "100%" }}>
                  <div className="service-card" style={{ cursor: "pointer", height: "100%" }}>
                    <div className="service-card-icon">
                      <Icon name={tool.icon} size={24} />
                    </div>
                    <div className="service-card-title">
                      {t(`tools.${tool.key}` as Parameters<typeof t>[0])}
                    </div>
                    <div className="service-card-title-hi">
                      {t(`tools.${tool.key}Desc` as Parameters<typeof t>[0])}
                    </div>
                    <div style={{ marginTop: "auto" }}>
                      <span className="btn btn-ghost btn-sm">{t("tools.tryFree")}</span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── तुरंत उत्तर — the ₹149 rung between free tools and full readings ── */}
      <section className="section" style={{ paddingTop: "3rem", paddingBottom: "3rem" }}>
        <div className="container" style={{ maxWidth: "900px" }}>
          <Reveal>
            <PatrikaFrame style={{ border: "1.5px solid var(--gold)" }}>
              <div style={{ textAlign: "center", marginBottom: "1.1rem" }}>
                <span style={{ display: "inline-block", background: "var(--gold)", color: "var(--maroon-deep)", fontSize: "0.7rem", fontWeight: 700, padding: "0.2rem 0.6rem", borderRadius: "2px", marginBottom: "0.6rem" }}>
                  ₹149 · तुरंत उत्तर
                </span>
                <h2 style={{ fontSize: "1.35rem", marginBottom: "0.25rem" }}>
                  {isHi ? "एक सवाल है? तुरंत उत्तर पाएं" : "One question? Get an instant answer"}
                </h2>
                <p className={isHi ? "devanagari" : undefined} style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
                  {isHi
                    ? "अपना प्रश्न चुनें — आपकी वास्तविक कुंडली से गणना, उत्तर मिनटों में"
                    : "Pick your question — computed from your real chart, answered in minutes"}
                </p>
              </div>
              <div className="tu-category-grid">
                {CATEGORIES.slice(0, 6).map((cat) => (
                  <Link
                    key={cat.key}
                    href={`/tools/turant-uttar?category=${cat.key}`}
                    className="tu-category-chip"
                    style={{ textDecoration: "none" }}
                  >
                    <span className="tu-category-chip-icon"><Icon name={cat.icon} size={20} /></span>
                    <span className="tu-category-chip-text">{isHi ? cat.chip.hi : cat.chip.en}</span>
                  </Link>
                ))}
              </div>
              <p style={{ textAlign: "center", marginTop: "0.75rem" }}>
                <Link href="/tools/turant-uttar" style={{ fontSize: "0.85rem", color: "var(--maroon)", fontWeight: 600 }}>
                  {isHi ? "सभी प्रश्न देखें या अपना प्रश्न लिखें →" : "See all questions or ask your own →"}
                </Link>
              </p>
            </PatrikaFrame>
          </Reveal>
        </div>
      </section>

      {/* ── जन्म समय शुद्धिकरण — ₹1100, the rung above तुरंत उत्तर ── */}
      <section className="section" style={{ paddingTop: "1rem", paddingBottom: "3rem" }}>
        <div className="container" style={{ maxWidth: "900px" }}>
          <Reveal>
            <PatrikaFrame style={{ border: "1.5px solid var(--gold)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", flexWrap: "wrap" }}>
                <div className="service-card-icon" style={{ flexShrink: 0 }}>
                  <Icon name="clock" size={26} />
                </div>
                <div style={{ flex: 1, minWidth: 220 }}>
                  <span style={{ display: "inline-block", background: "var(--gold)", color: "var(--maroon-deep)", fontSize: "0.7rem", fontWeight: 700, padding: "0.2rem 0.6rem", borderRadius: "2px", marginBottom: "0.5rem" }}>
                    ₹1100 · जन्म समय शुद्धिकरण
                  </span>
                  <h2 style={{ fontSize: "1.25rem", marginBottom: "0.2rem" }}>
                    {isHi ? "जन्म समय पता नहीं?" : "Don't know your exact birth time?"}
                  </h2>
                  <p className={isHi ? "devanagari" : undefined} style={{ color: "var(--muted)", fontSize: "0.9rem", margin: 0 }}>
                    {isHi
                      ? "अपने जीवन की कुछ निश्चित घटनाएं बताएं — हम दशा-गणना से आपका सही जन्म समय (और आवश्यकता होने पर तारीख) निकालते हैं"
                      : "Tell us a few certain life events — we narrow down your real birth time (and date, if needed) using dasha analysis"}
                  </p>
                </div>
                <Link href="/tools/time-rectification" className="btn btn-primary">
                  {isHi ? "शुरू करें →" : "Get Started →"}
                </Link>
              </div>
            </PatrikaFrame>
          </Reveal>
        </div>
      </section>

      {/* ── अंक ज्योतिष सूट + वार्षिक भविष्यफल — instant-compute paid tools ── */}
      <section className="section" style={{ paddingTop: "0", paddingBottom: "3rem" }}>
        <div className="container" style={{ maxWidth: "900px" }}>
          <Reveal>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
              <PatrikaFrame style={{ border: "1.5px solid var(--gold)" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", height: "100%" }}>
                  <div className="service-card-icon"><Icon name="hash" size={24} /></div>
                  <span style={{ display: "inline-block", background: "var(--gold)", color: "var(--maroon-deep)", fontSize: "0.7rem", fontWeight: 700, padding: "0.2rem 0.6rem", borderRadius: "2px", width: "fit-content" }}>
                    ₹299 · अंक ज्योतिष सूट
                  </span>
                  <h2 style={{ fontSize: "1.15rem", margin: 0 }}>
                    {isHi ? "प्रेम, करियर, व्यापार, विवाह" : "Love, Career, Business, Marriage"}
                  </h2>
                  <p className={isHi ? "devanagari" : undefined} style={{ color: "var(--muted)", fontSize: "0.88rem", margin: 0, flex: 1 }}>
                    {isHi
                      ? "आपके मूलांक व भाग्यांक से चार-आयामी अंक ज्योतिष रिपोर्ट, एक साथ"
                      : "A 4-in-1 numerology report from your Mulank and Bhagyank, instantly"}
                  </p>
                  <Link href="/tools/numerology-suite" className="btn btn-primary" style={{ width: "100%" }}>
                    {isHi ? "शुरू करें →" : "Get Started →"}
                  </Link>
                </div>
              </PatrikaFrame>
              <PatrikaFrame style={{ border: "1.5px solid var(--gold)" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", height: "100%" }}>
                  <div className="service-card-icon"><Icon name="calendar" size={24} /></div>
                  <span style={{ display: "inline-block", background: "var(--gold)", color: "var(--maroon-deep)", fontSize: "0.7rem", fontWeight: 700, padding: "0.2rem 0.6rem", borderRadius: "2px", width: "fit-content" }}>
                    ₹1,499 · वार्षिक भविष्यफल
                  </span>
                  <h2 style={{ fontSize: "1.15rem", margin: 0 }}>
                    {isHi ? "आपका आने वाला वर्ष कैसा रहेगा?" : "What does your coming year hold?"}
                  </h2>
                  <p className={isHi ? "devanagari" : undefined} style={{ color: "var(--muted)", fontSize: "0.88rem", margin: 0, flex: 1 }}>
                    {isHi
                      ? "वर्षफल (सौर वापसी कुंडली) से करियर, धन, स्वास्थ्य व रिश्तों का पूर्ण विश्लेषण"
                      : "A full Varshphal (solar-return) forecast — career, finance, health & relationships"}
                  </p>
                  <Link href="/tools/varshphal-yearly" className="btn btn-primary" style={{ width: "100%" }}>
                    {isHi ? "शुरू करें →" : "Get Started →"}
                  </Link>
                </div>
              </PatrikaFrame>
            </div>
          </Reveal>
        </div>
      </section>

      <Divider symbol="ॐ" />

      {/* ── Readings / Services ──────────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <Reveal>
            <h2 className="section-heading">
              <span className="premium-accent">Premium</span> {t("services.heading").replace(/^Premium\s*/, "")}
            </h2>
            <p className="section-heading-hi devanagari">
              <span className="premium-accent">Premium</span> {t("services.headingHi").replace(/^Premium\s*/, "")}
            </p>
            <p className={isHi ? "devanagari" : undefined} style={{ textAlign: "center", color: "var(--maroon)", fontWeight: 600, fontSize: "0.92rem", marginTop: "-0.5rem", marginBottom: "2rem" }}>
              {t("services.attract")}
            </p>
          </Reveal>

          {/* exact-3: 9 cards = clean 3×3 (auto-fit rendered an orphaned 4+4+1) */}
          <div className="grid-exact-3">
            {READINGS.map((r, i) => (
              <Reveal key={r.slug} delay={i * 55}>
                <div className="service-card" style={{ height: "100%" }}>
                  {r.mostLoved ? (
                    <span
                      className="badge"
                      style={{ position: "absolute", top: "1rem", right: "1rem", zIndex: 1 }}
                    >
                      {t("pricing.mostLoved")}
                    </span>
                  ) : r.tag && (
                    <span className="service-card-eyebrow">
                      {isHi ? r.tag.hi : r.tag.en}
                    </span>
                  )}
                  <div className="service-card-icon">
                    <Icon name={r.icon} size={24} />
                  </div>
                  <div className="service-card-title">
                    {t(`services.${r.key}` as Parameters<typeof t>[0])}
                  </div>
                  <div className="service-card-title-hi devanagari">
                    {t(`services.${r.key}Hi` as Parameters<typeof t>[0])}
                  </div>
                  <p className="service-card-desc">
                    {t(`services.${r.key}Desc` as Parameters<typeof t>[0])}
                  </p>
                  {/* Delivery + personal-touch chips — the two facts buyers ask first */}
                  <div className="reading-chips">
                    <span className="reading-chip">
                      {r.slug === "live-consultation"
                        ? (isHi ? "30 मिनट लाइव" : "30 min live")
                        : (isHi ? "24–48 घंटे में" : "in 24–48 hrs")}
                    </span>
                    <span className="reading-chip">{isHi ? "शिवानी स्वयं" : "By Shivanii herself"}</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginTop: "auto",
                    }}
                  >
                    <span className="service-card-price">{r.price}</span>
                    <Link href={`/book?reading=${r.slug}`} className="btn btn-secondary btn-sm">
                      {t("pricing.bookNow")}
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={80}>
            <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
              <p style={{ marginBottom: "1rem", color: "var(--muted)", fontSize: "0.9rem" }}>
                {t("pricing.discovery")}
              </p>
              <a href="/contact" className="btn btn-ghost">{t("pricing.whatsapp")}</a>
            </div>
          </Reveal>
        </div>
      </section>

      <Divider symbol="✦" />

      {/* ── How It Works ─────────────────────────────────────────────────────── */}
      <HowItWorks />

      <Divider symbol="✦" />

      {/* ── Price Anchoring vs competitors ───────────────────────────────────── */}
      <PriceAnchor />

      <Divider symbol="✦" />

      {/* ── Why Shivanii vs Others (comparison) ──────────────────────────────── */}
      <WhyShivanii />

      <Divider symbol="❈" />

      {/* ── Testimonials ─────────────────────────────────────────────────────── */}
      <Testimonials />

      <Divider symbol="ॐ" />

      {/* ── About Shivanii (teaser) ──────────────────────────────────────────── */}
      <section className="section">
        <div className="container" style={{ maxWidth: "760px" }}>
          <Reveal>
            <PatrikaFrame>
              <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start", flexWrap: "wrap" }}>
                <img
                  src="/shivanii-profile.png"
                  alt="Shivanii — ज्योतिषाचार्य शिवानी"
                  width={120}
                  height={120}
                  style={{
                    width: "120px",
                    height: "120px",
                    borderRadius: "50%",
                    flexShrink: 0,
                    animation: "orbGlow 5s ease-in-out infinite",
                    objectFit: "cover",
                  }}
                />
                <div style={{ flex: 1, minWidth: "220px" }}>
                  <h2 style={{ marginBottom: "0.5rem" }}>{t("about.heading")}</h2>
                  <p className="devanagari" style={{ color: "var(--muted)", marginBottom: "1rem" }}>
                    {t("about.headingHi")}
                  </p>
                  <p style={{ color: "var(--ink-light)", marginBottom: "1.5rem", lineHeight: 1.7 }}>
                    {t("about.intro")}
                  </p>
                  {/* TODO(launch): add Shivanii's real credentials, years of practice,
                      and personal story here once she provides them — do NOT render
                      placeholder text to visitors in the meantime. */}
                  <Link href="/about" className="btn btn-secondary">{t("about.readMore")}</Link>
                </div>
              </div>
            </PatrikaFrame>
          </Reveal>
        </div>
      </section>

      <Divider symbol="✦" />

      {/* ── Guides teaser ────────────────────────────────────────────────────── */}
      <section className="section" style={{ paddingTop: "3rem", paddingBottom: "3rem" }}>
        <div className="container" style={{ maxWidth: "900px" }}>
          <Reveal>
            <h2 className="section-heading">
              {isHi ? "सरल भाषा में ज्योतिष सीखें" : "Learn Astrology, Plainly"}
            </h2>
            <p className="section-heading-hi devanagari">
              {isHi ? "बिना डर, बिना शब्दजाल" : "सरल भाषा में ज्योतिष"}
            </p>
          </Reveal>
          <div className="guide-grid">
            {GUIDES.slice(0, 3).map((g, i) => (
              <Reveal key={g.slug} delay={i * 70}>
                <Link href={`/guides/${g.slug}`} className="guide-card">
                  <div className="guide-card-icon">
                    <Icon name={g.icon} size={20} />
                  </div>
                  <div>
                    <h3 className="guide-card-title">{g.title}</h3>
                    <span className="guide-card-meta">{g.readMins} min read</span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
          <Reveal delay={100}>
            <div style={{ textAlign: "center", marginTop: "1.75rem" }}>
              <Link href="/guides" className="btn btn-ghost">
                {isHi ? "सभी गाइड पढ़ें →" : "Read All Guides →"}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <Divider symbol="✦" />

      {/* ── FAQ preview ──────────────────────────────────────────────────────── */}
      <section className="section" style={{ background: "rgba(81,19,32,0.04)", paddingTop: "3rem", paddingBottom: "3rem" }}>
        <div className="container" style={{ maxWidth: "760px" }}>
          <Reveal>
            <h2 className="section-heading">
              {isHi ? "अक्सर पूछे जाने वाले प्रश्न" : "Common Questions"}
            </h2>
            <p className="section-heading-hi devanagari">
              {isHi ? "ईमानदार जवाब" : "अक्सर पूछे जाने वाले प्रश्न"}
            </p>
          </Reveal>
          <div className="faq-list">
            {FAQS.slice(0, 4).map((f, i) => (
              <Reveal key={i} delay={i * 50}>
                <details className="faq-item">
                  <summary className="faq-q">
                    <span>{isHi ? f.q.hi : f.q.en}</span>
                    <span className="faq-chevron" aria-hidden="true">›</span>
                  </summary>
                  <div className="faq-a">{isHi ? f.a.hi : f.a.en}</div>
                </details>
              </Reveal>
            ))}
          </div>
          <Reveal delay={100}>
            <div style={{ textAlign: "center", marginTop: "1.75rem" }}>
              <Link href="/faq" className="btn btn-ghost">
                {isHi ? "सभी प्रश्न देखें →" : "See All Questions →"}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Book CTA banner ──────────────────────────────────────────────────── */}
      <section
        className="jaali-band"
        style={{
          padding: "3.5rem 1.5rem",
          textAlign: "center",
          borderTop: "2px solid var(--gold)",
          borderBottom: "2px solid var(--gold)",
        }}
      >
        <p
          className="devanagari"
          style={{ color: "var(--gold-pale)", marginBottom: "0.5rem", fontSize: "1.1rem" }}
        >
          व्यक्तिगत मार्गदर्शन के लिए
        </p>
        <h2
          className={isHi ? "devanagari" : undefined}
          style={{
            color: "var(--gold-bright)",
            marginBottom: "1.25rem",
            fontSize: "clamp(1.4rem, 4vw, 2.2rem)",
          }}
        >
          {isHi ? "अपने व्यक्तिगत पाठन के लिए तैयार हैं?" : "Ready for your personal reading?"}
        </h2>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/book" className="btn btn-primary btn-lg">
            {t("hero.ctaPrimary")}
          </Link>
          <Link
            href="/contact"
            className="btn btn-ghost btn-lg"
            style={{ color: "var(--gold-bright)", borderColor: "var(--gold)" }}
          >
            {t("pricing.discovery")}
          </Link>
        </div>
      </section>
    </>
  );
}
