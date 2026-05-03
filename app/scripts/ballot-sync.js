#!/usr/bin/env node
/**
 * DemocrAI Nightly Ballot Sync Job
 * Runs as a Cloud Run Job (triggered by Cloud Scheduler at 2 AM daily).
 *
 * Pipeline:
 *  1. Fetch US elections from Google Civic API for active ZIP list
 *  2. Enrich candidates from Ballotpedia API
 *  3. Write structured data to Firestore `ballot_cache` collection
 *  4. Invalidate any stale cache entries (> 25h old)
 *
 * Deploy:
 *   gcloud run jobs deploy ballot-sync \
 *     --image gcr.io/PROJECT_ID/democrai-app \
 *     --command node,scripts/ballot-sync.js \
 *     --region us-central1 \
 *     --set-env-vars GOOGLE_CIVIC_API_KEY=...,FIREBASE_PROJECT_ID=...
 *
 *   gcloud scheduler jobs create http ballot-sync-nightly \
 *     --schedule "0 2 * * *" \
 *     --uri "https://us-central1-run.googleapis.com/apis/run.googleapis.com/v1/namespaces/PROJECT_ID/jobs/ballot-sync:run" \
 *     --message-body "{}" \
 *     --oauth-service-account-email scheduler@PROJECT_ID.iam.gserviceaccount.com \
 *     --location us-central1
 */

const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

// Priority ZIP codes for ballot data pre-warming
const PRIORITY_ZIPS = [
  "10001", "90210", "60601", "77001", "85001",
  "30301", "98101", "19101", "02101", "80201",
];

let db;

function initFirebase() {
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_JSON
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON)
    : {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      };

  initializeApp({ credential: cert(serviceAccount) });
  db = getFirestore();
}

async function fetchCivicData(zip) {
  const apiKey = process.env.GOOGLE_CIVIC_API_KEY;
  if (!apiKey) throw new Error("GOOGLE_CIVIC_API_KEY not set");

  const url = `https://civicinfo.googleapis.com/civicinfo/v2/voterinfo?key=${apiKey}&address=${zip}&electionId=2000`;
  const res = await fetch(url);
  if (!res.ok) {
    console.warn(`[CIVIC] ZIP ${zip}: HTTP ${res.status}`);
    return null;
  }
  return res.json();
}

async function enrichWithBallotpedia(candidateName, office) {
  const token = process.env.BALLOTPEDIA_API_KEY;
  if (!token) return {};

  try {
    const url = `https://api.ballotpedia.org/data/v1/candidate?name=${encodeURIComponent(candidateName)}&office=${encodeURIComponent(office)}&apikey=${token}`;
    const res = await fetch(url);
    if (!res.ok) return {};
    const data = await res.json();
    const c = data.data?.[0];
    return c ? { bio: c.summary?.slice(0, 300), ballotpediaUrl: c.url } : {};
  } catch {
    return {};
  }
}

async function invalidateStaleCache() {
  const cutoff = new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString();
  const snap = await db.collection("ballot_cache")
    .where("cachedAt", "<", cutoff)
    .get();

  const batch = db.batch();
  snap.docs.forEach(doc => batch.delete(doc.ref));
  if (!snap.empty) {
    await batch.commit();
    console.log(`[CACHE] Deleted ${snap.size} stale entries`);
  }
}

async function processZip(zip) {
  console.log(`[SYNC] Processing ZIP: ${zip}`);
  const civicData = await fetchCivicData(zip);
  if (!civicData) return;

  const contests = (civicData.contests || []).map(c => ({
    office: c.office || c.referendumTitle || "Unknown",
    level: (c.level || ["unknown"])[0],
    type: c.type || "General",
    isReferendum: c.type === "Referendum",
    candidates: (c.candidates || []).map(cand => ({
      name: cand.name || "Unknown",
      party: cand.party || "Non-Partisan",
      url: cand.candidateUrl || "",
      photoUrl: cand.photoUrl || "",
    })),
  }));

  // Enrich first 3 contests
  for (let i = 0; i < Math.min(3, contests.length); i++) {
    for (let j = 0; j < Math.min(2, contests[i].candidates.length); j++) {
      const extra = await enrichWithBallotpedia(
        contests[i].candidates[j].name,
        contests[i].office
      );
      Object.assign(contests[i].candidates[j], extra);
    }
  }

  const cacheKey = Buffer.from(zip).toString("base64");
  await db.collection("ballot_cache").doc(cacheKey).set({
    jurisdiction: civicData.normalizedInput
      ? `${civicData.normalizedInput.city}, ${civicData.normalizedInput.state}`
      : zip,
    election: civicData.election || null,
    contests,
    pollingInfo: {
      registrationUrl: civicData.state?.[0]?.electionAdministrationBody?.electionRegistrationUrl,
    },
    cached: true,
    cachedAt: new Date().toISOString(),
    source: "nightly-sync",
  });

  console.log(`[SYNC] ZIP ${zip}: ${contests.length} contests written`);
}

async function main() {
  console.log("[BALLOT-SYNC] Starting nightly sync job…");
  initFirebase();

  // Invalidate stale cache first
  await invalidateStaleCache();

  // Process priority ZIPs in sequence to respect API rate limits
  for (const zip of PRIORITY_ZIPS) {
    try {
      await processZip(zip);
      await new Promise(r => setTimeout(r, 500)); // 500ms delay between requests
    } catch (err) {
      console.error(`[SYNC] ZIP ${zip} failed:`, err.message);
    }
  }

  console.log("[BALLOT-SYNC] Nightly sync complete.");
  process.exit(0);
}

main().catch(err => {
  console.error("[BALLOT-SYNC] Fatal error:", err);
  process.exit(1);
});
