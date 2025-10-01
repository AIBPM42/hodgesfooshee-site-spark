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
    <>
      <Header />
      <main className="bg-background min-h-screen py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-2">Manage your website content, analytics, and AI features</p>
          </div>

          <Tabs defaultValue="homepage" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="homepage" className="flex items-center gap-2">
                <LayoutDashboard className="h-4 w-4" />
                Homepage
              </TabsTrigger>
              <TabsTrigger value="content" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Content
              </TabsTrigger>
              <TabsTrigger value="ai" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                AI Properties
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="homepage">
              <HomepageControl />
            </TabsContent>

            <TabsContent value="content">
              <ContentInsights />
            </TabsContent>

            <TabsContent value="ai">
              <AIHotProperties />
            </TabsContent>

            <TabsContent value="analytics">
              <AnalyticsDashboard />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </>
  );
}
