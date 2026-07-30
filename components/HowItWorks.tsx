"use client";

import { useI18n } from "@/lib/i18n";
import Reveal from "./Reveal";
import Icon, { IconName } from "./Icon";

const STEPS: Array<{
  icon: IconName;
  title: { en: string; hi: string };
  desc: { en: string; hi: string };
}> = [
  {
    icon: "scroll",
    title: { en: "Choose your reading", hi: "अपना पाठन चुनें" },
    desc: {
      en: "Pick the reading that fits your question. Not sure? WhatsApp Shivanii first — she'll honestly tell you which one you need.",
      hi: "अपने सवाल के अनुसार पाठन चुनें। तय नहीं कर पा रहे? पहले WhatsApp करें — शिवानी ईमानदारी से बताएंगी कि आपको कौन सा चाहिए।",
    },
  },
  {
    icon: "lock",
    title: { en: "Book & share birth details", hi: "बुक करें और जन्म विवरण भेजें" },
    desc: {
      en: "Pay securely online, then share your birth date, time, and place. Don't know your birth time? That's okay — Shivanii will tell you what can still be read.",
      hi: "सुरक्षित ऑनलाइन भुगतान करें, फिर जन्म तिथि, समय और स्थान भेजें। जन्म समय नहीं पता? कोई बात नहीं — शिवानी बताएंगी कि क्या पढ़ा जा सकता है।",
    },
  },
  {
    icon: "eye",
    title: { en: "Shivanii reads your chart", hi: "शिवानी आपकी कुंडली पढ़ती हैं" },
    desc: {
      en: "She personally studies your chart and your questions — no mass-produced report, no copy-paste. This is why weekly slots are limited.",
      hi: "वे स्वयं आपकी कुंडली और आपके प्रश्नों का अध्ययन करती हैं — कोई थोक रिपोर्ट नहीं, कोई कॉपी-पेस्ट नहीं। इसीलिए साप्ताहिक स्लॉट सीमित हैं।",
    },
  },
  {
    icon: "message",
    title: { en: "Receive your reading", hi: "अपना पाठन प्राप्त करें" },
    desc: {
      en: "Delivered within 48 hours on WhatsApp or email, in Hindi or English. One follow-up question is always included, free.",
      hi: "48 घंटे के भीतर WhatsApp या ईमेल पर, हिंदी या अंग्रेज़ी में। एक फ़ॉलो-अप प्रश्न हमेशा निःशुल्क शामिल है।",
    },
  },
];

export default function HowItWorks() {
  const { lang } = useI18n();
  const isHi = lang === "hi";

  return (
    <section className="section" style={{ paddingTop: "3.5rem", paddingBottom: "3.5rem" }}>
      <div className="container">
        <Reveal>
          <h2 className="section-heading">{isHi ? "यह कैसे काम करता है" : "How It Works"}</h2>
          <p className="section-heading-hi devanagari">
            {isHi ? "चार आसान चरण" : "सिर्फ़ चार आसान चरण"}
          </p>
        </Reveal>

        <div className="steps-grid">
          {STEPS.map((s, i) => (
            <Reveal key={i} delay={i * 90}>
              <div className="step-card">
                <div className="step-num">{i + 1}</div>
                <div className="step-icon" aria-hidden="true">
                  <Icon name={s.icon} size={24} />
                </div>
                <h3 className="step-title">{isHi ? s.title.hi : s.title.en}</h3>
                <p className="step-desc">{isHi ? s.desc.hi : s.desc.en}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
