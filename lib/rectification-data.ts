/** Time Rectification — the fixed life-event vocabulary the paid tool's
 *  event rows pick from. This MUST stay in sync with the `EventType` Literal
 *  in backend/app/routers/rectification.py (GrahaAPI repo) — the backend
 *  rejects (422) any category not in that exact list, by design (a closed
 *  vocabulary, not free text, so a typo surfaces immediately instead of
 *  silently corrupting the rectification score). Add/remove a category in
 *  both places together. */

export type EventTypeKey =
  | "marriage" | "divorce" | "child_birth" | "job_start" | "job_loss" | "promotion"
  | "accident" | "illness" | "surgery" | "death_relative" | "foreign_travel"
  | "property" | "education" | "business" | "spiritual" | "financial_gain"
  | "financial_loss" | "relocation" | "legal_trouble" | "award";

export interface Bilingual { en: string; hi: string; }

export interface EventTypeDef {
  key: EventTypeKey;
  label: Bilingual;
}

export const EVENT_TYPES: EventTypeDef[] = [
  { key: "marriage", label: { en: "Marriage", hi: "विवाह" } },
  { key: "divorce", label: { en: "Divorce", hi: "तलाक" } },
  { key: "child_birth", label: { en: "Child birth", hi: "बच्चे का जन्म" } },
  { key: "job_start", label: { en: "New job / job start", hi: "नई नौकरी" } },
  { key: "job_loss", label: { en: "Job loss", hi: "नौकरी छूटना" } },
  { key: "promotion", label: { en: "Promotion", hi: "पदोन्नति" } },
  { key: "accident", label: { en: "Accident", hi: "दुर्घटना" } },
  { key: "illness", label: { en: "Illness", hi: "बीमारी" } },
  { key: "surgery", label: { en: "Surgery", hi: "शल्य चिकित्सा" } },
  { key: "death_relative", label: { en: "Death of a relative", hi: "परिवार में मृत्यु" } },
  { key: "foreign_travel", label: { en: "Foreign travel", hi: "विदेश यात्रा" } },
  { key: "property", label: { en: "Property bought/sold", hi: "संपत्ति खरीद/बिक्री" } },
  { key: "education", label: { en: "Education milestone", hi: "शिक्षा में उपलब्धि" } },
  { key: "business", label: { en: "Business", hi: "व्यापार / व्यवसाय" } },
  { key: "spiritual", label: { en: "Spiritual event", hi: "आध्यात्मिक अनुभव" } },
  { key: "financial_gain", label: { en: "Financial gain", hi: "आर्थिक लाभ" } },
  { key: "financial_loss", label: { en: "Financial loss", hi: "आर्थिक हानि" } },
  { key: "relocation", label: { en: "Relocation", hi: "स्थान परिवर्तन" } },
  { key: "legal_trouble", label: { en: "Legal trouble", hi: "कानूनी विवाद" } },
  { key: "award", label: { en: "Award / recognition", hi: "सम्मान / पुरस्कार" } },
];

/** Predisposition questions — an OPTIONAL, second signal alongside the dated
 *  events above. Unlike events (tied to a specific date, checked against
 *  which dasha was running), these are static life-pattern questions
 *  checked against each candidate chart's overall structure — the person
 *  answers plain self-knowledge questions, never astrology terms. Must stay
 *  in sync with `PredispositionType` in backend/app/routers/rectification.py
 *  (GrahaAPI repo) — same closed-vocabulary rule as EVENT_TYPES above.
 *
 *  Tested against one real known-birth-time case (2026-08-06/07): this
 *  signal is mechanically sound but did NOT improve that case's ranking —
 *  it's a genuine bonus signal, not a proven accuracy improver, which is
 *  why the UI must present it as optional and skippable, not as a
 *  guaranteed-better-result step. */
export type PredispositionTypeKey =
  | "early_marriage" | "childlessness_difficulty" | "foreign_settlement"
  | "career_recognition" | "solitude_tendency" | "accident_prone" | "artistic_inclination";

export interface PredispositionDef {
  key: PredispositionTypeKey;
  question: Bilingual;
}

export const PREDISPOSITIONS: PredispositionDef[] = [
  { key: "early_marriage", question: {
      en: "Did you marry earlier than usual, or was it arranged unusually smoothly/quickly?",
      hi: "क्या आपकी शादी सामान्य से पहले हुई, या असामान्य रूप से आसानी/जल्दी तय हुई?" } },
  { key: "childlessness_difficulty", question: {
      en: "Have you faced (or do you expect) real difficulty having children?",
      hi: "क्या आपको बच्चे होने में कोई असल कठिनाई हुई है (या होने की संभावना है)?" } },
  { key: "foreign_settlement", question: {
      en: "Do you have a strong pull toward living abroad or foreign work connections?",
      hi: "क्या आपका विदेश में रहने या विदेशी कार्य-संबंधों की ओर मजबूत रुझान है?" } },
  { key: "career_recognition", question: {
      en: "Have you received notable recognition or authority in your career/society?",
      hi: "क्या आपको अपने करियर या समाज में उल्लेखनीय पहचान या अधिकार मिला है?" } },
  { key: "solitude_tendency", question: {
      en: "Do you lean toward being alone/independent more than most people around you?",
      hi: "क्या आप अपने आस-पास के लोगों की तुलना में अकेले/स्वतंत्र रहना अधिक पसंद करते हैं?" } },
  { key: "accident_prone", question: {
      en: "Setting aside any one specific accident — are you generally accident-prone as a life pattern?",
      hi: "किसी एक दुर्घटना को छोड़कर — क्या आप सामान्यतः दुर्घटना-प्रवृत्त रहे हैं?" } },
  { key: "artistic_inclination", question: {
      en: "Do you have a strong pull toward music, art, or other creative pursuits?",
      hi: "क्या आपका संगीत, कला या अन्य रचनात्मक कार्यों की ओर मजबूत रुझान है?" } },
];

export type PredispositionAnswerKey = "yes_strong" | "yes" | "unsure" | "no" | "no_strong";

export const PREDISPOSITION_ANSWERS: { key: PredispositionAnswerKey; label: Bilingual }[] = [
  { key: "yes_strong", label: { en: "Yes, strongly", hi: "हाँ, पूरी तरह" } },
  { key: "yes", label: { en: "Yes", hi: "हाँ" } },
  { key: "unsure", label: { en: "Not sure", hi: "पता नहीं" } },
  { key: "no", label: { en: "No", hi: "नहीं" } },
  { key: "no_strong", label: { en: "No, definitely not", hi: "नहीं, बिल्कुल नहीं" } },
];
