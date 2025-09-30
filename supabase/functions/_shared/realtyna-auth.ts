// Shared Realtyna authentication helper for all Smart Plan endpoints

export interface RealtynaToken {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export async function getRealtynaToken(): Promise<string> {
  const clientId = Deno.env.get("MLS_CLIENT_ID");
  const clientSecret = Deno.env.get("MLS_CLIENT_SECRET");
  
  if (!clientId || !clientSecret) {
    throw new Error("Missing MLS_CLIENT_ID or MLS_CLIENT_SECRET");
  }

  const tokenUrl = "https://api.realtyfeed.com/v1/auth/token";
  
  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Accept": "application/json"
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
      scope: "api/read"
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Token request failed: ${response.status}`, errorText);
    throw new Error(`Failed to get token: ${response.status} - ${errorText}`);
  }

  const data: RealtynaToken = await response.json();
  return data.access_token;
}

export function getRealtynaHeaders(accessToken: string) {
  const apiKey = Deno.env.get("REALTYNA_API_KEY");
  const supabaseRef = Deno.env.get("SUPABASE_URL")?.match(/https:\/\/([^.]+)/)?.[1];
  
  if (!apiKey) {
    throw new Error("Missing REALTYNA_API_KEY");
  }

  return {
    "Authorization": `Bearer ${accessToken}`,
    "x-api-key": apiKey,
    "Accept": "application/json",
    "Content-Type": "application/json",
    "Origin": `https://${supabaseRef}.functions.supabase.co`,
    "Referer": `https://${supabaseRef}.functions.supabase.co`
  };
}
