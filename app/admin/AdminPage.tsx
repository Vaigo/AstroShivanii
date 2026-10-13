"use client";

import { useEffect, useState } from "react";
import PatrikaFrame from "@/components/PatrikaFrame";
import PasswordInput from "@/components/PasswordInput";
import {
  adminOverview, adminUsers, adminOrders, adminBookings,
  adminReports, adminReportApprove, adminReportReject, adminPreviewReportUrl, ADMIN_LIST_CAP,
  type AdminOverview, type AdminUserRow, type TuOrder, type SiteBooking, type ReportJob,
} from "@/lib/api/site";

const KEY_STORAGE = "as-admin-key";

function fmt(unix: number): string {
  return new Date(unix * 1000).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

function fmtUsd(n: number | null | undefined): string {
  return n == null ? "—" : `$${n.toFixed(4)}`;
}

/* ── date filter ── all in the browser's local time, the same clock fmt() prints rows in */

/** Local YYYY-MM-DD (toISOString() would shift the day for UTC+5:30). */
function ymd(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

/** Quick ranges, both ends inclusive. "All time" is the empty range. */
function datePresets(): Array<{ label: string; from: string; to: string }> {
  const now = new Date();
  const today = ymd(now);
  const yesterday = ymd(addDays(now, -1));
  return [
    { label: "Today", from: today, to: today },
    { label: "Yesterday", from: yesterday, to: yesterday },
    { label: "Last 7 days", from: ymd(addDays(now, -6)), to: today },
    { label: "Last 30 days", from: ymd(addDays(now, -29)), to: today },
    { label: "This month", from: ymd(new Date(now.getFullYear(), now.getMonth(), 1)), to: today },
    { label: "All time", from: "", to: "" },
  ];
}

/** Is this unix-seconds timestamp inside [from, to] (whole days, inclusive)? An empty end is open. */
function inRange(unix: number, from: string, to: string): boolean {
  const t = unix * 1000;
  if (from && t < new Date(`${from}T00:00:00`).getTime()) return false;
  if (to && t >= addDays(new Date(`${to}T00:00:00`), 1).getTime()) return false;
  return true;
}

/** Same rule as the Overview revenue card: only answered/paid orders count as revenue. */
const isRevenueStatus = (s: string) => s === "answered" || s === "paid";

function DateFilterBar({ from, to, onChange, summary, note }: {
  from: string; to: string; onChange: (from: string, to: string) => void; summary: string; note?: string;
}) {
  const presets = datePresets();
  const label: React.CSSProperties = {
    display: "flex", flexDirection: "column", gap: "0.25rem",
    fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--gold-deep)",
  };
  const dateField: React.CSSProperties = { width: 150, padding: "0.45rem 0.6rem", fontSize: "0.85rem" };
  return (
    <div style={{ marginBottom: "1rem" }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem 0.9rem", alignItems: "flex-end" }}>
        <label style={label}>From
          <input type="date" className="form-input" style={dateField} value={from}
            onChange={(e) => { const v = e.target.value; onChange(v, v && to && v > to ? v : to); }} />
        </label>
        <label style={label}>To
          <input type="date" className="form-input" style={dateField} value={to}
            onChange={(e) => { const v = e.target.value; onChange(v && from && v < from ? v : from, v); }} />
        </label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
          {presets.map((p) => (
            <button key={p.label} type="button"
              className={`btn btn-sm ${p.from === from && p.to === to ? "btn-secondary" : "btn-ghost"}`}
              style={{ padding: "0.4rem 0.8rem", fontSize: "0.78rem" }}
              onClick={() => onChange(p.from, p.to)}>
              {p.label}
            </button>
          ))}
        </div>
      </div>
      <div style={{ marginTop: "0.6rem", fontSize: "0.85rem" }}>
        <strong style={{ color: "var(--maroon-deep)" }}>{summary}</strong>
        {note && <div style={{ color: "#b3423a", fontSize: "0.78rem", marginTop: 2 }}>{note}</div>}
      </div>
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div style={{ background: "var(--panel)", border: "1.5px solid rgba(201,154,58,0.45)", borderRadius: 3, padding: "1rem 1.2rem", flex: 1, minWidth: 150 }}>
      <div style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--gold-deep)" }}>{label}</div>
      <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.7rem", color: "var(--maroon-deep)", fontVariantNumeric: "tabular-nums" }}>{value}</div>
      {sub && <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>{sub}</div>}
    </div>
  );
}

function Bars({ rows, labelKey, max }: { rows: Array<Record<string, unknown>>; labelKey: string; max: number }) {
  return (
    <div style={{ display: "grid", gap: "0.45rem" }}>
      {rows.map((r, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <span style={{ width: 110, fontSize: "0.78rem", color: "var(--ink-light)", textAlign: "right", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {String(r[labelKey])}
          </span>
          <div style={{ flex: 1, background: "rgba(201,154,58,0.15)", borderRadius: 2, height: 14 }}>
            <div style={{ width: `${Math.max((Number(r.c) / max) * 100, 3)}%`, height: "100%", borderRadius: 2, background: "linear-gradient(90deg, var(--gold), var(--saffron))" }} />
          </div>
          <span style={{ width: 34, fontSize: "0.8rem", fontWeight: 700, color: "var(--maroon-deep)", fontVariantNumeric: "tabular-nums" }}>{String(r.c)}</span>
        </div>
      ))}
    </div>
  );
}

type Tab = "overview" | "users" | "orders" | "bookings" | "reports";

export default function AdminPage() {
  const [key, setKey] = useState("");
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<Tab>("overview");
  // Date filter shared by the Users / Orders / Bookings / Reports tabs ("" = open end).
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [ov, setOv] = useState<AdminOverview | null>(null);
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [orders, setOrders] = useState<TuOrder[]>([]);
  const [bookings, setBookings] = useState<SiteBooking[]>([]);
  const [reports, setReports] = useState<ReportJob[]>([]);
  const [loading, setLoading] = useState(false);
  const [busyReportId, setBusyReportId] = useState<number | null>(null);

  useEffect(() => {
    const saved = window.sessionStorage.getItem(KEY_STORAGE);
    if (saved) { setKey(saved); void loadAll(saved); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadAll(k: string) {
    setLoading(true); setError("");
    try {
      const [o, u, or_, b, rep] = await Promise.all([
        adminOverview(k), adminUsers(k), adminOrders(k), adminBookings(k), adminReports(k),
      ]);
      setOv(o); setUsers(u.users); setOrders(or_.orders); setBookings(b.bookings); setReports(rep.reports);
      setAuthed(true);
      window.sessionStorage.setItem(KEY_STORAGE, k);
    } catch {
      setError("Invalid admin key or backend unreachable");
      setAuthed(false);
      window.sessionStorage.removeItem(KEY_STORAGE);
    } finally {
      setLoading(false);
    }
  }

  async function handlePreview(jobId: number) {
    try {
      const url = await adminPreviewReportUrl(key, jobId);
      window.open(url, "_blank", "noopener,noreferrer");
    } catch {
      setError("Could not load PDF preview");
    }
  }

  async function handleApprove(jobId: number) {
    setBusyReportId(jobId);
    try {
      await adminReportApprove(key, jobId);
      await loadAll(key);
    } finally {
      setBusyReportId(null);
    }
  }

  async function handleReject(jobId: number) {
    setBusyReportId(jobId);
    try {
      await adminReportReject(key, jobId);
      await loadAll(key);
    } finally {
      setBusyReportId(null);
    }
  }

  if (!authed) {
    return (
      <section className="section">
        <div className="container" style={{ maxWidth: 420 }}>
          <h1 className="section-heading">Admin</h1>
          <PatrikaFrame>
            <form onSubmit={(e) => { e.preventDefault(); void loadAll(key); }}>
              <div className="form-group">
                <label className="form-label" htmlFor="adm-key">Admin key</label>
                <PasswordInput id="adm-key" value={key} onChange={(e) => setKey(e.target.value)} autoComplete="off" />
              </div>
              {error && <p className="form-error" style={{ marginBottom: "0.75rem" }}>{error}</p>}
              <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={loading || !key}>
                {loading ? "…" : "Open Panel"}
              </button>
            </form>
          </PatrikaFrame>
        </div>
      </section>
    );
  }

  const maxCat = Math.max(...(ov?.turant_uttar.by_category.map((r) => r.c) ?? [1]), 1);
  const maxRead = Math.max(...(ov?.bookings.by_reading.map((r) => r.c) ?? [1]), 1);
  const maxTrend = Math.max(...(ov?.turant_uttar.trend_14d.map((r) => r.c) ?? [1]), 1);

  const th: React.CSSProperties = { textAlign: "left", padding: "0.45rem 0.6rem", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--gold-deep)", borderBottom: "1.5px solid var(--gold)" };
  const td: React.CSSProperties = { padding: "0.5rem 0.6rem", fontSize: "0.82rem", borderBottom: "1px solid rgba(201,154,58,0.18)", verticalAlign: "top" };

  // ── date-filtered views (the API already returns newest first) ──
  const rangeActive = from !== "" || to !== "";
  const fUsers = users.filter((u) => inRange(u.created_at, from, to));
  const fOrders = orders.filter((o) => inRange(o.created_at, from, to));
  const fBookings = bookings.filter((b) => inRange(b.created_at, from, to));
  const fReports = reports.filter((r) => inRange(r.created_at, from, to));

  const plural = (n: number, one: string, many = `${one}s`) => `${n.toLocaleString("en-IN")} ${n === 1 ? one : many}`;
  const rupees = (n: number) => `₹${n.toLocaleString("en-IN")}`;

  const orderRevenue = fOrders.reduce((s, o) => s + (isRevenueStatus(o.status) ? o.amount_inr : 0), 0);
  const orderAiCost = fOrders.reduce((s, o) => s + (o.ai_cost_usd ?? 0), 0);
  const paidBookings = fBookings.filter((b) => b.status === "paid");
  const bookingRevenue = paidBookings.reduce((s, b) => s + (b.amount_inr ?? 0), 0);

  // Orders per calendar day inside the range, newest day first.
  const ordersByDay = (() => {
    const m = new Map<string, { n: number; rev: number }>();
    for (const o of fOrders) {
      const d = ymd(new Date(o.created_at * 1000));
      const e = m.get(d) ?? { n: 0, rev: 0 };
      e.n += 1;
      if (isRevenueStatus(o.status)) e.rev += o.amount_inr;
      m.set(d, e);
    }
    return [...m.entries()].sort((a, b) => (a[0] < b[0] ? 1 : -1));
  })();

  const filterSummary =
    tab === "orders" ? `${plural(fOrders.length, "order")} · ${rupees(orderRevenue)} revenue · AI ${fmtUsd(orderAiCost)}`
    : tab === "bookings" ? `${plural(fBookings.length, "booking")} · ${paidBookings.length} paid · ${rupees(bookingRevenue)}`
    : tab === "reports" ? `${plural(fReports.length, "report request")} · ${fReports.filter((r) => r.status === "pending_review").length} pending review`
    : `${plural(fUsers.length, "user")} joined`;
  const capNote =
    tab === "orders" && orders.length >= ADMIN_LIST_CAP.orders ? `Only the latest ${ADMIN_LIST_CAP.orders} orders are loaded — older ones are not included.`
    : tab === "bookings" && bookings.length >= ADMIN_LIST_CAP.bookings ? `Only the latest ${ADMIN_LIST_CAP.bookings} bookings are loaded — older ones are not included.`
    : tab === "reports" && reports.length >= ADMIN_LIST_CAP.reports ? `Only the latest ${ADMIN_LIST_CAP.reports} reports are loaded — older ones are not included.`
    : tab === "users" && users.length >= ADMIN_LIST_CAP.users ? `Only the latest ${ADMIN_LIST_CAP.users} users are loaded — older ones are not included.`
    : undefined;

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 1080 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "0.75rem" }}>
          <h1 className="section-heading" style={{ textAlign: "left", marginBottom: "0.5rem" }}>Site Admin</h1>
          <button className="btn btn-ghost btn-sm" onClick={() => { window.sessionStorage.removeItem(KEY_STORAGE); setAuthed(false); }}>
            Lock
          </button>
        </div>

        <div style={{ display: "flex", gap: "0.5rem", margin: "1rem 0 1.5rem", flexWrap: "wrap" }}>
          {(["overview", "users", "orders", "bookings", "reports"] as const).map((tb) => (
            <button key={tb} className={`btn btn-sm ${tab === tb ? "btn-secondary" : "btn-ghost"}`} onClick={() => setTab(tb)}>
              {tb[0].toUpperCase() + tb.slice(1)}
              {tb === "users" && ` (${rangeActive ? `${fUsers.length} of ${users.length}` : users.length})`}
              {tb === "orders" && ` (${rangeActive ? `${fOrders.length} of ${orders.length}` : orders.length})`}
              {tb === "bookings" && ` (${rangeActive ? `${fBookings.length} of ${bookings.length}` : bookings.length})`}
              {tb === "reports" && reports.filter((r) => r.status === "pending_review").length > 0
                ? ` (${reports.filter((r) => r.status === "pending_review").length} pending)`
                : tb === "reports" ? ` (${reports.length})` : ""}
            </button>
          ))}
          <button className="btn btn-ghost btn-sm" onClick={() => loadAll(key)} disabled={loading}>⟳ Refresh</button>
        </div>

        {tab !== "overview" && (
          <DateFilterBar from={from} to={to} summary={filterSummary} note={capNote}
            onChange={(f, t) => { setFrom(f); setTo(t); }} />
        )}

        {tab === "orders" && ordersByDay.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "1rem", maxHeight: 130, overflowY: "auto" }}
            aria-label="Orders per day">
            {ordersByDay.slice(0, 62).map(([d, e]) => (
              <div key={d} style={{ border: "1px solid rgba(201,154,58,0.45)", borderRadius: 2, padding: "0.3rem 0.6rem", fontSize: "0.76rem", background: "var(--panel)", fontVariantNumeric: "tabular-nums" }}>
                <span style={{ color: "var(--muted)" }}>
                  {new Date(`${d}T00:00:00`).toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "short" })}
                </span>
                {" · "}<strong style={{ color: "var(--maroon-deep)" }}>{plural(e.n, "order")}</strong>
                {e.rev > 0 && <span style={{ color: "var(--ink-light)" }}> · {rupees(e.rev)}</span>}
              </div>
            ))}
            {ordersByDay.length > 62 && <span style={{ fontSize: "0.76rem", color: "var(--muted)", alignSelf: "center" }}>+{ordersByDay.length - 62} earlier days</span>}
          </div>
        )}

        {tab === "overview" && ov && (
          <>
            <div style={{ display: "flex", gap: "0.9rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
              <StatCard label="Users" value={ov.users.total} sub={`+${ov.users.new_this_week} this week`} />
              <StatCard label="तुरंत उत्तर" value={ov.turant_uttar.total} sub={`${ov.turant_uttar.today} today`} />
              <StatCard label="TU Revenue" value={`₹${ov.turant_uttar.revenue_inr.toLocaleString("en-IN")}`} sub="self-attested until Razorpay" />
              <StatCard label="Bookings" value={ov.bookings.total} sub={`${ov.bookings.paid} paid`} />
              <StatCard label="Palmistry" value={ov.palmistry.total} sub={`₹${ov.palmistry.revenue_inr.toLocaleString("en-IN")} revenue`} />
              <StatCard
                label="AI Cost"
                value={fmtUsd(ov.turant_uttar.ai_cost_usd + ov.bookings.report_ai_cost_usd + ov.palmistry.ai_cost_usd)}
                sub={`TU ${fmtUsd(ov.turant_uttar.ai_cost_usd)} · Reports ${fmtUsd(ov.bookings.report_ai_cost_usd)} · Palmistry ${fmtUsd(ov.palmistry.ai_cost_usd)}`}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}>
              <PatrikaFrame style={{ padding: "1.25rem" }}>
                <h3 style={{ fontSize: "0.95rem", marginBottom: "0.9rem" }}>Questions by category</h3>
                {ov.turant_uttar.by_category.length
                  ? <Bars rows={ov.turant_uttar.by_category} labelKey="category" max={maxCat} />
                  : <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>No data yet</p>}
              </PatrikaFrame>

              <PatrikaFrame style={{ padding: "1.25rem" }}>
                <h3 style={{ fontSize: "0.95rem", marginBottom: "0.9rem" }}>Bookings by reading</h3>
                {ov.bookings.by_reading.length
                  ? <Bars rows={ov.bookings.by_reading} labelKey="reading_slug" max={maxRead} />
                  : <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>No data yet</p>}
              </PatrikaFrame>

              <PatrikaFrame style={{ padding: "1.25rem" }}>
                <h3 style={{ fontSize: "0.95rem", marginBottom: "0.9rem" }}>तुरंत उत्तर — last 14 days</h3>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 90 }}>
                  {ov.turant_uttar.trend_14d.length === 0 && <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>No data yet</p>}
                  {ov.turant_uttar.trend_14d.map((r) => (
                    <div key={r.d} title={`${r.d}: ${r.c}`}
                      style={{ flex: 1, minWidth: 8, height: `${(r.c / maxTrend) * 100}%`, background: "linear-gradient(180deg, var(--gold-bright), var(--gold))", borderRadius: "2px 2px 0 0" }} />
                  ))}
                </div>
                <div style={{ fontSize: "0.7rem", color: "var(--muted)", marginTop: 6 }}>
                  Narration: {ov.turant_uttar.narrated_by.map((n) => `${n.n} ${n.c}`).join(" · ") || "—"}
                </div>
              </PatrikaFrame>
            </div>
          </>
        )}

        {tab === "users" && (
          <PatrikaFrame style={{ padding: "0.75rem", overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 640 }}>
                <thead><tr>
                  <th style={th}>Email</th><th style={th}>Name</th><th style={th}>Joined</th>
                  <th style={th}>Questions</th><th style={th}>Bookings</th>
                  <th style={th} title="Only orders linked to a logged-in account — Turant Uttar has no login step, so most guest orders won't show here. See Overview for total revenue.">
                    Spent (linked)
                  </th>
                </tr></thead>
                <tbody>
                  {fUsers.map((u) => (
                    <tr key={u.id}>
                      <td style={td}>{u.email}</td>
                      <td style={td}>{u.name || "—"}</td>
                      <td style={td}>{fmt(u.created_at)}</td>
                      <td style={td}>{u.tu_count}</td>
                      <td style={td}>{u.booking_count}</td>
                      <td style={{ ...td, fontWeight: 700 }}>₹{u.spent_inr}</td>
                    </tr>
                  ))}
                  {fUsers.length === 0 && <tr><td style={td} colSpan={6}>{users.length === 0 ? "No users yet" : "No users joined in this date range"}</td></tr>}
                </tbody>
              </table>
            </div>
          </PatrikaFrame>
        )}

        {tab === "orders" && (
          <PatrikaFrame style={{ padding: "0.75rem", overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 760 }}>
                <thead><tr>
                  <th style={th}>When</th><th style={th}>Question</th><th style={th}>Category</th>
                  <th style={th}>User</th><th style={th}>Ref</th><th style={th}>Narration</th>
                  <th style={th}>AI Cost</th><th style={th}>₹</th>
                </tr></thead>
                <tbody>
                  {fOrders.map((o) => (
                    <tr key={o.id}>
                      <td style={{ ...td, whiteSpace: "nowrap" }}>{fmt(o.created_at)}</td>
                      <td style={{ ...td, maxWidth: 260 }} className="devanagari">{o.question}</td>
                      <td style={td}>{o.category}</td>
                      <td style={td}>{o.user_email ?? (o.name || "guest")}</td>
                      <td style={{ ...td, whiteSpace: "nowrap" }}>{o.ref_code ?? "—"}</td>
                      <td style={td}>{o.narrated_by}</td>
                      <td style={{ ...td, whiteSpace: "nowrap" }}>{fmtUsd(o.ai_cost_usd)}</td>
                      <td style={{ ...td, fontWeight: 700 }}>{o.amount_inr}</td>
                    </tr>
                  ))}
                  {fOrders.length === 0 && <tr><td style={td} colSpan={8}>{orders.length === 0 ? "No orders yet" : "No orders in this date range"}</td></tr>}
                </tbody>
              </table>
            </div>
          </PatrikaFrame>
        )}

        {tab === "bookings" && (
          <PatrikaFrame style={{ padding: "0.75rem", overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 760 }}>
                <thead><tr>
                  <th style={th}>When</th><th style={th}>Reading</th><th style={th}>Name</th>
                  <th style={th}>WhatsApp</th><th style={th}>Birth</th><th style={th}>Status</th><th style={th}>₹</th>
                </tr></thead>
                <tbody>
                  {fBookings.map((b) => (
                    <tr key={b.id}>
                      <td style={{ ...td, whiteSpace: "nowrap" }}>{fmt(b.created_at)}</td>
                      <td style={td}>{b.reading_slug}</td>
                      <td style={td}>{b.name || "—"}</td>
                      <td style={{ ...td, whiteSpace: "nowrap" }}>{b.whatsapp || "—"}</td>
                      <td style={{ ...td, whiteSpace: "nowrap" }}>{b.dob}{b.tob ? ` ${b.tob}` : ""}</td>
                      <td style={{ ...td, fontWeight: 700, color: b.status === "paid" ? "#1a7a3a" : "var(--saffron)" }}>{b.status}</td>
                      <td style={{ ...td, fontWeight: 700 }}>{b.amount_inr ?? "—"}</td>
                    </tr>
                  ))}
                  {fBookings.length === 0 && <tr><td style={td} colSpan={7}>{bookings.length === 0 ? "No bookings yet" : "No bookings in this date range"}</td></tr>}
                </tbody>
              </table>
            </div>
          </PatrikaFrame>
        )}

        {tab === "reports" && (
          <PatrikaFrame style={{ padding: "0.75rem", overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 820 }}>
                <thead><tr>
                  <th style={th}>Requested</th><th style={th}>Customer</th><th style={th}>Birth</th>
                  <th style={th}>Status</th><th style={th}>AI Cost</th><th style={th}>₹</th><th style={th}>Actions</th>
                </tr></thead>
                <tbody>
                  {fReports.map((r) => (
                    <tr key={r.id}>
                      <td style={{ ...td, whiteSpace: "nowrap" }}>{fmt(r.created_at)}</td>
                      <td style={td}>{r.name || "—"}<br /><span style={{ color: "var(--muted)", fontSize: "0.72rem" }}>{r.email || r.whatsapp}</span></td>
                      <td style={{ ...td, whiteSpace: "nowrap" }}>{r.dob}{r.tob ? ` ${r.tob}` : ""}</td>
                      <td style={{
                        ...td, fontWeight: 700,
                        color: r.status === "ready" ? "#1a7a3a"
                          : r.status === "failed" ? "#b3423a"
                          : r.status === "pending_review" ? "var(--saffron)"
                          : "var(--muted)",
                      }}>
                        {r.status}
                        {r.status === "failed" && r.error && (
                          <div style={{ fontWeight: 400, fontSize: "0.72rem", color: "var(--muted)", maxWidth: 220 }}>{r.error}</div>
                        )}
                      </td>
                      <td style={{ ...td, whiteSpace: "nowrap" }}>{fmtUsd(r.ai_cost_usd)}</td>
                      <td style={{ ...td, fontWeight: 700 }}>{r.amount_inr ?? "—"}</td>
                      <td style={{ ...td, whiteSpace: "nowrap" }}>
                        {r.status === "pending_review" && (
                          <>
                            <button className="btn btn-ghost btn-sm" onClick={() => handlePreview(r.id)} style={{ marginRight: 6 }}>Preview</button>
                            <button className="btn btn-secondary btn-sm" disabled={busyReportId === r.id} onClick={() => handleApprove(r.id)} style={{ marginRight: 6 }}>Approve</button>
                            <button className="btn btn-ghost btn-sm" disabled={busyReportId === r.id} onClick={() => handleReject(r.id)}>Reject</button>
                          </>
                        )}
                        {r.status === "ready" && (
                          <button className="btn btn-ghost btn-sm" onClick={() => handlePreview(r.id)}>View</button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {fReports.length === 0 && <tr><td style={td} colSpan={7}>{reports.length === 0 ? "No reports yet" : "No reports in this date range"}</td></tr>}
                </tbody>
              </table>
            </div>
          </PatrikaFrame>
        )}
      </div>
    </section>
  );
}
