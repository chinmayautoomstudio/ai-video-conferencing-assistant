# 🚀 Netlify Git-Based Deployment Guide

## 🎯 **Problem Identified**

You're currently manually uploading the `dist` folder to Netlify, which means:
- ❌ Environment variables aren't injected during build
- ❌ Supabase client fails to initialize
- ❌ App falls back to mock client
- ❌ No real database functionality

## ✅ **Solution: Git-Based Deployment**

Switch to Git-based deployment so Netlify can:
- ✅ Inject environment variables during build
- ✅ Run `vite build` with proper environment
- ✅ Create production-ready build with real Supabase

## 📋 **Step-by-Step Setup**

### **Step 1: Push Code to GitHub**

1. **Initialize Git** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Create GitHub Repository**:
   - Go to GitHub.com
   - Create new repository: `ai-video-conference`
   - Don't initialize with README (we have files already)

3. **Push to GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/ai-video-conference.git
   git branch -M main
   git push -u origin main
   ```

### **Step 2: Connect Netlify to GitHub**

1. **Go to Netlify Dashboard**
2. **Click "New site from Git"**
3. **Choose "GitHub"**
4. **Select your repository**: `ai-video-conference`
5. **Configure build settings**:
   - **Build command**: `cd web && npm run build`
   - **Publish directory**: `web/dist`
   - **Node version**: `18`

### **Step 3: Set Environment Variables in Netlify**

1. **Go to Site Settings > Environment Variables**
2. **Add these variables** (you already have them):
   ```
   VITE_SUPABASE_URL = https://jkonlgbqvqxrazwsptxo.supabase.co
   VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imprb25sZ2JxdnF4cmF6d3NwdHhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0OTc1MTIsImV4cCI6MjA3NTA3MzUxMn0.rh-bP1FNvhOqIZawoB-r9rBKXTrBi9pjYbWif_qZqnc
   ```

### **Step 4: Deploy**

1. **Click "Deploy site"**
2. **Netlify will**:
   - Clone your repository
   - Install dependencies (`npm install`)
   - Run build command (`cd web && npm run build`)
   - Inject environment variables during build
   - Deploy the built files

## 🎯 **Expected Results**

### **✅ Build Logs (Success):**
```
8:47:20 PM: Build ready to start
8:47:21 PM: build-image version: 4.0.2
8:47:21 PM: build-image tag: v4.0.2
8:47:21 PM: buildbot version: 4.0.2
8:47:21 PM: Fetching cached dependencies
8:47:22 PM: Starting to install dependencies
8:47:22 PM: Restoring node modules
8:47:23 PM: Finished restoring cached dependencies
8:47:23 PM: Installing NPM packages using NPM version 9.6.7
8:47:25 PM: Finished installing dependencies
8:47:25 PM: NPM packages installed
8:47:25 PM: Started restoring cached go cache
8:47:25 PM: Finished restoring cached go cache
8:47:25 PM: No cached directories were found
8:47:25 PM: Started building site
8:47:25 PM: Running build command: cd web && npm run build
8:47:26 PM: > video-conference-web@1.0.0 build
8:47:26 PM: > tsc && vite build
8:47:28 PM: ✓ 1494 modules transformed.
8:47:28 PM: rendering chunks...
8:47:28 PM: computing gzip size...
8:47:28 PM: dist/registerSW.js                0.13 kB
8:47:28 PM: dist/manifest.webmanifest         0.41 kB
8:47:28 PM: dist/index.html                   0.76 kB │ gzip:   0.42 kB
8:47:28 PM: dist/assets/index-ae98f339.css   33.52 kB │ gzip:   5.73 kB
8:47:28 PM: dist/assets/index-d6d0785e.js   409.38 kB │ gzip: 118.68 kB
8:47:28 PM: PWA v0.17.5
8:47:28 PM: mode      generateSW
8:47:28 PM: precache  5 entries (433.83 KiB)
8:47:28 PM: files generated
8:47:28 PM:   dist\sw.js
8:47:28 PM:   dist\workbox-5ffe50d4.js
8:47:28 PM: ✓ built in 5.41s
8:47:28 PM: Finished building site
8:47:28 PM: Starting to deploy site
8:47:29 PM: Creating deploy tree
8:47:29 PM: Creating deploy records
8:47:29 PM: Deploy log
8:47:29 PM: Site is live
```

### **✅ Console Logs (Real Supabase):**
```
🔧 [DEBUG] Creating Supabase client with URL: https://jkonlgbqvqxrazwsptxo.supabase.co
🔧 [DEBUG] Creating Supabase client with Key (first 20 chars): eyJhbGciOiJIUzI1NiIs...
✅ Supabase client created successfully
✅ Supabase client test query successful: {data: [...], error: null}
🔧 [DEBUG] ===== INITIALIZING SUPABASE MEETING =====
🔧 [DEBUG] ✅ Meeting initialization complete!
```

## 🧪 **Testing After Git Deployment**

### **Test 1: Environment Variables**
1. **Check Console**: Should see "✅ Supabase client created successfully"
2. **No Mock Client**: Should NOT see "⚠️ Using mock client"
3. **Real Database**: Should see actual database operations

### **Test 2: Cross-Device Communication**
1. **Desktop**: Create meeting
2. **Mobile**: Join same meeting ID
3. **Expected**: Both users can see and hear each other

### **Test 3: Meeting Cleanup**
1. **Host**: Create meeting and leave
2. **Check Database**: Meeting `is_active = false`
3. **Expected**: Proper meeting lifecycle

## 🎉 **Benefits of Git Deployment**

### **Automatic Builds:**
- ✅ **Push to Deploy**: Every git push triggers new deployment
- ✅ **Environment Variables**: Properly injected during build
- ✅ **Real Supabase**: Full database functionality
- ✅ **No Manual Upload**: Automated deployment process

### **Better Development:**
- ✅ **Version Control**: Track all changes
- ✅ **Rollback**: Easy to revert to previous versions
- ✅ **Branch Deploys**: Test different versions
- ✅ **CI/CD**: Automated testing and deployment

## 📋 **Next Steps**

1. **Push code to GitHub** (if not already done)
2. **Connect Netlify to GitHub repository**
3. **Set build settings** in Netlify
4. **Deploy and test** the live site
5. **Verify Supabase functionality** works properly

**Once you switch to Git deployment, the environment variables will be properly injected and Supabase will work correctly!** 🚀

## 🔧 **Alternative: Local Build with .env**

If you prefer to keep manual deployment:

1. **Create `.env` file** in `web/` directory:
   ```
   VITE_SUPABASE_URL=https://jkonlgbqvqxrazwsptxo.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imprb25sZ2JxdnF4cmF6d3NwdHhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0OTc1MTIsImV4cCI6MjA3NTA3MzUxMn0.rh-bP1FNvhOqIZawoB-r9rBKXTrBi9pjYbWif_qZqnc
   ```

2. **Rebuild locally**:
   ```bash
   cd web
   npm run build
   ```

3. **Upload new dist folder** to Netlify

**But Git deployment is the recommended approach!** 🎯
