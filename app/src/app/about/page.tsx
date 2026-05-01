import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const DATA_SOURCES = [
  { name: "Google Civic Information API", type: "Government", used_for: "Ballot & race detection by address", freshness: "Daily" },
  { name: "Ballotpedia", type: "Nonpartisan", used_for: "Candidate profiles, voting history", freshness: "Daily" },
  { name: "FEC (Federal Election Commission)", type: "Government", used_for: "Campaign finance, donor data", freshness: "48h" },
  { name: "OpenSecrets.org", type: "Nonpartisan", used_for: "Financial influence analysis", freshness: "Weekly" },
  { name: "Congress.gov Voting Records", type: "Government", used_for: "Federal legislative history", freshness: "Real-time" },
  { name: "NewsAPI & GDELT", type: "News", used_for: "Recent coverage, fact-check signals", freshness: "15 min" },
  { name: "Vote.gov", type: "Government", used_for: "Registration links, voting logistics", freshness: "Weekly" },
  { name: "State Election Board Feeds", type: "Government", used_for: "Local deadlines, ID requirements", freshness: "48h" },
];

const STATS = [
  { value: "12.4M", label: "Total AI Queries" },
  { value: "99.2%", label: "Flags Resolved < 48h" },
  { value: "97.1%", label: "Citation Accuracy" },
  { value: "0.8%", label: "Bias Triggers" },
  { value: "3.2s", label: "Avg Response (p95)" },
  { value: "4.7/5", label: "Neutrality Rating" },
  { value: "4,821", label: "Content Flags Submitted" },
  { value: "100%", label: "Recommendations Blocked" },
];

