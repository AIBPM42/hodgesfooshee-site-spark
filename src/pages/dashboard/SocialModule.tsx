import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Users, 
  Trophy, 
  MessageCircle, 
  Target, 
  Star,
  TrendingUp,
  Award,
  Calendar,
  Clock,
  Zap
} from 'lucide-react';

export default function SocialModule() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-[var(--text-primary)] mb-2">
          Social & Agent Tools
        </h1>
        <p className="text-lg text-[var(--text-secondary)]">
          Team collaboration, performance tracking, and success management
        </p>
      </div>

      {/* Team Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Active Agents', value: '24', icon: Users, change: '+2 this month', color: 'text-blue-400' },
          { title: 'Team Performance', value: '94.2%', icon: Target, change: '+5.3% vs last month', color: 'text-green-400' },
          { title: 'Collaboration Score', value: '89%', icon: MessageCircle, change: '+2.1% this week', color: 'text-purple-400' },
          { title: 'Success Rate', value: '87%', icon: Trophy, change: '+8.4% vs last quarter', color: 'text-orange-400' }
        ].map((metric) => (
          <Card key={metric.title} className="bg-[var(--surface)] border border-[var(--border-subtle)] rounded-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[var(--text-secondary)] mb-1">{metric.title}</p>
                  <p className="text-2xl font-bold text-[var(--text-primary)]">{metric.value}</p>
                  <p className={`text-sm ${metric.color} font-medium`}>{metric.change}</p>
                </div>
                <metric.icon className={`h-8 w-8 ${metric.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance Leaderboard */}
      <Card className="bg-white/5 backdrop-blur-xl border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-neutral-100">
            <Trophy className="h-5 w-5" />
            Monthly Leaderboard
          </CardTitle>
          <CardDescription className="text-neutral-300">
            Top performing team members this month
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { rank: 1, name: 'Sarah Johnson', deals: 12, revenue: '$2.4M', score: 98, badge: 'gold' },
              { rank: 2, name: 'Mike Chen', deals: 10, revenue: '$2.1M', score: 94, badge: 'silver' },
              { rank: 3, name: 'Emily Rodriguez', deals: 9, revenue: '$1.8M', score: 91, badge: 'bronze' },
              { rank: 4, name: 'David Park', deals: 8, revenue: '$1.6M', score: 87, badge: null },
              { rank: 5, name: 'Lisa Thompson', deals: 7, revenue: '$1.4M', score: 84, badge: null }
            ].map((agent) => (
              <div key={agent.rank} className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/8 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-neutral-100 w-6">{agent.rank}</span>
                    {agent.badge && (
                      <div className={`p-1 rounded-full ${
                        agent.badge === 'gold' ? 'bg-yellow-500/20' :
                        agent.badge === 'silver' ? 'bg-gray-400/20' : 'bg-orange-500/20'
                      }`}>
                        <Award className={`h-4 w-4 ${
                          agent.badge === 'gold' ? 'text-yellow-400' :
                          agent.badge === 'silver' ? 'text-gray-400' : 'text-orange-400'
                        }`} />
                      </div>
                    )}
                  </div>
                  <Avatar>
                    <AvatarFallback className="bg-gradient-to-br from-orange-500/20 to-blue-500/20 text-neutral-100">
                      {agent.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-neutral-100">{agent.name}</p>
                    <p className="text-sm text-neutral-400">{agent.deals} deals • {agent.revenue}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-bold text-neutral-100">{agent.score}%</p>
                    <p className="text-xs text-neutral-400">Performance Score</p>
                  </div>
                  <Star className="h-5 w-5 text-yellow-400" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Team Activities & Collaboration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card className="bg-white/5 backdrop-blur-xl border-white/10">
          <CardHeader>
            <CardTitle className="text-neutral-100">Team Activity Feed</CardTitle>
            <CardDescription className="text-neutral-300">
              Recent team interactions and achievements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { time: '5 minutes ago', agent: 'Sarah J.', action: 'closed a deal', details: '$485K residential in Green Hills', icon: Target },
                { time: '12 minutes ago', agent: 'Mike C.', action: 'shared market insight', details: 'Luxury market trends report', icon: TrendingUp },
                { time: '28 minutes ago', agent: 'Emily R.', action: 'completed training', details: 'Advanced negotiation techniques', icon: Award },
                { time: '1 hour ago', agent: 'David P.', action: 'scheduled showing', details: '3 properties for this weekend', icon: Calendar },
                { time: '2 hours ago', agent: 'Lisa T.', action: 'received client feedback', details: '5-star review on service quality', icon: Star }
              ].map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-white/3 rounded-lg">
                  <div className="p-2 rounded-full bg-gradient-to-br from-orange-500/20 to-blue-500/20">
                    <activity.icon className="h-4 w-4 text-orange-300" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-neutral-100">
                      <span className="font-medium">{activity.agent}</span> {activity.action}
                    </p>
                    <p className="text-xs text-neutral-400 mt-1">{activity.details}</p>
                    <p className="text-xs text-neutral-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Success Tracking */}
        <Card className="bg-white/5 backdrop-blur-xl border-white/10">
          <CardHeader>
            <CardTitle className="text-neutral-100">Success Metrics</CardTitle>
            <CardDescription className="text-neutral-300">
              Key performance indicators and goals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Monthly Goals */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-neutral-100">Monthly Goals Progress</h4>
                  <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                    On Track
                  </Badge>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-neutral-300">Revenue Target</span>
                      <span className="text-neutral-100">$8.2M / $10M</span>
                    </div>
                    <div className="w-full bg-neutral-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full" style={{ width: '82%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-neutral-300">Deal Volume</span>
                      <span className="text-neutral-100">47 / 60</span>
                    </div>
                    <div className="w-full bg-neutral-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-neutral-300">Client Satisfaction</span>
                      <span className="text-neutral-100">94% / 90%</span>
                    </div>
                    <div className="w-full bg-neutral-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-3">
                <h4 className="font-medium text-neutral-100">Quick Actions</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Button size="sm" className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Team Chat
                  </Button>
                  <Button size="sm" className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule
                  </Button>
                  <Button size="sm" className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white">
                    <Trophy className="h-4 w-4 mr-2" />
                    Awards
                  </Button>
                  <Button size="sm" className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white">
                    <Zap className="h-4 w-4 mr-2" />
                    Training
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Coming Soon Alert */}
      <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/30">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Users className="h-8 w-8 text-purple-400" />
            <div>
              <h3 className="font-medium text-neutral-100 mb-1">Advanced Social Features Coming Soon</h3>
              <p className="text-sm text-neutral-300">
                Team messaging, advanced collaboration tools, and custom performance dashboards are in development.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}