"use client";
import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const CANDIDATES = [
  {
    id: "c1", name: "Alex Rivera", party: "Democrat", office: "U.S. Senate — CA", incumbent: true, photo: "AR", fundsRaised: "$12.4M",
    positions: {
      Economy: { stance: "Pro-regulation; corporate tax increases", score: 0.35, cites: 3 },
      Healthcare: { stance: "Medicare for All; public option", score: 0.9, cites: 5 },
      Environment: { stance: "Net-zero 2040; carbon pricing", score: 0.92, cites: 7 },
      Education: { stance: "Student debt cancellation; Pell Grants", score: 0.8, cites: 4 },
      Immigration: { stance: "Path to citizenship; DACA protection", score: 0.85, cites: 6 },
      "Gun Policy": { stance: "Universal background checks; assault weapons ban", score: 0.7, cites: 4 },
    },
  },
  {
    id: "c2", name: "Jordan Mills", party: "Republican", office: "U.S. Senate — CA", incumbent: false, photo: "JM", fundsRaised: "$8.1M",
    positions: {
      Economy: { stance: "Deregulation; business tax cuts", score: 0.8, cites: 4 },
      Healthcare: { stance: "Market competition; HSA expansion", score: 0.4, cites: 3 },
      Environment: { stance: "Energy independence; nuclear power", score: 0.3, cites: 5 },
      Education: { stance: "School choice; charter expansion", score: 0.55, cites: 3 },
      Immigration: { stance: "Secure border first; merit-based", score: 0.35, cites: 5 },
      "Gun Policy": { stance: "2nd Amendment; opposes new restrictions", score: 0.3, cites: 3 },
    },
  },
];

const ALL_DIMS = ["Economy", "Healthcare", "Environment", "Education", "Immigration", "Gun Policy"];

export default function ComparePage() {
  const [dims, setDims] = useState<string[]>(ALL_DIMS);
  const [flip, setFlip] = useState(false);
  const [toast, setToast] = useState(false);

  const toggle = (d: string) => setDims(p => p.includes(d) ? p.filter(x => x !== d) : [...p, d]);

  const share = () => { setToast(true); setTimeout(() => setToast(false), 2000); };

  return (
    <div style={{ minHeight: "100vh", background: "#FAFAFA" }}>
      <Navbar />

      {/* Header */}
      <div style={{ borderBottom: "2px solid #0A0A0A", background: "#F5F5F5" }}>
        <div className="container" style={{ padding: "32px 24px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
            <div>
              <span className="rubric" style={{ display: "block", marginBottom: 8 }}>Side by Side</span>
              <h1 className="type-headline">Candidate Comparison</h1>
              <p style={{ color: "#525252", fontSize: 14, fontFamily: "var(--font-body)", marginTop: 8 }}>
                Data from official sources · FEC filings · Voting records · Updated daily
              </p>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button onClick={() => setFlip(!flip)} className={`btn btn-sm ${flip ? "btn-primary" : "btn-secondary"}`}>
                🔄 {flip ? "Opponents' View ON" : "Flip the Script"}
              </button>
              <button onClick={share} className="btn btn-secondary btn-sm">📤 Share</button>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: "40px 24px" }}>
        {/* Flip notice */}
        {flip && (
          <div style={{ border: "2px solid #0A0A0A", borderLeft: "4px solid #EF4444", padding: "12px 16px", marginBottom: 24, background: "#F5F5F5", fontFamily: "var(--font-body)", fontSize: 14, color: "#0A0A0A" }}>
            <strong>Flip the Script is ON.</strong> You are now seeing what each candidate&apos;s opponents say about their positions. All sources are cited.
          </div>
        )}

        {/* Dimension filter */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 32, alignItems: "center" }}>
          <span style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#A3A3A3", marginRight: 4 }}>Filter issues:</span>
          {ALL_DIMS.map(d => (
            <button key={d} className={`chip${dims.includes(d) ? " active" : ""}`} onClick={() => toggle(d)}>{d}</button>
          ))}
        </div>

        {/* Comparison table */}
        <div style={{ overflowX: "auto" }}>
          <table className="editorial-table">
            <thead>
              <tr>
                <th style={{ width: "18%" }}>Issue</th>
                {CANDIDATES.map(c => (
                  <th key={c.id} style={{ width: "41%" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <div style={{
                        width: 48,
                        height: 48,
                        background: "#0A0A0A",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#FAFAFA",
                        fontFamily: "var(--font-display)",
                        fontSize: 14,
                        flexShrink: 0,
                      }}>{c.photo}</div>
                      <div>
                        <div style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "#0A0A0A", marginBottom: 4 }}>{c.name}</div>
                        <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                          <span className="chip" style={{ fontSize: 10, padding: "2px 8px" }}>{c.party}</span>
                          {c.incumbent && <span style={{ fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#525252" }}>Incumbent</span>}
                        </div>
                        <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#A3A3A3", marginTop: 4 }}>
                          Raised: <strong style={{ color: "#525252" }}>{c.fundsRaised}</strong>
                          <span className="cite" style={{ marginLeft: 6 }}>FEC</span>
                        </div>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dims.map((dim, i) => (
                <tr key={dim}>
                  <td>
                    <span style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 700, color: "#0A0A0A" }}>{dim}</span>
                  </td>
                  {CANDIDATES.map(c => {
                    const pos = c.positions[dim as keyof typeof c.positions];
                    return (
                      <td key={c.id}>
                        {/* Score bar */}
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                          <div className="score-bar" style={{ flex: 1 }}>
                            <div className="score-fill" style={{ width: `${pos.score * 100}%` }} />
                          </div>
                          <span style={{ fontFamily: "var(--font-display)", fontSize: 14, color: "#EF4444", minWidth: 36 }}>
                            {Math.round(pos.score * 100)}
                          </span>
                        </div>
                        <p style={{ fontFamily: "var(--font-body)", fontSize: 13, lineHeight: 1.6, color: flip ? "#EF4444" : "#0A0A0A", fontStyle: flip ? "italic" : "normal", marginBottom: 6 }}>
                          {flip ? `Opponents say: ${pos.stance.toLowerCase()}` : pos.stance}
                        </p>
                        <span className="cite">{pos.cites} sources</span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Methodology note */}
        <div style={{ borderLeft: "4px solid #0A0A0A", padding: "16px 20px", background: "#F5F5F5", marginTop: 32 }}>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Data Sources & Methodology</div>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "#525252", lineHeight: 1.7 }}>
            Position data sourced from official campaign websites, congressional voting records, FEC filings, and verified news coverage. Scores represent alignment with progressive/liberal policy positions (100% = fully aligned). This is a neutral display tool — not an endorsement system. Data refreshed daily.
          </p>
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
          <Link href="/chat" className="btn btn-primary">Ask AI about these candidates →</Link>
          <Link href="/ballot" className="btn btn-secondary">← Back to My Ballot</Link>
        </div>
      </div>

      {toast && (
        <div style={{ position: "fixed", bottom: 32, left: "50%", transform: "translateX(-50%)", background: "#0A0A0A", color: "#FAFAFA", padding: "12px 24px", fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 700, zIndex: 1000, border: "2px solid #EF4444" }}>
          ✓ Link copied to clipboard
        </div>
      )}

      <Footer />
    </div>
  );
}
