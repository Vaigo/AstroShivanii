/** तुरंत उत्तर — content bank for the ₹149 quick-take answer feature.
 *  No AI anywhere: every line below is hand-written, selected by real
 *  computed chart facts (see turant-uttar-engine.ts). Tiers 1-4 run
 *  Favorable → Neutral → Challenging → Needs Patience. This is a first
 *  draft for Shivanii to review/correct — the astrological logic (which
 *  house/planet governs each category) is a reasonable starting point,
 *  not a final classical authority. */

import { IconName } from "@/components/Icon";

export type CategoryKey =
  | "love" | "breakup" | "marriage" | "career" | "govtJob"
  | "finance" | "health" | "children" | "foreign";

export type Tier = 1 | 2 | 3 | 4;

export interface Bilingual { en: string; hi: string; }

export interface CategoryDef {
  key: CategoryKey;
  icon: IconName;
  chip: Bilingual;
  /** Alt phrasings shown as hint chips + used to match free-typed questions. */
  alts: Bilingual[];
  /** Lowercase keywords (Hindi + English + Hinglish) used to route a
   *  free-typed custom question to this category. No AI — plain matching. */
  keywords: string[];
}

export const CATEGORIES: CategoryDef[] = [
  {
    key: "love", icon: "heart",
    chip: { en: "Will my relationship last?", hi: "क्या मेरा रिश्ता टिकेगा?" },
    alts: [
      { en: "When will I find true love?", hi: "मुझे सच्चा प्यार कब मिलेगा?" },
      { en: "Is this person right for me?", hi: "क्या यह व्यक्ति मेरे लिए सही है?" },
      { en: "How do I improve this relationship?", hi: "हमारे रिश्ते में सुधार कैसे लाऊं?" },
    ],
    keywords: ["love", "girlfriend", "boyfriend", "gf", "bf", "partner", "pyar", "प्यार", "रिश्ता", "relationship"],
  },
  {
    key: "breakup", icon: "droplet",
    chip: { en: "Will my ex come back?", hi: "क्या मेरा एक्स वापस आएगा?" },
    alts: [
      { en: "Why did this breakup happen?", hi: "यह ब्रेकअप क्यों हुआ?" },
      { en: "How long to heal from this?", hi: "इस दर्द से उबरने में कितना समय लगेगा?" },
    ],
    keywords: ["ex", "breakup", "break up", "wapas", "वापस आएगा", "ब्रेकअप", "separation", "alag"],
  },
  {
    key: "marriage", icon: "rings",
    chip: { en: "When will I get married?", hi: "मेरी शादी कब होगी?" },
    alts: [
      { en: "Love or arranged marriage?", hi: "लव मैरिज होगी या अरेंज्ड?" },
      { en: "Will I marry the person I love?", hi: "क्या जिससे प्यार करता/करती हूं उसी से शादी होगी?" },
    ],
    keywords: ["marriage", "shaadi", "शादी", "vivah", "विवाह", "wedding"],
  },
  {
    key: "career", icon: "briefcase",
    chip: { en: "When will I get a new job?", hi: "मुझे नई नौकरी कब मिलेगी?" },
    alts: [
      { en: "How long until my job comes through?", hi: "मेरी जॉब कब तक लगेगी?" },
      { en: "Will I get promoted?", hi: "क्या मुझे प्रमोशन मिलेगा?" },
      { en: "Should I change my job?", hi: "नौकरी बदलनी चाहिए या नहीं?" },
      { en: "What career suits me best?", hi: "मेरे लिए कौन सा करियर सही है?" },
    ],
    keywords: ["job", "career", "naukri", "नौकरी", "जॉब", "करियर", "kab tak lagegi", "कब तक लगेगी", "promotion", "business", "kaam"],
  },
  {
    key: "govtJob", icon: "compass",
    chip: { en: "Government job or private sector?", hi: "सरकारी नौकरी लगेगी या प्राइवेट?" },
    alts: [
      { en: "Will I get a government job?", hi: "क्या मुझे सरकारी नौकरी मिलेगी?" },
    ],
    keywords: ["government job", "govt job", "sarkari", "सरकारी", "private job", "प्राइवेट", "sarkari naukri", "government naukri"],
  },
  {
    key: "finance", icon: "gem",
    chip: { en: "When will my finances improve?", hi: "मेरी आर्थिक स्थिति कब सुधरेगी?" },
    alts: [
      { en: "Is this investment/business favorable?", hi: "क्या यह निवेश/व्यापार शुभ है?" },
      { en: "When will I be free of debt?", hi: "कर्ज़ से मुक्ति कब मिलेगी?" },
    ],
    keywords: ["money", "paisa", "पैसा", "धन", "finance", "loan", "karza", "कर्ज़", "investment", "nivesh"],
  },
  {
    key: "health", icon: "shield",
    chip: { en: "What should I watch out for, health-wise?", hi: "स्वास्थ्य को लेकर मुझे किस बात का ध्यान रखना चाहिए?" },
    alts: [
      { en: "How long will this stress/health issue last?", hi: "यह तनाव/परेशानी कब तक रहेगी?" },
    ],
    keywords: ["health", "sehat", "सेहत", "स्वास्थ्य", "bimari", "बीमारी", "tension", "stress"],
  },
  {
    key: "children", icon: "sparkle",
    chip: { en: "When will I be blessed with children?", hi: "संतान सुख कब मिलेगा?" },
    alts: [
      { en: "Why the delay in having children?", hi: "संतान सुख में देरी क्यों हो रही है?" },
      { en: "How many children will I have?", hi: "मेरे कितने बच्चे होंगे?" },
      { en: "What's the general nature of my children?", hi: "मेरी संतान का सामान्य स्वभाव कैसा होगा?" },
    ],
    keywords: ["child", "children", "bacche", "बच्चे", "संतान", "pregnancy", "santan", "kids"],
  },
  {
    key: "foreign", icon: "globe",
    chip: { en: "Do I have foreign settlement in my chart?", hi: "क्या विदेश जाने का योग है?" },
    alts: [
      { en: "When is the right time to go abroad for studies?", hi: "उच्च शिक्षा के लिए विदेश जाने का सही समय कब है?" },
    ],
    keywords: ["foreign", "abroad", "videsh", "विदेश", "visa", "settlement", "study abroad"],
  },
];

