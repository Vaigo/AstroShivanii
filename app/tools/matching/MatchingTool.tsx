"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import BirthForm from "@/components/BirthForm";
import DownloadReportButton from "@/components/DownloadReportButton";
import PatrikaFrame from "@/components/PatrikaFrame";
import Divider from "@/components/Divider";
import Link from "next/link";
import ResultCTA from "@/components/ResultCTA";
import { fetchAshtakoot, fetchMangalDosha } from "@/lib/api/endpoints";
import type { BirthRequest, AshtakootResult, MangalDoshaResult } from "@/lib/api/types";
import { ApiError } from "@/lib/api/client";
import { useBackStep } from "@/lib/useBackStep";
import { NAKSHATRAS } from "@/lib/nakshatras";
import { pickLang } from "@/lib/hindi-labels";

const nakHi = (name?: string) => (name ? NAKSHATRAS.find((n) => n.name === name)?.name_hi ?? name : "—");

const KOOTAS = [
  { key: "varna",        name: "Varna",        nameHi: "वर्ण",        max: 1, en: "Spiritual compatibility & ego-fit",              hi: "आध्यात्मिक तालमेल और स्वभाव-अहं का मेल" },
  { key: "vashya",       name: "Vashya",        nameHi: "वश्य",        max: 2, en: "Who naturally influences whom in the marriage",   hi: "विवाह में कौन किसे सहज रूप से प्रभावित करता है" },
  { key: "tara",         name: "Tara",          nameHi: "तारा",        max: 3, en: "General well-being & mutual luck",                hi: "समग्र स्वास्थ्य और आपसी सौभाग्य" },
  { key: "yoni",         name: "Yoni",          nameHi: "योनि",        max: 4, en: "Physical & intimate compatibility",              hi: "शारीरिक और अंतरंग तालमेल" },
  { key: "graha_maitri", name: "Graha Maitri",  nameHi: "ग्रह मैत्री",  max: 5, en: "Mental compatibility & friendship",               hi: "मानसिक तालमेल और मित्रता" },
  { key: "gana",         name: "Gana",          nameHi: "गण",          max: 6, en: "Temperament match (deva/manushya/rakshasa)",     hi: "स्वभाव-वर्ग का मेल (देव/मनुष्य/राक्षस)" },
  { key: "bhakoot",      name: "Bhakoot",       nameHi: "भकूट",        max: 7, en: "Love, family growth & prosperity",               hi: "प्रेम, पारिवारिक वृद्धि और समृद्धि" },
  { key: "nadi",         name: "Nadi",          nameHi: "नाड़ी",        max: 8, en: "Health & progeny — the heaviest-weighted koota", hi: "स्वास्थ्य और संतान — सबसे भारी कूट" },
] as const;

/* ── Per-koota detail: WHO has WHAT, and what a lost point actually means ── */

const VAL_HI: Record<string, string> = {
  // varna
  Brahmin: "ब्राह्मण", Kshatriya: "क्षत्रिय", Vaishya: "वैश्य", Shudra: "शूद्र",
  // vashya groups (API sends lowercase)
  chatushpada: "चतुष्पाद (पशु)", manava: "मानव", jalchar: "जलचर", vanchar: "वनचर", keeta: "कीट",
  // yoni animals
  horse: "अश्व (घोड़ा)", elephant: "गज (हाथी)", sheep: "मेष (भेड़)", serpent: "सर्प", dog: "श्वान",
  cat: "मार्जार (बिल्ली)", rat: "मूषक (चूहा)", cow: "गौ (गाय)", buffalo: "महिष (भैंसा)", tiger: "व्याघ्र (बाघ)",
  deer: "मृग (हिरण)", monkey: "वानर (बंदर)", mongoose: "नकुल (नेवला)", lion: "सिंह",
  // gana
  Deva: "देव", Manushya: "मनुष्य", Rakshasa: "राक्षस",
  // nadi
  Adi: "आदि", Madhya: "मध्य", Antya: "अंत्य",
  // moon-sign lords
  Sun: "सूर्य", Moon: "चंद्र", Mars: "मंगल", Mercury: "बुध", Jupiter: "गुरु", Venus: "शुक्र", Saturn: "शनि",
};
const TARA_NAME_HI = ["", "जन्म", "सम्पत", "विपत", "क्षेम", "प्रत्यरि", "साधक", "वध", "मित्र", "परम मैत्र"];
const TARA_NAME_EN = ["", "Janma", "Sampat", "Vipat", "Kshema", "Pratyari", "Sadhaka", "Vadha", "Mitra", "Param Maitra"];
const BAD_TARA = new Set([3, 5, 7]);

