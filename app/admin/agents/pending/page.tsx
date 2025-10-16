"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

interface PendingAgent {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  created_at: string;
  status: string;
}

export default function PendingAgentsPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const [agents, setAgents] = useState<PendingAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && profile) {
      loadPendingAgents();
    }
  }, [authLoading, profile]);

  async function loadPendingAgents() {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "agent")
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAgents(data || []);
    } catch (err: any) {
      console.error("Error loading agents:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function approveAgent(agentId: string) {
    if (!confirm("Approve this agent?")) return;

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ status: "active" })
        .eq("id", agentId);

      if (error) throw error;

      alert("Agent approved successfully!");
      loadPendingAgents();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  }

  async function rejectAgent(agentId: string) {
    if (!confirm("Reject this agent? This will set their status to inactive.")) return;

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ status: "inactive" })
        .eq("id", agentId);

      if (error) throw error;

      alert("Agent rejected");
      loadPendingAgents();
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

  return (
    <div className="min-h-screen bg-gradient-hero p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Pending Agent Applications</h1>
            <p className="text-gray-300">Review and approve new agents</p>
          </div>
          <Link
            href="/admin"
            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {/* Agents List */}
        {agents.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-12 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-white mb-2">No Pending Applications</h2>
            <p className="text-gray-300">All agents have been reviewed!</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {agents.map((agent) => (
              <div
                key={agent.id}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="text-3xl">👤</div>
                      <div>
                        <h3 className="text-xl font-bold text-white">
                          {agent.first_name} {agent.last_name}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          Applied: {new Date(agent.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-gray-400 text-sm">Email</p>
                        <p className="text-white">{agent.email}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Phone</p>
                        <p className="text-white">{agent.phone || "Not provided"}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm">
                        {agent.status}
                      </span>
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                        {agent.id.slice(0, 8)}...
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2 ml-6">
                    <button
                      onClick={() => approveAgent(agent.id)}
                      className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-all"
                    >
                      ✓ Approve
                    </button>
                    <button
                      onClick={() => rejectAgent(agent.id)}
                      className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all"
                    >
                      ✗ Reject
                    </button>
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
