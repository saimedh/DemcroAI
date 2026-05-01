"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/ballot", label: "My Ballot" },
  { href: "/chat", label: "AI Co-Pilot" },
  { href: "/compare", label: "Compare" },
  { href: "/logistics", label: "Voting Info" },
  { href: "/india", label: "🇮🇳 India" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: "#FAFAFA",
        borderBottom: "2px solid #0A0A0A",
      }}>
        {/* Top bar — category ticker */}
        <div style={{
          background: "#0A0A0A",
          padding: "6px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <span className="ticker-label">
              <span className="live-dot" />
              Live
            </span>
            <span style={{ color: "#A3A3A3", fontSize: 12, fontFamily: "var(--font-body)" }}>
              2026 Midterm Season · Data updated daily · Nov 3, 2026
            </span>
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            <span style={{ color: "#A3A3A3", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: "var(--font-body)" }}>
              ⚖️ Nonpartisan
            </span>
            <span style={{ color: "#A3A3A3", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: "var(--font-body)" }}>
              📋 FEC Compliant
            </span>
          </div>
        </div>

        {/* Main nav */}
        <div style={{
          padding: "0 24px",
          display: "flex",
          alignItems: "stretch",
          justifyContent: "space-between",
          height: 56,
        }}>
          {/* Logo */}
          <Link href="/" style={{
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: 0,
            borderRight: "2px solid #0A0A0A",
            paddingRight: 24,
            marginRight: 24,
          }}>
            <span style={{
              fontFamily: "var(--font-display)",
              fontSize: 22,
              fontWeight: 400,
              color: "#0A0A0A",
              letterSpacing: "-0.02em",
            }}>
              DEMOCR<span style={{ color: "#EF4444" }}>AI</span>
            </span>
          </Link>

          {/* Nav links — desktop */}
          <div style={{ display: "flex", alignItems: "center", gap: 0, flex: 1 }}>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-item${pathname === link.href ? " active" : ""}`}
                style={{
                  padding: "0 20px",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  borderBottom: pathname === link.href ? "3px solid #EF4444" : "3px solid transparent",
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Link href="/profile" className="btn btn-primary btn-sm">
              Get Started
            </Link>
            {/* Mobile toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                background: "none",
                border: "2px solid #0A0A0A",
                padding: "4px 10px",
                cursor: "pointer",
                fontFamily: "var(--font-body)",
                fontSize: 18,
                lineHeight: 1,
                display: "none",
              }}
              className="mobile-menu-btn"
              aria-label="Menu"
            >
              {menuOpen ? "✕" : "≡"}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div style={{
            background: "#FAFAFA",
            borderTop: "1px solid #E5E5E5",
            padding: "8px 0",
          }}>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  display: "block",
                  padding: "14px 24px",
                  borderBottom: "1px solid #E5E5E5",
                  textDecoration: "none",
                  fontFamily: "var(--font-body)",
                  fontSize: 13,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: pathname === link.href ? "#EF4444" : "#0A0A0A",
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* Spacer for fixed nav: top ticker (32px) + main nav (56px) + bottom border (2px) = 90px */}
      <div style={{ height: 90 }} />
    </>
  );
}
