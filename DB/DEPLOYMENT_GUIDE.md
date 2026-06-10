# 🚀 Database Deployment Guide

## Complete Production Deployment for myonlineresume.am

---

## 📋 Database Structure Overview

### **Tables (7):**
1. **Users** - User accounts (Email & Phone UNIQUE)
2. **Secret** - Password hashes (bcrypt)
3. **LanguageDicts** - Available languages (6 entries)
4. **LanguageLevelDict** - Proficiency levels (5 entries)
5. **SkillsLevelDict** - Skill levels (4 entries)
6. **Profiles** - User resumes (JSONB data)
7. **ProfileLanguages** - User languages (junction table)

### **Key Features:**
- ✅ Email UNIQUE constraint
- ✅ Phone UNIQUE constraint
- ✅ Password storage with bcrypt
- ✅ JSONB columns for flexible resume data
- ✅ GIN indexes for fast JSONB queries
- ✅ Foreign key constraints with CASCADE
- ✅ Auto-updating timestamps

---

## 🎯 Deployment Steps

### **Option 1: Fresh Database (Recommended for Production)**

#### Step 1: Create Database
```bash
psql -U postgres
```

```sql
CREATE DATABASE myonlineresume
    ENCODING  'UTF8'
    LC_COLLATE = 'en_US.UTF-8'
    LC_CTYPE   = 'en_US.UTF-8'
    TEMPLATE   = template0;

\c myonlineresume
```

#### Step 2: Run Complete Deployment Script
```bash
psql -U postgres -d myonlineresume -f c:/MyProject/MyResumeOnline/DB/COMPLETE_DEPLOYMENT_SCRIPT.sql
```

**This will create:**
- All 7 tables
- All indexes
- All constraints
- All dictionary data
- Verification queries

---

### **Option 2: Existing Database (Update)**

If you already have a database and want to update it:

#### Step 1: Backup First!
```bash
pg_dump -U postgres myonlineresume > backup_$(date +%Y%m%d).sql
```

#### Step 2: Run Migration Scripts in Order
```bash
# 1. Add Secret table (if not exists)
psql -U postgres -d myonlineresume -f c:/MyProject/MyResumeOnline/DB/add_secret_table.sql

# 2. Update Profiles schema (add new columns)
psql -U postgres -d myonlineresume -f c:/MyProject/MyResumeOnline/DB/update_profiles_schema.sql

# 3. Add Phone unique constraint
psql -U postgres -d myonlineresume -f c:/MyProject/MyResumeOnline/DB/add_unique_phone_constraint.sql
```

---

## 🗄️ Database Schema Details

### **Users Table**
```sql
"Id"        SERIAL PRIMARY KEY
"FirstName" VARCHAR(100) NOT NULL
"LastName"  VARCHAR(100) NOT NULL
"Phone"     VARCHAR(20) NOT NULL UNIQUE  ← UNIQUE
"Email"     VARCHAR(254) NOT NULL UNIQUE ← UNIQUE
"Address"   VARCHAR(300)
"IsActive"  BOOLEAN DEFAULT TRUE
```

### **Secret Table**
```sql
"Id"        SERIAL PRIMARY KEY
"UserId"    INT UNIQUE → Users.Id (CASCADE)
"PassHash"  VARCHAR(255) NOT NULL (bcrypt)
"CreatedAt" TIMESTAMP
"UpdatedAt" TIMESTAMP (auto-update trigger)
```

### **Profiles Table**
```sql
"UserId"       INT PRIMARY KEY → Users.Id (CASCADE)
"UserUrl"      VARCHAR(100) UNIQUE
"Summary"      TEXT
"Experience"   JSONB  ← Array of work experiences
"Education"    JSONB  ← Array of education entries
"Skills"       JSONB  ← Array of {skill: levelId}
"Certificates" TEXT   ← Newline-separated
"Hobbies"      TEXT
```

### **ProfileLanguages Table**
```sql
"Id"         SERIAL PRIMARY KEY
"UserId"     INT → Profiles.UserId (CASCADE)
"LanguageId" SMALLINT → LanguageDicts.Id
"LevelId"    SMALLINT → LanguageLevelDict.Id
UNIQUE(UserId, LanguageId)
```

---

## 📊 Dictionary Data

### **LanguageDicts (6 entries)**
1. Armenian
2. English
3. French
4. Russian
5. German
6. Spanish

### **LanguageLevelDict (5 entries)**
1. Elementary
2. Conversational
3. Working Proficiency
4. Fluent
5. Native

