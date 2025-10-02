import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Activity } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

export default function Analytics() {
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'overview';
  const filter = searchParams.get('filter');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-gradient mb-2">Analytics</h1>
          <p className="text-muted-foreground">Deep dive into your MLS data</p>
        </div>
        <Link to="/admin">
          <Badge variant="outline" className="text-xs cursor-pointer hover:bg-accent">
            <Activity className="h-3 w-3 mr-1" />
            Live Dashboard
          </Badge>
        </Link>
      </div>

      <Tabs defaultValue={defaultTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="listings">Listings</TabsTrigger>
          <TabsTrigger value="searches">Searches</TabsTrigger>
          <TabsTrigger value="openhouses">Open Houses</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card className="card-glass">
            <CardHeader>
              <CardTitle>Overview Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Overview metrics and charts will appear here
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="listings" className="space-y-4">
          <Card className="card-glass">
            <CardHeader>
              <CardTitle>
                Listings Analytics
                {filter && (
                  <Badge variant="secondary" className="ml-2">
                    {filter.replace(/_/g, ' ')}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {filter === 'new_7d' && 'New listings from the past 7 days'}
                {filter === 'price_cuts_7d' && 'Price reductions in the past 7 days'}
                {filter === 'back_on_7d' && 'Properties back on market in the past 7 days'}
                {!filter && 'All listing analytics will appear here'}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="searches" className="space-y-4">
          <Card className="card-glass">
            <CardHeader>
              <CardTitle>Search Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Search patterns and popular queries will appear here
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="openhouses" className="space-y-4">
          <Card className="card-glass">
            <CardHeader>
              <CardTitle>Open Houses Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Open house attendance and engagement metrics will appear here
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
