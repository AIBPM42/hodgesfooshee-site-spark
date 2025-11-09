import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// Force dynamic rendering - don't pre-render at build time
export const dynamic = 'force-dynamic';


export async function POST(req: NextRequest) {
  try {
    const { type, payload } = await req.json();

    const supabase = createRouteHandlerClient({ cookies });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (type === 'run') {
      const { prompt, options, images_in, images_out, storage_bytes } = payload || {};

      const { data, error } = await supabase
        .from('image_edit_runs')
        .insert({
          user_id: user.id,
          prompt,
          options,
          images_in,
          images_out,
          storage_bytes,
        })
        .select('id')
        .single();

      if (error) {
        console.error('Error logging run:', error);
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      return NextResponse.json({ run_id: data.id });
    }

    if (type === 'download') {
      const { run_id, file_url, bytes } = payload || {};

      const { error } = await supabase
        .from('image_downloads')
        .insert({
          user_id: user.id,
          run_id,
          file_url,
          bytes
        });

      if (error) {
        console.error('Error logging download:', error);
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: 'Unknown type' }, { status: 400 });
  } catch (error: any) {
    console.error('Image logs API error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
