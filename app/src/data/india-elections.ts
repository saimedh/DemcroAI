// =============================================
// INDIA ELECTIONS DATA — DemocrAI
// Sources: ECI, PRS India, Wikipedia
// =============================================

export const LOK_SABHA_2024 = {
  title: "18th Lok Sabha General Election",
  date: "April 19 – June 1, 2024",
  result_date: "June 4, 2024",
  total_seats: 543,
  majority_mark: 272,
  voter_turnout: "65.79%",
  registered_voters: "96.88 crore",
  phases: 7,
  winner: "NDA",
  alliances: [
    { name: "NDA", seats: 293, color: "#FF6B00", parties: ["BJP", "TDP", "JD(U)", "SS", "LJP(RV)", "Others"] },
    { name: "INDIA", seats: 234, color: "#00A651", parties: ["INC", "SP", "TMC", "DMK", "SS(UBT)", "NCP(SP)", "Others"] },
    { name: "Others", seats: 16, color: "#A3A3A3", parties: ["Independents", "Smaller parties"] },
  ],
};

export const LOK_SABHA_PARTIES_2024 = [
  { party: "BJP", full_name: "Bharatiya Janata Party", seats: 240, contested: 441, alliance: "NDA", color: "#FF6B00", leader: "Narendra Modi", ideology: "Hindu nationalism, Conservatism, Economic liberalism" },
  { party: "INC", full_name: "Indian National Congress", seats: 99, contested: 328, alliance: "INDIA", color: "#00A651", leader: "Mallikarjun Kharge / Rahul Gandhi", ideology: "Social democracy, Secularism, Centrism" },
  { party: "SP", full_name: "Samajwadi Party", seats: 37, contested: 71, alliance: "INDIA", color: "#E63946", leader: "Akhilesh Yadav", ideology: "Democratic socialism, OBC rights, Federalism" },
  { party: "AITC", full_name: "All India Trinamool Congress", seats: 29, contested: 48, alliance: "INDIA", color: "#1D6FA4", leader: "Mamata Banerjee", ideology: "Populism, Bengali regionalism, Secularism" },
  { party: "DMK", full_name: "Dravida Munnetra Kazhagam", seats: 22, contested: 22, alliance: "INDIA", color: "#CC0000", leader: "M. K. Stalin", ideology: "Dravidian movement, Social welfare, Federalism" },
  { party: "TDP", full_name: "Telugu Desam Party", seats: 16, contested: 17, alliance: "NDA", color: "#FFBF00", leader: "N. Chandrababu Naidu", ideology: "Telugu regionalism, Development, Liberalism" },
  { party: "JD(U)", full_name: "Janata Dal (United)", seats: 12, contested: 16, alliance: "NDA", color: "#008000", leader: "Nitish Kumar", ideology: "Social justice, Federalism, Development" },
  { party: "SS(UBT)", full_name: "Shiv Sena (UBT)", seats: 9, contested: 21, alliance: "INDIA", color: "#C0392B", leader: "Uddhav Thackeray", ideology: "Hindutva, Marathi regionalism" },
  { party: "NCP(SP)", full_name: "NCP – Sharadchandra Pawar", seats: 8, contested: 10, alliance: "INDIA", color: "#1A5276", leader: "Sharad Pawar", ideology: "Social democracy, Agrarianism, Secularism" },
  { party: "SS", full_name: "Shiv Sena (Shinde)", seats: 7, contested: 15, alliance: "NDA", color: "#E07B00", leader: "Eknath Shinde", ideology: "Hindutva, Marathi regionalism" },
  { party: "LJP(RV)", full_name: "Lok Janshakti Party (Ram Vilas)", seats: 5, contested: 5, alliance: "NDA", color: "#4169E1", leader: "Chirag Paswan", ideology: "Dalit rights, Liberalism" },
  { party: "RJD", full_name: "Rashtriya Janata Dal", seats: 4, contested: 23, alliance: "INDIA", color: "#006400", leader: "Lalu Prasad Yadav", ideology: "Social justice, OBC-Minority rights" },
  { party: "YSRCP", full_name: "YSR Congress Party", seats: 4, contested: 25, alliance: "None", color: "#5B2C8D", leader: "Y. S. Jagan Mohan Reddy", ideology: "Welfarism, Telugu regionalism" },
  { party: "AAP", full_name: "Aam Aadmi Party", seats: 3, contested: 22, alliance: "INDIA", color: "#00BFFF", leader: "Arvind Kejriwal", ideology: "Anti-corruption, Welfarism, Populism" },
  { party: "JMM", full_name: "Jharkhand Mukti Morcha", seats: 3, contested: 5, alliance: "INDIA", color: "#808000", leader: "Hemant Soren", ideology: "Tribal rights, Jharkhand autonomy" },
];

