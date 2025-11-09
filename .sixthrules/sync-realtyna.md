# Workflow: sync-realtyna

## Description
Sync Realtyna endpoints and scaffold UI components

## Steps
1. Parse MLS Router docs and generate API handlers using Claude
2. Wire handlers to Supabase logging
3. Scaffold MemberCard, OfficeCard, RoomDetails components
4. Patch image logic across ListingCard and PropertyPage
5. Audit Supabase schema for missing RLS policies
