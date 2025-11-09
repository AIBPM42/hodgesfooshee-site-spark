-- =====================================================
-- AI-ENHANCED DASHBOARD TABLES
-- For Hodges & Fooshee Real Estate Platform
-- Integrates: Perplexity, Manus, OpenAI, Claude APIs
-- =====================================================

-- ============== IMAGE INTELLIGENCE ==============
CREATE TABLE property_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id TEXT NOT NULL,
  image_url TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  city TEXT,
  county TEXT,
  neighborhood TEXT,
  blur_data_url TEXT,
  camera_make TEXT,
  camera_model TEXT,
  photo_timestamp TIMESTAMPTZ,
  compass_direction DECIMAL(5, 2), -- 0-360 degrees
  altitude DECIMAL(8, 2),
  image_width INTEGER,
  image_height INTEGER,
  file_size INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_property_images_property ON property_images(property_id);
CREATE INDEX idx_property_images_county ON property_images(county);
CREATE INDEX idx_property_images_neighborhood ON property_images(neighborhood);

-- ============== MARKET TEMPERATURE ==============
-- Powered by: Perplexity API + Claude
CREATE TABLE market_temperature (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  county TEXT NOT NULL,
  temperature INTEGER CHECK (temperature >= 0 AND temperature <= 100),
  trend TEXT CHECK (trend IN ('up', 'down', 'stable')),
  trend_velocity DECIMAL(5, 2), -- How fast it's changing
  key_factors JSONB, -- Array of driving factors
  perplexity_narrative TEXT,
  claude_guidance TEXT,
  buyer_market_score INTEGER, -- 0-100 (100 = extreme buyer's market)
  seller_market_score INTEGER, -- 0-100 (100 = extreme seller's market)
  data_sources JSONB, -- What data Perplexity used
  confidence_level DECIMAL(3, 2), -- 0.00-1.00
  data_timestamp TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_market_temp_county ON market_temperature(county);
CREATE INDEX idx_market_temp_timestamp ON market_temperature(data_timestamp DESC);

-- ============== DEAL PREDICTIONS ==============
-- Powered by: Manus AI + OpenAI
CREATE TABLE deal_predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id TEXT NOT NULL,
  agent_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  property_address TEXT,

  -- Manus AI predictions
  probability_30d DECIMAL(3, 2), -- 0.00-1.00
  probability_60d DECIMAL(3, 2),
  probability_90d DECIMAL(3, 2),
  confidence_score DECIMAL(3, 2),

  -- Key drivers from Manus
  key_drivers JSONB,
  predicted_sale_price INTEGER,
  predicted_days_to_contract INTEGER,

  -- OpenAI action plan
  openai_action_plan TEXT,
  recommended_price_adjustment INTEGER, -- Suggested price change
  marketing_tactics JSONB, -- AI-generated marketing suggestions

  -- Performance tracking
  actual_outcome TEXT, -- 'sold', 'expired', 'withdrawn', null if pending
  actual_sale_price INTEGER,
  actual_days_to_contract INTEGER,
  prediction_accuracy DECIMAL(3, 2), -- Calculated after sale

  prediction_timestamp TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_deal_predictions_listing ON deal_predictions(listing_id);
CREATE INDEX idx_deal_predictions_agent ON deal_predictions(agent_id);
CREATE INDEX idx_deal_predictions_timestamp ON deal_predictions(prediction_timestamp DESC);

-- ============== NEIGHBORHOOD METRICS ==============
-- Powered by: Perplexity API + MLS Data
CREATE TABLE neighborhood_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  neighborhood_name TEXT NOT NULL,
  city TEXT NOT NULL,
  county TEXT NOT NULL,

  -- Geographic boundaries
  boundary_geojson JSONB, -- Polygon coordinates
  center_lat DECIMAL(10, 8),
  center_lng DECIMAL(11, 8),

  -- Market stats
  avg_list_price INTEGER,
  avg_sale_price INTEGER,
  avg_price_per_sqft INTEGER,
  median_dom INTEGER, -- Days on market
  inventory_count INTEGER,

  -- Perplexity insights
  investment_score INTEGER CHECK (investment_score >= 0 AND investment_score <= 100),
  walkability_score INTEGER,
  school_rating_avg DECIMAL(3, 1), -- 0.0-10.0
  crime_index INTEGER, -- Lower = safer
  development_activity TEXT, -- Recent news/projects
  demographic_summary JSONB,

  -- Trends
  price_trend TEXT CHECK (price_trend IN ('rising', 'stable', 'falling')),
  price_change_30d DECIMAL(5, 2), -- Percentage
  price_change_90d DECIMAL(5, 2),
  price_change_1yr DECIMAL(5, 2),

  data_month DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_neighborhood_county ON neighborhood_metrics(county);
CREATE INDEX idx_neighborhood_investment ON neighborhood_metrics(investment_score DESC);
CREATE INDEX idx_neighborhood_month ON neighborhood_metrics(data_month DESC);

-- ============== MIGRATION FLOWS ==============
-- Powered by: Perplexity API (IRS data, U-Haul, LinkedIn)
CREATE TABLE migration_flows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Origin
  from_city TEXT NOT NULL,
  from_state TEXT NOT NULL,
  from_metro_area TEXT,

  -- Destination (one of your 9 counties)
  to_county TEXT NOT NULL,
  to_city TEXT, -- Specific city within county

  -- Volume
  flow_volume INTEGER, -- Number of people/households
  year_over_year_change DECIMAL(5, 2), -- Percentage change

  -- Demographics
  avg_age DECIMAL(4, 1),
  avg_household_income INTEGER,
  avg_family_size DECIMAL(3, 1),
  homeownership_rate DECIMAL(3, 2),

  -- Employment
  top_job_sectors JSONB, -- ['Technology', 'Healthcare', ...]
  remote_worker_percentage DECIMAL(3, 2),

  -- Preferences
  avg_home_price_seeking INTEGER,
  preferred_property_types JSONB, -- ['Single Family', 'Condo', ...]

  -- Data source
  data_sources JSONB, -- ['IRS Migration', 'U-Haul', 'LinkedIn']
  confidence_level DECIMAL(3, 2),

  data_month DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_migration_from ON migration_flows(from_city, from_state);
CREATE INDEX idx_migration_to ON migration_flows(to_county);
CREATE INDEX idx_migration_volume ON migration_flows(flow_volume DESC);
CREATE INDEX idx_migration_month ON migration_flows(data_month DESC);

-- ============== BUYER INTENT SIGNALS ==============
-- Powered by: Perplexity + Lead Tracking
CREATE TABLE buyer_intent_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,

  -- Intent score (0-100)
  intent_score INTEGER CHECK (intent_score >= 0 AND intent_score <= 100),
  intent_level TEXT CHECK (intent_level IN ('low', 'medium', 'high', 'urgent')),

  -- Platform engagement
  property_views_7d INTEGER,
  property_views_30d INTEGER,
  saved_properties_count INTEGER,
  search_frequency_7d INTEGER,
  email_opens_7d INTEGER,
  email_clicks_7d INTEGER,

  -- Behavioral signals
  viewed_same_property_multiple_times BOOLEAN,
  viewed_financing_info BOOLEAN,
  clicked_price_on_listing BOOLEAN,
  contacted_agent BOOLEAN,
  scheduled_showing BOOLEAN,

  -- Perplexity external signals
  external_search_signals JSONB, -- Google searches, etc
  market_event_triggers JSONB, -- Interest rate drops, etc

  -- AI-generated insights
  claude_talking_points TEXT,
  recommended_next_action TEXT,
  urgency_factors JSONB,

  -- Outcome tracking
  converted_to_showing BOOLEAN DEFAULT FALSE,
  converted_to_offer BOOLEAN DEFAULT FALSE,
  conversion_date TIMESTAMPTZ,

  score_timestamp TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_intent_lead ON buyer_intent_signals(lead_id);
CREATE INDEX idx_intent_score ON buyer_intent_signals(intent_score DESC);
CREATE INDEX idx_intent_timestamp ON buyer_intent_signals(score_timestamp DESC);

-- ============== AGENT PERFORMANCE FORECASTS ==============
-- Powered by: Manus AI
CREATE TABLE agent_performance_forecasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,

  -- Current performance (actual)
  current_month_closings INTEGER,
  current_month_volume INTEGER,
  current_pipeline_count INTEGER,
  current_lead_count INTEGER,

  -- Manus predictions (next 30 days)
  predicted_closings_30d DECIMAL(4, 1),
  predicted_volume_30d INTEGER,
  predicted_new_listings_30d INTEGER,

  -- Confidence
  confidence_level DECIMAL(3, 2),
  prediction_accuracy_historical DECIMAL(3, 2), -- Based on past predictions

  -- Trajectory
  growth_trajectory TEXT CHECK (growth_trajectory IN ('accelerating', 'stable', 'declining')),
  rank_current INTEGER, -- Current leaderboard position
  rank_predicted INTEGER, -- Predicted position next month

  -- Manus recommendations
  recommended_actions JSONB,
  focus_areas JSONB,
  risk_factors JSONB,

  -- Activity metrics (inputs to Manus)
  calls_made_30d INTEGER,
  emails_sent_30d INTEGER,
  showings_conducted_30d INTEGER,
  listings_taken_30d INTEGER,

  forecast_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_agent_forecast_agent ON agent_performance_forecasts(agent_id);
CREATE INDEX idx_agent_forecast_date ON agent_performance_forecasts(forecast_date DESC);

-- ============== AI-GENERATED CMAs ==============
-- Powered by: OpenAI + Claude + MLS Data
CREATE TABLE ai_cmas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,

  -- Subject property
  property_address TEXT NOT NULL,
  property_city TEXT,
  property_county TEXT,
  property_zip TEXT,

  -- MLS data
  subject_property_data JSONB,
  comparable_properties JSONB, -- Array of comps
  market_statistics JSONB,

  -- OpenAI content
  openai_executive_summary TEXT,
  openai_property_highlights JSONB,
  openai_comparable_analysis TEXT,
  openai_pricing_recommendation TEXT,
  openai_marketing_strategy TEXT,
  openai_market_outlook TEXT,

  -- Claude review
  claude_strategic_notes TEXT,
  claude_accuracy_check TEXT,
  claude_additional_insights TEXT,

  -- Pricing
  recommended_list_price INTEGER,
  price_range_low INTEGER,
  price_range_high INTEGER,
  confidence_level DECIMAL(3, 2),

  -- PDF generation
  pdf_url TEXT,
  pdf_generated_at TIMESTAMPTZ,

  -- Tracking
  sent_to_client BOOLEAN DEFAULT FALSE,
  client_email TEXT,
  viewed_by_client BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_cma_agent ON ai_cmas(agent_id);
CREATE INDEX idx_cma_property ON ai_cmas(property_address);
CREATE INDEX idx_cma_created ON ai_cmas(created_at DESC);

-- ============== SMART PRICING SCENARIOS ==============
-- Powered by: All 4 AIs
CREATE TABLE smart_pricing_scenarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id TEXT NOT NULL,
  agent_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,

  -- Property
  property_address TEXT,
  property_data JSONB,

  -- Perplexity market intel
  perplexity_comps JSONB,
  perplexity_market_news TEXT,
  perplexity_competition_analysis JSONB,

  -- Manus historical analysis
  manus_brokerage_history JSONB,
  manus_pricing_accuracy DECIMAL(3, 2),
  manus_best_practices JSONB,

  -- OpenAI scenarios
  scenario_aggressive JSONB, -- {price, predicted_dom, predicted_sale_price, probability_multiple_offers}
  scenario_market JSONB,
  scenario_premium JSONB,

  -- Claude recommendation
  claude_recommended_scenario TEXT CHECK (claude_recommended_scenario IN ('aggressive', 'market', 'premium')),
  claude_reasoning TEXT,
  claude_confidence DECIMAL(3, 2),
  claude_risk_assessment TEXT,

  -- Final decision
  agent_selected_price INTEGER,
  agent_selected_scenario TEXT,
  agent_notes TEXT,

  -- Outcome tracking
  actual_list_price INTEGER,
  actual_sale_price INTEGER,
  actual_dom INTEGER,
  received_multiple_offers BOOLEAN,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_pricing_listing ON smart_pricing_scenarios(listing_id);
CREATE INDEX idx_pricing_agent ON smart_pricing_scenarios(agent_id);

-- ============== AI API USAGE TRACKING ==============
-- Track costs and performance
CREATE TABLE ai_api_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  api_provider TEXT CHECK (api_provider IN ('perplexity', 'manus', 'openai', 'claude')),
  endpoint TEXT,

  -- Request
  request_type TEXT, -- 'market_temp', 'deal_prediction', 'cma', etc
  request_payload JSONB,
  prompt_tokens INTEGER,

  -- Response
  response_payload JSONB,
  completion_tokens INTEGER,
  total_tokens INTEGER,

  -- Performance
  latency_ms INTEGER,
  success BOOLEAN,
  error_message TEXT,

  -- Cost (calculated)
  estimated_cost_usd DECIMAL(8, 6),

  -- Attribution
  triggered_by_agent_id UUID REFERENCES public.profiles(id),
  feature_used TEXT, -- Which dashboard tile/feature

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_api_usage_provider ON ai_api_usage(api_provider);
CREATE INDEX idx_api_usage_date ON ai_api_usage(created_at DESC);
CREATE INDEX idx_api_usage_agent ON ai_api_usage(triggered_by_agent_id);

-- ============== TRIGGERS ==============
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_property_images_updated_at BEFORE UPDATE ON property_images FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_market_temperature_updated_at BEFORE UPDATE ON market_temperature FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_deal_predictions_updated_at BEFORE UPDATE ON deal_predictions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_neighborhood_metrics_updated_at BEFORE UPDATE ON neighborhood_metrics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_migration_flows_updated_at BEFORE UPDATE ON migration_flows FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_buyer_intent_signals_updated_at BEFORE UPDATE ON buyer_intent_signals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_agent_performance_forecasts_updated_at BEFORE UPDATE ON agent_performance_forecasts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ai_cmas_updated_at BEFORE UPDATE ON ai_cmas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_smart_pricing_scenarios_updated_at BEFORE UPDATE ON smart_pricing_scenarios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============== COMMENTS ==============
COMMENT ON TABLE property_images IS 'Next.js optimized images with EXIF geo-tagging';
COMMENT ON TABLE market_temperature IS 'Real-time market heat powered by Perplexity + Claude';
COMMENT ON TABLE deal_predictions IS 'Manus AI probability forecasts for listings';
COMMENT ON TABLE neighborhood_metrics IS 'Perplexity-powered neighborhood intelligence';
COMMENT ON TABLE migration_flows IS 'Where buyers are moving from (Perplexity IRS data)';
COMMENT ON TABLE buyer_intent_signals IS 'Lead scoring with Perplexity external signals';
COMMENT ON TABLE agent_performance_forecasts IS 'Manus AI predictions for agent performance';
COMMENT ON TABLE ai_cmas IS 'OpenAI + Claude generated CMAs';
COMMENT ON TABLE smart_pricing_scenarios IS 'All 4 AIs working together for optimal pricing';
COMMENT ON TABLE ai_api_usage IS 'Track API costs and performance';
