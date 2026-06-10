-- ============================================================
--  myonlineresume.am - COMPLETE DEPLOYMENT SCRIPT
--  PostgreSQL 17 - Production Ready
--  Version: 3.0
--  Last Updated: 2026-06-11
-- ============================================================
--  This script creates the complete database from scratch
--  including all tables, indexes, constraints, and dictionary data.
--
--  TABLE CREATION ORDER (respects FK dependencies):
--    1. Users
--    2. Secret (passwords)
--    3. LanguageDicts
--    4. LanguageLevelDict
--    5. SkillsLevelDict
--    6. Profiles
--    7. ProfileLanguages
-- ============================================================

-- ------------------------------------------------------------
--  STEP 1 - CREATE DATABASE (Run as superuser)
--  Uncomment and run this section ONCE, then connect to DB
-- ------------------------------------------------------------
-- CREATE DATABASE myonlineresume
--     ENCODING  'UTF8'
--     LC_COLLATE = 'en_US.UTF-8'
--     LC_CTYPE   = 'en_US.UTF-8'
--     TEMPLATE   = template0;
--
-- \c myonlineresume


-- ============================================================
--  TABLE 1: Users
-- ============================================================
CREATE TABLE IF NOT EXISTS "Users" (
    "Id"        SERIAL        PRIMARY KEY,
    "FirstName" VARCHAR(100)  NOT NULL,
    "LastName"  VARCHAR(100)  NOT NULL,
    "Phone"     VARCHAR(20)   NOT NULL,
    "Email"     VARCHAR(254)  NOT NULL,
    "Address"   VARCHAR(300),
    "IsActive"  BOOLEAN       NOT NULL DEFAULT TRUE
);

-- Add unique constraints
ALTER TABLE "Users" DROP CONSTRAINT IF EXISTS "Users_Email_key";
ALTER TABLE "Users" ADD CONSTRAINT "Users_Email_key" UNIQUE ("Email");

ALTER TABLE "Users" DROP CONSTRAINT IF EXISTS "Users_Phone_key";
ALTER TABLE "Users" ADD CONSTRAINT "Users_Phone_key" UNIQUE ("Phone");

COMMENT ON TABLE  "Users"             IS 'Registered users of myonlineresume.am';
COMMENT ON COLUMN "Users"."Phone"     IS 'International format, e.g. +374 55555555 - UNIQUE';
COMMENT ON COLUMN "Users"."Email"     IS 'RFC 5321 - max 254 chars - UNIQUE';
COMMENT ON COLUMN "Users"."Address"   IS 'User physical address (max 300 chars)';
COMMENT ON COLUMN "Users"."IsActive"  IS 'FALSE when user deactivates or subscription lapses';


