"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const QUIZ_ISSUES = [
  {
    key: "economy",
    label: "Economy & Jobs",
    icon: "💰",
    desc: "Job creation, wages, taxes, trade policy, and economic growth.",
    left: "More government regulation & wealth redistribution",
    right: "Free markets, deregulation & lower taxes",
  },
  {
    key: "climate",
    label: "Climate & Environment",
    icon: "🌿",
    desc: "Climate change action, clean energy, and environmental regulations.",
    left: "Urgent climate action, carbon taxes, renewables",
    right: "Energy independence, fossil fuels, fewer mandates",
  },
  {
    key: "healthcare",
    label: "Healthcare",
    icon: "🏥",
    desc: "Access, affordability, insurance models, and public health.",
    left: "Universal / public healthcare system",
    right: "Private market competition & patient choice",
  },
  {
    key: "education",
    label: "Education",
    icon: "📚",
    desc: "Public schools, student debt, curriculum, and school choice.",
    left: "Increased public school funding & free college",
    right: "School choice, charter schools & local control",
  },
  {
    key: "immigration",
    label: "Immigration",
    icon: "🌍",
    desc: "Border policy, legal pathways, asylum, and enforcement.",
    left: "Welcoming immigration & expanded pathways",
    right: "Strict border enforcement & reduced immigration",
  },
  {
    key: "gun_policy",
    label: "Gun Policy",
    icon: "🔒",
    desc: "Second Amendment rights, background checks, and firearms regulations.",
    left: "Stricter gun laws & universal background checks",
    right: "Strong 2nd Amendment protections & minimal restrictions",
  },
  {
    key: "social_justice",
    label: "Social Justice & Civil Rights",
    icon: "⚖️",
    desc: "Racial equity, LGBTQ+ rights, and anti-discrimination policy.",
    left: "Active anti-discrimination laws & equity programs",
    right: "Equal treatment without group-based policies",
  },
  {
    key: "national_security",
    label: "National Security & Foreign Policy",
    icon: "🛡️",
    desc: "Military spending, alliances, foreign aid, and defence.",
    left: "Diplomacy-first, multilateral cooperation",
    right: "Strong military, national sovereignty & America First",
  },
  {
    key: "criminal_justice",
    label: "Criminal Justice",
    icon: "⚖",
    desc: "Policing, sentencing, prison reform, and public safety.",
    left: "Reform-focused, reduce incarceration, community policing",
    right: "Tough-on-crime, strong law enforcement & deterrence",
  },
  {
    key: "housing",
    label: "Housing & Infrastructure",
    icon: "🏘️",
    desc: "Affordable housing, zoning, urban development, and infrastructure spending.",
    left: "Federal housing investment, zoning reform, rent controls",
    right: "Local control, private development & reduce regulation",
  },
];

export interface ValuesProfile {
  priorities: Record<string, number>; // 1–5 importance weight
  positions: Record<string, number>; // 0–100 policy position
  completedAt: string;
}

function computeAlignmentScore(
  profile: ValuesProfile,
  candidatePositions: Record<string, { score: number }>
): { score: number; breakdown: Record<string, { issueScore: number; weight: number; candidateScore: number }> } {
  const breakdown: Record<string, { issueScore: number; weight: number; candidateScore: number }> = {};
  let totalWeight = 0;
  let weightedSum = 0;

  for (const issue of QUIZ_ISSUES) {
    const weight = profile.priorities[issue.key] || 3;
    const userPos = (profile.positions[issue.key] ?? 50) / 100; // normalise 0–1
    const candidateScore = candidatePositions[issue.key]?.score ?? 0.5;

    // Alignment = 1 - abs(user - candidate), scaled to 0–100
    const issueScore = Math.round((1 - Math.abs(userPos - candidateScore)) * 100);

    breakdown[issue.key] = { issueScore, weight, candidateScore: Math.round(candidateScore * 100) };
    weightedSum += issueScore * weight;
    totalWeight += weight;
  }

  const score = totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 50;
  return { score, breakdown };
}

export { computeAlignmentScore };

const STEPS = QUIZ_ISSUES.length;

