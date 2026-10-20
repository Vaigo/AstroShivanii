"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import PatrikaFrame from "@/components/PatrikaFrame";

/** Frame of the logged-out account pages (forgot and reset password), in the
 *  style of the login card on /account: the title in the chosen language with
 *  the other one under it, then the patrika card in a narrow column. */
export default function AuthShell({ title, children }: { title: { hi: string; en: string }; children: ReactNode }) {
  const { lang } = useI18n();
  const isHi = lang === "hi";
  return (
    <section className="section">
      {/* the title gets more room than the card, so it stays on one line on a desktop */}
      <div className="container" style={{ maxWidth: "760px" }}>
        <h1 className={`section-heading${isHi ? " devanagari" : ""}`}>{isHi ? title.hi : title.en}</h1>
        <p className="section-heading-hi devanagari">{isHi ? title.en : title.hi}</p>
      </div>
      <div className="container" style={{ maxWidth: "460px" }}>
        <PatrikaFrame>{children}</PatrikaFrame>
      </div>
    </section>
  );
}

/** One result screen inside the card: an icon disc, a heading and the text. */
export function AuthStatus({ icon, heading, isHi, children }: {
  icon: ReactNode; heading: string; isHi: boolean; children: ReactNode;
}) {
  return (
    <div style={{ textAlign: "center" }}>
      <div className="contact-icon" style={{ marginBottom: "1rem" }}>{icon}</div>
      <h2 className={isHi ? "devanagari" : undefined} style={{ fontSize: "1.35rem", marginBottom: "0.75rem" }}>{heading}</h2>
      <div className={isHi ? "devanagari" : undefined} style={{ color: "var(--ink-light)", fontSize: "0.95rem", lineHeight: 1.65, marginBottom: "1.25rem" }}>
        {children}
      </div>
    </div>
  );
}

/** "← Back to login" link at the foot of the card. */
export function BackToLogin({ isHi }: { isHi: boolean }) {
  return (
    <p className={isHi ? "devanagari" : undefined} style={{ textAlign: "center", marginTop: "1rem", fontSize: "0.85rem" }}>
      <Link href="/account" style={{ color: "var(--maroon)", fontWeight: 600, textDecoration: "underline" }}>
        ← {isHi ? "लॉगिन पर वापस जाएं" : "Back to login"}
      </Link>
    </p>
  );
}
