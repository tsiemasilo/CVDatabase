# Netlify Deployment Guide

## Environment Variables Setup

In your Netlify dashboard, set these environment variables:

### Required Variables
```
NETLIFY_DATABASE_URL = postgresql://neondb_owner:npg_JRUe57kuOgLz@ep-lucky-recipe-aes0pb5o-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require

SESSION_SECRET = your-secure-session-secret-here
```

### Optional Variables (for development)
```
NODE_ENV = production
```

## Deployment Steps

### 1. Connect Repository
1. Go to [Netlify Dashboard](https://app.netlify.com/)
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub and select: `tsiemasilo/CVDatabase`

### 2. Build Settings
Netlify will auto-detect settings from `netlify.toml`, but verify:
- **Build command**: `npm run build`
- **Publish directory**: `dist/public`
- **Functions directory**: `netlify/functions`

### 3. Environment Variables
In Site Settings → Environment Variables, add:
- `NETLIFY_DATABASE_URL` (your Neon connection string)
- `SESSION_SECRET` (generate a secure random string)

### 4. Deploy
Click "Deploy site" - Netlify will automatically build and deploy.

## Architecture for Netlify

### Frontend (Static)
- React app builds to `dist/public`
- Served as static files by Netlify CDN
- Optimized for performance and SEO

### Backend (Serverless Functions)
- Express API routes converted to Netlify Functions
- Handles authentication, CV management, database operations
- Scales automatically with traffic

### Database
- Neon PostgreSQL (serverless)
- Persistent data storage
- Global edge locations for low latency

## Features Available
✅ Full CV management system
✅ Role-based authentication (Admin/Manager/User)  
✅ Database persistence with Neon
✅ Professional Alteram branding
✅ Responsive design for all devices
✅ Search, filtering, and export functionality

## Test Accounts
After deployment, log in with:
- **Admin**: admin/admin1 (Full access)
- **Manager**: mng/mng1 (CV management + user profiles)
- **User**: user/user1 (Capture records only)

## Benefits of Netlify Deployment
- **Global CDN**: Fast loading worldwide
- **HTTPS**: Automatic SSL certificates
- **Scalability**: Handles traffic spikes automatically
- **Monitoring**: Built-in analytics and performance metrics
- **Custom Domain**: Easy domain setup and management

Your CV Database will be live at: `https://your-site-name.netlify.app`