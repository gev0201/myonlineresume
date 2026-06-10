# Fix User URL Format Issue

## Problem

Users registered before the URL format update have URLs in the old format:
- **Old format**: `firstname-lastname-hash` (e.g., `gevorg-gevorgyan-b62b30`)
- **New format**: `firstname-lastname-id-hash` (e.g., `gevorg-gevorgyan-3-b62b30`)

This causes 404 errors when trying to access their profile pages.

## Solution

You have **two options** to fix this:

---

### Option 1: Run Database Migration (Recommended)

This updates all existing UserUrls to the new format.

**Steps:**

1. Run the migration script:
```bash
psql -U postgres -d myonlineresume -f c:/MyProject/MyResumeOnline/DB/update_user_urls.sql
```

2. Verify the update:
```sql
SELECT "UserId", "UserUrl" FROM "Profiles";
```

**Expected Result:**
```
UserId | UserUrl
-------+--------------------------------
1      | armen-petrosyan-1-a3f9c2
3      | gevorg-gevorgyan-3-b62b30
```

---

### Option 2: Manual Database Update (Quick Fix)

Update the specific user's URL manually:

```sql
-- For user ID 3 (Gevorg Gevorgyan)
UPDATE "Profiles"
SET "UserUrl" = 'gevorg-gevorgyan-3-b62b30'
WHERE "UserId" = 3;
```

**Verify:**
```sql
SELECT "UserId", "UserUrl" FROM "Profiles" WHERE "UserId" = 3;
```

---

## After Fix

Once the database is updated, the profile will be accessible at:
```
http://localhost:3000/gevorg-gevorgyan-3-b62b30
```

The login response will also return the correct URL:
```json
{
  "userUrl": "gevorg-gevorgyan-3-b62b30"
}
```

---

## Prevention

All **new registrations** will automatically use the correct format because the `generateUserUrl()` function has been updated.

Only users registered **before** the format change need to be migrated.

---

## Testing

After running the migration:

1. **Login** at `/sign-in`
2. Check the response includes correct `userUrl` with user ID
3. **Verify redirect** to profile page works
4. **Access profile** directly at `/{userUrl}`

---

## Rollback (If Needed)

If you created a backup table:
```sql
-- Restore from backup
UPDATE "Profiles" p
SET "UserUrl" = b."UserUrl"
FROM "Profiles_Backup" b
WHERE p."UserId" = b."UserId";
```
