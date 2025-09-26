import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Database, 
  Brain, 
  BarChart3, 
  Users, 
  TrendingUp,
  Activity,
  Zap,
  Globe
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const moduleCards = [
  {
    title: 'MLS Data Sync',
    description: 'Real-time property data from RealTracs MLS. Sync listings, offices, members, and open houses.',
    href: '/admin/mls',
    icon: Database,
    status: 'Active',
    statusColor: 'bg-[color-mix(in_srgb,var(--accent-green)_20%,transparent)] text-accent-green border-accent-green',
    stats: [
      { label: 'Active Listings', value: '2,847' },
      { label: 'Last Sync', value: '5m ago' },
      { label: 'Success Rate', value: '99.8%' }
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

const systemMetrics = [
  {
    title: 'System Performance',
    value: '99.9%',
    change: '+0.2%',
    icon: Activity,
    color: 'text-accent-green'
  },
  {
    title: 'API Response Time',
    value: '127ms',
    change: '-12ms',
    icon: Zap,
    color: 'text-series-b'
  },
  {
    title: 'Data Processed',
    value: '2.4TB',
    change: '+124GB',
    icon: TrendingUp,
    color: 'text-accent-orange'
  },
  {
    title: 'Global Requests',
    value: '847K',
    change: '+12.3%',
    icon: Globe,
    color: 'text-accent-purple'
  }
];

export default function Overview() {
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
          <Card key={metric.title} className="bg-[var(--surface)] border border-[var(--border-subtle)] rounded-xl shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[var(--text-secondary)] mb-1">{metric.title}</p>
                  <p className="text-2xl font-bold text-[var(--text-primary)]">{metric.value}</p>
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
          <Card key={module.title} className="bg-[var(--surface)] border border-[var(--border-subtle)] rounded-xl shadow-card hover:shadow-glow transition-all duration-300">
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
                    <p className="text-lg font-bold text-[var(--text-primary)]">{stat.value}</p>
                    <p className="text-xs text-[var(--text-secondary)]">{stat.label}</p>
                  </div>
                ))}
              </div>
              
              {/* Action Button */}
              <Button 
                asChild 
                className="w-full btn-accent"
              >
                <Link to={module.href}>
                  Open {module.title}
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card className="bg-[var(--surface)] border border-[var(--border-subtle)] rounded-xl shadow-card">
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