/**
 * County Page Types
 * For county detail pages with market data and AI narratives
 */

export interface CountyKPIs {
  population_growth: string;
  median_price: string;
  days_on_market: string;
  price_trend: string;
}

export interface PriceTier {
  range: string;
  count: number;
}

export interface PropertyType {
  type: string;
  percentage: number;
}

export interface CountyInventory {
  price_tiers: PriceTier[];
  property_types: PropertyType[];
}

export interface CountyTrend {
  months: string[];
  median_prices: number[];
}

export interface FAQQuestion {
  question: string;
  answer: string;
  display: boolean;
}

export interface County {
  id: number;
  name: string;
  slug: string;
  hero_tagline?: string;
  median_price?: number;
  population?: number;
  kpis: CountyKPIs;
  inventory: CountyInventory;
  trend: CountyTrend;

  // New comprehensive content sections
  market_overview?: string | null;
  living_here?: string | null;
  schools_education?: string | null;
  commute_location?: string | null;
  investment_outlook?: string | null;
  faq_questions?: FAQQuestion[] | null;
  seo_score?: number | null;

  // Legacy fields (for backwards compatibility)
  narrative?: string | null;
  narrative_updated_at?: string | null;

  auto_refresh: boolean;
  refresh_frequency: 'manual' | 'weekly' | 'monthly';
  last_refresh_at: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  meta_title?: string;
  meta_description?: string;
}
