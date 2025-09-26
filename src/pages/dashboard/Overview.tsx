import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Database, 
  Brain, 
  BarChart3, 
  Users, 
  TrendingUp,
  Activity,
  Zap,
  Globe,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

const getModuleCards = (stats: any) => [
  {
    title: 'MLS Data Sync',
    description: 'Real-time property data from RealTracs MLS. Sync listings, offices, members, and open houses.',
    href: '/admin/mls',
    icon: Database,
    status: stats?.apiHealth ? 'Active' : 'Syncing',
    statusColor: stats?.apiHealth 
      ? 'bg-[color-mix(in_srgb,var(--accent-green)_20%,transparent)] text-accent-green border-accent-green'
      : 'bg-[color-mix(in_srgb,var(--accent-orange)_20%,transparent)] text-accent-orange border-accent-orange',
    stats: [
      { label: 'Active Listings', value: stats?.activeListings?.toLocaleString() || '0' },
      { label: 'Last Sync', value: stats?.lastSyncTime || 'Never' },
      { label: 'Success Rate', value: stats?.successRate || '100%' }
    ]
  },
  {
    title: 'AI & Automation',
    description: 'ChatGPT, Claude, Perplexity integrations. Automated workflows and smart content generation.',
    href: '/admin/ai',
    icon: Brain,
    status: 'Beta',
    statusColor: 'bg-[color-mix(in_srgb,var(--accent-purple)_20%,transparent)] text-accent-purple border-accent-purple',
    stats: [
      { label: 'API Calls', value: '1,234' },
      { label: 'Workflows', value: '12' },
      { label: 'Accuracy', value: '94.2%' }
    ]
  },
  {
    title: 'Analytics Dashboard',
    description: 'Market insights, performance metrics, and trend analysis. Real-time data visualization.',
    href: '/admin/analytics',
    icon: BarChart3,
    status: 'Coming Soon',
    statusColor: 'bg-[color-mix(in_srgb,var(--accent-orange)_20%,transparent)] text-accent-orange border-accent-orange',
    stats: [
      { label: 'Data Points', value: '45K+' },
      { label: 'Reports', value: '28' },
      { label: 'Accuracy', value: '97.5%' }
    ]
  },
  {
    title: 'Social & Agent Tools',
    description: 'Team collaboration, success tracking, leaderboards, and internal communication tools.',
    href: '/admin/social',
    icon: Users,
    status: 'Planned',
    statusColor: 'bg-[color-mix(in_srgb,var(--accent-purple)_20%,transparent)] text-accent-purple border-accent-purple',
    stats: [
      { label: 'Team Members', value: '24' },
      { label: 'Performance', value: '85%' },
      { label: 'Engagement', value: '92%' }
    ]
  }
];

const getSystemMetrics = (stats: any) => [
  {
    title: 'System Performance',
    value: stats?.systemPerformance || '95.2%',
    change: stats?.apiHealth ? '+0.2%' : '-0.8%',
    icon: Activity,
    color: stats?.apiHealth ? 'text-accent-green' : 'text-accent-orange'
  },
  {
    title: 'API Response Time',
    value: stats?.apiResponseTime || '127ms',
    change: '-12ms',
    icon: Zap,
    color: 'text-series-b'
  },
  {
    title: 'Active Listings',
    value: stats?.activeListings?.toLocaleString() || '0',
    change: '+' + (stats?.activeListings || 0),
    icon: TrendingUp,
    color: 'text-accent-orange'
  },
  {
    title: 'Open Houses',
    value: stats?.openHouses?.toLocaleString() || '0',
    change: 'Today',
    icon: Globe,
    color: 'text-accent-purple'
  }
];

