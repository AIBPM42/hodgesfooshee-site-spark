# 🏗️ AI DASHBOARD IMPLEMENTATION ARCHITECTURE
## Next.js 14 + 4 AI APIs + Advanced Optimization

---

## 📐 SYSTEM ARCHITECTURE OVERVIEW

```
┌─────────────────────────────────────────────────────────────┐
│                    USER INTERFACE LAYER                      │
│  Next.js 14 App Router │ React 18 │ Tailwind CSS │ Recharts│
└───────────────┬─────────────────────────────────────────────┘
                │
                ↓
┌─────────────────────────────────────────────────────────────┐
│                  API ORCHESTRATION LAYER                     │
│    Next.js API Routes │ Edge Runtime │ Middleware           │
└───────────────┬─────────────────────────────────────────────┘
                │
                ↓
┌─────────────────────────────────────────────────────────────┐
│                   AI SERVICES LAYER                          │
│  Perplexity │ Manus │ OpenAI │ Claude │ Rate Limiting       │
└───────────────┬─────────────────────────────────────────────┘
                │
                ↓
┌─────────────────────────────────────────────────────────────┐
│                   DATA LAYER                                 │
│  Supabase PostgreSQL │ Redis Cache │ Edge KV Storage        │
└─────────────────────────────────────────────────────────────┘
                │
                ↓
┌─────────────────────────────────────────────────────────────┐
│                  AUTOMATION LAYER                            │
│  n8n Workflows │ Cron Jobs │ Webhooks │ Event Triggers      │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 NEXT.JS OPTIMIZATION STRATEGIES

### **1. Image Optimization with Geo-Tagging**

#### **Component: Property Image Processor**
`/lib/imageProcessor.ts`

```typescript
import exifr from 'exifr'
import { getPlaiceholder } from 'plaiceholder'
import sharp from 'sharp'

export interface ProcessedImage {
  url: string
  width: number
  height: number
  blurDataURL: string
  location: {
    latitude: number | null
    longitude: number | null
    city: string | null
    county: string | null
    neighborhood: string | null
  }
  metadata: {
    camera?: string
    timestamp?: Date
    direction?: number // Compass direction camera was facing
    altitude?: number
  }
}

export async function processPropertyImage(
  imageUrl: string,
  propertyId: string
): Promise<ProcessedImage> {

  // 1. Download image
  const response = await fetch(imageUrl)
  const arrayBuffer = await response.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  // 2. Extract EXIF data
  const exif = await exifr.parse(buffer, {
    gps: true,
    ifd0: true,
    exif: true,
    ifd1: true
  })

  // 3. Get image dimensions
  const image = sharp(buffer)
  const { width, height } = await image.metadata()

  // 4. Generate blur placeholder
  const { base64 } = await getPlaiceholder(buffer)

  // 5. Reverse geocode if GPS available
  let location = {
    latitude: null,
    longitude: null,
    city: null,
    county: null,
    neighborhood: null
  }

  if (exif?.latitude && exif?.longitude) {
    location = await reverseGeocode(exif.latitude, exif.longitude)
  }

  // 6. Save to Supabase
  const processed: ProcessedImage = {
    url: imageUrl,
    width: width || 1200,
    height: height || 800,
    blurDataURL: base64,
    location: {
      latitude: exif?.latitude || null,
      longitude: exif?.longitude || null,
      ...location
    },
    metadata: {
      camera: exif?.Make ? `${exif.Make} ${exif.Model}` : undefined,
      timestamp: exif?.DateTimeOriginal,
      direction: exif?.GPSImgDirection,
      altitude: exif?.GPSAltitude
    }
  }

  await supabase.from('property_images').insert({
    property_id: propertyId,
    image_url: imageUrl,
    latitude: processed.location.latitude,
    longitude: processed.location.longitude,
    city: processed.location.city,
    county: processed.location.county,
    neighborhood: processed.location.neighborhood,
    blur_data_url: processed.blurDataURL,
    camera_make: exif?.Make,
    camera_model: exif?.Model,
    photo_timestamp: processed.metadata.timestamp,
    compass_direction: processed.metadata.direction,
    altitude: processed.metadata.altitude,
    image_width: processed.width,
    image_height: processed.height
  })

  return processed
}

