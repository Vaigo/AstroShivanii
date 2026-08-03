"use client";

import { useI18n } from "@/lib/i18n";
import { EVENT_TYPES, type EventTypeKey } from "@/lib/rectification-data";

export interface EventRow {
  id: string;
  type: EventTypeKey | "";
  date: string;
  note: string;
}

export function emptyEventRow(): EventRow {
  return { id: `ev-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`, type: "", date: "", note: "" };
}

export type ValidEventRow = EventRow & { type: EventTypeKey };

export function isValidRow(r: EventRow): r is ValidEventRow {
  return !!r.type && !!r.date;
}

interface LifeEventRowsProps {
  rows: EventRow[];
  onChange: (rows: EventRow[]) => void;
  /** Shown as a hint only ("N / max — at least MIN required") — the actual
   *  gate (disabling "Continue") lives in the parent, not here. */
  min: number;
  max?: number;
}

/** Repeatable life-event input: type (fixed dropdown, matches the backend's
 *  closed EventType vocabulary) + date + optional note, "add another" up to
 *  `max`. No such repeatable-row pattern existed anywhere in this repo before
 *  Time Rectification — built from the existing plain form-select/form-input
 *  conventions, not a new UI library. */
export default function LifeEventRows({ rows, onChange, min, max = 10 }: LifeEventRowsProps) {
  const { lang } = useI18n();
  const isHi = lang === "hi";

  function update(id: string, patch: Partial<EventRow>) {
    onChange(rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  function remove(id: string) {
    onChange(rows.filter((r) => r.id !== id));
  }

  function add() {
    if (rows.length >= max) return;
    onChange([...rows, emptyEventRow()]);
  }

  const validCount = rows.filter(isValidRow).length;

  return (
    <div>
      {rows.map((row, i) => (
        <div
          key={row.id}
          style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start", marginBottom: "0.6rem", flexWrap: "wrap" }}
        >
          <div className="form-group" style={{ flex: "1 1 180px", marginBottom: 0 }}>
            {i === 0 && <label className="form-label">{isHi ? "घटना प्रकार" : "Event type"}</label>}
            <select
              className="form-select"
              value={row.type}
              onChange={(e) => update(row.id, { type: e.target.value as EventTypeKey })}
            >
              <option value="">{isHi ? "— चुनें —" : "— select —"}</option>
              {EVENT_TYPES.map((et) => (
                <option key={et.key} value={et.key}>{isHi ? et.label.hi : et.label.en}</option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ flex: "1 1 140px", marginBottom: 0 }}>
            {i === 0 && <label className="form-label">{isHi ? "तारीख" : "Date"}</label>}
            <input
              type="date"
              className="form-input"
              value={row.date}
              onChange={(e) => update(row.id, { date: e.target.value })}
              max={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div className="form-group" style={{ flex: "2 1 200px", marginBottom: 0 }}>
            {i === 0 && <label className="form-label">{isHi ? "टिप्पणी (वैकल्पिक)" : "Note (optional)"}</label>}
            <input
              type="text"
              className="form-input"
              value={row.note}
              onChange={(e) => update(row.id, { note: e.target.value })}
              maxLength={100}
              placeholder={isHi ? "जैसे: पहली नौकरी" : "e.g., first job"}
            />
          </div>

          <button
            type="button"
            onClick={() => remove(row.id)}
            disabled={rows.length <= 1}
            aria-label={isHi ? "यह घटना हटाएं" : "Remove this event"}
            style={{
              background: "none", border: "none",
              cursor: rows.length <= 1 ? "default" : "pointer",
              color: rows.length <= 1 ? "var(--muted)" : "var(--maroon)",
              fontSize: "1.1rem", fontWeight: 700,
              padding: "0.5rem 0.4rem", marginTop: i === 0 ? "1.6rem" : 0,
              opacity: rows.length <= 1 ? 0.3 : 1,
            }}
          >
            ✕
          </button>
        </div>
      ))}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.4rem", flexWrap: "wrap", gap: "0.5rem" }}>
        <button type="button" className="btn btn-ghost btn-sm" onClick={add} disabled={rows.length >= max}>
          + {isHi ? "एक और घटना जोड़ें" : "Add another event"}
        </button>
        <span className={`form-hint${isHi ? " devanagari" : ""}`}>
          {validCount} / {max}
          {validCount < min
            ? isHi ? ` — कम से कम ${min} आवश्यक` : ` — at least ${min} required`
            : ""}
        </span>
      </div>
    </div>
  );
}
