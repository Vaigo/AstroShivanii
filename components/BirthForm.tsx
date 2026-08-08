"use client";

import { useEffect, useRef, useState } from "react";
import type { BirthRequest } from "@/lib/api/types";
import { useI18n } from "@/lib/i18n";
import PlaceSearch, { Place } from "./PlaceSearch";
import { timezoneNameFor, utcOffsetHoursAt } from "@/lib/timezone";

interface BirthFormProps {
  /** Standalone mode: called when the user presses the submit button. */
  onSubmit?: (data: BirthRequest) => void;
  /** Embedded mode: called on every change with the current data (null until complete). */
  onChange?: (data: BirthRequest | null) => void;
  /** Embedded mode renders plain fields (no <form>, no submit button). */
  embedded?: boolean;
  loading?: boolean;
  label?: string;
  /** Kundli needs an exact time for a trustworthy chart — when true, the time
   *  field drops the "(optional)" framing, becomes HTML-required, and blocks
   *  submission without it. Default false preserves the sunrise-fallback
   *  behavior (birth time optional + honest accuracy flag) everywhere else. */
  requireTime?: boolean;
  /** True if only year+month of birth are known (Time Rectification's
   *  day-unknown mode) — swaps the date field for a month picker, and the
   *  `dob` emitted via onChange/onSubmit becomes YYYY-MM (no day), not the
   *  usual YYYY-MM-DD. Place-search/coords/time fields are unaffected. */
  dayUnknown?: boolean;
  /** Hides the birth-time field entirely. For Time Rectification, where the
   *  time is exactly what's being solved for — the default "(optional) /
   *  we'll use sunrise" framing is actively wrong there, since no sunrise
   *  fallback is involved; the caller collects its own explicit "guess"
   *  field elsewhere instead. */
  hideTob?: boolean;
}

const DEFAULT_PLACE: Place = {
  label: "New Delhi",
  lat: 28.6139,
  lon: 77.209,
  tzName: "Asia/Kolkata",
};

export default function BirthForm({ onSubmit, onChange, embedded, loading, label, requireTime, dayUnknown, hideTob }: BirthFormProps) {
  const { t, lang } = useI18n();
  const isHi = lang === "hi";
  const [dob, setDob] = useState("");
  const [tob, setTob] = useState("");
  const [place, setPlace] = useState<Place | null>(DEFAULT_PLACE);
  const [manual, setManual] = useState(false);
  const [mLat, setMLat] = useState("28.6139");
  const [mLon, setMLon] = useState("77.2090");
  const [mTz, setMTz] = useState("5.5");

  // dayUnknown mode: dob is YYYY-MM (no day) — utcOffsetHoursAt needs a full
  // date to resolve historical DST, so probe with day=15 (mid-month) for the
  // tz lookup only. The `dob` value actually sent up stays YYYY-MM.
  const tzProbeDate = dayUnknown && dob ? `${dob}-15` : dob;

  /** The tz sent to the API is resolved for the BIRTH DATE (historical DST),
   *  not for "today" — a July London birth gets +1 (BST), a January one 0 (GMT). */
  function currentBirth(): BirthRequest | null {
    if (!dob) return null;
    if (requireTime && !tob) return null;
    if (manual) {
      const lat = parseFloat(mLat), lon = parseFloat(mLon), tz = parseFloat(mTz);
      if ([lat, lon, tz].some(Number.isNaN)) return null;
      return { dob, tob: tob || undefined, lat, lon, tz };
    }
    if (!place) return null;
    return {
      dob,
      tob: tob || undefined,
      lat: place.lat,
      lon: place.lon,
      tz: utcOffsetHoursAt(place.tzName, tzProbeDate, tob || undefined),
    };
  }

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    onChangeRef.current?.(currentBirth());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dob, tob, place, manual, mLat, mLon, mTz]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const birth = currentBirth();
    if (birth) onSubmit?.(birth);
  }

  const resolvedOffset =
    !manual && place && dob ? utcOffsetHoursAt(place.tzName, tzProbeDate, tob || undefined) : null;

  const fields = (
    <>
      {label && (
        <p style={{ fontWeight: 600, color: "var(--maroon-deep)", marginBottom: "1rem" }}>
          {label}
        </p>
      )}

      <div className="form-group">
        <label className="form-label">
          {dayUnknown ? (isHi ? "जन्म वर्ष व महीना" : "Birth year & month") : t("form.dob")}
        </label>
        <input
          type={dayUnknown ? "month" : "date"}
          className="form-input"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          required
          max={dayUnknown ? new Date().toISOString().slice(0, 7) : new Date().toISOString().split("T")[0]}
        />
      </div>

      {!hideTob && (
        <div className="form-group">
          <label className="form-label">{requireTime ? `${t("form.tob")} *` : t("form.tobOptional")}</label>
          <input
            type="time"
            className="form-input"
            value={tob}
            onChange={(e) => setTob(e.target.value)}
            required={requireTime}
          />
          {!requireTime && <span className="form-hint">{t("form.noTimeTip")}</span>}
        </div>
      )}

      {!manual ? (
        <>
          <PlaceSearch value={place} onSelect={setPlace} />
          {resolvedOffset !== null && place && (
            <p className="form-hint" style={{ marginTop: "-0.5rem", marginBottom: "0.75rem" }}>
              {place.tzName} · UTC{resolvedOffset >= 0 ? "+" : ""}{resolvedOffset}{" "}
              {tob ? "(आपकी जन्म-तिथि के अनुसार / for your birth date)" : "(जन्म-तिथि अनुसार)"}
            </p>
          )}
          <p style={{ marginBottom: "1rem" }}>
            <button
              type="button"
              onClick={() => setManual(true)}
              style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.78rem", color: "var(--maroon)", fontWeight: 600, textDecoration: "underline", padding: 0 }}
            >
              Can&apos;t find your place? Enter coordinates manually
            </button>
          </p>
        </>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "0.75rem" }}>
            <div className="form-group">
              <label className="form-label">{t("form.lat")}</label>
              <input className="form-input" type="number" step="0.0001" value={mLat} onChange={(e) => setMLat(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">{t("form.lon")}</label>
              <input className="form-input" type="number" step="0.0001" value={mLon} onChange={(e) => setMLon(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">{t("form.tz")}</label>
              <input className="form-input" type="number" step="0.25" value={mTz} onChange={(e) => setMTz(e.target.value)} required />
            </div>
          </div>
          <p style={{ marginBottom: "1rem" }}>
            <button
              type="button"
              onClick={() => { setManual(false); setPlace(DEFAULT_PLACE); }}
              style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.78rem", color: "var(--maroon)", fontWeight: 600, textDecoration: "underline", padding: 0 }}
            >
              ← Back to place search
            </button>
          </p>
        </>
      )}
    </>
  );

  if (embedded) {
    return <div>{fields}</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      {fields}
      <button
        type="submit"
        className="btn btn-primary"
        disabled={loading || (!manual && !place) || (requireTime && !tob)}
        style={{ width: "100%" }}
      >
        {loading ? t("form.calculating") : t("form.calculate")}
      </button>
    </form>
  );
}

// Re-export for callers that need to resolve places themselves (e.g. Panchang).
export { timezoneNameFor };
