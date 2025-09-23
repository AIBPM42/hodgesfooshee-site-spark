import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const searchParams = url.searchParams
    
    // Get Realtyna API credentials
    const apiKey = Deno.env.get('REALTY_API_KEY')
    const apiBase = 'https://api.realtyfeed.com/reso/odata'
    
    if (!apiKey) {
      throw new Error('API key not configured')
    }

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

    // Make request to Realtyna API
    const response = await fetch(`${apiBase}/Property?${queryParams}`, {
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
    
    // Transform RESO data to our format
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
    console.error('Search properties error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})