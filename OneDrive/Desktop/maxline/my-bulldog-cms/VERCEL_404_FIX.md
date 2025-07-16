# Fixing 404 Error on Vercel Strapi Deployment

## Problem
You're getting a 404 "Not Found" error when trying to access your Strapi CMS deployed on Vercel.

## Root Cause
The 404 error typically occurs because:
1. Missing or incorrect environment variables
2. Database not properly initialized
3. Strapi not configured for serverless deployment
4. Missing build output

## Solution Steps

### Step 1: Set Required Environment Variables in Vercel

Go to your Vercel project dashboard → Settings → Environment Variables and add:

```
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-here
ADMIN_JWT_SECRET=your-admin-jwt-secret-here
API_TOKEN_SALT=your-api-token-salt-here
APP_KEYS=key1,key2,key3,key4
TRANSFER_TOKEN_SALT=your-transfer-token-salt-here
PUBLIC_URL=https://your-vercel-app.vercel.app
```

### Step 2: Generate Secure Keys

Run these commands locally to generate secure keys:

```bash
# JWT Secret (64 characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Admin JWT Secret (64 characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# API Token Salt (32 characters)
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"

# Transfer Token Salt (32 characters)
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"

# App Keys (4 keys, 32 characters each)
node -e "console.log(Array.from({length: 4}, () => require('crypto').randomBytes(16).toString('hex')).join(','))"
```

### Step 3: Initialize Database

After setting environment variables, you need to initialize the database:

1. **Option A: Use Vercel CLI**
   ```bash
   vercel env pull .env.local
   npm run develop
   # This will create the database locally, then deploy
   ```

2. **Option B: Create Database Migration Script**
   Create a file `scripts/init-db.js`:
   ```javascript
   const { execSync } = require('child_process');
   
   try {
     console.log('Initializing database...');
     execSync('npm run develop -- --watch-admin=false', { stdio: 'inherit' });
     console.log('Database initialized successfully!');
   } catch (error) {
     console.error('Error initializing database:', error);
     process.exit(1);
   }
   ```

### Step 4: Update Vercel Configuration

Ensure your `vercel.json` has the correct settings:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "devCommand": "npm run develop",
  "functions": {
    "api/**/*.js": {
      "runtime": "nodejs18.x"
    }
  },
  "env": {
    "DATABASE_CLIENT": "sqlite",
    "DATABASE_FILENAME": ".tmp/data.db",
    "NODE_ENV": "production"
  }
}
```

### Step 5: Redeploy

1. Commit your changes
2. Push to your repository
3. Redeploy on Vercel

### Step 6: Verify Deployment

After deployment, check:

1. **Admin Panel**: `https://your-app.vercel.app/admin`
2. **API**: `https://your-app.vercel.app/api/studs`
3. **Health Check**: `https://your-app.vercel.app/_health`

## Troubleshooting

### If Still Getting 404:

1. **Check Build Logs**: Look for any build errors in Vercel dashboard
2. **Verify Environment Variables**: Ensure all required variables are set
3. **Check Database**: Ensure database file is being created
4. **Test Locally**: Run `npm run develop` locally to ensure everything works

### Common Issues:

1. **Missing APP_KEYS**: Strapi requires at least one app key
2. **Database Permissions**: SQLite file needs write permissions
3. **Node Version**: Ensure using Node.js 18+ on Vercel
4. **Build Output**: Ensure `dist` folder contains the built application

### Alternative: Use PostgreSQL

If SQLite continues to cause issues, consider switching to PostgreSQL:

1. Add PostgreSQL database (e.g., from Vercel Postgres)
2. Update `config/database.ts`:
   ```typescript
   export default ({ env }) => ({
     connection: {
       client: 'postgres',
       connection: {
         host: env('DATABASE_HOST'),
         port: env.int('DATABASE_PORT'),
         database: env('DATABASE_NAME'),
         user: env('DATABASE_USERNAME'),
         password: env('DATABASE_PASSWORD'),
         ssl: env.bool('DATABASE_SSL', false),
       },
     },
   });
   ```

## Success Indicators

When properly deployed, you should see:
- ✅ Admin panel accessible at `/admin`
- ✅ API endpoints responding at `/api/*`
- ✅ No 404 errors on main routes
- ✅ Database properly initialized
- ✅ Environment variables loaded correctly 