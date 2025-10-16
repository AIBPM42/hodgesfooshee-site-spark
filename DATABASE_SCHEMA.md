# Hodges & Fooshee - Scalable Database Schema

## Overview
Designed to scale from 5 pilot agents to 100+ agents, unlimited public users, and multiple brokers.

---

## Core Tables

### 1. Users & Authentication
```sql
-- Main users table (Supabase Auth integration)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('super_admin', 'broker', 'agent', 'public_user')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended', 'inactive')),
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Only super_admin and broker can view all profiles
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('super_admin', 'broker')
    )
  );
```

---

### 2. Agent Profiles (Extended Info)
```sql
CREATE TABLE public.agent_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  license_number TEXT,
  bio TEXT,
  specialties TEXT[], -- Array: ['Luxury Homes', 'First-Time Buyers']
  areas_served TEXT[], -- Array: ['Nashville', 'Franklin', 'Brentwood']
  years_experience INTEGER,
  languages TEXT[], -- Array: ['English', 'Spanish']
  certifications TEXT[],
  social_links JSONB, -- {facebook: 'url', linkedin: 'url', instagram: 'url'}
  office_location TEXT,
  active_listings_count INTEGER DEFAULT 0,
  total_sales_count INTEGER DEFAULT 0,
  average_rating DECIMAL(3,2),
  is_featured BOOLEAN DEFAULT FALSE,
  display_order INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for performance
CREATE INDEX idx_agent_profiles_user_id ON public.agent_profiles(user_id);
CREATE INDEX idx_agent_featured ON public.agent_profiles(is_featured, display_order);

-- RLS
ALTER TABLE public.agent_profiles ENABLE ROW LEVEL SECURITY;

-- Agents can update their own profile
CREATE POLICY "Agents can update own profile"
  ON public.agent_profiles FOR UPDATE
  USING (
    user_id = auth.uid()
  );

-- Public can view active agents
CREATE POLICY "Public can view active agents"
  ON public.agent_profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = user_id AND status = 'active' AND role = 'agent'
    )
  );
```

---

### 3. Agent Applications (Approval Workflow)
```sql
CREATE TABLE public.agent_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  license_number TEXT NOT NULL,
  years_experience INTEGER,
  previous_brokerage TEXT,
  why_join TEXT,
  references JSONB, -- [{name: 'John', phone: '123', email: 'john@example.com'}]
  resume_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'needs_info')),
  reviewed_by UUID REFERENCES public.profiles(id),
  reviewed_at TIMESTAMPTZ,
  review_notes TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX idx_applications_status ON public.agent_applications(status);
CREATE INDEX idx_applications_user ON public.agent_applications(user_id);

-- RLS
ALTER TABLE public.agent_applications ENABLE ROW LEVEL SECURITY;

-- Users can view their own application
CREATE POLICY "Users can view own application"
  ON public.agent_applications FOR SELECT
  USING (user_id = auth.uid());

-- Broker can view all applications
CREATE POLICY "Broker can manage applications"
  ON public.agent_applications FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('broker', 'super_admin')
    )
  );
```

---

### 4. Open Houses
```sql
CREATE TABLE public.open_houses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id TEXT NOT NULL, -- MLS ListingKey
  agent_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  address TEXT NOT NULL,
  city TEXT,
  state TEXT DEFAULT 'TN',
  zip_code TEXT,
  property_type TEXT,
  price DECIMAL(12,2),
  beds INTEGER,
  baths DECIMAL(3,1),
  sqft INTEGER,
  image_url TEXT,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  rsvp_count INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_open_houses_agent ON public.open_houses(agent_id);
CREATE INDEX idx_open_houses_date ON public.open_houses(start_time);
CREATE INDEX idx_open_houses_status ON public.open_houses(status);
CREATE INDEX idx_open_houses_zip ON public.open_houses(zip_code);

-- RLS
ALTER TABLE public.open_houses ENABLE ROW LEVEL SECURITY;

-- Public can view scheduled open houses
CREATE POLICY "Public can view scheduled open houses"
  ON public.open_houses FOR SELECT
  USING (status = 'scheduled' AND start_time > NOW());

-- Agents can manage their own open houses
CREATE POLICY "Agents can manage own open houses"
  ON public.open_houses FOR ALL
  USING (agent_id = auth.uid());
```

