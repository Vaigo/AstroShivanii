"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { WHATSAPP_NUMBER } from "@/lib/config";
import Icon, { IconName } from "@/components/Icon";
import { calcMulank, calcBhagyank, calcNameNumber, calcLoShu, calcKua } from "@/lib/numerology-calc";
import { PROFILES, KARMIC_DEBT, KARMIC_LESSONS, LO_SHU_GRID, PLANES, KUA_GROUP_INFO } from "@/lib/numerology-data";
import { useBackStep } from "@/lib/useBackStep";

interface Result {
  mulank:    ReturnType<typeof calcMulank>;
  bhagyank:  ReturnType<typeof calcBhagyank>;
  nameNum:   ReturnType<typeof calcNameNumber>;
  loShu:     ReturnType<typeof calcLoShu>;
  kua:       ReturnType<typeof calcKua>;
  name:      string;
  dob:       string;
}

/* ─── Small helper components ──────────────────────────────────────────────── */
function CoreCard({ label, labelHi, number, sub, isHi }: {
  label: string; labelHi: string; number: number; sub: string; isHi: boolean;
}) {
  const p = PROFILES[number];
  return (
    <div className="num-core-card">
      <div className="num-core-num">{number}</div>
      <div className="num-core-label">{isHi ? labelHi : label}</div>
      <div className="num-core-planet">{isHi ? p.planet.hi : p.planet.en}</div>
      <div className="num-core-sub">{sub}</div>
    </div>
  );
}

function KarmicDebtBadge({ debtNum, isHi }: { debtNum: number; isHi: boolean }) {
  const d = KARMIC_DEBT[debtNum];
  if (!d) return null;
  return (
    <div className="karmic-debt-card">
      <div className="karmic-debt-header">
        <span className="karmic-debt-num">⚠ {debtNum}/{d.reducesTo}</span>
        <span className="karmic-debt-theme">{isHi ? d.theme.hi : d.theme.en}</span>
      </div>
      <p className="karmic-debt-meaning">{isHi ? d.meaning.hi : d.meaning.en}</p>
      <div className="karmic-debt-remedy">
        <strong>{isHi ? "उपाय:" : "Remedy:"}</strong> {isHi ? d.remedy.hi : d.remedy.en}
      </div>
    </div>
  );
}

