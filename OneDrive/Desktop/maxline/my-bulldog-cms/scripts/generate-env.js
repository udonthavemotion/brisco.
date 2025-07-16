const crypto = require('crypto');

console.log('🔐 Generating Strapi Environment Variables for Vercel Deployment\n');

// Generate JWT Secret (64 characters)
const jwtSecret = crypto.randomBytes(32).toString('hex');
console.log('JWT_SECRET=' + jwtSecret);

// Generate Admin JWT Secret (64 characters)
const adminJwtSecret = crypto.randomBytes(32).toString('hex');
console.log('ADMIN_JWT_SECRET=' + adminJwtSecret);

// Generate API Token Salt (32 characters)
const apiTokenSalt = crypto.randomBytes(16).toString('hex');
console.log('API_TOKEN_SALT=' + apiTokenSalt);

// Generate Transfer Token Salt (32 characters)
const transferTokenSalt = crypto.randomBytes(16).toString('hex');
console.log('TRANSFER_TOKEN_SALT=' + transferTokenSalt);

// Generate App Keys (4 keys, 32 characters each)
const appKeys = Array.from({length: 4}, () => crypto.randomBytes(16).toString('hex')).join(',');
console.log('APP_KEYS=' + appKeys);

console.log('\n📋 Copy these variables to your Vercel Environment Variables:');
console.log('1. Go to your Vercel project dashboard');
console.log('2. Navigate to Settings → Environment Variables');
console.log('3. Add each variable above');
console.log('4. Set DATABASE_CLIENT=sqlite');
console.log('5. Set DATABASE_FILENAME=.tmp/data.db');
console.log('6. Set NODE_ENV=production');
console.log('7. Set PUBLIC_URL=https://your-vercel-app.vercel.app');
console.log('\n🔄 After setting variables, redeploy your application!'); 