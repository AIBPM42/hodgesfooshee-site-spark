import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const url = new URL(req.url);

    if (req.method === 'GET') {
      const limit = parseInt(url.searchParams.get('limit') || '3');
      const city = url.searchParams.get('city');
      const minScore = parseFloat(url.searchParams.get('minScore') || '0');

      let query = supabaseClient
        .from('ai_hot_properties')
        .select('*')
        .eq('hidden', false);

      if (city) {
        query = query.eq('city', city);
      }

      if (minScore > 0) {
        query = query.gte('score', minScore);
      }

      const { data, error } = await query
        .order('score', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return new Response(JSON.stringify({ items: data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    if (req.method === 'POST') {
      const body = await req.json();
      const { items } = body;

      if (!items || !Array.isArray(items)) {
        return new Response(JSON.stringify({ error: 'Invalid items array' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        });
      }

      // Upsert items (insert or update based on address+city)
      let upserted = 0;
      for (const item of items) {
        const { data: existing } = await supabaseClient
          .from('ai_hot_properties')
          .select('id')
          .eq('address', item.address)
          .eq('city', item.city)
          .single();

        if (existing) {
          await supabaseClient
            .from('ai_hot_properties')
            .update({
              ...item,
              updated_at: new Date().toISOString()
            })
            .eq('id', existing.id);
        } else {
          await supabaseClient
            .from('ai_hot_properties')
            .insert(item);
        }
        upserted++;
      }

      return new Response(JSON.stringify({ ok: true, upserted }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 405,
    });

  } catch (error) {
    console.error('Error in ai-hot-properties function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
