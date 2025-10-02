import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw, PlayCircle, Database } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function MLSSync() {
  const [loading, setLoading] = useState(false);
  const [lastResponse, setLastResponse] = useState<any>(null);
  const [listingsCount, setListingsCount] = useState<number | null>(null);
  const { toast } = useToast();

  const refreshCount = async () => {
    const { count } = await supabase
      .from('mls_listings')
      .select('*', { count: 'exact', head: true });
    setListingsCount(count || 0);
  };

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
        await refreshCount();
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
        await refreshCount();
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-gradient mb-2">MLS Sync Control</h1>
        <p className="text-muted-foreground">Manage Realtyna MLS data synchronization</p>
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
        <Card className="card-glass">
          <CardHeader>
            <CardTitle>Last Response</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs overflow-auto p-4 bg-muted/50 rounded-lg">
              {JSON.stringify(lastResponse, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}

      <Card className="card-glass">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Database Count</CardTitle>
          <Button size="sm" variant="outline" onClick={refreshCount}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {listingsCount !== null ? listingsCount.toLocaleString() : 'Click to load'}
          </div>
          <p className="text-sm text-muted-foreground">Total mls_listings records</p>
        </CardContent>
      </Card>
    </div>
  );
}
