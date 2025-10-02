import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { CountyPageData } from "@/types/CountyPage";

export const useCountyPage = (slug: string, demo: boolean = false) => {
  return useQuery({
    queryKey: ['county-page', slug, demo],
    queryFn: async (): Promise<CountyPageData & { htmlContent?: any }> => {
      if (demo) {
        // Call the demo HTML generation function
        const { data, error } = await supabase.functions.invoke('generate-county-html', {
          body: { countySlug: slug }
        });

        if (error) throw error;
        if (!data?.html) throw new Error('No HTML data returned');

        // Return demo data structure
        return {
          meta: {
            slug: 'davidson-tn',
            name: 'Davidson County',
            state: 'TN',
            heroImage: '/images/davidson-parthenon.webp',
            lastUpdatedISO: new Date().toISOString(),
            mode: 'demo'
          },
          kpis: {
            medianPrice: 0,
            priceChangeYoY: 0,
            daysOnMarket: 0,
            newListings7d: 0,
            priceCuts7d: 0,
            inventoryActive: 0,
            monthsOfSupply: 0,
            avgPpsf: 0
          },
          trends: {
            newVsSold8w: [],
            dom30d: [],
            pricePerSqftByCity: [],
            inventoryByPriceBand: []
          },
          insights: {
            hotCitiesWow: [],
            biggestPriceCuts: [],
            affordabilityIndex: { value: 0, trend: 'flat', note: '' },
            rentVsBuy: { rentIdx: 0, buyIdx: 0, note: '' },
            migrationFlow: { inboundTop: [], outboundTop: [] }
          },
          ai: {
            summary: '',
            buyerTips: [],
            sellerPlaybook: [],
            agentTakeaways: [],
            faq: [],
            citations: [],
            disclaimers: []
          },
          seo: {
            title: 'Davidson County, TN — Market Intelligence',
            description: 'Real estate intelligence for Davidson County, Tennessee',
            canonical: 'https://www.hodgesfooshee.com/counties/davidson-tn',
            speakable: [],
            breadcrumb: []
          },
          ctas: {
            viewListingsUrl: '/search/properties?county=Davidson',
            scheduleConsultUrl: '/services',
            downloadReportUrl: ''
          },
          htmlContent: data.html
        };
      }

      const { data, error } = await supabase.functions.invoke('get_county_page_data', {
        body: { slug }
      });

      if (error) throw error;
      if (!data?.data) throw new Error('No data returned');

      return data.data;
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    enabled: !!slug,
  });
};
