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
    statusColor: 'bg-green-500/20 text-green-300 border-green-500/30',
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
    statusColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
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
    statusColor: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
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
    statusColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
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
    color: 'text-green-400'
  },
  {
    title: 'API Response Time',
    value: '127ms',
    change: '-12ms',
    icon: Zap,
    color: 'text-blue-400'
  },
  {
    title: 'Data Processed',
    value: '2.4TB',
    change: '+124GB',
    icon: TrendingUp,
    color: 'text-orange-400'
  },
  {
    title: 'Global Requests',
    value: '847K',
    change: '+12.3%',
    icon: Globe,
    color: 'text-purple-400'
  }
];

export default function Overview() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-neutral-100 mb-2">
          Backend Dashboard
        </h1>
        <p className="text-lg text-neutral-400">
          Complete real estate data management and automation platform
        </p>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {systemMetrics.map((metric) => (
          <Card key={metric.title} className="bg-white/5 backdrop-blur-xl border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-400 mb-1">{metric.title}</p>
                  <p className="text-2xl font-bold text-neutral-100">{metric.value}</p>
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
          <Card key={module.title} className="bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/8 transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500/20 to-orange-600/20">
                    <module.icon className="h-6 w-6 text-orange-300" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-neutral-100">{module.title}</CardTitle>
                    <Badge className={`mt-1 ${module.statusColor}`}>
                      {module.status}
                    </Badge>
                  </div>
                </div>
              </div>
              <CardDescription className="text-neutral-300 mt-2">
                {module.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4">
                {module.stats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className="text-lg font-bold text-neutral-100">{stat.value}</p>
                    <p className="text-xs text-neutral-400">{stat.label}</p>
                  </div>
                ))}
              </div>
              
              {/* Action Button */}
              <Button 
                asChild 
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium"
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
      <Card className="bg-white/5 backdrop-blur-xl border-white/10">
        <CardHeader>
          <CardTitle className="text-xl text-neutral-100">Recent Activity</CardTitle>
          <CardDescription className="text-neutral-300">
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
              <div key={index} className="flex items-center justify-between py-3 border-b border-white/10 last:border-0">
                <div>
                  <p className="text-sm font-medium text-neutral-100">{activity.event}</p>
                  <p className="text-xs text-neutral-400">{activity.time}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-neutral-300">{activity.count}</p>
                  <Badge 
                    className={
                      activity.type === 'success' 
                        ? 'bg-green-500/20 text-green-300 border-green-500/30' 
                        : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
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