/** Free-typed questions that match no keyword fall back to "career" — its
 *  10th-house/general-direction computation is the most neutral stand-in. */
export const FALLBACK_CATEGORY: CategoryKey = "career";

interface TierContent {
  teaser: Bilingual;
  answer: Bilingual;
  remedy?: Bilingual;
}

export const CONTENT: Record<CategoryKey, Record<Tier, TierContent>> = {
  love: {
    1: {
      teaser: { en: "Both Venus and your 7th lord sit favorably in your chart — good timing to be asking this.", hi: "आपकी कुंडली में शुक्र और सप्तमेश दोनों अनुकूल स्थिति में हैं — यह प्रश्न पूछने का सही समय है।" },
      answer: { en: "Your 7th lord is strong and the current period connects directly to it — which is why relationship matters are moving with relative ease right now. It's a good window for emotional clarity and decisions.", hi: "आपका सप्तमेश बलवान है और वर्तमान दशा इसी से जुड़ी है — यही कारण है कि रिश्तों से जुड़े मामले अभी अपेक्षाकृत सहज ढंग से आगे बढ़ रहे हैं। यह भावनात्मक स्पष्टता और निर्णय लेने के लिए अच्छा समय है।" },
    },
    2: {
      teaser: { en: "Your chart shows mixed signals — some effort needed, but the possibility is real.", hi: "आपकी कुंडली मिश्रित संकेत दे रही है — कुछ मेहनत लगेगी, पर संभावना है।" },
      answer: { en: "Venus/your 7th lord sit in neutral dignity, and the current period has no direct link to them. It won't resolve on its own — but honest effort and clear communication can genuinely shift the direction.", hi: "शुक्र या सप्तमेश की स्थिति सामान्य है, और वर्तमान दशा का इनसे सीधा संबंध नहीं है। इसका अर्थ है कि रिश्ता अपने आप नहीं सुलझेगा — पर आपके प्रयास और स्पष्ट संवाद से दिशा बदल सकती है।" },
    },
    3: {
      teaser: { en: "Some obstacles are showing up right now — this isn't permanent.", hi: "इस समय कुछ बाधाएं दिख रही हैं — पर यह स्थायी नहीं है।" },
      answer: { en: "Your Venus or 7th lord is under pressure, and the current period isn't helping either. This may explain any recent misunderstanding or distance. It's a phase, not a permanent state — things shift as the dasha changes.", hi: "आपका शुक्र या सप्तमेश दबाव में है, और वर्तमान दशा भी इसमें सहायक नहीं है। यही कारण हो सकता है कि बात-चीत में गलतफहमी या दूरी महसूस हो रही हो। यह दौर स्थायी नहीं — दशा बदलने के साथ स्थिति बदलेगी।" },
      remedy: { en: "Donate white items on Fridays and chant the Venus mantra — avoid big decisions (like ending things) in haste during this period.", hi: "शुक्रवार को सफेद वस्तुएं दान करें और शुक्र मंत्र का जाप करें — जल्दबाज़ी में बड़े निर्णय (जैसे ब्रेकअप) लेने से बचें।" },
    },
    4: {
      teaser: { en: "Patience is genuinely needed right now — this phase won't last forever.", hi: "अभी धैर्य की सबसे अधिक ज़रूरत है — पर यह दौर हमेशा नहीं रहेगा।" },
      answer: { en: "Both Venus and your 7th lord are under pressure, and the current period is challenging too. This can be the hardest stretch of the year for relationships — but difficult doesn't mean over. It's a time for learning and strengthening.", hi: "शुक्र और सप्तमेश दोनों दबाव में हैं, और वर्तमान दशा भी चुनौतीपूर्ण है। यह रिश्तों के लिए वर्ष का सबसे कठिन दौर हो सकता है — लेकिन कठिन का अर्थ अंत नहीं। यह सीखने और मज़बूत होने का समय है।" },
      remedy: { en: "Offer water to Venus and the Moon regularly. Rather than a permanent decision during this phase, a detailed reading from Shivanii would serve you better.", hi: "नियमित रूप से शुक्र और चंद्र को जल अर्पित करें। इस दौर में कोई स्थायी निर्णय लेने के बजाय शिवानी जी से विस्तृत पाठन कराना बेहतर होगा।" },
    },
  },

  breakup: {
    1: {
      teaser: { en: "Planetary positions point toward favorable signs for reunion.", hi: "ग्रहों की स्थिति पुनर्मिलन के लिए अनुकूल संकेत दे रही है।" },
      answer: { en: "The current period connects to Venus/your 7th lord, which indicates yoga for reconciliation and reunion. If both sides are open, the coming months could matter.", hi: "वर्तमान दशा शुक्र या सप्तमेश से जुड़ी है, जो सुलह और पुनर्मिलन के योग दर्शाती है। यदि दोनों पक्ष खुले हैं, तो अगले कुछ महीने महत्वपूर्ण हो सकते हैं।" },
    },
    2: {
      teaser: { en: "The picture isn't clear yet — but it isn't closed either.", hi: "स्थिति अभी स्पष्ट नहीं — पर बंद नहीं हुई है।" },
      answer: { en: "There's no strong signal toward either reunion or a permanent end. This is a transition period — let it unfold naturally rather than forcing a direction.", hi: "कोई प्रबल संकेत पुनर्मिलन या स्थायी अंत की ओर नहीं है। यह एक संक्रमण काल है — जल्दबाज़ी में कोई रास्ता तय करने के बजाय समय को स्वाभाविक रूप से खुलने दें।" },
    },
    3: {
      teaser: { en: "The planets are pointing toward moving forward.", hi: "ग्रह इस समय आगे बढ़ने का संकेत दे रहे हैं।" },
      answer: { en: "The current period connects to your 6th/12th house, indicating separation and closure themes. This can be painful, but astrologically it often also marks the start of a new chapter.", hi: "वर्तमान दशा 6ठे या 12वें भाव से जुड़ी है, जो पृथकता और समापन का सूचक है। यह दर्दनाक हो सकता है, पर ज्योतिष की दृष्टि से यह अक्सर एक नए अध्याय की शुरुआत का संकेत भी होता है।" },
      remedy: { en: "Reciting Hanuman Chalisa on Tuesdays helps keep the mind steady. Decide from clarity, not from raw emotion.", hi: "मंगलवार को हनुमान चालीसा का पाठ मन को स्थिर रखने में सहायक होगा। निर्णय भावना में नहीं, स्पष्टता आने पर लें।" },
    },
    4: {
      teaser: { en: "Right now, giving yourself time matters more than an answer.", hi: "अभी उत्तर से ज़्यादा, स्वयं को समय देना ज़रूरी है।" },
      answer: { en: "The chart doesn't show a clear direction right now — neither toward reunion nor a definite end. That uncertainty is hard, but better than forcing an answer before it's clear.", hi: "चार्ट में इस समय स्पष्ट दिशा नहीं दिख रही — न पुनर्मिलन की, न पूर्ण अंत की। यह अनिश्चितता कठिन है, पर जबरन उत्तर खोजने से बेहतर है थोड़ा और समय।" },
      remedy: { en: "Regular meditation and offering water to the Moon support mental steadiness. A detailed Prashna reading would give you a far more precise answer than a quick take can.", hi: "नियमित ध्यान और चंद्रमा को जल अर्पण मानसिक स्थिरता में सहायक। स्पष्टता के लिए एक विस्तृत प्रश्न-पाठन (Prashna) अधिक सटीक उत्तर देगा।" },
    },
  },

  marriage: {
    1: {
      teaser: { en: "Your 7th lord sits favorably — timing for marriage-related developments looks close.", hi: "आपकी कुंडली में सप्तमेश अनुकूल स्थिति में है — विवाह से जुड़े योग सक्रिय होने का समय निकट है।" },
      answer: { en: "Your 7th lord is strong and the current dasha connects directly to it — a relatively active window for marriage-related meetings and decisions. The next few months deserve particular attention.", hi: "सप्तमेश बलवान है और वर्तमान दशा इससे सीधे जुड़ी है। यह विवाह से जुड़े निर्णयों और मुलाकातों के लिए अपेक्षाकृत सक्रिय समय है — अगले कुछ महीने विशेष ध्यान देने योग्य हैं।" },
    },
    2: {
      teaser: { en: "Timing looks neutral right now — clarity will help more than urgency.", hi: "समय अभी सामान्य है — जल्दबाज़ी से अधिक स्पष्टता सहायक होगी।" },
      answer: { en: "Your 7th lord sits in neutral dignity and the current dasha has no direct link to it. Marriage isn't off the table — just avoid rushing decisions right now; open conversation with family will help more.", hi: "सप्तमेश सामान्य स्थिति में है और वर्तमान दशा का इससे सीधा संबंध नहीं है। इसका अर्थ है कि विवाह असंभव नहीं, पर अभी जल्दबाज़ी से बचना बेहतर रहेगा — परिवार से खुली बातचीत सहायक होगी।" },
    },
    3: {
      teaser: { en: "Some obstacles are visible right now — delay, not denial.", hi: "अभी कुछ बाधाएं दिख रही हैं — देरी हो सकती है, पर योग टूटा नहीं है।" },
      answer: { en: "Your 7th lord is under pressure and the current dasha isn't supportive either. This usually signals delay, not the absence of marriage yoga altogether — obstacles are often tied to family circumstances, finances, or simply not meeting the right match yet.", hi: "सप्तमेश दबाव में है और वर्तमान दशा भी सहायक नहीं। इसका अर्थ प्रायः देरी है, न कि विवाह-योग का अभाव। बाधाएं अक्सर परिवार, वित्तीय स्थिति या उपयुक्त प्रस्ताव न मिलने से जुड़ी होती हैं।" },
      remedy: { en: "Chant the Venus mantra on Fridays and regularly seek blessings from parents/elders — traditionally considered helpful in reducing delay.", hi: "शुक्रवार को शुक्र मंत्र का जाप करें और माता-पिता/बड़ों का आशीर्वाद नियमित लें — यह विलंब को कम करने में सहायक माना जाता है।" },
    },
    4: {
      teaser: { en: "Patience is genuinely needed right now — this isn't a permanent state.", hi: "अभी धैर्य की आवश्यकता है — पर यह स्थायी स्थिति नहीं।" },
      answer: { en: "Both your 7th lord and the current dasha are unsupportive right now — indicating a notable delay, especially through this period. A clearer improvement is likely once the dasha shifts.", hi: "सप्तमेश और वर्तमान दशा दोनों ही अभी सहयोगी नहीं हैं। यह विवाह में उल्लेखनीय विलंब का संकेत है, विशेषकर वर्तमान दशा के दौरान। दशा परिवर्तन के साथ स्थिति में स्पष्ट सुधार की संभावना है।" },
      remedy: { en: "Observe a regular Friday fast and offer milk/water to Venus. A detailed personal reading would help pin down the actual favorable window ahead based on your dasha sequence.", hi: "नियमित रूप से शुक्रवार का व्रत और शुक्र को जल-दूध अर्पण करें। इस अवधि में किसी विस्तृत व्यक्तिगत पाठन से दशा-अनुसार सही समय जानना अधिक सहायक होगा।" },
    },
  },

  career: {
    1: {
      teaser: { en: "Your 10th lord is well-placed — momentum is building in your career.", hi: "दशमेश अनुकूल स्थिति में है — करियर में गति बनने का समय है।" },
      answer: { en: "Your 10th lord is strong and the current dasha connects directly to it — favorable for a new role, promotion, or recognition. A good time to actively push efforts forward.", hi: "दशमेश बलवान है और वर्तमान दशा इसी से जुड़ी है। नई भूमिका, प्रमोशन या पहचान मिलने के योग सक्रिय हैं — यह प्रयासों को आगे बढ़ाने का उचित समय है।" },
    },
    2: {
      teaser: { en: "Things are steady — consistent effort will pay off.", hi: "स्थिति सामान्य है — निरंतर प्रयास फल देगा।" },
      answer: { en: "Your 10th lord sits in neutral dignity and the current dasha isn't directly linked. Don't expect a sudden leap — but steady effort and networking now build the foundation for what comes next.", hi: "दशमेश सामान्य स्थिति में है, और वर्तमान दशा का सीधा संबंध नहीं है। करियर में बड़ा उछाल तुरंत नहीं दिखेगा, पर स्थिर प्रयास और नेटवर्किंग आने वाले समय की नींव रखेंगे।" },
    },
    3: {
      teaser: { en: "Some friction is showing at work — better to hold off on major moves.", hi: "कार्यक्षेत्र में कुछ रुकावटें दिख रही हैं — बड़ा कदम टालना बेहतर।" },
      answer: { en: "Your 10th lord is under strain and the current dasha isn't supportive. This period can bring office politics, uncertainty, or slow progress — a timing challenge, not a reflection of your ability.", hi: "दशमेश दबाव में है और वर्तमान दशा भी सहयोगी नहीं। यह समय राजनीति, अनिश्चितता या धीमी प्रगति का हो सकता है — यह अक्षमता का संकेत नहीं, बल्कि समय की चुनौती है।" },
      remedy: { en: "Offer water to the Sun daily and observe some discipline on Sundays — helps maintain confidence and clarity through this phase.", hi: "प्रतिदिन सूर्य को जल अर्पित करें और रविवार को नियम-संयम रखें — आत्मविश्वास और स्पष्टता बनाए रखने में सहायक।" },
    },
    4: {
      teaser: { en: "Patience and stability matter most in your career right now.", hi: "अभी करियर में धैर्य और स्थिरता सबसे ज़रूरी है।" },
      answer: { en: "Both your 10th lord and current dasha are unfavorable — likely a period of stagnation, best not met with big leaps (quitting, starting a new venture). Hold off on major decisions until the picture clears.", hi: "दशमेश और वर्तमान दशा दोनों प्रतिकूल हैं — यह करियर में ठहराव या बड़े बदलाव से बचने का समय हो सकता है। बड़े निर्णय (नौकरी छोड़ना, नया व्यापार) टालना बेहतर रहेगा जब तक स्थिति स्पष्ट न हो।" },
      remedy: { en: "Offer oil at a Shani temple on Saturdays and preserve relationships with seniors. A detailed reading would help map the right strategy against your specific dasha sequence.", hi: "शनिवार को शनि मंदिर में तेल अर्पित करें और वरिष्ठों के साथ संबंध सहेजें। इस दौर में विस्तृत पाठन दशा के अनुसार सही रणनीति बताने में सहायक होगा।" },
    },
  },

  govtJob: {
    1: {
      teaser: { en: "The Sun is favorably placed — strong indications toward government service.", hi: "सूर्य अनुकूल स्थिति में है — सरकारी नौकरी के योग प्रबल दिख रहे हैं।" },
      answer: { en: "The Sun — the classical karaka for government and authority — is strong and connected to your 10th house/current dasha. This is a favorable sign for government service, administrative roles, or authority-linked work. Keep preparing; timing is on your side.", hi: "सूर्य — सरकारी और सत्ता का पारंपरिक कारक — बलवान है और आपके दशम भाव/वर्तमान दशा से जुड़ा है। यह सरकारी नौकरी, प्रशासनिक पद या सत्ता से जुड़े कार्यक्षेत्र के लिए अनुकूल संकेत है। तैयारी जारी रखें — समय आपके पक्ष में है।" },
    },
    2: {
      teaser: { en: "The Sun sits neutrally — government service is possible, not guaranteed.", hi: "सूर्य सामान्य स्थिति में है — सरकारी नौकरी संभव है, पर निश्चित नहीं।" },
      answer: { en: "The Sun has some connection to your 10th house/dasha but isn't decisively strong. Government service is possible, but the chart alone doesn't assure it — steady effort, well-timed applications, and keeping private-sector doors open in parallel would serve you well.", hi: "सूर्य का आपके दशम भाव/दशा से कुछ जुड़ाव है, पर निर्णायक रूप से बलवान नहीं। सरकारी नौकरी संभव है, पर यह अकेले पर्याप्त नहीं — निरंतर प्रयास, सही समय पर आवेदन और साथ-साथ निजी क्षेत्र के अवसर भी खुले रखना उपयोगी रहेगा।" },
    },
    3: {
      teaser: { en: "Private-sector indications look stronger than government right now.", hi: "अभी निजी क्षेत्र के योग सरकारी से अधिक प्रबल दिख रहे हैं।" },
      answer: { en: "The Sun is under pressure while the current dasha connects to Mercury or Venus — classical trade and private-sector karakas. This leans toward private sector, corporate roles, or skill-based work. You can keep trying for government roles, but private opportunities look more immediately favorable.", hi: "सूर्य दबाव में है, जबकि वर्तमान दशा बुध या शुक्र से जुड़ी है — जो पारंपरिक रूप से व्यापार और निजी क्षेत्र के कारक माने जाते हैं। यह निजी क्षेत्र, कॉर्पोरेट भूमिकाओं या कौशल-आधारित कार्यक्षेत्र की ओर झुकाव दिखाता है। सरकारी प्रयास जारी रख सकते हैं, पर निजी क्षेत्र में अवसर अधिक तत्काल दिख रहे हैं।" },
      remedy: { en: "Offer water to the Sun on Sundays and recite the Aditya Hridaya Stotra — traditionally supportive for government attempts, while you actively pursue private-sector openings too.", hi: "रविवार को सूर्य को जल अर्पित करें और आदित्य हृदय स्तोत्र का पाठ करें — सरकारी प्रयासों में सहायक माना जाता है, साथ ही निजी अवसरों को भी सक्रियता से आगे बढ़ाएं।" },
    },
    4: {
      teaser: { en: "The Sun is weak, but business/self-employment indications are visible.", hi: "सूर्य दुर्बल है, पर व्यापार/स्वरोजगार के योग दिख रहे हैं।" },
      answer: { en: "The Sun is weak and the current dasha isn't connected to trade karakas strongly either — this leans more toward business, consulting, or self-employment than a traditional job, government or private. If a job is still the goal, private sector looks more reachable than government right now.", hi: "सूर्य दुर्बल है और वर्तमान दशा व्यापार-कारकों से भी प्रबल रूप से जुड़ी नहीं — यह पारंपरिक नौकरी (सरकारी या निजी) से अधिक व्यापार, परामर्श या स्वरोजगार की ओर संकेत करता है। यदि नौकरी ही लक्ष्य है, तो अभी निजी क्षेत्र सरकारी से अधिक संभव दिख रहा है।" },
      remedy: { en: "Donate green items on Wednesdays and invest in skill development — traditionally supportive for strengthening business/self-employment yoga.", hi: "बुधवार को हरी वस्तुएं दान करें और अपने कौशल-विकास पर ध्यान दें — व्यापार/स्वरोजगार के योग को सशक्त बनाने में सहायक।" },
    },
  },

  finance: {
    1: {
      teaser: { en: "Your 11th lord is favorably placed — new income channels look likely.", hi: "एकादशेश अनुकूल स्थिति में है — आय के नए स्रोत खुलने के योग हैं।" },
      answer: { en: "Your 11th lord is strong and the current dasha connects to it — a favorable window for financial gains, new opportunities, and accumulation. Make investment decisions thoughtfully, but there's no reason for anxiety here.", hi: "एकादशेश बलवान है और वर्तमान दशा इससे जुड़ी है। यह आर्थिक लाभ, नए अवसर और संचय के लिए अनुकूल समय है — निवेश के निर्णय सोच-समझकर लें, पर घबराने की आवश्यकता नहीं।" },
    },
    2: {
      teaser: { en: "Steady, not dramatic — no big gain signaled, but no loss either.", hi: "स्थिति स्थिर है — बड़ा लाभ नहीं, पर नुकसान का भी संकेत नहीं।" },
      answer: { en: "Your 11th lord sits neutrally and the dasha isn't directly linked. Income likely stays steady. Avoid high-risk investments and stick with your existing plan for now.", hi: "एकादशेश सामान्य स्थिति में है और दशा का सीधा जुड़ाव नहीं। आय स्थिर रहने की संभावना है। बड़े जोखिम भरे निवेश से बचें और मौजूदा योजना पर टिके रहें।" },
    },
    3: {
      teaser: { en: "Some imbalance between income and expenses may show up — stay cautious.", hi: "अभी खर्च और आय में असंतुलन दिख सकता है — सतर्कता बरतें।" },
      answer: { en: "Your 11th lord is under pressure and the current dasha isn't supportive. This can bring unexpected expenses or slower income. Not permanent — but better to avoid major financial risks (new loans, big investments) during this window.", hi: "एकादशेश दबाव में है और वर्तमान दशा भी सहायक नहीं। अनपेक्षित खर्च या धीमी आय का दौर हो सकता है। यह स्थायी नहीं — पर इस समय बड़े वित्तीय जोखिम (नया कर्ज़, बड़ा निवेश) टालना बेहतर है।" },
      remedy: { en: "Donate yellow items on Thursdays and chant the Jupiter mantra — traditionally supportive for financial stability.", hi: "बृहस्पतिवार को पीली वस्तुएं दान करें और गुरु मंत्र का जाप करें — वित्तीय स्थिरता में सहायक माना जाता है।" },
    },
    4: {
      teaser: { en: "Real caution is needed in financial matters right now.", hi: "अभी वित्तीय मामलों में बहुत सतर्क रहने की ज़रूरत है।" },
      answer: { en: "Both your 11th lord and current dasha are unfavorable — a period of possible financial strain or delayed payments. Don't make big financial calls without real thought, especially lending or borrowing.", hi: "एकादशेश और वर्तमान दशा दोनों प्रतिकूल हैं — यह संभावित आर्थिक दबाव या देरी से भुगतान का समय हो सकता है। कोई बड़ा वित्तीय निर्णय बिना सोचे-समझे न लें, विशेषकर उधार देना/लेना।" },
      remedy: { en: "Worship Jupiter and Lakshmi daily, and avoid unnecessary expenses. A detailed reading would help pin down exactly when this pressure eases.", hi: "प्रतिदिन गुरु व लक्ष्मी जी की आराधना करें, अनावश्यक खर्च टालें। इस अवधि में विस्तृत पाठन से सटीक समय-सीमा जानना उपयोगी होगा।" },
    },
  },

  health: {
    1: {
      teaser: { en: "Your 6th lord is favorably placed — a relatively easy period health-wise.", hi: "षष्ठेश अनुकूल स्थिति में है — यह स्वास्थ्य के लिए अपेक्षाकृत सहज समय है।" },
      answer: { en: "Your 6th lord is strong and the current dasha isn't directly tied to it — generally a favorable sign. Keep up a regular routine; this isn't a warning, just a nudge to make the most of an easier period.", hi: "षष्ठेश बलवान है और वर्तमान दशा इससे सीधे जुड़ी नहीं है, जो सामान्यतः शुभ संकेत है। नियमित दिनचर्या बनाए रखें — यह चेतावनी नहीं, बल्कि इस समय का लाभ उठाने का सुझाव है।" },
    },
    2: {
      teaser: { en: "Fairly routine — regular care should be enough.", hi: "सामान्य स्थिति है — नियमित देखभाल पर्याप्त होगी।" },
      answer: { en: "Your 6th lord sits in neutral dignity. No particular red flag — but it's worth paying ordinary attention to sleep, diet, and stress balance.", hi: "षष्ठेश सामान्य स्थिति में है। कोई विशेष चेतावनी नहीं, पर नींद, भोजन और तनाव के सामान्य संतुलन पर ध्यान देना उपयोगी रहेगा।" },
    },
    3: {
      teaser: { en: "A little extra care than usual would help through this period.", hi: "इस दौर में सामान्य से थोड़ी अधिक सावधानी उपयोगी रहेगी।" },
      answer: { en: "Your 6th lord is under pressure and the current dasha isn't supportive — can indicate fatigue, stress, or dips in resilience. This is not a diagnosis, only an astrological signal that a little extra attention would help. Please consult a doctor for any actual symptoms.", hi: "षष्ठेश दबाव में है और वर्तमान दशा भी सहायक नहीं। यह थकान, तनाव या रोग-प्रतिरोधक क्षमता में उतार-चढ़ाव का संकेत हो सकता है। यह निदान नहीं है — केवल एक ज्योतिषीय संकेत कि सामान्य से अधिक ध्यान देना उपयोगी रहेगा। किसी भी लक्षण के लिए कृपया चिकित्सक से परामर्श लें।" },
      remedy: { en: "Maintain regular exercise and adequate sleep, and recite Hanuman Chalisa on Tuesdays — supportive for mental steadiness.", hi: "नियमित व्यायाम, पर्याप्त नींद बनाए रखें और मंगलवार को हनुमान चालीसा पढ़ें — मानसिक स्थिरता में सहायक।" },
    },
    4: {
      teaser: { en: "This is a good time to genuinely prioritize your health.", hi: "अभी अपने स्वास्थ्य को प्राथमिकता देने का समय है।" },
      answer: { en: "Both your 6th lord and current dasha are challenging right now. Astrologically, this suggests prioritizing health, regular checkups, and stress reduction would help. This is not a diagnosis — please see a doctor for any actual health concerns.", hi: "षष्ठेश और वर्तमान दशा दोनों ही अभी चुनौतीपूर्ण हैं। यह ज्योतिषीय रूप से संकेत करता है कि स्वास्थ्य को प्राथमिकता देना, नियमित जांच कराना और तनाव कम करना विशेष उपयोगी रहेगा। यह निदान नहीं — कृपया किसी भी स्वास्थ्य चिंता के लिए चिकित्सक से अवश्य मिलें।" },
      remedy: { en: "Recite the Mrityunjaya mantra regularly, keep up with routine checkups, and prioritize medical advice above all.", hi: "नियमित रूप से मृत्युंजय मंत्र का जाप करें, नियमित स्वास्थ्य जांच कराएं और चिकित्सक की सलाह को प्राथमिकता दें।" },
    },
  },

  children: {
    1: {
      teaser: { en: "Your 5th lord is favorably placed — signs for children look active.", hi: "पंचमेश अनुकूल स्थिति में है — संतान-सुख के योग सक्रिय दिख रहे हैं।" },
      answer: { en: "Your 5th lord is strong and the current dasha connects to it — a relatively favorable window for matters relating to children.", hi: "पंचमेश बलवान है और वर्तमान दशा इससे जुड़ी है। यह संतान-सुख से जुड़े मामलों के लिए अपेक्षाकृत अनुकूल समय है।" },
    },
    2: {
      teaser: { en: "Things look neutral — clarity will come with time.", hi: "स्थिति सामान्य है — समय के साथ स्पष्टता आएगी।" },
      answer: { en: "Your 5th lord sits neutrally and the dasha isn't directly linked. Not an obstacle — just not a particularly active window right now.", hi: "पंचमेश सामान्य स्थिति में है और दशा का सीधा जुड़ाव नहीं है। यह कोई बाधा नहीं दर्शाता, केवल यह कि अभी विशेष सक्रिय समय नहीं है।" },
    },
    3: {
      teaser: { en: "Some signs of delay show up — not a sign it won't happen.", hi: "अभी कुछ देरी के संकेत दिख रहे हैं — यह असंभव होने का संकेत नहीं।" },
      answer: { en: "Your 5th lord is under pressure and the current dasha isn't supportive — this typically signals delay, not absence. Strong likelihood of improvement once the dasha shifts.", hi: "पंचमेश दबाव में है और वर्तमान दशा भी सहयोगी नहीं। यह देरी का संकेत हो सकता है, संतान-सुख के अभाव का नहीं। दशा परिवर्तन के साथ स्थिति में सुधार की प्रबल संभावना है।" },
      remedy: { en: "Observe a Thursday fast and chant the Santan Gopal mantra — traditionally considered supportive. Continue medical guidance in parallel.", hi: "गुरुवार का व्रत रखें और संतान गोपाल मंत्र का जाप करें — पारंपरिक रूप से सहायक माना जाता है। चिकित्सकीय परामर्श भी समानांतर रूप से लेते रहें।" },
    },
    4: {
      teaser: { en: "Patience is genuinely needed — this isn't a permanent state.", hi: "अभी धैर्य रखना ज़रूरी है — पर यह स्थायी स्थिति नहीं।" },
      answer: { en: "Both your 5th lord and current dasha are unfavorable — indicating a notable delay. This is an astrological signal, not a medical diagnosis — please continue consulting your doctor.", hi: "पंचमेश और वर्तमान दशा दोनों प्रतिकूल हैं — यह उल्लेखनीय विलंब का संकेत है। यह ज्योतिषीय संकेत है, चिकित्सीय निदान नहीं — कृपया चिकित्सक से परामर्श जारी रखें।" },
      remedy: { en: "Chant the Santan Gopal mantra regularly and observe Thursday fasts. A detailed reading would help map the likely timeline ahead.", hi: "नियमित रूप से संतान गोपाल मंत्र का जाप करें और गुरुवार व्रत रखें। विस्तृत पाठन से सही समय-सीमा जानना सहायक होगा।" },
    },
  },

  foreign: {
    1: {
      teaser: { en: "Your 12th lord is favorably placed — signs for foreign travel/settlement look active.", hi: "द्वादशेश अनुकूल स्थिति में है — विदेश-यात्रा या स्थायित्व के योग सक्रिय हैं।" },
      answer: { en: "Your 12th lord is strong and the current dasha connects to it — opportunities around foreign travel, higher education, or settlement abroad look favorable through this period.", hi: "द्वादशेश बलवान है और वर्तमान दशा इससे जुड़ी है। विदेश यात्रा, उच्च शिक्षा या स्थायी निवास से जुड़े अवसर इस दौर में अनुकूल दिख रहे हैं।" },
    },
    2: {
      teaser: { en: "Fairly neutral — good time to plan even if nothing moves fast.", hi: "स्थिति सामान्य है — योजना बनाना अभी उपयोगी रहेगा।" },
      answer: { en: "Your 12th lord sits neutrally and the dasha isn't directly linked. Don't be discouraged if nothing moves quickly — this is still a good time for paperwork and preparation.", hi: "द्वादशेश सामान्य स्थिति में है और दशा का सीधा जुड़ाव नहीं। बड़ी प्रगति तुरंत न दिखे तो निराश न हों — दस्तावेज़ीकरण और तैयारी अभी करना लाभदायक रहेगा।" },
    },
    3: {
      teaser: { en: "Some hurdles (visa/paperwork) may show up — delay, not denial.", hi: "अभी कुछ बाधाएं (वीज़ा/दस्तावेज़) दिख सकती हैं — देरी संभव, इनकार नहीं।" },
      answer: { en: "Your 12th lord is under pressure and the current dasha isn't supportive — visa, documentation, or permission-related hurdles may appear. This is temporary — likely to ease once the dasha shifts.", hi: "द्वादशेश दबाव में है और वर्तमान दशा भी सहयोगी नहीं। वीज़ा, दस्तावेज़ या अनुमति से जुड़ी बाधाएं आ सकती हैं। यह अस्थायी है — दशा बदलने पर स्थिति में सुधार की संभावना है।" },
      remedy: { en: "Offer oil at a Shani temple on Saturdays and take extra care with documentation and paperwork.", hi: "शनिवार को शनि मंदिर में तेल अर्पित करें और दस्तावेज़ों की तैयारी में अतिरिक्त सावधानी बरतें।" },
    },
    4: {
      teaser: { en: "Patience around foreign plans is genuinely warranted right now.", hi: "अभी विदेश-यात्रा को लेकर धैर्य रखना बेहतर रहेगा।" },
      answer: { en: "Both your 12th lord and current dasha are unfavorable — indicating notable delay in foreign plans. Better to hold off on major decisions (quitting a job, selling assets) until the picture clears.", hi: "द्वादशेश और वर्तमान दशा दोनों प्रतिकूल हैं — यह विदेश-योजनाओं में उल्लेखनीय विलंब का संकेत है। बड़े निर्णय (नौकरी छोड़ना, संपत्ति बेचना) टालना बेहतर रहेगा जब तक स्थिति स्पष्ट न हो।" },
      remedy: { en: "Recite Hanuman Chalisa regularly and continue Saturn-related remedies. A detailed reading would help pin down the actual timeline.", hi: "नियमित हनुमान चालीसा पाठ करें और शनि से संबंधित उपाय जारी रखें। विस्तृत पाठन से सही समय-सीमा जानना सहायक रहेगा।" },
    },
  },
};

