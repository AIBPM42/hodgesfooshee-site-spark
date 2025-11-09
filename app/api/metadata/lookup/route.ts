import { getMlsToken } from "@/lib/mls";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { z } from "zod";

// Force dynamic rendering - don't pre-render at build time
export const dynamic = 'force-dynamic';


const schema = z.object({
  filter: z.string().optional(),
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const parsed = schema.safeParse(Object.fromEntries(searchParams));

  if (!parsed.success) {
    return new Response("Invalid input", { status: 400 });
  }

  const supabase = createServerComponentClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  await supabase.from("api_logs").insert({
    user_id: user?.id || null,
    endpoint: "/api/metadata/lookup",
    filters: parsed.data,
  });

  const token = await getMlsToken();
  const query = parsed.data.filter ? `?$filter=${parsed.data.filter}` : "";

  const res = await fetch(`${process.env.MLS_BASE_URL}/reso/odata/Lookup${query}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("MLS Lookup API error:", errorText);
    return new Response(`MLS Lookup API error: ${errorText}`, { status: res.status });
  }

  const data = await res.json();
  return Response.json(data);
}
