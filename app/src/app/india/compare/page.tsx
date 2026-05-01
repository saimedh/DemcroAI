"use client";
import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MAJOR_LEADERS, KEY_ISSUES_INDIA } from "@/data/india-elections";

const ALL_DIMS = KEY_ISSUES_INDIA.map(i => i.key);
const DIM_LABELS: Record<string, string> = Object.fromEntries(KEY_ISSUES_INDIA.map(i => [i.key, i.label]));

export default function IndiaComparePage() {
  const [dims, setDims] = useState(["economy", "agriculture", "healthcare", "education", "social", "security"]);
  const [selected, setSelected] = useState(["modi", "rahul"]);

  const toggleDim = (d: string) => setDims(p => p.includes(d) ? p.filter(x => x !== d) : [...p, d]);
  const toggleLeader = (id: string) => {
    if (selected.includes(id)) { if (selected.length > 1) setSelected(p => p.filter(x => x !== id)); }
    else setSelected(p => [...p.slice(-1), id]);
  };

  const visibleLeaders = MAJOR_LEADERS.filter(l => selected.includes(l.id));

  return (
    <div style={{ minHeight: "100vh", background: "#FAFAFA" }}>
      <Navbar />

      {/* Header */}
      <div style={{ borderBottom: "2px solid #0A0A0A", background: "#F5F5F5" }}>
        <div className="container" style={{ padding: "32px 24px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div>
              <span className="rubric" style={{ display: "block", marginBottom: 8 }}>🇮🇳 India · Leader Comparison</span>
              <h1 className="type-headline" style={{ marginBottom: 8 }}>Compare Political Leaders</h1>
              <p style={{ color: "#525252", fontSize: 14, fontFamily: "var(--font-body)" }}>
                Positions sourced from official speeches, manifestos, and parliamentary records. Strictly nonpartisan.
              </p>
            </div>
            <Link href="/india" className="btn btn-secondary btn-sm">← Election Results</Link>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: "40px 24px" }}>
        {/* Leader selector */}
        <div style={{ marginBottom: 32 }}>
          <div className="type-overline" style={{ marginBottom: 12 }}>Select Leaders to Compare (up to 2)</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {MAJOR_LEADERS.map(l => (
              <button key={l.id} onClick={() => toggleLeader(l.id)}
                className={`chip${selected.includes(l.id) ? " active" : ""}`}
                style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{
                  display: "inline-flex", width: 22, height: 22, alignItems: "center", justifyContent: "center",
                  background: selected.includes(l.id) ? "#FAFAFA" : "#0A0A0A",
                  color: selected.includes(l.id) ? "#0A0A0A" : "#FAFAFA",
                  fontSize: 9, fontFamily: "var(--font-display)",
                }}>{l.photo}</span>
                {l.name}
              </button>
            ))}
          </div>
        </div>

        {/* Issue filter */}
        <div style={{ marginBottom: 32 }}>
          <div className="type-overline" style={{ marginBottom: 12 }}>Filter Issues</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {KEY_ISSUES_INDIA.map(issue => (
              <button key={issue.key} onClick={() => toggleDim(issue.key)}
                className={`chip${dims.includes(issue.key) ? " active" : ""}`}>
                {issue.icon} {issue.label}
              </button>
            ))}
          </div>
        </div>

        {/* Comparison cards — leader headers */}
        <div style={{ display: "grid", gridTemplateColumns: `200px repeat(${visibleLeaders.length}, 1fr)`, gap: 0, border: "2px solid #0A0A0A" }}>

          {/* Corner */}
          <div style={{ background: "#0A0A0A", padding: "20px 16px", borderRight: "1px solid #262626" }}>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#A3A3A3" }}>Issue</div>
          </div>

          {/* Leader columns */}
          {visibleLeaders.map((l, i) => (
            <div key={l.id} style={{
              background: "#0A0A0A",
              padding: "20px 20px",
              borderRight: i < visibleLeaders.length - 1 ? "1px solid #262626" : "none",
            }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
                <div style={{ width: 44, height: 44, border: "2px solid #EF4444", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontSize: 14, color: "#FAFAFA", flexShrink: 0 }}>
                  {l.photo}
                </div>
                <div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 16, color: "#FAFAFA", letterSpacing: "-0.01em" }}>{l.name}</div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "#A3A3A3", marginTop: 2 }}>{l.party}</div>
                </div>
              </div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#A3A3A3", lineHeight: 1.5 }}>
                {l.role}
              </div>
              <div style={{ marginTop: 10, fontFamily: "var(--font-body)", fontSize: 11, color: "#525252" }}>
                {l.constituency}
              </div>
            </div>
          ))}

          {/* Issue rows */}
          {dims.filter(d => KEY_ISSUES_INDIA.find(i => i.key === d)).map((dim, ri) => {
            const issue = KEY_ISSUES_INDIA.find(i => i.key === dim)!;
            return [
              // Issue label cell
              <div key={`label-${dim}`} style={{
                padding: "20px 16px",
                borderTop: "1px solid #E5E5E5",
                borderRight: "2px solid #0A0A0A",
                background: ri % 2 === 0 ? "#FAFAFA" : "#F5F5F5",
              }}>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#0A0A0A" }}>
                  {issue.icon} {issue.label}
                </div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "#A3A3A3", marginTop: 4, lineHeight: 1.4 }}>{issue.desc}</div>
              </div>,
              // Data cells for each leader
              ...visibleLeaders.map((l, li) => {
                const pos = l.positions[dim as keyof typeof l.positions];
                return (
                  <div key={`${dim}-${l.id}`} style={{
                    padding: "20px 20px",
                    borderTop: "1px solid #E5E5E5",
                    borderRight: li < visibleLeaders.length - 1 ? "1px solid #E5E5E5" : "none",
                    background: ri % 2 === 0 ? "#FAFAFA" : "#F5F5F5",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                      <div style={{ flex: 1, height: 3, background: "#E5E5E5" }}>
                        <div style={{ height: "100%", width: `${(pos?.score || 0) * 100}%`, background: "#0A0A0A" }} />
                      </div>
                      <span style={{ fontFamily: "var(--font-display)", fontSize: 14, color: "#EF4444", flexShrink: 0 }}>
                        {Math.round((pos?.score || 0) * 100)}
                      </span>
                    </div>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#0A0A0A", lineHeight: 1.6 }}>
                      {pos?.stance || "Position not available"}
                    </p>
                    {pos && <span className="cite" style={{ marginTop: 8, display: "inline-block" }}>{l.sources} sources</span>}
                  </div>
                );
              }),
            ];
          })}
        </div>

        {/* Key policies */}
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${visibleLeaders.length}, 1fr)`, gap: 2, marginTop: 2 }}>
          {visibleLeaders.map(l => (
            <div key={l.id} style={{ border: "2px solid #E5E5E5", borderTop: "4px solid #EF4444", padding: 24 }}>
              <div className="type-overline" style={{ marginBottom: 12 }}>Key Policies — {l.name}</div>
              {l.keyPolicies.map(p => (
                <div key={p} style={{ display: "flex", gap: 10, marginBottom: 8, fontFamily: "var(--font-body)", fontSize: 13 }}>
                  <span style={{ color: "#EF4444", fontWeight: 700 }}>·</span>
                  <span style={{ color: "#0A0A0A" }}>{p}</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="footnote" style={{ marginTop: 32 }}>
          Position stances are derived from official party manifestos, Lok Sabha/Rajya Sabha records, press statements, and campaign speeches. Scores represent progressiveness on each dimension (100 = most progressive). This is a neutral informational tool. DemocrAI makes no political endorsements.
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
          <Link href="/india" className="btn btn-primary">← View Election Results</Link>
          <Link href="/chat" className="btn btn-secondary">Ask AI about India elections →</Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
