import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const searchParams = url.searchParams
    
    const apiKey = Deno.env.get('REALTY_API_KEY')
    const apiBase = 'https://api.realtyfeed.com/reso/odata'
    
    if (!apiKey) {
      throw new Error('API key not configured')
    }

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
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`)
    }

    const data = await response.json()
    
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
    console.error('Search open houses error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})