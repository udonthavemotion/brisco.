# Vercel Deployment Fix Guide

## Issues Fixed

1. **Missing Vercel Adapter**: Added `@astrojs/vercel/serverless` adapter to `astro.config.mjs`
2. **Environment Variables**: Updated environment variable handling in `strapi.ts`
3. **Build Configuration**: Simplified `vercel.json` configuration
4. **Node.js Version**: Added engine specification in `package.json`

## Deployment Steps

### Step 1: Deploy Strapi CMS First

1. **Navigate to Strapi folder**:
   ```bash
   cd my-bulldog-cms
   ```

2. **Deploy to Vercel**:
   - Create new Vercel project from `my-bulldog-cms` folder
   - Set build command: `npm run build`
   - Set output directory: `dist`
   - Set install command: `npm install`

3. **Configure Strapi Environment Variables**:
   - `DATABASE_CLIENT=sqlite`
   - `DATABASE_FILENAME=.tmp/data.db`
   - `JWT_SECRET=your-jwt-secret-here`
   - `ADMIN_JWT_SECRET=your-admin-jwt-secret-here`
   - `API_TOKEN_SALT=your-api-token-salt-here`
   - `APP_KEYS=your-app-keys-here`

4. **Get Strapi URL**: Note the deployment URL (e.g., `https://your-strapi-app.vercel.app`)

### Step 2: Configure Astro App Environment Variables

1. **In Vercel Dashboard** for your Astro app:
   - Go to Settings → Environment Variables
   - Add the following variables:

   ```
   STRAPI_URL=https://your-strapi-app.vercel.app
   PUBLIC_STRAPI_URL=https://your-strapi-app.vercel.app
   STRAPI_TOKEN=your-strapi-api-token
   PUBLIC_STRAPI_TOKEN=your-strapi-api-token
   ```

2. **Get Strapi API Token**:
   - Go to your Strapi admin panel
   - Navigate to Settings → API Tokens
   - Create a new token with "Full access" permissions
   - Copy the token and add it to Vercel environment variables

### Step 3: Redeploy Astro App

1. **Trigger new deployment** in Vercel dashboard
2. **Monitor build logs** for any remaining issues
3. **Test the site** once deployed

## Troubleshooting

### Common Issues:

1. **Build Fails**: Check that all dependencies are installed
2. **Environment Variables Not Working**: Ensure variables are set in Vercel dashboard
3. **Strapi Connection Fails**: Verify Strapi URL and API token are correct
4. **Images Not Loading**: Check that Strapi media uploads are working

### Development vs Production:

- **Development**: Uses local Strapi instance (`http://localhost:1337`)
- **Production**: Uses deployed Strapi instance (Vercel URL)

## File Changes Made

1. **astro.config.mjs**: Added Vercel adapter and server output
2. **package.json**: Added Node.js engine specification
3. **vercel.json**: Simplified configuration
4. **src/lib/strapi.ts**: Improved environment variable handling
5. **env.example**: Updated with deployment instructions

## Next Steps

1. Deploy Strapi CMS to Vercel
2. Configure environment variables
3. Redeploy Astro app
4. Test all functionality
5. Set up admin panel access 

Perfect! You can use the Strapi console. Here's how to create an API token locally:

### **Step 1: Start Strapi Console**
```bash
cd my-bulldog-cms
npm run console
```

### **Step 2: Create API Token via Console**
Once in the Strapi console, run this command:
```javascript
// Create a new API token
const token = await strapi.plugins['users-permissions'].services.user.createToken({
  name: 'Frontend API Token',
  description: 'Token for frontend access',
  type: 'full-access',
  lifespan: null // Never expires
});

console.log('API Token:', token.accessKey);
```

## **Method 3: Create a Script to Generate API Token**

Let me create a script for you to generate the API token: 