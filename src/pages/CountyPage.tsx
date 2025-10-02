import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useCountyPage } from "@/hooks/useCountyPage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LineChart, BarChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Home, DollarSign, Calendar, Package } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const CountyPage = () => {
  const { countySlug } = useParams<{ countySlug: string }>();
  const { data: pageData, isLoading, error } = useCountyPage(countySlug || '');

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !pageData) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">County Not Found</h1>
            <Button asChild>
              <Link to="/">Return Home</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const { meta, kpis, trends, insights, ai, seo, ctas } = pageData;

  return (
    <>
      {/* SEO */}
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <link rel="canonical" href={seo.canonical} />
        <link rel="preload" as="image" href={meta.heroImage} />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": seo.breadcrumb.map((item, i) => ({
              "@type": "ListItem",
              "position": i + 1,
              "name": item.name,
              "item": `https://www.hodgesfooshee.com${item.url}`
            }))
          })}
        </script>
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": ai.faq.map(f => ({
              "@type": "Question",
              "name": f.q,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": f.a
              }
            }))
          })}
        </script>
      </Helmet>

      <Header />
      
      <div className="min-h-screen bg-background">
        {/* Hero */}
        <div 
          className="relative h-[400px] bg-cover bg-center"
          style={{ backgroundImage: `url(${meta.heroImage})` }}
        >
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative container mx-auto h-full flex flex-col justify-center px-4">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant={meta.mode === 'live' ? 'default' : 'secondary'}>
                {meta.mode === 'live' ? '✓ LIVE DATA' : 'DEMO MODE'}
              </Badge>
              <span className="text-white/70 text-sm">
                Updated {new Date(meta.lastUpdatedISO).toLocaleDateString()}
              </span>
            </div>
            <h1 className="text-5xl font-bold text-white mb-4">
              {meta.name} Market Intelligence
            </h1>
            <p className="text-xl text-white/90 max-w-2xl">
              Live stats, trends, and AI-powered insights for {meta.name}, {meta.state}
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          {/* KPIs Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Median Price
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">${kpis.medianPrice.toLocaleString()}</div>
                <div className={`text-sm flex items-center gap-1 ${kpis.priceChangeYoY >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {kpis.priceChangeYoY >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  {Math.abs(kpis.priceChangeYoY)}% YoY
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Days on Market
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{kpis.daysOnMarket}</div>
                <div className="text-sm text-muted-foreground">days avg</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Active Inventory
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{kpis.inventoryActive.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">{kpis.monthsOfSupply.toFixed(1)} mo supply</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  New Listings (7d)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{kpis.newListings7d}</div>
                <div className="text-sm text-muted-foreground">{kpis.priceCuts7d} price cuts</div>
              </CardContent>
            </Card>
          </div>

          {/* Trends Charts */}
          {trends.newVsSold8w.length > 0 && (
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card>
                <CardHeader>
                  <CardTitle>New vs Sold (8 Weeks)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={trends.newVsSold8w}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="new" stroke="hsl(var(--primary))" name="New Listings" />
                      <Line type="monotone" dataKey="sold" stroke="hsl(var(--accent))" name="Sold" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {trends.inventoryByPriceBand.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Inventory by Price Band</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={trends.inventoryByPriceBand}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="band" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="active" fill="hsl(var(--primary))" name="Active Listings" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* AI Insights */}
          {ai.summary && (
            <Card className="mb-12">
              <CardHeader>
                <CardTitle>Market Intelligence Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg leading-relaxed mb-6">{ai.summary}</p>
                
                <div className="grid md:grid-cols-3 gap-6">
                  {ai.buyerTips.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-3">🏠 Buyer Tips</h3>
                      <ul className="space-y-2">
                        {ai.buyerTips.map((tip, i) => (
                          <li key={i} className="text-sm">• {tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {ai.sellerPlaybook.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-3">💼 Seller Playbook</h3>
                      <ul className="space-y-2">
                        {ai.sellerPlaybook.map((tip, i) => (
                          <li key={i} className="text-sm">• {tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {ai.agentTakeaways.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-3">📊 Agent Takeaways</h3>
                      <ul className="space-y-2">
                        {ai.agentTakeaways.map((tip, i) => (
                          <li key={i} className="text-sm">• {tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* FAQ */}
          {ai.faq.length > 0 && (
            <Card className="mb-12">
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {ai.faq.map((item, i) => (
                  <div key={i} className="border-b pb-4 last:border-0">
                    <h4 className="font-semibold mb-2">{item.q}</h4>
                    <p className="text-sm text-muted-foreground">{item.a}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 justify-center mb-8">
            <Button size="lg" asChild>
              <Link to={ctas.viewListingsUrl}>View All {meta.name} Listings</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to={ctas.scheduleConsultUrl}>Schedule Consultation</Link>
            </Button>
          </div>

          {/* Citations */}
          {ai.citations.length > 0 && (
            <div className="mt-12 text-sm text-muted-foreground">
              <h4 className="font-semibold mb-2">Sources:</h4>
              <ul className="space-y-1">
                {ai.citations.map((cite, i) => (
                  <li key={i}>
                    <a href={cite.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {cite.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default CountyPage;
