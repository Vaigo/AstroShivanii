"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";

export default function Navbar() {
  const { t, lang, setLang } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const links = (
    <>
      <li><Link href="/">{t("nav.home")}</Link></li>
      <li><Link href="/tools">{t("nav.tools")}</Link></li>
      <li><Link href="/readings">{t("nav.readings")}</Link></li>
      <li><Link href="/guides">{t("nav.guides")}</Link></li>
      <li><Link href="/about">{t("nav.about")}</Link></li>
      <li><Link href="/contact">{t("nav.contact")}</Link></li>
    </>
  );

  return (
    <>
      <div className="invocation-strip">{t("hero.invocation")}</div>
      <nav
        className={`nav${scrolled ? " nav-scrolled" : ""}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="nav-inner">
          <Link href="/" className="nav-logo" aria-label="Astrologer Shivanii home">
            Astrologer Shivanii
            <span className="nav-logo-hi">ज्योतिषाचार्य शिवानी</span>
          </Link>

          <ul className="nav-links" role="list">
            {links}
          </ul>

          <div className="nav-actions">
            <button
              className={`lang-toggle ${lang === "en" ? "active" : ""}`}
              onClick={() => setLang("en")}
              aria-label="Switch to English"
            >
              EN
            </button>
            <button
              className={`lang-toggle ${lang === "hi" ? "active" : ""}`}
              onClick={() => setLang("hi")}
              aria-label="हिंदी में बदलें"
            >
              हिं
            </button>
            <Link href="/book" className="btn btn-primary btn-sm nav-book-btn">
              {t("nav.book")}
            </Link>
            <button
              type="button"
              className="nav-hamburger"
              aria-label={menuOpen ? "Close menu / मेनू बंद करें" : "Open menu / मेनू खोलें"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((o) => !o)}
            >
              <span aria-hidden="true">{menuOpen ? "✕" : "☰"}</span>
            </button>
          </div>
        </div>

        {/* Mobile dropdown — nav-links are display:none below 768px */}
        {menuOpen && (
          <div className="nav-mobile-menu">
            <ul role="list" onClick={() => setMenuOpen(false)}>
              {links}
              <li>
                <Link href="/book" className="btn btn-primary btn-sm" style={{ marginTop: "0.5rem" }}>
                  {t("nav.book")}
                </Link>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </>
  );
}