export const STATE_ELECTIONS = [
  {
    state: "Bihar",
    date: "November 2025",
    total_seats: 243,
    result: "COMPLETED",
    winner: "NDA",
    results: [
      { alliance: "NDA", seats: 202, parties: [{ name: "BJP", seats: 89 }, { name: "JD(U)", seats: 85 }, { name: "LJP(RV)", seats: 19 }, { name: "Others", seats: 9 }] },
      { alliance: "Mahagathbandhan", seats: 35, parties: [{ name: "RJD", seats: 25 }, { name: "INC", seats: 6 }, { name: "Others", seats: 4 }] },
      { alliance: "Others", seats: 6, parties: [] },
    ],
    cm: "Nitish Kumar (JD-U)",
    highlight: "NDA landslide; RJD's Tejashwi Yadav-led opposition decimated",
  },
  {
    state: "Delhi",
    date: "February 5, 2025",
    total_seats: 70,
    result: "COMPLETED",
    winner: "BJP",
    results: [
      { alliance: "BJP", seats: 48, parties: [{ name: "BJP", seats: 48 }] },
      { alliance: "AAP", seats: 22, parties: [{ name: "AAP", seats: 22 }] },
      { alliance: "INC", seats: 0, parties: [{ name: "INC", seats: 0 }] },
    ],
    cm: "Rekha Gupta (BJP)",
    highlight: "BJP returned to power after 27 years; AAP lost majority; Congress drew blank",
  },
  {
    state: "Maharashtra",
    date: "November 20, 2024",
    total_seats: 288,
    result: "COMPLETED",
    winner: "Mahayuti",
    results: [
      { alliance: "Mahayuti", seats: 235, parties: [{ name: "BJP", seats: 132 }, { name: "SS (Shinde)", seats: 57 }, { name: "NCP (Ajit)", seats: 41 }, { name: "Others", seats: 5 }] },
      { alliance: "MVA", seats: 46, parties: [{ name: "INC", seats: 16 }, { name: "SS (UBT)", seats: 20 }, { name: "NCP (SP)", seats: 10 }] },
      { alliance: "Others", seats: 7, parties: [] },
    ],
    cm: "Devendra Fadnavis (BJP)",
    highlight: "Mahayuti swept; MVA collapsed; Fadnavis became CM for third time",
  },
  {
    state: "Jharkhand",
    date: "November 13–20, 2024",
    total_seats: 81,
    result: "COMPLETED",
    winner: "JMM Alliance",
    results: [
      { alliance: "JMM-led INDIA", seats: 56, parties: [{ name: "JMM", seats: 34 }, { name: "INC", seats: 16 }, { name: "RJD", seats: 4 }, { name: "Others", seats: 2 }] },
      { alliance: "NDA", seats: 24, parties: [{ name: "BJP", seats: 21 }, { name: "AJSU", seats: 1 }, { name: "Others", seats: 2 }] },
      { alliance: "Others", seats: 1, parties: [] },
    ],
    cm: "Hemant Soren (JMM)",
    highlight: "JMM retained power with bigger majority; Soren completed comeback after arrest",
  },
  {
    state: "Haryana",
    date: "October 5, 2024",
    total_seats: 90,
    result: "COMPLETED",
    winner: "BJP",
    results: [
      { alliance: "BJP", seats: 48, parties: [{ name: "BJP", seats: 48 }] },
      { alliance: "INC", seats: 37, parties: [{ name: "INC", seats: 37 }] },
      { alliance: "Others", seats: 5, parties: [] },
    ],
    cm: "Nayab Singh Saini (BJP)",
    highlight: "BJP won third consecutive term; INC lost despite pre-poll surveys favouring them",
  },
  {
    state: "J&K (UT)",
    date: "September 18 – October 1, 2024",
    total_seats: 90,
    result: "COMPLETED",
    winner: "NC-INC",
    results: [
      { alliance: "NC-INC Alliance", seats: 49, parties: [{ name: "NC", seats: 42 }, { name: "INC", seats: 6 }, { name: "CPM", seats: 1 }] },
      { alliance: "BJP", seats: 29, parties: [{ name: "BJP", seats: 29 }] },
      { alliance: "Others", seats: 12, parties: [] },
    ],
    cm: "Omar Abdullah (NC)",
    highlight: "First J&K assembly election post Article 370 abrogation; NC-INC formed government",
  },
];

