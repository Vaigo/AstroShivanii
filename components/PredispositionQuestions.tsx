"use client";

import { useI18n } from "@/lib/i18n";
import {
  PREDISPOSITIONS, PREDISPOSITION_ANSWERS,
  type PredispositionTypeKey, type PredispositionAnswerKey,
} from "@/lib/rectification-data";

interface PredispositionQuestionsProps {
  answers: Partial<Record<PredispositionTypeKey, PredispositionAnswerKey>>;
  onChange: (answers: Partial<Record<PredispositionTypeKey, PredispositionAnswerKey>>) => void;
}

/** Optional bonus signal alongside the dated life events: static,
 *  date-independent self-report questions checked against each candidate
 *  chart's overall structure, not a specific date. Every question defaults
 *  to "unsure" — leaving all of them on "unsure" sends nothing extra to the
 *  backend, reproducing the exact pre-existing result. */
export default function PredispositionQuestions({ answers, onChange }: PredispositionQuestionsProps) {
  const { lang } = useI18n();
  const isHi = lang === "hi";

  function setAnswer(key: PredispositionTypeKey, value: PredispositionAnswerKey) {
    onChange({ ...answers, [key]: value });
  }

  return (
    <div>
      {PREDISPOSITIONS.map((p) => (
        <div key={p.key} className="form-group" style={{ marginBottom: "0.9rem" }}>
          <label className={`form-label${isHi ? " devanagari" : ""}`}>
            {isHi ? p.question.hi : p.question.en}
          </label>
          <select
            className="form-select"
            value={answers[p.key] ?? "unsure"}
            onChange={(e) => setAnswer(p.key, e.target.value as PredispositionAnswerKey)}
          >
            {PREDISPOSITION_ANSWERS.map((a) => (
              <option key={a.key} value={a.key}>{isHi ? a.label.hi : a.label.en}</option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}
