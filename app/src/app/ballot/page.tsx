"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { QUIZ_ISSUES, computeAlignmentScore, ValuesProfile } from "@/app/quiz/page";
// india-elections data available for future integration

// Stub races using real India data as candidate pool
const RACES = [
  {
    id: "race-1",
    level: "FEDERAL",
    office: "U.S. Senate — California",
    description: "6-year term · Federal legislation, treaties, judicial confirmations",
    candidates: [
      {
        id: "c1", name: "Alex Rivera", party: "Democrat", incumbent: true, photo: "AR",
        positions: {
          economy: { score: 0.3 }, climate: { score: 0.85 }, healthcare: { score: 0.8 },
          education: { score: 0.75 }, immigration: { score: 0.25 }, gun_policy: { score: 0.25 },
          social_justice: { score: 0.85 }, national_security: { score: 0.45 },
          criminal_justice: { score: 0.3 }, housing: { score: 0.2 },
        },
      },
      {
        id: "c2", name: "Jordan Mills", party: "Republican", incumbent: false, photo: "JM",
        positions: {
          economy: { score: 0.85 }, climate: { score: 0.25 }, healthcare: { score: 0.3 },
          education: { score: 0.75 }, immigration: { score: 0.85 }, gun_policy: { score: 0.9 },
          social_justice: { score: 0.2 }, national_security: { score: 0.85 },
          criminal_justice: { score: 0.8 }, housing: { score: 0.75 },
        },
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
        id: "c3", name: "Morgan Chen", party: "Democrat", incumbent: false, photo: "MC",
        positions: {
          economy: { score: 0.4 }, climate: { score: 0.75 }, healthcare: { score: 0.7 },
          education: { score: 0.6 }, immigration: { score: 0.35 }, gun_policy: { score: 0.35 },
          social_justice: { score: 0.7 }, national_security: { score: 0.5 },
          criminal_justice: { score: 0.4 }, housing: { score: 0.3 },
        },
      },
      {
        id: "c4", name: "Taylor Brooks", party: "Independent", incumbent: false, photo: "TB",
        positions: {
          economy: { score: 0.55 }, climate: { score: 0.55 }, healthcare: { score: 0.55 },
          education: { score: 0.55 }, immigration: { score: 0.55 }, gun_policy: { score: 0.55 },
          social_justice: { score: 0.55 }, national_security: { score: 0.55 },
          criminal_justice: { score: 0.55 }, housing: { score: 0.55 },
        },
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

function AlignmentBadge({ score, hasProfile }: { score: number; hasProfile: boolean }) {
  if (!hasProfile) {
    return (
      <Link href="/quiz" style={{
        display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px",
        background: "rgba(239,68,68,0.08)", border: "1px dashed rgba(239,68,68,0.4)",
        borderRadius: 999, textDecoration: "none", transition: "all 0.15s",
      }}>
        <span style={{ fontSize: 11, fontFamily: "var(--font-body)", color: "#EF4444", fontWeight: 700 }}>
          Take Quiz → Get Score
        </span>
      </Link>
    );
  }
  const color = score >= 70 ? "#22C55E" : score >= 45 ? "#F59E0B" : "#EF4444";
  const bg = score >= 70 ? "rgba(34,197,94,0.1)" : score >= 45 ? "rgba(245,158,11,0.1)" : "rgba(239,68,68,0.1)";
  const border = score >= 70 ? "rgba(34,197,94,0.4)" : score >= 45 ? "rgba(245,158,11,0.4)" : "rgba(239,68,68,0.4)";
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px",
      background: bg, border: `1px solid ${border}`, borderRadius: 999,
    }}>
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
      <span style={{ fontFamily: "var(--font-display)", fontSize: 14, color, letterSpacing: "0.04em" }}>{score}%</span>
      <span style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "#737373" }}>match</span>
    </div>
  );
}

