"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n";

/** Sent silently when a tool hides the DOB field — the API's shared request
 *  schema requires the `dob` key to be present, but that specific
 *  calculation never reads its value (see Favorable Alphabet). Never shown
 *  to the user and never used for anything. */
const UNUSED_DOB_PLACEHOLDER = "2000-01-01";

interface Bilingual { en: string; hi: string; }

interface DobNameFormProps {
  onSubmit: (data: { dob: string; name: string; system: "chaldean" | "pythagorean" }) => void;
  loading?: boolean;
  /** Name field shown and HTML-required (e.g. Favorable Alphabet). Default true. */
  nameRequired?: boolean;
  /** Hide the name field entirely and silently submit name:"" — for Personal
   *  Year, where the API requires the JSON key present but never reads it. */
  hideName?: boolean;
  /** Hide the DOB field entirely and silently submit a fixed, never-shown
   *  placeholder date — for Favorable Alphabet, where the API requires the
   *  JSON key present but the first-letter calculation only ever reads the
   *  name (verified against backend/app/routers/numerology.py). Asking a
   *  visitor for a birth date that provably does nothing to the result
   *  would be misleading, not just unnecessary. */
  hideDob?: boolean;
  /** Tool-specific reason THIS date matters, shown under the field. Falls
   *  back to a generic line if omitted. */
  dobHint?: Bilingual;
  /** Tool-specific reason spelling matters, shown under the field. Falls
   *  back to a generic line (worded for the required/optional case) if
   *  omitted. */
  nameHint?: Bilingual;
}

const DEFAULT_DOB_HINT: Bilingual = {
  en: "Used exactly as entered — every digit of this date feeds the calculation below.",
  hi: "इसे ठीक वैसे ही उपयोग किया जाता है जैसा दर्ज किया गया है — इस तारीख का हर अंक नीचे की गणना में इस्तेमाल होता है।",
};

const DEFAULT_NAME_HINT_REQUIRED: Bilingual = {
  en: "Spelling matters — changing even one letter changes the numbers below. Enter it exactly as you'd like it read (a nickname will not give the same result as your full legal name).",
  hi: "वर्तनी मायने रखती है — एक भी अक्षर बदलने से नीचे के अंक बदल जाते हैं। जो नाम जांचना है उसे ठीक उसी वर्तनी में लिखें (उपनाम/छोटा नाम पूरे कानूनी नाम जैसा परिणाम नहीं देगा)।",
};

const DEFAULT_NAME_HINT_OPTIONAL: Bilingual = {
  en: "Optional — add it to also check name-based numbers. If you do, spelling matters: even one letter can change the result, so use the exact name you want checked.",
  hi: "वैकल्पिक — जोड़ने पर नाम-आधारित अंकों की भी जांच होती है। ध्यान रहे, वर्तनी मायने रखती है — एक अक्षर बदलने से भी परिणाम बदल सकता है, इसलिए वही नाम लिखें जिसकी जांच करनी है।",
};

/** Shared form for numerology tools that need only dob (+ optional name) —
 *  no place/lat/lon/tz, which BirthForm always collects via PlaceSearch. */
export default function DobNameForm({
  onSubmit, loading, nameRequired = true, hideName, hideDob, dobHint, nameHint,
}: DobNameFormProps) {
  const { t, lang } = useI18n();
  const isHi = lang === "hi";
  const [dob, setDob] = useState(hideDob ? UNUSED_DOB_PLACEHOLDER : "");
  const [name, setName] = useState("");

  const resolvedNameHint = nameHint ?? (nameRequired ? DEFAULT_NAME_HINT_REQUIRED : DEFAULT_NAME_HINT_OPTIONAL);
  const resolvedDobHint = dobHint ?? DEFAULT_DOB_HINT;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!hideDob && !dob) return;
    if (!hideName && nameRequired && !name.trim()) return;
    onSubmit({ dob: hideDob ? UNUSED_DOB_PLACEHOLDER : dob, name: hideName ? "" : name, system: "chaldean" });
  }

  return (
    <form onSubmit={handleSubmit}>
      {!hideDob && (
        <div className="form-group">
          <label className="form-label">{t("form.dob")}</label>
          <input
            type="date"
            className="form-input"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            required
            max={new Date().toISOString().split("T")[0]}
          />
          <span className={`form-hint${isHi ? " devanagari" : ""}`}>
            {isHi ? resolvedDobHint.hi : resolvedDobHint.en}
          </span>
        </div>
      )}

      {!hideName && (
        <div className="form-group">
          <label className="form-label">
            {isHi ? "पूरा नाम" : "Full Name"}{nameRequired ? " *" : ""}
          </label>
          <input
            type="text"
            className="form-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required={nameRequired}
            placeholder={isHi ? "जैसा जन्म प्रमाणपत्र पर हो" : "As on birth certificate"}
          />
          <span className={`form-hint${isHi ? " devanagari" : ""}`}>
            {isHi ? resolvedNameHint.hi : resolvedNameHint.en}
          </span>
        </div>
      )}

      <button
        type="submit"
        className="btn btn-primary"
        disabled={loading || (!hideDob && !dob) || (!hideName && nameRequired && !name.trim())}
        style={{ width: "100%" }}
      >
        {loading ? t("form.calculating") : t("form.calculate")}
      </button>
    </form>
  );
}
