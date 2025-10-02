import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Building2, Home, Calendar, TrendingDown, RefreshCcw, Activity, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import {
  loadHealth,
  getDataMode,
  loadKpis,
  loadNewVsSoldWeekly,
  loadDaysOnMarketTrend,
  loadInventoryByCity,
  loadPricePerSqftByCity,
  loadTopGainers,
  loadTopPriceCuts,
  loadAgentLeaderboard,
} from "@/admin/data/adapters";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AdminDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: health } = useQuery({
    queryKey: ['mls-health'],
    queryFn: loadHealth,
    refetchInterval: 60000, // Check every minute
  });

  const mode = health ? getDataMode(health) : 'demo';
  const isLive = mode === 'live';

  const { data: kpis } = useQuery({
    queryKey: ['admin-kpis', mode],
    queryFn: () => loadKpis(mode),
  });

  const { data: newVsSold } = useQuery({
    queryKey: ['new-vs-sold', mode],
    queryFn: () => loadNewVsSoldWeekly(mode),
  });

  const { data: domTrend } = useQuery({
    queryKey: ['dom-trend', mode],
    queryFn: () => loadDaysOnMarketTrend(mode),
  });

  const { data: inventory } = useQuery({
    queryKey: ['inventory-city', mode],
    queryFn: () => loadInventoryByCity(mode),
  });

  const { data: pricePerSqft } = useQuery({
    queryKey: ['price-sqft', mode],
    queryFn: () => loadPricePerSqftByCity(mode),
  });

  const { data: topGainers } = useQuery({
    queryKey: ['top-gainers', mode],
    queryFn: () => loadTopGainers(mode),
  });

  const { data: priceCuts } = useQuery({
    queryKey: ['price-cuts', mode],
    queryFn: () => loadTopPriceCuts(mode),
  });

  const { data: agentLeaders } = useQuery({
    queryKey: ['agent-leaders', mode],
    queryFn: () => loadAgentLeaderboard(mode),
  });

  const handleRunSync = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('realtyna_sync_incremental');
      if (error) throw error;
      
      toast({
        title: "Sync Complete",
        description: `Processed ${data.results ? Object.keys(data.results).length : 0} resources`,
      });
      
      // Refetch data
      queryClient.invalidateQueries();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Sync Failed",
        description: error.message,
      });
    }
  };

  const tiles = [
    {
      title: "Active Listings",
      value: kpis?.activeListings || 0,
      icon: Home,
      color: "text-blue-500",
    },
    {
      title: "New (7d)",
      value: kpis?.new7d || 0,
      icon: Building2,
      color: "text-green-500",
    },
    {
      title: "Open Houses (7d)",
      value: kpis?.openHouses7d || 0,
      icon: Calendar,
      color: "text-purple-500",
    },
    {
      title: "Price Cuts (7d)",
      value: kpis?.priceCuts7d || 0,
      icon: TrendingDown,
      color: "text-orange-500",
    },
    {
      title: "Back on Market (7d)",
      value: kpis?.backOnMarket7d || 0,
      icon: RefreshCcw,
      color: "text-pink-500",
    },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">Dashboard Overview</h1>
          <p className="text-muted-foreground">Real-time MLS data and market insights</p>
        </div>
        <Badge variant={mode === 'live' ? "default" : "secondary"} className="text-sm">
          {mode === 'live' ? "🟢 LIVE" : "🟡 Demo Mode"}
        </Badge>
      </div>

      {/* Demo Mode Banner */}
      {!isLive && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Running in Demo Mode (MLS offline). Data auto-switches to LIVE when services recover.
          </AlertDescription>
        </Alert>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {tiles.map((tile) => {
          const Icon = tile.icon;
          return (
            <Card key={tile.title} className="card-glass">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground">
                  {tile.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${tile.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{tile.value.toLocaleString()}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* New vs Sold Weekly */}
        <Card className="card-glass">
          <CardHeader>
            <CardTitle className="text-sm">New vs Sold (8 Weeks)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={newVsSold}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid #333' }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="new" stroke="#10b981" strokeWidth={2} name="New Listings" />
                <Line type="monotone" dataKey="sold" stroke="#3b82f6" strokeWidth={2} name="Sold" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Cities Inventory */}
        <Card className="card-glass">
          <CardHeader>
            <CardTitle className="text-sm">Active Inventory by City</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={inventory} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="city" type="category" tick={{ fontSize: 11 }} width={100} />
                <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid #333' }} />
                <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Days on Market Trend */}
        <Card className="card-glass">
          <CardHeader>
            <CardTitle className="text-sm">Days on Market (30d)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={domTrend}>
                <defs>
                  <linearGradient id="domGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(val) => new Date(val).getMonth() + 1 + '/' + new Date(val).getDate()} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid #333' }} />
                <Area type="monotone" dataKey="dom" stroke="#f59e0b" fillOpacity={1} fill="url(#domGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Price per Sqft by City */}
        <Card className="card-glass">
          <CardHeader>
            <CardTitle className="text-sm">Price per Sqft by City</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={pricePerSqft}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="city" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={80} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid #333' }} formatter={(value) => `$${value}`} />
                <Bar dataKey="value" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Insights Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Top Gainers */}
        <Card className="card-glass">
          <CardHeader>
            <CardTitle className="text-sm">Top Gainers WoW</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {topGainers?.slice(0, 5).map((city) => (
                <div key={city.city} className="flex justify-between text-sm">
                  <span>{city.city}</span>
                  <span className="text-green-500 font-semibold">+{city.wow}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Biggest Price Cuts */}
        <Card className="card-glass">
          <CardHeader>
            <CardTitle className="text-sm">Biggest Price Cuts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {priceCuts?.slice(0, 5).map((cut, i) => (
                <div key={i} className="text-sm">
                  <div className="flex justify-between">
                    <span className="truncate">{cut.address}</span>
                    <span className="text-orange-500 font-semibold">-${(cut.cut / 1000).toFixed(0)}k</span>
                  </div>
                  <div className="text-xs text-muted-foreground">{cut.city}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Agent Leaderboard */}
        <Card className="card-glass">
          <CardHeader>
            <CardTitle className="text-sm">Agent Leaderboard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {agentLeaders?.slice(0, 5).map((agent) => (
                <div key={agent.agent} className="text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">{agent.agent}</span>
                    <span className="text-muted-foreground">{agent.newListings} new</span>
                  </div>
                  <div className="text-xs text-muted-foreground">{agent.pendings} pendings</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sync Health Strip */}
      {health && (
        <Card className="card-glass">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              MLS Service Health
            </CardTitle>
            <Button onClick={handleRunSync} size="sm">Run Sync Now</Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(health.services).map(([key, service]: [string, any]) => (
                <div key={key} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${service.ok ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-sm capitalize">{key}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {service.ok ? `${service.t}ms | Count: ${service.countProbe || 0}` : `Status: ${service.status || 'Error'}`}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
