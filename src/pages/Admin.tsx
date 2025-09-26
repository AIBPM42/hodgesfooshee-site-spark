import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, AlertCircle, Database, RefreshCw, Activity } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const BackendStatus = () => {
  const [functionResults, setFunctionResults] = useState<Record<string, any>>({});
  const [isRunningAll, setIsRunningAll] = useState(false);
  const [isRunning, setIsRunning] = useState<Record<string, boolean>>({});

  // Get database counts
  const { data: counts, refetch: refetchCounts } = useQuery({
    queryKey: ['backend-counts'],
    queryFn: async () => {
      const [listings, openHouses, members, offices, postalCodes] = await Promise.all([
        supabase.from('mls_listings').select('*', { count: 'exact', head: true }),
        supabase.from('mls_open_houses').select('*', { count: 'exact', head: true }),
        supabase.from('mls_members').select('*', { count: 'exact', head: true }),
        supabase.from('mls_offices').select('*', { count: 'exact', head: true }),
        supabase.from('mls_postal_codes').select('*', { count: 'exact', head: true }),
      ]);
      
      return {
        mls_listings: listings.count || 0,
        mls_open_houses: openHouses.count || 0,
        mls_members: members.count || 0,
        mls_offices: offices.count || 0,
        mls_postal_codes: postalCodes.count || 0,
      };
    },
  });

  // Get latest listings
  const { data: latestListings, refetch: refetchListings } = useQuery({
    queryKey: ['latest-listings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('mls_listings')
        .select('listing_key, list_price, city, standard_status, bedrooms_total, bathrooms_total_integer')
        .order('rf_modification_timestamp', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data || [];
    },
  });

  const runFunction = async (functionName: string, options?: { reset?: boolean }) => {
    setIsRunning(prev => ({ ...prev, [functionName]: true }));
    try {
      const url = options?.reset ? `${functionName}?reset=true` : functionName;
      const { data, error } = await supabase.functions.invoke(url);
      
      if (error) throw error;
      
      setFunctionResults(prev => ({
        ...prev,
        [functionName]: { success: true, data, timestamp: new Date().toISOString() }
      }));
      
      toast.success(`${functionName} completed successfully`);
      
      // Refresh counts after sync functions
      if (functionName.startsWith('sync_')) {
        refetchCounts();
        refetchListings();
      }
      
      return data;
    } catch (error) {
      console.error(`${functionName} error:`, error);
      setFunctionResults(prev => ({
        ...prev,
        [functionName]: { success: false, error: error.message, timestamp: new Date().toISOString() }
      }));
      toast.error(`${functionName} failed: ${error.message}`);
      throw error;
    } finally {
      setIsRunning(prev => ({ ...prev, [functionName]: false }));
    }
  };

  const runAll = async () => {
    setIsRunningAll(true);
    try {
      // Run functions sequentially
      await runFunction('realtyna-auth-cc');
      await runFunction('sync_realtyna', { reset: true });
      await runFunction('sync_openhouses');
      await runFunction('sync_members');
      await runFunction('sync_offices');
      await runFunction('sync_postalcodes');
      
      toast.success('All sync functions completed!');
    } catch (error) {
      toast.error('Run All stopped due to error');
    } finally {
      setIsRunningAll(false);
    }
  };

  const functions = [
    { name: 'realtyna-auth-cc', label: 'Auth CC' },
    { name: 'sync_realtyna', label: 'Sync Listings' },
    { name: 'sync_openhouses', label: 'Sync Open Houses' },
    { name: 'sync_members', label: 'Sync Members' },
    { name: 'sync_offices', label: 'Sync Offices' },
    { name: 'sync_postalcodes', label: 'Sync Postal Codes' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Backend Status
        </CardTitle>
        <CardDescription>
          Manage and monitor all backend sync functions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Action Buttons */}
        <div className="space-y-3">
          <Button 
            onClick={runAll}
            disabled={isRunningAll}
            className="w-full"
            size="lg"
          >
            {isRunningAll ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Running All...
              </>
            ) : (
              'Run All'
            )}
          </Button>
          
          <div className="grid grid-cols-2 gap-2">
            {functions.map((func) => (
              <Button
                key={func.name}
                onClick={() => runFunction(func.name, func.name === 'sync_realtyna' ? { reset: true } : undefined)}
                disabled={isRunning[func.name] || isRunningAll}
                variant="outline"
                size="sm"
              >
                {isRunning[func.name] ? (
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                ) : null}
                {func.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Database Counts */}
        <div className="space-y-2">
          <h4 className="font-semibold text-sm">Database Counts</h4>
          <div className="grid grid-cols-3 gap-2 text-xs">
            {counts && Object.entries(counts).map(([table, count]) => (
              <div key={table} className="text-center p-2 border rounded">
                <div className="font-bold">{count}</div>
                <div className="text-muted-foreground">{table.replace('mls_', '')}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Latest Listings */}
        <div className="space-y-2">
          <h4 className="font-semibold text-sm">Latest Listings (10)</h4>
          <div className="max-h-48 overflow-y-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-1">Key</th>
                  <th className="text-left p-1">Price</th>
                  <th className="text-left p-1">City</th>
                  <th className="text-left p-1">Status</th>
                  <th className="text-left p-1">Bed/Bath</th>
                </tr>
              </thead>
              <tbody>
                {latestListings?.map((listing, i) => (
                  <tr key={i} className="border-b text-xs">
                    <td className="p-1 font-mono">{listing.listing_key?.slice(-8)}</td>
                    <td className="p-1">${listing.list_price?.toLocaleString()}</td>
                    <td className="p-1">{listing.city}</td>
                    <td className="p-1">{listing.standard_status}</td>
                    <td className="p-1">{listing.bedrooms_total}/{listing.bathrooms_total_integer}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Function Results */}
        {Object.keys(functionResults).length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Last Results</h4>
            <div className="max-h-48 overflow-y-auto space-y-1">
              {Object.entries(functionResults).map(([func, result]) => (
                <details key={func} className="text-xs">
                  <summary className="cursor-pointer p-2 border rounded">
                    <span className={result.success ? 'text-green-600' : 'text-red-600'}>
                      {func} - {result.success ? 'Success' : 'Error'}
                    </span>
                    <span className="text-muted-foreground ml-2">
                      {new Date(result.timestamp).toLocaleTimeString()}
                    </span>
                  </summary>
                  <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-x-auto">
                    {JSON.stringify(result.data || result.error, null, 2)}
                  </pre>
                </details>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const Admin = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const queryClient = useQueryClient();

  // Check Client Credentials token status
  const { data: tokenStatus, isLoading: tokenLoading } = useQuery({
    queryKey: ['realtyna-tokens'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('realtyna_tokens')
        .select('*')
        .eq('principal_type', 'app')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
  });

  // Check for sync errors
  const { data: ingestState } = useQuery({
    queryKey: ['ingest-state'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ingest_state')
        .select('*')
        .eq('key', 'property_sync')
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
  });

  // Check listings count
  const { data: listingsCount } = useQuery({
    queryKey: ['listings-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('mls_listings')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      return count || 0;
    },
  });

  // Initiate Client Credentials connection
  const connectRealtyna = async () => {
    setIsConnecting(true);
    try {
      const response = await supabase.functions.invoke('realtyna-auth-cc');
      
      if (response.error) {
        throw new Error(response.error.message);
      }
      
      if (!response.data?.success) {
        throw new Error(response.data?.error || 'Authentication failed');
      }
      
      // Invalidate queries to refresh the connection status
      queryClient.invalidateQueries({ queryKey: ['realtyna-tokens'] });
      queryClient.invalidateQueries({ queryKey: ['ingest-state'] });
      toast.success('Successfully connected to Realtyna using Client Credentials');
    } catch (error) {
      console.error('Connection error:', error);
      toast.error('Failed to connect to Realtyna: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsConnecting(false);
    }
  };

  // Test API connection
  const testMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('test-realtyna-api');
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast.success('API test successful! Connection verified');
      console.log('Test result:', data);
    },
    onError: (error) => {
      console.error('Test error:', error);
      toast.error('API test failed');
    },
  });

  // Trigger sync
  const syncMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('sync_realtyna');
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast.success(`Sync completed! Processed ${data.processed || 0} listings`);
      queryClient.invalidateQueries({ queryKey: ['listings-count'] });
      queryClient.invalidateQueries({ queryKey: ['ingest-state'] });
    },
    onError: (error) => {
      console.error('Sync error:', error);
      toast.error('Sync failed');
    },
  });

  const tokenIsValid = tokenStatus && new Date(tokenStatus.expires_at) > new Date();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">RealTracs Admin</h1>
          <p className="text-muted-foreground">Manage Realtyna connection and data sync</p>
        </div>

        {/* Error Banner */}
        {(ingestState?.value as any)?.last_error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Sync Error:</strong> {(ingestState.value as any).last_error}
              <br />
              <span className="text-sm">Last attempt: {(ingestState.value as any).last_run_at ? new Date((ingestState.value as any).last_run_at).toLocaleString() : 'Unknown'}</span>
            </AlertDescription>
          </Alert>
        )}

        {/* Connection Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Realtyna Connection Status
            </CardTitle>
            <CardDescription>
              Manage your Realtyna Smart Plan connection to RealTracs MLS
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {tokenLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Checking connection status...</span>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Connection Status:</span>
                  {tokenIsValid ? (
                    <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Connected
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Not Connected
                    </Badge>
                  )}
                </div>
                
                {tokenStatus && (
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Token expires: {new Date(tokenStatus.expires_at).toLocaleString()}</p>
                    <p>Minutes remaining: {Math.max(0, Math.round((new Date(tokenStatus.expires_at).getTime() - Date.now()) / 60000))}</p>
                    <p>Flow: Client Credentials ({tokenStatus.scope})</p>
                  </div>
                )}

                <div className="space-y-3">
                  <Button 
                    onClick={() => testMutation.mutate()} 
                    disabled={testMutation.isPending || !tokenIsValid}
                    variant="secondary"
                    className="w-full"
                  >
                    {testMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Testing API...
                      </>
                    ) : (
                      "Test API Connection"
                    )}
                  </Button>
                  
                   <Button 
                    onClick={connectRealtyna} 
                    disabled={isConnecting}
                    variant={tokenIsValid ? "outline" : "default"}
                    className="w-full"
                  >
                     {isConnecting ? (
                       <>
                         <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                         Connecting...
                       </>
                     ) : tokenIsValid ? (
                       "Reconnect to Realtyna"
                     ) : (
                       "Connect to Realtyna"
                     )}
                   </Button>
                   
                   <Button 
                     onClick={() => window.open('/realtyna-test', '_blank')}
                     variant="ghost"
                     size="sm"
                     className="w-full"
                   >
                     Open Diagnostic Test Page
                   </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Data Sync Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Data Sync Status
            </CardTitle>
            <CardDescription>
              Sync listings from RealTracs using RESO OData API covering Middle Tennessee metro area
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold">{listingsCount || 0}</div>
                <div className="text-sm text-muted-foreground">Total Listings</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold">TN</div>
                <div className="text-sm text-muted-foreground">Coverage Area</div>
              </div>
            </div>

            {!tokenIsValid && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Connect to Realtyna first to enable data sync
                </AlertDescription>
              </Alert>
            )}

            <Button 
              onClick={() => syncMutation.mutate()}
              disabled={syncMutation.isPending || !tokenIsValid}
              className="w-full"
              variant="outline"
            >
              {syncMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Sync RealTracs Data
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Backend Status */}
        <BackendStatus />

        {/* Coverage Information */}
        <Card>
          <CardHeader>
            <CardTitle>Geographic Coverage</CardTitle>
            <CardDescription>Middle Tennessee counties included in sync</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
              {[
                'Davidson County (Nashville)',
                'Williamson County (Franklin, Brentwood)',
                'Rutherford County (Murfreesboro)',
                'Sumner County (Hendersonville, Gallatin)',
                'Wilson County (Lebanon)',
                'Cheatham County',
                'Robertson County (Springfield)',
                'Maury County (Columbia)',
              ].map((county) => (
                <Badge key={county} variant="outline" className="justify-center py-1">
                  {county}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;