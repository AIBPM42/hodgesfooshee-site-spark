import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { 
  Database, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  TrendingUp,
  Building,
  Users,
  MapPin,
  Calendar,
  Loader2,
  History,
  ExternalLink
} from 'lucide-react';

export default function MLSModule() {
  const [loading, setLoading] = useState<string | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch real-time MLS stats
  const { data: mlsStats } = useQuery({
    queryKey: ['mls-stats'],
    queryFn: async () => {
      const [listingsResult, syncLogResult] = await Promise.all([
        supabase
          .from('mls_listings')
          .select('*', { count: 'exact', head: true })
          .in('standard_status', ['Active', 'Coming Soon']),
        supabase
          .from('sync_log')
          .select('*')
          .eq('function_name', 'sync-mls-data')
          .eq('success', true)
          .order('started_at', { ascending: false })
          .limit(1)
      ]);

      return {
        activeListings: listingsResult.count || 0,
        lastSync: syncLogResult.data?.[0]
      };
    },
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  // Fetch sync history
  const { data: syncHistory } = useQuery({
    queryKey: ['sync-history'],
    queryFn: async () => {
      const { data } = await supabase
        .from('sync_log')
        .select('*')
        .eq('function_name', 'sync-mls-data')
        .order('started_at', { ascending: false })
        .limit(50);
      return data || [];
    },
    refetchInterval: 10000 // Refresh every 10 seconds
  });

  async function runSync(kind: 'listings' | 'members' | 'offices' | 'openhouses') {
    if (kind !== 'listings') {
      toast({
        title: "Coming Soon",
        description: `${kind} sync is not yet available`,
        variant: "default",
      });
      return;
    }

    // Prevent rapid clicks
    if (lastSyncTime && Date.now() - lastSyncTime.getTime() < 15000) {
      toast({
        title: "Please wait",
        description: "Please wait 15 seconds between sync requests",
        variant: "destructive",
      });
      return;
    }

    setLoading(kind);
    setLastSyncTime(new Date());
    
    try {
      const { data: user } = await supabase.auth.getUser();
      
      const { data, error } = await supabase.functions.invoke('sync-mls-data', {
        method: 'POST',
        headers: {
          'x-run-source': 'manual',
          'x-user-id': user.user?.id || ''
        },
        body: {}
      });
      
      if (error) throw error;
      
      toast({
        title: "Sync Complete",
        description: `Fetched ${data?.fetched || 0}, inserted ${data?.inserted || 0}`,
      });
      
      // Refresh data
      queryClient.invalidateQueries({ queryKey: ['mls-stats'] });
      queryClient.invalidateQueries({ queryKey: ['sync-history'] });
      
    } catch (e: any) {
      toast({
        title: "Sync Failed",
        description: `Sync failed: ${e.message ?? e}`,
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-[var(--text-primary)] mb-2">
          MLS Data Sync Module
        </h1>
        <p className="text-lg text-[var(--text-secondary)]">
          Real-time synchronization with RealTracs MLS system
        </p>
      </div>

      {/* Connection Status */}
      <Card className="bg-[var(--surface)] border border-[var(--border-subtle)] rounded-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[var(--text-primary)]">
            <Database className="h-5 w-5" />
            RealTracs Connection Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-green-400" />
              <div>
                <p className="font-medium text-[var(--text-primary)]">Connected to RealTracs MLS</p>
                <p className="text-sm text-[var(--text-secondary)]">OAuth token valid until Mar 15, 2025</p>
              </div>
            </div>
            <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
              Active
            </Badge>
          </div>
          
          <Alert className="bg-blue-500/10 border-blue-500/30">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-blue-300">
              API rate limits: 1,000 requests per hour (Current: 847/1,000)
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Data Sync Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-[var(--surface)] border border-[var(--border-subtle)] rounded-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--text-secondary)] mb-1">Active Listings</p>
                <p className="text-2xl font-bold text-[var(--text-primary)]">
                  {mlsStats?.activeListings || 0}
                </p>
                <p className="text-sm text-green-400 font-medium">
                  {mlsStats?.lastSync ? `Last sync: ${new Date(mlsStats.lastSync.started_at).toLocaleTimeString()}` : 'No sync yet'}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        {[
          { title: 'Offices', value: '—', icon: Building, change: 'Coming soon', color: 'text-blue-400' },
          { title: 'Members', value: '—', icon: Users, change: 'Coming soon', color: 'text-purple-400' },
          { title: 'Open Houses', value: '—', icon: Calendar, change: 'Coming soon', color: 'text-orange-400' }
        ].map((metric) => (
          <Card key={metric.title} className="bg-[var(--surface)] border border-[var(--border-subtle)] rounded-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[var(--text-secondary)] mb-1">{metric.title}</p>
                  <p className="text-2xl font-bold text-[var(--text-primary)]">{metric.value}</p>
                  <p className={`text-sm ${metric.color} font-medium`}>{metric.change}</p>
                </div>
                <metric.icon className={`h-8 w-8 ${metric.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sync Controls */}
      <Card className="bg-[var(--surface)] border border-[var(--border-subtle)] rounded-xl">
        <CardHeader>
          <CardTitle className="text-[var(--text-primary)]">Data Synchronization</CardTitle>
          <CardDescription className="text-[var(--text-secondary)]">
            Manual sync controls and automation settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button 
              className="btn-accent" 
              onClick={() => runSync('listings')}
              disabled={loading === 'listings'}
            >
              {loading === 'listings' ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              {loading === 'listings' ? 'Syncing...' : 'Sync Listings'}
            </Button>
            <Button 
              className="btn-accent"
              onClick={() => runSync('offices')}
              disabled={true}
              title="Coming soon"
            >
              <Building className="h-4 w-4 mr-2" />
              Sync Offices
            </Button>
            <Button 
              className="btn-accent"
              onClick={() => runSync('members')}
              disabled={true}
              title="Coming soon"
            >
              <Users className="h-4 w-4 mr-2" />
              Sync Members
            </Button>
            <Button 
              className="btn-accent"
              onClick={() => runSync('openhouses')}
              disabled={true}
              title="Coming soon"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Sync Open Houses
            </Button>
          </div>
          
          <div className="flex items-center gap-4 pt-4 border-t border-[var(--border-subtle)]">
            <Clock className="h-5 w-5 text-[var(--text-secondary)]" />
            <div className="flex-1">
              <p className="text-sm font-medium text-[var(--text-primary)]">Auto-sync Schedule</p>
              <p className="text-xs text-[var(--text-secondary)]">Every 15 minutes during business hours (8 AM - 8 PM CST)</p>
            </div>
            <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
              Enabled
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Sync History */}
      <Card className="bg-[var(--surface)] border border-[var(--border-subtle)] rounded-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[var(--text-primary)]">
            <History className="h-5 w-5" />
            Sync History
          </CardTitle>
          <CardDescription className="text-[var(--text-secondary)]">
            Recent MLS data synchronization activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {syncHistory && syncHistory.length > 0 ? (
              syncHistory.map((run) => {
                const startTime = new Date(run.started_at);
                const endTime = run.completed_at ? new Date(run.completed_at) : null;
                const duration = endTime ? Math.round((endTime.getTime() - startTime.getTime()) / 1000) : null;
                
                return (
                  <div key={run.id} className="flex items-start gap-4 py-4 border-b border-[var(--border-subtle)] last:border-0">
                    <div className={`p-2 rounded-full ${
                      run.success ? 'bg-green-500/20' : 'bg-red-500/20'
                    }`}>
                      {run.success ? (
                        <CheckCircle className="h-4 w-4 text-green-400" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-red-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-[var(--text-primary)]">
                          {run.success ? 'Sync completed' : 'Sync failed'}
                        </p>
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-[var(--text-secondary)]">
                            {startTime.toLocaleString()}
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            asChild
                          >
                            <a
                              href={`https://supabase.com/dashboard/project/xhqwmtzawqfffepcqxwf/functions/sync-mls-data/logs`}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="View logs in Supabase"
                            >
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-[var(--text-secondary)] mt-1">
                        {run.success ? (
                          `Fetched: ${run.fetched || 0}, Inserted: ${run.inserted || 0}${duration ? `, Duration: ${duration}s` : ''} (${run.run_source})`
                        ) : (
                          run.message || 'Unknown error'
                        )}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-[var(--text-secondary)] py-8">
                No sync history yet. Run your first sync to see results here.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}