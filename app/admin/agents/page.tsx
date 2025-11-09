"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

interface Agent {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  status: string;
  created_at: string;
}

export default function AllAgentsPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("active");

  useEffect(() => {
    if (!authLoading && profile) {
      loadAgents();
    }
  }, [authLoading, profile, filter]);

  async function loadAgents() {
    try {
      let query = supabase
        .from("profiles")
        .select("*")
        .eq("role", "agent")
        .order("created_at", { ascending: false });

      if (filter !== "all") {
        query = query.eq("status", filter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setAgents(data || []);
    } catch (err: any) {
      console.error("Error loading agents:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function updateAgentStatus(agentId: string, newStatus: string) {
    if (!confirm(`Change agent status to ${newStatus}?`)) return;

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ status: newStatus })
        .eq("id", agentId);

      if (error) throw error;

      alert(`Agent status updated to ${newStatus}`);
      loadAgents();
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

  if (!user || !profile || (profile.role !== "super_admin" && profile.role !== "broker")) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8 max-w-md text-center">
          <div className="text-4xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-300 mb-6">This page is for super_admin and broker only.</p>
          <Link href="/admin" className="text-hf-orange hover:underline">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const stats = {
    total: agents.length,
    active: agents.filter(a => a.status === 'active').length,
    pending: agents.filter(a => a.status === 'pending').length,
    inactive: agents.filter(a => a.status === 'inactive').length,
  };

  return (
    <div className="min-h-screen bg-gradient-hero p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Manage Agents</h1>
            <p className="text-gray-300">View and manage all agents in your team</p>
          </div>
          <Link
            href="/admin"
            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-white">{stats.total}</div>
            <div className="text-gray-400 text-sm">Total Agents</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-green-400">{stats.active}</div>
            <div className="text-gray-400 text-sm">Active</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-yellow-400">{stats.pending}</div>
            <div className="text-gray-400 text-sm">Pending</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-red-400">{stats.inactive}</div>
            <div className="text-gray-400 text-sm">Inactive</div>
          </div>
        </div>

        {/* Filter */}
        <div className="flex space-x-2 mb-6">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg transition-all ${
              filter === "all"
                ? "bg-hf-orange text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            All ({stats.total})
          </button>
          <button
            onClick={() => setFilter("active")}
            className={`px-4 py-2 rounded-lg transition-all ${
              filter === "active"
                ? "bg-green-500 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            Active ({stats.active})
          </button>
          <button
            onClick={() => setFilter("inactive")}
            className={`px-4 py-2 rounded-lg transition-all ${
              filter === "inactive"
                ? "bg-red-500 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            Inactive ({stats.inactive})
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {/* Agents List */}
        {agents.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-12 text-center">
            <div className="text-6xl mb-4">👥</div>
            <h2 className="text-2xl font-bold text-white mb-2">No Agents Found</h2>
            <p className="text-gray-300">No agents match the current filter.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {agents.map((agent) => (
              <div
                key={agent.id}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="text-4xl">👤</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white">
                        {agent.first_name} {agent.last_name}
                      </h3>
                      <p className="text-gray-400 text-sm">{agent.email}</p>
                      <p className="text-gray-400 text-sm">
                        {agent.phone || "No phone"}
                      </p>
                      <p className="text-gray-500 text-xs mt-1">
                        Joined: {new Date(agent.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        agent.status === "active"
                          ? "bg-green-500/20 text-green-400"
                          : agent.status === "pending"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {agent.status}
                    </span>

                    <div className="flex flex-col space-y-2">
                      {agent.status !== "active" && (
                        <button
                          onClick={() => updateAgentStatus(agent.id, "active")}
                          className="px-4 py-1 bg-green-500 hover:bg-green-600 text-white text-sm rounded transition-all"
                        >
                          Activate
                        </button>
                      )}
                      {agent.status !== "inactive" && (
                        <button
                          onClick={() => updateAgentStatus(agent.id, "inactive")}
                          className="px-4 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded transition-all"
                        >
                          Deactivate
                        </button>
                      )}
                      {agent.status !== "suspended" && (
                        <button
                          onClick={() => updateAgentStatus(agent.id, "suspended")}
                          className="px-4 py-1 bg-orange-500 hover:bg-orange-600 text-white text-sm rounded transition-all"
                        >
                          Suspend
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
