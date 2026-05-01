"use client";
import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const RACES = [
  {
    id: "race-1",
    level: "FEDERAL",
    office: "U.S. Senate — California",
    description: "6-year term · Federal legislation, treaties, judicial confirmations",
    candidates: [
      {
        id: "c1", name: "Alex Rivera", party: "Democrat", incumbent: true, alignment: 0.82,
        photo: "AR",
        positions: { Economy: "Pro-regulation", Healthcare: "Medicare expansion", Environment: "Net-zero 2040", Education: "Debt cancellation" },
      },
      {
        id: "c2", name: "Jordan Mills", party: "Republican", incumbent: false, alignment: 0.43,
        photo: "JM",
        positions: { Economy: "Deregulation", Healthcare: "Market-based", Environment: "Energy independence", Education: "School choice" },
      },
    ],
  },
  {
    id: "race-2",
    level: "STATE",
    office: "State Assembly District 14",
    description: "2-year term · State budget, education, local infrastructure",
    candidates: [
      {
        id: "c3", name: "Morgan Chen", party: "Democrat", incumbent: false, alignment: 0.71,
        photo: "MC",
        positions: { Economy: "Small biz focus", Healthcare: "Medicaid expansion", Environment: "Clean energy", Education: "K-12 funding" },
      },
      {
        id: "c4", name: "Taylor Brooks", party: "Independent", incumbent: false, alignment: 0.58,
        photo: "TB",
        positions: { Economy: "Balanced approach", Healthcare: "Mixed system", Environment: "Pragmatic policy", Education: "Charter schools" },
      },
    ],
  },
];

const MEASURES = [
  {
    id: "m1", number: "Prop 47", complexity: "MEDIUM",
    title: "Clean Energy Infrastructure Bond Act",
    summary: "Authorizes $15 billion in general obligation bonds for renewable energy infrastructure, electric grid modernization, and clean transportation projects.",
    fiscal: "Est. $1.1B annual debt service. Projected to save $3.2B in fossil fuel costs over 30 years.",
    support: ["CA Environmental Alliance", "AFL-CIO", "Governor's Office"],
    oppose: ["CA Taxpayers Association", "Oil & Gas Industry Assoc."],
    sources: 12,
  },
  {
    id: "m2", number: "Measure B", complexity: "LOW",
    title: "Local School Parcel Tax",
    summary: "Levies an annual $248 per-parcel tax on non-residential property to fund teacher salaries and school programs for 8 years.",
    fiscal: "Raises approximately $23M annually. No impact on state education funding formulas.",
    support: ["Teachers Union Local 14", "PTA", "City Council majority"],
    oppose: ["Small Business Chamber", "Senior Citizens League"],
    sources: 7,
  },
];

const ISSUES = ["Economy", "Healthcare", "Environment", "Education"];

