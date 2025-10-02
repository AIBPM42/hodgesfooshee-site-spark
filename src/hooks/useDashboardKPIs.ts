import { useQuery } from "@tanstack/react-query";

interface KPIData {
  activeListings: number;
  avgPrice30d: number;
  openHouses14d: number;
  newThisWeek: number;
}

export const useDashboardKPIs = () => {
  return useQuery({
    queryKey: ['dashboard-kpis'],
    queryFn: async (): Promise<KPIData> => {
      const now = new Date();
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const fourteenDaysLater = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

      // Fetch all KPIs in parallel
      const [activeRes, newRes, openRes] = await Promise.all([
        // Active listings count
        fetch(
          `https://xhqwmtzawqfffepcqxwf.supabase.co/functions/v1/mls-search?status=Active&limit=1`,
          {
            headers: {
              'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhocXdtdHphd3FmZmZlcGNxeHdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2MDQwODEsImV4cCI6MjA3MDE4MDA4MX0.gihIkhLS_pwr9Mz6uG6vm7BXPzfa2TcpvIrRECRfxfg'
            }
          }
        ),
        // New this week
        fetch(
          `https://xhqwmtzawqfffepcqxwf.supabase.co/functions/v1/mls-search?status=Active&modifiedSince=${sevenDaysAgo.toISOString()}&limit=1`,
          {
            headers: {
              'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhocXdtdHphd3FmZmZlcGNxeHdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2MDQwODEsImV4cCI6MjA3MDE4MDA4MX0.gihIkhLS_pwr9Mz6uG6vm7BXPzfa2TcpvIrRECRfxfg'
            }
          }
        ),
        // Open houses next 14d
        fetch(
          `https://xhqwmtzawqfffepcqxwf.supabase.co/functions/v1/mls-openhouses?start=${now.toISOString().split('T')[0]}&end=${fourteenDaysLater.toISOString().split('T')[0]}&limit=1`,
          {
            headers: {
              'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhocXdtdHphd3FmZmZlcGNxeHdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2MDQwODEsImV4cCI6MjA3MDE4MDA4MX0.gihIkhLS_pwr9Mz6uG6vm7BXPzfa2TcpvIrRECRfxfg'
            }
          }
        )
      ]);

      const [activeData, newData, openData] = await Promise.all([
        activeRes.json(),
        newRes.json(),
        openRes.json()
      ]);

      // Fetch 30d avg price
      const priceRes = await fetch(
        `https://xhqwmtzawqfffepcqxwf.supabase.co/functions/v1/mls-search?status=Active&modifiedSince=${thirtyDaysAgo.toISOString()}&limit=200`,
        {
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhocXdtdHphd3FmZmZlcGNxeHdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2MDQwODEsImV4cCI6MjA3MDE4MDA4MX0.gihIkhLS_pwr9Mz6uG6vm7BXPzfa2TcpvIrRECRfxfg'
          }
        }
      );
      const priceData = await priceRes.json();
      const prices = priceData.properties?.map((p: any) => p.ListPrice).filter(Boolean) || [];
      const avgPrice = prices.length > 0 
        ? Math.round(prices.reduce((a: number, b: number) => a + b, 0) / prices.length)
        : 0;

      return {
        activeListings: activeData.total || 0,
        avgPrice30d: avgPrice,
        openHouses14d: openData.total || 0,
        newThisWeek: newData.total || 0
      };
    },
    staleTime: 5 * 60 * 1000, // 5 min
    refetchInterval: 5 * 60 * 1000
  });
};
