"use client";

import { useI18n } from "@/lib/i18n";
import Reveal from "./Reveal";
import PatrikaFrame from "./PatrikaFrame";
import CountUp from "./CountUp";
import Icon, { IconName } from "./Icon";

const DIFF_CARDS: Array<{
  icon: IconName;
  en: { title: string; desc: string };
  hi: { title: string; desc: string };
}> = [
  {
    icon: "user",
    en: { title: "A Real, Named Astrologer", desc: "Every reading carries Shivanii's name and years of dedicated practice behind it. You know exactly who read your chart — and she answers for it." },
    hi: { title: "एक वास्तविक, नामित ज्योतिषी", desc: "हर पाठन के पीछे शिवानी जी का नाम और वर्षों का समर्पित अभ्यास है। आप जानती हैं कि आपकी कुंडली किसने पढ़ी — और वे उसकी ज़िम्मेदारी लेती हैं।" },
  },
  {
    icon: "diya",
    en: { title: "Hindi First. Always.", desc: "Readings, support, and remedies explained in natural Hindi — not awkward translations. NRI clients welcomed in English too." },
    hi: { title: "हिंदी सबसे पहले। हमेशा।", desc: "पाठन, सहायता और उपाय — सब स्वाभाविक हिंदी में। NRI ग्राहकों के लिए अंग्रेज़ी में भी।" },
  },
  {
    icon: "eye",
    en: { title: "Honest About Accuracy", desc: "No birth time? We say so, mark results approximate, and use Bhrigu Nadi — not a fake precise chart from guessed data." },
    hi: { title: "सटीकता में ईमानदारी", desc: "जन्म समय नहीं? हम स्पष्ट बताते हैं, परिणाम को 'अनुमानित' चिह्नित करते हैं — भृगु नाड़ी पद्धति से काम करते हैं।" },
  },
  {
    icon: "message",
    en: { title: "WhatsApp Direct Access", desc: "Message Shivanii directly — no support tickets, no chatbots, no 48-hour wait for a reply from a stranger." },
    hi: { title: "WhatsApp पर सीधा संपर्क", desc: "सीधे WhatsApp पर संदेश करें — कोई टिकट नहीं, कोई बॉट नहीं, किसी अजनबी से 48 घंटे का इंतज़ार नहीं।" },
  },
];

const COMPARE_ROWS = [
  {
    feature: { en: "Reading done by a real astrologer", hi: "वास्तविक ज्योतिषी द्वारा पाठन" },
    shivanii: { en: "Shivanii personally", hi: "शिवानी जी व्यक्तिगत रूप से", yes: true },
    others: { en: "Anonymous / random staff", hi: "गुमनाम / कोई भी स्टाफ़", yes: false },
  },
  {
    feature: { en: "Hindi-first support", hi: "हिंदी-प्रथम सहायता" },
    shivanii: { en: "Native — truly fluent", hi: "मूल हिंदी — पूरी तरह धाराप्रवाह", yes: true },
    others: { en: "Mostly English only", hi: "अधिकतर केवल अंग्रेज़ी", yes: false },
  },
  {
    feature: { en: "Direct WhatsApp access", hi: "सीधा WhatsApp संपर्क" },
    shivanii: { en: "Instant reply", hi: "त्वरित उत्तर", yes: true },
    others: { en: "Email tickets (days)", hi: "ईमेल टिकट (कई दिन)", yes: false },
  },
  {
    feature: { en: "Transparency on accuracy", hi: "सटीकता में पारदर्शिता" },
    shivanii: { en: "Confidence level always shown", hi: "सटीकता स्तर हमेशा दिखाया जाता है", yes: true },
    others: { en: "No disclosure", hi: "कोई खुलासा नहीं", yes: false },
  },
  {
    feature: { en: "Works without birth time", hi: "जन्म समय के बिना भी कार्य" },
    shivanii: { en: "Yes — Bhrigu Nadi method", hi: "हाँ — भृगु नाड़ी पद्धति", yes: true },
    others: { en: "Usually not possible", hi: "प्रायः संभव नहीं", yes: false },
  },
  {
    feature: { en: "No subscription required", hi: "कोई सब्सक्रिप्शन नहीं" },
    shivanii: { en: "Pay per reading only", hi: "केवल पाठन के लिए भुगतान", yes: true },
    others: { en: "Often monthly fee plans", hi: "अक्सर मासिक शुल्क योजनाएं", yes: false },
  },
];

