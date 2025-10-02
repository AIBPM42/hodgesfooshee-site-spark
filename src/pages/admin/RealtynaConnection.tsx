import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

interface HealthResult {
  ok: boolean;
  status?: number;
  countProbe?: number;
  error?: string;
}

export default function RealtynaConnection() {
  const { toast } = useToast();
  const [testing, setTesting] = useState(false);
  const [pinging, setPinging] = useState(false);
  const [authResult, setAuthResult] = useState<{ ok: boolean; status: number; token_excerpt?: string; error?: string } | null>(null);
  const [healthResult, setHealthResult] = useState<Record<string, HealthResult> | null>(null);

  const handleTestAuth = async () => {
    setTesting(true);
    setAuthResult(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('realtyna_auth_test');
      
      if (error) throw error;
      
      setAuthResult(data);
      
      if (data.ok) {
        toast({
          title: "Authentication Successful",
          description: `Token received: ${data.token_excerpt}`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Authentication Failed",
          description: data.error || `Status: ${data.status}`,
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Test Failed",
        description: error.message,
      });
      setAuthResult({ ok: false, status: 500, error: error.message });
    } finally {
      setTesting(false);
    }
  };

  const handlePingData = async () => {
    setPinging(true);
    setHealthResult(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('mls-health');
      
      if (error) throw error;
      
      setHealthResult(data.services);
      
      const allHealthy = Object.values(data.services).every((s: any) => s.ok);
      
      if (allHealthy) {
        toast({
          title: "All Services Healthy",
          description: "All MLS endpoints are responding correctly.",
        });
      } else {
        const failedServices = Object.entries(data.services)
          .filter(([_, s]: [string, any]) => !s.ok)
          .map(([name]) => name)
          .join(", ");
        
        toast({
          variant: "destructive",
          title: "Some Services Failed",
          description: `Failed: ${failedServices}`,
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Health Check Failed",
        description: error.message,
      });
    } finally {
      setPinging(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Realtyna Connection</h1>
        <p className="text-muted-foreground mt-2">
          Test your Realtyna MLS API connection and verify credentials
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
          <CardDescription>
            These settings are stored as Supabase secrets. Contact your administrator to update them.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>MLS_CLIENT_ID</Label>
            <Input value="••••••••••••••••" disabled />
          </div>
          <div className="space-y-2">
            <Label>MLS_CLIENT_SECRET</Label>
            <Input value="••••••••••••••••" disabled />
          </div>
          <div className="space-y-2">
            <Label>REALTYNA_API_KEY</Label>
            <Input value="••••••••••••••••" disabled />
          </div>
          <div className="space-y-2">
            <Label>REALTYNA_BASE_URL</Label>
            <Input value="https://api.realtyfeed.com" disabled />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Connection Tests</CardTitle>
          <CardDescription>
            Verify that your credentials work and MLS endpoints are accessible
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Test Authentication</h3>
                <p className="text-sm text-muted-foreground">
                  Verify credentials and get access token
                </p>
              </div>
              <Button onClick={handleTestAuth} disabled={testing}>
                {testing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Testing...
                  </>
                ) : (
                  'Test Auth'
                )}
              </Button>
            </div>

            {authResult && (
              <div className={`p-4 rounded-lg border ${authResult.ok ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-center gap-2">
                  {authResult.ok ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                  <div>
                    <p className="font-semibold">Status: {authResult.status}</p>
                    {authResult.ok && authResult.token_excerpt && (
                      <p className="text-sm">Token: {authResult.token_excerpt}</p>
                    )}
                    {!authResult.ok && authResult.error && (
                      <p className="text-sm text-red-700">{authResult.error}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Ping MLS Data</h3>
                <p className="text-sm text-muted-foreground">
                  Test connectivity to all MLS endpoints
                </p>
              </div>
              <Button onClick={handlePingData} disabled={pinging}>
                {pinging ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Pinging...
                  </>
                ) : (
                  'Ping Data'
                )}
              </Button>
            </div>

            {healthResult && (
              <div className="space-y-2">
                {Object.entries(healthResult).map(([service, result]) => (
                  <div
                    key={service}
                    className={`p-3 rounded-lg border flex items-center justify-between ${
                      result.ok ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {result.ok ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                      <span className="font-medium capitalize">{service}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {result.ok ? (
                        <>Status: {result.status} | Count: {result.countProbe || 0}</>
                      ) : (
                        <>Status: {result.status || 'Error'} {result.error && `| ${result.error.substring(0, 100)}`}</>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
