import { getMlsToken, toResoParams } from "@/lib/mls";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { z } from "zod";

// Force dynamic rendering - don't pre-render at build time
export const dynamic = 'force-dynamic';


const schema = z.object({
  city: z.string(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
  beds: z.string().optional(),
  baths: z.string().optional(),
  page: z.string().optional(),
  pageSize: z.string().optional(),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return new Response("Invalid input", { status: 400 });

  // ✅ Log search to Supabase
  const supabase = createServerComponentClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  await supabase.from("search_logs").insert({
    user_id: user?.id || null,
    filters: parsed.data,
  });

  // ✅ Fetch MLS listings
  const token = await getMlsToken();
  const params = toResoParams(parsed.data);
  const query = new URLSearchParams(params).toString();

  const res = await fetch(`${process.env.MLS_BASE_URL}/search?${query}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const listings = await res.json();
  return Response.json(listings);
}