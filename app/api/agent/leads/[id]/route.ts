import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseServer';

// Force dynamic rendering - don't pre-render at build time
export const dynamic = 'force-dynamic';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = supabaseAdmin;

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const leadId = params.id;
    const updates = await request.json();

    // Verify the lead is assigned to this agent
    const { data: lead, error: leadError } = await supabase
      .from('distressed_leads')
      .select('assigned_to, status')
      .eq('id', leadId)
      .single();

    if (leadError || !lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    if ((lead as any).assigned_to !== user.id) {
      return NextResponse.json(
        { error: 'You can only update leads assigned to you' },
        { status: 403 }
      );
    }

    // Only allow agent to update specific fields
    const allowedFields = [
      'contacted',
      'contact_attempts',
      'last_contact_date',
      'agent_notes',
      'follow_up_date',
      'lead_status',
    ];

    const filteredUpdates: Record<string, any> = {};
    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key)) {
        filteredUpdates[key] = value;
      }
    }

    // Add updated_at timestamp
    filteredUpdates.updated_at = new Date().toISOString();

    // Update the lead
    const { data: updatedLead, error: updateError } = await supabase
      .from('distressed_leads')
      .update(filteredUpdates as any)
      .eq('id', leadId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating lead:', updateError);
      return NextResponse.json(
        { error: 'Failed to update lead' },
        { status: 500 }
      );
    }

    return NextResponse.json({ lead: updatedLead });
  } catch (error) {
    console.error('Error in PATCH /api/agent/leads/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