---

### 5. Open House RSVPs
```sql
CREATE TABLE public.open_house_rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  open_house_id UUID REFERENCES public.open_houses(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- NULL if guest
  guest_name TEXT,
  guest_email TEXT,
  guest_phone TEXT,
  party_size INTEGER DEFAULT 1,
  notes TEXT,
  status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'attended')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX idx_rsvps_open_house ON public.open_house_rsvps(open_house_id);
CREATE INDEX idx_rsvps_user ON public.open_house_rsvps(user_id);

-- RLS
ALTER TABLE public.open_house_rsvps ENABLE ROW LEVEL SECURITY;

-- Users can manage their own RSVPs
CREATE POLICY "Users can manage own RSVPs"
  ON public.open_house_rsvps FOR ALL
  USING (user_id = auth.uid() OR user_id IS NULL);

-- Agents can view RSVPs for their open houses
CREATE POLICY "Agents can view their open house RSVPs"
  ON public.open_house_rsvps FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.open_houses
      WHERE id = open_house_id AND agent_id = auth.uid()
    )
  );
```

---

### 6. Blog Posts
```sql
CREATE TABLE public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL, -- Rich text/HTML
  featured_image TEXT,
  category TEXT, -- 'Market Updates', 'Buyer Tips', 'Seller Tips', 'Neighborhood Guides'
  tags TEXT[],
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMPTZ,
  views_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_blog_posts_status ON public.blog_posts(status, published_at DESC);
CREATE INDEX idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX idx_blog_posts_category ON public.blog_posts(category);
CREATE INDEX idx_blog_posts_featured ON public.blog_posts(is_featured);

-- RLS
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Public can view published posts
CREATE POLICY "Public can view published posts"
  ON public.blog_posts FOR SELECT
  USING (status = 'published');

-- Broker can manage all posts
CREATE POLICY "Broker can manage posts"
  ON public.blog_posts FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('broker', 'super_admin')
    )
  );
```

---

### 7. Homepage Content (Dynamic Editing)
```sql
CREATE TABLE public.site_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section TEXT UNIQUE NOT NULL, -- 'hero', 'about', 'services', 'cta', 'footer'
  content JSONB NOT NULL, -- Flexible JSON structure per section
  updated_by UUID REFERENCES public.profiles(id),
  version INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Example hero section content:
-- {
--   "headline": "Find Your Dream Home in Nashville",
--   "subheadline": "Over 10,000 properties to explore",
--   "background_image": "/hero-bg.jpg",
--   "cta_text": "Start Your Search",
--   "cta_link": "/search/properties"
-- }

-- Index
CREATE INDEX idx_site_content_section ON public.site_content(section);

-- RLS
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- Public can view active content
CREATE POLICY "Public can view active content"
  ON public.site_content FOR SELECT
  USING (is_active = TRUE);

-- Broker can edit content
CREATE POLICY "Broker can edit content"
  ON public.site_content FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('broker', 'super_admin')
    )
  );
```

---

### 8. Leads (Inquiries from Frontend)
```sql
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  lead_type TEXT NOT NULL, -- 'property_inquiry', 'schedule_showing', 'home_valuation', 'contact_agent'
  property_id TEXT, -- MLS ListingKey if property-related
  property_address TEXT,
  assigned_agent_id UUID REFERENCES public.profiles(id),
  source TEXT, -- 'homepage', 'property_detail', 'open_house', 'blog'
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'closed', 'lost')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  notes TEXT,
  followed_up_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_leads_assigned_agent ON public.leads(assigned_agent_id);
CREATE INDEX idx_leads_status ON public.leads(status);
CREATE INDEX idx_leads_created ON public.leads(created_at DESC);
CREATE INDEX idx_leads_email ON public.leads(email);

-- RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Agents see only their assigned leads
CREATE POLICY "Agents see own leads"
  ON public.leads FOR SELECT
  USING (assigned_agent_id = auth.uid());

-- Broker sees all leads
CREATE POLICY "Broker sees all leads"
  ON public.leads FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('broker', 'super_admin')
    )
  );

-- Agents can update their leads
CREATE POLICY "Agents can update own leads"
  ON public.leads FOR UPDATE
  USING (assigned_agent_id = auth.uid());
```