interface KootaDetail { pair: string | null; verdict: string; tone: "good" | "mid" | "bad" }

function kootaDetail(key: string, r: AshtakootResult, isHi: boolean): KootaDetail {
  const L = (en: string, hi: string) => (isHi ? hi : en);
  const v = (s?: string) => (s ? (isHi ? VAL_HI[s] ?? s : s.charAt(0).toUpperCase() + s.slice(1)) : "—");
  const boy = L("Boy", "वर"), girl = L("Girl", "वधू");

  switch (key) {
    case "varna": {
      const k = r.varna;
      const full = k.score >= k.max;
      return {
        pair: `${boy}: ${v(k.boy_varna)} · ${girl}: ${v(k.girl_varna)}`,
        tone: full ? "good" : "mid",
        verdict: full
          ? L("Varna order is favorable — temperament-level respect comes naturally.",
              "वर्ण-क्रम अनुकूल है — स्वभाव के स्तर पर परस्पर आदर सहज रहेगा।")
          : L(`The girl's varna (${v(k.girl_varna)}) ranks above the boy's (${v(k.boy_varna)}) — tradition reads this as possible ego/values friction, needing conscious mutual respect.`,
              `वधू का वर्ण (${v(k.girl_varna)}) वर के वर्ण (${v(k.boy_varna)}) से ऊँचा है — परंपरा में यह अहं/मूल्यों के टकराव का संकेत माना जाता है; परस्पर सम्मान सचेत रूप से बनाना होगा।`),
      };
    }
    case "vashya": {
      const k = r.vashya;
      const full = k.score >= k.max;
      return {
        pair: `${boy}: ${v(k.boy_group)} · ${girl}: ${v(k.girl_group)}`,
        tone: full ? "good" : k.score > 0 ? "mid" : "bad",
        verdict: full
          ? L("Natural mutual affection and influence — neither dominates.",
              "स्वाभाविक परस्पर स्नेह-वश्यता — कोई किसी पर हावी नहीं।")
          : L(`Different vashya groups (${v(k.boy_group)} vs ${v(k.girl_group)}) — influence flows unevenly; winning each other over will take patience.`,
              `वश्य-वर्ग भिन्न हैं (${v(k.boy_group)} बनाम ${v(k.girl_group)}) — प्रभाव एकतरफ़ा रह सकता है; एक-दूसरे को समझाने-मनाने में धैर्य लगेगा।`),
      };
    }
    case "tara": {
      const k = r.tara;
      const tb = k.tara_from_boy, tg = k.tara_from_girl;
      const tn = (n?: number) => (n ? (isHi ? TARA_NAME_HI[n] : TARA_NAME_EN[n]) : "—");
      const girlBad = tb !== undefined && BAD_TARA.has(tb);
      const boyBad = tg !== undefined && BAD_TARA.has(tg);
      const pair = `${L("Girl's tara", "वधू की तारा")}: ${tn(tb)}${girlBad ? L(" (inauspicious)", " (अशुभ)") : ""} · ${L("Boy's tara", "वर की तारा")}: ${tn(tg)}${boyBad ? L(" (inauspicious)", " (अशुभ)") : ""}`;
      if (!girlBad && !boyBad) {
        return { pair, tone: "good", verdict: L("Both directions fall in auspicious taras — mutual health and fortune are supported.", "दोनों दिशाओं की तारा शुभ है — परस्पर स्वास्थ्य-सौभाग्य को बल मिलता है।") };
      }
      const who = girlBad && boyBad ? L("both sides", "दोनों पक्षों") : girlBad ? girl : boy;
      return {
        pair, tone: girlBad && boyBad ? "bad" : "mid",
        verdict: L(`The tara for ${who} falls in an inauspicious count (Vipat/Pratyari/Vadha) — tradition links this to health-and-fortune friction on that side; a deeper check is worthwhile.`,
            `${who} की तारा अशुभ गणना (विपत/प्रत्यरि/वध) में पड़ती है — परंपरा इसे उस पक्ष के स्वास्थ्य-सौभाग्य से जोड़ती है; गहन जांच उचित रहेगी।`),
      };
    }
    case "yoni": {
      const k = r.yoni;
      const pair = `${boy}: ${v(k.boy_yoni)} · ${girl}: ${v(k.girl_yoni)}`;
      if (k.score >= 3) return { pair, tone: "good", verdict: L("Friendly yoni natures — instinctive and intimate compatibility is strong.", "योनियाँ मैत्रीपूर्ण हैं — सहज एवं अंतरंग तालमेल अच्छा रहेगा।") };
      if (k.score === 2) return { pair, tone: "mid", verdict: L("Neutral yoni pairing — different instincts, workable with understanding.", "योनि-मेल सामान्य है — स्वभाव भिन्न, पर समझ से निभ सकता है।") };
      return {
        pair, tone: "bad",
        verdict: L(`These yonis (${v(k.boy_yoni)} vs ${v(k.girl_yoni)}) are traditionally hostile natures — day-to-day temperament and intimacy need real patience from both.`,
            `ये योनियाँ (${v(k.boy_yoni)} बनाम ${v(k.girl_yoni)}) परंपरा में परस्पर शत्रु मानी जाती हैं — दैनिक स्वभाव व अंतरंग तालमेल में दोनों ओर से धैर्य आवश्यक होगा।`),
      };
    }
    case "graha_maitri": {
      const k = r.graha_maitri;
      const pair = `${boy}${L(" (moon-sign lord)", " का राशि-स्वामी")}: ${v(k.boy_moon_sign_lord)} · ${girl}: ${v(k.girl_moon_sign_lord)}`;
      if (k.score >= 4) return { pair, tone: "good", verdict: L("The moon-sign lords are friends — mental wavelengths align easily.", "राशि-स्वामी परस्पर मित्र हैं — मानसिक तरंगदैर्घ्य सहज मिलती है।") };
      if (k.score >= 1) return { pair, tone: "mid", verdict: L("Partly friendly lords — outlooks differ at times; talking things through matters.", "स्वामियों में आंशिक मैत्री — दृष्टिकोण कभी-कभी अलग होंगे; संवाद महत्वपूर्ण रहेगा।") };
      return {
        pair, tone: "bad",
        verdict: L(`${v(k.boy_moon_sign_lord)} and ${v(k.girl_moon_sign_lord)} are traditionally enemy planets — mental compatibility needs deliberate effort, not assumption.`,
            `${v(k.boy_moon_sign_lord)} और ${v(k.girl_moon_sign_lord)} परंपरा में शत्रु ग्रह हैं — मानसिक तालमेल अपने-आप नहीं, सप्रयास बनेगा।`),
      };
    }
    case "gana": {
      const k = r.gana;
      const pair = `${boy}: ${v(k.boy_gana)} · ${girl}: ${v(k.girl_gana)}`;
      if (k.score >= 5) return { pair, tone: "good", verdict: L("Gana temperaments align — core natures pull in the same direction.", "गण-मेल अच्छा है — मूल स्वभाव एक ही दिशा में चलते हैं।") };
      if (k.score >= 3) return { pair, tone: "mid", verdict: L("Workable gana pairing — temperaments differ but complement with effort.", "गण-मेल मध्यम — स्वभाव भिन्न हैं पर प्रयास से पूरक बन सकते हैं।") };
      return {
        pair, tone: "bad",
        verdict: L(`Gana dosha: ${boy} is ${v(k.boy_gana)}, ${girl} is ${v(k.girl_gana)} — tradition flags this pairing for temperament clashes; check cancellation before concluding.`,
            `गण दोष: ${boy} ${v(k.boy_gana)} गण, ${girl} ${v(k.girl_gana)} गण — परंपरा इस जोड़ी को स्वभाव-टकराव से जोड़ती है; निष्कर्ष से पहले निवारण की जांच कराएँ।`),
      };
    }
    case "bhakoot": {
      const k = r.bhakoot;
      const pair = r.person1 && r.person2
        ? `${boy}${L(" (moon sign)", " की राशि")}: ${isHi ? r.person1.moon_sign_hi : r.person1.moon_sign} · ${girl}: ${isHi ? r.person2.moon_sign_hi : r.person2.moon_sign}`
        : null;
      if (k.score >= k.max) return { pair, tone: "good", verdict: L("Auspicious bhakoot — the moon signs support prosperity and family growth together.", "शुभ भकूट — दोनों राशियाँ मिलकर समृद्धि व पारिवारिक वृद्धि को बल देती हैं।") };
      const d = k.difference;
      const axis = d === 2 || d === 12
        ? L("the 2-12 (Dwirdwadash) axis — traditionally financial strain and family friction", "2-12 (द्विर्द्वादश) अक्ष — परंपरा में आर्थिक तनाव व पारिवारिक खिंचाव")
        : d === 6 || d === 8
          ? L("the 6-8 (Shadashtak) axis — traditionally the heaviest, linked to health and longevity concerns", "6-8 (षडाष्टक) अक्ष — सबसे भारी, स्वास्थ्य-आयु से जुड़ा")
          : L("the 5-9 (Nav-Pancham) axis — traditionally linked to progeny matters", "5-9 (नव-पंचम) अक्ष — संतान पक्ष से जुड़ा");
      return {
        pair, tone: "bad",
        verdict: L(`Bhakoot dosha on ${axis}. Its cancellation rules (same sign-lord, friendly lords) are common — verify before treating it as final.`,
            `भकूट दोष — ${axis}। इसके निवारण-नियम (एक ही राशि-स्वामी, मित्र स्वामी) प्रचलित हैं — अंतिम मानने से पहले जांच अवश्य कराएँ।`),
      };
    }
    case "nadi": {
      const k = r.nadi;
      const pair = `${boy}: ${v(k.boy_nadi)} ${L("nadi", "नाड़ी")} · ${girl}: ${v(k.girl_nadi)} ${L("nadi", "नाड़ी")}`;
      if (!k.nadi_dosha) return { pair, tone: "good", verdict: L("Different nadis — the heaviest koota scores full; health-and-progeny compatibility is supported.", "नाड़ियाँ भिन्न हैं — सबसे भारी कूट पूर्ण अंक पाता है; स्वास्थ्य-संतान पक्ष अनुकूल।") };
      return {
        pair, tone: "bad",
        verdict: L(`Both share the ${v(k.boy_nadi)} nadi — Nadi dosha, traditionally linked to health and progeny. It also has the most cancellation rules of any dosha, so verify parihara before deciding.`,
            `दोनों की नाड़ी एक ही (${v(k.boy_nadi)}) है — नाड़ी दोष, जो परंपरा में स्वास्थ्य-संतान से जुड़ा है। पर इसी दोष के निवारण-नियम सबसे अधिक हैं — निर्णय से पहले परिहार की जांच अनिवार्य है।`),
      };
    }
  }
  return { pair: null, verdict: "", tone: "mid" };
}

