import Link from "next/link";
import Icon from "@/components/Icon";

export default function NotFound() {
  return (
    <section
      className="section"
      style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <div className="container" style={{ maxWidth: "560px" }}>
        <div style={{ color: "var(--gold)", marginBottom: "1rem", display: "flex", justifyContent: "center" }} aria-hidden="true">
          <Icon name="moon" size={64} strokeWidth={1.3} />
        </div>
        <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", marginBottom: "0.5rem" }}>
          Lost among the stars
        </h1>
        <p className="devanagari" style={{ color: "var(--muted)", fontSize: "1.1rem", marginBottom: "1rem" }}>
          यह पृष्ठ ग्रहण में चला गया है
        </p>
        <p style={{ color: "var(--ink-light)", marginBottom: "2rem", fontSize: "0.95rem" }}>
          The page you're looking for doesn't exist — but your path forward is easy to read.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/" className="btn btn-primary">Go Home</Link>
          <Link href="/tools" className="btn btn-ghost">Try Free Tools</Link>
          <Link href="/guides" className="btn btn-ghost">Read Guides</Link>
        </div>
      </div>
    </section>
  );
}