---

### 9. User Favorites (Saved Properties)
```sql
CREATE TABLE public.user_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  property_id TEXT NOT NULL, -- MLS ListingKey
  property_data JSONB, -- Cache property details
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_favorites_user ON public.user_favorites(user_id);
CREATE INDEX idx_favorites_property ON public.user_favorites(property_id);
CREATE UNIQUE INDEX idx_favorites_unique ON public.user_favorites(user_id, property_id);

-- RLS
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;

-- Users manage their own favorites
CREATE POLICY "Users manage own favorites"
  ON public.user_favorites FOR ALL
  USING (user_id = auth.uid());
```

---

### 10. Saved Searches (Custom)
```sql
CREATE TABLE public.saved_searches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  search_name TEXT NOT NULL,
  criteria JSONB NOT NULL, -- {city: 'Nashville', min_price: 300000, max_price: 500000, beds: 3}
  email_alerts BOOLEAN DEFAULT TRUE,
  alert_frequency TEXT DEFAULT 'daily' CHECK (alert_frequency IN ('instant', 'daily', 'weekly')),
  last_emailed_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX idx_saved_searches_user ON public.saved_searches(user_id);
CREATE INDEX idx_saved_searches_active ON public.saved_searches(is_active);

-- RLS
ALTER TABLE public.saved_searches ENABLE ROW LEVEL SECURITY;

-- Users manage their own searches
CREATE POLICY "Users manage own searches"
  ON public.saved_searches FOR ALL
  USING (user_id = auth.uid());
```

---

### 11. Agent Activity Log (For Analytics)
```sql
CREATE TABLE public.agent_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL, -- 'login', 'lead_viewed', 'lead_contacted', 'property_searched', 'open_house_created'
  metadata JSONB, -- Flexible data per action type
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX idx_activity_agent ON public.agent_activity_log(agent_id, created_at DESC);
CREATE INDEX idx_activity_type ON public.agent_activity_log(action_type);

-- RLS
ALTER TABLE public.agent_activity_log ENABLE ROW LEVEL SECURITY;

-- Broker sees all activity
CREATE POLICY "Broker sees all activity"
  ON public.agent_activity_log FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('broker', 'super_admin')
    )
  );
```

---

### 12. Transactions (Business Metrics - Hodges Only)
```sql
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES public.profiles(id),
  property_id TEXT, -- MLS ListingKey
  property_address TEXT NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('sale', 'purchase', 'rental')),
  sale_price DECIMAL(12,2) NOT NULL,
  commission_rate DECIMAL(5,2), -- e.g., 3.00 for 3%
  commission_amount DECIMAL(12,2),
  brokerage_split DECIMAL(5,2), -- Percentage Hodges keeps
  brokerage_amount DECIMAL(12,2),
  agent_amount DECIMAL(12,2),
  closing_date DATE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'closed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX idx_transactions_agent ON public.transactions(agent_id);
CREATE INDEX idx_transactions_date ON public.transactions(closing_date DESC);
CREATE INDEX idx_transactions_status ON public.transactions(status);

-- RLS
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Only broker sees transactions
CREATE POLICY "Only broker sees transactions"
  ON public.transactions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('broker', 'super_admin')
    )
  );
```

---

## Summary

**12 Core Tables:**
1. ✅ profiles (users & roles)
2. ✅ agent_profiles (extended agent data)
3. ✅ agent_applications (approval workflow)
4. ✅ open_houses (agent-managed)
5. ✅ open_house_rsvps (public RSVPs)
6. ✅ blog_posts (Hodges CMS)
7. ✅ site_content (dynamic homepage)
8. ✅ leads (inquiries & CRM)
9. ✅ user_favorites (saved properties)
10. ✅ saved_searches (alerts)
11. ✅ agent_activity_log (analytics)
12. ✅ transactions (business metrics)

**Scalability:**
- ✅ Handles 5-100+ agents
- ✅ Unlimited public users
- ✅ Row-Level Security (RLS) for data isolation
- ✅ Indexed for performance
- ✅ Flexible JSONB fields for future features

**Next Step:** Create these tables in Supabase!
