import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const CIVIC_API_KEY = process.env.GOOGLE_CIVIC_API_KEY || "";
const BALLOTPEDIA_TOKEN = process.env.BALLOTPEDIA_API_KEY || "";

interface CivicContest {
  office?: string;
  type?: string;
  level?: string[];
  roles?: string[];
  district?: { name?: string; scope?: string };
  candidates?: {
    name?: string;
    party?: string;
    candidateUrl?: string;
    photoUrl?: string;
    email?: string;
    phone?: string;
  }[];
  referendumTitle?: string;
  referendumSubtitle?: string;
  referendumUrl?: string;
  referendumText?: string;
}

interface BallotData {
  jurisdiction: string;
  election: {
    name: string;
    electionDay: string;
    id: string;
  } | null;
  contests: {
    office: string;
    level: string;
    type: string;
    candidates: {
      name: string;
      party: string;
      url: string;
      photoUrl: string;
      ballotpediaUrl?: string;
      bio?: string;
      positions?: Record<string, { stance: string; score: number }>;
    }[];
    isReferendum: boolean;
    referendumTitle?: string;
    referendumText?: string;
  }[];
  pollingInfo: {
    registrationUrl?: string;
    registrationDeadline?: string;
  };
  cached: boolean;
  cachedAt?: string;
  source: string;
}

async function fetchFromCivicAPI(address: string): Promise<BallotData | null> {
  if (!CIVIC_API_KEY) return null;

  const params = new URLSearchParams({
    key: CIVIC_API_KEY,
    address,
    electionId: "2000", // "upcoming elections" sentinel
  });

  // First get voter info
  const voterRes = await fetch(
    `https://civicinfo.googleapis.com/civicinfo/v2/voterinfo?${params}`,
    { next: { revalidate: 3600 } }
  );

  if (!voterRes.ok) {
    // Try representatives endpoint for jurisdiction detection
    const repParams = new URLSearchParams({ key: CIVIC_API_KEY, address });
    const repRes = await fetch(
      `https://civicinfo.googleapis.com/civicinfo/v2/representatives?${repParams}`
    );
    if (!repRes.ok) return null;
    const repData = await repRes.json();
    return {
      jurisdiction: repData.normalizedInput
        ? `${repData.normalizedInput.city}, ${repData.normalizedInput.state}`
        : address,
      election: null,
      contests: [],
      pollingInfo: {},
      cached: false,
      source: "google-civic-representatives",
    };
  }

  const data = await voterRes.json();

  const contests: BallotData["contests"] = (data.contests || []).map(
    (c: CivicContest) => ({
      office: c.office || c.referendumTitle || "Unknown Office",
      level: (c.level || ["unknown"])[0],
      type: c.type || "General",
      isReferendum: c.type === "Referendum",
      referendumTitle: c.referendumTitle,
      referendumText: c.referendumText?.slice(0, 500),
      candidates: (c.candidates || []).map((cand) => ({
        name: cand.name || "Unknown",
        party: cand.party || "Non-Partisan",
        url: cand.candidateUrl || "",
        photoUrl: cand.photoUrl || "",
      })),
    })
  );

  return {
    jurisdiction: data.normalizedInput
      ? `${data.normalizedInput.city}, ${data.normalizedInput.state} ${data.normalizedInput.zip}`
      : address,
    election: data.election
      ? {
          name: data.election.name,
          electionDay: data.election.electionDay,
          id: data.election.id,
        }
      : null,
    contests,
    pollingInfo: {
      registrationUrl: data.state?.[0]?.electionAdministrationBody?.electionRegistrationUrl,
      registrationDeadline: data.state?.[0]?.electionAdministrationBody?.registrationDeadline,
    },
    cached: false,
    source: "google-civic-api",
  };
}

async function fetchBallotpediaCandidateBio(
  candidateName: string,
  office: string
): Promise<{ bio?: string; ballotpediaUrl?: string; positions?: Record<string, { stance: string; score: number }> }> {
  if (!BALLOTPEDIA_TOKEN) return {};

  try {
    const searchUrl = `https://api.ballotpedia.org/data/v1/candidate?name=${encodeURIComponent(candidateName)}&office=${encodeURIComponent(office)}&apikey=${BALLOTPEDIA_TOKEN}`;
    const res = await fetch(searchUrl, { next: { revalidate: 86400 } });
    if (!res.ok) return {};
    const data = await res.json();
    const candidate = data.data?.[0];
    if (!candidate) return {};
    return {
      bio: candidate.summary || candidate.description?.slice(0, 300),
      ballotpediaUrl: candidate.url,
    };
  } catch {
    return {};
  }
}

async function getFromFirestoreCache(cacheKey: string) {
  try {
    const { getFirebaseAdmin } = await import("@/lib/firebase-admin");
    const { db } = getFirebaseAdmin();
    const doc = await db.collection("ballot_cache").doc(cacheKey).get();
    if (!doc.exists) return null;
    const data = doc.data();
    if (!data) return null;
    // Cache valid for 6 hours
    const cachedAt = new Date(data.cachedAt as string);
    const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000);
    if (cachedAt < sixHoursAgo) return null;
    return { ...data, cached: true } as BallotData;
  } catch {
    return null;
  }
}

async function writeToFirestoreCache(cacheKey: string, data: BallotData) {
  try {
    const { getFirebaseAdmin } = await import("@/lib/firebase-admin");
    const { db } = getFirebaseAdmin();
    await db.collection("ballot_cache").doc(cacheKey).set({
      ...data,
      cachedAt: new Date().toISOString(),
    });
  } catch {
    // Non-critical
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address") || "";
  const zip = searchParams.get("zip") || "";

  const query = address || zip;
  if (!query) {
    return NextResponse.json({ error: "address or zip parameter required" }, { status: 400 });
  }

  const cacheKey = Buffer.from(query.toLowerCase().trim()).toString("base64");

  // 1. Check Firestore cache
  const cached = await getFromFirestoreCache(cacheKey);
  if (cached) {
    return NextResponse.json(cached, {
      headers: { "X-Cache": "HIT", "Cache-Control": "public, s-maxage=3600" },
    });
  }

  // 2. Fetch from Google Civic API
  const ballotData = await fetchFromCivicAPI(query);

  if (!ballotData) {
    return NextResponse.json(
      {
        error: "Could not retrieve ballot data. Check your address or try again.",
        jurisdiction: query,
        contests: [],
        election: null,
        pollingInfo: {},
        cached: false,
        source: "none",
      },
      { status: 200 } // Return 200 with empty data so UI can handle gracefully
    );
  }

  // 3. Enrich top candidates with Ballotpedia bios (first 3 contests, first 2 candidates each)
  const enriched = { ...ballotData };
  for (let i = 0; i < Math.min(3, enriched.contests.length); i++) {
    for (let j = 0; j < Math.min(2, enriched.contests[i].candidates.length); j++) {
      const cand = enriched.contests[i].candidates[j];
      const extra = await fetchBallotpediaCandidateBio(cand.name, enriched.contests[i].office);
      enriched.contests[i].candidates[j] = { ...cand, ...extra };
    }
  }

  // 4. Write to Firestore cache
  await writeToFirestoreCache(cacheKey, enriched);

  return NextResponse.json(enriched, {
    headers: { "X-Cache": "MISS", "Cache-Control": "public, s-maxage=3600" },
  });
}
