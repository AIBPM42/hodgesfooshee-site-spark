// Demo data for Middle Tennessee real estate market

export interface KPIs {
  activeListings: number;
  new7d: number;
  openHouses7d: number;
  priceCuts7d: number;
  backOnMarket7d: number;
}

export interface WeeklySeries {
  week: string;
  new: number;
  sold: number;
}

export interface DOMTrend {
  date: string;
  dom: number;
}

export interface CityMetric {
  city: string;
  value: number;
}

export interface TopGainer {
  city: string;
  wow: number;
}

export interface PriceCut {
  address: string;
  cut: number;
  city: string;
}

export interface AgentLeader {
  agent: string;
  newListings: number;
  pendings: number;
}

export const demoKpis: KPIs = {
  activeListings: 9054,
  new7d: 342,
  openHouses7d: 87,
  priceCuts7d: 156,
  backOnMarket7d: 43,
};

export const demoNewVsSoldWeekly: WeeklySeries[] = [
  { week: '2025-W34', new: 298, sold: 245 },
  { week: '2025-W35', new: 312, sold: 267 },
  { week: '2025-W36', new: 285, sold: 256 },
  { week: '2025-W37', new: 321, sold: 278 },
  { week: '2025-W38', new: 308, sold: 289 },
  { week: '2025-W39', new: 295, sold: 271 },
  { week: '2025-W40', new: 334, sold: 298 },
  { week: '2025-W41', new: 342, sold: 312 },
];

export const demoDaysOnMarketTrend: DOMTrend[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));
  const baseDOM = 45 + Math.sin(i / 5) * 8 + Math.random() * 6;
  return {
    date: date.toISOString().split('T')[0],
    dom: Math.round(baseDOM),
  };
});

export const demoPricePerSqftByCity: CityMetric[] = [
  { city: 'Nashville', value: 285 },
  { city: 'Franklin', value: 312 },
  { city: 'Brentwood', value: 298 },
  { city: 'Murfreesboro', value: 198 },
  { city: 'Hendersonville', value: 215 },
  { city: 'Mt Juliet', value: 232 },
  { city: 'Spring Hill', value: 245 },
  { city: 'Gallatin', value: 189 },
  { city: 'Lebanon', value: 176 },
  { city: 'Columbia', value: 168 },
];

export const demoInventoryByCity: CityMetric[] = [
  { city: 'Nashville', value: 2543 },
  { city: 'Murfreesboro', value: 1289 },
  { city: 'Franklin', value: 987 },
  { city: 'Brentwood', value: 654 },
  { city: 'Hendersonville', value: 543 },
  { city: 'Mt Juliet', value: 498 },
  { city: 'Spring Hill', value: 467 },
  { city: 'Gallatin', value: 423 },
  { city: 'Lebanon', value: 389 },
  { city: 'Columbia', value: 261 },
];

export const demoTopGainers: TopGainer[] = [
  { city: 'Mt Juliet', wow: 12.4 },
  { city: 'Spring Hill', wow: 8.7 },
  { city: 'Gallatin', wow: 6.3 },
  { city: 'Lebanon', wow: 5.2 },
  { city: 'Hendersonville', wow: 3.8 },
];

export const demoTopPriceCuts: PriceCut[] = [
  { address: '1234 Oak Lane', cut: 85000, city: 'Brentwood' },
  { address: '5678 Maple Dr', cut: 72000, city: 'Franklin' },
  { address: '9012 Pine St', cut: 65000, city: 'Nashville' },
  { address: '3456 Cedar Ave', cut: 58000, city: 'Franklin' },
  { address: '7890 Birch Ct', cut: 52000, city: 'Brentwood' },
  { address: '2345 Elm Way', cut: 48000, city: 'Nashville' },
  { address: '6789 Spruce Ln', cut: 45000, city: 'Murfreesboro' },
  { address: '1234 Willow Rd', cut: 42000, city: 'Mt Juliet' },
];

export const demoAgentLeaderboard: AgentLeader[] = [
  { agent: 'Sarah Johnson', newListings: 23, pendings: 18 },
  { agent: 'Michael Chen', newListings: 21, pendings: 16 },
  { agent: 'Emily Rodriguez', newListings: 19, pendings: 15 },
  { agent: 'David Williams', newListings: 18, pendings: 14 },
  { agent: 'Jennifer Davis', newListings: 17, pendings: 13 },
];
