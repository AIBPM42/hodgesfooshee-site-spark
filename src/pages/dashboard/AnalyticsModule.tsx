import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  PieChart, 
  LineChart,
  Download,
  Filter,
  Calendar,
  Target
} from 'lucide-react';

export default function AnalyticsModule() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-primary mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-lg text-secondary">
            Market insights, performance metrics, and trend analysis
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-subtle text-secondary hover:text-primary">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline" className="border-subtle text-secondary hover:text-primary">
            <Calendar className="h-4 w-4 mr-2" />
            Date Range
          </Button>
          <Button className="btn-accent">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Total Sales Volume', value: '$24.8M', change: '+12.3%', trend: 'up', icon: TrendingUp },
          { title: 'Average Sale Price', value: '$485K', change: '+5.7%', trend: 'up', icon: TrendingUp },
          { title: 'Days on Market', value: '28 days', change: '-4.2%', trend: 'down', icon: TrendingDown },
          { title: 'Market Velocity', value: '2.4x', change: '+8.9%', trend: 'up', icon: Target }
        ].map((metric) => (
          <Card key={metric.title} className="card-surface">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary mb-1">{metric.title}</p>
                  <p className="text-2xl font-bold text-primary">{metric.value}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <metric.icon className={`h-4 w-4 ${metric.trend === 'up' ? 'text-green-400' : 'text-red-400'}`} />
                    <p className={`text-sm font-medium ${metric.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                      {metric.change}
                    </p>
                  </div>
                </div>
                <metric.icon className={`h-8 w-8 ${metric.trend === 'up' ? 'text-green-400' : 'text-red-400'}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart Placeholders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Market Trends Chart */}
        <Card className="bg-white/5 backdrop-blur-xl border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-neutral-100">
              <LineChart className="h-5 w-5" />
              Market Trends (90 Days)
            </CardTitle>
            <CardDescription className="text-neutral-300">
              Price trends and market velocity over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gradient-to-br from-orange-500/10 to-blue-500/10 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-neutral-400 mx-auto mb-3" />
                <p className="text-neutral-300 font-medium">Market Trends Chart</p>
                <p className="text-sm text-neutral-400">Interactive chart coming soon</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Property Type Distribution */}
        <Card className="bg-white/5 backdrop-blur-xl border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-neutral-100">
              <PieChart className="h-5 w-5" />
              Property Type Distribution
            </CardTitle>
            <CardDescription className="text-neutral-300">
              Breakdown by property type and value
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gradient-to-br from-purple-500/10 to-green-500/10 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <PieChart className="h-12 w-12 text-neutral-400 mx-auto mb-3" />
                <p className="text-neutral-300 font-medium">Property Distribution</p>
                <p className="text-sm text-neutral-400">Interactive pie chart coming soon</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card className="bg-white/5 backdrop-blur-xl border-white/10">
        <CardHeader>
          <CardTitle className="text-neutral-100">Performance Insights</CardTitle>
          <CardDescription className="text-neutral-300">
            Key performance indicators and market analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Top Neighborhoods */}
            <div>
              <h4 className="font-medium text-neutral-100 mb-3">Top Performing Neighborhoods</h4>
              <div className="space-y-3">
                {[
                  { name: 'Green Hills', sales: '$4.2M', change: '+15%' },
                  { name: 'Belle Meade', sales: '$3.8M', change: '+12%' },
                  { name: 'Music Row', sales: '$2.9M', change: '+8%' },
                  { name: 'The Gulch', sales: '$2.1M', change: '+5%' }
                ].map((neighborhood) => (
                  <div key={neighborhood.name} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div>
                      <p className="font-medium text-neutral-100">{neighborhood.name}</p>
                      <p className="text-sm text-neutral-400">{neighborhood.sales}</p>
                    </div>
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                      {neighborhood.change}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Ranges */}
            <div>
              <h4 className="font-medium text-neutral-100 mb-3">Active Price Ranges</h4>
              <div className="space-y-3">
                {[
                  { range: '$300K - $500K', count: '1,247', percentage: '44%' },
                  { range: '$500K - $750K', count: '892', percentage: '31%' },
                  { range: '$750K - $1M', count: '456', percentage: '16%' },
                  { range: '$1M+', count: '252', percentage: '9%' }
                ].map((range) => (
                  <div key={range.range} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div>
                      <p className="font-medium text-neutral-100">{range.range}</p>
                      <p className="text-sm text-neutral-400">{range.count} listings</p>
                    </div>
                    <Badge variant="outline" className="border-white/20 text-neutral-300">
                      {range.percentage}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Market Velocity */}
            <div>
              <h4 className="font-medium text-neutral-100 mb-3">Market Velocity Trends</h4>
              <div className="space-y-3">
                {[
                  { period: 'Last 7 Days', velocity: '2.8x', status: 'fast' },
                  { period: 'Last 30 Days', velocity: '2.4x', status: 'normal' },
                  { period: 'Last 90 Days', velocity: '2.1x', status: 'slow' },
                  { period: 'YTD Average', velocity: '2.3x', status: 'normal' }
                ].map((trend) => (
                  <div key={trend.period} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div>
                      <p className="font-medium text-neutral-100">{trend.period}</p>
                      <p className="text-sm text-neutral-400">{trend.velocity} normal pace</p>
                    </div>
                    <Badge className={
                      trend.status === 'fast' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                      trend.status === 'slow' ? 'bg-red-500/20 text-red-300 border-red-500/30' :
                      'bg-blue-500/20 text-blue-300 border-blue-500/30'
                    }>
                      {trend.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Coming Soon Alert */}
      <Card className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/30">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <BarChart3 className="h-8 w-8 text-yellow-400" />
            <div>
              <h3 className="font-medium text-neutral-100 mb-1">Advanced Analytics Coming Soon</h3>
              <p className="text-sm text-neutral-300">
                Interactive charts, predictive modeling, and custom report generation are in development.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}