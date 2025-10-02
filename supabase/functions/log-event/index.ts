import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";
import { corsHeaders } from "../_shared/cors.ts";

const RATE_LIMIT = 60; // requests per minute per IP
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const rid = crypto.randomUUID();
  console.log(`[${rid}] Event logging started`);

  try {
    // Rate limiting by IP
    const clientIP = req.headers.get("x-forwarded-for") || "unknown";
    const now = Date.now();
    const rateLimitEntry = rateLimitMap.get(clientIP);

    if (rateLimitEntry) {
      if (now < rateLimitEntry.resetAt) {
        if (rateLimitEntry.count >= RATE_LIMIT) {
          return new Response(
            JSON.stringify({ ok: false, error: "Rate limit exceeded" }),
            {
              status: 429,
              headers: { ...corsHeaders, "Content-Type": "application/json" }
            }
          );
        }
        rateLimitEntry.count++;
      } else {
        rateLimitEntry.count = 1;
        rateLimitEntry.resetAt = now + 60000;
      }
    } else {
      rateLimitMap.set(clientIP, { count: 1, resetAt: now + 60000 });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const body = await req.json();
    const { type, role = "public", payload } = body;

    if (!type || !["page", "search", "listing_view"].includes(type)) {
      return new Response(
        JSON.stringify({ ok: false, error: "Invalid event type" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    if (!["public", "agent", "owner"].includes(role)) {
      return new Response(
        JSON.stringify({ ok: false, error: "Invalid role" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Insert into appropriate table
    let error: any;

    if (type === "page") {
      const { session_id, page, referrer, ua } = payload;
      const { error: insertError } = await supabase.from("page_events").insert({
        session_id,
        user_role: role,
        page,
        referrer,
        ua,
        ip: clientIP,
        meta: payload
      });
      error = insertError;
    } else if (type === "search") {
      const { session_id, query, results_count, duration_ms } = payload;
      const { error: insertError } = await supabase.from("search_events").insert({
        session_id,
        query,
        results_count,
        duration_ms
      });
      error = insertError;
    } else if (type === "listing_view") {
      const { session_id, listing_key, city, price } = payload;
      const { error: insertError } = await supabase.from("listing_views").insert({
        session_id,
        listing_key,
        city,
        price
      });
      error = insertError;
    }

    if (error) {
      console.error(`[${rid}] Insert error:`, error);
      return new Response(
        JSON.stringify({ ok: false, error: error.message }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    console.log(`[${rid}] Event logged: ${type}`);
    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error(`[${rid}] Error:`, error);
    return new Response(
      JSON.stringify({
        ok: false,
        error: error instanceof Error ? error.message : "Unknown error"
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
