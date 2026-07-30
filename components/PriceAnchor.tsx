"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { waLink } from "@/lib/config";
import Reveal from "./Reveal";

const TIERS = [
  {
    kind: "others",
    en: {
      label: "Chat Astrology Platforms",
      names: "Many online platforms",
      price: "₹10–50/min",
      note: "= ₹600–₹3,000 for 30 minutes",
      items: [
        "Random astrologer assigned",
        "Rushed, time-pressured sessions",
        "No follow-up or accountability",
        "Quality varies wildly",
      ],
      verdict: "Cheap per minute — expensive in disappointment",
    },
    hi: {
      label: "चैट ज्योतिष ऐप्स",
      names: "कई ऑनलाइन प्लेटफ़ॉर्म",
      price: "₹10–50/मिनट",
      note: "= 30 मिनट के लिए ₹600–₹3,000",
      items: [
        "कोई भी ज्योतिषी सौंपा जाता है",
        "जल्दबाजी में सत्र",
        "कोई फ़ॉलो-अप नहीं",
        "गुणवत्ता अनिश्चित",
      ],
      verdict: "प्रति मिनट सस्ता — निराशा में महंगा",
    },
  },
  {
    kind: "premium",
    en: {
      label: "Celebrity / Premium Astrologers",
      names: "High-profile names · TV astrologers",
      price: "₹5,000–₹50,000",
      note: "per session",
      items: [
        "Months of waiting for a slot",
        "Often fear-based predictions",
        "Unreachable after reading",
        "No transparency on method",
      ],
      verdict: "Prestigious — but out of reach for most",
    },
    hi: {
      label: "सेलेब्रिटी / प्रीमियम ज्योतिषी",
      names: "प्रसिद्ध नाम · TV ज्योतिषी",
      price: "₹5,000–₹50,000",
      note: "प्रति सत्र",
      items: [
        "महीनों की प्रतीक्षा",
        "डर-आधारित भविष्यवाणी",
        "पाठन के बाद संपर्क नहीं",
        "पद्धति में कोई पारदर्शिता नहीं",
      ],
      verdict: "प्रतिष्ठित — लेकिन अधिकांश की पहुंच से बाहर",
    },
  },
  {
    kind: "shivanii",
    en: {
      label: "Astrologer Shivanii",
      names: "Personal · Verified · Accessible",
      price: "₹499–₹3,999",
      note: "flat — no per-minute meter",
      items: [
        "Shivanii reads every chart herself",
        "Delivered within 24–48 hours",
        "WhatsApp direct — ask follow-ups",
        "Transparent confidence levels",
      ],
      verdict: "Every calculation checkable. Every word Shivanii's own.",
    },
    hi: {
      label: "ज्योतिषाचार्य शिवानी",
      names: "व्यक्तिगत · सत्यापित · सुलभ",
      price: "₹499–₹3,999",
      note: "फ्लैट — प्रति-मिनट मीटर नहीं",
      items: [
        "शिवानी जी स्वयं हर कुंडली पढ़ती हैं",
        "24–48 घंटों में डिलीवरी",
        "WhatsApp पर सीधे — प्रश्न पूछें",
        "पारदर्शी सटीकता स्तर",
      ],
      verdict: "हर गणना आप स्वयं जांच सकते हैं। हर शब्द शिवानी का अपना।",
    },
  },
];

export default function PriceAnchor() {
  const { lang } = useI18n();
  const isHi = lang === "hi";

  return (
    <section className="section">
      <div className="container">
        <Reveal>
          <h2 className="section-heading">
            {isHi ? "दूसरे ₹3,000–₹50,000 क्यों लेते हैं?" : "Why do others charge ₹3,000–₹50,000?"}
          </h2>
          <p className="section-heading-hi devanagari">
            {isHi
              ? "और हम ₹499 से शुरू क्यों करते हैं — क्योंकि ईमानदारी को महंगा नहीं होना चाहिए।"
              : "Because Shivanii believes genuine guidance should be accessible — not a luxury only some can afford."}
          </p>
        </Reveal>

        <div className="price-compare">
          {TIERS.map((tier, i) => {
            const d = isHi ? tier.hi : tier.en;
            return (
              <Reveal key={tier.kind} delay={i * 90}>
                <div className={`price-card${tier.kind === "shivanii" ? " price-card-featured" : ""}`}>
                  {tier.kind === "shivanii" && (
                    <div className="price-card-crown">✦ Best Choice</div>
                  )}
                  <p className="price-card-names">{d.names}</p>
                  <h3 className="price-card-label">{d.label}</h3>
                  <div className="price-card-amount">{d.price}</div>
                  <div className="price-card-note">{d.note}</div>
                  <ul className="price-card-items">
                    {d.items.map((item, j) => (
                      <li key={j}>
                        <span className={tier.kind === "shivanii" ? "comp-yes" : "comp-no"}>
                          {tier.kind === "shivanii" ? "✓" : "✗"}
                        </span>{" "}
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="price-card-verdict">{d.verdict}</p>
                  {tier.kind === "shivanii" && (
                    <Link href="/book" className="btn btn-primary" style={{ width: "100%", marginTop: "1rem", justifyContent: "center" }}>
                      {isHi ? "अभी बुक करें" : "Book Now — Starting ₹499"}
                    </Link>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* FOMO scarcity notice */}
        <Reveal delay={120}>
          <div className="scarcity-box">
            <span className="scarcity-pulse" aria-hidden="true" />
            <div>
              <strong>
                {isHi
                  ? "शिवानी जी प्रत्येक सप्ताह केवल 8 व्यक्तिगत पाठन स्वीकार करती हैं।"
                  : "Shivanii accepts only 8 personal readings per week."}
              </strong>
              <span style={{ marginLeft: "0.5rem" }}>
                {isHi
                  ? "एक बार स्लॉट भर जाने पर, अगली उपलब्धता 2–3 सप्ताह दूर हो सकती है।"
                  : "Once full, the next available slot may be 2–3 weeks away."}
              </span>
            </div>
            <a
              href={waLink("Namaste Shivanii ji! Are reading slots available this week?")}
              className="btn btn-secondary btn-sm"
              style={{ flexShrink: 0 }}
              target="_blank"
              rel="noopener noreferrer"
            >
              {isHi ? "उपलब्धता जांचें →" : "Check Availability →"}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
