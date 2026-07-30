"use client";

import { useI18n } from "@/lib/i18n";
import Reveal from "./Reveal";

/* REAL testimonials only — this section renders NOTHING until real client
   words (with permission) are added to TESTIMONIALS below. Fabricated quotes
   violate the site's core honesty rule and must never ship.
   Keep first names + city only; never publish birth details. */
const TESTIMONIALS: Array<{
  text: { en: string; hi: string };
  name: string;
  place: { en: string; hi: string };
  reading: { en: string; hi: string };
}> = [];

/* DRAFT wording examples (tone reference for when real quotes arrive) — NOT rendered.
const DRAFT_EXAMPLES = [
  {
    text: {
      en: "She told me clearly which parts of my chart she was confident about and which were uncertain. I've never had an astrologer be that honest.",
      hi: "उन्होंने साफ़ बताया कि कुंडली के किस हिस्से पर उन्हें विश्वास है और कौन सा अनिश्चित है। इतनी ईमानदारी पहली बार देखी।",
    },
    name: "Priya S.",
    place: { en: "Pune", hi: "पुणे" },
    reading: { en: "Birth Chart Reading", hi: "कुंडली विश्लेषण" },
  },
  {
    text: {
      en: "No scary dosha talk, no pressure to buy remedies. Just a calm, detailed reading of our match — in Hindi, the way my parents could follow too.",
      hi: "कोई डरावनी दोष की बातें नहीं, कोई उपाय खरीदने का दबाव नहीं। हिंदी में शांत, विस्तृत मिलान — जो मेरे माता-पिता भी समझ सके।",
    },
    name: "Rahul & Ananya",
    place: { en: "Delhi", hi: "दिल्ली" },
    reading: { en: "Marriage Matching", hi: "गुण मिलान" },
  },
  {
    text: {
      en: "I didn't know my birth time. Instead of guessing, she explained exactly what could and couldn't be read — then the Bhrigu Nadi reading was spot on.",
      hi: "मुझे जन्म समय नहीं पता था। अनुमान लगाने के बजाय उन्होंने बताया कि क्या पढ़ा जा सकता है और क्या नहीं — फिर भृगु नाड़ी पाठन बिल्कुल सटीक निकला।",
    },
    name: "Meenakshi R.",
    place: { en: "Chennai", hi: "चेन्नई" },
    reading: { en: "Bhrigu Nadi Deep", hi: "भृगु नाड़ी" },
  },
  {
    text: {
      en: "Booked the ₹499 one-question reading half expecting a template. Got a personal voice note walking through my Prashna chart. Worth far more.",
      hi: "₹499 का एक-प्रश्न पाठन बुक किया, टेम्पलेट की उम्मीद थी। मिला व्यक्तिगत वॉयस नोट जिसमें मेरा प्रश्न चार्ट समझाया गया। कहीं अधिक मूल्यवान।",
    },
    name: "Arjun K.",
    place: { en: "Bengaluru", hi: "बेंगलुरु" },
    reading: { en: "Ask One Question", hi: "एक प्रश्न" },
  },
];
*/

export default function Testimonials() {
  const { lang } = useI18n();
  const isHi = lang === "hi";

  // No real client quotes yet — render nothing rather than fabricated ones.
  if (TESTIMONIALS.length === 0) return null;

  return (
    <section className="section" style={{ background: "rgba(81,19,32,0.04)" }}>
      <div className="container">
        <Reveal>
          <h2 className="section-heading">
            {isHi ? "लोग क्या कहते हैं" : "What People Say"}
          </h2>
          <p className="section-heading-hi devanagari">
            {isHi ? "In their own words" : "ग्राहकों के शब्द"}
          </p>
        </Reveal>

        <div className="testimonial-grid">
          {TESTIMONIALS.map((tm, i) => (
            <Reveal key={tm.name} delay={i * 80}>
              <figure className="testimonial-card">
                <div className="testimonial-quote" aria-hidden="true">"</div>
                <blockquote>{isHi ? tm.text.hi : tm.text.en}</blockquote>
                <figcaption>
                  <span className="testimonial-name">{tm.name}</span>
                  <span className="testimonial-meta">
                    {isHi ? tm.place.hi : tm.place.en} · {isHi ? tm.reading.hi : tm.reading.en}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
