# Vercel Deployment Guide

## Quick Deploy (Windows)

### Option 1: PowerShell Script
```powershell
.\deploy-vercel.ps1
```

### Option 2: Batch Script
```cmd
deploy-vercel.bat
```

### Option 3: Manual Commands
```powershell
# Clean install dependencies
npm ci

# Check for issues
npm run check

# Build locally
npm run build

# Deploy to Vercel (requires Vercel CLI)
npx vercel --prod
```

## First Time Setup

1. **Install Vercel CLI** (if not already installed):
   ```
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```
   vercel login
   ```

3. **Link your project** (first deployment):
   ```
   vercel
   ```
   Follow the prompts to link your local project to a Vercel project.

## Configuration Files

- `vercel.json` - Vercel deployment configuration
- `astro.config.mjs` - Astro + Vercel adapter configuration  
- `package.json` - Node.js 18.x engine requirement
- `.nvmrc` - Node version specification

## Key Features

✅ **Zero-fail deployment** - Build tested locally before deploy
✅ **Node.js 18.x** - Matches Vercel serverless runtime
✅ **Vercel adapter** - Optimized for Vercel platform
✅ **Type checking** - Astro check runs before build
✅ **Clean installs** - Deterministic dependency resolution

## Troubleshooting

- **Build fails locally**: Fix issues before deploying
- **Node version mismatch**: Use Node 18.x (see .nvmrc)
- **Missing dependencies**: Run `npm install` to update lockfile
- **Vercel login issues**: Run `vercel logout` then `vercel login`

## Rollback Plan

If deployment fails or has issues:
1. Check Vercel dashboard for error logs
2. Rollback to previous deployment via Vercel dashboard
3. Fix issues locally and redeploy
4. Source of truth is always this repository

