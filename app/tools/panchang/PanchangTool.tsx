"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import PatrikaFrame from "@/components/PatrikaFrame";
import ResultCTA from "@/components/ResultCTA";
import PlaceSearch, { Place } from "@/components/PlaceSearch";
import { utcOffsetHoursAt } from "@/lib/timezone";
import { choghadiya, horas, isPanchak, isBhadra, TimeSlot } from "@/lib/panchang-calc";
import { fetchPanchang, fetchRahuKaal, fetchMuhurta, fetchFestivals } from "@/lib/api/endpoints";
import type { PanchangFullResult, RahuKaalResult, MuhurtaSlot, FestivalItem, MasaInfo, PanchangDayInfo } from "@/lib/api/types";
import { ApiError } from "@/lib/api/client";

function today(): string {
  return new Date().toISOString().split("T")[0];
}

function toMins(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + (m || 0);
}

/** Sunrise→sunset drawn as one band: red = the three kaal windows to avoid,
 *  green = Abhijit muhurta, maroon line = "now" (when viewing today).
 *  Answers "when is today safe?" as a picture instead of four boxes. */
function DayStrip({ sunrise, sunset, kaal, abhijit, isToday }: {
  sunrise: string; sunset: string;
  kaal: RahuKaalResult | null;
  abhijit: MuhurtaSlot | null;
  isToday: boolean;
}) {
  const t0 = toMins(sunrise), t1 = toMins(sunset);
  const span = t1 - t0;
  if (span <= 0) return null;
  const pct = (hhmm: string) => Math.max(0, Math.min(100, ((toMins(hhmm) - t0) / span) * 100));

  const windows: Array<{ from: string; to: string; label: string; cls: "kaal" | "shubh" }> = [];
  if (kaal) {
    windows.push(
      { from: kaal.rahu_kaal.start, to: kaal.rahu_kaal.end, label: "राहु काल", cls: "kaal" },
      { from: kaal.gulika_kaal.start, to: kaal.gulika_kaal.end, label: "गुलिक", cls: "kaal" },
      { from: kaal.yamaganda.start, to: kaal.yamaganda.end, label: "यमगण्ड", cls: "kaal" },
    );
  }
  if (abhijit) windows.push({ from: abhijit.start, to: abhijit.end, label: "अभिजीत", cls: "shubh" });

  const now = new Date();
  const nowMins = now.getHours() * 60 + now.getMinutes();
  const showNow = isToday && nowMins > t0 && nowMins < t1;

  return (
    <div className="day-strip-wrap">
      <div className="day-strip" style={{ marginTop: showNow ? "1.3rem" : 0 }}>
        {windows.map((w) => {
          const left = pct(w.from);
          const width = Math.max(pct(w.to) - left, 1.5);
          return (
            <div
              key={`${w.label}-${w.from}`}
              className={`day-strip-window ${w.cls}`}
              style={{ left: `${left}%`, width: `${width}%` }}
              title={`${w.label}: ${w.from}–${w.to}`}
            >
              {width > 9 && w.label}
            </div>
          );
        })}
        {showNow && (
          <div className="day-strip-now" style={{ left: `${((nowMins - t0) / span) * 100}%` }} aria-hidden="true" />
        )}
      </div>
      <div className="day-strip-labels devanagari">
        <span>☀ {sunrise} सूर्योदय</span>
        <span>लाल = टालें · हरा = श्रेष्ठ</span>
        <span>सूर्यास्त {sunset} ☾</span>
      </div>
    </div>
  );
}

