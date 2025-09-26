import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, AlertCircle, Database, RefreshCw, Activity } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const ACCENT = {
  orange: "#FF5C24",
  green: "#6FB644", 
  purple: "#6F58B0",
  yellow: "#F2C94C",
};

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
    <div className="rounded-2xl p-4 bg-white/8 backdrop-blur-2xl border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.25)]">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-neutral-100 flex items-center gap-2 mb-2">
          <Activity className="h-5 w-5" />
          Backend Status
        </h3>
        <p className="text-neutral-300">
          Manage and monitor all backend sync functions
        </p>
      </div>
      <div className="space-y-6">
        {/* Action Buttons */}
        <div className="space-y-3">
          <button 
            onClick={runAll}
            disabled={isRunningAll}
            className="w-full px-4 py-3 rounded-lg text-neutral-100 font-medium transition-all"
            style={{
              borderColor: `${ACCENT.orange}66`,
              background: isRunningAll ? "transparent" : `${ACCENT.orange}22`,
              boxShadow: isRunningAll ? "none" : `0 10px 30px ${ACCENT.orange}33`,
              border: "1px solid"
            }}
          >
            {isRunningAll ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin inline" />
                Running All...
              </>
            ) : (
              'Run All'
            )}
          </button>
          
          <div className="grid grid-cols-2 gap-2">
            {functions.map((func, idx) => {
              const colors = [ACCENT.green, ACCENT.purple, ACCENT.yellow, ACCENT.orange, ACCENT.green, ACCENT.purple];
              const color = colors[idx % colors.length];
              const subtle = isRunning[func.name] || isRunningAll;
              
              return (
                <button
                  key={func.name}
                  onClick={() => runFunction(func.name, func.name === 'sync_realtyna' ? { reset: true } : undefined)}
                  disabled={isRunning[func.name] || isRunningAll}
                  className="px-3 py-2 rounded-lg text-neutral-100 text-sm font-medium transition-all"
                  style={{
                    borderColor: `${color}66`,
                    background: subtle ? "transparent" : `${color}22`,
                    boxShadow: subtle ? "none" : `0 10px 30px ${color}33`,
                    border: "1px solid"
                  }}
                >
                  {isRunning[func.name] ? (
                    <Loader2 className="h-3 w-3 mr-1 animate-spin inline" />
                  ) : null}
                  {func.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Database Counts */}
        <div className="space-y-2">
          <h4 className="font-semibold text-sm text-neutral-100">Database Counts</h4>
          <div className="grid grid-cols-3 gap-2 text-xs">
            {counts && Object.entries(counts).map(([table, count]) => (
              <div key={table} className="text-center p-2 border border-white/10 rounded bg-white/5">
                <div className="font-bold text-neutral-100">{count}</div>
                <div className="text-neutral-300">{table.replace('mls_', '')}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Latest Listings */}
        <div className="space-y-2">
          <h4 className="font-semibold text-sm text-neutral-100">Latest Listings (10)</h4>
          <div className="max-h-48 overflow-y-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-1 text-neutral-100">Key</th>
                  <th className="text-left p-1 text-neutral-100">Price</th>
                  <th className="text-left p-1 text-neutral-100">City</th>
                  <th className="text-left p-1 text-neutral-100">Status</th>
                  <th className="text-left p-1 text-neutral-100">Bed/Bath</th>
                </tr>
              </thead>
              <tbody>
                {latestListings?.map((listing, i) => (
                  <tr key={i} className="border-t border-white/10 text-xs">
                    <td className="p-1 font-mono text-neutral-300">{listing.listing_key?.slice(-8)}</td>
                    <td className="p-1 text-neutral-100">${listing.list_price?.toLocaleString()}</td>
                    <td className="p-1 text-neutral-300">{listing.city}</td>
                    <td className="p-1 text-neutral-300">{listing.standard_status}</td>
                    <td className="p-1 text-neutral-300">{listing.bedrooms_total}/{listing.bathrooms_total_integer}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Function Results */}
        {Object.keys(functionResults).length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-neutral-100">Last Results</h4>
            <div className="max-h-48 overflow-y-auto space-y-1">
              {Object.entries(functionResults).map(([func, result]) => (
                <details key={func} className="text-xs">
                  <summary className="cursor-pointer p-2 border border-white/10 rounded bg-white/5 text-neutral-100">
                    <span className={result.success ? 'text-green-400' : 'text-red-400'}>
                      {func} - {result.success ? 'Success' : 'Error'}
                    </span>
                    <span className="text-neutral-300 ml-2">
                      {new Date(result.timestamp).toLocaleTimeString()}
                    </span>
                  </summary>
                  <pre className="mt-2 p-2 bg-black/20 rounded text-xs overflow-x-auto text-neutral-200">
                    {JSON.stringify(result.data || result.error, null, 2)}
                  </pre>
                </details>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
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
    <div
      className="min-h-screen text-neutral-100"
      style={{
        background:
          "radial-gradient(1200px 600px at 15% -10%, #243041 0%, #1C2431 45%, #151C26 100%)",
      }}
    >
      <header className="sticky top-0 z-20 backdrop-blur-xl bg-white/5 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-neutral-100">RealTracs Admin</h1>
            <p className="text-neutral-300">Manage Realtyna connection and data sync</p>
          </div>
        </div>
      </header>
      
      <div className="max-w-4xl mx-auto p-6 space-y-6">

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
        <div className="rounded-2xl p-4 bg-white/8 backdrop-blur-2xl border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.25)]">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-neutral-100 flex items-center gap-2 mb-2">
              <Database className="h-5 w-5" />
              Realtyna Connection Status
            </h3>
            <p className="text-neutral-300">
              Manage your Realtyna Smart Plan connection to RealTracs MLS
            </p>
          </div>
          <div className="space-y-4">
            {tokenLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-neutral-300">Checking connection status...</span>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-neutral-100">Connection Status:</span>
                  {tokenIsValid ? (
                    <div className="px-3 py-1 rounded-full text-sm font-medium bg-green-400/20 text-green-400 border border-green-400/30">
                      <CheckCircle2 className="h-3 w-3 mr-1 inline" />
                      Connected
                    </div>
                  ) : (
                    <div className="px-3 py-1 rounded-full text-sm font-medium bg-red-400/20 text-red-400 border border-red-400/30">
                      <AlertCircle className="h-3 w-3 mr-1 inline" />
                      Not Connected
                    </div>
                  )}
                </div>
                
                {tokenStatus && (
                  <div className="text-sm text-neutral-300 space-y-1">
                    <p>Token expires: {new Date(tokenStatus.expires_at).toLocaleString()}</p>
                    <p>Minutes remaining: {Math.max(0, Math.round((new Date(tokenStatus.expires_at).getTime() - Date.now()) / 60000))}</p>
                    <p>Flow: Client Credentials ({tokenStatus.scope})</p>
                  </div>
                )}

                <div className="space-y-3">
                  <button 
                    onClick={() => testMutation.mutate()} 
                    disabled={testMutation.isPending || !tokenIsValid}
                    className="w-full px-4 py-2 rounded-lg text-neutral-100 font-medium transition-all"
                    style={{
                      borderColor: `${ACCENT.purple}66`,
                      background: testMutation.isPending ? "transparent" : `${ACCENT.purple}22`,
                      boxShadow: testMutation.isPending ? "none" : `0 10px 30px ${ACCENT.purple}33`,
                      border: "1px solid"
                    }}
                  >
                    {testMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin inline" />
                        Testing API...
                      </>
                    ) : (
                      "Test API Connection"
                    )}
                  </button>
                  
                   <button 
                    onClick={connectRealtyna} 
                    disabled={isConnecting}
                    className="w-full px-4 py-2 rounded-lg text-neutral-100 font-medium transition-all"
                    style={{
                      borderColor: `${ACCENT.green}66`,
                      background: isConnecting ? "transparent" : `${ACCENT.green}22`,
                      boxShadow: isConnecting ? "none" : `0 10px 30px ${ACCENT.green}33`,
                      border: "1px solid"
                    }}
                  >
                     {isConnecting ? (
                       <>
                         <Loader2 className="h-4 w-4 mr-2 animate-spin inline" />
                         Connecting...
                       </>
                     ) : tokenIsValid ? (
                       "Reconnect to Realtyna"
                     ) : (
                       "Connect to Realtyna"
                     )}
                   </button>
                   
                   <button 
                     onClick={() => window.open('/realtyna-test', '_blank')}
                     className="w-full px-4 py-2 rounded-lg text-neutral-300 font-medium transition-all bg-white/5 hover:bg-white/10 border border-white/10"
                   >
                     Open Diagnostic Test Page
                   </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Data Sync Status */}
        <div className="rounded-2xl p-4 bg-white/8 backdrop-blur-2xl border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.25)]">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-neutral-100 flex items-center gap-2 mb-2">
              <RefreshCw className="h-5 w-5" />
              Data Sync Status
            </h3>
            <p className="text-neutral-300">
              Sync listings from RealTracs using RESO OData API covering Middle Tennessee metro area
            </p>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 border border-white/10 rounded-lg bg-white/5">
                <div className="text-2xl font-bold text-neutral-100">{listingsCount || 0}</div>
                <div className="text-sm text-neutral-300">Total Listings</div>
              </div>
              <div className="text-center p-4 border border-white/10 rounded-lg bg-white/5">
                <div className="text-2xl font-bold text-neutral-100">TN</div>
                <div className="text-sm text-neutral-300">Coverage Area</div>
              </div>
            </div>

            {!tokenIsValid && (
              <div className="p-3 rounded-lg bg-yellow-400/10 border border-yellow-400/20 text-yellow-400">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  <span>Connect to Realtyna first to enable data sync</span>
                </div>
              </div>
            )}

            <button 
              onClick={() => syncMutation.mutate()}
              disabled={syncMutation.isPending || !tokenIsValid}
              className="w-full px-4 py-3 rounded-lg text-neutral-100 font-medium transition-all"
              style={{
                borderColor: `${ACCENT.orange}66`,
                background: syncMutation.isPending ? "transparent" : `${ACCENT.orange}22`,
                boxShadow: syncMutation.isPending ? "none" : `0 10px 30px ${ACCENT.orange}33`,
                border: "1px solid"
              }}
            >
              {syncMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin inline" />
                  Syncing...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 inline" />
                  Sync RealTracs Data
                </>
              )}
            </button>
          </div>
        </div>

        {/* Backend Status */}
        <BackendStatus />

        {/* Coverage Information */}
        <div className="rounded-2xl p-4 bg-white/8 backdrop-blur-2xl border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.25)]">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-neutral-100 mb-2">Geographic Coverage</h3>
            <p className="text-neutral-300">Middle Tennessee counties included in sync</p>
          </div>
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
              <div key={county} className="px-3 py-1 text-center rounded-lg bg-white/10 border border-white/20 text-neutral-200">
                {county}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;