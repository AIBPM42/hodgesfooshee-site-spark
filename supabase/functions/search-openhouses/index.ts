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

  const startTime = Date.now()

  try {
    const url = new URL(req.url)
    const searchParams = url.searchParams
    
    // Get OAuth token for Realtyna Smart plan
    console.log('Requesting OAuth token for open house search')
    const tokenResponse = await supabase.functions.invoke('manage-oauth-tokens')
    
    if (!tokenResponse.data?.access_token) {
      throw new Error('Failed to get OAuth token')
    }
    
    const accessToken = tokenResponse.data.access_token
    const apiBase = 'https://api.realtyfeed.com/reso/odata'

    // Build open house query
    const filter = []
    const location = searchParams.get('location')
    const date = searchParams.get('date')
    
    if (location) {
      filter.push(`contains(City,'${location}') or contains(PostalCode,'${location}')`)
    }
    if (date) {
      filter.push(`OpenHouseStartTime ge ${date}T00:00:00Z`)
    }

    // Only active open houses
    filter.push(`OpenHouseStartTime ge ${new Date().toISOString().split('T')[0]}T00:00:00Z`)

    const queryParams = new URLSearchParams({
      '$filter': filter.join(' and '),
      '$select': 'ListingId,OpenHouseStartTime,OpenHouseEndTime,ListPrice,BedroomsTotal,BathroomsTotalInteger,PropertyType,StreetName,City,StateOrProvince,PostalCode,Media',
      '$orderby': 'OpenHouseStartTime asc',
      '$top': '20'
    })

    const response = await fetch(`${apiBase}/OpenHouse?${queryParams}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`)
    }

    const data = await response.json()
    const responseTime = Date.now() - startTime
    
    // Log API usage for monitoring
    supabase.from('api_usage_logs').insert({
      provider: 'realtyna',
      endpoint: '/reso/odata/OpenHouse',
      method: 'GET',
      status_code: response.status,
      response_time_ms: responseTime,
      metadata: { 
        search_params: Object.fromEntries(searchParams.entries()),
        results_count: data.value?.length || 0 
      }
    }).then(result => {
      if (result.error) console.error('Failed to log usage:', result.error)
    })
    
    console.log(`Open house search completed in ${responseTime}ms, found ${data.value?.length || 0} results`)
    
    const openHouses = data.value?.map((oh: any) => ({
      id: oh.ListingId,
      title: `${oh.BedroomsTotal}BR/${oh.BathroomsTotalInteger}BA ${oh.PropertyType}`,
      address: `${oh.StreetName}, ${oh.City}, ${oh.StateOrProvince} ${oh.PostalCode}`,
      price: oh.ListPrice,
      date: oh.OpenHouseStartTime.split('T')[0],
      startTime: new Date(oh.OpenHouseStartTime).toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      }),
      endTime: new Date(oh.OpenHouseEndTime).toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      }),
      status: 'Active',
      image: oh.Media?.[0]?.MediaURL || '/placeholder.svg'
    })) || []

    return new Response(
      JSON.stringify({ openHouses, total: data['@odata.count'] || openHouses.length }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    const responseTime = Date.now() - startTime
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    console.error('Search open houses error:', error)
    
    // Log error for monitoring
    supabase.from('api_usage_logs').insert({
      provider: 'realtyna',
      endpoint: '/reso/odata/OpenHouse',
      method: 'GET',
      status_code: 500,
      response_time_ms: responseTime,
      error_message: errorMessage,
      metadata: { error_type: 'openhouse_search_error' }
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