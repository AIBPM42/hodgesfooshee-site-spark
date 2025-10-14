queryFn: async () => {
    const page = Number(searchParams.get("page") || 1);
    const pageSize = 12;
    const queryString = searchParams.toString();

    const url = `https://xhqwmtzawqfffepcqxwf.supabase.co/functions/v1/realtyna-mls-search?${queryString}&page=${page}&page_size=${pageSize}`;
    console.log('Fetching MLS data from:', url); // ✅ Log before fetch
    const response = await fetch(url, {
        headers: {
            'apikey': 'XVcnn4Iem59iIvTcsfR1LQ', // ✅ Your actual key
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        setAuthStatus('error');
        const errorData = await response.json();
        throw new Error(errorData.error || `API Error: ${response.status}`);
    }

    const data = await response.json();
    console.log('MLS API response:', data); // ✅ Log the parsed response

    setAuthStatus('ready');

    const queryParams = Object.fromEntries(searchParams.entries());
    logSearch(queryParams, data.properties?.length || 0);

    const properties = data.properties?.map((p: any) => ({
        id: p.ListingKey || p.ListingId,
        title: `${p.BedroomsTotal || 0}BR/${p.BathroomsTotalInteger || 0}BA ${p.City || 'Property'}`,
        address: `${p.City || ''}, ${p.StateOrProvince || 'TN'}`,
        price: p.ListPrice || 0,
        beds: p.BedroomsTotal || 0,
        baths: p.BathroomsTotalInteger || 0,
        sqft: p.LivingArea || 0,
        image: p.Media?.[0]?.MediaURL || '/placeholder.svg',
        status: p.StandardStatus || 'Active',
        listingType: 'For Sale'
    })) || [];

    return { properties, total: data.total || 0 };
}
