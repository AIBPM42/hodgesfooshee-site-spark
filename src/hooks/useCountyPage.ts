import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { CountyPageData } from "@/types/CountyPage";

export const useCountyPage = (slug: string) => {
  return useQuery({
    queryKey: ['county-page', slug],
    queryFn: async (): Promise<CountyPageData> => {
      const { data, error } = await supabase.functions.invoke('get_county_page_data', {
        body: { slug }
      });

      if (error) throw error;
      if (!data?.data) throw new Error('No data returned');

      return data.data;
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    enabled: !!slug,
  });
};
