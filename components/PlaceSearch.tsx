"use client";

import { useEffect, useRef, useState } from "react";
import { CITIES } from "@/lib/cities";
import { timezoneNameFor } from "@/lib/timezone";

export interface Place {
  label: string;      // "Farrukhabad, Uttar Pradesh"
  lat: number;
  lon: number;
  tzName: string;     // IANA, e.g. "Asia/Kolkata"
}

interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
  address?: Record<string, string>;
}

interface PlaceSearchProps {
  value: Place | null;
  onSelect: (place: Place | null) => void;
  label?: string;
  placeholder?: string;
}

function placeFromNominatim(r: NominatimResult): Place {
  const addr = r.address ?? {};
  const name =
    addr.city || addr.town || addr.village || addr.suburb || addr.county ||
    r.display_name.split(",")[0].trim();
  const region = addr.state || addr.country || "";
  const lat = parseFloat(r.lat);
  const lon = parseFloat(r.lon);
  return {
    label: region && region !== name ? `${name}, ${region}` : name,
    lat, lon,
    tzName: timezoneNameFor(lat, lon),
  };
}

/** Search-as-you-type place picker: worldwide Nominatim geocoding (no key),
 *  debounced 400ms, curated quick picks while empty, offline IANA timezone
 *  resolution per result. Used by BirthForm and the Panchang tool. */
export default function PlaceSearch({ value, onSelect, label, placeholder }: PlaceSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [open, setOpen] = useState(false);
  const [failed, setFailed] = useState(false);        // network / service failure
  const [noResults, setNoResults] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (debounceRef.current) clearTimeout(debounceRef.current); }, []);

  function handleInput(val: string) {
    setQuery(val);
    onSelect(null);
    setFailed(false);
    setNoResults(false);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (val.trim().length < 2) {
      setResults([]);
      setOpen(val.trim().length === 0 || val.trim().length === 1);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        // Worldwide search — deliberately NO countrycodes restriction:
        // the site serves NRI visitors born anywhere.
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(val)}&format=json&limit=7&addressdetails=1`,
          { headers: { "Accept-Language": "en" } }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: NominatimResult[] = await res.json();
        setResults(data);
        setOpen(true);
        setNoResults(data.length === 0);
      } catch {
        setResults([]);
        setOpen(false);
        setFailed(true);
      }
      setSearching(false);
    }, 400);
  }

  function pick(place: Place) {
    onSelect(place);
    setQuery("");
    setResults([]);
    setOpen(false);
    setNoResults(false);
  }

  const showQuickPicks = open && query.trim().length < 2;

  return (
    <div className="form-group">
      <label className="form-label">{label ?? "जन्म स्थान / Birth place"}</label>

      {value ? (
        <div className="place-chip">
          <span className="place-chip-name">📍 {value.label}</span>
          <span className="place-chip-tz">{value.tzName}</span>
          <button
            type="button"
            className="place-chip-clear"
            onClick={() => { onSelect(null); setQuery(""); setOpen(false); }}
            aria-label="Change place"
            title="Change"
          >
            ✕
          </button>
        </div>
      ) : (
        <div style={{ position: "relative" }}>
          <input
            type="text"
            className="form-input"
            value={query}
            onChange={(e) => handleInput(e.target.value)}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 180)}
            placeholder={placeholder ?? "Type any city… e.g. Kanpur, Dubai, London"}
            autoComplete="off"
            spellCheck={false}
          />
          {searching && <span className="place-searching">···</span>}

          {open && (results.length > 0 || showQuickPicks) && (
            <div className="place-dropdown">
              {showQuickPicks && (
                <>
                  <div className="place-dropdown-head">लोकप्रिय / Popular</div>
                  {CITIES.slice(0, 8).map((c) => (
                    <div
                      key={c.name}
                      className="place-option"
                      onMouseDown={() => pick({ label: c.name, lat: c.lat, lon: c.lon, tzName: timezoneNameFor(c.lat, c.lon) })}
                    >
                      <span>📍 {c.name}</span>
                    </div>
                  ))}
                </>
              )}
              {results.map((r, i) => {
                const p = placeFromNominatim(r);
                const parts = r.display_name.split(",").map((s) => s.trim());
                return (
                  <div key={i} className="place-option" onMouseDown={() => pick(p)}>
                    <span>📍 {parts[0]}</span>
                    <span className="place-option-sub">{parts.slice(1, 3).join(", ")}</span>
                  </div>
                );
              })}
            </div>
          )}

          {noResults && !searching && (
            <p className="form-hint" style={{ color: "#a93226" }}>
              कोई परिणाम नहीं — दूसरी वर्तनी आज़माएँ / No results — try another spelling, or enter coordinates manually below.
            </p>
          )}
          {failed && (
            <p className="form-hint" style={{ color: "#a93226" }}>
              Place search is unreachable right now — use &quot;enter coordinates manually&quot; below.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
