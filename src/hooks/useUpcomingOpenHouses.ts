import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useUpcomingOpenHouses = (days: number = 7, limit: number = 8) => {
  return useQuery({
    queryKey: ['upcoming-open-houses', days, limit],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + days);
      const future = futureDate.toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('mls_open_houses')
        .select(`
          *,
          mls_listings!inner(
            listing_key,
            city,
            list_price,
            bedrooms_total,
            bathrooms_total_integer,
            living_area,
            standard_status
          )
        `)
        .gte('open_house_date', today)
        .lte('open_house_date', future)
        .eq('mls_listings.standard_status', 'Active')
        .order('open_house_date', { ascending: true })
        .limit(limit);

      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
