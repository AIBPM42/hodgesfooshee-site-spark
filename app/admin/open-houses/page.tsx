"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
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
  status: string;
  rsvp_count: number;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  image_url: string | null;
}

export default function OpenHousesPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const [openHouses, setOpenHouses] = useState<OpenHouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && profile) {
      loadOpenHouses();
    }
  }, [authLoading, profile]);

  async function loadOpenHouses() {
    try {
      let query = supabase
        .from("open_houses")
        .select("*")
        .order("start_time", { ascending: true });

      // Agents only see their own, broker/super_admin see all
      if (profile?.role === "agent") {
        query = query.eq("agent_id", user?.id);
      }

      const { data, error } = await query;

      if (error) throw error;
      setOpenHouses(data || []);
    } catch (err: any) {
      console.error("Error loading open houses:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function deleteOpenHouse(id: string) {
    if (!confirm("Delete this open house?")) return;

    try {
      const { error } = await supabase
        .from("open_houses")
        .delete()
        .eq("id", id);

      if (error) throw error;

      alert("Open house deleted");
      loadOpenHouses();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8 max-w-md text-center">
          <div className="text-4xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-300 mb-6">Please login to continue.</p>
          <Link href="/login" className="text-hf-orange hover:underline">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const upcomingHouses = openHouses.filter(oh => new Date(oh.start_time) > new Date());
  const pastHouses = openHouses.filter(oh => new Date(oh.start_time) <= new Date());

  return (
    <div className="min-h-screen bg-gradient-hero p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">My Open Houses</h1>
            <p className="text-gray-300">Create and manage your open house events</p>
          </div>
          <div className="flex space-x-4">
            <Link
              href="/admin/open-houses/create"
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
            >
              + Create Open House
            </Link>
            <Link
              href="/admin"
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
            >
              ← Back
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-white">{openHouses.length}</div>
            <div className="text-gray-400 text-sm">Total Open Houses</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-green-400">{upcomingHouses.length}</div>
            <div className="text-gray-400 text-sm">Upcoming</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-blue-400">
              {openHouses.reduce((sum, oh) => sum + oh.rsvp_count, 0)}
            </div>
            <div className="text-gray-400 text-sm">Total RSVPs</div>
          </div>
        </div>

        {/* Upcoming Open Houses */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Upcoming Open Houses</h2>
          {upcomingHouses.length === 0 ? (
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8 text-center">
              <div className="text-5xl mb-4">📅</div>
              <h3 className="text-xl font-bold text-white mb-2">No Upcoming Open Houses</h3>
              <p className="text-gray-400 mb-4">Create your first open house to get started!</p>
              <Link
                href="/admin/open-houses/create"
                className="inline-block px-6 py-3 bg-hf-orange text-white font-semibold rounded-lg hover:bg-orange-600 transition-all"
              >
                Create Open House
              </Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {upcomingHouses.map((house) => (
                <div
                  key={house.id}
                  className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all"
                >
                  <div className="flex items-start space-x-4">
                    {house.image_url && (
                      <img
                        src={house.image_url}
                        alt={house.title}
                        className="w-32 h-24 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">{house.title}</h3>
                      <p className="text-gray-300 mb-2">
                        {house.address}, {house.city}, {house.state} {house.zip_code}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
                        <span>${house.price?.toLocaleString()}</span>
                        <span>{house.beds} beds</span>
                        <span>{house.baths} baths</span>
                        <span>{house.sqft?.toLocaleString()} sqft</span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="text-white">
                          📅 {new Date(house.start_time).toLocaleDateString()} at{" "}
                          {new Date(house.start_time).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full">
                          {house.rsvp_count} RSVPs
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Link
                        href={`/admin/open-houses/${house.id}`}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded transition-all text-center"
                      >
                        View Details
                      </Link>
                      <button
                        onClick={() => deleteOpenHouse(house.id)}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded transition-all"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Past Open Houses */}
        {pastHouses.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Past Open Houses</h2>
            <div className="grid gap-4">
              {pastHouses.map((house) => (
                <div
                  key={house.id}
                  className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 opacity-60"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">{house.title}</h3>
                      <p className="text-gray-400 text-sm mb-2">
                        {house.address}, {house.city}
                      </p>
                      <span className="text-gray-500 text-sm">
                        {new Date(house.start_time).toLocaleDateString()}
                      </span>
                    </div>
                    <span className="px-3 py-1 bg-gray-500/20 text-gray-400 rounded-full text-sm">
                      {house.rsvp_count} attended
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
