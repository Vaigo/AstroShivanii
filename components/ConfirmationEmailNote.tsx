import type { CSSProperties } from "react";
import Icon from "@/components/Icon";

/** A typed address as the note may show it: trimmed, and "" unless it looks
 *  like name@domain.tld. The backend checks addresses more strictly and sends
 *  nothing to one it rejects, so a note must never promise mail to "a@b". */
export function deliverableEmail(typed: string): string {
  const email = typed.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@.]{2,}$/.test(email) ? email : "";
}

/**
 * "A confirmation email is on its way to …", shown once a payment is
 * verified. The backend emails one confirmation per paid order, to the
 * address typed on the booking form or, on the tool paywalls (which ask for
 * no email), to the logged-in account's address (accountReceiptEmail in
 * lib/api/site.ts). Render it only with that address: an empty `email` means
 * no email goes out for this order, and the note renders nothing.
 *
 * `no-print`: it is about this payment, not part of a saved PDF report.
 */
export default function ConfirmationEmailNote({
  email, isHi, style,
}: {
  email: string;
  isHi: boolean;
  style?: CSSProperties;
}) {
  if (!email) return null;
  const address = <strong style={{ color: "var(--maroon-deep)", overflowWrap: "anywhere" }}>{email}</strong>;
  return (
    <p
      className={`no-print${isHi ? " devanagari" : ""}`}
      style={{
        maxWidth: "34rem", margin: "0.9rem auto 0", textAlign: "center",
        fontSize: "0.85rem", lineHeight: 1.6, color: "var(--ink-light)",
        ...style,
      }}
    >
      <Icon name="mail" size={16} style={{ verticalAlign: "-0.2em", marginRight: "0.4rem", color: "var(--gold-deep)" }} />
      {isHi
        ? <>पुष्टि का ईमेल {address} पर भेजा जा रहा है — न दिखे तो स्पैम फ़ोल्डर भी देखें।</>
        : <>A confirmation email is on its way to {address} — if you don&apos;t see it, check your spam folder.</>}
    </p>
  );
}
