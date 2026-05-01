"use client";
import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  LOK_SABHA_2024,
  LOK_SABHA_PARTIES_2024,
  STATE_ELECTIONS,
  UPCOMING_ELECTIONS,
  VOTER_STATS_INDIA,
  HISTORIC_LOK_SABHA,
} from "@/data/india-elections";

type TabId = "lok-sabha" | "states" | "upcoming" | "history";

const TABS: { id: TabId; label: string }[] = [
  { id: "lok-sabha", label: "🏛 Lok Sabha 2024" },
  { id: "states", label: "🗺 State Elections" },
  { id: "upcoming", label: "📅 Upcoming" },
  { id: "history", label: "📊 History" },
];

function SeatBar({ seats, total, color }: { seats: number; total: number; color: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ flex: 1, height: 8, background: "#E5E5E5" }}>
        <div style={{ height: "100%", width: `${(seats / total) * 100}%`, background: color, transition: "width 0.8s ease" }} />
      </div>
      <span style={{ fontFamily: "var(--font-display)", fontSize: 16, color: "#0A0A0A", minWidth: 36 }}>{seats}</span>
    </div>
  );
}

export default function IndiaElectionsPage() {
  const [tab, setTab] = useState<TabId>("lok-sabha");
  const [selectedState, setSelectedState] = useState<string | null>(null);

  const stateDetail = STATE_ELECTIONS.find(s => s.state === selectedState);

  return (
    <div style={{ minHeight: "100vh", background: "#FAFAFA" }}>
      <Navbar />

      {/* Page header */}
      <div style={{ borderBottom: "2px solid #0A0A0A", background: "#F5F5F5" }}>
        <div className="container" style={{ padding: "40px 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 20 }}>
            <div>
              <span className="rubric" style={{ display: "block", marginBottom: 8 }}>🇮🇳 भारत / India</span>
              <h1 className="type-display" style={{ fontSize: "clamp(32px, 5vw, 56px)", marginBottom: 12 }}>
                INDIA<br /><span style={{ color: "#EF4444" }}>ELECTIONS</span>
              </h1>
              <p className="type-body-lg" style={{ color: "#525252", maxWidth: 560 }}>
                Complete election data — Lok Sabha 2024, recent state elections, and upcoming contests. All data from the Election Commission of India (ECI).
              </p>
            </div>
            {/* Voter stats strip */}
            <div style={{ border: "2px solid #0A0A0A", padding: "20px 24px", minWidth: 260 }}>
              <div className="type-overline" style={{ marginBottom: 12 }}>2024 Lok Sabha — At a Glance</div>
              {[
                ["Registered Voters", VOTER_STATS_INDIA.total_voters_2024],
                ["Votes Polled", VOTER_STATS_INDIA.votes_polled],
                ["Turnout", VOTER_STATS_INDIA.voter_turnout_2024 || "65.79%"],
                ["Polling Stations", VOTER_STATS_INDIA.polling_stations],
                ["Phases", String(VOTER_STATS_INDIA.election_phases)],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #E5E5E5", padding: "8px 0", gap: 16 }}>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#525252" }}>{k}</span>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 14, color: "#0A0A0A" }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: "40px 24px" }}>
        {/* Tabs */}
        <div style={{ display: "flex", gap: 0, borderBottom: "2px solid #0A0A0A", marginBottom: 40 }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: "12px 20px",
              border: "none",
              borderBottom: tab === t.id ? "3px solid #EF4444" : "3px solid transparent",
              marginBottom: -2,
              background: "none",
              cursor: "pointer",
              fontFamily: "var(--font-body)",
              fontSize: 12,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: tab === t.id ? "#0A0A0A" : "#A3A3A3",
              whiteSpace: "nowrap",
            }}>{t.label}</button>
          ))}
          <div style={{ flex: 1 }} />
          <Link href="/india/compare" className="btn btn-secondary btn-sm" style={{ alignSelf: "center", marginBottom: 2 }}>
            Compare Leaders →
          </Link>
        </div>

        {/* ── LOK SABHA 2024 ── */}
        {tab === "lok-sabha" && (
          <div>
            <div className="section-header" style={{ marginBottom: 32 }}>
              <h2 className="type-subhead">{LOK_SABHA_2024.title}</h2>
              <span className="chip-status chip-success" style={{ marginLeft: 12 }}>Completed</span>
              <div style={{ flex: 1 }} />
              <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#525252" }}>
                Result: {LOK_SABHA_2024.result_date} · {LOK_SABHA_2024.phases} Phases
              </span>
            </div>

            {/* Alliance summary */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2, marginBottom: 40 }}>
              {LOK_SABHA_2024.alliances.map((a) => (
                <div key={a.name} style={{
                  border: a.name === "NDA" ? "2px solid #0A0A0A" : "2px solid #E5E5E5",
                  borderTop: `4px solid ${a.color}`,
                  padding: 28,
                }}>
                  <div className="type-overline" style={{ marginBottom: 8 }}>{a.name}</div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 56, color: "#0A0A0A", lineHeight: 1, marginBottom: 8 }}>{a.seats}</div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#525252", marginBottom: 16 }}>of {LOK_SABHA_2024.total_seats} seats</div>
                  <div className="score-bar" style={{ marginBottom: 12 }}>
                    <div style={{ height: "100%", width: `${(a.seats / LOK_SABHA_2024.total_seats) * 100}%`, background: a.color }} />
                  </div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#A3A3A3" }}>
                    {a.parties.slice(0, 3).join(" · ")}
                    {a.parties.length > 3 && ` + ${a.parties.length - 3} more`}
                  </div>
                  {a.name === "NDA" && (
                    <div style={{ marginTop: 12 }}>
                      <span style={{ background: "#0A0A0A", color: "#FAFAFA", fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 700, padding: "3px 10px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        ✓ Majority — Govt formed
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Majority mark line callout */}
            <div style={{ borderLeft: "4px solid #EF4444", padding: "12px 20px", background: "#F5F5F5", marginBottom: 40, fontFamily: "var(--font-body)", fontSize: 14, color: "#0A0A0A" }}>
              <strong>Majority mark: 272 seats.</strong> BJP alone won 240 — short of majority for first time since 2014, making coalition partners TDP and JD(U) critical. PM Narendra Modi sworn in for a third term on June 9, 2024.
            </div>

            {/* Party-wise results table */}
            <div className="section-header">
              <h3 className="type-subhead" style={{ fontSize: 20 }}>Party-wise Seats Won</h3>
              <div style={{ flex: 1 }} />
              <span style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#A3A3A3" }}>Source: ECI · ec.nic.in</span>
            </div>
            <div style={{ border: "2px solid #0A0A0A", overflowX: "auto", marginBottom: 48 }}>
              <table className="editorial-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Party</th>
                    <th>Alliance</th>
                    <th>Seats Won</th>
                    <th>Contested</th>
                    <th>Leader</th>
                    <th>Ideology</th>
                  </tr>
                </thead>
                <tbody>
                  {LOK_SABHA_PARTIES_2024.map((p, i) => (
                    <tr key={p.party}>
                      <td style={{ color: "#A3A3A3", fontFamily: "var(--font-mono)", fontSize: 12 }}>{i + 1}</td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 10, height: 10, background: p.color, flexShrink: 0 }} />
                          <div>
                            <div style={{ fontWeight: 700, fontSize: 14 }}>{p.party}</div>
                            <div style={{ color: "#A3A3A3", fontSize: 11 }}>{p.full_name}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span style={{
                          fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700,
                          padding: "2px 8px", textTransform: "uppercase", letterSpacing: "0.06em",
                          background: p.alliance === "NDA" ? "#FFF3E0" : p.alliance === "INDIA" ? "#E8F5E9" : "#F5F5F5",
                          color: p.alliance === "NDA" ? "#E65100" : p.alliance === "INDIA" ? "#2E7D32" : "#525252",
                          border: `1px solid ${p.alliance === "NDA" ? "#FFB74D" : p.alliance === "INDIA" ? "#66BB6A" : "#D4D4D4"}`,
                        }}>{p.alliance}</span>
                      </td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 80, height: 4, background: "#E5E5E5" }}>
                            <div style={{ height: "100%", width: `${(p.seats / 240) * 100}%`, background: p.color }} />
                          </div>
                          <span style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "#0A0A0A" }}>{p.seats}</span>
                        </div>
                      </td>
                      <td style={{ color: "#525252", fontFamily: "var(--font-mono)", fontSize: 13 }}>{p.contested}</td>
                      <td style={{ color: "#0A0A0A", fontSize: 13 }}>{p.leader}</td>
                      <td style={{ color: "#525252", fontSize: 12, maxWidth: 200 }}>{p.ideology}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── STATE ELECTIONS ── */}
        {tab === "states" && (
          <div>
            {selectedState && stateDetail ? (
              <div>
                <button onClick={() => setSelectedState(null)} className="btn btn-ghost btn-sm" style={{ marginBottom: 24, paddingLeft: 0 }}>
                  ← All States
                </button>
                <div style={{ border: "2px solid #0A0A0A", borderTop: "4px solid #EF4444" }}>
                  <div style={{ background: "#F5F5F5", borderBottom: "2px solid #0A0A0A", padding: "24px 28px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
                      <div>
                        <span className="rubric" style={{ display: "block", marginBottom: 6 }}>{stateDetail.date}</span>
                        <h2 className="type-headline" style={{ fontSize: 28 }}>{stateDetail.state} Assembly Election</h2>
                        <p style={{ color: "#525252", fontFamily: "var(--font-body)", fontSize: 14, marginTop: 6 }}>
                          {stateDetail.total_seats} seats · CM: <strong style={{ color: "#0A0A0A" }}>{stateDetail.cm}</strong>
                        </p>
                      </div>
                      <span className="chip-status chip-success">Completed</span>
                    </div>
                  </div>
                  <div style={{ padding: 28 }}>
                    <div className="pull-quote" style={{ marginBottom: 28 }}>{stateDetail.highlight}</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      {stateDetail.results.map((r, i) => (
                        <div key={i} style={{ border: i === 0 ? "2px solid #0A0A0A" : "2px solid #E5E5E5", padding: 24 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                            <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, color: "#0A0A0A" }}>{r.alliance}</h3>
                            <span style={{ fontFamily: "var(--font-display)", fontSize: 36, color: i === 0 ? "#EF4444" : "#0A0A0A" }}>{r.seats}</span>
                          </div>
                          <div className="score-bar" style={{ marginBottom: 16 }}>
                            <div className="score-fill" style={{ width: `${(r.seats / stateDetail.total_seats) * 100}%`, background: i === 0 ? "#EF4444" : "#D4D4D4" }} />
                          </div>
                          {r.parties.length > 0 && (
                            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                              {r.parties.map(p => (
                                <div key={p.name}>
                                  <span style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#A3A3A3" }}>{p.name}: </span>
                                  <span style={{ fontFamily: "var(--font-display)", fontSize: 16, color: "#0A0A0A" }}>{p.seats}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <p style={{ color: "#525252", fontFamily: "var(--font-body)", fontSize: 14, marginBottom: 28 }}>
                  Click any state to see full results breakdown.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {STATE_ELECTIONS.map((state, i) => (
                    <div
                      key={state.state}
                      onClick={() => setSelectedState(state.state)}
                      style={{
                        border: "2px solid #E5E5E5",
                        borderLeft: "4px solid #0A0A0A",
                        padding: "20px 24px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: 12,
                        transition: "all 0.15s",
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#F5F5F5"; (e.currentTarget as HTMLElement).style.borderColor = "#0A0A0A"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.borderColor = "#E5E5E5"; (e.currentTarget as HTMLElement).style.borderLeftColor = "#0A0A0A"; }}
                    >
                      <div style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
                        <div>
                          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, color: "#0A0A0A", marginBottom: 4 }}>{state.state}</h3>
                          <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#525252" }}>
                            {state.date} · {state.total_seats} seats
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 20 }}>
                          {state.results.slice(0, 2).map((r, j) => (
                            <div key={j}>
                              <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "#A3A3A3", marginBottom: 2 }}>{r.alliance}</div>
                              <div style={{ fontFamily: "var(--font-display)", fontSize: 24, color: j === 0 ? "#EF4444" : "#0A0A0A" }}>{r.seats}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                        <div>
                          <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "#A3A3A3", marginBottom: 2 }}>Winner</div>
                          <div style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 700, color: "#0A0A0A" }}>{state.winner}</div>
                        </div>
                        <div>
                          <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "#A3A3A3", marginBottom: 2 }}>CM</div>
                          <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#0A0A0A" }}>{state.cm}</div>
                        </div>
                        <span style={{ fontFamily: "var(--font-body)", fontSize: 20, color: "#A3A3A3" }}>→</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── UPCOMING ── */}
        {tab === "upcoming" && (
          <div>
            <div className="pull-quote" style={{ marginBottom: 40 }}>
              The next major electoral battle is West Bengal (2026), followed by five crucial states including Uttar Pradesh in 2027 — which sends 80 MPs to Lok Sabha, the highest of any state.
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
              {UPCOMING_ELECTIONS.map((e, i) => (
                <div key={e.state} style={{
                  border: i === 0 ? "2px solid #0A0A0A" : "2px solid #E5E5E5",
                  borderTop: i === 0 ? "4px solid #EF4444" : "2px solid #E5E5E5",
                  padding: 28,
                }}>
                  <div className="type-overline" style={{ marginBottom: 8 }}>{e.due}</div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "#0A0A0A", marginBottom: 8 }}>{e.state}</h3>
                  <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
                    <div>
                      <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "#A3A3A3", marginBottom: 2 }}>Seats</div>
                      <div style={{ fontFamily: "var(--font-display)", fontSize: 28, color: "#0A0A0A" }}>{e.seats}</div>
                    </div>
                    <div>
                      <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "#A3A3A3", marginBottom: 2 }}>Incumbent</div>
                      <div style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 700, color: "#0A0A0A" }}>{e.incumbent}</div>
                    </div>
                  </div>
                  <div style={{ borderLeft: "4px solid #0A0A0A", padding: "8px 12px", background: "#F5F5F5" }}>
                    <div className="type-overline" style={{ marginBottom: 4 }}>Key Contest</div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#0A0A0A" }}>{e.key_contest}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── HISTORY ── */}
        {tab === "history" && (
          <div>
            <div className="section-header">
              <h2 className="type-subhead" style={{ fontSize: 20 }}>Lok Sabha Results — 2004 to 2024</h2>
            </div>
            <div style={{ border: "2px solid #0A0A0A", overflowX: "auto", marginBottom: 40 }}>
              <table className="editorial-table">
                <thead>
                  <tr>
                    <th>Election</th>
                    <th>NDA Seats</th>
                    <th>Opposition</th>
                    <th>Winner</th>
                    <th>Seat Share</th>
                  </tr>
                </thead>
                <tbody>
                  {HISTORIC_LOK_SABHA.map((h) => (
                    <tr key={h.year}>
                      <td><span style={{ fontFamily: "var(--font-display)", fontSize: 20 }}>{h.year}</span></td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 100, height: 4, background: "#E5E5E5" }}>
                            <div style={{ height: "100%", width: `${(h.nda / h.total_seats) * 100}%`, background: "#FF6B00" }} />
                          </div>
                          <span style={{ fontFamily: "var(--font-display)", fontSize: 18 }}>{h.nda}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 100, height: 4, background: "#E5E5E5" }}>
                            <div style={{ height: "100%", width: `${(h.india_opp / h.total_seats) * 100}%`, background: "#00A651" }} />
                          </div>
                          <span style={{ fontFamily: "var(--font-display)", fontSize: 18 }}>{h.india_opp}</span>
                        </div>
                      </td>
                      <td style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 700 }}>{h.winner}</td>
                      <td style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#525252" }}>
                        NDA {((h.nda / h.total_seats) * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ borderLeft: "4px solid #EF4444", padding: "14px 20px", background: "#F5F5F5" }}>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "#0A0A0A", lineHeight: 1.7 }}>
                <strong>Key insight:</strong> 2024 marks the first time since 2009 that BJP fell short of an outright majority, needing TDP and JD(U) to govern. The INDIA bloc outperformed most exit polls, winning 234 seats vs projected ~150–180.
              </p>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
