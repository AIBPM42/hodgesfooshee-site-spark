// Shared Realtyna client utilities for consistent headers and base URL
import { getRealtynaToken, clearTokenCache } from './realtyna-auth.ts';

export function getRealtynaBaseUrl(): string {
  const base = Deno.env.get('REALTYNA_BASE_URL') || 'https://api.realtyfeed.com';
  const clean = base.replace(/\/+$/, ''); // Remove trailing slashes
  return `${clean}/reso/odata`;
}

export function getRealtynaHeaders(token: string, requestOrigin?: string) {
  const apiKey = Deno.env.get('REALTYNA_API_KEY');
  const supabaseRef = Deno.env.get('SUPABASE_URL')?.match(/https:\/\/([^.]+)/)?.[1];
  const defaultOrigin = requestOrigin || `https://${supabaseRef}.functions.supabase.co`;
  
  console.log(`[realtyna-client] Using Origin: ${defaultOrigin}`);
  
  return {
    'Authorization': `Bearer ${token}`,
    'x-api-key': apiKey || '',
    'Origin': defaultOrigin,
    'Referer': defaultOrigin,
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
      
      // Success or client error (4xx except 401/429) - don't retry
      if (response.ok || (response.status >= 400 && response.status < 500 && response.status !== 429)) {
        if (!response.ok) {
          const errorBody = await response.text();
          console.error(`[realtyna-client] Request failed: ${response.status}`, errorBody.substring(0, 300));
        }
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
