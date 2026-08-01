/**
 * ARCHITECTURE DECISION (2026-07-19): numerology stays CLIENT-SIDE, deliberately.
 * GrahaAPI has /v1/numerology/* endpoints, but this free tool needs no birth
 * time/geo — it is pure deterministic arithmetic over DOB + name. Local compute
 * means instant results, zero API quota, and the tool works even if the API is
 * unreachable. If the site ever adds numerology features that must match the
 * API's outputs exactly (e.g. paid PDF reports citing Kua/personal-year), switch
 * those specific calls to GrahaAPI rather than duplicating logic here.
 */
import { LO_SHU_GRID } from "./numerology-data";

/* ─── Helpers ────────────────────────────────────────────────────────────────── */
function sumDigits(n: number): number {
  return String(n).split("").reduce((a, d) => a + parseInt(d), 0);
}

function reduceWithKarmic(n: number): { value: number; karmicDebt?: number } {
  if ([13, 14, 16, 19].includes(n)) return { value: sumDigits(n), karmicDebt: n };
  if (n > 9) return reduceWithKarmic(sumDigits(n));
  return { value: n };
}

/* ─── Mulank (Psychic / Root Number) ────────────────────────────────────────── */
export function calcMulank(dob: string): { value: number; karmicDebt?: number; steps: string } {
  const day = parseInt(dob.split("-")[2]);
  const { value, karmicDebt } = reduceWithKarmic(day);
  const steps = day > 9 ? `${day} → ${String(day).split("").join("+")} = ${value}` : `${day}`;
  return { value, karmicDebt, steps };
}

/* ─── Bhagyank (Destiny / Life-Path Number) ─────────────────────────────────── */
export function calcBhagyank(dob: string): { value: number; karmicDebt?: number; steps: string } {
  const digits = dob.replace(/-/g, "").split("").map(Number);
  const total = digits.reduce((a, d) => a + d, 0);
  const { value, karmicDebt } = reduceWithKarmic(total);
  const steps = `${digits.join("+")} = ${total} → ${value}`;
  return { value, karmicDebt, steps };
}

/* ─── Name Number (Chaldean system) ─────────────────────────────────────────── */
const CHALDEAN: Record<string, number> = {
  A:1, B:2, C:3, D:4, E:5, F:8, G:3, H:5, I:1,
  J:1, K:2, L:3, M:4, N:5, O:7, P:8, Q:1, R:2,
  S:3, T:4, U:6, V:6, W:6, X:5, Y:1, Z:7,
};

export function calcNameNumber(name: string): { value: number; karmicDebt?: number; steps: string } {
  const clean = name.toUpperCase().replace(/[^A-Z]/g, "");
  if (!clean) return { value: 0, steps: "" };
  const total = clean.split("").reduce((a, c) => a + (CHALDEAN[c] ?? 0), 0);
  const { value, karmicDebt } = reduceWithKarmic(total);
  const steps = `${clean.split("").map(c => `${c}=${CHALDEAN[c] ?? 0}`).join(" ")} = ${total} → ${value}`;
  return { value, karmicDebt, steps };
}

/* ─── Lo Shu Grid ────────────────────────────────────────────────────────────── */
export interface LoShuResult {
  counts: Record<number, number>;    // how many times each digit 1-9 appears
  missing: number[];                  // digits absent from DOB
  present: number[];                  // digits present
  planes: Record<string, boolean>;    // whether each plane is complete
  karmicLessons: number[];            // = missing numbers
}

export function calcLoShu(dob: string): LoShuResult {
  const digits = dob.replace(/-/g, "").split("").map(Number).filter(d => d >= 1 && d <= 9);

  const counts: Record<number, number> = {};
  for (let i = 1; i <= 9; i++) counts[i] = 0;
  digits.forEach(d => counts[d]++);

  const present = Object.keys(counts).map(Number).filter(n => counts[n] > 0);
  const missing = Object.keys(counts).map(Number).filter(n => counts[n] === 0);

  const planes: Record<string, boolean> = {};
  const PLANE_NUMBERS: Record<string, number[]> = {
    mental: [4, 9, 2], emotional: [3, 5, 7], practical: [8, 1, 6],
    vision: [4, 3, 8], will: [9, 5, 1],      action: [2, 7, 6],
    golden: [4, 5, 6], silver: [2, 5, 8],
  };
  for (const [key, nums] of Object.entries(PLANE_NUMBERS)) {
    planes[key] = nums.every(n => counts[n] > 0);
  }

  return { counts, present, missing, planes, karmicLessons: missing };
}

/* ─── Kua Number (Vaastu/Feng-Shui direction number, from birth year + gender) ── */
export function calcKua(dob: string, gender: "male" | "female"): { value: number; group: "east" | "west" } {
  const year = parseInt(dob.split("-")[0]);
  let s = sumDigits(year % 100);
  while (s > 9) s = sumDigits(s);
  const post2000 = year >= 2000;
  let kua = gender === "male" ? (post2000 ? 9 - s : 10 - s) : (post2000 ? 6 + s : 5 + s);
  while (kua > 9) kua = sumDigits(kua);
  if (kua <= 0) kua = 9;
  if (kua === 5) kua = gender === "male" ? 2 : 8;
  const group: "east" | "west" = [1, 3, 4, 9].includes(kua) ? "east" : "west";
  return { value: kua, group };
}

/* ─── Grid position of a number ─────────────────────────────────────────────── */
export function gridPosition(n: number): [number, number] | null {
  for (let r = 0; r < 3; r++)
    for (let c = 0; c < 3; c++)
      if (LO_SHU_GRID[r][c] === n) return [r, c];
  return null;
}
