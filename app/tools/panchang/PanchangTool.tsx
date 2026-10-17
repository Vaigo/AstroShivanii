"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import PatrikaFrame from "@/components/PatrikaFrame";
import DownloadReportButton from "@/components/DownloadReportButton";
import ResultCTA from "@/components/ResultCTA";
import PlaceSearch, { Place } from "@/components/PlaceSearch";
import { utcOffsetHoursAt, nowMinutesInZone, todayInZone } from "@/lib/timezone";
import { choghadiya, horas, isPanchak, isBhadra, toHHMM, TimeSlot } from "@/lib/panchang-calc";
import DayNightDonut from "@/components/panchang/DayNightDonut";
import CurrentStatusBanner from "@/components/panchang/CurrentStatusBanner";
import MoonSignPanel from "@/components/panchang/MoonSignPanel";
import HeavenlyPulse from "@/components/panchang/HeavenlyPulse";
import ChoghadiyaGrid from "@/components/panchang/ChoghadiyaGrid";
import { fetchPanchang, fetchRahuKaal, fetchMuhurta, fetchFestivals } from "@/lib/api/endpoints";
import type { PanchangFullResult, RahuKaalResult, MuhurtaSlot, FestivalItem, MasaInfo, PanchangDayInfo } from "@/lib/api/types";
import { ApiError } from "@/lib/api/client";
import { useBackStep } from "@/lib/useBackStep";
import { PLANET_HI, weekdayHi, yogaNameHi, karanaNameHi, moonPhaseHi, pickMessageLang } from "@/lib/hindi-labels";

/** Today's date AS OBSERVED in `tzName` — never `toISOString()`'s UTC date,
 *  which silently returns YESTERDAY for any IST-side viewer for the ~5.5
 *  hours between 18:30 and 24:00 UTC (00:00–05:30 IST). Defaults to
 *  DEFAULT_PLACE's zone for call sites before a place has been chosen. */
function today(tzName: string = DEFAULT_PLACE.tzName): string {
  return todayInZone(tzName, new Date());
}

function toMins(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + (m || 0);
}

/** Sunrise→sunset drawn as one band: red = the three kaal windows to avoid,
 *  green = Abhijit muhurta, maroon line = "now" (when viewing today).
 *  Answers "when is today safe?" as a picture instead of four boxes. */
