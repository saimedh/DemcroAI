"use client";
import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#FAFAFA",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      textAlign: "center",
      padding: 24,
    }}>
      <div style={{
        fontFamily: "var(--font-display)",
        fontSize: "clamp(96px, 20vw, 160px)",
        color: "#E5E5E5",
        lineHeight: 1,
        marginBottom: 0,
        letterSpacing: "-0.04em",
      }}>404</div>
      <h1 style={{
        fontFamily: "var(--font-display)",
        fontSize: "clamp(28px, 4vw, 38px)",
        color: "#0A0A0A",
        marginBottom: 16,
        letterSpacing: "-0.02em",
      }}>
        PAGE NOT FOUND
      </h1>
      <div style={{ borderLeft: "4px solid #EF4444", padding: "12px 20px", marginBottom: 40, background: "#F5F5F5", textAlign: "left", maxWidth: 420 }}>
        <p style={{ fontFamily: "var(--font-body)", fontSize: 15, color: "#525252", lineHeight: 1.6, fontStyle: "italic" }}>
          Even ballots have their limits. This page doesn&apos;t exist — but your vote does. Head back and cast an informed one.
        </p>
      </div>
      <Link href="/" style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        padding: "12px 28px",
        background: "#0A0A0A",
        color: "#FAFAFA",
        fontFamily: "var(--font-body)",
        fontSize: 14,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        textDecoration: "none",
        border: "2px solid #0A0A0A",
        transition: "background 0.15s, border-color 0.15s",
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#EF4444"; (e.currentTarget as HTMLElement).style.borderColor = "#EF4444"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#0A0A0A"; (e.currentTarget as HTMLElement).style.borderColor = "#0A0A0A"; }}
      >
        ← Back to DemocrAI
      </Link>
    </div>
  );
}
