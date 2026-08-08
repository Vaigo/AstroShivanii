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
