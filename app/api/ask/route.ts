import { NextResponse } from "next/server";
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { z } from "zod";

// Force dynamic rendering - don't pre-render at build time
export const dynamic = 'force-dynamic';


// ========================================
// Types
// ========================================
export type Citation = {
  title: string;
  chunk: string;
};

export type AskResponse = {
  ok: boolean;
  answer?: string;
  citations?: Citation[];
  confidence?: "High" | "Medium" | "Low";
  error?: string;
};

// ========================================
// Validation Schema
// ========================================
const askSchema = z.object({
  sessionId: z.string().min(1, "sessionId is required"),
  action: z.literal("sendMessage"),
  chatInput: z.string().min(1, "chatInput is required"),
});

// ========================================
// Response Normalizer
// ========================================
export function normalizeN8n(data: any): AskResponse {
  // Handle n8n error responses
  if (!data || typeof data !== "object") {
    return { ok: false, error: "Invalid response from n8n" };
  }

  // Extract fields (adjust based on your n8n workflow output)
  const answer = data.answer || data.output || data.text || data.response;
  const citations = data.citations || data.sources || [];
  const confidence = data.confidence || data.score;

  // If no answer field found, return error
  if (!answer) {
    return { ok: false, error: "No answer field in n8n response" };
  }

  // Normalize confidence to "High" | "Medium" | "Low"
  let normalizedConfidence: "High" | "Medium" | "Low" | undefined;
  if (confidence) {
    if (typeof confidence === "string") {
      const lower = confidence.toLowerCase();
      if (lower.includes("high")) normalizedConfidence = "High";
      else if (lower.includes("med")) normalizedConfidence = "Medium";
      else if (lower.includes("low")) normalizedConfidence = "Low";
    } else if (typeof confidence === "number") {
      // Score-based confidence (0.0 - 1.0)
      if (confidence >= 0.8) normalizedConfidence = "High";
      else if (confidence >= 0.5) normalizedConfidence = "Medium";
      else normalizedConfidence = "Low";
    }
  }

  // Normalize citations to Citation[]
  const normalizedCitations: Citation[] = Array.isArray(citations)
    ? citations.map((c: any) => ({
        title: c.title || c.name || c.source || "Unknown",
        chunk: c.chunk || c.text || c.content || "",
      }))
    : [];

  return {
    ok: true,
    answer,
    citations: normalizedCitations.length > 0 ? normalizedCitations : undefined,
    confidence: normalizedConfidence,
  };
}

// ========================================
// POST Handler
// ========================================
export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json();

    // Validate input
    const parsed = askSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Invalid input: " + parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    // Get authenticated user from session
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();

    // Get userId - prefer from session, fallback to request body
    const userId = user?.id || null;

    console.log(`🔐 User authentication: userId=${userId || 'anonymous'}`);

    // Check for N8N_WEBHOOK_URL
    const n8nUrl = process.env.N8N_WEBHOOK_URL;
    if (!n8nUrl) {
      console.error("❌ N8N_WEBHOOK_URL is not configured in .env.local");
      return NextResponse.json(
        {
          ok: false,
          error: "Server misconfigured: N8N_WEBHOOK_URL not found. Please add it to .env.local",
        },
        { status: 500 }
      );
    }

    // Forward request to n8n with userId for scoped vector search
    const { sessionId, action, chatInput } = parsed.data;
    console.log(`🚀 Forwarding to n8n: sessionId=${sessionId}, userId=${userId || 'none'}, chatInput="${chatInput.slice(0, 50)}..."`);

    const n8nResponse = await fetch(n8nUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ sessionId, action, chatInput, userId }),
    });

    // Handle n8n errors
    if (!n8nResponse.ok) {
      console.error(`❌ n8n returned ${n8nResponse.status}: ${n8nResponse.statusText}`);
      return NextResponse.json(
        {
          ok: false,
          error: `n8n webhook failed: ${n8nResponse.status} ${n8nResponse.statusText}`,
        },
        { status: 502 }
      );
    }

    // Parse and normalize n8n response
    const n8nData = await n8nResponse.json();
    console.log("✅ n8n response received:", JSON.stringify(n8nData).slice(0, 200));

    const normalized = normalizeN8n(n8nData);

    // Return error if normalization failed
    if (!normalized.ok) {
      return NextResponse.json(normalized, { status: 502 });
    }

    // Success!
    return NextResponse.json(normalized, { status: 200 });
  } catch (error: any) {
    console.error("💥 Unexpected error in /api/ask:", error);
    return NextResponse.json(
      { ok: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
