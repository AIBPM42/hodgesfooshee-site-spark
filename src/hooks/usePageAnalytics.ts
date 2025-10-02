import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfDay, endOfDay } from "date-fns";

export interface PageAnalyticsFilters {
  startDate?: Date;
  endDate?: Date;
  userRole?: string;
}

export function usePageAnalytics(filters: PageAnalyticsFilters = {}) {
  return useQuery({
    queryKey: ["page-analytics", filters],
    queryFn: async () => {
      let query = supabase
        .from("page_events")
        .select("*")
        .order("occurred_at", { ascending: false });

      if (filters.startDate) {
        query = query.gte("occurred_at", startOfDay(filters.startDate).toISOString());
      }
      if (filters.endDate) {
        query = query.lte("occurred_at", endOfDay(filters.endDate).toISOString());
      }
      if (filters.userRole) {
        query = query.eq("user_role", filters.userRole);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Aggregate by page
      const pageViews = data?.reduce((acc: Record<string, number>, event) => {
        acc[event.page] = (acc[event.page] || 0) + 1;
        return acc;
      }, {});

      // Time series data (by day)
      const timeSeries = data?.reduce((acc: Record<string, number>, event) => {
        const date = new Date(event.occurred_at).toISOString().split("T")[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});

      return {
        total: data?.length || 0,
        pageViews: Object.entries(pageViews || {}).map(([page, count]) => ({
          page,
          views: count,
        })),
        timeSeries: Object.entries(timeSeries || {})
          .map(([date, count]) => ({
            date,
            views: count,
          }))
          .sort((a, b) => a.date.localeCompare(b.date)),
        rawData: data || [],
      };
    },
  });
}
