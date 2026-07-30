/** The 12 rashis (Vedic moon signs) — classical attributes + trait content. */

export interface RashiInfo {
  slug: string;
  index: number;
  name: string;         // Aries
  name_hi: string;      // मेष
  lord: string;
  lord_hi: string;
  element: string;      // Fire...
  element_hi: string;   // अग्नि
  quality: string;      // Movable / Fixed / Dual
  quality_hi: string;
  symbol: string;
  symbol_hi: string;
  body_part: string;
  nakshatra_spans: string[];   // nakshatras (with padas) inside this sign
  traits_en: string;
  traits_hi: string;
  career: string;
  love: string;
  health: string;       // honest tendency, one line
  lucky_day: string;
  lucky_colors: string[];
}

export const RASHIS: RashiInfo[] = [
  {
    slug: "mesh", index: 0, name: "Aries", name_hi: "मेष", lord: "Mars", lord_hi: "मंगल",
    element: "Fire", element_hi: "अग्नि", quality: "Movable (Chara)", quality_hi: "चर",
    symbol: "The Ram", symbol_hi: "मेढ़ा", body_part: "Head",
    nakshatra_spans: ["Ashwini (all 4 padas)", "Bharani (all 4 padas)", "Krittika (pada 1)"],
    traits_en: "The zodiac's first spark: Aries Moons decide fast, act first and apologise rarely. Courage is their default setting — they'd rather fail forward than wait. Natural initiators who make excellent first responders in any field.",
    traits_hi: "राशिचक्र की पहली चिंगारी: मेष चंद्र वाले तेज़ निर्णय लेते हैं, पहले कदम बढ़ाते हैं। साहस इनका स्वभाव है — प्रतीक्षा से बेहतर इन्हें आगे बढ़कर गिरना लगता है। हर क्षेत्र के स्वाभाविक पहलकर्ता।",
    career: "Leadership, defence & police, sports, surgery, entrepreneurship — anywhere the first move matters.",
    love: "Direct and passionate; loves the chase, must learn the art of staying. Honesty is their romance language.",
    health: "Pitta-prone: headaches, acidity and heat issues when anger is unmanaged; head is the vulnerable zone.",
    lucky_day: "Tuesday", lucky_colors: ["Red", "Coral"],
  },
  {
    slug: "vrishabh", index: 1, name: "Taurus", name_hi: "वृषभ", lord: "Venus", lord_hi: "शुक्र",
    element: "Earth", element_hi: "पृथ्वी", quality: "Fixed (Sthira)", quality_hi: "स्थिर",
    symbol: "The Bull", symbol_hi: "वृषभ (बैल)", body_part: "Face & throat",
    nakshatra_spans: ["Krittika (padas 2–4)", "Rohini (all 4 padas)", "Mrigashira (padas 1–2)"],
    traits_en: "Steady as fertile earth: Taurus Moons build slowly and keep what they build. Comfort, beauty and loyalty define them — they are the friend with the reliable home and the long memory. The Moon is exalted here: emotional stability is their superpower.",
    traits_hi: "उपजाऊ धरती-सी स्थिरता: वृषभ चंद्र वाले धीरे बनाते हैं और बनाया सँभालते हैं। सुख, सौंदर्य और निष्ठा इनकी पहचान — भरोसेमंद घर और लंबी स्मृति वाले मित्र। चंद्रमा यहाँ उच्च का होता है: भावनात्मक स्थिरता इनकी महाशक्ति है।",
    career: "Banking & finance, real estate, food, luxury & fashion, agriculture, music.",
    love: "Devoted and sensual; slow to commit, slower to leave. Needs physical presence and security, not grand words.",
    health: "Throat, thyroid and weight need watching; comfort-eating is the classic trap.",
    lucky_day: "Friday", lucky_colors: ["White", "Green"],
  },
  {
    slug: "mithun", index: 2, name: "Gemini", name_hi: "मिथुन", lord: "Mercury", lord_hi: "बुध",
    element: "Air", element_hi: "वायु", quality: "Dual (Dvisvabhava)", quality_hi: "द्विस्वभाव",
    symbol: "The Twins", symbol_hi: "युगल", body_part: "Arms, shoulders & lungs",
    nakshatra_spans: ["Mrigashira (padas 3–4)", "Ardra (all 4 padas)", "Punarvasu (padas 1–3)"],
    traits_en: "Two minds, one person: Gemini Moons think in conversations and learn everything twice as fast. Curiosity is oxygen; monotony is suffocation. Brilliant communicators who can hold five projects — the challenge is finishing the fifth.",
    traits_hi: "एक व्यक्ति, दो मन: मिथुन चंद्र वाले संवाद में सोचते हैं और दुगुनी गति से सीखते हैं। जिज्ञासा इनकी ऑक्सीजन है, एकरसता घुटन। शानदार संवादकर्ता जो पाँच काम साध लें — चुनौती पाँचवाँ पूरा करना है।",
    career: "Writing & media, teaching, trade & marketing, technology, translation.",
    love: "Falls in love with minds first. Needs a partner who is also a best friend and conversation that never runs dry.",
    health: "Nervous energy: anxiety, restless sleep and respiratory sensitivity; breathwork genuinely helps.",
    lucky_day: "Wednesday", lucky_colors: ["Green", "Yellow"],
  },
  {
    slug: "kark", index: 3, name: "Cancer", name_hi: "कर्क", lord: "Moon", lord_hi: "चंद्र",
    element: "Water", element_hi: "जल", quality: "Movable (Chara)", quality_hi: "चर",
    symbol: "The Crab", symbol_hi: "केकड़ा", body_part: "Chest & stomach",
    nakshatra_spans: ["Punarvasu (pada 4)", "Pushya (all 4 padas)", "Ashlesha (all 4 padas)"],
    traits_en: "The Moon in its own home: Cancer Moons feel everything first and think second — and their feelings are usually right. Family is their kingdom, memory their treasury, nurture their genius. The hard shell exists because the inside is that soft.",
    traits_hi: "चंद्रमा अपने ही घर में: कर्क चंद्र वाले पहले अनुभव करते हैं, बाद में सोचते हैं — और इनका अनुभव प्रायः सही होता है। परिवार इनका राज्य, स्मृति खज़ाना, पालन-पोषण प्रतिभा। कठोर खोल इसलिए है क्योंकि भीतर उतना ही कोमल है।",
    career: "Hospitality & food, healthcare & nursing, real estate, history & archives, family business.",
    love: "Loves by caring — feeding, remembering, protecting. Needs emotional safety before anything else can grow.",
    health: "Digestion mirrors emotion: stomach and chest issues flare with stress; the mind-gut link is real here.",
    lucky_day: "Monday", lucky_colors: ["White", "Silver", "Sea-green"],
  },
  {
    slug: "simha", index: 4, name: "Leo", name_hi: "सिंह", lord: "Sun", lord_hi: "सूर्य",
    element: "Fire", element_hi: "अग्नि", quality: "Fixed (Sthira)", quality_hi: "स्थिर",
    symbol: "The Lion", symbol_hi: "सिंह", body_part: "Heart & upper back",
    nakshatra_spans: ["Magha (all 4 padas)", "Purva Phalguni (all 4 padas)", "Uttara Phalguni (pada 1)"],
    traits_en: "The Sun's own sign: Leo Moons carry an inner throne — dignity, warmth and the quiet expectation of respect. Generous to a fault with those they love; the room organises itself around them without their asking. Pride is both crown and cross.",
    traits_hi: "सूर्य की अपनी राशि: सिंह चंद्र वालों के भीतर एक सिंहासन होता है — गरिमा, उष्णता और सम्मान की सहज अपेक्षा। अपनों के लिए हद से अधिक उदार; कक्ष इनके कहे बिना इनके इर्द-गिर्द सज जाता है। स्वाभिमान मुकुट भी है, बोझ भी।",
    career: "Leadership & administration, entertainment, politics, teaching, brand-building.",
    love: "Loves loyally and expects to be adored back — appreciation is not optional. Grand gestures come naturally.",
    health: "Heart, spine and blood pressure — the classic zones; ego-stress lands in the chest.",
    lucky_day: "Sunday", lucky_colors: ["Gold", "Orange", "Ruby-red"],
  },
  {
    slug: "kanya", index: 5, name: "Virgo", name_hi: "कन्या", lord: "Mercury", lord_hi: "बुध",
    element: "Earth", element_hi: "पृथ्वी", quality: "Dual (Dvisvabhava)", quality_hi: "द्विस्वभाव",
    symbol: "The Maiden", symbol_hi: "कन्या", body_part: "Digestive system",
    nakshatra_spans: ["Uttara Phalguni (padas 2–4)", "Hasta (all 4 padas)", "Chitra (padas 1–2)"],
    traits_en: "The refiner: Virgo Moons see what others miss — the flaw, the fix, the finer point. Service is how they love; improvement is how they relax. Behind the modest exterior sits the zodiac's most useful mind.",
    traits_hi: "परिष्कारक: कन्या चंद्र वाले वह देख लेते हैं जो औरों से छूट जाता है — त्रुटि, समाधान, बारीकी। सेवा इनका प्रेम है; सुधार इनका विश्राम। विनम्र बाहरी रूप के पीछे राशिचक्र की सबसे उपयोगी बुद्धि बैठी है।",
    career: "Medicine & healing, analysis & audit, editing, quality control, nutrition.",
    love: "Shows love through acts of service and quiet fixing. Criticism is care in disguise — partners must learn the dialect.",
    health: "Gut-centred: digestion, absorption and worry-related IBS patterns; routine is medicine.",
    lucky_day: "Wednesday", lucky_colors: ["Green", "White"],
  },
  {
    slug: "tula", index: 6, name: "Libra", name_hi: "तुला", lord: "Venus", lord_hi: "शुक्र",
    element: "Air", element_hi: "वायु", quality: "Movable (Chara)", quality_hi: "चर",
    symbol: "The Scales", symbol_hi: "तराजू", body_part: "Lower back & kidneys",
    nakshatra_spans: ["Chitra (padas 3–4)", "Swati (all 4 padas)", "Vishakha (padas 1–3)"],
    traits_en: "The balancer: Libra Moons instinctively weigh every side, smooth every conflict and beautify every room. Partnership is their natural habitat — they think better in twos. Justice matters to them personally, not just abstractly.",
    traits_hi: "संतुलनकर्ता: तुला चंद्र वाले सहज ही हर पक्ष तौलते, हर कलह शांत करते और हर स्थान सुंदर बनाते हैं। साझेदारी इनका स्वाभाविक वास है — दो में इनकी बुद्धि बेहतर चलती है। न्याय इनके लिए निजी विषय है।",
    career: "Law & judiciary, diplomacy, design & aesthetics, HR & mediation, luxury retail.",
    love: "Born for partnership; romantic, fair and allergic to rudeness. Decision paralysis is the tax on seeing all sides.",
    health: "Kidneys, lower back and sugar balance; harmony at home is literally good for their health.",
    lucky_day: "Friday", lucky_colors: ["White", "Pastel blue", "Pink"],
  },
  {
    slug: "vrishchik", index: 7, name: "Scorpio", name_hi: "वृश्चिक", lord: "Mars", lord_hi: "मंगल",
    element: "Water", element_hi: "जल", quality: "Fixed (Sthira)", quality_hi: "स्थिर",
    symbol: "The Scorpion", symbol_hi: "बिच्छू", body_part: "Reproductive system",
    nakshatra_spans: ["Vishakha (pada 4)", "Anuradha (all 4 padas)", "Jyeshtha (all 4 padas)"],
    traits_en: "Still water, deep current: Scorpio Moons feel with an intensity they rarely display. They see through people instantly, keep secrets like vaults and transform through every crisis. Their loyalty, once earned, survives everything — so does their memory of betrayal.",
    traits_hi: "शांत जल, गहरी धारा: वृश्चिक चंद्र वाले जिस तीव्रता से अनुभव करते हैं, उसे विरले दिखाते हैं। लोगों के आर-पार तुरंत देखते हैं, रहस्य तिजोरी-से रखते हैं और हर संकट से रूपांतरित होकर निकलते हैं। एक बार अर्जित निष्ठा सब सह जाती है — विश्वासघात की स्मृति भी।",
    career: "Research & investigation, surgery, psychology, occult sciences, crisis management, insurance.",
    love: "All or nothing — merges completely or not at all. Trust is built in drops and lost in buckets.",
    health: "Reproductive and elimination systems; emotional suppression somatises — expression is prevention.",
    lucky_day: "Tuesday", lucky_colors: ["Deep red", "Maroon"],
  },
  {
    slug: "dhanu", index: 8, name: "Sagittarius", name_hi: "धनु", lord: "Jupiter", lord_hi: "गुरु",
    element: "Fire", element_hi: "अग्नि", quality: "Dual (Dvisvabhava)", quality_hi: "द्विस्वभाव",
    symbol: "The Archer", symbol_hi: "धनुर्धर", body_part: "Hips & thighs",
    nakshatra_spans: ["Mula (all 4 padas)", "Purva Ashadha (all 4 padas)", "Uttara Ashadha (pada 1)"],
    traits_en: "The optimist's bow: Sagittarius Moons aim at meaning — philosophy, faith, far horizons. Blunt-tongued and big-hearted, they teach wherever they stand and believe tomorrow is fixable. Freedom isn't a preference; it's a requirement.",
    traits_hi: "आशावादी का धनुष: धनु चंद्र वाले अर्थ पर निशाना साधते हैं — दर्शन, श्रद्धा, दूर के क्षितिज। स्पष्टभाषी और विशाल-हृदय; जहाँ खड़े हों वहीं सिखाते हैं और मानते हैं कि कल सुधारा जा सकता है। स्वतंत्रता इनकी पसंद नहीं, आवश्यकता है।",
    career: "Teaching & academia, law & dharma, travel, publishing, spiritual guidance, foreign connections.",
    love: "Needs a co-adventurer, not a warden. Loves honestly and laughs through storms; commitment must feel like freedom.",
    health: "Hips, thighs, liver; over-indulgence (Jupiter's excess) is the pattern to watch.",
    lucky_day: "Thursday", lucky_colors: ["Yellow", "Saffron"],
  },
  {
    slug: "makar", index: 9, name: "Capricorn", name_hi: "मकर", lord: "Saturn", lord_hi: "शनि",
    element: "Earth", element_hi: "पृथ्वी", quality: "Movable (Chara)", quality_hi: "चर",
    symbol: "The Sea-Goat", symbol_hi: "मकर", body_part: "Knees & bones",
    nakshatra_spans: ["Uttara Ashadha (padas 2–4)", "Shravana (all 4 padas)", "Dhanishtha (padas 1–2)"],
    traits_en: "The mountain path: Capricorn Moons climb — slowly, methodically, without complaint. Emotions are budgeted like resources; duty is the love language they learned early. What they build takes years and lasts generations.",
    traits_hi: "पर्वत-पथ: मकर चंद्र वाले चढ़ते हैं — धीरे, विधिपूर्वक, बिना शिकायत। भावनाएँ संसाधनों की तरह नपी-तुली; कर्तव्य इनकी प्रेम-भाषा है, जो बचपन में ही सीख ली गई। ये जो बनाते हैं वह वर्षों में बनता है और पीढ़ियों चलता है।",
    career: "Administration & governance, construction, mining & minerals, corporate leadership, chronology-heavy fields.",
    love: "Slow to open, absolutely steadfast once committed. Shows love by providing and protecting, not proclaiming.",
    health: "Knees, joints and bones; melancholy under pressure — sunlight and rest are non-negotiable.",
    lucky_day: "Saturday", lucky_colors: ["Dark blue", "Black", "Grey"],
  },
  {
    slug: "kumbh", index: 10, name: "Aquarius", name_hi: "कुम्भ", lord: "Saturn", lord_hi: "शनि",
    element: "Air", element_hi: "वायु", quality: "Fixed (Sthira)", quality_hi: "स्थिर",
    symbol: "The Water-Bearer", symbol_hi: "कलश-धारी", body_part: "Calves & ankles",
    nakshatra_spans: ["Dhanishtha (padas 3–4)", "Shatabhisha (all 4 padas)", "Purva Bhadrapada (padas 1–3)"],
    traits_en: "The community's mind: Aquarius Moons think in systems and feel for collectives. Detached yet deeply humanitarian, conventional in appearance yet radical in thought. Their friendships outlast most people's marriages.",
    traits_hi: "समाज की बुद्धि: कुम्भ चंद्र वाले तंत्र में सोचते हैं और समूह के लिए अनुभव करते हैं। विरक्त पर गहरे मानवतावादी; दिखने में पारंपरिक, विचार में क्रांतिकारी। इनकी मित्रताएँ प्रायः औरों के विवाहों से लंबी चलती हैं।",
    career: "Science & technology, social reform, networks & communities, astrology, large organisations.",
    love: "Friendship first, always — romance grows from intellectual kinship. Needs space without it meaning distance.",
    health: "Circulation, calves and ankles; irregular routines quietly tax the nervous system.",
    lucky_day: "Saturday", lucky_colors: ["Electric blue", "Black"],
  },
  {
    slug: "meen", index: 11, name: "Pisces", name_hi: "मीन", lord: "Jupiter", lord_hi: "गुरु",
    element: "Water", element_hi: "जल", quality: "Dual (Dvisvabhava)", quality_hi: "द्विस्वभाव",
    symbol: "Two Fish", symbol_hi: "दो मछलियाँ", body_part: "Feet",
    nakshatra_spans: ["Purva Bhadrapada (pada 4)", "Uttara Bhadrapada (all 4 padas)", "Revati (all 4 padas)"],
    traits_en: "The ocean at the end of the zodiac: Pisces Moons absorb every current around them — moods, music, unspoken pain. Compassion is involuntary; imagination is home. They need solitude to empty what they absorb, and faith to stay anchored.",
    traits_hi: "राशिचक्र के अंत का समुद्र: मीन चंद्र वाले आसपास की हर धारा सोख लेते हैं — भाव, संगीत, अनकहा दुःख। करुणा इनके लिए स्वैच्छिक नहीं, स्वाभाविक है; कल्पना इनका घर। सोखा हुआ खाली करने को एकांत चाहिए, और टिके रहने को श्रद्धा।",
    career: "Arts & music, healing & counselling, spirituality, marine fields, film & photography, charitable work.",
    love: "Loves unconditionally and idealises easily; needs a partner who protects their softness without exploiting it.",
    health: "Feet, lymphatic system and sleep; boundaries are their most important health practice.",
    lucky_day: "Thursday", lucky_colors: ["Yellow", "Sea-green"],
  },
];

export function getRashi(slug: string): RashiInfo | undefined {
  return RASHIS.find((r) => r.slug === slug);
}