const WEEKDAY_HI = ["रवि", "सोम", "मंगल", "बुध", "गुरु", "शुक्र", "शनि"];
const MONTH_HI = ["जनवरी", "फ़रवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितम्बर", "अक्टूबर", "नवम्बर", "दिसम्बर"];
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

  const sortedFests = [...festivals].sort((a, b) => a.date.localeCompare(b.date));
  const majorFests = sortedFests.filter((f) => f.major);
  const vratFests = sortedFests.filter((f) => !f.major);

  const FestRow = ({ f }: { f: FestivalItem }) => {
    const color = festivalColor(f);
    const weekday = WEEKDAY_HI[new Date(`${f.date}T12:00:00`).getDay()];
    return (
      <button type="button" className="pcal-fest-row" onClick={() => onPickDay(f.date)}
        style={{ borderLeftColor: color, background: `${color}0d` }}>
        <span className="pcal-date-chip devanagari">
          <span className="dnum">{parseInt(f.date.slice(8, 10), 10)}</span>
          <span className="dvar">{weekday}</span>
        </span>
        <span style={{ minWidth: 0 }}>
          <span className="devanagari" style={{ fontWeight: 700, fontSize: f.major ? "0.95rem" : "0.85rem", color: f.major ? MAJOR_COLOR : "var(--maroon-deep)", display: "block" }}>
            {f.major && "✦ "}{festLabel(f, true)}
            {f.name_hi && <span style={{ fontWeight: 500, color: "var(--muted)", fontSize: "0.75rem" }}> · {f.name}</span>}
          </span>
          <span style={{ color: "var(--ink-light)", fontSize: "0.76rem", display: "block", marginTop: "0.1rem" }}>{f.significance}</span>
        </span>
      </button>
    );
  };

  return (
    <div>
      <div className="pcal-head">
        <button type="button" className="btn btn-ghost btn-sm" onClick={onPrev} aria-label="पिछला महीना" style={{ fontSize: "1.1rem" }}>←</button>
        <h3 className="devanagari pcal-month">❈ {MONTH_HI[month]} {year} ❈</h3>
        <button type="button" className="btn btn-ghost btn-sm" onClick={onNext} aria-label="अगला महीना" style={{ fontSize: "1.1rem" }}>→</button>
      </div>
      {masaLabel && (
        <p className="devanagari pcal-masa">
          {isHi ? "विक्रम संवत् मास" : "Vikram Samvat masa"}: {masaLabel}
        </p>
      )}

      <div className="pcal-dow-row">
        {WEEKDAY_HI.map((w, i) => (
          <div key={w} className={`devanagari pcal-dow${i === 0 ? " sun" : ""}`}>{w}</div>
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
          // "कृष्ण तृतीया" → "कृ. तृतीया" — keeps the cell line short
          const tithiShort = info?.tithi_hi.replace("शुक्ल ", "शु. ").replace("कृष्ण ", "कृ. ");
          const cls = ["pcal-cell", lead?.major ? "major" : "", today ? "today" : ""].filter(Boolean).join(" ");
          return (
            <button
              type="button"
              key={c.iso}
              className={cls}
              onClick={() => onPickDay(c.iso)}
              title={[info && `${info.masa_hi} ${info.tithi_hi}`, ...fests.map((f) => f.name)].filter(Boolean).join(" · ")}
              style={accent ? { borderTopColor: accent, background: lead?.major ? undefined : `${accent}14` } : undefined}
            >
              <span className="pcal-day">{c.day}</span>
              {today && <span className="pcal-today-chip devanagari">आज</span>}
              {info && (
                <span className="devanagari pcal-tithi">
                  <span className="pcal-tithi-masa">{info.masa_hi} </span>{tithiShort}
                </span>
              )}
              {lead && (
                <span className="devanagari pcal-fest-name" style={{ color: accent ?? "var(--maroon-deep)" }}>
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
          <h4 className="devanagari" style={{ fontSize: "1.05rem", color: MAJOR_COLOR, marginBottom: "0.6rem" }}>
            {isHi ? `✦ ${MONTH_HI[month]} ${year} के प्रमुख त्यौहार` : `✦ Major Festivals — ${MONTH_HI[month]} ${year}`}
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
            {majorFests.map((f, i) => <FestRow key={`m${i}`} f={f} />)}
          </div>
        </div>
      )}
      {vratFests.length > 0 && (
        <div style={{ marginTop: "1.25rem" }}>
          <h4 className="devanagari" style={{ fontSize: "0.95rem", color: "var(--maroon-deep)", marginBottom: "0.6rem" }}>
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

  // Monthly calendar view — separate from the single-day view above.
  const [view, setView] = useState<"day" | "month">("day");
  const now = new Date();
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
      setError(e instanceof ApiError ? e.message : t("form.error"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  // Auto-load today's panchang on first visit — the page should never feel empty.
  useEffect(() => {
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
    if (view === "month" && place) loadMonth(monthCursor.year, monthCursor.month, place);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, monthCursor, place]);

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

  const items = panchang
    ? [
        { label: "तिथि / Tithi", value: panchang.tithi.name_hi
            ? (panchang.tithi.paksha_num === 15 ? panchang.tithi.name_hi : `${panchang.tithi.paksha === "Shukla" ? "शुक्ल" : "कृष्ण"} ${panchang.tithi.name_hi}`)
            : `${panchang.tithi.paksha === "Shukla" ? "शुक्ल" : "कृष्ण"} ${panchang.tithi.name}`,
          sub: `${Math.round(panchang.tithi.completion * 100)}% बीती · समाप्ति ${panchang.tithi.end_time}`, meaning: "चंद्र-सूर्य की दूरी से तय व्रत-त्योहार की तिथि" },
        { label: "वार / Day", value: panchang.vara.name, sub: `स्वामी: ${panchang.vara.lord}`, meaning: "दिन का स्वामी ग्रह — उसी ग्रह से जुड़े कार्य आज शुभ" },
        { label: "नक्षत्र / Nakshatra", value: `${panchang.nakshatra.name}`, sub: `${panchang.nakshatra.name_hi} · पाद ${panchang.nakshatra.pada} · स्वामी ${panchang.nakshatra.lord} · समाप्ति ${panchang.nakshatra.end_time}`, meaning: "आज चंद्रमा जिस नक्षत्र में है — मुहूर्त चुनने का मुख्य आधार" },
        { label: "योग / Yoga", value: panchang.yoga.name, sub: `समाप्ति ${panchang.yoga.end_time}`, meaning: "सूर्य-चंद्र के संयोग से बना योग — दिन की समग्र प्रकृति दर्शाता है" },
        { label: "करण / Karana", value: panchang.karana.name, sub: `समाप्ति ${panchang.karana.end_time}`, meaning: "तिथि का आधा भाग — दैनिक कार्यों की बारीक शुभता तय करता है" },
        { label: "चंद्र कला / Moon Phase", value: panchang.moon_phase, sub: "", meaning: "" },
        { label: "सूर्योदय / Sunrise", value: panchang.sun_rise, sub: "", meaning: "" },
        { label: "सूर्यास्त / Sunset", value: panchang.sun_set, sub: "", meaning: "" },
      ]
    : [];

  return (
    <>
      <PatrikaFrame style={{ marginBottom: "1.5rem" }}>
        <form onSubmit={handleSubmit} className="inline-tool-form" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", alignItems: "end" }}>
          <div className="form-group">
            <label className="form-label" htmlFor="pdate">दिनांक / Date</label>
            <input
              id="pdate"
              type="date"
              className="form-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <PlaceSearch value={place} onSelect={setPlace} label="स्थान / City" placeholder="Type any city… e.g. Kanpur, Dubai, London" />
          {view === "day" && (
            <button type="submit" className="btn btn-primary" disabled={loading || !place}>
              {loading ? t("form.calculating") : "पंचांग देखें / Show Panchang"}
            </button>
          )}
        </form>

        <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginTop: "1rem" }}>
          <button type="button" className={`btn btn-sm ${view === "day" ? "btn-secondary" : "btn-ghost"}`} onClick={() => setView("day")}>
            दैनिक पंचांग / Daily
          </button>
          <button type="button" className={`btn btn-sm ${view === "month" ? "btn-secondary" : "btn-ghost"}`} onClick={() => setView("month")}>
            मासिक पंचांग / Monthly
          </button>
        </div>
      </PatrikaFrame>

      {error && <p className="form-error">{error}</p>}

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
              isToday={(iso) => iso === today()}
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
        <div ref={resultRef} style={{ scrollMarginTop: "90px" }}>
        <PatrikaFrame>
          <h2 style={{ fontSize: "1.2rem", marginBottom: "0.25rem", textAlign: "center" }}>
            {panchang.date} — {shownPlace}
          </h2>
          {panchang.masa && (
            <p className="devanagari" style={{ textAlign: "center", color: "#8a5a17", fontSize: "0.95rem", fontWeight: 700, marginBottom: "0.2rem" }}>
              {panchang.masa.name_hi} मास{panchang.tithi.name_hi ? ` · ${panchang.tithi.paksha === "Shukla" ? "शुक्ल पक्ष" : "कृष्ण पक्ष"} ${panchang.tithi.name_hi}` : ""}
            </p>
          )}
          <p className="devanagari" style={{ textAlign: "center", color: "var(--muted)", fontSize: "0.85rem", marginBottom: "0.75rem" }}>
            लाहिरी अयनांश · वास्तविक खगोलीय गणना
          </p>

          <div className="panchang-grid">
            {items.map((it) => (
              <div key={it.label} className="result-box" style={{ margin: 0 }}>
                <div className="result-label">{it.label}</div>
                <div className="result-value" style={{ fontSize: "1.02rem" }}>{it.value}</div>
                {it.sub && <div style={{ fontSize: "0.72rem", color: "var(--muted)", marginTop: "0.2rem" }}>{it.sub}</div>}
                {it.meaning && <div className="devanagari" style={{ fontSize: "0.72rem", color: "var(--ink-light)", marginTop: "0.3rem", fontStyle: "italic" }}>{it.meaning}</div>}
              </div>
            ))}
          </div>
          <p style={{ fontSize: "0.78rem", color: "var(--muted)", textAlign: "center", marginTop: "0.6rem" }} className="devanagari">
            ये पाँच अंग (<span className="hl">तिथि, वार, नक्षत्र, योग, करण</span>) मिलकर &ldquo;पंचांग&rdquo; बनाते हैं — किसी भी दिन का शुभ-अशुभ यही तय करता है।
          </p>

          {/* The whole day at a glance — kaal windows red, abhijit green */}
          <DayStrip
            sunrise={panchang.sun_rise}
            sunset={panchang.sun_set}
            kaal={kaal}
            abhijit={abhijit}
            isToday={panchang.date === today()}
          />

          {abhijit && (
            <div className="kaal-box good" style={{ marginBottom: "0.6rem", marginTop: "0.9rem" }}>
              <strong>अभिजीत मुहूर्त / Abhijit Muhurta: {abhijit.start} – {abhijit.end}</strong>
              <div style={{ fontSize: "0.78rem" }}>दिन का सर्वश्रेष्ठ सामान्य मुहूर्त — शुभ कार्य आरम्भ के लिए उत्तम।</div>
            </div>
          )}

          {kaal && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.6rem" }}>
              <div className="kaal-box">
                <strong>राहु काल: {kaal.rahu_kaal.start} – {kaal.rahu_kaal.end}</strong>
                <div style={{ fontSize: "0.78rem" }}>शुभ कार्य आरम्भ न करें</div>
              </div>
              <div className="kaal-box">
                <strong>गुलिक काल: {kaal.gulika_kaal.start} – {kaal.gulika_kaal.end}</strong>
                <div style={{ fontSize: "0.78rem" }}>अशुभ अवधि</div>
              </div>
              <div className="kaal-box">
                <strong>यमगण्ड: {kaal.yamaganda.start} – {kaal.yamaganda.end}</strong>
                <div style={{ fontSize: "0.78rem" }}>यात्रा व नए कार्य टालें</div>
              </div>
            </div>
          )}

          {/* भद्रा / पंचक — only shown when actually active (no fear decoration) */}
          {(bhadraActive || panchakActive) && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "0.6rem", marginTop: "0.6rem" }}>
              {bhadraActive && (
                <div className="kaal-box">
                  <strong>भद्रा (विष्टि करण) चल रही है — समाप्ति {panchang.karana.end_time}</strong>
                  <div style={{ fontSize: "0.78rem" }}>रक्षाबंधन, गृह-प्रवेश जैसे शुभ आरम्भ भद्रा के बाद करें।</div>
                </div>
              )}
              {panchakActive && (
                <div className="kaal-box">
                  <strong>पंचक चल रहा है</strong>
                  <div style={{ fontSize: "0.78rem" }}>दक्षिण-यात्रा, छत डालना, शय्या-निर्माण आदि परम्परा में टाले जाते हैं। भयभीत न हों — पूजा-पाठ व नित्य कर्म शुभ हैं।</div>
                </div>
              )}
            </div>
          )}

          {/* चोघड़िया */}
          {chog && (
            <div style={{ marginTop: "1.25rem" }}>
              <h3 style={{ fontSize: "1.05rem", color: "var(--maroon-deep)", marginBottom: "0.5rem" }}>
                चोघड़िया — दिन <span style={{ fontSize: "0.75rem", color: "var(--muted)", fontWeight: 400 }}>({panchang.sun_rise} से {panchang.sun_set})</span>
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: "0.45rem" }}>
                {chog.day.map((s, i) => (
                  <div key={`d${i}`} style={slotStyle(s.quality)}>
                    <strong>{s.name}</strong><br />{s.start}–{s.end}
                  </div>
                ))}
              </div>
              <h3 style={{ fontSize: "1.05rem", color: "var(--maroon-deep)", margin: "0.9rem 0 0.5rem" }}>
                चोघड़िया — रात्रि <span style={{ fontSize: "0.75rem", color: "var(--muted)", fontWeight: 400 }}>({panchang.sun_set} से अगले सूर्योदय तक, लगभग)</span>
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: "0.45rem" }}>
                {chog.night.map((s, i) => (
                  <div key={`n${i}`} style={slotStyle(s.quality)}>
                    <strong>{s.name}</strong><br />{s.start}–{s.end}
                  </div>
                ))}
              </div>
              <p style={{ fontSize: "0.72rem", color: "var(--muted)", marginTop: "0.4rem" }}>
                हरा = शुभ (अमृत, शुभ, लाभ) · पीला = सामान्य (चल — यात्रा हेतु ठीक) · लाल = टालें (उद्वेग, काल, रोग)
              </p>
            </div>
          )}

          {/* होरा */}
          {dayHoras.length > 0 && (
            <div style={{ marginTop: "1.25rem" }}>
              <h3 style={{ fontSize: "1.05rem", color: "var(--maroon-deep)", marginBottom: "0.5rem" }}>
                होरा — दिन के 12 ग्रह-घंटे
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: "0.45rem" }}>
                {dayHoras.map((h, i) => (
                  <div key={`h${i}`} style={slotStyle(h.quality)}>
                    <strong>{h.name} होरा</strong><br />{h.start}–{h.end}
                  </div>
                ))}
              </div>
              <p style={{ fontSize: "0.72rem", color: "var(--muted)", marginTop: "0.4rem" }}>
                गुरु/शुक्र होरा — शुभ आरम्भ · बुध — व्यापार-लेखन · चंद्र — यात्रा-मेल · सूर्य — सरकारी कार्य · शनि/मंगल होरा में नए शुभ कार्य टालें
              </p>
            </div>
          )}

          {/* आगामी व्रत-त्यौहार */}
          {festivals.length > 0 && (
            <div style={{ marginTop: "1.25rem" }}>
              <h3 style={{ fontSize: "1.05rem", color: "var(--maroon-deep)", marginBottom: "0.5rem" }}>
                आगामी व्रत एवं त्यौहार
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                {festivals.map((f, i) => (
                  <div key={i} style={{ display: "flex", gap: "0.75rem", alignItems: "baseline", fontSize: "0.85rem", borderBottom: "1px dashed rgba(201,154,58,0.3)", paddingBottom: "0.35rem" }}>
                    <strong style={{ color: "var(--maroon)", whiteSpace: "nowrap" }}>{f.date.slice(8, 10)}-{f.date.slice(5, 7)}</strong>
                    <span style={{ fontWeight: f.major ? 800 : 600, color: f.major ? MAJOR_COLOR : undefined }} className={f.name_hi ? "devanagari" : undefined}>
                      {f.major && "✦ "}{f.name_hi ?? f.name}
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
