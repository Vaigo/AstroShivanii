export interface NumProfile {
  number: number;
  planet: { en: string; hi: string };
  sign: { en: string; hi: string };
  gemstone: { en: string; hi: string };
  alternateGem: { en: string; hi: string };
  favorableDay: { en: string; hi: string };
  colors: { en: string[]; hi: string[] };
  direction: { en: string; hi: string };
  god: { en: string; hi: string };
  favorableDates: number[];
  fast: { en: string; hi: string };
  mantra: string;
  luckyNumbers: number[];
  luckyAlphabets: string[];
  description: { en: string; hi: string };
  traits: { en: string[]; hi: string[] };
}

export const PROFILES: Record<number, NumProfile> = {
  1: {
    number: 1,
    planet:       { en: "Sun (Surya)", hi: "सूर्य" },
    sign:         { en: "Leo (Singh)", hi: "सिंह" },
    gemstone:     { en: "Ruby (Manik)", hi: "माणिक" },
    alternateGem: { en: "Red Spinel / Garnet", hi: "लाल स्पिनेल / गार्नेट" },
    favorableDay: { en: "Sunday", hi: "रविवार" },
    colors:       { en: ["Gold", "Orange", "Copper"], hi: ["सोना", "नारंगी", "तांबा"] },
    direction:    { en: "East", hi: "पूर्व" },
    god:          { en: "Lord Surya · Lord Vishnu", hi: "भगवान सूर्य · भगवान विष्णु" },
    favorableDates: [1, 10, 19, 28],
    fast:         { en: "Sunday fast — offer water to Sun at sunrise", hi: "रविवार व्रत — सूर्योदय पर जल अर्पण" },
    mantra:       "ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः",
    luckyNumbers: [1, 2, 4],
    luckyAlphabets: ["A", "E", "I", "O", "U"],
    description:  { en: "Ruled by the Sun — natural leader, courageous, and ambitious. Number 1 people shine when given independence and authority.", hi: "सूर्य द्वारा शासित — प्राकृतिक नेता, साहसी और महत्वाकांक्षी। मूलांक 1 के लोग स्वतंत्रता में सबसे चमकते हैं।" },
    traits:       { en: ["Leadership", "Confidence", "Creativity", "Independence"], hi: ["नेतृत्व", "आत्मविश्वास", "रचनात्मकता", "स्वतंत्रता"] },
  },
  2: {
    number: 2,
    planet:       { en: "Moon (Chandra)", hi: "चंद्रमा" },
    sign:         { en: "Cancer (Kark)", hi: "कर्क" },
    gemstone:     { en: "Pearl (Moti)", hi: "मोती" },
    alternateGem: { en: "Moonstone", hi: "मूनस्टोन" },
    favorableDay: { en: "Monday", hi: "सोमवार" },
    colors:       { en: ["White", "Silver", "Cream"], hi: ["सफेद", "चांदी", "क्रीम"] },
    direction:    { en: "North-West", hi: "उत्तर-पश्चिम" },
    god:          { en: "Goddess Parvati · Lord Chandra", hi: "देवी पार्वती · भगवान चंद्रमा" },
    favorableDates: [2, 11, 20, 29],
    fast:         { en: "Monday fast — offer milk to Shiva linga", hi: "सोमवार व्रत — शिवलिंग पर दूध अर्पण" },
    mantra:       "ॐ श्रां श्रीं श्रौं सः चंद्रमसे नमः",
    luckyNumbers: [2, 7],
    luckyAlphabets: ["B", "K", "R"],
    description:  { en: "Ruled by the Moon — intuitive, sensitive, and deeply emotional. Number 2 people have a gift for relationships and diplomacy.", hi: "चंद्रमा द्वारा शासित — सहज, संवेदनशील और भावनात्मक। मूलांक 2 संबंधों और कूटनीति में कुशल होते हैं।" },
    traits:       { en: ["Intuition", "Diplomacy", "Sensitivity", "Patience"], hi: ["अंतर्ज्ञान", "कूटनीति", "संवेदनशीलता", "धैर्य"] },
  },
  3: {
    number: 3,
    planet:       { en: "Jupiter (Guru)", hi: "गुरु / बृहस्पति" },
    sign:         { en: "Sagittarius · Pisces (Dhanu · Meen)", hi: "धनु · मीन" },
    gemstone:     { en: "Yellow Sapphire (Pukhraj)", hi: "पुखराज" },
    alternateGem: { en: "Yellow Topaz / Citrine", hi: "पीला पुखराज / सिट्रीन" },
    favorableDay: { en: "Thursday", hi: "गुरुवार" },
    colors:       { en: ["Yellow", "Golden Yellow", "Saffron"], hi: ["पीला", "सुनहरा पीला", "केसरिया"] },
    direction:    { en: "North-East", hi: "उत्तर-पूर्व" },
    god:          { en: "Lord Vishnu · Lord Brihaspati", hi: "भगवान विष्णु · भगवान बृहस्पति" },
    favorableDates: [3, 12, 21, 30],
    fast:         { en: "Thursday fast — eat yellow food, offer chana dal", hi: "गुरुवार व्रत — पीला भोजन, चना दाल अर्पण" },
    mantra:       "ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः",
    luckyNumbers: [3, 6, 9],
    luckyAlphabets: ["C", "G", "L", "S"],
    description:  { en: "Ruled by Jupiter — wise, generous, and philosophical. Number 3 people are teachers, speakers, and optimists who uplift everyone around them.", hi: "गुरु द्वारा शासित — बुद्धिमान, उदार और दार्शनिक। मूलांक 3 शिक्षक, वक्ता और आशावादी होते हैं।" },
    traits:       { en: ["Wisdom", "Optimism", "Communication", "Generosity"], hi: ["बुद्धि", "आशावाद", "संचार", "उदारता"] },
  },
  4: {
    number: 4,
    planet:       { en: "Rahu (North Node)", hi: "राहु" },
    sign:         { en: "Aquarius (Kumbh)", hi: "कुंभ" },
    gemstone:     { en: "Hessonite (Gomed)", hi: "गोमेद" },
    alternateGem: { en: "Zircon", hi: "जिर्कन" },
    favorableDay: { en: "Saturday · Sunday", hi: "शनिवार · रविवार" },
    colors:       { en: ["Electric Blue", "Gray", "Dark Brown"], hi: ["इलेक्ट्रिक नीला", "धूसर", "गहरा भूरा"] },
    direction:    { en: "South-West", hi: "दक्षिण-पश्चिम" },
    god:          { en: "Lord Ganesha · Goddess Durga", hi: "भगवान गणेश · देवी दुर्गा" },
    favorableDates: [4, 13, 22, 31],
    fast:         { en: "Saturday fast — offer sesame seeds and mustard oil", hi: "शनिवार व्रत — तिल और सरसों का तेल अर्पण" },
    mantra:       "ॐ भ्रां भ्रीं भ्रौं सः राहवे नमः",
    luckyNumbers: [1, 4, 8],
    luckyAlphabets: ["D", "M", "T"],
    description:  { en: "Ruled by Rahu — unconventional, hardworking, and often misunderstood. Number 4 people build strong foundations but must guard against stubbornness.", hi: "राहु द्वारा शासित — अपरंपरागत, मेहनती और अक्सर गलत समझे गए। मूलांक 4 मजबूत नींव बनाते हैं।" },
    traits:       { en: ["Discipline", "Reliability", "Hard Work", "Practicality"], hi: ["अनुशासन", "विश्वसनीयता", "परिश्रम", "व्यावहारिकता"] },
  },
  5: {
    number: 5,
    planet:       { en: "Mercury (Budh)", hi: "बुध" },
    sign:         { en: "Gemini · Virgo (Mithun · Kanya)", hi: "मिथुन · कन्या" },
    gemstone:     { en: "Emerald (Panna)", hi: "पन्ना" },
    alternateGem: { en: "Green Onyx / Jade", hi: "हरी ओनेक्स / जेड" },
    favorableDay: { en: "Wednesday", hi: "बुधवार" },
    colors:       { en: ["Green", "Light Green", "Parrot Green"], hi: ["हरा", "हल्का हरा", "तोता हरा"] },
    direction:    { en: "North", hi: "उत्तर" },
    god:          { en: "Lord Vishnu · Lord Ganesha", hi: "भगवान विष्णु · भगवान गणेश" },
    favorableDates: [5, 14, 23],
    fast:         { en: "Wednesday fast — offer green grass to Lord Ganesha", hi: "बुधवार व्रत — गणेश जी को हरी घास अर्पण" },
    mantra:       "ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः",
    luckyNumbers: [5, 6],
    luckyAlphabets: ["E", "H", "N", "X"],
    description:  { en: "Ruled by Mercury — quick-witted, adaptable, and curious. Number 5 people crave freedom and excel in communication, business, and travel.", hi: "बुध द्वारा शासित — चतुर, अनुकूलनशील और जिज्ञासु। मूलांक 5 स्वतंत्रता और संचार में उत्कृष्ट हैं।" },
    traits:       { en: ["Adaptability", "Intelligence", "Curiosity", "Freedom"], hi: ["अनुकूलनशीलता", "बुद्धि", "जिज्ञासा", "स्वतंत्रता"] },
  },
  6: {
    number: 6,
    planet:       { en: "Venus (Shukra)", hi: "शुक्र" },
    sign:         { en: "Taurus · Libra (Vrishabh · Tula)", hi: "वृषभ · तुला" },
    gemstone:     { en: "Diamond (Heera)", hi: "हीरा" },
    alternateGem: { en: "White Sapphire / Opal", hi: "सफेद पुखराज / ओपल" },
    favorableDay: { en: "Friday", hi: "शुक्रवार" },
    colors:       { en: ["Pink", "White", "Light Blue"], hi: ["गुलाबी", "सफेद", "हल्का नीला"] },
    direction:    { en: "South-East", hi: "दक्षिण-पूर्व" },
    god:          { en: "Goddess Lakshmi · Goddess Saraswati", hi: "देवी लक्ष्मी · देवी सरस्वती" },
    favorableDates: [6, 15, 24],
    fast:         { en: "Friday fast — offer white flowers to Goddess Lakshmi", hi: "शुक्रवार व्रत — देवी लक्ष्मी को सफेद फूल अर्पण" },
    mantra:       "ॐ द्रां द्रीं द्रौं सः शुक्राय नमः",
    luckyNumbers: [3, 6, 9],
    luckyAlphabets: ["F", "O", "U", "V", "W", "X"],
    description:  { en: "Ruled by Venus — artistic, harmonious, and loving. Number 6 people are natural nurturers who create beauty in everything they touch.", hi: "शुक्र द्वारा शासित — कलात्मक, सामंजस्यपूर्ण और प्रेमपूर्ण। मूलांक 6 प्राकृतिक पोषक और सौंदर्य के निर्माता हैं।" },
    traits:       { en: ["Nurturing", "Harmony", "Artistry", "Responsibility"], hi: ["पोषण", "सामंजस्य", "कला", "जिम्मेदारी"] },
  },
  7: {
    number: 7,
    planet:       { en: "Ketu (South Node)", hi: "केतु" },
    sign:         { en: "Pisces · Scorpio (Meen · Vrishchik)", hi: "मीन · वृश्चिक" },
    gemstone:     { en: "Cat's Eye (Lahsuniya)", hi: "लहसुनिया" },
    alternateGem: { en: "Tiger's Eye / Turquoise", hi: "टाइगर आई / फिरोजा" },
    favorableDay: { en: "Sunday · Thursday", hi: "रविवार · गुरुवार" },
    colors:       { en: ["Violet", "Gray", "Multi-colour"], hi: ["बैंगनी", "धूसर", "बहुरंगी"] },
    direction:    { en: "South-West", hi: "दक्षिण-पश्चिम" },
    god:          { en: "Goddess Kali · Lord Shiva", hi: "देवी काली · भगवान शिव" },
    favorableDates: [7, 16, 25],
    fast:         { en: "Thursday or Monday — meditate and light a lamp for Kali Mata", hi: "गुरुवार या सोमवार — काली माता के लिए दीप जलाएं और ध्यान करें" },
    mantra:       "ॐ स्रां स्रीं स्रौं सः केतवे नमः",
    luckyNumbers: [2, 7],
    luckyAlphabets: ["G", "O", "P", "Y", "Z"],
    description:  { en: "Ruled by Ketu — deeply spiritual, analytical, and mysterious. Number 7 people are seekers of truth who need solitude to recharge and discover deeper meaning.", hi: "केतु द्वारा शासित — गहराई से आध्यात्मिक, विश्लेषणात्मक और रहस्यमय। मूलांक 7 सत्य के साधक हैं।" },
    traits:       { en: ["Spirituality", "Analysis", "Intuition", "Wisdom"], hi: ["आध्यात्मिकता", "विश्लेषण", "अंतर्ज्ञान", "बुद्धि"] },
  },
  8: {
    number: 8,
    planet:       { en: "Saturn (Shani)", hi: "शनि" },
    sign:         { en: "Capricorn · Aquarius (Makar · Kumbh)", hi: "मकर · कुंभ" },
    gemstone:     { en: "Blue Sapphire (Neelam)", hi: "नीलम" },
    alternateGem: { en: "Amethyst / Black Tourmaline", hi: "अमेथिस्ट / काला टूर्मलाइन" },
    favorableDay: { en: "Saturday", hi: "शनिवार" },
    colors:       { en: ["Dark Blue", "Black", "Navy"], hi: ["गहरा नीला", "काला", "नेवी नीला"] },
    direction:    { en: "West", hi: "पश्चिम" },
    god:          { en: "Lord Shani · Lord Bhairava", hi: "भगवान शनि · भगवान भैरव" },
    favorableDates: [8, 17, 26],
    fast:         { en: "Saturday fast — offer sesame seeds, mustard oil lamp to Shani Dev", hi: "शनिवार व्रत — शनि देव को तिल, सरसों का तेल का दीप अर्पण" },
    mantra:       "ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः",
    luckyNumbers: [4, 8],
    luckyAlphabets: ["F", "H", "P", "Q", "Z"],
    description:  { en: "Ruled by Saturn — powerful, ambitious, and karmic. Number 8 is the number of power, material success, and destiny. Success comes late but lasts forever.", hi: "शनि द्वारा शासित — शक्तिशाली, महत्वाकांक्षी और कार्मिक। मूलांक 8 शक्ति और भाग्य का अंक है।" },
    traits:       { en: ["Ambition", "Perseverance", "Authority", "Karma"], hi: ["महत्वाकांक्षा", "दृढ़ता", "अधिकार", "कर्म"] },
  },
  9: {
    number: 9,
    planet:       { en: "Mars (Mangal)", hi: "मंगल" },
    sign:         { en: "Aries · Scorpio (Mesh · Vrishchik)", hi: "मेष · वृश्चिक" },
    gemstone:     { en: "Red Coral (Moonga)", hi: "मूंगा" },
    alternateGem: { en: "Bloodstone / Red Carnelian", hi: "ब्लडस्टोन / लाल कार्नेलियन" },
    favorableDay: { en: "Tuesday", hi: "मंगलवार" },
    colors:       { en: ["Red", "Crimson", "Scarlet"], hi: ["लाल", "क्रिमसन", "गहरा लाल"] },
    direction:    { en: "South", hi: "दक्षिण" },
    god:          { en: "Lord Hanuman · Goddess Durga", hi: "भगवान हनुमान · देवी दुर्गा" },
    favorableDates: [9, 18, 27],
    fast:         { en: "Tuesday fast — offer red flowers and sindoor to Hanuman ji", hi: "मंगलवार व्रत — हनुमान जी को लाल फूल और सिंदूर अर्पण" },
    mantra:       "ॐ क्रां क्रीं क्रौं सः भौमाय नमः",
    luckyNumbers: [3, 6, 9],
    luckyAlphabets: ["I", "R"],
    description:  { en: "Ruled by Mars — courageous, energetic, and humanitarian. Number 9 is the number of completion and universal love. These people live to serve.", hi: "मंगल द्वारा शासित — साहसी, ऊर्जावान और मानवतावादी। मूलांक 9 पूर्णता और सार्वभौमिक प्रेम का अंक है।" },
    traits:       { en: ["Courage", "Compassion", "Leadership", "Humanitarianism"], hi: ["साहस", "करुणा", "नेतृत्व", "मानवता"] },
  },
};

