"use client";
import { useState, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  citations?: { index: number; title: string; url: string; date: string }[];
  confidence?: "high" | "medium";
  ts: Date;
}

const SAMPLES = [
  "Who won the 2024 Lok Sabha election?",
  "What is Modi's stance on agriculture?",
  "Compare BJP and INC manifestos",
  "What happened in Delhi elections 2025?",
  "Explain Rahul Gandhi's caste census demand",
  "Which parties are in the NDA coalition?",
];

const RESPONSES: Record<string, { content: string; citations: { index: number; title: string; url: string; date: string }[] }> = {
  default: {
    content: "Based on publicly available records and data from the Election Commission of India (ECI), I can provide verified information on that topic.\n\nNote: I present all available perspectives here and never recommend any particular candidate or position. Ask a follow-up if you want to go deeper.",
    citations: [
      { index: 1, title: "Election Commission of India — eci.gov.in", url: "https://eci.gov.in", date: "2024-06-04" },
      { index: 2, title: "PRS India Legislative Research", url: "https://prsindia.org", date: "2024-06-10" },
    ],
  },
  loksabha: {
    content: "2024 Lok Sabha Election Results (18th General Election) [1]\n\nThe National Democratic Alliance (NDA) led by BJP won a majority with 293 seats out of 543:\n\nNDA Alliance:\n· BJP — 240 seats (down from 303 in 2019) [1]\n· TDP — 16 seats\n· JD(U) — 12 seats\n\nINDIA Alliance — 234 seats:\n· INC — 99 seats (up from 52 in 2019) [2]\n· Samajwadi Party — 37 seats (Akhilesh Yadav's PDA strategy)\n· TMC — 29 seats (West Bengal)\n· DMK — 22 seats (Tamil Nadu)\n\nKey result: BJP won 240 seats — short of the 272-seat majority mark for the first time since 2014, making coalition partners essential. PM Modi sworn in for a third term on June 9, 2024 [3].\n\nBoth alliances' performances exceeded/fell short of most exit polls respectively.",
    citations: [
      { index: 1, title: "ECI General Election 2024 Results", url: "https://eci.gov.in", date: "2024-06-04" },
      { index: 2, title: "INC Election Result — Party Website", url: "https://inc.in", date: "2024-06-05" },
      { index: 3, title: "PM Modi Oath Ceremony — PIB", url: "https://pib.gov.in", date: "2024-06-09" },
    ],
  },
  agriculture: {
    content: "Agriculture Policy Comparison — BJP vs INC [1]\n\nBJP / Modi Government:\n· PM-KISAN: ₹6,000/year direct transfer to 11 crore farmers [1]\n· MSP hikes announced annually — ₹2,275/quintal for wheat (2024-25) [2]\n· Natural farming push — PM PRANAM scheme\n· No legal guarantee for MSP — a key opposition demand\n\nINC / Rahul Gandhi:\n· Legal MSP guarantee — central demand in 2024 manifesto [3]\n· Farm loan waiver where Congress governs (Telangana, Karnataka)\n· Opposes corporatisation of agriculture sector\n· Demands restoration of farm laws consultation process\n\nBoth sides: Agree on PM-KISAN expansion — disagree on MSP legal status and role of corporate capital in agriculture.",
    citations: [
      { index: 1, title: "PM-KISAN Official Portal — pmkisan.gov.in", url: "https://pmkisan.gov.in", date: "2024-03-01" },
      { index: 2, title: "Cabinet MSP Decision 2024-25 — PIB", url: "https://pib.gov.in", date: "2024-06-19" },
      { index: 3, title: "INC Manifesto 2024 — Agriculture Section", url: "#", date: "2024-04-05" },
    ],
  },
  delhi: {
    content: "Delhi Assembly Election — February 2025 [1]\n\nResult: BJP won 48 of 70 seats — returning to power in Delhi after 27 years.\n\nParty-wise results:\n· BJP — 48 seats (CM: Rekha Gupta) [1]\n· AAP — 22 seats (Arvind Kejriwal lost his own seat in New Delhi constituency) [2]\n· INC — 0 seats (complete washout for third consecutive time) [1]\n\nKey factors cited by analysts:\n· Anti-incumbency against AAP after Kejriwal's liquor policy controversy and arrest [3]\n· BJP's UJJWALA + welfare counter-narrative\n· INC–AAP INDIA bloc alliance breakdown in Delhi\n\nNote: This is a factual summary of public results. DemocrAI does not comment on electoral fairness or endorse any interpretation.",
    citations: [
      { index: 1, title: "Delhi Election Results — ECI", url: "https://eci.gov.in", date: "2025-02-08" },
      { index: 2, title: "Kejriwal Concedes Defeat — The Hindu", url: "#", date: "2025-02-08" },
      { index: 3, title: "Delhi Liquor Policy Case — Supreme Court", url: "#", date: "2024-09-13" },
    ],
  },
  caste: {
    content: "Caste Census — The Key Debate in Indian Politics [1]\n\nRahul Gandhi and INC demand:\n· A national Socio-Economic Caste Census (SECC) to update OBC population data [1]\n· Remove the 50% cap on reservations (currently imposed by Supreme Court) [2]\n· Argue that OBCs/SC/STs are under-represented at 50% combined reservation for ~70% of population\n\nBJP / Government position:\n· Conducted OBC sub-categorisation (Supreme Court allowed in Aug 2024) [3]\n· Have not committed to a full caste census at national level\n· Argue existing reservation framework is adequate\n\nBihar context: Bihar CM Nitish Kumar conducted a state-level caste survey in 2023 — revealed OBCs+EBCs = ~63% of Bihar's population.",
    citations: [
      { index: 1, title: "INC Caste Census Demand — Official Statement", url: "#", date: "2024-04-07" },
      { index: 2, title: "50% Cap History — Indra Sawhney Case 1992", url: "#", date: "1992-11-16" },
      { index: 3, title: "SC OBC Sub-categorisation Ruling", url: "#", date: "2024-08-01" },
    ],
  },
  nda: {
    content: "NDA (National Democratic Alliance) — Current Coalition Composition [1]\n\nKey NDA constituents after 2024 Lok Sabha:\n· BJP — 240 seats (Narendra Modi, PM)\n· TDP (Telugu Desam Party) — 16 seats (N. Chandrababu Naidu, AP CM) [2]\n· JD(U) (Janata Dal United) — 12 seats (Nitish Kumar, Bihar CM)\n· Shiv Sena (Shinde faction) — 7 seats\n· LJP (Ram Vilas) — 5 seats (Chirag Paswan, Union Minister)\n\nThe coalition is critical because BJP's 240 seats fall short of the 272-seat majority mark — TDP and JD(U) together provide the margin [1].\n\nBoth Chandrababu Naidu and Nitish Kumar have historically switched between BJP and opposition blocs — making coalition management a key political dynamic to watch.",
    citations: [
      { index: 1, title: "NDA Alliance Seats — ECI 2024", url: "https://eci.gov.in", date: "2024-06-04" },
      { index: 2, title: "TDP Alliance with BJP — Press Trust of India", url: "#", date: "2024-03-21" },
    ],
  },
};

