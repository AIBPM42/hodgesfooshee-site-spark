"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface OpenHouse {
  id: string;
  property_id: string;
  title: string;
  description: string | null;
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
  email: string;
}

export default function OpenHouseRSVPPage({ params }: { params: { id: string } }) {
  const { user } = useAuth();
  const router = useRouter();
  const [openHouse, setOpenHouse] = useState<OpenHouse | null>(null);
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    guest_name: "",
    guest_email: "",
    guest_phone: "",
    party_size: "1",
    notes: "",
  });

  useEffect(() => {
    loadOpenHouse();
  }, [params.id]);

  async function loadOpenHouse() {
    try {
      const { data: ohData, error: ohError } = await supabase
        .from("open_houses")
        .select("*")
        .eq("id", params.id)
        .single();

      if (ohError) throw ohError;
      setOpenHouse(ohData);

      // Load agent info
      const { data: agentData, error: agentError } = await supabase
        .from("profiles")
        .select("first_name, last_name, phone, email")
        .eq("id", ohData.agent_id)
        .single();

      if (agentError) throw agentError;
      setAgent(agentData);
    } catch (err: any) {
      console.error("Error loading open house:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const { error: insertError } = await supabase
        .from("open_house_rsvps")
        .insert({
          open_house_id: params.id,
          user_id: user?.id || null,
          guest_name: formData.guest_name,
          guest_email: formData.guest_email,
          guest_phone: formData.guest_phone || null,
          party_size: parseInt(formData.party_size),
          notes: formData.notes || null,
          status: "confirmed",
        });

      if (insertError) throw insertError;

      // Update RSVP count
      const { error: updateError } = await supabase.rpc('increment_rsvp_count', {
        open_house_id: params.id
      });

      // If function doesn't exist, manually update
      if (updateError) {
        await supabase
          .from("open_houses")
          .update({ rsvp_count: (openHouse?.rsvp_count || 0) + 1 })
          .eq("id", params.id);
      }

      setSuccess(true);
    } catch (err: any) {
      console.error("Error submitting RSVP:", err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (error && !openHouse) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
        <div className="glass-card max-w-md text-center p-8">
          <div className="text-4xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-white mb-4">Open House Not Found</h1>
          <p className="text-gray-300 mb-6">{error}</p>
          <Link href="/" className="text-hf-orange hover:underline">
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
        <div className="glass-card max-w-2xl p-8">
          <div className="text-center">
            <div className="text-6xl mb-6">✅</div>
            <h1 className="text-3xl font-bold text-white mb-4">RSVP Confirmed!</h1>
            <p className="text-xl text-gray-300 mb-8">
              Thank you for registering for the open house!
            </p>

            <div className="bg-white/10 rounded-xl p-6 mb-8 text-left">
              <h2 className="text-xl font-bold text-white mb-4">{openHouse?.title}</h2>
              <div className="space-y-2 text-gray-300">
                <p>📍 {openHouse?.address}, {openHouse?.city}, {openHouse?.state}</p>
                <p>📅 {new Date(openHouse?.start_time || "").toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}</p>
                <p>🕒 {new Date(openHouse?.start_time || "").toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit'
                })} - {new Date(openHouse?.end_time || "").toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit'
                })}</p>
              </div>

              {agent && (
                <div className="mt-6 pt-6 border-t border-white/10">
                  <p className="text-sm text-gray-400 mb-2">Your Host:</p>
                  <p className="text-white font-semibold">{agent.first_name} {agent.last_name}</p>
                  {agent.phone && <p className="text-gray-300">{agent.phone}</p>}
                  <p className="text-gray-300">{agent.email}</p>
                </div>
              )}
            </div>

            <div className="text-gray-400 text-sm mb-8">
              A confirmation has been recorded. See you there!
            </div>

            <div className="flex justify-center space-x-4">
              <Link
                href="/"
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
              >
                Return to Homepage
              </Link>
              <Link
                href="/search/properties"
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
              >
                Search Properties
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const startDate = new Date(openHouse?.start_time || "");
  const endDate = new Date(openHouse?.end_time || "");

  return (
    <div className="min-h-screen bg-gradient-hero py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-block text-white/70 hover:text-white mb-8 transition-colors">
          ← Back to Homepage
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Property Info */}
          <div className="glass-card rounded-xl overflow-hidden">
            <div className="relative h-64 bg-gradient-to-br from-slate-700 to-slate-800">
              {openHouse?.image_url ? (
                <img
                  src={openHouse.image_url}
                  alt={openHouse.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-8xl">
                  🏠
                </div>
              )}
              <div className="absolute top-4 right-4 px-4 py-2 bg-hf-orange text-white font-semibold rounded-full">
                Open House
              </div>
            </div>

            <div className="p-6">
              <h1 className="text-3xl font-bold text-white mb-4">{openHouse?.title}</h1>

              <div className="space-y-3 mb-6">
                <div className="flex items-start text-gray-300">
                  <span className="mr-3">📍</span>
                  <span>{openHouse?.address}, {openHouse?.city}, {openHouse?.state} {openHouse?.zip_code}</span>
                </div>

                <div className="flex items-center text-white">
                  <span className="mr-3">📅</span>
                  <span>{startDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}</span>
                </div>

                <div className="flex items-center text-gray-300">
                  <span className="mr-3">🕒</span>
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

              {(openHouse?.price || openHouse?.beds || openHouse?.baths || openHouse?.sqft) && (
                <div className="flex flex-wrap gap-4 mb-6 pb-6 border-b border-white/10">
                  {openHouse.price && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-hf-orange">
                        ${openHouse.price.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-400">Price</div>
                    </div>
                  )}
                  {openHouse.beds && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{openHouse.beds}</div>
                      <div className="text-xs text-gray-400">Beds</div>
                    </div>
                  )}
                  {openHouse.baths && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{openHouse.baths}</div>
                      <div className="text-xs text-gray-400">Baths</div>
                    </div>
                  )}
                  {openHouse.sqft && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{openHouse.sqft.toLocaleString()}</div>
                      <div className="text-xs text-gray-400">Sq Ft</div>
                    </div>
                  )}
                </div>
              )}

              {openHouse?.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-white mb-2">About This Property</h3>
                  <p className="text-gray-300">{openHouse.description}</p>
                </div>
              )}

              {agent && (
                <div className="bg-white/10 rounded-lg p-4">
                  <h3 className="text-sm text-gray-400 mb-2">Hosted By:</h3>
                  <p className="text-white font-semibold text-lg">{agent.first_name} {agent.last_name}</p>
                  {agent.phone && <p className="text-gray-300">{agent.phone}</p>}
                  <p className="text-gray-300">{agent.email}</p>
                </div>
              )}

              <div className="mt-6 text-center">
                <span className="text-gray-400">
                  {openHouse?.rsvp_count} {openHouse?.rsvp_count === 1 ? 'person has' : 'people have'} RSVP'd
                </span>
              </div>
            </div>
          </div>

          {/* RSVP Form */}
          <div className="glass-card rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">RSVP for This Open House</h2>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  name="guest_name"
                  value={formData.guest_name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="guest_email"
                  value={formData.guest_email}
                  onChange={handleChange}
                  required
                  placeholder="john@example.com"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="guest_phone"
                  value={formData.guest_phone}
                  onChange={handleChange}
                  placeholder="(555) 123-4567"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Number of Guests *
                </label>
                <select
                  name="party_size"
                  value={formData.party_size}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="1">1 person</option>
                  <option value="2">2 people</option>
                  <option value="3">3 people</option>
                  <option value="4">4 people</option>
                  <option value="5">5+ people</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Questions or Comments
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Any questions for the agent?"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-lg rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {submitting ? "Submitting..." : "Confirm RSVP"}
              </button>

              <p className="text-xs text-gray-400 text-center">
                By RSVPing, you agree to attend the open house at the scheduled time.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
