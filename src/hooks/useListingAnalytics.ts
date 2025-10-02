import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfDay, endOfDay } from "date-fns";

export interface ListingAnalyticsFilters {
  startDate?: Date;
  endDate?: Date;
}

export function useListingAnalytics(filters: ListingAnalyticsFilters = {}) {
  return useQuery({
    queryKey: ["listing-analytics", filters],
    queryFn: async () => {
      let query = supabase
        .from("listing_views")
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

      // Most viewed listings
      const viewsByListing: Record<string, number> = {};
      const viewsByCity: Record<string, number> = {};
      const prices: number[] = [];

      data?.forEach((view) => {
        viewsByListing[view.listing_key] = (viewsByListing[view.listing_key] || 0) + 1;
        if (view.city) {
          viewsByCity[view.city] = (viewsByCity[view.city] || 0) + 1;
        }
        if (view.price) {
          prices.push(Number(view.price));
        }
      });

      const topListings = Object.entries(viewsByListing)
        .map(([listing_key, views]) => ({
          listing_key,
          views,
        }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 10);

      const topCities = Object.entries(viewsByCity)
        .map(([city, views]) => ({
          city,
          views,
        }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 10);

      const avgPrice =
        prices.length > 0
          ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length)
          : 0;

      return {
        total: data?.length || 0,
        topListings,
        topCities,
        avgPrice,
        rawData: data || [],
      };
    },
  });
}
