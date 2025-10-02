import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";
import { getRealtynaToken } from "../_shared/realtyna-auth.ts";
import { getRealtynaBaseUrl, getRealtynaHeaders, fetchWithRetry } from "../_shared/realtyna-client.ts";

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

interface ResourceConfig {
  table: string;
  endpoint: string;
  selectFields: string;
  orderBy: string;
  mapFn: (item: any) => any;
}

const RESOURCES: Record<string, ResourceConfig> = {
  Property: {
    table: 'mls_listings',
    endpoint: 'Property',
    selectFields: 'ListingKey,ListingId,ListPrice,City,StandardStatus,BedroomsTotal,BathroomsTotalInteger,LivingArea,ModificationTimestamp,RFModificationTimestamp,ListingAgentKey,ListingOfficeKey,DaysOnMarket',
    orderBy: 'RFModificationTimestamp asc',
    mapFn: (item) => ({
      listing_key: item.ListingKey,
      listing_id: item.ListingId,
      list_price: item.ListPrice,
      city: item.City,
      standard_status: item.StandardStatus,
      bedrooms_total: item.BedroomsTotal,
      bathrooms_total_integer: item.BathroomsTotalInteger,
      living_area: item.LivingArea,
      modification_timestamp: item.ModificationTimestamp,
      rf_modification_timestamp: item.RFModificationTimestamp,
      listing_agent_key: item.ListingAgentKey,
      listing_office_key: item.ListingOfficeKey,
      days_on_market: item.DaysOnMarket
    })
  },
  Member: {
    table: 'mls_members',
    endpoint: 'Member',
    selectFields: 'MemberKey,MemberId,MemberLoginId,MemberFirstName,MemberLastName,MemberFullName,MemberEmail,MemberMobilePhone,OfficeKey,OfficeName,MemberStatus,MemberType,ModificationTimestamp,RFModificationTimestamp',
    orderBy: 'RFModificationTimestamp asc',
    mapFn: (item) => ({
      member_key: item.MemberKey,
      member_id: item.MemberId,
      member_login_id: item.MemberLoginId,
      member_first_name: item.MemberFirstName,
      member_last_name: item.MemberLastName,
      member_full_name: item.MemberFullName,
      member_email: item.MemberEmail,
      member_mobile_phone: item.MemberMobilePhone,
      office_key: item.OfficeKey,
      office_name: item.OfficeName,
      member_status: item.MemberStatus,
      member_type: item.MemberType,
      modification_timestamp: item.ModificationTimestamp,
      rf_modification_timestamp: item.RFModificationTimestamp
    })
  },
  Office: {
    table: 'mls_offices',
    endpoint: 'Office',
    selectFields: 'OfficeKey,OfficeId,OfficeName,OfficePhone,OfficeEmail,OfficeAddress1,OfficeCity,OfficeStateOrProvince,OfficePostalCode,OfficeCountry,OfficeStatus,ModificationTimestamp,RFModificationTimestamp',
    orderBy: 'RFModificationTimestamp asc',
    mapFn: (item) => ({
      office_key: item.OfficeKey,
      office_id: item.OfficeId,
      office_name: item.OfficeName,
      office_phone: item.OfficePhone,
      office_email: item.OfficeEmail,
      office_address1: item.OfficeAddress1,
      office_city: item.OfficeCity,
      office_state_or_province: item.OfficeStateOrProvince,
      office_postal_code: item.OfficePostalCode,
      office_country: item.OfficeCountry,
      office_status: item.OfficeStatus,
      modification_timestamp: item.ModificationTimestamp,
      rf_modification_timestamp: item.RFModificationTimestamp
    })
  },
  OpenHouse: {
    table: 'mls_open_houses',
    endpoint: 'OpenHouse',
    selectFields: 'OpenHouseKey,OpenHouseId,ListingKey,OpenHouseDate,OpenHouseStartTime,OpenHouseEndTime,ShowingAgentKey,ShowingAgentFirstName,ShowingAgentLastName,OpenHouseRemarks,ModificationTimestamp,RFModificationTimestamp',
    orderBy: 'RFModificationTimestamp asc',
    mapFn: (item) => ({
      open_house_key: item.OpenHouseKey,
      open_house_id: item.OpenHouseId,
      listing_key: item.ListingKey,
      open_house_date: item.OpenHouseDate,
      open_house_start_time: item.OpenHouseStartTime,
      open_house_end_time: item.OpenHouseEndTime,
      showing_agent_key: item.ShowingAgentKey,
      showing_agent_first_name: item.ShowingAgentFirstName,
      showing_agent_last_name: item.ShowingAgentLastName,
      open_house_remarks: item.OpenHouseRemarks,
      modification_timestamp: item.ModificationTimestamp,
      rf_modification_timestamp: item.RFModificationTimestamp
    })
  }
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const syncLogId = crypto.randomUUID();
  const startTime = new Date();

  try {
    console.log(`[sync-incremental-${syncLogId}] Starting incremental sync`);

    // Get auth token
    const token = await getRealtynaToken();
    const baseUrl = getRealtynaBaseUrl();
    const headers = getRealtynaHeaders(token);

    const results: Record<string, { fetched: number; inserted: number }> = {};

    // Process each resource
    for (const [resourceName, config] of Object.entries(RESOURCES)) {
      console.log(`[sync-incremental-${syncLogId}] Processing ${resourceName}`);

      // Get last sync cursor
      const { data: cursor } = await supabase
        .from('mls_sync_cursor')
        .select('last_rf_modification_timestamp')
        .eq('resource', resourceName)
        .single();

      const lastTimestamp = cursor?.last_rf_modification_timestamp || '2020-01-01T00:00:00Z';
      console.log(`[sync-incremental-${syncLogId}] ${resourceName} last sync: ${lastTimestamp}`);

      let fetched = 0;
      let inserted = 0;
      let skip = 0;
      const top = 200;
      let hasMore = true;
      let latestTimestamp = lastTimestamp;

      while (hasMore) {
        const filter = `RFModificationTimestamp ge ${lastTimestamp}`;
        const url = `${baseUrl}/${config.endpoint}?$filter=${encodeURIComponent(filter)}&$orderby=${encodeURIComponent(config.orderBy)}&$select=${config.selectFields}&$top=${top}&$skip=${skip}`;

        console.log(`[sync-incremental-${syncLogId}] Fetching ${resourceName} page (skip: ${skip})`);

        const response = await fetchWithRetry(url, { headers });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`[sync-incremental-${syncLogId}] ${resourceName} fetch failed: ${response.status}`, errorText.substring(0, 300));
          throw new Error(`Failed to fetch ${resourceName}: ${response.status}`);
        }

        const data = await response.json();
        const items = data.value || [];
        fetched += items.length;

        if (items.length === 0) {
          hasMore = false;
          break;
        }

        // Map and upsert
        const mappedItems = items.map(config.mapFn);
        
        if (mappedItems.length > 0) {
          const { error } = await supabase
            .from(config.table)
            .upsert(mappedItems, { onConflict: Object.keys(mappedItems[0])[0] });

          if (error) {
            console.error(`[sync-incremental-${syncLogId}] ${resourceName} upsert error:`, error);
          } else {
            inserted += mappedItems.length;
          }

          // Track latest timestamp
          const lastItem = items[items.length - 1];
          if (lastItem.RFModificationTimestamp && lastItem.RFModificationTimestamp > latestTimestamp) {
            latestTimestamp = lastItem.RFModificationTimestamp;
          }
        }

        if (items.length < top) {
          hasMore = false;
        } else {
          skip += top;
        }
      }

      // Update cursor
      await supabase
        .from('mls_sync_cursor')
        .update({ last_rf_modification_timestamp: latestTimestamp, updated_at: new Date().toISOString() })
        .eq('resource', resourceName);

      results[resourceName] = { fetched, inserted };
      console.log(`[sync-incremental-${syncLogId}] ${resourceName} complete: fetched=${fetched}, inserted=${inserted}`);
    }

    // Log to sync_log
    await supabase.from('sync_log').insert({
      function_name: 'realtyna_sync_incremental',
      success: true,
      records_processed: Object.values(results).reduce((sum, r) => sum + r.fetched, 0),
      inserted: Object.values(results).reduce((sum, r) => sum + r.inserted, 0),
      fetched: Object.values(results).reduce((sum, r) => sum + r.fetched, 0),
      completed_at: new Date().toISOString(),
      metadata: { results, sync_log_id: syncLogId }
    });

    console.log(`[sync-incremental-${syncLogId}] Sync complete:`, results);

    return new Response(
      JSON.stringify({ 
        success: true, 
        results,
        duration_ms: Date.now() - startTime.getTime()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error(`[sync-incremental-${syncLogId}] Error:`, error);

    await supabase.from('sync_log').insert({
      function_name: 'realtyna_sync_incremental',
      success: false,
      message: error.message,
      completed_at: new Date().toISOString(),
      metadata: { sync_log_id: syncLogId, error: error.toString() }
    });

    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
