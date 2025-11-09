import ChartFrame from "./chartFrame";
import { insiderListings } from "@/lib/mock/insiderListings";

export default function InsiderAccess(){
  return (
    <ChartFrame title="Nashville Insider Access">
      <div className="grid md:grid-cols-2 gap-3">
        {insiderListings.map((listing,i)=>(
          <div key={i} className="rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
            <div className="relative h-32 bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-800 dark:to-zinc-900">
              {/* Placeholder for image */}
              <div className="absolute top-2 left-2 px-2 py-1 text-xs font-bold bg-orange-600 text-white rounded">
                {listing.status}
              </div>
            </div>
            <div className="p-3 space-y-1">
              <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">{listing.title}</h4>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">{listing.area}</p>
              <p className="text-sm font-semibold text-orange-600 dark:text-orange-400">{listing.priceRange}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-500">{listing.details}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 text-xs text-zinc-500">
        Fed by n8n webhook • Updated hourly
      </div>
    </ChartFrame>
  );
}