const TONE_COLOR = { good: "#1a7a3a", mid: "#8a6414", bad: "#8a2f24" } as const;

/** Donut gauge for the /36 score — tick marks at the classical thresholds
 *  (18 acceptable · 24 good · 28 excellent) so "where do we fall" reads at
 *  a glance instead of needing the number explained. */
function ScoreDonut({ total, max, color, verdict, isHi }: {
  total: number; max: number; color: string; verdict: string; isHi: boolean;
}) {
  const R = 66, C = 2 * Math.PI * R;
  const frac = Math.max(0, Math.min(1, total / max));
  const ticks = [
    { at: 18, hi: "18 स्वीकार्य", en: "18 fair" },
    { at: 24, hi: "24 अच्छा", en: "24 good" },
    { at: 28, hi: "28 उत्तम", en: "28 great" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <svg width="180" height="180" viewBox="0 0 180 180" role="img"
        aria-label={`${total} / ${max}`}>
        <circle cx="90" cy="90" r={R} fill="none" stroke="rgba(201,154,58,0.22)" strokeWidth="14" />
        <circle
          cx="90" cy="90" r={R} fill="none"
          stroke={color} strokeWidth="14" strokeLinecap="round"
          strokeDasharray={`${C * frac} ${C}`}
          transform="rotate(-90 90 90)"
          style={{ transition: "stroke-dasharray 0.8s ease" }}
        />
        {ticks.map(({ at }) => {
          const a = (at / max) * 2 * Math.PI - Math.PI / 2;
          const x1 = 90 + (R - 9) * Math.cos(a), y1 = 90 + (R - 9) * Math.sin(a);
          const x2 = 90 + (R + 9) * Math.cos(a), y2 = 90 + (R + 9) * Math.sin(a);
          return <line key={at} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--maroon-deep)" strokeWidth="2" opacity="0.55" />;
        })}
        <text x="90" y="88" textAnchor="middle" fontSize="38" fontWeight="800"
          fontFamily="var(--font-display)" fill={color}>{total}</text>
        <text x="90" y="112" textAnchor="middle" fontSize="14" fill="var(--muted)">/ {max}</text>
      </svg>
      <div style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", color: "var(--maroon-deep)", marginTop: "0.25rem" }}>
        {verdict}
      </div>
      <div className="devanagari" style={{ fontSize: "0.72rem", color: "var(--muted)", marginTop: "0.3rem" }}>
        {ticks.map((tk, i) => (
          <span key={tk.at}>{i > 0 && " · "}{isHi ? tk.hi : tk.en}</span>
        ))}
      </div>
    </div>
  );
}

