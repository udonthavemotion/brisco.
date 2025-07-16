const crypto = require('crypto');

// Generate secure keys for Strapi deployment
console.log('🔑 Generating secure keys for Strapi deployment...\n');

const generateSecret = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

const generateShortSecret = (length = 16) => {
  return crypto.randomBytes(length).toString('hex');
};

// Generate all required keys
const keys = {
  JWT_SECRET: generateSecret(),
  ADMIN_JWT_SECRET: generateSecret(),
  API_TOKEN_SALT: generateShortSecret(),
  TRANSFER_TOKEN_SALT: generateShortSecret(),
  APP_KEYS: [
    generateShortSecret(),
    generateShortSecret(),
    generateShortSecret(),
    generateShortSecret()
  ].join(',')
};

console.log('📝 Copy these environment variables to your Vercel project:');
console.log('===========================================================\n');

console.log('# Database Configuration');
console.log('DATABASE_CLIENT=sqlite');
console.log('DATABASE_FILENAME=.tmp/data.db');
console.log('NODE_ENV=production');
console.log('');

console.log('# Security Keys');
console.log(`JWT_SECRET=${keys.JWT_SECRET}`);
console.log(`ADMIN_JWT_SECRET=${keys.ADMIN_JWT_SECRET}`);
console.log(`API_TOKEN_SALT=${keys.API_TOKEN_SALT}`);
console.log(`TRANSFER_TOKEN_SALT=${keys.TRANSFER_TOKEN_SALT}`);
console.log(`APP_KEYS=${keys.APP_KEYS}`);
console.log('');

console.log('# Server Configuration');
console.log('HOST=0.0.0.0');
console.log('PORT=1337');
console.log('IS_PROXIED=true');
console.log('PUBLIC_URL=https://your-strapi-app.vercel.app');
console.log('');

console.log('# Admin Panel');
console.log('ADMIN_PATH=/admin');
console.log('');

console.log('# CORS (Update with your Astro app URL)');
console.log('CORS_ORIGIN=https://your-astro-app.vercel.app');
console.log('');

console.log('🚀 Next Steps:');
console.log('1. Copy these variables to your Vercel project settings');
console.log('2. Update PUBLIC_URL with your actual Strapi deployment URL');
console.log('3. Update CORS_ORIGIN with your actual Astro app URL');
console.log('4. Deploy your Strapi app to Vercel'); 