export default function BallotPage() {
  const [zip] = useState("90210");
  const [tab, setTab] = useState<"races" | "measures">("races");
  const [priorities, setPriorities] = useState<Record<string, number>>({ Economy: 3, Healthcare: 4, Environment: 5, Education: 4 });
  const [saved, setSaved] = useState<Record<string, string>>({});
  const [expanded, setExpanded] = useState<string | null>("race-1");

  return (
    <div style={{ minHeight: "100vh", background: "#FAFAFA" }}>
      <Navbar />

      {/* Page header */}
      <div style={{ borderBottom: "2px solid #0A0A0A", background: "#F5F5F5" }}>
        <div className="container" style={{ padding: "32px 24px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
            <div>
              <span className="rubric" style={{ display: "block", marginBottom: 8 }}>My Ballot</span>
              <h1 className="type-headline">Your 2026 Ballot</h1>
              <p style={{ color: "#525252", fontSize: 14, fontFamily: "var(--font-body)", marginTop: 8 }}>
                Jurisdiction: <strong style={{ color: "#0A0A0A" }}>Los Angeles County, CA</strong> · {zip} · 2 Races · 2 Measures
              </p>
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <Link href="/chat" className="btn btn-primary btn-sm">Ask AI</Link>
              <Link href="/compare" className="btn btn-secondary btn-sm">Compare</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: "40px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 48, alignItems: "start" }}>

          {/* Sidebar */}
          <div>
            {/* Priorities */}
            <div style={{ border: "2px solid #0A0A0A", padding: 24, marginBottom: 24 }}>
              <div style={{ borderBottom: "2px solid #0A0A0A", paddingBottom: 12, marginBottom: 20 }}>
                <h3 className="type-subhead" style={{ fontSize: 18 }}>Your Priorities</h3>
                <p style={{ color: "#525252", fontSize: 12, fontFamily: "var(--font-body)", marginTop: 4 }}>Drag to adjust alignment scores</p>
              </div>
              {ISSUES.map(issue => (
                <div key={issue} style={{ marginBottom: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <label className="input-label" style={{ marginBottom: 0 }}>{issue}</label>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "#EF4444" }}>{priorities[issue]}</span>
                  </div>
                  <input type="range" min="1" max="5" value={priorities[issue]}
                    onChange={e => setPriorities(p => ({ ...p, [issue]: +e.target.value }))}
                    style={{ width: "100%", accentColor: "#0A0A0A" }} />
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 10, color: "#A3A3A3", fontFamily: "var(--font-body)" }}>Low</span>
                    <span style={{ fontSize: 10, color: "#A3A3A3", fontFamily: "var(--font-body)" }}>High</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Election info */}
            <div style={{ border: "2px solid #E5E5E5", borderTop: "4px solid #EF4444" }}>
              <div style={{ padding: "16px 20px", borderBottom: "1px solid #E5E5E5" }}>
                <span className="type-overline">Election Day</span>
              </div>
              {[
                ["Date", "Nov 3, 2026"],
                ["Early Voting", "Oct 10–Nov 1"],
                ["Mail-in Deadline", "Nov 1, 2026"],
                ["Polls Open", "7 AM–8 PM"],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "12px 20px", borderBottom: "1px solid #E5E5E5" }}>
                  <span style={{ color: "#525252", fontSize: 13, fontFamily: "var(--font-body)" }}>{k}</span>
                  <span style={{ color: "#0A0A0A", fontSize: 13, fontWeight: 700, fontFamily: "var(--font-body)" }}>{v}</span>
                </div>
              ))}
              <div style={{ padding: 16 }}>
                <Link href="/logistics" className="btn btn-secondary btn-sm" style={{ width: "100%", justifyContent: "center" }}>
                  Find Polling Place →
                </Link>
              </div>
            </div>
          </div>

          {/* Main */}
          <div>
            {/* Tabs */}
            <div style={{ display: "flex", gap: 0, marginBottom: 32, borderBottom: "2px solid #0A0A0A" }}>
              {(["races", "measures"] as const).map(t => (
                <button key={t} onClick={() => setTab(t)} style={{
                  padding: "12px 24px",
                  border: "none",
                  borderBottom: tab === t ? "3px solid #EF4444" : "3px solid transparent",
                  marginBottom: -2,
                  background: "none",
                  cursor: "pointer",
                  fontFamily: "var(--font-body)",
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: tab === t ? "#0A0A0A" : "#A3A3A3",
                  transition: "all 0.15s",
                }}>
                  {t === "races" ? "🏛 Races (2)" : "📋 Measures (2)"}
                </button>
              ))}
            </div>

            {tab === "races" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {RACES.map((race, ri) => (
                  <div key={race.id} style={{ border: "2px solid #0A0A0A", marginBottom: 16 }}>
                    {/* Race header */}
                    <div
                      style={{ padding: "20px 24px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", background: expanded === race.id ? "#F5F5F5" : "#FAFAFA" }}
                      onClick={() => setExpanded(expanded === race.id ? null : race.id)}
                    >
                      <div>
                        <div style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
                          <span className="badge-black" style={{ fontSize: 10 }}>{race.level}</span>
                          {Object.values(saved).includes(RACES[ri].candidates[0].id) || Object.values(saved).includes(RACES[ri].candidates[1].id)
                            ? <span style={{ fontSize: 11, fontWeight: 700, color: "#16A34A", fontFamily: "var(--font-body)", textTransform: "uppercase", letterSpacing: "0.06em" }}>✓ Saved</span>
                            : null}
                        </div>
                        <h3 className="type-subhead" style={{ fontSize: 20 }}>{race.office}</h3>
                        <p style={{ color: "#525252", fontSize: 13, fontFamily: "var(--font-body)", marginTop: 4 }}>{race.description}</p>
                      </div>
                      <span style={{ fontFamily: "var(--font-display)", fontSize: 20, color: "#A3A3A3" }}>
                        {expanded === race.id ? "−" : "+"}
                      </span>
                    </div>

                    {expanded === race.id && (
                      <div style={{ borderTop: "1px solid #E5E5E5", padding: "24px" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                          {race.candidates.map(c => (
                            <div key={c.id} style={{
                              border: saved[race.id] === c.id ? "2px solid #0A0A0A" : "2px solid #E5E5E5",
                              padding: 20,
                              background: saved[race.id] === c.id ? "#F5F5F5" : "#FAFAFA",
                              transition: "all 0.15s",
                            }}>
                              {/* Candidate header */}
                              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid #E5E5E5" }}>
                                <div style={{
                                  width: 44,
                                  height: 44,
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
                                  <div style={{ fontFamily: "var(--font-display)", fontSize: 16, color: "#0A0A0A" }}>{c.name}</div>
                                  <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                                    <span className="chip" style={{ fontSize: 10, padding: "2px 8px" }}>{c.party}</span>
                                    {c.incumbent && <span style={{ fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 700, color: "#525252", textTransform: "uppercase", letterSpacing: "0.06em" }}>Incumbent</span>}
                                  </div>
                                </div>
                              </div>

                              {/* Alignment */}
                              <div style={{ marginBottom: 16 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                                  <span style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#525252" }}>Values Alignment</span>
                                  <span style={{ fontFamily: "var(--font-display)", fontSize: 16, color: "#EF4444" }}>{Math.round(c.alignment * 100)}%</span>
                                </div>
                                <div className="score-bar">
                                  <div className="score-fill" style={{ width: `${c.alignment * 100}%` }} />
                                </div>
                              </div>

                              {/* Positions */}
                              {Object.entries(c.positions).map(([iss, stance]) => (
                                <div key={iss} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                                  <span style={{ color: "#A3A3A3", fontSize: 12, fontFamily: "var(--font-body)" }}>{iss}</span>
                                  <span style={{ color: "#0A0A0A", fontSize: 12, fontWeight: 500, fontFamily: "var(--font-body)" }}>{stance}</span>
                                </div>
                              ))}

                              {/* Actions */}
                              <div style={{ display: "flex", gap: 8, marginTop: 16, paddingTop: 16, borderTop: "1px solid #E5E5E5" }}>
                                <button onClick={() => setSaved(s => ({ ...s, [race.id]: c.id }))}
                                  className={`btn btn-sm ${saved[race.id] === c.id ? "btn-primary" : "btn-secondary"}`}
                                  style={{ flex: 1 }}>
                                  {saved[race.id] === c.id ? "✓ Saved" : "Save Choice"}
                                </button>
                                <Link href={`/compare`} className="btn btn-ghost btn-sm" style={{ flex: 1 }}>Compare</Link>
                              </div>
                            </div>
                          ))}
                        </div>
                        <Link href="/chat" className="btn btn-ghost btn-sm">
                          Ask AI about this race →
                        </Link>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {tab === "measures" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {MEASURES.map(m => (
                  <div key={m.id} style={{ border: "2px solid #0A0A0A" }}>
                    {/* Measure header */}
                    <div style={{ borderBottom: "1px solid #E5E5E5", padding: "20px 24px", background: "#F5F5F5", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <div style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "center" }}>
                          <span style={{ background: "#EF4444", color: "#FAFAFA", fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 700, padding: "3px 10px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                            {m.number}
                          </span>
                          <span className="chip" style={{ fontSize: 10 }}>Complexity: {m.complexity}</span>
                        </div>
                        <h3 className="type-subhead" style={{ fontSize: 20 }}>{m.title}</h3>
                      </div>
                      <span style={{ color: "#A3A3A3", fontSize: 12, fontFamily: "var(--font-body)", whiteSpace: "nowrap" }}>{m.sources} sources</span>
                    </div>

                    <div style={{ padding: 24 }}>
                      <p style={{ color: "#0A0A0A", fontSize: 15, lineHeight: 1.7, fontFamily: "var(--font-body)", marginBottom: 20 }}>{m.summary}</p>

                      {/* Fiscal impact */}
                      <div style={{ borderLeft: "4px solid #0A0A0A", padding: "12px 16px", background: "#F5F5F5", marginBottom: 20 }}>
                        <div style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#525252", marginBottom: 6 }}>
                          Fiscal Impact
                        </div>
                        <p style={{ color: "#0A0A0A", fontSize: 14, lineHeight: 1.6, fontFamily: "var(--font-body)" }}>{m.fiscal}</p>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                        <div style={{ borderLeft: "4px solid #16A34A", padding: "12px 16px", background: "#F0FDF4" }}>
                          <div style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#16A34A", marginBottom: 8 }}>Supporters</div>
                          {m.support.map(s => <div key={s} style={{ color: "#0A0A0A", fontSize: 13, marginBottom: 4, fontFamily: "var(--font-body)" }}>· {s}</div>)}
                        </div>
                        <div style={{ borderLeft: "4px solid #EF4444", padding: "12px 16px", background: "#FEF2F2" }}>
                          <div style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#EF4444", marginBottom: 8 }}>Opposition</div>
                          {m.oppose.map(o => <div key={o} style={{ color: "#0A0A0A", fontSize: 13, marginBottom: 4, fontFamily: "var(--font-body)" }}>· {o}</div>)}
                        </div>
                      </div>

                      <Link href="/chat" className="btn btn-ghost btn-sm">Ask AI to explain this in simpler terms →</Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
