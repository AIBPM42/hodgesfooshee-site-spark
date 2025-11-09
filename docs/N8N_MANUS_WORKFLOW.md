# n8n Workflow: Manus → Supabase Insider Listings

## Overview
This n8n workflow syncs exclusive property listings from Manus to Supabase's `insider_listings` table, powering the "Nashville Insider Access" section on the homepage.

---

## Architecture

```
Manus API
    ↓
n8n Workflow (transforms data)
    ↓
Supabase insider_listings table
    ↓
Homepage (fetches top 3 listings)
```

---

## Database Setup

### 1. Apply Migration
Run this SQL in **Supabase Dashboard → SQL Editor**:

```sql
-- Located at: supabase/migrations/20251020_create_insider_listings_table.sql
```

This creates:
- ✅ `insider_listings` table with proper schema
- ✅ RLS policies (public read, service role write)
- ✅ Indexes for performance
- ✅ Auto-updating `updated_at` trigger

### 2. Table Schema

```typescript
interface InsiderListing {
  id: string;                    // Unique listing ID from Manus
  tag: 'EXCLUSIVE' | 'COMING SOON' | 'OFF-MARKET';
  title: string;                 // Main property title
  subtitle?: string;             // Location/area
  stat_left_label: string;       // e.g., "Price Range"
  stat_left_value: string;       // e.g., "$1.2M - $1.4M"
  stat_right_label: string;      // e.g., "Details"
  stat_right_value: string;      // e.g., "5 Beds | 4 Baths"
  image: string;                 // Property image URL
  href: string;                  // Link to property details
  sort_order: number;            // Display order (1, 2, 3...)
  is_active: boolean;            // Show on homepage
  created_at: timestamp;
  updated_at: timestamp;
}
```

---

## n8n Workflow Configuration

### Nodes Required

1. **Schedule Trigger**
   - Frequency: Every 30 minutes
   - Or: Webhook trigger from Manus

2. **HTTP Request - Fetch Manus Data**
   - Method: GET
   - URL: `[Your Manus API endpoint]`
   - Authentication: Bearer token
   - Headers:
     ```json
     {
       "Authorization": "Bearer {{$env.MANUS_API_KEY}}",
       "Content-Type": "application/json"
     }
     ```

3. **Function - Transform Data**
   ```javascript
   // Transform Manus format to InsiderListing format
   const manusListing = $input.item.json;

   // Determine tag based on status
   let tag = 'EXCLUSIVE';
   if (manusListing.status === 'coming_soon') tag = 'COMING SOON';
   if (manusListing.status === 'off_market') tag = 'OFF-MARKET';

   // Format price
   const priceMin = manusListing.price?.min?.toLocaleString('en-US');
   const priceMax = manusListing.price?.max?.toLocaleString('en-US');
   const priceRange = priceMin && priceMax
     ? `$${priceMin} - $${priceMax}`
     : manusListing.price?.current?.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

   // Format details
   const beds = manusListing.details?.beds || '?';
   const baths = manusListing.details?.baths || '?';
   const details = `${beds} Beds | ${baths} Baths`;

   return {
     id: manusListing.id,
     tag: tag,
     title: manusListing.title || 'Exclusive Property',
     subtitle: manusListing.address?.city || '',
     stat_left_label: 'Price Range',
     stat_left_value: priceRange,
     stat_right_label: 'Details',
     stat_right_value: details,
     image: manusListing.media?.primaryImage || '/hodges-hero-bg.jpg',
     href: `/property/${manusListing.id}`,
     sort_order: manusListing.sortOrder || 0,
     is_active: true
   };
   ```

4. **Supabase - Upsert Listings**
   - Operation: Upsert
   - Table: `insider_listings`
   - Conflict Column: `id`
   - Return: Updated rows
   - Authentication:
     - URL: `{{$env.SUPABASE_URL}}`
     - API Key: `{{$env.SUPABASE_SERVICE_ROLE_KEY}}`

