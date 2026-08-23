"use client";

import { useState, type InputHTMLAttributes } from "react";

/**
 * Password input with a show/hide eye toggle — drop-in replacement for
 * <input type="password" className="form-input">. Pass exactly the props
 * you'd give the input; the eye button never submits the form.
 */
export default function PasswordInput({
  className = "form-input", style, ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ position: "relative", width: "100%" }}>
      <input
        {...props}
        className={className}
        type={show ? "text" : "password"}
        style={{ ...style, width: "100%", paddingRight: "42px" }}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? "पासवर्ड छिपाएं / Hide password" : "पासवर्ड देखें / Show password"}
        title={show ? "Hide" : "Show"}
        tabIndex={-1}
        style={{
          position: "absolute", right: "6px", top: "50%", transform: "translateY(-50%)",
          background: "none", border: "none", cursor: "pointer", padding: "6px",
          color: "var(--muted)", display: "flex", alignItems: "center",
        }}
      >
        {show ? (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
            <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
            <line x1="1" y1="1" x2="23" y2="23" />
          </svg>
        ) : (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        )}
      </button>
    </div>
  );
}