export default function QuizPage() {
  const router = useRouter();
  const [step, setStep] = useState(0); // 0 = intro, 1..10 = issue, 11 = done
  const [priorities, setPriorities] = useState<Record<string, number>>(
    Object.fromEntries(QUIZ_ISSUES.map((q) => [q.key, 3]))
  );
  const [positions, setPositions] = useState<Record<string, number>>(
    Object.fromEntries(QUIZ_ISSUES.map((q) => [q.key, 50]))
  );
  const [saving, setSaving] = useState(false);

  const currentIssue = step >= 1 && step <= STEPS ? QUIZ_ISSUES[step - 1] : null;
  const progress = step === 0 ? 0 : step > STEPS ? 100 : Math.round(((step - 1) / STEPS) * 100);

  const save = () => {
    setSaving(true);
    const profile: ValuesProfile = {
      priorities,
      positions,
      completedAt: new Date().toISOString(),
    };
    localStorage.setItem("democrai_values_profile", JSON.stringify(profile));
    setTimeout(() => {
      setSaving(false);
      router.push("/ballot");
    }, 800);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0A", display: "flex", flexDirection: "column" }}>
      <Navbar />

      {/* Progress bar */}
      <div style={{ height: 4, background: "#1A1A1A" }}>
        <div
          style={{
            height: "100%",
            width: `${progress}%`,
            background: "linear-gradient(90deg, #EF4444, #F97316)",
            transition: "width 0.4s ease",
          }}
        />
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 24px" }}>

        {/* INTRO */}
        {step === 0 && (
          <div style={{ maxWidth: 640, textAlign: "center", animation: "fadeIn 0.5s ease" }}>
            <div style={{ fontSize: 64, marginBottom: 24 }}>🗳️</div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 5vw, 48px)", color: "#FAFAFA", lineHeight: 1.1, marginBottom: 20 }}>
              What Do You Care About?
            </h1>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 18, color: "#A3A3A3", lineHeight: 1.7, marginBottom: 32 }}>
              Answer 10 quick questions about your policy priorities. We&apos;ll generate a personalised <strong style={{ color: "#FAFAFA" }}>values alignment score</strong> for every candidate on your ballot — so you can see who actually shares your views.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 40 }}>
              {["🔒 Stored locally — never sold", "⚖️ Nonpartisan algorithm", "⚡ Takes ~3 minutes"].map((t) => (
                <span key={t} style={{ background: "#1A1A1A", border: "1px solid #2A2A2A", color: "#A3A3A3", padding: "8px 16px", borderRadius: 999, fontFamily: "var(--font-body)", fontSize: 13 }}>{t}</span>
              ))}
            </div>
            <button
              onClick={() => setStep(1)}
              style={{
                background: "linear-gradient(135deg, #EF4444, #F97316)",
                color: "#FAFAFA",
                border: "none",
                padding: "16px 48px",
                fontFamily: "var(--font-display)",
                fontSize: 16,
                cursor: "pointer",
                letterSpacing: "0.05em",
                borderRadius: 4,
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 32px rgba(239,68,68,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              Start Quiz →
            </button>
          </div>
        )}

        {/* ISSUE STEP */}
        {currentIssue && step >= 1 && step <= STEPS && (
          <div style={{ maxWidth: 700, width: "100%", animation: "slideUp 0.3s ease" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#525252" }}>Question {step} of {STEPS}</span>
              <button onClick={() => setStep(0)} style={{ background: "none", border: "none", color: "#525252", fontFamily: "var(--font-body)", fontSize: 13, cursor: "pointer" }}>← Restart</button>
            </div>

            <div style={{ background: "#141414", border: "1px solid #2A2A2A", padding: "40px 48px", borderRadius: 8 }}>
              <div style={{ fontSize: 48, marginBottom: 16, textAlign: "center" }}>{currentIssue.icon}</div>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28, color: "#FAFAFA", textAlign: "center", marginBottom: 8 }}>{currentIssue.label}</h2>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "#737373", textAlign: "center", marginBottom: 40 }}>{currentIssue.desc}</p>

              {/* Importance */}
              <div style={{ marginBottom: 36 }}>
                <label style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 700, color: "#A3A3A3", display: "block", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  How important is this issue to you?
                </label>
                <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                  {[1, 2, 3, 4, 5].map((v) => (
                    <button
                      key={v}
                      onClick={() => setPriorities((p) => ({ ...p, [currentIssue.key]: v }))}
                      style={{
                        width: 52, height: 52, border: `2px solid ${priorities[currentIssue.key] === v ? "#EF4444" : "#2A2A2A"}`,
                        background: priorities[currentIssue.key] === v ? "rgba(239,68,68,0.15)" : "#0A0A0A",
                        color: priorities[currentIssue.key] === v ? "#EF4444" : "#525252",
                        fontFamily: "var(--font-display)", fontSize: 18, cursor: "pointer", borderRadius: 4, transition: "all 0.15s",
                      }}
                    >
                      {v}
                    </button>
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#525252" }}>Not important</span>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#525252" }}>Very important</span>
                </div>
              </div>

              {/* Position slider */}
              <div style={{ marginBottom: 40 }}>
                <label style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 700, color: "#A3A3A3", display: "block", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Where do you stand?
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 16, alignItems: "center", marginBottom: 16 }}>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#525252", lineHeight: 1.5, textAlign: "right" }}>{currentIssue.left}</p>
                  <div style={{ width: 60, height: 60, background: "#1A1A1A", border: "2px solid #2A2A2A", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 4 }}>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: 20, color: "#FAFAFA" }}>{positions[currentIssue.key]}</span>
                  </div>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#525252", lineHeight: 1.5 }}>{currentIssue.right}</p>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={positions[currentIssue.key]}
                  onChange={(e) => setPositions((p) => ({ ...p, [currentIssue.key]: Number(e.target.value) }))}
                  style={{ width: "100%", accentColor: "#EF4444", cursor: "pointer" }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#525252" }}>← More progressive</span>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#525252" }}>More conservative →</span>
                </div>
              </div>

              <div style={{ display: "flex", gap: 12, justifyContent: "space-between" }}>
                {step > 1 && (
                  <button onClick={() => setStep((s) => s - 1)} style={{ padding: "14px 28px", background: "#1A1A1A", border: "1px solid #2A2A2A", color: "#A3A3A3", fontFamily: "var(--font-body)", fontSize: 14, cursor: "pointer", borderRadius: 4, flex: "0 0 auto" }}>
                    ← Back
                  </button>
                )}
                <button
                  onClick={() => setStep((s) => s + 1)}
                  style={{
                    flex: 1,
                    padding: "14px 28px",
                    background: "linear-gradient(135deg, #EF4444, #F97316)",
                    border: "none",
                    color: "#FAFAFA",
                    fontFamily: "var(--font-display)",
                    fontSize: 16,
                    cursor: "pointer",
                    borderRadius: 4,
                    letterSpacing: "0.05em",
                  }}
                >
                  {step === STEPS ? "See My Results →" : "Next →"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* COMPLETION */}
        {step > STEPS && (
          <div style={{ maxWidth: 600, textAlign: "center", animation: "fadeIn 0.5s ease" }}>
            <div style={{ fontSize: 72, marginBottom: 24 }}>🎯</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 40, color: "#FAFAFA", marginBottom: 16 }}>
              Profile Complete!
            </h2>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 16, color: "#A3A3A3", lineHeight: 1.7, marginBottom: 32 }}>
              Your values profile has been created. We&apos;ll now show you a personalised <strong style={{ color: "#FAFAFA" }}>alignment score (0–100)</strong> for every candidate on your ballot — with a transparent breakdown for each issue.
            </p>

            {/* Summary chips */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8, marginBottom: 40, textAlign: "left" }}>
              {QUIZ_ISSUES.filter((q) => priorities[q.key] >= 4).slice(0, 6).map((q) => (
                <div key={q.key} style={{ background: "#141414", border: "1px solid #2A2A2A", padding: "12px 16px", borderRadius: 6, display: "flex", gap: 8, alignItems: "center" }}>
                  <span>{q.icon}</span>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#A3A3A3" }}>{q.label} — priority {priorities[q.key]}/5</span>
                </div>
              ))}
            </div>

            <button
              onClick={save}
              disabled={saving}
              style={{
                background: saving ? "#2A2A2A" : "linear-gradient(135deg, #EF4444, #F97316)",
                color: "#FAFAFA",
                border: "none",
                padding: "18px 56px",
                fontFamily: "var(--font-display)",
                fontSize: 18,
                cursor: saving ? "not-allowed" : "pointer",
                borderRadius: 4,
                letterSpacing: "0.05em",
                transition: "all 0.2s",
              }}
            >
              {saving ? "Saving…" : "View My Ballot Matches →"}
            </button>
          </div>
        )}
      </div>

      <Footer />

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: scale(1); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
