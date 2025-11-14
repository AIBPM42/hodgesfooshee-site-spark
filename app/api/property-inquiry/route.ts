import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Mark this route as dynamic to prevent static generation
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  // Initialize Supabase client at request time, not module load time
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  try {
    const {
      name,
      email,
      phone,
      inquiryType,
      message,
      propertyId,
      propertyAddress,
    } = await req.json();

    // Validation
    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: "Name, email, and phone are required" },
        { status: 400 }
      );
    }

    if (!propertyId || !propertyAddress) {
      return NextResponse.json(
        { error: "Property information is required" },
        { status: 400 }
      );
    }

    // Parse name into first and last
    const nameParts = name.trim().split(" ");
    const firstName = nameParts[0] || "Unknown";
    const lastName = nameParts.slice(1).join(" ") || "";

    // TODO: In the future, implement agent assignment logic here
    // For now, we'll leave assigned_agent_id as null
    // The broker can assign leads manually from the admin dashboard

    // Determine priority based on inquiry type
    const priority = inquiryType === "make_offer" ? "high" : "medium";

    // Insert lead into database
    const { data: lead, error: insertError } = await supabase
      .from("leads")
      .insert({
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        message: message || null,
        lead_type: inquiryType || "request_info",
        property_id: propertyId,
        property_address: propertyAddress,
        source: "property_detail_page",
        status: "new",
        priority,
        // assigned_agent_id will be null for now
        // broker can assign from admin dashboard
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error inserting lead:", insertError);
      return NextResponse.json(
        { error: "Failed to save your inquiry. Please try again." },
        { status: 500 }
      );
    }

    // TODO: Future enhancements:
    // - Send email notification to broker/assigned agent
    // - Send to GoHighLevel CRM webhook
    // - Send confirmation email to customer

    return NextResponse.json({
      success: true,
      leadId: lead.id,
      message: "Your inquiry has been received. We'll contact you shortly!",
    });
  } catch (error: any) {
    console.error("Error processing property inquiry:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
