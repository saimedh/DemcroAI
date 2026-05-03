import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messageContent, messageIndex, sessionId, reason } = body as {
      messageContent: string;
      messageIndex: number;
      sessionId: string;
      reason: string;
    };

    if (!reason?.trim()) {
      return NextResponse.json({ error: "Reason is required" }, { status: 400 });
    }

    // Try to write to Firestore if configured
    let flagId = `flag-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    try {
      const { getFirebaseAdmin } = await import("@/lib/firebase-admin");
      const { db } = getFirebaseAdmin();

      const ref = await db.collection("content_flags").add({
        sessionId: sessionId || "anonymous",
        messageIndex,
        messageContent: messageContent?.slice(0, 500) || "",
        flagReason: reason,
        status: "pending",
        createdAt: new Date().toISOString(),
        reviewerNotes: null,
      });

      flagId = ref.id;
    } catch (fbErr) {
      // Firestore not configured — log and continue (flag still gets an ID)
      console.warn("Firestore not available for flag storage:", fbErr);
    }

    return NextResponse.json({
      flagId,
      message: "Thank you — your report has been logged for human review.",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
