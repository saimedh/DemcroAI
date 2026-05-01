"use client";
import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ISSUES = [
  { key: "economy", label: "Economy & Jobs", desc: "Tax policy, business regulation, trade, minimum wage" },
  { key: "healthcare", label: "Healthcare", desc: "Insurance coverage, prescription costs, public options" },
  { key: "environment", label: "Environment", desc: "Climate action, clean energy, pollution standards" },
  { key: "education", label: "Education", desc: "School funding, student loans, curriculum policy" },
  { key: "immigration", label: "Immigration", desc: "Border security, pathways to citizenship, DACA" },
  { key: "housing", label: "Housing", desc: "Affordability, zoning, homelessness solutions" },
];

type Step = "setup" | "quiz" | "profile";

export default function ProfilePage() {
  const [step, setStep] = useState<Step>("setup");
  const [name, setName] = useState("");
  const [zip, setZip] = useState("");
  const [priorities, setPriorities] = useState<Record<string, number>>({
    economy: 3, healthcare: 3, environment: 3, education: 3, immigration: 3, housing: 3,
  });
  const [saved] = useState([
    { race: "U.S. Senate — California", candidate: "Alex Rivera" },
    { race: "State Assembly District 14", candidate: "Undecided" },
  ]);

  const STEPS: { id: Step; label: string }[] = [
    { id: "setup", label: "Your Info" },
    { id: "quiz", label: "Priorities" },
    { id: "profile", label: "Profile" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#FAFAFA" }}>
      <Navbar />

      {/* Header */}
      <div style={{ borderBottom: "2px solid #0A0A0A", background: "#F5F5F5" }}>
        <div className="container" style={{ padding: "32px 24px" }}>
          <span className="rubric" style={{ display: "block", marginBottom: 8 }}>Civic Profile</span>
          <h1 className="type-headline" style={{ marginBottom: 8 }}>
            {step === "profile" && name ? `Welcome, ${name}` : "My Civic Profile"}
          </h1>
          <p style={{ color: "#525252", fontSize: 14, fontFamily: "var(--font-body)" }}>
            {step === "profile" ? `${zip || "90210"} · Los Angeles County, CA · 2026 Midterm` : "Build your profile for personalised ballot insights and values alignment."}
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: "40px 24px", maxWidth: 860 }}>
        {/* Stepper */}
        {step !== "profile" && (
          <div style={{ display: "flex", alignItems: "center", marginBottom: 48 }}>
            {STEPS.map((s, i) => (
              <div key={s.id} style={{ display: "flex", alignItems: "center", flex: i < 2 ? 1 : 0 }}>
                <div style={{ display: "flex", flex: "none", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 32,
                    height: 32,
                    border: "2px solid #0A0A0A",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: step === s.id ? "#0A0A0A" : (step === "quiz" && i === 0) ? "#0A0A0A" : "transparent",
                    fontFamily: "var(--font-display)",
                    fontSize: 14,
                    color: step === s.id || (step === "quiz" && i === 0) ? "#FAFAFA" : "#0A0A0A",
                  }}>
                    {(step === "quiz" && i === 0) ? "✓" : i + 1}
                  </div>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: step === s.id ? "#0A0A0A" : "#A3A3A3" }}>
                    {s.label}
                  </span>
                </div>
                {i < 2 && <div style={{ flex: 1, height: 2, background: "#E5E5E5", margin: "0 16px" }} />}
              </div>
            ))}
          </div>
        )}

        {/* Step 1: Setup */}
        {step === "setup" && (
          <div style={{ border: "2px solid #0A0A0A", maxWidth: 560 }}>
            <div style={{ background: "#F5F5F5", borderBottom: "2px solid #0A0A0A", padding: "20px 24px" }}>
              <h2 className="type-subhead" style={{ fontSize: 22 }}>Tell us about yourself</h2>
              <p style={{ color: "#525252", fontSize: 13, fontFamily: "var(--font-body)", marginTop: 4 }}>This helps personalise your ballot and civic experience.</p>
            </div>
            <div style={{ padding: 32, display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <label className="input-label" htmlFor="name-input">Your Name (optional)</label>
                <input id="name-input" type="text" placeholder="How should we address you?" value={name} onChange={e => setName(e.target.value)} className="input" />
              </div>
              <div>
                <label className="input-label" htmlFor="zip-input">Zip Code *</label>
                <input id="zip-input" type="text" placeholder="Your residential zip code" value={zip} onChange={e => setZip(e.target.value)} className="input" maxLength={5} />
              </div>
              <div style={{ borderLeft: "4px solid #0A0A0A", padding: "12px 16px", background: "#F5F5F5" }}>
                <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#525252", lineHeight: 1.6 }}>
                  🔒 Your data is never shared with campaigns, parties, or advertisers. CCPA & GDPR compliant.
                </p>
              </div>
              <button onClick={() => zip && setStep("quiz")} disabled={!zip} className="btn btn-primary" style={{ height: 48, fontSize: 15, justifyContent: "center" }}>
                Continue to Priorities →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Quiz */}
        {step === "quiz" && (
          <div style={{ border: "2px solid #0A0A0A", maxWidth: 600 }}>
            <div style={{ background: "#F5F5F5", borderBottom: "2px solid #0A0A0A", padding: "20px 24px" }}>
              <h2 className="type-subhead" style={{ fontSize: 22 }}>What matters most to you?</h2>
              <p style={{ color: "#525252", fontSize: 13, fontFamily: "var(--font-body)", marginTop: 4 }}>Rate each issue 1–5. This shapes your values alignment scores.</p>
            </div>
            <div style={{ padding: 32 }}>
              {ISSUES.map(issue => (
                <div key={issue.key} style={{ marginBottom: 28 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 8 }}>
                    <div>
                      <div style={{ fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 700, color: "#0A0A0A" }}>{issue.label}</div>
                      <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#A3A3A3" }}>{issue.desc}</div>
                    </div>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: 24, color: "#EF4444", flexShrink: 0, marginLeft: 16 }}>
                      {priorities[issue.key]}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    {[1, 2, 3, 4, 5].map(v => (
                      <button key={v} onClick={() => setPriorities(p => ({ ...p, [issue.key]: v }))}
                        style={{
                          flex: 1,
                          height: 36,
                          border: "2px solid",
                          borderColor: priorities[issue.key] >= v ? "#0A0A0A" : "#E5E5E5",
                          background: priorities[issue.key] >= v ? "#0A0A0A" : "transparent",
                          cursor: "pointer",
                          fontFamily: "var(--font-display)",
                          fontSize: 13,
                          color: priorities[issue.key] >= v ? "#FAFAFA" : "#A3A3A3",
                          transition: "all 0.1s",
                        }}>
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <div style={{ borderTop: "1px solid #E5E5E5", paddingTop: 24, display: "flex", gap: 12 }}>
                <button onClick={() => setStep("setup")} className="btn btn-secondary" style={{ flex: 1, justifyContent: "center" }}>← Back</button>
                <button onClick={() => setStep("profile")} className="btn btn-primary" style={{ flex: 2, justifyContent: "center" }}>Build My Profile →</button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Profile dashboard */}
        {step === "profile" && (
          <div>
            {/* Header card */}
            <div style={{ border: "2px solid #0A0A0A", borderTop: "4px solid #EF4444", padding: "28px 32px", marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 28, color: "#0A0A0A", letterSpacing: "-0.02em" }}>
                  {name ? name.toUpperCase() : "VOTER"}
                </div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "#525252", marginTop: 4 }}>
                  {zip || "90210"} · Los Angeles County, CA · 2026 Midterm Election
                </div>
              </div>
              <Link href="/ballot" className="btn btn-primary">View My Ballot →</Link>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
              {/* Priorities */}
              <div style={{ border: "2px solid #E5E5E5" }}>
                <div style={{ borderBottom: "1px solid #E5E5E5", background: "#F5F5F5", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span className="type-overline">Issue Priorities</span>
                  <button onClick={() => setStep("quiz")} className="btn btn-ghost btn-sm" style={{ padding: "4px 10px" }}>Edit</button>
                </div>
                <div style={{ padding: "16px 20px" }}>
                  {ISSUES.map(issue => (
                    <div key={issue.key} style={{ marginBottom: 14 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#0A0A0A", fontWeight: 500 }}>{issue.label}</span>
                        <span style={{ fontFamily: "var(--font-display)", fontSize: 14, color: "#EF4444" }}>{priorities[issue.key]}/5</span>
                      </div>
                      <div className="score-bar"><div className="score-fill" style={{ width: `${(priorities[issue.key] / 5) * 100}%` }} /></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Saved ballot */}
              <div style={{ border: "2px solid #E5E5E5" }}>
                <div style={{ borderBottom: "1px solid #E5E5E5", background: "#F5F5F5", padding: "16px 20px" }}>
                  <span className="type-overline">My Saved Ballot</span>
                </div>
                <div style={{ padding: "8px 0" }}>
                  {saved.map((r, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", borderBottom: "1px solid #E5E5E5" }}>
                      <div>
                        <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "#A3A3A3", marginBottom: 2 }}>{r.race}</div>
                        <div style={{ fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 700, color: "#0A0A0A" }}>{r.candidate}</div>
                      </div>
                      <span style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700, color: r.candidate === "Undecided" ? "#CA8A04" : "#16A34A", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        {r.candidate === "Undecided" ? "Undecided" : "✓ Saved"}
                      </span>
                    </div>
                  ))}
                  <div style={{ padding: "14px 20px" }}>
                    <Link href="/ballot" style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 700, color: "#EF4444", textDecoration: "none", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                      + Add more races →
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick links */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2, marginTop: 2 }}>
              {[
                { label: "AI Co-Pilot", href: "/chat", desc: "Ask anything about candidates" },
                { label: "Compare", href: "/compare", desc: "Side-by-side candidate matrix" },
                { label: "Voting Info", href: "/logistics", desc: "Registration, deadlines, polling" },
              ].map(item => (
                <Link key={item.href} href={item.href} style={{
                  display: "block",
                  padding: 24,
                  border: "2px solid #E5E5E5",
                  textDecoration: "none",
                  transition: "all 0.15s",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#0A0A0A"; (e.currentTarget as HTMLElement).style.background = "#F5F5F5"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#E5E5E5"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                >
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "#0A0A0A", marginBottom: 6 }}>{item.label}</div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#525252" }}>{item.desc}</div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#EF4444", marginTop: 12 }}>Open →</div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
