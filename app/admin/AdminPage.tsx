"use client";

import { useEffect, useState } from "react";
import PatrikaFrame from "@/components/PatrikaFrame";
import {
  adminOverview, adminUsers, adminOrders, adminBookings,
  adminReports, adminReportApprove, adminReportReject, adminPreviewReportUrl,
  type AdminOverview, type AdminUserRow, type TuOrder, type SiteBooking, type ReportJob,
} from "@/lib/api/site";

const KEY_STORAGE = "as-admin-key";

function fmt(unix: number): string {
  return new Date(unix * 1000).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

function fmtUsd(n: number | null | undefined): string {
  return n == null ? "—" : `$${n.toFixed(4)}`;
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
                <input id="adm-key" className="form-input" type="password" value={key} onChange={(e) => setKey(e.target.value)} autoComplete="off" />
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
              {tb === "users" && ` (${users.length})`}
              {tb === "orders" && ` (${orders.length})`}
              {tb === "bookings" && ` (${bookings.length})`}
              {tb === "reports" && reports.filter((r) => r.status === "pending_review").length > 0
                ? ` (${reports.filter((r) => r.status === "pending_review").length} pending)`
                : tb === "reports" ? ` (${reports.length})` : ""}
            </button>
          ))}
          <button className="btn btn-ghost btn-sm" onClick={() => loadAll(key)} disabled={loading}>⟳ Refresh</button>
        </div>

        {tab === "overview" && ov && (
          <>
            <div style={{ display: "flex", gap: "0.9rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
              <StatCard label="Users" value={ov.users.total} sub={`+${ov.users.new_this_week} this week`} />
              <StatCard label="तुरंत उत्तर" value={ov.turant_uttar.total} sub={`${ov.turant_uttar.today} today`} />
              <StatCard label="TU Revenue" value={`₹${ov.turant_uttar.revenue_inr.toLocaleString("en-IN")}`} sub="self-attested until Razorpay" />
              <StatCard label="Bookings" value={ov.bookings.total} sub={`${ov.bookings.paid} paid`} />
              <StatCard
                label="AI Cost"
                value={fmtUsd(ov.turant_uttar.ai_cost_usd + ov.bookings.report_ai_cost_usd)}
                sub={`TU ${fmtUsd(ov.turant_uttar.ai_cost_usd)} · Reports ${fmtUsd(ov.bookings.report_ai_cost_usd)}`}
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
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td style={td}>{u.email}</td>
                      <td style={td}>{u.name || "—"}</td>
                      <td style={td}>{fmt(u.created_at)}</td>
                      <td style={td}>{u.tu_count}</td>
                      <td style={td}>{u.booking_count}</td>
                      <td style={{ ...td, fontWeight: 700 }}>₹{u.spent_inr}</td>
                    </tr>
                  ))}
                  {users.length === 0 && <tr><td style={td} colSpan={6}>No users yet</td></tr>}
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
                  {orders.map((o) => (
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
                  {orders.length === 0 && <tr><td style={td} colSpan={8}>No orders yet</td></tr>}
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
                  {bookings.map((b) => (
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
                  {bookings.length === 0 && <tr><td style={td} colSpan={7}>No bookings yet</td></tr>}
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
                  {reports.map((r) => (
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
                  {reports.length === 0 && <tr><td style={td} colSpan={7}>No reports yet</td></tr>}
                </tbody>
              </table>
            </div>
          </PatrikaFrame>
        )}
      </div>
    </section>
  );
}
