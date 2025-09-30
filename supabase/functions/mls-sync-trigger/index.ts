import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";
import { getRealtynaToken, getRealtynaHeaders } from "../_shared/realtyna-auth.ts";

const RESO_BASE = "https://api.realtyfeed.com/reso/odata";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const rid = crypto.randomUUID();
  console.log(`[${rid}] MLS Sync Trigger started`);

  try {
    const { resource } = await req.json();

    if (!["Property", "Member", "Office", "OpenHouse"].includes(resource)) {
      return new Response(JSON.stringify({ error: "Invalid resource" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const sb = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Get last sync state
    const { data: syncState } = await sb
      .from("mls_sync_state")
      .select("last_mod")
      .eq("resource", resource)
      .single();

    const token = await getRealtynaToken();
    const headers = getRealtynaHeaders(token);

    // Build filter for incremental sync
    const filters: string[] = [];
    if (syncState?.last_mod) {
      filters.push(`ModificationTimestamp gt ${syncState.last_mod}`);
    }

    const filterStr = filters.length > 0 ? filters.join(" and ") : undefined;

    const queryParams = new URLSearchParams({
      "$top": "200",
      "$orderby": "ModificationTimestamp"
    });

    if (filterStr) {
      queryParams.set("$filter", filterStr);
    }

    const apiUrl = `${RESO_BASE}/${resource}?${queryParams}`;
    console.log(`[${rid}] Syncing ${resource}: ${apiUrl}`);

    const response = await fetch(apiUrl, { headers });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[${rid}] API error ${response.status}:`, errorText);
      
      // Log sync failure
      await sb.from("mls_sync_state").upsert({
        resource,
        last_run: new Date().toISOString(),
        notes: `Error ${response.status}: ${errorText}`
      });

      return new Response(JSON.stringify({
        error: `Realtyna API error: ${response.status}`,
        details: errorText
      }), {
        status: response.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const data = await response.json();
    const items = data.value || [];

    console.log(`[${rid}] Fetched ${items.length} ${resource} records`);

    // Upsert to appropriate table
    let tableName = "";
    let transformed: any[] = [];

    if (resource === "Property") {
      tableName = "mls_listings";
      transformed = items.map((p: any) => ({
        listing_key: p.ListingKey,
        listing_id: p.ListingId,
        list_price: p.ListPrice,
        city: p.City,
        standard_status: p.StandardStatus,
        bedrooms_total: p.BedroomsTotal,
        bathrooms_total_integer: p.BathroomsTotalInteger,
        living_area: p.LivingArea,
        modification_timestamp: p.ModificationTimestamp,
        updated_at: new Date().toISOString()
      }));
    } else if (resource === "Member") {
      tableName = "mls_members";
      transformed = items.map((m: any) => ({
        member_key: m.MemberKey,
        member_id: m.MemberId,
        member_full_name: m.MemberFullName,
        member_first_name: m.MemberFirstName,
        member_last_name: m.MemberLastName,
        member_email: m.MemberEmail,
        member_phone: m.MemberPhone,
        member_mobile_phone: m.MemberMobilePhone,
        office_key: m.OfficeKey,
        member_status: m.MemberStatus,
        modification_timestamp: m.ModificationTimestamp,
        updated_at: new Date().toISOString()
      }));
    } else if (resource === "Office") {
      tableName = "mls_offices";
      transformed = items.map((o: any) => ({
        office_key: o.OfficeKey,
        office_id: o.OfficeId,
        office_name: o.OfficeName,
        office_phone: o.OfficePhone,
        office_email: o.OfficeEmail,
        office_address1: o.OfficeAddress1,
        office_city: o.OfficeCity,
        office_state_or_province: o.OfficeStateOrProvince,
        office_postal_code: o.OfficePostalCode,
        office_status: o.OfficeStatus,
        modification_timestamp: o.ModificationTimestamp,
        updated_at: new Date().toISOString()
      }));
    } else if (resource === "OpenHouse") {
      tableName = "mls_open_houses";
      transformed = items.map((oh: any) => ({
        open_house_key: oh.OpenHouseKey,
        open_house_id: oh.OpenHouseId,
        listing_key: oh.ListingKey,
        open_house_date: oh.OpenHouseDate,
        open_house_start_time: oh.OpenHouseStartTime,
        open_house_end_time: oh.OpenHouseEndTime,
        showing_agent_key: oh.ShowingAgentKey,
        modification_timestamp: oh.ModificationTimestamp,
        updated_at: new Date().toISOString()
      }));
    }

    if (transformed.length > 0) {
      const { error: upsertError } = await sb.from(tableName).upsert(transformed);
      
      if (upsertError) {
        console.error(`[${rid}] Upsert error:`, upsertError);
        throw upsertError;
      }
    }

    // Update sync state
    const lastMod = items.length > 0 ? items[items.length - 1].ModificationTimestamp : syncState?.last_mod;
    
    await sb.from("mls_sync_state").upsert({
      resource,
      last_run: new Date().toISOString(),
      last_mod: lastMod,
      notes: `Success: ${items.length} records synced`
    });

    console.log(`[${rid}] Sync complete: ${items.length} records upserted`);

    return new Response(JSON.stringify({
      success: true,
      resource,
      records: items.length,
      lastMod
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error(`[${rid}] Error:`, error);
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : "Unknown error"
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
