import type { Metadata } from "next";
import Link from "next/link";
import TimeRectificationTool from "./TimeRectificationTool";

// Unpublished (2026-08): not confident this delivers ₹1100 of real accuracy
// yet — see project memory. Page code stays live for existing customers with
// a direct link, but it's pulled from nav/homepage/footer/sitemap and kept
// out of search results until the underlying method improves.
export const metadata: Metadata = {
  title: "जन्म समय शुद्धिकरण — Birth Time Rectification",
  description:
    "Don't know your exact birth time? Tell us a few certain life events — marriage, job change, an accident — and we'll narrow down your real birth time using dasha analysis, cross-checked with the KP ruling-planet method.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <>
      <TimeRectificationTool />
      <div className="container" style={{ maxWidth: "760px", margin: "-2rem auto 0", padding: "0 1rem 2.5rem", textAlign: "center" }}>
        <p style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
          Related: <Link href="/guides/birth-time-missing-astrology">No birth time? What astrology can still tell you</Link> ·{" "}
          <Link href="/tools/kundli">Kundli / Birth Chart Calculator</Link>
        </p>
      </div>
    </>
  );
}
