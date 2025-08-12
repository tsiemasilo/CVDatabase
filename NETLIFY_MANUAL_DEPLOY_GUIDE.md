# Manual Netlify Deployment Guide - Fix Version History 404 Errors

## Issue
Production site https://cvdatabase.netlify.app/ showing 404 errors for version history API endpoints.

## Root Cause
Netlify needs to redeploy with the updated `netlify/functions/api.js` file that now includes all missing API routes.

## Manual Solution Steps

### Option 1: Trigger Redeploy via Netlify Dashboard
1. Go to https://app.netlify.com
2. Log into your account
3. Find your `cvdatabase` site
4. Go to **Site settings** → **Build & deploy**
5. Click **Trigger deploy** → **Deploy site**
6. Wait 2-3 minutes for deployment to complete

### Option 2: Force Push to GitHub
1. Make any small change to trigger auto-deployment
2. The latest code is already in GitHub with all fixes

### Option 3: Check Build Logs
If deployment fails:
1. Go to **Site settings** → **Functions**  
2. Check if `api` function is listed and deployed
3. Look at **Site settings** → **Build & deploy** → **Deploy log**
4. Look for any build errors

## What Was Fixed
✅ **Database**: Added `version_history` table with proper indexes
✅ **API Routes**: Added all missing endpoints to `netlify/functions/api.js`:
   - `/api/version-history`
   - `/api/version-history/:tableName/:recordId`
   - `/api/qualifications/*`
   - `/api/positions-roles/*`
   - `/api/tenders/*`
✅ **Redirects**: Updated `netlify.toml` for better routing

## Verification After Deployment
1. Open https://cvdatabase.netlify.app/
2. Login with admin credentials
3. Click "Version History" on any CV record
4. Both tabs should load without 404 errors
5. Browser console should show no API errors

## Expected Result
- No more 404 errors for `/api/version-history*` endpoints
- Version History modal loads properly with animated interactions
- All features work identically to development environment

## Troubleshooting
If still getting 404s after deployment:
1. Check browser cache - try hard refresh (Ctrl+Shift+R)
2. Verify deployment completed in Netlify dashboard
3. Check Netlify function logs for any runtime errors
4. Ensure DATABASE_URL environment variable is set correctly

The database is already properly configured - only the API deployment is needed.