"use client";

import { useI18n } from "@/lib/i18n";
import PatrikaFrame from "@/components/PatrikaFrame";
import Divider from "@/components/Divider";
import Link from "next/link";
import Icon from "@/components/Icon";

import { WHATSAPP_NUMBER } from "@/lib/config";

/* TODO(launch): set the real email to make the Email card appear.
   A fake/placeholder address must NEVER render — a visitor who spots
   example.com writes the whole site off as a scam. */
const EMAIL: string = "";

export default function ContactPage() {
  const { t } = useI18n();

  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Namaste! I'd like to book a reading.")}`;

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
              Fastest way to reach Shivanii. Message in Hindi or English.
            </p>
            <a href={waUrl} className="btn btn-primary" target="_blank" rel="noopener noreferrer">
              Open WhatsApp Chat
            </a>
          </PatrikaFrame>

          {/* Email — hidden until a real address exists */}
          {EMAIL && !EMAIL.includes("example.") && (
            <PatrikaFrame style={{ textAlign: "center" }}>
              <div className="contact-icon"><Icon name="mail" size={26} /></div>
              <h3 style={{ marginBottom: "0.5rem" }}>Email</h3>
              <p style={{ color: "var(--muted)", fontSize: "0.9rem", marginBottom: "1.25rem" }}>
                For detailed inquiries. Shivanii responds within 24 hours.
              </p>
              <a href={`mailto:${EMAIL}`} className="btn btn-secondary">
                {EMAIL}
              </a>
            </PatrikaFrame>
          )}

          {/* Discovery call */}
          <PatrikaFrame style={{ textAlign: "center" }}>
            <div className="contact-icon"><Icon name="phone" size={26} /></div>
            <h3 style={{ marginBottom: "0.5rem" }}>Free 10-min Discovery Call</h3>
            <p style={{ color: "var(--muted)", fontSize: "0.9rem", marginBottom: "1.25rem" }}>
              Not sure which reading is right for you? Book a free 10-minute introductory call with Shivanii.
              No commitment required.
            </p>
            {/* TODO: replace with actual booking link */}
            <a href={waUrl} className="btn btn-ghost" target="_blank" rel="noopener noreferrer">
              Schedule via WhatsApp
            </a>
          </PatrikaFrame>
        </div>

        <Divider />

        <div style={{ textAlign: "center" }}>
          <p style={{ color: "var(--muted)", fontSize: "0.9rem", marginBottom: "1rem" }}>
            Ready to book directly?
          </p>
          <Link href="/book" className="btn btn-primary">
            Book a Reading
          </Link>
        </div>
      </div>
    </section>
  );
}
