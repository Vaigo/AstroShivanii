import type { IconName } from "@/components/Icon";

export interface Reading {
  slug: string;
  icon: IconName;
  priceINR: number;
  durationMin?: number;
  popular?: boolean;
  /** Razorpay order amount in paise */
  amountPaise: number;
}

export const READINGS: Reading[] = [
  { slug: "ask-one-question",    icon: "question",  priceINR: 499,  amountPaise: 49900 },
  { slug: "birth-chart",         icon: "scroll",    priceINR: 999,  amountPaise: 99900,  popular: true },
  { slug: "marriage-matching",   icon: "rings",     priceINR: 1299, amountPaise: 129900 },
  { slug: "career-money",        icon: "briefcase", priceINR: 1199, amountPaise: 119900 },
  { slug: "live-consultation",   icon: "phone",     priceINR: 1999, amountPaise: 199900, durationMin: 30 },
  { slug: "annual-forecast",     icon: "calendar",  priceINR: 1499, amountPaise: 149900 },
  { slug: "lal-kitab-remedies",  icon: "book",      priceINR: 899,  amountPaise: 89900 },
  { slug: "kp-precision",        icon: "target",    priceINR: 1499, amountPaise: 149900 },
  { slug: "bhrigu-nadi-deep",    icon: "leaf",      priceINR: 3999, amountPaise: 399900 },
];

export function getReading(slug: string): Reading | undefined {
  return READINGS.find((r) => r.slug === slug);
}

export function readingName(slug: string, lang: "en" | "hi"): string {
  const names: Record<string, { en: string; hi: string }> = {
    "ask-one-question":   { en: "Ask Shivanii Directly", hi: "शिवानी जी से सीधे पूछें" },
    "birth-chart":        { en: "Birth Chart Reading",   hi: "कुंडली विश्लेषण" },
    "marriage-matching":  { en: "Marriage Matching",     hi: "गुण मिलान" },
    "career-money":       { en: "Career & Money",        hi: "करियर और धन" },
    "live-consultation":  { en: "Live Consultation",     hi: "लाइव परामर्श" },
    "annual-forecast":    { en: "Annual Forecast",       hi: "वर्षफल" },
    "lal-kitab-remedies": { en: "Lal Kitab Remedies",   hi: "लाल किताब उपाय" },
    "kp-precision":       { en: "KP Precision Reading",  hi: "केपी विश्लेषण" },
    "bhrigu-nadi-deep":   { en: "Bhrigu Nadi Deep",     hi: "भृगु नाड़ी" },
  };
  return names[slug]?.[lang] ?? slug;
}