const STATS = [
  { end: 500, suffix: "+", en: "Readings Delivered", hi: "पाठन पूर्ण किए" },
  { end: 100, suffix: "%", en: "Personal — by Shivanii", hi: "व्यक्तिगत — शिवानी द्वारा" },
  { end: 499, prefix: "₹", en: "Readings Start At", hi: "पाठन की शुरुआत" },
];

export default function WhyShivanii() {
  const { lang } = useI18n();
  const isHi = lang === "hi";

  return (
    <section className="section">
      <div className="container">
        {/* ── Heading ── */}
        <Reveal>
          <h2 className="section-heading">
            {isHi ? "शिवानी को क्यों चुनें?" : "Why Choose Shivanii?"}
          </h2>
          <p className="section-heading-hi devanagari">
            {isHi
              ? "स्वचालित नहीं। सामान्य नहीं। एक वास्तविक ज्योतिषी द्वारा।"
              : "Not automated. Not generic. Personally read by a real Vedic astrologer."}
          </p>
        </Reveal>

        {/* ── Stats row ── */}
        <Reveal delay={60}>
          <div className="stats-row">
            {STATS.map((s, i) => (
              <div className="stat-item" key={i}>
                <div className="stat-num">
                  <CountUp end={s.end} suffix={s.suffix} prefix={s.prefix} />
                </div>
                <div className="stat-label">{isHi ? s.hi : s.en}</div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* ── Differentiator cards ── */}
        <div className="grid-2" style={{ marginBottom: "3rem" }}>
          {DIFF_CARDS.map((card, i) => (
            <Reveal key={i} delay={i * 80}>
              <div className="diff-card">
                <div className="diff-card-icon">
                  <Icon name={card.icon} size={24} />
                </div>
                <div>
                  <h3 className="diff-card-title">
                    {isHi ? card.hi.title : card.en.title}
                  </h3>
                  <p className="diff-card-desc">
                    {isHi ? card.hi.desc : card.en.desc}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* ── Comparison table ── */}
        <Reveal delay={100}>
          <PatrikaFrame style={{ padding: "0", overflow: "hidden" }}>
            <div className="comparison-wrap">
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th style={{ width: "40%" }}>
                      {isHi ? "विशेषता" : "Feature"}
                    </th>
                    <th className="col-shivanii-head">
                      <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        <span aria-hidden="true">✦</span>
                        <span>{isHi ? "ज्योतिषाचार्य शिवानी" : "Astrologer Shivanii"}</span>
                      </span>
                    </th>
                    <th>
                      {isHi ? "सामान्य ऐप / पोर्टल" : "Generic Apps / Portals"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARE_ROWS.map((row, i) => (
                    <tr key={i}>
                      <td>{isHi ? row.feature.hi : row.feature.en}</td>
                      <td className="col-shivanii">
                        <span className="comp-yes">✓</span>
                        <span className="comp-yes-text">
                          {isHi ? row.shivanii.hi : row.shivanii.en}
                        </span>
                      </td>
                      <td>
                        <span className="comp-no">✗</span>
                        <span className="comp-no-text">{isHi ? row.others.hi : row.others.en}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </PatrikaFrame>
        </Reveal>

        {/* Scarcity note lives in PriceAnchor (next to the purchase decision) —
            it appeared twice on the homepage, which cheapened a true claim. */}

        {/* ── Bottom CTA ── */}
        <Reveal delay={160}>
          <div style={{ textAlign: "center", marginTop: "2rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
            <a href="/book" className="btn btn-primary btn-lg">
              {isHi ? "अभी बुक करें — स्लॉट सीमित हैं" : "Book Now — Before Slots Fill"}
            </a>
            <p style={{ color: "var(--muted)", fontSize: "0.82rem", fontStyle: "italic" }}>
              {isHi ? "शुरुआत ₹499 से — कोई छिपा हुआ शुल्क नहीं" : "Starting ₹499 · Flat rate · No per-minute meter"}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
