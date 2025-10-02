import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const CountyManagement = () => {
  const [refreshing, setRefreshing] = useState<string | null>(null);

  const counties = [
    'davidson-county',
    'williamson-county',
    'rutherford-county',
    'sumner-county',
    'wilson-county'
  ];

  const handleRefresh = async (slug: string) => {
    setRefreshing(slug);
    try {
      const { data, error } = await supabase.functions.invoke('refresh_ai_county_insights', {
        body: { slug }
      });

      if (error) throw error;

      if (data?.ok) {
        toast.success(`✓ Insights refreshed for ${slug}`);
      } else {
        toast.error(`Failed to refresh: ${data?.msg || 'Unknown error'}`);
      }
    } catch (error: any) {
      toast.error(`Failed to refresh: ${error.message}`);
    } finally {
      setRefreshing(null);
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">County Management</h1>
        <p className="text-muted-foreground">
          Manage AI insights for county pages. Insights are cached for 7 days.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>County AI Insights</CardTitle>
          <CardDescription>
            Manually refresh AI-generated insights for county pages
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {counties.map(slug => (
            <div key={slug} className="flex items-center justify-between p-4 border rounded">
              <div>
                <span className="font-medium capitalize">{slug.replace('-', ' ')}</span>
                <p className="text-sm text-muted-foreground">
                  Click refresh to generate new AI insights
                </p>
              </div>
              <Button 
                onClick={() => handleRefresh(slug)}
                disabled={refreshing === slug}
              >
                {refreshing === slug ? 'Refreshing...' : 'Refresh AI Insights'}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default CountyManagement;
