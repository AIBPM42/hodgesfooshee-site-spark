import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface FeaturedListing {
  id: number;
  list_price: number;
  bedrooms_total: number;
  bathrooms_total_integer: number;
  living_area: number;
  city: string;
  listing_key: string;
  standard_status: string;
}

export const useFeaturedListings = () => {
  return useQuery({
    queryKey: ['featured-listings'],
    queryFn: async (): Promise<FeaturedListing[]> => {
      // First try to get featured listings if any exist
      const { data: featuredData } = await supabase
        .from('featured_listings')
        .select(`
          listing_id,
          mls_listings!inner(
            id,
            list_price,
            bedrooms_total,
            bathrooms_total_integer,
            living_area,
            city,
            listing_key,
            standard_status
          )
        `)
        .eq('mls_listings.standard_status', 'Active')
        .order('rank')
        .limit(6);

      if (featuredData && featuredData.length > 0) {
        return featuredData.map(item => {
          const listing = item.mls_listings as any;
          return {
            id: listing.id,
            list_price: listing.list_price,
            bedrooms_total: listing.bedrooms_total,
            bathrooms_total_integer: listing.bathrooms_total_integer,
            living_area: listing.living_area,
            city: listing.city,
            listing_key: listing.listing_key,
            standard_status: listing.standard_status
          };
        });
      }

      // If no featured listings, get recent active listings
      const { data: recentListings } = await supabase
        .from('mls_listings')
        .select('id, list_price, bedrooms_total, bathrooms_total_integer, living_area, city, listing_key, standard_status')
        .eq('standard_status', 'Active')
        .gt('list_price', 100000)
        .order('modification_timestamp', { ascending: false })
        .limit(6);

      return recentListings || [];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};