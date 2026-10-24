"use client"; // Error boundaries must be Client Components

import Link from "next/link";
import { useEffect } from "react";

/**
 * Every deploy replaces the hashed script files a page loads. The site now deploys every night, so a tab left
 * open across that moment (or a back/forward restore of an old page) can fail to load a script on its next
 * click, and Next shows this boundary. For exactly that error a single reload fetches the new page; the
 * timestamp guard stops it from looping if the reload does not help.
 */
const CHUNK_ERROR = /ChunkLoadError|Loading chunk|Failed to load chunk|dynamically imported module|Importing a module script failed/i;
const RELOAD_KEY = "as-chunk-reload-at";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    if (!CHUNK_ERROR.test(`${error.name} ${error.message}`)) return;
    try {
      const last = Number(window.sessionStorage.getItem(RELOAD_KEY) ?? 0);
      if (Date.now() - last < 60_000) return; // already reloaded a moment ago: show the message instead
      window.sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
    } catch {
      return; // no storage: cannot guard against a loop, so do not reload
    }
    window.location.reload();
  }, [error]);

  return (
    <section
      className="section"
      style={{ minHeight: "50vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" }}
    >
      <div className="container" style={{ maxWidth: "560px" }}>
        <h1 style={{ fontSize: "clamp(1.6rem, 4vw, 2.2rem)", marginBottom: "0.5rem" }}>पेज लोड नहीं हो पाया</h1>
        <p style={{ color: "var(--ink-light)", marginBottom: "1.5rem", fontSize: "0.95rem" }}>
          This page couldn&apos;t load — the site may have just been updated. Please try again.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <button type="button" className="btn btn-primary" onClick={() => unstable_retry()}>
            दोबारा कोशिश करें
          </button>
          <Link href="/" className="btn btn-ghost">होम पेज</Link>
        </div>
      </div>
    </section>
  );
}