/* ─── Main component ────────────────────────────────────────────────────────── */
export default function NumerologyTool() {
  const { lang } = useI18n();
  const isHi = lang === "hi";

  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "">("");
  const [result, setResult] = useState<Result | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (result) resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [result]);

  // Back button clears the result (returning to the form) instead of leaving the page.
  useBackStep(!!result, "numerologyResult", () => {
    setResult(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  function calculate() {
    if (!dob || !name.trim() || !gender) return;
    const mulank   = calcMulank(dob);
    const bhagyank = calcBhagyank(dob);
    const nameNum  = calcNameNumber(name);
    const kua      = calcKua(dob, gender);
    // The complete-grid method: derived numbers are written into the grid
    // with the DOB digits, so they fill cells, strengthen planes, and are
    // never wrongly listed as karmic lessons (e.g. a Bhagyank 5 person
    // cannot have 5 as a "missing" number). The Mulank is added ONLY for
    // two-digit birth days — for days 1-9 the day digit IS the Mulank and
    // is already in the grid; adding it again would double-count.
    const day = parseInt(dob.split("-")[2], 10);
    setResult({
      mulank,
      bhagyank,
      nameNum,
      loShu: calcLoShu(dob, [...(day >= 10 ? [mulank.value] : []), bhagyank.value, ...(nameNum.value > 0 ? [nameNum.value] : []), kua.value]),
      kua,
      name,
      dob,
    });
  }

  const mulankProfile   = result ? PROFILES[result.mulank.value]   : null;
  const bhagyankProfile = result ? PROFILES[result.bhagyank.value] : null;

  /* ─── WhatsApp message ── */
  function buildWaMsg() {
    if (!result) return "";
    const r = result;
    const kd = [r.mulank.karmicDebt, r.bhagyank.karmicDebt].filter(Boolean).join(", ");
    const kl = r.loShu.karmicLessons.join(", ");
    return encodeURIComponent(
      `Namaste Shivanii ji! 🙏\nI just calculated my numerology on your website:\n\n` +
      `Name: ${r.name || "—"}\nDOB: ${r.dob}\n` +
      `Mulank: ${r.mulank.value} (${PROFILES[r.mulank.value]?.planet.en})\n` +
      `Bhagyank: ${r.bhagyank.value} (${PROFILES[r.bhagyank.value]?.planet.en})\n` +
      (r.nameNum.value ? `Name Number: ${r.nameNum.value}\n` : "") +
      (kl ? `Karmic Lessons (missing): ${kl}\n` : "") +
      (kd ? `Karmic Debt: ${kd}\n` : "") +
      `\nI would love a detailed personal reading. Please let me know your availability. 🙏`
    );
  }

  return (
    <div style={{ minHeight: "80vh", padding: "2rem 1.5rem" }}>
      <div className="container" style={{ maxWidth: "900px" }}>

        {/* ── Page header ── */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Link href="/tools" style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
            ← {isHi ? "सभी उपकरण" : "All Tools"}
          </Link>
          <h1 style={{ marginTop: "0.75rem", marginBottom: "0.4rem" }}>
            {isHi ? "अंक ज्योतिष" : "Numerology"}
          </h1>
          <p className="devanagari" style={{ color: "var(--muted)", fontSize: "1rem" }}>
            {isHi ? "मूलांक · भाग्यांक · नाम अंक · लो शु ग्रिड · कार्मिक अंक"
                   : "Mulank · Bhagyank · Name Number · Lo Shu Grid · Karmic Numbers"}
          </p>

          {/* What is numerology */}
          <div className="tool-explainer">
            <p className={isHi ? "devanagari" : undefined}>{isHi
              ? <>वैदिक <span className="hl">अंक ज्योतिष</span> आपके जन्म तिथि और नाम के अंकों के माध्यम से आपके स्वभाव,
                भाग्य, <span className="hl">कार्मिक पाठ</span> और जीवन मार्ग को प्रकट करता है।</>
              : <>Vedic <span className="hl">numerology</span> reveals your personality, destiny,{" "}
                <span className="hl">karmic lessons</span>, and life path through the hidden vibration of
                numbers in your birth date and name.</>}</p>
          </div>
        </div>

        {/* ── Input form ── */}
        <div className="patrika-frame" style={{ marginBottom: "2rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
            <div className="form-group">
              <label className="form-label">{isHi ? "आपका नाम *" : "Your Name *"}</label>
              <input
                className="form-input"
                type="text"
                placeholder={isHi ? "जैसा जन्म प्रमाणपत्र पर हो" : "As on birth certificate"}
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
              <span className={`form-hint${isHi ? " devanagari" : ""}`}>
                {isHi
                  ? "नाम अंक चाल्डियन पद्धति से निकलता है — वर्तनी मायने रखती है, एक भी अक्षर बदलने से अंक बदल जाता है, इसलिए उपनाम नहीं, पूरा नाम ठीक उसी वर्तनी में लिखें जो जांचनी है"
                  : "Name Number uses the Chaldean system — spelling matters, since changing even one letter changes the number. Use your full name in the exact spelling you want checked, not a nickname."}
              </span>
            </div>
            <div className="form-group">
              <label className="form-label">{isHi ? "जन्म तिथि *" : "Date of Birth *"}</label>
              <input
                className="form-input"
                type="date"
                value={dob}
                onChange={e => setDob(e.target.value)}
                max={new Date().toISOString().split("T")[0]}
              />
              <span className={`form-hint${isHi ? " devanagari" : ""}`}>
                {isHi
                  ? "मूलांक जन्म-दिन से और भाग्यांक पूरी तारीख से निकलता है — दोनों नीचे अलग-अलग दिखेंगे"
                  : "Mulank comes from your birth day, Bhagyank from the full date — both are shown separately below"}
              </span>
            </div>
            <div className="form-group">
              <label className="form-label">{isHi ? "लिंग *" : "Gender *"}</label>
              <select
                className="form-input"
                value={gender}
                onChange={e => setGender(e.target.value as "male" | "female" | "")}
                required
              >
                <option value="">{isHi ? "चुनें" : "Select"}</option>
                <option value="male">{isHi ? "पुरुष" : "Male"}</option>
                <option value="female">{isHi ? "महिला" : "Female"}</option>
              </select>
              <span className="form-hint">{isHi ? "कुआ अंक (शुभ दिशा) के लिए ज़रूरी" : "Needed for Kua Number (favorable directions)"}</span>
            </div>
          </div>
          <div style={{ textAlign: "center", marginTop: "1.25rem" }}>
            <button className="btn btn-primary btn-lg" onClick={calculate} disabled={!dob || !name.trim() || !gender}>
              {isHi ? "गणना करें" : "Calculate"}
            </button>
          </div>
        </div>

        {result && mulankProfile && bhagyankProfile && (() => {
          const r = result;
          const karmicDebtNums = [r.mulank.karmicDebt, r.bhagyank.karmicDebt]
            .filter((v): v is number => !!v && v in KARMIC_DEBT);
          const uniqueDebts = [...new Set(karmicDebtNums)];

          return (
            <div ref={resultRef} style={{ scrollMarginTop: "90px" }}>
              {/* ── Section 1: Core Numbers ── */}
              <section className="num-section">
                <h2 className="num-section-title">
                  {isHi ? "आपके मूल अंक" : "Your Core Numbers"}
                </h2>

                <div className="num-core-grid">
                  <CoreCard
                    label="Mulank" labelHi="मूलांक"
                    number={r.mulank.value}
                    sub={isHi ? `जन्म दिन से · ${r.mulank.steps}` : `From birth day · ${r.mulank.steps}`}
                    isHi={isHi}
                  />
                  <CoreCard
                    label="Bhagyank" labelHi="भाग्यांक"
                    number={r.bhagyank.value}
                    sub={isHi ? "पूर्ण जन्म तिथि से" : `From full DOB`}
                    isHi={isHi}
                  />
                  {r.nameNum.value > 0 && (
                    <CoreCard
                      label="Name Number" labelHi="नाम अंक"
                      number={r.nameNum.value}
                      sub={isHi ? "चाल्डियन पद्धति" : "Chaldean system"}
                      isHi={isHi}
                    />
                  )}
                </div>

                {/* Mulank profile description */}
                <div className="num-profile-desc">
                  <span className="num-profile-num">{r.mulank.value}</span>
                  <div>
                    <p><strong>{isHi ? mulankProfile.description.hi : mulankProfile.description.en}</strong></p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginTop: "0.5rem" }}>
                      {(isHi ? mulankProfile.traits.hi : mulankProfile.traits.en).map(t => (
                        <span key={t} className="trait-chip">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Kua Number — Vaastu/Feng-Shui direction number */}
                <div className="result-box" style={{ marginTop: "1rem" }}>
                  <div className="result-label">{isHi ? "कुआ अंक (वास्तु दिशा)" : "Kua Number (Vaastu Direction)"}</div>
                  <div className="result-value">
                    {r.kua.value} — {isHi ? KUA_GROUP_INFO[r.kua.group].label.hi : KUA_GROUP_INFO[r.kua.group].label.en}
                  </div>
                  <p className={`result-explain${isHi ? " devanagari" : ""}`}>
                    {isHi
                      ? "आपका कुआ अंक बताता है कि बैठक, पढ़ाई की मेज़ और बिस्तर के लिए कौन-सी दिशाएँ आपके लिए अधिक शुभ मानी जाती हैं। नीचे आपके समूह की अनुकूल दिशाएँ दी गई हैं:"
                      : "Your Kua Number indicates which directions are traditionally more favorable for your desk, main door, and bed. Your group's favorable directions:"}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginTop: "0.5rem" }}>
                    {KUA_GROUP_INFO[r.kua.group].directions.map(d => (
                      <span key={d.en} className="trait-chip">{isHi ? d.hi : d.en}</span>
                    ))}
                  </div>
                </div>
              </section>

              {/* ── Section 2: Lo Shu Grid ── */}
              <section className="num-section">
                <h2 className="num-section-title">
                  {isHi ? "लो शु ग्रिड" : "Lo Shu Grid"}
                </h2>
                <p className={`num-section-sub${isHi ? " devanagari" : ""}`}>
                  {isHi
                    ? <>आपकी जन्म तिथि के अंकों के साथ <span className="hl">मूलांक, भाग्यांक, नामांक और कुआ अंक</span> भी इस{" "}
                      <span className="hl">3×3 जादुई वर्ग</span> में रखे जाते हैं (सम्पूर्ण-ग्रिड पद्धति)। जो अंक{" "}
                      <span className="hl">उपस्थित</span> हैं वे आपकी शक्ति हैं — जो <span className="hl">अनुपस्थित</span> हैं
                      वे आपके कार्मिक पाठ।</>
                    : <>The digits of your birth date — together with your <span className="hl">Mulank, Bhagyank, Name
                      Number and Kua</span> (the complete-grid method) — are placed in this{" "}
                      <span className="hl">3×3 magic square</span>. <span className="hl">Present numbers</span> = your
                      strengths. <span className="hl">Missing numbers</span> = your karmic lessons to learn.</>}
                </p>

                <div className="lo-shu-wrap">
                  {/* Grid */}
                  <div>
                    <div className="lo-shu-grid">
                      {LO_SHU_GRID.map((row, ri) =>
                        row.map((num, ci) => {
                          const count = r.loShu.counts[num];
                          const isMulank = num === r.mulank.value;
                          const isBhagyank = num === r.bhagyank.value;
                          const isNameNum = r.nameNum.value > 0 && num === r.nameNum.value;
                          const isKua = num === r.kua.value;
                          return (
                            <div
                              key={`${ri}-${ci}`}
                              className={[
                                "lo-shu-cell",
                                count > 0 ? "present" : "missing",
                                count >= 2 ? "strong" : "",
                                count >= 3 ? "very-strong" : "",
                                isMulank ? "is-mulank" : "",
                                isBhagyank && !isMulank ? "is-bhagyank" : "",
                                isNameNum && !isMulank && !isBhagyank ? "is-namenum" : "",
                              ].filter(Boolean).join(" ")}
                            >
                              <span className="lo-shu-num">{num}</span>
                              {count > 1 && <span className="lo-shu-count">×{count}</span>}
                              {count === 0 && <span className="lo-shu-missing-x">✕</span>}
                              <div className="lo-shu-badges">
                                {isMulank && <span className="lsb lsb-m" title="Mulank">M</span>}
                                {isBhagyank && <span className="lsb lsb-b" title="Bhagyank">B</span>}
                                {isNameNum && <span className="lsb lsb-n" title="Name No.">N</span>}
                                {isKua && <span className="lsb lsb-k" title="Kua">K</span>}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* Legend */}
                    <div className="lo-shu-legend">
                      <span><span className="lo-shu-leg present" />  {isHi ? "उपस्थित" : "Present"}</span>
                      <span><span className="lo-shu-leg strong" />   {isHi ? "शक्तिशाली (×2+)" : "Strong (×2+)"}</span>
                      <span><span className="lo-shu-leg missing" />  {isHi ? "अनुपस्थित" : "Missing"}</span>
                      <span><span className="lsb lsb-m" />  {isHi ? "मूलांक" : "Mulank"}</span>
                      <span><span className="lsb lsb-b" />  {isHi ? "भाग्यांक" : "Bhagyank"}</span>
                      <span><span className="lsb lsb-n" />  {isHi ? "नामांक" : "Name No."}</span>
                      <span><span className="lsb lsb-k" />  {isHi ? "कुआ अंक" : "Kua"}</span>
                    </div>
                  </div>

                  {/* Planes table */}
                  <div className="planes-wrap">
                    <table className="planes-table">
                      <thead>
                        <tr>
                          <th>{isHi ? "समतल" : "Plane"}</th>
                          <th>{isHi ? "अंक" : "Numbers"}</th>
                          <th>{isHi ? "स्थिति" : "Present?"}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {PLANES.map(pl => (
                          <tr key={pl.key}>
                            <td>
                              <strong>{isHi ? pl.label.hi : pl.label.en}</strong>
                              <div className="plane-desc">{isHi ? pl.desc.hi : pl.desc.en}</div>
                            </td>
                            <td style={{ fontFamily: "var(--font-display)", color: "var(--maroon-mid)" }}>
                              {pl.numbers.join(" · ")}
                            </td>
                            <td>
                              {r.loShu.planes[pl.key]
                                ? <span className="comp-yes">✓ <span className="comp-yes-text">{isHi ? "पूर्ण" : "Yes"}</span></span>
                                : <span className="comp-no">✗ <span className="comp-no-text">{isHi ? "अपूर्ण" : "No"}</span></span>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>

              {/* ── Section 3: Karmic Numbers ── */}
              <section className="num-section">
                <h2 className="num-section-title">
                  {isHi ? "कार्मिक अंक" : "Karmic Numbers"}
                </h2>

                {/* Karmic Lessons */}
                {r.loShu.karmicLessons.length > 0 ? (
                  <>
                    <h3 className="num-sub-heading">
                      {isHi ? "कार्मिक पाठ (अनुपस्थित अंक)" : "Karmic Lessons — Missing Numbers"}
                    </h3>
                    <p className={`num-section-sub${isHi ? " devanagari" : ""}`} style={{ marginBottom: "1rem" }}>
                      {isHi
                        ? <>ये अंक आपकी जन्म तिथि में <span className="hl">अनुपस्थित</span> हैं। इनके विषय आपके जीवन में
                          बार-बार चुनौती बनकर आते हैं — पिछले जन्मों के <span className="hl">अधूरे सबक</span>।</>
                        : <>These numbers are absent from your birth date. Their themes keep appearing as life&apos;s
                          recurring challenges — <span className="hl">unfinished lessons</span> from past lives.</>}
                    </p>
                    <div className="karmic-lessons-grid">
                      {r.loShu.karmicLessons.map(n => {
                        const kl = KARMIC_LESSONS[n];
                        return (
                          <div key={n} className="karmic-lesson-card">
                            <div className="kl-num">{n}</div>
                            <div className="kl-body">
                              <strong className="kl-theme">{isHi ? kl.theme.hi : kl.theme.en}</strong>
                              <p className="kl-lesson">{isHi ? kl.lesson.hi : kl.lesson.en}</p>
                              <div className="kl-remedy">
                                <strong>{isHi ? "उपाय:" : "Remedy:"}</strong> {isHi ? kl.remedy.hi : kl.remedy.en}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <div className="result-box" style={{ textAlign: "center" }}>
                    <span style={{ color: "var(--gold)", display: "inline-flex" }}><Icon name="sparkle" size={28} /></span>
                    <p style={{ marginTop: "0.5rem" }}>
                      {isHi ? "कोई कार्मिक पाठ नहीं — आपकी जन्म तिथि में सभी अंक उपस्थित हैं। यह दुर्लभ और शुभ है।"
                             : "No missing numbers — all 9 digits present in your birth date. This is rare and auspicious."}
                    </p>
                  </div>
                )}

                {/* Karmic Debt */}
                {uniqueDebts.length > 0 && (
                  <>
                    <h3 className="num-sub-heading" style={{ marginTop: "2rem" }}>
                      {isHi ? "कार्मिक ऋण" : "Karmic Debt"}
                    </h3>
                    <p className={`num-section-sub${isHi ? " devanagari" : ""}`} style={{ marginBottom: "1rem" }}>
                      {isHi
                        ? <><span className="hl">कार्मिक ऋण</span> कार्मिक पाठ से अधिक गहरा है — यह पिछले जन्मों की
                          गलतियों का भार है जो इस जीवन में अनुभव के रूप में आता है।</>
                        : <><span className="hl">Karmic debt</span> goes deeper than a lesson — it carries the weight
                          of past-life actions that must be consciously worked through in this lifetime.</>}
                    </p>
                    {uniqueDebts.map(n => <KarmicDebtBadge key={n} debtNum={n} isHi={isHi} />)}
                  </>
                )}

                {uniqueDebts.length === 0 && r.loShu.karmicLessons.length > 0 && (
                  <div className="result-box" style={{ marginTop: "1rem", background: "rgba(26,122,58,0.05)", borderColor: "rgba(26,122,58,0.3)" }}>
                    <span style={{ color: "#1a7a3a", fontWeight: 700 }}>✓ {isHi ? "कोई कार्मिक ऋण नहीं" : "No Karmic Debt"}</span>
                    <span style={{ marginLeft: "0.5rem", fontSize: "0.875rem", color: "var(--muted)" }}>
                      {isHi ? "आपके मूलांक और भाग्यांक में कोई कार्मिक ऋण नहीं है।" : "Neither Mulank nor Bhagyank carries a karmic debt number (13/14/16/19)."}
                    </span>
                  </div>
                )}
              </section>

              {/* ── Section 4: Favorable Things ── */}
              <section className="num-section">
                <h2 className="num-section-title">
                  {isHi ? `शुभ संकेत (मूलांक ${r.mulank.value} के लिए)` : `Favorable for Mulank ${r.mulank.value}`}
                </h2>
                <p className="num-section-sub">
                  {isHi ? `मूलांक ${r.mulank.value} — ${mulankProfile.planet.hi} द्वारा शासित` : `Mulank ${r.mulank.value} — ruled by ${mulankProfile.planet.en}`}
                </p>

                <div className="fav-grid">
                  {([
                    { icon: "planet",   label: isHi ? "शासक ग्रह" : "Ruling Planet",   val: isHi ? mulankProfile.planet.en : mulankProfile.planet.en },
                    { icon: "star",     label: isHi ? "शुभ राशि" : "Favorable Sign",    val: isHi ? mulankProfile.sign.hi : mulankProfile.sign.en },
                    { icon: "gem",      label: isHi ? "रत्न" : "Gemstone",             val: isHi ? mulankProfile.gemstone.hi : mulankProfile.gemstone.en },
                    { icon: "gem",      label: isHi ? "वैकल्पिक रत्न" : "Alternate Gem",  val: isHi ? mulankProfile.alternateGem.hi : mulankProfile.alternateGem.en },
                    { icon: "calendar", label: isHi ? "शुभ दिन" : "Favorable Day",     val: isHi ? mulankProfile.favorableDay.hi : mulankProfile.favorableDay.en },
                    { icon: "compass",  label: isHi ? "शुभ दिशा" : "Direction",        val: isHi ? mulankProfile.direction.hi : mulankProfile.direction.en },
                    { icon: "droplet",  label: isHi ? "शुभ रंग" : "Favorable Colors",  val: isHi ? mulankProfile.colors.hi.join(", ") : mulankProfile.colors.en.join(", ") },
                    { icon: "temple",   label: isHi ? "देव/देवी" : "God / Goddess",    val: isHi ? mulankProfile.god.hi : mulankProfile.god.en },
                    { icon: "moon",     label: isHi ? "व्रत" : "Fast",                val: isHi ? mulankProfile.fast.hi : mulankProfile.fast.en },
                    { icon: "beads",    label: isHi ? "मंत्र" : "Mantra",              val: mulankProfile.mantra },
                    { icon: "hash",     label: isHi ? "शुभ अंक" : "Lucky Numbers",     val: mulankProfile.luckyNumbers.join(", ") },
                    { icon: "type",     label: isHi ? "शुभ अक्षर" : "Lucky Alphabets", val: mulankProfile.luckyAlphabets.join(", ") },
                    { icon: "calendar", label: isHi ? "शुभ तिथियां" : "Favorable Dates", val: mulankProfile.favorableDates.join(", ") },
                  ] as Array<{ icon: IconName; label: string; val: string }>).map(({ icon, label, val }, fi) => (
                    <div key={`${label}-${fi}`} className="fav-item">
                      <span className="fav-icon"><Icon name={icon} size={20} /></span>
                      <div>
                        <div className="fav-label">{label}</div>
                        <div className="fav-val">{val}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bhagyank profile if different */}
                {r.bhagyank.value !== r.mulank.value && (
                  <div className="result-box" style={{ marginTop: "1.5rem" }}>
                    <p style={{ fontSize: "0.85rem", color: "var(--muted)", marginBottom: "0.5rem" }}>
                      {isHi
                        ? `आपका भाग्यांक (${r.bhagyank.value} — ${bhagyankProfile.planet.hi}) आपके दीर्घकालिक जीवन-पथ को दर्शाता है:`
                        : `Your Bhagyank (${r.bhagyank.value} — ${bhagyankProfile.planet.en}) governs your long-term life path:`}
                    </p>
                    <p style={{ fontSize: "0.875rem", color: "var(--ink-light)" }}>
                      {isHi ? bhagyankProfile.description.hi : bhagyankProfile.description.en}
                    </p>
                  </div>
                )}
              </section>

              {/* ── Section 5: Ask Shivanii ── */}
              <section
                style={{
                  background: "linear-gradient(135deg, var(--maroon-deep), var(--maroon))",
                  borderRadius: "2px",
                  border: "1.5px solid var(--gold)",
                  padding: "2rem",
                  textAlign: "center",
                  marginTop: "1rem",
                }}
              >
                <p style={{ color: "var(--gold)", fontFamily: "var(--font-devanagari)", fontSize: "1.1rem", marginBottom: "0.5rem" }}>
                  {isHi ? "इन अंकों का आपके जीवन पर क्या प्रभाव है?" : "What do these numbers mean for YOUR life?"}
                </p>
                <h3 style={{ color: "var(--gold-bright)", marginBottom: "0.75rem" }}>
                  {isHi ? "शिवानी जी से व्यक्तिगत विश्लेषण पाएं" : "Get a personal reading from Shivanii"}
                </h3>
                <p style={{ color: "var(--gold-pale)", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
                  {isHi
                    ? "अंक आपकी कुंडली और जीवन की परिस्थितियों के साथ मिलकर एक पूरी तस्वीर बनाते हैं — जो केवल एक अनुभवी ज्योतिषी ही देख सकते हैं।"
                    : "Numbers combined with your birth chart and life circumstances paint a complete picture — one only an experienced astrologer can interpret personally."}
                </p>
                <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${buildWaMsg()}`}
                    target="_blank" rel="noopener noreferrer"
                    className="btn btn-primary btn-lg"
                  >
                    {isHi ? "WhatsApp पर पूछें" : "Ask Shivanii on WhatsApp"}
                  </a>
                  <Link href="/book" className="btn btn-ghost btn-lg"
                    style={{ color: "var(--gold-bright)", borderColor: "var(--gold)" }}>
                    {isHi ? "पाठन बुक करें" : "Book a Full Reading"}
                  </Link>
                </div>
                <p style={{ color: "var(--gold-pale)", fontSize: "0.78rem", marginTop: "1rem", opacity: 0.75 }}>
                  {isHi ? "आपकी जानकारी पहले से भरी जाएगी" : "Your numerology summary will be pre-filled in the message"}
                </p>
              </section>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
