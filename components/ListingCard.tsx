import { useState } from "react";

export default function ListingCard({ listing }: any) {
  const [favorited, setFavorited] = useState(false);

  return (
    <div>
      <button onClick={() => setFavorited(!favorited)}>
        {favorited ? "❤️" : "🤍"}
      </button>
      {/* rest of your card */}
    </div>
  );
}
