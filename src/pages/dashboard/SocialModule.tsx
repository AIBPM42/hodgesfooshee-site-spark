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
      <Card className="bg-[var(--surface)] border border-[var(--border-subtle)] rounded-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[var(--text-primary)]">
            <Trophy className="h-5 w-5" />
            Monthly Leaderboard
          </CardTitle>
          <CardDescription className="text-[var(--text-secondary)]">
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
              <div key={agent.rank} className="flex items-center justify-between p-4 bg-[var(--bg-soft)] rounded-lg hover:bg-[var(--surface)]/70 transition-colors border border-[var(--border-subtle)]">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-[var(--text-primary)] w-6">{agent.rank}</span>
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
                    <AvatarFallback className="bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--accent-orange)]">
                      {agent.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-[var(--text-primary)]">{agent.name}</p>
                    <p className="text-sm text-[var(--text-secondary)]">{agent.deals} deals • {agent.revenue}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-bold text-[var(--text-primary)]">{agent.score}%</p>
                    <p className="text-xs text-[var(--text-secondary)]">Performance Score</p>
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
        <Card className="bg-[var(--surface)] border border-[var(--border-subtle)] rounded-xl">
          <CardHeader>
            <CardTitle className="text-[var(--text-primary)]">Team Activity Feed</CardTitle>
            <CardDescription className="text-[var(--text-secondary)]">
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
                <div key={index} className="flex items-start gap-3 p-3 bg-[var(--bg-soft)] rounded-lg border border-[var(--border-subtle)]">
                  <div className="p-2 rounded-full bg-[var(--accent-orange)]/20 border border-[var(--accent-orange)]/30">
                    <activity.icon className="h-4 w-4 text-[var(--accent-orange)]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-[var(--text-primary)]">
                      <span className="font-medium">{activity.agent}</span> {activity.action}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)] mt-1">{activity.details}</p>
                    <p className="text-xs text-[var(--text-muted)] mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Success Tracking */}
        <Card className="bg-[var(--surface)] border border-[var(--border-subtle)] rounded-xl">
          <CardHeader>
            <CardTitle className="text-[var(--text-primary)]">Success Metrics</CardTitle>
            <CardDescription className="text-[var(--text-secondary)]">
              Key performance indicators and goals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Monthly Goals */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-[var(--text-primary)]">Monthly Goals Progress</h4>
                  <Badge className="bg-[var(--accent-green)]/20 text-[var(--accent-green)] border border-[var(--accent-green)]/30">
                    On Track
                  </Badge>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-[var(--text-secondary)]">Revenue Target</span>
                      <span className="text-[var(--text-primary)]">$8.2M / $10M</span>
                    </div>
                    <div className="w-full bg-[var(--bg-soft)] rounded-full h-2 border border-[var(--border-subtle)]">
                      <div className="bg-[var(--accent-green)] h-2 rounded-full" style={{ width: '82%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-[var(--text-secondary)]">Deal Volume</span>
                      <span className="text-[var(--text-primary)]">47 / 60</span>
                    </div>
                    <div className="w-full bg-[var(--bg-soft)] rounded-full h-2 border border-[var(--border-subtle)]">
                      <div className="bg-[var(--accent-purple)] h-2 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-[var(--text-secondary)]">Client Satisfaction</span>
                      <span className="text-[var(--text-primary)]">94% / 90%</span>
                    </div>
                    <div className="w-full bg-[var(--bg-soft)] rounded-full h-2 border border-[var(--border-subtle)]">
                      <div className="bg-[var(--accent-gold)] h-2 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-3">
                <h4 className="font-medium text-[var(--text-primary)]">Quick Actions</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Button size="sm" className="bg-[var(--accent-green)]/20 hover:bg-[var(--accent-green)]/30 text-[var(--accent-green)] border border-[var(--accent-green)]/40">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Team Chat
                  </Button>
                  <Button size="sm" className="bg-[var(--accent-purple)]/20 hover:bg-[var(--accent-purple)]/30 text-[var(--accent-purple)] border border-[var(--accent-purple)]/40">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule
                  </Button>
                  <Button size="sm" className="bg-[var(--accent-gold)]/20 hover:bg-[var(--accent-gold)]/30 text-[var(--accent-gold)] border border-[var(--accent-gold)]/40">
                    <Trophy className="h-4 w-4 mr-2" />
                    Awards
                  </Button>
                  <Button size="sm" className="bg-[var(--accent-orange)]/20 hover:bg-[var(--accent-orange)]/30 text-[var(--accent-orange)] border border-[var(--accent-orange)]/40">
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
      <Card className="bg-[var(--accent-purple)]/10 border border-[var(--accent-purple)]/30 rounded-xl">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Users className="h-8 w-8 text-[var(--accent-purple)]" />
            <div>
              <h3 className="font-medium text-[var(--text-primary)] mb-1">Advanced Social Features Coming Soon</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Team messaging, advanced collaboration tools, and custom performance dashboards are in development.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}