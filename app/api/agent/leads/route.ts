import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Force dynamic rendering - don't pre-render at build time
export const dynamic = 'force-dynamic';

// GET /api/agent/leads - Get leads assigned to current agent
export async function GET(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: 'Supabase configuration missing' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    });

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user profile to verify they're an agent
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || (profile as any)?.role !== 'agent') {
      return NextResponse.json({ error: 'Unauthorized - Agents only' }, { status: 403 });
    }

    // Fetch leads assigned to this agent
    const { data: leads, error } = await supabase
      .from('distressed_leads')
      .select('*')
      .eq('assigned_to', user.id)
      .eq('status', 'assigned_to_agent')
      .order('priority', { ascending: false })
      .order('days_in_distress', { ascending: false });

    if (error) {
      console.error('Error fetching leads:', error);
      return NextResponse.json(
        { error: 'Failed to fetch leads' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: leads || [],
      meta: {
        total: leads?.length || 0,
        updated: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error in GET /api/agent/leads:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
