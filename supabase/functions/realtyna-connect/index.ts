import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve((req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const base = Deno.env.get("REALTYNA_BASE") || "https://api.realtyfeed.com";
    const clientId = Deno.env.get("REALTYNA_CLIENT_ID")!;
    const redirectUri = `https://xhqwmtzawqfffepcqxwf.functions.supabase.co/realtyna-callback`;
    
    // {needs-verification} - OAuth authorization endpoint
    const url = new URL("/oauth/authorize", base);
    url.searchParams.set("response_type", "code");
    url.searchParams.set("client_id", clientId);
    url.searchParams.set("redirect_uri", redirectUri);
    // {needs-verification} - OAuth scope for authorization code flow
    url.searchParams.set("scope", "api:read api:write");
    
    console.log(`Redirecting to OAuth URL: ${url.toString()}`);
    
    return new Response(null, { 
      status: 302, 
      headers: { 
        ...corsHeaders,
        Location: url.toString() 
      }
    });
  } catch (error) {
    console.error('Error in realtyna-connect:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});