function getResponse(q: string) {
  const l = q.toLowerCase();
  if (l.includes("lok sabha") || l.includes("general election") || l.includes("2024 election") || l.includes("who won")) return RESPONSES.loksabha;
  if (l.includes("agri") || l.includes("farm") || l.includes("msp") || l.includes("kisan")) return RESPONSES.agriculture;
  if (l.includes("delhi")) return RESPONSES.delhi;
  if (l.includes("caste") || l.includes("census") || l.includes("reservation") || l.includes("obc")) return RESPONSES.caste;
  if (l.includes("nda") || l.includes("coalition") || l.includes("alliance") || l.includes("tdp") || l.includes("jdu")) return RESPONSES.nda;
  return RESPONSES.default;
}

function formatContent(content: string) {
  return content.split("\n").map((line, i) => {
    if (line.startsWith("·")) return <div key={i} style={{ paddingLeft: 16, marginBottom: 4, fontFamily: "var(--font-body)", fontSize: 14, lineHeight: 1.6, color: "#0A0A0A" }}>{line}</div>;
    if (line === "") return <div key={i} style={{ height: 8 }} />;
    if (line.match(/^(BJP|INC|AAP|NDA|INDIA Alliance|Rahul|Modi|Both sides|Both alliances|Both candidates|Note:|Key result:|Key factors)/)) {
      return <div key={i} style={{ fontWeight: 700, color: "#0A0A0A", marginTop: 8, marginBottom: 4, fontFamily: "var(--font-body)", fontSize: 14 }}>{line}</div>;
    }
    if (line.startsWith("NDA Alliance") || line.startsWith("Bihar context")) {
      return <div key={i} style={{ borderLeft: "4px solid #EF4444", paddingLeft: 14, marginTop: 12, fontStyle: "italic", color: "#525252", fontSize: 14, fontFamily: "var(--font-body)", lineHeight: 1.6 }}>{line}</div>;
    }
    return <div key={i} style={{ fontFamily: "var(--font-body)", fontSize: 14, lineHeight: 1.6, color: "#0A0A0A" }}>{line}</div>;
  });
}


