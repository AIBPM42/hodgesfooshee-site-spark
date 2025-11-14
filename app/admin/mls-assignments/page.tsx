"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import PremiumCard from "@/components/ui/PremiumCard";
import { KpiTile } from "@/components/ui/KpiTile";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, X, UserPlus, Trash2, RefreshCw } from "lucide-react";

interface Agent {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  status: string;
}

interface Assignment {
  id: string;
  listing_key: string;
  agent_id: string;
  property_data: any;
  assignment_type: string;
  status: string;
  assigned_at: string;
  agent?: Agent;
}

interface Property {
  ListingKey: string;
  UnparsedAddress: string;
  City: string;
  StateOrProvince: string;
  PostalCode: string;
  ListPrice: number;
  BedroomsTotal: number;
  BathroomsTotalInteger: number;
  LivingArea: number;
  PropertyType: string;
  StandardStatus: string;
  Media?: Array<{ MediaURL: string }>;
}

export default function MLSAssignmentsPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState("");

  // Search state
  const [searchCity, setSearchCity] = useState("Nashville");
  const [searchZip, setSearchZip] = useState("");

  // Assignment modal state
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [selectedAgentId, setSelectedAgentId] = useState("");
  const [assignmentNotes, setAssignmentNotes] = useState("");

  useEffect(() => {
    if (!authLoading && profile) {
      loadData();
    }
  }, [authLoading, profile]);

  async function loadData() {
    try {
      // Load active agents
      const { data: agentsData, error: agentsError } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "agent")
        .eq("status", "active")
        .order("first_name", { ascending: true });

      if (agentsError) throw agentsError;
      setAgents(agentsData || []);

      // Load assignments
      await loadAssignments();
    } catch (err: any) {
      console.error("Error loading data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadAssignments() {
    const { data, error } = await supabase
      .from("property_agent_assignments")
      .select(`
        *,
        agent:profiles!agent_id(id, first_name, last_name, email, phone)
      `)
      .eq("status", "active")
      .order("assigned_at", { ascending: false });

    if (error) {
      console.error("Error loading assignments:", error);
      return;
    }

    setAssignments(data || []);
  }

  async function searchProperties() {
    if (!searchCity && !searchZip) {
      alert("Please enter a city or ZIP code to search");
      return;
    }

    setSearchLoading(true);
    setError("");

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const apiKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      let url = `${supabaseUrl}/functions/v1/mls-search?`;
      if (searchCity) url += `city=${encodeURIComponent(searchCity)}&`;
      if (searchZip) url += `postalCode=${encodeURIComponent(searchZip)}&`;
      url += `status=Active&limit=20`;

      const response = await fetch(url, {
        headers: { 'apikey': apiKey! }
      });

      if (!response.ok) throw new Error("Failed to search properties");

      const data = await response.json();
      setProperties(data.properties || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSearchLoading(false);
    }
  }

  async function createAssignment() {
    if (!selectedProperty || !selectedAgentId) {
      alert("Please select a property and agent");
      return;
    }

    try {
      const { error } = await supabase
        .from("property_agent_assignments")
        .insert({
          listing_key: selectedProperty.ListingKey,
          agent_id: selectedAgentId,
          assigned_by: user?.id,
          property_data: {
            address: selectedProperty.UnparsedAddress,
            city: selectedProperty.City,
            state: selectedProperty.StateOrProvince,
            zip: selectedProperty.PostalCode,
            price: selectedProperty.ListPrice,
            beds: selectedProperty.BedroomsTotal,
            baths: selectedProperty.BathroomsTotalInteger,
            sqft: selectedProperty.LivingArea,
          },
          assignment_type: "manual",
          status: "active",
          notes: assignmentNotes || null,
        });

      if (error) throw error;

      alert("Assignment created successfully!");
      setSelectedProperty(null);
      setSelectedAgentId("");
      setAssignmentNotes("");
      loadAssignments();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  }

  async function removeAssignment(assignmentId: string) {
    if (!confirm("Remove this assignment?")) return;

    try {
      const { error } = await supabase
        .from("property_agent_assignments")
        .update({ status: "inactive" })
        .eq("id", assignmentId);

      if (error) throw error;

      alert("Assignment removed");
      loadAssignments();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!user || !profile || (profile.role !== "super_admin" && profile.role !== "broker")) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="card-matte max-w-md text-center p-8">
          <div className="text-4xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted mb-6">This page is for admins and brokers only.</p>
          <Link href="/admin" className="text-copper-600 hover:underline">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const stats = {
    totalAssignments: assignments.length,
    activeAgents: agents.length,
    assignmentsThisWeek: assignments.filter(a => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(a.assigned_at) > weekAgo;
    }).length,
    propertiesFound: properties.length,
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-[34px] font-extrabold tracking-tight text-[var(--text-strong)]">
          MLS Property Assignments
        </h1>
        <p className="mt-1 text-[15px] text-[var(--text-muted)]">
          Manually assign Hodges & Fooshee agents to MLS property listings
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiTile
          label="Active Assignments"
          value={stats.totalAssignments.toString()}
          hint="Currently assigned"
          strong
        />
        <KpiTile
          label="Active Agents"
          value={stats.activeAgents.toString()}
          hint="Available to assign"
          strong
        />
        <KpiTile
          label="This Week"
          value={stats.assignmentsThisWeek.toString()}
          hint="New assignments"
          strong
        />
        <KpiTile
          label="Properties Found"
          value={stats.propertiesFound.toString()}
          hint="In search results"
          strong
        />
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Property Search */}
        <PremiumCard title="Search MLS Properties" subtitle="Find properties to assign to agents">
          <div className="space-y-4">
            {/* Search Form */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">City</label>
                <input
                  type="text"
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  placeholder="Nashville"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">ZIP Code</label>
                <input
                  type="text"
                  value={searchZip}
                  onChange={(e) => setSearchZip(e.target.value)}
                  placeholder="37205"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>

            <Button
              onClick={searchProperties}
              disabled={searchLoading}
              className="w-full"
            >
              <Search className="w-4 h-4 mr-2" />
              {searchLoading ? "Searching..." : "Search Properties"}
            </Button>

            {/* Property Results */}
            <div className="max-h-[600px] overflow-y-auto space-y-3">
              {properties.length === 0 ? (
                <div className="text-center py-8 text-muted">
                  <Search className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <p>Search for properties to assign to agents</p>
                </div>
              ) : (
                properties.map((property) => (
                  <div
                    key={property.ListingKey}
                    className="border rounded-lg p-3 hover:bg-[var(--panel)] transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="font-semibold">{property.UnparsedAddress}</div>
                        <div className="text-sm text-muted">
                          {property.City}, {property.StateOrProvince} {property.PostalCode}
                        </div>
                        <div className="text-sm font-medium text-copper-600 mt-1">
                          ${property.ListPrice?.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted mt-1">
                          {property.BedroomsTotal} bd | {property.BathroomsTotalInteger} ba | {property.LivingArea?.toLocaleString()} sqft
                        </div>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedProperty(property)}
                      className="w-full"
                    >
                      <UserPlus className="w-3 h-3 mr-1" />
                      Assign to Agent
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </PremiumCard>

        {/* Right: Current Assignments */}
        <PremiumCard title="Current Assignments" subtitle="Manage existing property assignments">
          <div className="max-h-[700px] overflow-y-auto">
            {assignments.length === 0 ? (
              <div className="text-center py-8 text-muted">
                <p>No assignments yet</p>
                <p className="text-sm mt-1">Search for properties and assign them to agents</p>
              </div>
            ) : (
              <div className="space-y-3">
                {assignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="border rounded-lg p-3"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="font-semibold">{assignment.property_data?.address}</div>
                        <div className="text-sm text-muted">
                          {assignment.property_data?.city}, {assignment.property_data?.state} {assignment.property_data?.zip}
                        </div>
                        <div className="text-sm mt-1">
                          <span className="font-medium">Agent:</span>{" "}
                          {assignment.agent?.first_name} {assignment.agent?.last_name}
                        </div>
                        <div className="text-xs text-muted mt-1">
                          Assigned {new Date(assignment.assigned_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeAssignment(assignment.id)}
                      className="w-full text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Remove Assignment
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </PremiumCard>
      </div>

      {/* Assignment Modal */}
      {selectedProperty && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="card-matte max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold">Assign Property to Agent</h2>
              <button
                onClick={() => setSelectedProperty(null)}
                className="text-muted hover:text-strong"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4">
              <div className="font-semibold">{selectedProperty.UnparsedAddress}</div>
              <div className="text-sm text-muted">
                {selectedProperty.City}, {selectedProperty.StateOrProvince} {selectedProperty.PostalCode}
              </div>
              <div className="text-sm font-medium text-copper-600 mt-1">
                ${selectedProperty.ListPrice?.toLocaleString()}
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Select Agent</label>
                <select
                  value={selectedAgentId}
                  onChange={(e) => setSelectedAgentId(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="">Choose an agent...</option>
                  {agents.map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.first_name} {agent.last_name} ({agent.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Notes (Optional)</label>
                <textarea
                  value={assignmentNotes}
                  onChange={(e) => setAssignmentNotes(e.target.value)}
                  placeholder="Why this assignment..."
                  rows={2}
                  className="w-full px-3 py-2 border rounded-lg resize-none"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={createAssignment}
                  disabled={!selectedAgentId}
                  className="flex-1"
                >
                  Create Assignment
                </Button>
                <Button
                  onClick={() => setSelectedProperty(null)}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
