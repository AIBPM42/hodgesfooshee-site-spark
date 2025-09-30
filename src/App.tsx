import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import PropertySearchResults from "./pages/PropertySearchResults";
import OpenHouseResults from "./pages/OpenHouseResults";
import ZipSearchResults from "./pages/ZipSearchResults";
import AgentResults from "./pages/AgentResults";
import OfficeResults from "./pages/OfficeResults";
import PropertyDetail from "./pages/PropertyDetail";
import NotFound from "./pages/NotFound";
import MLS from "./pages/MLS";
import DashboardLayout from "./components/DashboardLayout";
import Overview from "./pages/dashboard/Overview";
import MLSModule from "./pages/dashboard/MLSModule";
import AIModule from "./pages/dashboard/AIModule";
import AnalyticsModule from "./pages/dashboard/AnalyticsModule";
import SocialModule from "./pages/dashboard/SocialModule";
import RealtynaSelftest from "./pages/RealtynaSelftest";
import AdminSync from "./pages/AdminSync";
import MLSSync from "./pages/admin/MLSSync";
import BrokerDashboard from "./pages/admin/BrokerDashboard";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: 30000, // Auto-refresh every 30 seconds
      staleTime: 30000,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <TooltipProvider>
        <div className="dashboard-root min-h-screen" style={{ background: '#3A3A3A' }}>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/admin" element={<DashboardLayout />}>
              <Route index element={<Overview />} />
              <Route path="mls" element={<MLSModule />} />
              <Route path="ai" element={<AIModule />} />
              <Route path="analytics" element={<AnalyticsModule />} />
              <Route path="social" element={<SocialModule />} />
            </Route>
            <Route path="/mls" element={<MLS />} />
            <Route path="/admin-sync" element={<AdminSync />} />
            <Route path="/admin/mls-sync" element={<MLSSync />} />
            <Route path="/admin/broker" element={<BrokerDashboard />} />
            <Route path="/realtyna-test" element={<RealtynaSelftest />} />
            <Route path="/search/properties" element={<PropertySearchResults />} />
            <Route path="/search/open-houses" element={<OpenHouseResults />} />
            <Route path="/search/zip" element={<ZipSearchResults />} />
            <Route path="/search/agents" element={<AgentResults />} />
            <Route path="/search/offices" element={<OfficeResults />} />
            <Route path="/property/:id" element={<PropertyDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        </div>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;