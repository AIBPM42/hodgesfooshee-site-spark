// Shared Realtyna client utilities for consistent headers and base URL

export function getRealtynaBaseUrl(): string {
  const base = Deno.env.get('REALTYNA_BASE_URL') || 'https://api.realtyfeed.com';
  const clean = base.replace(/\/+$/, ''); // Remove trailing slashes
  return `${clean}/reso/odata`;
}

export function getRealtynaHeaders(token: string, origin?: string) {
  const apiKey = Deno.env.get('REALTYNA_API_KEY');
  const supabaseRef = Deno.env.get('SUPABASE_URL')?.match(/https:\/\/([^.]+)/)?.[1];
  const defaultOrigin = `https://${supabaseRef}.functions.supabase.co`;
  
  return {
    'Authorization': `Bearer ${token}`,
    'x-api-key': apiKey || '',
    'Origin': origin || defaultOrigin,
    'Referer': origin || defaultOrigin,
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
      const response = await fetch(url, options);
      
      // Success or client error (4xx) - don't retry
      if (response.ok || (response.status >= 400 && response.status < 500 && response.status !== 429)) {
        return response;
      }
      
      // Rate limited or server error - retry with backoff
      if (response.status === 429 || response.status >= 500) {
        if (attempt < maxRetries) {
          const backoff = Math.min(1000 * Math.pow(2, attempt - 1) + Math.random() * 1000, 10000);
          console.log(`Retry ${attempt}/${maxRetries} after ${backoff}ms for status ${response.status}`);
          await new Promise(resolve => setTimeout(resolve, backoff));
          continue;
        }
      }
      
      return response;
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxRetries) {
        const backoff = Math.min(1000 * Math.pow(2, attempt - 1) + Math.random() * 1000, 10000);
        console.log(`Network error, retry ${attempt}/${maxRetries} after ${backoff}ms:`, error);
        await new Promise(resolve => setTimeout(resolve, backoff));
      }
    }
  }
  
  throw lastError || new Error('Max retries exceeded');
}