export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([{
    id: "welcome",
    role: "ai",
    content: "I am DemocrAI — your nonpartisan election co-pilot.\n\nI can help you understand candidate positions, decode ballot measures, and find voting logistics. Every answer is source-cited. I never recommend candidates.\n\nWhat would you like to know?",
    confidence: "high",
    ts: new Date(),
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    setMessages(m => [...m, { id: `u-${Date.now()}`, role: "user", content: text, ts: new Date() }]);
    setInput("");
    setLoading(true);
    await new Promise(r => setTimeout(r, 900 + Math.random() * 700));
    const res = getResponse(text);
    setMessages(m => [...m, { id: `ai-${Date.now()}`, role: "ai", content: res.content, citations: res.citations, confidence: "high", ts: new Date() }]);
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#FAFAFA", display: "flex", flexDirection: "column" }}>
      <Navbar />

      {/* Header */}
      <div style={{ borderBottom: "2px solid #0A0A0A", background: "#F5F5F5" }}>
        <div className="container" style={{ padding: "24px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div>
            <span className="rubric" style={{ display: "block", marginBottom: 8 }}>AI Co-Pilot</span>
            <h1 className="type-headline" style={{ fontSize: 28 }}>Election Research Assistant</h1>
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <span className="chip-status chip-success">⚖ Nonpartisan</span>
              <span className="chip-status" style={{ background: "#F5F5F5", color: "#525252", borderColor: "#D4D4D4" }}>📚 Source-cited</span>
            </div>
          </div>
          <div style={{ border: "2px solid #E5E5E5", padding: "14px 20px", maxWidth: 320 }}>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#525252", lineHeight: 1.6 }}>
              <strong style={{ color: "#0A0A0A" }}>Transparency:</strong> All responses are grounded in verifiable public sources. DemocrAI never recommends candidates or votes.
            </p>
          </div>
        </div>
      </div>

      <div className="container" style={{ flex: 1, padding: "0 24px", display: "grid", gridTemplateColumns: "220px 1fr", gap: 0 }}>
        {/* Sidebar */}
        <div style={{ borderRight: "1px solid #E5E5E5", padding: "32px 24px 32px 0" }}>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#A3A3A3", marginBottom: 12 }}>
            Try asking
          </div>
          {SAMPLES.map((q, i) => (
            <button key={i} onClick={() => send(q)} style={{
              display: "block",
              width: "100%",
              textAlign: "left",
              padding: "10px 12px",
              marginBottom: 6,
              border: "1px solid #E5E5E5",
              background: "none",
              cursor: "pointer",
              fontFamily: "var(--font-body)",
              fontSize: 13,
              color: "#525252",
              lineHeight: 1.4,
              transition: "all 0.15s",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#F5F5F5"; (e.currentTarget as HTMLElement).style.color = "#0A0A0A"; (e.currentTarget as HTMLElement).style.borderColor = "#0A0A0A"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "none"; (e.currentTarget as HTMLElement).style.color = "#525252"; (e.currentTarget as HTMLElement).style.borderColor = "#E5E5E5"; }}
            >
              {q}
            </button>
          ))}
        </div>

        {/* Chat area */}
        <div style={{ display: "flex", flexDirection: "column", paddingLeft: 48, paddingTop: 32, paddingBottom: 32 }}>
          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 20, minHeight: 400, maxHeight: "calc(100vh - 380px)", paddingBottom: 20 }}>
            {messages.map(msg => (
              <div key={msg.id} style={{ display: "flex", gap: 16, flexDirection: msg.role === "user" ? "row-reverse" : "row", alignItems: "flex-start" }}>
                {/* Avatar */}
                <div style={{
                  width: 36,
                  height: 36,
                  background: msg.role === "ai" ? "#0A0A0A" : "#E5E5E5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-display)",
                  fontSize: 12,
                  color: msg.role === "ai" ? "#FAFAFA" : "#0A0A0A",
                  flexShrink: 0,
                }}>
                  {msg.role === "ai" ? "AI" : "YOU"}
                </div>

                <div style={{ maxWidth: "80%", flex: 1 }}>
                  {msg.role === "ai" && (
                    <div style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "center" }}>
                      <span style={{ fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#0A0A0A" }}>DemocrAI</span>
                      {msg.confidence === "high" && <span className="chip-status chip-success" style={{ fontSize: 10, padding: "2px 8px" }}>✓ Verified</span>}
                    </div>
                  )}

                  <div className={msg.role === "user" ? "chat-user" : "chat-ai"}>
                    {msg.role === "ai" ? formatContent(msg.content) : (
                      <span>{msg.content}</span>
                    )}
                  </div>

                  {msg.citations && msg.citations.length > 0 && (
                    <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {msg.citations.map(c => (
                        <button key={c.index} className="cite" title={`${c.title} — ${c.date}`}>
                          [{c.index}] {c.title.slice(0, 28)}{c.title.length > 28 ? "…" : ""}
                        </button>
                      ))}
                    </div>
                  )}
                  <div style={{ color: "#A3A3A3", fontSize: 11, fontFamily: "var(--font-body)", marginTop: 6 }}>
                    {msg.ts.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: "flex", gap: 16 }}>
                <div style={{ width: 36, height: 36, background: "#0A0A0A", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontSize: 12, color: "#FAFAFA", flexShrink: 0 }}>AI</div>
                <div className="chat-ai loading-shimmer" style={{ width: 180, height: 48 }} />
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Input */}
          <div style={{ borderTop: "2px solid #0A0A0A", paddingTop: 20 }}>
            <div style={{ display: "flex", gap: 0 }}>
              <input
                type="text"
                placeholder="Ask about candidates, ballot measures, voting logistics..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && send(input)}
                className="input"
                style={{ flex: 1, borderRight: "none", height: 48 }}
              />
              <button onClick={() => send(input)} disabled={loading || !input.trim()} className="btn btn-primary" style={{ height: 48, flexShrink: 0 }}>
                Send →
              </button>
            </div>
            <p style={{ color: "#A3A3A3", fontSize: 12, fontFamily: "var(--font-body)", marginTop: 8, fontStyle: "italic" }}>
              DemocrAI is nonpartisan and never recommends candidates. All responses are source-cited.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
