import { InsiderCard } from "@/components/InsiderCard";
import { fetchInsiderListings, getMockInsiderListings } from "@/lib/manus/fetchInsider";

/**
 * Server Component: Fetches and displays Insider Access listings
 * Uses ISR with 30-minute revalidation
 */
export async function InsiderGrid() {
  // Fetch listings from Manus API
  const listings = await fetchInsiderListings();

  // Fallback to mock data if no listings returned
  const displayListings = listings.length > 0 ? listings : getMockInsiderListings();

  return (
    <div className="grid md:grid-cols-3 gap-8">
      {displayListings.map((listing) => (
        <InsiderCard
          key={listing.id}
          tag={listing.tag}
          title={listing.title}
          subtitle={listing.subtitle}
          statLeftLabel={listing.statLeftLabel}
          statLeftValue={listing.statLeftValue}
          statRightLabel={listing.statRightLabel}
          statRightValue={listing.statRightValue}
          image={listing.image}
          href={listing.href}
        />
      ))}
    </div>
  );
}