/** Route a free-typed question to a category via plain keyword matching — no AI. */
export function matchCategory(text: string): CategoryKey | null {
  const t = text.toLowerCase();
  for (const cat of CATEGORIES) {
    if (cat.keywords.some((kw) => t.includes(kw.toLowerCase()))) return cat.key;
  }
  return null;
}

/** A question naming ANOTHER real tool/product on the site ("tell me about
 *  time rectification", "kundli PDF report kaise milega") — तुरंत उत्तर has
 *  no category for these; without this check they'd silently fall back to
 *  FALLBACK_CATEGORY and run the full paid flow for a question the category
 *  answer bank was never written to address. Checked BEFORE the generic
 *  meta-question check below, since these are more specific. */
export interface FeatureRedirect { href: string; label: { en: string; hi: string }; }

const FEATURE_PATTERNS: Array<{ test: RegExp; redirect: FeatureRedirect }> = [
  {
    test: /rectif|जन्म\s*समय\s*शुद्धिकरण|exact\s*(birth\s*)?time|birth\s*time.*(unknown|wrong|galat)|(जन्म\s*)?समय.*(पता\s*नहीं|गलत)/i,
    redirect: { href: "/tools/time-rectification", label: { en: "Time Rectification — ₹1011", hi: "जन्म समय शुद्धिकरण — ₹1011" } },
  },
  {
    test: /pdf\s*report|kundli\s*report|कुंडली.*रिपोर्ट|पूर्ण\s*कुंडली/i,
    redirect: { href: "/readings/birth-chart", label: { en: "Full Kundli PDF Report — ₹999", hi: "पूर्ण कुंडली PDF रिपोर्ट — ₹999" } },
  },
];

export function matchFeatureRedirect(text: string): FeatureRedirect | null {
  const hit = FEATURE_PATTERNS.find((f) => f.test.test(text));
  return hit ? hit.redirect : null;
}

/** A question about the PLATFORM/AI itself ("is this AI?", "what is
 *  GrahaAPI?", "are you a chatbot?") rather than a personal astrology
 *  question — same silent-fallback risk as above, but there's no single
 *  tool to redirect to, so this gets a short static explainer instead.
 *  Word-boundaries matter here: naive substring matching on "ai" would
 *  false-positive on the Hindi word "hai" (है, "is") in almost every
 *  Hinglish sentence — every pattern below is boundary-safe. */
const META_PATTERNS: RegExp[] = [
  /\bai\b/i,
  /\bapi\b/i,
  /chatbot/i,
  /\bbot\b/i,
  /grahaapi/i,
  /astro\s*shivanii\s*ai/i,
  /real\s+astrologer/i,
  /असली\s+ज्योतिषी/,
  /कृत्रिम\s*बुद्धि/,
  /रोबोट/,
  /who\s+are\s+you/i,
  /कौन\s+हो/,
];

export function isMetaQuestion(text: string): boolean {
  return META_PATTERNS.some((re) => re.test(text));
}
