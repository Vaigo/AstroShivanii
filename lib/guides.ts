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
    title: "What is a Kundli? Your Vedic Birth Chart Explained Simply",
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
    title: "Kundli Matching Explained: What the 36 Gunas Really Measure",
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
    title: "Sade Sati: What Saturn's 7.5 Years Actually Bring (Not What You Fear)",
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
    title: "Mangal Dosha: Facts vs Fear — Do You Really Have It?",
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
    title: "Mulank & Bhagyank: Your Two Core Numbers in Vedic Numerology",
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
    title: "Don't Know Your Birth Time? What Astrology Can Still Tell You",
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
        a: "For a whole-life reading, Bhrigu Nadi Deep is designed for exactly this case. For one specific question, Ask One Question (Prashna) needs no birth data at all.",
      },
    ],
    tryTool: { href: "/tools/kundli", label: "Try the free Kundli — works without birth time" },
    bookReading: { href: "/readings/bhrigu-nadi-deep", label: "Book a Bhrigu Nadi reading (no birth time needed)" },
  },
  {
    slug: "what-is-baal-kundli",
    icon: "leaf",
    title: "What is a Baal Kundli? Naming Syllable & Baby Chart Explained",
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
];

export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}
