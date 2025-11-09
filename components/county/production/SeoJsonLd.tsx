export default function SeoJsonLd({
  name,
  state,
  lat,
  lng,
  lastUpdatedISO,
}: {
  name: string;
  state: string;
  lat: number;
  lng: number;
  lastUpdatedISO: string;
}) {
  const json = {
    "@context": "https://schema.org",
    "@type": "Place",
    "name": `${name}, ${state}`,
    "geo": { "@type": "GeoCoordinates", latitude: lat, longitude: lng },
    "url": `https://hodgesfooshee.com/counties/${name.toLowerCase().replace(' ', '-')}`,
    "dateModified": lastUpdatedISO,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
