/**
 * Insider Access Listing Types
 * For Manus API integration
 */

export type InsiderTag = "EXCLUSIVE" | "COMING SOON" | "OFF-MARKET";

export interface InsiderListing {
  id: string;
  tag: InsiderTag;
  title: string;
  subtitle?: string;
  statLeftLabel: string;
  statLeftValue: string;
  statRightLabel: string;
  statRightValue: string;
  image: string;
  href: string;
}

/**
 * Manus API Response Shape (adjust based on actual API)
 */
export interface ManusApiListing {
  id: string;
  status: string;
  address: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
  price?: {
    min?: number;
    max?: number;
    current?: number;
  };
  details?: {
    beds?: number;
    baths?: number;
    sqft?: number;
  };
  media?: {
    primaryImage?: string;
    images?: string[];
  };
  metadata?: {
    isExclusive?: boolean;
    isComingSoon?: boolean;
    isOffMarket?: boolean;
  };
}

/**
 * Transform Manus API listing to InsiderListing
 */
export function transformManusListing(raw: ManusApiListing): InsiderListing {
  // Determine tag based on metadata
  let tag: InsiderTag = "EXCLUSIVE";
  if (raw.metadata?.isComingSoon) tag = "COMING SOON";
  else if (raw.metadata?.isOffMarket) tag = "OFF-MARKET";

  const title =
    raw.address.street || `${raw.address.city || "Nashville"} Property`;
  const subtitle = raw.address.city
    ? `${raw.address.city}, ${raw.address.state || "TN"}`
    : undefined;

  const priceRange =
    raw.price?.min && raw.price?.max
      ? `$${(raw.price.min / 1000).toFixed(0)}K - $${(raw.price.max / 1000).toFixed(0)}K`
      : raw.price?.current
      ? `$${(raw.price.current / 1000).toFixed(0)}K`
      : "Contact for pricing";

  const details =
    raw.details?.beds && raw.details?.baths
      ? `${raw.details.beds} Beds | ${raw.details.baths} Baths`
      : "Contact for details";

  return {
    id: raw.id,
    tag,
    title,
    subtitle,
    statLeftLabel: "Price Range",
    statLeftValue: priceRange,
    statRightLabel: "Details",
    statRightValue: details,
    image: raw.media?.primaryImage || "/hodges-hero-bg.jpg",
    href: `/property/${raw.id}`,
  };
}