### **SkillsLevelDict (4 entries)**
1. Beginner
2. Intermediate
3. Advanced
4. Expert

---

## 🔍 Verification

After deployment, verify with:

```sql
-- Check all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check row counts
SELECT 'Users' AS table_name, COUNT(*) FROM "Users"
UNION ALL SELECT 'Secret', COUNT(*) FROM "Secret"
UNION ALL SELECT 'Profiles', COUNT(*) FROM "Profiles"
UNION ALL SELECT 'ProfileLanguages', COUNT(*) FROM "ProfileLanguages"
UNION ALL SELECT 'LanguageDicts', COUNT(*) FROM "LanguageDicts"
UNION ALL SELECT 'LanguageLevelDict', COUNT(*) FROM "LanguageLevelDict"
UNION ALL SELECT 'SkillsLevelDict', COUNT(*) FROM "SkillsLevelDict";

-- Check constraints
SELECT conname, contype 
FROM pg_constraint 
WHERE conrelid = '"Users"'::regclass;
-- Should show: Users_pkey, Users_Email_key, Users_Phone_key

-- Check indexes
SELECT indexname 
FROM pg_indexes 
WHERE tablename IN ('Users', 'Profiles', 'ProfileLanguages', 'Secret')
ORDER BY indexname;
```

---

## 🔒 Security Checklist

- ✅ Passwords stored as bcrypt hashes (never plain text)
- ✅ Email and Phone are unique (prevents duplicates)
- ✅ Foreign keys with CASCADE (automatic cleanup)
- ✅ Indexes on frequently queried columns
- ✅ JSONB with GIN indexes (fast searches)
- ✅ Timestamps for audit trail

---

## 🌐 Environment Variables

Make sure your `.env.local` has:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=myonlineresume
DB_USER=postgres
DB_PASSWORD=your_password_here
```

---

## 🧪 Testing After Deployment

### 1. Test User Registration
```bash
# Start your Next.js app
npm run dev

# Go to http://localhost:3000/sign-up
# Register a new user
```

### 2. Verify Database Entry
```sql
SELECT u."Id", u."FirstName", u."Email", u."Phone", p."UserUrl"
FROM "Users" u
LEFT JOIN "Profiles" p ON p."UserId" = u."Id"
ORDER BY u."Id" DESC
LIMIT 1;
```

### 3. Test Login
```bash
# Go to http://localhost:3000/sign-in
# Login with registered user
```

---

## 📝 Maintenance Scripts

### Clean All User Data (Keep Dictionaries)
```bash
psql -U postgres -d myonlineresume -f c:/MyProject/MyResumeOnline/DB/cleanup_all_data.sql
```

### Clean Everything (Including Dictionaries)
```bash
psql -U postgres -d myonlineresume -f c:/MyProject/MyResumeOnline/DB/cleanup_all_data_including_dicts.sql
```

---

## 🚨 Troubleshooting

### Issue: "could not create unique index"
**Cause:** Duplicate phone numbers exist
**Fix:**
```sql
-- Find duplicates
SELECT "Phone", COUNT(*) 
FROM "Users" 
GROUP BY "Phone" 
HAVING COUNT(*) > 1;

-- Remove duplicates manually
```

### Issue: "relation already exists"
**Cause:** Tables already created
**Fix:** Script uses `IF NOT EXISTS`, safe to re-run

### Issue: "encoding mismatch"
**Cause:** Database encoding not UTF8
**Fix:** Drop and recreate database with UTF8 encoding

---

## ✅ Production Checklist

Before deploying to production server:

- [ ] Backup existing database
- [ ] Test script on staging environment
- [ ] Verify all dictionary data loaded
- [ ] Check all constraints are in place
- [ ] Test user registration flow
- [ ] Test login flow
- [ ] Test profile creation
- [ ] Verify JSONB data saves correctly
- [ ] Check all indexes created
- [ ] Update environment variables
- [ ] Test from production URL

---

## 📞 Support

If you encounter issues:
1. Check PostgreSQL logs
2. Verify PostgreSQL version (17+)
3. Check user permissions
4. Verify network connectivity
5. Review error messages carefully

---

## 🎉 Success!

If verification queries show correct counts and no errors, your database is ready for production use!

**Expected Counts After Fresh Deployment:**
- Users: 0
- Secret: 0
- Profiles: 0
- ProfileLanguages: 0
- LanguageDicts: 6
- LanguageLevelDict: 5
- SkillsLevelDict: 4
