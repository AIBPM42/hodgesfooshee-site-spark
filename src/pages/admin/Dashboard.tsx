import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Home, Calendar, TrendingDown, RefreshCcw, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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
      color: "text-blue-500"
    },
    {
      title: "New (7d)",
      value: stats?.newListings || 0,
      icon: Building2,
      color: "text-green-500"
    },
    {
      title: "Open Houses (7d)",
      value: stats?.openHouses || 0,
      icon: Calendar,
      color: "text-purple-500"
    },
    {
      title: "Price Cuts (7d)",
      value: stats?.priceCuts || 0,
      icon: TrendingDown,
      color: "text-orange-500"
    },
    {
      title: "Back on Market (7d)",
      value: stats?.backOnMarket || 0,
      icon: RefreshCcw,
      color: "text-pink-500"
    },
    {
      title: "Last Sync",
      value: stats?.lastSync ? new Date(stats.lastSync).toLocaleTimeString() : 'Never',
      icon: Clock,
      color: "text-gray-500"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-gradient mb-2">Dashboard Overview</h1>
        <p className="text-muted-foreground">MLS data and system statistics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tiles.map((tile) => {
          const Icon = tile.icon;
          return (
            <Card key={tile.title} className="card-glass">
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
          );
        })}
      </div>
    </div>
  );
}
