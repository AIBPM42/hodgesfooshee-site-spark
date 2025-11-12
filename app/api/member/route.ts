import { getMlsToken } from "@/lib/mls";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

// Force dynamic rendering - don't pre-render at build time
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const schema = z.object({
  MemberID: z.string(),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return new Response("Invalid input", { status: 400 });

  const token = await getMlsToken();
  const query = new URLSearchParams({ MemberID: parsed.data.MemberID }).toString();

  const mlsBaseUrl = process.env.MLS_BASE_URL;
  if (!mlsBaseUrl) {
    return new Response("MLS configuration missing", { status: 500 });
  }

  const res = await fetch(`${mlsBaseUrl}/member?${query}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const member = await res.json();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (supabaseUrl && supabaseKey) {
    const supabase = createClient(supabaseUrl, supabaseKey);
    await supabase.from("mls_logs").insert({
      action: "get_member",
      payload: parsed.data,
      timestamp: new Date().toISOString(),
    });
  }

  return Response.json(member);
}
