export interface CountyPageData {
  meta: {
    slug: string;
    name: string;
    state: string;
    heroImage: string;
    lastUpdatedISO: string;
    mode: "demo" | "live";
  };
  kpis: {
    medianPrice: number;
    priceChangeYoY: number;
    daysOnMarket: number;
    newListings7d: number;
    priceCuts7d: number;
    inventoryActive: number;
    monthsOfSupply: number;
    avgPpsf: number;
  };
  trends: {
    newVsSold8w: { week: string; new: number; sold: number }[];
    dom30d: { date: string; days: number }[];
    pricePerSqftByCity: { city: string; ppsf: number }[];
    inventoryByPriceBand: { band: string; active: number }[];
  };
  insights: {
    hotCitiesWow: { city: string; pct: number }[];
    biggestPriceCuts: { address: string; city: string; amount: number }[];
    affordabilityIndex: { value: number; trend: "up"|"down"|"flat"; note: string };
    rentVsBuy: { rentIdx: number; buyIdx: number; note: string };
    migrationFlow: { inboundTop: string[]; outboundTop: string[] };
  };
  ai: {
    summary: string;
    buyerTips: string[];
    sellerPlaybook: string[];
    agentTakeaways: string[];
    faq: { q: string; a: string }[];
    citations: { title: string; url: string }[];
    disclaimers: string[];
  };
  seo: {
    title: string;
    description: string;
    canonical: string;
    speakable: string[];
    breadcrumb: { name: string; url: string }[];
  };
  ctas: {
    viewListingsUrl: string;
    scheduleConsultUrl: string;
    downloadReportUrl: string;
  };
}
