# Test Accounts for Hodges & Fooshee Realty

## 🔐 **Test Login Credentials**

After running the migration scripts, use these accounts for testing:

### **Super Admin (Broker/Owner)**
- **Email**: `admin@test.com`
- **Password**: `admin123`
- **Role**: `super_admin`
- **Access**: Full dashboard, agent management, content editing
- **URL**: http://localhost:3000/admin

### **Agent (Real Estate Agent)**
- **Email**: `agent@test.com`
- **Password**: `agent123`
- **Role**: `agent`
- **MLS Integration**: ✅ Has mock MLS profile
  - MLS Member Key: `TEST-MOCK-001`
  - MLS Member ID: `AGENT001`
  - Office: Hodges & Fooshee Realty
  - License: TN-12345-TEST
  - Designations: ABR, GRI, CRS
- **Access**: Agent dashboard, open houses, leads
- **URL**: http://localhost:3000/admin

### **Public User (Buyer/Seller)**
- **Email**: `buyer@test.com`
- **Password**: `buyer123`
- **Role**: `public_user`
- **Access**: Property search, saved searches, favorites
- **URL**: http://localhost:3000/

### **Owner/Production Accounts**
- `aicustomautomations@gmail.com` - Primary owner account
- `kelvin.g4277@gmail.com` - Secondary owner account
- `brandingandpublicitymarketing@gmail.com` - Marketing account

---

## 📋 **Setup Instructions**

### **1. Run Schema Migration**
```bash
# In Supabase SQL Editor, run:
supabase/migrations/20251017_add_mls_fields_to_agent_profiles.sql
```

### **2. (Optional) Clean Old Data**
```bash
# REVIEW FIRST, then run in SQL Editor:
supabase/migrations/MANUAL_cleanup_test_data.sql
```

### **3. Create Test Users**
```bash
# In Supabase SQL Editor, run:
supabase/migrations/MANUAL_create_test_users_with_mls.sql
```

### **4. Verify Setup**
```sql
-- Run this to check users were created:
SELECT
  u.email,
  p.role,
  ap.mls_member_key,
  ap.office_name
FROM auth.users u
JOIN profiles p ON u.id = p.id
LEFT JOIN agent_profiles ap ON u.id = ap.user_id
WHERE u.email LIKE '%hodgesfooshee.com' OR u.email LIKE '%test.com';
```

---

## 🧪 **Testing Workflows**

### **Admin Dashboard Testing**
1. Login as `admin@hodgesfooshee.com`
2. Verify dashboard shows:
   - Agent stats
   - Open house stats
   - MLS integration health
3. Navigate to `/admin/agents` to see agent list
4. Check agent shows MLS data (Member Key, Office)

### **Agent Profile Testing**
1. Login as `agent@hodgesfooshee.com`
2. View agent profile
3. Verify MLS fields are populated:
   - Photo from MLS
   - Office name
   - License number
   - Designations

### **Property Search Testing**
1. Login as `buyer@test.com`
2. Search for properties
3. Save a search
4. Add properties to favorites

---

## 🔄 **Realtyna MLS Integration**

The agent profile includes these MLS-linked fields:

| Field | Value | Source |
|-------|-------|--------|
| `mls_member_key` | TEST-MOCK-001 | RESO Member.MemberKey |
| `mls_member_id` | AGENT001 | RESO Member.MemberMlsId |
| `office_key` | OFFICE-TEST-001 | RESO Member.OfficeKey |
| `office_name` | Hodges & Fooshee Realty | RESO Member.OfficeName |
| `photo_url` | Generated avatar | RESO Member.MemberPhotoURL |
| `license_number` | TN-12345-TEST | RESO Member.MemberStateLicense |
| `designations` | ABR, GRI, CRS | RESO Member.MemberDesignation |
| `last_mls_sync` | Current timestamp | Sync tracking |

---

## ⚠️ **Important Notes**

- **DO NOT** use these credentials in production
- **Change passwords** immediately after initial setup
- **Backup database** before running cleanup scripts
- Test accounts use **mock MLS data** (not real MLS records)
- For real agent profiles, use the MLS lookup workflow

---

## 🔗 **Related Files**

- Schema migration: `supabase/migrations/20251017_add_mls_fields_to_agent_profiles.sql`
- Cleanup script: `supabase/migrations/MANUAL_cleanup_test_data.sql`
- User creation: `supabase/migrations/MANUAL_create_test_users_with_mls.sql`
- MLS integration guide: (See previous Claude message)

---

## 📞 **Need Help?**

If you encounter issues:
1. Check Supabase logs for errors
2. Verify schema migration ran successfully
3. Confirm RLS policies are enabled
4. Check that `profiles` and `agent_profiles` tables exist
