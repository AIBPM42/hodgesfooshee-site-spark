import { supabase } from "@/integrations/supabase/client";
import {
  demoKpis,
  demoNewVsSoldWeekly,
  demoDaysOnMarketTrend,
  demoPricePerSqftByCity,
  demoInventoryByCity,
  demoTopGainers,
  demoTopPriceCuts,
  demoAgentLeaderboard,
  type KPIs,
  type WeeklySeries,
  type DOMTrend,
  type CityMetric,
  type TopGainer,
  type PriceCut,
  type AgentLeader,
} from "../demoData";

export interface HealthResult {
  services: {
    properties: { ok: boolean; status: number; t: number; error?: string };
    openHouses: { ok: boolean; status: number; t: number; error?: string };
    members: { ok: boolean; status: number; t: number; error?: string };
    offices: { ok: boolean; status: number; t: number; error?: string };
  };
  timestamp: string;
}

export type DataMode = 'demo' | 'live';

export async function loadHealth(): Promise<HealthResult> {
  try {
    const { data, error } = await supabase.functions.invoke('mls-health');
    if (error) throw error;
    return data as HealthResult;
  } catch (error) {
    console.error('Health check failed:', error);
    return {
      services: {
        properties: { ok: false, status: 0, t: 0, error: 'Unavailable' },
        openHouses: { ok: false, status: 0, t: 0, error: 'Unavailable' },
        members: { ok: false, status: 0, t: 0, error: 'Unavailable' },
        offices: { ok: false, status: 0, t: 0, error: 'Unavailable' },
      },
      timestamp: new Date().toISOString(),
    };
  }
}

export function getDataMode(health: HealthResult): DataMode {
  const allOk = Object.values(health.services).every((s) => s.ok);
  return allOk ? 'live' : 'demo';
}

export async function loadKpis(mode: DataMode): Promise<KPIs> {
  if (mode === 'demo') return demoKpis;

  try {
    // Active listings
    const { count: activeCount } = await supabase
      .from('mls_listings')
      .select('*', { count: 'exact', head: true })
      .eq('standard_status', 'Active');

    // New listings (7d)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const { count: newCount } = await supabase
      .from('mls_listings')
      .select('*', { count: 'exact', head: true })
      .gte('modification_timestamp', sevenDaysAgo.toISOString());

    // Open houses (next 7d)
    const today = new Date().toISOString().split('T')[0];
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);
    const future = futureDate.toISOString().split('T')[0];
    const { count: openHousesCount } = await supabase
      .from('mls_open_houses')
      .select('*', { count: 'exact', head: true })
      .gte('open_house_date', today)
      .lte('open_house_date', future);

    // Price cuts (7d) - listings with price reduction
    const { count: priceCutsCount } = await supabase
      .from('mls_listings')
      .select('*', { count: 'exact', head: true })
      .gt('price_reduction_count', 0)
      .gte('modification_timestamp', sevenDaysAgo.toISOString());

    return {
      activeListings: activeCount || 0,
      new7d: newCount || 0,
      openHouses7d: openHousesCount || 0,
      priceCuts7d: priceCutsCount || 0,
      backOnMarket7d: 0, // Complex query - use demo for now
    };
  } catch (error) {
    console.error('Failed to load live KPIs:', error);
    return demoKpis;
  }
}

export async function loadNewVsSoldWeekly(mode: DataMode): Promise<WeeklySeries[]> {
  if (mode === 'demo') return demoNewVsSoldWeekly;
  // Live implementation would query mls_listings grouped by week
  return demoNewVsSoldWeekly;
}

export async function loadDaysOnMarketTrend(mode: DataMode): Promise<DOMTrend[]> {
  if (mode === 'demo') return demoDaysOnMarketTrend;
  // Live implementation would calculate median DOM by day
  return demoDaysOnMarketTrend;
}

export async function loadPricePerSqftByCity(mode: DataMode): Promise<CityMetric[]> {
  if (mode === 'demo') return demoPricePerSqftByCity;
  
  try {
    const { data, error } = await supabase
      .from('mls_listings')
      .select('city, list_price, living_area')
      .eq('standard_status', 'Active')
      .gt('living_area', 0)
      .limit(5000);

    if (error || !data) return demoPricePerSqftByCity;

    const cityMap = new Map<string, { total: number; count: number }>();
    data.forEach((listing) => {
      if (!listing.city || !listing.list_price || !listing.living_area) return;
      const ppsf = listing.list_price / listing.living_area;
      const existing = cityMap.get(listing.city) || { total: 0, count: 0 };
      cityMap.set(listing.city, {
        total: existing.total + ppsf,
        count: existing.count + 1,
      });
    });

    const result = Array.from(cityMap.entries())
      .map(([city, { total, count }]) => ({
        city,
        value: Math.round(total / count),
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);

    return result.length > 0 ? result : demoPricePerSqftByCity;
  } catch (error) {
    console.error('Failed to load price per sqft:', error);
    return demoPricePerSqftByCity;
  }
}

export async function loadInventoryByCity(mode: DataMode): Promise<CityMetric[]> {
  if (mode === 'demo') return demoInventoryByCity;

  try {
    const { data, error } = await supabase
      .from('mls_listings')
      .select('city')
      .eq('standard_status', 'Active');

    if (error || !data) return demoInventoryByCity;

    const cityCount = new Map<string, number>();
    data.forEach((listing) => {
      if (!listing.city) return;
      cityCount.set(listing.city, (cityCount.get(listing.city) || 0) + 1);
    });

    const result = Array.from(cityCount.entries())
      .map(([city, value]) => ({ city, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);

    return result.length > 0 ? result : demoInventoryByCity;
  } catch (error) {
    console.error('Failed to load inventory by city:', error);
    return demoInventoryByCity;
  }
}

export async function loadTopGainers(mode: DataMode): Promise<TopGainer[]> {
  if (mode === 'demo') return demoTopGainers;
  return demoTopGainers;
}

export async function loadTopPriceCuts(mode: DataMode): Promise<PriceCut[]> {
  if (mode === 'demo') return demoTopPriceCuts;
  return demoTopPriceCuts;
}

export async function loadAgentLeaderboard(mode: DataMode): Promise<AgentLeader[]> {
  if (mode === 'demo') return demoAgentLeaderboard;
  return demoAgentLeaderboard;
}
