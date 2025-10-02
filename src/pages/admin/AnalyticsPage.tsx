import { ArrowLeft, Download, TrendingUp, Search, Eye, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { usePageAnalytics } from "@/hooks/usePageAnalytics";
import { useSearchAnalytics } from "@/hooks/useSearchAnalytics";
import { useListingAnalytics } from "@/hooks/useListingAnalytics";
import { subDays } from "date-fns";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

export default function AnalyticsPage() {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState<"7d" | "30d" | "90d">("30d");
  
  const days = dateRange === "7d" ? 7 : dateRange === "30d" ? 30 : 90;
  const startDate = subDays(new Date(), days);
  const endDate = new Date();

  const pageAnalytics = usePageAnalytics({ startDate, endDate });
  const searchAnalytics = useSearchAnalytics({ startDate, endDate });
  const listingAnalytics = useListingAnalytics({ startDate, endDate });

  const exportToCSV = (data: any[], filename: string) => {
    if (!data.length) return;
    
    const headers = Object.keys(data[0]).join(",");
    const rows = data.map(row => Object.values(row).join(","));
    const csv = [headers, ...rows].join("\n");
    
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header />
      <main className="pt-24 pb-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/admin')}
                className="mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Deep Analytics
              </h1>
              <p className="text-muted-foreground mt-3 text-lg">
                Advanced metrics and behavioral insights
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant={dateRange === "7d" ? "default" : "outline"}
                size="sm"
                onClick={() => setDateRange("7d")}
              >
                7 Days
              </Button>
              <Button
                variant={dateRange === "30d" ? "default" : "outline"}
                size="sm"
                onClick={() => setDateRange("30d")}
              >
                30 Days
              </Button>
              <Button
                variant={dateRange === "90d" ? "default" : "outline"}
                size="sm"
                onClick={() => setDateRange("90d")}
              >
                90 Days
              </Button>
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 max-w-2xl">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="pages">Page Views</TabsTrigger>
              <TabsTrigger value="searches">Searches</TabsTrigger>
              <TabsTrigger value="listings">Listings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Page Views</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{pageAnalytics.data?.total || 0}</div>
                    <p className="text-xs text-muted-foreground mt-1">Last {days} days</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Searches</CardTitle>
                    <Search className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{searchAnalytics.data?.total || 0}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Avg {searchAnalytics.data?.avgResultsCount || 0} results
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Listing Views</CardTitle>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{listingAnalytics.data?.total || 0}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Avg price ${listingAnalytics.data?.avgPrice.toLocaleString() || 0}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Page Views Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  {pageAnalytics.data?.timeSeries && pageAnalytics.data.timeSeries.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={pageAnalytics.data.timeSeries}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="date" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "var(--radius)"
                          }}
                        />
                        <Line type="monotone" dataKey="views" stroke="hsl(var(--primary))" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                      No data available for this period
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pages" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Page Views by Route</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportToCSV(pageAnalytics.data?.pageViews || [], "page-views")}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </CardHeader>
                <CardContent>
                  {pageAnalytics.data?.pageViews && pageAnalytics.data.pageViews.length > 0 ? (
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={pageAnalytics.data.pageViews}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="page" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "var(--radius)"
                          }}
                        />
                        <Bar dataKey="views" fill="hsl(var(--primary))" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                      No page view data available
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="searches" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Top Search Queries</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportToCSV(searchAnalytics.data?.topQueries || [], "top-searches")}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </CardHeader>
                <CardContent>
                  {searchAnalytics.data?.topQueries && searchAnalytics.data.topQueries.length > 0 ? (
                    <div className="space-y-4">
                      {searchAnalytics.data.topQueries.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                          <div className="flex-1">
                            <p className="font-medium text-sm">
                              {typeof item.query === "string" ? item.query : JSON.stringify(item.query)}
                            </p>
                          </div>
                          <div className="text-sm font-semibold">{item.count} searches</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 text-center text-muted-foreground">
                      No search data available
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Avg Results Per Search</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold">{searchAnalytics.data?.avgResultsCount || 0}</div>
                    <p className="text-sm text-muted-foreground mt-2">listings per query</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Avg Search Duration</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold">{searchAnalytics.data?.avgDurationMs || 0}ms</div>
                    <p className="text-sm text-muted-foreground mt-2">response time</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="listings" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Top Viewed Listings</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => exportToCSV(listingAnalytics.data?.topListings || [], "top-listings")}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {listingAnalytics.data?.topListings && listingAnalytics.data.topListings.length > 0 ? (
                      <div className="space-y-3">
                        {listingAnalytics.data.topListings.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2 rounded bg-muted/30">
                            <span className="text-sm font-mono truncate">{item.listing_key}</span>
                            <span className="text-sm font-semibold">{item.views} views</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-12 text-center text-muted-foreground">
                        No listing view data
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Top Cities</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => exportToCSV(listingAnalytics.data?.topCities || [], "top-cities")}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {listingAnalytics.data?.topCities && listingAnalytics.data.topCities.length > 0 ? (
                      <div className="space-y-3">
                        {listingAnalytics.data.topCities.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2 rounded bg-muted/30">
                            <span className="text-sm font-medium">{item.city}</span>
                            <span className="text-sm font-semibold">{item.views} views</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-12 text-center text-muted-foreground">
                        No city data
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
