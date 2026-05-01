"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const TYPED_PHRASES = [
  "What does Candidate A say about healthcare?",
  "Explain Proposition 22 in plain English",
  "Compare candidates on climate policy",
  "Where is my polling place?",
];

function useTyping(phrases: string[], speed = 45, pause = 2200) {
  const [text, setText] = useState("");
  const [pIdx, setPIdx] = useState(0);
  const [cIdx, setCIdx] = useState(0);
  const [del, setDel] = useState(false);
  useEffect(() => {
    const cur = phrases[pIdx];
    let t: ReturnType<typeof setTimeout>;
    if (!del && cIdx < cur.length) t = setTimeout(() => setCIdx(c => c + 1), speed);
    else if (!del && cIdx === cur.length) t = setTimeout(() => setDel(true), pause);
    else if (del && cIdx > 0) t = setTimeout(() => setCIdx(c => c - 1), speed / 2);
    else if (del && cIdx === 0) { setDel(false); setPIdx(i => (i + 1) % phrases.length); }
    return () => clearTimeout(t);
  }, [cIdx, del, pIdx, phrases, speed, pause]);
  useEffect(() => { setText(phrases[pIdx].slice(0, cIdx)); }, [cIdx, pIdx, phrases]);
  return text;
}

const STATS = [
  { value: "2M+", label: "Voters Informed" },
  { value: "98%", label: "Ballot Coverage" },
  { value: "4.8/5", label: "Neutrality Score" },
  { value: "<4s", label: "AI Response" },
];

const FEATURES = [
  { num: "01", title: "Ballot Builder", desc: "Enter your address. Get your full ballot auto-populated with every race and measure in plain English.", href: "/ballot" },
  { num: "02", title: "AI Co-Pilot", desc: "Ask anything. Every answer is grounded in cited, verifiable public sources — no spin, no agenda.", href: "/chat" },
  { num: "03", title: "Candidate Comparison", desc: "Side-by-side policy matrix across any dimension. See what they actually say, backed by FEC data.", href: "/compare" },
  { num: "04", title: "Ballot Decoder", desc: "Dense legal text decoded into plain language. Fiscal impact, endorsements, arguments on both sides.", href: "/ballot" },
  { num: "05", title: "Voting Logistics", desc: "Registration, polling place, deadlines, ID requirements — your entire voting checklist in one place.", href: "/logistics" },
  { num: "06", title: "Values Alignment", desc: "Tell us what you care about. See how each candidate lines up — with full transparency on the methodology.", href: "/profile" },
];

const TESTIMONIALS = [
  { quote: "I finally understand what I'm voting on. DemocrAI explained a 40-page ballot measure in two minutes.", name: "Sarah K.", role: "First-time voter, California" },
  { quote: "As a civic educator, I've been looking for something like this for years. The neutrality is real.", name: "Marcus T.", role: "High school civics teacher" },
  { quote: "I used to skip local elections. Now I'm actually engaged. The AI is remarkably unbiased.", name: "Priya R.", role: "Independent voter, Texas" },
];

