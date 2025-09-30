import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';
import { corsHeaders } from '../_shared/cors.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;

    const from = searchParams.get('from') || new Date().toISOString().split('T')[0];
    const toDays = parseInt(searchParams.get('to_days') || '14');
    const city = searchParams.get('city') || '';
    const listingKey = searchParams.get('listing_key') || '';

    // Calculate "to" date
    const toDate = new Date();
    toDate.setDate(toDate.getDate() + toDays);
    const to = toDate.toISOString().split('T')[0];

    // Build query with join to get listing details
    let query = supabase
      .from('mls_open_houses')
      .select(`
        *,
        mls_listings!inner(
          listing_key,
          city,
          list_price,
          bedrooms_total,
          bathrooms_total_integer,
          living_area,
          standard_status
        )
      `)
      .gte('open_house_date', from)
      .lte('open_house_date', to)
      .order('open_house_date', { ascending: true });

    if (city) {
      query = query.ilike('mls_listings.city', `%${city}%`);
    }

    if (listingKey) {
      query = query.eq('listing_key', listingKey);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify({
        items: data || [],
        total: data?.length || 0,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('[api-open-houses] Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
