/**
 * PropertyJsonLd Component
 * Generates Schema.org structured data for real estate listings
 * Improves SEO and enables rich search results
 */

type PropertyJsonLdProps = {
  name: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  price: number;
  currency?: string;
  description?: string;
  images?: string[];
  beds?: number;
  baths?: number;
  sqft?: number;
  propertyType?: string;
  yearBuilt?: number;
  listingId?: string;
  url?: string;
  datePosted?: string;
  latitude?: number;
  longitude?: number;
};

export default function PropertyJsonLd({
  name,
  address,
  price,
  currency = "USD",
  description,
  images = [],
  beds,
  baths,
  sqft,
  propertyType = "SingleFamilyResidence",
  yearBuilt,
  listingId,
  url,
  datePosted,
  latitude,
  longitude,
}: PropertyJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": name,
    "url": url || typeof window !== 'undefined' ? window.location.href : undefined,
    ...(description && { "description": description }),
    ...(datePosted && { "datePosted": datePosted }),
    ...(listingId && { "identifier": listingId }),
    "offers": {
      "@type": "Offer",
      "price": price,
      "priceCurrency": currency,
      "availability": "https://schema.org/InStock",
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": address.street,
      "addressLocality": address.city,
      "addressRegion": address.state,
      "postalCode": address.zip,
      "addressCountry": "US",
    },
    ...(latitude && longitude && {
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": latitude,
        "longitude": longitude,
      },
    }),
    "property": {
      "@type": propertyType,
      ...(sqft && { "floorSize": { "@type": "QuantitativeValue", "value": sqft, "unitCode": "FTK" } }),
      ...(beds && { "numberOfBedrooms": beds }),
      ...(baths && { "numberOfBathroomsTotal": baths }),
      ...(yearBuilt && { "yearBuilt": yearBuilt }),
      ...(images.length > 0 && { "image": images }),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd, null, 2) }}
    />
  );
}
