import type { County } from "@/lib/types/county";

export function CountyJsonLd({ county }: { county: County }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: county.name,
    description: county.hero_tagline || `${county.name} Real Estate Market Intelligence`,
    url: `https://hodgesfooshee.com/counties/${county.slug}`,
    address: {
      '@type': 'PostalAddress',
      addressRegion: 'TN',
      addressCountry: 'US',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