-- ============================================================
--  TABLE 2: Secret (Password Storage)
-- ============================================================
CREATE TABLE IF NOT EXISTS "Secret" (
    "Id"        SERIAL       PRIMARY KEY,
    "UserId"    INT          NOT NULL UNIQUE
                             REFERENCES "Users"("Id")
                             ON DELETE CASCADE,
    "PassHash"  VARCHAR(255) NOT NULL,
    "CreatedAt" TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE  "Secret"            IS 'Stores bcrypt password hashes for users';
COMMENT ON COLUMN "Secret"."PassHash" IS 'bcrypt hash of user password (60 chars)';

-- Index for fast user lookup
CREATE INDEX IF NOT EXISTS idx_secret_userid ON "Secret" ("UserId");

-- Trigger to update UpdatedAt timestamp
CREATE OR REPLACE FUNCTION update_secret_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW."UpdatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_secret_timestamp ON "Secret";
CREATE TRIGGER trigger_update_secret_timestamp
    BEFORE UPDATE ON "Secret"
    FOR EACH ROW
    EXECUTE FUNCTION update_secret_timestamp();


-- ============================================================
--  TABLE 3: LanguageDicts (Lookup - Available Languages)
-- ============================================================
CREATE TABLE IF NOT EXISTS "LanguageDicts" (
    "Id"       SMALLSERIAL   PRIMARY KEY,
    "Language" VARCHAR(50)   NOT NULL UNIQUE
);

COMMENT ON TABLE "LanguageDicts" IS 'Dictionary of available languages';

INSERT INTO "LanguageDicts" ("Language") VALUES
    ('Armenian'),
    ('English'),
    ('French'),
    ('Russian'),
    ('German'),
    ('Spanish')
ON CONFLICT ("Language") DO NOTHING;


-- ============================================================
--  TABLE 4: LanguageLevelDict (Lookup - Proficiency Levels)
-- ============================================================
CREATE TABLE IF NOT EXISTS "LanguageLevelDict" (
    "Id"    SMALLSERIAL   PRIMARY KEY,
    "Level" VARCHAR(50)   NOT NULL UNIQUE
);

COMMENT ON TABLE "LanguageLevelDict" IS 'Dictionary of language proficiency levels';

INSERT INTO "LanguageLevelDict" ("Level") VALUES
    ('Elementary'),
    ('Conversational'),
    ('Working Proficiency'),
    ('Fluent'),
    ('Native')
ON CONFLICT ("Level") DO NOTHING;


-- ============================================================
--  TABLE 5: SkillsLevelDict (Lookup - Skill Proficiency)
-- ============================================================
CREATE TABLE IF NOT EXISTS "SkillsLevelDict" (
    "Id"    SMALLSERIAL   PRIMARY KEY,
    "Level" VARCHAR(50)   NOT NULL UNIQUE
);

COMMENT ON TABLE "SkillsLevelDict" IS 'Dictionary of skill proficiency levels';

-- Ordered 1=Beginner to 4=Expert
INSERT INTO "SkillsLevelDict" ("Level") VALUES
    ('Beginner'),
    ('Intermediate'),
    ('Advanced'),
    ('Expert')
ON CONFLICT ("Level") DO NOTHING;


-- ============================================================
--  TABLE 6: Profiles (User Resume/Portfolio)
-- ============================================================
CREATE TABLE IF NOT EXISTS "Profiles" (
    "UserId"       INT           PRIMARY KEY
                                 REFERENCES "Users"("Id")
                                 ON DELETE CASCADE,
    "UserUrl"      VARCHAR(100)  NOT NULL UNIQUE,
    "Summary"      TEXT,
    "Experience"   JSONB,
    "Education"    JSONB,
    "Skills"       JSONB,
    "Certificates" TEXT,
    "Hobbies"      TEXT
);

COMMENT ON TABLE  "Profiles"              IS 'Public resume/portfolio profile for each user';
COMMENT ON COLUMN "Profiles"."UserUrl"    IS 'URL slug, e.g. john-doe-123-abc';
COMMENT ON COLUMN "Profiles"."Summary"    IS 'Professional summary/bio';
COMMENT ON COLUMN "Profiles"."Experience" IS 'JSONB array: [{Number, Role, Company, StartFrom, Till, Responsibilities[]}]';
COMMENT ON COLUMN "Profiles"."Education"  IS 'JSONB array: [{From, Till, EducInstitution, Place, Occupation}]';
COMMENT ON COLUMN "Profiles"."Skills"     IS 'JSONB array: [{SkillName: SkillsLevelDict.Id}]';
COMMENT ON COLUMN "Profiles"."Certificates" IS 'Newline-separated list of certificates';
COMMENT ON COLUMN "Profiles"."Hobbies"    IS 'User hobbies and interests';


-- ============================================================
--  TABLE 7: ProfileLanguages (Junction Table)
-- ============================================================
CREATE TABLE IF NOT EXISTS "ProfileLanguages" (
    "Id"         SERIAL      PRIMARY KEY,
    "UserId"     INT         NOT NULL
                             REFERENCES "Profiles"("UserId")
                             ON DELETE CASCADE,
    "LanguageId" SMALLINT    NOT NULL
                             REFERENCES "LanguageDicts"("Id")
                             ON DELETE RESTRICT,
    "LevelId"    SMALLINT    NOT NULL
                             REFERENCES "LanguageLevelDict"("Id")
                             ON DELETE RESTRICT,
    UNIQUE ("UserId", "LanguageId")
);

COMMENT ON TABLE  "ProfileLanguages"              IS 'Many-to-many: profile <-> languages with proficiency levels';
COMMENT ON COLUMN "ProfileLanguages"."LanguageId" IS 'FK -> LanguageDicts.Id';
COMMENT ON COLUMN "ProfileLanguages"."LevelId"    IS 'FK -> LanguageLevelDict.Id';


-- ============================================================
--  INDEXES
-- ============================================================

-- GIN indexes for fast querying inside JSONB columns
CREATE INDEX IF NOT EXISTS idx_profiles_experience
    ON "Profiles" USING GIN ("Experience");

CREATE INDEX IF NOT EXISTS idx_profiles_education
    ON "Profiles" USING GIN ("Education");

CREATE INDEX IF NOT EXISTS idx_profiles_skills
    ON "Profiles" USING GIN ("Skills");

-- Fast lookup of profile by URL slug
CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_userurl
    ON "Profiles" ("UserUrl");

-- Fast lookup of active users
CREATE INDEX IF NOT EXISTS idx_users_isactive
    ON "Users" ("IsActive");

-- Fast lookup of all languages for a given profile
CREATE INDEX IF NOT EXISTS idx_profilelanguages_userid
    ON "ProfileLanguages" ("UserId");


-- ============================================================
--  VERIFICATION QUERIES
-- ============================================================

-- Display table row counts
SELECT 'Users'              AS table_name, COUNT(*) AS row_count FROM "Users"
UNION ALL
SELECT 'Secret',                           COUNT(*) FROM "Secret"
UNION ALL
SELECT 'Profiles',                         COUNT(*) FROM "Profiles"
UNION ALL
SELECT 'ProfileLanguages',                 COUNT(*) FROM "ProfileLanguages"
UNION ALL
SELECT 'LanguageDicts',                    COUNT(*) FROM "LanguageDicts"
UNION ALL
SELECT 'LanguageLevelDict',                COUNT(*) FROM "LanguageLevelDict"
UNION ALL
SELECT 'SkillsLevelDict',                  COUNT(*) FROM "SkillsLevelDict"
ORDER BY table_name;


-- ============================================================
--  DEPLOYMENT COMPLETE
-- ============================================================
DO $$ 
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '================================================';
    RAISE NOTICE 'Database deployment completed successfully!';
    RAISE NOTICE '================================================';
    RAISE NOTICE '';
    RAISE NOTICE 'Tables created:';
    RAISE NOTICE '  1. Users (with unique Email and Phone)';
    RAISE NOTICE '  2. Secret (password storage)';
    RAISE NOTICE '  3. LanguageDicts (6 languages)';
    RAISE NOTICE '  4. LanguageLevelDict (5 levels)';
    RAISE NOTICE '  5. SkillsLevelDict (4 levels)';
    RAISE NOTICE '  6. Profiles (resume data)';
    RAISE NOTICE '  7. ProfileLanguages (user languages)';
    RAISE NOTICE '';
    RAISE NOTICE 'Indexes created: 6';
    RAISE NOTICE 'Constraints: Email UNIQUE, Phone UNIQUE';
    RAISE NOTICE '';
    RAISE NOTICE 'Database is ready for production use!';
    RAISE NOTICE '================================================';
END $$;
