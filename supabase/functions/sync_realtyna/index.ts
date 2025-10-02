// supabase/functions/sync_realtyna/index.ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders, createErrorResponse, createSuccessResponse } from '../_shared/cors.ts';
import { getRealtynaToken } from '../_shared/realtyna-auth.ts';
import { getRealtynaBaseUrl, getRealtynaHeaders, fetchWithRetry } from '../_shared/realtyna-client.ts';

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const sb = createClient(SUPABASE_URL, SERVICE_KEY);

interface EntityResult {
  fetched: number;
  upserted: number;
  errors: number;
}

serve(async (req) => {
  const rid = crypto.randomUUID().substring(0, 8);
  console.log(`[${rid}] sync_realtyna started`);
  
  try {
    if (req.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(req.url);
    const mode = url.searchParams.get("mode") || "test";
    const startTime = Date.now();

    // Validate env
    try {
      getRealtynaBaseUrl();
    } catch (error: any) {
      if (error.message.includes('ENV_MISSING')) {
        return createErrorResponse('edge.sync_realtyna', 'ENV_MISSING', error.message, 500);
      }
      throw error;
    }

    console.log(`[${rid}] Mode: ${mode}`);

    // Get auth token
    let token: string;
    try {
      token = await getRealtynaToken();
    } catch (error: any) {
      console.error(`[${rid}] Token error:`, error);
      return createErrorResponse(
        'edge.sync_realtyna',
        'TOKEN_FAILED',
        error.message || 'Failed to obtain access token',
        500
      );
    }

    const headers = getRealtynaHeaders(token);
    const RESO_BASE = getRealtynaBaseUrl();

    const entities = [
      { name: 'Property', table: 'mls_listings', key: 'ListingKey' },
      { name: 'Member', table: 'mls_members', key: 'MemberKey' },
      { name: 'OpenHouse', table: 'mls_open_houses', key: 'OpenHouseKey' },
      { name: 'Office', table: 'mls_offices', key: 'OfficeKey' }
    ];

    const results: Record<string, EntityResult> = {};

    for (const entity of entities) {
      console.log(`[${rid}] Syncing ${entity.name}...`);
      const result: EntityResult = { fetched: 0, upserted: 0, errors: 0 };

      try {
        const limit = mode === 'test' ? 25 : 200;
        const queryParams = new URLSearchParams({
          '$top': limit.toString(),
          '$orderby': 'ModificationTimestamp desc',
          '$select': '*'
        });

        const apiUrl = `${RESO_BASE}/${entity.name}?${queryParams}`;
        console.log(`[${rid}] Fetching: ${apiUrl.substring(0, 150)}...`);

        const response = await fetchWithRetry(apiUrl, { headers }, 2);

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`[${rid}] ${entity.name} API error ${response.status}:`, errorText.substring(0, 500));
          result.errors = 1;
          results[entity.name] = result;
          continue;
        }

        const data = await response.json();
        const items = data.value || [];
        result.fetched = items.length;

        console.log(`[${rid}] ${entity.name}: fetched ${items.length} items`);

        if (items.length > 0) {
          // Map and upsert based on entity type
          let rows: any[] = [];

          if (entity.name === 'Property') {
            rows = items.map((p: any) => ({
              listing_key: p.ListingKey?.toString(),
              listing_id: p.ListingId || null,
              list_price: p.ListPrice || null,
              city: p.City || null,
              standard_status: p.StandardStatus || null,
              bedrooms_total: p.BedroomsTotal || null,
              bathrooms_total_integer: p.BathroomsTotalInteger || null,
              living_area: p.LivingArea || null,
              modification_timestamp: p.ModificationTimestamp ? new Date(p.ModificationTimestamp).toISOString() : null,
              rf_modification_timestamp: p.RFModificationTimestamp ? new Date(p.RFModificationTimestamp).toISOString() : null,
              updated_at: new Date().toISOString(),
            })).filter(r => r.listing_key);
          } else if (entity.name === 'Member') {
            rows = items.map((m: any) => ({
              member_key: m.MemberKey?.toString(),
              member_id: m.MemberId || null,
              member_full_name: m.MemberFullName || null,
              member_first_name: m.MemberFirstName || null,
              member_last_name: m.MemberLastName || null,
              member_email: m.MemberEmail || null,
              member_phone: m.MemberPreferredPhone || null,
              member_mobile_phone: m.MemberMobilePhone || null,
              office_key: m.OfficeKey || null,
              modification_timestamp: m.ModificationTimestamp ? new Date(m.ModificationTimestamp).toISOString() : null,
              rf_modification_timestamp: m.RFModificationTimestamp ? new Date(m.RFModificationTimestamp).toISOString() : null,
              updated_at: new Date().toISOString(),
            })).filter(r => r.member_key);
          } else if (entity.name === 'OpenHouse') {
            rows = items.map((oh: any) => ({
              open_house_key: oh.OpenHouseKey?.toString(),
              open_house_id: oh.OpenHouseId || null,
              listing_key: oh.ListingKey || null,
              open_house_date: oh.OpenHouseDate || null,
              open_house_start_time: oh.OpenHouseStartTime || null,
              open_house_end_time: oh.OpenHouseEndTime || null,
              modification_timestamp: oh.ModificationTimestamp ? new Date(oh.ModificationTimestamp).toISOString() : null,
              rf_modification_timestamp: oh.RFModificationTimestamp ? new Date(oh.RFModificationTimestamp).toISOString() : null,
              updated_at: new Date().toISOString(),
            })).filter(r => r.open_house_key);
          } else if (entity.name === 'Office') {
            rows = items.map((o: any) => ({
              office_key: o.OfficeKey?.toString(),
              office_id: o.OfficeId || null,
              office_name: o.OfficeName || null,
              office_phone: o.OfficePhone || null,
              office_email: o.OfficeEmail || null,
              office_city: o.OfficeCity || null,
              modification_timestamp: o.ModificationTimestamp ? new Date(o.ModificationTimestamp).toISOString() : null,
              rf_modification_timestamp: o.RFModificationTimestamp ? new Date(o.RFModificationTimestamp).toISOString() : null,
              updated_at: new Date().toISOString(),
            })).filter(r => r.office_key);
          }

          if (rows.length > 0) {
            const { error } = await sb.from(entity.table as any).upsert(rows, { 
              onConflict: entity.key.toLowerCase().replace(/([A-Z])/g, '_$1').toLowerCase()
            });

            if (error) {
              console.error(`[${rid}] ${entity.name} upsert error:`, error);
              result.errors = 1;
            } else {
              result.upserted = rows.length;
              console.log(`[${rid}] ${entity.name}: upserted ${rows.length} rows`);
            }
          }
        }

        // Update sync state
        await sb.from('mls_sync_state').upsert({
          resource: entity.name,
          last_run: new Date().toISOString(),
          last_mod: items[0]?.ModificationTimestamp || null,
          notes: result.errors > 0 ? 'Error during sync' : `Synced ${result.upserted} records`,
          updated_at: new Date().toISOString()
        }, { onConflict: 'resource' });

      } catch (error: any) {
        console.error(`[${rid}] ${entity.name} error:`, error);
        result.errors = 1;
      }

      results[entity.name] = result;
    }

    const durationMs = Date.now() - startTime;
    console.log(`[${rid}] Sync complete in ${durationMs}ms:`, results);

    // Log to sync_log
    await sb.from('sync_log').insert({
      function_name: 'sync_realtyna',
      success: Object.values(results).every(r => r.errors === 0),
      records_processed: Object.values(results).reduce((sum, r) => sum + r.fetched, 0),
      inserted: Object.values(results).reduce((sum, r) => sum + r.upserted, 0),
      metadata: { mode, results, durationMs },
      completed_at: new Date().toISOString()
    });

    return createSuccessResponse({
      entity: Object.fromEntries(
        Object.entries(results).map(([name, r]) => [name, r.upserted])
      ),
      durationMs,
      mode
    });

  } catch (error: any) {
    console.error(`[${rid}] Fatal error:`, error);
    
    if (error.message?.includes('ENV_MISSING')) {
      return createErrorResponse('edge.sync_realtyna', 'ENV_MISSING', error.message, 500);
    }
    
    return createErrorResponse(
      'edge.sync_realtyna',
      'SYNC_FAILED',
      error.message || 'Unknown error during sync',
      500
    );
  }
});
