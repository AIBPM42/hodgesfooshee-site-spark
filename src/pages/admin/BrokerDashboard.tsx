import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { TrendingUp, Home, Calendar, DollarSign, Clock } from "lucide-react";

interface DashboardStats {
  activeListings: number;
  newThisWeek: number;
  upcomingOpenHouses: number;
  avgPrice: number;
  avgDaysOnMarket: number;
}

interface CityStats {
  city: string;
  count: number;
}

export default function BrokerDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    activeListings: 0,
    newThisWeek: 0,
    upcomingOpenHouses: 0,
    avgPrice: 0,
    avgDaysOnMarket: 0,
  });
  const [topCities, setTopCities] = useState<CityStats[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      // Active listings
      const { count: activeCount } = await supabase
        .from('mls_listings')
        .select('*', { count: 'exact', head: true })
        .eq('standard_status', 'Active');

      // New this week
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const { count: newCount } = await supabase
        .from('mls_listings')
        .select('*', { count: 'exact', head: true })
        .eq('standard_status', 'Active')
        .gte('modification_timestamp', oneWeekAgo.toISOString());

      // Upcoming open houses
      const today = new Date().toISOString().split('T')[0];
      const { count: openHouseCount } = await supabase
        .from('mls_open_houses')
        .select('*', { count: 'exact', head: true })
        .gte('open_house_date', today);

      // Average price
      const { data: priceData } = await supabase
        .from('mls_listings')
        .select('list_price')
        .eq('standard_status', 'Active')
        .gt('list_price', 0);

      const avgPrice = priceData && priceData.length > 0
        ? priceData.reduce((sum, item) => sum + (Number(item.list_price) || 0), 0) / priceData.length
        : 0;

      // Average days on market
      const { data: domData } = await supabase
        .from('mls_listings')
        .select('days_on_market')
        .eq('standard_status', 'Active')
        .gt('days_on_market', 0);

      const avgDom = domData && domData.length > 0
        ? domData.reduce((sum, item) => sum + (Number(item.days_on_market) || 0), 0) / domData.length
        : 0;

      // Top cities by inventory
      const { data: cityData } = await supabase
        .from('mls_listings')
        .select('city')
        .eq('standard_status', 'Active')
        .not('city', 'is', null);

      const cityCounts: Record<string, number> = {};
      cityData?.forEach(item => {
        if (item.city) {
          cityCounts[item.city] = (cityCounts[item.city] || 0) + 1;
        }
      });

      const topCitiesArray = Object.entries(cityCounts)
        .map(([city, count]) => ({ city, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      setStats({
        activeListings: activeCount || 0,
        newThisWeek: newCount || 0,
        upcomingOpenHouses: openHouseCount || 0,
        avgPrice: Math.round(avgPrice),
        avgDaysOnMarket: Math.round(avgDom),
      });

      setTopCities(topCitiesArray);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="p-8">Loading dashboard...</div>;
  }

  return (
    <div className="container mx-auto p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Broker Dashboard</h1>
        <p className="text-muted-foreground">Real-time MLS market analytics and insights</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="card-glass p-6">
          <div className="flex items-center gap-3 mb-2">
            <Home className="h-5 w-5 text-luxury-gold" />
            <span className="text-sm font-medium">Active Listings</span>
          </div>
          <div className="text-3xl font-bold">{stats.activeListings.toLocaleString()}</div>
        </Card>

        <Card className="card-glass p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="h-5 w-5 text-luxury-gold" />
            <span className="text-sm font-medium">New This Week</span>
          </div>
          <div className="text-3xl font-bold">{stats.newThisWeek.toLocaleString()}</div>
        </Card>

        <Card className="card-glass p-6">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="h-5 w-5 text-luxury-gold" />
            <span className="text-sm font-medium">Open Houses</span>
          </div>
          <div className="text-3xl font-bold">{stats.upcomingOpenHouses.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-1">Next 7 days</p>
        </Card>

        <Card className="card-glass p-6">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="h-5 w-5 text-luxury-gold" />
            <span className="text-sm font-medium">Avg List Price</span>
          </div>
          <div className="text-3xl font-bold">${(stats.avgPrice / 1000).toFixed(0)}K</div>
        </Card>

        <Card className="card-glass p-6">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="h-5 w-5 text-luxury-gold" />
            <span className="text-sm font-medium">Avg Days on Market</span>
          </div>
          <div className="text-3xl font-bold">{stats.avgDaysOnMarket}</div>
        </Card>
      </div>

      {/* Top Cities */}
      <Card className="card-glass p-6">
        <h2 className="text-2xl font-bold mb-4">Top Cities by Active Inventory</h2>
        <div className="space-y-3">
          {topCities.map((city, index) => (
            <div key={city.city} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-luxury-gold w-8">#{index + 1}</span>
                <span className="font-medium">{city.city}</span>
              </div>
              <span className="text-2xl font-bold">{city.count}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Market Insights */}
      <Card className="card-glass p-6">
        <h2 className="text-2xl font-bold mb-4">Market Insights</h2>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>• <strong className="text-foreground">Inventory Level:</strong> {stats.activeListings} active listings currently available</p>
          <p>• <strong className="text-foreground">Market Velocity:</strong> {stats.newThisWeek} new listings added in the past 7 days</p>
          <p>• <strong className="text-foreground">Buyer Activity:</strong> {stats.upcomingOpenHouses} open houses scheduled in the next week</p>
          <p>• <strong className="text-foreground">Price Point:</strong> Average listing price at ${stats.avgPrice.toLocaleString()}</p>
          <p>• <strong className="text-foreground">Time to Contract:</strong> Properties averaging {stats.avgDaysOnMarket} days on market</p>
        </div>
      </Card>
    </div>
  );
}
