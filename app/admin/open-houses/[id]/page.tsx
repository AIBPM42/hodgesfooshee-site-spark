"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

interface OpenHouse {
  id: string;
  title: string;
  address: string;
  city: string;
  state: string;
  start_time: string;
  end_time: string;
  rsvp_count: number;
}

interface RSVP {
  id: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string | null;
  party_size: number;
  notes: string | null;
  status: string;
  created_at: string;
}

export default function OpenHouseDetailPage({ params }: { params: { id: string } }) {
  const { user, profile } = useAuth();
  const [openHouse, setOpenHouse] = useState<OpenHouse | null>(null);
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [params.id]);

  async function loadData() {
    try {
      // Load open house
      const { data: ohData, error: ohError } = await supabase
        .from("open_houses")
        .select("*")
        .eq("id", params.id)
        .single();

      if (ohError) throw ohError;
      setOpenHouse(ohData);

      // Load RSVPs
      const { data: rsvpData, error: rsvpError } = await supabase
        .from("open_house_rsvps")
        .select("*")
        .eq("open_house_id", params.id)
        .order("created_at", { ascending: false });

      if (rsvpError) throw rsvpError;
      setRsvps(rsvpData || []);
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  const confirmedRsvps = rsvps.filter(r => r.status === "confirmed");
  const totalGuests = rsvps.reduce((sum, r) => sum + r.party_size, 0);

  return (
    <div className="min-h-screen bg-gradient-hero p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">{openHouse?.title}</h1>
            <p className="text-gray-300">
              {openHouse?.address}, {openHouse?.city}, {openHouse?.state}
            </p>
            <p className="text-gray-400 mt-2">
              {new Date(openHouse?.start_time || "").toLocaleDateString()} at{" "}
              {new Date(openHouse?.start_time || "").toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <Link
            href="/admin/open-houses"
            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
          >
            ← Back
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 text-center">
            <div className="text-4xl font-bold text-white mb-2">{confirmedRsvps.length}</div>
            <div className="text-gray-400">Total RSVPs</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 text-center">
            <div className="text-4xl font-bold text-green-400 mb-2">{totalGuests}</div>
            <div className="text-gray-400">Expected Guests</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 text-center">
            <div className="text-4xl font-bold text-blue-400 mb-2">
              {Math.round((confirmedRsvps.length / Math.max(1, openHouse?.rsvp_count || 1)) * 100)}%
            </div>
            <div className="text-gray-400">Confirmation Rate</div>
          </div>
        </div>

        {/* RSVPs List */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Guest List</h2>

          {rsvps.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-bold text-white mb-2">No RSVPs Yet</h3>
              <p className="text-gray-400">RSVPs will appear here as guests register.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {rsvps.map((rsvp) => (
                <div
                  key={rsvp.id}
                  className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-bold text-white">{rsvp.guest_name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          rsvp.status === "confirmed"
                            ? "bg-green-500/20 text-green-400"
                            : rsvp.status === "cancelled"
                            ? "bg-red-500/20 text-red-400"
                            : "bg-gray-500/20 text-gray-400"
                        }`}>
                          {rsvp.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-300 mb-2">
                        <div>
                          <span className="text-gray-400">Email:</span> {rsvp.guest_email}
                        </div>
                        {rsvp.guest_phone && (
                          <div>
                            <span className="text-gray-400">Phone:</span> {rsvp.guest_phone}
                          </div>
                        )}
                        <div>
                          <span className="text-gray-400">Party Size:</span> {rsvp.party_size} {rsvp.party_size === 1 ? "guest" : "guests"}
                        </div>
                        <div>
                          <span className="text-gray-400">RSVP'd:</span> {new Date(rsvp.created_at).toLocaleDateString()}
                        </div>
                      </div>

                      {rsvp.notes && (
                        <div className="mt-2 p-3 bg-white/5 rounded text-sm text-gray-300">
                          <span className="text-gray-400 font-semibold">Notes:</span> {rsvp.notes}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <a
                        href={`mailto:${rsvp.guest_email}`}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded transition-all"
                      >
                        Email
                      </a>
                      {rsvp.guest_phone && (
                        <a
                          href={`tel:${rsvp.guest_phone}`}
                          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded transition-all"
                        >
                          Call
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Export Options */}
        {rsvps.length > 0 && (
          <div className="mt-6 flex justify-end space-x-4">
            <button
              onClick={() => {
                const csv = [
                  ["Name", "Email", "Phone", "Party Size", "Notes", "Status", "RSVP Date"],
                  ...rsvps.map(r => [
                    r.guest_name,
                    r.guest_email,
                    r.guest_phone || "",
                    r.party_size,
                    r.notes || "",
                    r.status,
                    new Date(r.created_at).toLocaleString()
                  ])
                ].map(row => row.join(",")).join("\n");

                const blob = new Blob([csv], { type: "text/csv" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `open-house-rsvps-${params.id}.csv`;
                a.click();
              }}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
            >
              📥 Export to CSV
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
