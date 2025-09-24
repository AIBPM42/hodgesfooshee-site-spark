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
    console.log('Requesting OAuth token for property search')
    const tokenResponse = await supabase.functions.invoke('manage-oauth-tokens')
    
    if (!tokenResponse.data?.access_token) {
      throw new Error('Failed to get OAuth token')
    }
    
    const accessToken = tokenResponse.data.access_token
    const apiBase = 'https://api.realtyfeed.com/reso/odata'

    // Build RESO Web API query parameters
    const filter = []
    const location = searchParams.get('location')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const bedrooms = searchParams.get('bedrooms')
    const bathrooms = searchParams.get('bathrooms')
    
    if (location) {
      filter.push(`contains(City,'${location}') or contains(PostalCode,'${location}')`)
    }
    if (minPrice) {
      filter.push(`ListPrice ge ${minPrice}`)
    }
    if (maxPrice) {
      filter.push(`ListPrice le ${maxPrice}`)
    }
    if (bedrooms && bedrooms !== 'any') {
      filter.push(`BedroomsTotal ge ${bedrooms}`)
    }
    if (bathrooms && bathrooms !== 'any') {
      filter.push(`BathroomsTotalInteger ge ${bathrooms}`)
    }

    // Add active listings filter
    filter.push(`StandardStatus eq 'Active'`)

    const queryParams = new URLSearchParams({
      '$filter': filter.join(' and '),
      '$select': 'ListingId,ListPrice,BedroomsTotal,BathroomsTotalInteger,LivingArea,PropertyType,StreetName,City,StateOrProvince,PostalCode,ListingContractDate,StandardStatus,Media',
      '$orderby': 'ListPrice desc',
      '$top': '20'
    })

    // Make request to Realtyna API with OAuth2 token
    console.log('Making request to Realtyna API with OAuth token')
    const response = await fetch(`${apiBase}/Property?${queryParams}`, {
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
      endpoint: '/reso/odata/Property',
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
    
    console.log(`Property search completed in ${responseTime}ms, found ${data.value?.length || 0} results`)
    
    // Transform RESO data to our format with Smart plan enhancements
    const properties = data.value?.map((prop: any) => ({
      id: prop.ListingId,
      title: `${prop.BedroomsTotal}BR/${prop.BathroomsTotalInteger}BA ${prop.PropertyType}`,
      address: `${prop.StreetName}, ${prop.City}, ${prop.StateOrProvince} ${prop.PostalCode}`,
      price: prop.ListPrice,
      beds: prop.BedroomsTotal,
      baths: prop.BathroomsTotalInteger,
      sqft: prop.LivingArea,
      image: prop.Media?.[0]?.MediaURL || '/placeholder.svg',
      status: prop.StandardStatus,
      listingType: prop.PropertyType
    })) || []

    return new Response(
      JSON.stringify({ properties, total: data['@odata.count'] || properties.length }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    const responseTime = Date.now() - startTime
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    console.error('Search properties error:', error)
    
    // Log error for monitoring
    supabase.from('api_usage_logs').insert({
      provider: 'realtyna',
      endpoint: '/reso/odata/Property',
      method: 'GET',
      status_code: 500,
      response_time_ms: responseTime,
      error_message: errorMessage,
      metadata: { error_type: 'property_search_error' }
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