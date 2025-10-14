import ListingCard from "@/components/ListingCard";
import { getMlsToken } from "@/lib/mls";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const token = await getMlsToken();
  const res = await fetch(`${process.env.MLS_BASE_URL}/listing/${params.id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const listing = await res.json();

  return {
    title: `${listing.UnparsedAddress} | Hodges & Fooshee`,
    description: listing.PublicRemarks,
    openGraph: {
      images: [listing.Media[0]?.MediaURL],
    },
  };
}

export default async function PropertyPage({ params }: { params: { id: string } }) {
  const token = await getMlsToken();
  const res = await fetch(`${process.env.MLS_BASE_URL}/listing/${params.id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const listing = await res.json();

  return (
    <div>
      <ListingCard listing={listing} />
      <p>{listing.PublicRemarks}</p>
      <p>{listing.ListPrice}</p>
      <p>{listing.UnparsedAddress}</p>
    </div>
  );
}