export const UPCOMING_ELECTIONS = [
  { state: "West Bengal", due: "April–May 2026", seats: 294, incumbent: "TMC (Mamata Banerjee)", key_contest: "TMC vs BJP vs INC-Left" },
  { state: "Uttar Pradesh", due: "February 2027", seats: 403, incumbent: "BJP (Yogi Adityanath)", key_contest: "BJP vs SP-led INDIA bloc" },
  { state: "Punjab", due: "February 2027", seats: 117, incumbent: "AAP (Bhagwant Mann)", key_contest: "AAP vs INC vs BJP-SAD" },
  { state: "Uttarakhand", due: "February 2027", seats: 70, incumbent: "BJP (Pushkar Singh Dhami)", key_contest: "BJP vs INC" },
  { state: "Goa", due: "February 2027", seats: 40, incumbent: "BJP (Pramod Sawant)", key_contest: "BJP vs INC vs Others" },
];

export const MAJOR_LEADERS = [
  {
    id: "modi",
    name: "Narendra Modi",
    role: "Prime Minister of India",
    party: "BJP",
    photo: "NM",
    age: 74,
    constituency: "Varanasi, UP (LS 2024: won by 152,513 votes)",
    positions: {
      Economy: { stance: "Viksit Bharat 2047; PLI schemes; UPI expansion; ₹11.11L cr infra budget", score: 0.78 },
      Agriculture: { stance: "PM-KISAN, MSP hikes; Natural farming push; Agri infra fund", score: 0.65 },
      Healthcare: { stance: "Ayushman Bharat — 70cr beneficiaries; 1.5L Health & Wellness centres", score: 0.72 },
      Education: { stance: "NEP 2020; PM SHRI schools; Digital universities; IIT/IIM expansion", score: 0.7 },
      Foreign: { stance: "Neighbourhood First; G20 Presidency; Indo-Pacific engagement", score: 0.82 },
      "Welfare/Social": { stance: "PM Awas, Jan Dhan, Ujjwala; Uniform Civil Code advocacy", score: 0.68 },
    },
    keyPolicies: ["Viksit Bharat 2047", "Make in India", "Digital India", "Atmanirbhar Bharat", "CAA implementation"],
    sources: 14,
  },
  {
    id: "rahul",
    name: "Rahul Gandhi",
    role: "Leader of Opposition (Lok Sabha)",
    party: "INC",
    photo: "RG",
    age: 53,
    constituency: "Rae Bareli, UP (LS 2024: won by 390,030 votes)",
    positions: {
      Economy: { stance: "Caste census; wealth redistribution; NYAY scheme (₹1L/year to poor)", score: 0.45 },
      Agriculture: { stance: "Legal guarantee for MSP; farm loan waiver; end agri monopolies", score: 0.82 },
      Healthcare: { stance: "Increase health spending to 3% of GDP; universal public healthcare", score: 0.78 },
      Education: { stance: "Restore OBC/SC/ST reservations; 50% women in govt education bodies", score: 0.75 },
      Foreign: { stance: "Criticism of China policy; demands Parliament debate on Ladakh standoff", score: 0.38 },
      "Welfare/Social": { stance: "Anti-CAA; caste census; 50% reservation cap removal advocacy", score: 0.72 },
    },
    keyPolicies: ["Caste Census", "Legal MSP guarantee", "NYAY scheme revival", "Bharat Jodo Yatra", "Opposition unity"],
    sources: 11,
  },
  {
    id: "mamata",
    name: "Mamata Banerjee",
    role: "Chief Minister, West Bengal",
    party: "AITC (TMC)",
    photo: "MB",
    age: 69,
    constituency: "Bhabanipur, WB (State MLA)",
    positions: {
      Economy: { stance: "Lakshmi Bhandar cash transfer; Duare Sarkar services; local industry boost", score: 0.58 },
      Agriculture: { stance: "Krishak Bandhu scheme; crop insurance expansion", score: 0.72 },
      Healthcare: { stance: "Swasthya Sathi scheme — 5L coverage for WB families", score: 0.75 },
      Education: { stance: "Kanyashree, Sabuj Sathi; opposes NEP's Hindi imposition concerns", score: 0.7 },
      Foreign: { stance: "Strong federalist stance; opposes central overreach", score: 0.5 },
      "Welfare/Social": { stance: "Anti-CAA; minority welfare; strong women-centric schemes", score: 0.78 },
    },
    keyPolicies: ["Lakshmi Bhandar", "Swasthya Sathi", "Anti-CAA", "Federal rights", "Kanyashree"],
    sources: 9,
  },
  {
    id: "kejriwal",
    name: "Arvind Kejriwal",
    role: "National Convenor, AAP (Ex-CM Delhi)",
    party: "AAP",
    photo: "AK",
    age: 56,
    constituency: "New Delhi (Delhi MLA — lost 2025)",
    positions: {
      Economy: { stance: "Free electricity/water model; small business support; anti-corruption focus", score: 0.52 },
      Agriculture: { stance: "Punjab farm debt relief; zero-fee power to farmers in Punjab", score: 0.7 },
      Healthcare: { stance: "Mohalla Clinics — 1,000+ free OPD clinics in Delhi; hospital upgrade", score: 0.88 },
      Education: { stance: "Delhi school transformation model; IB board in govt schools", score: 0.9 },
      Foreign: { stance: "Limited foreign policy engagement as state-level leader", score: 0.3 },
      "Welfare/Social": { stance: "Free bus travel for women; elder pilgrimage; anti-NRC stance", score: 0.75 },
    },
    keyPolicies: ["Mohalla Clinics", "Free electricity (200 units)", "Delhi school revival", "Anti-corruption stance"],
    sources: 8,
  },
];

