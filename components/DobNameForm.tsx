"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n";

interface DobNameFormProps {
  onSubmit: (data: { dob: string; name: string; system: "chaldean" | "pythagorean" }) => void;
  loading?: boolean;
  /** Name field shown and HTML-required (e.g. Favorable Alphabet). Default true. */
  nameRequired?: boolean;
  /** Hide the name field entirely and silently submit name:"" — for Personal
   *  Year, where the API requires the JSON key present but never reads it. */
  hideName?: boolean;
}

/** Shared form for numerology tools that need only dob (+ optional name) —
 *  no place/lat/lon/tz, which BirthForm always collects via PlaceSearch. */
export default function DobNameForm({ onSubmit, loading, nameRequired = true, hideName }: DobNameFormProps) {
  const { t, lang } = useI18n();
  const isHi = lang === "hi";
  const [dob, setDob] = useState("");
  const [name, setName] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!dob) return;
    if (!hideName && nameRequired && !name.trim()) return;
    onSubmit({ dob, name: hideName ? "" : name, system: "chaldean" });
  }

  return (
    <form onSubmit={handleSubmit}>
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
      </div>

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
          {!nameRequired && (
            <span className="form-hint">
              {isHi ? "वैकल्पिक — नाम-आधारित अंक जोड़ता है" : "Optional — adds name-based number checks"}
            </span>
          )}
        </div>
      )}

      <button
        type="submit"
        className="btn btn-primary"
        disabled={loading || !dob || (!hideName && nameRequired && !name.trim())}
        style={{ width: "100%" }}
      >
        {loading ? t("form.calculating") : t("form.calculate")}
      </button>
    </form>
  );
}
