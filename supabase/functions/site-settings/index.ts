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

    if (req.method === 'GET') {
      const { data, error } = await supabaseClient
        .from('site_settings')
        .select('*')
        .single();

      if (error) throw error;

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    if (req.method === 'POST') {
      const body = await req.json();
      
      // Get existing row ID
      const { data: existing } = await supabaseClient
        .from('site_settings')
        .select('id')
        .single();

      if (!existing) {
        // Insert first row
        const { data, error } = await supabaseClient
          .from('site_settings')
          .insert({ ...body, updated_at: new Date().toISOString() })
          .select()
          .single();

        if (error) throw error;

        return new Response(JSON.stringify({ ok: true, updated_at: data.updated_at }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });
      } else {
        // Update existing row
        const { data, error } = await supabaseClient
          .from('site_settings')
          .update({ ...body, updated_at: new Date().toISOString() })
          .eq('id', existing.id)
          .select()
          .single();

        if (error) throw error;

        return new Response(JSON.stringify({ ok: true, updated_at: data.updated_at }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });
      }
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 405,
    });

  } catch (error) {
    console.error('Error in site-settings function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
