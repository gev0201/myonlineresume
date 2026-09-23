# cPanel Deployment Guide

## Prerequisites
- cPanel with Node.js 22+ support
- PostgreSQL database
- SMTP email account

## Deployment Steps

### 1. Build Application Locally
```bash
npm run build
```

### 2. Create Deployment Package
After build completes, package these files:
- `.next/standalone/myonlineresume/*` (all contents)
- `public/` folder
- `.next/static/` folder

### 3. Upload to cPanel
1. Upload and extract files to `/home/username/myonlineresume.am/`
2. **IMPORTANT:** Create `_next` folder and copy `.next/static/` into it:
   ```
   /myonlineresume.am/
   ├── .next/           (server files)
   │   └── static/
   ├── _next/           (browser static files - REQUIRED!)
   │   └── static/      (copy from .next/static/)
   ├── public/
   ├── server.js
   └── package.json
   ```

### 4. Configure Node.js App
1. Go to cPanel → Setup Node.js App
2. Create application:
   - Node.js version: 22+
   - Application root: `myonlineresume.am`
   - Startup file: `server.js`
3. Add environment variables (see below)
4. Delete `node_modules` folder if exists
5. Click "Run NPM Install"
6. Click "Restart"

### 5. Environment Variables
```
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=your_db_name
DATABASE_USER=your_db_user
DATABASE_PASSWORD=your_db_password

SMTP_HOST=mail.yourdomain.com
SMTP_PORT=465
SMTP_USER=noreply@yourdomain.com
SMTP_PASS=your_smtp_password

NEXT_PUBLIC_BASE_URL=https://yourdomain.com
NODE_ENV=production
```

## Critical: _next Folder

**Why it's needed:**
- Next.js generates URLs like `/_next/static/...` (with underscore)
- Standalone build creates `.next/static/` (with dot)
- Browsers look for `/_next/` but files are in `/.next/`
- Solution: Copy `.next/static/` to `_next/static/`

**For Future Updates:**
After each `npm run build`, remember to:
1. Copy `.next/static/` to `_next/static/` on the server
2. Or include this in your deployment script

## Troubleshooting

### CSS Not Loading
- Verify `_next/static/` folder exists
- Check browser console for 404 errors on `/_next/static/` files

### 500 Error
- Check Node.js app logs in cPanel
- Verify `.next` folder exists (don't rename it!)
- Ensure environment variables are set

### Database Connection Failed
- Verify DATABASE_* credentials
- Check PostgreSQL is running
- Ensure user has ALL PRIVILEGES

### Email Not Sending
- Verify SMTP_* credentials
- Check port 465 is not blocked
- Test email account in webmail

## Notes
- Node.js 22+ required for Next.js 16.2.6
- CloudLinux manages `node_modules` via symlink (don't upload it)
- Always restart app after changes
