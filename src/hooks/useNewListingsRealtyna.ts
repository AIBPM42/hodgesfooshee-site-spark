import { useQuery } from "@tanstack/react-query";

export const useNewListingsRealtyna = (limit: number = 12) => {
  return useQuery({
    queryKey: ['new-listings-realtyna', limit],
    queryFn: async () => {
      // Calculate date 7 days ago in ISO format
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const isoDate = sevenDaysAgo.toISOString();

      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/mls-search?status=Active&modifiedSince=${encodeURIComponent(isoDate)}&orderby=ModificationTimestamp desc&limit=${limit}`;
      
      console.log('[Realtyna] Fetching new listings:', url);

      const response = await fetch(url, {
        headers: {
          'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '',
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[Realtyna] New listings fetch failed: ${response.status}`, errorText.substring(0, 200));
        throw new Error(`Failed to fetch new listings: ${response.status}`);
      }

      const data = await response.json();
      console.log('[Realtyna] New listings response:', { count: data?.properties?.length || 0, total: data?.total });

      return data?.properties || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