/* ─── Karmic Debt Numbers ────────────────────────────────────────────────────── */
export const KARMIC_DEBT: Record<number, {
  reducesTo: number;
  theme: { en: string; hi: string };
  meaning: { en: string; hi: string };
  remedy: { en: string; hi: string };
}> = {
  13: {
    reducesTo: 4,
    theme: { en: "Laziness & Shortcuts", hi: "आलस्य और शॉर्टकट" },
    meaning: {
      en: "In a past life, you avoided hard work and took shortcuts. This life demands consistent effort, discipline, and building things that last. Nothing will come easy — and that is the point.",
      hi: "पिछले जन्म में आपने परिश्रम से बचाव किया और शॉर्टकट लिए। इस जीवन में निरंतर मेहनत और अनुशासन अनिवार्य है।",
    },
    remedy: {
      en: "Worship Lord Hanuman every Tuesday. Chant 'Om Hanumate Namah' 108 times. Never leave work unfinished.",
      hi: "हर मंगलवार हनुमान जी की पूजा करें। 'ॐ हनुमते नमः' 108 बार जपें। कोई भी काम अधूरा न छोड़ें।",
    },
  },
  14: {
    reducesTo: 5,
    theme: { en: "Overindulgence & Addiction", hi: "भोग-विलास और लत" },
    meaning: {
      en: "In a past life, you overindulged in pleasures, addictions, and escaped from responsibility. This life calls for moderation, self-discipline, and staying grounded.",
      hi: "पिछले जन्म में आपने भोग-विलास और नशे की अधिकता की। इस जीवन में संयम, आत्म-अनुशासन और जिम्मेदारी चाहिए।",
    },
    remedy: {
      en: "Worship Lord Ganesha every Wednesday. Avoid all intoxicants. Practice daily meditation for 15 minutes.",
      hi: "हर बुधवार गणेश जी की पूजा करें। सभी नशे से बचें। प्रतिदिन 15 मिनट ध्यान करें।",
    },
  },
  16: {
    reducesTo: 7,
    theme: { en: "Ego & Shattered Pride", hi: "अहंकार और टूटा हुआ अभिमान" },
    meaning: {
      en: "In a past life, ego and arrogance destroyed important relationships and opportunities. This life brings sudden falls and unexpected losses to teach humility, surrender, and letting go.",
      hi: "पिछले जन्म में अहंकार ने महत्वपूर्ण रिश्ते और अवसर नष्ट किए। इस जीवन में विनम्रता और समर्पण सीखना है।",
    },
    remedy: {
      en: "Worship Goddess Kali every Saturday. Donate to temples or the underprivileged anonymously. Practice 'I am a servant, not a master.'",
      hi: "हर शनिवार देवी काली की पूजा करें। मंदिर या गरीबों को गुप्त दान करें। 'मैं सेवक हूं, स्वामी नहीं' का अभ्यास करें।",
    },
  },
  19: {
    reducesTo: 1,
    theme: { en: "Misuse of Power", hi: "शक्ति का दुरुपयोग" },
    meaning: {
      en: "In a past life, you misused authority and power for selfish ends, harming others. This life teaches you to become truly self-reliant without depending on or controlling others.",
      hi: "पिछले जन्म में आपने स्वार्थ के लिए शक्ति और अधिकार का दुरुपयोग किया। इस जीवन में स्वावलंबन और निस्वार्थ सेवा सीखनी है।",
    },
    remedy: {
      en: "Offer water to the Sun every Sunday at sunrise. Help those in need without expectation. Worship Lord Vishnu every Thursday.",
      hi: "हर रविवार सूर्योदय पर सूर्य को जल अर्पण करें। बिना अपेक्षा के जरूरतमंदों की मदद करें। गुरुवार को विष्णु जी की पूजा करें।",
    },
  },
};