export const KEY_ISSUES_INDIA = [
  { key: "economy", label: "Economy & Inflation", icon: "💰", desc: "GDP growth, unemployment, inflation, PLI schemes, Make in India" },
  { key: "agriculture", label: "Agriculture & Farmers", icon: "🌾", desc: "MSP guarantee, farm laws, crop insurance, rural income" },
  { key: "healthcare", label: "Healthcare", icon: "🏥", desc: "Ayushman Bharat, public hospitals, health budget, universal coverage" },
  { key: "education", label: "Education", icon: "📚", desc: "NEP 2020, reservation policy, school quality, higher education access" },
  { key: "social", label: "Caste & Social Justice", icon: "⚖️", desc: "Caste census, OBC/SC/ST reservations, Dalit rights, UCC" },
  { key: "security", label: "National Security", icon: "🛡️", desc: "China-Pakistan borders, Ladakh standoff, defence modernisation" },
];

export const VOTER_STATS_INDIA = {
  total_voters_2024: "96.88 crore",
  votes_polled: "64.2 crore",
  voter_turnout_2024: "65.79%",
  first_time_voters: "~1.82 crore",
  women_voters_percent: "48.3%",
  youth_voters_1829: "21.5%",
  evm_vvpat_used: "Yes — all 543 constituencies",
  polling_stations: "10.5 lakh",
  election_phases: 7,
};

export const HISTORIC_LOK_SABHA = [
  { year: 2024, winner: "NDA (BJP 240)", total_seats: 543, nda: 293, india_opp: 234 },
  { year: 2019, winner: "NDA (BJP 303)", total_seats: 543, nda: 353, india_opp: 91 },
  { year: 2014, winner: "NDA (BJP 282)", total_seats: 543, nda: 336, india_opp: 60 },
  { year: 2009, winner: "UPA (INC 206)", total_seats: 543, nda: 159, india_opp: 262 },
  { year: 2004, winner: "UPA (INC 145)", total_seats: 543, nda: 186, india_opp: 222 },
];
