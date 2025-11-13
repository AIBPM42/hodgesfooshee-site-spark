# Production Fixes Required for RAG Upload Feature

## ✅ What's Working (Local/Testing)
- Storage buckets created (`kb-uploads`, `image-edits`)
- File uploads to Supabase storage
- RLS policies temporarily disabled for testing

## ⚠️ Critical Fixes Needed Before Production

### 1. **Authentication Integration**
**File**: `components/rag/KBUploadCard.tsx:75`

**Current (TEMP)**:
```typescript
const userId = user?.id || '0ecab564-199f-47f3-a4b8-42da61b427d2'; // TEMP FALLBACK
```

**Fix Required**:
```typescript
const { data: { user } } = await supabase.auth.getUser();
if (!user) {
  toast.error('You must be logged in to upload documents');
  return;
}
const userId = user.id;
```

**Action**: Remove fallback ID, enforce proper authentication

---

### 2. **RLS Policies - Restore User Isolation**
**Location**: Supabase SQL Editor

**Current (TEMP)**:
- Policies allow ANY user to upload/read/delete from `kb-uploads`
- No folder path validation
- No user isolation

**Fix Required** - Run this SQL:
```sql
-- Drop temporary policies
DROP POLICY IF EXISTS "temp_kb_insert" ON storage.objects;
DROP POLICY IF EXISTS "temp_kb_select" ON storage.objects;
DROP POLICY IF EXISTS "temp_kb_delete" ON storage.objects;

-- Restore professional user-isolated policies
CREATE POLICY "Users can upload own kb documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'kb-uploads' AND
  (storage.foldername(name))[1] = (auth.uid())::text
);

CREATE POLICY "Users can read own kb documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'kb-uploads' AND
  (storage.foldername(name))[1] = (auth.uid())::text
);

CREATE POLICY "Users can delete own kb documents"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'kb-uploads' AND
  (storage.foldername(name))[1] = (auth.uid())::text
);

-- Public read for RAG (optional - remove if docs should be private)
CREATE POLICY "Public can read kb-uploads"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'kb-uploads');
```

---

### 3. **n8n Webhook Configuration**
**File**: `.env.local` → Add to production env

**Current**:
```bash
N8N_EMBED_WEBHOOK_URL=https://n8n.aicustomautomations.com/webhook/3153b780-25e6-4f85-9a5d-8cdf66cd2acb
N8N_EMBED_WEBHOOK_SECRET=your-secret-here  # ⚠️ PLACEHOLDER
```

**Fix Required**:
1. Get actual webhook secret from n8n workflow settings
2. Add to production environment variables (Vercel/Coolify)
3. OR remove secret validation from `app/api/kb/ingest/route.ts:29-31` if webhook doesn't require it

---

### 4. **Image Uploads (Same Issues)**
**Files**:
- `app/api/image-history/log/route.ts:64` - uses `image-edits` bucket
- Same RLS policy fixes needed for `image-edits` bucket

---

## 🔒 Security Checklist Before Production

- [ ] Remove hardcoded fallback user ID from `KBUploadCard.tsx:75`
- [ ] Restore user-isolated RLS policies in Supabase
- [ ] Configure actual n8n webhook secret
- [ ] Test with real authenticated users
- [ ] Verify users can only see/delete their own uploads
- [ ] Remove debug `console.log` statements from `KBUploadCard.tsx:61,70,72`
- [ ] Remove "BUTTON CLICKED!" log from `KBUploadCard.tsx:204`

---

## 📝 Production Environment Variables Needed

Add to Vercel/Coolify:
```bash
N8N_EMBED_WEBHOOK_URL=https://n8n.aicustomautomations.com/webhook/[actual-id]
N8N_EMBED_WEBHOOK_SECRET=[actual-secret-from-n8n]
```
