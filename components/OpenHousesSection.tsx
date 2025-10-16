"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

interface OpenHouse {
  id: string;
  property_id: string;
  title: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  start_time: string;
  end_time: string;
  price: number | null;
  beds: number | null;
  baths: number | null;
  sqft: number | null;
  image_url: string | null;
  rsvp_count: number;
  agent_id: string;
}

interface Agent {
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
}

export default function OpenHousesSection() {
  const [openHouses, setOpenHouses] = useState<OpenHouse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOpenHouses();
  }, []);

  async function loadOpenHouses() {
    try {
      const { data, error } = await supabase
        .from("open_houses")
        .select(`
          *,
          profiles:agent_id (first_name, last_name, phone)
        `)
        .eq("status", "scheduled")
        .gte("start_time", new Date().toISOString())
        .order("start_time", { ascending: true })
        .limit(6);

      if (error) throw error;
      setOpenHouses(data || []);
    } catch (err) {
      console.error("Error loading open houses:", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="container-custom">
          <div className="text-center text-white">Loading open houses...</div>
        </div>
      </section>
    );
  }

  if (openHouses.length === 0) {
    return null; // Don't show section if no open houses
  }

  return (
    <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            Upcoming Open Houses
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Visit these properties in person and meet our expert agents
          </p>
        </div>

        {/* Open Houses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {openHouses.map((house) => {
            const agent = house.profiles as unknown as Agent;
            const startDate = new Date(house.start_time);
            const endDate = new Date(house.end_time);

            return (
              <div
                key={house.id}
                className="glass-card rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300"
              >
                {/* Image */}
                <div className="relative h-48 bg-gradient-to-br from-slate-700 to-slate-800">
                  {house.image_url ? (
                    <img
                      src={house.image_url}
                      alt={house.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl">
                      🏠
                    </div>
                  )}
                  <div className="absolute top-4 right-4 px-3 py-1 bg-hf-orange text-white text-sm font-semibold rounded-full">
                    Open House
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                    {house.title}
                  </h3>

                  <p className="text-gray-300 text-sm mb-4">
                    {house.address}, {house.city}, {house.state} {house.zip_code}
                  </p>

                  {/* Property Details */}
                  {(house.price || house.beds || house.baths || house.sqft) && (
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400 mb-4 pb-4 border-b border-white/10">
                      {house.price && (
                        <span className="font-semibold text-hf-orange">
                          ${house.price.toLocaleString()}
                        </span>
                      )}
                      {house.beds && <span>{house.beds} beds</span>}
                      {house.baths && <span>{house.baths} baths</span>}
                      {house.sqft && <span>{house.sqft.toLocaleString()} sqft</span>}
                    </div>
                  )}

                  {/* Date & Time */}
                  <div className="mb-4 space-y-2">
                    <div className="flex items-center text-white text-sm">
                      <span className="mr-2">📅</span>
                      <span>{startDate.toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric'
                      })}</span>
                    </div>
                    <div className="flex items-center text-gray-300 text-sm">
                      <span className="mr-2">🕒</span>
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

                  {/* Agent Info */}
                  {agent && (agent.first_name || agent.last_name) && (
                    <div className="mb-4 text-sm text-gray-400">
                      Hosted by <span className="text-white font-semibold">
                        {agent.first_name} {agent.last_name}
                      </span>
                    </div>
                  )}

                  {/* RSVP Button */}
                  <Link
                    href={`/open-house/${house.id}`}
                    className="block w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg text-center hover:from-blue-600 hover:to-purple-700 transition-all"
                  >
                    RSVP Now ({house.rsvp_count} attending)
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Link */}
        {openHouses.length >= 6 && (
          <div className="text-center mt-12">
            <Link
              href="/open-houses"
              className="inline-block px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-all"
            >
              View All Open Houses →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
