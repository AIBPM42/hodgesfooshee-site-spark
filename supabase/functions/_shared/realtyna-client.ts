// Shared Realtyna client utilities for consistent headers and base URL
import { getRealtynaToken, clearTokenCache } from './realtyna-auth.ts';

export function getRealtynaBaseUrl(): string {
  const base = Deno.env.get('REALTYNA_BASE');
  if (!base) {
    throw new Error('ENV_MISSING: REALTYNA_BASE is required');
  }
  // Remove trailing slashes and ensure single /reso/odata
  const clean = base.replace(/\/+$/, '').replace(/\/reso\/odata.*$/, '');
  return `${clean}/reso/odata`;
}

export function getRealtynaHeaders(token: string) {
  const apiKey = Deno.env.get('REALTYNA_API_KEY');
  if (!apiKey) {
    throw new Error('ENV_MISSING: REALTYNA_API_KEY is required');
  }
  
  const origin = Deno.env.get('PUBLIC_SITE_ORIGIN') || 
                 Deno.env.get('SUPABASE_URL') || 
                 'https://preview.lovable.app';
  
  console.log(`[realtyna-client] Using Origin: ${origin}`);
  
  return {
    'Authorization': `Bearer ${token}`,
    'x-api-key': apiKey,
    'Origin': origin,
    'Referer': origin,
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };
}

export async function fetchWithRetry(
  url: string,
  options: RequestInit,
  maxRetries = 3
): Promise<Response> {
  let lastError: Error | null = null;
  const startTime = Date.now();
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`[realtyna-client] Attempt ${attempt}/${maxRetries}: ${url.substring(0, 100)}...`);
      
      const response = await fetch(url, options);
      
      // On 401, clear cache, get new token, and retry once
      if (response.status === 401 && attempt === 1) {
        console.log('[realtyna-client] Got 401, refreshing token...');
        clearTokenCache();
        const newToken = await getRealtynaToken();
        
        // Update Authorization header
        const headers = options.headers as Record<string, string>;
        headers['Authorization'] = `Bearer ${newToken}`;
        
        console.log('[realtyna-client] Retrying with new token');
        continue;
      }
      
      // Log success
      if (response.ok) {
        const elapsed = Date.now() - startTime;
        console.log(`[realtyna-client] Success ${response.status} in ${elapsed}ms`);
        return response;
      }
      
      // Client error (4xx except 401/429) - don't retry but log details
      if (response.status >= 400 && response.status < 500 && response.status !== 429) {
        const errorBody = await response.text();
        console.error(`[realtyna-client] Client error ${response.status}:`, {
          url: url.substring(0, 150),
          body: errorBody.substring(0, 500)
        });
        return response;
      }
      
      // Rate limited or server error - retry with backoff
      if (response.status === 429 || response.status >= 500) {
        if (attempt < maxRetries) {
          const backoff = Math.min(1000 * Math.pow(2, attempt - 1) + Math.random() * 1000, 10000);
          console.log(`[realtyna-client] Retry ${attempt}/${maxRetries} after ${backoff}ms for status ${response.status}`);
          await new Promise(resolve => setTimeout(resolve, backoff));
          continue;
        }
      }
      
      return response;
    } catch (error) {
      lastError = error as Error;
      console.error(`[realtyna-client] Network error on attempt ${attempt}:`, error);
      if (attempt < maxRetries) {
        const backoff = Math.min(1000 * Math.pow(2, attempt - 1) + Math.random() * 1000, 10000);
        console.log(`[realtyna-client] Retrying after ${backoff}ms`);
        await new Promise(resolve => setTimeout(resolve, backoff));
      }
    }
  }
  
  throw lastError || new Error('Max retries exceeded');
}
