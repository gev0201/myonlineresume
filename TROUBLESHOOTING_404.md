# Troubleshooting 404 Error on Profile Pages

## Issue
Getting 404 error when accessing user profile at `/{userUrl}` after login.

## Possible Causes & Solutions

### 1. Next.js Dev Server Needs Restart

**Problem:** Dynamic routes created after the dev server started may not be recognized.

**Solution:**
```bash
# Stop the dev server (Ctrl+C)
# Then restart it
npm run dev
```

### 2. Next.js Cache Issue

**Problem:** Next.js cache may be stale.

**Solution:**
```bash
# Delete .next folder and restart
rm -rf .next
npm run dev
```

Or on Windows:
```bash
rmdir /s /q .next
npm run dev
```

### 3. Verify Database Has Correct UserUrl

**Check the database:**
```sql
SELECT u."Id", u."FirstName", u."LastName", p."UserUrl"
FROM "Users" u
LEFT JOIN "Profiles" p ON u."Id" = p."UserId"
ORDER BY u."Id";
```

**Expected format:**
- `firstname-lastname-{userId}-{hash}`
- Example: `walod-mialot-4-f4cfa7`

### 4. Verify Profile Record Exists

**Check if profile was created during registration:**
```sql
SELECT * FROM "Profiles" WHERE "UserUrl" = 'walod-mialot-4-f4cfa7';
```

If no results, the profile wasn't created. Run:
```sql
-- Manually create profile for user ID 4
INSERT INTO "Profiles" ("UserId", "UserUrl")
VALUES (4, 'walod-mialot-4-f4cfa7');
```

### 5. Check Browser Console

Open browser DevTools (F12) and check:
- Console tab for JavaScript errors
- Network tab to see if the request is being made
- Check the actual URL being requested

### 6. Verify File Structure

Ensure the dynamic route file exists:
```
app/
  [userUrl]/
    page.tsx
```

**NOT:**
```
app/
  %5BuserUrl%5D/   ← Wrong (URL encoded)
    page.tsx
```

### 7. Hard Refresh Browser

Sometimes the browser caches the 404 page.

**Solution:**
- Windows/Linux: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`

Or clear browser cache completely.

## Step-by-Step Debugging

### Step 1: Verify Database
```sql
-- Check user exists
SELECT * FROM "Users" WHERE "Id" = 4;

-- Check profile exists
SELECT * FROM "Profiles" WHERE "UserId" = 4;

-- Check the exact UserUrl
SELECT "UserUrl" FROM "Profiles" WHERE "UserId" = 4;
```

### Step 2: Test Direct Database Query
Create a test file to verify database connection:

**File:** `app/api/test-profile/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userUrl = searchParams.get('userUrl');
  
  const result = await pool.query(
    `SELECT u."Id", u."FirstName", u."LastName", p."UserUrl"
     FROM "Profiles" p
     JOIN "Users" u ON p."UserId" = u."Id"
     WHERE p."UserUrl" = $1`,
    [userUrl]
  );
  
  return NextResponse.json({ 
    found: result.rows.length > 0,
    data: result.rows[0] || null 
  });
}
```

Test: `http://localhost:3000/api/test-profile?userUrl=walod-mialot-4-f4cfa7`

### Step 3: Check Next.js Logs

Look at the terminal where `npm run dev` is running. Check for:
- Compilation errors
- Route registration messages
- Database connection errors

### Step 4: Verify Environment Variables

Check if `.env.local` is in the correct location:
- Should be: `c:/MyProject/MyResumeOnline/myonlineresume/.env.local`
- NOT: `c:/MyProject/MyResumeOnline/myonlineresume/app/env.local`

## Most Likely Solution

**99% of the time, the issue is:**

1. **Dev server needs restart** after creating the `[userUrl]` folder
2. **Profile not created** during registration (check database)

**Quick Fix:**
```bash
# 1. Stop dev server (Ctrl+C)
# 2. Delete cache
rm -rf .next
# 3. Restart
npm run dev
# 4. Try accessing the profile again
```

## Verify Registration Created Profile

Check the registration API logs. The response should include:
```json
{
  "success": true,
  "userId": 4,
  "userUrl": "walod-mialot-4-f4cfa7"
}
```

If `userUrl` is missing, the profile creation failed during registration.

## Manual Profile Creation (If Needed)

If profile doesn't exist for user ID 4:

```sql
-- Get user info
SELECT "Id", "FirstName", "LastName" FROM "Users" WHERE "Id" = 4;

-- Create profile manually
INSERT INTO "Profiles" ("UserId", "UserUrl")
VALUES (4, 'walod-mialot-4-f4cfa7');
```

## Contact Support

If none of these solutions work, provide:
1. Terminal output from `npm run dev`
2. Browser console errors
3. Database query results for the user
4. Registration API response
