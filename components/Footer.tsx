"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { waLink } from "@/lib/config";
import Icon from "./Icon";

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="footer" role="contentinfo">
      <div className="temple-skyline-band" aria-hidden="true" style={{ marginBottom: "1.25rem" }} />
      <div className="footer-om" aria-hidden="true">॥ ॐ ॥</div>

      <div className="footer-grid">
        <div className="footer-brand">
          <h3>Astrologer Shivanii</h3>
          <p className="devanagari" style={{ marginBottom: "0.5rem" }}>ज्योतिषाचार्य शिवानी</p>
          <p>Personal Vedic astrology readings in Hindi &amp; English. Genuine, transparent, no fear-selling.</p>
          <a
            href={waLink("Namaste! I found you via astroshivanii.com")}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-wa"
          >
            <Icon name="message" size={14} /> WhatsApp Shivanii
          </a>
        </div>

        <nav className="footer-links" aria-label="Readings">
          <h4>Readings</h4>
          <ul>
            <li><Link href="/readings/birth-chart">Birth Chart Reading</Link></li>
            <li><Link href="/readings/marriage-matching">Marriage Matching</Link></li>
            <li><Link href="/readings/annual-forecast">Annual Forecast</Link></li>
            <li><Link href="/readings/ask-one-question">Ask One Question</Link></li>
            <li><Link href="/readings/live-consultation">Live Consultation</Link></li>
            <li><Link href="/readings">All Readings →</Link></li>
          </ul>
        </nav>

        <nav className="footer-links" aria-label="Free tools">
          <h4>Free Tools</h4>
          <ul>
            <li><Link href="/tools/panchang">Panchang</Link></li>
            <li><Link href="/tools/kundli">Kundli / Birth Chart</Link></li>
            <li><Link href="/tools/baal-kundli">Baal Kundli</Link></li>
            <li><Link href="/tools/matching">Marriage Matching</Link></li>
            <li><Link href="/tools/rashifal">Daily Rashifal</Link></li>
            <li><Link href="/tools/numerology">Numerology</Link></li>
            <li><Link href="/tools/sade-sati">Sade Sati Check</Link></li>
            <li><Link href="/tools/tarot">Tarot Reading</Link></li>
            <li><Link href="/tools/lal-kitab">Lal Kitab Calculator</Link></li>
            <li><Link href="/tools/lucky-colors">Lucky Color Calculator</Link></li>
            <li><Link href="/tools/kaal-sarp-dosha">Kaal Sarp Dosha Checker</Link></li>
            <li><Link href="/tools/favorable-alphabet">Favorable Alphabet</Link></li>
            <li><Link href="/tools/personal-year">Personal Year Number</Link></li>
            <li><Link href="/tools/karmic-debt">Karmic Debt & Missing Numbers</Link></li>
            <li><Link href="/tools/turant-uttar">तुरंत उत्तर</Link></li>
            <li><Link href="/tools/time-rectification">Time Rectification</Link></li>
            <li><Link href="/tools/numerology-suite">Numerology Suite</Link></li>
            <li><Link href="/tools/varshphal-yearly">Yearly Horoscope</Link></li>
            <li><Link href="/tools">All Free Tools →</Link></li>
          </ul>
        </nav>

        <nav className="footer-links" aria-label="Guides">
          <h4>Learn</h4>
          <ul>
            <li><Link href="/guides/what-is-kundli">What is a Kundli?</Link></li>
            <li><Link href="/guides/kundli-matching-guna-milan">Kundli Matching Explained</Link></li>
            <li><Link href="/guides/sade-sati-meaning">Sade Sati Meaning</Link></li>
            <li><Link href="/nakshatra">27 Nakshatras</Link></li>
            <li><Link href="/rashi">12 Rashis</Link></li>
            <li><Link href="/festivals-2026">व्रत-त्यौहार 2026</Link></li>
            <li><Link href="/guides">All Guides →</Link></li>
          </ul>
        </nav>

        <nav className="footer-links" aria-label="Information">
          <h4>Info</h4>
          <ul>
            <li><Link href="/about">About Shivanii</Link></li>
            <li><Link href="/faq">FAQ</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/privacy">{t("footer.privacy")}</Link></li>
            <li><Link href="/terms">{t("footer.terms")}</Link></li>
          </ul>
        </nav>
      </div>

      <div className="footer-bottom">
        <p style={{ marginBottom: "0.5rem" }}>{t("footer.disclaimer")}</p>
        <p style={{ marginTop: "0.75rem", color: "var(--muted-light)" }}>
          &copy; {new Date().getFullYear()} Astrologer Shivanii. All rights reserved. ·{" "}
          <span className="devanagari">सत्यं शिवं सुन्दरम्</span>
        </p>
      </div>
    </footer>
  );
}