export default function BallotPage() {
  const [tab, setTab] = useState<"races" | "measures">("races");
  const [saved, setSaved] = useState<Record<string, string>>({});
  const [expanded, setExpanded] = useState<string | null>("race-1");
  const [profile, setProfile] = useState<ValuesProfile | null>(null);
  const [showBreakdown, setShowBreakdown] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("democrai_values_profile");
      if (raw) setProfile(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);

  const getAlignment = (candidatePositions: Record<string, { score: number }>) => {
    if (!profile) return null;
    return computeAlignmentScore(profile, candidatePositions);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0A" }}>
      <Navbar />

      {/* Quiz CTA banner */}
      {!profile && (
        <div style={{ background: "linear-gradient(90deg, rgba(239,68,68,0.15), rgba(249,115,22,0.15))", borderBottom: "1px solid rgba(239,68,68,0.2)", padding: "12px 24px" }}>
          <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "#A3A3A3" }}>
              🎯 <strong style={{ color: "#FAFAFA" }}>Get personalised alignment scores</strong> — take the 3-minute values quiz
            </p>
            <Link href="/quiz" style={{ background: "linear-gradient(135deg, #EF4444, #F97316)", color: "#FAFAFA", padding: "8px 20px", fontFamily: "var(--font-display)", fontSize: 13, borderRadius: 4, textDecoration: "none", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>
              Take Quiz →
            </Link>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ borderBottom: "1px solid #1A1A1A", background: "#0D0D0D" }}>
        <div className="container" style={{ padding: "28px 24px", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 16, alignItems: "flex-start" }}>
          <div>
            <span style={{ display: "block", fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#525252", marginBottom: 6 }}>My Ballot</span>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, color: "#FAFAFA", marginBottom: 8 }}>Your 2026 Ballot</h1>
            <p style={{ color: "#525252", fontSize: 14, fontFamily: "var(--font-body)" }}>
              Jurisdiction: <strong style={{ color: "#A3A3A3" }}>Los Angeles County, CA</strong> · 2 Races · 2 Measures
              {profile && <span style={{ marginLeft: 12, color: "#22C55E", fontWeight: 700 }}>✓ Values profile active</span>}
            </p>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <Link href="/quiz" style={{ padding: "10px 18px", background: "#141414", border: "1px solid #2A2A2A", color: "#A3A3A3", fontFamily: "var(--font-body)", fontSize: 13, borderRadius: 4, textDecoration: "none" }}>
              {profile ? "Retake Quiz" : "Values Quiz"}
            </Link>
            <Link href="/chat" style={{ padding: "10px 18px", background: "linear-gradient(135deg, #EF4444, #F97316)", border: "none", color: "#FAFAFA", fontFamily: "var(--font-display)", fontSize: 13, borderRadius: 4, textDecoration: "none", letterSpacing: "0.04em" }}>
              Ask AI
            </Link>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: "40px 24px" }}>
        {/* Tabs */}
        <div style={{ display: "flex", gap: 0, marginBottom: 32, borderBottom: "1px solid #1A1A1A" }}>
          {(["races", "measures"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: "12px 24px", border: "none",
              borderBottom: tab === t ? "2px solid #EF4444" : "2px solid transparent",
              marginBottom: -1, background: "none", cursor: "pointer",
              fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 700,
              textTransform: "uppercase", letterSpacing: "0.08em",
              color: tab === t ? "#FAFAFA" : "#525252", transition: "all 0.15s",
            }}>
              {t === "races" ? "🏛 Races (2)" : "📋 Measures (2)"}
            </button>
          ))}
        </div>

        {tab === "races" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {RACES.map(race => (
              <div key={race.id} style={{ background: "#141414", border: "1px solid #2A2A2A", borderRadius: 8 }}>
                <div onClick={() => setExpanded(expanded === race.id ? null : race.id)}
                  style={{ padding: "20px 24px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                      <span style={{ background: "#EF4444", color: "#FAFAFA", fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 3, textTransform: "uppercase", letterSpacing: "0.06em" }}>{race.level}</span>
                    </div>
                    <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, color: "#FAFAFA" }}>{race.office}</h3>
                    <p style={{ color: "#525252", fontSize: 13, fontFamily: "var(--font-body)", marginTop: 4 }}>{race.description}</p>
                  </div>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 20, color: "#525252" }}>{expanded === race.id ? "−" : "+"}</span>
                </div>

                {expanded === race.id && (
                  <div style={{ borderTop: "1px solid #1A1A1A", padding: 24 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                      {race.candidates.map(c => {
                        const alignment = getAlignment(c.positions);
                        const score = alignment ? alignment.score : null;
                        return (
                          <div key={c.id} style={{
                            background: saved[race.id] === c.id ? "#1A1A1A" : "#0D0D0D",
                            border: `1px solid ${saved[race.id] === c.id ? "#EF4444" : "#2A2A2A"}`,
                            padding: 20, borderRadius: 6, transition: "all 0.15s",
                          }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid #1A1A1A" }}>
                              <div style={{ width: 44, height: 44, background: "linear-gradient(135deg, #EF4444, #F97316)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FAFAFA", fontFamily: "var(--font-display)", fontSize: 14, flexShrink: 0, borderRadius: 4 }}>{c.photo}</div>
                              <div style={{ flex: 1 }}>
                                <div style={{ fontFamily: "var(--font-display)", fontSize: 16, color: "#FAFAFA" }}>{c.name}</div>
                                <div style={{ display: "flex", gap: 6, marginTop: 4, flexWrap: "wrap", alignItems: "center" }}>
                                  <span style={{ background: "#1A1A1A", border: "1px solid #2A2A2A", color: "#A3A3A3", padding: "2px 8px", borderRadius: 999, fontFamily: "var(--font-body)", fontSize: 10 }}>{c.party}</span>
                                  {c.incumbent && <span style={{ fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 700, color: "#737373", textTransform: "uppercase" }}>Incumbent</span>}
                                </div>
                              </div>
                            </div>

                            {/* Alignment Badge */}
                            <div style={{ marginBottom: 16 }}>
                              <div style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#525252", marginBottom: 8 }}>Values Alignment</div>
                              <AlignmentBadge score={score ?? 0} hasProfile={!!profile} />
                              {score !== null && alignment && (
                                <button onClick={() => setShowBreakdown(showBreakdown === c.id ? null : c.id)}
                                  style={{ background: "none", border: "none", color: "#525252", fontFamily: "var(--font-body)", fontSize: 11, cursor: "pointer", marginLeft: 12, textDecoration: "underline" }}>
                                  {showBreakdown === c.id ? "hide" : "see breakdown"}
                                </button>
                              )}
                            </div>

                            {/* Breakdown */}
                            {showBreakdown === c.id && alignment && (
                              <div style={{ background: "#0A0A0A", border: "1px solid #1A1A1A", borderRadius: 6, padding: "12px 16px", marginBottom: 16 }}>
                                {QUIZ_ISSUES.map(issue => {
                                  const bd = alignment.breakdown[issue.key];
                                  if (!bd) return null;
                                  const w = profile?.priorities[issue.key] ?? 3;
                                  return (
                                    <div key={issue.key} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                                      <span style={{ fontSize: 14 }}>{issue.icon}</span>
                                      <span style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "#737373", flex: 1 }}>{issue.label}</span>
                                      <span style={{ fontFamily: "var(--font-body)", fontSize: 10, color: "#525252" }}>×{w}</span>
                                      <div style={{ width: 60, height: 4, background: "#1A1A1A", borderRadius: 2 }}>
                                        <div style={{ width: `${bd.issueScore}%`, height: "100%", background: bd.issueScore >= 70 ? "#22C55E" : bd.issueScore >= 45 ? "#F59E0B" : "#EF4444", borderRadius: 2 }} />
                                      </div>
                                      <span style={{ fontFamily: "var(--font-display)", fontSize: 12, color: "#A3A3A3", width: 30, textAlign: "right" }}>{bd.issueScore}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            )}

                            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                              <button onClick={() => setSaved(s => ({ ...s, [race.id]: c.id }))}
                                style={{
                                  flex: 1, padding: "10px 0", background: saved[race.id] === c.id ? "linear-gradient(135deg, #EF4444, #F97316)" : "#1A1A1A",
                                  border: `1px solid ${saved[race.id] === c.id ? "transparent" : "#2A2A2A"}`,
                                  color: "#FAFAFA", fontFamily: "var(--font-display)", fontSize: 12, cursor: "pointer", borderRadius: 4, letterSpacing: "0.04em",
                                }}>
                                {saved[race.id] === c.id ? "✓ Saved" : "Save Choice"}
                              </button>
                              <Link href="/chat" style={{ flex: 1, padding: "10px 0", background: "none", border: "1px solid #2A2A2A", color: "#737373", fontFamily: "var(--font-body)", fontSize: 12, borderRadius: 4, textDecoration: "none", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                Ask AI
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {tab === "measures" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {MEASURES.map(m => (
              <div key={m.id} style={{ background: "#141414", border: "1px solid #2A2A2A", borderRadius: 8 }}>
                <div style={{ borderBottom: "1px solid #1A1A1A", padding: "20px 24px" }}>
                  <div style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "center" }}>
                    <span style={{ background: "#EF4444", color: "#FAFAFA", fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 3 }}>{m.number}</span>
                    <span style={{ background: "#1A1A1A", border: "1px solid #2A2A2A", color: "#737373", fontFamily: "var(--font-body)", fontSize: 11, padding: "3px 10px", borderRadius: 999 }}>Complexity: {m.complexity}</span>
                  </div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, color: "#FAFAFA" }}>{m.title}</h3>
                </div>
                <div style={{ padding: 24 }}>
                  <p style={{ color: "#D4D4D4", fontSize: 15, lineHeight: 1.7, fontFamily: "var(--font-body)", marginBottom: 20 }}>{m.summary}</p>
                  <div style={{ borderLeft: "3px solid #525252", padding: "12px 16px", background: "#0D0D0D", marginBottom: 20, borderRadius: "0 4px 4px 0" }}>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#525252", marginBottom: 6 }}>Fiscal Impact</div>
                    <p style={{ color: "#A3A3A3", fontSize: 14, lineHeight: 1.6, fontFamily: "var(--font-body)" }}>{m.fiscal}</p>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                    <div style={{ borderLeft: "3px solid #22C55E", padding: "12px 16px", background: "rgba(34,197,94,0.05)", borderRadius: "0 4px 4px 0" }}>
                      <div style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#22C55E", marginBottom: 8 }}>Supporters</div>
                      {m.support.map(s => <div key={s} style={{ color: "#A3A3A3", fontSize: 13, marginBottom: 4, fontFamily: "var(--font-body)" }}>· {s}</div>)}
                    </div>
                    <div style={{ borderLeft: "3px solid #EF4444", padding: "12px 16px", background: "rgba(239,68,68,0.05)", borderRadius: "0 4px 4px 0" }}>
                      <div style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#EF4444", marginBottom: 8 }}>Opposition</div>
                      {m.oppose.map(o => <div key={o} style={{ color: "#A3A3A3", fontSize: 13, marginBottom: 4, fontFamily: "var(--font-body)" }}>· {o}</div>)}
                    </div>
                  </div>
                  <Link href="/chat" style={{ background: "none", border: "1px solid #2A2A2A", color: "#737373", padding: "10px 18px", fontFamily: "var(--font-body)", fontSize: 13, borderRadius: 4, textDecoration: "none", display: "inline-block" }}>
                    Ask AI to explain this →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}


