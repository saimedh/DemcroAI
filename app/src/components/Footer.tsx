"use client";
import Link from "next/link";

const FOOTER_LINKS = {
  Product: [
    ["My Ballot", "/ballot"],
    ["AI Co-Pilot", "/chat"],
    ["Compare Candidates", "/compare"],
    ["Voting Info", "/logistics"],
    ["Civic Profile", "/profile"],
  ],
  Resources: [
    ["How It Works", "/about"],
    ["Data Sources", "/about"],
    ["Methodology", "/about"],
    ["Privacy Policy", "/privacy"],
    ["Terms of Service", "/terms"],
  ],
  Connect: [
    ["Twitter / X", "#"],
    ["LinkedIn", "#"],
    ["Press Kit", "#"],
    ["API Access", "#"],
  ],
};

export default function Footer() {
  return (
    <footer style={{
      background: "#0A0A0A",
      color: "#FAFAFA",
      borderTop: "4px solid #EF4444",
      marginTop: 96,
    }}>
      {/* Main footer */}
      <div className="container" style={{ padding: "64px 24px 48px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 48 }}>
          {/* Brand column */}
          <div>
            <Link href="/" style={{ textDecoration: "none" }}>
              <span style={{
                fontFamily: "var(--font-display)",
                fontSize: 28,
                fontWeight: 400,
                color: "#FAFAFA",
                letterSpacing: "-0.02em",
                display: "block",
                marginBottom: 16,
              }}>
                DEMOCR<span style={{ color: "#EF4444" }}>AI</span>
              </span>
            </Link>
            <p style={{
              color: "#A3A3A3",
              fontSize: 14,
              lineHeight: 1.7,
              fontFamily: "var(--font-body)",
              maxWidth: 280,
              marginBottom: 24,
            }}>
              Your nonpartisan AI election co-pilot. Informed voters make better democracies.
            </p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["⚖️ Nonpartisan", "🔒 Privacy-First", "📋 FEC Compliant"].map((tag) => (
                <span key={tag} style={{
                  display: "inline-block",
                  padding: "4px 10px",
                  border: "1px solid #525252",
                  color: "#A3A3A3",
                  fontSize: 11,
                  fontFamily: "var(--font-body)",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}>{tag}</span>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <div style={{
                fontFamily: "var(--font-body)",
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "#FAFAFA",
                marginBottom: 20,
                paddingBottom: 12,
                borderBottom: "1px solid #262626",
              }}>{section}</div>
              {links.map(([label, href]) => (
                <div key={label} style={{ marginBottom: 10 }}>
                  <Link href={href} style={{
                    color: "#A3A3A3",
                    fontSize: 14,
                    fontFamily: "var(--font-body)",
                    textDecoration: "none",
                    transition: "color 0.15s",
                    display: "block",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#FAFAFA")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#A3A3A3")}
                  >
                    {label}
                  </Link>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: "1px solid #262626",
          paddingTop: 24,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}>
          <p style={{ color: "#525252", fontSize: 12, fontFamily: "var(--font-body)" }}>
            © 2026 DemocrAI. Not affiliated with any political party, campaign, or PAC.
          </p>
          <p style={{ color: "#525252", fontSize: 12, fontFamily: "var(--font-body)", fontStyle: "italic" }}>
            DemocrAI is not a political committee. All information is for educational purposes only.
          </p>
        </div>
      </div>
    </footer>
  );
}
