import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw, PlayCircle, Database, Activity, AlertCircle, CheckCircle, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

export default function MLSSync() {
  const [loading, setLoading] = useState(false);
  const [lastResponse, setLastResponse] = useState<any>(null);
  const [counts, setCounts] = useState<any>({});
  const [healthCheck, setHealthCheck] = useState<any>(null);
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);
  const { toast } = useToast();

  const refreshCounts = async () => {
    const [listings, members, offices, openhouses] = await Promise.all([
      supabase.from('mls_listings').select('*', { count: 'exact', head: true }),
      supabase.from('mls_members').select('*', { count: 'exact', head: true }),
      supabase.from('mls_offices').select('*', { count: 'exact', head: true }),
      supabase.from('mls_open_houses').select('*', { count: 'exact', head: true })
    ]);
    
    setCounts({
      listings: listings.count || 0,
      members: members.count || 0,
      offices: offices.count || 0,
      openhouses: openhouses.count || 0
    });
  };

  useEffect(() => {
    refreshCounts();
  }, []);

  const handleRefreshToken = async () => {
    setLoading(true);
    toast({ title: "Token refresh not yet implemented" });
    setLoading(false);
  };

  const handleTestRun = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://xhqwmtzawqfffepcqxwf.supabase.co/functions/v1/sync-mls-data`,
        {
          method: 'POST',
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhocXdtdHphd3FmZmZlcGNxeHdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2MDQwODEsImV4cCI6MjA3MDE4MDA4MX0.gihIkhLS_pwr9Mz6uG6vm7BXPzfa2TcpvIrRECRfxfg',
            'x-run-source': 'manual-test',
            'Content-Type': 'application/json'
          }
        }
      );

      const data = await response.json();
      setLastResponse(data);

      if (response.ok && data.ok) {
        toast({
          title: "Test sync successful",
          description: `Fetched: ${data.fetched}, Inserted: ${data.inserted}`
        });
        await refreshCounts();
      } else {
        toast({
          title: "Test sync failed",
          description: data.error || 'Unknown error',
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Request failed",
        description: String(error),
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleIncrementalRun = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://xhqwmtzawqfffepcqxwf.supabase.co/functions/v1/sync_realtyna`,
        {
          method: 'POST',
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhocXdtdHphd3FmZmZlcGNxeHdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2MDQwODEsImV4cCI6MjA3MDE4MDA4MX0.gihIkhLS_pwr9Mz6uG6vm7BXPzfa2TcpvIrRECRfxfg',
            'Content-Type': 'application/json'
          }
        }
      );

      const data = await response.json();
      setLastResponse(data);

      if (response.ok && data.ok) {
        toast({
          title: "Incremental sync successful",
          description: `Processed: ${data.total}, Pages: ${data.pages_fetched}`
        });
        await refreshCounts();
      } else {
        toast({
          title: "Incremental sync failed",
          description: data.error || 'Unknown error',
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Request failed",
        description: String(error),
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleHealthCheck = async () => {
    setIsCheckingHealth(true);
    try {
      const { data, error } = await supabase.functions.invoke('mls-health');

      if (error) throw error;
      
      setHealthCheck(data);
      toast({
        title: data.ok ? "Health check passed" : "Health check failed",
        description: data.ok ? "All systems operational" : data.error,
        variant: data.ok ? "default" : "destructive"
      });
    } catch (error) {
      toast({
        title: "Health check failed",
        description: String(error),
        variant: "destructive"
      });
      setHealthCheck({ ok: false, error: String(error) });
    } finally {
      setIsCheckingHealth(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-gradient mb-2">MLS Sync Control</h1>
          <p className="text-muted-foreground">Manage Realtyna MLS data synchronization</p>
        </div>
        <Link to="/admin">
          <Badge variant="outline" className="text-xs cursor-pointer hover:bg-accent">
            <Activity className="h-3 w-3 mr-1" />
            Live Dashboard
          </Badge>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="card-glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Refresh Token
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Refresh the Realtyna API token
            </p>
            <Button 
              onClick={handleRefreshToken} 
              disabled={loading}
              className="w-full"
              variant="outline"
            >
              Refresh Token
            </Button>
          </CardContent>
        </Card>

        <Card className="card-glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlayCircle className="h-5 w-5" />
              Test Run (25 rows)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Fetch 25 properties to verify connection
            </p>
            <Button 
              onClick={handleTestRun} 
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Running...' : 'Run Test'}
            </Button>
          </CardContent>
        </Card>

        <Card className="card-glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Incremental Sync
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Sync all new/updated properties
            </p>
            <Button 
              onClick={handleIncrementalRun} 
              disabled={loading}
              className="w-full"
              variant="default"
            >
              {loading ? 'Running...' : 'Run Incremental'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {lastResponse && (
        <Card className={`card-glass ${lastResponse.ok ? 'border-green-500/50' : 'border-red-500/50'}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {lastResponse.ok ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-500" />
              )}
              Last Run: {lastResponse.ok ? 'Success' : 'Error'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {lastResponse.ok ? (
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-xs text-muted-foreground">Status</div>
                  <Badge variant="outline" className="mt-1">200 OK</Badge>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Fetched</div>
                  <div className="text-2xl font-bold">{lastResponse.fetched || 0}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Inserted</div>
                  <div className="text-2xl font-bold">{lastResponse.inserted || 0}</div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open('https://supabase.com/dashboard/project/xhqwmtzawqfffepcqxwf/editor', '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View in Database
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Error:</span>
                  <Badge variant="destructive">Failed</Badge>
                </div>
                <pre className="text-xs overflow-auto p-4 bg-destructive/10 rounded-lg">
                  {lastResponse.error || 'Unknown error'}
                </pre>
                {lastResponse.error_detail && (
                  <div className="text-xs text-muted-foreground">
                    {lastResponse.error_detail}
                  </div>
                )}
              </div>
            )}
            <details className="text-xs">
              <summary className="cursor-pointer text-muted-foreground">View Full Response</summary>
              <pre className="mt-2 overflow-auto p-4 bg-muted/50 rounded-lg">
                {JSON.stringify(lastResponse, null, 2)}
              </pre>
            </details>
          </CardContent>
        </Card>
      )}

      <Card className="card-glass">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Database Counts</CardTitle>
          <Button size="sm" variant="outline" onClick={refreshCounts}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-xs text-muted-foreground">Listings</div>
              <div className="text-2xl font-bold">
                {counts.listings?.toLocaleString() || '—'}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Members</div>
              <div className="text-2xl font-bold">
                {counts.members?.toLocaleString() || '—'}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Offices</div>
              <div className="text-2xl font-bold">
                {counts.offices?.toLocaleString() || '—'}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Open Houses</div>
              <div className="text-2xl font-bold">
                {counts.openhouses?.toLocaleString() || '—'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Health Check */}
      <Card className="card-glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Health Check
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Verify Realtyna API connectivity and token status
          </p>
          <Button
            onClick={handleHealthCheck}
            disabled={isCheckingHealth}
            className="w-full"
            variant="outline"
          >
            {isCheckingHealth ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Checking...
              </>
            ) : (
              <>
                <Activity className="mr-2 h-4 w-4" />
                Run Health Check
              </>
            )}
          </Button>

          {healthCheck && (
            <div className="space-y-3 p-4 bg-background/50 rounded-lg border">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Overall Status:</span>
                <Badge variant={healthCheck.ok ? "default" : "destructive"}>
                  {healthCheck.ok ? "Healthy" : "Unhealthy"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Token Status:</span>
                <Badge variant={healthCheck.token_ok ? "default" : "destructive"}>
                  {healthCheck.token_ok ? "Valid" : "Invalid"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">API Base:</span>
                <Badge variant={healthCheck.base_ok ? "default" : "destructive"}>
                  {healthCheck.base_ok ? "Accessible" : "Unreachable"}
                </Badge>
              </div>
              {healthCheck.error && (
                <div className="text-sm text-destructive mt-2">
                  Error: {healthCheck.error}
                </div>
              )}
              <div className="text-xs text-muted-foreground">
                Checked at: {new Date(healthCheck.timestamp).toLocaleString()}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
