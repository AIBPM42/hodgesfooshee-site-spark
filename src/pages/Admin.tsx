import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutDashboard, FileText, Sparkles, BarChart3 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HomepageControl from "@/components/admin/HomepageControl";
import ContentInsights from "@/components/admin/ContentInsights";
import AIHotProperties from "@/components/admin/AIHotProperties";
import AnalyticsDashboard from "@/components/admin/AnalyticsDashboard";

export default function Admin() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header />
      <main className="pt-24 pb-12">
        <div className="mx-auto max-w-7xl px-4">
          {/* Premium Header */}
          <div className="mb-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Admin Dashboard</span>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Control Center
            </h1>
            <p className="text-muted-foreground mt-3 text-lg">
              Manage your website content, analytics, and AI-powered features
            </p>
          </div>

          {/* Glass Tabs Container */}
          <div className="backdrop-blur-xl bg-card/50 border border-border/50 rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
            <Tabs defaultValue="homepage" className="w-full">
              <TabsList className="w-full grid grid-cols-4 gap-1 p-2 bg-muted/50 border-b border-border/50">
                <TabsTrigger 
                  value="homepage" 
                  className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-lg transition-all"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span className="hidden sm:inline">Homepage</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="content" 
                  className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-lg transition-all"
                >
                  <FileText className="h-4 w-4" />
                  <span className="hidden sm:inline">Content</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="ai" 
                  className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-lg transition-all"
                >
                  <Sparkles className="h-4 w-4" />
                  <span className="hidden sm:inline">AI Properties</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="analytics" 
                  className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-lg transition-all"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden sm:inline">Analytics</span>
                </TabsTrigger>
              </TabsList>

              <div className="p-6">
                <TabsContent value="homepage" className="mt-0 animate-fade-in">
                  <HomepageControl />
                </TabsContent>

                <TabsContent value="content" className="mt-0 animate-fade-in">
                  <ContentInsights />
                </TabsContent>

                <TabsContent value="ai" className="mt-0 animate-fade-in">
                  <AIHotProperties />
                </TabsContent>

                <TabsContent value="analytics" className="mt-0 animate-fade-in">
                  <AnalyticsDashboard />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
