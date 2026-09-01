import type { IconName } from "@/components/Icon";

export interface GuideSection {
  h: string;
  p: string[];
  list?: string[];
}

export interface Guide {
  slug: string;
  icon: IconName;
  title: string;
  titleHi: string;
  /** Meta description, ≤160 chars */
  description: string;
  readMins: number;
  updated: string; // ISO date
  intro: string[];
  sections: GuideSection[];
  faq: Array<{ q: string; a: string }>;
  /** Internal links shown at the end */
  tryTool?: { href: string; label: string };
  bookReading?: { href: string; label: string };
}

export const GUIDES: Guide[] = [
  {
    slug: "what-is-kundli",
    icon: "scroll",
    title: "What is a Kundli? Vedic Birth Chart Explained",
    titleHi: "कुंडली क्या है?",
    description:
      "What a Kundli (Vedic birth chart) actually shows — Lagna, houses, planets, and dashas — explained in plain language, without jargon or fear.",
    readMins: 6,
    updated: "2026-07-02",
    intro: [
      "A Kundli (जन्म कुंडली) is a map of the sky at the exact moment and place you were born. It is not a fortune-telling gimmick — it is a snapshot of real astronomical positions: where the Sun, Moon, and planets stood, seen from your birthplace, at your birth minute.",
      "Vedic astrology (Jyotish) reads this map through a framework refined over thousands of years. Here is what each part of your Kundli actually means.",
    ],
    sections: [
      {
        h: "The Lagna (Ascendant) — your chart's anchor",
        p: [
          "The Lagna is the zodiac sign rising on the eastern horizon at your birth moment. It changes roughly every two hours, which is why the exact birth time matters so much. The Lagna sets the frame of the entire chart: it decides which sign rules your 1st house, and therefore every other house.",
          "In practice, the Lagna describes your temperament, physical constitution, and the lens through which you approach life.",
        ],
      },
      {
        h: "The 12 houses — areas of life",
        p: [
          "Your Kundli divides life into twelve houses (bhavas). Each house governs a set of life themes:",
        ],
        list: [
          "1st — self, body, personality · 2nd — wealth, family, speech",
          "3rd — courage, siblings, effort · 4th — mother, home, inner peace",
          "5th — children, intellect, past-life credit · 6th — health, enemies, service",
          "7th — marriage and partnership · 8th — longevity, transformation, occult",
          "9th — fortune, dharma, father · 10th — career and public standing",
          "11th — gains and friendships · 12th — losses, foreign lands, liberation",
        ],
      },
      {
        h: "The 9 grahas — the moving parts",
        p: [
          "Nine grahas (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu) sit in the houses. A planet's sign placement shows its strength; its house placement shows where in life it acts; the houses it rules show what it brings there.",
          "No planet is simply 'good' or 'bad'. Saturn in the right position gives discipline and lasting success; Jupiter in the wrong one can give careless excess. This is why one-line internet horoscopes mislead — context is everything.",
        ],
      },
      {
        h: "Dashas — the timing system",
        p: [
          "The Vimshottari dasha system is Vedic astrology's timing engine. Your Moon's nakshatra at birth starts a 120-year cycle of planetary periods (mahadashas) and sub-periods (antardashas). A promise in the chart delivers when its planet's period runs.",
          "This is what people mean when they say 'his Saturn period is running' — and it's why two people with similar charts live very different years.",
        ],
      },
      {
        h: "What a Kundli can and cannot tell you",
        p: [
          "A well-read Kundli shows tendencies, timings, strengths, and vulnerable periods with surprising precision. It does not erase free will, and any astrologer claiming 100% certainty about specific events is overselling.",
          "An honest reading tells you what the chart clearly indicates, what it only suggests, and where the confidence is low. That distinction is the difference between guidance and fear-selling.",
        ],
      },
    ],
    faq: [
      {
        q: "Can I get my Kundli made without knowing my birth time?",
        a: "Yes — a sunrise chart can be cast from just the date and place. Moon sign, nakshatra, and dasha sequence are usually still readable, while Lagna-dependent results are marked approximate.",
      },
      {
        q: "Is a computer-generated Kundli accurate?",
        a: "The calculations, yes — modern astronomical engines are precise to the arc-minute. The interpretation is where quality varies: automated reports apply generic rules, while a human astrologer weighs the whole chart together.",
      },
    ],
    tryTool: { href: "/tools/kundli", label: "Calculate your free Kundli now" },
    bookReading: { href: "/readings/birth-chart", label: "Get your chart read personally by Shivanii" },
  },
  {
    slug: "kundli-matching-guna-milan",
    icon: "rings",
    title: "Kundli Matching: What the 36 Gunas Measure",
    titleHi: "गुण मिलान की सच्चाई",
    description:
      "How Ashtakoot Guna Milan works, what each of the 8 kootas measures, what a good score is, and why 18/36 is not an automatic rejection.",
    readMins: 7,
    updated: "2026-07-02",
    intro: [
      "Guna Milan (गुण मिलान) is the traditional Vedic method of checking marriage compatibility by comparing the Moon positions of two people. It scores the match out of 36 points across eight categories — the Ashtakoot system.",
      "Most online matchers give you a number and stop there. Here is what the number actually means — and what it deliberately leaves out.",
    ],
    sections: [
      {
        h: "The 8 kootas and their points",
        p: ["Each koota examines one dimension of compatibility, weighted by importance:"],
        list: [
          "Varna (1 pt) — attitude and ego compatibility",
          "Vashya (2 pts) — mutual influence and attraction",
          "Tara (3 pts) — birth-star harmony, health and fortune",
          "Yoni (4 pts) — physical and instinctive compatibility",
          "Graha Maitri (5 pts) — friendship of Moon-sign lords; mental wavelength",
          "Gana (6 pts) — temperament (deva / manushya / rakshasa)",
          "Bhakoot (7 pts) — Moon-sign distance; prosperity and family growth",
          "Nadi (8 pts) — constitution and progeny; the heaviest single factor",
        ],
      },
      {
        h: "What is a good score?",
        p: [
          "Tradition treats 18/36 as the minimum acceptable, 24+ as good, and 28+ as excellent. But the total alone is a blunt instrument: a 26 with Nadi dosha can be more concerning than a 19 with all heavy kootas intact.",
          "This is why serious matching always reads which points were lost, not just how many.",
        ],
      },
      {
        h: "Dosha cancellations — the part online calculators skip",
        p: [
          "Nadi dosha and Bhakoot dosha both have well-defined cancellation (parihara) rules in the classics — same-sign Moons, friendly sign lords, and several nakshatra-based exceptions. A large share of 'failed' matches actually carry a cancelled dosha.",
          "Beyond the kootas, a full matching also checks Mangal dosha on both sides, the 7th house and its lord, Venus and Jupiter conditions, and the dasha periods around the marriage window.",
        ],
      },
      {
        h: "Should a low score stop a marriage?",
        p: [
          "The honest answer: a low Guna score is a prompt for deeper analysis, not a verdict. Charts with 30+ points have produced difficult marriages, and matches below 18 have thrived when the full charts supported each other.",
          "Treat automated scores as a first screen. For a decision as large as marriage, have a human astrologer read both full charts together.",
        ],
      },
    ],
    faq: [
      {
        q: "Is Nadi dosha really that serious?",
        a: "Nadi carries the most points (8) because the classics link it to health and progeny. But it also has the most cancellation rules — many Nadi doshas are cancelled on closer inspection. Always check parihara before worrying.",
      },
      {
        q: "Can we match kundlis if one birth time is unknown?",
        a: "Partially. Moon-based Guna Milan usually still works from the date (the Moon moves slowly), but Lagna-based checks like the 7th house need the time. An honest matcher will tell you which parts are reliable.",
      },
    ],
    tryTool: { href: "/tools/matching", label: "Run a free 36-guna match now" },
    bookReading: { href: "/readings/marriage-matching", label: "Get the full match read by Shivanii" },
  },
  {
    slug: "sade-sati-meaning",
    icon: "planet",
    title: "Sade Sati: What Saturn's 7.5 Years Really Bring",
    titleHi: "साढ़े साती का सच",
    description:
      "Sade Sati explained without fear: the three phases, why effects differ by Moon sign, what Saturn actually teaches, and simple honest remedies.",
    readMins: 6,
    updated: "2026-07-02",
    intro: [
      "Sade Sati (साढ़े साती) is the roughly 7.5-year period when transiting Saturn moves through the 12th, 1st, and 2nd houses from your natal Moon. Few phrases in Indian astrology trigger more anxiety — and few are more misunderstood.",
      "Here is what actually happens during Sade Sati, and why for many people it is the most productive period of their lives.",
    ],
    sections: [
      {
        h: "The three phases",
        p: [
          "Saturn spends about 2.5 years in each sign, giving Sade Sati three distinct chapters:",
        ],
        list: [
          "Rising phase (Saturn in 12th from Moon) — expenses rise, sleep and peace of mind are tested; old comforts loosen",
          "Peak phase (Saturn over the Moon) — emotional pressure, responsibility, health of self and mother need care; the classic 'heavy' phase",
          "Setting phase (Saturn in 2nd from Moon) — finances and family matters restructure; the lessons consolidate",
        ],
      },
      {
        h: "Why the same Sade Sati treats people differently",
        p: [
          "Saturn's transit results depend on what Saturn means in your own chart. If Saturn is your yogakaraka (as for Taurus and Libra Moons) or sits strong in the natal chart, Sade Sati often brings promotion, marriage, property, and hard-won achievement — not disaster.",
          "The Moon's own strength matters too, as do the concurrent dasha and Saturn's retrogression windows. A blanket 'Sade Sati is bad' is astrologically illiterate.",
        ],
      },
      {
        h: "What Saturn actually does",
        p: [
          "Saturn removes what is structurally weak — inflated lifestyles, wrong relationships, careers built on shortcuts — and rewards what is disciplined and real. People routinely look back at their Sade Sati as the period that made them.",
          "The discomfort is real. So is the growth. The fear industry sells you protection from the first while hiding the second.",
        ],
      },
      {
        h: "Honest remedies",
        p: [
          "Classical Saturn remedies are simple and mostly free: consistent discipline in work, service to the elderly and workers, Hanuman Chalisa or Shani mantra on Saturdays, donating black sesame or mustard oil, and avoiding debt and shortcuts.",
          "Be wary of anyone prescribing expensive poojas as the only shield from Sade Sati. Saturn respects conduct, not invoices.",
        ],
      },
    ],
    faq: [
      {
        q: "How do I know if my Sade Sati is running?",
        a: "It depends only on your Moon sign and Saturn's current sign — check it in seconds with a calculator. Currently Saturn's position defines which three Moon signs are affected at any time.",
      },
      {
        q: "Is the peak phase always the worst?",
        a: "It is usually the most intense emotionally, but 'worst' depends on your natal Saturn. Strong or yogakaraka Saturns often deliver their biggest career results exactly in the peak phase.",
      },
    ],
    tryTool: { href: "/tools/sade-sati", label: "Check your Sade Sati status free" },
    bookReading: { href: "/readings/birth-chart", label: "Ask Shivanii how Saturn treats your chart" },
  },
  {
    slug: "mangal-dosha-truth",
    icon: "flame",
    title: "Mangal Dosha: Facts vs Fear — Do You Have It?",
    titleHi: "मंगल दोष — तथ्य बनाम डर",
    description:
      "What Mangal (Manglik) dosha actually is, the many cancellation rules astrologers check, and why most 'Manglik' verdicts from apps are incomplete.",
    readMins: 5,
    updated: "2026-07-02",
    intro: [
      "Mangal dosha (मंगल दोष) — being 'Manglik' — is probably the most fear-monetized concept in Indian astrology. Matches are rejected, panic remedies are sold, and marriages are delayed over a checkbox that is very often wrong.",
      "Here is the fuller picture that a one-line app verdict leaves out.",
    ],
    sections: [
      {
        h: "What Mangal dosha is",
        p: [
          "Mangal dosha forms when Mars occupies the 1st, 2nd, 4th, 7th, 8th, or 12th house — counted from the Lagna, the Moon, and (in stricter traditions) Venus. Mars in these positions is said to bring heat, friction, and dominance into the marriage sphere.",
          "By this raw definition roughly half of all charts are 'Manglik' — which alone should tell you the raw definition is not the full rule.",
        ],
      },
      {
        h: "The cancellations apps don't check",
        p: ["The classics list numerous conditions that cancel or neutralize the dosha, including:"],
        list: [
          "Mars in its own sign (Aries, Scorpio), exaltation (Capricorn), or in Leo/Aquarius placements per classical exceptions",
          "Mars aspected by or conjunct benefic Jupiter",
          "Dosha present in both partners' charts (the most common practical cancellation)",
          "Age-based softening — Mars's marriage effects weaken after the late twenties in many traditions",
          "Strong 7th lord and Venus, which absorb much of the friction",
        ],
      },
      {
        h: "What it means when it's real",
        p: [
          "A genuine, uncancelled Mangal dosha describes a temperament pattern — quick temper, need for independence, high energy in the partnership — not a curse or a death sentence for spouses, despite the folklore.",
          "The practical response is matching with a compatible chart and channeling Mars (exercise, disciplined work), not panic.",
        ],
      },
    ],
    faq: [
      {
        q: "An app says I'm Manglik. Should I worry?",
        a: "Not until a full check is done. Most apps apply only the raw placement rule and skip cancellations. A proper analysis from Lagna, Moon, and Venus with parihara rules very often downgrades or clears the verdict.",
      },
      {
        q: "Can a Manglik marry a non-Manglik?",
        a: "Yes, when the rest of the two charts supports it — 7th houses, Venus, Jupiter, and dashas matter far more than the single dosha flag. This is exactly what a full matching examines.",
      },
    ],
    tryTool: { href: "/tools/matching", label: "Check Mangal dosha in a free match" },
    bookReading: { href: "/readings/marriage-matching", label: "Get an honest Manglik verdict from Shivanii" },
  },
  {
    slug: "mulank-bhagyank-numerology",
    icon: "hash",
    title: "Mulank & Bhagyank: Your Two Core Life Numbers",
    titleHi: "मूलांक और भाग्यांक",
    description:
      "The difference between Mulank (psychic number) and Bhagyank (destiny number), how each is calculated, and how the two interact in your life.",
    readMins: 5,
    updated: "2026-07-02",
    intro: [
      "Vedic numerology reads your life through two core numbers: the Mulank (मूलांक, psychic or root number) and the Bhagyank (भाग्यांक, destiny or life-path number). They are calculated in seconds — understanding their interplay is where the insight lives.",
    ],
    sections: [
      {
        h: "Mulank — how you are wired",
        p: [
          "Your Mulank is the digit-sum of your birth day alone. Born on the 25th? 2 + 5 = 7 — your Mulank is 7, ruled by Ketu. Each number 1–9 is governed by a planet (1-Sun, 2-Moon, 3-Jupiter, 4-Rahu, 5-Mercury, 6-Venus, 7-Ketu, 8-Saturn, 9-Mars).",
          "The Mulank describes your instinctive nature: how you think, react, and present yourself day to day. It dominates roughly the first half of life.",
        ],
      },
      {
        h: "Bhagyank — where life takes you",
        p: [
          "The Bhagyank is the digit-sum of your complete date of birth (day + month + year, reduced to a single digit). It describes your life's direction — the themes, opportunities, and lessons fate keeps arranging, especially from the mid-thirties onward.",
          "When Mulank and Bhagyank are friendly numbers, personality and destiny pull in the same direction. When they conflict (say a freedom-loving 5 Mulank with a duty-heavy 8 Bhagyank), life feels like a negotiation — and knowing this pattern is genuinely useful.",
        ],
      },
      {
        h: "Beyond the two numbers",
        p: [
          "A complete numerology profile also reads your Name Number (by the Chaldean system), the Lo Shu grid of your birth date's digits, missing numbers (karmic lessons), and karmic debt numbers (13, 14, 16, 19) hidden in the sums.",
          "Each favorable element — gemstone, color, day, direction, mantra — follows from the ruling planet of your Mulank, which is why two people with the same Mulank share so many recommendations.",
        ],
      },
    ],
    faq: [
      {
        q: "My Mulank and Bhagyank are the same number. What does that mean?",
        a: "It intensifies that planet's role in your life — personality and destiny speak with one voice. The strengths get stronger, and the number's weaknesses need more conscious handling.",
      },
      {
        q: "Which matters more for career decisions?",
        a: "Bhagyank, generally — it shows the direction life rewards. But timing decisions (job change, launch dates) often work better aligned to your Mulank's friendly dates and days.",
      },
    ],
    tryTool: { href: "/tools/numerology", label: "Calculate your full numerology profile free" },
    bookReading: { href: "/readings/ask-one-question", label: "Ask Shivanii what your numbers mean for you" },
  },
  {
    slug: "birth-time-missing-astrology",
    icon: "clock",
    title: "No Birth Time? What Astrology Still Reveals",
    titleHi: "जन्म समय नहीं पता?",
    description:
      "No birth time? Learn exactly what remains reliable (Moon sign, nakshatra, dasha), what becomes approximate, and which techniques work without any time at all.",
    readMins: 6,
    updated: "2026-07-02",
    intro: [
      "'I don't know my exact birth time' is one of the most common worries people bring to astrology — and the industry's usual response is either to turn you away or, worse, to silently guess and never tell you.",
      "The honest answer is more interesting: a surprising amount of your chart survives a missing birth time, a specific part doesn't, and a few classical techniques don't need the time at all.",
    ],
    sections: [
      {
        h: "What stays reliable without a birth time",
        p: [
          "The slow-moving factors barely change across a whole day:",
        ],
        list: [
          "Moon sign (rashi) — the Moon changes sign only every ~2.5 days; on most dates your rashi is certain",
          "Nakshatra — usually determinable, sometimes with two candidates on transition days",
          "Vimshottari dasha sequence — follows the nakshatra; the start date carries some uncertainty",
          "All planet-to-planet yogas — conjunctions, aspects, and sign placements of the nine grahas",
          "Sade Sati status — depends only on Moon sign and transiting Saturn",
        ],
      },
      {
        h: "What becomes approximate",
        p: [
          "The Lagna changes every ~2 hours, so without a time the ascendant — and therefore the house positions of every planet — cannot be fixed. House-based predictions (career house, marriage house, specific timings from the Lagna) lose precision.",
          "A responsible astrologer casts a sunrise chart, reads what is solid, and flags the rest as approximate. If a report doesn't tell you which is which, it is guessing on your behalf.",
        ],
      },
      {
        h: "Techniques built for missing birth times",
        p: [
          "The Bhrigu Nadi tradition reads life from the slow planets' sign positions and their mutual relationships — no Lagna required. It excels at life-arc themes: career nature, marriage period, father and mother indications, decade-by-decade flow.",
          "Prashna (horary) astrology sidesteps the birth chart entirely: the chart is cast for the moment you ask a question. For one urgent, specific question, Prashna is often sharper than a natal reading even when the birth time is known.",
        ],
      },
      {
        h: "Can my birth time be recovered?",
        p: [
          "Birth time rectification works backward from major dated life events (marriage, childbirth, career breaks, relocations) to narrow the Lagna window. With five or six well-dated events, a skilled astrologer can usually fix the time within a few minutes' accuracy.",
        ],
      },
    ],
    faq: [
      {
        q: "Is a sunrise chart 'fake'?",
        a: "No — it is a classical convention (the day's chart) read with appropriate humility. What would be fake is presenting Lagna-dependent conclusions from it without telling you they are approximate.",
      },
      {
        q: "Which reading should I book if I have no birth time?",
        a: "For a whole-life reading, Bhrigu Nadi Deep is designed for exactly this case. For one specific question, Ask Shivanii Directly (one question) needs no birth data at all.",
      },
    ],
    tryTool: { href: "/tools/kundli", label: "Try the free Kundli — works without birth time" },
    bookReading: { href: "/readings/bhrigu-nadi-deep", label: "Book a Bhrigu Nadi reading (no birth time needed)" },
  },
  {
    slug: "what-is-baal-kundli",
    icon: "leaf",
    title: "What is a Baal Kundli? Naming Syllable Guide",
    titleHi: "बाल कुंडली क्या है?",
    description:
      "A Baal Kundli is your baby's birth chart read for a parent — the auspicious naming syllable, temperament, health tendencies, and why remedies for an infant differ from an adult's.",
    readMins: 5,
    updated: "2026-08-03",
    intro: [
      "A Baal Kundli (बाल कुंडली) is simply a Kundli — the same real astronomical calculation as any birth chart — read specifically for a baby or young child, and for the parent reading it on their behalf.",
      "The chart itself doesn't change with age. What should change is how it's read: a newborn can't personally chant a mantra or observe a fast, and a chart's first planetary period (mahadasha) is mathematically computed backward from before birth — both of which read as errors if nobody explains them.",
    ],
    sections: [
      {
        h: "नामाक्षर — the naming syllable",
        p: [
          "Classical Jyotish assigns four syllables to each of the 27 nakshatras (one per pada, the quarter the Moon occupies at birth). By tradition, a name beginning with this syllable is considered auspicious and aligned with the child's nakshatra.",
          "This is the single most practical thing most parents want from a baby's chart — our free Baal Kundli tool surfaces it as the first result, computed directly from the Moon's nakshatra and pada at birth.",
        ],
      },
      {
        h: "Why a newborn's first Mahadasha can show a date before their birth",
        p: [
          "Vimshottari dasha periods are fixed lengths per planet (Saturn 19 years, Mars 7, and so on). At birth, the Moon is already partway through its nakshatra, so the FIRST mahadasha's nominal start date is calculated backward from that balance — meaning it is completely normal, not a mistake, for it to land before the birth date itself. A correctly-written report leads with how much of that period remains from birth, not the pre-birth start date alone.",
        ],
      },
      {
        h: "Remedies (उपाय) for an infant vs. an adult",
        p: [
          "A generic remedy list written for an adult — mantra counts, weekly fasts, gemstone-wearing instructions — is meaningless addressed directly to a baby, who can do none of these. For a child, every remedy should be reframed as something the PARENTS perform on the child's behalf, with personal practice introduced gradually as the child grows old enough to understand it.",
        ],
      },
      {
        h: "What to look for besides the naming syllable",
        p: [
          "Temperament and instinctive nature (Lagna and Moon nakshatra), health tendencies to stay aware of — not diagnoses — and the natural direction of interests and learning style are all readable from the same chart, framed as long-range potential rather than immediate predictions.",
        ],
      },
    ],
    faq: [
      {
        q: "Can I make a Baal Kundli without an exact birth time?",
        a: "Yes — a sunrise chart can be cast from just the date and place, same as any Kundli. The naming syllable (from the Moon's nakshatra) is usually still reliable; Lagna-dependent results are marked approximate without an exact time.",
      },
      {
        q: "Is the naming syllable a strict rule?",
        a: "No — it's a classical tradition, not a requirement. Many families use it as one input among several (family names, sound, meaning) rather than the deciding factor.",
      },
      {
        q: "At what age should personal remedies (mantra, fasting) start?",
        a: "There's no fixed age in classical texts — most families introduce simple practices gradually as a child grows old enough to understand and willingly participate, with parents performing remedies on the child's behalf before that.",
      },
    ],
    tryTool: { href: "/tools/baal-kundli", label: "Create your child's free Baal Kundli" },
    bookReading: { href: "/readings/birth-chart", label: "Get your child's chart read personally by Shivanii" },
  },
  {
    "slug": "pitru-dosha",
    "icon": "diya",
    "title": "Pitru Dosha: What It Really Is — and What Actually Helps",
    "titleHi": "पितृ दोष — सच और उपाय",
    "description": "Pitru dosha explained without fear: what it actually means in the chart, what it is NOT, honest sattvic remedies (shraddha, tarpan, daan), and Pitru Paksha.",
    "readMins": 7,
    "updated": "2026-09-01",
    "intro": [
      "अगर आप यह पेज इसलिए खोल रहे हैं क्योंकि किसी ने कहा है — \"आपकी कुंडली में पितृ दोष है, तुरंत उपाय कराइए वरना…\" — तो सबसे पहले एक गहरी साँस लीजिए। पितृ दोष भारतीय ज्योतिष का शायद सबसे ज़्यादा डराकर बेचा जाने वाला योग है। सच्चाई इससे कहीं शांत है।",
      "पितृ दोष कोई श्राप नहीं है, और न ही यह गारंटी है कि जीवन में कुछ बुरा होगा। यह कुंडली में ग्रहों की एक विशेष स्थिति का नाम है — जिसे देखने के स्पष्ट नियम हैं, जिसकी तीव्रता कम-ज़्यादा होती है, और जिसके शास्त्रों में बताए गए उपाय लगभग निःशुल्क हैं।",
      "इस लेख में हम ईमानदारी से बताएँगे: पितृ दोष तकनीकी रूप से कुंडली में क्या होता है, क्या नहीं होता, ज्योतिषी इसे इतनी बार क्यों \"निकाल\" देते हैं, परंपरा असल में क्या उपाय कहती है, और कब आपको सच में कुंडली दिखानी चाहिए — और कब सिर्फ़ एक डरावना WhatsApp forward ignore करना चाहिए।"
    ],
    "sections": [
      {
        "h": "कुंडली में पितृ दोष असल में क्या है",
        "p": [
          "शास्त्रीय ज्योतिष में पितृ दोष का सीधा संबंध सूर्य (Sun) से है — क्योंकि सूर्य पिता और पितरों (पूर्वजों) का कारक ग्रह है। जब जन्म कुंडली में सूर्य राहु या केतु के साथ बैठा हो, या उनसे पीड़ित हो, तो इसे पितृ दोष का मुख्य संकेत माना जाता है। इसी तरह चंद्रमा (Moon) — जो माता और मातृ-पक्ष के पितरों का कारक है — राहु-केतु से पीड़ित हो, तो मातृ-पक्ष से जुड़ा दोष देखा जाता है।",
          "दूसरा प्रमुख सूत्र है 9th house (नवम भाव) — यह भाव पिता, धर्म और पूर्वजों के आशीर्वाद का घर है। नवम भाव या उसके स्वामी पर राहु, केतु या शनि का भारी प्रभाव हो, तो वह भी पितृ दोष की श्रेणी में गिना जाता है। यानी यह कोई रहस्यमयी चीज़ नहीं — कुंडली में दिखने वाली गिनी-चुनी स्थितियाँ हैं, जिन्हें कोई भी योग्य ज्योतिषी खोलकर दिखा सकता है।",
          "ज़रूरी बात: सिर्फ़ स्थिति होना काफ़ी नहीं है। ग्रह की डिग्री, युति कितनी नज़दीकी है, सूर्य/चंद्र की अपनी शक्ति, शुभ ग्रहों की दृष्टि — इन सबसे तय होता है कि दोष प्रभावी है या नाम-मात्र का। दो कुंडलियों में \"सूर्य-राहु युति\" लिखा हो सकता है, पर एक में असर साफ़ हो और दूसरी में लगभग शून्य।"
        ]
      },
      {
        "h": "पितृ दोष क्या नहीं है — ईमानदार बात",
        "p": [
          "पितृ दोष पूर्वजों का श्राप नहीं है। परंपरा में इसे पितरों की अतृप्ति या उनके प्रति कर्तव्य की अधूरी कड़ी के रूप में देखा गया है — नाराज़गी और बदले की कहानी बाज़ार ने जोड़ी है। कोई भी शास्त्र यह नहीं कहता कि पितृ दोष वाले व्यक्ति का जीवन निश्चित रूप से कष्टमय होगा।",
          "यह गारंटीशुदा दुर्भाग्य भी नहीं है। करोड़ों कुंडलियों में सूर्य-राहु या नवम भाव की पीड़ा मिलती है — उनमें सफल, सुखी, संतानवान लोग भरे पड़े हैं। कुंडली का कोई भी एक योग पूरी कुंडली नहीं होता; बाकी ग्रह, दशाएँ और आपके अपने कर्म मिलकर परिणाम बनाते हैं।",
          "और सबसे ज़रूरी: संतान में देरी, करियर की रुकावट या घर की कलह — इनमें से हर समस्या का कारण पितृ दोष नहीं होता। इन सबके अपने अलग ज्योतिषीय (और व्यावहारिक!) कारण होते हैं। \"हर समस्या = पितृ दोष\" कहना ज्योतिष नहीं, आलस्य है।"
        ]
      },
      {
        "h": "ज्योतिषी इसे इतनी बार क्यों \"निकाल\" देते हैं",
        "p": [
          "सीधा गणित समझिए: राहु-केतु हर कुंडली में कहीं-न-कहीं बैठे ही होते हैं, और सूर्य, चंद्र या नवम भाव से उनका कोई-न-कोई संबंध बहुत बड़ी संख्या में कुंडलियों में बन जाता है। नियमों को ढीला करते जाइए, तो लगभग हर दूसरी कुंडली में \"पितृ दोष\" घोषित किया जा सकता है। यही ढीलापन इस दोष को fear-selling का पसंदीदा औज़ार बनाता है।",
          "पैटर्न पहचानिए: पहले डर (\"पितर नाराज़ हैं, संतान को कष्ट होगा\"), फिर तुरंत महँगा समाधान (विशेष पूजा, ख़ास पंडित, हज़ारों-लाखों का पैकेज)। जो ज्योतिषी समस्या बताते ही क़ीमत बता दे — और यह न दिखाए कि कुंडली में दोष बन कहाँ रहा है, कितना प्रभावी है — वहाँ सतर्क हो जाइए। ईमानदार विश्लेषण पहले दोष की पुष्टि करता है, उसकी तीव्रता बताता है, और उपाय में सबसे पहले वह बताता है जो निःशुल्क है।"
        ]
      },
      {
        "h": "परंपरा के सच्चे उपाय — जो लगभग निःशुल्क हैं",
        "p": [
          "सुनकर शायद हैरानी हो: पितृ दोष के लिए शास्त्रों में बताए गए मुख्य उपाय सात्विक हैं और उनमें से अधिकांश पर एक रुपया भी खर्च नहीं होता। परंपरा का तर्क सीधा है — दोष पितरों के प्रति कर्तव्य से जुड़ा है, तो उपाय भी श्रद्धा और सेवा हैं, खरीदारी नहीं:"
        ],
        "list": [
          "श्राद्ध और तर्पण — पितृ पक्ष में (और अमावस्या को) पितरों का श्राद्ध, जल-तिल से तर्पण। यह सबसे प्रमुख शास्त्रीय उपाय है; घर पर सरल विधि से भी किया जा सकता है",
          "अमावस्या का दान — अपनी क्षमता के अनुसार अन्न, वस्त्र या भोजन का दान; ब्राह्मण, ज़रूरतमंद या गौशाला — भाव मुख्य है, राशि नहीं",
          "माता-पिता और बुज़ुर्गों की सेवा — जीवित \"पितरों\" का सम्मान परंपरा में सबसे बड़ा पितृ-कर्म माना गया है; यह उपाय पूरी तरह निःशुल्क है और सबसे कठिन भी",
          "पितृ गायत्री या \"ॐ पितृभ्यः नमः\" का जप — नियमित 108 बार (एक माला); चाहें तो पितृ पक्ष में संकल्प लेकर",
          "अमावस्या को पितरों के नाम भोजन — गाय, कौए और कुत्ते को ग्रास देना; ज़रूरतमंद को भोजन कराना",
          "पीपल में जल — शनिवार/अमावस्या को पीपल के वृक्ष में जल अर्पण की लोक-परंपरा"
        ]
      },
      {
        "h": "पितृ पक्ष कब आता है और क्यों महत्वपूर्ण है",
        "p": [
          "पितृ पक्ष (श्राद्ध पक्ष) हर वर्ष भाद्रपद पूर्णिमा से आश्विन कृष्ण अमावस्या तक चलने वाला 15-16 दिन का काल है — अंग्रेज़ी कैलेंडर में आमतौर पर सितम्बर–अक्टूबर में। अंतिम दिन सर्वपितृ अमावस्या कहलाता है: जिन्हें पितरों की तिथि याद न हो, वे इस दिन सभी पितरों का श्राद्ध कर सकते हैं।",
          "परंपरा मानती है कि इस पक्ष में पितरों का स्मरण, तर्पण और दान का फल विशेष होता है। व्यावहारिक रूप से यह वर्ष का वह समय है जब पूरा परिवार पूर्वजों को याद करता है — कृतज्ञता का अभ्यास, जो दोष हो या न हो, हर किसी के लिए अच्छा है। ध्यान रहे: पितृ पक्ष में श्राद्ध करने के लिए कुंडली में पितृ दोष होना ज़रूरी नहीं — यह हर परिवार की सामान्य परंपरा है, कोई \"इलाज\" नहीं।"
        ]
      },
      {
        "h": "कुंडली कब दिखाएँ — और WhatsApp forward कब ignore करें",
        "p": [
          "Ignore करने लायक: कोई अनजान व्यक्ति या forward जो बिना आपकी जन्म-तारीख़, समय और स्थान देखे \"पितृ दोष\" घोषित कर दे; जो तुरंत बड़ी राशि की पूजा का दबाव बनाए; जो कहे \"इस अमावस्या तक नहीं कराया तो…\" — शास्त्रों में ऐसी कोई डेडलाइन नहीं होती। बिना कुंडली देखे पितृ दोष बताना वैसा ही है जैसे बिना रिपोर्ट देखे ऑपरेशन बता देना।",
          "कुंडली दिखाने लायक: अगर आप स्वयं जानना चाहते हैं कि आपकी कुंडली में सूर्य/चंद्र-राहु-केतु या नवम भाव की कोई वास्तविक स्थिति है या नहीं — तो पहले निःशुल्क कुंडली बनाकर खुद देखिए कि सूर्य और राहु-केतु कहाँ बैठे हैं। फिर भी संदेह हो, तो किसी ऐसे ज्योतिषी से पढ़वाइए जो दोष कुंडली में उँगली रखकर दिखाए, उसकी तीव्रता ईमानदारी से बताए, और उपाय में सबसे पहले श्राद्ध-दान-सेवा जैसी निःशुल्क परंपरा रखे — दुकान नहीं।"
        ]
      }
    ],
    "faq": [
      {
        "q": "पितृ दोष क्या है सरल शब्दों में?",
        "a": "जन्म कुंडली में सूर्य या चंद्रमा का राहु-केतु से पीड़ित होना, या 9th house (नवम भाव) पर पाप ग्रहों का भारी प्रभाव — इसे पितृ दोष कहा जाता है। यह कोई श्राप नहीं, कुंडली की एक जाँचने योग्य ग्रह-स्थिति है, जिसकी तीव्रता हर कुंडली में अलग होती है।"
      },
      {
        "q": "क्या पितृ दोष से जीवन में हमेशा परेशानी आती है?",
        "a": "नहीं। कोई भी एक योग पूरी कुंडली नहीं होता। दोष कमज़ोर हो, शुभ ग्रहों की दृष्टि हो, या दशाएँ अनुकूल हों, तो असर नाम-मात्र रह जाता है। सूर्य-राहु युति वाली करोड़ों कुंडलियों में सफल और सुखी लोग हैं। गारंटीशुदा दुर्भाग्य बताने वाला ज्योतिष नहीं, डर बेच रहा है।"
      },
      {
        "q": "पितृ दोष के सबसे प्रभावी उपाय क्या हैं?",
        "a": "शास्त्रीय उपाय लगभग निःशुल्क हैं: पितृ पक्ष और अमावस्या पर श्राद्ध-तर्पण, यथाशक्ति अन्न-दान, माता-पिता व बुज़ुर्गों की सेवा, और \"ॐ पितृभ्यः नमः\" का 108 बार नियमित जप। बिना कुंडली में दोष की पुष्टि के महँगी पूजा या अनुष्ठान खरीदने की कोई शास्त्रीय अनिवार्यता नहीं है।"
      },
      {
        "q": "पितृ पक्ष कब होता है?",
        "a": "पितृ पक्ष भाद्रपद पूर्णिमा से आश्विन कृष्ण अमावस्या (सर्वपितृ अमावस्या) तक का 15-16 दिन का काल है — आमतौर पर सितम्बर–अक्टूबर में। सटीक तारीख़ें हर वर्ष पंचांग से बदलती हैं। जिन्हें पितरों की तिथि याद न हो, वे सर्वपितृ अमावस्या को श्राद्ध कर सकते हैं।"
      },
      {
        "q": "कैसे पता करें कि मेरी कुंडली में पितृ दोष है या नहीं?",
        "a": "अपनी जन्म-तारीख़, समय और स्थान से कुंडली बनाइए और देखिए — क्या सूर्य या चंद्रमा राहु/केतु के साथ या उनकी दृष्टि में हैं? नवम भाव में पाप ग्रह हैं? स्थिति हो भी, तो तीव्रता किसी योग्य ज्योतिषी से जँचवाइए। बिना कुंडली देखे \"पितृ दोष है\" कहने वाले पर भरोसा न करें।"
      }
    ],
    "tryTool": {
      "href": "/tools/kundli",
      "label": "अपनी कुंडली निःशुल्क देखें"
    },
    "bookReading": {
      "href": "/readings/birth-chart",
      "label": "Book a Birth Chart Reading"
    }
  },
  {
    "slug": "vivah-me-deri",
    "icon": "rings",
    "title": "Marriage Delay in the Kundli: Real Causes, Honest Answers",
    "titleHi": "विवाह में देरी — ज्योतिषीय कारण और उपाय",
    "description": "Vivah me deri (marriage delay) explained honestly — 7th house, Shani-Rahu roles, dasha timing, Mangal dosha reality, and simple sattvic upay. No fear-selling.",
    "readMins": 7,
    "updated": "2026-09-01",
    "intro": [
      "अगर आप यह पढ़ रहे हैं, तो शायद घर में शादी की बात हर रविवार उठती है, रिश्ते आते हैं और टलते जाते हैं, और कोई न कोई कह चुका है — \"कुंडली में दोष है।\" यह चिंता असली है, और इसे हल्के में नहीं लिया जाना चाहिए। लेकिन इसी चिंता के आसपास डर बेचने का एक पूरा बाज़ार भी खड़ा है, जो आपको यह नहीं बताता कि ज्योतिष असल में विवाह की देरी के बारे में क्या कहता है — और क्या नहीं कहता।",
      "सच यह है: कुंडली में विवाह की देरी के संकेत होते हैं, और वे पढ़े जा सकते हैं। पर 'देरी' और 'इनकार' में ज़मीन-आसमान का फ़र्क़ है — अधिकांश कुंडलियों में विवाह का योग होता है, बस उसका समय अलग होता है। इस गाइड में हम वही ईमानदार तस्वीर रखेंगे: 7th house (सप्तम भाव) क्या दिखाता है, शनि-मंगल-राहु की असली भूमिका क्या है, दशा का समय-चक्र कैसे काम करता है, और परंपरा कौन-से सरल उपाय सुझाती है।",
      "एक वादा पहले ही कर देते हैं — यहाँ न कोई 'भयानक दोष' मिलेगा, न कोई महंगी पूजा की अनिवार्यता। सिर्फ़ वह, जो शास्त्र और अनुभव वाक़ई कहते हैं।"
    ],
    "sections": [
      {
        "h": "सप्तम भाव और उसका स्वामी — कुंडली में विवाह की असली जगह",
        "p": [
          "विवाह का मुख्य कारक 7th house (सप्तम भाव) है — यह जीवनसाथी, साझेदारी और वैवाहिक जीवन का घर है। इसे तीन तरह से पढ़ा जाता है: सप्तम भाव में कौन-से ग्रह बैठे हैं, सप्तमेश (सप्तम भाव का स्वामी) किस स्थिति में है, और विवाह के नैसर्गिक कारक — पुरुष कुंडली में शुक्र (Venus), स्त्री कुंडली में गुरु (Jupiter) — कितने बलवान हैं। इन तीनों की मिली-जुली तस्वीर ही विवाह के समय और स्वरूप का संकेत देती है।",
          "देरी के सामान्य ज्योतिषीय संकेत ये होते हैं: सप्तम भाव या सप्तमेश पर शनि/राहु/केतु का प्रभाव, सप्तमेश का 6th, 8th या 12th भाव में जाना, शुक्र या गुरु का अस्त (combust) या नीच होना, या सप्तम भाव का पाप-कर्तरी (दोनों ओर पाप ग्रह) में होना। ध्यान दीजिए — इनमें से कोई भी अकेला संकेत 'विवाह नहीं होगा' नहीं कहता। ये सब मिलकर अधिकतर सिर्फ़ इतना कहते हैं: विवाह सामाजिक औसत से कुछ देर से, और अधिक सोच-समझ के बाद होगा।",
          "यह भी याद रखिए कि सिर्फ़ लग्न कुंडली काफ़ी नहीं — नवमांश (D9) विवाह के लिए उतना ही महत्वपूर्ण है। कई बार लग्न कुंडली में कमज़ोर दिखता सप्तम भाव नवमांश में बलवान निकलता है, और पूरी कहानी बदल जाती है। इसीलिए एक भाव देखकर घोषणा करने वाले विश्लेषण अधूरे होते हैं।"
        ]
      },
      {
        "h": "शनि, मंगल और राहु — देरी, इनकार नहीं",
        "p": [
          "शनि (Saturn) का सप्तम भाव या सप्तमेश से संबंध विवाह-देरी का सबसे जाना-पहचाना योग है। लेकिन शनि का स्वभाव समझिए — शनि रोकता नहीं, पकाता है। शनि की देरी का अर्थ प्रायः यह होता है कि विवाह परिपक्व उम्र में, ठोक-बजाकर, और अक्सर अधिक स्थिर रूप में होता है। शास्त्रीय ग्रंथ शनि-प्रभावित विवाह को 'विलंबित' कहते हैं, 'निषिद्ध' नहीं। बल्कि सप्तम भाव में बलवान शनि परिपक्व और टिकाऊ साथी का संकेत भी माना गया है।",
          "मंगल (Mars) की भूमिका देरी से ज़्यादा 'घर्षण' की है — रिश्तों की बातचीत में तीखापन, शर्तों पर अड़ना, या मांगलिक-मिलान की सामाजिक अड़चन से रिश्ते लौट जाना। और राहु-केतु की धुरी सप्तम भाव पर हो तो पैटर्न अलग दिखता है: रिश्ते बनते-बनते अचानक टूटना, अपरंपरागत (inter-caste, विदेश, बड़े अंतर वाले) प्रस्तावों का आना, या मन का बार-बार बदलना। यह भ्रम की स्थिति है, बंद दरवाज़ा नहीं।",
          "तीनों में से किसी भी ग्रह के लिए असली सवाल यह है: वह ग्रह आपकी कुंडली में किस भाव का स्वामी है, कितना बलवान है, और उस पर शुभ दृष्टि (ख़ासकर गुरु की) है या नहीं। यही संदर्भ तय करता है कि प्रभाव हल्की देरी का है या गंभीर परीक्षा का — और इंटरनेट की एक-पंक्ति वाली भविष्यवाणियाँ यही संदर्भ छोड़ देती हैं।"
        ]
      },
      {
        "h": "दशा का गणित — विवाह अक्सर 'सही समय' का इंतज़ार करता है",
        "p": [
          "यह इस पूरे विषय की सबसे कम बताई जाने वाली और सबसे ज़रूरी बात है: कुंडली में विवाह का वादा दशा-काल में पूरा होता है। विंशोत्तरी दशा प्रणाली में विवाह प्रायः तब घटित होता है जब सप्तमेश, शुक्र, गुरु, या सप्तम भाव से जुड़े ग्रहों की महादशा/अंतर्दशा चलती है — और गोचर में गुरु का सप्तम भाव या लग्न से संबंध बनता है।",
          "इसका सीधा अर्थ यह है: कई बार 'देरी' कुंडली का कोई दोष है ही नहीं — बस विवाह-कारक ग्रह की दशा 30-32 की उम्र में आती है, 24 में नहीं। ऐसी कुंडली में 26 की उम्र में सौ उपाय भी वह नहीं कर सकते जो 31 की उम्र में सही दशा अपने-आप कर देती है। यह दोष नहीं, समय-सारणी है। एक ईमानदार ज्योतिषी आपको डराने की जगह आपकी दशा-क्रम देखकर संभावित विवाह-खिड़कियाँ (windows) बताएगा।",
          "इसलिए अगली बार कोई कहे 'कुंडली में भारी दोष है', तो पूछिए — मेरी आने वाली दशाओं में विवाह-योग कब बन रहा है? जवाब की गुणवत्ता से आपको ज्योतिषी की गुणवत्ता पता चल जाएगी।"
        ]
      },
      {
        "h": "मंगल दोष — जितना सुना है, उससे छोटा सच",
        "p": [
          "विवाह-देरी की चर्चा में मंगल दोष (मांगलिक होना) सबसे ज़्यादा उछाला जाने वाला शब्द है, इसलिए एक reality check ज़रूरी है। पहली बात: आबादी का एक बड़ा हिस्सा तकनीकी रूप से मांगलिक है — यह कोई दुर्लभ अभिशाप नहीं। दूसरी बात: शास्त्रों में मंगल दोष के भंग (cancellation) के अनेक स्पष्ट नियम हैं — मंगल का स्वराशि/उच्च होना, गुरु की दृष्टि, दोनों कुंडलियों में दोष का संतुलन, और उम्र के साथ प्रभाव का घटना। बहुत-से 'मांगलिक' वास्तव में भंग-दोष वाले होते हैं।",
          "मंगल दोष विवाह रोकता नहीं — अधिक-से-अधिक साथी चुनाव में सावधानी और मिलान में गहराई माँगता है। इस विषय का पूरा ईमानदार विश्लेषण हमने अलग गाइड में किया है — 'मंगल दोष का सच' ज़रूर पढ़ें, ख़ासकर अगर किसी ने आपको सिर्फ़ इस एक शब्द के आधार पर डराया है।"
        ]
      },
      {
        "h": "परंपरा के उपाय — पहले निःशुल्क और सात्विक, फिर कुछ और",
        "p": [
          "उपायों पर हमारी स्थिति साफ़ है: उपाय परंपरा का हिस्सा हैं, सौदा नहीं। परंपरा जो सबसे पहले सुझाती है, वह मुफ़्त है — नियम, जप, दान और सेवा। ये मन को स्थिर करते हैं और श्रद्धा रखने वालों के लिए ग्रह-शांति का शास्त्रीय मार्ग हैं:"
        ],
        "list": [
          "शनि संबंधित देरी में — शनिवार व्रत, हनुमान चालीसा पाठ, शनि मंत्र 'ॐ शं शनैश्चराय नमः' का जप (शास्त्रीय संख्या 23,000, सुविधा अनुसार प्रतिदिन 108 करके), और श्रमिकों/बुज़ुर्गों की सेवा या सरसों तेल-काले तिल का दान",
          "मंगल संबंधित स्थिति में — मंगलवार को हनुमान जी की उपासना, मंगल मंत्र 'ॐ अं अंगारकाय नमः' (शास्त्रीय संख्या 10,000), मसूर दाल या गुड़ का दान",
          "राहु की स्थिति में — 'ॐ रां राहवे नमः' का जप (शास्त्रीय संख्या 18,000) और ज़रूरतमंदों को कंबल/भोजन दान",
          "शीघ्र विवाह की लोक-परंपरा — गुरुवार व्रत, माँ पार्वती-शिव की आराधना, 'ॐ गौरी शंकराय नमः' का जप; कई परिवारों में कात्यायनी मंत्र की परंपरा भी है",
          "सबसे व्यावहारिक 'उपाय' — कुंडली किसी योग्य व्यक्ति से पूरी पढ़वाना, ताकि पता चले कि उपाय किस ग्रह का करना है (हर देरी शनि की नहीं होती)"
        ]
      },
      {
        "h": "ईमानदार बात — ज्योतिष तारीख़ तय नहीं कर सकता",
        "p": [
          "अब वह हिस्सा, जो ज़्यादातर लोग नहीं बताते। ज्योतिष विवाह की तारीख़ 'बनवा' नहीं सकता — वह संभावनाओं की खिड़कियाँ पहचानता है: कौन-सी दशा-गोचर अवधि विवाह के अनुकूल है, कब प्रयास तेज़ करने चाहिए, और चार्ट किस तरह के साथी की ओर झुकता है। खिड़की बताना और परिणाम की गारंटी देना — दो अलग चीज़ें हैं, और जो दूसरी बेचता है वह ज्योतिषी नहीं, विक्रेता है।",
          "यह भी उतना ही सच है कि विवाह की देरी के कई कारण कुंडली के बाहर होते हैं — करियर की प्राथमिकता, सही रिश्तों तक पहुँच, पारिवारिक परिस्थितियाँ, आर्थिक तैयारी। आज भारत में विवाह की औसत उम्र ही एक पीढ़ी पहले से कई साल ऊपर खिसक चुकी है — 28-30 पर अविवाहित होना कोई ग्रह-दोष नहीं, सामाजिक वास्तविकता भी है। ईमानदार विश्लेषण चार्ट और परिस्थिति दोनों को देखता है।",
          "इसलिए हमारा सुझाव सीधा है: अगर देरी आपको परेशान कर रही है, तो पहले पूरी कुंडली (नवमांश और दशा-क्रम सहित) पढ़वाइए। अगर विवाह-योग की खिड़की आगे है, तो आपको धैर्य और तैयारी का समय मिला है — डरने की कोई वजह नहीं। और अगर कोई आपको बिना पूरा चार्ट देखे हज़ारों की पूजा बता दे, तो समझ जाइए कि समस्या आपकी कुंडली में नहीं, उसके इरादे में है।"
        ]
      }
    ],
    "faq": [
      {
        "q": "क्या कुंडली से विवाह की सही उम्र पता चल सकती है?",
        "a": "सटीक तारीख़ नहीं, लेकिन संभावित अवधि हाँ। दशा-अंतर्दशा और गुरु-शनि के गोचर से विवाह के अनुकूल 1-2 साल की खिड़कियाँ पहचानी जा सकती हैं। ईमानदार ज्योतिषी अवधि बताता है और अपने आकलन का भरोसा-स्तर भी — गारंटी वाली भाषा से सावधान रहें।"
      },
      {
        "q": "सप्तम भाव में शनि है — क्या शादी नहीं होगी?",
        "a": "नहीं, यह ग़लत धारणा है। सप्तम भाव का शनि देरी और परिपक्वता का संकेत है, इनकार का नहीं — शास्त्र इसे विलंबित पर स्थिर विवाह से जोड़ते हैं। तुला, मकर, कुंभ जैसी राशियों में तो सप्तम शनि बलवान होकर अच्छे परिणाम देता है। पूरी कुंडली देखे बिना निष्कर्ष न निकालें।"
      },
      {
        "q": "मांगलिक होने से विवाह में देरी होती है क्या?",
        "a": "मंगल दोष सीधे देरी का योग नहीं है — देरी अक्सर मिलान की सामाजिक अड़चन से होती है, ग्रह से नहीं। साथ ही मंगल दोष के भंग होने के कई शास्त्रीय नियम हैं और बड़ी आबादी तकनीकी रूप से मांगलिक है। पहले जाँचें कि दोष वास्तव में प्रभावी है या भंग — हमारी मंगल दोष गाइड में पूरा विवरण है।"
      },
      {
        "q": "विवाह जल्दी होने के लिए सबसे अच्छा उपाय क्या है?",
        "a": "परंपरा में सबसे पहले सात्विक और निःशुल्क उपाय आते हैं — गुरुवार व्रत, संबंधित ग्रह का मंत्र-जप, दान और सेवा। लेकिन उपाय तभी सार्थक है जब पता हो कि कुंडली में देरी का कारक कौन-सा ग्रह है। बिना चार्ट देखे बताई गई महंगी पूजा या रत्न पर पैसा न लगाएँ।"
      },
      {
        "q": "लड़की की उम्र 30 हो गई है, क्या अब भी विवाह-योग हो सकता है?",
        "a": "बिल्कुल। दशा-प्रणाली में विवाह-कारक ग्रह की अवधि किसी भी उम्र में आ सकती है — 30 के बाद विवाह के योग बहुत सामान्य हैं, और शनि-प्रभावित कुंडलियों में तो देर से विवाह ही स्वाभाविक पैटर्न है। उम्र का सामाजिक दबाव और कुंडली का संकेत दो अलग बातें हैं।"
      }
    ],
    "tryTool": {
      "href": "/tools/matching",
      "label": "निःशुल्क कुंडली मिलान करें"
    },
    "bookReading": {
      "href": "/readings/marriage-matching",
      "label": "Book Marriage Matching"
    }
  },
  {
    "slug": "rahu-ke-upay",
    "icon": "shield",
    "title": "Rahu Remedies That Make Sense: Mahadasha, Transit and Upay",
    "titleHi": "राहु के उपाय — महादशा और गोचर में क्या करें",
    "description": "Rahu ke upay, explained honestly: how to know Rahu is really active (mahadasha, gochar), sattvic remedies with classical jap counts, and what not to buy in fear.",
    "readMins": 7,
    "updated": "2026-09-01",
    "intro": [
      "राहु का नाम सुनते ही ज़्यादातर लोगों के मन में एक ही भाव आता है — डर। किसी ने कह दिया 'राहु की महादशा चल रही है' और रातों की नींद उड़ गई। अगर आप भी इसी चिंता में यह पेज खोलकर बैठे हैं, तो पहले एक गहरी सांस लीजिए — क्योंकि राहु के बारे में जो बातें सबसे ज़्यादा फैलाई जाती हैं, वही सबसे कम सही हैं।",
      "सच यह है कि राहु सिर्फ़ बाधा देने वाला ग्रह नहीं है। यही राहु महत्वाकांक्षा (ambition) देता है, विदेश में सफलता देता है, technology और नए क्षेत्रों में अचानक उन्नति देता है। भारत के कई बड़े उद्योगपतियों और कलाकारों का उत्थान राहु की ही दशा में हुआ है। राहु की ऊर्जा को दबाना नहीं, दिशा देना (channel करना) होता है — और उपाय की परंपरा का असली मतलब यही है।",
      "इस लेख में हम ईमानदारी से बताएंगे: राहु असल में क्या है, कैसे पता करें कि राहु आपके लिए सचमुच सक्रिय है या नहीं, शास्त्रों में बताए गए सात्विक उपाय (जो लगभग मुफ़्त हैं), और किन चीज़ों पर डर के मारे पैसा बिलकुल नहीं लगाना चाहिए।"
    ],
    "sections": [
      {
        "h": "राहु असल में क्या है?",
        "p": [
          "राहु कोई भौतिक ग्रह नहीं है — यह चंद्रमा की कक्षा और सूर्य के पथ का उत्तरी कटान-बिंदु (north lunar node) है, इसीलिए इसे छाया ग्रह कहा जाता है। छाया ग्रह होने का मतलब है कि राहु का अपना कोई फल नहीं होता; वह जिस भाव में बैठता है और जिस ग्रह के साथ या दृष्टि में होता है, उसी की ऊर्जा को कई गुना बढ़ा देता है। यही राहु की असली प्रकृति है — amplifier, यानी बढ़ाने वाला।",
          "स्वभाव से राहु अतृप्त इच्छा का कारक है — वह चीज़ जो 'और चाहिए, अभी चाहिए' कहती है। इसके शुभ रूप हैं: महत्वाकांक्षा, out-of-the-box सोच, विदेश यात्रा और विदेशी स्रोतों से लाभ, technology, research, राजनीति और mass media में सफलता, अचानक उन्नति। इसके कठिन रूप हैं: भ्रम (confusion), जुनून (obsession), shortcuts का लालच, नशे की ओर झुकाव, और अकारण भय। ध्यान दीजिए — दोनों सूचियां एक ही ऊर्जा के दो रूप हैं। फ़र्क सिर्फ़ इस बात का है कि ऊर्जा को अनुशासन मिला या नहीं।"
        ]
      },
      {
        "h": "कैसे पता करें कि राहु आपके लिए सचमुच सक्रिय है?",
        "p": [
          "यह सबसे ज़रूरी क़दम है, और यही क़दम ज़्यादातर लोग छोड़ देते हैं। राहु का उपाय करने से पहले यह पक्का करना चाहिए कि आपके जीवन में इस समय राहु की भूमिका है भी या नहीं। हर परेशानी राहु की नहीं होती — कई बार वह शनि की साढ़े साती होती है, कई बार सिर्फ़ जीवन की सामान्य चुनौती। बिना कुंडली देखे 'राहु ख़राब है' कहना अंदाज़ा है, ज्योतिष नहीं।",
          "राहु मुख्यतः इन स्थितियों में सक्रिय माना जाता है:"
        ],
        "list": [
          "राहु महादशा — विंशोत्तरी दशा में राहु की महादशा पूरे 18 वर्ष चलती है; इस दौरान राहु आपके जीवन का मुख्य सूत्रधार होता है",
          "किसी भी महादशा में राहु की अंतर्दशा — छोटी अवधि, पर राहु के विषय (विदेश, अचानक बदलाव, भ्रम) उभरकर आते हैं",
          "गोचर (transit) — जब राहु आपकी जन्म-राशि यानी चंद्रमा के ऊपर से या उससे 1st, 5th, 7th, 8th या 12th भाव से गुज़रता है; राहु एक राशि में लगभग 18 महीने रहता है",
          "जन्म कुंडली में राहु का चंद्रमा, सूर्य या लग्नेश के साथ होना — ऐसे में दशा-गोचर का असर और स्पष्ट महसूस होता है",
          "अपनी वर्तमान महादशा-अंतर्दशा आप हमारे निःशुल्क कुंडली tool में तुरंत देख सकते हैं — किसी को पूछने या पैसे देने की ज़रूरत नहीं"
        ]
      },
      {
        "h": "राहु जो नहीं है — डर के व्यापार का सच",
        "p": [
          "अब वह बात जो आपको शायद ही कोई बताएगा: राहु कोई श्राप नहीं है। 'राहु दोष' के नाम पर जो डर बेचा जाता है — कि जीवन में कुछ नहीं होगा, कि तुरंत महंगी पूजा करानी पड़ेगी — उसका शास्त्रों से कोई लेना-देना नहीं है। हर इंसान की कुंडली में राहु है, और हर इंसान के जीवन में कभी-न-कभी राहु की दशा या गोचर आता है। अगर राहु अपने-आप में विनाशकारी होता, तो दुनिया में कोई सफल व्यक्ति होता ही नहीं।",
          "सच इसका उल्टा है: शुभ स्थिति में बैठा राहु — जैसे 3rd, 6th, 10th या 11th भाव में, या शुभ ग्रहों के प्रभाव में — करियर में असाधारण ऊंचाई देता है। विदेश में बसना, बड़ा platform मिलना, राजनीति या media में पहचान — ये सब राहु के ही क्षेत्र हैं। जिनकी कुंडली में राहु कठिन स्थिति में है, उनके लिए भी दशा का अर्थ 'बर्बादी' नहीं होता; अर्थ होता है कि उन 18 वर्षों में भ्रम और shortcuts से बचकर चलना है। ईमानदार ज्योतिष आपको यह फ़र्क बताता है — डर का व्यापार सिर्फ़ 'राहु भारी है' कहकर बिल थमा देता है।"
        ]
      },
      {
        "h": "सात्विक उपाय — परंपरा का असली, लगभग निःशुल्क रास्ता",
        "p": [
          "शास्त्रों में राहु के उपाय की परंपरा दान, मंत्र-जप, व्रत और उपासना पर टिकी है — यानी ऐसे काम जो आपके मन को अनुशासित करें और स्वभाव को सात्विक बनाएं। इनमें से लगभग सब कुछ या तो निःशुल्क है या कुछ रुपयों का। ये उपाय परंपरा हैं, कोई guaranteed सौदा नहीं — इनका मूल्य नियमितता और भाव में है, ख़र्च में नहीं:"
        ],
        "list": [
          "राहु मंत्र-जप — 'ॐ भ्रां भ्रीं भ्रौं सः राहवे नमः'; शास्त्रीय जप-संख्या 18,000 है, जिसे रोज़ एक या अधिक माला (108) करके धीरे-धीरे पूरा किया जाता है; जल्दबाज़ी से गिनती पूरी करने से बेहतर है रोज़ थोड़ा, पर नियम से करना",
          "शनिवार का दान — राहु के दान की वस्तुएं परंपरा में नीले/काले वस्त्र, कंबल, काले तिल, उड़द और नारियल मानी गई हैं; किसी ज़रूरतमंद को सीधे देना सबसे शुद्ध रूप है",
          "बहते जल में नारियल प्रवाहित करना — राहु की सबसे प्रचलित लोक-परंपरा; शनिवार को सूखा नारियल बहते पानी (नदी/नहर) में प्रवाहित किया जाता है",
          "दुर्गा उपासना — परंपरा में मां दुर्गा की आराधना राहु की ऊर्जा को शांत करने वाली मानी गई है; दुर्गा चालीसा या सप्तशती का नियमित पाठ",
          "सेवा — सफ़ाई कर्मचारियों, कुष्ठ रोगियों या समाज के उपेक्षित वर्ग की सेवा राहु की परंपरा में विशेष मानी गई है — क्योंकि राहु स्वयं 'बहिष्कृत' का कारक है"
        ]
      },
      {
        "h": "व्यवहार के उपाय — जो परंपरा असल में सिखाना चाहती है",
        "p": [
          "अगर आप ध्यान से देखें, तो राहु के हर पारंपरिक उपाय के पीछे एक व्यावहारिक शिक्षा छिपी है। राहु भ्रम और अति (excess) का कारक है — तो उसका असली उपाय है जीवन में स्पष्टता और संयम लाना। यह हिस्सा किसी दुकान से नहीं मिलता, और सच कहें तो यही हिस्सा सबसे ज़्यादा काम करता है:"
        ],
        "list": [
          "Shortcuts से दूरी — राहु की दशा में जल्दी अमीर बनने की schemes, सट्टा, जुआ और 'अंदर की खबर' वाले सौदे सबसे ज़्यादा लुभाते हैं और सबसे ज़्यादा डुबाते हैं; यह परंपरा की सबसे व्यावहारिक चेतावनी है",
          "नशे से परहेज़ — राहु का संबंध नशे और आभासी सुख से है; शराब, तंबाकू और नींद की गड़बड़ी राहु काल में सीधे मन की स्पष्टता छीनती है",
          "दिनचर्या और अनुशासन — तय समय पर सोना-उठना, ध्यान (meditation) या प्राणायाम; राहु बिखराव देता है, routine उसे बांधती है",
          "झूठ और छल से बचना — राहु छल का कारक है; उसकी दशा में की गई बेईमानी परंपरा में विशेष रूप से भारी मानी गई है",
          "बड़ों और guru का सम्मान — राहु-काल में मार्गदर्शन लेना और अहंकार से बचना, क्योंकि राहु का भ्रम अकेले निर्णय लेने पर सबसे ज़्यादा हावी होता है"
        ]
      },
      {
        "h": "किस पर पैसा ख़र्च न करें",
        "p": [
          "अब सबसे ज़रूरी हिस्सा। राहु का डर एक पूरा बाज़ार चलाता है, और उस बाज़ार का सबसे महंगा सामान है गोमेद (hessonite) रत्न। साफ़ बात: रत्न धारण करना कुंडली की पूरी जांच के बाद का निर्णय है, पहले का नहीं। गोमेद राहु की ऊर्जा को बढ़ाता है — अगर आपकी कुंडली में राहु शुभ काम कर रहा है तो यह सहायक हो सकता है, पर कठिन स्थिति वाले राहु का गोमेद पहन लेना समस्या घटाता नहीं, बढ़ा सकता है। जो भी बिना आपकी कुंडली देखे, सिर्फ़ 'राहु की दशा है' सुनकर गोमेद बेच रहा है, वह ज्योतिष नहीं कर रहा, दुकानदारी कर रहा है।",
          "यही बात हज़ारों रुपये की 'राहु शांति' packages पर लागू होती है जो डर दिखाकर बेची जाती हैं — 'नहीं कराओगे तो अनर्थ हो जाएगा' कहने वाला व्यक्ति उपाय नहीं, डर बेच रहा है। शास्त्रोक्त राहु जप या शांति एक वैध परंपरा है, पर उसकी शुरुआत हमेशा कुंडली की जांच से होती है और उसका विकल्प ऊपर लिखे सात्विक उपाय हमेशा रहते हैं। पहले निःशुल्क tool से अपनी दशा देखिए, फिर ज़रूरत लगे तो पूरी कुंडली किसी ईमानदार ज्योतिषी से पढ़वाइए — पैसा ख़र्च करने का नंबर उसके बाद आता है, पहले नहीं।"
        ]
      }
    ],
    "faq": [
      {
        "q": "राहु महादशा कितने साल चलती है?",
        "a": "विंशोत्तरी दशा प्रणाली में राहु की महादशा 18 वर्ष चलती है। इसके भीतर सभी नौ ग्रहों की अंतर्दशाएं आती हैं, इसलिए पूरे 18 वर्ष एक जैसे नहीं होते — शुभ ग्रहों की अंतर्दशा में राहु के अच्छे परिणाम भी खुलकर आते हैं।"
      },
      {
        "q": "राहु का मंत्र और जाप संख्या क्या है?",
        "a": "राहु का बीज मंत्र है 'ॐ भ्रां भ्रीं भ्रौं सः राहवे नमः'। शास्त्रीय जप-संख्या 18,000 मानी गई है, जिसे रोज़ एक माला (108 बार) करते हुए कुछ महीनों में पूरा किया जाता है। नियमितता संख्या से ज़्यादा महत्वपूर्ण है।"
      },
      {
        "q": "क्या राहु की दशा हमेशा बुरी होती है?",
        "a": "नहीं। शुभ स्थिति में बैठा राहु अपनी दशा में करियर की ऊंचाई, विदेश-लाभ और अचानक उन्नति देता है — कई सफल लोगों का उत्थान राहु दशा में ही हुआ है। दशा का फल आपकी अपनी कुंडली में राहु की स्थिति पर निर्भर करता है, इसलिए बिना कुंडली देखे डरना व्यर्थ है।"
      },
      {
        "q": "क्या राहु के लिए गोमेद पहनना चाहिए?",
        "a": "सिर्फ़ पूरी कुंडली-जांच के बाद। गोमेद राहु की ऊर्जा बढ़ाता है — शुभ राहु के लिए सहायक, पर कठिन स्थिति वाले राहु के साथ उल्टा पड़ सकता है। 'राहु की दशा है इसलिए गोमेद पहनो' कहना बिना निदान के दवा देने जैसा है। पहले दान, मंत्र-जप जैसे सात्विक उपाय अपनाइए, जो बिना जोखिम के हैं।"
      },
      {
        "q": "राहु के उपाय किस दिन करने चाहिए?",
        "a": "परंपरा में राहु के दान और नारियल-प्रवाह के लिए शनिवार का दिन माना गया है। मंत्र-जप रोज़ किया जा सकता है; कई परंपराएं रात्रि या संध्या का समय राहु-जप के लिए उपयुक्त मानती हैं। दुर्गा उपासना किसी भी दिन की जा सकती है।"
      }
    ],
    "tryTool": {
      "href": "/tools/kundli",
      "label": "अपनी दशा निःशुल्क देखें"
    },
    "bookReading": {
      "href": "/readings/lal-kitab-remedies",
      "label": "Book Lal Kitab Remedies"
    }
  },
  {
    "slug": "kaal-sarp-dosh-upay",
    "icon": "beads",
    "title": "Kaal Sarp Dosha: How Much to Worry, What to Do",
    "titleHi": "कालसर्प दोष — कितना डरें, उपाय क्या करें",
    "description": "Kaal sarp dosh ke upay without fear: what the Rahu–Ketu configuration really is, when it matters, honest traditional remedies, and a free astronomical checker.",
    "readMins": 7,
    "updated": "2026-09-01",
    "intro": [
      "किसी ने आपकी कुंडली देखकर कहा है — \"कालसर्प दोष है\" — और साथ में एक महँगी पूजा का खर्च भी बता दिया है। अगर आप घबराए हुए यह पेज पढ़ रहे हैं, तो पहली बात जान लीजिए: भारत में कालसर्प दोष के नाम पर जितना डर बेचा जाता है, उतना शायद किसी और योग के नाम पर नहीं बिकता। और डर हमेशा सच से बड़ा बना दिया जाता है।",
      "सच यह है — कालसर्प एक वास्तविक ज्योतिषीय संरचना (configuration) है, जिसका उल्लेख परंपरा में मिलता है। लेकिन यह भी सच है कि बहुत बड़ी संख्या में कुंडलियाँ technically इस दोष की परिभाषा में आ जाती हैं, इसके प्रभाव हर कुंडली में बिल्कुल अलग होते हैं, और कई बेहद सफल सार्वजनिक हस्तियों की कुंडली में यही योग बताया जाता है।",
      "इस लेख में हम बिना डराए बताएँगे: यह दोष असल में क्या है, कब यह वाकई मायने रखता है और कब सिर्फ background noise है, और परंपरा में इसके कौन-से उपाय बताए गए हैं — जिनमें से अधिकांश निःशुल्क हैं। हमारा सीधा सिद्धांत: पहले जांचें, फिर उपाय।"
    ],
    "sections": [
      {
        "h": "कालसर्प दोष असल में क्या है?",
        "p": [
          "कालसर्प दोष कोई रहस्यमयी शाप नहीं, बल्कि ग्रहों की एक खगोलीय स्थिति है: जब जन्म के समय सातों ग्रह — सूर्य, चंद्र, मंगल, बुध, गुरु, शुक्र और शनि — Rahu और Ketu की धुरी (axis) के एक ही ओर आ जाएँ, तो कुंडली में कालसर्प योग बनता है। Rahu साँप का मुख माना जाता है और Ketu पूँछ — सारे ग्रह मानो इस साँप के घेरे में आ जाते हैं।",
          "यहीं पहली ईमानदार बात: यह पूरी तरह गणना (calculation) का विषय है, राय का नहीं। ग्रहों के वास्तविक अंश (degrees) देखकर मिनटों में जाँचा जा सकता है कि यह स्थिति है या नहीं — और यह भी कि दोष पूर्ण (सभी ग्रह पूरी तरह घेरे में) है या आंशिक (कोई ग्रह अंशों में बाहर निकल रहा है)। हमारा free checker यही जाँच खगोलीय गणना से करता है — कोई भी उपाय करने से पहले, दो मिनट लगाकर पहले यह ज़रूर देखें।",
          "दूसरी बात जो कोई डर बेचने वाला नहीं बताता: Rahu–Ketu हमेशा एक-दूसरे से ठीक 180° पर होते हैं, इसलिए ग्रहों का उनके एक ओर आ जाना कोई दुर्लभ घटना नहीं है। मोटे अनुमान से हर कई-में-से-एक कुंडली इस परिभाषा में आती है। इतनी सामान्य स्थिति अपने-आप में जीवन बदल देने वाला संकट नहीं हो सकती — असर हमेशा पूरी कुंडली के संदर्भ (context) से तय होता है।"
        ]
      },
      {
        "h": "कालसर्प के 12 प्रकार — संक्षेप में",
        "p": [
          "परंपरा में Rahu जिस भाव (house) में बैठा हो, उसके अनुसार कालसर्प के 12 नाम दिए गए हैं। नाम डरावने लगते हैं, पर ये केवल यह बताते हैं कि जीवन के किस क्षेत्र पर Rahu–Ketu धुरी का ज़ोर अधिक है:"
        ],
        "list": [
          "अनंत — Rahu 1st house (लग्न) में: स्वभाव, आत्मविश्वास, स्वास्थ्य",
          "कुलिक — 2nd house: धन, वाणी, परिवार",
          "वासुकी — 3rd house: पराक्रम, भाई-बहन",
          "शंखपाल — 4th house: माता, घर, मानसिक शांति",
          "पद्म — 5th house: संतान, विद्या",
          "महापद्म — 6th house: रोग, ऋण, विरोधी",
          "तक्षक — 7th house (सप्तम भाव): विवाह, साझेदारी",
          "कर्कोटक — 8th house: आयु, अचानक परिवर्तन",
          "शंखचूड़ — 9th house: भाग्य, धर्म, पिता",
          "घातक — 10th house: करियर, प्रतिष्ठा",
          "विषधर — 11th house: लाभ, मित्र",
          "शेषनाग — 12th house: व्यय, विदेश, निद्रा"
        ]
      },
      {
        "h": "कितना डरें? — ईमानदार जवाब",
        "p": [
          "ज्योतिष की दृष्टि से कालसर्प तब ध्यान देने योग्य है जब कई बातें एक साथ हों: दोष पूर्ण हो (कोई ग्रह धुरी से बाहर न हो), Rahu–Ketu कुंडली के केंद्र या त्रिकोण जैसे संवेदनशील भावों में बैठे हों, वे लग्नेश या चंद्रमा जैसे महत्वपूर्ण बिंदुओं को पीड़ित कर रहे हों, और ऊपर से Rahu या Ketu की dasha/antardasha चल रही हो। ऐसी कुंडली में व्यक्ति को अस्थिरता, देरी या बार-बार बनते-बिगड़ते काम का अनुभव हो सकता है — और तब उपाय व सावधानी सार्थक हैं।",
          "लेकिन अगर दोष आंशिक है, Rahu–Ketu शांत भावों में हैं, बाकी कुंडली मज़बूत है और संबंधित dasha दशकों दूर है — तो व्यावहारिक रूप से यह background noise है। ऐसे व्यक्ति को महँगी पूजा की सलाह देना ज्योतिष नहीं, व्यापार है। यही कारण है कि परंपरा में भी कालसर्प को स्वतंत्र रूप से नहीं, पूरी कुंडली के साथ तौलकर देखा जाता है।",
          "एक और तथ्य जो डर का जवाब है: जिन कुंडलियों में यह योग बताया जाता है, उनमें कई प्रसिद्ध खिलाड़ी, उद्योगपति और राजनेता शामिल हैं जो अपने क्षेत्र के शिखर तक पहुँचे। कुछ परंपराओं में तो इसे एकाग्र, संघर्ष से तपकर ऊपर उठने वाला योग भी कहा गया है। यानी कालसर्प = असफलता, यह समीकरण ही गलत है।"
        ]
      },
      {
        "h": "यह दोष क्या नहीं है",
        "p": [
          "कालसर्प दोष पिछले जन्म का ऐसा शाप नहीं है जिसका \"निवारण\" खरीदे बिना जीवन रुक जाए। यह विवाह, संतान या करियर पर स्वचालित रोक नहीं है। यह कोई ऐसी आपातकालीन स्थिति नहीं है जिसके लिए आज ही, इसी हफ्ते, लाखों रुपये की पूजा अनिवार्य हो। और यह वेदों या पाराशर जैसी प्राचीनतम संहिताओं का केंद्रीय विषय भी नहीं है — शास्त्रीय ग्रंथों में इसका उल्लेख अपेक्षाकृत बाद की परंपरा से आता है, इसीलिए गंभीर ज्योतिषी भी इसके भार पर मतभेद रखते हैं।",
          "सबसे ज़रूरी: कोई भी उपाय — कितना भी महँगा — किसी परिणाम की guarantee नहीं देता, और जो guarantee दे, वहीं से सावधान हो जाइए। हमारा नियम सीधा है: जो बात कुंडली की गणना से पुष्ट न हो और जिसका समाधान डर दिखाकर बेचा जा रहा हो, उस पर पैसा खर्च करने से पहले दो बार पूछिए — \"मेरी कुंडली में यह दोष है भी, और है तो कितना प्रभावी है?\""
        ]
      },
      {
        "h": "पारंपरिक उपाय — पहले निःशुल्क और सात्विक",
        "p": [
          "परंपरा में कालसर्प के अधिकांश उपाय Rahu–Ketu की शांति और शिव उपासना से जुड़े हैं — और इनमें से कोई भी खरीदना नहीं पड़ता। अगर जाँच में दोष प्रभावी निकले, तो सबसे पहले यही सात्विक मार्ग अपनाएँ:"
        ],
        "list": [
          "शिव उपासना — नियमित \"ॐ नमः शिवाय\" जप, सोमवार का व्रत, शिवलिंग पर जल/दूध अर्पण; कालसर्प की पूरी परंपरा शिव-केंद्रित है",
          "महामृत्युंजय मंत्र जप — मानसिक स्थिरता और भय-मुक्ति के लिए परंपरा में सर्वोच्च माना गया",
          "Rahu beej mantra — \"ॐ भ्रां भ्रीं भ्रौं सः राहवे नमः\" — शास्त्रीय संख्या 18,000 जप",
          "Ketu beej mantra — \"ॐ स्रां स्रीं स्रौं सः केतवे नमः\" — शास्त्रीय संख्या 17,000 जप",
          "नाग पंचमी पूजा — घर पर या निकट के शिव मंदिर में नाग देवता का दूध-पुष्प से पूजन; यह वार्षिक पर्व स्वयं एक पारंपरिक उपाय है",
          "दान — Rahu के लिए उड़द, काले तिल, कंबल; ज़रूरतमंदों को भोजन — दान अपनी क्षमता के अनुसार, दिखावे के अनुसार नहीं",
          "सेवा — परंपरा Rahu–Ketu की शांति सेवा-भाव से जोड़ती है: पक्षियों/जीवों को दाना-पानी, वृद्धों व रोगियों की सहायता",
          "त्र्यंबकेश्वर (नासिक) की कालसर्प शांति पूजा — यह एक सम्मानित, सदियों पुरानी परंपरा है; वहाँ अधिकृत पुरोहितों द्वारा सामान्य पूजा कुछ हज़ार रुपये में होती है। लाखों के \"package\" परंपरा नहीं, marketing हैं"
        ]
      },
      {
        "h": "पहले जांचें, फिर उपाय",
        "p": [
          "यह इस पूरे लेख का सार है। कोई भी उपाय — मुफ्त हो या सशुल्क — तब तक अर्थहीन है जब तक यह पुष्टि न हो कि (1) कुंडली में दोष वास्तव में है, (2) पूर्ण है या आंशिक, और (3) आपकी वर्तमान dasha में वह सक्रिय भी है या नहीं। यह तीनों बातें गणना से तय होती हैं, किसी के कहने से नहीं।",
          "हमारा कालसर्प checker यही जाँच ग्रहों की वास्तविक खगोलीय स्थिति से, निःशुल्क करता है — कौन-सा ग्रह धुरी के भीतर है, कौन बाहर, दोष का प्रकार क्या है। अगर दोष निकले ही नहीं, तो आपका डर और पैसा दोनों बच गए। अगर निकले, तो ऊपर बताए सात्विक उपाय से शुरुआत करें, और गहरे विश्लेषण के लिए पूरी कुंडली किसी ईमानदार ज्योतिषी से पढ़वाएँ — ऐसे व्यक्ति से जो यह भी कहने को तैयार हो कि \"आपके मामले में यह दोष खास प्रभावी नहीं है।\""
        ]
      }
    ],
    "faq": [
      {
        "q": "कैसे पता करें कि कुंडली में कालसर्प दोष है या नहीं?",
        "a": "यह पूरी तरह गणना का विषय है: जन्म की तारीख, समय और स्थान से ग्रहों के अंश निकालकर देखा जाता है कि सातों ग्रह Rahu–Ketu धुरी के एक ओर हैं या नहीं। हमारा निःशुल्क कालसर्प checker यह जाँच खगोलीय गणना से तुरंत कर देता है — किसी को पैसे देने से पहले खुद जाँच लें।"
      },
      {
        "q": "क्या कालसर्प दोष से शादी या करियर रुक जाता है?",
        "a": "नहीं। कोई भी योग अपने-आप विवाह या करियर नहीं रोकता। असर तभी विचारणीय है जब दोष पूर्ण हो, संबंधित भाव (जैसे विवाह के लिए 7th house) पीड़ित हों और Rahu/Ketu की dasha चल रही हो। इस योग वाली अनगिनत कुंडलियों में सफल विवाह और शिखर के करियर मौजूद हैं।"
      },
      {
        "q": "कालसर्प दोष कब तक रहता है?",
        "a": "कुंडली की संरचना जीवनभर वही रहती है, लेकिन प्रभाव समान नहीं रहता — परंपरा में इसका ज़ोर मुख्यतः Rahu/Ketu की dasha-antardasha में माना जाता है, और कई परंपराएँ लगभग 42 वर्ष की आयु के बाद इसका असर स्वतः क्षीण मानती हैं। यानी यह स्थायी संकट नहीं, समय-विशेष का विषय है।"
      },
      {
        "q": "क्या त्र्यंबकेश्वर जाकर पूजा कराना ज़रूरी है?",
        "a": "ज़रूरी नहीं, परंपरा-सम्मत विकल्प है। त्र्यंबकेश्वर की कालसर्प शांति एक पुरानी और सम्मानित परंपरा है, और वहाँ सामान्य पूजा कुछ हज़ार रुपये में हो जाती है। पर शास्त्रीय उपाय — शिव उपासना, Rahu–Ketu जप, दान, सेवा — घर से ही, बिना खर्च शुरू किए जा सकते हैं। लाखों के package का परंपरा में कोई आधार नहीं।"
      },
      {
        "q": "कालसर्प दोष का सबसे सरल और सस्ता उपाय क्या है?",
        "a": "नियमित शिव उपासना — \"ॐ नमः शिवाय\" का जप, सोमवार व्रत और शिवलिंग पर जल अर्पण — परंपरा में इसका मूल उपाय है और पूरी तरह निःशुल्क है। साथ में Rahu beej mantra (18,000 जप) और यथाशक्ति दान-सेवा। कोई भी उपाय परिणाम की guarantee नहीं देता — पर यह मार्ग शांति देता है और कुछ छीनता नहीं।"
      }
    ],
    "tryTool": {
      "href": "/tools/kaal-sarp-dosha",
      "label": "निःशुल्क कालसर्प जांच करें"
    },
    "bookReading": {
      "href": "/readings/lal-kitab-remedies",
      "label": "Book Lal Kitab Remedies"
    }
  },
];

export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}
