import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
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
import MLSSyncDashboard from "./pages/admin/MLSSyncDashboard";
import RealtynaConnection from "./pages/admin/RealtynaConnection";
import DashboardHome from "./pages/admin/DashboardHome";
import AdminContent from "./pages/admin/AdminContent";
import AnalyticsPage from "./pages/admin/AnalyticsPage";
import AdminDashboard from "./pages/admin/Dashboard";
import Analytics from "./pages/admin/Analytics";
import Content from "./pages/admin/Content";
import CountyManagement from "./pages/admin/CountyManagement";
import Services from "./pages/Services";
import Login from "./pages/Login";
import CountyPage from "./pages/CountyPage";

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
      <AuthProvider>
        <TooltipProvider>
          <div className="dashboard-root min-h-screen" style={{ background: '#3A3A3A' }}>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/services" element={<Services />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin/*" element={<ProtectedRoute allowedRoles={['admin','broker','agent']}><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
              <Route path="/admin/mls-sync" element={<ProtectedRoute allowedRoles={['admin']}><MLSSync /></ProtectedRoute>} />
              <Route path="/admin/content" element={<ProtectedRoute allowedRoles={['admin']}><Content /></ProtectedRoute>} />
              <Route path="/admin/counties" element={<ProtectedRoute allowedRoles={['admin']}><CountyManagement /></ProtectedRoute>} />
              <Route path="/admin/connections/realtyna" element={<ProtectedRoute allowedRoles={['admin']}><RealtynaConnection /></ProtectedRoute>} />
              <Route path="/admin/content-legacy" element={<AdminContent />} />
              <Route path="/admin/analytics-legacy" element={<AnalyticsPage />} />
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<Overview />} />
                <Route path="mls" element={<MLSModule />} />
                <Route path="ai" element={<AIModule />} />
                <Route path="analytics" element={<AnalyticsModule />} />
                <Route path="social" element={<SocialModule />} />
              </Route>
              <Route path="/mls" element={<MLS />} />
              <Route path="/admin-sync" element={<AdminSync />} />
              <Route path="/admin/mls-sync-dashboard" element={<MLSSyncDashboard />} />
              <Route path="/admin/broker" element={<BrokerDashboard />} />
              <Route path="/realtyna-test" element={<RealtynaSelftest />} />
              <Route path="/search/properties" element={<PropertySearchResults />} />
              <Route path="/search/open-houses" element={<OpenHouseResults />} />
              <Route path="/search/zip" element={<ZipSearchResults />} />
              <Route path="/search/agents" element={<AgentResults />} />
              <Route path="/search/offices" element={<OfficeResults />} />
              <Route path="/property/:id" element={<PropertyDetail />} />
              <Route path="/market/:countySlug" element={<CountyPage />} />
              <Route path="/counties/davidson-tn" element={<CountyPage demo={true} />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          </div>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;