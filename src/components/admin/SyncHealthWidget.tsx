import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

export default function SyncHealthWidget() {
  const { data: syncHealth } = useQuery({
    queryKey: ['sync-health'],
    queryFn: async () => {
      const resources = ['Property', 'Member', 'Office', 'OpenHouse'];
      const health = await Promise.all(
        resources.map(async (resource) => {
          const { data } = await supabase
            .from('mls_sync_state')
            .select('last_run')
            .eq('resource', resource)
            .single();

          const lastRun = data?.last_run ? new Date(data.last_run) : null;
          const now = new Date();
          let status = 'error';
          
          if (lastRun) {
            const diffDays = (now.getTime() - lastRun.getTime()) / (1000 * 60 * 60 * 24);
            if (diffDays < 1) status = 'synced';
            else if (diffDays < 7) status = 'stale';
          }

          return { resource, status };
        })
      );

      return health;
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'synced': return 'default';
      case 'stale': return 'secondary';
      case 'error': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <Card className="card-glass">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Sync Health
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {syncHealth?.map((item) => (
            <div key={item.resource}>
              <div className="text-xs text-muted-foreground">
                {item.resource === 'OpenHouse' ? 'Open Houses' : item.resource + 's'}
              </div>
              <Badge variant={getStatusColor(item.status) as any} className="mt-1">
                {item.status === 'synced' ? 'Synced' : item.status === 'stale' ? 'Stale' : 'Error'}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