export function readingDesc(slug: string, lang: "en" | "hi"): string {
  const descs: Record<string, { en: string; hi: string }> = {
    "ask-one-question": {
      en: "This is you, asking Shivanii — no tool, no template. Write your one question (a job offer, a relationship, property, health…), and she personally casts a chart for it, studies it herself, and sends you a clear, direct answer on WhatsApp — along with how confident she honestly is in it.",
      hi: "यह सीधे शिवानी जी से पूछना है — कोई टूल नहीं, कोई बना-बनाया जवाब नहीं। अपना एक सवाल लिखिए (नौकरी, रिश्ता, संपत्ति, स्वास्थ्य…) — वे स्वयं उसकी कुंडली बनाकर, खुद पढ़कर, WhatsApp पर आपको साफ़ और सीधा जवाब भेजती हैं — अपने ईमानदार विश्वास स्तर के साथ।",
    },
    "birth-chart": {
      en: "The complete story of your birth chart, told in plain language: your nature, your strengths, your career direction, your relationships, and which phase of life you are in right now. Shivanii's most popular reading.",
      hi: "आपकी जन्म कुंडली की पूरी कहानी, सरल भाषा में: आपका स्वभाव, आपकी शक्तियां, करियर की दिशा, रिश्ते, और अभी जीवन का कौन सा दौर चल रहा है। शिवानी का सबसे लोकप्रिय पाठन।",
    },
    "marriage-matching": {
      en: "A complete compatibility check of two charts: the traditional 36-point score, the Mangal dosha check, and Shivanii's honest opinion — what is strong in this match, what needs care, and whether any dosha actually applies.",
      hi: "दो कुंडलियों की सम्पूर्ण मिलान जांच: पारंपरिक 36 गुण स्कोर, मंगल दोष जांच, और शिवानी की ईमानदार राय — इस रिश्ते में क्या मज़बूत है, कहां ध्यान चाहिए, और क्या कोई दोष वास्तव में लागू होता है।",
    },
    "career-money": {
      en: "Where your career is headed, which fields suit you, when your next big opportunity is likely, and what your chart says about money — explained simply, with practical timing you can act on.",
      hi: "आपका करियर किस दिशा में जा रहा है, कौन से क्षेत्र आपके लिए उपयुक्त हैं, अगला बड़ा अवसर कब संभव है, और धन के बारे में आपकी कुंडली क्या कहती है — सरल भाषा में, व्यावहारिक समय के साथ।",
    },
    "live-consultation": {
      en: "Talk to Shivanii directly for 30 minutes on video or phone. Ask anything about your chart — career, marriage, family, timing — and get answers in real time, in Hindi or English.",
      hi: "शिवानी से सीधे 30 मिनट वीडियो या फ़ोन पर बात करें। अपनी कुंडली के बारे में कुछ भी पूछें — करियर, विवाह, परिवार, समय — और तुरंत उत्तर पाएं, हिंदी या अंग्रेज़ी में।",
    },
    "annual-forecast": {
      en: "Your complete year ahead, month by month: favourable periods, months that need extra care, and the best timing for big decisions — based on your personal chart, not a generic sun-sign column.",
      hi: "आपका पूरा आने वाला वर्ष, महीने-दर-महीने: शुभ अवधि, किन महीनों में सावधानी चाहिए, और बड़े निर्णयों के लिए सबसे अच्छा समय — आपकी व्यक्तिगत कुंडली के आधार पर।",
    },
    "lal-kitab-remedies": {
      en: "Simple, affordable remedies from the Lal Kitab tradition, chosen specifically for your chart — small everyday actions, not expensive rituals. Practical, doable, and clearly explained.",
      hi: "लाल किताब परंपरा से सरल, किफ़ायती उपाय, विशेष रूप से आपकी कुंडली के लिए चुने गए — छोटे रोज़मर्रा के काम, महंगे अनुष्ठान नहीं। व्यावहारिक और स्पष्ट।",
    },
    "kp-precision": {
      en: "For 'when will it happen?' questions. This specialised method (KP) focuses on timing — marriage, job, house, childbirth — and gives you dated windows instead of vague predictions. Needs an accurate birth time.",
      hi: "'कब होगा?' वाले सवालों के लिए। यह विशेष पद्धति (केपी) समय पर केंद्रित है — विवाह, नौकरी, घर, संतान — और अस्पष्ट भविष्यवाणियों के बजाय तारीख़ों के साथ उत्तर देती है। सटीक जन्म समय आवश्यक।",
    },
    "bhrigu-nadi-deep": {
      en: "A deep reading of your whole life using the ancient Bhrigu Nadi method — which works even if you don't know your birth time. Career arc, marriage period, family themes, decade by decade.",
      hi: "प्राचीन भृगु नाड़ी पद्धति से आपके पूरे जीवन का गहन पाठन — जो जन्म समय पता न होने पर भी काम करती है। करियर, विवाह काल, पारिवारिक विषय, दशक-दर-दशक।",
    },
  };
  return descs[slug]?.[lang] ?? "";
}

/** One plain-language line: who should choose this reading. */
export function readingBestFor(slug: string, lang: "en" | "hi"): string {
  const items: Record<string, { en: string; hi: string }> = {
    "ask-one-question":   { en: "One urgent question you want Shivanii herself to answer", hi: "एक ज़रूरी सवाल, जिसका जवाब आप शिवानी जी से ही चाहते हैं" },
    "birth-chart":        { en: "Understanding yourself and your current phase of life",   hi: "स्वयं को और जीवन के वर्तमान दौर को समझना" },
    "marriage-matching":  { en: "Families finalising a marriage proposal",                 hi: "विवाह प्रस्ताव तय कर रहे परिवार" },
    "career-money":       { en: "Job change, business decisions, financial planning",      hi: "नौकरी बदलना, व्यापार निर्णय, वित्तीय योजना" },
    "live-consultation":  { en: "Discussing several life questions in a real conversation", hi: "एक वास्तविक बातचीत में कई सवालों पर चर्चा" },
    "annual-forecast":    { en: "Planning the year — career moves, wedding dates, big purchases", hi: "वर्ष की योजना — करियर, विवाह तिथि, बड़ी खरीद" },
    "lal-kitab-remedies": { en: "Practical remedies without expensive rituals",            hi: "महंगे अनुष्ठानों के बिना व्यावहारिक उपाय" },
    "kp-precision":       { en: "Precise 'when will it happen?' timing questions",         hi: "'कब होगा?' — सटीक समय वाले प्रश्न" },
    "bhrigu-nadi-deep":   { en: "A deep life reading — especially if birth time is unknown", hi: "गहन जीवन पाठन — विशेषकर जब जन्म समय अज्ञात हो" },
  };
  return items[slug]?.[lang] ?? "";
}
