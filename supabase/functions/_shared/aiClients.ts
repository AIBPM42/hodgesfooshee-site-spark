// Shared AI client configuration for County Intelligence
export const aiEnv = {
  openai: Deno.env.get("OPENAI_API_KEY") ?? "",
  perplexity: Deno.env.get("PERPLEXITY_API_KEY") ?? "",
  manus: Deno.env.get("MANUS_API_KEY") ?? ""
};

export function validateAIKeys() {
  const missing: string[] = [];
  if (!aiEnv.openai) missing.push("OPENAI_API_KEY");
  if (!aiEnv.perplexity) missing.push("PERPLEXITY_API_KEY");
  if (!aiEnv.manus) missing.push("MANUS_API_KEY");
  return { valid: missing.length === 0, missing };
}
