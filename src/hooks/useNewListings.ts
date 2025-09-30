import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useNewListings = (limit: number = 12) => {
  return useQuery({
    queryKey: ['new-listings', limit],
    queryFn: async () => {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const { data, error } = await supabase
        .from('mls_listings')
        .select('*')
        .eq('standard_status', 'Active')
        .gte('modification_timestamp', oneWeekAgo.toISOString())
        .order('modification_timestamp', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
