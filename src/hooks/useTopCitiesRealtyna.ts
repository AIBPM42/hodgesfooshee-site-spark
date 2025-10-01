import { useQuery } from "@tanstack/react-query";

interface CityStats {
  city: string;
  count: number;
}

export const useTopCitiesRealtyna = (limit: number = 6) => {
  return useQuery({
    queryKey: ['top-cities-realtyna', limit],
    queryFn: async () => {
      // Fetch active properties and count by city on client side
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/mls-search?status=Active&limit=10000&select=City`;
      
      console.log('[Realtyna] Fetching cities:', url);

      const response = await fetch(url, {
        headers: {
          'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '',
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[Realtyna] Cities fetch failed: ${response.status}`, errorText.substring(0, 200));
        throw new Error(`Failed to fetch cities: ${response.status}`);
      }

      const data = await response.json();
      const properties = data?.properties || [];

      console.log('[Realtyna] Cities response:', { properties: properties.length });

      // Count by city
      const cityCounts: Record<string, number> = {};
      properties.forEach((item: any) => {
        if (item.City) {
          cityCounts[item.City] = (cityCounts[item.City] || 0) + 1;
        }
      });

      // Sort and limit
      const topCities: CityStats[] = Object.entries(cityCounts)
        .map(([city, count]) => ({ city, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, limit);

      console.log('[Realtyna] Top cities:', topCities);

      return topCities;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};