function DayStrip({ sunrise, sunset, kaal, abhijit, isToday, nowMinInPlace, isHi }: {
  sunrise: string; sunset: string;
  kaal: RahuKaalResult | null;
  abhijit: MuhurtaSlot | null;
  isToday: boolean;
  isHi: boolean;
  /** Minutes-since-midnight IN THE QUERIED PLACE'S timezone — NOT the
   *  browser's own clock, which would misplace the "now" marker for anyone
   *  checking a city in a different timezone than their own device. */
  nowMinInPlace: number;
}) {
  const t0 = toMins(sunrise), t1 = toMins(sunset);
  const span = t1 - t0;

  // Labels must be hidden by actual PIXEL width, not a fixed percentage — a
  // window at 10% of a ~700px desktop strip has room for a label, but 10%
  // of a ~330px mobile strip (~33px) doesn't fit even "गुलिक" without
  // butting up against its neighbor, reading as cramped/overlapping text.
  // (Hooks first, before the early return: React needs the same hooks on
  // every render, whatever sunrise/sunset come back.)
  const stripRef = useRef<HTMLDivElement>(null);
  const [stripWidth, setStripWidth] = useState(0);
  const hasStrip = span > 0;
  useEffect(() => {
    const el = stripRef.current;
    if (!el) return;
    const update = () => setStripWidth(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [hasStrip]);
  const MIN_LABEL_PX = 42;

  if (!hasStrip) return null;
  const pct = (hhmm: string) => Math.max(0, Math.min(100, ((toMins(hhmm) - t0) / span) * 100));

  const windows: Array<{ from: string; to: string; label: string; cls: "kaal" | "shubh" }> = [];
  if (kaal) {
    windows.push(
      { from: kaal.rahu_kaal.start, to: kaal.rahu_kaal.end, label: isHi ? "राहु काल" : "Rahu Kaal", cls: "kaal" },
      { from: kaal.gulika_kaal.start, to: kaal.gulika_kaal.end, label: isHi ? "गुलिक" : "Gulika", cls: "kaal" },
      { from: kaal.yamaganda.start, to: kaal.yamaganda.end, label: isHi ? "यमगण्ड" : "Yamaganda", cls: "kaal" },
    );
  }
  if (abhijit) windows.push({ from: abhijit.start, to: abhijit.end, label: isHi ? "अभिजीत" : "Abhijit", cls: "shubh" });

  const nowMins = nowMinInPlace;
  const showNow = isToday && nowMins > t0 && nowMins < t1;

  return (
    <div className="day-strip-wrap">
      <div className="day-strip" ref={stripRef} style={{ marginTop: showNow ? "1.3rem" : 0 }}>
        {windows.map((w) => {
          const left = pct(w.from);
          const width = Math.max(pct(w.to) - left, 1.5);
          const widthPx = (width / 100) * stripWidth;
          return (
            <div
              key={`${w.label}-${w.from}`}
              className={`day-strip-window ${w.cls}`}
              style={{ left: `${left}%`, width: `${width}%` }}
              title={`${w.label}: ${w.from}–${w.to}`}
            >
              {widthPx > MIN_LABEL_PX && w.label}
            </div>
          );
        })}
        {showNow && (
          <div className="day-strip-now" style={{ left: `${((nowMins - t0) / span) * 100}%` }} aria-hidden="true" />
        )}
      </div>
      <div className={`day-strip-labels${isHi ? " devanagari" : ""}`}>
        <span>☀ {sunrise} {isHi ? "सूर्योदय" : "Sunrise"}</span>
        <span>{isHi ? "लाल = टालें · हरा = श्रेष्ठ" : "Red = avoid · Green = best"}</span>
        <span>{isHi ? "सूर्यास्त" : "Sunset"} {sunset} ☾</span>
      </div>
    </div>
  );
}

const WEEKDAY_HI = ["रवि", "सोम", "मंगल", "बुध", "गुरु", "शुक्र", "शनि"];
const WEEKDAY_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_HI = ["जनवरी", "फ़रवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितम्बर", "अक्टूबर", "नवम्बर", "दिसम्बर"];
const MONTH_EN = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
/** Hora lords come from lib/panchang-calc in Hindi */
const HORA_EN: Record<string, string> = { "सूर्य": "Sun", "शुक्र": "Venus", "बुध": "Mercury", "चंद्र": "Moon", "शनि": "Saturn", "गुरु": "Jupiter", "मंगल": "Mars" };
/** Weekly weekday-vrats (every Somvar/Shanivar…) would mark almost every
 *  Monday/Saturday — same reasoning as festivals-2026/page.tsx: list the
 *  tithi-based ones distinctly, mention weekly vrats in prose instead. */
const WEEKLY_VRAT = /^(Somvar|Mangalvar|Budhvar|Guruvar|Shukravar|Shanivar|Ravivar)/i;

/** Named major festivals (Diwali, Teej, Rakhi …) share one festive marigold
 *  accent; routine tithi vrats keep category colors so each TYPE is
 *  distinguishable at a glance. */
const MAJOR_COLOR = "#c2410c";
function festivalColor(f: { name: string; major?: boolean }): string {
  if (f.major) return MAJOR_COLOR;
  return categoryColor(f.name);
}
function categoryColor(name: string): string {
  if (/Ekadashi/i.test(name))  return "#3d6b9c";  // Vishnu — blue
  if (/Pradosh/i.test(name))   return "#b3423a";  // Shiva — deep red
  if (/Chaturthi/i.test(name)) return "#d9822b";  // Ganesh — saffron
  if (/Navami/i.test(name))    return "#a8455a";  // Devi/Rama — rose
  if (/Purnima/i.test(name))   return "#c99a3a";  // full moon — bright gold
  if (/Amavasya/i.test(name) || /Sankranti/i.test(name)) return "#5a5478";  // deep indigo
  return "#8a6414";                                // generic — warm ochre
}

/** "रक्षाबंधन" in Hindi mode when the API provides it, else the English name. */
const festLabel = (f: FestivalItem, isHi: boolean) => (isHi && f.name_hi ? f.name_hi : f.name);

const MASA_LABEL = (m: MasaInfo | undefined, isHi: boolean) => (m ? (isHi ? m.name_hi : m.name) : null);

/** Whole-month calendar grid — festival days get a colored accent bar + the
 *  festival name so they read as visually distinct at a glance, plus the
 *  Hindu lunar month(s) this Gregorian month overlaps, and a full-text
 *  festival list below (the grid necessarily truncates names). */
function MonthCalendar({ year, month, festivals, dayInfos, masaStart, masaEnd, isHi, onPrev, onNext, onPickDay, isToday }: {
  year: number; month: number; // month: 0-indexed
  festivals: FestivalItem[];
  dayInfos: Map<string, PanchangDayInfo>;
  masaStart?: MasaInfo; masaEnd?: MasaInfo;
  isHi: boolean;
  onPrev: () => void; onNext: () => void;
  onPickDay: (iso: string) => void;
  isToday: (iso: string) => boolean;
}) {
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const festByDate = new Map<string, FestivalItem[]>();
  for (const f of festivals) {
    if (!festByDate.has(f.date)) festByDate.set(f.date, []);
    festByDate.get(f.date)!.push(f);
  }
  // Major festivals lead within each day — they're what the cell shows.
  for (const list of festByDate.values()) {
    list.sort((a, b) => Number(b.major ?? false) - Number(a.major ?? false));
  }

  const cells: Array<{ day: number; iso: string } | null> = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, iso: `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}` });
  }
  while (cells.length % 7 !== 0) cells.push(null);

  const masaA = MASA_LABEL(masaStart, isHi);
  const masaB = MASA_LABEL(masaEnd, isHi);
  const masaLabel = masaA && masaB ? (masaA === masaB ? masaA : `${masaA} – ${masaB}`) : masaA ?? masaB;
  const dev = isHi ? "devanagari " : "";

  const sortedFests = [...festivals].sort((a, b) => a.date.localeCompare(b.date));
  const majorFests = sortedFests.filter((f) => f.major);
  const vratFests = sortedFests.filter((f) => !f.major);

  const FestRow = ({ f }: { f: FestivalItem }) => {
    const color = festivalColor(f);
    const weekday = (isHi ? WEEKDAY_HI : WEEKDAY_EN)[new Date(`${f.date}T12:00:00`).getDay()];
    return (
      <button type="button" className="pcal-fest-row" onClick={() => onPickDay(f.date)}
        style={{ borderLeftColor: color, background: `${color}0d` }}>
        <span className={`pcal-date-chip${isHi ? " devanagari" : ""}`}>
          <span className="dnum">{parseInt(f.date.slice(8, 10), 10)}</span>
          <span className="dvar">{weekday}</span>
        </span>
        <span style={{ minWidth: 0 }}>
          <span className={isHi ? "devanagari" : undefined} style={{ fontWeight: 700, fontSize: f.major ? "0.95rem" : "0.85rem", color: f.major ? MAJOR_COLOR : "var(--maroon-deep)", display: "block" }}>
            {f.major && "✦ "}{festLabel(f, isHi)}
            {isHi && f.name_hi && <span style={{ fontWeight: 500, color: "var(--muted)", fontSize: "0.75rem" }}> · {f.name}</span>}
          </span>
          <span style={{ color: "var(--ink-light)", fontSize: "0.76rem", display: "block", marginTop: "0.1rem" }}>{f.significance}</span>
        </span>
      </button>
    );
  };

  return (
    <div>
      <div className="pcal-head">
        <button type="button" className="btn btn-ghost btn-sm" onClick={onPrev} aria-label={isHi ? "पिछला महीना" : "Previous month"} style={{ fontSize: "1.1rem" }}>←</button>
        <h3 className={`${dev}pcal-month`}>❈ {(isHi ? MONTH_HI : MONTH_EN)[month]} {year} ❈</h3>
        <button type="button" className="btn btn-ghost btn-sm" onClick={onNext} aria-label={isHi ? "अगला महीना" : "Next month"} style={{ fontSize: "1.1rem" }}>→</button>
      </div>
      {masaLabel && (
        <p className={`${dev}pcal-masa`}>
          {isHi ? "विक्रम संवत् मास" : "Vikram Samvat masa"}: {masaLabel}
        </p>
      )}

      <div className="pcal-dow-row">
        {(isHi ? WEEKDAY_HI : WEEKDAY_EN).map((w, i) => (
          <div key={w} className={`${dev}pcal-dow${i === 0 ? " sun" : ""}`}>{w}</div>
        ))}
      </div>

      <div className="pcal-grid">
        {cells.map((c, i) => {
          if (!c) return <div key={`b${i}`} />;
          const fests = festByDate.get(c.iso) ?? [];
          const lead = fests[0];
          const accent = lead ? festivalColor(lead) : null;
          const today = isToday(c.iso);
          const info = dayInfos.get(c.iso);
          // "कृष्ण तृतीया" → "कृ. तृतीया", "Krishna Tritiya" → "Kr. Tritiya" — keeps the cell line short
          const tithiShort = isHi
            ? info?.tithi_hi.replace("शुक्ल ", "शु. ").replace("कृष्ण ", "कृ. ")
            : info?.tithi.replace("Shukla ", "Sh. ").replace("Krishna ", "Kr. ");
          const cls = ["pcal-cell", lead?.major ? "major" : "", today ? "today" : ""].filter(Boolean).join(" ");
          return (
            <button
              type="button"
              key={c.iso}
              className={cls}
              onClick={() => onPickDay(c.iso)}
              title={[info && (isHi ? `${info.masa_hi} ${info.tithi_hi}` : `${info.masa} ${info.tithi}`), ...fests.map((f) => festLabel(f, isHi))].filter(Boolean).join(" · ")}
              style={accent ? { borderTopColor: accent, background: lead?.major ? undefined : `${accent}14` } : undefined}
            >
              <span className="pcal-day">{c.day}</span>
              {today && <span className={`pcal-today-chip${isHi ? " devanagari" : ""}`}>{isHi ? "आज" : "Today"}</span>}
              {info && (
                <span className={`${dev}pcal-tithi`}>
                  <span className="pcal-tithi-masa">{isHi ? info.masa_hi : info.masa} </span>{tithiShort}
                </span>
              )}
              {lead && (
                <span className={`${dev}pcal-fest-name`} style={{ color: accent ?? "var(--maroon-deep)" }}>
                  {lead.major && "✦ "}{festLabel(lead, isHi)}
                  {fests.length > 1 && ` +${fests.length - 1}`}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="pcal-legend">
        {([
          ["major", isHi ? "✦ प्रमुख त्यौहार" : "✦ Major festival", MAJOR_COLOR],
          ["Ekadashi", isHi ? "एकादशी" : "Ekadashi", categoryColor("Ekadashi")],
          ["Pradosh", isHi ? "प्रदोष" : "Pradosh", categoryColor("Pradosh")],
          ["Chaturthi", isHi ? "चतुर्थी" : "Chaturthi", categoryColor("Chaturthi")],
          ["Purnima", isHi ? "पूर्णिमा" : "Purnima", categoryColor("Purnima")],
          ["Amavasya", isHi ? "अमावस्या/संक्रांति" : "Amavasya/Sankranti", categoryColor("Amavasya")],
        ] as Array<[string, string, string]>).map(([key, label, color]) => (
          <span key={key} style={{ fontSize: "0.72rem", color: "var(--muted)", display: "inline-flex", alignItems: "center", gap: "0.3rem", fontWeight: key === "major" ? 700 : 400 }}>
            <span style={{ display: "inline-block", width: "10px", height: "10px", borderRadius: "2px", background: color }} />
            {label}
          </span>
        ))}
      </div>
      <p style={{ fontSize: "0.72rem", color: "var(--muted)", marginTop: "0.4rem", textAlign: "center" }}>
        {isHi ? "किसी भी तिथि पर क्लिक करें उसका पूरा पंचांग देखने के लिए" : "Click any date to see its full daily panchang"}
      </p>

      {/* Full-text lists below — the grid necessarily truncates long names */}
      {majorFests.length > 0 && (
        <div style={{ marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px dashed rgba(201,154,58,0.35)" }}>
          <h4 className={isHi ? "devanagari" : undefined} style={{ fontSize: "1.05rem", color: MAJOR_COLOR, marginBottom: "0.6rem" }}>
            {isHi ? `✦ ${MONTH_HI[month]} ${year} के प्रमुख त्यौहार` : `✦ Major Festivals — ${MONTH_EN[month]} ${year}`}
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
            {majorFests.map((f, i) => <FestRow key={`m${i}`} f={f} />)}
          </div>
        </div>
      )}
      {vratFests.length > 0 && (
        <div style={{ marginTop: "1.25rem" }}>
          <h4 className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.95rem", color: "var(--maroon-deep)", marginBottom: "0.6rem" }}>
            {isHi ? "व्रत एवं अन्य तिथियाँ" : "Vrats & Other Tithis"}
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
            {vratFests.map((f, i) => <FestRow key={`v${i}`} f={f} />)}
          </div>
        </div>
      )}
    </div>
  );
}

const DEFAULT_PLACE: Place = { label: "New Delhi", lat: 28.6139, lon: 77.209, tzName: "Asia/Kolkata" };

export default function PanchangTool() {
  const { t, lang } = useI18n();
  const isHi = lang === "hi";
  const [date, setDate] = useState(today());
  const [place, setPlace] = useState<Place | null>(DEFAULT_PLACE);
  const [shownPlace, setShownPlace] = useState<string>(DEFAULT_PLACE.label);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [panchang, setPanchang] = useState<PanchangFullResult | null>(null);
  const [kaal, setKaal] = useState<RahuKaalResult | null>(null);
  const [abhijit, setAbhijit] = useState<MuhurtaSlot | null>(null);
  const [festivals, setFestivals] = useState<FestivalItem[]>([]);

  // Single ticking clock shared by the donut, status banner and choghadiya
  // grid — so all three always agree on "now" and none of them drift
  // independently. 30s is coarse enough to be cheap, fine enough that a
  // minute-granularity countdown never looks stale by more than half a minute.
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);
  const nowMinInPlace = place ? nowMinutesInZone(place.tzName, now) : 0;
  const placeIsToday = place && panchang ? panchang.date === todayInZone(place.tzName, now) : false;

  // Monthly calendar view — separate from the single-day view above.
  const [view, setView] = useState<"day" | "month">("day");
  const [monthCursor, setMonthCursor] = useState<{ year: number; month: number }>({ year: now.getFullYear(), month: now.getMonth() });
  const [monthFestivals, setMonthFestivals] = useState<FestivalItem[]>([]);
  const [monthDayInfos, setMonthDayInfos] = useState<Map<string, PanchangDayInfo>>(new Map());
  const [monthMasa, setMonthMasa] = useState<{ start?: MasaInfo; end?: MasaInfo }>({});
  const [monthLoading, setMonthLoading] = useState(false);

  const loadMonth = useCallback(async (year: number, month: number, p: Place) => {
    const monthStartIso = `${year}-${String(month + 1).padStart(2, "0")}-01`;
    const tz = utcOffsetHoursAt(p.tzName, monthStartIso, "12:00");
    setMonthLoading(true);
    try {
      // The API returns the next 30 days from monthStartIso — a couple of
      // early-next-month entries may spill in; keep only this month's dates.
      const f = await fetchFestivals(monthStartIso, p.lat, p.lon, tz).catch(() => null);
      const monthPrefix = `${year}-${String(month + 1).padStart(2, "0")}`;
      setMonthFestivals((f?.festivals ?? []).filter((it) => it.date.startsWith(monthPrefix) && !WEEKLY_VRAT.test(it.name)));
      setMonthDayInfos(new Map((f?.days ?? []).map((d) => [d.date, d])));
      setMonthMasa({ start: f?.masa_start, end: f?.masa_end });
    } finally {
      setMonthLoading(false);
    }
  }, []);

  const load = useCallback(async (d: string, p: Place) => {
    // Offset resolved for the REQUESTED date in the place's IANA zone —
    // a London panchang in July correctly uses +1, in January 0.
    const tz = utcOffsetHoursAt(p.tzName, d, "12:00");
    setLoading(true);
    setError("");
    try {
      const [pan, k, m, f] = await Promise.all([
        fetchPanchang(d, p.lat, p.lon, tz),
        fetchRahuKaal(d, p.lat, p.lon, tz),
        fetchMuhurta(d, p.lat, p.lon, tz).catch(() => null),
        fetchFestivals(d, p.lat, p.lon, tz).catch(() => null),
      ]);
      setPanchang(pan);
      setKaal(k);
      setAbhijit(m?.muhurta?.find((s) => s.abhijit) ?? null);
      setFestivals(f?.festivals?.slice(0, 6) ?? []);
      setShownPlace(p.label);
    } catch (e) {
      // Both languages, picked at render time (pickMessageLang): the first,
      // automatic load runs before a stored English preference is applied,
      // so t() here would still answer in Hindi.
      setError(e instanceof ApiError ? e.message : "Something went wrong. Please try again. | कुछ गलत हो गया। कृपया पुनः प्रयास करें।");
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-load today's panchang on first visit — the page should never feel empty.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetches today's panchang on first visit; load() sets its loading state first
    load(today(), DEFAULT_PLACE);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resultRef = useRef<HTMLDivElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Scroll only on user-requested loads, not the automatic first load.
    if (place) load(date, place).then(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetches the month when the month view opens; loadMonth() sets its loading state first
    if (view === "month" && place) loadMonth(monthCursor.year, monthCursor.month, place);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, monthCursor, place]);

  // Back button returns from the monthly calendar to the daily view instead of leaving the page.
  useBackStep(view === "month", "panchangMonth", () => setView("day"));

  function handlePrevMonth() {
    setMonthCursor((c) => (c.month === 0 ? { year: c.year - 1, month: 11 } : { year: c.year, month: c.month - 1 }));
  }
  function handleNextMonth() {
    setMonthCursor((c) => (c.month === 11 ? { year: c.year + 1, month: 0 } : { year: c.year, month: c.month + 1 }));
  }
  function handlePickDay(iso: string) {
    setDate(iso);
    setView("day");
    if (place) load(iso, place).then(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  // Derived, purely client-side: choghadiya + hora + badges
  const chog = panchang ? choghadiya(panchang.vara.index, panchang.sun_rise, panchang.sun_set) : null;
  const dayHoras = panchang ? horas(panchang.vara.index, panchang.sun_rise, panchang.sun_set) : [];
  const panchakActive = panchang ? isPanchak(panchang.nakshatra.index, panchang.nakshatra.progress) : false;
  const bhadraActive = panchang ? isBhadra(panchang.karana.name) : false;

  const slotStyle = (q: TimeSlot["quality"]): React.CSSProperties => ({
    padding: "0.45rem 0.5rem",
    borderRadius: "2px",
    textAlign: "center",
    fontSize: "0.78rem",
    lineHeight: 1.35,
    border: "1px solid",
    background: q === "good" ? "rgba(26,122,58,0.08)" : q === "bad" ? "rgba(192,57,43,0.07)" : "rgba(201,154,58,0.1)",
    borderColor: q === "good" ? "rgba(26,122,58,0.35)" : q === "bad" ? "rgba(192,57,43,0.3)" : "rgba(201,154,58,0.4)",
    color: q === "good" ? "#14602e" : q === "bad" ? "#8a2f24" : "#6b5220",
  });

  // Every element carries a plain-language, BILINGUAL gloss — these five
  // limbs are exactly the terms visitors see on every panchang site and
  // almost never see explained; the earlier Hindi-only glosses left the
  // English mode showing untranslated Devanagari here.
  const items = panchang
    ? [
        { label: isHi ? "तिथि" : "Tithi", value: !isHi
            ? (panchang.tithi.paksha_num === 15 ? panchang.tithi.name : `${panchang.tithi.paksha} ${panchang.tithi.name}`)
            : panchang.tithi.name_hi
            ? (panchang.tithi.paksha_num === 15 ? panchang.tithi.name_hi : `${panchang.tithi.paksha === "Shukla" ? "शुक्ल" : "कृष्ण"} ${panchang.tithi.name_hi}`)
            : `${panchang.tithi.paksha === "Shukla" ? "शुक्ल" : "कृष्ण"} ${panchang.tithi.name}`,
          sub: isHi
            ? `${Math.round(panchang.tithi.completion * 100)}% बीती · समाप्ति ${panchang.tithi.end_time}`
            : `${Math.round(panchang.tithi.completion * 100)}% elapsed · ends ${panchang.tithi.end_time}`,
          meaning: isHi
            ? "चांद के हिसाब से आज की तारीख — हर व्रत-त्योहार (एकादशी, पूर्णिमा, अमावस्या…) अंग्रेज़ी तारीख से नहीं, इसी से तय होता है"
            : "Today's date by the Moon's calendar — every fast and festival (Ekadashi, Purnima, Amavasya…) is fixed by this, not by the English date" },
        { label: isHi ? "वार" : "Day", value: isHi ? weekdayHi(panchang.vara.name) : panchang.vara.name,
          sub: isHi ? `स्वामी: ${PLANET_HI[panchang.vara.lord] ?? panchang.vara.lord}` : `Lord: ${panchang.vara.lord}`,
          meaning: isHi
            ? "हर दिन का एक मालिक ग्रह होता है — जैसे गुरुवार गुरु का दिन है, इसलिए उस दिन पढ़ाई और धन के काम अच्छे माने जाते हैं"
            : "Each day of the week has an owner planet — Thursday belongs to Jupiter, for example, so study and money matters go well that day" },
        { label: isHi ? "नक्षत्र" : "Nakshatra", value: isHi ? panchang.nakshatra.name_hi : panchang.nakshatra.name,
          sub: isHi
            ? `पाद ${panchang.nakshatra.pada} · स्वामी ${PLANET_HI[panchang.nakshatra.lord] ?? panchang.nakshatra.lord} · समाप्ति ${panchang.nakshatra.end_time}`
            : `pada ${panchang.nakshatra.pada} · lord ${panchang.nakshatra.lord} · ends ${panchang.nakshatra.end_time}`,
          meaning: isHi
            ? "आसमान के 27 तारा-समूहों में से आज चांद जहां है — शुभ काम का समय (मुहूर्त) और बच्चों के नाम इसी से चुने जाते हैं"
            : "Where the Moon sits today among the sky's 27 star-groups — auspicious timings (muhurta) and babies' names are chosen from this" },
        { label: isHi ? "योग" : "Yoga", value: isHi ? yogaNameHi(panchang.yoga.name) : panchang.yoga.name,
          sub: isHi ? `समाप्ति ${panchang.yoga.end_time}` : `ends ${panchang.yoga.end_time}`,
          meaning: isHi
            ? "सूरज और चांद की जोड़ी से बनने वाला दिन का मिज़ाज — कुछ दिन नरम होते हैं, कुछ सख्त; बड़े काम से पहले यही देखा जाता है"
            : "The day's mood, set by the Sun-Moon pairing — some days run gentle, some harsh; it's checked before big undertakings" },
        { label: isHi ? "करण" : "Karana", value: isHi ? karanaNameHi(panchang.karana.name) : panchang.karana.name,
          sub: isHi ? `समाप्ति ${panchang.karana.end_time}` : `ends ${panchang.karana.end_time}`,
          meaning: isHi
            ? "तिथि का आधा हिस्सा — रोज़मर्रा के छोटे कामों (लेन-देन, कोई नई शुरुआत) के लिए और बारीक जांच"
            : "Half of a tithi — a finer check for small everyday actions like transactions or starting something new" },
        { label: isHi ? "चंद्र कला" : "Moon Phase", value: isHi ? moonPhaseHi(panchang.moon_phase) : panchang.moon_phase, sub: "",
          meaning: isHi
            ? "आज चांद कितना भरा है — बढ़ता चांद नई शुरुआत के लिए अच्छा माना जाता है, घटता चांद काम निपटाने और छोड़ने के लिए"
            : "How full the Moon is today — a growing moon is considered good for new beginnings, a shrinking one for finishing and letting go" },
        { label: isHi ? "सूर्योदय" : "Sunrise", value: panchang.sun_rise, sub: "",
          meaning: isHi
            ? "पंचांग का दिन रात 12 बजे से नहीं, सूर्योदय से शुरू होता है — इसीलिए सुबह-सुबह की तिथि पिछले दिन वाली भी हो सकती है"
            : "The panchang day starts at sunrise, not midnight — which is why the early-morning tithi can still belong to the previous day" },
        { label: isHi ? "सूर्यास्त" : "Sunset", value: panchang.sun_set, sub: "",
          meaning: isHi
            ? "यहां से दिन के शुभ-अशुभ समय (नीचे दिए चौघड़िया) रात वाले हिस्से में बदल जाते हैं"
            : "From this moment, the day's good/bad time-slots (the choghadiya below) switch over to their night set" },
      ]
    : [];

  return (
    <>
      <PatrikaFrame style={{ marginBottom: "1.5rem" }}>
        <form onSubmit={handleSubmit} className="inline-tool-form" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", alignItems: "end" }}>
          <div className="form-group">
            <label className="form-label" htmlFor="pdate">{isHi ? "दिनांक" : "Date"}</label>
            <input
              id="pdate"
              type="date"
              className="form-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <PlaceSearch value={place} onSelect={setPlace} label={isHi ? "स्थान" : "City"} />
          {view === "day" && (
            <button type="submit" className="btn btn-primary" disabled={loading || !place}>
              {loading ? t("form.calculating") : isHi ? "पंचांग देखें" : "Show Panchang"}
            </button>
          )}
        </form>
        <p className={`form-hint${isHi ? " devanagari" : ""}`} style={{ textAlign: "center", marginTop: "0.6rem" }}>
          {isHi
            ? "सूर्योदय-सूर्यास्त, राहु काल, चोघड़िया और मुहूर्त — सब आपके शहर के अनुसार बदलते हैं, इसलिए सही शहर चुनना ज़रूरी है।"
            : "Sunrise-sunset, Rahu Kaal, Choghadiya and Muhurta all shift with your city — pick the right one for an accurate panchang."}
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginTop: "1rem" }}>
          <button type="button" className={`btn btn-sm ${view === "day" ? "btn-secondary" : "btn-ghost"}`} onClick={() => setView("day")}>
            {isHi ? "दैनिक पंचांग" : "Daily Panchang"}
          </button>
          <button type="button" className={`btn btn-sm ${view === "month" ? "btn-secondary" : "btn-ghost"}`} onClick={() => setView("month")}>
            {isHi ? "मासिक पंचांग" : "Monthly Calendar"}
          </button>
        </div>
      </PatrikaFrame>

      {error && <p className="form-error">{pickMessageLang(error, isHi)}</p>}

      {view === "month" && (
        <PatrikaFrame style={{ marginBottom: "1.5rem" }}>
          {monthLoading ? (
            <div style={{ textAlign: "center", padding: "2rem" }}>
              <div className="spinner" />
              <p style={{ color: "var(--muted)" }}>{t("form.loading")}</p>
            </div>
          ) : (
            <MonthCalendar
              year={monthCursor.year}
              month={monthCursor.month}
              festivals={monthFestivals}
              dayInfos={monthDayInfos}
              masaStart={monthMasa.start}
              masaEnd={monthMasa.end}
              isHi={isHi}
              onPrev={handlePrevMonth}
              onNext={handleNextMonth}
              onPickDay={handlePickDay}
              isToday={(iso) => iso === today(place?.tzName)}
            />
          )}
        </PatrikaFrame>
      )}

      {view === "day" && loading && !panchang && (
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <div className="spinner" />
          <p style={{ color: "var(--muted)" }}>{t("form.loading")}</p>
        </div>
      )}

      {view === "day" && panchang && (
        <div ref={resultRef} className="print-area" style={{ scrollMarginTop: "90px" }}>
            <DownloadReportButton filename="AstroShivanii-Panchang" />
        <PatrikaFrame>
          <h2 style={{ fontSize: "1.2rem", marginBottom: "0.25rem", textAlign: "center" }}>
            {panchang.date} — {shownPlace}
          </h2>
          {panchang.masa && (
            <p className={isHi ? "devanagari" : undefined} style={{ textAlign: "center", color: "#8a5a17", fontSize: "0.95rem", fontWeight: 700, marginBottom: "0.2rem" }}>
              {isHi
                ? `${panchang.masa.name_hi} मास${panchang.tithi.name_hi ? ` · ${panchang.tithi.paksha === "Shukla" ? "शुक्ल पक्ष" : "कृष्ण पक्ष"} ${panchang.tithi.name_hi}` : ""}`
                : `${panchang.masa.name} month · ${panchang.tithi.paksha} paksha ${panchang.tithi.name}`}
            </p>
          )}
          <p className={isHi ? "devanagari" : undefined} style={{ textAlign: "center", color: "var(--muted)", fontSize: "0.85rem", marginBottom: "0.75rem" }}>
            {isHi ? "लाहिरी अयनांश · वास्तविक खगोलीय गणना" : "Lahiri ayanamsa · real astronomical calculation"}
          </p>

          {/* ── Heavenly Pulse — quick-glance strip, additive to the detailed grid below ── */}
          <div style={{ marginBottom: "1rem" }}>
            <HeavenlyPulse
              sunrise={panchang.sun_rise}
              sunset={panchang.sun_set}
              tithi={isHi ? (panchang.tithi.name_hi ?? panchang.tithi.name) : panchang.tithi.name}
              nakshatra={isHi ? panchang.nakshatra.name_hi : panchang.nakshatra.name}
              rahuKaal={kaal ? `${kaal.rahu_kaal.start}–${kaal.rahu_kaal.end}` : "—"}
              isHi={isHi}
            />
          </div>

          {/* ── Donut + live status (left) · Moon sign (right) ── */}
          {chog && (
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem", marginBottom: "1.25rem" }} className="panchang-hero-grid">
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <DayNightDonut
                  sunrise={panchang.sun_rise}
                  sunset={panchang.sun_set}
                  kaal={kaal}
                  abhijit={abhijit}
                  nowMinInPlace={nowMinInPlace}
                  nowLabel={toHHMM(nowMinInPlace)}
                  placeLabel={shownPlace}
                  showNowMarker={placeIsToday}
                  isHi={isHi}
                />
                {placeIsToday ? (
                  <CurrentStatusBanner
                    day={chog.day}
                    night={chog.night}
                    sunrise={panchang.sun_rise}
                    nowMinInPlace={nowMinInPlace}
                    isHi={isHi}
                  />
                ) : (
                  <div className="result-box" style={{ textAlign: "center", margin: 0 }}>
                    <p className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.82rem", color: "var(--muted)", margin: 0 }}>
                      {isHi
                        ? "यह किसी अन्य तिथि का पंचांग है — \"अभी सक्रिय\" स्थिति केवल आज के लिए दिखाई जाती है।"
                        : "This is another date's panchang — \"Currently Active\" status only shows for today."}
                    </p>
                  </div>
                )}
              </div>
              <MoonSignPanel
                nakshatraIndex={panchang.nakshatra.index}
                pada={panchang.nakshatra.pada}
                moonPhase={isHi ? moonPhaseHi(panchang.moon_phase) : panchang.moon_phase}
                isHi={isHi}
              />
            </div>
          )}

          <div className="panchang-grid">
            {items.map((it) => (
              <div key={it.label} className="result-box" style={{ margin: 0 }}>
                <div className="result-label">{it.label}</div>
                <div className="result-value" style={{ fontSize: "1.02rem" }}>{it.value}</div>
                {it.sub && <div style={{ fontSize: "0.72rem", color: "var(--muted)", marginTop: "0.2rem" }}>{it.sub}</div>}
                {it.meaning && <div className={isHi ? "devanagari" : undefined} style={{ fontSize: "0.72rem", color: "var(--ink-light)", marginTop: "0.3rem", fontStyle: "italic" }}>{it.meaning}</div>}
              </div>
            ))}
          </div>
          <p style={{ fontSize: "0.78rem", color: "var(--muted)", textAlign: "center", marginTop: "0.6rem" }} className={isHi ? "devanagari" : undefined}>
            {isHi
              ? <>ये पाँच अंग (<span className="hl">तिथि, वार, नक्षत्र, योग, करण</span>) मिलकर &ldquo;पंचांग&rdquo; बनाते हैं — किसी भी दिन का शुभ-अशुभ यही तय करता है।</>
              : <>These five limbs (<span className="hl">tithi, vara, nakshatra, yoga, karana</span>) together form the &ldquo;panchang&rdquo; — literally &ldquo;five limbs&rdquo; — and between them decide any day&apos;s auspiciousness.</>}
          </p>

          {/* The whole day at a glance — kaal windows red, abhijit green */}
          <DayStrip
            sunrise={panchang.sun_rise}
            sunset={panchang.sun_set}
            kaal={kaal}
            abhijit={abhijit}
            isToday={placeIsToday}
            nowMinInPlace={nowMinInPlace}
            isHi={isHi}
          />

          {abhijit && (
            <div className="kaal-box good" style={{ marginBottom: "0.6rem", marginTop: "0.9rem" }}>
              <strong>{isHi ? "अभिजीत मुहूर्त" : "Abhijit Muhurta"}: {abhijit.start} – {abhijit.end}</strong>
              <div style={{ fontSize: "0.78rem" }}>
                {isHi ? "दिन का सर्वश्रेष्ठ सामान्य मुहूर्त — शुभ कार्य आरम्भ के लिए उत्तम।" : "The day's best general muhurta — ideal for beginning auspicious work."}
              </div>
            </div>
          )}

          {kaal && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.6rem" }}>
              <div className="kaal-box">
                <strong>{isHi ? "राहु काल" : "Rahu Kaal"}: {kaal.rahu_kaal.start} – {kaal.rahu_kaal.end}</strong>
                <div style={{ fontSize: "0.78rem" }}>{isHi ? "शुभ कार्य आरम्भ न करें" : "Don't begin auspicious work"}</div>
              </div>
              <div className="kaal-box">
                <strong>{isHi ? "गुलिक काल" : "Gulika Kaal"}: {kaal.gulika_kaal.start} – {kaal.gulika_kaal.end}</strong>
                <div style={{ fontSize: "0.78rem" }}>{isHi ? "अशुभ अवधि" : "Inauspicious period"}</div>
              </div>
              <div className="kaal-box">
                <strong>{isHi ? "यमगण्ड" : "Yamaganda"}: {kaal.yamaganda.start} – {kaal.yamaganda.end}</strong>
                <div style={{ fontSize: "0.78rem" }}>{isHi ? "यात्रा व नए कार्य टालें" : "Avoid journeys and new ventures"}</div>
              </div>
            </div>
          )}

          {/* भद्रा / पंचक — only shown when actually active (no fear decoration) */}
          {(bhadraActive || panchakActive) && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "0.6rem", marginTop: "0.6rem" }}>
              {bhadraActive && (
                <div className="kaal-box">
                  <strong>
                    {isHi
                      ? `भद्रा (विष्टि करण) चल रही है — समाप्ति ${panchang.karana.end_time}`
                      : `Bhadra (Vishti karana) is running — ends ${panchang.karana.end_time}`}
                  </strong>
                  <div style={{ fontSize: "0.78rem" }}>
                    {isHi
                      ? "रक्षाबंधन, गृह-प्रवेश जैसे शुभ आरम्भ भद्रा के बाद करें।"
                      : "Hold auspicious beginnings such as Raksha Bandhan or griha pravesh until Bhadra is over."}
                  </div>
                </div>
              )}
              {panchakActive && (
                <div className="kaal-box">
                  <strong>{isHi ? "पंचक चल रहा है" : "Panchak is running"}</strong>
                  <div style={{ fontSize: "0.78rem" }}>
                    {isHi
                      ? "दक्षिण-यात्रा, छत डालना, शय्या-निर्माण आदि परम्परा में टाले जाते हैं। भयभीत न हों — पूजा-पाठ व नित्य कर्म शुभ हैं।"
                      : "Tradition avoids journeys to the south, laying a roof, making a bed and the like. Nothing to fear — worship and daily duties are auspicious."}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* चोघड़िया — day/night toggle, active period highlighted when viewing today */}
          {chog && (
            <div style={{ marginTop: "1.25rem" }}>
              <h3 style={{ fontSize: "1.05rem", color: "var(--maroon-deep)", marginBottom: "0.5rem", textAlign: "center" }}>
                {isHi ? "चोघड़िया" : "Choghadiya"}
              </h3>
              <ChoghadiyaGrid
                day={chog.day}
                night={chog.night}
                sunrise={panchang.sun_rise}
                sunset={panchang.sun_set}
                nowMinInPlace={placeIsToday ? nowMinInPlace : null}
                isHi={isHi}
              />
              <p style={{ fontSize: "0.72rem", color: "var(--muted)", marginTop: "0.5rem" }}>
                {isHi
                  ? "हरा = शुभ (अमृत, शुभ, लाभ) · पीला = सामान्य (चल — यात्रा हेतु ठीक) · लाल = टालें (उद्वेग, काल, रोग)"
                  : "Green = good (Amrit, Shubh, Labh) · Yellow = neutral (Char — fine for travel) · Red = avoid (Udveg, Kaal, Rog)"}
              </p>
            </div>
          )}

          {/* होरा */}
          {dayHoras.length > 0 && (
            <div style={{ marginTop: "1.25rem" }}>
              <h3 style={{ fontSize: "1.05rem", color: "var(--maroon-deep)", marginBottom: "0.5rem" }}>
                {isHi ? "होरा — दिन के 12 ग्रह-घंटे" : "Hora — the day's 12 planetary hours"}
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: "0.45rem" }}>
                {dayHoras.map((h, i) => (
                  <div key={`h${i}`} style={slotStyle(h.quality)}>
                    <strong>{isHi ? `${h.name} होरा` : `${HORA_EN[h.name] ?? h.name} hora`}</strong><br />{h.start}–{h.end}
                  </div>
                ))}
              </div>
              <p style={{ fontSize: "0.72rem", color: "var(--muted)", marginTop: "0.4rem" }}>
                {isHi
                  ? "गुरु/शुक्र होरा — शुभ आरम्भ · बुध — व्यापार-लेखन · चंद्र — यात्रा-मेल · सूर्य — सरकारी कार्य · शनि/मंगल होरा में नए शुभ कार्य टालें"
                  : "Jupiter/Venus hora — good beginnings · Mercury — business and writing · Moon — travel and meetings · Sun — government work · avoid new auspicious work in a Saturn/Mars hora"}
              </p>
            </div>
          )}

          {/* आगामी व्रत-त्यौहार */}
          {festivals.length > 0 && (
            <div style={{ marginTop: "1.25rem" }}>
              <h3 style={{ fontSize: "1.05rem", color: "var(--maroon-deep)", marginBottom: "0.5rem" }}>
                {isHi ? "आगामी व्रत एवं त्यौहार" : "Upcoming Vrats & Festivals"}
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                {festivals.map((f, i) => (
                  <div key={i} style={{ display: "flex", gap: "0.75rem", alignItems: "baseline", fontSize: "0.85rem", borderBottom: "1px dashed rgba(201,154,58,0.3)", paddingBottom: "0.35rem" }}>
                    <strong style={{ color: "var(--maroon)", whiteSpace: "nowrap" }}>{f.date.slice(8, 10)}-{f.date.slice(5, 7)}</strong>
                    <span style={{ fontWeight: f.major ? 800 : 600, color: f.major ? MAJOR_COLOR : undefined }} className={isHi && f.name_hi ? "devanagari" : undefined}>
                      {f.major && "✦ "}{festLabel(f, isHi)}
                    </span>
                    <span style={{ color: "var(--muted)", fontSize: "0.78rem" }}>{f.significance}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <ResultCTA
            hook={{
              en: "The panchang is the same for everyone — your muhurta is not. The right date for a wedding, griha-pravesh or launch depends on YOUR birth chart.",
              hi: "पंचांग सबके लिए एक है — मुहूर्त आपके लिए अलग। विवाह, गृह-प्रवेश या शुभारम्भ की सही तिथि आपकी अपनी कुंडली से तय होती है।",
            }}
            waText={`Namaste Shivanii ji! I was checking the panchang for ${panchang.date} (${shownPlace}) on your website. I want a personal muhurta consultation.`}
            reading={{ href: "/book", labelEn: "Book a Muhurta Consultation", labelHi: "मुहूर्त परामर्श बुक करें" }}
          />
        </PatrikaFrame>
        </div>
      )}
    </>
  );
}
