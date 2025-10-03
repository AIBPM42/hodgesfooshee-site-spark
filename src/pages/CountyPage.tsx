import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useCountyPage } from "@/hooks/useCountyPage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LineChart, BarChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Home, DollarSign, Calendar, Package, ChevronDown, Copy, Check } from "lucide-react";
import { useState } from "react";
import { Tooltip as RadixTooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface CountyPageProps {
  demo?: boolean;
}

const CountyPage = ({ demo = false }: CountyPageProps) => {
  const { countySlug } = useParams<{ countySlug: string }>();
  const { data: pageData, isLoading, error } = useCountyPage(demo ? 'davidson-tn' : (countySlug || ''), demo);

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

  // Demo mode with static JSON data
  if (demo && pageData.staticData) {
    const { hero, stats, sections, faqs, sources } = pageData.staticData;
    const [sourcesOpen, setSourcesOpen] = useState(false);
    const [copiedSources, setCopiedSources] = useState(false);
    
    const copyAllSources = () => {
      const allUrls = sources.map((s: any) => `${s.title}: ${s.url}`).join('\n');
      navigator.clipboard.writeText(allUrls);
      setCopiedSources(true);
      toast({ title: "Sources copied to clipboard" });
      setTimeout(() => setCopiedSources(false), 2000);
    };

    // Generate table of contents from sections
    const toc = sections.map((s: any, i: number) => ({
      id: s.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      title: s.title
    }));
    
    return (
      <>
        <Helmet>
          <title>Davidson County, TN — Market Intelligence, Schools, Housing, Jobs</title>
          <meta name="description" content="Cited facts for Davidson County, TN: population, housing, schools, economy, parks and events. Link to live listings." />
          <link rel="canonical" href="https://www.hodgesfooshee.com/counties/davidson-tn" />
          <link rel="preload" as="image" href="/images/nashville-skyline.webp" />
          
          {/* WebPage + Place + Breadcrumb JSON-LD */}
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": "Davidson County, TN — Market Intelligence",
              "url": "https://www.hodgesfooshee.com/counties/davidson-tn",
              "breadcrumb": {
                "@type": "BreadcrumbList",
                "itemListElement": [
                  { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.hodgesfooshee.com/" },
                  { "@type": "ListItem", "position": 2, "name": "Counties", "item": "https://www.hodgesfooshee.com/counties" },
                  { "@type": "ListItem", "position": 3, "name": "Davidson County, TN" }
                ]
              },
              "about": {
                "@type": "Place",
                "name": "Davidson County, Tennessee",
                "address": { "@type": "PostalAddress", "addressRegion": "TN", "addressCountry": "US" }
              }
            })}
          </script>
          
          {/* FAQPage JSON-LD */}
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": faqs.slice(0, 10).map((faq: any) => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": { "@type": "Answer", "text": faq.answer }
              }))
            })}
          </script>
        </Helmet>
        <Header />
        <div className="min-h-screen bg-background">
          {/* Optimized Hero */}
          <header className="relative overflow-hidden">
            <img
              src="/images/nashville-skyline.webp"
              width={1920}
              height={1080}
              alt="Nashville skyline and Cumberland River at sunset"
              className="w-full h-[42vh] object-cover"
              loading="eager"
              fetchPriority="high"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20" />
            <div className="absolute inset-x-0 bottom-6 max-w-6xl mx-auto px-6">
              <Badge variant="ai" className="w-fit mb-3">DEMO - AI Generated</Badge>
              <h1 className="text-4xl md:text-5xl font-extrabold drop-shadow-lg text-white mb-2">
                Davidson County Market Intelligence
              </h1>
              <p className="mt-2 text-white/85 max-w-3xl leading-relaxed">
                {hero.synopsis}
              </p>
            </div>
          </header>

          <div className="container mx-auto px-4 lg:px-6 py-12">
            <div className="flex gap-12">
              {/* Sticky TOC - Desktop Only */}
              <nav className="hidden lg:block sticky top-24 w-56 shrink-0 self-start">
                <h3 className="text-sm font-semibold mb-3 text-foreground/80">On This Page</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="#stats" className="text-muted-foreground hover:text-primary transition-colors">Key Stats</a></li>
                  {toc.map((item) => (
                    <li key={item.id}>
                      <a href={`#${item.id}`} className="text-muted-foreground hover:text-primary transition-colors">
                        {item.title}
                      </a>
                    </li>
                  ))}
                  <li><a href="#faqs" className="text-muted-foreground hover:text-primary transition-colors">FAQs</a></li>
                  <li><a href="#sources" className="text-muted-foreground hover:text-primary transition-colors">Sources</a></li>
                </ul>
              </nav>

              {/* Main Content */}
              <div className="flex-1 max-w-5xl">
                {/* Stats with Sparklines */}
                <section id="stats" className="mb-12">
                  <h2 className="text-2xl font-bold tracking-tight mb-6">Key Statistics</h2>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {stats.map((stat: any, i: number) => {
                      // Add sparkline to first 3 stats
                      const hasSparkline = i < 3;
                      const sparklinePoints = hasSparkline 
                        ? Array.from({ length: 12 }, (_, idx) => {
                            const variation = Math.random() * 15 - 5;
                            return `${idx * 10},${30 - variation}`;
                          }).join(' ')
                        : '';

                      return (
                        <TooltipProvider key={i}>
                          <RadixTooltip>
                            <TooltipTrigger asChild>
                              <Card className="relative cursor-help">
                                <CardContent className="pt-6">
                                  <h3 className="text-sm font-medium mb-2 text-muted-foreground">{stat.label}</h3>
                                  <div className="flex items-end justify-between gap-2">
                                    <div className="flex-1">
                                      <p className="text-2xl font-bold">{stat.value}</p>
                                      <p className="text-xs text-muted-foreground mt-1">{stat.caption}</p>
                                    </div>
                                    {hasSparkline && (
                                      <svg viewBox="0 0 120 40" className="w-20 h-10 opacity-50" aria-label={`${stat.label} trend`}>
                                        <polyline 
                                          fill="none" 
                                          stroke="currentColor" 
                                          strokeWidth="2"
                                          points={sparklinePoints}
                                        />
                                      </svg>
                                    )}
                                  </div>
                                  <span className="absolute top-3 right-3 text-xs opacity-50">[{i + 1}]</span>
                                </CardContent>
                              </Card>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="max-w-xs">
                              <p className="text-xs">{stat.citation}</p>
                            </TooltipContent>
                          </RadixTooltip>
                        </TooltipProvider>
                      );
                    })}
                  </div>
                </section>

                {/* Sections with Bullets */}
                <div className="grid md:grid-cols-2 gap-8 mb-12">
                  {sections.map((sec: any, i: number) => {
                    const sectionId = sec.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                    return (
                      <Card key={i} id={sectionId} className="scroll-mt-24">
                        <CardHeader>
                          <CardTitle>{sec.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm leading-relaxed">{sec.content}</p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Native <details> FAQs */}
                <section id="faqs" aria-labelledby="faq-heading" className="mb-12 scroll-mt-24">
                  <h2 id="faq-heading" className="text-2xl font-bold tracking-tight mb-6">Frequently Asked Questions</h2>
                  <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
                    {faqs.map((faq: any, i: number) => (
                      <details key={i} className="group border-b border-white/10 last:border-0" open={i === 0}>
                        <summary className="flex items-center justify-between cursor-pointer text-lg font-semibold p-6 hover:bg-white/5 transition-colors">
                          <span>{faq.question}</span>
                          <ChevronDown className="w-5 h-5 transition-transform group-open:rotate-180 shrink-0 ml-4" />
                        </summary>
                        <div className="px-6 pb-6 pt-0">
                          <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
                        </div>
                      </details>
                    ))}
                  </div>
                </section>

                {/* CTAs */}
                <div className="flex flex-wrap gap-4 justify-center mb-12">
                  <Button size="lg" asChild>
                    <Link to="/search/properties?county=Davidson">View Live Listings</Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link to="/services">Schedule Consultation</Link>
                  </Button>
                </div>

                {/* Collapsible Sources Drawer */}
                <section id="sources" className="scroll-mt-24">
                  <div className="flex items-center gap-4 mb-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setSourcesOpen(!sourcesOpen)}
                      className="gap-2"
                    >
                      {sourcesOpen ? 'Hide' : 'Show'} Sources ({sources.length})
                      <ChevronDown className={`w-4 h-4 transition-transform ${sourcesOpen ? 'rotate-180' : ''}`} />
                    </Button>
                    {sourcesOpen && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={copyAllSources}
                        className="gap-2"
                      >
                        {copiedSources ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        Copy All
                      </Button>
                    )}
                  </div>
                  
                  {sourcesOpen && (
                    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 animate-in fade-in slide-in-from-top-2 duration-300">
                      <ul className="grid sm:grid-cols-2 gap-3 text-sm">
                        {sources.map((src: any, i: number) => (
                          <li key={i} className="flex items-center gap-2">
                            <span className="inline-flex w-7 h-7 items-center justify-center rounded-full bg-white/10 text-xs shrink-0">
                              [{i + 1}]
                            </span>
                            <a 
                              href={src.url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="hover:underline hover:text-primary transition-colors truncate"
                              title={src.title}
                            >
                              {src.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </section>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      {/* SEO */}
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <link rel="canonical" href={seo.canonical} />
        <link rel="preload" as="image" href={meta.heroImage} />
        
        {/* WebPage + Place + Breadcrumb JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": `${meta.name} — Market Intelligence`,
            "url": seo.canonical,
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": seo.breadcrumb.map((item, i) => ({
                "@type": "ListItem",
                "position": i + 1,
                "name": item.name,
                "item": `https://www.hodgesfooshee.com${item.url}`
              }))
            },
            "about": {
              "@type": "Place",
              "name": `${meta.name}, ${meta.state}`,
              "address": { "@type": "PostalAddress", "addressRegion": meta.state, "addressCountry": "US" }
            }
          })}
        </script>
        
        {/* FAQPage JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": ai.faq.slice(0, 10).map(f => ({
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

          {/* Native <details> FAQs */}
          {ai.faq.length > 0 && (
            <section aria-labelledby="faq-heading-live" className="mb-12">
              <h2 id="faq-heading-live" className="text-2xl font-bold tracking-tight mb-6 px-6">Frequently Asked Questions</h2>
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
                {ai.faq.map((item, i) => (
                  <details key={i} className="group border-b border-white/10 last:border-0" open={i === 0}>
                    <summary className="flex items-center justify-between cursor-pointer text-lg font-semibold p-6 hover:bg-white/5 transition-colors">
                      <span>{item.q}</span>
                      <ChevronDown className="w-5 h-5 transition-transform group-open:rotate-180 shrink-0 ml-4" />
                    </summary>
                    <div className="px-6 pb-6 pt-0">
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
                    </div>
                  </details>
                ))}
              </div>
            </section>
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
