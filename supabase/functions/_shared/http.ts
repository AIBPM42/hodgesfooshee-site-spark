// Shared HTTP wrapper for Realtyna API calls

export interface FetchOptions {
  token: string;
  apiKey: string;
  origin?: string;
  method?: string;
  body?: any;
}

export async function realtynaFetch(url: string, options: FetchOptions) {
  const { token, apiKey, origin, method = 'GET', body } = options;
  
  // Clean base URL
  const cleanUrl = url.replace(/\)+$/, '').replace(/\/+$/, '');
  
  const headers: Record<string, string> = {
    'Authorization': `Bearer ${token}`,
    'x-api-key': apiKey,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };
  
  if (origin) {
    headers['Origin'] = origin;
    headers['Referer'] = origin;
  }
  
  const fetchOptions: RequestInit = {
    method,
    headers
  };
  
  if (body && method !== 'GET' && method !== 'HEAD') {
    fetchOptions.body = JSON.stringify(body);
  }
  
  console.log('http.request', { url: cleanUrl, method, headers: Object.keys(headers) });
  
  const response = await fetch(cleanUrl, fetchOptions);
  
  console.log('http.response', { 
    status: response.status, 
    statusText: response.statusText,
    contentType: response.headers.get('content-type')
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      message: data.error || data.message || 'Request failed',
      error_detail: JSON.stringify(data),
      data: null
    };
  }
  
  return {
    ok: true,
    status: response.status,
    message: 'Success',
    data
  };
}