export default function Overview() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: dashboardStats, isLoading } = useDashboardStats();
  
  const systemMetrics = getSystemMetrics(dashboardStats);
  const moduleCards = getModuleCards(dashboardStats);

  async function runListingsSync() {
    setLoading(true);
    try {
      // Step 1: Refresh OAuth token
      await supabase.functions.invoke('manage-oauth-tokens', { method: 'POST' });
      
      // Step 2: Run listings sync
      const { data, error } = await supabase.functions.invoke('sync_realtyna', {
        method: 'POST',
        body: { top: 25, force: true }
      });
      
      if (error) throw error;
      toast({
        title: "Listings Sync Complete",
        description: `Synced ${data?.total ?? data?.items_processed ?? 'OK'} listings`,
      });
      
      // Refresh dashboard stats
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      
    } catch (e: any) {
      toast({
        title: "Sync Failed",
        description: `Listings sync failed: ${e.message ?? e}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-[var(--text-primary)] mb-2">
          Backend Dashboard
        </h1>
        <p className="text-lg text-[var(--text-secondary)]">
          Complete real estate data management and automation platform
        </p>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {systemMetrics.map((metric) => (
          <Card key={metric.title} className="bg-[var(--surface)] border border-[var(--border-subtle)] rounded-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[var(--text-secondary)] mb-1">{metric.title}</p>
                  {isLoading ? (
                    <Skeleton className="h-8 w-20 mb-1" />
                  ) : (
                    <p className="text-2xl font-bold text-[var(--text-primary)]">{metric.value}</p>
                  )}
                  <p className={`text-sm ${metric.color} font-medium`}>
                    {metric.change} from last period
                  </p>
                </div>
                <metric.icon className={`h-8 w-8 ${metric.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Module Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {moduleCards.map((module) => (
          <Card key={module.title} className="bg-[var(--surface)] border border-[var(--border-subtle)] rounded-xl transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[color-mix(in_srgb,var(--accent-orange)_20%,transparent)]">
                    <module.icon className="h-6 w-6 text-accent-orange" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-[var(--text-primary)]">{module.title}</CardTitle>
                    <Badge className={`mt-1 ${module.statusColor}`}>
                      {module.status}
                    </Badge>
                  </div>
                </div>
              </div>
              <CardDescription className="text-[var(--text-secondary)] mt-2">
                {module.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4">
                {module.stats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    {isLoading ? (
                      <Skeleton className="h-6 w-12 mx-auto mb-1" />
                    ) : (
                      <p className="text-lg font-bold text-[var(--text-primary)]">{stat.value}</p>
                    )}
                    <p className="text-xs text-[var(--text-secondary)]">{stat.label}</p>
                  </div>
                ))}
              </div>
              
              {/* Action Button */}
              {module.title === 'MLS Data Sync' ? (
                <div className="space-y-2">
                  <Button 
                    className="w-full btn-accent"
                    onClick={runListingsSync}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Syncing Listings...
                      </>
                    ) : (
                      'Sync Listings Now'
                    )}
                  </Button>
                  <Button 
                    asChild 
                    variant="outline"
                    className="w-full"
                  >
                    <Link to={module.href}>
                      Open MLS Dashboard
                    </Link>
                  </Button>
                </div>
              ) : (
                <Button 
                  asChild 
                  className="w-full btn-accent"
                >
                  <Link to={module.href}>
                    Open {module.title}
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card className="bg-[var(--surface)] border border-[var(--border-subtle)] rounded-xl">
        <CardHeader>
          <CardTitle className="text-xl text-[var(--text-primary)]">Recent Activity</CardTitle>
          <CardDescription className="text-[var(--text-secondary)]">
            Latest system events and data updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { time: '2 minutes ago', event: 'MLS sync completed', type: 'success', count: '2,847 listings updated' },
              { time: '15 minutes ago', event: 'AI model response', type: 'info', count: '94.2% accuracy' },
              { time: '1 hour ago', event: 'Analytics report generated', type: 'success', count: '28 charts updated' },
              { time: '3 hours ago', event: 'Database backup completed', type: 'success', count: '2.4TB backed up' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-[var(--border-subtle)] last:border-0">
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)]">{activity.event}</p>
                  <p className="text-xs text-[var(--text-secondary)]">{activity.time}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-[var(--text-secondary)]">{activity.count}</p>
                  <Badge 
                    className={
                      activity.type === 'success' 
                        ? 'bg-[color-mix(in_srgb,var(--accent-green)_20%,transparent)] text-accent-green border-accent-green' 
                        : 'bg-[color-mix(in_srgb,var(--series-b)_20%,transparent)] text-series-b border-series-b'
                    }
                  >
                    {activity.type}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}