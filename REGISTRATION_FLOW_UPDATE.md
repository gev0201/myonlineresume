# Registration Flow Update - Profile Creation

## Changes Made

### 1. Automatic Profile Creation
When a user registers, the system now automatically:
- Creates a user record in the `Users` table
- Stores the hashed password in the `Secret` table
- **NEW:** Creates a profile entry in the `Profiles` table with a unique `UserUrl`

### 2. UserUrl Generation

#### Format:
```
{firstname}-{lastname}-{unique-hash}
```

#### Example:
```
armen-petrosyan-a3f9c2
```

#### Implementation Details:
- **Normalization**: Names are converted to lowercase, special characters removed, spaces replaced with hyphens
- **Unique Hash**: 6-character hash generated from userId and timestamp using SHA-256
- **Collision Prevention**: Hash ensures uniqueness even for users with identical names

### 3. New Utility Functions

Created `lib/utils.ts` with:

#### `generateUserUrl(firstName, lastName, userId)`
- Normalizes first and last names
- Generates a 6-character unique hash
- Returns formatted URL slug

#### `isUserUrlUnique(pool, userUrl)` 
- Checks if a UserUrl already exists in the database
- Returns boolean for uniqueness validation

### 4. Database Operations

The registration transaction now includes:

```sql
-- Step 1: Create User
INSERT INTO "Users" ("FirstName", "LastName", "Phone", "Email", "IsActive")
VALUES ($1, $2, $3, $4, $5)
RETURNING "Id"

-- Step 2: Store Password Hash
INSERT INTO "Secret" ("UserId", "PassHash")
VALUES ($1, $2)

-- Step 3: Create Profile with UserUrl (NEW)
INSERT INTO "Profiles" ("UserId", "UserUrl")
VALUES ($1, $2)
```

### 5. API Response Update

The registration endpoint now returns:

```json
{
  "success": true,
  "message": "Account created successfully",
  "userId": 123,
  "userUrl": "armen-petrosyan-a3f9c2"
}
```

## Testing

### Test Cases:

1. **Basic Registration**
   - Input: Armen Petrosyan
   - Expected URL: `armen-petrosyan-{hash}`

2. **Special Characters**
   - Input: Արմեն Պետրոսյան
   - Expected URL: `{normalized}-{normalized}-{hash}`

3. **Multiple Spaces**
   - Input: "John   Paul   Smith"
   - Expected URL: `john-paul-smith-{hash}`

4. **Duplicate Names**
   - Two users named "John Smith"
   - Expected: Different hashes ensure unique URLs
     - User 1: `john-smith-a3f9c2`
     - User 2: `john-smith-b7e4d1`

## Profile URL Access

Users can access their public profile at:
```
https://myonlineresume.am/{userUrl}
```

Example:
```
https://myonlineresume.am/armen-petrosyan-a3f9c2
```

## Database Schema

### Profiles Table
```sql
CREATE TABLE "Profiles" (
    "UserId"   INT PRIMARY KEY REFERENCES "Users"("Id") ON DELETE CASCADE,
    "UserUrl"  VARCHAR(100) NOT NULL UNIQUE,
    "Summary"  TEXT,
    ...
);
```

- `UserId`: Foreign key to Users table (one-to-one)
- `UserUrl`: Unique URL slug for the profile
- Other fields remain NULL until user completes their profile

## Benefits

1. **Immediate Profile Creation**: Users get their profile URL immediately upon registration
2. **Unique URLs**: Hash ensures no collisions even with identical names
3. **SEO Friendly**: Clean, readable URLs
4. **Scalable**: Hash-based approach works for millions of users
5. **Atomic Operation**: All three inserts happen in a single transaction

## Future Enhancements

1. **Custom URLs**: Allow users to customize their URL (with availability check)
2. **URL History**: Track URL changes if users update their names
3. **Vanity URLs**: Premium feature for custom short URLs
4. **Analytics**: Track profile views via UserUrl
