import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface MarketStats {
  activeListings: number;
  averagePrice: number;
  recentSales: number;
  openHouses: number;
}

export const useMarketStats = () => {
  return useQuery({
    queryKey: ['market-stats'],
    queryFn: async (): Promise<MarketStats> => {
      // Get active listings count
      const { count: activeListings } = await supabase
        .from('mls_listings')
        .select('*', { count: 'exact', head: true })
        .eq('standard_status', 'Active');

      // Get average price of active listings
      const { data: avgPriceData } = await supabase
        .from('mls_listings')
        .select('list_price')
        .eq('standard_status', 'Active')
        .gt('list_price', 0);

      const averagePrice = avgPriceData?.length 
        ? Math.round(avgPriceData.reduce((sum, item) => sum + (Number(item.list_price) || 0), 0) / avgPriceData.length)
        : 0;

      // Get recent sales (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { count: recentSales } = await supabase
        .from('mls_listings')
        .select('*', { count: 'exact', head: true })
        .eq('standard_status', 'Sold')
        .gte('modification_timestamp', thirtyDaysAgo.toISOString());

      // Get open houses count
      const { count: openHouses } = await supabase
        .from('mls_open_houses')
        .select('*', { count: 'exact', head: true })
        .gte('open_house_date', new Date().toISOString().split('T')[0]);

      return {
        activeListings: activeListings || 0,
        averagePrice,
        recentSales: recentSales || 0,
        openHouses: openHouses || 0,
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // 10 minutes
  });
};