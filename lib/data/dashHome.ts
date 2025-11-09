import * as mock from "@/lib/mock/dashHomeData";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

/**
 * Single source of truth for dashboard home data
 * Switch between mock data and real API calls via environment variable
 *
 * When USE_MOCK=false, this will fetch from /api/dashHome
 * which aggregates data from:
 * - n8n webhooks (MLS data, market trends)
 * - OpenAI/Claude (market summaries)
 * - Manus AI (competitive intelligence)
 * - Supabase (agent data, pipeline metrics)
 */
export async function getDashHomeData() {
  if (USE_MOCK) {
    // Return mock data for development/demo
    return mock;
  }

  // Production: fetch from API route with authentication
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const apiKey = process.env.NEXT_PUBLIC_AGENT_KEY || "";

  try {
    const res = await fetch(`${baseUrl}/api/dashHome`, {
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json",
      },
      cache: "no-store", // Always fresh data
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      console.error(`dashHome API error: ${res.status} ${res.statusText}`);
      throw new Error(`dashHome fetch failed: ${res.statusText}`);
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    // Fallback to mock data if API fails
    console.warn("Falling back to mock data");
    return mock;
  }
}

/**
 * Type-safe exports matching mock data structure
 * Components import from here instead of directly from mock
 */
export type DashHomeData = typeof mock;
export type KpiData = typeof mock.kpis;
export type AbsorptionHeatData = typeof mock.absorptionHeat;
export type DealFunnelData = typeof mock.dealFunnel;
export type CommissionWaterfallData = typeof mock.commissionWaterfall;
export type LeadsClusterData = typeof mock.leadsCluster;
export type PriorityMatrixData = typeof mock.priorityMatrix;
export type PricePositioningData = typeof mock.pricePositioning;
export type DomPredictionData = typeof mock.domPrediction;
export type CompetitiveRadarData = typeof mock.competitiveRadar;
export type ShowingConversionData = typeof mock.showingConversion;
export type MicroMarketData = typeof mock.microMarket;
export type SourceRoiData = typeof mock.sourceRoi;
