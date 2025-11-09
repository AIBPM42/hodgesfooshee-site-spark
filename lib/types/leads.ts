export type PropertyType = 'Pre-Foreclosure' | 'Foreclosure' | 'Tax Lien' | 'Probate Sale' | 'Expired Listing';
export type LeadPriority = 'high' | 'medium' | 'low';
export type LeadStatus = 'new' | 'claimed_by_broker' | 'assigned_to_agent' | 'archived';
export type AgentLeadStatus = 'working' | 'pending' | 'closed_won' | 'closed_lost';
export type LeadHunterFrequency = 'daily' | 'every_2_days' | 'weekly' | 'manual';

export interface DistressedLead {
  id: string;

  // Property Info
  address: string;
  city: string;
  state: string;
  zip: string;
  property_type: PropertyType;

  // Financial Details
  estimated_value: number;
  estimated_equity: number;
  days_in_distress: number;

  // AI Analysis
  ai_insight: string;
  confidence_score: number; // 0-100
  priority: LeadPriority;

  // Source Info
  source: string;
  found_date: string;

  // Status & Assignment
  status: LeadStatus;
  claimed_by?: string | null;
  assigned_to?: string | null;
  assigned_date?: string | null;

  // Featured Status
  is_featured: boolean;
  featured_date?: string | null;

  // Agent Actions
  contacted: boolean;
  contact_attempts: number;
  last_contact_date?: string | null;
  agent_notes?: string | null;
  follow_up_date?: string | null;
  lead_status?: AgentLeadStatus | null;

  // Images
  property_images?: string[] | null;

  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface LeadHunterSettings {
  id: string;
  frequency: LeadHunterFrequency;
  run_time: string; // "06:00"
  target_counties: string[];
  min_equity: number;
  last_run?: string | null;
  next_run?: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminLeadStats {
  newToday: number;
  totalActive: number;
  claimedByBroker: number;
  avgResponseTimeHours: number;
  conversionRate: number;
  pipelineValue: number;
}

export interface AgentLeadStats {
  myActive: number;
  contactedThisWeek: number;
  conversionRate: number;
  myPipelineValue: number;
}

export interface AgentPerformance {
  id: string;
  name: string;
  activeLeads: number;
  conversionRate: number;
}