async function reverseGeocode(lat: number, lng: number) {
  // Using Mapbox Geocoding API
  const response = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${process.env.MAPBOX_TOKEN}`
  )
  const data = await response.json()

  const feature = data.features[0]
  const context = feature?.context || []

  return {
    city: context.find((c: any) => c.id.includes('place'))?.text || null,
    county: context.find((c: any) => c.id.includes('district'))?.text || null,
    neighborhood: context.find((c: any) => c.id.includes('neighborhood'))?.text || null,
    latitude: lat,
    longitude: lng
  }
}
```

#### **Usage in Component**
`/components/PropertyImage.tsx`

```typescript
import Image from 'next/image'

interface PropertyImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  priority?: boolean
  blurDataURL?: string
  city?: string
  county?: string
}

export default function PropertyImage({
  src,
  alt,
  width = 1200,
  height = 800,
  priority = false,
  blurDataURL,
  city,
  county
}: PropertyImageProps) {

  // SEO-optimized alt text with geo data
  const optimizedAlt = `${alt}${city ? ` in ${city}` : ''}${county ? `, ${county} County` : ''}`

  return (
    <div className="relative overflow-hidden rounded-xl">
      <Image
        src={src}
        alt={optimizedAlt}
        width={width}
        height={height}
        placeholder={blurDataURL ? 'blur' : 'empty'}
        blurDataURL={blurDataURL}
        priority={priority}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover transition-transform duration-300 hover:scale-105"
        quality={85}
        loading={priority ? 'eager' : 'lazy'}
      />

      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ImageObject',
            contentUrl: src,
            description: optimizedAlt,
            ...(city && { contentLocation: { '@type': 'City', name: city } })
          })
        }}
      />
    </div>
  )
}
```

---

### **2. Incremental Static Regeneration (ISR) for Market Data**

#### **Market Temperature Page with ISR**
`/app/dashboard/market-temp/page.tsx`

```typescript
import { supabase } from '@/lib/supabase'
import MarketTempGauge from '@/components/MarketTempGauge'

export const revalidate = 21600 // Revalidate every 6 hours (ISR)

async function getMarketTemperature() {
  const { data } = await supabase
    .from('market_temperature')
    .select('*')
    .order('data_timestamp', { ascending: false })
    .limit(9) // One per county

  return data || []
}

export default async function MarketTempPage() {
  const temperatures = await getMarketTemperature()

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {temperatures.map((temp) => (
        <MarketTempGauge
          key={temp.county}
          county={temp.county}
          temperature={temp.temperature}
          trend={temp.trend}
          narrative={temp.perplexity_narrative}
          guidance={temp.claude_guidance}
        />
      ))}
    </div>
  )
}

// Generate static params for all counties
export async function generateStaticParams() {
  return [
    { county: 'Davidson' },
    { county: 'Rutherford' },
    { county: 'Williamson' },
    { county: 'Wilson' },
    { county: 'Sumner' },
    { county: 'Cheatham' },
    { county: 'Maury' },
    { county: 'Dickson' },
    { county: 'Bedford' }
  ]
}
```

**Why ISR?**
- Page builds at build time (fast initial load)
- Rebuilds every 6 hours with fresh AI data
- Users always see recent data without waiting for API calls
- Cheaper (fewer AI API calls during user sessions)

---

### **3. Edge Runtime for Real-Time Features**

#### **Buyer Intent Signals API Route**
`/app/api/intent-signals/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// ⚡ RUNS ON EDGE (not Node.js) - ultra-fast global response
export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const leadId = searchParams.get('leadId')

  if (!leadId) {
    return NextResponse.json({ error: 'leadId required' }, { status: 400 })
  }

  // Use Supabase JS client (works in edge runtime)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Calculate intent score
  const { data: lead } = await supabase
    .from('leads')
    .select(`
      *,
      property_views:user_favorites(count),
      searches:saved_searches(count)
    `)
    .eq('id', leadId)
    .single()

  // Simple scoring algorithm (in production, call Manus API)
  const intentScore = calculateIntentScore(lead)

  // Check if we need Perplexity external signals
  if (intentScore > 60) {
    // Call Perplexity API to check external signals
    const externalSignals = await checkExternalSignals(lead.guest_email)

    // Re-calculate with external data
    const finalScore = intentScore + externalSignals.boost

    return NextResponse.json({
      leadId,
      intentScore: Math.min(finalScore, 100),
      level: getIntentLevel(finalScore),
      signals: externalSignals,
      recommendation: finalScore > 80 ? 'Call immediately' : 'Email follow-up'
    })
  }

  return NextResponse.json({
    leadId,
    intentScore,
    level: getIntentLevel(intentScore),
    recommendation: 'Continue nurturing'
  })
}

function calculateIntentScore(lead: any): number {
  let score = 0

  score += lead.property_views * 5
  score += lead.searches * 3
  score += lead.email_opens * 2
  score += lead.email_clicks * 8

  // Recency boost
  const lastActivity = new Date(lead.last_activity)
  const hoursSince = (Date.now() - lastActivity.getTime()) / (1000 * 60 * 60)
  if (hoursSince < 24) score += 15
  else if (hoursSince < 72) score += 8

  return Math.min(score, 100)
}

function getIntentLevel(score: number): string {
  if (score >= 80) return 'urgent'
  if (score >= 60) return 'high'
  if (score >= 40) return 'medium'
  return 'low'
}

async function checkExternalSignals(email: string) {
  // Call Perplexity to check if lead has been Googling related terms
  // This would be a Perplexity API call in production
  return {
    boost: 10,
    signals: ['Searched for mortgage rates', 'Viewed neighborhood school ratings']
  }
}
```

**Why Edge Runtime?**
- 50-200ms global latency (vs 500ms+ for serverless)
- No cold starts
- Perfect for real-time dashboards

---

### **4. Server Components + Client Components (Optimal Split)**

#### **Dashboard Page** (Server Component)
`/app/admin/page.tsx`

```typescript
import { supabase } from '@/lib/supabase'
import StatsCard from '@/components/StatsCard' // Client component
import MarketTempChart from '@/components/MarketTempChart' // Client component
import RecentActivity from '@/components/RecentActivity' // Server component (no interactivity)

// ✅ Server Component - fetches data at render time
export default async function AdminDashboard() {

  // Fetch data on server (no loading states needed)
  const [stats, marketData, activities] = await Promise.all([
    getDashboardStats(),
    getMarketTemperature(),
    getRecentActivity()
  ])

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

      {/* Stats Grid - Client components for interactivity */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <StatsCard title="Total Agents" value={stats.totalAgents} />
        <StatsCard title="Active Listings" value={stats.activeListings} />
        <StatsCard title="Pending Deals" value={stats.pendingDeals} />
        <StatsCard title="This Month Revenue" value={stats.revenue} />
      </div>

      {/* Chart - Client component (needs recharts) */}
      <MarketTempChart data={marketData} />

      {/* Activity Feed - Server component (just displaying data) */}
      <RecentActivity activities={activities} />
    </div>
  )
}

async function getDashboardStats() {
  const { data: agents } = await supabase
    .from('profiles')
    .select('id')
    .eq('role', 'agent')

  // ... fetch other stats

  return {
    totalAgents: agents?.length || 0,
    activeListings: 42,
    pendingDeals: 17,
    revenue: 284500
  }
}

async function getMarketTemperature() {
  const { data } = await supabase
    .from('market_temperature')
    .select('*')
    .order('data_timestamp', { ascending: false })
    .limit(30) // Last 30 data points for chart

  return data || []
}

async function getRecentActivity() {
  const { data } = await supabase
    .from('agent_activity_log')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10)

  return data || []
}
```

#### **Stats Card** (Client Component with Animation)
`/components/StatsCard.tsx`

```typescript
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface StatsCardProps {
  title: string
  value: number
  previousValue?: number
}

export default function StatsCard({ title, value, previousValue }: StatsCardProps) {
  const [displayValue, setDisplayValue] = useState(0)

  // Animate number counting up
  useEffect(() => {
    let start = 0
    const end = value
    const duration = 1000 // 1 second
    const increment = end / (duration / 16) // 60fps

    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setDisplayValue(end)
        clearInterval(timer)
      } else {
        setDisplayValue(Math.floor(start))
      }
    }, 16)

    return () => clearInterval(timer)
  }, [value])

  const changePercent = previousValue
    ? ((value - previousValue) / previousValue) * 100
    : null

  return (
    <motion.div
      className="glass-card p-6 hover:scale-105 transition-transform"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-sm text-gray-400 mb-2">{title}</h3>
      <div className="text-4xl font-bold text-white mb-2">
        {displayValue.toLocaleString()}
      </div>
      {changePercent !== null && (
        <div className={`text-sm ${changePercent > 0 ? 'text-green-400' : 'text-red-400'}`}>
          {changePercent > 0 ? '↗' : '↘'} {Math.abs(changePercent).toFixed(1)}% vs last month
        </div>
      )}
    </motion.div>
  )
}
```

**Why This Split?**
- Server components: Fast, no JS sent to client, SEO-friendly
- Client components: Only where interactivity needed (charts, animations)
- Best of both worlds

---

### **5. Streaming for AI-Generated Content**

#### **AI CMA Generator with Streaming**
`/app/api/generate-cma/route.ts`

```typescript
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { OpenAI } from 'openai'

export const runtime = 'edge'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req: Request) {
  const { propertyAddress, comparables, marketData } = await req.json()

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    stream: true, // ⚡ Streaming response
    messages: [{
      role: 'system',
      content: 'You are a Nashville real estate expert writing CMAs.'
    }, {
      role: 'user',
      content: `
      Generate a comprehensive CMA for:
      Property: ${propertyAddress}
      Comps: ${JSON.stringify(comparables)}
      Market: ${JSON.stringify(marketData)}

      Include:
      1. Executive Summary
      2. Property Highlights
      3. Comparable Analysis
      4. Pricing Recommendation
      5. Marketing Strategy
      `
    }]
  })

  // Stream tokens to client as they arrive
  const stream = OpenAIStream(response)
  return new StreamingTextResponse(stream)
}
```

#### **Client Component with Streaming**
`/components/CMAGenerator.tsx`

```typescript
'use client'

import { useState } from 'react'
import { useCompletion } from 'ai/react'

export default function CMAGenerator() {
  const { complete, completion, isLoading } = useCompletion({
    api: '/api/generate-cma'
  })

  const [property, setProperty] = useState('')

  async function handleGenerate() {
    await complete(property, {
      body: {
        propertyAddress: property,
        comparables: [], // Fetch from MLS
        marketData: {} // Fetch from Supabase
      }
    })
  }

  return (
    <div className="glass-card p-8">
      <h2 className="text-2xl font-bold mb-4">AI CMA Generator</h2>

      <input
        type="text"
        value={property}
        onChange={(e) => setProperty(e.target.value)}
        placeholder="Enter property address..."
        className="w-full p-4 mb-4 bg-white/5 border border-white/10 rounded-lg"
      />

      <button
        onClick={handleGenerate}
        disabled={isLoading}
        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg"
      >
        {isLoading ? 'Generating...' : 'Generate CMA'}
      </button>

      {/* Stream content as it arrives */}
      {completion && (
        <div className="mt-8 p-6 bg-white/5 rounded-lg">
          <div className="prose prose-invert max-w-none">
            {completion.split('\n').map((line, i) => (
              <p key={i} className="mb-4">{line}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
```

**Why Streaming?**
- User sees content appear in real-time (feels instant)
- No 30-second blank screen
- Better UX for AI-generated content

---

## 🔄 N8N AUTOMATION WORKFLOWS

### **Workflow 1: Market Temperature Refresh**
**Trigger**: Every 6 hours (cron: `0 */6 * * *`)

```
┌─────────────┐
│ Cron Trigger│
│  Every 6hrs │
└──────┬──────┘
       │
       ↓
┌────────────────────┐
│ For Each County    │
│ (9 counties)       │
└──────┬─────────────┘
       │
       ↓
┌────────────────────┐
│ Perplexity API     │
│ Get market intel   │
└──────┬─────────────┘
       │
       ↓
┌────────────────────┐
│ Claude API         │
│ Analyze + guidance │
└──────┬─────────────┘
       │
       ↓
┌────────────────────┐
│ Supabase Insert    │
│ market_temperature │
└────────────────────┘
```

**n8n JSON Workflow**:
```json
{
  "nodes": [
    {
      "name": "Cron Trigger",
      "type": "n8n-nodes-base.cron",
      "parameters": {
        "rule": {
          "interval": [
            {
              "field": "hours",
              "hours": 6
            }
          ]
        }
      }
    },
    {
      "name": "Counties Loop",
      "type": "n8n-nodes-base.splitInBatches",
      "parameters": {
        "batchSize": 1,
        "options": {}
      }
    },
    {
      "name": "Perplexity API",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "https://api.perplexity.ai/chat/completions",
        "method": "POST",
        "authentication": "headerAuth",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "Authorization",
              "value": "Bearer {{$env.PERPLEXITY_API_KEY}}"
            }
          ]
        },
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            {
              "name": "model",
              "value": "llama-3.1-sonar-large-128k-online"
            },
            {
              "name": "messages",
              "value": [
                {
                  "role": "user",
                  "content": "Analyze real estate market temperature in {{$json.county}} County, TN..."
                }
              ]
            }
          ]
        }
      }
    },
    {
      "name": "Claude Analysis",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "https://api.anthropic.com/v1/messages",
        "method": "POST",
        "authentication": "headerAuth",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "x-api-key",
              "value": "{{$env.CLAUDE_API_KEY}}"
            },
            {
              "name": "anthropic-version",
              "value": "2023-06-01"
            }
          ]
        },
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            {
              "name": "model",
              "value": "claude-sonnet-4-5"
            },
            {
              "name": "max_tokens",
              "value": 1024
            },
            {
              "name": "messages",
              "value": [
                {
                  "role": "user",
                  "content": "Perplexity says: {{$json.perplexity_response}}. Provide strategic agent guidance..."
                }
              ]
            }
          ]
        }
      }
    },
    {
      "name": "Save to Supabase",
      "type": "n8n-nodes-base.supabase",
      "parameters": {
        "operation": "insert",
        "tableId": "market_temperature",
        "columns": {
          "mappingMode": "defineBelow",
          "values": {
            "county": "={{$json.county}}",
            "temperature": "={{$json.perplexity_temperature}}",
            "trend": "={{$json.perplexity_trend}}",
            "perplexity_narrative": "={{$json.perplexity_narrative}}",
            "claude_guidance": "={{$json.claude_guidance}}"
          }
        }
      }
    }
  ]
}
```

---

### **Workflow 2: Deal Predictor (Daily)**
**Trigger**: Every day at 8am (when agents start work)

```
┌─────────────┐
│ Daily 8am   │
└──────┬──────┘
       │
       ↓
┌────────────────────┐
│ Get Active Listings│
│ from Supabase      │
└──────┬─────────────┘
       │
       ↓
┌────────────────────┐
│ For Each Listing   │
└──────┬─────────────┘
       │
       ↓
┌────────────────────┐
│ Manus AI API       │
│ Predict probability│
└──────┬─────────────┘
       │
       ↓
┌────────────────────┐
│ If probability <30%│
│ (deal at risk)     │
└──────┬─────────────┘
       │
       ↓
┌────────────────────┐
│ OpenAI Generate    │
│ Action Plan        │
└──────┬─────────────┘
       │
       ↓
┌────────────────────┐
│ Save to Supabase   │
│ deal_predictions   │
└──────┬─────────────┘
       │
       ↓
┌────────────────────┐
│ Send Alert to Agent│
│ (Email or Push)    │
└────────────────────┘
```

---

### **Workflow 3: Buyer Intent Signals (Real-Time)**
**Trigger**: Webhook when lead activity detected

```
┌─────────────┐
│ Webhook     │
│ /lead-event │
└──────┬──────┘
       │
       ↓
┌────────────────────┐
│ Calculate Score    │
│ (platform data)    │
└──────┬─────────────┘
       │
       ↓
┌────────────────────┐
│ If score > 60      │
└──────┬─────────────┘
       │
       ↓
┌────────────────────┐
│ Perplexity Check   │
│ External signals   │
└──────┬─────────────┘
       │
       ↓
┌────────────────────┐
│ If final score >80 │
└──────┬─────────────┘
       │
       ↓
┌────────────────────┐
│ Claude Generate    │
│ Talking Points     │
└──────┬─────────────┘
       │
       ↓
┌────────────────────┐
│ Push Notification  │
│ to Agent NOW       │
└────────────────────┘
```

---

## 🔐 SECURITY & RATE LIMITING

### **API Rate Limiter**
`/lib/rateLimiter.ts`

```typescript
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!
})

export async function checkRateLimit(
  identifier: string, // user ID or IP
  limit: number = 10,
  window: number = 60 // seconds
): Promise<{ allowed: boolean; remaining: number }> {

  const key = `ratelimit:${identifier}`

  const requests = await redis.incr(key)

  if (requests === 1) {
    await redis.expire(key, window)
  }

  const allowed = requests <= limit
  const remaining = Math.max(0, limit - requests)

  return { allowed, remaining }
}

// Usage in API route
export async function GET(request: NextRequest) {
  const ip = request.ip || 'unknown'
  const { allowed, remaining } = await checkRateLimit(ip, 100, 3600) // 100 requests/hour

  if (!allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      {
        status: 429,
        headers: { 'X-RateLimit-Remaining': remaining.toString() }
      }
    )
  }

  // ... proceed with request
}
```

---

### **AI API Budget Enforcer**
`/lib/budgetEnforcer.ts`

```typescript
import { supabase } from '@/lib/supabase'

const MONTHLY_BUDGET_USD = 5000 // Hard cap

export async function checkBudget(
  provider: 'perplexity' | 'manus' | 'openai' | 'claude',
  estimatedCost: number
): Promise<boolean> {

  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const { data } = await supabase
    .from('ai_api_usage')
    .select('estimated_cost_usd')
    .gte('created_at', startOfMonth.toISOString())

  const totalSpent = data?.reduce((sum, row) => sum + (row.estimated_cost_usd || 0), 0) || 0

  const projectedTotal = totalSpent + estimatedCost

  if (projectedTotal > MONTHLY_BUDGET_USD) {
    console.error(`Budget exceeded! Spent: $${totalSpent}, Projected: $${projectedTotal}`)
    return false
  }

  return true
}

// Usage
async function callOpenAI(prompt: string) {
  const estimatedCost = (prompt.length / 4) * 0.00001 // Rough estimate

  const allowed = await checkBudget('openai', estimatedCost)
  if (!allowed) {
    throw new Error('Monthly AI budget exceeded')
  }

  // ... make API call

  // Log actual cost
  await supabase.from('ai_api_usage').insert({
    api_provider: 'openai',
    estimated_cost_usd: estimatedCost,
    prompt_tokens: prompt.length / 4
  })
}
```

---

## 📊 MONITORING & OBSERVABILITY

### **Dashboard Performance Metrics**
`/lib/monitoring.ts`

```typescript
export async function trackPerformance(
  metricName: string,
  value: number,
  tags?: Record<string, string>
) {

  // Send to your monitoring service (Vercel Analytics, Datadog, etc)
  await fetch('https://api.vercel.com/v1/analytics', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.VERCEL_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      metric: metricName,
      value,
      timestamp: Date.now(),
      tags
    })
  })
}

// Usage
const startTime = Date.now()
const response = await fetch('https://api.perplexity.ai/...')
const latency = Date.now() - startTime

await trackPerformance('api_latency', latency, {
  provider: 'perplexity',
  endpoint: 'market_temperature'
})
```

---

## 🧪 TESTING STRATEGY

### **Unit Tests for AI Scoring**
`/__tests__/intentScoring.test.ts`

```typescript
import { calculateIntentScore } from '@/lib/intentScoring'

describe('Buyer Intent Scoring', () => {

  it('should give high score for frequent viewer', () => {
    const lead = {
      property_views_7d: 12,
      email_opens_7d: 5,
      email_clicks_7d: 3,
      last_activity: new Date().toISOString()
    }

    const score = calculateIntentScore(lead)
    expect(score).toBeGreaterThan(70)
  })

  it('should give low score for inactive lead', () => {
    const lead = {
      property_views_7d: 1,
      email_opens_7d: 0,
      email_clicks_7d: 0,
      last_activity: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days ago
    }

    const score = calculateIntentScore(lead)
    expect(score).toBeLessThan(20)
  })
})
```

---

## 🚀 DEPLOYMENT CHECKLIST

### **Pre-Launch**
- [ ] Run all database migrations
- [ ] Set environment variables (API keys)
- [ ] Enable Supabase RLS policies
- [ ] Configure n8n workflows
- [ ] Set up monitoring/alerting
- [ ] Load test (100 concurrent users)
- [ ] Security audit (OWASP Top 10)

### **Go-Live**
- [ ] Deploy to production (Coolify/Vercel)
- [ ] DNS configured
- [ ] SSL certificate active
- [ ] Train 5 pilot agents
- [ ] Monitor error rates (target: <0.1%)
- [ ] Monitor API costs (target: <$3,500/mo)

### **Post-Launch**
- [ ] Collect agent feedback (week 1)
- [ ] Optimize slow queries
- [ ] A/B test dashboard layouts
- [ ] Add more AI features based on usage
- [ ] Scale to 25 agents (month 2)
- [ ] Scale to 100 agents (month 6)

---

## 📖 DOCUMENTATION

All code includes:
- **JSDoc comments** for functions
- **Type annotations** for TypeScript
- **README files** for complex features
- **Inline comments** for tricky logic
- **API documentation** (Swagger/OpenAPI)

---

**Built by: Claude (AI Architect) + Kelvin (Technical Lead)**
**For: Hodges & Fooshee Realty**
**Stack: Next.js 14, Supabase, 4 AI APIs, n8n**
**Target: Become #1 tech-forward brokerage in Middle Tennessee**
