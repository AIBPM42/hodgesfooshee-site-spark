import { getMlsToken } from "@/lib/mls";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

const schema = z.object({
  MemberID: z.string(),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return new Response("Invalid input", { status: 400 });

  const token = await getMlsToken();
  const query = new URLSearchParams({ MemberID: parsed.data.MemberID }).toString();

  const res = await fetch(`${process.env.MLS_BASE_URL}/member?${query}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const member = await res.json();

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  await supabase.from("mls_logs").insert({
    action: "get_member",
    payload: parsed.data,
    timestamp: new Date().toISOString(),
  });

  return Response.json(member);
}
