import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface CityStats {
  city: string;
  count: number;
}

export const useTopCities = (limit: number = 6) => {
  return useQuery({
    queryKey: ['top-cities', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('mls_listings')
        .select('city')
        .eq('standard_status', 'Active')
        .not('city', 'is', null);

      if (error) throw error;

      // Count by city
      const cityCounts: Record<string, number> = {};
      data?.forEach(item => {
        if (item.city) {
          cityCounts[item.city] = (cityCounts[item.city] || 0) + 1;
        }
      });

      // Sort and limit
      const topCities: CityStats[] = Object.entries(cityCounts)
        .map(([city, count]) => ({ city, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, limit);

      return topCities;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};
