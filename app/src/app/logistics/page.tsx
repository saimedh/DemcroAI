"use client";
import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const STATES = ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"];

const STATE_DATA: Record<string, { reg_url: string; reg_deadline: string; early_voting: string; mail_in: string; id_required: string }> = {
  California: { reg_url: "https://registertovote.ca.gov", reg_deadline: "October 21, 2026", early_voting: "October 5 – November 2", mail_in: "All registered voters receive a mail ballot", id_required: "Not required (signature verification)" },
  Texas: { reg_url: "https://texasvotes.gov", reg_deadline: "October 5, 2026", early_voting: "October 19 – 30", mail_in: "Must be 65+, disabled, or away from county", id_required: "Photo ID required" },
  "New York": { reg_url: "#", reg_deadline: "October 14, 2026", early_voting: "October 24 – November 1", mail_in: "No-excuse absentee available", id_required: "Signature match required" },
};

function getInfo(state: string) { return STATE_DATA[state] || STATE_DATA["California"]; }

const TABS = [
  { id: "registration", label: "Registration" },
  { id: "polling", label: "Polling Place" },
  { id: "deadlines", label: "Deadlines" },
  { id: "reminders", label: "Reminders" },
];

export default function LogisticsPage() {
  const [state, setState] = useState("California");
  const [address, setAddress] = useState("");
  const [tab, setTab] = useState("registration");
  const [reminderType, setReminderType] = useState<"email" | "sms">("email");
  const [contact, setContact] = useState("");
  const [reminderSet, setReminderSet] = useState(false);

  const info = getInfo(state);

  return (
    <div style={{ minHeight: "100vh", background: "#FAFAFA" }}>
      <Navbar />

      {/* Header */}
      <div style={{ borderBottom: "2px solid #0A0A0A", background: "#F5F5F5" }}>
        <div className="container" style={{ padding: "32px 24px" }}>
          <span className="rubric" style={{ display: "block", marginBottom: 8 }}>Voting Logistics</span>
          <h1 className="type-headline" style={{ marginBottom: 16 }}>Voting Info Hub</h1>
          <p style={{ color: "#525252", fontSize: 14, fontFamily: "var(--font-body)", marginBottom: 24 }}>
            Everything you need to cast your ballot — from registration to election day.
          </p>
          <div style={{ display: "flex", gap: 0, flexWrap: "wrap" }}>
            <select value={state} onChange={e => setState(e.target.value)} className="input select" style={{ maxWidth: 220, borderRight: "none" }}>
              {STATES.map(s => <option key={s}>{s}</option>)}
            </select>
            <input type="text" placeholder="Full street address (for polling lookup)" value={address} onChange={e => setAddress(e.target.value)} className="input" style={{ maxWidth: 380, borderRight: "none" }} />
            <button className="btn btn-primary" style={{ flexShrink: 0 }}>Find My Info</button>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: "40px 24px" }}>
        {/* Tabs */}
        <div style={{ display: "flex", gap: 0, borderBottom: "2px solid #0A0A0A", marginBottom: 40 }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: "12px 24px",
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
              transition: "all 0.15s",
            }}>{t.label}</button>
          ))}
        </div>

        {/* Registration */}
        {tab === "registration" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <div style={{ border: "2px solid #0A0A0A", padding: 32 }}>
              <h2 className="type-subhead" style={{ marginBottom: 8 }}>Register to Vote</h2>
              <p style={{ color: "#525252", fontSize: 14, fontFamily: "var(--font-body)", lineHeight: 1.7, marginBottom: 24 }}>
                Register online in <strong style={{ color: "#0A0A0A" }}>{state}</strong> using your state&apos;s official portal.
              </p>
              {[
                { label: "Registration Deadline", value: info.reg_deadline },
                { label: "ID Required", value: info.id_required },
              ].map(({ label, value }) => (
                <div key={label} style={{ borderTop: "1px solid #E5E5E5", padding: "14px 0" }}>
                  <div className="type-overline" style={{ marginBottom: 4 }}>{label}</div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "#0A0A0A", fontWeight: 500 }}>{value}</div>
                </div>
              ))}
              <div style={{ borderTop: "1px solid #E5E5E5", paddingTop: 24, marginTop: 8, display: "flex", flexDirection: "column", gap: 10 }}>
                <a href={info.reg_url} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ justifyContent: "center" }}>
                  Register Now in {state} ↗
                </a>
                <a href="#" className="btn btn-secondary" style={{ justifyContent: "center" }}>
                  Check Registration Status ↗
                </a>
              </div>
            </div>

            <div style={{ border: "2px solid #E5E5E5", borderTop: "4px solid #EF4444", padding: 32 }}>
              <h2 className="type-subhead" style={{ marginBottom: 8 }}>Mail-in Voting</h2>
              <p style={{ color: "#525252", fontSize: 14, fontFamily: "var(--font-body)", lineHeight: 1.7, marginBottom: 20 }}>
                In <strong style={{ color: "#0A0A0A" }}>{state}</strong>: {info.mail_in}
              </p>
              <div style={{ borderLeft: "4px solid #0A0A0A", padding: "12px 16px", background: "#F5F5F5", marginBottom: 20 }}>
                <div className="type-overline" style={{ marginBottom: 8 }}>Mail-in checklist</div>
                {["Request ballot early", "Read all instructions carefully", "Sign the outer envelope", "Return by the deadline", "Track your ballot online"].map(item => (
                  <div key={item} style={{ display: "flex", gap: 10, marginBottom: 6, fontFamily: "var(--font-body)", fontSize: 13, color: "#0A0A0A" }}>
                    <span style={{ color: "#16A34A", fontWeight: 700 }}>✓</span> {item}
                  </div>
                ))}
              </div>
              <a href="#" className="btn btn-secondary" style={{ display: "flex", justifyContent: "center" }}>Request Mail-in Ballot ↗</a>
            </div>
          </div>
        )}

        {/* Polling Place */}
        {tab === "polling" && (
          <div>
            {address ? (
              <div style={{ border: "2px solid #0A0A0A" }}>
                <div style={{ borderBottom: "2px solid #0A0A0A", background: "#F5F5F5", padding: "20px 24px" }}>
                  <span className="rubric" style={{ display: "block", marginBottom: 4 }}>Polling Place Found</span>
                  <h2 className="type-subhead">Westside Community Recreation Center</h2>
                  <p style={{ color: "#525252", fontSize: 14, fontFamily: "var(--font-body)", marginTop: 6 }}>
                    2505 S Robertson Blvd, Los Angeles, CA 90034 · For: {address}
                  </p>
                </div>
                <div style={{ padding: 32 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, marginBottom: 24 }}>
                    {[
                      ["Election Day Hours", "7:00 AM – 8:00 PM"],
                      ["Accessibility", "Wheelchair accessible · ADA compliant"],
                      ["Languages", "English, Spanish, Korean"],
                      ["Parking", "Free parking available on-site"],
                    ].map(([k, v]) => (
                      <div key={k} style={{ border: "1px solid #E5E5E5", padding: "16px 20px" }}>
                        <div className="type-overline" style={{ marginBottom: 4 }}>{k}</div>
                        <div style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "#0A0A0A" }}>{v}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ border: "2px dashed #D4D4D4", height: 200, display: "flex", alignItems: "center", justifyContent: "center", background: "#F5F5F5" }}>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "#A3A3A3", fontStyle: "italic" }}>Map loads via Google Maps API</p>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ border: "2px solid #E5E5E5", borderTop: "4px solid #EF4444", padding: 64, textAlign: "center" }}>
                <h2 className="type-subhead" style={{ marginBottom: 12 }}>Enter your address above</h2>
                <p style={{ color: "#525252", fontSize: 15, fontFamily: "var(--font-body)", maxWidth: 400, margin: "0 auto" }}>
                  We&apos;ll show you exactly where to vote, the hours, accessibility features, and directions.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Deadlines */}
        {tab === "deadlines" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 2, marginBottom: 24 }}>
              {[
                { label: "Voter Registration", date: info.reg_deadline, note: null },
                { label: "Early Voting Period", date: info.early_voting, note: null },
                { label: "Mail-in Ballot Request", date: "October 27, 2026", note: null },
                { label: "Election Day", date: "November 3, 2026", note: "MARK YOUR CALENDAR" },
              ].map((d, i) => (
                <div key={i} style={{
                  border: i === 3 ? "2px solid #0A0A0A" : "2px solid #E5E5E5",
                  borderTop: i === 3 ? "4px solid #EF4444" : "2px solid #E5E5E5",
                  padding: 32,
                }}>
                  <div className="type-overline" style={{ marginBottom: 12 }}>{d.label}</div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 24, color: "#0A0A0A", marginBottom: 8 }}>{d.date}</div>
                  {d.note && <span style={{ background: "#EF4444", color: "#FAFAFA", fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", padding: "3px 10px", textTransform: "uppercase" }}>{d.note}</span>}
                </div>
              ))}
            </div>
            <div style={{ borderLeft: "4px solid #0A0A0A", padding: "12px 16px", background: "#F5F5F5" }}>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#525252", lineHeight: 1.6 }}>
                Deadlines shown are for <strong style={{ color: "#0A0A0A" }}>{state}</strong>. Information sourced from the official state election board. Always verify with your local election authority.{" "}
                <a href="#" style={{ color: "#EF4444", textDecoration: "none", fontWeight: 700 }}>Official {state} Elections Site ↗</a>
              </p>
            </div>
          </div>
        )}

        {/* Reminders */}
        {tab === "reminders" && (
          <div style={{ maxWidth: 520 }}>
            {reminderSet ? (
              <div style={{ border: "2px solid #0A0A0A", borderTop: "4px solid #16A34A", padding: 48, textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 48, color: "#16A34A", marginBottom: 16 }}>✓</div>
                <h2 className="type-subhead" style={{ marginBottom: 12 }}>Reminder Set!</h2>
                <p style={{ color: "#525252", fontSize: 15, fontFamily: "var(--font-body)", lineHeight: 1.7 }}>
                  You&apos;ll receive election reminders at <strong style={{ color: "#0A0A0A" }}>{contact}</strong>.
                </p>
                <p className="footnote" style={{ textAlign: "center" }}>Your contact info is never shared with campaigns, advertisers, or third parties.</p>
              </div>
            ) : (
              <div style={{ border: "2px solid #0A0A0A" }}>
                <div style={{ background: "#F5F5F5", borderBottom: "2px solid #0A0A0A", padding: "20px 24px" }}>
                  <span className="rubric" style={{ display: "block", marginBottom: 4 }}>Never miss a deadline</span>
                  <h2 className="type-subhead" style={{ fontSize: 22 }}>Set Voting Reminders</h2>
                </div>
                <div style={{ padding: 32 }}>
                  <div style={{ marginBottom: 24 }}>
                    <label className="input-label">Reminder Type</label>
                    <div style={{ display: "flex", gap: 0 }}>
                      {(["email", "sms"] as const).map(type => (
                        <button key={type} onClick={() => setReminderType(type)} className={`btn btn-sm ${reminderType === type ? "btn-primary" : "btn-secondary"}`} style={{ flex: 1, justifyContent: "center" }}>
                          {type === "email" ? "📧 Email" : "📱 SMS"}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom: 24 }}>
                    <label className="input-label" htmlFor="contact-input">
                      {reminderType === "email" ? "Email Address" : "Phone Number"}
                    </label>
                    <input id="contact-input" type={reminderType === "email" ? "email" : "tel"} placeholder={reminderType === "email" ? "you@example.com" : "+1 (555) 000-0000"} value={contact} onChange={e => setContact(e.target.value)} className="input" />
                  </div>

                  <div style={{ marginBottom: 28 }}>
                    <label className="input-label">Remind me about</label>
                    {["Registration deadline (2 weeks before)", "Early voting starts", "Mail-in ballot deadline", "Election day (morning of)"].map(item => (
                      <div key={item} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "center" }}>
                        <input type="checkbox" defaultChecked className="checkbox-custom" />
                        <span style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "#0A0A0A" }}>{item}</span>
                      </div>
                    ))}
                  </div>

                  <button onClick={() => contact && setReminderSet(true)} className="btn btn-primary" style={{ width: "100%", justifyContent: "center", height: 48, fontSize: 15 }}>
                    Set My Reminders →
                  </button>
                  <p className="footnote" style={{ marginTop: 12, textAlign: "center" }}>We never sell your data to campaigns or advertisers. CCPA & GDPR compliant.</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
