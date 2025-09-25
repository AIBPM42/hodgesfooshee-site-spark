import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function RealtynaSelftest() {
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runSelftest = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('realtyna-selftest');
      
      if (error) {
        setTestResult({ error: error.message, details: error });
      } else {
        setTestResult(data);
      }
    } catch (err) {
      setTestResult({ error: 'Network error', details: err });
    } finally {
      setLoading(false);
    }
  };

  const runAuthCC = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('realtyna-auth-cc');
      
      if (error) {
        setTestResult({ error: error.message, details: error });
      } else {
        setTestResult(data);
      }
    } catch (err) {
      setTestResult({ error: 'Network error', details: err });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Realtyna Function Test</h1>
      
      <div className="flex gap-4">
        <Button onClick={runSelftest} disabled={loading}>
          {loading ? 'Running...' : 'Run Selftest'}
        </Button>
        <Button onClick={runAuthCC} disabled={loading} variant="outline">
          {loading ? 'Running...' : 'Test Auth CC'}
        </Button>
      </div>

      {testResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Test Result
              {testResult.success && <Badge variant="default">Success</Badge>}
              {testResult.error && <Badge variant="destructive">Error</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-lg overflow-auto text-sm">
              {JSON.stringify(testResult, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}