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
    const slug = url.searchParams.get('slug');

    if (req.method === 'GET') {
      // Get single post by slug
      if (slug) {
        const { data, error } = await supabaseClient
          .from('insights_posts')
          .select('*')
          .eq('slug', slug)
          .single();

        if (error) {
          return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 404,
          });
        }

        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });
      }

      // List posts with pagination and filters
      const page = parseInt(url.searchParams.get('page') || '1');
      const pageSize = parseInt(url.searchParams.get('pageSize') || '10');
      const tag = url.searchParams.get('tag');
      const search = url.searchParams.get('search');

      let query = supabaseClient
        .from('insights_posts')
        .select('*', { count: 'exact' });

      if (tag) {
        query = query.contains('tags', [tag]);
      }

      if (search) {
        query = query.or(`title.ilike.%${search}%,teaser.ilike.%${search}%`);
      }

      const { data, error, count } = await query
        .order('publish_at', { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1);

      if (error) throw error;

      return new Response(JSON.stringify({
        items: data,
        page,
        pageSize,
        total: count || 0
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    if (req.method === 'POST') {
      const body = await req.json();
      
      // Upsert by slug
      const { data, error } = await supabaseClient
        .from('insights_posts')
        .upsert({
          ...body,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'slug'
        })
        .select()
        .single();

      if (error) throw error;

      return new Response(JSON.stringify({ ok: true, id: data.id }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 405,
    });

  } catch (error) {
    console.error('Error in insights function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
