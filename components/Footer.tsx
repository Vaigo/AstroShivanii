"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { waLink, PHONE_NUMBER, CONTACT_EMAIL } from "@/lib/config";
import Icon from "./Icon";

/* Badge only on genuinely recent launches — remove when they stop being new. */
function NewBadge({ isHi }: { isHi: boolean }) {
  return <span className="footer-badge">{isHi ? "नया" : "NEW"}</span>;
}

export default function Footer() {
  const { t, lang } = useI18n();
  const isHi = lang === "hi";

  return (
    <footer className="footer" role="contentinfo">
      <div className="temple-skyline-band" aria-hidden="true" style={{ marginBottom: "1.25rem" }} />
      <div className="footer-om" aria-hidden="true">॥ ॐ ॥</div>

      <div className="footer-grid">
        <div className="footer-brand">
          <h3>Astrologer Shivanii</h3>
          <p className="devanagari" style={{ marginBottom: "0.6rem" }}>ज्योतिषाचार्य शिवानी</p>
          <p>
            <strong className="footer-brand-lead devanagari">सत्यं शिवं सुन्दरम्।</strong>{" "}
            {isHi
              ? "हिंदी और अंग्रेज़ी में व्यक्तिगत वैदिक ज्योतिष पाठन — सच्चा, पारदर्शी, बिना डर बेचे।"
              : "Personal Vedic astrology readings in Hindi & English — genuine, transparent, no fear-selling."}
          </p>
          <Link href="/about" className="footer-why">
            {isHi ? "शिवानी जी से मिलिए →" : "Meet Shivanii →"}
          </Link>

          <p className={`footer-connect-head${isHi ? " devanagari" : ""}`}>{isHi ? "संपर्क करें" : "Connect"}</p>
          <div className="footer-connect">
            <a
              href={waLink("Namaste! I found you via astroshivanii.com")}
              target="_blank" rel="noopener noreferrer"
              className="footer-social" aria-label="WhatsApp" title="WhatsApp"
            >
              <Icon name="message" size={15} />
            </a>
            <a href={`tel:${PHONE_NUMBER}`} className="footer-social" aria-label={isHi ? "कॉल करें" : "Call"} title={PHONE_NUMBER}>
              <Icon name="phone" size={15} />
            </a>
            <a href={`mailto:${CONTACT_EMAIL}`} className="footer-social" aria-label={isHi ? "ईमेल" : "Email"} title={CONTACT_EMAIL}>
              <Icon name="mail" size={15} />
            </a>
          </div>
        </div>

        <nav className="footer-links" aria-label="Readings">
          <h4 className={isHi ? "devanagari" : undefined}>{isHi ? "पाठन सेवाएं" : "Readings"}</h4>
          <ul>
            <li><Link href="/readings/birth-chart">Birth Chart Reading</Link></li>
            <li><Link href="/readings/marriage-matching">Marriage Matching</Link></li>
            <li><Link href="/readings/annual-forecast">Annual Forecast</Link></li>
            <li><Link href="/readings/ask-one-question">Ask Shivanii Directly</Link></li>
            <li><Link href="/readings/live-consultation">Live Consultation</Link></li>
            <li><Link href="/readings">All Readings →</Link></li>
          </ul>
        </nav>

        <nav className="footer-links" aria-label="Paid tools">
          <h4 className={isHi ? "devanagari" : undefined}>{isHi ? "सशुल्क टूल्स" : "Paid Tools"}</h4>
          <ul>
            {/* Badge shares a nowrap span with the price — an inline-block
                ignores a no-break space, so nowrap is what actually prevents
                the badge wrapping onto a line of its own. */}
            <li><Link href="/tools/shubh-muhurta">शुभ मुहूर्त — <span style={{ whiteSpace: "nowrap" }}>₹51 <NewBadge isHi={isHi} /></span></Link></li>
            <li><Link href="/tools/turant-uttar">तुरंत उत्तर — ₹149</Link></li>
            <li><Link href="/tools/numerology-suite">Numerology Suite — ₹299</Link></li>
            <li><Link href="/tools/palmistry">Palmistry (हस्त रेखा) — <span style={{ whiteSpace: "nowrap" }}>₹299 <NewBadge isHi={isHi} /></span></Link></li>
            <li><Link href="/tools/name-correction">Name Correction — ₹501</Link></li>
            <li><Link href="/tools/varshphal-yearly">Yearly Horoscope — ₹1,499</Link></li>
          </ul>
        </nav>

        <nav className="footer-links" aria-label="Free tools">
          <h4 className={isHi ? "devanagari" : undefined}>{isHi ? "निःशुल्क टूल्स" : "Free Tools"}</h4>
          <ul>
            <li><Link href="/tools/kundli">Kundli / Birth Chart</Link></li>
            <li><Link href="/tools/matching">Marriage Matching</Link></li>
            <li><Link href="/tools/kaal-sarp-dosha">Kaal Sarp Dosha</Link></li>
            <li><Link href="/tools/sade-sati">Sade Sati Check</Link></li>
            <li><Link href="/tools/panchang">Today&apos;s Panchang</Link></li>
            <li><Link href="/tools/rashifal">Daily Rashifal</Link></li>
            <li><Link href="/tools/numerology">Numerology</Link></li>
            <li><Link href="/tools/tarot">Tarot Reading</Link></li>
            <li><Link href="/tools">All Free Tools →</Link></li>
          </ul>
        </nav>

        <nav className="footer-links" aria-label="Daily panchang">
          {/* Site-wide crawl paths into the daily/seasonal SEO page families —
              these routes live outside /tools and would otherwise be reachable
              only via sitemap. */}
          <h4 className="devanagari">{isHi ? "आज का समय" : "रोज़ देखें"}</h4>
          <ul>
            <li><Link href="/rahu-kaal" className="devanagari">आज का राहु काल</Link></li>
            <li><Link href="/choghadiya" className="devanagari">आज का चौघड़िया</Link></li>
            <li><Link href="/rashifal" className="devanagari">आज का राशिफल</Link></li>
            <li><Link href="/muhurta" className="devanagari">शुभ मुहूर्त 2026</Link></li>
            <li><Link href="/festivals/diwali-2026" className="devanagari">दिवाली 2026 कब है</Link></li>
            <li><Link href="/festivals-2026" className="devanagari">व्रत-त्यौहार 2026</Link></li>
          </ul>
        </nav>

        <nav className="footer-links" aria-label="Guides">
          <h4 className={isHi ? "devanagari" : undefined}>{isHi ? "सीखें" : "Learn"}</h4>
          <ul>
            <li><Link href="/guides/what-is-kundli">What is a Kundli?</Link></li>
            <li><Link href="/guides/kundli-matching-guna-milan">Kundli Matching Explained</Link></li>
            <li><Link href="/guides/sade-sati-meaning">Sade Sati Meaning</Link></li>
            <li><Link href="/nakshatra">27 Nakshatras</Link></li>
            <li><Link href="/rashi">12 Rashis</Link></li>
            <li><Link href="/guides">All Guides →</Link></li>
          </ul>
        </nav>

      </div>

      <div className="footer-bottom">
        <nav className="footer-info-row" aria-label="Information">
          <Link href="/about">About Shivanii</Link>
          <Link href="/faq">FAQ</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/privacy">{t("footer.privacy")}</Link>
          <Link href="/terms">{t("footer.terms")}</Link>
        </nav>
        <p style={{ marginBottom: "0.5rem" }}>{t("footer.disclaimer")}</p>
        <p style={{ marginTop: "0.75rem", color: "var(--muted-light)" }}>
          &copy; {new Date().getFullYear()} AstroShivanii · Astrologer Shivanii. All rights reserved. ·{" "}
          <span className="devanagari">सत्यं शिवं सुन्दरम्</span>
        </p>
      </div>
    </footer>
  );
}
