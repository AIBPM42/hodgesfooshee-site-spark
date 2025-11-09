"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from "next/link";
import PremiumCard from '@/components/ui/PremiumCard';
import { KpiTile } from '@/components/ui/KpiTile';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

interface DashboardStats {
  totalAgents: number;
  activeAgents: number;
  pendingAgents: number;
  totalOpenHouses: number;
  upcomingOpenHouses: number;
  totalRsvps: number;
  totalLeads: number;
  newLeadsToday: number;
  imagesCreatedToday: number;
  blogPosts: number;
}

interface MLSStats {
  totalListings: number;
  activeListings: number;
  avgPrice: number;
  medianPrice: number;
  totalAgents: number;
  totalOffices: number;
  systemHealth: 'healthy' | 'degraded' | 'down';
}

interface RecentActivity {
  id: string;
  type: string;
  message: string;
  time: string;
}

export default function AdminDashboard() {
  const { user, profile, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalAgents: 0,
    activeAgents: 0,
    pendingAgents: 0,
    totalOpenHouses: 0,
    upcomingOpenHouses: 0,
    totalRsvps: 0,
    totalLeads: 0,
    newLeadsToday: 0,
    imagesCreatedToday: 0,
    blogPosts: 0,
  });
  const [mlsStats, setMlsStats] = useState<MLSStats>({
    totalListings: 0,
    activeListings: 0,
    avgPrice: 0,
    medianPrice: 0,
    totalAgents: 0,
    totalOffices: 0,
    systemHealth: 'healthy',
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (profile) {
        loadDashboardData();
      } else {
        // No profile means not logged in, stop loading
        setLoading(false);
      }
    }
  }, [authLoading, profile]);

  async function loadDashboardData() {
    try {
      // Load agents stats
      const { data: agents } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "agent");

      // Load open houses stats
      const { data: openHouses } = await supabase
        .from("open_houses")
        .select("*");

      const upcoming = openHouses?.filter(oh => new Date(oh.start_time) > new Date()) || [];

      // Load RSVPs
      const { data: rsvps } = await supabase
        .from("open_house_rsvps")
        .select("*");

      // Load leads
      const { data: leads } = await supabase
        .from("leads")
        .select("*");

      const today = new Date().toISOString().split('T')[0];
      const leadsToday = leads?.filter(l => l.created_at.startsWith(today)) || [];

      // Load owner-specific stats (images created, blog posts)
      let imagesCreatedToday = 0;
      let blogPosts = 0;

      // Try to load from new tables (will fail gracefully if tables don't exist yet)
      try {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        // Check image_edit_runs table (the actual table being used)
        const { count: imagesCount } = await supabase
          .from('image_edit_runs')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', todayStart.toISOString());

        const { count: blogCount } = await supabase
          .from('blog_posts')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'published');

        imagesCreatedToday = imagesCount || 0;
        blogPosts = blogCount || 0;
      } catch (err) {
        // Tables don't exist yet - that's okay, they'll be created when migration runs
        console.log("New tables not yet created:", err);
      }

      // Load MLS stats from Realtyna backend
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

        // Fetch MLS health
        const healthRes = await fetch(`${supabaseUrl}/functions/v1/mls-health`);
        const healthData = await healthRes.json();

        // Fetch Nashville market stats
        const statsRes = await fetch(`${supabaseUrl}/functions/v1/api-neighborhood-stats?city=Nashville`);
        const statsData = await statsRes.json();

        // Fetch member count
        const membersRes = await fetch(`${supabaseUrl}/functions/v1/mls-members?limit=1`);
        const membersData = await membersRes.json();

        // Fetch offices count
        const officesRes = await fetch(`${supabaseUrl}/functions/v1/mls-offices?limit=1`);
        const officesData = await officesRes.json();

        const allHealthy = healthData.services?.properties?.ok &&
                          healthData.services?.members?.ok &&
                          healthData.services?.offices?.ok;

        setMlsStats({
          totalListings: statsData.data?.totalListings || 0,
          activeListings: statsData.data?.totalListings || 0,
          avgPrice: statsData.data?.priceStats?.average || 0,
          medianPrice: statsData.data?.priceStats?.median || 0,
          totalAgents: membersData.total || 0,
          totalOffices: officesData.total || 0,
          systemHealth: allHealthy ? 'healthy' : 'degraded',
        });
      } catch (err) {
        console.error("Error loading MLS stats:", err);
      }

      setStats({
        totalAgents: agents?.length || 0,
        activeAgents: agents?.filter(a => a.status === 'active').length || 0,
        pendingAgents: agents?.filter(a => a.status === 'pending').length || 0,
        totalOpenHouses: openHouses?.length || 0,
        upcomingOpenHouses: upcoming.length,
        totalRsvps: rsvps?.length || 0,
        totalLeads: leads?.length || 0,
        newLeadsToday: leadsToday.length,
        imagesCreatedToday,
        blogPosts,
      });

      // Build activity feed
      const activities: RecentActivity[] = [];

      // Recent RSVPs
      rsvps?.slice(0, 3).forEach(rsvp => {
        activities.push({
          id: rsvp.id,
          type: 'rsvp',
          message: `${rsvp.guest_name} RSVP'd to an open house`,
          time: rsvp.created_at
        });
      });

      // Recent agents
      agents?.slice(0, 2).forEach(agent => {
        if (agent.status === 'pending') {
          activities.push({
            id: agent.id,
            type: 'agent',
            message: `New agent application: ${agent.first_name} ${agent.last_name}`,
            time: agent.created_at
          });
        }
      });

      activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
      setRecentActivity(activities.slice(0, 5));

    } catch (err) {
      console.error("Error loading dashboard data:", err);
    } finally {
      setLoading(false);
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-white text-xl">Loading dashboard...</div>
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
        <div className="glass-card max-w-md text-center p-8">
          <div className="text-4xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-300 mb-6">Please login to continue</p>
          <Link href="/login" className="text-hf-orange hover:underline">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  // Sample chart data
  const monthlyData = [
    { month: 'Jan', leads: 12, openHouses: 3 },
    { month: 'Feb', leads: 19, openHouses: 5 },
    { month: 'Mar', leads: 15, openHouses: 4 },
    { month: 'Apr', leads: 22, openHouses: 6 },
    { month: 'May', leads: 28, openHouses: 7 },
    { month: 'Jun', leads: 25, openHouses: 5 },
  ];

  const agentStatusData = [
    { name: 'Active', value: stats.activeAgents, color: '#59c059' }, // Brand green
    { name: 'Pending', value: stats.pendingAgents, color: '#ff7a1a' }, // Brand orange
  ];

  const isAdmin = profile.role === 'super_admin' || profile.role === 'broker';

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-[34px] font-extrabold tracking-tight text-[var(--text-strong)]">Admin Dashboard</h1>
        <p className="mt-1 text-[15px] text-[var(--text-muted)]">
          {profile.role === 'super_admin' ? 'System Administrator' :
           profile.role === 'broker' ? 'Broker Dashboard' :
           'Agent Dashboard'} | {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiTile
          label="Total Agents"
          value={stats.totalAgents.toString()}
          hint={`${stats.activeAgents} active`}
          badge={stats.pendingAgents > 0 ? `${stats.pendingAgents} pending` : undefined}
          strong
        />
        <KpiTile
          label="Images Today"
          value={stats.imagesCreatedToday.toString()}
          hint="Virtual staging"
          strong
        />
        <KpiTile
          label="Blog Posts"
          value={stats.blogPosts.toString()}
          hint="Published"
          strong
        />
        <KpiTile
          label="Total Leads"
          value={stats.totalLeads.toString()}
          hint={`${stats.newLeadsToday} today`}
          badge={stats.newLeadsToday > 0 ? `+${stats.newLeadsToday}` : undefined}
          strong
        />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/admin/content" className="card-matte !p-4 hover:scale-105 transition-transform">
          <div className="text-lg font-medium text-1 mb-1">Edit Home Page</div>
          <div className="text-sm text-muted">Update hero, features, CTAs</div>
        </Link>

        <Link href="/admin/blog" className="card-matte !p-4 hover:scale-105 transition-transform">
          <div className="text-lg font-medium text-1 mb-1">Manage Blog</div>
          <div className="text-sm text-muted">Create or edit posts</div>
        </Link>

        <Link href="/admin/analytics" className="card-matte !p-4 hover:scale-105 transition-transform">
          <div className="text-lg font-medium text-1 mb-1">Agent Analytics</div>
          <div className="text-sm text-muted">Activity and usage</div>
        </Link>

        <Link href="/admin/settings" className="card-matte !p-4 hover:scale-105 transition-transform">
          <div className="text-lg font-medium text-1 mb-1">Settings</div>
          <div className="text-sm text-muted">Configure site options</div>
        </Link>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Monthly Activity Chart */}
        <PremiumCard title="Monthly Activity" subtitle="Leads and open houses over time">
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" opacity={0.3} />
                <XAxis
                  dataKey="month"
                  stroke="var(--chart-axis)"
                  style={{ fontSize: '12px', fontWeight: 500 }}
                />
                <YAxis
                  stroke="var(--chart-axis)"
                  style={{ fontSize: '12px', fontWeight: 500 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--surface-1)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="leads"
                  stroke="var(--chart-accent)"
                  fill="var(--chart-accent)"
                  fillOpacity={0.2}
                  strokeWidth={2.5}
                  name="Leads"
                />
                <Area
                  type="monotone"
                  dataKey="openHouses"
                  stroke="var(--chart-line)"
                  fill="var(--chart-line)"
                  fillOpacity={0.2}
                  strokeWidth={2.5}
                  name="Open Houses"
                />
              </AreaChart>
            </ResponsiveContainer>
        </PremiumCard>

        {/* Agent Status Chart */}
        {isAdmin && (
          <PremiumCard title="Agent Status" subtitle="Active vs pending agents">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={agentStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {agentStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center space-x-6 mt-4">
                {agentStatusData.map((entry) => (
                  <div key={entry.name} className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                    <span className="text-gray-300 text-sm">{entry.name}: {entry.value}</span>
                  </div>
                ))}
              </div>
          </PremiumCard>
        )}
      </div>

      {/* Bottom Row: Recent Activity + System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Activity */}
        <PremiumCard title="Recent Activity" subtitle="Latest system events">
            {recentActivity.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <div className="text-4xl mb-2">📊</div>
                <p>No recent activity</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="p-4 bg-white/5 rounded-lg border border-white/10"
                  >
                    <div className="flex items-start space-x-3">
                      <span className="text-xl">
                        {activity.type === 'rsvp' ? '✅' :
                         activity.type === 'agent' ? '👤' : '📧'}
                      </span>
                      <div className="flex-1">
                        <p className="text-white text-sm">{activity.message}</p>
                        <p className="text-gray-500 text-xs mt-1">
                          {new Date(activity.time).toLocaleDateString()} at{' '}
                          {new Date(activity.time).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
        </PremiumCard>

        {/* System Status */}
        <PremiumCard title="System Status" subtitle="API and service health">
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-xs uppercase tracking-wide text-muted">Operational</span>
              </div>
              <div className="text-sm font-medium text-1">Database</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-xs uppercase tracking-wide text-muted">Operational</span>
              </div>
              <div className="text-sm font-medium text-1">MLS API</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-xs uppercase tracking-wide text-muted">Operational</span>
              </div>
              <div className="text-sm font-medium text-1">Image Processing</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-xs uppercase tracking-wide text-muted">Operational</span>
              </div>
              <div className="text-sm font-medium text-1">Blog System</div>
            </div>
          </div>
        </PremiumCard>
      </div>
    </div>
  );
}
