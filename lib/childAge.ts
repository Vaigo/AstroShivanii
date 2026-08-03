/** Age/life-stage from a birth date — pure client-side date arithmetic, no
 *  backend call. Bucket boundaries deliberately mirror
 *  backend/app/core/report_narration.py::_life_stage() so the same person
 *  gets the same life-stage label whether the site or the PDF report is
 *  talking about them. Kept as a separate port (not a shared import) since
 *  the two apps are separate deploys. */

export type LifeStage = "शिशु" | "बालक/बालिका" | "किशोर/किशोरी" | "वयस्क";

export interface AgeInfo {
  ageYears: number;
  lifeStage: LifeStage;
}

export function ageYearsAndStage(dob: string): AgeInfo | null {
  const parts = dob.split("-").map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) return null;
  const [y, m, d] = parts;
  const born = new Date(y, m - 1, d);
  if (Number.isNaN(born.getTime())) return null;

  const today = new Date();
  let ageYears = today.getFullYear() - born.getFullYear();
  const beforeBirthdayThisYear =
    today.getMonth() < born.getMonth() ||
    (today.getMonth() === born.getMonth() && today.getDate() < born.getDate());
  if (beforeBirthdayThisYear) ageYears -= 1;
  if (ageYears < 0) ageYears = 0;

  const lifeStage: LifeStage =
    ageYears < 2 ? "शिशु" : ageYears < 13 ? "बालक/बालिका" : ageYears < 18 ? "किशोर/किशोरी" : "वयस्क";

  return { ageYears, lifeStage };
}
