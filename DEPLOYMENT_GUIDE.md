# cPanel Deployment Guide for MyOnlineResume

This guide walks you through deploying the Next.js application to cPanel hosting.

## Prerequisites

- cPanel hosting with Node.js support (18.x or higher)
- PostgreSQL database support
- Email account capability
- Domain: myonlineresume.am

## Phase 1: Build Application (Local)

### 1.1 Install Dependencies
```bash
npm install
```

### 1.2 Build for Production
```bash
npm run build
```

This creates a `.next/standalone` folder with the production build.

### 1.3 Create Deployment Package
```bash
npm run deploy:package
```

This creates `myonlineresume-deploy.zip` containing all necessary files.

---

## Phase 2: Setup PostgreSQL Database (cPanel)

### 2.1 Create Database
1. Login to cPanel
2. Go to **PostgreSQL Databases**
3. Under "Create New Database":
   - Enter name: `myonlineresume`
   - Click "Create Database"
4. **Note the full database name** (may have prefix like `username_myonlineresume`)

### 2.2 Create Database User
1. Scroll to "Add New User"
   - Username: `myonlineresume_user`
   - Generate strong password
   - Click "Create User"
2. **Save username and password securely**

### 2.3 Grant Privileges
1. Scroll to "Add User To Database"
   - User: Select your user
   - Database: Select your database
   - Click "Add"
2. On privileges page:
   - Check "ALL PRIVILEGES"
   - Click "Make Changes"

### 2.4 Import Database Schema
1. Click **phpPgAdmin** in cPanel
2. Login with cPanel credentials
3. Select your database from left sidebar
4. Click "SQL" tab
5. Open `C:\MyProject\MyResumeOnline\DB\COMPLETE_DEPLOYMENT_SCRIPT.sql`
6. Copy entire contents and paste into SQL query box
7. Click "Execute"
8. Verify tables created: Users, Secret, Profiles, etc.

**Save these credentials:**
```
Database Host: localhost
Database Port: 5432
Database Name: [from step 2.1]
Database User: [from step 2.2]
Database Password: [from step 2.2]
```

---

## Phase 3: Setup SMTP Email (cPanel)

### 3.1 Create Email Account
1. Go to **Email Accounts**
2. Click "Create"
3. Fill in:
   - Email: `noreply`
   - Domain: `myonlineresume.am`
   - Password: Generate strong password
   - Storage: 250 MB
4. Click "Create"

### 3.2 Get SMTP Settings
1. Find `noreply@myonlineresume.am` in email list
2. Click "Connect Devices"
3. Note the SMTP settings:
   - Host: Usually `mail.myonlineresume.am`
   - Port: 465 (SSL) or 587 (TLS)
   - Username: `noreply@myonlineresume.am`
   - Password: [from step 3.1]

**Save these credentials:**
```
SMTP Host: [from step 3.2]
SMTP Port: 465 or 587
SMTP User: noreply@myonlineresume.am
SMTP Password: [from step 3.1]
```

---

## Phase 4: Upload Application (cPanel)

### 4.1 Prepare Directory
1. Go to **File Manager**
2. Navigate to `/home/[username]/`
3. Create folder: `myonlineresume.am` (if not exists)
4. Enter the folder

### 4.2 Upload Files
1. Click "Upload"
2. Select `myonlineresume-deploy.zip`
3. Wait for upload to complete
4. Right-click ZIP → "Extract"
5. Delete ZIP file after extraction

### 4.3 Verify Structure
You should see:
```
/home/[username]/myonlineresume.am/
├── server.js
├── package.json
├── .next/
├── public/
└── node_modules/
```

---

## Phase 5: Configure Node.js App (cPanel)

### 5.1 Create Application
1. Go to **Setup Node.js App**
2. Click "Create Application"
3. Fill in:
   - **Node.js version:** 18.x or higher
   - **Application mode:** Production
   - **Application root:** `/home/[username]/myonlineresume.am`
   - **Application URL:** Leave blank or `myonlineresume.am`
   - **Application startup file:** `server.js`
4. Click "Create"

### 5.2 Set Environment Variables
In the Node.js App page, add these environment variables:

```
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=[your database name from Phase 2]
DATABASE_USER=[your database user from Phase 2]
DATABASE_PASSWORD=[your database password from Phase 2]

SMTP_HOST=[your SMTP host from Phase 3]
SMTP_PORT=[465 or 587 from Phase 3]
SMTP_USER=noreply@myonlineresume.am
SMTP_PASS=[your email password from Phase 3]

NEXT_PUBLIC_BASE_URL=https://myonlineresume.am
NODE_ENV=production
```

Click "Save" after adding all variables.

### 5.3 Install Dependencies
1. Click "Run NPM Install"
2. Wait 2-5 minutes for completion
3. Check for success message

### 5.4 Start Application
1. Click "Start Application" or "Restart"
2. Wait for status: "Running"
3. Note the application URL

---

## Phase 6: SSL Certificate (cPanel)

### 6.1 Install SSL
1. Go to **SSL/TLS Status**
2. Find `myonlineresume.am`
3. Click "Run AutoSSL"
4. Wait for completion

### 6.2 Verify HTTPS
Visit: `https://myonlineresume.am`

---

## Phase 7: Testing

Test these features:
1. ✅ Homepage loads
2. ✅ Sign up new account
3. ✅ Sign in with account
4. ✅ Forgot password (check email)
5. ✅ Profile editing
6. ✅ Change password
7. ✅ Public profile view

---

## Troubleshooting

### Database Connection Fails
- Verify DATABASE_* environment variables match Phase 2 credentials
- Check database user has ALL PRIVILEGES
- Verify database tables were created in phpPgAdmin

### Email Not Sending
- Verify SMTP_* environment variables match Phase 3 credentials
- Check port 465 or 587 is not blocked by hosting
- Test email account in webmail

### Application Won't Start
- Check Node.js app logs in cPanel
- Verify server.js exists in application root
- Ensure npm install completed successfully
- Check Node.js version is 18.x or higher

### 502 Bad Gateway
- Restart Node.js application in cPanel
- Check application logs for errors
- Verify application root path is correct

---

## Updating Application

When you make changes:
1. Pull latest code locally
2. Run `npm run build`
3. Run `npm run deploy:package`
4. Upload new ZIP to cPanel
5. Extract (overwrite existing files)
6. Restart Node.js application

---

## Support

For issues:
- Check cPanel error logs
- Check Node.js application logs
- Review environment variables
- Verify database connection
- Test SMTP settings
