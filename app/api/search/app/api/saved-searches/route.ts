import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { z } from "zod";

const schema = z.object({
  name: z.string(),
  filters: z.record(z.any()),
  alert_opt_in: z.boolean().optional(),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return new Response("Invalid input", { status: 400 });

  const supabase = createServerComponentClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  await supabase.from("saved_searches").insert({
    user_id: user?.id || null,
    name: parsed.data.name,
    filters: parsed.data.filters,
    alert_opt_in: parsed.data.alert_opt_in || false,
  });

  return new Response("Saved search created", { status: 200 });
}
