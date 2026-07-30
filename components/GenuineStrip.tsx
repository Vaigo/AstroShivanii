"use client";

import { useI18n } from "@/lib/i18n";
import Icon, { IconName } from "./Icon";

const PILLARS: Array<{
  icon: IconName;
  en: { label: string; desc: string };
  hi: { label: string; desc: string };
}> = [
  {
    icon: "user",
    en: { label: "Read by Shivanii herself", desc: "Your chart is never handed off to a junior or churned out in bulk. She sits with it personally and answers for every word." },
    hi: { label: "शिवानी जी स्वयं पढ़ती हैं", desc: "आपकी कुंडली किसी जूनियर को नहीं सौंपी जाती, न थोक में निपटाई जाती है। वे स्वयं उसका अध्ययन करती हैं और हर शब्द की ज़िम्मेदारी लेती हैं।" },
  },
  {
    icon: "target",
    en: { label: "Exact calculations", desc: "Planet positions computed to the exact degree, using the same standard followed by Indian panchangs." },
    hi: { label: "सटीक गणना", desc: "ग्रहों की स्थिति सटीक अंश तक — वही मानक जो भारतीय पंचांगों में उपयोग होता है।" },
  },
  {
    icon: "eye",
    en: { label: "Honest about certainty", desc: "If something in your chart is unclear, she tells you so. No guessing dressed up as prophecy." },
    hi: { label: "सटीकता में ईमानदारी", desc: "यदि कुंडली में कुछ अस्पष्ट है, तो वे साफ़ बताती हैं। अनुमान को भविष्यवाणी बनाकर नहीं बेचा जाता।" },
  },
  {
    icon: "shield",
    en: { label: "No fear, no upselling", desc: "No scary doshas invented to sell you remedies. Guidance that respects you — never preys on you." },
    hi: { label: "न डर, न दबाव", desc: "उपाय बेचने के लिए डरावने दोष नहीं गढ़े जाते। ऐसा मार्गदर्शन जो आपका सम्मान करे — डराए नहीं।" },
  },
];

export default function GenuineStrip() {
  const { lang } = useI18n();
  const isHi = lang === "hi";

  return (
    <div className="genuine-strip">
      <div className="container">
        <div className="genuine-header">
          <p className="genuine-eyebrow devanagari">
            {isHi ? "॥ सत्यमेव विश्वासः ॥" : "॥ Why people trust her ॥"}
          </p>
          <h2 className="genuine-headline">
            {isHi
              ? "हर कुंडली का व्यक्तिगत पाठन। हर शब्द ईमानदार।"
              : "Every chart read personally. Every word honest."}
          </h2>
          <p className="genuine-sub">
            {isHi
              ? "वर्षों के गहन अभ्यास के साथ शिवानी जी कुंडलियां पढ़ती हैं — पूरी सटीकता से गणना, और फिर आपकी कुंडली, आपके प्रश्नों और आपकी परिस्थिति के अनुसार एक अनुभवी ज्योतिषी का व्यक्तिगत विश्लेषण।"
              : "Shivanii is a deeply experienced astrologer. Your calculations are done with exact-degree precision — and the reading is shaped around your chart, your questions and your circumstances, with her name behind every word."}
          </p>
        </div>

        <div className="genuine-pillars">
          {PILLARS.map((p, i) => (
            <div className="genuine-pillar" key={i}>
              <span className="genuine-pillar-icon">
                <Icon name={p.icon} size={26} />
              </span>
              <strong className="genuine-pillar-label">
                {isHi ? p.hi.label : p.en.label}
              </strong>
              <span className="genuine-pillar-desc">
                {isHi ? p.hi.desc : p.en.desc}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
