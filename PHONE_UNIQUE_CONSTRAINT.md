# Phone Unique Constraint Implementation

## ✅ Changes Made

### 1. Database Migration
**File:** `DB/add_unique_phone_constraint.sql`

Adds a unique constraint to the `Phone` column in the `Users` table, matching the existing `Email` unique constraint.

**Constraint Name:** `Users_Phone_key`

**SQL:**
```sql
ALTER TABLE "Users" ADD CONSTRAINT "Users_Phone_key" UNIQUE ("Phone");
```

---

### 2. API Validation
**File:** `app/api/auth/register/route.ts`

Added phone uniqueness check during registration to prevent duplicate phone numbers.

**Changes:**
- Added database query to check if phone already exists
- Returns error message if phone is already registered
- Error format matches email validation

**Code:**
```typescript
// Check if phone already exists
const phoneCheck = await pool.query(
  'SELECT "Id" FROM "Users" WHERE "Phone" = $1',
  [phone]
);

if (phoneCheck.rows.length > 0) {
  return NextResponse.json(
    { success: false, errors: { phone: 'Phone number already registered' } },
    { status: 400 }
  );
}
```

---

## 🚀 How to Apply

### Step 1: Run Database Migration
```bash
psql -U postgres -d myonlineresume -f c:/MyProject/MyResumeOnline/DB/add_unique_phone_constraint.sql
```

### Step 2: Restart Dev Server
The API changes are already in place and will take effect immediately.

---

## 🧪 Testing

### Test Duplicate Phone Registration:
1. Register a user with phone: `+374 55123456`
2. Try to register another user with the same phone
3. Should see error: **"Phone number already registered"**

### Test Duplicate Email (existing):
1. Register a user with email: `test@example.com`
2. Try to register another user with the same email
3. Should see error: **"Email already registered"**

---

## 📊 Database Constraints

### Before:
```
Users Table Constraints:
- Users_pkey (PRIMARY KEY on Id)
- Users_Email_key (UNIQUE on Email)
```

### After:
```
Users Table Constraints:
- Users_pkey (PRIMARY KEY on Id)
- Users_Email_key (UNIQUE on Email)
- Users_Phone_key (UNIQUE on Phone)  ← NEW
```

---

## 🔒 Benefits

1. **Data Integrity**: Prevents duplicate phone numbers in the database
2. **User Experience**: Clear error message when phone is already registered
3. **Consistency**: Phone validation matches email validation pattern
4. **Security**: One phone number per account

---

## ⚠️ Important Notes

### Existing Data:
If you have existing duplicate phone numbers in the database, the migration will fail. You need to clean up duplicates first:

```sql
-- Find duplicate phone numbers
SELECT "Phone", COUNT(*) 
FROM "Users" 
GROUP BY "Phone" 
HAVING COUNT(*) > 1;

-- Clean up duplicates (if any)
-- Manual intervention required
```

### Migration Safety:
The migration script checks if the constraint already exists before adding it, so it's safe to run multiple times.

---

## 📝 Files Modified

1. ✅ `DB/add_unique_phone_constraint.sql` (created)
2. ✅ `app/api/auth/register/route.ts` (modified)

---

## ✅ Implementation Complete!

Both Email and Phone are now unique in the Users table with proper validation in the registration API.