function ScoreBar({ score, max }: { score: number; max: number }) {
  const pct = (score / max) * 100;
  const color = pct >= 75 ? "#1a7a3a" : pct >= 50 ? "#c99a3a" : "#c0392b";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
      <div style={{ flex: 1, background: "rgba(201,154,58,0.15)", borderRadius: "2px", height: "8px", overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, background: color, height: "100%", borderRadius: "2px", transition: "width 0.5s" }} />
      </div>
      <span style={{ fontSize: "0.8rem", fontWeight: 700, color, minWidth: "32px", textAlign: "right" }}>
        {score}/{max}
      </span>
    </div>
  );
}

export default function MatchingTool() {
  const { t, lang } = useI18n();
  const isHi = lang === "hi";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<AshtakootResult | null>(null);
  const [mangal, setMangal] = useState<MangalDoshaResult | null>(null);
  const [p1, setP1] = useState<BirthRequest | null>(null);
  const [p2, setP2] = useState<BirthRequest | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (result) resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [result]);

  // Back button clears the result (returning to the forms) instead of leaving the page.
  useBackStep(!!result, "matchResult", () => {
    setResult(null);
    setMangal(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  async function handleCalculate(e: React.FormEvent) {
    e.preventDefault();
    if (!p1 || !p2) return;
    setLoading(true);
    setError("");
    setResult(null);
    setMangal(null);
    try {
      const req = { person1: p1, person2: p2 };
      const [data, md] = await Promise.all([
        fetchAshtakoot(req),
        fetchMangalDosha(req).catch(() => null), // dosha check is additive, never blocks the score
      ]);
      setResult(data);
      setMangal(md);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : t("form.error"));
    } finally {
      setLoading(false);
    }
  }

  const totalColor = result
    ? result.total >= 28 ? "#1a7a3a" : result.total >= 21 ? "#c99a3a" : result.total >= 18 ? "#e08a2e" : "#c0392b"
    : "var(--maroon)";

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: "1000px" }}>
        <h1 className={`section-heading${isHi ? " devanagari" : ""}`}>{isHi ? "गुण मिलान · अष्टकूट" : "Marriage Matching"}</h1>
        <p className="section-heading-hi devanagari">{isHi ? "Marriage Matching" : "गुण मिलान · अष्टकूट"}</p>

        <div className="tool-explainer" style={{ textAlign: "center", marginBottom: "2rem" }}>
          {isHi ? (
            <p className="devanagari">
              यह पारंपरिक <span className="hl">वैदिक मिलान</span> दोनों कुंडलियों को वैवाहिक जीवन के{" "}
              <span className="hl">8 पहलुओं (अष्टकूट)</span> पर परखकर <span className="hl">36 में से</span> अंक
              देता है। <span className="hl">18+</span> स्वीकार्य, <span className="hl">24+</span> अच्छा माना
              जाता है। कम अंक का अर्थ अस्वीकृति नहीं — बल्कि गहराई से जांच का संकेत है।{" "}
              <Link href="/guides/kundli-matching-guna-milan" style={{ color: "var(--maroon)", fontWeight: 600 }}>
                36 गुण कैसे काम करते हैं →
              </Link>
            </p>
          ) : (
            <p>
              The traditional Vedic compatibility check: both charts are compared on{" "}
              <span className="hl">8 aspects</span> of married life and scored{" "}
              <span className="hl">out of 36 points</span>. <span className="hl">18+</span> is considered
              acceptable, <span className="hl">24+</span> good.
              A low score is a signal to look deeper — not an automatic rejection.{" "}
              <Link href="/guides/kundli-matching-guna-milan" style={{ color: "var(--maroon)", fontWeight: 600 }}>
                How the 36 gunas work →
              </Link>
            </p>
          )}
        </div>

        <form onSubmit={handleCalculate}>
          <p className={`form-hint${isHi ? " devanagari" : ""}`} style={{ textAlign: "center", marginBottom: "0.75rem" }}>
            {isHi
              ? "यह मिलान दोनों की चंद्र-राशि व नक्षत्र पर आधारित है — चंद्रमा तेज़ी से चलता है (लगभग 13° प्रतिदिन) और एक ही दिन में राशि या नक्षत्र बदल सकता है, इसलिए जितना सटीक जन्म-समय दोनों का होगा, उतना भरोसेमंद स्कोर मिलेगा।"
              : "This match is built entirely from each person's Moon sign and nakshatra — and the Moon moves fast enough (about 13° a day) to change sign or nakshatra within a single day, so the more exact each birth time, the more reliable this score."}
          </p>
          <div className="form-2col-wide" style={{ marginBottom: "1.5rem" }}>
            <PatrikaFrame>
              <BirthForm embedded onChange={setP1} label={t("form.person1")} />
            </PatrikaFrame>
            <PatrikaFrame>
              <BirthForm embedded onChange={setP2} label={t("form.person2")} />
            </PatrikaFrame>
          </div>

          <div style={{ textAlign: "center" }}>
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading || !p1 || !p2}
            >
              {loading ? t("form.calculating") : isHi ? "मिलान करें" : "Calculate Compatibility"}
            </button>
            {(!p1 || !p2) && (
              <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: "0.5rem" }}>
                {isHi ? "गणना के लिए दोनों की जन्म तिथि डालें" : "Enter both dates of birth to calculate"}
              </p>
            )}
          </div>
        </form>

        {error && <p className="form-error" style={{ marginTop: "1rem", textAlign: "center" }}>{error}</p>}

        {loading && (
          <div style={{ textAlign: "center", padding: "3rem" }}>
            <div className="spinner" />
            <p style={{ color: "var(--muted)" }}>{t("form.loading")}</p>
          </div>
        )}

        {result && !loading && (
          <div ref={resultRef} className="print-area" style={{ marginTop: "2rem", scrollMarginTop: "90px" }}>
            <DownloadReportButton filename="AstroShivanii-Guna-Milan" />
            <PatrikaFrame>
              {/* Score header */}
              <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                <ScoreDonut total={result.total} max={36} color={totalColor} verdict={pickLang(result.verdict, isHi)} isHi={isHi} />
                <div style={{ fontSize: "0.85rem", color: "var(--muted)", marginTop: "0.35rem" }}>
                  {result.percentage}% {isHi ? "संगति" : "compatibility"}
                </div>
                <p className={`result-explain${isHi ? " devanagari" : ""}`} style={{ maxWidth: "480px", margin: "0.75rem auto 0", textAlign: "center", borderTop: "none", paddingTop: 0 }}>
                  {result.total >= 28
                    ? (isHi
                        ? <>यह <span className="hl">उत्कृष्ट मेल</span> है — 28+ अंक बहुत कम जोड़ों को मिलते हैं। पर अंक सिर्फ आधी कहानी हैं; कौन-सा कूट मज़बूत है, यह भी उतना ही मायने रखता है।</>
                        : <>This is an <span className="hl">excellent match</span> — 28+ is rare. But the score is only half the story; which specific kootas are strong matters just as much.</>)
                    : result.total >= 21
                      ? (isHi
                          ? <>यह <span className="hl">अच्छा मेल</span> है — पारंपरिक रूप से स्वीकार्य सीमा से ऊपर। कोई भी शेष <span className="hl">दोष</span> नीचे देखें और परिहार (निवारण) की जांच अवश्य कराएँ।</>
                          : <>This is a <span className="hl">good match</span> — comfortably above the traditional acceptable line. Check for any remaining <span className="hl">dosha</span> below, and always verify cancellation (parihara).</>)
                      : result.total >= 18
                        ? (isHi
                            ? <>यह <span className="hl">स्वीकार्य सीमा</span> पर है — निर्णय से पहले कौन-से कूट कमज़ोर हैं, यह गहराई से समझना ज़रूरी है।</>
                            : <>This sits right at the <span className="hl">acceptable threshold</span> — understanding exactly which kootas are weak matters before deciding.</>)
                        : (isHi
                            ? <><span className="hl">18 से कम अंक</span> का अर्थ अस्वीकृति नहीं — बल्कि यह है कि निर्णय से पहले हर कूट, दोष-निवारण और नवांश की गहन जांच अनिवार्य है।</>
                            : <>A score <span className="hl">below 18</span> doesn't mean rejection — it means a careful, koota-by-koota review with dosha-cancellation and navamsa checks is essential before deciding.</>)}
                </p>
              </div>

              {(!p1?.tob || !p2?.tob) && (
                <div className="kaal-box" style={{ marginBottom: "1.25rem" }}>
                  <strong className={isHi ? "devanagari" : undefined}>
                    {isHi ? "⚠ सटीक जन्म-समय अनुपलब्ध" : "⚠ Exact birth time missing"}
                  </strong>
                  <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.82rem", marginTop: "0.3rem" }}>
                    {isHi
                      ? `${!p1?.tob && !p2?.tob ? "वर और वधू दोनों के जन्म-विवरण" : !p1?.tob ? "वर के जन्म-विवरण" : "वधू के जन्म-विवरण"} में सही समय न होने से हमने सूर्योदय के समय का अनुमान इस्तेमाल किया है। चंद्रमा एक ही दिन में राशि या नक्षत्र बदल सकता है — जो नीचे के अधिकांश कूट तय करता है — इसलिए सटीक समय मिलते ही यह मिलान दोबारा जांच लें।`
                      : `${!p1?.tob && !p2?.tob ? "Both birth details" : !p1?.tob ? "The boy's birth details" : "The girl's birth details"} had no exact time, so we used a sunrise-based estimate. The Moon — which drives most of the kootas below — can shift into a new sign or nakshatra within a single day, so it's worth rechecking this match once you have the exact time.`}
                  </p>
                </div>
              )}

              <Divider />

              {/* Both charts' moon details — the raw inputs every koota is judged from */}
              {result.person1 && result.person2 && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "0.75rem", marginBottom: "1.5rem" }}>
                  {([[isHi ? "वर (लड़का)" : "Boy (Groom)", result.person1], [isHi ? "वधू (लड़की)" : "Girl (Bride)", result.person2]] as const).map(([label, p]) => (
                    <div key={label} className="result-box" style={{ margin: 0 }}>
                      <div className="result-label">{label}</div>
                      <div style={{ fontSize: "0.88rem" }} className={isHi ? "devanagari" : undefined}>
                        <strong>{isHi ? "राशि" : "Moon sign"}:</strong> {isHi ? p.moon_sign_hi : p.moon_sign}
                        {" · "}
                        <strong>{isHi ? "नक्षत्र" : "Nakshatra"}:</strong> {isHi ? nakHi(p.nakshatra) : p.nakshatra}
                        {" "}
                        <span style={{ color: "var(--muted)", fontSize: "0.85em" }}>
                          ({isHi ? "स्वामी" : "lord"}: {isHi ? VAL_HI[p.nakshatra_lord] ?? p.nakshatra_lord : p.nakshatra_lord})
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Koota breakdown — who has what, and what a lost point means */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.1rem" }}>
                {KOOTAS.map(({ key, name, nameHi, en, hi }) => {
                  const koota = result[key as keyof AshtakootResult] as { score: number; max: number } | undefined;
                  if (!koota) return null;
                  const detail = kootaDetail(key, result, isHi);
                  return (
                    <div key={key} style={{ padding: "0.75rem", background: "rgba(201,154,58,0.05)", border: "1px solid rgba(201,154,58,0.25)", borderRadius: "3px" }}>
                      <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--maroon-deep)", marginBottom: "0.35rem" }}>
                        {isHi ? nameHi : name}{" "}
                        <span className="devanagari" style={{ fontWeight: 400, color: "var(--muted)", fontSize: "0.8em" }}>
                          {isHi ? name : nameHi}
                        </span>
                        {key === "nadi" && (koota as { nadi_dosha?: boolean }).nadi_dosha && (
                          <span style={{ color: "#c0392b", marginLeft: "0.35rem", fontSize: "0.7rem" }}>⚠ Dosha</span>
                        )}
                      </div>
                      <ScoreBar score={koota.score} max={koota.max} />
                      <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.72rem", color: "var(--muted)", marginTop: "0.3rem", lineHeight: 1.4 }}>
                        {isHi ? hi : en}
                      </p>
                      {detail.pair && (
                        <p className="devanagari" style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--ink)", marginTop: "0.45rem", lineHeight: 1.5, borderTop: "1px dashed rgba(201,154,58,0.35)", paddingTop: "0.45rem" }}>
                          {detail.pair}
                        </p>
                      )}
                      <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.76rem", color: TONE_COLOR[detail.tone], marginTop: "0.25rem", lineHeight: 1.5 }}>
                        {detail.verdict}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Dosha verdicts — deliberately 2 lines each, honest and calm */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "0.75rem", marginTop: "1.25rem" }}>
                {mangal && (
                  <div className={`kaal-box${!mangal.person1.has_mangal_dosha && !mangal.person2.has_mangal_dosha ? " good" : ""}`}>
                    <strong className={isHi ? "devanagari" : undefined}>
                      {isHi ? "मंगल दोष: " : "Mangal Dosha: "}
                      {!mangal.person1.has_mangal_dosha && !mangal.person2.has_mangal_dosha
                        ? (isHi ? "नहीं — दोनों में से कोई मांगलिक नहीं ✓" : "None — neither chart is Manglik ✓")
                        : mangal.mutual_cancellation
                          ? (isHi ? "दोनों में है — परस्पर निरस्त ✓" : "Present in both — mutually cancelled ✓")
                          : isHi
                            ? `वर: ${mangal.person1.has_mangal_dosha ? "है" : "नहीं"} · वधू: ${mangal.person2.has_mangal_dosha ? "है" : "नहीं"}`
                            : `Boy: ${mangal.person1.has_mangal_dosha ? "Yes" : "No"} · Girl: ${mangal.person2.has_mangal_dosha ? "Yes" : "No"}`}
                    </strong>
                    <div className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.78rem" }}>
                      {!mangal.person1.has_mangal_dosha && !mangal.person2.has_mangal_dosha
                        ? (isHi ? "मंगल दोष नहीं है — इस विषय में चिंता की आवश्यकता नहीं।" : "No Mangal dosha — nothing to worry about on this front.")
                        : (isHi ? "दोष दिखा? रुकिए — कई दोष निवारण (परिहार) से कटते हैं। निर्णय से पहले पूरी जांच कराएँ।" : "Dosha showing? Pause — many doshas cancel through parihara. Get a full check before deciding.")}
                    </div>
                  </div>
                )}
                <div className={`kaal-box${!result.nadi.nadi_dosha ? " good" : ""}`}>
                  <strong className={isHi ? "devanagari" : undefined}>
                    {isHi
                      ? `नाड़ी दोष: ${result.nadi.nadi_dosha ? "है" : "नहीं ✓"}`
                      : `Nadi Dosha: ${result.nadi.nadi_dosha ? "Present" : "None ✓"}`}
                  </strong>
                  <div className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.78rem" }}>
                    {result.nadi.nadi_dosha
                      ? (isHi ? "सबसे भारी कूट — पर इसके निवारण-नियम भी सबसे अधिक हैं। भयभीत न हों, जांच कराएँ।" : "The heaviest koota — but it also has the most cancellation rules. Don't panic; get it verified.")
                      : (isHi ? "नाड़ी दोष नहीं है — स्वास्थ्य-संतान के इस प्रमुख कूट में मेल शुभ।" : "No Nadi dosha — this key health-and-progeny koota matches well.")}
                  </div>
                </div>
              </div>

              <Divider />
              <ResultCTA
                locked={[
                  { en: "Which lost points actually matter for you two", hi: "खोए अंक आप दोनों के लिए कितने मायने रखते हैं" },
                  { en: "Dosha cancellation (parihara) analysis", hi: "दोष-निवारण (परिहार) जांच" },
                  { en: "Navamsa (D9) compatibility", hi: "नवांश मिलान" },
                  { en: "Dasha-sync: how your life-periods align", hi: "दशा-संगति — जीवन-काल का तालमेल" },
                  { en: "Rajju & Papasamyam checks", hi: "रज्जु एवं पाप-साम्य जांच" },
                ]}
                hook={{
                  en: `${result.total}/36 — but scores don't marry, people do. Which points matter for you two, and what cancels out — that's the full matching.`,
                  hi: `${result.total}/36 — पर अंक विवाह नहीं करते, लोग करते हैं। कौन-से अंक आपके लिए मायने रखते हैं और क्या कटता है — यही पूर्ण मिलान है।`,
                }}
                waText={`Namaste Shivanii ji! We checked our kundli match on your website — score ${result.total}/36 (${pickLang(result.verdict, false)}). We would like the full matching analysis before deciding.`}
                reading={{ href: "/readings/marriage-matching", labelEn: "Book Full Matching ₹1,299", labelHi: "पूर्ण मिलान बुक करें ₹1,299" }}
              />
            </PatrikaFrame>
          </div>
        )}
      </div>
    </section>
  );
}
