/** The 27 nakshatras — classical attributes + hand-written trait content.
 *  Pada→navamsa is computed (nakshatra index * 4 + pada), never stored. */

export interface NakshatraInfo {
  slug: string;
  index: number;           // 0-based
  name: string;
  name_hi: string;
  lord: string;
  lord_hi: string;
  deity: string;
  deity_hi: string;
  symbol: string;
  symbol_hi: string;
  gana: "Deva" | "Manushya" | "Rakshasa";
  yoni: string;            // animal, en
  yoni_hi: string;
  span: string;            // zodiac span
  span_hi: string;
  syllables: string[];     // 4 name syllables
  traits_en: string;
  traits_hi: string;
  careers: string[];
  watch_out: string;       // one honest caution, en
  watch_out_hi: string;
}

export const GANA_HI: Record<string, string> = {
  Deva: "देव", Manushya: "मनुष्य", Rakshasa: "राक्षस",
};

export const NAKSHATRAS: NakshatraInfo[] = [
  {
    slug: "ashwini", index: 0, name: "Ashwini", name_hi: "अश्विनी",
    lord: "Ketu", lord_hi: "केतु", deity: "Ashwini Kumaras (divine healers)", deity_hi: "अश्विनी कुमार",
    symbol: "Horse's head", symbol_hi: "अश्व-मुख", gana: "Deva", yoni: "Horse", yoni_hi: "अश्व",
    span: "Aries 0°00' – 13°20'", span_hi: "मेष 0°00' – 13°20'",
    syllables: ["चू", "चे", "चो", "ला"],
    traits_en: "Ashwini natives are quick starters — fast to act, fast to heal, fast to help. Ruled by the celestial physicians, they carry a natural gift for fixing things: bodies, machines, situations. Youthful energy stays with them well into age.",
    traits_hi: "अश्विनी जातक तुरंत पहल करने वाले होते हैं — कार्य में तेज़, स्वस्थ होने में तेज़, सहायता में तेज़। देव-वैद्यों का यह नक्षत्र चीज़ें ठीक करने की सहज प्रतिभा देता है। युवा-ऊर्जा आयु भर साथ रहती है।",
    careers: ["Medicine & healing", "Emergency services", "Sports & fitness", "Transport & automobiles"],
    watch_out: "Impatience — starting brilliantly but abandoning things midway.",
    watch_out_hi: "अधीरता — शानदार शुरुआत, पर बीच में छोड़ने की प्रवृत्ति।",
  },
  {
    slug: "bharani", index: 1, name: "Bharani", name_hi: "भरणी",
    lord: "Venus", lord_hi: "शुक्र", deity: "Yama (lord of dharma)", deity_hi: "यम (धर्मराज)",
    symbol: "Yoni (gateway of creation)", symbol_hi: "योनि (सृजन-द्वार)", gana: "Manushya", yoni: "Elephant", yoni_hi: "गज",
    span: "Aries 13°20' – 26°40'", span_hi: "मेष 13°20' – 26°40'",
    syllables: ["ली", "लू", "ले", "लो"],
    traits_en: "Bharani means 'she who bears' — natives carry heavy responsibilities gracefully and finish what they promise. Venus gives artistry and magnetism; Yama gives discipline and fearlessness about life's dark passages. Creation and duty fused in one person.",
    traits_hi: "भरणी का अर्थ है 'भरण करने वाली' — जातक बड़ी ज़िम्मेदारियाँ सहजता से उठाते और निभाते हैं। शुक्र कला और आकर्षण देता है; यम अनुशासन और निर्भीकता। सृजन और कर्तव्य का संगम।",
    careers: ["Arts & design", "Midwifery & childcare", "Publishing", "Justice & administration"],
    watch_out: "Taking on everyone's burdens until your own life gets postponed.",
    watch_out_hi: "सबका भार उठाते-उठाते अपना जीवन स्थगित कर देना।",
  },
  {
    slug: "krittika", index: 2, name: "Krittika", name_hi: "कृत्तिका",
    lord: "Sun", lord_hi: "सूर्य", deity: "Agni (fire)", deity_hi: "अग्नि",
    symbol: "Razor / flame", symbol_hi: "छुरा / अग्नि-शिखा", gana: "Rakshasa", yoni: "Goat", yoni_hi: "मेष (बकरा)",
    span: "Aries 26°40' – Taurus 10°00'", span_hi: "मेष 26°40' – वृषभ 10°00'",
    syllables: ["अ", "ई", "उ", "ए"],
    traits_en: "Krittika cuts through — pretence, laziness, confusion. Natives are sharp-tongued truth-tellers with a purifying fire: they burn away the false and nurture the genuine (this is also the star of Kartikeya's foster mothers). Leadership through standards, not charm.",
    traits_hi: "कृत्तिका काटती है — दिखावा, आलस्य, भ्रम। जातक स्पष्टवादी होते हैं; इनकी अग्नि झूठ को जलाती है और सच्चे को पोषती है (यह कार्तिकेय की पालनहार माताओं का नक्षत्र भी है)। नेतृत्व आकर्षण से नहीं, मानदंडों से।",
    careers: ["Military & police", "Cooking & food industry", "Criticism & editing", "Metallurgy & engineering"],
    watch_out: "The sharp tongue — the truth lands better when it doesn't burn.",
    watch_out_hi: "तीखी वाणी — सत्य तब बेहतर पहुँचता है जब वह जलाए नहीं।",
  },
  {
    slug: "rohini", index: 3, name: "Rohini", name_hi: "रोहिणी",
    lord: "Moon", lord_hi: "चंद्र", deity: "Brahma (the creator)", deity_hi: "ब्रह्मा (प्रजापति)",
    symbol: "Ox-cart / chariot", symbol_hi: "बैलगाड़ी / रथ", gana: "Manushya", yoni: "Serpent", yoni_hi: "सर्प",
    span: "Taurus 10°00' – 23°20'", span_hi: "वृषभ 10°00' – 23°20'",
    syllables: ["ओ", "वा", "वी", "वू"],
    traits_en: "The Moon's favourite wife — Rohini natives attract abundance, beauty and affection naturally. They grow things: gardens, businesses, families, wealth. Deeply sensual and artistic, with the patience of fertile soil. Material life flowers around them.",
    traits_hi: "चंद्रमा की प्रिय पत्नी — रोहिणी जातक समृद्धि, सौंदर्य और स्नेह सहज आकर्षित करते हैं। ये चीज़ें उगाते हैं: बाग़, व्यापार, परिवार, धन। कलात्मक और धैर्यवान — उपजाऊ मिट्टी जैसा स्वभाव।",
    careers: ["Agriculture & real estate", "Fashion & beauty", "Banking & finance", "Music & fine arts"],
    watch_out: "Possessiveness — of people, comfort and beautiful things.",
    watch_out_hi: "अधिकार-भाव — लोगों, सुख और सुंदर वस्तुओं पर।",
  },
  {
    slug: "mrigashira", index: 4, name: "Mrigashira", name_hi: "मृगशिरा",
    lord: "Mars", lord_hi: "मंगल", deity: "Soma (the Moon god)", deity_hi: "सोम (चंद्र देव)",
    symbol: "Deer's head", symbol_hi: "मृग-मुख", gana: "Deva", yoni: "Serpent", yoni_hi: "सर्प",
    span: "Taurus 23°20' – Gemini 6°40'", span_hi: "वृषभ 23°20' – मिथुन 6°40'",
    syllables: ["वे", "वो", "का", "की"],
    traits_en: "The seeker's star — Mrigashira natives are perpetual searchers: for knowledge, for the perfect partner, for the better place. Gentle and curious like the deer, restless like Mars. Excellent researchers and travellers; their life is a quest, not a settlement.",
    traits_hi: "खोजी का नक्षत्र — मृगशिरा जातक आजीवन खोजते हैं: ज्ञान, आदर्श साथी, बेहतर स्थान। मृग-सा कोमल और जिज्ञासु, मंगल-सा बेचैन। उत्तम शोधकर्ता और यात्री; इनका जीवन ठहराव नहीं, यात्रा है।",
    careers: ["Research & academia", "Travel & exploration", "Sales & communication", "Writing"],
    watch_out: "Restlessness — the search itself becoming an escape from arrival.",
    watch_out_hi: "बेचैनी — खोज स्वयं पहुँचने से बचने का बहाना न बन जाए।",
  },
  {
    slug: "ardra", index: 5, name: "Ardra", name_hi: "आर्द्रा",
    lord: "Rahu", lord_hi: "राहु", deity: "Rudra (the storm)", deity_hi: "रुद्र",
    symbol: "Teardrop", symbol_hi: "अश्रु-बिंदु", gana: "Manushya", yoni: "Dog", yoni_hi: "श्वान",
    span: "Gemini 6°40' – 20°00'", span_hi: "मिथुन 6°40' – 20°00'",
    syllables: ["कू", "घ", "ङ", "छ"],
    traits_en: "The storm that clears the air — Ardra natives transform through intensity. Brilliant, unconventional minds (Rahu in Mercury's sign) that thrive in chaos others flee: crisis management, cutting-edge technology, radical research. After their storms, things grow.",
    traits_hi: "हवा साफ़ करने वाला तूफ़ान — आर्द्रा जातक तीव्रता से रूपांतरित होते हैं। मेधावी, अपरंपरागत बुद्धि, जो उस अराजकता में खिलती है जिससे और भागते हैं: संकट-प्रबंधन, अत्याधुनिक तकनीक, मौलिक शोध।",
    careers: ["Technology & IT", "Crisis management", "Pharmacology & chemistry", "Investigative work"],
    watch_out: "Emotional storms — the intensity that transforms can also exhaust.",
    watch_out_hi: "भावनात्मक तूफ़ान — जो तीव्रता बदलती है, वही थका भी सकती है।",
  },
  {
    slug: "punarvasu", index: 6, name: "Punarvasu", name_hi: "पुनर्वसु",
    lord: "Jupiter", lord_hi: "गुरु", deity: "Aditi (mother of the gods)", deity_hi: "अदिति",
    symbol: "Bow and quiver", symbol_hi: "धनुष एवं तरकश", gana: "Deva", yoni: "Cat", yoni_hi: "मार्जार",
    span: "Gemini 20°00' – Cancer 3°20'", span_hi: "मिथुन 20°00' – कर्क 3°20'",
    syllables: ["के", "को", "हा", "ही"],
    traits_en: "'Return of the light' — Punarvasu natives rebuild. Losses that break others become their comebacks; like the arrow that returns to the quiver, they always find home again. Generous, philosophical, safe to be around. Rama was born under this star.",
    traits_hi: "'प्रकाश की वापसी' — पुनर्वसु जातक पुनर्निर्माण करते हैं। जो क्षति औरों को तोड़ती है, वह इनकी वापसी बनती है; तरकश में लौटते बाण की तरह ये सदा घर पा लेते हैं। उदार, दार्शनिक। श्रीराम का जन्म-नक्षत्र।",
    careers: ["Teaching & philosophy", "Import-export & logistics", "Counselling", "Hospitality"],
    watch_out: "Contentment sliding into complacency — the comeback gift needs a challenge.",
    watch_out_hi: "संतोष कहीं शिथिलता न बन जाए — वापसी की प्रतिभा को चुनौती चाहिए।",
  },
  {
    slug: "pushya", index: 7, name: "Pushya", name_hi: "पुष्य",
    lord: "Saturn", lord_hi: "शनि", deity: "Brihaspati (guru of the gods)", deity_hi: "बृहस्पति",
    symbol: "Cow's udder / lotus", symbol_hi: "गौ-स्तन / कमल", gana: "Deva", yoni: "Goat", yoni_hi: "मेष (बकरा)",
    span: "Cancer 3°20' – 16°40'", span_hi: "कर्क 3°20' – 16°40'",
    syllables: ["हू", "हे", "हो", "डा"],
    traits_en: "The most nourishing nakshatra — classical texts call Pushya the best of all 27 for almost everything except marriage ceremonies. Natives feed and support whatever they touch: institutions, families, students. Saturn's discipline plus Jupiter's benevolence — the reliable elder.",
    traits_hi: "सर्वाधिक पोषक नक्षत्र — शास्त्र पुष्य को (विवाह-संस्कार छोड़) लगभग हर कार्य के लिए 27 में श्रेष्ठ कहते हैं। जातक जो छूते हैं उसे पोषते हैं: संस्था, परिवार, शिष्य। शनि का अनुशासन + गुरु की सौम्यता — भरोसेमंद अभिभावक।",
    careers: ["Government & administration", "Teaching & mentorship", "Food & dairy", "Charitable institutions"],
    watch_out: "Being everyone's support while never asking for your own.",
    watch_out_hi: "सबका सहारा बनना — पर अपने लिए सहारा कभी न माँगना।",
  },
  {
    slug: "ashlesha", index: 8, name: "Ashlesha", name_hi: "आश्लेषा",
    lord: "Mercury", lord_hi: "बुध", deity: "Nagas (serpent deities)", deity_hi: "नाग",
    symbol: "Coiled serpent", symbol_hi: "कुंडलित सर्प", gana: "Rakshasa", yoni: "Cat", yoni_hi: "मार्जार",
    span: "Cancer 16°40' – 30°00'", span_hi: "कर्क 16°40' – 30°00'",
    syllables: ["डी", "डू", "डे", "डो"],
    traits_en: "The serpent's embrace — Ashlesha natives read people like open books and influence quietly, from within. Penetrating psychological insight, hypnotic persuasion, and access to hidden knowledge. In mature hands this is the healer-diplomat; the kundalini star.",
    traits_hi: "सर्प का आलिंगन — आश्लेषा जातक लोगों को खुली किताब-सा पढ़ते हैं और भीतर से, चुपचाप प्रभावित करते हैं। भेदक मनोवैज्ञानिक दृष्टि, सम्मोहक वाणी, गूढ़ ज्ञान तक पहुँच। परिपक्व हाथों में यही चिकित्सक-कूटनीतिज्ञ है।",
    careers: ["Psychology & therapy", "Politics & negotiation", "Occult sciences", "Pharmacology & toxicology"],
    watch_out: "Manipulation — the gift of influence must serve, not entangle.",
    watch_out_hi: "छल-प्रवृत्ति — प्रभाव की शक्ति सेवा करे, जकड़े नहीं।",
  },
  {
    slug: "magha", index: 9, name: "Magha", name_hi: "मघा",
    lord: "Ketu", lord_hi: "केतु", deity: "Pitris (the ancestors)", deity_hi: "पितर",
    symbol: "Royal throne", symbol_hi: "राज-सिंहासन", gana: "Rakshasa", yoni: "Rat", yoni_hi: "मूषक",
    span: "Leo 0°00' – 13°20'", span_hi: "सिंह 0°00' – 13°20'",
    syllables: ["मा", "मी", "मू", "मे"],
    traits_en: "The royal star — Magha natives carry inherited authority: people simply treat them as the one in charge. Deep bonds with lineage and tradition; ancestral blessings are their real capital. Dignity matters to them more than money.",
    traits_hi: "राज-नक्षत्र — मघा जातक जन्मजात अधिकार-चेतना लेकर आते हैं: लोग इन्हें स्वयं ही अगुआ मान लेते हैं। वंश-परंपरा से गहरा नाता; पितृ-आशीर्वाद इनकी असली पूँजी। सम्मान इनके लिए धन से बड़ी मुद्रा है।",
    careers: ["Leadership & management", "Politics & public office", "Heritage & history", "Family business"],
    watch_out: "Pride — the throne serves best when held lightly.",
    watch_out_hi: "अभिमान — सिंहासन सबसे अच्छा तब निभता है जब हल्के हाथ से थामा जाए।",
  },
  {
    slug: "purva-phalguni", index: 10, name: "Purva Phalguni", name_hi: "पूर्व फाल्गुनी",
    lord: "Venus", lord_hi: "शुक्र", deity: "Bhaga (god of fortune & enjoyment)", deity_hi: "भग",
    symbol: "Front legs of the cot", symbol_hi: "शय्या के अगले पाए", gana: "Manushya", yoni: "Rat", yoni_hi: "मूषक",
    span: "Leo 13°20' – 26°40'", span_hi: "सिंह 13°20' – 26°40'",
    syllables: ["मो", "टा", "टी", "टू"],
    traits_en: "The star of celebration — Purva Phalguni natives bring warmth, romance and festivity wherever they go. Natural performers and hosts; they understand that rest and pleasure are not laziness but the renewal that makes work possible.",
    traits_hi: "उत्सव का नक्षत्र — पूर्व फाल्गुनी जातक जहाँ जाते हैं, उष्णता, प्रेम और उल्लास साथ ले जाते हैं। जन्मजात कलाकार और आतिथ्य-कुशल; ये जानते हैं कि विश्राम आलस्य नहीं, कार्य-शक्ति का नवीनीकरण है।",
    careers: ["Entertainment & performing arts", "Event management", "Luxury & hospitality", "Creative direction"],
    watch_out: "Comfort-seeking — the festival is sweeter after the work is done.",
    watch_out_hi: "सुख-लिप्सा — उत्सव तभी मीठा है जब काम पूरा हो चुका हो।",
  },
  {
    slug: "uttara-phalguni", index: 11, name: "Uttara Phalguni", name_hi: "उत्तर फाल्गुनी",
    lord: "Sun", lord_hi: "सूर्य", deity: "Aryaman (god of contracts & patronage)", deity_hi: "अर्यमा",
    symbol: "Back legs of the cot", symbol_hi: "शय्या के पिछले पाए", gana: "Manushya", yoni: "Cow", yoni_hi: "गौ",
    span: "Leo 26°40' – Virgo 10°00'", span_hi: "सिंह 26°40' – कन्या 10°00'",
    syllables: ["टे", "टो", "पा", "पी"],
    traits_en: "The star of the kept promise — where Purva celebrates, Uttara commits. These natives are the friends who actually show up, the partners institutions are built on. Patronage flows to them because they can be trusted with it.",
    traits_hi: "निभाए गए वचन का नक्षत्र — जहाँ पूर्व उत्सव मनाती है, उत्तर प्रतिबद्ध होती है। ये वे मित्र हैं जो सचमुच काम आते हैं, वे साथी जिन पर संस्थाएँ खड़ी होती हैं। संरक्षण इन्हें इसीलिए मिलता है क्योंकि ये उसके योग्य होते हैं।",
    careers: ["Social work & philanthropy", "Contracts & law", "Human resources", "Long-term institution building"],
    watch_out: "Over-commitment — a promise-keeper must guard what they promise.",
    watch_out_hi: "अति-प्रतिबद्धता — वचन निभाने वाले को वचन देने में सतर्क रहना चाहिए।",
  },
  {
    slug: "hasta", index: 12, name: "Hasta", name_hi: "हस्त",
    lord: "Moon", lord_hi: "चंद्र", deity: "Savitar (the sun as inspirer)", deity_hi: "सविता",
    symbol: "The hand", symbol_hi: "हथेली", gana: "Deva", yoni: "Buffalo", yoni_hi: "महिष",
    span: "Virgo 10°00' – 23°20'", span_hi: "कन्या 10°00' – 23°20'",
    syllables: ["पू", "ष", "ण", "ठ"],
    traits_en: "Skill lives in their hands — Hasta natives make, mend, heal and craft. Whatever they touch gets more organised and more beautiful. Wit is quick, service is sincere; they win trust through competence rather than talk.",
    traits_hi: "कौशल इनकी हथेली में बसता है — हस्त जातक बनाते, सुधारते, सँवारते हैं। जो छूते हैं वह अधिक व्यवस्थित और सुंदर हो जाता है। बुद्धि तेज़, सेवा सच्ची; भरोसा बातों से नहीं, दक्षता से जीतते हैं।",
    careers: ["Handicrafts & surgery", "Astrology & palmistry", "Accounting & analysis", "Healing arts"],
    watch_out: "Perfectionism — done and good beats perfect and pending.",
    watch_out_hi: "पूर्णतावाद — 'पूर्ण पर लंबित' से 'संपन्न और अच्छा' बेहतर है।",
  },
  {
    slug: "chitra", index: 13, name: "Chitra", name_hi: "चित्रा",
    lord: "Mars", lord_hi: "मंगल", deity: "Tvashtar / Vishwakarma (celestial architect)", deity_hi: "त्वष्टा / विश्वकर्मा",
    symbol: "A shining jewel", symbol_hi: "चमकता रत्न", gana: "Rakshasa", yoni: "Tiger", yoni_hi: "व्याघ्र",
    span: "Virgo 23°20' – Libra 6°40'", span_hi: "कन्या 23°20' – तुला 6°40'",
    syllables: ["पे", "पो", "रा", "री"],
    traits_en: "The architect's star — Chitra natives design dazzling things: buildings, brands, images, lives. A magnetic presence with an engineer's mind underneath. They see the finished structure where others see raw material.",
    traits_hi: "शिल्पी का नक्षत्र — चित्रा जातक चकाचौंध रचते हैं: भवन, ब्रांड, छवियाँ, जीवन। आकर्षक व्यक्तित्व के भीतर अभियंता की बुद्धि। जहाँ और कच्चा माल देखते हैं, वहाँ ये बना हुआ ढाँचा देख लेते हैं।",
    careers: ["Architecture & design", "Photography & media", "Jewellery & fashion", "Civil engineering"],
    watch_out: "The glitter trap — building for applause instead of for truth.",
    watch_out_hi: "चमक का मोह — रचना तालियों के लिए नहीं, सत्य के लिए हो।",
  },
  {
    slug: "swati", index: 14, name: "Swati", name_hi: "स्वाति",
    lord: "Rahu", lord_hi: "राहु", deity: "Vayu (the wind)", deity_hi: "वायु",
    symbol: "Young shoot swaying in wind", symbol_hi: "पवन में झूलता नव-अंकुर", gana: "Deva", yoni: "Buffalo", yoni_hi: "महिष",
    span: "Libra 6°40' – 20°00'", span_hi: "तुला 6°40' – 20°00'",
    syllables: ["रू", "रे", "रो", "ता"],
    traits_en: "Independence is the breath of Swati natives — like the young plant in wind, they bend without breaking and grow wherever they land. Superb in business and diplomacy: flexible, self-made, restless until financially free.",
    traits_hi: "स्वतंत्रता स्वाति जातकों की साँस है — पवन में नव-अंकुर की तरह झुकते हैं पर टूटते नहीं, और जहाँ गिरते हैं वहीं उग आते हैं। व्यापार और कूटनीति में श्रेष्ठ: लचीले, स्वनिर्मित, आर्थिक स्वतंत्रता तक बेचैन।",
    careers: ["Independent business", "Trade & commerce", "Diplomacy & PR", "Aviation & logistics"],
    watch_out: "Rootlessness — flexibility without an anchor becomes drift.",
    watch_out_hi: "जड़हीनता — बिना आधार का लचीलापन बहाव बन जाता है।",
  },
  {
    slug: "vishakha", index: 15, name: "Vishakha", name_hi: "विशाखा",
    lord: "Jupiter", lord_hi: "गुरु", deity: "Indra-Agni (power and fire together)", deity_hi: "इंद्राग्नि",
    symbol: "Triumphal archway", symbol_hi: "तोरण-द्वार (विजय-द्वार)", gana: "Rakshasa", yoni: "Tiger", yoni_hi: "व्याघ्र",
    span: "Libra 20°00' – Scorpio 3°20'", span_hi: "तुला 20°00' – वृश्चिक 3°20'",
    syllables: ["ती", "तू", "ते", "तो"],
    traits_en: "The star of focused victory — Vishakha natives fix their eyes on the archway and march. Single-pointed ambition powered by both authority (Indra) and fire (Agni). They achieve what they chase; choosing what to chase is the real test.",
    traits_hi: "लक्ष्य-विजय का नक्षत्र — विशाखा जातक विजय-द्वार पर दृष्टि गड़ाकर चलते हैं। इंद्र का अधिकार और अग्नि का ताप — दोनों से चालित एकाग्र महत्वाकांक्षा। जो ठान लें वह पा लेते हैं; असली परीक्षा है क्या ठानना।",
    careers: ["Goal-driven leadership", "Law & advocacy", "Competitive fields", "Religious oratory"],
    watch_out: "Tunnel vision — the archway matters, but so does who walks beside you.",
    watch_out_hi: "एकांगी दृष्टि — लक्ष्य महत्वपूर्ण है, पर साथ चलने वाले भी।",
  },
  {
    slug: "anuradha", index: 16, name: "Anuradha", name_hi: "अनुराधा",
    lord: "Saturn", lord_hi: "शनि", deity: "Mitra (god of friendship)", deity_hi: "मित्र",
    symbol: "Lotus / staff", symbol_hi: "कमल / दंड", gana: "Deva", yoni: "Deer", yoni_hi: "मृग",
    span: "Scorpio 3°20' – 16°40'", span_hi: "वृश्चिक 3°20' – 16°40'",
    syllables: ["ना", "नी", "नू", "ने"],
    traits_en: "The lotus in difficult water — Anuradha natives bloom in circumstances that wilt others. Their genius is friendship and devotion: they build bridges between opposites and stay loyal across decades and distances. Success comes away from the birthplace.",
    traits_hi: "कठिन जल का कमल — अनुराधा जातक वहाँ खिलते हैं जहाँ और मुरझा जाते हैं। मैत्री और भक्ति इनकी प्रतिभा है: विपरीत ध्रुवों में सेतु बनाते हैं और दशकों-दूरियों तक निष्ठा निभाते हैं। सफलता जन्मस्थान से दूर मिलती है।",
    careers: ["International relations", "Organisational leadership", "Devotional & spiritual paths", "Data & statistics"],
    watch_out: "Loyalty to the undeserving — the bridge-builder must choose shores wisely.",
    watch_out_hi: "अपात्र के प्रति निष्ठा — सेतु बनाने वाले को किनारे सोच-समझकर चुनने चाहिए।",
  },
  {
    slug: "jyeshtha", index: 17, name: "Jyeshtha", name_hi: "ज्येष्ठा",
    lord: "Mercury", lord_hi: "बुध", deity: "Indra (king of the gods)", deity_hi: "इंद्र",
    symbol: "Earring / umbrella (royal insignia)", symbol_hi: "कुंडल / छत्र", gana: "Rakshasa", yoni: "Deer", yoni_hi: "मृग",
    span: "Scorpio 16°40' – 30°00'", span_hi: "वृश्चिक 16°40' – 30°00'",
    syllables: ["नो", "या", "यी", "यू"],
    traits_en: "'The eldest' — Jyeshtha natives are handed responsibility early and carry the protector's burden all their lives. Sharp strategic minds (Mercury) with a ruler's instincts (Indra). They defend the vulnerable and secretly wish someone would guard them too.",
    traits_hi: "'ज्येष्ठ' — इन जातकों को ज़िम्मेदारी जल्दी मिलती है और रक्षक का भार आजीवन रहता है। बुध की रणनीतिक बुद्धि, इंद्र का शासक-स्वभाव। दुर्बल की रक्षा करते हैं — और भीतर ही भीतर चाहते हैं कि कोई इनकी भी रक्षा करे।",
    careers: ["Senior management", "Defence & security", "Strategy & intelligence", "Eldest-child family roles"],
    watch_out: "The bitterness of the unthanked protector — serve, then release.",
    watch_out_hi: "बिना धन्यवाद के रक्षक की कड़वाहट — सेवा करें, फिर मुक्त हो जाएँ।",
  },
  {
    slug: "mula", index: 18, name: "Mula", name_hi: "मूल",
    lord: "Ketu", lord_hi: "केतु", deity: "Nirriti (goddess of dissolution)", deity_hi: "निऋति",
    symbol: "Bunch of roots", symbol_hi: "जड़ों का गुच्छ", gana: "Rakshasa", yoni: "Dog", yoni_hi: "श्वान",
    span: "Sagittarius 0°00' – 13°20'", span_hi: "धनु 0°00' – 13°20'",
    syllables: ["ये", "यो", "भा", "भी"],
    traits_en: "The root-digger — Mula natives cannot accept surface answers; they must pull the whole plant and see the roots. This makes them fearless investigators, healers of root causes, and philosophers. Life often rebuilds them from the foundation once — and they emerge unshakeable.",
    traits_hi: "जड़ खोदने वाला — मूल जातक सतही उत्तर स्वीकार नहीं कर पाते; पूरा पौधा उखाड़कर जड़ देखना इनका स्वभाव है। इसीलिए ये निर्भीक अन्वेषक, मूल-कारण के चिकित्सक और दार्शनिक बनते हैं। जीवन प्रायः एक बार इन्हें नींव से पुनर्निर्मित करता है — और ये अडिग होकर निकलते हैं।",
    careers: ["Root-cause research", "Medicine & pharmacology", "Philosophy & spirituality", "Demolition & restructuring"],
    watch_out: "Uprooting what needed only pruning.",
    watch_out_hi: "जहाँ छँटाई पर्याप्त थी, वहाँ उखाड़ न दें।",
  },
  {
    slug: "purva-ashadha", index: 19, name: "Purva Ashadha", name_hi: "पूर्वाषाढ़ा",
    lord: "Venus", lord_hi: "शुक्र", deity: "Apas (the cosmic waters)", deity_hi: "अपस् (जल)",
    symbol: "Winnowing fan", symbol_hi: "सूप (छाजन)", gana: "Manushya", yoni: "Monkey", yoni_hi: "वानर",
    span: "Sagittarius 13°20' – 26°40'", span_hi: "धनु 13°20' – 26°40'",
    syllables: ["भू", "धा", "फा", "ढा"],
    traits_en: "The invincible wave — Purva Ashadha natives carry an early, unshakeable conviction that they cannot finally be defeated. Like water, they find the way around every rock. Persuasive, purifying (the winnowing fan separates grain from chaff), buoyant in spirit.",
    traits_hi: "अजेय लहर — पूर्वाषाढ़ा जातकों में यह अटल विश्वास जन्मजात होता है कि अंततः इन्हें हराया नहीं जा सकता। जल की तरह हर चट्टान का रास्ता निकाल लेते हैं। प्रभावशाली वक्ता; सूप की तरह सार को थोथे से अलग करने वाले।",
    careers: ["Motivational speaking & debate", "Shipping & water industries", "Marketing", "Refining & purification fields"],
    watch_out: "Overconfidence — even water respects the shape of the land.",
    watch_out_hi: "अति-आत्मविश्वास — जल भी भूमि के आकार का सम्मान करता है।",
  },
  {
    slug: "uttara-ashadha", index: 20, name: "Uttara Ashadha", name_hi: "उत्तराषाढ़ा",
    lord: "Sun", lord_hi: "सूर्य", deity: "Vishvedevas (universal gods)", deity_hi: "विश्वेदेव",
    symbol: "Elephant's tusk", symbol_hi: "गज-दंत", gana: "Manushya", yoni: "Mongoose", yoni_hi: "नकुल",
    span: "Sagittarius 26°40' – Capricorn 10°00'", span_hi: "धनु 26°40' – मकर 10°00'",
    syllables: ["भे", "भो", "जा", "जी"],
    traits_en: "The star of final victory — where Purva Ashadha wins battles, Uttara Ashadha wins wars. Natives commit late but then irreversibly, like the elephant's tusk that never retracts. Universal in outlook, ethical in method: their victories last because they were won cleanly.",
    traits_hi: "अंतिम विजय का नक्षत्र — पूर्वाषाढ़ा युद्ध जीतती है, उत्तराषाढ़ा संग्राम। जातक देर से संकल्प लेते हैं, पर फिर गज-दंत की तरह अटल। दृष्टि सार्वभौम, विधि नैतिक: इनकी जीत टिकती है क्योंकि साफ़ ढंग से जीती जाती है।",
    careers: ["Public service & governance", "Long-horizon leadership", "Ethics & judiciary", "Institution founding"],
    watch_out: "Slowness to start — the tusk grows once, so aim before it sets.",
    watch_out_hi: "आरम्भ में विलम्ब — गज-दंत एक बार उगता है, अतः दिशा पहले साध लें।",
  },
  {
    slug: "shravana", index: 21, name: "Shravana", name_hi: "श्रवण",
    lord: "Moon", lord_hi: "चंद्र", deity: "Vishnu (the preserver)", deity_hi: "विष्णु",
    symbol: "The ear / three footprints", symbol_hi: "कर्ण / तीन पद-चिह्न", gana: "Deva", yoni: "Monkey", yoni_hi: "वानर",
    span: "Capricorn 10°00' – 23°20'", span_hi: "मकर 10°00' – 23°20'",
    syllables: ["खी", "खू", "खे", "खो"],
    traits_en: "The listening star — Shravana natives learn everything by ear: languages, secrets, wisdom, music. They are the keepers and connectors of knowledge, trusted with confidences because they truly hear. Vishnu's three steps hint at their quiet, span-everything reach.",
    traits_hi: "श्रवण का नक्षत्र — ये जातक कान से सीखते हैं: भाषाएँ, रहस्य, ज्ञान, संगीत। ज्ञान के संरक्षक और संयोजक; लोग इन्हें मन की बात इसलिए कहते हैं क्योंकि ये सचमुच सुनते हैं। विष्णु के तीन पग इनकी शांत, सर्वव्यापी पहुँच का संकेत हैं।",
    careers: ["Education & languages", "Media & podcasting", "Counselling", "Classical music"],
    watch_out: "Absorbing everyone's words until your own voice waits too long.",
    watch_out_hi: "सबकी सुनते-सुनते अपनी वाणी की बारी टलती न जाए।",
  },
  {
    slug: "dhanishtha", index: 22, name: "Dhanishtha", name_hi: "धनिष्ठा",
    lord: "Mars", lord_hi: "मंगल", deity: "Ashta Vasus (eight gods of abundance)", deity_hi: "अष्ट वसु",
    symbol: "Damaru (drum)", symbol_hi: "डमरू", gana: "Rakshasa", yoni: "Lion", yoni_hi: "सिंह",
    span: "Capricorn 23°20' – Aquarius 6°40'", span_hi: "मकर 23°20' – कुम्भ 6°40'",
    syllables: ["गा", "गी", "गू", "गे"],
    traits_en: "The drum of prosperity — Dhanishtha natives have rhythm: in music, in money, in timing. The 'wealthiest star' grants material success through group endeavours and perfect timing. Hollow like the drum, they resonate best when ego steps aside.",
    traits_hi: "समृद्धि का डमरू — धनिष्ठा जातकों में लय होती है: संगीत में, धन में, समय-चयन में। 'धनी नक्षत्र' सामूहिक उद्यम और सटीक समय से भौतिक सफलता देता है। डमरू की तरह भीतर से रिक्त होने पर ही सर्वोत्तम गूँजते हैं।",
    careers: ["Music & percussion", "Real estate & wealth management", "Team leadership", "Sports"],
    watch_out: "Marital-harmony needs conscious effort — prosperity outside, patience inside.",
    watch_out_hi: "दाम्पत्य-सामंजस्य सचेत प्रयास माँगता है — बाहर समृद्धि, भीतर धैर्य।",
  },
  {
    slug: "shatabhisha", index: 23, name: "Shatabhisha", name_hi: "शतभिषा",
    lord: "Rahu", lord_hi: "राहु", deity: "Varuna (lord of cosmic waters)", deity_hi: "वरुण",
    symbol: "Empty circle / hundred healers", symbol_hi: "रिक्त वृत्त / सौ वैद्य", gana: "Rakshasa", yoni: "Horse", yoni_hi: "अश्व",
    span: "Aquarius 6°40' – 20°00'", span_hi: "कुम्भ 6°40' – 20°00'",
    syllables: ["गो", "सा", "सी", "सू"],
    traits_en: "'Requiring a hundred physicians' — Shatabhisha natives are the mystery that heals mysteries. Secretive, scientific, drawn to what hides behind veils: rare diseases, deep code, the occult, the ocean. Solitude is their laboratory.",
    traits_hi: "'सौ वैद्यों वाला' — शतभिषा जातक स्वयं रहस्य हैं जो रहस्यों की चिकित्सा करते हैं। गोपनीय, वैज्ञानिक, परदे के पीछे छिपे की ओर आकर्षित: दुर्लभ रोग, गूढ़ तकनीक, गुप्त विद्या, समुद्र। एकांत इनकी प्रयोगशाला है।",
    careers: ["Research & rare medicine", "Technology & cryptography", "Astronomy & astrology", "Marine sciences"],
    watch_out: "Isolation — the healer of hundreds must let one or two heal them.",
    watch_out_hi: "एकाकीपन — सौ के वैद्य को एक-दो को अपना वैद्य बनने देना चाहिए।",
  },
  {
    slug: "purva-bhadrapada", index: 24, name: "Purva Bhadrapada", name_hi: "पूर्व भाद्रपद",
    lord: "Jupiter", lord_hi: "गुरु", deity: "Aja Ekapada (one-footed serpent of fire)", deity_hi: "अज एकपाद",
    symbol: "Front of the funeral cot / two-faced man", symbol_hi: "अंत्य-शय्या का अग्रभाग", gana: "Manushya", yoni: "Lion", yoni_hi: "सिंह",
    span: "Aquarius 20°00' – Pisces 3°20'", span_hi: "कुम्भ 20°00' – मीन 3°20'",
    syllables: ["से", "सो", "दा", "दी"],
    traits_en: "The fire ascetic — Purva Bhadrapada natives live between two worlds: worldly skill and other-worldly longing. Intense, idealistic, willing to burn comfort for a cause. At their best they are transformers of society; the two faces must learn to face the same direction.",
    traits_hi: "अग्नि-तपस्वी — पूर्व भाद्रपद जातक दो लोकों के बीच जीते हैं: सांसारिक दक्षता और पारलौकिक प्यास। तीव्र, आदर्शवादी, ध्येय के लिए सुख जलाने को तत्पर। श्रेष्ठ रूप में समाज के रूपांतरक; बस दोनों मुखों को एक दिशा देखनी सीखनी होती है।",
    careers: ["Reform & activism", "Metaphysics & philosophy", "Funeral & end-of-life services", "Radical research"],
    watch_out: "Inner conflict — intensity without integration scorches its own house.",
    watch_out_hi: "आंतरिक द्वंद्व — बिना समन्वय की तीव्रता अपना ही घर झुलसाती है।",
  },
  {
    slug: "uttara-bhadrapada", index: 25, name: "Uttara Bhadrapada", name_hi: "उत्तर भाद्रपद",
    lord: "Saturn", lord_hi: "शनि", deity: "Ahirbudhnya (serpent of the deep)", deity_hi: "अहिर्बुध्न्य",
    symbol: "Back of the funeral cot / serpent of the depths", symbol_hi: "अंत्य-शय्या का पृष्ठभाग", gana: "Manushya", yoni: "Cow", yoni_hi: "गौ",
    span: "Pisces 3°20' – 16°40'", span_hi: "मीन 3°20' – 16°40'",
    syllables: ["दू", "थ", "झ", "ञ"],
    traits_en: "The deep still water — Uttara Bhadrapada natives possess a rare, mature calm that steadies whole households. Wisdom rises from their depths slowly and surely; anger is nearly impossible to provoke, and their blessings compound over decades like Saturn's interest.",
    traits_hi: "गहरा शांत जल — उत्तर भाद्रपद जातकों में वह दुर्लभ, परिपक्व स्थिरता होती है जो पूरे घर को थाम लेती है। ज्ञान इनकी गहराई से धीरे और निश्चित उठता है; क्रोध दिलाना लगभग असंभव, और इनका पुण्य शनि के ब्याज-सा दशकों में बढ़ता है।",
    careers: ["Spiritual counselling", "Long-term investing", "Charitable trusts", "Depth psychology"],
    watch_out: "Passivity mistaken for peace — stillness should be a choice, not an escape.",
    watch_out_hi: "निष्क्रियता को शांति न समझें — स्थिरता चुनाव हो, पलायन नहीं।",
  },
  {
    slug: "revati", index: 26, name: "Revati", name_hi: "रेवती",
    lord: "Mercury", lord_hi: "बुध", deity: "Pushan (nourisher, guide of journeys)", deity_hi: "पूषा",
    symbol: "Fish swimming in the sea", symbol_hi: "समुद्र में मछली", gana: "Deva", yoni: "Elephant", yoni_hi: "गज",
    span: "Pisces 16°40' – 30°00'", span_hi: "मीन 16°40' – 30°00'",
    syllables: ["दे", "दो", "चा", "ची"],
    traits_en: "The final nakshatra — Revati natives are the safe harbour at the end of every road. Gentle guides who nourish travellers, animals, orphans and lost causes to their destinations. Prosperity flows to them because they are trusted with everyone's journey.",
    traits_hi: "अंतिम नक्षत्र — रेवती जातक हर मार्ग के अंत का सुरक्षित घाट हैं। कोमल मार्गदर्शक, जो यात्रियों, जीवों और भटके हुओं को उनकी मंज़िल तक पोषते हैं। समृद्धि इनके पास इसलिए आती है क्योंकि सबकी यात्रा का भरोसा इन्हें सौंपा जाता है।",
    careers: ["Guidance & mentorship", "Animal care & veterinary", "Travel & pilgrimage services", "Charity & rehabilitation"],
    watch_out: "Giving the map away so often that your own journey waits.",
    watch_out_hi: "दूसरों को राह दिखाते-दिखाते अपनी यात्रा स्थगित न हो।",
  },
];

const SIGNS_EN = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];
const SIGNS_HI = ["मेष","वृषभ","मिथुन","कर्क","सिंह","कन्या","तुला","वृश्चिक","धनु","मकर","कुम्भ","मीन"];

/** Navamsa sign of a given pada — computed, never stored. */
export function padaNavamsa(nakshatraIndex: number, pada: number): { en: string; hi: string } {
  const idx = (nakshatraIndex * 4 + (pada - 1)) % 12;
  return { en: SIGNS_EN[idx], hi: SIGNS_HI[idx] };
}

export function getNakshatra(slug: string): NakshatraInfo | undefined {
  return NAKSHATRAS.find((n) => n.slug === slug);
}

/** Map an API nakshatra name ("Purva Phalguni") to its page slug. */
export function nakshatraSlugFromName(name: string): string | undefined {
  const norm = name.trim().toLowerCase().replace(/\s+/g, "-");
  return NAKSHATRAS.find((n) => n.slug === norm)?.slug;
}
