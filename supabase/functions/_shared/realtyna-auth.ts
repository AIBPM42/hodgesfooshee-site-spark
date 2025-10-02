// Shared Realtyna authentication helper for all Smart Plan endpoints

export interface RealtynaToken {
  access_token: string;
  token_type: string;
  expires_in: number;
}

// Token cache with expiration
let cachedToken: { token: string; expiresAt: number } | null = null;

export async function getRealtynaToken(): Promise<string> {
  // Check cache first
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    console.log('[realtyna-auth] Using cached token');
    return cachedToken.token;
  }

  console.log('[realtyna-auth] Fetching new token');
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
    console.error(`[realtyna-auth] Token request failed: ${response.status}`, errorText.substring(0, 300));
    throw new Error(`Failed to get token: ${response.status} - ${errorText.substring(0, 200)}`);
  }

  const data: RealtynaToken = await response.json();
  
  // Cache token (expires_in is in seconds, subtract 5min buffer)
  const expiresAt = Date.now() + ((data.expires_in - 300) * 1000);
  cachedToken = { token: data.access_token, expiresAt };
  
  console.log(`[realtyna-auth] Token cached, expires in ${data.expires_in}s`);
  return data.access_token;
}

// Clear cache (for 401 retries)
export function clearTokenCache() {
  console.log('[realtyna-auth] Clearing token cache');
  cachedToken = null;
}