/* ─── Karmic Lesson Numbers (Missing from Lo Shu) ───────────────────────────── */
export const KARMIC_LESSONS: Record<number, {
  theme: { en: string; hi: string };
  lesson: { en: string; hi: string };
  remedy: { en: string; hi: string };
}> = {
  1: {
    theme:  { en: "Independence & Leadership", hi: "स्वतंत्रता और नेतृत्व" },
    lesson: { en: "You shy away from taking initiative and leading. Your life lesson is to develop confidence, self-reliance, and the courage to stand alone when needed.", hi: "आप नेतृत्व से बचते हैं। आपका कर्म-पाठ है — आत्मविश्वास और स्वावलंबन विकसित करना।" },
    remedy: { en: "Take on one leadership role. Make decisions on your own — even small ones.", hi: "एक नेतृत्व की भूमिका लें। अपने निर्णय स्वयं लें — चाहे छोटे हों।" },
  },
  2: {
    theme:  { en: "Relationships & Sensitivity", hi: "संबंध और संवेदनशीलता" },
    lesson: { en: "Working in harmony with others is your challenge. Learn patience, diplomacy, and the courage to be emotionally open.", hi: "दूसरों के साथ सामंजस्य आपकी चुनौती है। धैर्य, कूटनीति और भावनात्मक खुलापन सीखें।" },
    remedy: { en: "Practice listening deeply. Apologize when wrong. Value partnerships over ego.", hi: "गहराई से सुनने का अभ्यास करें। गलत होने पर माफी मांगें।" },
  },
  3: {
    theme:  { en: "Self-Expression & Creativity", hi: "स्व-अभिव्यक्ति और रचनात्मकता" },
    lesson: { en: "You suppress your thoughts and creative voice. Your lesson is to express yourself freely — through words, art, music, or ideas.", hi: "आप अपने विचारों को दबाते हैं। आपका पाठ है — स्वतंत्र रूप से अभिव्यक्त होना।" },
    remedy: { en: "Write a journal. Sing. Paint. Share your ideas without waiting for permission.", hi: "जर्नल लिखें। गाएं। चित्र बनाएं। बिना अनुमति के अपने विचार साझा करें।" },
  },
  4: {
    theme:  { en: "Order & Discipline", hi: "व्यवस्था और अनुशासन" },
    lesson: { en: "Structure feels restrictive. Your lesson is to embrace discipline, routine, and building things step by step with patience.", hi: "व्यवस्था बंधनकारी लगती है। आपका पाठ है — अनुशासन और धैर्य से चीजें बनाना।" },
    remedy: { en: "Keep a fixed daily routine for 21 days. Organize one space in your home first.", hi: "21 दिन के लिए एक निश्चित दिनचर्या बनाएं। पहले घर की एक जगह व्यवस्थित करें।" },
  },
  5: {
    theme:  { en: "Freedom & Adaptability", hi: "स्वतंत्रता और अनुकूलनशीलता" },
    lesson: { en: "Fear of change holds you back. Your lesson is to embrace new experiences, take calculated risks, and flow with life's inevitable changes.", hi: "बदलाव का डर आपको रोकता है। आपका पाठ है — नए अनुभवों को अपनाना और जीवन के बदलावों के साथ बहना।" },
    remedy: { en: "Do one new thing every month — travel, food, hobby. Say yes more often.", hi: "हर महीने एक नई चीज़ करें — यात्रा, खाना, शौक। ज्यादा 'हाँ' कहें।" },
  },
  6: {
    theme:  { en: "Responsibility & Love", hi: "जिम्मेदारी और प्रेम" },
    lesson: { en: "Taking responsibility for others and giving love unconditionally is your challenge. Your lesson is to nurture — family, relationships, and community.", hi: "दूसरों की जिम्मेदारी और निस्वार्थ प्रेम देना आपकी चुनौती है। आपका पाठ है — परिवार और समुदाय की देखभाल।" },
    remedy: { en: "Call a family member you've been distant from. Volunteer or help a neighbor this week.", hi: "उस परिवार के सदस्य को फोन करें जिससे दूरी है। इस सप्ताह किसी पड़ोसी की मदद करें।" },
  },
  7: {
    theme:  { en: "Trust & Spiritual Faith", hi: "विश्वास और आत्मिक आस्था" },
    lesson: { en: "You rely only on logic and distrust the unseen. Your lesson is to develop inner knowing, spiritual faith, and trust that the universe is supporting you.", hi: "आप केवल तर्क पर निर्भर हैं। आपका पाठ है — आंतरिक ज्ञान और ईश्वर पर विश्वास विकसित करना।" },
    remedy: { en: "Meditate for 10 minutes daily. Spend time in nature. Pray even when answers aren't clear.", hi: "प्रतिदिन 10 मिनट ध्यान करें। प्रकृति में समय बिताएं। उत्तर न मिलने पर भी प्रार्थना करें।" },
  },
  8: {
    theme:  { en: "Material Power & Wisdom", hi: "भौतिक शक्ति और बुद्धि" },
    lesson: { en: "Money, authority, and ambition feel uncomfortable. Your lesson is financial wisdom, healthy ambition, and learning that power can be used for good.", hi: "धन, अधिकार और महत्वाकांक्षा असहज लगती है। आपका पाठ है — वित्तीय बुद्धि और सकारात्मक शक्ति का उपयोग।" },
    remedy: { en: "Set a financial goal. Track your spending. Accept that abundance is not a sin.", hi: "एक वित्तीय लक्ष्य निर्धारित करें। खर्च ट्रैक करें। समझें कि समृद्धि पाप नहीं है।" },
  },
  9: {
    theme:  { en: "Compassion & Completion", hi: "करुणा और पूर्णता" },
    lesson: { en: "Letting go and serving without expectation is your deepest challenge. Your lesson is universal love, forgiveness, and completing what you begin.", hi: "जाने देना और निस्वार्थ सेवा आपकी गहरी चुनौती है। आपका पाठ है — विश्वव्यापी प्रेम और क्षमा।" },
    remedy: { en: "Forgive someone this week — even if only in your heart. Complete one unfinished project.", hi: "इस सप्ताह किसी को माफ करें — चाहे केवल मन में। एक अधूरा प्रोजेक्ट पूरा करें।" },
  },
};

