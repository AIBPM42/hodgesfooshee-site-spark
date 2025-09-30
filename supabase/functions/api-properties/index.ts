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

    // Parse query parameters
    const q = searchParams.get('q') || '';
    const city = searchParams.get('city') || '';
    const minPrice = parseInt(searchParams.get('min_price') || '0');
    const maxPrice = parseInt(searchParams.get('max_price') || '99999999');
    const beds = parseInt(searchParams.get('beds') || '0');
    const baths = parseInt(searchParams.get('baths') || '0');
    const status = searchParams.get('status') || 'Active';
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '24');
    const sort = searchParams.get('sort') || 'latest';

    // Build query
    let query = supabase
      .from('mls_listings')
      .select('*', { count: 'exact' });

    // Filters
    if (status) {
      query = query.eq('standard_status', status);
    }
    
    if (city) {
      query = query.ilike('city', `%${city}%`);
    }

    if (minPrice > 0) {
      query = query.gte('list_price', minPrice);
    }

    if (maxPrice < 99999999) {
      query = query.lte('list_price', maxPrice);
    }

    if (beds > 0) {
      query = query.gte('bedrooms_total', beds);
    }

    if (baths > 0) {
      query = query.gte('bathrooms_total_integer', baths);
    }

    // Sorting
    if (sort === 'price_asc') {
      query = query.order('list_price', { ascending: true });
    } else if (sort === 'price_desc') {
      query = query.order('list_price', { ascending: false });
    } else if (sort === 'latest') {
      query = query.order('modification_timestamp', { ascending: false });
    }

    // Pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify({
        items: data,
        total: count || 0,
        page,
        pageSize,
        totalPages: Math.ceil((count || 0) / pageSize),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('[api-properties] Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
