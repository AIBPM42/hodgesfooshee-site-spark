// supabase/functions/sync_realtyna/index.ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ====== ENV ======
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY   = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const sb = createClient(SUPABASE_URL, SERVICE_KEY);

const BASE        = Deno.env.get("REALTYFEED_BASE")!;            // e.g. https://api.realtyfeed.com
const API_KEY     = Deno.env.get("REALTYFEED_API_KEY")!;
const CLIENT_ID   = Deno.env.get("REALTYFEED_CLIENT_ID")!;
const CLIENT_SECRET = Deno.env.get("REALTYFEED_CLIENT_SECRET")!;
const SCOPE       = Deno.env.get("REALTYFEED_SCOPE") ?? "api:read";

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
  const body = new URLSearchParams({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    grant_type: "client_credentials",
    scope: SCOPE,
  });

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      "x-api-key": API_KEY,
      "Accept": "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });
  if (!res.ok) throw new Error(`token ${res.status}: ${await res.text()}`);
  const json = await res.json();
  return json.access_token as string;
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
      "x-api-key": API_KEY,
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
      nextUrl =
        `${RESO_BASE}/Property?` +
        `$top=200&` +
        `$select=ListingKey,ListingId,ListPrice,City,StandardStatus,` +
        `BedroomsTotal,BathroomsTotalInteger,LivingArea,ModificationTimestamp,RFModificationTimestamp` +
        `${filter}&$orderby=RFModificationTimestamp asc`;
    }

    let total = 0;
    // Safety caps to prevent runaway loops
    const MAX_PAGES = 50;
    const PACE_MS = 120; // ~ gentle pace to stay under Smart plan 10 RPS
    for (let i = 0; i < MAX_PAGES; i++) {
      const res = await fetchWithBackoff(nextUrl!, headers);
      const json = await res.json();

      if (!res.ok) {
        console.error("sync_realtyna page error:", res.status, json);
        return new Response(
          JSON.stringify({ ok: false, status: res.status, error: json }),
          { status: 500, headers: CORS_HEADERS }
        );
      }

      const items = json.value ?? [];
      await upsertBatch(items);
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

    return new Response(
      JSON.stringify({ ok: true, total, state }),
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