/* ─── Lo Shu Grid Layout ─────────────────────────────────────────────────────── */
export const LO_SHU_GRID = [
  [4, 9, 2],
  [3, 5, 7],
  [8, 1, 6],
];

export const PLANES = [
  { key: "mental",    label: { en: "Mental Plane",    hi: "मानसिक समतल" },    numbers: [4, 9, 2], desc: { en: "Intellect, imagination, memory",  hi: "बुद्धि, कल्पना, स्मृति" } },
  { key: "emotional", label: { en: "Emotional Plane",  hi: "भावनात्मक समतल" }, numbers: [3, 5, 7], desc: { en: "Feelings, sensitivity, intuition", hi: "भावनाएं, संवेदनशीलता, अंतर्ज्ञान" } },
  { key: "practical", label: { en: "Practical Plane",  hi: "व्यावहारिक समतल" }, numbers: [8, 1, 6], desc: { en: "Material success, action, stability", hi: "भौतिक सफलता, कार्य, स्थिरता" } },
  { key: "vision",    label: { en: "Vision Plane",     hi: "दृष्टि समतल" },    numbers: [4, 3, 8], desc: { en: "Long-range vision, perception",     hi: "दीर्घकालिक दृष्टि, धारणा" } },
  { key: "will",      label: { en: "Will Plane",       hi: "इच्छाशक्ति समतल" }, numbers: [9, 5, 1], desc: { en: "Determination, willpower, drive",   hi: "दृढ़ता, इच्छाशक्ति, प्रेरणा" } },
  { key: "action",    label: { en: "Action Plane",     hi: "क्रिया समतल" },    numbers: [2, 7, 6], desc: { en: "Execution, practicality, results",  hi: "क्रियान्वयन, व्यावहारिकता, परिणाम" } },
  { key: "golden",    label: { en: "Rajyog (Golden)",  hi: "राजयोग (स्वर्ण)" }, numbers: [4, 5, 6], desc: { en: "Artistic success and prosperity",   hi: "कलात्मक सफलता और समृद्धि" } },
  { key: "silver",    label: { en: "Rajyog (Silver)",  hi: "राजयोग (रजत)" },   numbers: [2, 5, 8], desc: { en: "Material power and authority",      hi: "भौतिक शक्ति और अधिकार" } },
];
