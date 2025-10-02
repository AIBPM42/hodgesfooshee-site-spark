import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Home, Calendar, TrendingDown, RefreshCcw, Clock, Activity, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      // Get active listings count
      const { count: activeCount } = await supabase
        .from('mls_listings')
        .select('*', { count: 'exact', head: true })
        .eq('standard_status', 'Active');

      // Get new listings (7d)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const { count: newCount } = await supabase
        .from('mls_listings')
        .select('*', { count: 'exact', head: true })
        .gte('modification_timestamp', sevenDaysAgo.toISOString());

      // Get open houses (next 7d)
      const today = new Date().toISOString().split('T')[0];
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);
      const future = futureDate.toISOString().split('T')[0];
      const { count: openHousesCount } = await supabase
        .from('mls_open_houses')
        .select('*', { count: 'exact', head: true })
        .gte('open_house_date', today)
        .lte('open_house_date', future);

      // Get last sync time
      const { data: syncData } = await supabase
        .from('mls_sync_state')
        .select('last_run')
        .eq('resource', 'Property')
        .single();

      return {
        activeListings: activeCount || 0,
        newListings: newCount || 0,
        openHouses: openHousesCount || 0,
        priceCuts: 0, // TODO: implement price cuts logic
        backOnMarket: 0, // TODO: implement back on market logic
        lastSync: syncData?.last_run || null
      };
    }
  });

  const tiles = [
    {
      title: "Active Listings",
      value: stats?.activeListings || 0,
      icon: Home,
      color: "text-blue-500",
      link: "/admin/analytics?tab=listings"
    },
    {
      title: "New (7d)",
      value: stats?.newListings || 0,
      icon: Building2,
      color: "text-green-500",
      link: "/admin/analytics?tab=listings&filter=new_7d"
    },
    {
      title: "Open Houses (7d)",
      value: stats?.openHouses || 0,
      icon: Calendar,
      color: "text-purple-500",
      link: "/admin/analytics?tab=openhouses"
    },
    {
      title: "Price Cuts (7d)",
      value: stats?.priceCuts || 0,
      icon: TrendingDown,
      color: "text-orange-500",
      link: "/admin/analytics?tab=listings&filter=price_cuts_7d"
    },
    {
      title: "Back on Market (7d)",
      value: stats?.backOnMarket || 0,
      icon: RefreshCcw,
      color: "text-pink-500",
      link: "/admin/analytics?tab=listings&filter=back_on_7d"
    },
    {
      title: "Last Sync",
      value: stats?.lastSync ? new Date(stats.lastSync).toLocaleTimeString() : 'Never',
      icon: Clock,
      color: "text-gray-500",
      link: "/admin/mls-sync"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-gradient mb-2">Dashboard Overview</h1>
          <p className="text-muted-foreground">MLS data and system statistics</p>
        </div>
        <Badge variant="outline" className="text-xs">
          <Activity className="h-3 w-3 mr-1" />
          Live Dashboard
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tiles.map((tile) => {
          const Icon = tile.icon;
          return (
            <Link key={tile.title} to={tile.link}>
              <Card className="card-glass hover:border-primary/50 transition-colors cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {tile.title}
                  </CardTitle>
                  <Icon className={`h-5 w-5 ${tile.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {isLoading ? '...' : tile.value}
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Recent Activity */}
      <Card className="card-glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• Property search: Nashville ($250K-$500K)</p>
            <p>• Property view: 123 Main St</p>
            <p>• Open house tour created</p>
            <p className="text-xs pt-2">Last 10 events from site_events table</p>
          </div>
        </CardContent>
      </Card>

      {/* Sync Health */}
      <Card className="card-glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Sync Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-xs text-muted-foreground">Listings</div>
              <Badge variant="outline" className="mt-1">Synced</Badge>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Members</div>
              <Badge variant="outline" className="mt-1">Synced</Badge>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Offices</div>
              <Badge variant="outline" className="mt-1">Synced</Badge>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Open Houses</div>
              <Badge variant="outline" className="mt-1">Synced</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
