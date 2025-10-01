import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useSiteSettings = () => {
  return useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('site-settings', {
        method: 'GET'
      });
      if (error) throw error;
      return data;
    },
    staleTime: 60000 // Cache for 1 minute
  });
};