export default function HomePage() {
  const [zip, setZip] = useState("");
  const typed = useTyping(TYPED_PHRASES);

  return (
    <div style={{ minHeight: "100vh", background: "#FAFAFA" }}>
      <Navbar />

      {/* ── HERO ── */}
      <section style={{ borderBottom: "2px solid #0A0A0A" }}>
        <div className="container" style={{ paddingTop: 64, paddingBottom: 64 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: 64, alignItems: "start" }}>

            {/* Left: headline */}
            <div>
              <span className="rubric" style={{ marginBottom: 16, display: "block" }}>
                2026 Midterm Edition
              </span>
              <h1 className="type-display" style={{ marginBottom: 24 }}>
                YOUR PERSONAL<br />
                <span style={{ color: "#EF4444" }}>ELECTION</span><br />
                CO-PILOT
              </h1>
              <p className="type-body-lg" style={{ color: "#525252", maxWidth: 520, marginBottom: 40, lineHeight: 1.6 }}>
                DemocrAI turns fragmented election data into clear, cited, nonpartisan insight. Every candidate. Every ballot measure. Every race.
              </p>

              {/* Address input */}
              <div style={{ marginBottom: 12 }}>
                <label className="input-label" htmlFor="hero-zip">Enter your zip code</label>
                <div style={{ display: "flex", gap: 0 }}>
                  <input
                    id="hero-zip"
                    type="text"
                    placeholder="e.g. 90210"
                    value={zip}
                    maxLength={5}
                    onChange={e => setZip(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && zip.length === 5 && (window.location.href = `/ballot?zip=${zip}`)}
                    className="input"
                    style={{ maxWidth: 200, borderRight: "none" }}
                  />
                  <Link
                    href={zip ? `/ballot?zip=${zip}` : "/ballot"}
                    className="btn btn-primary"
                    style={{ flexShrink: 0 }}
                  >
                    View My Ballot →
                  </Link>
                </div>
              </div>
              <p style={{ fontSize: 12, color: "#A3A3A3", fontFamily: "var(--font-body)" }}>
                No account required · All 50 states · Updated daily
              </p>
            </div>

            {/* Right: AI chat preview */}
            <div>
              <div style={{ border: "2px solid #0A0A0A" }}>
                {/* Header */}
                <div style={{
                  background: "#0A0A0A",
                  padding: "12px 16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#FAFAFA" }}>
                    AI Co-Pilot
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span className="live-dot" style={{ background: "#EF4444" }} />
                    <span style={{ color: "#A3A3A3", fontSize: 11, fontFamily: "var(--font-body)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                      Live · Nonpartisan
                    </span>
                  </div>
                </div>

                {/* Messages */}
                <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
                  {/* User bubble */}
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <div className="chat-user" style={{ maxWidth: "85%" }}>
                      {typed}<span className="cursor" />
                    </div>
                  </div>

                  {/* AI bubble */}
                  <div className="chat-ai">
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#525252", marginBottom: 8, fontFamily: "var(--font-body)" }}>
                      DemocrAI · Nonpartisan
                    </div>
                    Based on public records, Senator Smith supports expanding Medicare coverage to include dental and vision benefits{" "}
                    <span className="cite">[1]</span>. Her opponent favors market-based alternatives{" "}
                    <span className="cite">[2]</span>.
                    <div style={{ marginTop: 10, fontSize: 12, color: "#A3A3A3", fontFamily: "var(--font-body)" }}>
                      Sources: Official campaign site · FEC records · Senate voting history
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div style={{ borderTop: "1px solid #E5E5E5", padding: "10px 16px" }}>
                  <Link href="/chat" style={{ fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 700, color: "#EF4444", textDecoration: "none", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    Open full AI chat →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section style={{ background: "#0A0A0A", borderBottom: "2px solid #EF4444" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
            {STATS.map((s, i) => (
              <div key={i} style={{
                padding: "32px 24px",
                borderRight: i < 3 ? "1px solid #262626" : "none",
                textAlign: "center",
              }}>
                <div className="big-number" style={{ color: "#FAFAFA", marginBottom: 6 }}>{s.value}</div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#A3A3A3" }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: "96px 0", borderBottom: "1px solid #E5E5E5" }}>
        <div className="container">
          <div className="section-header">
            <span className="rubric">How It Works</span>
            <div style={{ flex: 1, height: 1, background: "#E5E5E5" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0 }}>
            {[
              { n: "01", title: "Enter Address", desc: "Your zip code unlocks your full ballot and local jurisdiction." },
              { n: "02", title: "Share Priorities", desc: "A 2-minute quiz maps your values across key policy areas." },
              { n: "03", title: "Review Dashboard", desc: "Personalised insights for every race and ballot measure." },
              { n: "04", title: "Vote Informed", desc: "Save notes, set reminders, and head to the polls ready." },
            ].map((step, i) => (
              <div key={i} style={{
                padding: "32px 24px",
                borderRight: i < 3 ? "1px solid #E5E5E5" : "none",
              }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 48, color: "#E5E5E5", marginBottom: 16, lineHeight: 1 }}>
                  {step.n}
                </div>
                <h3 className="type-subhead" style={{ marginBottom: 12 }}>{step.title}</h3>
                <p style={{ color: "#525252", fontSize: 14, lineHeight: 1.7, fontFamily: "var(--font-body)" }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding: "96px 0", borderBottom: "1px solid #E5E5E5" }}>
        <div className="container">
          <div className="section-header">
            <span className="rubric">Core Features</span>
            <div style={{ flex: 1, height: 1, background: "#E5E5E5" }} />
            <Link href="/ballot" className="btn btn-secondary btn-sm">
              Explore All →
            </Link>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0 }}>
            {FEATURES.map((f, i) => (
              <Link key={i} href={f.href} style={{
                textDecoration: "none",
                display: "block",
                padding: 32,
                borderRight: i % 3 !== 2 ? "1px solid #E5E5E5" : "none",
                borderBottom: i < 3 ? "1px solid #E5E5E5" : "none",
                transition: "background 0.15s",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "#F5F5F5")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <div style={{ fontFamily: "var(--font-display)", fontSize: 13, color: "#EF4444", marginBottom: 12, letterSpacing: "-0.01em" }}>
                  {f.num}
                </div>
                <h3 className="type-subhead" style={{ marginBottom: 12 }}>{f.title}</h3>
                <p style={{ color: "#525252", fontSize: 14, lineHeight: 1.7, fontFamily: "var(--font-body)" }}>{f.desc}</p>
                <span style={{ display: "block", marginTop: 20, fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#0A0A0A" }}>
                  Open →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── PULL QUOTE / COMMITMENT ── */}
      <section style={{ padding: "96px 0", background: "#0A0A0A", borderBottom: "4px solid #EF4444" }}>
        <div className="container-narrow" style={{ textAlign: "center" }}>
          <span className="rubric" style={{ color: "#EF4444", display: "block", marginBottom: 24 }}>
            Our Commitment
          </span>
          <h2 className="type-headline" style={{ color: "#FAFAFA", marginBottom: 32 }}>
            We inform. You decide. Always.
          </h2>
          <p className="type-body-lg" style={{ color: "#A3A3A3", marginBottom: 48, fontStyle: "italic" }}>
            DemocrAI never recommends candidates. Every claim is source-cited. Conflicting information is surfaced — not hidden. Our bipartisan advisory board reviews all editorial framing quarterly.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0, borderTop: "1px solid #262626" }}>
            {[
              { icon: "📚", label: "Every claim cited" },
              { icon: "⚖️", label: "Both sides, always" },
              { icon: "🚫", label: "No recommendations" },
              { icon: "🔒", label: "Your data stays yours" },
            ].map((item, i) => (
              <div key={i} style={{
                padding: "24px 16px",
                borderRight: i < 3 ? "1px solid #262626" : "none",
                textAlign: "center",
              }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>{item.icon}</div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#FAFAFA" }}>
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding: "96px 0", borderBottom: "1px solid #E5E5E5" }}>
        <div className="container">
          <div className="section-header">
            <span className="rubric">Community</span>
            <div style={{ flex: 1, height: 1, background: "#E5E5E5" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0 }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} style={{
                padding: 32,
                borderRight: i < 2 ? "1px solid #E5E5E5" : "none",
                borderLeft: i === 1 ? "4px solid #EF4444" : "none",
              }}>
                <p className="type-body-lg" style={{ fontStyle: "italic", marginBottom: 24, color: "#0A0A0A" }}>
                  "{t.quote}"
                </p>
                <div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 700, color: "#0A0A0A" }}>{t.name}</div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#525252", marginTop: 2 }}>{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: "96px 0", background: "#F5F5F5", borderTop: "2px solid #0A0A0A" }}>
        <div className="container" style={{ display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center", gap: 48 }}>
          <div>
            <span className="rubric" style={{ display: "block", marginBottom: 16 }}>Don't wait</span>
            <h2 className="type-headline">
              Ready to vote<br /><span style={{ color: "#EF4444" }}>informed?</span>
            </h2>
            <p style={{ color: "#525252", fontSize: 16, fontFamily: "var(--font-body)", marginTop: 16, maxWidth: 400 }}>
              Join 2 million voters who use DemocrAI to navigate every election with confidence.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}>
            <Link href="/ballot" className="btn btn-primary btn-lg">
              View My Ballot →
            </Link>
            <Link href="/chat" className="btn btn-secondary btn-lg">
              Try AI Chat
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
