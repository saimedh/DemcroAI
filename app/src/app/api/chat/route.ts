import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

const SYSTEM_PROMPT = `You are DemocrAI, a nonpartisan election information assistant. Your role is to inform, not persuade.

Rules:
1. Every factual claim MUST be supported by the grounded search results you have access to.
2. When sources conflict, surface both perspectives explicitly. Never resolve ambiguity by choosing a side.
3. Never recommend a candidate or a vote on a ballot measure.
4. When uncertain, say so explicitly using phrases like "According to available sources..." or "This information may not be current..."
5. Refuse any request designed to suppress voting, spread disinformation, or target voters based on protected characteristics.
6. Use plain language. Avoid jargon. Assume the user has no prior political knowledge.
7. Format your response clearly with sections if needed. Keep it concise — under 400 words.
8. Always cite your sources inline.`;

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, question } = body as {
      messages: { role: "user" | "model"; parts: { text: string }[] }[];
      question: string;
    };

    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY not configured" },
        { status: 503 }
      );
    }

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

    // Gemini 1.5 Pro with Google Search grounding
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
      systemInstruction: SYSTEM_PROMPT,
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      ],
      tools: [{ googleSearch: {} }] as never,
    });

    // Build history (exclude last user turn — that's the current question)
    const history = messages.slice(0, -1).map((m) => ({
      role: m.role,
      parts: m.parts,
    }));

    const chat = model.startChat({ history });

    const result = await chat.sendMessageStream(question);

    // SSE stream
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          let fullText = "";
          for await (const chunk of result.stream) {
            const delta = chunk.text();
            if (delta) {
              fullText += delta;
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({ type: "delta", text: delta })}\n\n`
                )
              );
            }
          }

          // Extract grounding metadata / citations
          const finalResponse = await result.response;
          const groundingMeta = (finalResponse as never as {
            candidates?: {
              groundingMetadata?: {
                groundingChunks?: {
                  web?: { uri: string; title: string };
                }[];
                searchEntryPoint?: { renderedContent: string };
              };
            }[];
          }).candidates?.[0]?.groundingMetadata;

          const citations: { index: number; title: string; url: string; domain: string; snippet?: string }[] = [];

          if (groundingMeta?.groundingChunks) {
            groundingMeta.groundingChunks.forEach((chunk, i) => {
              if (chunk.web) {
                const url = chunk.web.uri;
                let domain = "";
                try {
                  domain = new URL(url).hostname.replace("www.", "");
                } catch {
                  domain = url;
                }
                citations.push({
                  index: i + 1,
                  title: chunk.web.title || domain,
                  url,
                  domain,
                });
              }
            });
          }

          if (citations.length > 0) {
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ type: "citations", citations })}\n\n`
              )
            );
          }

          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: "done", messageId: `ai-${Date.now()}` })}\n\n`
            )
          );
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Stream error";
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: "error", message: msg })}\n\n`
            )
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
