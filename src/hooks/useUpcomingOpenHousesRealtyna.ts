import { useQuery } from "@tanstack/react-query";

export const useUpcomingOpenHousesRealtyna = (limit: number = 20) => {
  return useQuery({
    queryKey: ['upcoming-open-houses-realtyna', limit],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 14);
      const future = futureDate.toISOString().split('T')[0];

      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/mls-openhouses?start=${today}&end=${future}&limit=${limit}&orderby=OpenHouseStartTime asc`;
      
      console.log('[Realtyna] Fetching open houses:', url);

      const response = await fetch(url, {
        headers: {
          'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '',
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[Realtyna] Open houses fetch failed: ${response.status}`, errorText.substring(0, 200));
        throw new Error(`Failed to fetch open houses: ${response.status}`);
      }

      const data = await response.json();
      console.log('[Realtyna] Open houses response:', { count: data?.openHouses?.length || 0, total: data?.total });

      return data?.openHouses || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
