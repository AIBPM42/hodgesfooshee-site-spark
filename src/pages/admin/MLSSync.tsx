import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw, Database, Users, Building2, Calendar } from "lucide-react";

interface SyncState {
  resource: string;
  last_mod: string | null;
  last_run: string | null;
  notes: string | null;
}

interface ResourceStats {
  listings: number;
  members: number;
  offices: number;
  openhouses: number;
}

export default function MLSSync() {
  const { toast } = useToast();
  const [syncStates, setSyncStates] = useState<SyncState[]>([]);
  const [stats, setStats] = useState<ResourceStats>({ listings: 0, members: 0, offices: 0, openhouses: 0 });
  const [syncing, setSyncing] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  const resources = [
    { name: 'Property', label: 'Listings', icon: Database, function: 'sync-mls-listings' },
    { name: 'Member', label: 'Members', icon: Users, function: 'sync-mls-members' },
    { name: 'Office', label: 'Offices', icon: Building2, function: 'sync-mls-offices' },
    { name: 'OpenHouse', label: 'Open Houses', icon: Calendar, function: 'sync-mls-openhouses' },
  ];

  const fetchSyncStates = async () => {
    const { data, error } = await supabase
      .from('mls_sync_state')
      .select('*')
      .order('resource');

    if (!error && data) {
      setSyncStates(data);
    }
  };

  const fetchStats = async () => {
    const [listings, members, offices, openhouses] = await Promise.all([
      supabase.from('mls_listings').select('*', { count: 'exact', head: true }),
      supabase.from('mls_members').select('*', { count: 'exact', head: true }),
      supabase.from('mls_offices').select('*', { count: 'exact', head: true }),
      supabase.from('mls_open_houses').select('*', { count: 'exact', head: true }),
    ]);

    setStats({
      listings: listings.count || 0,
      members: members.count || 0,
      offices: offices.count || 0,
      openhouses: openhouses.count || 0,
    });
  };

  const runSync = async (functionName: string, resourceName: string) => {
    setSyncing({ ...syncing, [resourceName]: true });

    try {
      const { data, error } = await supabase.functions.invoke(functionName);

      if (error) throw error;

      toast({
        title: "Sync Complete",
        description: `${resourceName}: ${data.upserted} records synced in ${data.pages} pages (${data.duration_ms}ms)`,
      });

      await fetchSyncStates();
      await fetchStats();
    } catch (error: any) {
      toast({
        title: "Sync Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSyncing({ ...syncing, [resourceName]: false });
    }
  };

  useEffect(() => {
    Promise.all([fetchSyncStates(), fetchStats()]).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">MLS Data Sync</h1>
        <p className="text-muted-foreground">Monitor and manage MLS data synchronization</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="card-glass p-6">
          <div className="flex items-center gap-3 mb-2">
            <Database className="h-5 w-5 text-luxury-gold" />
            <span className="text-sm font-medium">Total Listings</span>
          </div>
          <div className="text-3xl font-bold">{stats.listings.toLocaleString()}</div>
        </Card>

        <Card className="card-glass p-6">
          <div className="flex items-center gap-3 mb-2">
            <Users className="h-5 w-5 text-luxury-gold" />
            <span className="text-sm font-medium">Total Members</span>
          </div>
          <div className="text-3xl font-bold">{stats.members.toLocaleString()}</div>
        </Card>

        <Card className="card-glass p-6">
          <div className="flex items-center gap-3 mb-2">
            <Building2 className="h-5 w-5 text-luxury-gold" />
            <span className="text-sm font-medium">Total Offices</span>
          </div>
          <div className="text-3xl font-bold">{stats.offices.toLocaleString()}</div>
        </Card>

        <Card className="card-glass p-6">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="h-5 w-5 text-luxury-gold" />
            <span className="text-sm font-medium">Open Houses</span>
          </div>
          <div className="text-3xl font-bold">{stats.openhouses.toLocaleString()}</div>
        </Card>
      </div>

      {/* Sync Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {resources.map((resource) => {
          const state = syncStates.find(s => s.resource === resource.name);
          const Icon = resource.icon;
          const isSyncing = syncing[resource.name];

          return (
            <Card key={resource.name} className="card-glass p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Icon className="h-6 w-6 text-luxury-gold" />
                  <div>
                    <h3 className="text-lg font-semibold">{resource.label}</h3>
                    <p className="text-sm text-muted-foreground">{resource.name}</p>
                  </div>
                </div>
                <Button
                  onClick={() => runSync(resource.function, resource.name)}
                  disabled={isSyncing}
                  size="sm"
                  className="btn"
                >
                  {isSyncing ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Syncing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Run Sync
                    </>
                  )}
                </Button>
              </div>

              {state ? (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Run:</span>
                    <span className="font-medium">
                      {state.last_run ? new Date(state.last_run).toLocaleString() : 'Never'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Modified:</span>
                    <span className="font-medium">
                      {state.last_mod ? new Date(state.last_mod).toLocaleString() : 'N/A'}
                    </span>
                  </div>
                  {state.notes && (
                    <div className="pt-2 border-t border-white/10">
                      <span className="text-muted-foreground text-xs">{state.notes}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">No sync data available</div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Instructions */}
      <Card className="card-glass p-6">
        <h3 className="text-lg font-semibold mb-3">Sync Instructions</h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>• <strong>Listings</strong>: Syncs every 10 minutes automatically (can run manually)</p>
          <p>• <strong>Open Houses</strong>: Syncs every 30 minutes automatically</p>
          <p>• <strong>Members & Offices</strong>: Sync every 6 hours automatically</p>
          <p>• All syncs use incremental updates (only modified records since last sync)</p>
          <p>• Manual sync can be triggered anytime using the "Run Sync" buttons above</p>
        </div>
      </Card>
    </div>
  );
}
