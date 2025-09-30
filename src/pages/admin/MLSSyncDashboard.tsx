import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { RefreshCw, CheckCircle, XCircle, Clock, Database } from "lucide-react";
import { toast } from "sonner";

interface SyncState {
  resource: string;
  last_run: string | null;
  last_mod: string | null;
  notes: string | null;
}

interface ResourceCount {
  resource: string;
  count: number;
}

export default function MLSSyncDashboard() {
  const [syncStates, setSyncStates] = useState<SyncState[]>([]);
  const [resourceCounts, setResourceCounts] = useState<ResourceCount[]>([]);
  const [syncing, setSyncing] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  const resources = [
    { name: "Property", table: "mls_listings", icon: Database },
    { name: "Member", table: "mls_members", icon: Database },
    { name: "Office", table: "mls_offices", icon: Database },
    { name: "OpenHouse", table: "mls_open_houses", icon: Database }
  ];

  const fetchSyncStatus = async () => {
    try {
      const { data: states } = await supabase
        .from("mls_sync_state")
        .select("*")
        .order("last_run", { ascending: false });

      setSyncStates(states || []);

      // Get record counts
      const counts = await Promise.all(
        resources.map(async (r) => {
          const { count } = await supabase
            .from(r.table as any)
            .select("*", { count: "exact", head: true });
          return { resource: r.name, count: count || 0 };
        })
      );

      setResourceCounts(counts);
    } catch (error) {
      console.error("Error fetching sync status:", error);
    } finally {
      setLoading(false);
    }
  };

  const triggerSync = async (resource: string) => {
    setSyncing((prev) => ({ ...prev, [resource]: true }));
    toast.info(`Starting ${resource} sync...`);

    try {
      const { data, error } = await supabase.functions.invoke("mls-sync-trigger", {
        body: { resource }
      });

      if (error) throw error;

      toast.success(`${resource} sync completed: ${data.records} records`);
      await fetchSyncStatus();
    } catch (error: any) {
      console.error(`${resource} sync error:`, error);
      toast.error(`${resource} sync failed: ${error.message}`);
    } finally {
      setSyncing((prev) => ({ ...prev, [resource]: false }));
    }
  };

  useEffect(() => {
    fetchSyncStatus();
    const interval = setInterval(fetchSyncStatus, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="p-8">Loading sync status...</div>;
  }

  return (
    <div className="container mx-auto p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">MLS Sync Dashboard</h1>
          <p className="text-muted-foreground">Realtyna Smart Plan Integration Status</p>
        </div>
        <Button onClick={fetchSyncStatus} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Resource Sync Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {resources.map((resource) => {
          const state = syncStates.find((s) => s.resource === resource.name);
          const count = resourceCounts.find((c) => c.resource === resource.name);
          const isSyncing = syncing[resource.name];
          const hasError = state?.notes?.includes("Error");

          return (
            <Card key={resource.name} className="card-glass p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <resource.icon className="h-6 w-6 text-luxury-gold" />
                  <div>
                    <h3 className="text-xl font-bold">{resource.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {count?.count.toLocaleString() || 0} records
                    </p>
                  </div>
                </div>
                {hasError ? (
                  <XCircle className="h-5 w-5 text-red-500" />
                ) : state?.last_run ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <Clock className="h-5 w-5 text-gray-400" />
                )}
              </div>

              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Sync:</span>
                  <span className="font-medium">
                    {state?.last_run
                      ? new Date(state.last_run).toLocaleString()
                      : "Never"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Modified:</span>
                  <span className="font-medium">
                    {state?.last_mod
                      ? new Date(state.last_mod).toLocaleString()
                      : "N/A"}
                  </span>
                </div>
                {state?.notes && (
                  <div className="pt-2 border-t border-white/10">
                    <span className={`text-xs ${hasError ? "text-red-400" : "text-green-400"}`}>
                      {state.notes}
                    </span>
                  </div>
                )}
              </div>

              <Button
                onClick={() => triggerSync(resource.name)}
                disabled={isSyncing}
                className="w-full"
                variant={hasError ? "destructive" : "default"}
              >
                {isSyncing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Sync Now
                  </>
                )}
              </Button>
            </Card>
          );
        })}
      </div>

      {/* Summary Stats */}
      <Card className="card-glass p-6">
        <h2 className="text-2xl font-bold mb-4">Sync Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-luxury-gold">
              {resourceCounts.reduce((sum, r) => sum + r.count, 0).toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">Total Records</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-500">
              {syncStates.filter((s) => !s.notes?.includes("Error")).length}
            </p>
            <p className="text-sm text-muted-foreground">Healthy Syncs</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-red-500">
              {syncStates.filter((s) => s.notes?.includes("Error")).length}
            </p>
            <p className="text-sm text-muted-foreground">Failed Syncs</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-500">
              {resources.length}
            </p>
            <p className="text-sm text-muted-foreground">Resources</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
