import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const clientId = Deno.env.get('REALTYNA_CLIENT_ID')
    const clientSecret = Deno.env.get('REALTYNA_CLIENT_SECRET')
    
    if (!clientId || !clientSecret) {
      throw new Error('Realtyna OAuth credentials not configured')
    }

    // Check if we have a valid token
    const { data: tokens } = await supabase
      .from('oauth_tokens')
      .select('*')
      .eq('provider', 'realtyna')
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)

    if (tokens && tokens.length > 0) {
      console.log('Found valid token, returning existing token')
      return new Response(
        JSON.stringify({ 
          access_token: tokens[0].access_token,
          expires_at: tokens[0].expires_at 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // No valid token found, get a new one
    console.log('No valid token found, requesting new token from Realtyna')
    console.log(`Using client ID: ${clientId?.substring(0, 8)}...`)
    
    // Try multiple potential token endpoints
    const tokenEndpoints = [
      'https://api.realtyfeed.com/v1/auth/token', // Correct endpoint from docs
      'https://api.realtyfeed.com/oauth/token',
      'https://api.realtyfeed.com/token',
      'https://api.realtyfeed.com/oauth2/token',
      'https://api.realtyfeed.com/auth/token'
    ];
    
    let tokenResponse: Response | null = null;
    let lastError = '';
    
    for (const endpoint of tokenEndpoints) {
      console.log(`Trying token endpoint: ${endpoint}`)
      
      try {
        tokenResponse = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
          },
          body: new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: clientId,
            client_secret: clientSecret,
            scope: 'api:read'
          })
        })
        
        console.log(`Response status for ${endpoint}: ${tokenResponse.status}`)
        
        if (tokenResponse.ok) {
          console.log(`Success with endpoint: ${endpoint}`)
          break;
        } else {
          const errorText = await tokenResponse.text()
          console.log(`Failed with ${endpoint}: ${tokenResponse.status} - ${errorText}`)
          lastError = `${tokenResponse.status}: ${errorText}`;
          tokenResponse = null; // Reset for next iteration
        }
      } catch (fetchError) {
        console.error(`Network error with ${endpoint}:`, fetchError)
        lastError = fetchError instanceof Error ? fetchError.message : 'Network error';
      }
    }

    if (!tokenResponse || !tokenResponse.ok) {
      console.error('All token endpoints failed. Last error:', lastError)
      
      // Log to audit table for debugging
      const logResult = await supabase.from('api_usage_logs').insert({
        endpoint: 'oauth/token',
        method: 'POST',
        status_code: tokenResponse?.status || 0,
        error_message: lastError,
        provider: 'realtyna'
      })
      
      if (logResult.error) {
        console.error('Failed to log error:', logResult.error)
      }
      
      throw new Error(`OAuth token request failed: ${lastError}`)
    }

    const tokenData = await tokenResponse.json()
    console.log('Received token response from Realtyna')
    
    const expiresAt = new Date(Date.now() + (tokenData.expires_in * 1000))
    
    // Store the new token
    const { data: newToken, error: insertError } = await supabase
      .from('oauth_tokens')
      .insert({
        provider: 'realtyna',
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token || null,
        token_type: tokenData.token_type || 'bearer',
        expires_at: expiresAt.toISOString(),
        scope: tokenData.scope || 'api:read'
      })
      .select()
      .single()

    if (insertError) {
      console.error('Failed to store token:', insertError)
      throw new Error('Failed to store OAuth token')
    }

    console.log('Successfully stored new token')

    return new Response(
      JSON.stringify({ 
        access_token: tokenData.access_token,
        expires_at: expiresAt.toISOString() 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    console.error('OAuth token management error:', error)
    
    // Log the error to our usage tracking
    supabase.from('api_usage_logs').insert({
      provider: 'realtyna',
      endpoint: '/oauth/token',
      method: 'POST',
      status_code: 500,
      error_message: errorMessage,
      metadata: { error_type: 'oauth_token_error' }
    }).then(result => {
      if (result.error) console.error('Failed to log error:', result.error)
    })
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})