import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, RefreshCw, Database, Clock, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export default function AdminSync() {
  const [isRefreshingToken, setIsRefreshingToken] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [tokenStatus, setTokenStatus] = useState<{
    expires_at: string | null;
    isExpired: boolean;
  } | null>(null);
  const [syncStats, setSyncStats] = useState<{
    total_listings: number;
    active_listings: number;
    recent_listings: number;
  } | null>(null);
  const { toast } = useToast();

  const checkTokenStatus = async () => {
    try {
      console.log('🔍 Checking token status...');
      const { data, error } = await supabase
        .from('oauth_tokens')
        .select('expires_at')
        .eq('provider', 'realtyna')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error('❌ Token check error:', error);
        setTokenStatus({ expires_at: null, isExpired: true });
        return;
      }

      const expiresAt = new Date(data.expires_at);
      const now = new Date();
      const isExpired = expiresAt <= now;
      
      console.log('✅ Token status:', { expires_at: data.expires_at, isExpired });
      setTokenStatus({ expires_at: data.expires_at, isExpired });
    } catch (error) {
      console.error('💥 Token status check failed:', error);
      setTokenStatus({ expires_at: null, isExpired: true });
    }
  };

  const checkSyncStats = async () => {
    try {
      console.log('📊 Checking sync stats...');
      const { data, error } = await supabase.rpc('get_sync_counts');
      
      if (error) {
        console.error('❌ Stats check error:', error);
        return;
      }

      console.log('✅ Sync stats:', data);
      const stats = data as any; // Cast to any to handle Json type
      setSyncStats({
        total_listings: stats.listings || 0,
        active_listings: stats.active_listings || 0,
        recent_listings: stats.recent_listings || 0
      });
    } catch (error) {
      console.error('💥 Stats check failed:', error);
    }
  };

  const refreshToken = async () => {
    setIsRefreshingToken(true);
    try {
      console.log('🔑 Refreshing OAuth token...');
      const { data, error } = await supabase.functions.invoke('manage-oauth-tokens', {
        body: {}
      });

      if (error) {
        console.error('❌ Token refresh failed:', error);
        toast({
          title: "Token Refresh Failed",
          description: error.message || "Failed to refresh OAuth token",
          variant: "destructive",
        });
        return;
      }

      console.log('✅ Token refreshed:', {
        access_token: data?.access_token ? `${data.access_token.substring(0, 20)}...` : 'none',
        expires_at: data?.expires_at
      });

      toast({
        title: "Token Refreshed",
        description: "OAuth token has been successfully refreshed",
      });

      // Update token status
      await checkTokenStatus();
    } catch (error) {
      console.error('💥 Token refresh error:', error);
      toast({
        title: "Error",
        description: "Unexpected error during token refresh",
        variant: "destructive",
      });
    } finally {
      setIsRefreshingToken(false);
    }
  };

  const syncMLS = async () => {
    setIsSyncing(true);
    try {
      console.log('🔄 Starting MLS sync...');
      const { data, error } = await supabase.functions.invoke('sync_realtyna', {
        body: {}
      });

      if (error) {
        console.error('❌ MLS sync failed:', error);
        toast({
          title: "MLS Sync Failed",
          description: error.message || "Failed to sync MLS data",
          variant: "destructive",
        });
        return;
      }

      console.log('✅ MLS sync completed:', data);
      toast({
        title: "MLS Sync Complete",
        description: `Successfully synced MLS data`,
      });

      // Update sync stats
      await checkSyncStats();
    } catch (error) {
      console.error('💥 MLS sync error:', error);
      toast({
        title: "Error",
        description: "Unexpected error during MLS sync",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const runFullSync = async () => {
    console.log('🚀 Starting full sync process...');
    await refreshToken();
    // Wait a moment for token to be processed
    setTimeout(async () => {
      await syncMLS();
    }, 2000);
  };

  // Load initial data
  useState(() => {
    checkTokenStatus();
    checkSyncStats();
  });

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">MLS Data Sync Control</h1>
        <p className="text-muted-foreground">
          Manage OAuth tokens and sync live MLS data from Realtyna
        </p>
      </div>

      {/* Token Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            OAuth Token Status
          </CardTitle>
          <CardDescription>
            Current authentication token status for Realtyna API
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium">Token Status</p>
              <div className="flex items-center gap-2">
                {tokenStatus?.isExpired ? (
                  <>
                    <AlertCircle className="h-4 w-4 text-destructive" />
                    <Badge variant="destructive">Expired</Badge>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <Badge variant="default">Valid</Badge>
                  </>
                )}
              </div>
              {tokenStatus?.expires_at && (
                <p className="text-xs text-muted-foreground">
                  Expires: {new Date(tokenStatus.expires_at).toLocaleString()}
                </p>
              )}
            </div>
            <Button 
              onClick={refreshToken} 
              disabled={isRefreshingToken}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshingToken ? 'animate-spin' : ''}`} />
              {isRefreshingToken ? 'Refreshing...' : 'Refresh Token'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sync Stats Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            MLS Data Status
          </CardTitle>
          <CardDescription>
            Current MLS listings in the database
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold">{syncStats?.total_listings || 0}</div>
              <div className="text-sm text-muted-foreground">Total Listings</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-green-600">{syncStats?.active_listings || 0}</div>
              <div className="text-sm text-muted-foreground">Active Listings</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{syncStats?.recent_listings || 0}</div>
              <div className="text-sm text-muted-foreground">Recent (7 days)</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Sync Actions
          </CardTitle>
          <CardDescription>
            Trigger data synchronization from Realtyna MLS feed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              onClick={refreshToken} 
              disabled={isRefreshingToken}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshingToken ? 'animate-spin' : ''}`} />
              Refresh Token
            </Button>
            
            <Button 
              onClick={syncMLS} 
              disabled={isSyncing || tokenStatus?.isExpired}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Database className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
              Sync MLS Data
            </Button>
            
            <Button 
              onClick={runFullSync} 
              disabled={isRefreshingToken || isSyncing}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${(isRefreshingToken || isSyncing) ? 'animate-spin' : ''}`} />
              Full Sync (Token + Data)
            </Button>
          </div>
          
          <div className="flex gap-4 pt-4">
            <Button 
              onClick={checkTokenStatus} 
              variant="ghost" 
              size="sm"
            >
              Check Token Status
            </Button>
            <Button 
              onClick={checkSyncStats} 
              variant="ghost" 
              size="sm"
            >
              Refresh Stats
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p><strong>1. Check Token:</strong> Verify if your OAuth token is valid and not expired</p>
          <p><strong>2. Refresh Token:</strong> Get a new token from Realtyna if expired</p>
          <p><strong>3. Sync MLS Data:</strong> Pull live listings from the Realtyna MLS feed</p>
          <p><strong>4. Full Sync:</strong> Does both token refresh and data sync in sequence</p>
          <p className="pt-2 text-xs">
            After successful sync, check the <a href="/mls" className="text-primary underline">MLS Search page</a> to see live data.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}