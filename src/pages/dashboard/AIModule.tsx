import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Brain, 
  MessageSquare, 
  Search, 
  Zap, 
  Settings,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  Cpu
} from 'lucide-react';

export default function AIModule() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-primary mb-2">
          AI & Automation Module
        </h1>
        <p className="text-lg text-secondary">
          Advanced AI integrations and automated workflow management
        </p>
      </div>

      {/* AI Services Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { name: 'OpenAI GPT', status: 'active', usage: '847 calls', icon: MessageSquare, color: 'text-green-400' },
          { name: 'Claude API', status: 'active', usage: '234 calls', icon: Brain, color: 'text-blue-400' },
          { name: 'Perplexity', status: 'beta', usage: '156 searches', icon: Search, color: 'text-yellow-400' },
          { name: 'Manus API', status: 'configured', usage: '89 requests', icon: Cpu, color: 'text-purple-400' }
        ].map((service) => (
          <Card key={service.name} className="card-surface">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <service.icon className={`h-8 w-8 ${service.color}`} />
                <Badge className={
                  service.status === 'active' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                  service.status === 'beta' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
                  'bg-blue-500/20 text-blue-300 border-blue-500/30'
                }>
                  {service.status}
                </Badge>
              </div>
              <h3 className="font-medium text-primary mb-1">{service.name}</h3>
              <p className="text-sm text-secondary">{service.usage} today</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="card-surface">
        <CardHeader>
          <CardTitle className="text-primary">AI Operations</CardTitle>
          <CardDescription className="text-secondary">
            Test and configure AI services
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="btn-accent">
              <MessageSquare className="h-4 w-4 mr-2" />
              Test ChatGPT
            </Button>
            <Button className="btn-accent">
              <Search className="h-4 w-4 mr-2" />
              Test Perplexity
            </Button>
            <Button className="btn-accent">
              <Settings className="h-4 w-4 mr-2" />
              Configure APIs
            </Button>
          </div>
          
          <Alert className="bg-blue-500/10 border-blue-500/30">
            <Brain className="h-4 w-4" />
            <AlertDescription className="text-blue-300">
              All AI services are operational. Average response time: 1.2s
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Automation Workflows */}
      <Card className="card-surface">
        <CardHeader>
          <CardTitle className="text-primary">Automation Workflows</CardTitle>
          <CardDescription className="text-secondary">
            n8n workflows and automated processes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: 'Property Description Generator', status: 'active', runs: '247 today', accuracy: '94.2%' },
              { name: 'Market Analysis Automation', status: 'active', runs: '156 today', accuracy: '97.8%' },
              { name: 'Lead Qualification Bot', status: 'paused', runs: '89 today', accuracy: '91.5%' },
              { name: 'Social Media Content Creator', status: 'beta', runs: '45 today', accuracy: '88.3%' }
            ].map((workflow, index) => (
              <div key={index} className="flex items-center justify-between py-4 border-b border-subtle last:border-0">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-full ${
                    workflow.status === 'active' ? 'bg-green-500/20' :
                    workflow.status === 'beta' ? 'bg-yellow-500/20' : 'bg-gray-500/20'
                  }`}>
                    <Zap className={`h-4 w-4 ${
                      workflow.status === 'active' ? 'text-green-400' :
                      workflow.status === 'beta' ? 'text-yellow-400' : 'text-gray-400'
                    }`} />
                  </div>
                  <div>
                    <p className="font-medium text-primary">{workflow.name}</p>
                    <p className="text-sm text-secondary">{workflow.runs} • {workflow.accuracy} accuracy</p>
                  </div>
                </div>
                <Badge className={
                  workflow.status === 'active' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                  workflow.status === 'beta' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
                  'bg-gray-500/20 text-gray-300 border-gray-500/30'
                }>
                  {workflow.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent AI Activity */}
      <Card className="card-surface">
        <CardHeader>
          <CardTitle className="text-primary">Recent AI Activity</CardTitle>
          <CardDescription className="text-secondary">
            Latest AI operations and results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { time: '3 minutes ago', action: 'Generated property descriptions', model: 'GPT-4', count: '12 listings', status: 'success' },
              { time: '8 minutes ago', action: 'Market analysis completed', model: 'Claude', count: '5 neighborhoods', status: 'success' },
              { time: '15 minutes ago', action: 'Lead scoring processed', model: 'Custom ML', count: '34 leads', status: 'success' },
              { time: '22 minutes ago', action: 'Content generation failed', model: 'GPT-4', count: '1 blog post', status: 'error' },
              { time: '35 minutes ago', action: 'Perplexity search completed', model: 'Perplexity', count: '8 queries', status: 'success' }
            ].map((activity, index) => (
              <div key={index} className="flex items-start gap-4 py-4 border-b border-subtle last:border-0">
                <div className={`p-2 rounded-full ${
                  activity.status === 'success' ? 'bg-green-500/20' : 'bg-red-500/20'
                }`}>
                  {activity.status === 'success' ? (
                    <CheckCircle className="h-4 w-4 text-green-400" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-red-400" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-primary">{activity.action}</p>
                    <p className="text-xs text-secondary">{activity.time}</p>
                  </div>
                  <p className="text-sm text-secondary mt-1">
                    {activity.model} • {activity.count}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}