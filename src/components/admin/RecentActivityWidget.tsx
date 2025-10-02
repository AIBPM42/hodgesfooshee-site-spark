import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";

export default function RecentActivityWidget() {
  const { data: activities, isLoading } = useQuery({
    queryKey: ['recent-activity'],
    queryFn: async () => {
      // Get recent page events
      const { data: pageEvents } = await supabase
        .from('page_events')
        .select('*')
        .order('occurred_at', { ascending: false })
        .limit(5);

      // Get recent search events
      const { data: searchEvents } = await supabase
        .from('search_events')
        .select('*')
        .order('occurred_at', { ascending: false })
        .limit(5);

      // Get recent listing views
      const { data: listingViews } = await supabase
        .from('listing_views')
        .select('*')
        .order('occurred_at', { ascending: false })
        .limit(5);

      const combined = [
        ...(pageEvents || []).map(e => ({ ...e, type: 'page', time: e.occurred_at })),
        ...(searchEvents || []).map(e => ({ ...e, type: 'search', time: e.occurred_at })),
        ...(listingViews || []).map(e => ({ ...e, type: 'listing', time: e.occurred_at }))
      ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 10);

      return combined;
    }
  });

  return (
    <Card className="card-glass">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-sm text-muted-foreground">Loading...</div>
        ) : (
          <div className="space-y-2 text-sm">
            {activities && activities.length > 0 ? (
              activities.map((activity: any, index: number) => (
                <div key={index} className="flex justify-between items-start">
                  <p className="text-muted-foreground">
                    {activity.type === 'page' && `• Page view: ${activity.page}`}
                    {activity.type === 'search' && `• Search: ${JSON.stringify(activity.query)}`}
                    {activity.type === 'listing' && `• Listing view: ${activity.listing_key}`}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(activity.time), { addSuffix: true })}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No recent activity</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