export default function AboutPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#FAFAFA" }}>
      <Navbar />

      {/* Hero */}
      <div style={{ borderBottom: "2px solid #0A0A0A", background: "#F5F5F5" }}>
        <div className="container" style={{ padding: "48px 24px" }}>
          <span className="rubric" style={{ display: "block", marginBottom: 12 }}>Transparency Report</span>
          <h1 className="type-display" style={{ maxWidth: 700, marginBottom: 20 }}>
            HOW<br /><span style={{ color: "#EF4444" }}>DEMOCR</span>AI WORKS
          </h1>
          <p className="type-body-lg" style={{ color: "#525252", maxWidth: 600 }}>
            Transparency is the foundation of trust in an election tool. This page explains exactly how we source data, how our AI works, and how we enforce political neutrality.
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: "64px 24px" }}>

        {/* Guiding Principles */}
        <div style={{ marginBottom: 80 }}>
          <div className="section-header">
            <span className="rubric">Principles</span>
            <div style={{ flex: 1, height: 1, background: "#E5E5E5" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 0 }}>
            {[
              { n: "01", title: "Truth over comfort", desc: "We surface contested information even when it's uncomfortable. No sanitizing." },
              { n: "02", title: "User autonomy", desc: "We inform, never persuade. We never tell you who to vote for." },
              { n: "03", title: "Radical transparency", desc: "We always show our sources and reasoning. No black boxes." },
              { n: "04", title: "Equity", desc: "We build for first-time voters and underserved communities first." },
              { n: "05", title: "Trust is the product", desc: "A single credibility failure can sink this platform. We take that seriously." },
            ].map((p, i) => (
              <div key={p.n} style={{ padding: 24, borderRight: i < 4 ? "1px solid #E5E5E5" : "none" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 32, color: "#EF4444", marginBottom: 12, lineHeight: 1 }}>{p.n}</div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 16, color: "#0A0A0A", marginBottom: 8 }}>{p.title}</h3>
                <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#525252", lineHeight: 1.6 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* AI Methodology */}
        <div style={{ marginBottom: 80 }}>
          <div className="section-header">
            <span className="rubric">AI Methodology</span>
            <div style={{ flex: 1, height: 1, background: "#E5E5E5" }} />
          </div>

          {/* Pull quote */}
          <div className="pull-quote" style={{ marginBottom: 40 }}>
            DemocrAI uses Retrieval-Augmented Generation (RAG) — our AI never generates facts from memory alone. It retrieves verified documents first, then synthesizes an answer grounded in those sources.
          </div>

          <div>
            {[
              { step: "1", title: "Query Classification", desc: "Your question is classified by intent — candidate research, ballot measure, logistics, or general." },
              { step: "2", title: "Multi-Source Retrieval", desc: "We simultaneously search our vector index (Pinecone), keyword index (Elasticsearch), structured DB, and real-time web." },
              { step: "3", title: "Relevance Re-ranking", desc: "A cross-encoder model ranks retrieved chunks by relevance to your specific question." },
              { step: "4", title: "Grounded Generation", desc: "The LLM writes a response using only retrieved context. Every claim must cite a retrieved source [N]." },
              { step: "5", title: "Safety Checks", desc: "A secondary model checks for factual consistency, political bias, and potential misinformation before delivery." },
              { step: "6", title: "Delivery", desc: "The response streams to you in real-time with inline citations and a confidence indicator." },
            ].map((item, i) => (
              <div key={item.step} style={{ display: "flex", gap: 24, padding: "20px 0", borderTop: "1px solid #E5E5E5", alignItems: "flex-start" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 32, color: "#E5E5E5", flexShrink: 0, lineHeight: 1, width: 48 }}>
                  {item.step}
                </div>
                <div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "#0A0A0A", marginBottom: 6 }}>{item.title}</h3>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "#525252", lineHeight: 1.7 }}>{item.desc}</p>
                </div>
              </div>
            ))}
            <div style={{ borderTop: "1px solid #E5E5E5" }} />
          </div>
        </div>

        {/* Data Sources Table */}
        <div style={{ marginBottom: 80 }}>
          <div className="section-header">
            <span className="rubric">Data Sources</span>
            <div style={{ flex: 1, height: 1, background: "#E5E5E5" }} />
          </div>
          <p style={{ color: "#525252", fontSize: 15, fontFamily: "var(--font-body)", marginBottom: 32 }}>
            We use only publicly available, verifiable data sources — never paid partisan content or campaign-supplied materials.
          </p>
          <div style={{ border: "2px solid #0A0A0A", overflowX: "auto" }}>
            <table className="editorial-table">
              <thead>
                <tr>
                  <th>Source</th>
                  <th>Type</th>
                  <th>Used For</th>
                  <th>Freshness</th>
                </tr>
              </thead>
              <tbody>
                {DATA_SOURCES.map((src, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600 }}>{src.name}</td>
                    <td>
                      <span className={`chip-status ${src.type === "Government" ? "chip-success" : src.type === "Nonpartisan" ? "" : ""}`}
                        style={src.type === "Nonpartisan" ? { background: "#F0F0FF", color: "#0A0A0A", borderColor: "#0A0A0A" } : src.type === "News" ? { background: "#FEFCE8", color: "#CA8A04", borderColor: "#CA8A04" } : {}}
                      >
                        {src.type}
                      </span>
                    </td>
                    <td style={{ color: "#525252" }}>{src.used_for}</td>
                    <td>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>{src.freshness}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quarterly Stats */}
        <div style={{ marginBottom: 80 }}>
          <div className="section-header">
            <span className="rubric">Q1 2026 Report</span>
            <div style={{ flex: 1, height: 1, background: "#E5E5E5" }} />
          </div>
          <div style={{ border: "2px solid #0A0A0A" }}>
            <div style={{ background: "#0A0A0A", padding: "16px 24px", borderBottom: "4px solid #EF4444" }}>
              <span style={{ color: "#FAFAFA", fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Published quarterly · Jan – Mar 2026
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0 }}>
              {STATS.map((s, i) => (
                <div key={i} style={{
                  padding: "28px 24px",
                  borderRight: i % 4 < 3 ? "1px solid #E5E5E5" : "none",
                  borderBottom: i < 4 ? "1px solid #E5E5E5" : "none",
                }}>
                  <div className="big-number" style={{ marginBottom: 6 }}>{s.value}</div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#525252", lineHeight: 1.5 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Privacy */}
        <div style={{ marginBottom: 48 }}>
          <div className="section-header">
            <span className="rubric">Privacy</span>
            <div style={{ flex: 1, height: 1, background: "#E5E5E5" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, border: "2px solid #0A0A0A" }}>
            {[
              "We never sell user data to political campaigns or advertisers",
              "Your voting preferences are never logged to analytics systems",
              "Email and address data is hashed before any analytics processing",
              "CCPA and GDPR compliant from day one",
              "On-device processing for sensitive profile data where feasible",
              "Full data deletion available anytime via account settings",
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 14, padding: "18px 20px", borderBottom: i < 4 ? "1px solid #E5E5E5" : "none", borderRight: i % 2 === 0 ? "1px solid #E5E5E5" : "none" }}>
                <span style={{ color: "#16A34A", fontWeight: 700, flexShrink: 0, fontFamily: "var(--font-body)" }}>✓</span>
                <span style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "#0A0A0A", lineHeight: 1.5 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="footnote" style={{ borderTop: "2px solid #0A0A0A", paddingTop: 16 }}>
          DemocrAI is not a political committee and does not make contributions to or expenditures in connection with any election.
          All information is provided for educational and informational purposes only.
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 48 }}>
          <Link href="/" className="btn btn-secondary">← Back to Home</Link>
          <Link href="/chat" className="btn btn-primary">Try AI Chat →</Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
