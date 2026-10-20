"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import PatrikaFrame from "@/components/PatrikaFrame";
import Divider from "@/components/Divider";
import Link from "next/link";
import Icon from "@/components/Icon";

import { WHATSAPP_NUMBER, CONTACT_EMAIL } from "@/lib/config";

const EMAIL: string = CONTACT_EMAIL;

/** Copies text to the clipboard; falls back to a hidden textarea where the
 *  async Clipboard API is unavailable. Resolves false if both fail. */
async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    /* fall through to the legacy path */
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

export default function ContactPage() {
  const { t, lang } = useI18n();
  const isHi = lang === "hi";
  const [copied, setCopied] = useState(false);

  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    isHi ? "नमस्ते! मुझे एक रीडिंग बुक करनी है।" : "Namaste! I'd like to book a reading."
  )}`;
  // A mailto: link needs a desktop email app; many Windows PCs have none
  // (Windows Mail was retired in 2024), so the click seems to do nothing.
  // Gmail's web composer and a copy button work everywhere.
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(EMAIL)}&su=${encodeURIComponent(
    isHi ? "रीडिंग के बारे में पूछताछ" : "Reading inquiry"
  )}`;

  async function handleCopy() {
    if (await copyText(EMAIL)) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 5000);
    }
  }

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: "700px" }}>
        <h1 className="section-heading">{t("contact.heading")}</h1>
        <p className="section-heading-hi devanagari">{t("contact.headingHi")}</p>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {/* WhatsApp */}
          <PatrikaFrame style={{ textAlign: "center" }}>
            <div className="contact-icon"><Icon name="message" size={26} /></div>
            <h3 style={{ marginBottom: "0.5rem" }}>WhatsApp</h3>
            <p style={{ color: "var(--muted)", fontSize: "0.9rem", marginBottom: "1.25rem" }}>
              {isHi
                ? "शिवानी जी तक पहुँचने का सबसे तेज़ तरीका। हिंदी या अंग्रेज़ी में संदेश भेजें।"
                : "Fastest way to reach Shivanii. Message in Hindi or English."}
            </p>
            <a href={waUrl} className="btn btn-primary" target="_blank" rel="noopener noreferrer">
              {isHi ? "WhatsApp चैट खोलें" : "Open WhatsApp Chat"}
            </a>
          </PatrikaFrame>

          {/* Email — hidden until a real address exists */}
          {EMAIL && !EMAIL.includes("example.") && (
            <PatrikaFrame style={{ textAlign: "center" }}>
              <div className="contact-icon"><Icon name="mail" size={26} /></div>
              <h3 style={{ marginBottom: "0.5rem" }}>{isHi ? "ईमेल" : "Email"}</h3>
              <p style={{ color: "var(--muted)", fontSize: "0.9rem", marginBottom: "1.25rem" }}>
                {isHi
                  ? "विस्तृत प्रश्नों के लिए। शिवानी जी 24 घंटे के भीतर जवाब देती हैं।"
                  : "For detailed inquiries. Shivanii responds within 24 hours."}
              </p>
              {/* Opens the email app where there is one, and copies the
                  address either way so the click is never a dead end. */}
              <a href={`mailto:${EMAIL}`} className="btn btn-secondary" onClick={() => { void handleCopy(); }}>
                {EMAIL}
              </a>
              <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap", marginTop: "0.9rem" }}>
                <a href={gmailUrl} className="btn btn-ghost" target="_blank" rel="noopener noreferrer">
                  {isHi ? "Gmail में खोलें" : "Open in Gmail"}
                </a>
                <button type="button" className="btn btn-ghost" onClick={() => { void handleCopy(); }}>
                  {copied ? (isHi ? "✓ कॉपी हो गया" : "✓ Copied") : (isHi ? "ईमेल कॉपी करें" : "Copy email")}
                </button>
              </div>
              <p role="status" aria-live="polite" style={{ color: "var(--muted)", fontSize: "0.85rem", marginTop: "0.75rem", minHeight: "1.3em" }}>
                {copied
                  ? (isHi
                    ? "ईमेल पता कॉपी हो गया — अगर कोई ईमेल ऐप नहीं खुला, तो इसे अपने ईमेल में पेस्ट करें।"
                    : "Email address copied — if no email app opened, paste it into your email.")
                  : ""}
              </p>
            </PatrikaFrame>
          )}

          {/* Discovery call */}
          <PatrikaFrame style={{ textAlign: "center" }}>
            <div className="contact-icon"><Icon name="phone" size={26} /></div>
            <h3 style={{ marginBottom: "0.5rem" }}>{isHi ? "निःशुल्क 10-मिनट परिचय कॉल" : "Free 10-min Discovery Call"}</h3>
            <p style={{ color: "var(--muted)", fontSize: "0.9rem", marginBottom: "1.25rem" }}>
              {isHi
                ? "समझ नहीं आ रहा कौन-सी रीडिंग आपके लिए सही है? शिवानी जी के साथ 10 मिनट की निःशुल्क परिचय कॉल बुक करें। कोई बाध्यता नहीं।"
                : "Not sure which reading is right for you? Book a free 10-minute introductory call with Shivanii. No commitment required."}
            </p>
            {/* TODO: replace with actual booking link */}
            <a href={waUrl} className="btn btn-ghost" target="_blank" rel="noopener noreferrer">
              {isHi ? "WhatsApp पर समय तय करें" : "Schedule via WhatsApp"}
            </a>
          </PatrikaFrame>
        </div>

        <Divider />

        <div style={{ textAlign: "center" }}>
          <p style={{ color: "var(--muted)", fontSize: "0.9rem", marginBottom: "1rem" }}>
            {isHi ? "सीधे बुक करना चाहते हैं?" : "Ready to book directly?"}
          </p>
          <Link href="/book" className="btn btn-primary">
            {isHi ? "रीडिंग बुक करें" : "Book a Reading"}
          </Link>
        </div>
      </div>
    </section>
  );
}
