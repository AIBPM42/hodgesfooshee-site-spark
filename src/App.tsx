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
import Admin from "./pages/Admin";
import RealtynaSelftest from "./pages/RealtynaSelftest";

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
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/mls" element={<MLS />} />
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
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;