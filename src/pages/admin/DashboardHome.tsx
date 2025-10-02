import { useEffect, useState } from "react";
import { Home, DollarSign, Calendar, TrendingUp, Users, Activity, Settings, FileText, Database, ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useDashboardKPIs } from "@/hooks/useDashboardKPIs";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getRole, type UserRole } from "@/lib/role";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { RoleSwitcher } from "@/components/RoleSwitcher";

export default function DashboardHome() {
  const { data: kpis, isLoading } = useDashboardKPIs();
  const [role, setRoleState] = useState<UserRole>(getRole());
  const navigate = useNavigate();

  useEffect(() => {
    const handleRoleChange = (e: any) => setRoleState(e.detail);
    window.addEventListener('roleChanged', handleRoleChange);
    return () => window.removeEventListener('roleChanged', handleRoleChange);
  }, []);

  // Mock data for charts (will be real once we have historical data)
  const newVsSoldData = [
    { week: 'W1', new: 45, sold: 32 },
    { week: 'W2', new: 52, sold: 38 },
    { week: 'W3', new: 48, sold: 35 },
    { week: 'W4', new: 61, sold: 42 },
  ];

  const topCitiesData = [
    { city: 'Nashville', count: 320 },
    { city: 'Franklin', count: 180 },
    { city: 'Brentwood', count: 145 },
    { city: 'Murfreesboro', count: 128 },
    { city: 'Clarksville', count: 95 },
    { city: 'Hendersonville', count: 82 },
    { city: 'Smyrna', count: 68 },
    { city: 'Spring Hill', count: 54 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header />
      <main className="pt-24 pb-12 animate-fade-in">
        <div className="mx-auto max-w-7xl px-4">
          {/* Premium Header with Role Switcher */}
          <div className="mb-8 flex items-center justify-between">
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">Live Dashboard</span>
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Dashboard Home
              </h1>
              <p className="text-muted-foreground mt-3 text-lg">
                Real-time insights and performance metrics
              </p>
            </div>

            {/* Role Switcher */}
            <div className="flex items-center gap-3 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <RoleSwitcher />
            </div>
          </div>

          {/* KPI Tiles */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <KPITile
              icon={<Home className="h-5 w-5" />}
              label="Active Listings"
              value={kpis?.activeListings}
              isLoading={isLoading}
              color="text-blue-500"
              delay="0.1s"
            />
            <KPITile
              icon={<DollarSign className="h-5 w-5" />}
              label="Avg Price (30d)"
              value={kpis?.avgPrice30d}
              isLoading={isLoading}
              format="currency"
              color="text-green-500"
              delay="0.2s"
            />
            <KPITile
              icon={<Calendar className="h-5 w-5" />}
              label="Open Houses (14d)"
              value={kpis?.openHouses14d}
              isLoading={isLoading}
              color="text-orange-500"
              delay="0.3s"
            />
            <KPITile
              icon={<TrendingUp className="h-5 w-5" />}
              label="New This Week"
              value={kpis?.newThisWeek}
              isLoading={isLoading}
              color="text-purple-500"
              delay="0.4s"
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="backdrop-blur-xl bg-card/50 border-border/50 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in" style={{ animationDelay: "0.5s" }}>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                New vs Sold (Weekly)
              </h3>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={newVsSoldData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="new" stroke="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="sold" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card className="backdrop-blur-xl bg-card/50 border-border/50 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in" style={{ animationDelay: "0.6s" }}>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Home className="h-5 w-5 text-primary" />
                Top Cities by Active Inventory
              </h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={topCitiesData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis type="number" />
                  <YAxis dataKey="city" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Panels Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Events Panel */}
            <Card className="backdrop-blur-xl bg-card/50 border-border/50 p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Recent Activity
              </h3>
              <div className="space-y-3">
                <div className="text-sm text-muted-foreground border-l-2 border-primary/30 pl-3 py-2">
                  <span className="font-medium">Search:</span> Nashville, $300k-$500k, 3+ beds
                  <br />
                  <span className="text-xs opacity-70">2 minutes ago</span>
                </div>
                <div className="text-sm text-muted-foreground border-l-2 border-green-500/30 pl-3 py-2">
                  <span className="font-medium">Listing View:</span> 1234 Main St, Franklin
                  <br />
                  <span className="text-xs opacity-70">5 minutes ago</span>
                </div>
                <div className="text-sm text-muted-foreground border-l-2 border-blue-500/30 pl-3 py-2">
                  <span className="font-medium">Page:</span> Open Houses
                  <br />
                  <span className="text-xs opacity-70">12 minutes ago</span>
                </div>
              </div>
            </Card>

            {/* Sync Health Panel */}
            <Card className="backdrop-blur-xl bg-card/50 border-border/50 p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                Sync Health
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">MLS Listings</span>
                  <Badge variant="outline" className="text-green-500 border-green-500/50">
                    Synced
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Open Houses</span>
                  <Badge variant="outline" className="text-green-500 border-green-500/50">
                    Synced
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Members</span>
                  <Badge variant="outline" className="text-green-500 border-green-500/50">
                    Synced
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground mt-4 pt-4 border-t border-border/50">
                  Last sync: 3 minutes ago
                </div>
              </div>
            </Card>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Card 
              className="backdrop-blur-xl bg-card/50 border-border/50 p-6 cursor-pointer hover:shadow-lg transition-all hover:scale-105 animate-fade-in"
              style={{ animationDelay: "0.7s" }}
              onClick={() => navigate('/admin/content')}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="h-6 w-6 text-primary" />
                  <div>
                    <h3 className="font-semibold">Content Control</h3>
                    <p className="text-sm text-muted-foreground">Manage homepage & content</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </Card>

            <Card 
              className="backdrop-blur-xl bg-card/50 border-border/50 p-6 cursor-pointer hover:shadow-lg transition-all hover:scale-105 animate-fade-in"
              style={{ animationDelay: "0.8s" }}
              onClick={() => navigate('/admin/mls-sync-dashboard')}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Database className="h-6 w-6 text-primary" />
                  <div>
                    <h3 className="font-semibold">MLS Sync</h3>
                    <p className="text-sm text-muted-foreground">Monitor data sync</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </Card>

            <Card 
              className="backdrop-blur-xl bg-card/50 border-border/50 p-6 cursor-pointer hover:shadow-lg transition-all hover:scale-105 animate-fade-in"
              style={{ animationDelay: "0.9s" }}
              onClick={() => navigate('/admin/analytics')}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Activity className="h-6 w-6 text-primary" />
                  <div>
                    <h3 className="font-semibold">Analytics</h3>
                    <p className="text-sm text-muted-foreground">Deep-dive metrics</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </Card>
          </div>

          {/* Owner-Only Panels */}
          {role === 'owner' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
              <Card className="backdrop-blur-xl bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 p-6">
                <h3 className="text-lg font-semibold mb-4">Site Usage (7d)</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Sessions</span>
                    <span className="font-semibold">1,247</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Searches</span>
                    <span className="font-semibold">3,891</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Listing Views</span>
                    <span className="font-semibold">5,234</span>
                  </div>
                </div>
              </Card>

              <Card className="backdrop-blur-xl bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20 p-6">
                <h3 className="text-lg font-semibold mb-4">Lead Flow</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Total Leads</span>
                    <span className="font-semibold">89</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>This Week</span>
                    <span className="font-semibold text-green-500">+12</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Conversion</span>
                    <span className="font-semibold">4.2%</span>
                  </div>
                </div>
              </Card>

              <Card className="backdrop-blur-xl bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20 p-6">
                <h3 className="text-lg font-semibold mb-4">Content Impact</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Top Article</span>
                    <span className="font-semibold text-xs">Market Trends 2025</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Views</span>
                    <span className="font-semibold">347</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Engagement</span>
                    <span className="font-semibold">68%</span>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

// KPI Tile Component
interface KPITileProps {
  icon: React.ReactNode;
  label: string;
  value?: number;
  isLoading?: boolean;
  format?: 'number' | 'currency';
  color?: string;
  delay?: string;
}

function KPITile({ icon, label, value, isLoading, format = 'number', color = 'text-primary', delay = '0s' }: KPITileProps) {
  const formattedValue = value
    ? format === 'currency'
      ? `$${(value / 1000).toFixed(0)}k`
      : value.toLocaleString()
    : '—';

  return (
    <Card 
      className="backdrop-blur-xl bg-card/50 border-border/50 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in"
      style={{ animationDelay: delay }}
    >
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl bg-primary/10 ${color}`}>
          {icon}
        </div>
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">{label}</p>
          {isLoading ? (
            <Skeleton className="h-8 w-24 mt-1" />
          ) : (
            <p className="text-2xl font-bold mt-1">{formattedValue}</p>
          )}
        </div>
      </div>
    </Card>
  );
}
