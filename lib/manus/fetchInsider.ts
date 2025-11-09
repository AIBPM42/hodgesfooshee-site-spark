import { supabase } from "@/lib/supabase";
import type { InsiderListing } from "@/lib/types/insider";

/**
 * Fetches insider access listings from Supabase
 * Manus data is synced via n8n workflow to a Supabase table
 * @returns Array of InsiderListing objects
 */
export async function fetchInsiderListings(): Promise<InsiderListing[]> {
  try {

    // Query insider listings from Supabase
    // n8n workflow syncs Manus data to this table
    const { data, error } = await supabase
      .from('insider_listings')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .limit(3);

    if (error) {
      console.warn("[Insider] Error fetching listings from Supabase:", error.message);
      return [];
    }

    if (!data || data.length === 0) {
      console.warn("[Insider] No insider listings available yet");
      return [];
    }

    // Data is already in InsiderListing format from n8n workflow
    return data as InsiderListing[];
  } catch (error) {
    console.error("[Insider] Error fetching insider listings from Supabase:", error);
    return [];
  }
}

/**
 * Fallback mock data for development/testing
 */
export function getMockInsiderListings(): InsiderListing[] {
  return [
    {
      id: "mock-1",
      tag: "COMING SOON",
      title: "Historic Estate",
      subtitle: "Belle Meade Area",
      statLeftLabel: "Price Range",
      statLeftValue: "$1.2M - $1.4M",
      statRightLabel: "Details",
      statRightValue: "5+ Beds | 4+ Baths",
      image: "/hodges-hero-bg.jpg",
      href: "#",
    },
    {
      id: "mock-2",
      tag: "EXCLUSIVE",
      title: "Waterfront Contemporary",
      subtitle: "Percy Priest Lake",
      statLeftLabel: "Price Range",
      statLeftValue: "$2.1M - $2.3M",
      statRightLabel: "Details",
      statRightValue: "4 Beds | 3.5 Baths",
      image: "/hodges-hero-bg.jpg",
      href: "#",
    },
    {
      id: "mock-3",
      tag: "OFF-MARKET",
      title: "Modern Farmhouse",
      subtitle: "Franklin",
      statLeftLabel: "Price Range",
      statLeftValue: "$850K - $950K",
      statRightLabel: "Details",
      statRightValue: "4 Beds | 3 Baths",
      image: "/hodges-hero-bg.jpg",
      href: "#",
    },
  ];
}
