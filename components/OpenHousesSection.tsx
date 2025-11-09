"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Home, Calendar, Clock } from "lucide-react";

interface OpenHouse {
  id: string;
  property_id: string;
  title: string;
  address: string;
  city: string;
  state: string;
  start_time: string;
  end_time: string;
  image_url?: string;
}

export default function OpenHousesSection() {
  const [openHouses, setOpenHouses] = useState<OpenHouse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOpenHouses();
  }, []);

  async function loadOpenHouses() {
    try {
      console.log('[OpenHouses] Fetching from MLS API...');

      const response = await fetch(
        'https://xhqwmtzawqfffepcqxwf.supabase.co/functions/v1/mls-openhouses?limit=20',
        {
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhocXdtdHphd3FmZmZlcGNxeHdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2MDQwODEsImV4cCI6MjA3MDE4MDA4MX0.gihIkhLS_pwr9Mz6uG6vm7BXPzfa2TcpvIrRECRfxfg'
          }
        }
      );

      console.log('[OpenHouses] Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[OpenHouses] API error:', errorText);
        throw new Error(`API returned ${response.status}`);
      }

      const result = await response.json();
      console.log('[OpenHouses] Received data:', result);

      const mlsOpenHouses = result.openHouses || [];
      console.log('[OpenHouses] Total open houses:', mlsOpenHouses.length);

      // Filter to only active open houses
      const activeOpenHouses = mlsOpenHouses.filter((oh: any) => oh.OpenHouseStatus === 'Active');
      console.log('[OpenHouses] Active open houses:', activeOpenHouses.length);

      // Fetch property details for each open house to get city information
      const transformed = await Promise.all(
        activeOpenHouses.slice(0, 6).map(async (oh: any) => {
          let city = 'Nashville Area';
          let state = 'TN';
          let image_url: string | undefined = undefined;

          // Try to fetch property details to get actual city and image
          if (oh.ListingKey) {
            try {
              const propResponse = await fetch(
                `https://xhqwmtzawqfffepcqxwf.supabase.co/functions/v1/mls-search?listingKey=${oh.ListingKey}`,
                {
                  headers: {
                    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhocXdtdHphd3FmZmZlcGNxeHdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2MDQwODEsImV4cCI6MjA3MDE4MDA4MX0.gihIkhLS_pwr9Mz6uG6vm7BXPzfa2TcpvIrRECRfxfg'
                  }
                }
              );

              if (propResponse.ok) {
                const propData = await propResponse.json();
                const property = propData.properties?.[0];
                if (property) {
                  if (property.City) {
                    city = property.City;
                    state = property.StateOrProvince || 'TN';
                  }
                  // Get the first image (preferred photo)
                  if (property.Media && property.Media.length > 0) {
                    const preferredPhoto = property.Media.find((m: any) => m.PreferredPhotoYN === true);
                    const firstPhoto = property.Media[0];
                    image_url = preferredPhoto?.MediaURL || firstPhoto?.MediaURL;
                  }
                }
              }
            } catch (propErr) {
              console.warn('[OpenHouses] Could not fetch property details for', oh.ListingKey);
            }
          }

          return {
            id: oh.OpenHouseKey || oh.OpenHouseId,
            property_id: oh.ListingKey || '',
            title: `Open House - Listing #${oh.ListingId || oh.ListingKey}`,
            address: oh.OpenHouseRemarks || `Property ${oh.ListingId}`,
            city,
            state,
            start_time: oh.OpenHouseStartTime || oh.OpenHouseDate,
            end_time: oh.OpenHouseEndTime || oh.OpenHouseDate,
            image_url,
          };
        })
      );

      console.log('[OpenHouses] Transformed:', transformed.length, 'open houses with location data');
      setOpenHouses(transformed);
    } catch (err) {
      console.error("[OpenHouses] Error loading:", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center text-neutral-600">Loading open houses...</div>
        </div>
      </section>
    );
  }

  if (openHouses.length === 0) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center text-neutral-600">No upcoming open houses at this time.</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {openHouses.map((house) => {
            const startDate = new Date(house.start_time);
            const endDate = new Date(house.end_time);

            return (
              <Link
                key={house.id}
                href={`/property/${house.property_id}`}
                className="group"
              >
                <div className="bg-white rounded-2xl overflow-hidden border border-black/5 shadow-[0_12px_32px_rgba(20,20,20,0.08)] hover:shadow-[0_20px_40px_rgba(20,20,20,0.12)] transition-all duration-300 hover:-translate-y-1">
                  <div className="relative h-48 bg-neutral-100">
                    {house.image_url ? (
                      <img
                        src={house.image_url}
                        alt={house.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Home className="w-16 h-16 text-neutral-400" />
                      </div>
                    )}
                    <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-[#E4552E] to-[#F39C57] text-white text-sm font-semibold rounded-full shadow-lg">
                      Open House
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-lg font-bold text-[#111827] mb-2 line-clamp-2">
                      {house.title}
                    </h3>

                    <p className="text-[#6B7280] text-sm mb-4">
                      {house.city}, {house.state}
                    </p>

                    <div className="space-y-2 bg-neutral-50 p-3 rounded-lg border border-neutral-100">
                      <div className="flex items-center text-[#111827] text-sm font-medium">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>{startDate.toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric'
                        })}</span>
                      </div>
                      <div className="flex items-center text-[#6B7280] text-sm">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>
                          {startDate.toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit'
                          })} - {endDate.toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
