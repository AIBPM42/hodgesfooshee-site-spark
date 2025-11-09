import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseServer';

// GET /api/agent/leads - Get leads assigned to current agent
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

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

    if (profile?.role !== 'agent') {
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
