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
    const listingKey = url.searchParams.get('listing_key');

    if (!listingKey) {
      return new Response(
        JSON.stringify({ error: 'listing_key parameter required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Get listing
    const { data: listing, error: listingError } = await supabase
      .from('mls_listings')
      .select('*')
      .eq('listing_key', listingKey)
      .single();

    if (listingError) {
      throw listingError;
    }

    // Get related open houses
    const { data: openHouses } = await supabase
      .from('mls_open_houses')
      .select('*')
      .eq('listing_key', listingKey)
      .gte('open_house_date', new Date().toISOString().split('T')[0])
      .order('open_house_date', { ascending: true });

    // Get listing agent
    let agent = null;
    if (listing.listing_agent_key) {
      const { data: agentData } = await supabase
        .from('mls_members')
        .select('*')
        .eq('member_key', listing.listing_agent_key)
        .single();
      agent = agentData;
    }

    // Get listing office
    let office = null;
    if (listing.listing_office_key) {
      const { data: officeData } = await supabase
        .from('mls_offices')
        .select('*')
        .eq('office_key', listing.listing_office_key)
        .single();
      office = officeData;
    }

    return new Response(
      JSON.stringify({
        listing,
        openHouses: openHouses || [],
        agent,
        office,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('[api-property-detail] Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