5. **Supabase - Deactivate Old Listings** (Optional)
   - Operation: Update
   - Table: `insider_listings`
   - Filter: `updated_at < now() - interval '24 hours'`
   - Set: `is_active = false`

---

## Environment Variables in n8n

Add these to your n8n instance:

```env
MANUS_API_KEY=your_manus_api_key_here
SUPABASE_URL=https://xhqwmtzawqfffepcqxwf.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

---

## Testing the Workflow

### 1. Manual Trigger
Run the workflow manually in n8n to test the connection and transformation.

### 2. Check Supabase
```sql
SELECT * FROM insider_listings ORDER BY sort_order;
```

Expected result: 3+ rows with `is_active = true`

### 3. Check Homepage
Visit `http://localhost:3000` and scroll to "Nashville Insider Access" section.
- Should show 3 cards
- Each card should have real data from Manus
- Images, prices, and details should display correctly

---

## Fallback Behavior

If the `insider_listings` table is empty, the homepage will show **mock data** from `getMockInsiderListings()` in [lib/manus/fetchInsider.ts](../lib/manus/fetchInsider.ts).

This ensures the site never breaks if:
- n8n workflow is down
- Manus API is unavailable
- No active listings exist

---

## Monitoring

### n8n Workflow Logs
Check n8n execution history for:
- ✅ Successful syncs
- ❌ API errors
- ⚠️ Data transformation issues

### Supabase Logs
Query recent updates:
```sql
SELECT
  id,
  title,
  tag,
  is_active,
  updated_at
FROM insider_listings
ORDER BY updated_at DESC
LIMIT 10;
```

### Homepage Console
Check browser console for:
- `[Insider] No insider listings available yet` - Table is empty
- `[Insider] Error fetching listings` - Database connection issue

---

## Maintenance

### Update Listing Data
n8n workflow automatically syncs every 30 minutes. To force an update:
1. Go to n8n workflow
2. Click "Execute Workflow"
3. Wait for completion
4. Refresh homepage

### Deactivate a Listing
```sql
UPDATE insider_listings
SET is_active = false
WHERE id = 'listing-id-here';
```

### Reorder Listings
```sql
UPDATE insider_listings SET sort_order = 1 WHERE id = 'listing-1';
UPDATE insider_listings SET sort_order = 2 WHERE id = 'listing-2';
UPDATE insider_listings SET sort_order = 3 WHERE id = 'listing-3';
```

---

## Troubleshooting

### Homepage shows mock data instead of real listings
**Cause:** `insider_listings` table is empty or has no active listings.

**Fix:**
1. Check if migration was applied: `SELECT * FROM insider_listings LIMIT 1;`
2. If table doesn't exist, run migration
3. If table is empty, run n8n workflow manually
4. Check workflow logs for errors

### n8n workflow fails with 403 Forbidden
**Cause:** Using anon key instead of service_role key.

**Fix:**
Use `SUPABASE_SERVICE_ROLE_KEY` (not `SUPABASE_ANON_KEY`) in n8n Supabase node.

### Listings not updating on homepage
**Cause:** Next.js ISR cache.

**Fix:**
```bash
# Option 1: Wait 30 minutes (cache expires)
# Option 2: Hard refresh browser (Cmd+Shift+R)
# Option 3: Restart dev server
```

---

## Next Steps

1. ✅ Apply `insider_listings` migration
2. ✅ Create n8n workflow with nodes above
3. ✅ Add environment variables to n8n
4. ✅ Test manual execution
5. ✅ Verify data appears on homepage
6. ✅ Enable scheduled trigger (every 30 min)
7. ✅ Monitor for 24 hours
8. ✅ Remove mock data fallback (optional)

---

## API Keys Not Needed

Since Manus data is synced via n8n, you **do not need** to add a Manus API key in the Super Admin settings. The Manus section in `/admin/settings/keys` can be:
- Removed (clean up UI)
- Left in place (for future use)
- Repurposed for n8n webhook authentication

---

**Questions?** Check n8n execution logs and Supabase table data first.
