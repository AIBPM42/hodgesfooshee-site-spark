import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Home, Calendar, TrendingDown, RefreshCcw, Clock, Activity } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import RecentActivityWidget from "@/components/admin/RecentActivityWidget";
import SyncHealthWidget from "@/components/admin/SyncHealthWidget";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminDashboard() {
  const { userRole } = useAuth();

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

      // Get last sync time from sync_log
      const { data: syncLog } = await supabase
        .from('sync_log')
        .select('completed_at, success')
        .eq('success', true)
        .order('completed_at', { ascending: false })
        .limit(1)
        .single();

      return {
        activeListings: activeCount || 0,
        newListings: newCount || 0,
        openHouses: openHousesCount || 0,
        priceCuts: 0,
        backOnMarket: 0,
        lastSync: syncLog?.completed_at || null
      };
    }
  });

  const getTimeDiff = (timestamp: string | null) => {
    if (!timestamp) return { text: 'Never', color: 'text-red-500' };
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return { text: `${diffMins} min ago`, color: 'text-green-500' };
    if (diffHours < 24) return { text: `${diffHours}h ago`, color: diffHours < 2 ? 'text-green-500' : 'text-yellow-500' };
    if (diffDays < 7) return { text: `${diffDays}d ago`, color: 'text-yellow-500' };
    return { text: `${diffDays}d ago`, color: 'text-red-500' };
  };

  const timeDiff = getTimeDiff(stats?.lastSync || null);

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
    ...(userRole === 'admin' ? [{
      title: "Last Sync",
      value: timeDiff.text,
      icon: Clock,
      color: timeDiff.color,
      link: "/admin/mls-sync"
    }] : [])
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
      <RecentActivityWidget />

      {/* Sync Health */}
      <SyncHealthWidget />
    </div>
  );
}
