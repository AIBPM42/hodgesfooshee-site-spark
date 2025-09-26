import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Database, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  TrendingUp,
  Building,
  Users,
  MapPin,
  Calendar
} from 'lucide-react';

export default function MLSModule() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-[var(--text-primary)] mb-2">
          MLS Data Sync Module
        </h1>
        <p className="text-lg text-[var(--text-secondary)]">
          Real-time synchronization with RealTracs MLS system
        </p>
      </div>

      {/* Connection Status */}
      <Card className="bg-[var(--surface)] border border-[var(--border-subtle)] rounded-xl shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[var(--text-primary)]">
            <Database className="h-5 w-5" />
            RealTracs Connection Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-green-400" />
              <div>
                <p className="font-medium text-[var(--text-primary)]">Connected to RealTracs MLS</p>
                <p className="text-sm text-[var(--text-secondary)]">OAuth token valid until Mar 15, 2025</p>
              </div>
            </div>
            <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
              Active
            </Badge>
          </div>
          
          <Alert className="bg-blue-500/10 border-blue-500/30">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-blue-300">
              API rate limits: 1,000 requests per hour (Current: 847/1,000)
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Data Sync Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Active Listings', value: '2,847', icon: TrendingUp, change: '+23 today', color: 'text-green-400' },
          { title: 'Offices', value: '156', icon: Building, change: '+2 this week', color: 'text-blue-400' },
          { title: 'Members', value: '1,234', icon: Users, change: '+12 this month', color: 'text-purple-400' },
          { title: 'Open Houses', value: '89', icon: Calendar, change: '+15 this weekend', color: 'text-orange-400' }
        ].map((metric) => (
          <Card key={metric.title} className="bg-[var(--surface)] border border-[var(--border-subtle)] rounded-xl shadow-card">
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

      {/* Sync Controls */}
      <Card className="bg-[var(--surface)] border border-[var(--border-subtle)] rounded-xl shadow-card">
        <CardHeader>
          <CardTitle className="text-[var(--text-primary)]">Data Synchronization</CardTitle>
          <CardDescription className="text-[var(--text-secondary)]">
            Manual sync controls and automation settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button className="btn-accent">
              <RefreshCw className="h-4 w-4 mr-2" />
              Sync Listings
            </Button>
            <Button className="btn-accent">
              <Building className="h-4 w-4 mr-2" />
              Sync Offices
            </Button>
            <Button className="btn-accent">
              <Users className="h-4 w-4 mr-2" />
              Sync Members
            </Button>
            <Button className="btn-accent">
              <Calendar className="h-4 w-4 mr-2" />
              Sync Open Houses
            </Button>
          </div>
          
          <div className="flex items-center gap-4 pt-4 border-t border-[var(--border-subtle)]">
            <Clock className="h-5 w-5 text-[var(--text-secondary)]" />
            <div className="flex-1">
              <p className="text-sm font-medium text-[var(--text-primary)]">Auto-sync Schedule</p>
              <p className="text-xs text-[var(--text-secondary)]">Every 15 minutes during business hours (8 AM - 8 PM CST)</p>
            </div>
            <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
              Enabled
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Recent Sync Activity */}
      <Card className="bg-[var(--surface)] border border-[var(--border-subtle)] rounded-xl shadow-card">
        <CardHeader>
          <CardTitle className="text-[var(--text-primary)]">Recent Sync Activity</CardTitle>
          <CardDescription className="text-[var(--text-secondary)]">
            Latest synchronization results and system logs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { time: '2 minutes ago', action: 'Listings sync completed', status: 'success', details: '2,847 records processed, 23 new, 15 updated' },
              { time: '17 minutes ago', action: 'Members sync completed', status: 'success', details: '1,234 members processed, 2 new profiles added' },
              { time: '32 minutes ago', action: 'Offices sync completed', status: 'success', details: '156 offices processed, 1 status update' },
              { time: '47 minutes ago', action: 'Open Houses sync completed', status: 'success', details: '89 open houses processed, 12 new events' },
              { time: '1 hour ago', action: 'ZIP Codes sync completed', status: 'warning', details: '3,421 postal codes processed, 5 validation warnings' }
            ].map((activity, index) => (
              <div key={index} className="flex items-start gap-4 py-4 border-b border-[var(--border-subtle)] last:border-0">
                  <div className={`p-2 rounded-full ${
                    activity.status === 'success' ? 'bg-green-500/20' : 
                    activity.status === 'warning' ? 'bg-yellow-500/20' : 'bg-red-500/20'
                  }`}>
                    {activity.status === 'success' ? (
                      <CheckCircle className="h-4 w-4 text-green-400" />
                    ) : activity.status === 'warning' ? (
                      <AlertCircle className="h-4 w-4 text-yellow-400" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-400" />
                    )}
                  </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-[var(--text-primary)]">{activity.action}</p>
                    <p className="text-xs text-[var(--text-secondary)]">{activity.time}</p>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">{activity.details}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}