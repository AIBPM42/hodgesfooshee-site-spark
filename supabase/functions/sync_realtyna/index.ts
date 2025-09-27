// supabase/functions/sync_realtyna/index.ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Environment variable helper with fallbacks
function getEnv(name: string, aliases: string[] = []) {
  for (const k of [name, ...aliases]) {
    const v = Deno.env.get(k);
    if (v && v.trim()) return v;
  }
  throw new Error(`Missing env: one of ${[name, ...aliases].join(", ")}`);
}

// ====== ENV ======
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY   = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const sb = createClient(SUPABASE_URL, SERVICE_KEY);

const MLS_CLIENT_ID     = getEnv("MLS_CLIENT_ID",     ["REALTYNA_CLIENT_ID","RF_CLIENT_ID"]);
const MLS_CLIENT_SECRET = getEnv("MLS_CLIENT_SECRET", ["REALTYNA_CLIENT_SECRET","RF_CLIENT_SECRET"]);
const REALTYNA_API_KEY  = getEnv("REALTYNA_API_KEY",  ["MLS_API_KEY","RF_API_KEY", "REALTY_API_KEY"]);

console.log("[env] using", {
  MLS_CLIENT_ID: MLS_CLIENT_ID.slice(0,4) + "...",
  MLS_CLIENT_SECRET: "***",
  REALTYNA_API_KEY: REALTYNA_API_KEY.slice(0,4) + "..."
});

const BASE        = Deno.env.get("RF_BASE") ?? "https://api.realtyfeed.com";
const SCOPE       = Deno.env.get("RF_SCOPE") ?? "api/read";

const TOKEN_URL   = `${BASE}/v1/auth/token`;
const RESO_BASE   = `${BASE}/reso/odata`;

// ====== CORS ======
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,OPTIONS",
  "Access-Control-Allow-Headers": "authorization, content-type, x-api-key",
  "Content-Type": "application/json",
};

// ====== Helpers ======
async function getToken(): Promise<string> {
  const tokenRes = await fetch("https://api.realtyfeed.com/v1/auth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: MLS_CLIENT_ID,
      client_secret: MLS_CLIENT_SECRET,
      scope: "api/read"
    })
  });
  
  if (!tokenRes.ok) {
    const errorText = await tokenRes.text();
    console.error("Token request failed:", tokenRes.status, errorText);
    throw new Error(`token ${tokenRes.status}: ${errorText}`);
  }
  
  const { access_token } = await tokenRes.json();
  console.log("Token acquired successfully");
  return access_token;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function fetchWithBackoff(url: string, headers: HeadersInit, tries = 5) {
  let delay = 250;
  for (let i = 0; i < tries; i++) {
    const res = await fetch(url, { headers });
    if (res.status !== 429) return res;
    await sleep(delay);
    delay = Math.min(4000, delay * 2); // 250 → 500 → 1000 → 2000 → 4000
  }
  return fetch(url, { headers }); // final attempt
}

async function getState() {
  const { data } = await sb
    .from("ingest_state")
    .select("value")
    .eq("key", "property_sync")
    .maybeSingle();
  return (data?.value as any) || {};
}

async function setState(value: any) {
  await sb
    .from("ingest_state")
    .upsert({ key: "property_sync", value, updated_at: new Date().toISOString() });
}

async function clearState() {
  await sb.from("ingest_state").delete().eq("key", "property_sync");
}

// Map + upsert into mls_listings keyed by listing_key
async function upsertBatch(items: any[]) {
  if (!items?.length) return;
  const rows = items
    .map((p: any) => ({
      listing_key: p.ListingKey?.toString(),
      listing_id: p.ListingId ?? null,
      list_price: p.ListPrice ?? null,
      city: p.City ?? null,
      standard_status: p.StandardStatus ?? null,
      bedrooms_total: p.BedroomsTotal ?? null,
      bathrooms_total_integer: p.BathroomsTotalInteger ?? null,
      living_area: p.LivingArea ?? null,
      modification_timestamp: p.ModificationTimestamp
        ? new Date(p.ModificationTimestamp).toISOString()
        : null,
      rf_modification_timestamp: p.RFModificationTimestamp
        ? new Date(p.RFModificationTimestamp).toISOString()
        : null,
      updated_at: new Date().toISOString(),
    }))
    .filter((r: any) => r.listing_key); // require a key

  if (!rows.length) return;
  const { error } = await sb.from("mls_listings").upsert(rows, { onConflict: "listing_key" });
  if (error) throw error;
}

