"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Citation {
  index: number;
  title: string;
  url: string;
  domain: string;
  snippet?: string;
}

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  citations?: Citation[];
  confidence?: "high" | "medium";
  ts: Date;
  flagged?: boolean;
  streaming?: boolean;
}

const SAMPLES = [
  "Who won the 2024 Lok Sabha election?",
  "What is Modi's stance on agriculture?",
  "Compare BJP and INC manifestos",
  "What happened in Delhi elections 2025?",
  "Explain Rahul Gandhi's caste census demand",
  "Which parties are in the NDA coalition?",
];

function CitationCard({ citation }: { citation: Citation }) {
  return (
    <a
      href={citation.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 14px",
        background: "#141414",
        border: "1px solid #2A2A2A",
        borderRadius: 6,
        textDecoration: "none",
        transition: "border-color 0.15s, background 0.15s",
        maxWidth: 320,
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "#525252";
        e.currentTarget.style.background = "#1A1A1A";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#2A2A2A";
        e.currentTarget.style.background = "#141414";
      }}
    >
      {/* Favicon */}
      <img
        src={`https://www.google.com/s2/favicons?domain=${citation.domain}&sz=24`}
        alt=""
        width={16}
        height={16}
        style={{ borderRadius: 2, flexShrink: 0 }}
        onError={(e) => { e.currentTarget.style.display = "none"; }}
      />
      <div style={{ overflow: "hidden" }}>
        <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#A3A3A3", fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          [{citation.index}] {citation.title}
        </div>
        <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "#525252" }}>{citation.domain}</div>
      </div>
    </a>
  );
}

function FlagModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (reason: string) => void }) {
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!reason.trim()) return;
    setSubmitting(true);
    await onSubmit(reason);
    setSubmitting(false);
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex",
        alignItems: "center", justifyContent: "center", zIndex: 1000, backdropFilter: "blur(4px)",
      }}
      onClick={onClose}
    >
      <div
        style={{ background: "#141414", border: "1px solid #2A2A2A", padding: 32, maxWidth: 480, width: "90%", borderRadius: 8 }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "#FAFAFA", marginBottom: 8 }}>🚩 Flag This Answer</h3>
        <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "#737373", marginBottom: 20, lineHeight: 1.6 }}>
          Help us improve. Flagged answers are reviewed by a human moderator within 48 hours.
        </p>
        <textarea
          placeholder="Describe the issue (e.g. inaccurate, biased, outdated)..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={4}
          style={{
            width: "100%", boxSizing: "border-box", background: "#0A0A0A", border: "1px solid #2A2A2A",
            color: "#FAFAFA", fontFamily: "var(--font-body)", fontSize: 14, padding: 14, resize: "vertical",
            borderRadius: 4, outline: "none", marginBottom: 16,
          }}
        />
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "12px", background: "none", border: "1px solid #2A2A2A", color: "#737373", fontFamily: "var(--font-body)", fontSize: 14, cursor: "pointer", borderRadius: 4 }}>
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!reason.trim() || submitting}
            style={{ flex: 2, padding: "12px", background: reason.trim() ? "#EF4444" : "#2A2A2A", border: "none", color: "#FAFAFA", fontFamily: "var(--font-display)", fontSize: 14, cursor: reason.trim() ? "pointer" : "not-allowed", borderRadius: 4, letterSpacing: "0.05em" }}
          >
            {submitting ? "Submitting…" : "Submit Report"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "ai",
      content:
        "I am DemocrAI — your nonpartisan election co-pilot, powered by Gemini with live Google Search grounding.\n\nEvery answer cites real sources. I never recommend candidates.\n\nWhat would you like to know?",
      confidence: "high",
      ts: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [flagTarget, setFlagTarget] = useState<string | null>(null);
  const [flagSuccess, setFlagSuccess] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const sessionId = useRef(`session-${Date.now()}`);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = useCallback(
    async (text: string) => {
      if (!text.trim() || loading) return;

      const userMsg: Message = {
        id: `u-${Date.now()}`,
        role: "user",
        content: text,
        ts: new Date(),
      };

      setMessages((m) => [...m, userMsg]);
      setInput("");
      setLoading(true);

      // Build history for the API
      const history = [...messages, userMsg]
        .filter((m) => m.id !== "welcome")
        .map((m) => ({
          role: m.role === "ai" ? "model" : "user",
          parts: [{ text: m.content }],
        }));

      const aiMsgId = `ai-${Date.now()}`;
      // Add streaming placeholder
      setMessages((m) => [
        ...m,
        { id: aiMsgId, role: "ai", content: "", ts: new Date(), streaming: true },
      ]);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: history, question: text }),
        });

        if (!res.ok) {
          throw new Error(`API error: ${res.status}`);
        }

        const reader = res.body!.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let fullText = "";
        let citations: Citation[] = [];

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            try {
              const payload = JSON.parse(line.slice(6));
              if (payload.type === "delta") {
                fullText += payload.text;
                setMessages((m) =>
                  m.map((msg) =>
                    msg.id === aiMsgId
                      ? { ...msg, content: fullText, streaming: true }
                      : msg
                  )
                );
              } else if (payload.type === "citations") {
                citations = payload.citations;
                setMessages((m) =>
                  m.map((msg) =>
                    msg.id === aiMsgId
                      ? { ...msg, citations, streaming: true }
                      : msg
                  )
                );
              } else if (payload.type === "done") {
                setMessages((m) =>
                  m.map((msg) =>
                    msg.id === aiMsgId
                      ? { ...msg, streaming: false, confidence: "high" }
                      : msg
                  )
                );
              } else if (payload.type === "error") {
                throw new Error(payload.message);
              }
            } catch {
              // skip malformed event
            }
          }
        }

        // Finalize
        setMessages((m) =>
          m.map((msg) =>
            msg.id === aiMsgId
              ? { ...msg, content: fullText || "No response received.", streaming: false, citations, confidence: "high" }
              : msg
          )
        );
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : "Something went wrong";
        setMessages((m) =>
          m.map((msg) =>
            msg.id === aiMsgId
              ? {
                  ...msg,
                  content: `⚠️ ${errMsg}\n\nPlease ensure GEMINI_API_KEY is configured in your .env.local file.`,
                  streaming: false,
                }
              : msg
          )
        );
      } finally {
        setLoading(false);
      }
    },
    [loading, messages]
  );

  const handleFlag = async (reason: string) => {
    if (!flagTarget) return;
    const msg = messages.find((m) => m.id === flagTarget);
    try {
      const res = await fetch("/api/flag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messageContent: msg?.content || "",
          messageIndex: messages.findIndex((m) => m.id === flagTarget),
          sessionId: sessionId.current,
          reason,
        }),
      });
      const data = await res.json();
      setMessages((m) =>
        m.map((msg) => (msg.id === flagTarget ? { ...msg, flagged: true } : msg))
      );
      setFlagSuccess(data.flagId);
    } catch {
      setFlagSuccess("error");
    }
    setFlagTarget(null);
    setTimeout(() => setFlagSuccess(null), 4000);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0A", display: "flex", flexDirection: "column" }}>
      <Navbar />

      {/* Header */}
      <div style={{ borderBottom: "1px solid #1A1A1A", background: "#0D0D0D" }}>
        <div className="container" style={{ padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <span style={{ display: "block", fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#525252", marginBottom: 6 }}>
              AI Co-Pilot
            </span>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: 24, color: "#FAFAFA", lineHeight: 1.1, marginBottom: 8 }}>
              Election Research Assistant
            </h1>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <span style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", color: "#22C55E", padding: "4px 10px", borderRadius: 999, fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700 }}>
                ⚖ Nonpartisan
              </span>
              <span style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.3)", color: "#60A5FA", padding: "4px 10px", borderRadius: 999, fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700 }}>
                🔍 Google Search Grounded
              </span>
              <span style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.3)", color: "#A78BFA", padding: "4px 10px", borderRadius: 999, fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700 }}>
                ⚡ Gemini 1.5 Pro
              </span>
            </div>
          </div>
          <div style={{ background: "#141414", border: "1px solid #2A2A2A", padding: "12px 18px", borderRadius: 6, maxWidth: 300 }}>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#737373", lineHeight: 1.6 }}>
              <strong style={{ color: "#A3A3A3" }}>Transparency:</strong> All responses cite live web sources via Google Search. DemocrAI never recommends candidates or votes.
            </p>
          </div>
        </div>
      </div>

      <div className="container" style={{ flex: 1, padding: "0 24px", display: "grid", gridTemplateColumns: "200px 1fr", gap: 0 }}>
        {/* Sidebar */}
        <div style={{ borderRight: "1px solid #1A1A1A", padding: "28px 20px 28px 0" }}>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#525252", marginBottom: 10 }}>
            Try asking
          </div>
          {SAMPLES.map((q, i) => (
            <button
              key={i}
              onClick={() => send(q)}
              disabled={loading}
              style={{
                display: "block", width: "100%", textAlign: "left", padding: "9px 12px",
                marginBottom: 5, border: "1px solid #1A1A1A", background: "none", cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "var(--font-body)", fontSize: 12, color: "#525252", lineHeight: 1.4, transition: "all 0.15s", borderRadius: 4,
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.background = "#141414";
                  e.currentTarget.style.color = "#A3A3A3";
                  e.currentTarget.style.borderColor = "#2A2A2A";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "none";
                e.currentTarget.style.color = "#525252";
                e.currentTarget.style.borderColor = "#1A1A1A";
              }}
            >
              {q}
            </button>
          ))}
        </div>

        {/* Chat area */}
        <div style={{ display: "flex", flexDirection: "column", paddingLeft: 40, paddingTop: 28, paddingBottom: 28 }}>
          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 24, minHeight: 400, maxHeight: "calc(100vh - 360px)", paddingBottom: 16 }}>
            {messages.map((msg) => (
              <div key={msg.id} style={{ display: "flex", gap: 14, flexDirection: msg.role === "user" ? "row-reverse" : "row", alignItems: "flex-start" }}>
                {/* Avatar */}
                <div style={{
                  width: 34, height: 34, background: msg.role === "ai" ? "linear-gradient(135deg, #EF4444, #F97316)" : "#1A1A1A",
                  border: "1px solid " + (msg.role === "ai" ? "transparent" : "#2A2A2A"),
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "var(--font-display)", fontSize: 10, color: "#FAFAFA", flexShrink: 0, borderRadius: 4,
                }}>
                  {msg.role === "ai" ? "AI" : "YOU"}
                </div>

                <div style={{ maxWidth: "82%", flex: 1 }}>
                  {msg.role === "ai" && (
                    <div style={{ display: "flex", gap: 10, marginBottom: 6, alignItems: "center" }}>
                      <span style={{ fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 700, color: "#A3A3A3" }}>DemocrAI</span>
                      {msg.confidence === "high" && !msg.streaming && (
                        <span style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", color: "#22C55E", padding: "2px 8px", borderRadius: 999, fontSize: 10, fontFamily: "var(--font-body)", fontWeight: 700 }}>
                          ✓ Grounded
                        </span>
                      )}
                      {msg.streaming && (
                        <span style={{ color: "#F97316", fontSize: 10, fontFamily: "var(--font-body)", fontWeight: 700 }}>● Streaming…</span>
                      )}
                    </div>
                  )}

                  <div style={{
                    background: msg.role === "user" ? "#1A1A1A" : "#141414",
                    border: `1px solid ${msg.role === "user" ? "#2A2A2A" : "#1E1E1E"}`,
                    padding: "14px 18px", borderRadius: 8,
                    fontFamily: "var(--font-body)", fontSize: 14, color: "#D4D4D4", lineHeight: 1.7,
                    whiteSpace: "pre-wrap", wordBreak: "break-word",
                  }}>
                    {msg.content}
                    {msg.streaming && (
                      <span style={{ display: "inline-block", width: 2, height: 14, background: "#EF4444", marginLeft: 2, animation: "blink 1s step-start infinite", verticalAlign: "middle" }} />
                    )}
                  </div>

                  {/* Citation Cards */}
                  {msg.citations && msg.citations.length > 0 && !msg.streaming && (
                    <div style={{ marginTop: 10 }}>
                      <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "#525252", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>
                        Sources
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {msg.citations.slice(0, 6).map((c) => (
                          <CitationCard key={c.index} citation={c} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Footer row */}
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8 }}>
                    <span style={{ color: "#525252", fontSize: 11, fontFamily: "var(--font-body)" }}>
                      {msg.ts.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                    {msg.role === "ai" && !msg.streaming && (
                      msg.flagged ? (
                        <span style={{ fontSize: 11, fontFamily: "var(--font-body)", color: "#737373" }}>🚩 Reported</span>
                      ) : (
                        <button
                          onClick={() => setFlagTarget(msg.id)}
                          style={{
                            background: "none", border: "none", color: "#525252", fontSize: 11,
                            fontFamily: "var(--font-body)", cursor: "pointer", padding: 0,
                            transition: "color 0.15s",
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = "#EF4444"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = "#525252"; }}
                        >
                          🚩 Flag this answer
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            ))}

            {loading && messages[messages.length - 1]?.role !== "ai" && (
              <div style={{ display: "flex", gap: 14 }}>
                <div style={{ width: 34, height: 34, background: "linear-gradient(135deg, #EF4444, #F97316)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontSize: 10, color: "#FAFAFA", borderRadius: 4 }}>AI</div>
                <div style={{ background: "#141414", border: "1px solid #1E1E1E", padding: "14px 18px", borderRadius: 8, width: 160, height: 48 }}>
                  <div style={{ display: "flex", gap: 6, alignItems: "center", height: "100%" }}>
                    {[0, 0.2, 0.4].map((d) => (
                      <div key={d} style={{ width: 8, height: 8, background: "#EF4444", borderRadius: "50%", animation: `bounce 1.2s ease-in-out ${d}s infinite` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Input */}
          <div style={{ borderTop: "1px solid #1A1A1A", paddingTop: 18 }}>
            {flagSuccess && flagSuccess !== "error" && (
              <div style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", color: "#22C55E", padding: "10px 16px", borderRadius: 6, fontFamily: "var(--font-body)", fontSize: 13, marginBottom: 12 }}>
                ✓ Report submitted (ID: {flagSuccess.slice(0, 12)}). Thank you — a moderator will review this within 48h.
              </div>
            )}
            <div style={{ display: "flex", gap: 0 }}>
              <input
                type="text"
                placeholder="Ask about candidates, ballot measures, voting logistics..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send(input)}
                style={{
                  flex: 1, height: 50, padding: "0 16px", background: "#141414", border: "1px solid #2A2A2A",
                  borderRight: "none", color: "#FAFAFA", fontFamily: "var(--font-body)", fontSize: 14, outline: "none",
                  borderRadius: "4px 0 0 4px",
                }}
              />
              <button
                onClick={() => send(input)}
                disabled={loading || !input.trim()}
                style={{
                  height: 50, padding: "0 24px", background: loading || !input.trim() ? "#1A1A1A" : "linear-gradient(135deg, #EF4444, #F97316)",
                  border: "1px solid " + (loading || !input.trim() ? "#2A2A2A" : "transparent"),
                  color: "#FAFAFA", fontFamily: "var(--font-display)", fontSize: 14, cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                  flexShrink: 0, letterSpacing: "0.05em", borderRadius: "0 4px 4px 0", transition: "all 0.2s",
                }}
              >
                Send →
              </button>
            </div>
            <p style={{ color: "#525252", fontSize: 12, fontFamily: "var(--font-body)", marginTop: 8, fontStyle: "italic" }}>
              Powered by Gemini 1.5 Pro · Google Search grounded · DemocrAI never recommends candidates
            </p>
          </div>
        </div>
      </div>

      <Footer />

      {/* Flag Modal */}
      {flagTarget && (
        <FlagModal
          onClose={() => setFlagTarget(null)}
          onSubmit={handleFlag}
        />
      )}

      <style>{`
        @keyframes blink { 0%, 100% { opacity: 1 } 50% { opacity: 0 } }
        @keyframes bounce { 0%, 60%, 100% { transform: translateY(0) } 30% { transform: translateY(-6px) } }
      `}</style>
    </div>
  );
}
