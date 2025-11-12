import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseServer';

// Force dynamic rendering - don't pre-render at build time
export const dynamic = 'force-dynamic';


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, source } = body;

    if (!email && !phone) {
      return NextResponse.json(
        { error: 'Email or phone is required' },
        { status: 400 }
      );
    }

    const supabase = supabaseAdmin;

    // Parse name into first_name and last_name
    const nameParts = (name || 'Anonymous').trim().split(' ');
    const firstName = nameParts[0] || 'Anonymous';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Insert lead into database
    const { data: lead, error } = await (supabase as any)
      .from('leads')
      .insert({
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        lead_type: 'insider_signup',
        source: source || 'website',
        status: 'new',
        priority: 'medium',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating lead:', error);
      return NextResponse.json(
        { error: 'Failed to create lead', details: error.message },
        { status: 500 }
      );
    }

    // Log the lead creation
    console.log('[Lead Created]', {
      id: (lead as any).id,
      email,
      source,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      lead,
      message: 'Lead created successfully'
    });

  } catch (error) {
    console.error('Error in POST /api/leads:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const supabase = supabaseAdmin;

    // Get all leads (admin only in production)
    const { data: leads, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching leads:', error);
      return NextResponse.json(
        { error: 'Failed to fetch leads' },
        { status: 500 }
      );
    }

    return NextResponse.json({ leads });

  } catch (error) {
    console.error('Error in GET /api/leads:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
