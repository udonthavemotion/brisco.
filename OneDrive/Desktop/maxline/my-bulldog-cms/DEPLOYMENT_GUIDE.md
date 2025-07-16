# Strapi CMS Deployment Guide for Vercel

## Prerequisites

1. Vercel account
2. Node.js 18+ installed locally
3. Git repository set up

## Step 1: Prepare Strapi for Deployment

### Environment Variables Required

Add these to your Vercel project environment variables:

```bash
# Database
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db

# Security (generate secure random strings)
JWT_SECRET=your-32-character-jwt-secret
ADMIN_JWT_SECRET=your-32-character-admin-jwt-secret
API_TOKEN_SALT=your-32-character-api-token-salt
APP_KEYS=key1,key2,key3,key4

# Server
HOST=0.0.0.0
PORT=1337

# Admin Panel
ADMIN_PATH=/admin

# CORS (update with your Astro app URL)
CORS_ORIGIN=https://your-astro-app.vercel.app
```

### Generate Secure Keys

Use this command to generate secure random strings:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Step 2: Deploy to Vercel

1. **Connect Repository**:
   - Go to Vercel dashboard
   - Import your repository
   - Select the `my-bulldog-cms` folder

2. **Configure Build Settings**:
   - Framework Preset: Node.js
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Add Environment Variables**:
   - Copy all variables from Step 1
   - Add them in Vercel project settings

4. **Deploy**:
   - Click "Deploy"
   - Wait for build to complete

## Step 3: Set Up Admin Panel

1. **Access Admin Panel**:
   - Go to `https://your-strapi-app.vercel.app/admin`
   - Create your first admin user

2. **Create API Token**:
   - Go to Settings → API Tokens
   - Create new token with "Full access"
   - Copy the token for Astro app

3. **Add Content**:
   - Create Studs collection entries
   - Create Puppies collection entries
   - Upload images

## Step 4: Configure Astro App

1. **Update Environment Variables** in your Astro app:
   ```
   STRAPI_URL=https://your-strapi-app.vercel.app
   PUBLIC_STRAPI_URL=https://your-strapi-app.vercel.app
   STRAPI_TOKEN=your-strapi-api-token
   PUBLIC_STRAPI_TOKEN=your-strapi-api-token
   ```

2. **Redeploy Astro App**:
   - Trigger new deployment
   - Test functionality

## Troubleshooting

### Common Issues:

1. **Build Fails**: Check Node.js version (must be 18+)
2. **Database Errors**: Ensure SQLite is properly configured
3. **CORS Errors**: Update CORS_ORIGIN with correct Astro app URL
4. **Admin Panel Not Loading**: Check ADMIN_PATH configuration

### Development vs Production:

- **Local**: Uses `http://localhost:1337`
- **Production**: Uses Vercel deployment URL

## File Structure

```
my-bulldog-cms/
├── config/
│   ├── database.ts (SQLite configuration)
│   └── server.ts (Server settings)
├── src/
│   └── api/ (Content types)
├── vercel.json (Vercel configuration)
└── package.json (Dependencies)
```

## Next Steps

1. Deploy Strapi successfully
2. Set up admin panel
3. Add content (studs, puppies)
4. Configure Astro app
5. Test full functionality 