// ====== Handler ======
serve(async (req) => {
  try {
    if (req.method === "OPTIONS") {
      return new Response(null, { headers: CORS_HEADERS });
    }

    // optional query param: ?reset=true to clear high-water mark
    const url = new URL(req.url);
    const reset = url.searchParams.get("reset") === "true";
    if (reset) await clearState();

    const token = await getToken();
    const headers = {
      "x-api-key": REALTYNA_API_KEY,
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
      "Prefer": "odata.maxpagesize=200", // hint page size
    };

    let state = await getState();
    let nextUrl: string | undefined = state.nextLink;

    // Build initial page if not resuming via @odata.nextLink
    if (!nextUrl) {
      const since = state.lastRFModified as string | undefined;
      const filter = since ? `&$filter=RFModificationTimestamp gt ${since}` : "";
      console.log("Building initial URL with filter:", filter);
      nextUrl =
        `${RESO_BASE}/Property?` +
        `$top=200&` +
        `$select=ListingKey,ListingId,ListPrice,City,StandardStatus,BedroomsTotal,` +
        `BathroomsTotalInteger,LivingArea,ModificationTimestamp,RFModificationTimestamp` +
        `${filter}&$orderby=RFModificationTimestamp asc`;
      console.log("Initial URL:", nextUrl);
    }

    let total = 0;
    let pages_fetched = 0;
    let items_inserted = 0;
    // Safety caps to prevent runaway loops
    const MAX_PAGES = 50;  // Process up to 50 pages
    const PACE_MS = 120; // ~ gentle pace to stay under Smart plan 10 RPS
    
    console.log("Starting sync with MAX_PAGES:", MAX_PAGES);
    
    for (let i = 0; i < MAX_PAGES; i++) {
      console.log(`Fetching page ${i + 1}, URL: ${nextUrl}`);
      const res = await fetchWithBackoff(nextUrl!, headers);
      
      console.log(`API Response - Status: ${res.status}, Headers:`, Object.fromEntries(res.headers.entries()));
      
      const responseText = await res.text();
      console.log(`Raw response body length: ${responseText.length}`);
      
      let json;
      try {
        json = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Failed to parse JSON response:", parseError);
        console.log("Response text preview:", responseText.slice(0, 500));
        throw new Error("Invalid JSON response from API");
      }

      if (!res.ok) {
        console.error("sync_realtyna page error:", res.status, json);
        return new Response(
          JSON.stringify({ ok: false, status: res.status, error: json }),
          { status: 500, headers: CORS_HEADERS }
        );
      }

      pages_fetched++;
      
      const items = json.value ?? [];
      console.log(`Found ${items.length} items in response.value`);
      
      if (items.length === 0) {
        console.log("No items found. Full response structure:", JSON.stringify(json, null, 2).slice(0, 1000));
      } else {
        console.log("First item keys:", Object.keys(items[0] || {}));
        console.log("Sample ListingKey values:", items.slice(0, 3).map((i: any) => i.ListingKey));
      }
      
      await upsertBatch(items);
      items_inserted += items.length;
      total += items.length;

      // Update high-water mark and nextLink
      const lastRF = items.length
        ? items[items.length - 1].RFModificationTimestamp
        : state.lastRFModified;

      state = {
        lastRFModified: lastRF ?? state.lastRFModified,
        nextLink: json["@odata.nextLink"],
      };
      await setState(state);

      if (!json["@odata.nextLink"]) break;
      nextUrl = json["@odata.nextLink"];
      await sleep(PACE_MS);
    }

    console.log(`SYNC COMPLETE - Pages: ${pages_fetched}, Items processed: ${total}, Items inserted: ${items_inserted}`);
    
    return new Response(
      JSON.stringify({ 
        ok: true, 
        total, 
        pages_fetched, 
        items_processed: total,
        items_inserted,
        state 
      }),
      { headers: CORS_HEADERS }
    );
  } catch (e) {
    console.error("sync_realtyna fatal:", e);
    return new Response(
      JSON.stringify({ ok: false, error: String(e) }),
      { status: 500, headers: CORS_HEADERS }
    );
  }
});