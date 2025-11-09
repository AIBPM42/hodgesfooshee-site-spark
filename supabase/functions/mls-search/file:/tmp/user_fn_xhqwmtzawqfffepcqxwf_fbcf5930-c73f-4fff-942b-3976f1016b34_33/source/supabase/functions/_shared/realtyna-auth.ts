// Shared Realtyna authentication helper for all Smart Plan endpoints
// Token cache with expiration (55 minutes)
let cachedToken = null;
export async function getRealtynaToken() {
  // Check cache first
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    console.log('[realtyna-auth] Using cached token');
    return cachedToken.token;
  }
  console.log('[realtyna-auth] Fetching new token');
  const clientId = Deno.env.get("MLS_CLIENT_ID");
  const clientSecret = Deno.env.get("MLS_CLIENT_SECRET");
  if (!clientId) {
    throw new Error("ENV_MISSING: MLS_CLIENT_ID is required");
  }
  if (!clientSecret) {
    throw new Error("ENV_MISSING: MLS_CLIENT_SECRET is required");
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
  const data = await response.json();
  // Cache token (expires_in is in seconds, use 55min = 3300s)
  const expiresAt = Date.now() + 3300 * 1000;
  cachedToken = {
    token: data.access_token,
    expiresAt
  };
  console.log(`[realtyna-auth] Token cached, expires in 55 minutes`);
  return data.access_token;
}
// Clear cache (for 401 retries)
export function clearTokenCache() {
  console.log('[realtyna-auth] Clearing token cache');
  cachedToken = null;
}
