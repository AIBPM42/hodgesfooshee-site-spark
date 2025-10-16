# Hodges & Fooshee Real Estate - Smart Plan Integration

## Project Overview

**hodgesfooshee-site-spark** is a Next.js-based real estate platform integrating Realtyna MLS data with Smart Plan automation. This project provides property search, agent discovery, and MLS synchronization capabilities.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **MLS Integration**: Realtyna RealtyFeed API
- **Styling**: Tailwind CSS + shadcn/ui
- **Type Safety**: TypeScript + Zod
- **State Management**: React Query

## Architecture

### Next.js App Router Structure
```
/app
  /api
    /search       - Property search endpoint
    /member       - Agent/member lookup
    /metadata     - MLS metadata service
  /search
    /page.tsx     - Search results UI
    /[id]         - Property detail pages

/supabase
  /functions      - Edge functions for MLS sync
  /migrations     - Database schema versions

/lib
  /mls.ts         - Realtyna API client
  /utils.ts       - Shared utilities
```

## Smart Plan Coverage

The platform supports the following Smart Plan endpoints:

- ✅ **Property Search** - `/api/search`
- ✅ **Agent Lookup** - `/api/member`
- ✅ **ZIP Code Data** - `mls_postal_codes` table
- ✅ **Open Houses** - `mls_open_houses` table
- ⚠️ **Schools** - Pending implementation

## Supabase Schema

Core tables:
- `mls_listings` - Raw MLS property data
- `mls_listings_view` - Frontend-optimized view with field mappings
- `mls_members` - Agent/broker data
- `mls_offices` - Office information
- `mls_postal_codes` - ZIP code metadata
- `mls_open_houses` - Open house schedules
- `saved_searches` - User-saved search criteria (pending)

## Getting Started

### Prerequisites
- Node.js >= 20
- Supabase project
- Realtyna MLS API credentials

### Environment Variables
Create a `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
MLS_CLIENT_ID=your_realtyna_client_id
MLS_CLIENT_SECRET=your_realtyna_client_secret
MLS_BASE_URL=https://api.realtyfeed.com/v1
```

### Installation
```sh
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Deployment

This project is configured for:
- **Hosting**: Vercel/Railway
- **Database**: Supabase Cloud
- **CI/CD**: GitHub Actions with Claude audit workflow

## Audit & Quality Standards

This repository follows strict architectural standards enforced by Claude AI audit agent. See [CLAUDE.md](CLAUDE.md) for details.

Key standards:
- ✅ Next.js App Router architecture (no Vite/React artifacts)
- ✅ Deterministic schema design
- ✅ RESO Output compliance
- ✅ Production-ready error handling

## API Documentation

### Property Search
```typescript
POST /api/search
{
  "city": "Nashville",
  "minPrice": "200000",
  "maxPrice": "500000",
  "beds": "3",
  "baths": "2"
}
```

### Agent Lookup
```typescript
GET /api/member?memberKey=AGENT123
```

## Related Resources

- [CLAUDE.md](CLAUDE.md) - Claude audit standards
- [Realtyna API Docs](https://realtyna.atlassian.net/wiki/spaces/RA/overview)
- [Staging Demo](https://hodges-demo.aicustomautomations.com)
- [RealtyFeed Dashboard](https://dashboard.realtyfeed.com)

## License

Proprietary - Hodges & Fooshee Real Estate
