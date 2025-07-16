#!/bin/bash

# Maxline Bulldogs Deployment Script
# This script helps deploy both Strapi CMS and Astro frontend to Vercel

echo "🚀 Maxline Bulldogs Deployment Script"
echo "====================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Function to generate secure random string
generate_secret() {
    node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
}

echo ""
echo "📋 Deployment Checklist:"
echo "========================"
echo ""
echo "1. Deploy Strapi CMS (my-bulldog-cms/)"
echo "2. Get Strapi deployment URL"
echo "3. Create API token in Strapi admin"
echo "4. Deploy Astro frontend (astroship-main 2/)"
echo "5. Configure environment variables"
echo ""

# Generate secure keys for Strapi
echo "🔑 Generating secure keys for Strapi..."
JWT_SECRET=$(generate_secret)
ADMIN_JWT_SECRET=$(generate_secret)
API_TOKEN_SALT=$(generate_secret)
APP_KEY1=$(generate_secret | cut -c1-16)
APP_KEY2=$(generate_secret | cut -c1-16)
APP_KEY3=$(generate_secret | cut -c1-16)
APP_KEY4=$(generate_secret | cut -c1-16)

echo ""
echo "📝 Strapi Environment Variables:"
echo "================================"
echo "DATABASE_CLIENT=sqlite"
echo "DATABASE_FILENAME=.tmp/data.db"
echo "JWT_SECRET=$JWT_SECRET"
echo "ADMIN_JWT_SECRET=$ADMIN_JWT_SECRET"
echo "API_TOKEN_SALT=$API_TOKEN_SALT"
echo "APP_KEYS=$APP_KEY1,$APP_KEY2,$APP_KEY3,$APP_KEY4"
echo "HOST=0.0.0.0"
echo "PORT=1337"
echo "ADMIN_PATH=/admin"
echo "CORS_ORIGIN=https://your-astro-app.vercel.app"
echo ""

echo "📋 Next Steps:"
echo "=============="
echo ""
echo "1. Deploy Strapi CMS to Vercel:"
echo "   - Go to Vercel dashboard"
echo "   - Import repository"
echo "   - Select 'my-bulldog-cms' folder"
echo "   - Add the environment variables above"
echo "   - Deploy"
echo ""
echo "2. After Strapi deployment:"
echo "   - Go to https://your-strapi-app.vercel.app/admin"
echo "   - Create admin account"
echo "   - Go to Settings → API Tokens"
echo "   - Create new token with 'Full access'"
echo "   - Copy the token"
echo ""
echo "3. Deploy Astro frontend:"
echo "   - Go to Vercel dashboard"
echo "   - Import repository"
echo "   - Select 'astroship-main 2' folder"
echo "   - Add environment variables:"
echo "     STRAPI_URL=https://your-strapi-app.vercel.app"
echo "     PUBLIC_STRAPI_URL=https://your-strapi-app.vercel.app"
echo "     STRAPI_TOKEN=your-strapi-api-token"
echo "     PUBLIC_STRAPI_TOKEN=your-strapi-api-token"
echo "   - Deploy"
echo ""
echo "📚 For detailed instructions, see:"
echo "- my-bulldog-cms/DEPLOYMENT_GUIDE.md"
echo "- astroship-main 2/VERCEL_DEPLOYMENT_GUIDE.md"
echo ""

echo "✅ Deployment script completed!"
echo "🎯 Follow the steps above to deploy your application." 