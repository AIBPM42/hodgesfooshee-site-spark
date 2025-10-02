import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfDay, endOfDay } from "date-fns";

export interface SearchAnalyticsFilters {
  startDate?: Date;
  endDate?: Date;
}

export function useSearchAnalytics(filters: SearchAnalyticsFilters = {}) {
  return useQuery({
    queryKey: ["search-analytics", filters],
    queryFn: async () => {
      let query = supabase
        .from("search_events")
        .select("*")
        .order("occurred_at", { ascending: false });

      if (filters.startDate) {
        query = query.gte("occurred_at", startOfDay(filters.startDate).toISOString());
      }
      if (filters.endDate) {
        query = query.lte("occurred_at", endOfDay(filters.endDate).toISOString());
      }

      const { data, error } = await query;
      if (error) throw error;

      // Aggregate search queries
      const queryFrequency: Record<string, number> = {};
      const avgResultsCount: number[] = [];
      const avgDuration: number[] = [];

      data?.forEach((event) => {
        const queryStr = JSON.stringify(event.query);
        queryFrequency[queryStr] = (queryFrequency[queryStr] || 0) + 1;
        
        if (event.results_count !== null) {
          avgResultsCount.push(event.results_count);
        }
        if (event.duration_ms !== null) {
          avgDuration.push(event.duration_ms);
        }
      });

      const topQueries = Object.entries(queryFrequency)
        .map(([query, count]) => ({
          query: JSON.parse(query),
          count,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      return {
        total: data?.length || 0,
        topQueries,
        avgResultsCount:
          avgResultsCount.length > 0
            ? Math.round(
                avgResultsCount.reduce((a, b) => a + b, 0) / avgResultsCount.length
              )
            : 0,
        avgDurationMs:
          avgDuration.length > 0
            ? Math.round(avgDuration.reduce((a, b) => a + b, 0) / avgDuration.length)
            : 0,
        rawData: data || [],
      };
    },
  });
}
